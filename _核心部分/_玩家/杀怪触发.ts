import { TAG, 怪物鞭尸不复活, 原始名字 } from '../基础常量';
import { 装备属性统计 } from '../_装备/属性统计';
import { 增加击杀计数, 特殊BOSS死亡, 大陆BOSS死亡 } from '../_生物/生物刷新';
import { 执行掉落 } from '../_装备/爆率系统';
import { 取生物名字 } from '../世界配置';

/**
 * 杀怪触发 - 引擎杀怪事件入口
 * 由 QFunctionNpc.ts 的 onKillMonster 调用
 */
export function 杀怪触发(Player: TPlayObject, Monster: TActor): void {
    击杀生物(Player, Monster);
}

/**
 * 杀怪变异 - 击杀TAG3/4的怪时有几率在原地刷出TAG5的怪
 * 几率: 1/500
 */
export function 杀怪变异(Player: TPlayObject, Monster: TActor): void {
    // 只处理TAG3和TAG4的怪物
    const 怪物TAG = Monster.GetNVar(TAG) % 10;
    if (怪物TAG !== 3 && 怪物TAG !== 4) return;

    // 1/500 几率触发
    if (random(500) !== 0) return;

    // 获取地图信息
    const map = Monster.Map;
    if (!map) return;

    // 从显示名提取地图本名（去掉难度后缀如«困难»）
    const 显示名 = map.DisplayName || '';
    const 分隔位置 = 显示名.indexOf('«');
    const 地图本名 = 分隔位置 >= 0 ? 显示名.slice(0, 分隔位置) : 显示名;
    if (!地图本名) return;

    // 获取当前地图TAG5的怪物名字
    const 变异怪物名 = 取生物名字(地图本名, 5);
    if (!变异怪物名) return;

    // 在怪物死亡位置刷出1只TAG5的怪
    const X = Monster.MapX + 1;
    const Y = Monster.MapY + 1;
    GameLib.MonGenEx(map, 变异怪物名, 1, X, Y, 0, 0, 0, 5, true, true, true, true);

    // 全服提示
    Player.SendMessage(`{S=【变异】;C=253}击杀怪物触发变异！{S=${变异怪物名};C=249} 出现了！`, 1);
}

/**
 * 击杀生物函数 - 用于外部调用（如技能、道具等）
 *
 * @param Player 玩家对象
 * @param 敌人 目标生物
 * @param 执行次数 基础执行次数（默认1次）
 * @returns 实际执行次数（包含鞭尸加成）
 *
 * 说明：
 * - 基础执行次数 + 鞭尸次数 = 实际执行次数
 * - 例如：执行次数=1，鞭尸次数=1，则实际执行2次
 * - 鞭尸会额外调用 GoDie 并设置不复活标记
 */
export function 击杀生物(Player: TPlayObject, 敌人: TActor, 执行次数: number = 1): number {
    // 基础检查
    if (!Player || !敌人 || !Player.IsPlayer()) return 0;
    if (敌人.IsPlayer() || 敌人.Master) return 0;
    if (敌人.GetSVar(原始名字) === '全民boss') return 0;

    // 防重入：鞭尸GoDie会再次触发onKillMonster，跳过重复处理
    if (Player.R.击杀处理中) return 0;
    Player.R.击杀处理中 = true;

    try {
        // 计算实际执行次数 = 基础次数 + 鞭尸次数
        let 实际执行次数 = 执行次数;
        let 触发鞭尸 = false;

        // 杀怪变异（不享受鞭尸加成，只触发一次）
        杀怪变异(Player, 敌人);

        // 鞭尸加成：如果触发鞭尸，额外增加鞭尸次数
        if (random(100) < (Player.R.鞭尸几率 || 0)) {
            触发鞭尸 = true;
            实际执行次数 += (Player.R.最终鞭尸次数 || 0);
            // 设置不复活标记
            敌人.SetNVar(怪物鞭尸不复活, 1);
            // 鞭尸触发提示
            if (Player.V.鞭尸提示) {
                Player.SendCountDownMessage(`{S=【鞭尸】;C=253}触发！怪物被揉虐了 {S=${实际执行次数};C=191} 次`, 0);
            }
        }

        // 执行掉落和其他计算
        for (let i = 0; i < 实际执行次数; i++) {
            执行掉落(Player, 敌人);

            // 累加杀怪数量
            坐骑升级(Player)
            Player.V.杀怪数量 = (Player.V.杀怪数量 || 0) + 1;

            // 增加击杀计数（享受鞭尸加成）
            const 地图ID = 敌人.Map?.MapName;
            if (地图ID) {
                增加击杀计数(地图ID);
            }

            // 鞭尸额外 GoDie（第一次已在外部调用，这里只处理额外次数）
            if (触发鞭尸 && i > 0) {
                敌人.GoDie(Player, Player);
            }
        }

        // 特殊BOSS/大陆BOSS死亡触发（只触发一次，不受鞭尸影响）
        const 地图ID = 敌人.Map?.MapName;
        const 怪物TAG = 敌人.GetNVar(TAG) % 10;
        if (地图ID) {
            if (怪物TAG === 7) {
                特殊BOSS死亡(地图ID);
            } else if (怪物TAG === 6) {
                大陆BOSS死亡(地图ID);
            }
        }

        return 实际执行次数;
    } finally {
        Player.R.击杀处理中 = false;
    }
}

