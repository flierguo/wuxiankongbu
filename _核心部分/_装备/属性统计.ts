import { 智能计算 , 比较 } from "../../大数值/核心计算方法"
import { 大数值整数简写 , 血量显示} from "../字符计算" 


export function 人物额外属性计算(Player: TPlayObject) {
    //固定属性部分，直接算出每个属性加成的值，不能在原值的基础上，这样可能会重复 
    Player.AddedAbility.AC = 0
    Player.AddedAbility.ACMax = 0
    Player.AddedAbility.MAC = 0
    Player.AddedAbility.MACMax = 0
    Player.AddedAbility.DC = 0
    Player.AddedAbility.DCMax = 0
    Player.AddedAbility.MC = 0
    Player.AddedAbility.MCMax = 0
    Player.AddedAbility.SC = 0
    Player.AddedAbility.SCMax = 0
    Player.AddedAbility.HP = 0
    Player.AddedAbility.MP = Player.Level * 1000
    Player.AddedAbility.HitPoint = 0               //命中
    Player.AddedAbility.SpeedPoint = 0             //躲避
    Player.AddedAbility.AntiPoison = 0             //中毒躲避
    Player.AddedAbility.PoisonRecover = 0          //中毒恢复
    Player.AddedAbility.HealthRecover = 0          //体力恢复
    Player.AddedAbility.SpellRecover = 0           //魔法恢复	
    Player.AddedAbility.AntiMagic = 0              //魔法躲避
    Player.AddedAbility.ExpRate = Player.R.经验加成            //经验加成
    Player.AddedAbility.GoldRate = 0               //金币加成
    Player.AddedAbility.ItemRate = Player.R.爆率加成 + Player.V.赞助爆率 + Player.V.宣传爆率      //爆率加成
    Player.AddedAbility.DamageAdd = 0              //伤害加成
    Player.AddedAbility.AppendDamage = 0           //附加伤害
    Player.AddedAbility.Rebound = 0                //伤害反弹
    Player.AddedAbility.AppendDamageDef = 0        //附伤减免
    Player.AddedAbility.CriticalHit = 0            //会心一击
    Player.AddedAbility.CriticalHitDef = 0         //会心抵抗
    Player.AddedAbility.DamageAbsorb = 0           //伤害减免
    Player.AddedAbility.PunchHit = 0               //致命一击
    Player.AddedAbility.PunchHitDef = 0            //致命抵抗
    Player.AddedAbility.PunchHitAppendDamage = 0    //致命额伤
    Player.AddedAbility.CriticalHitAppendDamage = 0 //会心额伤
    Player.AddedAbility.HPRate = 0                  //生命百分比
    Player.AddedAbility.MPRate = 0                  //魔力百分比
    Player.AddedAbility.WearWeight = 0              //穿戴负重
    Player.AddedAbility.MaxWeight = 65535           //背包负重



    Player.SetSVar(92, Player.R.自定属性[167])
    if (比较(Player.GetSVar(91), Player.GetSVar(92)) >= 0) {
        Player.SetSVar(91, Player.GetSVar(92))
    }
    const 攻击大 = Player.R.自定属性[161]
    const 魔法大 = Player.R.自定属性[162]
    const 道术大 = Player.R.自定属性[163]
    const 刺术大 = Player.R.自定属性[164]
    const 箭术大 = Player.R.自定属性[165]
    const 武术大 = Player.R.自定属性[166]
    const 防御大 = Player.R.自定属性[168]

    const 攻击小 = Player.R.自定属性[151]
    const 魔法小 = Player.R.自定属性[152]
    const 道术小 = Player.R.自定属性[153]
    const 刺术小 = Player.R.自定属性[154]
    const 箭术小 = Player.R.自定属性[155]
    const 武术小 = Player.R.自定属性[156]
    const 防御小 = Player.R.自定属性[158]
    const 血量 = Player.GetSVar(92)

    let 恢复血量 = 0
    Player.V.恢复专精激活 ? 恢复血量 = Player.R.恢复点数 / 1000 * 2 : 恢复血量 = Player.R.恢复点数 / 1000
    // 🚀 字符串拼接优化：使用高性能字符串构建器
    const 计算位数 = (num: string) => num.toString().replace(/\.\d+/, '').length;
    
    // 缓存频繁访问的属性，避免重复计算
    const 缓存属性 = {
        等级: Player.GetLevel(),
        幸运: Player.V.幸运值,
        血量: 大数值整数简写(血量),
        伤害: 大数值整数简写(Player.R.造成伤害),
        力量: 大数值整数简写(Player.R.力量),
        体质: 大数值整数简写(Player.R.体质),
        耐力: 大数值整数简写(Player.R.耐力),
        防御小: 大数值整数简写(防御小),
        防御大: 大数值整数简写(防御大),
        攻击小: 大数值整数简写(攻击小),
        攻击大: 大数值整数简写(攻击大),
        魔法小: 大数值整数简写(魔法小),
        魔法大: 大数值整数简写(魔法大),
        道术小: 大数值整数简写(道术小),
        道术大: 大数值整数简写(道术大),
        刺术小: 大数值整数简写(刺术小),
        刺术大: 大数值整数简写(刺术大),
        箭术小: 大数值整数简写(箭术小),
        箭术大: 大数值整数简写(箭术大),
        武术小: 大数值整数简写(武术小),
        武术大: 大数值整数简写(武术大)
    };


    // 🚀 技能信息优化：使用新的职业技能信息优化器
    let 技能等级 = '';
    let 技能倍功 = '';

    // Player.SetClientUIProperty(`特殊属性文本`, `SayText =${特殊属性文本}`)
    // Player.SetClientUIProperty(`技能等级`, `SayText =${技能等级}`)
    // Player.SetClientUIProperty(`技能倍功`, `SayText =${技能倍功}`)
    // Player.SetClientUIProperty(`新属性显示`, `SayText =${新属性显示}`)
    // Player.SetClientUIProperty(`位数显示`, `saytext =${位数显示}`)
    血量显示(Player)

    Player.RecalcAbilitys();             //刷新属性并更新到客户端

}

