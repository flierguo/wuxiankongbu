// import * as XXXX from "../功能脚本组/[XX]/XXXX"
import * as _P_NewPlayer from "../功能脚本组/[玩家]/_P_玩家登录"
import { Refresh } from "../功能脚本组/[怪物]/_M_Refresh"
import { funcDie } from "../功能脚本组/[怪物]/_M_Die"
import { 仓库总格子数, 仓库第一页, 关闭仓库, 特效 } from "../功能脚本组/[玩家]/_P_Base"
import { Main } from "../功能脚本组/[装备]/_ITEM_zbhs"
import { 交易市场, 人物属性, 会员, 会员特权, 地图, 执行新手任务, 新手任务, 测试用的, 职业词条 } from "../功能脚本组/[服务]/延时跳转"
import { 天赋 } from "../功能脚本组/[服务]/王城"
import { 杀怪鞭尸 } from "../功能脚本组/[玩家]/_P_杀怪触发"
import * as 交易中心 from "../功能脚本组/[服务]/交易中心"
// import { 计算伤害 } from "../大数值版本/攻击计算"
// import { 计算伤害 } from '../应用智能优化版';
// import { 计算伤害 } from '../性能优化/攻击计算_极致优化';
import { 计算伤害 } from '../性能优化/攻击计算_超极致优化';
import { 装备属性统计 } from "../大数值版本/装备属性统计"
import { 实时回血, 血量显示 } from "../大数值版本/字符计算"
import { js_war } from "../全局脚本[公共单元]/utils/计算方法"
import * as 地图1 from '../功能脚本组/[地图]/地图';
import { 记录充值数据 } from "../功能脚本组/[服务]/充值属性"
import * as 材料仓库 from "../功能脚本组/[服务]/材料仓库"

// ============ 启动智能优化系统 ============
import { 启动智能优化系统 } from '../应用智能优化版';

// ========================================

// 目标受到伤害触发
GameLib.onMonitorDamageEx = (ActorObject: TActor, ADamageSource: TActor, Tag: number, SkillID: number, SkillLevel: number, Value: number): number => {
    if (ADamageSource.GetAttackMode() != 0) {
        for (let a = 0; a <= ADamageSource.SlaveCount; a++) {
            if (ADamageSource.GetSlave(a) != null && ADamageSource.GetSlave(a).Handle == ActorObject.Handle) {
                return 0
            }
        }
    }
    if (ADamageSource.GetAttackMode() == 6 && ActorObject.GetPkLevel() < 2 && ActorObject.IsPlayer()) { return 0 }//不是红名
    if (ADamageSource.GetAttackMode() == 5 && ADamageSource.Guild && ActorObject.Guild && ADamageSource.Guild.Name == ActorObject.Guild.Name) { return 0 }//同一个行会
    if (ADamageSource.IsPlayer() && ActorObject.IsPlayer()) {
        let aPlayer: TPlayObject = ADamageSource as TPlayObject
        let bPlayer: TPlayObject = ActorObject as TPlayObject
        let P: TPlayObject
        if (aPlayer.GetAttackMode() == 4 && aPlayer.GroupOwner) {
            for (let I = 0; I <= aPlayer.GroupCount - 1; I++) {
                P = aPlayer.GetGroupMember(I); //取出一个角色
                if (P && P.Handle == bPlayer.Handle) {//如果角色不为空值
                    return 0//组队模式
                }
            }
        }
    }
    if (ADamageSource.GetAttackMode() == 1 && (ActorObject.IsPlayer() || ActorObject.Master != null)) { return 0 }//和平模式
    if (ADamageSource.GetAttackMode() == 1 && (ActorObject.IsPlayer() || ActorObject.Master != null) && ADamageSource.Master != null && ADamageSource.Master.IsPlayer()) { return 0 }//和平模式
    if (ActorObject.InSafeZone && ActorObject.IsPlayer()) { return 0 }//判断是否在安全区
    if (ADamageSource.Handle == ActorObject.Handle) { return 0 }//判断攻击者和被攻击者都不是自己

    计算伤害(ADamageSource, ActorObject, SkillID, 1)
    if(SkillID == 170){
        ADamageSource.DamageDelay(ActorObject, 1, 300, 10170)
    }

    return 1
}
GameLib.onRightClickMapPos = (Player: TPlayObject, MapX: number, MapY: number): void => {
    if (Player.GetPermission() == 11) {
        Player.MapMove(Player.GetMapName(), MapX, MapY)
    } else {
        if (Player.GetJewelrys(4) != null && Player.GetJewelrys(4).GetName() == '甘道夫之戒') {
            if (DateUtils.SecondSpan(DateUtils.Now(), Player.VarDateTime('传送功能').AsDateTime) >= 1) {
                Player.MapMove(Player.GetMapName(), MapX, MapY)
                Player.VarDateTime('传送功能').AsDateTime = DateUtils.Now()
            } else {
                Player.SendMessage(`传送功能冷却中,剩余CD:${1 - Math.round(DateUtils.SecondSpan(DateUtils.Now(), Player.VarDateTime('传送功能').AsDateTime))}`);
            }
        } else {
            Player.SendMessage('你暂时无法使用此功能!')
        }
    }
}
GameLib.onAsyncHttpPostResult = (Ident: string, URL: string, Respone: string, ErrorStr: string): void => { }
//重命名
GameLib.onPlayerReNameState = (State: number, PlayObject: TPlayObject, OldName: string, Newname: string): void => { }
//当脚本引擎启动时 isReload 表示是否重载脚本

