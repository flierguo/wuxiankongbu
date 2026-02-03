// import * as XXXX from "../功能脚本组/[XX]/XXXX"
import * as 登录触发 from "../_核心部分/_玩家/登录触发"
import { Refresh as 新刷怪属性 } from "../_核心部分/_生物/生物属性"
import { 仓库总格子数, 仓库第一页, 关闭仓库, 技能ID, 特效 } from "../_核心部分/基础常量"
import { Main } from "../_核心部分/_装备/装备回收"
import * as 交易中心 from "../_核心部分/_服务/交易中心"
import { 计算伤害 } from '../_核心部分/攻击计算';
import { 属性下一页, 装备属性统计 } from "../_核心部分/_装备/属性统计"
import { 自动设置, 提示设置 , 保护设置} from "../_核心部分/_服务/界面配置"
import { 实时回血, 血量显示 } from "../_核心部分/字符计算"
import { js_war, 智能计算 } from "../_大数值/核心计算方法"
import * as 地图1 from '../_核心部分/_地图/地图';
import { 记录充值数据 } from "../_核心部分/_服务/充值属性"
import * as 基础常量 from "../_核心部分/基础常量"

import { 完整地图配置 } from "../_核心部分/世界配置"
import { 测试功能 } from "../_核心部分/测试功能"

// 判断是否使用新刷怪系统的地图
function 是新刷怪系统地图(地图名: string): boolean {
    return 完整地图配置.some(c => 地图名.includes(c.地图名))
}

// 统一刷怪属性函数
function Refresh(Envir: TEnvirnoment, Monster: TActor, Tag: number): void {
    const 地图显示名 = Envir.DisplayName || Envir.GetName() || ''
    if (是新刷怪系统地图(地图显示名)) {
        新刷怪属性(Envir, Monster, Tag)
    }
}


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

    if (SkillID == 170) {
        ADamageSource.DamageDelay(ActorObject, 1, 300, 10170)
    }

    // 爆裂火冢：20%几率造成3格范围300%伤害,每级提高30%
    // 注意：必须检查当前技能不是爆裂火冢本身，避免无限递归
    if (ADamageSource.IsPlayer() && !ActorObject.IsPlayer() && SkillID !== 技能ID.烈焰.爆裂火冢) {
        let Player = ADamageSource as TPlayObject
        if (random(100) < 20 && Player.V.职业 === '烈焰') {
            Player.MagicAttack(ActorObject, 技能ID.烈焰.爆裂火冢)
        }
    }

    // ========== 正义职业被动技能：审判和神罚 ==========
    // 这些是直接对怪物血量进行操作的最终伤害，不经过技能加成流程
    if (ADamageSource.IsPlayer() && !ActorObject.IsPlayer()) {
        let Player = ADamageSource as TPlayObject
        if (Player.V.职业 === '正义') {
            const 敌人当前血量 = ActorObject.GetSVar(91);
            const 敌人最大血量 = ActorObject.GetSVar(92);

            // 审判：对满血目标造成血量切割
            // 切割比例：2% + 等级/200（上限20%）
            if (敌人当前血量 === 敌人最大血量) {
                const 等级 = Player.V.审判等级 || 1;
                const 切割比例 = Math.min(2 + Math.floor(等级 / 200), 20) / 100;
                // 直接扣除怪物血量
                const 切割伤害 = 智能计算(敌人最大血量, String(切割比例), 3);
                const 剩余血量 = 智能计算(敌人当前血量, 切割伤害, 2);
                ActorObject.ShowEffectEx2(基础常量.特效.审判, -10, 20, true, 1);
                ActorObject.SetSVar(91, js_war(剩余血量, '0') < 0 ? '0' : 剩余血量);
                血量显示(ActorObject);
                Player.SendCountDownMessage(`【审判】触发！切割${(切割比例 * 100).toFixed(0)}%最大血量`, 0);
            }

            // 神罚：1%几率造成敌人当前生命百分比伤害
            // 比例：1% + 等级/200（上限20%）
            if (random(200) < 1) {
                const 等级 = Player.V.神罚等级 || 1;
                const 比例 = Math.min(1 + Math.floor(等级 / 200), 20) / 1000;
                // 直接扣除怪物血量
                const 神罚伤害 = 智能计算(敌人当前血量, String(比例), 3);
                const 剩余血量 = 智能计算(敌人当前血量, 神罚伤害, 2);
                ActorObject.ShowEffectEx2(基础常量.特效.神罚, 0, 0, true, 1);
                ActorObject.SetSVar(91, js_war(剩余血量, '0') < 0 ? '0' : 剩余血量);
                血量显示(ActorObject);
                Player.SendCountDownMessage(`【神罚】触发！造成${(比例 * 1000).toFixed(1)}‰当前血量伤害`, 0);
            }
        }
    }

    return 1
}
GameLib.onRightClickMapPos = (Player: TPlayObject, MapX: number, MapY: number): void => {
    if (Player.GetPermission() == 10) {
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
        case '随身仓库': Player.DelayCallMethod('可视仓库.Main', 10, true); break
        case '综合服务': Player.DelayCallMethod('_YXFW_Anniukg.Main', 10, true); break
        case '关闭提示': 提示设置(GameLib.QFunctionNpc, Player); break
        case '自动': 保护设置(GameLib.QFunctionNpc, Player); break
        // case '天赋': 天赋(GameLib.QFunctionNpc, Player); break
        case '交易市场': 交易中心.Main(Player); break
        case '属性下一页': 属性下一页(Player); break
    }
}

