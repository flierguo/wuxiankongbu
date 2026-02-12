/**
 * BUFF伤害系统
 * 功能：给怪物添加持续伤害BUFF，支持分组、类型、间隔、持续时间等配置
 */

import { js_number, js_war } from "../全局脚本[公共单元]/utils/计算方法";
import { 实时扣血, 攻击飘血, 血量显示 } from "./字符计算";
import { S变量_怪物 } from "../data/const";
import { CheckBuffGroupID } from "./自定义函数";

// #region 类型定义

/**
 * BUFF类型枚举
 */
export enum BuffDamageType {
    固定伤害 = 1,      // 固定数值伤害
    百分比伤害 = 2,    // 基于怪物最大血量的百分比伤害
    攻击力伤害 = 3,    // 基于施法者攻击力的伤害
}

/**
 * BUFF伤害配置接口
 */
export interface BuffDamageConfig {
    /** BUFF分组ID - 同组BUFF一个怪物只有一个，后上的会替换先上的 */
    buffGroupID: number;
    
    /** BUFF类型 - 不同类型的伤害计算方式 */
    buffType: BuffDamageType;
    
    /** BUFF伤害值 - 根据类型不同，含义不同 */
    damage: string;
    
    /** BUFF伤害间隔（毫秒） */
    damageInterval: number;
    
    /** BUFF持续时间（毫秒） */
    duration: number;
    
    /** 可选：BUFF名称（用于日志） */
    buffName?: string;
}

/**
 * 怪物BUFF信息接口
 */
interface MonsterBuffInfo {
    /** 施法者玩家ID */
    casterPlayerID: number;
    
    /** 施法者玩家名称 */
    casterName: string;
    
    /** BUFF配置 */
    config: BuffDamageConfig;
    
    /** BUFF开始时间 */
    startTime: number;
    
    /** 下次伤害时间 */
    nextDamageTime: number;
    
    /** BUFF结束时间 */
    endTime: number;
}

// #endregion

// #region 全局存储

/**
 * 怪物BUFF信息存储
 * 格式: GameLib.R.怪物BUFF信息[怪物Handle] = MonsterBuffInfo
 */
declare global {
    namespace GameLib {
        interface R {
            怪物BUFF信息?: { [monsterHandle: string]: MonsterBuffInfo };
        }
    }
}

// 初始化全局存储
if (!GameLib.R) {
    GameLib.R = {};
}
if (!GameLib.R.怪物BUFF信息) {
    GameLib.R.怪物BUFF信息 = {};
}

// #endregion

// #region 工具函数

/**
 * 获取怪物的归属玩家
 */
function 获取怪物归属玩家(monster: TActor): TPlayObject | null {
    if (monster.IsPlayer()) {
        return null;
    }
    
    const 归属人Handle = monster.GetSVar(S变量_怪物.归属人);
    if (!归属人Handle || 归属人Handle === '0' || 归属人Handle === '') {
        return null;
    }
    
    try {
        const 归属玩家 = GameLib.GetActorByHandle(Number(归属人Handle)) as TPlayObject;
        if (归属玩家 && 归属玩家.IsPlayer()) {
            return 归属玩家;
        }
    } catch (e) {
        console.log(`获取怪物归属玩家失败: ${e}`);
    }
    
    return null;
}

/**
 * 检查是否可以给怪物上BUFF（归属检查）
 */
function 检查归属权限(caster: TPlayObject, monster: TActor): boolean {
    // 如果施法者的归属开关为FALSE，则允许
    if (!caster.V.归属) {
        return true;
    }
    
    // 如果怪物没有归属，允许
    const 归属玩家 = 获取怪物归属玩家(monster);
    if (!归属玩家) {
        return true;
    }
    
    // 如果归属玩家就是施法者，允许
    if (归属玩家.PlayerID === caster.PlayerID) {
        return true;
    }
    
    // 如果归属玩家不是施法者，不允许
    return false;
}

