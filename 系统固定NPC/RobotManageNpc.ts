/*机器人*/
import { 获取玩家范围内目标, 获取目标范围内目标 } from "./MagicNpc"

import {
    _P_N_可复活次数
} from "../_核心部分/基础常量"
import * as 基础常量 from "../_核心部分/基础常量"
import * as 生物刷新 from "../_核心部分/_生物/生物刷新"

import { 大数值整数简写, 实时回血, 血量显示 } from "../_核心部分/字符计算"
import { 智能计算, js_war, 大于等于, 大于, 小于等于 } from "../_大数值/核心计算方法";

import * as 地图 from '../_核心部分/_地图/地图'

import { 一键存入所有材料 } from "../_核心部分/_服务/材料仓库"
import { RobotPlugIn } from "../_核心部分/_服务/_GN_Monitoring";
import { 检查津贴状态, 津贴时间扣除 } from "../_核心部分/_服务/主神津贴"
import { 装备属性统计 } from "../_核心部分/_装备/属性统计"
import { 自动回收提示 } from "../_核心部分/_装备/装备回收"
import { 自动合成斗笠 } from "../_核心部分/_服务/极品斗笠"


/*一秒执行*/
export function 个人1秒(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    // 使用计数器减少高频操作的执行频率
    Player.R.性能计数器 ??= 0
    Player.R.性能计数器++

    // ==================== 圣耀副本爆率检测 ====================
    地图.离开圣耀副本检测(Player)

    // ==================== 特殊BOSS击杀进度显示 ====================
    const 地图ID = Player.GetMapName()
    const 击杀进度 = 生物刷新.获取击杀进度(地图ID)
    if (击杀进度.需要击杀 > 0) {
        let 进度提示 = ''
        if (击杀进度.特殊BOSS存活) {
            进度提示 = `{S=特殊BOSS已刷新!;C=251}`
        } else {
            const 百分比 = Math.floor((击杀进度.当前击杀 / 击杀进度.需要击杀) * 100)
            进度提示 = `{S=特殊BOSS进度: ${击杀进度.当前击杀}/${击杀进度.需要击杀} (${百分比}%)}`
        }
        let 击杀进度Buff = Player.AddIntervalBuff(99, TBuffIntervalType.biNone, 0, 0, 0, 0)
        Player.SetBuffIcon(击杀进度Buff.Handle, 'magicon.wzl', 2330, 2330, ``, '', 进度提示, false, false)
    }

    // 自动吃道具：每2秒执行一次
    if (Player.R.性能计数器 % 2 === 0) {
        if (Player.V.自动吃元宝) {
            自动吃元宝(Npc, Player, Args)
        }
        if (Player.V.自动吃等级丹) {
            自动吃等级丹(Npc, Player, Args)
        }
    }

    // ==================== 金币/元宝自动兑换 ====================
    if (Player.GetGold() >= 2000000000) {
        let 兑换元宝 = 1200000
        if (GameLib.ServerName.includes('包区')) {
            兑换元宝 = 1800000
        } else if (GameLib.V.是新区 === true) {
            兑换元宝 = 1600000
        }
        Player.SetGold(Player.GetGold() - 2000000000)
        Player.SetGameGold(Player.GetGameGold() + 兑换元宝)
        Player.GoldChanged()
        Player.SendMessage(`使用{S=2000000000金币;C=154}成功兑换了{S=${兑换元宝}元宝;C=154}`, 1)
    }

    if (Player.GetGameGold() >= 1800000000) {
        Player.SetGameGold(Player.GetGameGold() - 1800000000)
        Player.SetGamePoint(Player.GetGamePoint() + 15000000)
        Player.GoldChanged()
        Player.SendMessage(`使用{S=1800000000元宝;C=154}成功兑换了{S=15000000点礼卷;C=154}`, 1)
    }

    复活触发(Npc, Player, Args)
    自动施法(Npc, Player, Args)

    // ==================== 间隔保护 ====================
    if (Player.R.开启挂机 && Player.V.自动随机 && Player.V.随机读秒 > 0) {
        Player.R.随机秒数 ??= 0
        Player.R.随机秒数++
        if (Player.R.随机秒数 >= Player.V.随机读秒) {
            Player.R.随机秒数 = 0
            Player.RandomMove(Player.GetMapName())
        }
    }

    if (Player.V.血量保护 && !Player.GetDeath() && !Player.InSafeZone) {
        Player.R.血量保护间隔执行 += 1
        if (Player.R.血量保护间隔执行 >= Player.V.血量保护间隔) {
            Player.R.血量保护间隔执行 = 0
            const 回血量 = 智能计算(Player.GetSVar(92), '0.01', 3)
            实时回血(Player, 回血量)
        }
    }

    if (Player.V.随机保护 && !Player.GetDeath() && !Player.InSafeZone) {
        Player.R.随机保护间隔执行 += 1
        const 保护血量 = 智能计算(Player.GetSVar(92), String(Player.V.随机保护百分比 / 100), 3)
        if (Player.R.随机保护间隔执行 >= Player.V.随机保护间隔 && 小于等于(Player.GetSVar(91), 保护血量)) {
            const AActorList = Player.Map.GetActorListInRange(Player.GetMapX(), Player.GetMapY(), 8, '');
            for (let i = 0; i < AActorList.Count; i++) {
                let Actor = AActorList.Actor(i);
                if (Actor && !Actor.GetDeath() && !Actor.IsNPC() && Actor.GetHandle() != Player.GetHandle() && Actor.IsPlayer()) {
                    return
                }
            }
            Player.R.随机保护间隔执行 = 0
            Player.RandomMove(Player.GetMapName())
        }
    }

    // ==================== 隐身戒指检测 ====================
    let Magic: TUserMagic
    Magic = Player.FindSkill('隐身开关');
    if (Player.GetJewelrys(4) != null && Player.GetJewelrys(4).GetName() == '甘道夫之戒') {
        if (Magic == null) {
            Player.AddSkill('隐身开关');
        }
    } else {
        if (Magic) {
            Player.DelSkill('隐身开关');
            Player.AddStatusBuff(6, TBuffStatusType.stObserverForMon, -1, 0, 0)
        }
    }
}
export function 测试5秒(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 地图.分钟检测副本玩家数量()
    // _M_Robot.按分钟检测(Player)
    Player = GameLib.FindPlayer('很好'); //查找玩家
    if (Player != null) {
        // Player.SetSVar(92, 转大数值('1e100'))
        // // Player.SetSVar(91 , '1e100') 
        // 实时回血(Player, '1e100')
        // 血量显示(Player);
        // const Magic = Player.FindSkill('暗影附体');
        // console.log(`cd:${Magic.GetUseTime()}ssssss${Magic.CDTime}`)
        // // Magic.SetUseTime(0)
        // Magic.GetKey
        // console.log(Magic.GetKey())
        // GameLib.SetClientSpeed(1000)
        // GameLib.SendChangeClientSpeed()

    }

    //    // GameLib.MonGenEx( Player.Map , '多钩猫', 30, 120, 120, 30, 0, 0, 1, true, true, true, true)

    // _M_Robot.按分钟检测(Player)


}

