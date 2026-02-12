import { _P_P_AbilityData, } from "../功能脚本组/[玩家]/_P_Base"
import * as _P_Base from "../功能脚本组/[玩家]/_P_Base"
import { 人物属性随机 } from "../功能脚本组/[玩家]/_P_Base"
import { TAG, _M_N_宝宝释放群雷, _M_N_猎人宝宝群攻, 原始名字, 宝宝基础技能, 宝宝高级技能, 怪物星数 } from "../功能脚本组/[怪物]/_M_Base"
import { 取两点距离 } from "./RobotManageNpc"
import { 实时回血, 血量显示 } from "../大数值版本/字符计算"
import { js_number } from "../全局脚本[公共单元]/utils/计算方法"
import { 大数值整数简写 } from "../功能脚本组/[服务]/延时跳转"


GameLib.onMonSelectMagicBeforeAttack = (AMon: TActor, ATarget: TActor, AMagicID: number): number => {
    // console.log(AMon.GetName()+'对方名字='+ATarget.GetName())
    if (AMon.GetNVar(_M_N_宝宝释放群雷) == 1) { AMagicID = 10056 }
    if (AMon.GetNVar(_M_N_猎人宝宝群攻) == 1) { AMagicID = 10058 }

    if (AMon.GetName() == '战仙·人形怪') { AMagicID = 10064 }
    if (AMon.GetName() == '法仙·人形怪') { AMagicID = 10065 }
    if (AMon.GetName() == '道仙·人形怪') { AMagicID = 10066 }

    if (AMon.GetName() == '畜生道轮回兽') { AMagicID = 10072 }
    if (AMon.GetName() == '饿鬼道轮回兽') { AMagicID = 10073 }
    if (AMon.GetName() == '地狱道轮回兽') { AMagicID = 10074 }
    if (AMon.GetName() == '修罗道轮回兽') { AMagicID = 10075 }
    if (AMon.GetName() == '人道轮回兽') { AMagicID = 10076 }
    if (AMon.GetName() == '天道轮回兽') { AMagicID = 10077 }

    if (AMon.GetName().includes('远古树精')) {
        if (random(100) < 20) {
            AMagicID = 10094
        } else if (random(100) < 10) {
            AMagicID = 10090
        } else {
            AMagicID = 10100
        }
    }


    if (AMon.GetName().includes('暗黑法师')) {
        if (random(100) < 20) {
            AMagicID = 10095
        } else if (random(100) < 10) {
            AMagicID = 10093
        } else { AMagicID = 10091 }
    }
    if (AMon.GetName().includes('圣光骑士')) {
        if (random(100) < 20) {
            AMagicID = 10098
        } else if (random(100) < 10) {
            AMagicID = 10099
        } else {
            AMagicID = 10097
        }
    }

    if (AMon.GetName().includes('暗影虎王')) {
        if (random(100) < 20) {
            AMagicID = 10088
        } else {
            AMagicID = 10101
        }
    }
    if (AMon.GetName().includes('地狱九头蛇')) {
        if (random(100) < 20) {
            AMagicID = 10089
        } else {
            AMagicID = 10102
        }
    }

    let Player = AMon.Master as TPlayObject
    if (Player) {
        if (AMon.GetNVar(宝宝高级技能) == 1) {
            if (DateUtils.SecondSpan(DateUtils.Now(), Player.VarDateTime('宝宝倚天').AsDateTime) >= 15) {
                AMagicID = 10087
                Player.VarDateTime('宝宝倚天').AsDateTime = DateUtils.Now()
            } else if (DateUtils.SecondSpan(DateUtils.Now(), Player.VarDateTime('宝宝逐日').AsDateTime) >= 10) {
                AMagicID = 10086
                Player.VarDateTime('宝宝逐日').AsDateTime = DateUtils.Now()
            } else if (DateUtils.SecondSpan(DateUtils.Now(), Player.VarDateTime('宝宝开天斩').AsDateTime) >= 10) {
                AMagicID = 10085
                Player.VarDateTime('宝宝开天斩').AsDateTime = DateUtils.Now()
            } else if (DateUtils.SecondSpan(DateUtils.Now(), Player.VarDateTime('宝宝烈火').AsDateTime) >= 10) {
                AMagicID = 10084
                Player.VarDateTime('宝宝烈火').AsDateTime = DateUtils.Now()
            } else if (AMon.GetNVar(宝宝基础技能) == 1) {
                if (random(100) < 10) {
                    AMagicID = 10081
                } else {
                    let AActorList: TActorList;
                    let a = 0
                    AActorList = Player.Map.GetActorListInRange(AMon.GetMapX(), AMon.GetMapY(), 1, '');
                    for (let i = 0; i < AActorList.Count; i++) {
                        let Actor = AActorList.Actor(i);
                        if (Actor != null && !Actor.GetDeath() && !Actor.IsNPC() && Actor.GetHandle() != AMon.GetHandle() && !Actor.GetInSafeZone()) {
                            a++
                        }
                    }
                    if (a > 1) {
                        AMagicID = 10083   //半月
                    } else {
                        AMagicID = 10082  //刺杀
                    }
                }
            }
        } else if (AMon.GetNVar(宝宝基础技能) == 1) {
            if (random(100) < 10) {
                AMagicID = 10081
            } else {
                let AActorList: TActorList;
                let a = 0
                AActorList = Player.Map.GetActorListInRange(Player.GetMapX(), Player.GetMapY(), 1, '');
                for (let i = 0; i < AActorList.Count; i++) {
                    let Actor = AActorList.Actor(i);
                    if (Actor != null && !Actor.GetDeath() && !Actor.IsNPC() && Actor.GetHandle() != AMon.GetHandle() && Actor.GetHandle() != Player.GetHandle() && !Actor.GetInSafeZone()) {
                        a++
                    }
                }
                if (a > 1) {
                    AMagicID = 10083   //半月
                } else {
                    AMagicID = 10082  //刺杀
                }
            }
        }


    }
    return AMagicID
}


export function 万剑归宗(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    let bPlayer: TPlayObject = Target as TPlayObject
    if (!Player.InSafeZone) {


        if (bPlayer.IsPlayer() && random(100) >= Player.R.抵抗异常) {
            bPlayer.SetState(5, 3, 0)
        } else if (Player.SlaveCount > 0) {
            for (let a = 0; a <= Player.SlaveCount; a++) {
                if (Player.GetSlave(a) != null && Player.GetSlave(a).Handle != Target.Handle) {
                    Target.SetState(5, 3, 0)
                }
            }
        } else {
            Target.SetState(5, 3, 0)
        }
        Player.Damage(Target, 1, _P_Base.技能ID.战神.万剑归宗主动)
    }
}
export function 圣光打击(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    const 范围 = Math.min(Number(Player.R.攻击范围) + 1 , 4)
    let 目标列表 = 获取目标范围内目标(Player, Target, 范围 , false)
    for (const 目标 of 目标列表)  {
        Player.Damage(目标, 1, _P_Base.技能ID.骑士.圣光打击被动)
    }
}

export function 召唤战神(Source: TActor): void {
    let Player: TPlayObject = Source as TPlayObject;
    let 召唤数量 = 1
    if (Player.V.契约专精激活) { 召唤数量 = 召唤数量 + Math.floor(Player.R.契约点数 * 2 / 50) } else { 召唤数量 = 召唤数量 + Math.floor(Player.R.契约点数 / 50) }

    战神宝宝(Player, '战神', 1, 1, 召唤数量)
}

export function 愤怒(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.骑士.愤怒被动)
}


export function 审判救赎(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.骑士.审判救赎主动)
}
export function 冰霜之环(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    let bPlayer: TPlayObject = Target as TPlayObject
    if (!Player.InSafeZone) {
        if (bPlayer.IsPlayer() && random(100) >= Player.R.抵抗异常) {
            bPlayer.SetState(5, 1, 0)
            bPlayer.ShowEffectEx2(_P_Base.特效.冰冻, -10, 25, true, 1)
        } else {
            Target.SetState(5, 1, 0)
            Target.ShowEffectEx2(_P_Base.特效.冰冻, -10, 25, true, 1)
        }
        Player.Damage(Target, 1, _P_Base.技能ID.冰法.冰霜之环被动)
    }
}
export function 萌萌浣熊(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    let 召唤数量 = 1
    if (Player.V.契约专精激活) { 召唤数量 = 召唤数量 + Math.floor(Player.R.契约点数 * 2 / 30) } else { 召唤数量 = 召唤数量 + Math.floor(Player.R.契约点数 / 30) }
    let 继承倍率 = 1 + (Player.R.拉布拉多等级 + Player.V.拉布拉多等级 + Player.R.所有技能等级) * 0.05
    驯兽师召宝宝(Player, '萌萌浣熊', 1, 继承倍率, 召唤数量)
}
export function 嗜血狼人(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    let 召唤数量 = 1
    if (Player.V.契约专精激活) { 召唤数量 = 召唤数量 + Math.floor(Player.R.契约点数 * 2 / 40) } else { 召唤数量 = 召唤数量 + Math.floor(Player.R.契约点数 / 40) }
    let 继承倍率 = 1 + (Player.R.嗜血狼人等级 + Player.V.嗜血狼人等级 + Player.R.所有技能等级) * 0.05
    驯兽师召宝宝(Player, '嗜血狼人', 5, 继承倍率, 召唤数量)
}
export function 丛林虎王(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    let 召唤数量 = 1
    if (Player.V.契约专精激活) { 召唤数量 = 召唤数量 + Math.floor(Player.R.契约点数 * 2 / 50) } else { 召唤数量 = 召唤数量 + Math.floor(Player.R.契约点数 / 50) }
    let 继承倍率 = 2 + (Player.R.丛林虎王等级 + Player.V.丛林虎王等级 + Player.R.所有技能等级) * 0.1
    驯兽师召宝宝(Player, '丛林虎王', 1, 继承倍率, 召唤数量)
}
export function 雷暴之怒(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    Player.R.宝宝释放群雷 = true
    for (let a = 0; a <= Player.SlaveCount; a++) {
        if (Player.GetSlave(a)) {
            Player.GetSlave(a).SetNVar(_M_N_宝宝释放群雷, 1)
        }
    }
    let 宝宝群雷 = Player.AddStatusBuff(_P_Base.显示图标.宝宝群雷, TBuffStatusType.stNone, 40000, 0, 0) //给人物加个BUFF，方便增加一个BUFF图标
    Player.SetBuffIcon(宝宝群雷.Handle, 'icons.data', 142, 142, '{S=‘雷暴之怒’技能触发:40秒内宝宝攻击目标将会触发群体雷电技能;C=251}', '', '使用‘雷暴之怒’技能触发:40秒内宝宝攻击目标将会触发群体雷电技能！', true/*是否消失前3秒钟闪烁*/, true/*是否在图标底部显示剩余时间*/)
    Player.DelayCallMethod('延时跳转.宝宝群雷关闭'/*要调用的函数名*/, 40000/*延迟时间1000毫秒*/, true/*切换地图不删除该延迟调用*/);
}