GameLib.onScriptEngineFinal = (isReload: boolean): void => {

}

//引擎初始化，isReload = true 表示重载脚本， 引擎初始化，isReload = false 表示引擎启动
GameLib.onScriptEngineInit = (isReload: boolean): void => {
    if (isReload == false) {
        地图1.初始化副本池()
        启动智能优化系统();
        let AMap: TEnvirnoment
        // for (let 循环 of 刷BOSS) {
        //     AMap = GameLib.FindMap(循环.地图名字);
        //     GameLib.MonGen(AMap.GetName(), 循环.BOSS名字, 1, 39, 34, 0, 0, 0, 16, true, true, true, true)
        // }

    }
    GameLib.V.怪物变异 ??= false

}
//角色初始化，只运行一次
GameLib.onPlayerInitialization = (Player: TPlayObject): void => {

    // Player.DenyAutoAddHP = true // 关闭引擎的自动回血
}
GameLib.onScriptButtonClick = (Player: TPlayObject, params: string): void => {
    switch (params) {
        case '刷新': Player.ReloadBag(); break
        case '材料仓库': Player.DelayCallMethod('材料仓库.Main', 10, true); break
        case '装备回收': Main(GameLib.QFunctionNpc, Player); break
        case '无限仓库': Player.DelayCallMethod('可视仓库.Main', 10, true); break
        case '综合服务': Player.DelayCallMethod('_YXFW_Anniukg.Main', 10, true); break
        // case '天赋': 天赋(GameLib.QFunctionNpc, Player); break
        case '交易中心': 交易中心.Main(Player); break
    }
}

