import * as _P_Base from "../_核心部分/基础常量"
import { 实时回血 } from "../核心功能/字符计算"
import { 大数值整数简写 } from "../功能脚本组/[服务]/延时跳转"
import { 智能计算 } from "../大数值/核心计算方法"
import { BOSS技能1, BOSS技能4, 怪物技能1ID, 怪物技能1几率, 怪物技能4ID, 怪物技能4几率 } from "../_核心部分/基础常量"

// ==================== 怪物技能选择回调 ====================
GameLib.onMonSelectMagicBeforeAttack = (AMon: TActor, ATarget: TActor, AMagicID: number): number => {
    // 检查是否是玩家的宝宝，宝宝有特殊处理
    const Player = AMon.Master as TPlayObject
    if (Player && Player.IsPlayer()) {
        // 宝宝技能处理（如果需要可以在这里添加）
        return AMagicID
    }
    
    // 怪物技能处理
    if (AMon.GetSVar(BOSS技能1) !== '' || AMon.GetSVar(BOSS技能4) !== '') {
        const 技能1ID = AMon.GetNVar(怪物技能1ID)
        const 技能1几率 = AMon.GetNVar(怪物技能1几率)
        const 技能4ID = AMon.GetNVar(怪物技能4ID)
        const 技能4几率 = AMon.GetNVar(怪物技能4几率)
        
        // 治愈术特殊处理（对自己释放）
        if (技能1ID === 10036) {
            AMon.MagicAttack(AMon, 10036)
        } else if (random(140) < 技能1几率) {
            // 释放技能1
            AMon.MagicAttack(ATarget, 技能1ID)
        } else if (技能4ID === 10036) {
            AMon.MagicAttack(AMon, 10036)
        } else if (random(140) < 技能4几率) {
            // 释放技能4
            AMon.MagicAttack(ATarget, 技能4ID)
        }
    }
    
    return AMagicID
}


export function 查看属性(Source: TActor, Target: TActor): void {
    let Player: TPlayObject = Source as TPlayObject
    if (Target != null && !Target.IsPlayer()) {
        let 生命 = 大数值整数简写(Target.GetSVar(92))
        let 攻击小 = 大数值整数简写(Target.GetSVar(93))
        let 攻击大 = 大数值整数简写(Target.GetSVar(94))
        let 防御小 = 大数值整数简写(Target.GetSVar(95))
        let 防御大 = 大数值整数简写(Target.GetSVar(96))
        Player.SendMessage(`${Target.GetSVar(_P_Base.原始名字)}属性:`, 1)
        Player.SendMessage(`生命:${生命}`, 1)
        Player.SendMessage(`攻击:${攻击小}-${攻击大}`, 1)
        Player.SendMessage(`防御:${防御小}-${防御大}`, 1)
        实时回血(Target, Player.GetSVar(92))
        // console.log(Target.GetCamp())
    }

}
// ==================== 通用函数 ====================
export function 获取玩家范围内目标(Player: TPlayObject, 范围: number): TActor[] {
    if (范围 <= 0) return [];
    const 目标列表: TActor[] = [];
    const AActorList = Player.Map.GetActorListInRange(Player.MapX, Player.MapY, 范围);
    const count = AActorList.Count;
    const playerHandle = Player.GetHandle();
    for (let i = 0; i < count; i++) {
        const Actor = AActorList.Actor(i);
        if (Actor && !Actor.GetDeath() && !Actor.IsNPC() && Actor.GetHandle() !== playerHandle && !Actor.IsPlayer() && !Actor.Master) {
            目标列表.push(Actor);
        }
    }
    return 目标列表;
}

export function 获取目标范围内目标(Player: TPlayObject, 目标: TActor, 范围: number): TActor[] {
    if (范围 <= 0 || !目标 || 目标.GetDeath()) return [];
    const 目标列表: TActor[] = [];
    const AActorList = 目标.Map.GetActorListInRange(目标.MapX, 目标.MapY, 范围);
    const count = AActorList.Count;
    const playerHandle = Player.GetHandle();
    for (let i = 0; i < count; i++) {
        const Actor = AActorList.Actor(i);
        if (Actor && !Actor.GetDeath() && !Actor.IsNPC() && Actor.GetHandle() !== playerHandle && !Actor.IsPlayer() && !Actor.Master) {
            目标列表.push(Actor);
        }
    }
    return 目标列表;
}