export function 全局1秒(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 新刷怪系统：检测玩家首次进入地图，10秒后刷全怪
    生物刷新.秒钟检测首次刷怪()
}

/*十秒执行*/
export function 个人10秒(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 监控外挂
    RobotPlugIn(Player);

    // 检查主神津贴状态
    检查津贴状态(Player);

    // 自动回收提示（累计10秒内的回收数据）
    if (Player.R.累计回收金币 > 0) {
        自动回收提示(Player);
    }

    if (Player.V.开启挂机) {
        Player.ReloadBag()
    }

    if (Player.V.材料入仓) {
        一键存入所有材料(Npc, Player, Args)
    }
}

/*每分钟执行（个人）*/
export function 个人1分钟(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 扣除主神津贴时间（每分钟-1）
    津贴时间扣除(Player);

    // 极品斗笠自动合成（每分钟检查一次）
    if(Player.V.合成斗笠){
        自动合成斗笠(Player);
    }
}

/*每30S检测一次*/
export function 全局30秒(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 新刷怪系统：定时补怪检测
    生物刷新.定时补怪检测()
    // 新刷怪系统：特殊BOSS刷新检测(击杀2000怪触发)
    生物刷新.特殊BOSS刷新检测()
}

/*每1分钟检测一次*/
export function 全局1分钟(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 统一全局分钟计数器，替代多个独立计数器
    GameLib.R.全局分钟计数 ??= 0
    GameLib.R.全局分钟计数++

    地图.副本清理()

    // 圣耀副本清理：24小时到期或无人30分钟后删除
    地图.圣耀副本清理()

    // 新刷怪系统：无人地图清理
    生物刷新.清理无人地图怪物()

    // 大陆BOSS刷新检测(TAG 6)：每2小时在当前大陆所有地图刷新
    生物刷新.大陆BOSS刷新检测()

    // 五分钟全面补怪
    if (GameLib.R.全局分钟计数 % 5 === 0) {
        生物刷新.五分钟全面补怪()
    }

    // 定期重载脚本引擎（每10分钟）
    if (GameLib.R.全局分钟计数 % 30 === 0) {
        GameLib.ReLoadScriptEngine();
    }

    // ==================== 新区状态检测 ====================
    GameLib.V.是新区 ??= true
    if (GameLib.V.是新区 === true) {
        GameLib.V.开区分钟数 ??= 0
        GameLib.V.开区分钟数++

        // 7天 = 10080分钟
        if (GameLib.V.开区分钟数 >= 10080) {
            GameLib.V.是新区 = false
            GameLib.BroadcastTopMessage(`服务器已开区满7天，新区状态已取消！`)
            console.log(`[系统] 服务器开区${Math.floor(GameLib.V.开区分钟数 / 1440)}天，新区状态已取消`)
        }
    }
}


