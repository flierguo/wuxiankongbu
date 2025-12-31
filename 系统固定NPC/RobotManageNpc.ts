/*机器人*/
import { 获取玩家范围内目标, 获取目标范围内目标 } from "./MagicNpc"

import { RobotPlugIn } from "../功能脚本组/[功能]/_GN_Monitoring"
import {
    _P_N_监狱计时, _P_N_可复活次数, 技能ID
} from "../_核心部分/基础常量"
import * as _P_Base from "../_核心部分/基础常量"
import * as _M_Robot from "../功能脚本组/[怪物]/_M_Robot"
import * as 生物刷新 from "../_核心部分/_生物/生物刷新"
import { _M_N_宝宝释放群雷, _M_N_猎人宝宝群攻 } from "../功能脚本组/[怪物]/_M_Base"

import { 实时回血, 血量显示 } from "../核心功能/字符计算"
import { 智能计算, 转大数值, js_百分比, js_范围随机, js_war } from "../大数值/核心计算方法";

import { 人物额外属性计算 } from "../核心功能/装备属性统计"
import * as 地图 from '../_核心部分/_地图/地图'
import * as 刷怪 from '../功能脚本组/[怪物]/_M_Refresh'

import { 按分钟检测清理, 深度清理, 获取清理性能统计 } from '../核心功能/清理冗余数据'
// 导入装备属性统计优化


import { 一键存入所有材料 } from "../功能脚本组/[服务]/材料仓库"