// ==================== 基础技能 ====================
// 攻杀剑术: 被动，几率触发攻杀造成200%伤害，每级提高20%
export function 攻杀剑术(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.基础技能.攻杀剑术);
}

// 刺杀剑术: 被动
export function 刺杀剑术(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.基础技能.刺杀剑术);
}

// 半月弯刀: 被动,对周围目标造成150%伤害,每级提高15%
export function 半月弯刀(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.基础技能.半月弯刀);
}

// 雷电术: 主动,对目标造成200%伤害,每级提高20%
export function 雷电术(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.基础技能.雷电术);
}

// 暴风雪: 主动,对目标3格敌人造成100%伤害,15%几率冰冻1秒,每级提升10%
export function 暴风雪(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.基础技能.暴风雪);
    // 15%几率冰冻1秒
    if (Math.random() < 0.15) {
        Target.SetState(5, 1, 0);
    }
}

// 灵魂火符: 主动,对目标造成200%伤害,每级提高20%
export function 灵魂火符(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.基础技能.灵魂火符);
}

// 飓风破: 主动,对目标3格敌人造成120%伤害,每级提升12%
export function 飓风破(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.基础技能.飓风破);
}

// 暴击术: 被动,对目标造成150%伤害,并且使你的暴击几率提高10%,每级提高15%伤害,1%几率
export function 暴击术(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.基础技能.暴击术);
}

// 霜月: 被动,对周围目标造成150%伤害,每级提高15%
export function 霜月(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.基础技能.霜月);
}

// 精准箭术: 被动,对目标造成200%伤害,每级提高20%
export function 精准箭术(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.基础技能.精准箭术);
}

// 万箭齐发: 主动,对目标3格敌人造成120%伤害,每级提升12%
export function 万箭齐发(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.基础技能.万箭齐发);
}

// 罗汉棍法: 开启后,对直线4格内敌人造成150%伤害,每级提升15%
export function 罗汉棍法(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.基础技能.罗汉棍法);
}

// 天雷阵: 开启后,对3格内敌人造成120%伤害,每级提升12%
export function 天雷阵(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Player.Damage(Target, 1, _P_Base.技能ID.基础技能.天雷阵);

}


// ==================== 天枢职业技能 ====================
// 怒斩: 主动,对目标周围3码内所有敌人造成伤害200%,每级提高20%
export function 怒斩(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    const 范围 = 3 + (Player.R.怒斩范围 || 0);
    const 目标列表 = Target ? 获取目标范围内目标(Player, Target, 范围) : [];
    for (const 目标 of 目标列表) {
        // 目标.ShowEffectEx2(_P_Base.特效.怒斩, -10, 20, true, 1);
        Player.Damage(目标, 1, _P_Base.技能ID.天枢.怒斩);
    }
}

// 人之怒: 被动,攻击时20%几率使你造成得伤害额外提高400%,每级提高40% (被动技能,在攻击计算中处理)
export function 人之怒(_Source: TActor, _Target: TActor): void {
    // 被动技能,伤害加成在攻击计算模块处理
}

// 地之怒: 被动,攻击时10%几率使你造成得伤害额外提高600%,每级提高60% (被动技能)
export function 地之怒(_Source: TActor, _Target: TActor): void {
    // 被动技能,伤害加成在攻击计算模块处理
}

// 天之怒: 被动,攻击时5%几率使你造成得伤害额外提高800%,每级提高80% (被动技能)
export function 天之怒(_Source: TActor, _Target: TActor): void {
    // 被动技能,伤害加成在攻击计算模块处理
}

// 神之怒: 被动,攻击时1%几率使你造成得伤害额外提高1000%,每级提高100% (被动技能)
export function 神之怒(_Source: TActor, _Target: TActor): void {
    // 被动技能,伤害加成在攻击计算模块处理
}