/*1秒执行复活次数*/
export function 复活触发(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.GetJewelrys(4) && Player.GetJewelrys(4).GetName() == '甘道夫之戒') {
        let AItem = Player.GetJewelrys(4)
        let 复活冷却时间 = 180 - AItem.GetOutWay3(40) * 10
        let n = Object.keys(GameLib.V[Player.PlayerID])
        if (n.length > 0) {
            for (let v = 0; v <= n.length - 1; v++) {
                let 计算复活冷却时间 = Trunc((GameLib.TickCount - GameLib.V[Player.PlayerID][n[v]]) / 1000)
                if (计算复活冷却时间 >= 复活冷却时间) {
                    Player.SetNVar(_P_N_可复活次数, Player.GetNVar(_P_N_可复活次数) + 1)
                    delete GameLib.V[Player.PlayerID][n[v]]
                }
            }
        } else {
            Player.SetNVar(_P_N_可复活次数, AItem.GetOutWay3(40))
        }
    }
}

export function 全局每日清理(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    delete GameLib.V.每日回收神器次数
    delete GameLib.V.每日宣传兑换次数
}

export function 个人每日清理(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.每日宣传兑换次数 = 0
    Player.V.今日神器回收 = 0
}


// ==================== 自动吃道具 ====================

const 等级石配置 = [
    10000, 9500, 9000, 8500, 8000, 7500, 7000, 6500, 6000, 5500,
    5000, 4500, 4000, 3500, 3000, 2500, 2000, 1500, 1000, 500
];

export function 自动吃等级丹(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    for (const 等级上限 of 等级石配置) {
        const 道具名 = `等级石(${等级上限})`
        if (Player.Level <= 等级上限 && Player.GetItemCount(道具名) > 0) {
            const 可用数量 = Player.GetItemCount(道具名)
            const 批量数量 = Math.min(可用数量, 5, 等级上限 - Player.Level)

            for (let i = 0; i < 批量数量; i++) {
                if (Player.Level <= 等级上限) {
                    Npc.Take(Player, 道具名, 1)
                    Player.Level += 1
                } else {
                    break
                }
            }
            break;
        }
    }
}