/*一秒执行*/
export function 个人1秒(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    // 🚀 性能优化：使用计数器减少高频操作的执行频率
    Player.R.性能计数器 ??= 0
    Player.R.性能计数器++

    // ==================== 圣耀副本爆率检测 ====================
    // 每秒检测玩家是否离开圣耀副本，取消爆率加成
    地图.离开圣耀副本检测(Player)

    // 🚀 性能优化：自动回收改为每5秒执行一次，而非每秒
    if (Player.V.自动回收 && Player.R.性能计数器 % 5 === 0) {
        // 回收装备(Npc, Player, Args)
    }
    if (Player.V.开启挂机 && Player.R.性能计数器 % 5 === 0) {
        Player.ReloadBag()
    }
    if (Player.V.自动吃圣墟点数 && Player.R.性能计数器 % 60 === 0) {
        自动吃圣墟点数(Npc, Player, Args)
    }
    // 🚀 性能优化：自动吃道具改为每2秒执行一次
    if (Player.R.性能计数器 % 2 === 0) {
        if (Player.V.自动吃元宝) {
            自动吃元宝优化版(Npc, Player, Args)
        }
        if (Player.V.自动吃等级丹) {
            自动吃等级丹优化版(Npc, Player, Args)
        }

    }

    if (Player.GetGold() >= 2000000000) {
        if (GameLib.ServerName.includes('包区')) {
            Player.SetGold(Player.GetGold() - 2000000000)
            Player.SetGameGold(Player.GetGameGold() + 2000000)
            Player.GoldChanged()
            Player.SendMessage(`使用{S=2000000000金币;C=154}成功兑换了{S=2000000元宝;C=154}`, 1)
        } else if (GameLib.V.判断新区 == true) {
            Player.SetGold(Player.GetGold() - 2000000000)
            Player.SetGameGold(Player.GetGameGold() + 1200000)
            Player.GoldChanged()
            Player.SendMessage(`使用{S=2000000000金币;C=154}成功兑换了{S=1200000元宝;C=154}`, 1)
        } else {
            Player.SetGold(Player.GetGold() - 2000000000)
            Player.SetGameGold(Player.GetGameGold() + 1600000)
            Player.GoldChanged()
            Player.SendMessage(`使用{S=2000000000金币;C=154}成功兑换了{S=1600000元宝;C=154}`, 1)
        }
    }

    if (Player.GetGameGold() >= 1800000000) {
        Player.SetGameGold(Player.GetGameGold() - 1800000000)
        Player.SetGamePoint(Player.GetGamePoint() + 15000000)   //兑换15000000点礼卷
        Player.GoldChanged()
        Player.SendMessage(`使用{S=1800000000元宝;C=154}成功兑换了{S=15000000点礼卷;C=154}`, 1)
    }

    复活触发(Npc, Player, Args)
    // Player.SetHP(Player.GetMaxHP())
    自动施法(Npc, Player, Args)


    //测试用 
    // Player.R.伤害提示 = true;
    // Player.V.宣传回收 = 0;
    // 人物额外属性计算(Player);
    //     Debug( Player.GetName() +'::' + Player.V.鞭尸几率   + '/' + Player.V.鞭尸几率_魔戒  +` + ` + Player.V.真实充值 + ` + `+ Player.V.永久极品率 );
    // 属性按钮(Npc,Player)
    // weaponCaption(Npc, Player, Args)


    //测试用

    if (Player.V.驯兽师 && Player.R.宝宝释放群雷 == false) {
        for (let a = 0; a <= Player.SlaveCount; a++) {
            if (Player.GetSlave(a)) {
                Player.GetSlave(a).SetNVar(_M_N_宝宝释放群雷, 0)
            }
        }
    }

    if (Player.R.被攻击状态) {
        Player.R.被攻击不允许随机 = Player.R.被攻击不允许随机 + 1
        if (Player.R.被攻击不允许随机 >= 5) {
            Player.R.被攻击状态 = false
            if (js_war(Player.GetSVar(91), 智能计算(Player.GetSVar(92), `0.5`, 3)) < 0) {
                实时回血(Player, 智能计算(Player.GetSVar(92), `0.5`, 3))
                Player.SendCountDownMessage(`退出战斗血量低于50%自动恢复至50%`, 0);
            }
        }
    }

    if (Player.V.开启挂机 && Player.V.自动随机 && Player.V.自动随机秒数 > 0) {
        Player.R.随机秒数 ??= 0
        Player.R.随机秒数++
        if (Player.R.随机秒数 >= Player.V.自动随机秒数) {
            Player.R.随机秒数 = 0
            if (Player.R.被攻击状态 == false) {
                Player.RandomMove(Player.GetMapName())
            }

        }
    }

    if (Player.R.暴怒状态) {
        Player.R.暴怒状态时间 ??= 0
        Player.R.暴怒状态时间 = Player.R.暴怒状态时间 + 1
        Player.SetCustomEffect(1, 107)
        if (Player.R.暴怒状态时间 >= (5 + Math.floor(Player.V.暴怒等级 / 20))) {
            Player.R.暴怒状态 = false
            Player.SetCustomEffect(1, 0)
            Player.SendMessage(`{S=【暴怒状态结束】;C=253}: 你离开了暴怒状态！`, 1)
            Player.R.暴怒状态时间 = 0
        }
    }


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

    if (Player.R.恢复点数 > 0 && js_war(Player.GetSVar(91), Player.GetSVar(92)) < 0) {
        let 恢复血量 = 0
        Player.V.恢复专精激活 ? 恢复血量 = Player.R.恢复点数 / 1000 * 2 : 恢复血量 = Player.R.恢复点数 / 1000
        let 血量加成 = 智能计算(Player.GetSVar(92), String(恢复血量), 3)
        实时回血(Player, 血量加成)
    }


    if (Player.Charm != null && js_war(Player.GetSVar(91), Player.GetSVar(92)) < 0) {
        let a = 0
        switch (Player.Charm.GetName()) {
            case '荣誉血石': a = 0.01; break
            case '列兵血石': a = 0.02; break
            case '军士血石': a = 0.03; break
            case '士官血石': a = 0.04; break
            case '骑士血石': a = 0.05; break
            case '校尉血石': a = 0.06; break
            case '将军血石': a = 0.07; break
            case '元帅血石': a = 0.08; break
        }
        Player.R.回血2秒 ??= 0
        Player.R.回血2秒 = Player.R.回血2秒 + 1
        let 回血 = 智能计算(Player.GetSVar(92), String(a), 3)
        if (Player.R.回血2秒 >= 2) {
            实时回血(Player, 回血)
            Player.R.回血2秒 = 0
        }
    }

    if (!Player.Death && Player.V.自动拾取) {
        // if (Player.V.总捐献礼卷数量 < 50) {
        // Player.MagicAttack(Player, 10078)//范围4
        // } else {
        Player.MagicAttack(Player, 10079)//范围12
        // }
    }

}