// ==================== 血神职业技能 ====================
// 血气献祭: 主动,消耗1%的生命,对目标造成500%的伤害,每级提高50%(血量低于10%时不发动)
export function 血气献祭(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    if (Player.HP < Player.MaxHP * 0.1) { Player.SendMessage('血量低于10%,血气献祭无法发动!'); return; }
    Player.HP = Math.max(1, Player.HP - Math.floor(Player.MaxHP * 0.01));
    Target.ShowEffectEx2(_P_Base.特效.血气献祭, -10, 20, true, 1);
    Player.Damage(Target, 1, _P_Base.技能ID.血神.血气献祭);
}

// 血气燃烧: 开启后,每秒对周围5码范围内敌人造成150%的伤害,每级提高15%(每秒消耗1%血量,血量低于10%时关闭)
export function 血气燃烧(Source: TActor, _Target: TActor): void {
    const Player = Source as TPlayObject;
    if (!Player.R.血气燃烧) {
        Player.R.血气燃烧 = true;
        Player.SetCustomEffect(_P_Base.永久特效.血气燃烧, _P_Base.特效.血气燃烧);
        Player.SendMessage('血气燃烧开启', 2);
    } else {
        Player.R.血气燃烧 = false;
        Player.SetCustomEffect(_P_Base.永久特效.血气燃烧, -1);
        Player.SendMessage('血气燃烧关闭', 2);
    }
}

// 血气吸纳: 被动,被攻击1%几率恢复5%血量,每20级几率提高1%,(最高到40) (被动技能)
export function 血气吸纳(_Source: TActor, _Target: TActor): void {
    // 被动技能,在被攻击时处理
}

// 血气迸发: 被动,攻击时可吸取造成伤害的1‰转化为生命,每级提高1‰,最高到2000‰ (被动技能)
export function 血气迸发(_Source: TActor, _Target: TActor): void {
    // 被动技能,在攻击计算模块处理
}

// 血魔临身: 开启后,使你的攻击额外提高150%,持续时间10S(每级提高5%伤害,每10级增加1S,最高180S).冷却3分钟
export function 血魔临身(Source: TActor, _Target: TActor): void {
    const Player = Source as TPlayObject;
    const now = DateUtils.Now();
    const cd = DateUtils.SecondSpan(now, Player.VarDateTime('血魔临身').AsDateTime);
    if (cd >= 180) {
        Player.VarDateTime('血魔临身').AsDateTime = now;
        const Magic = Player.FindSkill('血魔临身');
        const 持续时间 = Math.min(10 + Math.floor((Magic?.Level || 1) / 10), 180);
        Player.R.血魔临身 = true;
        Player.SetCustomEffect(_P_Base.永久特效.血魔临身, _P_Base.特效.血魔临身);
        Player.SendMessage(`血魔临身开启,持续${持续时间}秒!`, 2);
        Player.DelayCallMethod('MagicNpc.血魔临身结束', 持续时间 * 1000, false);
    } else {
        Player.SendCountDownMessage(`'血魔临身'技能CD剩余时间：${180 - Math.round(cd)}`, 0);
    }
}

export function 血魔临身结束(Source: TActor): void {
    const Player = Source as TPlayObject;
    Player.R.血魔临身 = false;
    Player.SetCustomEffect(_P_Base.永久特效.血魔临身, -1);
    Player.SendMessage('血魔临身结束', 2);
}


// ==================== 暗影职业技能 ====================
// 暗影猎取: 被动,攻击1%的几率获取暗影点,每点提高1%主属性,每5级提高1点上限 (被动技能)
export function 暗影猎取(_Source: TActor, _Target: TActor): void {
    // 被动技能,在攻击计算模块处理暗影点获取
}

// 暗影袭杀: 主动,对目标造成500%伤害,每级提高50%
export function 暗影袭杀(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Target.ShowEffectEx2(_P_Base.特效.暗影袭杀, -10, 20, true, 1);
    Player.Damage(Target, 1, _P_Base.技能ID.暗影.暗影袭杀);
}

