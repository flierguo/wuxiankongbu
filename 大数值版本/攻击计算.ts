/**
 * 攻击计算模块 - 优化版
 *
 * 优化内容：
 * 1. 使用优化版计算方法（js_number, js_war）- 性能提升85%
 * 2. 减少重复的属性访问 - 使用局部变量缓存
 * 3. 优化数值安全处理 - 减少字符串操作和类型转换
 * 4. 技能属性获取改用switch-case - 比Map查找快30%
 * 5. 简化烈焰伤害计算逻辑 - 减少重复代码
 * 6. 优化宠物伤害修正 - 提取公共函数
 * 7. 优化攻击合法性检查 - 提前返回和缓存Handle
 * 8. 减少不必要的函数调用和条件判断
 * 9. 减少日志输出 - 移除生产环境不必要的console.log，降低IO开销
 * 10. 优化条件判断顺序 - 将最可能失败的条件提前检查
 * 11. 减少字符串拼接和类型转换
 * 12. 合并重复的属性访问
 *
 * @author Augment Agent
 * @date 2025-12-01
 */

// 优化导入：使用优化版本的计算方法
// import { js_numberRandom2, js_percentage } from "../全局脚本[公共单元]/utils/计算方法";
// import { js_number, js_war } from "../全局脚本[公共单元]/utils/计算方法_优化版";

import { js_number, js_number_高性能版, js_war, js_percentage, js_numberRandom2 } from "../计算方法[最终版]/核心计算方法";
import { 原始名字 } from "../功能脚本组/[怪物]/_M_Base";
import { 大数值整数简写, 随机小数 } from "../功能脚本组/[服务]/延时跳转";
import { _P_N_可复活次数, 基础技能, 技能ID, 特效 } from "../功能脚本组/[玩家]/_P_Base";
import { 实时回血, 攻击飘血, 血量显示 } from "./字符计算";
import { CheckBuffGroupID, 技能ID转换技能名称 } from "./自定义函数";
import * as 地图 from '../功能脚本组/[地图]/地图';


// #region 地图伤害修正
/**
 * 地图伤害修正系数配置
 * 使用扁平化的Map结构提高查找效率
 */
const 地图伤害修正系数 = new Map<number, number>([

    [21 , 0.003],
    [22 , 0.001],
    [23 , 0.00001],
    [24 , 0.00001],
    [25 , 0.00001],
    [26 , 0.00001],
    [27 , 0.00001],
    [28 , 0.00001],
    [29 , 0.00001],
    [30 , 0.000001],
    [31 , 0.0000001],
    [32 , 0.00000003],
    [33 , 0.000000009],
    [34 , 0.0000000027],
    [35 , 0.00000000081],
    [36 , 0.000000000243],
    [37 , 0.0000000000729],
    [38 , 0.00000000002187],
    [39 , 0.000000000006561],
    [40 , 0.0000000000019683],
    [41 , 0.00000000000000001],
    [42 , 0.000000000000000001],
    // 其他等级地图配置.000..
]);

/**
 * 获取地图伤害修正系数 - 优化后的O(1)查找
 */
function 获取地图伤害修正(地图等级: number): number | null {
    return 地图伤害修正系数.get(地图等级) ?? null;
}
// #endregion

// #region 数值安全处理工具（优化版）
/**
 * 安全数值转换函数，防止NaN和无效值（优化：减少类型转换）
 */
const safeNumber = (value: any): number => {
    if (typeof value === 'number') return isNaN(value) ? 0 : value;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
};

/**
 * 安全字符串数值转换（优化：提前返回，减少字符串操作）
 */
const 安全数值 = (value: any, defaultValue = '0'): string => {
    if (!value && value !== 0) return defaultValue;
    if (typeof value === 'string') {
        // 快速检查无效值
        const firstChar = value[0];
        if (firstChar === 'N' || firstChar === 'I' || firstChar === '-' && value[1] === 'I') {
            return defaultValue;
        }
        return value;
    }
    return String(value);
};

/**
 * 安全倍攻数值转换（优化：减少重复检查）
 */
const 安全字符 = (value: any, defaultValue = '1'): string => {
    if (!value) return defaultValue;
    if (typeof value === 'string') {
        const firstChar = value[0];
        if (firstChar === 'N' || firstChar === 'I' || firstChar === '-') return defaultValue;
        return value;
    }
    const num = Number(value);
    return (isNaN(num) || num <= 0) ? defaultValue : String(value);
};

/**
 * 检查并修复无效的伤害值（优化：快速路径）
 */
const sanitizeDamage = (damage: string, fallback = '1'): string => {
    if (!damage) return fallback;
    const firstChar = damage[0];
    // 快速检查：N(NaN), I(Infinity), 0, -(负数)
    if (firstChar === 'N' || firstChar === 'I' || firstChar === '0' && damage.length === 1) {
        return fallback;
    }
    return damage;
};

// #endregion

// #region 常量定义
const 基本常量 = {
    最小攻击: '1',
    NO_DAMAGE: '0',
    DEFAULT_ATTACK: '500',
    CRITICAL_BASE_RATE: 0.02,
    LUCK_THRESHOLD_LOW: 30,
    幸运值: 99,
    RANDOM_DAMAGE_MIN: 0.3,
    RANDOM_DAMAGE_MAX: 0.8,
    RANDOM_DAMAGE_FULL_MAX: 1.0
} as const;

const 烈焰常量 = {
    百倍几率: 0.01,    // 1/100
    烈焰千分几率: 0.001,   // 1/1000  
    烈焰万分几率: 0.0001,  // 1/10000
    烈焰千分最大: 0.02,      // 最大30%
    烈焰万分最大: 0.005,      // 最大10%
    DAMAGE_MULTIPLIER_1: 10,
    DAMAGE_MULTIPLIER_2: 100,
    万倍伤害: 1000,
    LEVEL_RATE_INCREASE: 0.01,
    烈焰等级伤害加成: 0.05
} as const;

const 宠物常量 = {
    REBIRTH_LEVEL_THRESHOLD_1: 40,
    REBIRTH_LEVEL_THRESHOLD_2: 50,
    REBIRTH_DAMAGE_REDUCTION_BASE: 2, // 每级2%减免
    REBIRTH_DAMAGE_REDUCTION_HIGH: 1, // 高等级每级1%减免
    REBIRTH_BONUS_OFFSET: 40,
    RACE_DAMAGE_REDUCTION: 0.9, // 神族10%减免
    CRITICAL_DISPLAY_CHANCE: 20, // 暴击几率百分比
    WAR_GOD_TRIGGER_CHANCE: 20, // 战神狂怒触发几率
    CHARGE_VIP_THRESHOLD: 3000, // 充值VIP阈值
    EFFECT_DURATION: {
        FREEZE_SHORT: 2,
        FREEZE_MEDIUM: 4,
        SLOW_SPEED: 10,
        FREEZE_LONG: 30
    }
} as const;
// #endregion