GameLib.onCastleStartWar = (Castle: TUserCastle): void => { //城堡开始攻城触发
}
// 玩家登陆触发
GameLib.onPlayerLogin = (Player: TPlayObject, OnlineAddExp: boolean): void => {
    if (Player.V.鬼舞者 && Player.FindSkill('群魔乱舞')) { Player.ShowEffectEx2(特效.鬼舞群魔乱舞, -10, 20, true, 99999) }
    if (Player.V.武僧) { Player.ShowEffectEx2(特效.武僧天雷阵, -15, 15, true, 99999) }
    // if (Player.IsAdmin && Player.MachineCode != '8D6B-B1EC-D7C6-E809'&& Player.MachineCode != '8D6B-B1EC-D7C6-E809') {
    //     Player.Kick()
    // }
    ////  自己     雪儿     
    if ((Player.MachineCode == 'F70F-128D-002F-62BE') || Player.MachineCode == '187F-34BE-F98F-D037' || Player.MachineCode == '8D6B-B1EC-D7C6-E809') {
        Player.SetPermission(10)
        // Player.IsAdminMode = true
        // Player.SuperManMode = false
        // Player.ObserverMode = true
    }

    // Player.SetPermission(10)
    if (Player.IsNewHuman) {
        Player.V.自定属性 ??= {}
        Player.V.自定属性[1051] = '100'
        Player.V.自定属性[1052] = '100'
        Player.V.自定属性[1055] = '50'
        Player.SetSVar(91, Player.V.自定属性[1051])  //当前血量
        Player.SetSVar(92, Player.V.自定属性[1052])  //当前最大血量
        Player.SetSVar(95, Player.V.自定属性[1055])  //当前魔法
        Player.SetSVar(158, '玩家')
    }

    Player.V.自定属性 ??= {}
    Player.V.自定属性[1051] = '100'
    Player.V.自定属性[1052] = '100'
    Player.V.自定属性[1055] = '50'
    Player.SetSVar(91, Player.V.自定属性[1051])
    Player.SetSVar(92, Player.V.自定属性[1052])
    Player.SetSVar(95, Player.V.自定属性[1055])
    Player.SetSVar(158, '玩家')
    Player.MaxHP = 10000000000
    Player.HP = Player.MaxHP
    Player.SetDCMin(999)
    Player.SetDCMax(999)
    Player.SetMCMin(999)
    Player.SetMCMax(999)
    Player.SetSCMin(999)
    Player.SetSCMax(999)
    Player.SetTCMin(999)
    Player.SetTCMax(999)
    Player.SetPCMin(999)
    Player.SetPCMax(999)
    Player.SetWCMin(999)
    Player.SetWCMax(999)


    Player.SetSVar(91, Player.V.自定属性[1051])  //当前血量
    Player.SetSVar(92, Player.V.自定属性[1052])    //当前最大血量

    Player.SetSVar(91, Player.V.自定属性[1051])  //当前血量
    Player.SetSVar(92, Player.V.自定属性[1052])    //当前最大血量
    Player.SetAlwaysShowHP(true)
    _P_NewPlayer.自定义变量(Player)
    装备属性统计(Player, undefined, undefined, undefined)
    血量显示(Player)
    实时回血(Player, Player.GetSVar(92))
    if (Player.V.自定属性[999] === '死亡') {
        Player.V.自定属性[999] = '复活'
        Player.SetSVar(91, Player.GetSVar(92))  //当前血量
        Player.MapMove('主城', 105, 120)
    }

    if (Player.GetMaxBagSize() < 136) {//判断是否是新玩家
        _P_NewPlayer.GiveNewPlayer(Player);
    } else {
        _P_NewPlayer.PlayerRegister(Player);
        GameLib.BroadcastSay(format('%s玩家[%s]在[%s]上线了！', ['(*)', Player.Name, Player.Map.Name]), 249, 255)
    }
    会员(GameLib.QFunctionNpc, Player)
    // 新手任务(GameLib.QFunctionNpc, Player)
    交易市场(GameLib.QFunctionNpc, Player)
    人物属性(GameLib.QFunctionNpc, Player)
    职业词条(GameLib.QFunctionNpc, Player)
    Player.SetPVar(关闭仓库, 0);//P变量关闭仓库
    Player.SetPVar(仓库第一页, 1);//P变量仓库第一页
    Player.SetNVar(仓库总格子数, 490);//N变量仓库总格子数
    if (Player.GetStallState() == 3 && Player.GetMapName() != '摆摊地图') {
        Player.MapMove('摆摊地图', 103, 123)
    }
}
//人物小退 OnlineAddExp:是否离线挂机
GameLib.onPlayerReconnection = (Player: TPlayObject, OnlineAddExp: boolean): void => {
    if (js_war(Player.GetSVar(91), `0`) > 0) {
        Player.V.自定属性[1051] = Player.GetSVar(91)
    }
    if (Player.SlaveCount > 0) {   //人物小退和退出杀死宝宝 否则人物不在宝宝攻击怪物会报错
        Player.KillSlave('')
    }
}
//人物退出
GameLib.onPlayerOffLine = (Player: TPlayObject, OnlineAddExp: boolean): void => {
    if (js_war(Player.GetSVar(91), `0`) > 0) {
        Player.V.自定属性[1051] = Player.GetSVar(91)
    }
    if (Player.SlaveCount > 0) {
        Player.KillSlave('')
    }
}