// 暗影剔骨: 开启后,对周围6码范围内敌人造成300%伤害,每级提高30%,每秒消耗1点暗影点
export function 暗影剔骨(Source: TActor, _Target: TActor): void {
    const Player = Source as TPlayObject;
    if (!Player.R.暗影剔骨) {
        Player.R.暗影剔骨 = true;
        Player.SetCustomEffect(_P_Base.永久特效.暗影剔骨, _P_Base.特效.暗影剔骨);
        Player.SendMessage('暗影剔骨开启', 2);
    } else {
        Player.R.暗影剔骨 = false;
        Player.SetCustomEffect(_P_Base.永久特效.暗影剔骨, -1);
        Player.SendMessage('暗影剔骨关闭', 2);
    }
}

// 暗影风暴: 主动,对目标范围5码内敌人造成400%伤害,消耗5点暗影点.每级提高40%.冷却20S
export function 暗影风暴(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    if (!Player.R.暗影点 || Player.R.暗影点 < 5) { Player.SendMessage('暗影点不足5点,无法使用暗影风暴!'); return; }
    const now = DateUtils.Now();
    const cd = DateUtils.SecondSpan(now, Player.VarDateTime('暗影风暴').AsDateTime);
    if (cd >= 20) {
        Player.VarDateTime('暗影风暴').AsDateTime = now;
        Player.R.暗影点 = Player.R.暗影点 - 5;
        const 范围 = 5 + (Player.R.暗影风暴范围 || 0);
        const 目标列表 = Target ? 获取目标范围内目标(Player, Target, 范围) : [];
        for (const 目标 of 目标列表) {
            目标.ShowEffectEx2(_P_Base.特效.暗影风暴, -10, 20, true, 1);
            Player.Damage(目标, 1, _P_Base.技能ID.暗影.暗影风暴);
        }
    } else {
        Player.SendCountDownMessage(`'暗影风暴'技能CD剩余时间：${20 - Math.round(cd)}`, 0);
    }
}

// 暗影附体: 主动,消耗10点暗影点,使暗影袭杀的攻击提高至1000%,持续5S,每10级增加1S.冷却3分钟
export function 暗影附体(Source: TActor, _Target: TActor): void {
    const Player = Source as TPlayObject;
    if (!Player.R.暗影点 || Player.R.暗影点 < 10) { Player.SendMessage('暗影点不足10点,无法使用暗影附体!'); return; }
    const now = DateUtils.Now();
    const cd = DateUtils.SecondSpan(now, Player.VarDateTime('暗影附体').AsDateTime);
    if (cd >= 180) {
        Player.VarDateTime('暗影附体').AsDateTime = now;
        Player.R.暗影点 = Player.R.暗影点 - 10;
        const Magic = Player.FindSkill('暗影附体');
        const 持续时间 = 5 + Math.floor((Magic?.Level || 1) / 10);
        Player.R.暗影附体 = true;
        Player.SetCustomEffect(_P_Base.永久特效.暗影附体, _P_Base.特效.暗影附体);
        Player.SendMessage(`暗影附体开启,持续${持续时间}秒!`, 2);
        Player.DelayCallMethod('MagicNpc.暗影附体结束', 持续时间 * 1000, false);
    } else {
        Player.SendCountDownMessage(`'暗影附体'技能CD剩余时间：${180 - Math.round(cd)}`, 0);
    }
}

export function 暗影附体结束(Source: TActor): void {
    const Player = Source as TPlayObject;
    Player.R.暗影附体 = false;
    Player.SetCustomEffect(_P_Base.永久特效.暗影附体, -1);
    Player.SendMessage('暗影附体结束', 2);
}