export function 测试5秒(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 地图.分钟检测副本玩家数量()
    // _M_Robot.按分钟检测(Player)
    // Player = GameLib.FindPlayer('鸿福'); //查找玩家
    // if (Player != null) {
    //     Player.SetAttackSpeed(10)
    //     Player.RecalcAbilitys();
    //     Player.UpdateName();
    //     GameLib.SetClientSpeed(10000)
    //     GameLib.SendChangeClientSpeed()
    //     console.log(`GetAttackSpeed() ${Player.GetAttackSpeed()}`)
    // }

    //    // GameLib.MonGenEx( Player.Map , '多钩猫', 30, 120, 120, 30, 0, 0, 1, true, true, true, true)

    // _M_Robot.按分钟检测(Player)


}

export function 全局1秒(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 新刷怪系统：检测玩家首次进入地图，10秒后刷全怪
    生物刷新.秒钟检测首次刷怪()
    // 旧刷怪系统保留兼容
    _M_Robot.秒钟第一次进入刷怪()
}
/*十秒执行*/
export function 个人10秒(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    /*监控外挂*/
    RobotPlugIn(Player);
    if (Player.V.开启挂机) {
        Player.ReloadBag()
    }
    if (Player.V.材料入仓) {
        一键存入所有材料(Npc, Player, Args)
    }

}
/*每30S检测一次*/
export function 刷怪30秒(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 新刷怪系统：定时补怪检测
    生物刷新.定时补怪检测()
    // 新刷怪系统：特殊BOSS刷新检测(击杀2000怪触发)
    生物刷新.特殊BOSS刷新检测()
    // 旧刷怪系统保留兼容
    _M_Robot.按分钟检测(Player)

    GameLib.R.测试属性 ??= 0
    GameLib.R.测试属性 += 1
    if (GameLib.R.测试属性 >= 100) {

        if (js_war(Player.V.杀怪翻倍, '1') > 0) {
            console.log(`玩家名字:${Player.GetName()} ,杀怪翻倍:${Player.V.杀怪翻倍}`)
        }
        GameLib.R.测试属性 = 0
    }


    // ; 
}