//牧师
export function 妙手回春(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    let 恢复血量 = js_number(Player.R.自定属性[163], `2`, 3)
    // 恢复血量 = 恢复血量 + 恢复血量 * Player.R.妙手回春等级 * 0.2
    恢复血量 = js_number(js_number(js_number(恢复血量, Player.R.妙手回春等级, 3), `0.2`, 3), 恢复血量, 1)
    let P: TPlayObject
    if (Player.GroupOwner) {//如果存在队长
        for (let I = 0; I <= Player.GroupCount - 1; I++) {
            P = Player.GetGroupMember(I)
            if (取两点距离(Player.MapX, Player.MapY, P.MapX, P.MapY) <= 10) {
                P.ShowEffectEx2(_P_Base.特效.妙手回春, -13, 25, true, 1)
                实时回血(P, 恢复血量)
                // P.SetHP(P.GetHP() + 恢复血量)
            }
        }
    } else {
        Player.ShowEffectEx2(_P_Base.特效.妙手回春, -13, 25, true, 1)
        实时回血(Player, 恢复血量)
    }
}
export function 互相伤害(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    if (!Target.IsPlayer()) {
        Player.Damage(Target, 1, _P_Base.技能ID.牧师.互相伤害被动)
    }
    // if(DateUtils.MilliSecondSpan(DateUtils.Now(), Player.VarDateTime('互相伤害技能冷却').AsDateTime) > 500){
    //   Player.VarDateTime(`互相伤害技能冷却`).AsDateTime = DateUtils.Now()
    // }
}
//刺客
export function 弱点(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    let AActorList: TActorList;
    if (Player.R.暗影值 < 1) { Player.SendMessage('暗影值不足1点,无法使用弱点技能!'); return }
    Player.R.暗影值 = Player.R.暗影值 - 1
    let 暗影值 = Player.AddStatusBuff(_P_Base.显示图标.暗影值, TBuffStatusType.stNone, 0, 0, 0) //给人物加个BUFF，方便增加一个BUFF图标
    Player.SetBuffIcon(暗影值.Handle, 'icons.data', 148, 148, ``, '', `{S=当前‘暗影值’数量:${Player.R.暗影值};C=251}`, true/*是否消失前3秒钟闪烁*/, true/*是否在图标底部显示剩余时间*/)
    if (Player.R.暗影值 < 1) { Player.DeleteBuff(暗影值.Handle) }
    Player.FlashMove(Player.MapX, Player.MapY, true) //破除隐身
    Player.ShowEffectEx2(_P_Base.特效.刺客弱点, -10, 20, true, 1)
    const 范围 = Math.min(4 + Number(Player.R.攻击范围) , 10)
    AActorList = Player.Map.GetActorListInRange(Player.GetMapX(), Player.GetMapY(), 范围, '');
    for (let i = 0; i < AActorList.Count; i++) {
        let Actor = AActorList.Actor(i);
        if (Actor != null && !Actor.GetDeath() && !Actor.IsNPC() && Actor.GetHandle() != Player.GetHandle()) {
            Player.Damage(Actor, 1, _P_Base.技能ID.刺客.弱点主动)
        }
    }
}
export function 增伤(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    if (Player.R.暗影值 < 1) { Player.SendMessage('暗影值不足1点,无法使用增伤技能!'); return }
    if (DateUtils.SecondSpan(DateUtils.Now(), Player.VarDateTime('增伤').AsDateTime) >= 120) {
        Player.VarDateTime('增伤').AsDateTime = DateUtils.Now()
        Player.R.暗影值 = Player.R.暗影值 - 1
        let 暗影值 = Player.AddStatusBuff(_P_Base.显示图标.暗影值, TBuffStatusType.stNone, 0, 0, 0) //给人物加个BUFF，方便增加一个BUFF图标
        Player.SetBuffIcon(暗影值.Handle, 'icons.data', 148, 148, ``, '', `{S=当前‘暗影值’数量:${Player.R.暗影值};C=251}`, true/*是否消失前3秒钟闪烁*/, true/*是否在图标底部显示剩余时间*/)
        if (Player.R.暗影值 < 1) { Player.DeleteBuff(暗影值.Handle) }
        let 暴击几率 = 10 + 10 * Player.R.增伤等级 * 0.1
        Player.R.暴击几率 = 暴击几率
        let 刺客增伤 = Player.AddStatusBuff(_P_Base.显示图标.刺客增伤, TBuffStatusType.stNone, 110000, 0, 0) //给人物加个BUFF，方便增加一个BUFF图标
        Player.SetBuffIcon(刺客增伤.Handle, 'icons.data', 145, 145, '{S=‘增伤’技能触发:增加暴击几率1%,持续110秒!;C=251}', '', '‘增伤’技能触发:增加暴击几率1%,持续110秒!', true/*是否消失前3秒钟闪烁*/, true/*是否在图标底部显示剩余时间*/)
    } else {
        Player.SendCountDownMessage(`‘增伤’技能CD中剩余时间：${120 - Math.round(DateUtils.SecondSpan(DateUtils.Now(), Player.VarDateTime('增伤').AsDateTime))}`, 0);
    }
}
export function 暗影杀阵(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    Player.Damage(Target, 1, 10030)
}
export function 暗影杀阵闪现(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    switch (true) {
        case Target.GetMap().CanMove(Target.GetMapX() + 1, Target.GetMapY(), true) == true: Player.FlashMove(Target.GetMapX() + 1, Target.GetMapY(), true); break
        case Target.GetMap().CanMove(Target.GetMapX() - 1, Target.GetMapY(), true) == true: Player.FlashMove(Target.GetMapX() - 1, Target.GetMapY(), true); break
        case Target.GetMap().CanMove(Target.GetMapX(), Target.GetMapY() + 1, true) == true: Player.FlashMove(Target.GetMapX(), Target.GetMapY() + 1, true); break
        case Target.GetMap().CanMove(Target.GetMapX(), Target.GetMapY() - 1, true) == true: Player.FlashMove(Target.GetMapX(), Target.GetMapY() - 1, true); break
        case Target.GetMap().CanMove(Target.GetMapX() - 1, Target.GetMapY() - 1, true) == true: Player.FlashMove(Target.GetMapX() - 1, Target.GetMapY() - 1, true); break
        case Target.GetMap().CanMove(Target.GetMapX() + 1, Target.GetMapY() - 1, true) == true: Player.FlashMove(Target.GetMapX() + 1, Target.GetMapY() - 1, true); break
        case Target.GetMap().CanMove(Target.GetMapX() - 1, Target.GetMapY() + 1, true) == true: Player.FlashMove(Target.GetMapX() - 1, Target.GetMapY() + 1, true); break
        case Target.GetMap().CanMove(Target.GetMapX() + 1, Target.GetMapY() + 1, true) == true: Player.FlashMove(Target.GetMapX() + 1, Target.GetMapY() + 1, true); break
    }

}

// 鬼舞者
export function 鬼舞斩(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;

    const 范围 = Math.min(Number(Player.R.攻击范围)+1 , 4)
    let 目标列表 = 获取目标范围内目标(Player, Target ,范围, true)
    for (const 目标 of 目标列表) {
        Player.Damage(目标, 1, _P_Base.技能ID.鬼舞者.鬼舞斩被动)
    }
}
export function 鬼舞术(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.鬼舞者.鬼舞术被动)
}
export function 群魔乱舞(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    Player.ShowEffectEx2(_P_Base.特效.鬼舞群魔乱舞, -10, 20, true, 1)
    Player.Damage(Target, 1, _P_Base.技能ID.鬼舞者.群魔乱舞被动)
}
//神射手
export function 万箭齐发啊(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void  {
    let Player: TPlayObject = Source as TPlayObject;
    const 范围 = Math.min(Number(Player.R.攻击范围)+1 , 4)
    let 目标列表 = 获取目标范围内目标(Player, Target ,范围, true)
    for (const 目标 of 目标列表) {
        Player.Damage(目标, 1, 10057)
    }

}
export function 复仇(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.神射手.复仇被动)
}

//猎人
export function 分裂箭(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    const 范围 = Math.min(Number(Player.R.攻击范围)+1 , 4)
    let 目标列表 = 获取目标范围内目标(Player, Target ,范围, false)
    for (const 目标 of 目标列表) {
    Player.Damage(目标, 1, _P_Base.技能ID.猎人.分裂箭被动)
    }

}
export function 召唤宠物(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    let 召唤数量 = 1
    if (Player.V.契约专精激活) { 召唤数量 = 召唤数量 + Math.floor(Player.R.契约点数 * 2 / 40) } else { 召唤数量 = 召唤数量 + Math.floor(Player.R.契约点数 / 50) }
    let 攻击距离 = 1
    if (Player.R.猎人宝宝释放群攻) {
        攻击距离 = 8
    }
    let 继承倍率 = 1 + (Player.R.召唤宠物等级 + Player.V.召唤宠物等级 + Player.R.所有技能等级) * 0.05
    猎人召唤宝宝(Player, '灵魂宝宝', 攻击距离, 继承倍率, 召唤数量)
}
export function 宠物突变(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    Player.R.猎人宝宝释放群攻 = true
    for (let a = 0; a <= Player.SlaveCount; a++) {
        if (Player.GetSlave(a)) {
            Player.GetSlave(a).SetNVar(_M_N_猎人宝宝群攻, 1)
            if (Player.R.猎人宝宝释放群攻) {
                Player.GetSlave(a).SetAttackRange(8)
            }
        }
    }
    let 宝宝群攻 = Player.AddStatusBuff(_P_Base.显示图标.猎人宝宝群攻, TBuffStatusType.stNone, 30000, 0, 0) //给人物加个BUFF，方便增加一个BUFF图标
    Player.SetBuffIcon(宝宝群攻.Handle, 'icons.data', 151, 151, '{S=‘宠物突变’技能触发:30秒内宝宝变为群体攻击,伤害,血量提升100%.结束后宠物将消失需从新召唤;C=251}', '', '使用‘宠物突变’技能触发:30秒内宝宝变为群体攻击,伤害,血量提升100%.结束后宠物将消失需从新召唤', true/*是否消失前3秒钟闪烁*/, true/*是否在图标底部显示剩余时间*/)
    Player.DelayCallMethod('延时跳转.猎人宝宝群攻关闭'/*要调用的函数名*/, 30000/*延迟时间1000毫秒*/, true/*切换地图不删除该延迟调用*/);
}