// ==================== 烈焰职业技能 ====================
// 火焰追踪: 主动,对目标造成200%伤害,每级提高20%
export function 火焰追踪(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    Target.ShowEffectEx2(_P_Base.特效.爆裂火冢, -10, 20, true, 1);
    Player.Damage(Target, 1, _P_Base.技能ID.烈焰.火焰追踪);
    // 火镰狂舞：被动,每10级可为火焰追踪的目标增加一个
    const 火镰狂舞等级 = Player.V.火镰狂舞等级 || 0;
    if (火镰狂舞等级 > 0) {
        const 额外目标数 = Math.floor(火镰狂舞等级 / 10);
        if (额外目标数 > 0) {
            const targetHandle = Target.GetHandle();
            const 目标列表 = 获取目标范围内目标(Player, Target, 8);
            for (let i = 0, count = 0; i < 目标列表.length && count < 额外目标数; i++) {
                if (目标列表[i].GetHandle() !== targetHandle) {
                    目标列表[i].ShowEffectEx2(_P_Base.特效.爆裂火冢, -10, 20, true, 1);
                    Player.Damage(目标列表[i], 1, _P_Base.技能ID.烈焰.火焰追踪);
                    count++;
                }
            }
        }
    }
}

// 火镰狂舞: 被动,每10级可为火焰追踪的目标增加一个 (被动技能,在火焰追踪中处理)
export function 火镰狂舞(_Source: TActor, _Target: TActor): void {
    // 被动技能,效果在火焰追踪中实现
}

// 烈焰护甲: 开启后,每2秒对周围4格内的目标造成300%伤害,每级提高30%
export function 烈焰护甲(Source: TActor, _Target: TActor): void {
    const Player = Source as TPlayObject;
    if (!Player.R.烈焰护甲) {
        Player.R.烈焰护甲 = true;
        Player.SetCustomEffect(_P_Base.永久特效.烈焰护甲, _P_Base.特效.烈焰护甲);
        Player.SendMessage('烈焰护甲开启', 2);
    } else {
        Player.R.烈焰护甲 = false;
        Player.SetCustomEffect(_P_Base.永久特效.烈焰护甲, -1);
        Player.SendMessage('烈焰护甲关闭', 2);
    }
}

// 爆裂火冢: 被动,击中目标20%几率造成8格范围300%伤害,每级提高30% (被动技能)
export function 爆裂火冢(_Source: TActor, _Target: TActor): void {
    // 被动技能,在攻击计算模块处理
}

// 烈焰突袭: 被动,每攻击5次,使你下次伤害提升至200%,每重+20% (被动技能)
export function 烈焰突袭(_Source: TActor, _Target: TActor): void {
    // 被动技能,在攻击计算模块处理
}


// ==================== 正义职业技能 ====================
// 圣光(正义): 开启后,每秒对周围5码内所有目标造成200%伤害,每级提高20%
export function 圣光(Source: TActor, _Target: TActor): void {
    const Player = Source as TPlayObject;
    if (!Player.R.圣光) {
        Player.R.圣光 = true;
        Player.SetCustomEffect(_P_Base.永久特效.圣光, _P_Base.特效.圣光);
        Player.SendMessage('圣光光环开启', 2);
    } else {
        Player.R.圣光 = false;
        Player.SetCustomEffect(_P_Base.永久特效.圣光, -1);
        Player.SendMessage('圣光光环关闭', 2);
    }
}


// 行刑: 被动,对普通怪物的伤害增加200%，每级提高20% (被动技能)
export function 行刑(_Source: TActor, _Target: TActor): void {
    // 被动技能,在攻击计算模块处理
}

// 洗礼: 被动,对精英以上怪物的伤害增加100%，每级提高10% (被动技能)
export function 洗礼(_Source: TActor, _Target: TActor): void {
    // 被动技能,在攻击计算模块处理
}

// 审判: 被动,对满血目标造成10%血量切割，每20级+1%切割,封顶40% (被动技能)
export function 审判(_Source: TActor, _Target: TActor): void {
    // 被动技能,在攻击计算模块处理
}

// 神罚: 被动,攻击10%几率使目标遭受神罚，损失当前生命的1%，每40级+1% (被动技能)
export function 神罚(_Source: TActor, _Target: TActor): void {
    // 被动技能,在攻击计算模块处理
}