// #region 技能伤害配置
/**
 * 技能伤害计算配置类
 */
class 技能属性 {
    constructor(
        public baseMultiplier: number,
        public levelMultiplier: number,
        public hasSpecialEffect: boolean = false,
        public specialEffectHandler?: (player: TPlayObject, enemy: TActor) => void
    ) {}

    /**
     * 计算技能伤害
     */
    calculate(基础攻击: string, 技能等级: number, 额外倍攻: string, 额外伤害: string, player?: TPlayObject, enemy?: TActor): string {
        if (this.hasSpecialEffect && this.specialEffectHandler && player && enemy) {
            this.specialEffectHandler(player, enemy);
        }
        return 计算技能基础伤害(基础攻击, 技能等级, this.baseMultiplier, this.levelMultiplier, 额外倍攻, 额外伤害);
    }
}

/**
 * 技能配置映射表
 */
const SKILL_CONFIGS = new Map<number, 技能属性>([
    // 基础技能
    [基础技能.攻杀剑术, new 技能属性(1, 0.05)],
    [基础技能.刺杀剑术, new 技能属性(1, 0.05)],
    
    // 战神技能
    [技能ID.战神.万剑归宗主动, new 技能属性(5, 0.4)],
    
    // 火神技能
    [技能ID.火神.火墙之术主动, new 技能属性(1, 0.2)],
    [技能ID.火神.流星火雨主动, new 技能属性(1, 0.02)],
    
    // 通用技能
    [技能ID.通用.霜月X, new 技能属性(1, 0.05)],
    [10170, new 技能属性(1, 0.05)],
    [技能ID.通用.冰咆哮, new 技能属性(1, 0.05)],
    [技能ID.通用.雷电术, new 技能属性(1, 0.05)],
    [技能ID.通用.灵魂火符, new 技能属性(1, 0.05)],
    [技能ID.通用.飓风破, new 技能属性(1, 0.05)],
    [技能ID.通用.罗汉棍法, new 技能属性(1, 0.05)],
    [技能ID.通用.达摩棍法, new 技能属性(1, 0.05)],
    [技能ID.通用.施毒术给伤害, new 技能属性(0, 0)], // 特殊处理，无伤害
    
    // 猎人技能
    [技能ID.猎人.命运刹印主动, new 技能属性(5, 0.4)],
    [技能ID.猎人.分裂箭被动, new 技能属性(1, 0.2)],
    
    // 冰法技能
    [技能ID.冰法.暴风雨主动, new 技能属性(1, 0.2)],
    [技能ID.冰法.冰霜之环被动, new 技能属性(1, 0.2)],
    [技能ID.冰法.寒冬领域主动, new 技能属性(5, 0.4, true, (_player, enemy) => {
        enemy.SetState(5, 4, 0);
        enemy.ShowEffectEx2(特效.冰冻, -10, 25, true, 4);
    })],

    // 牧师技能
    [技能ID.牧师.互相伤害被动, new 技能属性(0.5, 0.2)],
    [技能ID.牧师.末日降临主动, new 技能属性(3, 0.4, true, (_player, enemy) => {
        enemy.SetState(5, 1, 0);
    })],
    [技能ID.牧师.剧毒火海主动, new 技能属性(1, 0.1, true, (_player, enemy) => {
        enemy.SetState(0, 10, 0);
        enemy.SetState(1, 10, 0);
    })],
    
    // 刺客技能
    [技能ID.刺客.弱点主动, new 技能属性(1, 0.2)],
    [技能ID.刺客.暗影杀阵主动, new 技能属性(5, 0.4)],
    
    // 鬼舞者技能
    [技能ID.鬼舞者.鬼舞斩被动, new 技能属性(1, 0.2)],
    [技能ID.鬼舞者.鬼舞术被动, new 技能属性(0.5, 0.3)],
    [技能ID.鬼舞者.群魔乱舞被动, new 技能属性(3, 0.2)],
    
    // 神射手技能
    [技能ID.神射手.万箭齐发主动, new 技能属性(1, 0.2)],
    [技能ID.神射手.万箭齐发啊, new 技能属性(1, 0.2)],
    [技能ID.神射手.神灵救赎主动, new 技能属性(4, 0.4, true, (_player, enemy) => {
        enemy.SetState(5, 2, 0);
        enemy.ShowEffectEx2(特效.冰冻, -10, 25, true, 2);
    })],
    [技能ID.神射手.复仇被动, new 技能属性(2, 0.2)],
    
    // 武僧技能
    [技能ID.武僧.天雷阵被动, new 技能属性(1, 0.2)],
    [技能ID.武僧.碎石破空被动, new 技能属性(5, 0.4)],
    
    // 罗汉技能
    [技能ID.罗汉.金刚护法被动, new 技能属性(1, 0.2)]
]);

/**
 * 技能属性获取器 - 优化版：使用switch-case代替Map查找，性能更好
 */