//武僧

export function 天雷阵(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    const 范围 = Math.min(Number(Player.R.攻击范围)+3 , 7)
    let 目标列表 = 获取玩家范围内目标(Player, 范围)
    for (const 目标 of 目标列表) {
        Player.Damage(目标, 1, _P_Base.技能ID.武僧.天雷阵被动)
    }
    // Player.Damage(Target, 1, _P_Base.技能ID.武僧.天雷阵被动)
}
export function 至高武术(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    let bPlayer: TPlayObject = Target as TPlayObject
    if (bPlayer.IsPlayer() && random(100) >= Player.R.抵抗异常) {
        Target.SetState(5, 2 + Math.floor((Player.R.至高武术等级 + Player.V.至高武术等级 + Player.R.所有技能等级) / 10), 0)
    } else {
        Target.SetState(5, 2 + Math.floor((Player.R.至高武术等级 + Player.V.至高武术等级 + Player.R.所有技能等级) / 10), 0)
    }

}
export function 碎石破空(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.武僧.碎石破空被动)
}
//罗汉
export function 金刚护体(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    Player.R.罗汉技能伤害 = true
    let 金刚护体 = Player.AddStatusBuff(_P_Base.显示图标.武僧金刚护体, TBuffStatusType.stNone, 40000, 0, 0) //给人物加个BUFF，方便增加一个BUFF图标
    Player.SetBuffIcon(金刚护体.Handle, 'icons.data', 154, 154, '{S=‘金刚护体’技能触发:30秒内伤害增加;C=251}', '', '‘金刚护体’技能触发:30秒内伤害增加', true/*是否消失前3秒钟闪烁*/, true/*是否在图标底部显示剩余时间*/)
    Player.DelayCallMethod('延时跳转.罗汉金刚护体关闭'/*要调用的函数名*/, 40000/*延迟时间1000毫秒*/, true/*切换地图不删除该延迟调用*/);
}
export function 擒龙功(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    let bPlayer: TPlayObject = Target as TPlayObject
    Target.Move(Target.GetMapName(), Player.GetMapX(), Player.GetMapY())
    if (bPlayer.IsPlayer() && random(100) >= Player.R.抵抗异常) {
        Target.SetState(5, 2 + Math.floor((Player.R.擒龙功等级 + Player.V.擒龙功等级 + Player.R.所有技能等级) / 10), 0)
        Target.ShowEffectEx2(_P_Base.特效.冰冻, -10, 25, true, 2 + Math.floor((Player.R.擒龙功等级 + Player.V.擒龙功等级 + Player.R.所有技能等级) / 10))
    } else {
        Target.SetState(5, 2 + Math.floor((Player.R.擒龙功等级 + Player.V.擒龙功等级 + Player.R.所有技能等级) / 10), 0)
        Target.ShowEffectEx2(_P_Base.特效.冰冻, -10, 25, true, 2 + Math.floor((Player.R.擒龙功等级 + Player.V.擒龙功等级 + Player.R.所有技能等级) / 10))
    }

}
export function 金刚护法(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.罗汉.金刚护法被动)
}

export function 轮回之道(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    let 召唤数量 = 1
    let 宝宝名字 = ''
    if (Player.V.契约专精激活) { 召唤数量 = 召唤数量 + Math.floor(Player.R.契约点数 * 2 / 60) } else { 召唤数量 = 召唤数量 + Math.floor(Player.R.契约点数 / 60) }
    switch (true) {
        case Player.V.轮回次数 < 10: 宝宝名字 = '畜生道轮回兽'; break
        case Player.V.轮回次数 >= 10 && Player.V.轮回次数 < 20: 宝宝名字 = '饿鬼道轮回兽'; break
        case Player.V.轮回次数 >= 20 && Player.V.轮回次数 < 30: 宝宝名字 = '地狱道轮回兽'; break
        case Player.V.轮回次数 >= 30 && Player.V.轮回次数 < 40: 宝宝名字 = '修罗道轮回兽'; break
        case Player.V.轮回次数 >= 40 && Player.V.轮回次数 < 50: 宝宝名字 = '人道轮回兽'; break
        case Player.V.轮回次数 == 50: 宝宝名字 = '天道轮回兽'; break
    }
    let 继承倍率 = 2 + (Player.R.轮回之道等级 + Player.V.轮回之道等级 + Player.R.所有技能等级) * 0.1
    // console.log('123')
    罗汉宝宝(Player, 宝宝名字, 1, 继承倍率, 召唤数量)
}



export function 罗汉金钟(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    Player.SetSuperManMode(true)
    Player.ShowEffectEx2(_P_Base.特效.罗汉无敌, -10, 25, true, 3)
    Player.DelayCallMethod('延时跳转.罗汉无敌关闭'/*要调用的函数名*/, 3000/*延迟时间1000毫秒*/, true/*切换地图不删除该延迟调用*/);
    Player.Damage(Target, 1, _P_Base.技能ID.罗汉.罗汉金钟主动)
}

export function 施毒术给点伤害(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.通用.施毒术给伤害)
}

export function 查看属性(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    if (Target != null && !Target.IsPlayer() && Target.Master == null) {
        let 生命 = Target.GetSVar(92)
        let 攻击小 = Target.GetSVar(93)
        let 攻击大 = Target.GetSVar(94)
        let 防御小 = Target.GetSVar(95)
        let 防御大 = Target.GetSVar(96)
        // let 星星 = Target.GetSVar(97)
        let 星数 = Target.GetSVar(怪物星数)
        const 计算位数 = (num: string) => num.toString().replace(/\.\d+/, '').length
        Player.SendMessage(`${Target.GetSVar(原始名字)}属性:`, 1)
        Player.SendMessage(`生命:${大数值整数简写(生命)}  ${计算位数(生命)}位   攻击:${大数值整数简写(攻击小)}-${大数值整数简写(攻击大)} ${计算位数(攻击大)}位  防御:${大数值整数简写(防御小)}-${大数值整数简写(防御大)} ${计算位数(防御大)}位`, 1)
        Player.SendMessage(`星星数量:${大数值整数简写(星数)} ${计算位数(星数)}位`, 1)
        // // Player.SendMessage(`, 1)
        // Player.SendMessage(``, 1)
        // console.log(Target.HP)
        // console.log(Target.MaxHP)an
        // let 伤害值 = 0
        // if (Player.V.种族 == '兽族') {
        //     伤害值 = (人物属性随机(Player) - _P_Base.人物防御随机(Target) * 0.5)
        // } else {
        //     伤害值 = (人物属性随机(Player) - _P_Base.人物防御随机(Target))
        // }
        // Player.Damage(Target, 1)
    }
}



export function 心灵召唤(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    let 宝宝: TActor
    if (Player.SlaveCount > 0) {
        for (let a = 0; a <= Player.SlaveCount; a++) {
            if (Player.GetSlave(a) != null) {
                宝宝 = Player.GetSlave(a)
                if (Player.GetMap().CanMove(Player.GetMapX() + 1, Player.GetMapY(), true) == true) {
                    宝宝.Move(Player.GetMapName(), Player.GetMapX() + 1, Player.GetMapY())
                } else if (Player.GetMap().CanMove(Player.GetMapX() - 1, Player.GetMapY(), true) == true) {
                    宝宝.Move(Player.GetMapName(), Player.GetMapX() - 1, Player.GetMapY())
                } else if (Player.GetMap().CanMove(Player.GetMapX(), Player.GetMapY() + 1, true) == true) {
                    宝宝.Move(Player.GetMapName(), Player.GetMapX(), Player.GetMapY() + 1)
                } else if (Player.GetMap().CanMove(Player.GetMapX(), Player.GetMapY() - 1, true) == true) {
                    宝宝.Move(Player.GetMapName(), Player.GetMapX(), Player.GetMapY() - 1)
                } else if (Player.GetMap().CanMove(Player.GetMapX() - 1, Player.GetMapY() - 1, true) == true) {
                    宝宝.Move(Player.GetMapName(), Player.GetMapX() - 1, Player.GetMapY() - 1)
                } else if (Player.GetMap().CanMove(Player.GetMapX() + 1, Player.GetMapY() - 1, true) == true) {
                    宝宝.Move(Player.GetMapName(), Player.GetMapX() + 1, Player.GetMapY() - 1)
                } else if (Player.GetMap().CanMove(Player.GetMapX() - 1, Player.GetMapY() + 1, true) == true) {
                    宝宝.Move(Player.GetMapName(), Player.GetMapX() - 1, Player.GetMapY() + 1)
                } else if (Player.GetMap().CanMove(Player.GetMapX() + 1, Player.GetMapY() + 1, true) == true) {
                    宝宝.Move(Player.GetMapName(), Player.GetMapX() + 1, Player.GetMapY() + 1)
                } else { 宝宝.Move(Player.GetMapName(), Player.GetMapX(), Player.GetMapY()) }

            }
        }
    }
}

export function 隐身开关(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    if (Player.GetJewelrys(4) != null && Player.GetJewelrys(4).GetName() == '甘道夫之戒') {
        if (Player.V.隐身开关 == false) {
            Player.AddStatusBuff(6, TBuffStatusType.stObserverForMon, -1, 0, 0)
            Player.V.隐身开关 = true
            Player.SendMessage(`你关闭了甘道夫之戒附带的隐身功能`)
        } else {
            Player.AddStatusBuff(6, TBuffStatusType.stObserverForMon, 999999999, 1, 0)
            Player.SendMessage(`你开启了甘道夫之戒附带的隐身功能`, 1)
            Player.V.隐身开关 = false
        }


    }
}