/**
 * 移除怪物的BUFF（同组替换时使用）
 */
function 移除怪物BUFF(monster: TActor, buffGroupID: number): void {
    const 怪物Handle = `${monster.Handle}`;
    const buffInfo = GameLib.R.怪物BUFF信息?.[怪物Handle];
    
    if (buffInfo && buffInfo.config.buffGroupID === buffGroupID) {
        delete GameLib.R.怪物BUFF信息[怪物Handle];
    }
}

/**
 * 计算BUFF伤害
 */
function 计算BUFF伤害(
    monster: TActor,
    caster: TPlayObject,
    config: BuffDamageConfig
): string {
    let 伤害值 = '0';
    
    switch (config.buffType) {
        case BuffDamageType.固定伤害:
            // 固定伤害，直接使用配置的伤害值
            伤害值 = config.damage;
            break;
            
        case BuffDamageType.百分比伤害:
            // 百分比伤害：基于怪物最大血量
            const 最大血量 = monster.GetSVar(92); // 最大血量
            if (js_war(最大血量, '0') > 0) {
                const 百分比 = Number(config.damage) || 0;
                if (百分比 > 0 && 百分比 <= 100) {
                    // 计算百分比伤害：最大血量 * (百分比 / 100)
                    伤害值 = js_number(最大血量, String(百分比 / 100), 3);
                }
            }
            break;
            
        case BuffDamageType.攻击力伤害:
            // 攻击力伤害：基于施法者的攻击力
            if (caster.R && caster.R.自定属性) {
                const 攻击力 = caster.R.自定属性[caster.Job + 161] || '0';
                if (js_war(攻击力, '0') > 0) {
                    // 计算攻击力伤害：攻击力 * (伤害值作为倍率)
                    const 倍率 = config.damage || '1';
                    伤害值 = js_number(攻击力, 倍率, 3);
                }
            }
            break;
    }
    
    // 确保伤害值有效
    if (!伤害值 || 伤害值 === 'NaN' || 伤害值 === 'Infinity' || js_war(伤害值, '0') <= 0) {
        伤害值 = '1'; // 最小伤害
    }
    
    return 伤害值;
}

// #endregion

// #region 核心函数

/**
 * 给怪物添加BUFF伤害
 * @param caster 施法者（玩家）
 * @param monster 目标怪物
 * @param config BUFF配置
 * @returns 是否成功添加BUFF
 */
export function 添加BUFF伤害(
    caster: TPlayObject,
    monster: TActor,
    config: BuffDamageConfig
): boolean {
    // 参数验证
    if (!caster || !monster || !config) {
        console.log(`[BUFF伤害] 参数错误`);
        return false;
    }
    
    // 只能给怪物上BUFF
    if (monster.IsPlayer()) {
        return false;
    }
    
    // 检查怪物是否已死亡
    if (monster.GetDeath()) {
        return false;
    }
    
    // 检查归属权限
    if (!检查归属权限(caster, monster)) {
        // 归属检查失败，不允许上BUFF
        return false;
    }
    
    const 怪物Handle = `${monster.Handle}`;
    const 当前时间 = GameLib.TickCount;
    
    // 检查是否已有同组BUFF
    const 现有BUFF = GameLib.R.怪物BUFF信息?.[怪物Handle];
    if (现有BUFF && 现有BUFF.config.buffGroupID === config.buffGroupID) {
        // 同组BUFF，移除旧的
        移除怪物BUFF(monster, config.buffGroupID);
    }
    
    // 创建新的BUFF信息
    const buffInfo: MonsterBuffInfo = {
        casterPlayerID: caster.PlayerID,
        casterName: caster.Name,
        config: config,
        startTime: 当前时间,
        nextDamageTime: 当前时间 + config.damageInterval,
        endTime: 当前时间 + config.duration
    };
    
    // 存储BUFF信息
    GameLib.R.怪物BUFF信息[怪物Handle] = buffInfo;
    
    // 立即造成第一次伤害（可选，如果需要立即伤害的话）
    // 执行BUFF伤害(monster, buffInfo);
    
    return true;
}