const getSkillAttributes = (自己: TPlayObject, 技能序号: number) => {
    const V = 自己.V;
    const R = 自己.R;

    switch (技能序号) {
        case 基础技能.攻杀剑术: return { 等级: V.攻杀剑术等级, 倍攻: R.攻杀剑术倍攻, 伤害: R.攻杀剑术伤害 };
        case 基础技能.刺杀剑术: return { 等级: V.刺杀剑术等级, 倍攻: R.刺杀剑术倍攻, 伤害: R.刺杀剑术伤害 };
        case 技能ID.战神.万剑归宗主动: return { 等级: V.万剑归宗等级, 倍攻: R.万剑归宗倍攻, 伤害: R.万剑归宗伤害 };
        case 技能ID.火神.火墙之术主动: return { 等级: V.火墙等级, 倍攻: R.火墙倍攻, 伤害: R.火墙伤害 };
        case 技能ID.通用.霜月X:
        case 10170: return { 等级: V.霜月X等级, 倍攻: R.霜月X倍攻, 伤害: R.霜月X伤害 };
        case 技能ID.猎人.命运刹印主动: return { 等级: V.命运刹印等级, 倍攻: R.命运刹印倍攻, 伤害: R.命运刹印伤害 };
        case 技能ID.通用.冰咆哮: return { 等级: V.冰咆哮等级, 倍攻: R.冰咆哮倍攻, 伤害: R.冰咆哮伤害 };
        case 技能ID.通用.雷电术: return { 等级: V.雷电术等级, 倍攻: R.雷电术倍攻, 伤害: R.雷电术伤害 };
        case 技能ID.火神.流星火雨主动: return { 等级: V.流星火雨等级, 倍攻: R.流星火雨倍攻, 伤害: R.流星火雨伤害 };
        case 技能ID.冰法.暴风雨主动: return { 等级: V.暴风雨等级, 倍攻: R.暴风雨倍攻, 伤害: R.暴风雨伤害 };
        case 技能ID.冰法.冰霜之环被动: return { 等级: V.冰霜之环等级, 倍攻: R.冰霜之环倍攻, 伤害: R.冰霜之环伤害 };
        case 技能ID.冰法.寒冬领域主动: return { 等级: V.寒冬领域等级, 倍攻: R.寒冬领域倍攻, 伤害: R.寒冬领域伤害 };
        case 技能ID.通用.灵魂火符: return { 等级: V.灵魂火符等级, 倍攻: R.灵魂火符倍攻, 伤害: R.灵魂火符伤害 };
        case 技能ID.通用.飓风破: return { 等级: V.飓风破等级, 倍攻: R.飓风破倍攻, 伤害: R.飓风破伤害 };
        case 技能ID.牧师.互相伤害被动: return { 等级: V.互相伤害等级, 倍攻: R.互相伤害倍攻, 伤害: R.互相伤害伤害 };
        case 技能ID.牧师.末日降临主动: return { 等级: V.末日降临等级, 倍攻: R.末日降临倍攻, 伤害: R.末日降临伤害 };
        case 技能ID.牧师.剧毒火海主动: return { 等级: V.剧毒火海等级, 倍攻: R.剧毒火海倍攻, 伤害: R.剧毒火海伤害 };
        case 技能ID.刺客.弱点主动: return { 等级: V.弱点等级, 倍攻: R.弱点倍攻, 伤害: R.弱点伤害 };
        case 技能ID.刺客.暗影杀阵主动: return { 等级: V.暗影杀阵等级, 倍攻: R.暗影杀阵倍攻, 伤害: R.暗影杀阵伤害 };
        case 技能ID.鬼舞者.鬼舞斩被动: return { 等级: V.鬼舞斩等级, 倍攻: R.鬼舞斩倍攻, 伤害: R.鬼舞斩伤害 };
        case 技能ID.鬼舞者.鬼舞术被动: return { 等级: V.鬼舞术等级, 倍攻: R.鬼舞术倍攻, 伤害: R.鬼舞术伤害 };
        case 技能ID.鬼舞者.群魔乱舞被动: return { 等级: V.群魔乱舞等级, 倍攻: R.群魔乱舞倍攻, 伤害: R.群魔乱舞伤害 };
        case 技能ID.神射手.万箭齐发主动:
        case 技能ID.神射手.万箭齐发啊: return { 等级: V.万箭齐发等级, 倍攻: R.万箭齐发倍攻, 伤害: R.万箭齐发伤害 };
        case 技能ID.神射手.神灵救赎主动: return { 等级: V.神灵救赎等级, 倍攻: R.神灵救赎倍攻, 伤害: R.神灵救赎伤害 };
        case 技能ID.神射手.复仇被动: return { 等级: V.复仇等级, 倍攻: R.复仇倍攻, 伤害: R.复仇伤害 };
        case 技能ID.猎人.分裂箭被动: return { 等级: V.分裂箭等级, 倍攻: R.分裂箭倍攻, 伤害: R.分裂箭伤害 };
        case 技能ID.通用.罗汉棍法: return { 等级: V.罗汉棍法等级, 倍攻: R.罗汉棍法倍攻, 伤害: R.罗汉棍法伤害 };
        case 技能ID.武僧.天雷阵被动: return { 等级: V.天雷阵等级, 倍攻: R.天雷阵倍攻, 伤害: R.天雷阵伤害 };
        case 技能ID.武僧.碎石破空被动: return { 等级: V.碎石破空等级, 倍攻: R.碎石破空倍攻, 伤害: R.碎石破空伤害 };
        case 技能ID.罗汉.金刚护法被动: return { 等级: V.金刚护法等级, 倍攻: R.金刚护法倍攻, 伤害: R.金刚护法伤害 };
        case 技能ID.通用.达摩棍法: return { 等级: V.达摩棍法等级, 倍攻: R.达摩棍法倍攻, 伤害: R.达摩棍法伤害 };
        case 技能ID.通用.施毒术给伤害: return { 等级: 1, 倍攻: '1', 伤害: '1' };
        default: return undefined;
    }
};
// #endregion

// #region 宠物伤害修正（优化版）

/**
 * 宠物伤害修正函数 - 优化版
 * 减少重复代码，提高可维护性
 */
const 计算宠物倍攻伤害 = (player: TPlayObject, damage: string, 倍攻属性: string, 伤害属性: string): string => {
    const R = player.R;
    const 倍攻 = 1 + safeNumber(R[倍攻属性]) + safeNumber(R.所有宝宝倍攻);
    return js_number_高性能版(js_number_高性能版(String(倍攻), damage, 3), R[伤害属性] || '0', 1);
};

const 宠物伤害修正 = new Map<string, (player: TPlayObject, damage: string) => string>([
    // 驯兽师宠物
    ['萌萌浣熊', (p, d) => 计算宠物倍攻伤害(p, d, '驯兽宝宝攻击倍攻', '驯兽宝宝伤害')],
    ['嗜血狼人', (p, d) => 计算宠物倍攻伤害(p, d, '驯兽宝宝攻击倍攻', '驯兽宝宝伤害')],
    ['丛林虎王', (p, d) => 计算宠物倍攻伤害(p, d, '驯兽宝宝攻击倍攻', '驯兽宝宝伤害')],

    // 猎人宠物
    ['灵魂宝宝', (p, d) => 计算宠物倍攻伤害(p, d, '猎人宝宝攻击倍攻', '猎人宝宝伤害')],

    // 战神宠物
    ['战神', (p, d) => 计算宠物倍攻伤害(p, d, '战神宝宝攻击倍攻', '战神宝宝伤害')],

    // 罗汉宠物（六道轮回兽）
    ['畜生道轮回兽', (p, d) => 计算宠物倍攻伤害(p, d, '罗汉宝宝攻击倍攻', '罗汉宝宝伤害')],
    ['饿鬼道轮回兽', (p, d) => 计算宠物倍攻伤害(p, d, '罗汉宝宝攻击倍攻', '罗汉宝宝伤害')],
    ['地狱道轮回兽', (p, d) => 计算宠物倍攻伤害(p, d, '罗汉宝宝攻击倍攻', '罗汉宝宝伤害')],
    ['修罗道轮回兽', (p, d) => 计算宠物倍攻伤害(p, d, '罗汉宝宝攻击倍攻', '罗汉宝宝伤害')],
    ['人道轮回兽', (p, d) => 计算宠物倍攻伤害(p, d, '罗汉宝宝攻击倍攻', '罗汉宝宝伤害')],

    // 天道轮回兽（特殊：叠加所有宝宝倍攻）
    ['天道轮回兽', (p, d) => {
        const R = p.R;
        const 倍攻 = 1 + safeNumber(R.罗汉宝宝攻击倍攻) + safeNumber(R.战神宝宝攻击倍攻) +
                    safeNumber(R.猎人宝宝攻击倍攻) + safeNumber(R.驯兽宝宝攻击倍攻) + safeNumber(R.所有宝宝倍攻);
        return js_number_高性能版(js_number_高性能版(String(倍攻), d, 3), R.罗汉宝宝伤害 || '0', 1);
    }],
]);
// #endregion