const 元宝道具配置 = [
    { 名称: '10000元宝', 数值: 10000, 类型: 'gold' },
    { 名称: '5000元宝', 数值: 5000, 类型: 'gold' },
    { 名称: '2000元宝', 数值: 2000, 类型: 'gold' },
    { 名称: '1000元宝', 数值: 1000, 类型: 'gold' },
    { 名称: '500元宝', 数值: 500, 类型: 'gold' },
    { 名称: '200元宝', 数值: 200, 类型: 'gold' },
    { 名称: '100元宝', 数值: 100, 类型: 'gold' },
    { 名称: '50元宝', 数值: 50, 类型: 'gold' },
    { 名称: '20元宝', 数值: 20, 类型: 'gold' },
    { 名称: '5元宝', 数值: 5, 类型: 'gold' },
    { 名称: '1元宝', 数值: 1, 类型: 'gold' },
    { 名称: '100礼券', 数值: 100, 类型: 'point' },
    { 名称: '10礼券', 数值: 10, 类型: 'point' },
    { 名称: '1礼券', 数值: 1, 类型: 'point' }
];

export function 自动吃元宝(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 有更新 = false

    for (const 道具 of 元宝道具配置) {
        const 数量 = Player.GetItemCount(道具.名称)
        if (数量 > 0) {
            const 批量处理数量 = Math.min(数量, 10)
            for (let i = 0; i < 批量处理数量; i++) {
                Npc.Take(Player, 道具.名称, 1)
                if (道具.类型 === 'gold') {
                    Player.SetGameGold(Player.GetGameGold() + 道具.数值)
                } else {
                    Player.SetGamePoint(Player.GetGamePoint() + 道具.数值)
                }
            }
            有更新 = true
            break;
        }
    }

    if (有更新) {
        Player.GoldChanged()
    }
}

// ==================== 自动施法系统 ====================