/**
 * 执行BUFF伤害（内部函数，由定时器调用）
 */
function 执行BUFF伤害(monster: TActor, buffInfo: MonsterBuffInfo): void {
    // 检查怪物是否还存在
    if (!monster || monster.GetDeath()) {
        // 怪物已死亡，清理BUFF
        const 怪物Handle = `${monster.Handle}`;
        if (GameLib.R.怪物BUFF信息?.[怪物Handle]) {
            delete GameLib.R.怪物BUFF信息[怪物Handle];
        }
        return;
    }
    
    // 获取施法者
    let caster: TPlayObject | null = null;
    try {
        caster = GameLib.GetActorByHandle(buffInfo.casterPlayerID) as TPlayObject;
        if (!caster || !caster.IsPlayer()) {
            caster = null;
        }
    } catch (e) {
        // 施法者已离线，使用存储的信息继续造成伤害
    }
    
    // 计算伤害
    let 伤害值 = '0';
    if (caster) {
        伤害值 = 计算BUFF伤害(monster, caster, buffInfo.config);
    } else {
        // 施法者离线，如果是固定伤害类型，仍然可以造成伤害
        if (buffInfo.config.buffType === BuffDamageType.固定伤害) {
            伤害值 = buffInfo.config.damage;
        } else {
            // 其他类型需要施法者信息，无法计算，移除BUFF
            const 怪物Handle = `${monster.Handle}`;
            if (GameLib.R.怪物BUFF信息?.[怪物Handle]) {
                delete GameLib.R.怪物BUFF信息[怪物Handle];
            }
            return;
        }
    }
    
    // 确保伤害值有效
    if (js_war(伤害值, '0') <= 0) {
        伤害值 = '1';
    }
    
    // 应用伤害
    const 当前血量 = monster.GetSVar(91);
    if (js_war(当前血量, 伤害值) > 0) {
        // 怪物还有血量，造成伤害
        实时扣血(caster || monster, monster, 伤害值);
    } else {
        // 怪物血量不足，造成致死伤害
        实时扣血(caster || monster, monster, 当前血量);
    }
}

/**
 * BUFF系统更新函数（需要在定时器中调用）
 * 建议在RobotManageNpc或TimeManageNpc中每100-500毫秒调用一次
 */
export function 更新BUFF系统(): void {
    if (!GameLib.R.怪物BUFF信息) {
        return;
    }
    
    const 当前时间 = GameLib.TickCount;
    const 需要清理的怪物: string[] = [];
    
    // 遍历所有怪物的BUFF
    for (const 怪物Handle in GameLib.R.怪物BUFF信息) {
        const buffInfo = GameLib.R.怪物BUFF信息[怪物Handle];
        
        // 检查BUFF是否已过期
        if (当前时间 >= buffInfo.endTime) {
            需要清理的怪物.push(怪物Handle);
            continue;
        }
        
        // 检查是否到了伤害时间
        if (当前时间 >= buffInfo.nextDamageTime) {
            // 获取怪物对象
            try {
                const monster = GameLib.GetActorByHandle(Number(怪物Handle)) as TActor;
                if (monster && !monster.GetDeath()) {
                    // 执行伤害
                    执行BUFF伤害(monster, buffInfo);
                    
                    // 更新下次伤害时间
                    buffInfo.nextDamageTime = 当前时间 + buffInfo.config.damageInterval;
                } else {
                    // 怪物不存在或已死亡，标记清理
                    需要清理的怪物.push(怪物Handle);
                }
            } catch (e) {
                // 怪物不存在，标记清理
                需要清理的怪物.push(怪物Handle);
            }
        }
    }
    
    // 清理过期的BUFF
    for (const 怪物Handle of 需要清理的怪物) {
        delete GameLib.R.怪物BUFF信息[怪物Handle];
    }
}