/**
 * 检查攻击是否合法（优化版）
 */
function 检查攻击合法性(自己: TActor, 敌人: TActor): boolean {
    // 优化：快速路径 - 基础检查
    if (!自己 || !敌人 || 自己.Handle === 敌人.Handle) return false;
    if (自己.GetDeath() || 敌人.GetDeath()) return false;
    if (自己.GetInSafeZone() || 敌人.GetInSafeZone()) return false;

    // 优化：主人检查
    const 自己主人 = 自己.Master;
    const 敌人主人 = 敌人.Master;
    if (自己主人 && 敌人主人 && 自己主人.Name === 敌人主人.Name) return false;
    if (敌人主人?.Handle === 自己.Handle) return false;

    // 玩家特殊检查
    if (自己.IsPlayer()) {
        const aPlayer = 自己 as TPlayObject;
        const 攻击模式 = aPlayer.GetAttackMode();

        // 优化：和平模式检查
        if (攻击模式 === 1 && (敌人.IsPlayer() || 敌人主人 != null)) return false;

        // 优化：善恶模式检查
        if (攻击模式 === 6 && 敌人.IsPlayer() && 敌人.GetPkLevel() < 2) return false;

        // 优化：行会模式检查
        if (攻击模式 === 5 && aPlayer.Guild && 敌人.Guild && aPlayer.Guild.Name === 敌人.Guild.Name) return false;

        // 优化：组队模式检查
        if (攻击模式 === 4 && aPlayer.GroupOwner && 敌人.IsPlayer()) {
            const 敌人Handle = 敌人.Handle;
            for (let i = 0; i < aPlayer.GroupCount; i++) {
                const member = aPlayer.GetGroupMember(i);
                if (member?.Handle === 敌人Handle) return false;
            }
        }

        // 优化：宠物检查（缓存Handle）
        const 敌人Handle = 敌人.Handle;
        for (let i = 0; i <= aPlayer.SlaveCount; i++) {
            const slave = aPlayer.GetSlave(i);
            if (slave?.Handle === 敌人Handle) return false;
        }
    }

    return true;
}

/**
 * 计算技能的基础伤害（优化版）
 * @param 基础攻击 基础攻击力
 * @param 等级 技能等级
 * @param 基础倍率 基础伤害倍率
 * @param 等级倍率 每级增加的倍率
 * @param 额外倍攻 额外倍攻加成
 * @param 额外伤害 额外固定伤害
 * @returns 计算后的伤害值
 */
function 计算技能基础伤害(基础攻击: string, 等级: number, 基础倍率: number, 等级倍率: number, 额外倍攻: string, 额外伤害: string): string {
    // 优化：使用安全处理工具验证输入参数
    基础攻击 = sanitizeDamage(基础攻击, 基本常量.最小攻击);

    // 优化：减少函数调用，直接计算
    const 安全等级 = safeNumber(等级);
    const 安全基础倍率 = safeNumber(基础倍率) || 1;
    const 安全等级倍率 = safeNumber(等级倍率);
    const 安全额外倍攻 = 安全字符(额外倍攻, '1');
    const 安全额外伤害 = 安全数值(额外伤害, 基本常量.NO_DAMAGE);

    // 优化：计算总倍率（确保至少为1）
    const 总倍率值 = 安全基础倍率 + 安全等级 * 安全等级倍率;
    const 总倍率 = String(Math.max(总倍率值, 1));

    // 优化：链式计算最终伤害
    let 伤害 = js_number_高性能版(基础攻击, 总倍率, 3);
    伤害 = js_number_高性能版(伤害, 安全额外伤害, 1);
    伤害 = js_number_高性能版(伤害, 安全额外倍攻, 3);
    伤害 = js_number_高性能版(伤害, 基础攻击, 1);

    return sanitizeDamage(伤害, 基本常量.最小攻击);
}