export function 坐骑升级(Player: TPlayObject) {
    // 检查玩家坐骑位装备
    const 坐骑装备 = Player.Mount;
    if (!坐骑装备) return;

    // 根据名字获取等级
    const 坐骑名字 = 坐骑装备.DisplayName;
    const 等级匹配 = 坐骑名字.match(/『(\d+)阶』/);
    if (!等级匹配) return;

    const 当前等级 = parseInt(等级匹配[1]);
    if (当前等级 >= 100) return; // 最高等级100级

    // 获取OUTWAY信息
    const 当前杀怪数量 = Player.V.杀怪数量 || 0;

    // 计算需要升级的数量
    let 升级所需数量 = 0;
    if (当前等级 < 10) {
        升级所需数量 = 2 * 500;
    } else if (当前等级 < 30) {
        升级所需数量 = 2 * 2000;
    } else if (当前等级 < 50) {
        升级所需数量 = 2 * 4000;
    } else if (当前等级 < 70) {
        升级所需数量 = 2 * 6000;
    } else if (当前等级 < 90) {
        升级所需数量 = 2 * 8000;
    } else if (当前等级 < 100) {
        升级所需数量 = 2 * 10000;
    }
    坐骑装备.SetOutWay1(40, 4);
    坐骑装备.SetOutWay2(40, 当前杀怪数量);
    坐骑装备.SetOutWay3(40, 升级所需数量);
    Player.UpdateItem(坐骑装备);

    // 检查是否可以升级
    if (当前杀怪数量 >= 升级所需数量) {
        const 新等级 = 当前等级 + 1;

        // 更新坐骑名字
        const 新名字 = 坐骑名字.replace(/『\d+阶』/, `『${新等级}阶』`);
        坐骑装备.Rename(新名字);

        // 重置杀怪数量
        Player.V.杀怪数量 = 0;

        // 赋予属性加成 (OUTWAY1 1-6位置)
        const 属性ID列表 = [116, 117, 118, 119, 120, 121]; // 攻击、魔法、道术、刺术、箭术、武术百分比
        const 属性值 = 新等级 * 5;

        for (let i = 0; i < 属性ID列表.length; i++) {
            坐骑装备.SetOutWay1(i, 属性ID列表[i]);
            坐骑装备.SetOutWay2(i, 属性值);
        }

        // 设置OUTWAY2和OUTWAY3
        坐骑装备.SetOutWay1(40, 4);
        坐骑装备.SetOutWay2(40, 当前杀怪数量);
        坐骑装备.SetOutWay3(40, 升级所需数量);

        坐骑装备.SetBind(true);
        坐骑装备.SetNeverDrop(true);
        坐骑装备.State.SetNoDrop(true);
        Player.UpdateItem(坐骑装备);

        // 存储到JSON（用于属性统计）
        const 装备属性记录 = {
            职业属性_职业: 属性ID列表,
            职业属性_属性: 属性ID列表.map(() => String(属性值))
        };
        坐骑装备.SetCustomDesc(JSON.stringify(装备属性记录));
        装备属性统计(Player)

        // 发送升级消息
        Player.SendMessage(`【坐骑升级】恭喜！坐骑升级至${新等级}阶！`, 2);
        Player.SendCountDownMessage(`【坐骑升级】${新名字} 升级成功！`, 0);
    }
}
