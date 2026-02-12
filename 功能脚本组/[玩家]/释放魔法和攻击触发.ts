import { js_number } from "../../全局脚本[公共单元]/utils/计算方法";
import { 实时回血 } from "../../大数值版本/字符计算";
import { 技能ID, 显示图标, 飘血 } from "./_P_Base";

export function 释放魔法触发(Player: TPlayObject, UserMagic: TUserMagic, Target: TActor): void {
    Randomize()
    if (UserMagic.MagID == 6) {
        Player.MagicAttack(Target, 技能ID.通用.施毒术给伤害)
    }
    if (UserMagic.MagID == 160) {
        Player.R.暗影值 = Player.R.暗影值 + 2
        if (Player.R.暗影值 >= 5) { Player.R.暗影值 = 5 }
        let 暗影值 = Player.AddStatusBuff(显示图标.暗影值, TBuffStatusType.stNone, 0, 0, 0) //给人物加个BUFF，方便增加一个BUFF图标
        Player.SetBuffIcon(暗影值.Handle, 'icons.data', 148, 148, ``, '', `{S=当前‘暗影值’数量:${Player.R.暗影值};C=251}`, true/*是否消失前3秒钟闪烁*/, true/*是否在图标底部显示剩余时间*/)
    }
    if (random(300) < (1 + Math.floor(Player.V.暴怒等级 / 100)) && Player.V.暴怒等级 > 0 && Player.R.暴怒状态 == false) {
        Player.R.暴怒状态 = true
        Player.SendMessage(`{S=【暴怒状态触发】;C=253}: 你进入了暴怒状态！`, 1)
    }
}

export function 攻击触发(Player: TPlayObject, UserMagic: TUserMagic, Target: TActor): void {
    Randomize()
    let Magic: TUserMagic
    // Player.MagicAttack(Target,10064,true)
    if (Player.V.罗汉) {
        Magic = Player.FindSkill('金刚护法');
        if (random(100) < 7 && Magic) {
            Player.MagicAttack(Target, 技能ID.罗汉.金刚护法被动)
        }
    }
    if (Player.V.骑士 && random(100) < 20) {
        Player.MagicAttack(Target, 技能ID.骑士.圣光打击被动)
    }
    if (Player.V.刺客) {
        Magic = Player.FindSkill('致命打击');
        if (Magic) {
            if (UserMagic.MagID != 160 && random(100) < 10 + Player.R.致命打击等级) {
                Player.R.暗影值 = Player.R.暗影值 + 1
                if (Player.R.暗影值 >= 5) { Player.R.暗影值 = 5 }
                let 暗影值 = Player.AddStatusBuff(显示图标.暗影值, TBuffStatusType.stNone, 0, 0, 0) //给人物加个BUFF，方便增加一个BUFF图标
                Player.SetBuffIcon(暗影值.Handle, 'icons.data', 148, 148, ``, '', `{S=当前‘暗影值’数量:${Player.R.暗影值};C=251}`, true/*是否消失前3秒钟闪烁*/, true/*是否在图标底部显示剩余时间*/)
            }
        }

    }

    if (Player.V.鬼舞者) {
        Magic = Player.FindSkill('鬼舞斩');
        if (UserMagic.MagID < 1 && Magic) {
            Player.MagicAttack(Target, 技能ID.鬼舞者.鬼舞斩被动)
        }
        Magic = Player.FindSkill('鬼舞术');
        if (DateUtils.SecondSpan(DateUtils.Now(), Player.VarDateTime('鬼舞术').AsDateTime) >= 5 && Magic) {
            Player.MagicAttack(Target, 技能ID.鬼舞者.鬼舞术被动)
            Player.VarDateTime('鬼舞术').AsDateTime = DateUtils.Now()
        }
        Magic = Player.FindSkill('鬼舞之殇');
        if (random(100) < 10 + Player.R.鬼舞之殇等级 * 1 && Magic) {
            // Player.SetHP(Player.GetHP() + Player.GetMaxHP() * 0.1)
            实时回血(Player,js_number(Player.GetSVar(92),`0.1`,3))

            // Player.ShowBleedNumber(飘血.回血, Player.GetMaxHP() * 0.1);
        }
    }
    if (Player.V.神射手) {
        Magic = Player.FindSkill('复仇');
        Player.R.神射手第三次攻击++
        if (Player.R.神射手第三次攻击 >= 3 && Magic) {
            Player.R.神射手第三次攻击 = 0
            Player.MagicAttack(Target, 技能ID.神射手.复仇被动)
        }
        
    }
    if (Player.V.猎人) {
        Magic = Player.FindSkill('分裂箭');
        if (Magic) { Player.MagicAttack(Target, 技能ID.猎人.分裂箭被动) }

    }

    if(Player.Job == 0 && UserMagic.MagID == 0){
        Player.DamageDelay(Target, 1, 500, 999)
    }

    if (random(300) < (1 + Math.floor(Player.V.暴怒等级 / 100)) && Player.V.暴怒等级 > 0 && Player.R.暴怒状态 == false) {
        Player.R.暴怒状态 = true
        Player.SendMessage(`{S=【暴怒状态触发】;C=253}: 你进入了暴怒状态！`, 1)
    }
}