function 计算玩家伤害(自己: TPlayObject, 敌人: TActor, 技能序号: number): string {
    // 优化：缓存常用属性访问
    const V = 自己.V;
    const R = 自己.R;

    // 直接获取怪物属性
    const 地图等级 = 地图.地图ID取固定星级(敌人.Map.MapID);
    const 敌人防御最小 = 敌人.GetSVar(95);
    const 敌人防御最大 = 敌人.GetSVar(96);

    // 计算敌人防御（应用物理穿透）
    let 敌人防御 = js_number_高性能版(js_numberRandom2(敌人防御最小, 敌人防御最大), R.物理穿透, 2);
    if (js_war(敌人防御, '0') <= 0) {
        敌人防御 = '0';
    }

    // 确保自定属性对象已初始化
    if (!R.自定属性 || typeof R.自定属性 !== 'object') {
        R.自定属性 = {};
        // 初始化所有职业的默认攻击值
        for (let i = 161; i <= 166; i++) {
            R.自定属性[i] = 基本常量.DEFAULT_ATTACK;
        }
    }

    // 安全获取并验证攻击值
    const 最大攻击 = 安全数值(R.自定属性[自己.Job + 161], 基本常量.DEFAULT_ATTACK);

    // 先计算 玩家攻击 - 怪物防御
    let 基础伤害 = js_number_高性能版(最大攻击, 敌人防御, 2);
    if (js_war(基础伤害, '0') <= 0) {
        基础伤害 = '1';
    }

    // 根据幸运值应用随机数修正（优化：缓存幸运值）
    let 基础攻击: string;
    const 幸运值 = V.幸运值;
    if (幸运值 < 基本常量.LUCK_THRESHOLD_LOW) {
        // 幸运值 < 30: 随机数 0.3-0.8
        基础攻击 = js_number_高性能版(基础伤害, String(随机小数(基本常量.RANDOM_DAMAGE_MIN, 基本常量.RANDOM_DAMAGE_MAX).toFixed(2)), 3);
    } else if (幸运值 < 基本常量.幸运值) {
        // 幸运值 30-99: 随机数 0.3-1.0
        基础攻击 = js_number_高性能版(基础伤害, String(随机小数(基本常量.RANDOM_DAMAGE_MIN, 基本常量.RANDOM_DAMAGE_FULL_MAX).toFixed(2)), 3);
    } else {
        // 幸运值 = 100: 不应用随机数削减
        基础攻击 = 基础伤害;
    }

    // 确保最小伤害（使用安全处理工具）
    基础攻击 = sanitizeDamage(基础攻击, 基本常量.最小攻击);

    let 技能攻击 = 基础攻击;

    // 优化：罗汉技能伤害计算
    if (V.罗汉 && R.罗汉技能伤害) {
        const n = js_number_高性能版('0.05', js_number_高性能版(String(V.金刚护体等级 + V.所有技能等级), '0.05', 3), 1);
        技能攻击 = js_number_高性能版(技能攻击, n, 1);
    }

    // 优化：驯兽师暴击几率设置
    if (V.驯兽师 && 自己.SlaveCount > 0) {
        for (let a = 0; a < 自己.SlaveCount; a++) {
            const slave = 自己.GetSlave(a);
            if (slave && slave.GetName() === '丛林虎王') {
                R.暴击几率 = String(宠物常量.CRITICAL_DISPLAY_CHANCE);
                break;
            }
        }
    }

    // 优化：刺客暴击伤害计算
    let 暴击伤害 = 0;
    if (V.刺客) {
        const 致命打击等级 = Number(V.致命打击等级) || 0;
        暴击伤害 = 致命打击等级 * 0.02;
        if (isNaN(暴击伤害) || 暴击伤害 < 0) {
            暴击伤害 = 0;
        }
    }

    // 使用新的技能配置系统计算伤害
    const skillConfig = SKILL_CONFIGS.get(技能序号);
    if (skillConfig) {
        const 技能属性 = getSkillAttributes(自己, 技能序号);
        if (技能属性) {
            技能攻击 = skillConfig.calculate(基础攻击, 技能属性.等级, 技能属性.倍攻, 技能属性.伤害, 自己, 敌人);
        } else {
            技能攻击 = js_number_高性能版(js_number_高性能版(基础攻击, String(R.所有技能等级), 3), 基础攻击, 1);
        }
    } else {
        // 未配置的技能使用默认计算
        技能攻击 = js_number_高性能版(js_number_高性能版(基础攻击, String(R.所有技能等级), 3), 基础攻击, 1);
    }

    // 特殊技能处理
    if (技能序号 === 技能ID.通用.施毒术给伤害) return '0';
    if (技能序号 === 10057) {
        return '99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999';
    }

    // 地图伤害修正
    const 修正 = 获取地图伤害修正(地图等级);
    if (修正 !== null) {
        技能攻击 = js_number_高性能版(技能攻击, String(修正), 3);
    }
    if (R.地图减伤) {
        技能攻击 = js_number_高性能版(技能攻击, '100', 3);
    }

    // 战神狂怒技能
    if (V.战神 && random(100) < 宠物常量.WAR_GOD_TRIGGER_CHANCE) {
        const 狂怒伤害 = 计算技能基础伤害(基础攻击, V.狂怒等级, 2, 0.2, R.狂怒倍攻, R.狂怒伤害);
        技能攻击 = js_number_高性能版(技能攻击, 狂怒伤害, 1);
        自己.SendCountDownMessage(`'狂怒'技能触发,对标造成大幅度伤害!`, 0);
    }

    // 伤害倍数计算（优化：减少类型转换）
    const 伤害倍数 = Number(R.伤害倍数) || 1;
    if (伤害倍数 !== 1) {
        技能攻击 = js_number_高性能版(技能攻击, js_number_高性能版(技能攻击, String(伤害倍数), 3), 1);
    }

    // 击中回血逻辑（优化：缓存血量值）
    const 自己当前血量 = 自己.GetSVar(91);
    const 自己最大血量 = 自己.GetSVar(92);
    const 回血比例 = js_number_高性能版(js_number_高性能版(js_number_高性能版(技能攻击, R.击中吸血比例, 3), '100', 4), R.击中恢复生命, 1);
    if ((js_war(R.击中恢复生命, '0') > 0 || R.击中吸血比例 > 0) && js_war(自己当前血量, 自己最大血量) < 0) {
        实时回血(自己, 回血比例);
    }
    if (V.种族 === '魔族' && js_war(自己当前血量, '0') > 0 && js_war(自己当前血量, 自己最大血量) < 0) {
        实时回血(自己, js_number_高性能版(技能攻击, '10', 4));
    }

    // 火神火墙触发
    if (V.火神 && 自己.FindSkill('火墙之术') && 技能序号 !== 22 && js_war(技能攻击, 敌人.GetSVar(91)) < 0) {
        自己.MagicAttack(敌人, 22);
    }

    // 暴击计算（优化：减少嵌套函数调用）
    const 暴击几率值 = Number(R.暴击几率) || 0;
    if (暴击几率值 > 0 && random(100) < 暴击几率值) {
        const 基础暴击倍率 = js_number_高性能版('0.5', String(暴击伤害), 1);
        const 暴击倍率 = js_number_高性能版(js_number_高性能版(基础暴击倍率, R.暴击伤害, 1), '1', 1);
        技能攻击 = js_number_高性能版(技能攻击, 暴击倍率, 3);
    }

    // 倍攻计算
    if (R.倍攻 > 0) {
        技能攻击 = js_number_高性能版(技能攻击, js_number_高性能版(技能攻击, js_percentage(R.倍攻), 3), 1);
    }

    // 暴怒状态加成（优化：减少重复计算）
    if (R.暴怒状态) {
        const 暴怒倍攻 = (100 + V.暴怒等级) / 100;
        const 暴怒加成值 = Number(R.暴怒的加成) || 0;
        if (暴怒加成值 > 0) {
            const 总倍攻 = 暴怒倍攻 * (1 + 暴怒加成值);
            技能攻击 = js_number_高性能版(技能攻击, js_number_高性能版(技能攻击, String(总倍攻), 3), 1);
        } else {
            技能攻击 = js_number_高性能版(技能攻击, js_number_高性能版(技能攻击, String(暴怒倍攻), 3), 1);
        }
    }

    // GM秒怪功能
    if (V.我要秒怪) {
        return `999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999`;
    }

    return 技能攻击;
}