export function 自动施法(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.R.施法读秒 ??= 0
    Player.R.施法读秒++

    const V = Player.V;
    const R = Player.R;
    let Magic: TUserMagic;

    // 通用变量
    const 最大血量 = Player.GetSVar(92);
    const 当前血量 = Player.GetSVar(91);
    // mode 5 = 除法保留2位小数
    const 剩余血量百分比 = 智能计算(智能计算(当前血量, 最大血量, 5), '100', 3);

    // ==================== 天枢职业 ====================
    if (V.职业 === '天枢' && !Player.InSafeZone) {
        if (V.自动_怒斩) {
            Magic = Player.FindSkill('怒斩');
            if (Magic) {
                const 最近目标 = 获取周围最近目标(Player, 8);
                if (最近目标) {
                    Player.MagicAttack(最近目标, 基础常量.技能ID.天枢.怒斩);
                }
            }
        }
    }

    // ==================== 血神职业 ====================
    if (V.职业 === '血神' && !Player.InSafeZone) {

        // 血气献祭：血量 >= 5% 时对最近敌人施法
        if (V.自动_血气献祭 && 大于等于(剩余血量百分比, '5')) {
            Magic = Player.FindSkill('血气献祭');
            if (Magic) {
                const 最近目标 = 获取周围最近目标(Player, 8);
                if (最近目标) {
                    Player.MagicAttack(最近目标, 基础常量.技能ID.血神.血气献祭);
                }
            }
        }

        // 血魔临身：CD 180秒，开启后每秒回血
        Player.R.血魔临身CD ??= 0;
        Player.R.血魔临身持续CD ??= 0;
        if (V.自动_血魔临身 && !R.血魔临身) {
            Player.R.血魔临身CD += 1;
            if (Player.R.血魔临身CD >= 180) {
                Magic = Player.FindSkill('血魔临身');
                if (Magic) {
                    R.血魔临身 = true;
                    Player.R.血魔临身CD = 0;
                    const 技能等级 = Player.V.血魔临身等级 || 1;
                    const 持续时间 = Math.min(30 + Math.floor(技能等级 / 5), 180);
                    Player.R.血魔临身持续CD = 持续时间;
                    Player.MagicAttack(Player, 基础常量.技能ID.血神.血魔临身, true);
                    Player.SetCustomEffect(基础常量.永久特效.血魔临身, 基础常量.特效.血魔临身);
                    Player.SendMessage(`血魔临身开启，持续${持续时间}秒`, 2);
                }
            }
        }

        // 血魔临身持续效果：每秒回血
        if (R.血魔临身) {
            Player.R.血魔临身CD += 1;
            if (Player.R.血魔临身持续CD > 0) {
                const 技能等级 = Player.V.血魔临身等级 || 1;
                const 回血百分比 = 1 + Math.floor(技能等级 / 5);
                if (js_war(当前血量, 最大血量) < 0) {
                    const 回血量 = 智能计算(最大血量, String(回血百分比 / 100), 3);
                    实时回血(Player, 回血量);
                    Player.R.血魔临身持续CD--;
                }
            } else {
                R.血魔临身 = false;
                Player.SetCustomEffect(基础常量.永久特效.血魔临身, -1);
                Player.SendMessage('血魔临身效果已结束!', 2);
            }
        }

        // 血气燃烧：每秒消耗1%血量，血量低于10%自动关闭
        if (V.自动_血气燃烧 && !R.血气燃烧 && 大于(剩余血量百分比, '10')) {
            R.血气燃烧 = true;
            Player.SetCustomEffect(基础常量.永久特效.血气燃烧, 基础常量.特效.血气燃烧);
            Player.SendMessage('血气燃烧开启', 2);
        }

        if (R.血气燃烧) {
            let 当前血量_燃烧 = Player.GetSVar(91);
            const 最大血量_燃烧 = Player.GetSVar(92);
            // 10% 血量阈值 = 最大血量 * 0.1
            if (js_war(当前血量_燃烧, 智能计算(最大血量_燃烧, '0.1', 3)) <= 0) {
                R.血气燃烧 = false;
                Player.SetCustomEffect(基础常量.永久特效.血气燃烧, -1);
                Player.SendMessage('血量低于10%,血气燃烧自动关闭!', 2);
            } else {
                // 消耗1%血量 = 最大血量 * 0.01
                当前血量_燃烧 = 智能计算(当前血量_燃烧, 智能计算(最大血量_燃烧, '0.01', 3), 2);
                Player.SetSVar(91, 当前血量_燃烧);
                血量显示(Player);
                const 范围 = 5 + (R.血气燃烧范围 || 0);
                const 目标列表 = 获取玩家范围内目标(Player, 范围);
                for (const 目标 of 目标列表) {
                    Player.Damage(目标, 1, 基础常量.技能ID.血神.血气燃烧);
                }
            }
        }
    }

    // ==================== 暗影职业 ====================
    if (V.职业 === '暗影' && !Player.InSafeZone) {

        // 暗影袭杀
        if (V.自动_暗影袭杀) {
            Magic = Player.FindSkill('暗影袭杀');
            if (Magic) {
                const 最近目标 = 获取周围最近目标(Player, 8);
                if (最近目标) {
                    if (R.暗影袭杀范围 > 0) {
                        const 目标列表 = 获取目标范围内目标(Player, 最近目标, R.暗影袭杀范围);
                        for (const 目标 of 目标列表) {
                            Player.MagicAttack(目标, 基础常量.技能ID.暗影.暗影袭杀, true);
                        }
                    } else {
                        Player.MagicAttack(最近目标, 基础常量.技能ID.暗影.暗影袭杀, true);
                    }
                }
            }
        }

        // 暗影风暴：CD 20秒，消耗5点暗影值
        Player.R.暗影风暴CD ??= 0;
        if (V.自动_暗影风暴) {
            Player.R.暗影风暴CD += 1;
            if (Player.R.暗影风暴CD >= 20 && R.暗影值 >= 5) {
                Magic = Player.FindSkill('暗影风暴');
                if (Magic) {
                    const 最近目标 = 获取周围最近目标(Player, 8);
                    if (最近目标) {
                        Player.MagicAttack(最近目标, 基础常量.技能ID.暗影.暗影风暴, true);
                        Player.R.暗影风暴CD = 0;
                    }
                }
            }
        }

        // 暗影附体：CD 180秒，消耗180点暗影值
        Player.R.暗影附体CD ??= 0;
        if (V.自动_暗影附体 && !R.暗影附体) {
            Player.R.暗影附体CD += 1;
            if (Player.R.暗影附体CD >= 180 && R.暗影值 >= 180) {
                Magic = Player.FindSkill('暗影附体');
                if (Magic) {
                    let 暗影Buff = Player.AddIntervalBuff(1, TBuffIntervalType.biNone, 0, 0, 0, 0);
                    Player.SetBuffIcon(暗影Buff.Handle, 'magicon.wzl', 2312, 2312, '', '', `{S=当前暗影值: ${R.暗影值} 点}`, true, true);
                    Player.MagicAttack(Player, 基础常量.技能ID.暗影.暗影附体, true);
                    Player.R.暗影附体CD = 0;
                }
            }
        }

        // 暗影剔骨：每秒消耗1点暗影值
        if (V.自动_暗影剔骨 && !R.暗影剔骨 && R.暗影值 >= 1) {
            R.暗影剔骨 = true;
            Player.SetCustomEffect(基础常量.永久特效.暗影剔骨, 基础常量.特效.暗影剔骨);
            Player.SendMessage('暗影剔骨开启', 2);
        }

        if (R.暗影剔骨) {
            if (R.暗影值 < 1) {
                R.暗影剔骨 = false;
                Player.SetCustomEffect(基础常量.永久特效.暗影剔骨, -1);
                Player.SendMessage('暗影值不足,暗影剔骨自动关闭!', 2);
            } else {
                R.暗影值 = R.暗影值 - 1;
                装备属性统计(Player);
                let 暗影Buff = Player.AddIntervalBuff(1, TBuffIntervalType.biNone, 0, 0, 0, 0);
                Player.SetBuffIcon(暗影Buff.Handle, 'magicon.wzl', 2312, 2312, '', '', `{S=当前暗影值: ${R.暗影值} 点}`, true, true);
                const 范围 = 6 + (R.暗影剔骨范围 || 0);
                const 目标列表 = 获取玩家范围内目标(Player, 范围);
                for (const 目标 of 目标列表) {
                    Player.Damage(目标, 1, 基础常量.技能ID.暗影.暗影剔骨);
                }
            }
        }
    }

    // ==================== 烈焰职业 ====================
    if (V.职业 === '烈焰' && !Player.InSafeZone) {

        // 火焰追踪：每秒对最近敌人施法
        if (V.自动_火焰追踪) {
            Magic = Player.FindSkill('火焰追踪');
            if (Magic) {
                const 最近目标 = 获取周围最近目标(Player, 10);
                if (最近目标) {
                    Player.MagicAttack(最近目标, 基础常量.技能ID.烈焰.火焰追踪);
                }
            }
        }

        // 烈焰护甲：开启状态检测
        if (V.自动_烈焰护甲 && !Player.R.烈焰护甲) {
            Player.R.烈焰护甲 = true;
            Player.SetCustomEffect(基础常量.永久特效.烈焰护甲, 基础常量.特效.烈焰护甲);
            Player.SendMessage('烈焰护甲开启', 2);
        }

        // 烈焰护甲持续效果：每2秒对周围4格造成伤害
        if (R.烈焰护甲 && R.施法读秒 % 2 === 0) {
            const AActorList = Player.Map.GetActorListInRange(Player.MapX, Player.MapY, 4);
            for (let i = 0; i < AActorList.Count; i++) {
                const Actor = AActorList.Actor(i);
                if (Actor && !Actor.GetDeath() && !Actor.IsNPC() && Actor.GetHandle() !== Player.GetHandle() && !Actor.IsPlayer() && !Actor.Master) {
                    Player.Damage(Actor, 1, 基础常量.技能ID.烈焰.烈焰护甲);
                }
            }
        }
    }

    // ==================== 正义职业 ====================
    if (V.职业 === '正义' && !Player.InSafeZone) {

        if (V.自动_正义 && !Player.R.圣光) {
            Player.R.圣光 = true;
            Player.SetCustomEffect(基础常量.永久特效.圣光, 基础常量.特效.圣光);
            Player.SendMessage('圣光光环开启', 2);
        }

        // 圣光光环：每秒对周围目标造成伤害
        if (R.圣光) {
            const 范围 = 6 + (R.正义范围 || 0);
            const 目标列表 = 获取玩家范围内目标(Player, 范围);
            for (const 目标 of 目标列表) {
                Player.Damage(目标, 1, 基础常量.技能ID.正义.圣光);
            }
        }
    }

    // ==================== 不动职业 ====================
    if (V.职业 === '不动' && !Player.InSafeZone) {
        const 护盾值 = Player.R.人王盾护盾值 || '0'
        let 暗影猎取 = Player.AddIntervalBuff(1, TBuffIntervalType.biNone, 0, 0, 0, 0)
        Player.SetBuffIcon(暗影猎取.Handle, 'magicon.wzl', 2201, 2201, ``, '', `{S=当前人王盾: }{S=${大数值整数简写(护盾值)};C=21}{S= 点}`, true, true)

        // 人王盾：CD 10秒自动释放
        if (R.人王盾自动施法 && !Player.R.人王盾开启) {
            R.人王盾CD ??= 0;
            R.人王盾CD++;
            if (R.人王盾CD >= 10) {
                R.人王盾CD = 0;
                Magic = Player.FindSkill('人王盾');
                if (Magic) {
                    Player.R.人王盾开启 = true;
                    Player.MagicAttack(Player, 基础常量.技能ID.不动.人王盾);
                }
            }
        }

        // 金刚掌：对最近敌人施法
        if (R.金刚掌自动施法) {
            Magic = Player.FindSkill('金刚掌');
            if (Magic) {
                const 最近目标 = 获取周围最近目标(Player, 8);
                if (最近目标) {
                    Player.MagicAttack(最近目标, 基础常量.技能ID.不动.金刚掌);
                }
            }
        }

        // 如山：每秒对周围目标造成伤害
        if (R.如山) {
            const 范围 = 5 + (R.如山范围 || 0);
            const 目标列表 = 获取玩家范围内目标(Player, 范围);
            for (const 目标 of 目标列表) {
                Player.Damage(目标, 1, 基础常量.技能ID.不动.如山);
            }
        }
    }
}


// ==================== 工具函数 ====================

// 两点之间的距离
export function 取两点距离(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 获取玩家周围指定范围内最近的一个目标
 */
export function 获取周围最近目标(Player: TPlayObject, 范围: number): TActor | null {
    if (范围 <= 0) return null;

    const AActorList = Player.Map.GetActorListInRange(Player.MapX, Player.MapY, 范围);
    let 最近目标: TActor | null = null;
    let 最近距离 = Infinity;
    const playerHandle = Player.GetHandle();

    for (let i = 0; i < AActorList.Count; i++) {
        const Actor = AActorList.Actor(i);
        if (Actor && !Actor.GetDeath() && !Actor.IsNPC() && Actor.GetHandle() !== playerHandle && !Actor.IsPlayer() && !Actor.Master) {
            const 距离 = 取两点距离(Player.MapX, Player.MapY, Actor.MapX, Actor.MapY);
            if (距离 < 最近距离) {
                最近距离 = 距离;
                最近目标 = Actor;
            }
        }
    }

    return 最近目标;
}