GameLib.onCastleStartWar = (Castle: TUserCastle): void => { //城堡开始攻城触发
}
// 玩家登陆触发
GameLib.onPlayerLogin = (Player: TPlayObject, OnlineAddExp: boolean): void => {

    ////  自己     雪儿     
    if ((Player.MachineCode == 'F70F-128D-002F-62BE') || Player.MachineCode == '187F-34BE-F98F-D037' || Player.MachineCode == '8D6B-B1EC-D7C6-E809') {
        Player.SetPermission(10)
    }

    // Player.SetPermission(10)
    // 新玩家初始化
    if (Player.IsNewHuman) {
        Player.V.自定属性 ??= {}
        Player.V.自定属性[1051] = '100'  // 初始当前血量
        Player.V.自定属性[1055] = '50'   // 初始魔法
    }

    // 确保变量存在
    Player.V.自定属性 ??= {}
    Player.V.自定属性[1051] ??= '100'
    Player.V.自定属性[1055] ??= '50'
    
    // 标识为玩家
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
    Player.SetAlwaysShowHP(true)
    登录触发.自定义变量(Player)
    装备属性统计(Player)
    血量显示(Player)
    实时回血(Player, Player.GetSVar(92))

    if (Player.V.自定属性[999] === '死亡') {
        Player.V.自定属性[999] = '复活'
        // 复活时恢复满血
        Player.SetSVar(91, Player.GetSVar(92))  // 当前血量 = 最大血量
        Player.V.自定属性[1051] = Player.GetSVar(91)  // 同步到V变量
        Player.MapMove('主城', 105, 120)
    }

    if (Player.GetMaxBagSize() < 136) {//判断是否是新玩家
        登录触发.GiveNewPlayer(Player);
    } else {
        登录触发.PlayerRegister(Player);
        GameLib.BroadcastSay(format('%s玩家[%s]在[%s]上线了！', ['(*)', Player.Name, Player.Map.Name]), 249, 255)
    }

    // 交易市场(GameLib.QFunctionNpc, Player)


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
    测试功能(GameLib.QFunctionNpc, Player)
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

}
//怪物杀人触发: Envir地图环境,Actor怪物信息,Player被杀的玩家,Tag为怪物标志
GameLib.onMonitorKill = (Envir: TEnvirnoment, Actor: TActor, Player: TPlayObject, Tag: number): void => { }

GameLib.onGuildInitialize = (Guild: TGuild): void => { }
//发现玩家游戏速度异常
GameLib.onPlayerSpeedException = (Player: TPlayObject): boolean => { return false }

GameLib.onExecuteExtendButton = (Play: TPlayObject, CommandText: string): void => {

}