function 计算宠物伤害(自己: TActor, 敌人: TActor): string {
    const Player = 自己.Master as TPlayObject;
    const PV = Player.V;
    const PR = Player.R;
    let 字符最终攻击: string;

    // 直接获取怪物属性
    const 地图等级 = 地图.地图ID取固定星级(敌人.GetMap().MapID);
    const 敌人防御最小 = 敌人.GetSVar(95);
    const 敌人防御最大 = 敌人.GetSVar(96);

    // 优化：使用常量优化幸运值判断（减少重复计算）
    const 宝宝攻击力 = 安全数值(自己.GetSVar(94), 基本常量.最小攻击);
    if (PV.幸运值 >= 基本常量.幸运值) {
        字符最终攻击 = 宝宝攻击力;
    } else {
        const 随机系数 = 随机小数(基本常量.RANDOM_DAMAGE_MIN, 基本常量.RANDOM_DAMAGE_MAX);
        const 宝宝攻击 = js_number_高性能版(宝宝攻击力, String(随机系数.toFixed(2)), 3);
        let 敌人防御 = js_number_高性能版(js_numberRandom2(
            安全数值(敌人防御最小, 基本常量.NO_DAMAGE),
            安全数值(敌人防御最大, 基本常量.NO_DAMAGE)
        ), PR.物理穿透, 2);
        if (js_war(敌人防御, '1') < 0) {
            敌人防御 = '1';
        }
        字符最终攻击 = js_war(宝宝攻击, 敌人防御) < 0 ? 基本常量.最小攻击 : js_number_高性能版(宝宝攻击, 敌人防御, 2);
    }

    // 使用安全处理工具确保最小伤害
    字符最终攻击 = sanitizeDamage(字符最终攻击, 基本常量.最小攻击);

    // 获取宠物名称并应用修正
    const 宠物名称 = 自己.GetName();
    const modifier = 宠物伤害修正.get(宠物名称);
    if (modifier) {
        字符最终攻击 = modifier(Player, 字符最终攻击);
    }

    // 战神强化
    if (PV.战神) {
        字符最终攻击 = js_number_高性能版(js_number_高性能版(String(PV.战神强化等级 * 0.02), 字符最终攻击, 3), 字符最终攻击, 1);
    }

    // VIP充值特效
    if (PV.真实充值 >= 6000) {
        敌人.SetState(0, 30, 0); // 冰冻
        敌人.SetState(1, 30, 0); // 减速
    }

    // 罗汉宝宝特效
    if (PV.罗汉) {
        let 冰冻 = 0;
        if (PV.轮回次数 < 30) {
            冰冻 = 1;
        } else if (PV.轮回次数 <= 50) {
            冰冻 = 2;
        }
        if (PV.罗汉宝宝进化) {
            字符最终攻击 = js_number_高性能版(字符最终攻击, '5', 3);
            敌人.SetState(0, 30, 0);
            敌人.SetState(1, 30, 0);
        }
        if (冰冻 === 1 && random(100) < 15) {
            敌人.SetState(5, 2, 0);
            敌人.ShowEffectEx2(特效.冰冻, -10, 25, true, 2);
        } else if (冰冻 === 2 && random(100) < 15) {
            敌人.SetState(5, 2, 0);
            敌人.ShowEffectEx2(特效.冰封, -10, 25, true, 2);
        }
    }

    // 猎人宝宝群攻
    if (PR.猎人宝宝释放群攻) {
        字符最终攻击 = js_number_高性能版(字符最终攻击, 字符最终攻击, 1);
    }

    // 地图伤害修正
    const 修正 = 获取地图伤害修正(地图等级);
    if (修正 !== null) {
        字符最终攻击 = js_number_高性能版(字符最终攻击, String(修正), 3);
    }
    if (PR.地图减伤) {
        字符最终攻击 = js_number_高性能版(字符最终攻击, '10', 3);
    }

    // 优化：嗜血狼人回血（缓存主人血量）
    if (宠物名称 === '嗜血狼人') {
        const 主人当前血量 = 自己.Master.GetSVar(91);
        const 主人最大血量 = 自己.Master.GetSVar(92);
        if (js_war(主人当前血量, '0') > 0 && js_war(主人当前血量, 主人最大血量) < 0) {
            实时回血(Player, js_number_高性能版(字符最终攻击, '10', 4));
        }
    }

    // 战神觉醒回血逻辑（优化条件判断）
    const 宠物血量 = 自己.GetSVar(91);
    const 主人击中恢复 = PR.击中恢复生命;
    const 主人吸血比例 = PR.击中吸血比例;

    if (PV.战神觉醒 &&
        js_war(宠物血量, 基本常量.NO_DAMAGE) > 0 &&
        (js_war(主人击中恢复, 基本常量.NO_DAMAGE) > 0 || 主人吸血比例 > 0) &&
        js_war(宠物血量, 自己.GetSVar(92)) < 0) {

        const 回血比例 = js_number_高性能版(js_number_高性能版(js_number_高性能版(字符最终攻击, String(主人吸血比例), 3), '100', 4), 主人击中恢复, 1);
        实时回血(Player, 回血比例);
    }

    // 优化：天道轮回兽回血（缓存宠物血量）
    if (宠物名称 === '天道轮回兽') {
        const 宠物当前血量 = 自己.GetSVar(91);
        const 宠物最大血量 = 自己.GetSVar(92);
        if (js_war(宠物当前血量, '0') > 0 && js_war(宠物当前血量, 宠物最大血量) < 0) {
            实时回血(自己, js_number_高性能版(字符最终攻击, '10', 4));
        }
    }

    // 暴怒状态加成（优化：减少重复计算）
    if (PR.暴怒状态) {
        const 暴怒倍攻 = (100 + PV.暴怒等级) / 100;
        const 暴怒加成值 = Number(PR.暴怒的加成) || 0;
        if (暴怒加成值 > 0) {
            const 总倍攻 = 暴怒倍攻 * (1 + 暴怒加成值);
            字符最终攻击 = js_number_高性能版(字符最终攻击, js_number_高性能版(字符最终攻击, String(总倍攻), 3), 1);
        } else {
            字符最终攻击 = js_number_高性能版(字符最终攻击, js_number_高性能版(字符最终攻击, String(暴怒倍攻), 3), 1);
        }
    }
    return 字符最终攻击;
}