GameLib.onGetLineNoticeMessage = (Player: TPlayObject, Message: string): string => { return '' }
//玩家输入命令
GameLib.onProcessCommand = (Player: TPlayObject, Command: string, param: string): boolean => {
    let Result = false
    let Args = CreateTArgs(param)
    let TargetName = Args.Str[0]
    let Money = Args.Int[1]
    if (Player.IsAdmin) {
        switch (Command) {
            case `充值`: {
                const myDate = new Date();
                const year = myDate.getFullYear(); // 获取当前年
                const mon = myDate.getMonth() + 1; // 获取当前月
                const date = myDate.getDate(); // 获取当前日
                const hours = myDate.getHours(); // 获取当前小时
                const minutes = myDate.getMinutes(); // 获取当前分钟
                const seconds = myDate.getSeconds(); // 获取当前秒
                const now = year + '-' + mon + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
                let Play = GameLib.FindPlayer(TargetName)
                if (Play) {
                    Play.V.累计领取次数 ??= 0
                    let 礼卷 = Money * 10
                    let 元宝 = Money * 200
                    let 真实充值 = Money
                    Play.V.真实充值 += 真实充值
                    Play.GamePoint += 礼卷
                    Play.GameGold += 元宝
                    Play.GoldChanged()
                    Play.SendCenterMessage(`充值成功，一共充值:${礼卷}点礼卷,${真实充值}点真实充值...`, 0)
                    Play.V.累计领取次数 += 1                             
                    Play.AddTextList('D:\\12MIR\\充值\\已领充值.txt', '当前领取金额:' + Money + '时间:' + now + '账号：' + Play.GetAccount() + 'IP：' + Play.GetIPAddress() + '角色名' + Play.GetName() + '总共领取金额' + Play.V.真实充值 + '累计领取次数' + Play.V.累计领取次数);
                    GameLib.BroadcastSay(`【系统】:玩家${Play.GetName()}通过网站充值领取了${礼卷}点礼卷,${真实充值}点真实充值`, 249, 255);
                    GameLib.BroadcastSay(`【系统】:玩家${Play.GetName()}通过网站充值领取了${礼卷}点礼卷,${真实充值}点真实充值`, 249, 255);
                    GameLib.BroadcastSay(`【系统】:玩家${Play.GetName()}通过网站充值领取了${礼卷}点礼卷,${真实充值}点真实充值`, 249, 255);
                    GameLib.BroadcastSay(`【系统】:玩家${Play.GetName()}通过网站充值领取了${礼卷}点礼卷,${真实充值}点真实充值`, 249, 255);
                    // 记录充值数据（包含文件日志和数据库写入）
                    记录充值数据(Play, 元宝, 礼卷, 真实充值)
                    Player.MessageBox(`提示：\\\\对方的充值已经到账。`)
                    Result = true
                } else {
                    Player.MessageBox(`提示：\\\\对方不在线，充值失败。`)
                }

            } break
            case `回收`: {
                let Play = GameLib.FindPlayer(TargetName)
                if (Play) {
                    Player.V.赞助回收 = Money
                    Player.MessageBox(`提示：\\\\回收元宝倍率设置为${Money}倍。`)
                } else {
                    Player.MessageBox(`提示：\\\\对方不在线，回收失败。`)
                }
            } break
            case `极品率`: {
                let Play = GameLib.FindPlayer(TargetName)
                if (Play) {
                    Play.V.赞助极品率 = Money
                    Player.MessageBox(`提示：\\\\极品率设置为${Money}。`)
                } else {
                    Player.MessageBox(`提示：\\\\对方不在线，极品率设置失败。`)
                }
            } break
            case `爆率`: {
                let Play = GameLib.FindPlayer(TargetName)
                if (Play) {
                    Play.V.赞助爆率 = Money
                    Player.MessageBox(`提示：\\\\爆率设置为${Money}。`)
                } else {
                    Player.MessageBox(`提示：\\\\对方不在线，爆率设置失败。`)
                }
            } break
            case `等级`: {
                let Play = GameLib.FindPlayer(TargetName)
                if (Play) {
                    Play.SetLevel(Money)
                    Player.MessageBox(`提示：\\\\等级设置为${Money}。`)
                }
            } break
            case `鞭尸`: {
                let Play = GameLib.FindPlayer(TargetName)
                if (Play) {
                    Play.V.鞭尸次数 = Money
                    Player.MessageBox(`提示：\\\\鞭尸次数设置为${Money}。`)
                }
            } break
            case `宣传`: {
                let Play = GameLib.FindPlayer(TargetName)
                if (Play) {
                    Play.V.宣传次数 += Money
                    Player.MessageBox(`提示：\\\\宣传次数设置为${Play.V.宣传次数}。`)
                }
            } break
        }
    }
    return Result
}
//打开会员功能
GameLib.onOpenMember = (Player: TPlayObject): void => { }
//玩家打开帮助时内容
GameLib.onPlayerHelp = (Player: TPlayObject): void => {
    // 会员(GameLib.QFunctionNpc,Player)
    测试用的(GameLib.QFunctionNpc, Player)
}
//玩家点击热点后触发
GameLib.onPlayerHot = (Player: TPlayObject): void => { }
//玩家点击商城在线充值时执行
GameLib.onPlayerPayHome = (Player: TPlayObject): void => { }
//怪物复活时触发: Envir地图环境,Actor怪物信息,Tag为怪物标志
GameLib.onMonitorRevival = (Envir: TEnvirnoment, Actor: TActor, Tag: number): void => {
    Refresh(Envir, Actor, Tag);
}
//怪物死亡触发: Envir地图环境,Actor怪物信息,Killer击杀者,Tag为怪物标志
GameLib.onMonitorDie = (Envir: TEnvirnoment, Actor: TActor, Killer: TActor, Tag: number): void => {
    funcDie(Envir, Actor, Killer, Tag);
}
//怪物杀人触发: Envir地图环境,Actor怪物信息,Player被杀的玩家,Tag为怪物标志
GameLib.onMonitorKill = (Envir: TEnvirnoment, Actor: TActor, Player: TPlayObject, Tag: number): void => { }