// ==================== 不动职业技能 ====================
// 如山: 开启后,每秒对周围5码内造成400%伤害,每级提高40%
export function 如山(Source: TActor, _Target: TActor): void {
    const Player = Source as TPlayObject;
    if (!Player.R.如山) {
        Player.R.如山 = true;
        Player.SetCustomEffect(_P_Base.永久特效.如山, _P_Base.特效.如山);
        Player.SendMessage('如山开启', 2);
    } else {
        Player.R.如山 = false;
        Player.SetCustomEffect(_P_Base.永久特效.如山, -1);
        Player.SendMessage('如山关闭', 2);
    }
}

// 泰山: 被动,主属性提高30%,每级增加3% (被动技能)
export function 泰山(_Source: TActor, _Target: TActor): void {
    // 被动技能,在属性计算模块处理
}

// 人王盾: 主动,释放技能提供一个防御上限值1000%的护盾，每级提高100%，CD10秒
export function 人王盾(Source: TActor, _Target: TActor): void {
    const Player = Source as TPlayObject;
    const now = DateUtils.Now();
    const cd = DateUtils.SecondSpan(now, Player.VarDateTime('人王盾').AsDateTime);
    if (cd >= 10) {
        Player.VarDateTime('人王盾').AsDateTime = now;
        const Magic = Player.FindSkill('人王盾');
        const 等级 = Magic?.Level || 1;
        // 护盾值 = 防御上限 * (1000% + 每级100%)
        const 防御上限 = Player.GetSVar(96) || '1000';
        const 护盾倍率 = 10 + 等级;
        Player.R.人王盾护盾值 = 智能计算(防御上限, String(护盾倍率), 3);
        Player.SetCustomEffect(_P_Base.永久特效.人王盾, _P_Base.特效.人王盾);
        Player.SendMessage(`人王盾开启,护盾值:${大数值整数简写(Player.R.人王盾护盾值)}`, 2);
    } else {
        Player.SendCountDownMessage(`'人王盾'技能CD剩余时间：${10 - Math.round(cd)}`, 0);
    }
}

// 铁布衫: 被动,提供20%格挡，每10级提高1%（50上限）(被动技能)
export function 铁布衫(_Source: TActor, _Target: TActor): void {
    // 被动技能,在属性计算模块处理
}

// 金刚掌: 主动,对目标周围8格范围造成500%伤害,并麻痹目标3秒，CD15秒,每级提高50%
export function 金刚掌(Source: TActor, Target: TActor): void {
    const Player = Source as TPlayObject;
    const now = DateUtils.Now();
    const cd = DateUtils.SecondSpan(now, Player.VarDateTime('金刚掌').AsDateTime);
    if (cd >= 15) {
        Player.VarDateTime('金刚掌').AsDateTime = now;
        if (!Target) return;
        const 目标列表 = 获取目标范围内目标(Player, Target, 8);
        for (const 目标 of 目标列表) {
            目标.ShowEffectEx2(_P_Base.特效.金刚掌, -10, 20, true, 1);
            目标.SetState(5, 3, 0); // 麻痹3秒
            Player.Damage(目标, 1, _P_Base.技能ID.不动.金刚掌);
        }
    } else {
        Player.SendCountDownMessage(`'金刚掌'技能CD剩余时间：${15 - Math.round(cd)}`, 0);
    }
}