/*每1分钟检测一次*/
export function 全局1分钟(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    地图.副本清理()

    // ==================== 圣耀副本清理 ====================
    // 每分钟检测圣耀副本：24小时到期或无人30分钟后删除
    地图.圣耀副本清理()

    // ==================== 新刷怪系统：无人地图清理 ====================
    生物刷新.清理无人地图怪物()

    // ==================== 大陆BOSS刷新检测(TAG 6) ====================
    // 每2小时在当前大陆所有地图刷新
    生物刷新.大陆BOSS刷新检测()

    // ==================== 五分钟全面补怪 ====================
    GameLib.R.五分钟补怪计数 ??= 0
    GameLib.R.五分钟补怪计数 += 1
    if (GameLib.R.五分钟补怪计数 >= 5) {
        生物刷新.五分钟全面补怪()
        GameLib.R.五分钟补怪计数 = 0
    }

    // 🚀 性能优化：大幅减少脚本重载频率，从5分钟改为30分钟
    GameLib.R.定期加载 ??= 0
    GameLib.R.定期加载 += 1
    if (GameLib.R.定期加载 >= 10) { // 从5改为30分钟，减少CPU消耗
        // 🚀 性能优化：仅在必要时重载脚本引擎
        按分钟检测清理()
        GameLib.ReLoadScriptEngine();
        GameLib.R.定期加载 = 0
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
                // console.log(Trunc((GameLib.TickCount - GameLib.V[Player.PlayerID][n[v]]) / 1000))
                let 计算复活冷却时间 = Trunc((GameLib.TickCount - GameLib.V[Player.PlayerID][n[v]]) / 1000)
                if (计算复活冷却时间 >= 复活冷却时间) {
                    Player.SetNVar(_P_N_可复活次数, Player.GetNVar(_P_N_可复活次数) + 1)
                    delete GameLib.V[Player.PlayerID][n[v]]
                }
            }
            // Player.SendMessage(`你当前可复活次数：${Player.GetNVar(_P_N_可复活次数)}次...`, 1)
        } else {
            Player.SetNVar(_P_N_可复活次数, AItem.GetOutWay3(40))
            // Player.SendMessage(`你当前可复活次数：${AItem.GetOutWay3(40)}次...`, 1)
        }
    }
    // console.log(GameLib.V[Player.PlayerID])

    // Player.RemoveExtendButton('复活')
    // Player.AddExtendButton('复活', '{S=当前可复活次数:;C=254}' + '{S=[;C=243}' + Player.GetNVar(_P_N_可复活次数) + '{S=];C=243}', '', 186, 1, -600)

}
export function 全局每日清理(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    delete GameLib.V.每日回收神器次数
    delete GameLib.V.每日宣传兑换次数
    Player.V.今日兑换礼卷 = 0
    Player.V.每日宣传兑换次数 = 0
}

export function 个人每日清理(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.今日回收神器 = 0
    Player.V.今日兑换礼卷 = 0
    Player.V.每日宣传兑换次数 = 0
    深度清理()
}


const 圣墟点数道具配置 = [
    { 名称: '圣墟10点', 数值: 10, 类型: '圣墟点数' },
    { 名称: '圣墟20点', 数值: 20, 类型: '圣墟点数' },
    { 名称: '圣墟50点', 数值: 50, 类型: '圣墟点数' },
]
export function 自动吃圣墟点数(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    for (const 道具 of 圣墟点数道具配置) {
        if (Player.GetItemCount(道具.名称) > 0) {
            const 数量 = Player.GetItemCount(道具.名称)
            Npc.Take(Player, 道具.名称, 数量)
            Player.V.圣墟点数 += (道具.数值 * 数量)
            Player.SendMessage(`当前使用{S=${数量}个${道具.名称};C=253},增加点数{S=${道具.数值 * 数量};C=250},圣墟点数为{S=${Player.V.圣墟点数};C=250}`, 1)
        }
    }
}

// 🚀 性能优化：优化版的自动吃等级丹，使用数据驱动减少重复代码
const 等级石配置 = [
    10000, 9500, 9000, 8500, 8000, 7500, 7000, 6500, 6000, 5500,
    5000, 4500, 4000, 3500, 3000, 2500, 2000, 1500, 1000, 500
];

export function 自动吃等级丹优化版(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 🚀 按等级要求从高到低检查，找到可用的等级石
    for (const 等级上限 of 等级石配置) {
        const 道具名 = `等级石(${等级上限})`
        if (Player.Level <= 等级上限 && Player.GetItemCount(道具名) > 0) {
            // 🚀 性能优化：批量处理等级石，每次最多使用5个
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
            break; // 找到并处理后退出
        }
    }
}

// 保留原函数供兼容性
export function 自动吃等级丹(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    自动吃等级丹优化版(Npc, Player, Args)
}


// 🚀 性能优化：优化版的自动吃元宝，使用数据驱动减少重复代码
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