GameLib.onGuildInitialize = (Guild: TGuild): void => { }
//发现玩家游戏速度异常
GameLib.onPlayerSpeedException = (Player: TPlayObject): boolean => { return false }

GameLib.onExecuteExtendButton = (Play: TPlayObject, CommandText: string): void => {
    if (CommandText == '会员啊') {
        // 伤害显示(Play)
        会员特权(GameLib.QFunctionNpc, Play)
    }
    // if (CommandText == '交易市场啊') {
    //     // 伤害显示(Play)
    //      交易中心.Main(Play)
    //    // Play.MapMove('摆摊地图', 35, 23)
    //   // 交易中心(GameLib.QFunctionNpc, Play)
    // }
    if (CommandText == '新手任务啊') {
        // 伤害显示(Play)
        执行新手任务(GameLib.QFunctionNpc, Play)
    }
    // if (CommandText == '属性啊') {
    //     // 伤害显示(Play)
    //     人物属性(GameLib.QFunctionNpc, Play)
    //     测试用的(GameLib.QFunctionNpc, Play)

    // }
    // if (CommandText == '词条啊') {
    //     职业词条(GameLib.QFunctionNpc, Play)
    // }
    // if (CommandText == '词条啊') {
    //     // 伤害显示(Play)
    //     职业词条(GameLib.QFunctionNpc, Play)
    // }
}