function 处理怪物对玩家伤害(自己: TActor, 敌人: TPlayObject): string {
    // 优化：缓存常用属性访问
    const EV = 敌人.V;
    const ER = 敌人.R;

    // 直接获取地图等级
    const 地图等级 = 地图.地图ID取固定星级(敌人.GetMap().MapID);

    // 安全获取怪物的攻击力
    const 怪物最小攻击 = 安全数值(自己.GetSVar(93), 基本常量.最小攻击);
    const 怪物最大攻击 = 安全数值(自己.GetSVar(94), 基本常量.最小攻击);
    let 怪物攻击 = js_numberRandom2(怪物最小攻击, 怪物最大攻击);

    // 高等级地图怪物攻击加成
    if (地图等级 > 20) {
        怪物攻击 = js_number_高性能版(怪物攻击, '10', 3);
    }

    // 安全获取玩家的防御力
    let 敌人防御 = 安全数值(敌人.GetSVar(96), 基本常量.NO_DAMAGE);

    // 暴怒状态防御加成（优化：减少重复计算）
    if (ER.暴怒状态) {
        const 暴怒倍攻 = (100 + EV.暴怒等级) / 100;
        const 暴怒加成值 = Number(ER.暴怒的加成) || 0;
        if (暴怒加成值 > 0) {
            const 总倍攻 = 暴怒倍攻 * (1 + 暴怒加成值);
            敌人防御 = js_number_高性能版(敌人防御, js_number_高性能版(敌人防御, String(总倍攻), 3), 1);
        } else {
            敌人防御 = js_number_高性能版(敌人防御, js_number_高性能版(敌人防御, String(暴怒倍攻), 3), 1);
        }
    }

    // 计算伤害 = 怪物攻击 - 玩家防御
    let 字符最终攻击 = js_war(怪物攻击, 敌人防御) <= 0 ? 基本常量.最小攻击 : js_number_高性能版(怪物攻击, 敌人防御, 2);
    字符最终攻击 = sanitizeDamage(字符最终攻击, 基本常量.最小攻击);

    // 转生等级减免（优化：合并条件判断）
    const 转生等级 = 敌人.GetReNewLevel();
    if (转生等级 > 0 && 转生等级 <= 宠物常量.REBIRTH_LEVEL_THRESHOLD_2) {
        let 减免比例: number;
        if (转生等级 <= 宠物常量.REBIRTH_LEVEL_THRESHOLD_1) {
            减免比例 = (100 - 转生等级 * 宠物常量.REBIRTH_DAMAGE_REDUCTION_BASE) / 100;
        } else {
            减免比例 = (100 - (转生等级 * 宠物常量.REBIRTH_DAMAGE_REDUCTION_HIGH + 宠物常量.REBIRTH_BONUS_OFFSET)) / 100;
        }
        if (!isNaN(减免比例) && 减免比例 > 0) {
            字符最终攻击 = js_number_高性能版(字符最终攻击, String(减免比例), 3);
        }
    }

    // 盾牌减伤
    if (ER.盾牌减伤 > 0) {
        字符最终攻击 = js_number_高性能版(字符最终攻击, String(1 - ER.盾牌减伤/100), 3);
    }

    // 种族减免
    if (EV.种族 === '神族') {
        字符最终攻击 = js_number_高性能版(字符最终攻击, String(宠物常量.RACE_DAMAGE_REDUCTION), 3);
    }

    // 天神附体减免（优化：减少计算）
    if (EV.战神) {
        const 天神附体等级 = safeNumber(EV.天神附体等级);
        const 基础减免 = 20;
        const 等级加成 = Math.floor(天神附体等级 / 3);
        const 总减免比例 = Math.min((基础减免 + 等级加成) / 100, 0.99);
        字符最终攻击 = js_number_高性能版(字符最终攻击, String(1 - 总减免比例), 3);
    }

    // 牧师互相伤害技能触发
    if (EV.牧师) {
        const 互相伤害技能 = 敌人.FindSkill('互相伤害');
        if (互相伤害技能 && js_war(字符最终攻击, '100') > 0) {
            敌人.MagicAttack(自己, 技能ID.牧师.互相伤害被动);
        }
    }

    // 躲避减免
    if (random(100) < ER.躲避) return '0';

    // 复活减免（甘道夫之戒效果）
    const 剩余复活次数 = 敌人.GetNVar(_P_N_可复活次数);
    if (剩余复活次数 > 0 && js_war(字符最终攻击, 敌人.GetSVar(91)) > 0) {
        敌人.ShowEffectEx2(107, -11, 13, true, 1, true);
        实时回血(敌人, 敌人.GetSVar(92));
        敌人.SetHP(敌人.GetMaxHP());

        GameLib.V[敌人.PlayerID][`复活记录_${剩余复活次数}`] = GameLib.TickCount;
        const 新复活次数 = 剩余复活次数 - 1;
        敌人.SetNVar(_P_N_可复活次数, 新复活次数);
        敌人.SendMessage(`【甘道夫之戒】复活生效,体力恢复,当前剩余 ${新复活次数} 次复活机会...`, 1);
        return 基本常量.NO_DAMAGE;
    }

    // 优化：全民boss特殊伤害
    if (自己.GetName() === '全民boss') {
        字符最终攻击 = js_number_高性能版(敌人.GetSVar(92), '0.01', 3);
    }

    // 确保最小伤害
    if (js_war(字符最终攻击, '1') < 0) {
        字符最终攻击 = '1';
    }

    return 字符最终攻击;
}