/**
 * 移除指定怪物的所有BUFF
 */
export function 移除怪物所有BUFF(monster: TActor): void {
    const 怪物Handle = `${monster.Handle}`;
    if (GameLib.R.怪物BUFF信息?.[怪物Handle]) {
        delete GameLib.R.怪物BUFF信息[怪物Handle];
    }
}

/**
 * 移除指定怪物的指定分组BUFF
 */
export function 移除怪物分组BUFF(monster: TActor, buffGroupID: number): void {
    移除怪物BUFF(monster, buffGroupID);
}

/**
 * 检查怪物是否有指定分组的BUFF
 */
export function 检查怪物BUFF(monster: TActor, buffGroupID: number): boolean {
    const 怪物Handle = `${monster.Handle}`;
    const buffInfo = GameLib.R.怪物BUFF信息?.[怪物Handle];
    return buffInfo !== undefined && buffInfo.config.buffGroupID === buffGroupID;
}

// #endregion

// #region 使用示例

/**
 * 使用示例：
 * 
 * // 1. 在攻击或技能触发时给怪物上BUFF
 * import { 添加BUFF伤害, BuffDamageType } from "./BUFF";
 * 
 * // 示例1：固定伤害BUFF（每1秒造成1000伤害，持续10秒）
 * 添加BUFF伤害(Player, Monster, {
 *     buffGroupID: 1001,  // BUFF分组ID
 *     buffType: BuffDamageType.固定伤害,
 *     damage: '1000',
 *     damageInterval: 1000,  // 1秒
 *     duration: 10000,  // 10秒
 *     buffName: '持续伤害'
 * });
 * 
 * // 示例2：百分比伤害BUFF（每2秒造成怪物最大血量5%的伤害，持续20秒）
 * 添加BUFF伤害(Player, Monster, {
 *     buffGroupID: 1002,
 *     buffType: BuffDamageType.百分比伤害,
 *     damage: '5',  // 5%
 *     damageInterval: 2000,  // 2秒
 *     duration: 20000,  // 20秒
 *     buffName: '百分比伤害'
 * });
 * 
 * // 示例3：基于攻击力的伤害BUFF（每500毫秒造成攻击力2倍的伤害，持续5秒）
 * 添加BUFF伤害(Player, Monster, {
 *     buffGroupID: 1003,
 *     buffType: BuffDamageType.攻击力伤害,
 *     damage: '2',  // 2倍攻击力
 *     damageInterval: 500,  // 0.5秒
 *     duration: 5000,  // 5秒
 *     buffName: '攻击力伤害'
 * });
 * 
 * // 2. 在RobotManageNpc.ts的_A_second函数中添加BUFF更新（每1秒更新一次）
 * import { 更新BUFF系统 } from "../大数值版本/BUFF";
 * 
 * export function _A_second(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
 *     // ... 其他代码 ...
 *     
 *     // 每1秒更新一次BUFF系统（建议放在函数末尾）
 *     if (Player.R.性能计数器 % 1 === 0) {
 *         更新BUFF系统();
 *     }
 * }
 * 
 * // 或者使用更频繁的更新（每100毫秒），可以在RobotManageNpc中添加一个新的定时器函数
 * // 在QFunctionNpc.ts或其他全局定时器中调用
 * 
 * // 3. 移除BUFF
 * import { 移除怪物分组BUFF, 移除怪物所有BUFF } from "./BUFF";
 * 
 * // 移除指定分组的BUFF
 * 移除怪物分组BUFF(Monster, 1001);
 * 
 * // 移除所有BUFF
 * 移除怪物所有BUFF(Monster);
 * 
 * // 4. 检查BUFF
 * import { 检查怪物BUFF } from "./BUFF";
 * 
 * if (检查怪物BUFF(Monster, 1001)) {
 *     // 怪物已有该分组的BUFF
 * }
 */

// #endregion

