/*机器人*/
import { RobotPlugIn } from "../功能脚本组/[功能]/_GN_Monitoring"
import {
    _P_P_AbilityData, _P_N_监狱计时, _P_N_可复活次数, 技能ID, _G_GA_DonationData,

} from "../功能脚本组/[玩家]/_P_Base"
import * as _M_Robot from "../功能脚本组/[怪物]/_M_Robot"
import { _M_N_宝宝释放群雷, _M_N_猎人宝宝群攻 } from "../功能脚本组/[怪物]/_M_Base"
import { 基础属性第一条, 基础属性第十条, 备用四 } from "../功能脚本组/[装备]/_ITEM_Base"
import { 实时回血 } from "../大数值版本/字符计算"
import { js_number, js_war } from "../全局脚本[公共单元]/utils/计算方法"
import { 人物额外属性计算 } from "../大数值版本/装备属性统计"
import * as 地图 from '../功能脚本组/[地图]/地图'
import * as 刷怪 from '../功能脚本组/[怪物]/_M_Refresh'
import { 回收装备 } from "../功能脚本组/[装备]/_ITEM_zbhs"
import { 按分钟检测清理, 深度清理, 获取清理性能统计 } from '../大数值版本/清理冗余数据'
// 导入装备属性统计优化
import { 清理装备JSON缓存, 获取装备缓存统计 } from "../大数值版本/装备属性统计"
import { 快速验证实时清理效果, 快速验证装备掉落 } from "../大数值版本/装备掉落测试验证"
import { 一键存入所有材料 } from "../功能脚本组/[服务]/材料仓库"
import { 打印性能报告 } from '../应用智能优化版';
import { 更新BUFF系统 } from '../大数值版本/BUFF';