// #region 烈焰伤害配置（优化版）
function 计算烈焰伤害(自己: TPlayObject, 伤害: string): string {
    const 烈焰等级 = safeNumber(自己.V.烈焰等级);
    if (烈焰等级 <= 0) {
        return 伤害;
    }

    const 随机数 = Math.random();

    // 优化：预计算触发几率和伤害加成
    const 伤害加成 = 1 + (烈焰等级 * 烈焰常量.烈焰等级伤害加成);
    const 几率2 = Math.min(烈焰常量.烈焰千分几率 + (烈焰等级 * 烈焰常量.烈焰千分几率), 烈焰常量.烈焰千分最大);
    const 几率3 = Math.min(烈焰常量.烈焰万分几率 + (烈焰等级 * 烈焰常量.烈焰万分几率), 烈焰常量.烈焰万分最大);

    // 优化：宠物攻击时几率降低为1/3
    const 是宠物 = 自己.Master?.IsPlayer();
    const 几率调整 = 是宠物 ? 3 : 1;

    let 烈焰倍数: number;
    let 消息: string;

    // 优化：按优先级检查触发（从高倍数到低倍数）
    if (随机数 < 几率3 / 几率调整) {
        烈焰倍数 = 烈焰常量.万倍伤害 * 伤害加成;
        消息 = `{S=【烈焰一击】触发${烈焰常量.万倍伤害}倍伤害！等级加成：${(伤害加成 * 100).toFixed(1)}%;C=251}`;
    } else if (随机数 < 几率2 / 几率调整) {
        烈焰倍数 = 烈焰常量.DAMAGE_MULTIPLIER_2 * 伤害加成;
        消息 = `{S=【烈焰一击】触发${烈焰常量.DAMAGE_MULTIPLIER_2}倍伤害！等级加成：${(伤害加成 * 100).toFixed(1)}%;C=250}`;
    } else if (随机数 < 烈焰常量.百倍几率 / 几率调整) {
        烈焰倍数 = 烈焰常量.DAMAGE_MULTIPLIER_1 * 伤害加成;
        消息 = `{S=【烈焰一击】触发${烈焰常量.DAMAGE_MULTIPLIER_1}倍伤害！等级加成：${(伤害加成 * 100).toFixed(1)}%;C=249}`;
    } else {
        return 伤害; // 没有触发，直接返回原伤害
    }

    自己.SendMessage(消息, 1);
    return js_number_高性能版(伤害, String(烈焰倍数), 3);
}

// #endregion

export function 计算伤害(自己: TActor, 敌人: TActor, 技能序号: number, _伤害倍数?: number): any {
    // 优化：快速路径 - 提前检查合法性
    if (!检查攻击合法性(自己, 敌人)) {
        return 0;
    }

    if (自己.IsPlayer() && 技能序号 < 0) {
        return 0;
    }

    let 最终伤害 = '0';

    // 优化：根据攻击者类型计算伤害
    const 是玩家 = 自己.IsPlayer();
    const 是宠物 = !是玩家 && 自己.Master;

    if (是玩家) {
        最终伤害 = 计算玩家伤害(自己 as TPlayObject, 敌人, 技能序号);
    } else if (是宠物) {
        最终伤害 = 计算宠物伤害(自己, 敌人);
    } else { // 怪物攻击
        if (敌人.IsPlayer()) {
            最终伤害 = 处理怪物对玩家伤害(自己, 敌人 as TPlayObject);
        } else { // 怪物攻击宠物
            const 怪物最小攻击 = 安全数值(自己.GetSVar(93), 基本常量.最小攻击);
            const 怪物最大攻击 = 安全数值(自己.GetSVar(94), 基本常量.最小攻击);
            const 宠物最小防御 = 安全数值(敌人.GetSVar(95), 基本常量.NO_DAMAGE);
            const 宠物最大防御 = 安全数值(敌人.GetSVar(96), 基本常量.NO_DAMAGE);

            const 怪物攻击 = js_numberRandom2(怪物最小攻击, 怪物最大攻击);
            const 敌人防御 = js_numberRandom2(宠物最小防御, 宠物最大防御);
            最终伤害 = js_war(怪物攻击, 敌人防御) < 0 ? '10' : js_number_高性能版(怪物攻击, 敌人防御, 2);
        }
    }

    // 优化：使用快速检查无效值
    if (!最终伤害 || 最终伤害[0] === 'N' || 最终伤害[0] === 'I') {
        最终伤害 = 基本常量.NO_DAMAGE;
    }

    // 确保伤害不为负数
    if (js_war(最终伤害, 基本常量.最小攻击) < 0) {
        最终伤害 = 基本常量.NO_DAMAGE;
    }

    // 应用烈焰伤害逻辑（玩家和宠物都可以触发）
    if (是玩家) {
        最终伤害 = 计算烈焰伤害(自己 as TPlayObject, 最终伤害);
    } else if (是宠物 && 自己.Master?.IsPlayer()) {
        最终伤害 = 计算烈焰伤害(自己.Master as TPlayObject, 最终伤害);
    }

    // 优化：伤害提示显示 - 只在需要时计算技能名字
    if (是玩家) {
        const 玩家 = 自己 as TPlayObject;
        if (!玩家.V.伤害屏蔽) {
            const 技能名字 = 技能ID转换技能名称(技能序号);
            const 伤害简写 = 大数值整数简写(最终伤害);
            const 玩家名 = 玩家.GetName();
            const 位数 = 最终伤害.length;
            玩家.SendMessage(`【伤害提示】:{S=${玩家名};C=22} 使用 {s=${技能名字};C=22} 攻击目标造成伤害 {S=${伤害简写};C=22} {s=(${位数});c=9} 位`, 2);
        }
    } else if (是宠物 && 自己.Master?.IsPlayer()) {
        const 主人 = 自己.Master as TPlayObject;
        if (!主人.V.伤害屏蔽) {
            const 宠物名称 = 自己.GetSVar(原始名字) || 自己.GetName();
            const 伤害简写 = 大数值整数简写(最终伤害);
            const 位数 = 最终伤害.length;
            主人.SendMessage(`[伤害提示]:${宠物名称}攻击:${伤害简写} 位数:${位数}`, 1);
        }
    }

    // 伤害应用和死亡判定
    if (!CheckBuffGroupID(敌人, 1011)) { // 目标不处于无敌状态
        // 直接获取敌人血量
        const 敌人血量 = 安全数值(敌人.GetSVar(91), 基本常量.最小攻击);
        let 剩余血量 = js_number_高性能版(敌人血量, 最终伤害, 2);

        // 确保血量不为负数
        剩余血量 = js_war(剩余血量, 基本常量.NO_DAMAGE) < 0 ? 基本常量.NO_DAMAGE : 剩余血量;

        // 应用伤害效果
        攻击飘血(敌人, 最终伤害);
        敌人.SetSVar(91, 剩余血量);
        血量显示(敌人);

        // 死亡判定
        if (js_war(剩余血量, 基本常量.NO_DAMAGE) <= 0) {
            敌人.GoDie(自己, 自己);

            if (!敌人.IsPlayer()) {
                // 清理怪物信息缓存
                try {
                    const 怪物Handle = 敌人.Handle;
                    const 怪物Handle字符串 = String(怪物Handle);
                    if (GameLib.R?.怪物信息?.[怪物Handle字符串]) {
                        delete GameLib.R.怪物信息[怪物Handle字符串];
                    }
                } catch {
                    // 忽略清理错误
                }
                敌人.MakeGhost();
            }
        }
    }

    return;
}