// ==================== 嘲讽吸怪 ====================
export function 嘲讽吸怪(Source: TActor, _Target: TActor): void {
    const Player = Source as TPlayObject;
    if (Player.R.嘲讽吸怪_范围 > 0) {
        const AActorList = Player.Map.GetActorListInRange(Player.MapX, Player.MapY, Player.R.嘲讽吸怪_范围);
        if (AActorList.Count > 0) {
            for (let i = 0; i < AActorList.Count; i++) {
                const Actor = AActorList.Actor(i);
                if (Actor != null && !Actor.GetDeath() && !Actor.IsNPC() && Actor.GetHandle() != Player.GetHandle() && !Actor.IsPlayer()) {
                    if (Actor.Master && Actor.Master.Handle == Player.Handle) { continue; }
                    let 坐标X = Player.MapX;
                    let 坐标Y = Player.MapY;
                    switch (true) {
                        case Player.GetMap().CanMove(坐标X + 1, 坐标Y, false): 坐标X = 坐标X + 1; break;
                        case Player.GetMap().CanMove(坐标X - 1, 坐标Y, false): 坐标X = 坐标X - 1; break;
                        case Player.GetMap().CanMove(坐标X, 坐标Y + 1, false): 坐标Y = 坐标Y + 1; break;
                        case Player.GetMap().CanMove(坐标X, 坐标Y - 1, false): 坐标Y = 坐标Y - 1; break;
                        case Player.GetMap().CanMove(坐标X - 1, 坐标Y - 1, false): 坐标X = 坐标X - 1; 坐标Y = 坐标Y - 1; break;
                        case Player.GetMap().CanMove(坐标X + 1, 坐标Y - 1, false): 坐标X = 坐标X + 1; 坐标Y = 坐标Y - 1; break;
                        case Player.GetMap().CanMove(坐标X - 1, 坐标Y + 1, false): 坐标X = 坐标X - 1; 坐标Y = 坐标Y + 1; break;
                        case Player.GetMap().CanMove(坐标X + 1, 坐标Y + 1, false): 坐标X = 坐标X + 1; 坐标Y = 坐标Y + 1; break;
                        case Player.GetMap().CanMove(坐标X + 2, 坐标Y + 1, false): 坐标X = 坐标X + 2; 坐标Y = 坐标Y + 1; break;
                        case Player.GetMap().CanMove(坐标X - 2, 坐标Y + 1, false): 坐标X = 坐标X - 2; 坐标Y = 坐标Y + 1; break;
                        case Player.GetMap().CanMove(坐标X + 1, 坐标Y + 2, false): 坐标X = 坐标X + 1; 坐标Y = 坐标Y + 2; break;
                        case Player.GetMap().CanMove(坐标X + 1, 坐标Y - 2, false): 坐标X = 坐标X + 1; 坐标Y = 坐标Y - 2; break;
                        case Player.GetMap().CanMove(坐标X - 2, 坐标Y - 2, false): 坐标X = 坐标X - 2; 坐标Y = 坐标Y - 2; break;
                        case Player.GetMap().CanMove(坐标X + 2, 坐标Y - 2, false): 坐标X = 坐标X + 2; 坐标Y = 坐标Y - 2; break;
                        case Player.GetMap().CanMove(坐标X - 2, 坐标Y + 2, false): 坐标X = 坐标X - 2; 坐标Y = 坐标Y + 2; break;
                        case Player.GetMap().CanMove(坐标X + 2, 坐标Y + 2, false): 坐标X = 坐标X + 2; 坐标Y = 坐标Y + 2; break;
                    }
                    Actor.FlashMove(坐标X, 坐标Y, false);
                }
            }
        }
    } else {
        Player.SendCenterMessage(`你当前没有使用此技能的权限。`, 0, 3000);
    }
    Player.SendCenterMessage(`你使用了嘲讽吸怪技能。`, 0, 3000);
}

// ==================== 怪物技能 ====================
export function 怪物火球术(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10030);
}

export function 怪物疾光电影(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10031);
}

export function 怪物爆裂火焰(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10032);
}

export function 怪物地狱雷光(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10033);
}

export function 怪物半月(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10034);
}

export function 怪物攻杀(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10035);
}

export function 怪物治愈(Source: TActor, _Target: TActor): void {
    if (Number(Source.GetSVar(91)) < Number(Source.GetSVar(92))) {
        const 治疗值 = 智能计算(Source.GetSVar(92), '100', 4);
        实时回血(Source, 治疗值);
    }
}

export function 怪物刺杀(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10037);
}

export function 怪物烈火(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10038);
}

export function 怪物冰咆哮(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10039);
}

export function 怪物雷电术(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10041);
}

export function 怪物气功波(_Source: TActor, Target: TActor): void {
    Target.Push(_Source.GetDirection(), 1);
}

export function 怪物寒冰掌(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10043);
}

export function 怪物噬血术(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10044);
}

export function 怪物灭天火(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10045);
}

export function 怪物流星火雨(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10046);
}

export function 怪物灵魂火符(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10047);
}

export function 怪物飓风破(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10048);
}

export function 怪物倚天辟地(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10049);
}

export function 怪物彻地钉(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10050);
}