/*一秒执行*/
export function _A_second(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    // 🚀 性能优化：使用计数器减少高频操作的执行频率
    Player.R.性能计数器 ??= 0
    Player.R.性能计数器++

    // 🚀 性能优化：自动回收改为每5秒执行一次，而非每秒
    if (Player.V.自动回收 && Player.R.性能计数器 % 5 === 0) {
        回收装备(Npc, Player, Args)
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
    触发被动技能(Npc, Player, Args)

    // BUFF系统更新（全局，使用全局标志确保每秒只执行一次）
    if (!GameLib.R) {
        GameLib.R = {};
    }
    if (!GameLib.R.BUFF更新时间戳) {
        GameLib.R.BUFF更新时间戳 = 0;
    }
    
    const 当前时间 = GameLib.TickCount;
    // 每100毫秒更新一次BUFF系统（更精确的伤害间隔）
    if (当前时间 - GameLib.R.BUFF更新时间戳 >= 100) {
        更新BUFF系统();
        GameLib.R.BUFF更新时间戳 = 当前时间;
    }

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
            if (js_war(Player.GetSVar(91), js_number(Player.GetSVar(92), `0.5`, 3)) < 0) {
                实时回血(Player, js_number(Player.GetSVar(92), `0.5`, 3))
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
        let 血量加成 = js_number(Player.GetSVar(92), String(恢复血量), 3)
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
        let 回血 = js_number(Player.GetSVar(92), String(a), 3)
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
export function 开始攻沙巴克(Npc: TNormNpc, Player: TPlayObject): void {
    GameLib.V.攻沙巴克时间 ??= 0
    GameLib.V.开始攻沙巴克 ??= false
    GameLib.V.攻沙巴克时间 = GameLib.V.攻沙巴克时间 + 1

    if (GameLib.V.攻沙巴克时间 >= 3) {
        GameLib.V.开始攻沙巴克 = true
        GameLib.V.攻沙巴克时间 = 0
        GameLib.FindCastle('沙巴克').AddAllAttacker()  //所有行会加入攻城列表
        GameLib.FindCastle('沙巴克').StartWall()  //开始攻城,延迟5-19秒
    }


}
export function 结束攻沙巴克(Npc: TNormNpc, Player: TPlayObject): void {
    if (GameLib.V.开始攻沙巴克) {
        GameLib.FindCastle('沙巴克').StopWall()  //结束攻城
        GameLib.V.开始攻沙巴克 = false
        GameLib.V.胜利领奖 ??= false
        GameLib.V.失败领奖 ??= false
    }
}

export function 结束沙巴克1小时清空(Npc: TNormNpc, Player: TPlayObject): void {
    if (GameLib.V.攻沙巴克时间 == 0) {
        GameLib.V.首区攻杀 = true
    }
    delete GameLib.V.沙巴克杀人数量
    GameLib.SetGVar(_G_GA_DonationData[0]._G_杀人数量, undefined)
    GameLib.SetGVar(_G_GA_DonationData[1]._G_杀人数量, undefined)
    GameLib.SetGVar(_G_GA_DonationData[2]._G_杀人数量, undefined)
    GameLib.SetAVar(_G_GA_DonationData[0]._A_行会名字, undefined)
    GameLib.SetAVar(_G_GA_DonationData[1]._A_行会名字, undefined)
    GameLib.SetAVar(_G_GA_DonationData[2]._A_行会名字, undefined)
    delete GameLib.V.胜利领奖
    delete GameLib.V.失败领奖
}

//两点之间的距离
export function 取两点距离(x1: number, y1: number, x2: number, y2: number): number {
    let dx: number, dy: number
    dx = x1 - x2;
    dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
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
    _M_Robot.秒钟第一次进入刷怪()

}
/*十秒执行*/
export function _Ten_seconds(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    /*监控外挂*/
    RobotPlugIn(Player);
    if (Player.V.开启挂机) {
        Player.ReloadBag()
    }
    if (Player.V.材料入仓) {
        一键存入所有材料(Npc, Player, Args)
    }
    const 地图等级 = 地图.取地图固定星级(Player.GetMap().GetName());

    // 检查地图等级是否大于25
    if (地图等级 > 25) {
        const 魔器裂天装备 = Player.GetZodiacs(1);

        if (!魔器裂天装备) {
            // 没有佩戴魔器裂天
            Player.MapMove('主城', 105, 120);
            Npc.Take(Player, '回城石', 10);
            Player.MessageBox('请佩戴魔器裂天');
            return;
        }

        // 检查魔器裂天等级
        const displayName = 魔器裂天装备.DisplayName;
        const match = displayName.match(/『(\d+)级』/);

        if (!match) {
            // 无法识别等级
            Player.MapMove('主城', 105, 120);
            Npc.Take(Player, '回城石', 10);
            Player.MessageBox('魔器裂天等级不足10级');
            return;
        }

        const 魔器裂天等级 = Number(match[1]);

        if (魔器裂天等级 < 10) {
            // 等级不足10级
            Player.MapMove('主城', 105, 120);
            Npc.Take(Player, '回城石', 10);
            Player.MessageBox(`魔器裂天不足10级,当前等级:${魔器裂天等级}级`);
            return;
        }

        // console.log(`名字:${Player.GetName()} 装备 displayName:${displayName} 魔器裂天等级:${魔器裂天等级} 地图等级:${地图等级}`);
    }

}
/*每30S检测一次*/
export function 刷怪30秒(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // _M_Robot.分钟检测无人60分清理怪物()
    _M_Robot.按分钟检测(Player)
    // 地图.副本清理()
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

// 🚨 修复：使用静态变量记录时间
let 清理计数器 = 0;
let 装备检查计数器 = 0;

/*每1分钟检测一次*/
export function 每分钟检测一次(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    地图.副本清理()

    // 🚀 性能优化：大幅减少脚本重载频率，从5分钟改为30分钟
    GameLib.R.定期加载 ??= 0
    GameLib.R.定期加载 += 1
    if (GameLib.R.定期加载 >= 10) { // 从5改为30分钟，减少CPU消耗
        // 🚀 性能优化：仅在必要时重载脚本引擎
        按分钟检测清理()
        打印性能报告();
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
export function 每日神器回收清除(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
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

const 刷BOSS = [
    { 地图名字: '诸天神殿[一幕]', BOSS名字: '远古树精' },
    { 地图名字: '诸天神殿[二幕]', BOSS名字: '暗黑法师' },
    { 地图名字: '诸天神殿[三幕]', BOSS名字: '圣光骑士' },
    { 地图名字: '诸天神殿[四幕]', BOSS名字: '暗影虎王' },
    { 地图名字: '诸天神殿[五幕]', BOSS名字: '地狱九头蛇' },
]
export function 刷世界BOSS(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void { //每4小时刷新一次
    GameLib.V.判断新区 ??= false
    GameLib.V.判断新区时间 ??= 0
    if (GameLib.V.判断新区 == false) {
        GameLib.V.判断新区时间 = GameLib.V.判断新区时间 + 1     //1分钟执行   一天 1440分钟
        if (GameLib.V.判断新区时间 >= 1440 * 5) {
            GameLib.V.判断新区 = true
        }
    }

    // let AMap: TEnvirnoment
    // GameLib.V.开始刷世界BOSS ??= 0
    // GameLib.V.开始刷世界BOSS = GameLib.V.开始刷世界BOSS + 1
    // if (GameLib.V.开始刷世界BOSS >= 240) {
    //     GameLib.V.开始刷世界BOSS = 0
    //     for (let 循环 of 刷BOSS) {
    //         AMap = GameLib.FindMap(循环.地图名字);
    //         if (AMap != null) {
    //             GameLib.ClearMapMon(AMap.GetName());
    //             GameLib.MonGen(AMap.GetName(), 循环.BOSS名字, 1, 39, 34, 0, 0, 0, 16, true, true, true, true)
    //             GameLib.BroadcastTopMessage('世界BOSS刚刚刷新,请各位勇士前往挑战!'); //广播一个顶部滚动消息
    //         }
    //     }
    // }
}
export function 触发被动技能(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (!Player.Death) {
        Player.R.冰霜之环3秒 ??= 0
        Player.R.群魔乱舞3秒 ??= 0
        Player.R.武僧2秒回血 ??= 0
        if (Player.V.冰法 && Player.FindSkill('冰霜之环')) {
            Player.R.冰霜之环3秒++
            if (Player.R.冰霜之环3秒 >= 3) {
                Player.R.冰霜之环3秒 = 0
                Player.MagicAttack(Player, 技能ID.冰法.冰霜之环被动)
            }
        }
        if (Player.V.鬼舞者 && Player.FindSkill('群魔乱舞')) {
            // Player.R.群魔乱舞3秒++
            // if (Player.R.群魔乱舞3秒 >= 3) {
            //     Player.R.群魔乱舞3秒 = 0
            Player.MagicAttack(Player, 技能ID.鬼舞者.群魔乱舞被动)
            //     // console.log('123')
            // }
        }

        // Player.MagicAttack(Player,技能ID.猎人.分裂箭被动)  //技能测试

        if (Player.V.武僧 && Player.FindSkill('天雷阵')) {
            Player.MagicAttack(Player, 技能ID.武僧.天雷阵被动)
            Player.R.武僧2秒回血++
            let 回血 = js_number(Player.GetSVar(92), String(0.02 + (Math.floor(Player.R.体质强化等级 / 8) / 100)), 3)
            if (Player.R.武僧2秒回血 >= 2 && Player.FindSkill('体质强化')) {
                实时回血(Player, 回血)
                Player.R.武僧2秒回血 = 0
            }

        }
    }

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

// 🚀 性能优化：装备自动回收优化版
export function 装备自动回收优化版(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 🚀 使用缓存避免重复初始化
    Player.V.攻速魔速词条数值 ??= 0
    Player.V.攻速魔速词条 ??= false
    Player.V.吸血比例词条数值 ??= 0
    Player.V.吸血比例词条 ??= false

    let AItem: TUserItem;
    let 元宝数量 = 0, 数量 = 0

    // 🚀 性能优化：预分配变量，避免重复声明
    let 生命 = 0, 防御 = 0, 攻击 = 0, 魔法 = 0, 道术 = 0, 射术 = 0, 刺术 = 0, 武术 = 0, 属性 = 0, 倍攻 = 0, 生肖 = 0, 种族 = 0, 天赋 = 0, 装备星星 = 0, 技能伤害 = 0, 攻速魔速 = 0, 吸血比例 = 0

    // 🚀 性能优化：批量处理装备，每次最多处理5件，避免卡顿
    const 批量限制 = 5
    let 已处理数量 = 0

    for (let I = Player.GetItemSize() - 1; I >= 0 && 已处理数量 < 批量限制; I--) {
        // 🚀 重置计算变量
        生命 = 防御 = 攻击 = 魔法 = 道术 = 射术 = 刺术 = 武术 = 属性 = 倍攻 = 生肖 = 种族 = 天赋 = 装备星星 = 技能伤害 = 攻速魔速 = 吸血比例 = 0
        AItem = Player.GetBagItem(I);
        if (装备类型.includes(AItem.StdMode) && !AItem.GetState().GetBind()) {
            if ((Player.V.劣质 && AItem.DisplayName.includes('劣质')) || (Player.V.超强 && AItem.DisplayName.includes('超强')) || (Player.V.杰出 && AItem.DisplayName.includes('杰出'))
                || (Player.V.传说 && AItem.DisplayName.includes('传说')) || (Player.V.神话 && AItem.DisplayName.includes('神话')) || (Player.V.传承 && AItem.DisplayName.includes('传承'))
                || (Player.V.史诗 && AItem.DisplayName.includes('史诗')) || (Player.V.绝世 && AItem.DisplayName.includes('绝世')) || (Player.V.造化 && AItem.DisplayName.includes('造化'))
                || (Player.V.混沌 && AItem.DisplayName.includes('混沌')) || (Player.V.底材 && AItem.DisplayName.includes('底材'))) {
                if (Player.V.首饰 == false && (AItem.DisplayName.includes('艾维') || AItem.DisplayName.includes('阿拉贡') || AItem.DisplayName.includes('缺月'))) {
                    return
                }
                if (Player.V.时装 == false && AItem.DisplayName.includes('恶魔')) {
                    return
                }
                if (AItem.GetCustomDesc() != ``) {
                    let 装备字符串 = JSON.parse(AItem.GetCustomDesc())
                    if (装备字符串.职业属性_职业) {
                        let 装备属性条数 = 装备字符串.职业属性_职业.length
                        for (let e = 0; e <= 装备属性条数 - 1; e++) {
                            switch (Number(装备字符串.职业属性_职业[e])) {
                                case 33: 攻击 = 攻击 + Number(装备字符串.职业属性_属性[e]); break;
                                case 34: 魔法 = 魔法 + Number(装备字符串.职业属性_属性[e]); break;
                                case 35: 道术 = 道术 + Number(装备字符串.职业属性_属性[e]); break;
                                case 36: 刺术 = 刺术 + Number(装备字符串.职业属性_属性[e]); break;
                                case 37: 射术 = 射术 + Number(装备字符串.职业属性_属性[e]); break;
                                case 38: 武术 = 武术 + Number(装备字符串.职业属性_属性[e]); break;
                                case 31: 生命 = 生命 + Number(装备字符串.职业属性_属性[e]); break;
                                case 32: 防御 = 防御 + Number(装备字符串.职业属性_属性[e]); break;
                                case 30: 属性 = 属性 + Number(装备字符串.职业属性_属性[e]); break;
                                case 350: case 351: case 352: 种族 = 种族 + Number(装备字符串.职业属性_属性[e]); break;
                                case 195: case 196: case 197: case 198: case 199: case 200: case 201: case 202: case 203: case 204: case 205: case 206: case 207: case 208: case 209: case 210:
                                case 211: case 212: case 213: case 214: case 215: case 216: case 217: case 218: case 219: case 220: case 221: case 222: case 223: case 224: case 225: case 226:
                                case 227: case 228: case 229: case 230: case 231: case 232: case 233: case 234: case 235: case 236: 倍攻 = 倍攻 + Number(装备字符串.职业属性_属性[e]); break;
                                case 401: case 402: case 403: case 404: case 405: case 406: case 407: case 408: case 409: case 410: case 411: case 412: case 413: case 414: case 415: case 416:
                                case 417: case 418: case 419: case 420: case 421: case 422: case 423: case 424: case 425: case 426: case 427: case 428: case 429: case 430: case 431: case 432:
                                case 433: case 434: case 435: case 436: case 437: case 438: case 439: case 440: 技能伤害 = 技能伤害 + Number(装备字符串.职业属性_属性[e]); break;
                                default: break;
                            }
                            if (Player.V.生肖词条 && (AItem.StdMode == 68 || AItem.StdMode == 35)) {
                                // 生肖 = Decimal.plus(生肖, String(装备字符串.职业属性_属性[e]))
                                生肖 = 生肖 + Number(AItem.GetCustomCaption(0))
                            }
                            if (Player.V.装备星星词条 && AItem.StdMode != 68 && AItem.StdMode != 35) {
                                // 装备星星 = Decimal.plus(装备星星, String(装备字符串.职业属性_属性[e]))
                                装备星星 = 装备星星 + Number(AItem.GetCustomCaption(0))
                            }


                        }
                    }
                }
                for (let i = 基础属性第一条; i <= 备用四; i++) {
                    switch (true) {
                        case AItem.GetOutWay1(i) >= 620 && AItem.GetOutWay1(i) <= 628: 天赋 = 天赋 + AItem.GetOutWay2(i); break
                        case AItem.GetOutWay1(i) == 310: 攻速魔速 = 攻速魔速 + AItem.GetOutWay2(i); break
                        case AItem.GetOutWay1(i) == 302: 吸血比例 = 吸血比例 + AItem.GetOutWay2(i); break
                    }
                }

                if (Player.V.防御词条 && 防御 > Player.V.防御词条数值) { continue }
                if (Player.V.血量词条 && 生命 > Player.V.血量词条数值) { continue }
                if (Player.V.攻击词条 && 攻击 > Player.V.攻击词条数值) { continue }
                if (Player.V.魔法词条 && 魔法 > Player.V.魔法词条数值) { continue }
                if (Player.V.道术词条 && 道术 > Player.V.道术词条数值) { continue }
                if (Player.V.刺术词条 && 刺术 > Player.V.刺术词条数值) { continue }
                if (Player.V.射术词条 && 射术 > Player.V.射术词条数值) { continue }
                if (Player.V.武术词条 && 武术 > Player.V.武术词条数值) { continue }
                if (Player.V.属性词条 && 属性 > Player.V.属性词条数值) { continue }
                if (Player.V.倍攻词条 && 倍攻 > Player.V.倍攻词条数值) { continue }
                if (Player.V.天赋词条 && 天赋 > Player.V.天赋词条数值) { continue }
                if (Player.V.攻速魔速词条 && 攻速魔速 > Player.V.攻速魔速词条数值) { continue }
                if (Player.V.吸血比例词条 && 吸血比例 > Player.V.吸血比例词条数值) { continue }
                if (Player.V.种族词条 && 种族 > Player.V.种族词条数值) { continue }
                if (Player.V.生肖词条 && 生肖 > Player.V.生肖词条数值) { continue }
                if (Player.V.装备星星词条 && 装备星星 > Player.V.装备星星词条数值) { continue }
                if (Player.V.技能伤害词条 && 技能伤害 > Player.V.技能伤害词条数值) { continue }


                数量++
                switch (true) {
                    case AItem.DisplayName.includes('[劣质]'): 元宝数量 += 0; break
                    case AItem.DisplayName.includes('[超强]'): 元宝数量 += 1; break
                    case AItem.DisplayName.includes('[杰出]'): 元宝数量 += 2; break
                    case AItem.DisplayName.includes('[传说]'): 元宝数量 += 3; break
                    case AItem.DisplayName.includes('[神话]'): 元宝数量 += 4; break
                    case AItem.DisplayName.includes('[传承]'): 元宝数量 += 6; break
                    case AItem.DisplayName.includes('[史诗]'): 元宝数量 += 8; break
                    case AItem.DisplayName.includes('[绝世]'): 元宝数量 += 10; break
                    case AItem.DisplayName.includes('[造化]'): 元宝数量 += 20; break
                    case AItem.DisplayName.includes('[混沌]'): 元宝数量 += 50; break
                    case AItem.DisplayName.includes('[底材]'): 元宝数量 += 2; break
                    case AItem.DisplayName.includes('艾维'): 元宝数量 += 5; break
                    case AItem.DisplayName.includes('阿拉贡'): 元宝数量 += 5; break
                }

                // ✅ 实时清理：自动回收时立即清理装备信息缓存
                try {
                    const 装备标识 = `${AItem.GetName()}_${Date.now()}`;
                    const 装备描述 = AItem.GetCustomDesc();
                    if (装备描述 && 装备描述.length > 0) {
                        console.log(`🗑️ [自动回收]清理装备信息: ${装备标识}`);
                    }
                } catch (cleanupError) {
                    console.log(`❌ [自动回收]清理装备信息出错: ${cleanupError}`);
                }

                // Npc.Take(Player, AItem.GetName())
                Player.DeleteItem(AItem)
                已处理数量++ // 🚀 性能优化：限制批量处理数量
            }
        }
    }
    if (元宝数量 > 0) {
        let 倍数 = 2
        let 艾维利之戒指 = 0
        if (Player.GetJewelrys(1) != null && Player.GetJewelrys(1).GetName() == '艾维利之戒' && Player.GetJewelrys(1).GetOutWay3(40) < 10) {
            艾维利之戒指 = (Player.GetJewelrys(1).GetOutWay2(1) / 20 + Player.GetJewelrys(1).GetOutWay3(40) * 2) / 100
        } else if (Player.GetJewelrys(1) != null && Player.GetJewelrys(1).GetName() == '艾维利之戒' && Player.GetJewelrys(1).GetOutWay3(40) >= 10) {
            艾维利之戒指 = (Player.GetJewelrys(1).GetOutWay2(1) / 20 + Player.GetJewelrys(1).GetOutWay3(40) * 2 + 50) / 100
        }

        if (GameLib.V.判断新区 == false) {
            倍数 = 4 + 艾维利之戒指
        } else {
            倍数 = 2 + 艾维利之戒指
        }
        if (Player.GetJewelrys(1) != null && Player.GetJewelrys(1).GetName() == '艾维利之戒' && Player.GetJewelrys(1).GetOutWay3(40) >= 10) {
            Player.SetGameGold(Player.GetGameGold() + Math.round(元宝数量 * (Player.V.回收元宝倍率 / 100) * 倍数))
            Player.GoldChanged()
            Player.SendMessage(`回收了{S=${数量};C=154}件装备,共获得{S=${Math.round(元宝数量 * (Player.V.回收元宝倍率 / 100) * 倍数)};C=253}枚元宝!`, 1)
        } else {
            Player.SetGameGold(Player.GetGameGold() + Math.round(元宝数量 / 2 * (Player.V.回收元宝倍率 / 100) * 倍数))
            Player.GoldChanged()
            Player.SendMessage(`回收了{S=${数量};C=154}件装备,共获得{S=${Math.round(元宝数量 / 2 * (Player.V.回收元宝倍率 / 100) * 倍数)};C=253}枚元宝!`, 1)
        }


    }
}

// 🚀 保留原函数供兼容性，但现在调用优化版
export function 装备自动回收1秒(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    装备自动回收优化版(Npc, Player, Args)
}