export function 自动吃元宝优化版(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 有更新 = false

    // 🚀 按价值从大到小处理，减少循环次数
    for (const 道具 of 元宝道具配置) {
        const 数量 = Player.GetItemCount(道具.名称)
        if (数量 > 0) {
            // 🚀 性能优化：批量处理相同道具，减少调用次数
            const 批量处理数量 = Math.min(数量, 10) // 每次最多处理10个
            for (let i = 0; i < 批量处理数量; i++) {
                Npc.Take(Player, 道具.名称, 1)
                if (道具.类型 === 'gold') {
                    Player.SetGameGold(Player.GetGameGold() + 道具.数值)
                } else {
                    Player.SetGamePoint(Player.GetGamePoint() + 道具.数值)
                }
            }
            有更新 = true
            break; // 处理完一种道具后退出，下次再处理其他
        }
    }

    if (有更新) {
        Player.GoldChanged()
    }
}

// 保留原函数供兼容性
export function 自动吃元宝(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    自动吃元宝优化版(Npc, Player, Args)
}

const 装备类型 = [4, 5, 6, 10, 11, 15, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 68, 35, 17, 18]


export function 自动施法(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.R.施法读秒 ??= 0
    Player.R.施法读秒++

    const V = Player.V;
    const R = Player.R;
    let Magic: TUserMagic;
    let AActorList: TActorList;

    // ==================== 初始化自动施法变量 ====================
    // 天枢职业
    R.怒斩自动施法 ??= false;
    // 血神职业
    R.血气献祭自动施法 ??= false;
    R.血魔临身自动施法 ??= false;
    // 暗影职业
    R.暗影袭杀自动施法 ??= false;
    R.暗影风暴自动施法 ??= false;
    R.暗影附体自动施法 ??= false;
    // 烈焰职业
    R.火焰追踪自动施法 ??= false;
    // 不动职业
    R.人王盾自动施法 ??= false;
    R.金刚掌自动施法 ??= false;

    // ==================== 六大新职业自动施法 ====================
    // 根据技能描述实现持续性技能的自动施法
    // 注意：这些技能在MagicNpc.ts中通过开启/关闭函数控制状态，这里实现持续伤害效果

    // ========== 每秒施法 ==========
    if (R.施法读秒 % 1 === 0) {

        // 天枢职业 - 怒斩：对周围8码内最近的敌人施法
        if (V.职业 === '天枢' && !Player.InSafeZone && R.怒斩自动施法) {
            Magic = Player.FindSkill('怒斩');
            if (Magic) {
                const 最近目标 = 获取周围最近目标(Player, 8);
                if (最近目标) {
                    Player.MagicAttack(最近目标, _P_Base.技能ID.天枢.怒斩);
                }
            }
        }

        // 血神职业 - 血气献祭：对周围8码内最近的敌人施法
        if (V.职业 === '血神' && !Player.InSafeZone && R.血气献祭自动施法) {
            Magic = Player.FindSkill('血气献祭');
            if (Magic) {
                const 最近目标 = 获取周围最近目标(Player, 8);
                if (最近目标) {
                    Player.MagicAttack(最近目标, _P_Base.技能ID.血神.血气献祭);
                }
            }
        }

        // 血神职业 - 血魔临身：自动释放（有CD）
        if (V.职业 === '血神' && !Player.InSafeZone && R.血魔临身自动施法 && !R.血魔临身) {
            Magic = Player.FindSkill('血魔临身');
            if (Magic) {
                Player.MagicAttack(Player, _P_Base.技能ID.血神.血魔临身);
            }
        }

        // 血神职业 - 血气燃烧
        // 描述：开启后,每秒对周围5码范围内敌人造成150%的伤害,每级提高15%.(每秒消耗1%血量.血量低于10%时关闭)
        if (V.职业 === '血神' && R.血气燃烧) {
            // 检查血量是否低于10%，自动关闭
            let 当前血量 = Player.GetSVar(91)
            let 最大血量 = Player.GetSVar(92)
            if (js_war(当前血量, 智能计算(最大血量, `0.1`, 3)) <= 0) {
                R.血气燃烧 = false;
                Player.SetCustomEffect(_P_Base.永久特效.血气燃烧, -1);
                Player.SendMessage('血量低于10%,血气燃烧自动关闭!', 2);
            } else {
                // 消耗1%血量
                当前血量 = 智能计算(当前血量, 智能计算(最大血量, `0.01`, 3), 2);
                Player.SetSVar(91, 当前血量);
                血量显示(Player);
                // 对周围5码敌人造成伤害
                const 范围 = 5 + (R.血气燃烧范围 || 0);
                const 目标列表 = 获取玩家范围内目标(Player, 范围);
                for (const 目标 of 目标列表) {                    
                    Player.Damage(目标, 1, _P_Base.技能ID.血神.血气燃烧);
                }
            }
        }

        // 暗影职业 - 暗影袭杀：对周围8码内最近的敌人施法
        if (V.职业 === '暗影' && !Player.InSafeZone && R.暗影袭杀自动施法) {
            Magic = Player.FindSkill('暗影袭杀');
            if (Magic) {
                const 最近目标 = 获取周围最近目标(Player, 8);
                if (最近目标) {
                    Player.MagicAttack(最近目标, _P_Base.技能ID.暗影.暗影袭杀);
                }
            }
        }

        // 暗影职业 - 暗影风暴：对周围8码内最近的敌人施法（有CD）
        if (V.职业 === '暗影' && !Player.InSafeZone && R.暗影风暴自动施法) {
            Magic = Player.FindSkill('暗影风暴');
            if (Magic && R.暗影点 >= 5) {
                const 最近目标 = 获取周围最近目标(Player, 8);
                if (最近目标) {
                    Player.MagicAttack(最近目标, _P_Base.技能ID.暗影.暗影风暴);
                }
            }
        }

        // 暗影职业 - 暗影附体：自动释放（有CD）
        if (V.职业 === '暗影' && !Player.InSafeZone && R.暗影附体自动施法 && !R.暗影附体) {
            Magic = Player.FindSkill('暗影附体');
            if (Magic && R.暗影点 >= 10) {
                Player.MagicAttack(Player, _P_Base.技能ID.暗影.暗影附体);
            }
        }

        // 暗影职业 - 暗影剔骨
        // 描述：开启后对周围6码范围内敌人造成300%伤害,每级提高30%,每秒消耗1点暗影点
        if (V.职业 === '暗影' && R.暗影剔骨 && !Player.InSafeZone) {
            // 检查暗影点，不足则自动关闭
            if (!R.暗影点 || R.暗影点 < 1) {
                R.暗影剔骨 = false;
                Player.SetCustomEffect(_P_Base.永久特效.暗影剔骨, -1);
                Player.SendMessage('暗影点不足,暗影剔骨自动关闭!', 2);
            } else {
                // 消耗1点暗影点
                R.暗影点 = R.暗影点 - 1;
                // 对周围6码敌人造成伤害
                AActorList = Player.Map.GetActorListInRange(Player.MapX, Player.MapY, 6);
                for (let i = 0; i < AActorList.Count; i++) {
                    const Actor = AActorList.Actor(i);
                    if (Actor && !Actor.GetDeath() && !Actor.IsNPC() && Actor.GetHandle() !== Player.GetHandle() && !Actor.IsPlayer() && !Actor.Master) {
                        Player.SetCustomEffect(1, _P_Base.特效.暗影剔骨);
                        Player.Damage(Actor, 1, _P_Base.技能ID.暗影.暗影剔骨);
                    }
                }
            }
        }

        // 烈焰职业 - 火焰追踪：对周围8码内最近的敌人施法
        if (V.职业 === '烈焰' && !Player.InSafeZone && R.火焰追踪自动施法) {
            Magic = Player.FindSkill('火焰追踪');
            if (Magic) {
                const 最近目标 = 获取周围最近目标(Player, 8);
                if (最近目标) {
                    Player.MagicAttack(最近目标, _P_Base.技能ID.烈焰.火焰追踪);
                }
            }
        }

        // 正义职业 - 圣光（正义光环）
        // 描述：开启后,每秒对周围5码内所有目标造成200%伤害,每级提高20%
        if (V.职业 === '正义' && R.圣光 && !Player.InSafeZone) {
            AActorList = Player.Map.GetActorListInRange(Player.MapX, Player.MapY, 5);
            for (let i = 0; i < AActorList.Count; i++) {
                const Actor = AActorList.Actor(i);
                if (Actor && !Actor.GetDeath() && !Actor.IsNPC() && Actor.GetHandle() !== Player.GetHandle() && !Actor.IsPlayer() && !Actor.Master) {
                    Actor.ShowEffectEx2(_P_Base.特效.圣光, -10, 20, true, 1);
                    Player.Damage(Actor, 1, _P_Base.技能ID.正义.圣光);
                }
            }
        }

        // 不动职业 - 人王盾：自动释放（有CD）
        if (V.职业 === '不动' && !Player.InSafeZone && R.人王盾自动施法 && !R.人王盾护盾值) {
            Magic = Player.FindSkill('人王盾');
            if (Magic) {
                Player.MagicAttack(Player, _P_Base.技能ID.不动.人王盾);
            }
        }

        // 不动职业 - 金刚掌：对周围8码内最近的敌人施法（有CD）
        if (V.职业 === '不动' && !Player.InSafeZone && R.金刚掌自动施法) {
            Magic = Player.FindSkill('金刚掌');
            if (Magic) {
                const 最近目标 = 获取周围最近目标(Player, 8);
                if (最近目标) {
                    Player.MagicAttack(最近目标, _P_Base.技能ID.不动.金刚掌);
                }
            }
        }

        // 不动职业 - 如山
        // 描述：开启后,每秒对周围5码内造成400%伤害,每级提高40%
        if (V.职业 === '不动' && R.如山 && !Player.InSafeZone) {
            AActorList = Player.Map.GetActorListInRange(Player.MapX, Player.MapY, 5);
            for (let i = 0; i < AActorList.Count; i++) {
                const Actor = AActorList.Actor(i);
                if (Actor && !Actor.GetDeath() && !Actor.IsNPC() && Actor.GetHandle() !== Player.GetHandle() && !Actor.IsPlayer() && !Actor.Master) {
                    Actor.ShowEffectEx2(_P_Base.特效.如山, -10, 20, true, 1);
                    Player.Damage(Actor, 1, _P_Base.技能ID.不动.如山);
                }
            }
        }
    }

    // ========== 每2秒施法 ==========
    if (R.施法读秒 % 2 === 0) {
        // 烈焰职业 - 烈焰护甲
        // 描述：开启后,每2秒对周围4格内的目标造成300%伤害,每级提高30%
        if (V.职业 === '烈焰' && R.烈焰护甲 && !Player.InSafeZone) {
            AActorList = Player.Map.GetActorListInRange(Player.MapX, Player.MapY, 4);
            for (let i = 0; i < AActorList.Count; i++) {
                const Actor = AActorList.Actor(i);
                if (Actor && !Actor.GetDeath() && !Actor.IsNPC() && Actor.GetHandle() !== Player.GetHandle() && !Actor.IsPlayer() && !Actor.Master) {
                    Actor.ShowEffectEx2(_P_Base.特效.烈焰护甲, -10, 20, true, 1);
                    Player.Damage(Actor, 1, _P_Base.技能ID.烈焰.烈焰护甲);
                }
            }
        }
    }

}




//两点之间的距离
export function 取两点距离(x1: number, y1: number, x2: number, y2: number): number {
    let dx: number, dy: number
    dx = x1 - x2;
    dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 获取玩家周围指定范围内最近的一个目标
 * @param Player 玩家对象
 * @param 范围 搜索范围（码）
 * @returns 最近的目标，如果没找到则返回null
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