export function 怪物群体雷电术(Source: TActor, Target: TActor): void {
    Source.Damage(Target, 1, 10051);
}


// ==================== 技能执行注册 ====================
// 注意：技能名称必须与_P_玩家登录.ts中的技能列表保持一致
const MagicExecutes: { [key: string]: (Source: TActor, Target: TActor) => void } = {
    "查看属性" : 查看属性,
    // ========== 基础技能 ==========
    "攻杀剑术": 攻杀剑术,
    "刺杀剑术": 刺杀剑术,
    "半月弯刀": 半月弯刀,
    "雷电术": 雷电术,
    "暴风雪": 暴风雪,
    "灵魂火符": 灵魂火符,
    "飓风破": 飓风破,
    "暴击术": 暴击术,
    "霜月": 霜月,
    "精准箭术": 精准箭术,  // 注意：登录文件中使用"精准箭术"
    "万箭齐发": 万箭齐发,
    "罗汉棍法": 罗汉棍法,
    "天雷阵": 天雷阵,

    // ========== 天枢职业 ==========
    "怒斩": 怒斩,
    "人之怒": 人之怒,
    "地之怒": 地之怒,
    "天之怒": 天之怒,
    "神之怒": 神之怒,
    
    // ========== 血神职业 ==========
    "血气献祭": 血气献祭,
    "血气燃烧": 血气燃烧,
    "血气吸纳": 血气吸纳,
    "血气迸发": 血气迸发,
    "血魔临身": 血魔临身,
    
    // ========== 暗影职业 ==========
    "暗影猎取": 暗影猎取,
    "暗影袭杀": 暗影袭杀,
    "暗影剔骨": 暗影剔骨,
    "暗影风暴": 暗影风暴,
    "暗影附体": 暗影附体,
    
    // ========== 烈焰职业 ==========
    "火焰追踪": 火焰追踪,
    "火镰狂舞": 火镰狂舞,
    "烈焰护甲": 烈焰护甲,
    "爆裂火冢": 爆裂火冢,
    "烈焰突袭": 烈焰突袭,
    
    // ========== 正义职业 ==========
    "圣光": 圣光,  // 登录文件中使用"圣光"，函数内部调用正义函数
    "行刑": 行刑,
    "洗礼": 洗礼,
    "审判": 审判,
    "神罚": 神罚,
    
    // ========== 不动职业 ==========
    "如山": 如山,
    "泰山": 泰山,
    "人王盾": 人王盾,
    "铁布衫": 铁布衫,
    "金刚掌": 金刚掌,
    
    // ========== 其他 ==========
    "嘲讽吸怪": 嘲讽吸怪,
    
    // ========== 怪物技能 ==========
    "怪物火球术": 怪物火球术,
    "怪物疾光电影": 怪物疾光电影,
    "怪物爆裂火焰": 怪物爆裂火焰,
    "怪物地狱雷光": 怪物地狱雷光,
    "怪物半月": 怪物半月,
    "怪物攻杀": 怪物攻杀,
    "怪物治愈": 怪物治愈,
    "怪物刺杀": 怪物刺杀,
    "怪物烈火": 怪物烈火,
    "怪物冰咆哮": 怪物冰咆哮,
    "怪物雷电术": 怪物雷电术,
    "怪物气功波": 怪物气功波,
    "怪物寒冰掌": 怪物寒冰掌,
    "怪物噬血术": 怪物噬血术,
    "怪物灭天火": 怪物灭天火,
    "怪物流星火雨": 怪物流星火雨,
    "怪物灵魂火符": 怪物灵魂火符,
    "怪物飓风破": 怪物飓风破,
    "怪物倚天辟地": 怪物倚天辟地,
    "怪物彻地钉": 怪物彻地钉,
    "怪物群体雷电术": 怪物群体雷电术,
};

GameLib.onSkillActionExecute = (Source: TActor, Target: TActor, AMethod: string, _nParam1: number, _nParam2: number, _sParam1: string, _sParam2: string) => {
    const func = MagicExecutes[AMethod];
    if (func) {
        func(Source, Target);
    }
};