export function 宝宝群雷(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Source.Master as TPlayObject
    if (GameLib.ServerName.includes('包区')){
        if (Player != null && !Player.Death) {
            const 范围 = Math.min(Number(Player.R.攻击范围)+1 , 4)
            let 目标列表 = 获取目标范围内目标(Player, Target ,范围 , true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        } 
    }else{ 
        if (Player != null && !Player.Death) {        
            let 目标列表 = 获取目标范围内目标(Player, Target ,1 , true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        } 
    }
}
export function 猎人宝宝群攻(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Source.Master as TPlayObject
    if (GameLib.ServerName.includes('包区')){
        if (Player != null && !Player.Death) {
            const 范围 = Math.min(Number(Player.R.攻击范围)+1 , 4)
            let 目标列表 = 获取目标范围内目标(Player, Target ,范围 , true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        } 
    }else{ 
        if (Player != null && !Player.Death) {        
            let 目标列表 = 获取目标范围内目标(Player, Target ,1 , true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        } 
    }
}

export function 怪物雷电术(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Target as TPlayObject
    if (Player != null && !Player.Death) {
        const 范围 = Math.min(Number(Player.R.攻击范围)+1 , 4)
        let 目标列表 = 获取目标范围内目标(Player, Target ,范围, true)
        for (const 目标 of 目标列表) {
        Source.Damage(目标, 1)
        }
    }
}

export function 怪物灵魂火符(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Target as TPlayObject
    if (Target) {
        if (Player != null && !Player.Death) {
            const 范围 = Math.min(Number(Player.R.攻击范围)+1 , 4)
            let 目标列表 = 获取目标范围内目标(Player, Target ,范围, true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        }
    }
}


export function 怪物刺杀(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Target as TPlayObject
    Source.Damage(Target, 1)
}


export function 宝宝范围2(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Source.Master as TPlayObject
    if (GameLib.ServerName.includes('包区')){
        if (Player != null && !Player.Death) {
            const 范围 = Math.min(Number(Player.R.攻击范围)+1 , 4)
            let 目标列表 = 获取目标范围内目标(Player, Target ,范围 , true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        } 
    }else{ 
        if (Player != null && !Player.Death) {        
            let 目标列表 = 获取目标范围内目标(Player, Target ,1 , true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        } 
    }
}

export function 宝宝范围3(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Source.Master as TPlayObject
    if (GameLib.ServerName.includes('包区')){
        if (Player != null && !Player.Death) {
            const 范围 = Math.min(Number(Player.R.攻击范围)+1 , 4)
            let 目标列表 = 获取目标范围内目标(Player, Target ,范围 , true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        } 
    }else{ 
        if (Player != null && !Player.Death) {        
            let 目标列表 = 获取目标范围内目标(Player, Target ,1 , true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        } 
    }
}

export function 宝宝范围4(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Source.Master as TPlayObject
    if (GameLib.ServerName.includes('包区')){
        if (Player != null && !Player.Death) {
            const 范围 = Math.min(Number(Player.R.攻击范围)+1 , 4)
            let 目标列表 = 获取目标范围内目标(Player, Target ,范围 , true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        } 
    }else{ 
        if (Player != null && !Player.Death) {        
            let 目标列表 = 获取目标范围内目标(Player, Target ,1 , true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        } 
    }
}

export function 宝宝范围5(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Source.Master as TPlayObject
    if (GameLib.ServerName.includes('包区')){
        if (Player != null && !Player.Death) {
            const 范围 = Math.min(Number(Player.R.攻击范围)+1 , 4)
            let 目标列表 = 获取目标范围内目标(Player, Target ,范围 , true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        } 
    }else{ 
        if (Player != null && !Player.Death) {        
            let 目标列表 = 获取目标范围内目标(Player, Target ,1 , true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        } 
    }
}

export function 宝宝范围6(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Source.Master as TPlayObject
    if (GameLib.ServerName.includes('包区')){
        if (Player != null && !Player.Death) {
            const 范围 = Math.min(Number(Player.R.攻击范围)+1 , 4)
            let 目标列表 = 获取目标范围内目标(Player, Target ,范围 , true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        } 
    }else{ 
        if (Player != null && !Player.Death) {        
            let 目标列表 = 获取目标范围内目标(Player, Target ,1 , true)
            for (const 目标 of 目标列表) {
            Source.Damage(目标, 1)
            }
        } 
    }
}

export function 宝宝范围6新(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Source.Master as TPlayObject
    if (GameLib.ServerName.includes('包区')){
    if (Player != null && !Player.Death) {
        const 范围 = Math.min(Number(Player.R.攻击范围)+1 , 4)
        let 目标列表 = 获取目标范围内目标(Player, Target ,范围 , true)
        for (const 目标 of 目标列表) {
        Source.Damage(目标, 1)
        }
    } 
}else{ 
    if (Player != null && !Player.Death) {        
        let 目标列表 = 获取目标范围内目标(Player, Target ,1 , true)
        for (const 目标 of 目标列表) {
        Source.Damage(目标, 1)
        }
    } 
}
}
export function BOSS范围1(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let 伤害值 = (randomRange(Source.GetDCMin(), Source.GetDCMax()) - _P_Base.人物防御随机(Target))
    Source.Damage(Target, 1)
}
export function BOSS范围2(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let 伤害值 = (randomRange(Source.GetDCMin(), Source.GetDCMax()) - _P_Base.人物防御随机(Target))
    Source.Damage(Target, 1)
}
export function BOSS范围3(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let 伤害值 = (randomRange(Source.GetDCMin(), Source.GetDCMax()) - _P_Base.人物防御随机(Target))
    Source.Damage(Target, 1)
}
export function BOSS单体(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let 伤害值 = (randomRange(Source.GetDCMin(), Source.GetDCMax()) - _P_Base.人物防御随机(Target))
    Source.Damage(Target, 1)
}
export function BOSS飓风(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let 伤害值 = (randomRange(Source.GetDCMin(), Source.GetDCMax()) - _P_Base.人物防御随机(Target))
    Source.Damage(Target, 1)
}

export function BOSS地钉(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let 伤害值 = (randomRange(Source.GetDCMin(), Source.GetDCMax()) - _P_Base.人物防御随机(Target))
    Source.Damage(Target, 1)
}

export function BOSS范围5(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let 伤害值 = (randomRange(Source.GetDCMin(), Source.GetDCMax()) - _P_Base.人物防御随机(Target))
    Source.Damage(Target, 1)
}

export function 二BOSS单体(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let 伤害值 = (randomRange(Source.GetDCMin(), Source.GetDCMax()) - _P_Base.人物防御随机(Target))
    Source.Damage(Target, 1)
}
export function 二BOSS群1(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let 伤害值 = (randomRange(Source.GetDCMin(), Source.GetDCMax()) - _P_Base.人物防御随机(Target))
    Source.Damage(Target, 1)
}
export function 二BOSS群2(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let 伤害值 = (randomRange(Source.GetDCMin(), Source.GetDCMax()) - _P_Base.人物防御随机(Target))
    Source.Damage(Target, 1)
}
export function 一BOSS单体(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let 伤害值 = (randomRange(Source.GetDCMin(), Source.GetDCMax()) - _P_Base.人物防御随机(Target))
    Source.Damage(Target, 1)
}

export function 四BOSS单体(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let 伤害值 = (randomRange(Source.GetDCMin(), Source.GetDCMax()) - _P_Base.人物防御随机(Target))
    Source.Damage(Target, 1)
}
export function 五BOSS单体(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let 伤害值 = (randomRange(Source.GetDCMin(), Source.GetDCMax()) - _P_Base.人物防御随机(Target))
    // Target.SetState(0,30,0)
    // Target.SetState(1,30,0)
    Source.Damage(Target, 1)
}




export function 宝宝攻杀(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Source.Master as TPlayObject
    let 上限 = 0
    let 下限 = 0
    if (Player) {
        // 上限 = Source.GetDCMin()
        // 下限 = Source.GetDCMax()
        // let 最小值 = (下限 - 上限) / 9 * Player.V.幸运值
        // let 伤害值 = randomRange(上限 + 最小值, 下限)
        // let 总伤害 = 0
        // if (Player.V.种族 == '兽族') {
        //     总伤害 = 伤害值 * 1.2 - _P_Base.人物防御随机(Target) * 0.5
        // } else {
        //     总伤害 = 伤害值 * 1.2 - _P_Base.人物防御随机(Target)
        // }
        // if (总伤害 >= 922000000000000 * 10000) { 总伤害 = 922000000000000 * 10000 }
        Source.Damage(Target, 1)
    }
}
export function 宝宝刺杀(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Source.Master as TPlayObject
    // let 上限 = 0
    // let 下限 = 0
    if (Player) {
        //     上限 = Source.GetDCMin()
        //     下限 = Source.GetDCMax()
        //     let 最小值 = (下限 - 上限) / 9 * Player.V.幸运值
        //     let 伤害值 = randomRange(上限 + 最小值, 下限)
        //     let 总伤害 = 0
        //     if (Player.V.种族 == '兽族') {
        //         总伤害 = 伤害值 - _P_Base.人物防御随机(Target) * 0.5
        //     } else {
        //         总伤害 = 伤害值 - _P_Base.人物防御随机(Target)
        //     }
        //     if (总伤害 >= 922000000000000 * 10000) { 总伤害 = 922000000000000 * 10000 }
        Source.Damage(Target, 1)
    }
}

export function 宝宝半月(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Source.Master as TPlayObject
    let 上限 = 0
    let 下限 = 0
    if (Player) {
        // 上限 = Source.GetDCMin()
        // 下限 = Source.GetDCMax()
        // let 最小值 = (下限 - 上限) / 9 * Player.V.幸运值
        // let 伤害值 = randomRange(上限 + 最小值, 下限)
        // let 总伤害 = 0
        // if (Player.V.种族 == '兽族') {
        //     总伤害 = 伤害值 * 1.2 - _P_Base.人物防御随机(Target) * 0.5
        // } else {
        //     总伤害 = 伤害值 * 1.2 - _P_Base.人物防御随机(Target)
        // }
        // if (总伤害 >= 922000000000000 * 10000) { 总伤害 = 922000000000000 * 10000 }
        Source.Damage(Target, 1)
    }
}
export function 宝宝烈火(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Source.Master as TPlayObject
    let 上限 = 0
    let 下限 = 0
    if (Player) {
        // 上限 = Source.GetDCMin()
        // 下限 = Source.GetDCMax()
        // let 最小值 = (下限 - 上限) / 9 * Player.V.幸运值
        // let 伤害值 = randomRange(上限 + 最小值, 下限)
        // let 总伤害 = 0
        // if (Player.V.种族 == '兽族') {
        //     总伤害 = 伤害值 * 2 - _P_Base.人物防御随机(Target) * 0.5
        // } else {
        //     总伤害 = 伤害值 * 2 - _P_Base.人物防御随机(Target)
        // }
        // if (总伤害 >= 922000000000000 * 10000) { 总伤害 = 922000000000000 * 10000 }
        Source.Damage(Target, 1)
    }
}
export function 宝宝倚天(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let bPlayer: TPlayObject = Target as TPlayObject
    if (bPlayer.IsPlayer() && random(100) >= bPlayer.R.抵抗异常) {
    } else {
        Target.SetState(5, 1, 0)
    }
    let Player = Source.Master as TPlayObject
    let 上限 = 0
    let 下限 = 0
    if (Player) {
        // 上限 = Source.GetDCMin()
        // 下限 = Source.GetDCMax()
        // let 最小值 = (下限 - 上限) / 9 * Player.V.幸运值
        // let 伤害值 = randomRange(上限 + 最小值, 下限)
        // let 总伤害 = 0
        // if (Player.V.种族 == '兽族') {
        //     总伤害 = 伤害值 * 1.2 - _P_Base.人物防御随机(Target) * 0.5
        // } else {
        //     总伤害 = 伤害值 * 1.2 - _P_Base.人物防御随机(Target)
        // }
        // if (总伤害 >= 922000000000000 * 10000) { 总伤害 = 922000000000000 * 10000 }
        Source.Damage(Target, 1)
    }
}
export function 宝宝逐日(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Source.Master as TPlayObject
    let 上限 = 0
    let 下限 = 0
    if (Player) {
        // 上限 = Source.GetDCMin()
        // 下限 = Source.GetDCMax()
        // let 最小值 = (下限 - 上限) / 9 * Player.V.幸运值
        // let 伤害值 = randomRange(上限 + 最小值, 下限)
        // let 总伤害 = 0
        // if (Player.V.种族 == '兽族') {
        //     总伤害 = 伤害值 * 1.5 - _P_Base.人物防御随机(Target) * 0.5
        // } else {
        //     总伤害 = 伤害值 * 1.5 - _P_Base.人物防御随机(Target)
        // }
        // if (总伤害 >= 922000000000000 * 10000) { 总伤害 = 922000000000000 * 10000 }
        Source.Damage(Target, 1)
    }
}
export function 宝宝开天斩(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player = Source.Master as TPlayObject
    let 上限 = 0
    let 下限 = 0
    if (Player) {
        // 上限 = Source.GetDCMin()
        // 下限 = Source.GetDCMax()
        // let 最小值 = (下限 - 上限) / 9 * Player.V.幸运值
        // let 伤害值 = randomRange(上限 + 最小值, 下限)
        // let 总伤害 = 0
        // if (Player.V.种族 == '兽族') {
        //     总伤害 = 伤害值 * 1.5 - _P_Base.人物防御随机(Target) * 0.5
        // } else {
        //     总伤害 = 伤害值 * 1.5 - _P_Base.人物防御随机(Target)
        // }
        // if (总伤害 >= 922000000000000 * 10000) { 总伤害 = 922000000000000 * 10000 }

        Source.Damage(Target, 1)
    }
}





let MagicExecutes = {}
MagicExecutes["嘲讽吸怪"] = 嘲讽吸怪
MagicExecutes["万剑归宗"] = 万剑归宗
MagicExecutes["圣光打击"] = 圣光打击
MagicExecutes["愤怒"] = 愤怒
MagicExecutes["审判救赎"] = 审判救赎
MagicExecutes["冰霜之环"] = 冰霜之环
MagicExecutes["萌萌浣熊"] = 萌萌浣熊
MagicExecutes["嗜血狼人"] = 嗜血狼人
MagicExecutes["丛林虎王"] = 丛林虎王
MagicExecutes["雷暴之怒"] = 雷暴之怒
MagicExecutes["剧毒火海"] = 剧毒火海
MagicExecutes["妙手回春"] = 妙手回春
MagicExecutes["互相伤害"] = 互相伤害
MagicExecutes["弱点"] = 弱点
MagicExecutes["增伤"] = 增伤
MagicExecutes["暗影杀阵"] = 暗影杀阵
MagicExecutes["暗影杀阵闪现"] = 暗影杀阵闪现
MagicExecutes["鬼舞斩"] = 鬼舞斩
MagicExecutes["鬼舞术"] = 鬼舞术
MagicExecutes["群魔乱舞"] = 群魔乱舞
MagicExecutes["复仇"] = 复仇
MagicExecutes["分裂箭"] = 分裂箭
MagicExecutes["召唤宠物"] = 召唤宠物
MagicExecutes["宠物突变"] = 宠物突变
MagicExecutes["碎石破空"] = 碎石破空
MagicExecutes["天雷阵"] = 天雷阵
MagicExecutes["至高武术"] = 至高武术
MagicExecutes["金刚护体"] = 金刚护体
MagicExecutes["擒龙功"] = 擒龙功
MagicExecutes["金刚护法"] = 金刚护法
MagicExecutes["罗汉金钟"] = 罗汉金钟
MagicExecutes["宝宝群雷"] = 宝宝群雷
MagicExecutes["猎人宝宝群攻"] = 猎人宝宝群攻
MagicExecutes["万箭齐发啊"] = 万箭齐发啊    


MagicExecutes["施毒术给点伤害"] = 施毒术给点伤害

MagicExecutes["怪物雷电术"] = 怪物雷电术
MagicExecutes["怪物灵魂火符"] = 怪物灵魂火符
MagicExecutes["召唤战神"] = 召唤战神
MagicExecutes["轮回之道"] = 轮回之道

MagicExecutes["宝宝范围2"] = 宝宝范围2
MagicExecutes["宝宝范围3"] = 宝宝范围3
MagicExecutes["宝宝范围4"] = 宝宝范围4
MagicExecutes["宝宝范围5"] = 宝宝范围5
MagicExecutes["宝宝范围6"] = 宝宝范围6
MagicExecutes["宝宝范围6新"] = 宝宝范围6新
MagicExecutes["心灵召唤"] = 心灵召唤
MagicExecutes["宝宝攻杀"] = 宝宝攻杀
MagicExecutes["宝宝刺杀"] = 宝宝刺杀
MagicExecutes["宝宝半月"] = 宝宝半月
MagicExecutes["宝宝烈火"] = 宝宝烈火
MagicExecutes["宝宝倚天"] = 宝宝倚天
MagicExecutes["宝宝逐日"] = 宝宝逐日
MagicExecutes["宝宝开天斩"] = 宝宝开天斩

MagicExecutes["BOSS范围1"] = BOSS范围1
MagicExecutes["BOSS范围2"] = BOSS范围2
MagicExecutes["BOSS范围3"] = BOSS范围3
MagicExecutes["BOSS单体"] = BOSS单体
MagicExecutes["BOSS飓风"] = BOSS飓风
MagicExecutes["BOSS地钉"] = BOSS地钉
MagicExecutes["BOSS范围5"] = BOSS范围5
MagicExecutes["二BOSS单体"] = 二BOSS单体
MagicExecutes["二BOSS群1"] = 二BOSS群1
MagicExecutes["二BOSS群2"] = 二BOSS群2
MagicExecutes["一BOSS单体"] = 一BOSS单体
MagicExecutes["四BOSS单体"] = 四BOSS单体
MagicExecutes["五BOSS单体"] = 五BOSS单体
MagicExecutes["怪物刺杀"] = 怪物刺杀
MagicExecutes["查看属性"] = 查看属性
MagicExecutes["隐身开关"] = 隐身开关

GameLib.onSkillActionExecute = (Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string) => {
    let func = MagicExecutes[AMethod]
    if (func && Target)
        func(Source, Target, nParam1, nParam2, sParam1, sParam2)
}

export function 闪现啊(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    let Player: TPlayObject = ASource as TPlayObject;
    Player.FlashMove(AMouseX, AMouseY, true)
    // Player.MagicAttack(ATarget,10030)
    // console.log(AMouseX)
    // console.log(AMouseY)
    return true
}
export function 命运刹印(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    return true
}
export function 冰咆哮(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    return true
}
export function 雷电术(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    return true
}
export function 群星火雨(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    let Player: TPlayObject = ASource as TPlayObject;
    const 范围 = Math.min(Number(Player.R.攻击范围) + 1, 4)

    // 如果有目标则以目标为中心，否则以玩家为中心
    let 目标列表 = ATarget ? 获取目标范围内目标(Player, ATarget, 范围 , false) : []
    for (const 目标 of 目标列表) {
        Player.Damage(目标, 1, _P_Base.技能ID.火神.流星火雨主动)
    }
    return false
}
export function 暴风雨(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    let Player: TPlayObject = ASource as TPlayObject;
    const 范围 = Math.min(Number(Player.R.攻击范围) + 1 , 4)
    // 如果有目标则以目标为中心，否则以玩家为中心
    let 目标列表 = ATarget ? 获取目标范围内目标(Player, ATarget, 范围 , false) : []
    for (const 目标 of 目标列表) {
        Player.Damage(目标, 1, _P_Base.技能ID.冰法.暴风雨主动)
    }
    return false
}
export function 寒冬领域(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    // console.log('111')
    return true
}

export function 灵魂火符(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    return true
}
export function 飓风破(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    return false
    //true恢复
}

export function 剧毒火海(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    let Player: TPlayObject = ASource as TPlayObject;
    const 范围 = Math.min(Number(Player.R.攻击范围) + 1 , 4)
    // 如果有目标则以目标为中心，否则返回空数组
    let 目标列表 = ATarget ? 获取目标范围内目标(Player, ATarget, 范围 , false) : []
    for (const 目标 of 目标列表) {
        Player.Damage(目标, 1, _P_Base.技能ID.牧师.剧毒火海主动)
    }
    return false
}
export function 末日降临(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    return true
}
export function 万箭齐发(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    let Player: TPlayObject = ASource as TPlayObject;
    const 范围 = Math.min(4 , Number(Player.R.攻击范围))
    // 如果有目标则以目标为中心，否则返回空数组
    let 目标列表 = ATarget ? 获取目标范围内目标(Player, ATarget, 范围 , false) : []
    for (const 目标 of 目标列表) {
        Player.Damage(目标, 1, _P_Base.技能ID.神射手.万箭齐发主动)
    }
    return false
}

export function 神灵救赎(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    return true
}

export function 罗汉棍法(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    return true
}
export function 达摩棍法(ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic): boolean {
    return true
}

let funcMap = {}
funcMap["闪现啊"] = 闪现啊
funcMap["罗汉棍法"] = 罗汉棍法
funcMap["达摩棍法"] = 达摩棍法
funcMap["命运刹印"] = 命运刹印
funcMap["冰咆哮"] = 冰咆哮
funcMap["雷电术"] = 雷电术
funcMap["群星火雨"] = 群星火雨
funcMap["暴风雨"] = 暴风雨
funcMap["寒冬领域"] = 寒冬领域
funcMap["灵魂火符"] = 灵魂火符
funcMap["飓风破"] = 飓风破
funcMap["剧毒火海"] = 剧毒火海
funcMap["末日降临"] = 末日降临
funcMap["万箭齐发"] = 万箭齐发
funcMap["神灵救赎"] = 神灵救赎
funcMap["嘲讽吸怪"] = 嘲讽吸怪
  


GameLib.onMagicNpcExecute = (AMethod: string, ASource: TActor, ATarget: TActor, ATargetX: number, ATargetY: number, AMouseX: number, AMouseY: number, AList: TActorList, AMagic: TUserMagic) => {
    let func = funcMap[AMethod]
    if (func) {
        return func(ASource, ATarget, ATargetX, ATargetY, AMouseX, AMouseY, AList, AMagic);
    }
    return true
}
/**
 * 获取以玩家为中心范围内的所有有效目标
 * @param Player 玩家对象
 * @param 范围 攻击范围，如果不传则使用默认值
 * @returns 返回以玩家为中心的范围内的所有怪物目标数组
 */
export function 获取玩家范围内目标(Player: TPlayObject, 范围?: number): TActor[] {
    const 攻击范围 = 范围 ;
    const 目标列表: TActor[] = [];
    
    if (攻击范围 <= 0) {
        return 目标列表;
    }
    
    const AActorList = Player.Map.GetActorListInRange(Player.MapX, Player.MapY, 攻击范围);
    
    if (AActorList.Count > 0) {
        for (let i = 0; i < AActorList.Count; i++) {
            const Actor = AActorList.Actor(i);
            if (Actor != null && 
                !Actor.GetDeath() && 
                !Actor.IsNPC() && 
                Actor.GetHandle() != Player.GetHandle() && 
                !Actor.IsPlayer() &&
                !Actor.Master) {
                目标列表.push(Actor);
            }
        }
    }
    
    return 目标列表;
}

/**
 * 获取以目标为中心范围内的所有有效目标
 * @param Player 玩家对象
 * @param 目标 中心目标对象
 * @param 范围 攻击范围
 * @param 排除目标本身 是否排除中心目标本身，默认为true
 * @returns 返回以目标为中心的范围内的所有怪物目标数组
 */
export function 获取目标范围内目标(Player: TPlayObject, 目标: TActor, 范围: number, 排除目标本身: boolean = true): TActor[] {
    const 目标列表: TActor[] = [];
    
    if (范围 <= 0 || !目标 || 目标.GetDeath()) {
        return 目标列表;
    }
    
    const AActorList = 目标.Map.GetActorListInRange(目标.MapX, 目标.MapY, 范围);
    
    if (AActorList.Count > 0) {
        for (let i = 0; i < AActorList.Count; i++) {
            const Actor = AActorList.Actor(i);
            if (Actor != null && 
                !Actor.GetDeath() && 
                !Actor.IsNPC() && 
                Actor.GetHandle() != Player.GetHandle() && 
                (!排除目标本身 || Actor.GetHandle() != Player.GetHandle()) && // 根据参数决定是否排除目标本身
                !Actor.IsPlayer() &&
                !Actor.Master) {
                目标列表.push(Actor);
            }
        }
    }
    
    return 目标列表;
}

/**
 * 获取杀怪范围内目标（兼容性函数）
 * @deprecated 请使用 获取玩家范围内目标 或 获取目标范围内目标
 */
export function 获取杀怪范围内目标(Player: TPlayObject, 目标: TActor, 范围?: number): TActor[] {
    if (目标 && 范围) {
        return 获取目标范围内目标(Player, 目标, 范围);
    } else {
        return 获取玩家范围内目标(Player, 范围);
    }
}

/**
 * 攻击杀怪范围内的所有目标
 * @param Player 玩家对象
 * @param 范围 攻击范围，如果不传则使用 Number(Player.R.攻击范围)
 * @param 攻击方式 攻击方式：'kill' = 直接击杀，'attack' = 普通攻击，默认为 'kill'
 * @returns 返回攻击的目标数量
 */
// export function 攻击杀怪范围内目标(Player: TPlayObject, 范围?: number, 攻击方式: 'kill' | 'attack' = 'kill'): number {
//     const 目标列表 = 获取杀怪范围内目标(Player, 范围);
    
//     for (const 目标 of 目标列表) {
//         if (攻击方式 === 'kill') {
//             目标.SetHP(0); // 直接设置血量为0
//         } else if (攻击方式 === 'attack') {
//             Player.MagicAttack(目标, 0); // 使用魔法攻击，技能ID为0表示普通攻击
//         }
//     }
    
//     return 目标列表.length;
// }

// export function 杀怪范围(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
//     const Player: TPlayObject = Source as TPlayObject;
    
//     // 使用新的封装函数
//     攻击杀怪范围内目标(Player, undefined, 'kill');
// }

export function 嘲讽吸怪(Source: TActor, Target: TActor, AMethod: string, nParam1: number, nParam2: number, sParam1: string, sParam2: string): void {
    let Player: TPlayObject = Source as TPlayObject;
    // console.log(Player.GetSVar(94) +`fff` + Player.GetSVar(93))
    if (Player.R.嘲讽吸怪_范围 > 0) {
        let AActorList = Player.Map.GetActorListInRange(Player.MapX, Player.MapY, Player.R.嘲讽吸怪_范围)
        if (AActorList.Count > 0) {
            for (let i = 0; i < AActorList.Count; i++) {
                let Actor = AActorList.Actor(i);
                if (Actor != null && !Actor.GetDeath() && !Actor.IsNPC() && Actor.GetHandle() != Player.GetHandle() && !Actor.IsPlayer()) {
                    if (Actor.Master && Actor.Master.Handle == Player.Handle) { continue }
                    let 坐标X = Player.MapX
                    let 坐标Y = Player.MapY
                    switch (true) {
                        case Player.GetMap().CanMove(坐标X + 1, 坐标Y, false): 坐标X = 坐标X + 1; 坐标Y = 坐标Y; break
                        case Player.GetMap().CanMove(坐标X - 1, 坐标Y, false): 坐标X = 坐标X - 1; 坐标Y = 坐标Y; break
                        case Player.GetMap().CanMove(坐标X, 坐标Y + 1, false): 坐标X = 坐标X; 坐标Y = 坐标Y + 1; break
                        case Player.GetMap().CanMove(坐标X, 坐标Y - 1, false): 坐标X = 坐标X; 坐标Y = 坐标Y - 1; break
                        case Player.GetMap().CanMove(坐标X - 1, 坐标Y - 1, false): 坐标X = 坐标X - 1; 坐标Y = 坐标Y - 1; break
                        case Player.GetMap().CanMove(坐标X + 1, 坐标Y - 1, false): 坐标X = 坐标X + 1; 坐标Y = 坐标Y - 1; break
                        case Player.GetMap().CanMove(坐标X - 1, 坐标Y + 1, false): 坐标X = 坐标X - 1; 坐标Y = 坐标Y + 1; break
                        case Player.GetMap().CanMove(坐标X + 1, 坐标Y + 1, false): 坐标X = 坐标X + 1; 坐标Y = 坐标Y + 1; break

                        case Player.GetMap().CanMove(坐标X + 2, 坐标Y + 1, false): 坐标X = 坐标X + 2; 坐标Y = 坐标Y + 1; break
                        case Player.GetMap().CanMove(坐标X - 2, 坐标Y + 1, false): 坐标X = 坐标X - 2; 坐标Y = 坐标Y + 1; break
                        case Player.GetMap().CanMove(坐标X + 1, 坐标Y + 2, false): 坐标X = 坐标X + 1; 坐标Y = 坐标Y + 2; break
                        case Player.GetMap().CanMove(坐标X + 1, 坐标Y - 2, false): 坐标X = 坐标X + 1; 坐标Y = 坐标Y - 2; break
                        case Player.GetMap().CanMove(坐标X - 2, 坐标Y - 2, false): 坐标X = 坐标X - 2; 坐标Y = 坐标Y - 2; break
                        case Player.GetMap().CanMove(坐标X + 2, 坐标Y - 2, false): 坐标X = 坐标X + 2; 坐标Y = 坐标Y - 2; break
                        case Player.GetMap().CanMove(坐标X - 2, 坐标Y + 2, false): 坐标X = 坐标X - 2; 坐标Y = 坐标Y + 2; break
                        case Player.GetMap().CanMove(坐标X + 2, 坐标Y + 2, false): 坐标X = 坐标X + 2; 坐标Y = 坐标Y + 2; break
                    }
                    Actor.FlashMove(坐标X, 坐标Y, false)
                }
            }
        }
    } else {
        Player.SendCenterMessage(`你当前没有使用此技能的权限。`, 0, 3000)
    }
    Player.SendCenterMessage(`你使用了嘲讽吸怪技能。`, 0, 3000)
}

export function 驯兽师召宝宝(Player: TPlayObject, 怪物名字: string, 攻击距离: number, 继承倍率: number, 召唤数量: number): void {
    let 宝宝攻击小 = Player.R.自定属性[153], 宝宝攻击大 = Player.R.自定属性[163], 宝宝防御小 = js_number(Player.R.自定属性[158], `100`, 3), 宝宝防御大 = js_number(Player.R.自定属性[168], `100`, 3), 宝宝血量 = js_number(Player.GetSVar(92), `10`, 3),
        攻速移速 = 1000 - (Player.R.所有宝宝速度 + Player.R.驯兽宝宝速度), 坐标X = Player.GetMapX(), 坐标Y = Player.GetMapY()
    let Actor: TActor
    let 野蛮等级 = Player.V.凶猛野兽 + Player.R.凶猛野兽 + Player.R.所有技能等级
    宝宝攻击小 = js_number(宝宝攻击小, String(继承倍率), 3)
    宝宝攻击大 = js_number(js_number(宝宝攻击大, `5`, 3), String(继承倍率), 3)

    宝宝攻击小 = js_number(js_number(js_number(Player.R.凶猛野兽等级, 宝宝攻击小, 3), `0.1`, 3), 宝宝攻击小, 1)
    宝宝攻击大 = js_number(js_number(js_number(Player.R.凶猛野兽等级, 宝宝攻击大, 3), `0.1`, 3), 宝宝攻击大, 1)

    宝宝血量 = js_number(js_number(js_number(Player.R.凶猛野兽等级, 宝宝血量, 3), `0.1`, 3), 宝宝血量, 1)

    Player.V.速度专精激活 ? 攻速移速 = 攻速移速 - Player.R.速度点数 * 20 * 2 : 攻速移速 = 攻速移速 - Player.R.速度点数 * 2
    switch (true) {
        case Player.GetMap().CanMove(坐标X + 1, 坐标Y, true) == true: 坐标X = 坐标X + 1; 坐标Y = 坐标Y; break
        case Player.GetMap().CanMove(坐标X - 1, 坐标Y, true) == true: 坐标X = 坐标X - 1; 坐标Y = 坐标Y; break
        case Player.GetMap().CanMove(坐标X, 坐标Y + 1, true) == true: 坐标X = 坐标X; 坐标Y = 坐标Y + 1; break
        case Player.GetMap().CanMove(坐标X, 坐标Y - 1, true) == true: 坐标X = 坐标X; 坐标Y = 坐标Y - 1; break
        case Player.GetMap().CanMove(坐标X - 1, 坐标Y - 1, true) == true: 坐标X = 坐标X - 1; 坐标Y = 坐标Y - 1; break
        case Player.GetMap().CanMove(坐标X + 1, 坐标Y - 1, true) == true: 坐标X = 坐标X + 1; 坐标Y = 坐标Y - 1; break
        case Player.GetMap().CanMove(坐标X - 1, 坐标Y + 1, true) == true: 坐标X = 坐标X - 1; 坐标Y = 坐标Y + 1; break
        case Player.GetMap().CanMove(坐标X + 1, 坐标Y + 1, true) == true: 坐标X = 坐标X + 1; 坐标Y = 坐标Y + 1; break
    }
    let List = GameLib.MonGen(Player.Map.MapName, 怪物名字, 召唤数量, 坐标X, 坐标Y, 0, 0, 0, 1, true, true, true, true)
    Player.KillSlave(怪物名字)
    for (let i = List.Count - 1; i >= 0; i--) {
        Actor = List.Actor(i)
        Actor.SetMaxHP(1000000)
        Actor.SetHP(1000000)
        Actor.SetDCMin(999)
        Actor.SetDCMax(999)
        Actor.SetMaster(Player)
        Actor.SetMasterRoyaltyTick(108000000)
        Actor.SetThroughHuman(true)
        Actor.SetAttackSpeed(Math.max(100, 攻速移速 - 野蛮等级 * 6))
        Actor.SetWalkSpeed(Math.max(100, 攻速移速 - 野蛮等级 * 6))
        Actor.SetAttackRange(攻击距离)
        Actor.SetSVar(原始名字, 怪物名字)
        Actor.SetTriggerAINpcExecute(true)
        Actor.SetTriggerSelectMagicBeforeAttack(true)
        Actor.SetViewRange(12)
        Actor.SetSVar(92, String(宝宝血量))
        Actor.SetSVar(91, Actor.GetSVar(92))
        Actor.SetSVar(93, String(宝宝攻击小))
        Actor.SetSVar(94, String(宝宝攻击大))
        Actor.SetSVar(95, String(宝宝防御小))
        Actor.SetSVar(96, String(宝宝防御大))
        Player.SendMessage(`当前宝宝血量:${大数值整数简写(Actor.GetSVar(92))},攻击:${大数值整数简写(宝宝攻击小)} - ${大数值整数简写(宝宝攻击大)},防御:${大数值整数简写(宝宝防御大)},速度:${Actor.GetAttackSpeed()}`);
        let 新字符 = { 怪物名字: Actor.Name, 怪物等级: String(Actor.Level), 血量: 宝宝血量, 攻击: 宝宝攻击大, 防御: 宝宝防御大, 怪物颜色: '', 怪物标志: 0, }
        GameLib.R.怪物信息 = GameLib.R.怪物信息 || {};
        GameLib.R.怪物信息[`${Actor.Handle}`] = JSON.stringify(新字符)
        Actor.SetSVar(98, JSON.stringify(新字符))
        if (Player.R.宝宝释放群雷) {
            Actor.SetNVar(_M_N_宝宝释放群雷, 1)
        }
        Actor.SetConfuseBitTimeBeAttacked(false)
        血量显示(Actor)
    }
}

export function 猎人召唤宝宝(Player: TPlayObject, 怪物名字: string, 攻击距离: number, 继承倍率: number, 召唤数量: number): void {
    let 宝宝攻击小 = Player.R.自定属性[155], 宝宝攻击大 = Player.R.自定属性[165], 宝宝防御小 = js_number(Player.R.自定属性[158], `100`, 3), 宝宝防御大 = js_number(Player.R.自定属性[168], `100`, 3), 宝宝血量 = js_number(Player.GetSVar(92), `10`, 3),
        攻速移速 = 1000 - (Player.R.所有宝宝速度 + Player.R.驯兽宝宝速度), 坐标X = Player.GetMapX(), 坐标Y = Player.GetMapY()
    let Actor: TActor
    let 人宠合一等级 = Player.V.人宠合一 + Player.R.人宠合一 + Player.R.所有技能等级
    宝宝攻击小 = js_number(js_number(js_number(Player.R.召唤宠物等级, 宝宝攻击小, 3), `0.05`, 3), 宝宝攻击小, 1)
    宝宝攻击大 = js_number(js_number(js_number(Player.R.召唤宠物等级, 宝宝攻击大, 3), `0.05`, 3), 宝宝攻击大, 1)

    Player.V.速度专精激活 ? 攻速移速 = 攻速移速 - Player.R.速度点数 * 20 * 2 : 攻速移速 = 攻速移速 - Player.R.速度点数 * 2
    switch (true) {
        case Player.GetMap().CanMove(坐标X + 1, 坐标Y, true) == true: 坐标X = 坐标X + 1; 坐标Y = 坐标Y; break
        case Player.GetMap().CanMove(坐标X - 1, 坐标Y, true) == true: 坐标X = 坐标X - 1; 坐标Y = 坐标Y; break
        case Player.GetMap().CanMove(坐标X, 坐标Y + 1, true) == true: 坐标X = 坐标X; 坐标Y = 坐标Y + 1; break
        case Player.GetMap().CanMove(坐标X, 坐标Y - 1, true) == true: 坐标X = 坐标X; 坐标Y = 坐标Y - 1; break
        case Player.GetMap().CanMove(坐标X - 1, 坐标Y - 1, true) == true: 坐标X = 坐标X - 1; 坐标Y = 坐标Y - 1; break
        case Player.GetMap().CanMove(坐标X + 1, 坐标Y - 1, true) == true: 坐标X = 坐标X + 1; 坐标Y = 坐标Y - 1; break
        case Player.GetMap().CanMove(坐标X - 1, 坐标Y + 1, true) == true: 坐标X = 坐标X - 1; 坐标Y = 坐标Y + 1; break
        case Player.GetMap().CanMove(坐标X + 1, 坐标Y + 1, true) == true: 坐标X = 坐标X + 1; 坐标Y = 坐标Y + 1; break
    }

    let List = GameLib.MonGen(Player.Map.MapName, 怪物名字, 召唤数量, 坐标X, 坐标Y, 0, 0, 0, 1, true, true, true, true)
    Player.KillSlave(怪物名字)
    for (let i = List.Count - 1; i >= 0; i--) {
        Actor = List.Actor(i)
        Actor.SetMaxHP(1000000)
        Actor.SetHP(1000000)
        Actor.SetDCMin(999)
        Actor.SetDCMax(999)
        Actor.SetMaster(Player)
        Actor.SetMasterRoyaltyTick(108000000)
        Actor.SetThroughHuman(true)
        Actor.SetAttackSpeed(Math.max(100, 攻速移速 - 人宠合一等级 * 6))
        Actor.SetWalkSpeed(Math.max(100, 攻速移速 - 人宠合一等级 * 6))
        Actor.SetAttackRange(攻击距离)
        Actor.SetTriggerAINpcExecute(true)
        Actor.SetTriggerSelectMagicBeforeAttack(true)
        Actor.SetViewRange(12)
        Actor.SetSVar(原始名字, 怪物名字)
        Actor.SetSVar(92, String(宝宝血量))
        Actor.SetSVar(91, Actor.GetSVar(92))
        Actor.SetSVar(93, String(宝宝攻击小))
        Actor.SetSVar(94, String(宝宝攻击大))
        Actor.SetSVar(95, String(宝宝防御小))
        Actor.SetSVar(96, String(宝宝防御大))
        Player.SendMessage(`当前宝宝血量:${大数值整数简写(Actor.GetSVar(92))},攻击:${大数值整数简写(宝宝攻击小)} - ${大数值整数简写(宝宝攻击大)},防御:${大数值整数简写(宝宝防御大)},速度:${Actor.GetAttackSpeed()}`);
        let 新字符 = { 怪物名字: Actor.Name, 怪物等级: String(Actor.Level), 血量: 宝宝血量, 攻击: 宝宝攻击大, 防御: 宝宝防御大, 怪物颜色: '', 怪物标志: 0, }
        GameLib.R.怪物信息 = GameLib.R.怪物信息 || {};
        GameLib.R.怪物信息[`${Actor.Handle}`] = JSON.stringify(新字符)
        Actor.SetSVar(98, JSON.stringify(新字符))
        if (Player.R.猎人宝宝释放群攻) {
            Actor.SetNVar(_M_N_猎人宝宝群攻, 1)
        }
        Actor.SetConfuseBitTimeBeAttacked(false)
        血量显示(Actor)
    }
}

export function 战神宝宝(Player: TPlayObject, 怪物名字: string, 攻击距离: number, 继承倍率: number, 召唤数量: number): void {
    let 宝宝攻击小 = Player.R.自定属性[151], 宝宝攻击大 = Player.R.自定属性[161], 宝宝防御小 = Player.R.自定属性[158], 宝宝防御大 = Player.R.自定属性[168], 宝宝血量 = Player.GetSVar(92),
        攻速移速 = 1000 - (Player.R.所有宝宝速度 + Player.R.驯兽宝宝速度), 坐标X = Player.GetMapX(), 坐标Y = Player.GetMapY()
    let Actor: TActor

    let 战神附体 = Player.V.战神附体 + Player.R.战神附体 + Player.R.所有技能等级
    宝宝攻击小 = js_number(宝宝攻击小, String(继承倍率), 3)
    宝宝攻击大 = js_number(宝宝攻击大, String(继承倍率), 3)
    宝宝攻击小 = js_number(js_number(js_number(Player.R.召唤战神等级, 宝宝攻击小, 3), `0.5`, 3), 宝宝攻击小, 1)
    宝宝攻击大 = js_number(js_number(js_number(Player.R.召唤战神等级, 宝宝攻击大, 3), `0.5`, 3), 宝宝攻击大, 1)
    宝宝血量 = js_number(js_number(js_number(Player.R.召唤战神等级, 宝宝血量, 3), `0.4`, 3), 宝宝血量, 1)


    Player.V.速度专精激活 ? 攻速移速 = 攻速移速 - Player.R.速度点数 * 20 * 2 : 攻速移速 = 攻速移速 - Player.R.速度点数 * 2
    switch (true) {
        case Player.GetMap().CanMove(坐标X + 1, 坐标Y, true) == true: 坐标X = 坐标X + 1; 坐标Y = 坐标Y; break
        case Player.GetMap().CanMove(坐标X - 1, 坐标Y, true) == true: 坐标X = 坐标X - 1; 坐标Y = 坐标Y; break
        case Player.GetMap().CanMove(坐标X, 坐标Y + 1, true) == true: 坐标X = 坐标X; 坐标Y = 坐标Y + 1; break
        case Player.GetMap().CanMove(坐标X, 坐标Y - 1, true) == true: 坐标X = 坐标X; 坐标Y = 坐标Y - 1; break
        case Player.GetMap().CanMove(坐标X - 1, 坐标Y - 1, true) == true: 坐标X = 坐标X - 1; 坐标Y = 坐标Y - 1; break
        case Player.GetMap().CanMove(坐标X + 1, 坐标Y - 1, true) == true: 坐标X = 坐标X + 1; 坐标Y = 坐标Y - 1; break
        case Player.GetMap().CanMove(坐标X - 1, 坐标Y + 1, true) == true: 坐标X = 坐标X - 1; 坐标Y = 坐标Y + 1; break
        case Player.GetMap().CanMove(坐标X + 1, 坐标Y + 1, true) == true: 坐标X = 坐标X + 1; 坐标Y = 坐标Y + 1; break
    }

    let List = GameLib.MonGen(Player.Map.MapName, 怪物名字, 召唤数量, 坐标X, 坐标Y, 0, 0, 0, 11, true, true, true, true)
    Player.KillSlave(怪物名字)
    for (let i = List.Count - 1; i >= 0; i--) {
        Actor = List.Actor(i)
        if (Player.V.战神学习基础) {
            Actor.SetNVar(宝宝基础技能, 1)
        }
        if (Player.V.战神学习高级) {
            Actor.SetNVar(宝宝高级技能, 1)
        }
        Actor.SetMaxHP(1000000)
        Actor.SetHP(1000000)
        Actor.SetDCMin(999)
        Actor.SetDCMax(999)
        Actor.SetMaster(Player)
        Actor.SetMasterRoyaltyTick(108000000)
        Actor.SetThroughHuman(true)
        Actor.SetAttackSpeed(Math.max(100, 攻速移速 - Player.V.战神强化等级 * 9))
        Actor.SetWalkSpeed(Math.max(100, 攻速移速 - Player.V.战神强化等级 * 9))
        Actor.SetAttackRange(攻击距离)
        // Player.SendMessage(`当前宝宝血量:${Actor.GetMaxHP()},攻击:${Actor.GetDCMin()} - ${Actor.GetDCMax()},防御:${Actor.GetACMax()},速度:${Actor.GetAttackSpeed()}`);
        Actor.SetSVar(原始名字, 怪物名字)
        Actor.SetSVar(92, String(宝宝血量))
        Actor.SetSVar(91, Actor.GetSVar(92))
        Actor.SetSVar(93, String(宝宝攻击小))
        Actor.SetSVar(94, String(宝宝攻击大))
        Actor.SetSVar(95, String(宝宝防御小))
        Actor.SetSVar(96, String(宝宝防御大))
        Player.SendMessage(`当前宝宝血量:${大数值整数简写(Actor.GetSVar(92))},攻击:${大数值整数简写(宝宝攻击小)} - ${大数值整数简写(宝宝攻击大)},防御:${大数值整数简写(宝宝防御大)},速度:${Actor.GetAttackSpeed()}`);
        // Player.SendMessage(`当前宝宝血量:${Actor.GetSVar(92)},攻击:${宝宝攻击小} - ${宝宝攻击大},防御:${宝宝防御大},速度:${Actor.GetAttackSpeed()}`);
        let 新字符 = { 怪物名字: Actor.Name, 怪物等级: String(Actor.Level), 血量: 宝宝血量, 攻击: 宝宝攻击大, 防御: 宝宝防御大, 怪物颜色: '', 怪物标志: 0, }
        GameLib.R.怪物信息 = GameLib.R.怪物信息 || {};
        GameLib.R.怪物信息[`${Actor.Handle}`] = JSON.stringify(新字符)
        Actor.SetSVar(98, JSON.stringify(新字符))
        Actor.SetTriggerAINpcExecute(true)
        Actor.SetTriggerSelectMagicBeforeAttack(true)
        Actor.SetViewRange(12)
        Actor.SetConfuseBitTimeBeAttacked(false)
        血量显示(Actor)
    }
}

export function 罗汉宝宝(Player: TPlayObject, 怪物名字: string, 攻击距离: number, 继承倍率: number, 召唤数量: number): void {
    let 宝宝攻击小 = Player.R.自定属性[156], 
        宝宝攻击大 = Player.R.自定属性[166], 
        宝宝防御小 = Player.R.自定属性[158], 
        宝宝防御大 = Player.R.自定属性[168], 
        宝宝血量   = Player.GetSVar(92),
        攻速移速   = 1000 - (Player.R.所有宝宝速度 + Player.R.驯兽宝宝速度), 坐标X = Player.GetMapX(), 坐标Y = Player.GetMapY()
    let Actor: TActor

    宝宝攻击小 = js_number(宝宝攻击小, String(继承倍率), 3)
    宝宝攻击大 = js_number(宝宝攻击大, String(继承倍率), 3)
    宝宝攻击小 = js_number(js_number(js_number(String(Player.R.轮回之道等级), 宝宝攻击小, 3), `0.01`, 3), 宝宝攻击小, 1)
    宝宝攻击大 = js_number(js_number(js_number(String(Player.R.轮回之道等级), 宝宝攻击大, 3), `0.01`, 3), 宝宝攻击大, 1)
    宝宝血量 = js_number(js_number(js_number(String(Player.R.轮回之道等级), 宝宝血量, 3), `0.04`, 3), 宝宝血量, 1)

    Player.V.速度专精激活 ? 攻速移速 = 攻速移速 - Player.R.速度点数 * 20 * 2 : 攻速移速 = 攻速移速 - Player.R.速度点数 * 2
    switch (true) {
        case Player.GetMap().CanMove(坐标X + 1, 坐标Y, true) == true: 坐标X = 坐标X + 1; 坐标Y = 坐标Y; break
        case Player.GetMap().CanMove(坐标X - 1, 坐标Y, true) == true: 坐标X = 坐标X - 1; 坐标Y = 坐标Y; break
        case Player.GetMap().CanMove(坐标X, 坐标Y + 1, true) == true: 坐标X = 坐标X; 坐标Y = 坐标Y + 1; break
        case Player.GetMap().CanMove(坐标X, 坐标Y - 1, true) == true: 坐标X = 坐标X; 坐标Y = 坐标Y - 1; break
        case Player.GetMap().CanMove(坐标X - 1, 坐标Y - 1, true) == true: 坐标X = 坐标X - 1; 坐标Y = 坐标Y - 1; break
        case Player.GetMap().CanMove(坐标X + 1, 坐标Y - 1, true) == true: 坐标X = 坐标X + 1; 坐标Y = 坐标Y - 1; break
        case Player.GetMap().CanMove(坐标X - 1, 坐标Y + 1, true) == true: 坐标X = 坐标X - 1; 坐标Y = 坐标Y + 1; break
        case Player.GetMap().CanMove(坐标X + 1, 坐标Y + 1, true) == true: 坐标X = 坐标X + 1; 坐标Y = 坐标Y + 1; break
    }

    if (Player.V.轮回次数 < 30) { 攻击距离 = 3 }
    if (Player.V.轮回次数 >= 30 && Player.V.轮回次数 < 40) { 攻击距离 = 4 }
    if (Player.V.轮回次数 >= 40 && Player.V.轮回次数 <= 50) { 攻击距离 = 5 }

    let List = GameLib.MonGen(Player.Map.MapName, 怪物名字, 召唤数量, 坐标X, 坐标Y, 0, 0, 0, 11, true, true, true, true)
    // GameLib.MonGen(Monster.Map.MapName, Monster.Name, 1, 生成X, 生成Y, 0, 0 ,0 ,TAG, true, true, true, true).Actor(0);
    Player.KillSlave(怪物名字)
    for (let i = List.Count - 1; i >= 0; i--) {
        Actor = List.Actor(i)
        Actor.SetMaxHP(10000000)
        Actor.SetHP(10000000)
        Actor.SetDCMin(99)
        Actor.SetDCMax(99)
        Actor.SetMaster(Player)
        Actor.SetMasterRoyaltyTick(108000000)
        Actor.SetThroughHuman(true)
        if (Actor.GetName() == '天道轮回兽') {
            Actor.SetBlendColor(52)
        }
        Actor.SetAttackSpeed(Math.max(100, 攻速移速 - Player.V.轮回次数 * 18))
        Actor.SetWalkSpeed(Math.max(100, 攻速移速 - Player.V.轮回次数 * 18))
        Actor.SetAttackRange(攻击距离)
        // Player.SendMessage(`当前宝宝血量:${大数值整数简写(Actor.GetMaxHP())},攻击:${大数值整数简写(宝宝攻击小)} - ${大数值整数简写(宝宝攻击大)},防御:${大数值整数简写(宝宝防御大)},速度:${Actor.GetAttackSpeed()}`);
        // Player.SendMessage(`当前宝宝血量:${Actor.GetMaxHP()},攻击:${Actor.GetDCMin()} - ${Actor.GetDCMax()},防御:${Actor.GetACMax()},速度:${Actor.GetWalkSpeed()}`);
        Actor.SetSVar(原始名字, 怪物名字)
        Actor.SetSVar(92, String(宝宝血量))
        Actor.SetSVar(91, Actor.GetSVar(92))
        Actor.SetSVar(93, String(宝宝攻击小))
        Actor.SetSVar(94, String(宝宝攻击大))
        Actor.SetSVar(95, String(宝宝防御小))
        Actor.SetSVar(96, String(宝宝防御大))
        Player.SendMessage(`当前宝宝血量:${大数值整数简写(Actor.GetSVar(92))},攻击:${大数值整数简写(宝宝攻击小)} - ${大数值整数简写(宝宝攻击大)},防御:${大数值整数简写(宝宝防御大)},速度:${Actor.GetAttackSpeed()}`);
        let 新字符 = { 怪物名字: Actor.Name, 怪物等级: String(Actor.Level), 血量: 宝宝血量, 攻击: 宝宝攻击大, 防御: 宝宝防御大, 怪物颜色: '', 怪物标志: 0, }
        GameLib.R.怪物信息 = GameLib.R.怪物信息 || {};
        GameLib.R.怪物信息[`${Actor.Handle}`] = JSON.stringify(新字符)
        Actor.SetSVar(98, JSON.stringify(新字符))
        Actor.SetTriggerAINpcExecute(true)
        Actor.SetTriggerSelectMagicBeforeAttack(true)
        Actor.SetViewRange(12)
        Actor.SetConfuseBitTimeBeAttacked(false)
        血量显示(Actor)
    }
}


