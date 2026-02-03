// import { js_number } from "../../全局脚本[公共单元]/utils/计算方法";
// import { 实时回血 } from "../../大数值版本/字符计算";
// import { 技能ID, 显示图标 } from "./_P_Base";
import { 装备属性统计 } from "../_装备/属性统计"
import { 技能ID } from "../基础常量"

export function 释放魔法触发(Player: TPlayObject, UserMagic: TUserMagic, Target: TActor): void {
    //     Randomize()
    //     if (UserMagic.MagID == 6) {
    //         Player.MagicAttack(Target, 技能ID.通用.施毒术给伤害)
    //     }

    // if (random(100) < 20 && Player.V.职业 === '烈焰') {
    //     Player.MagicAttack(Target, 技能ID.烈焰.爆裂火冢)
    //     Player.SendCountDownMessage(`【爆裂火冢】触发！`, 0);
    // }

    //     if (UserMagic.MagID == 160) {
    //         Player.R.暗影值 = Player.R.暗影值 + 2
    //         if (Player.R.暗影值 >= 5) { Player.R.暗影值 = 5 }
    //         let 暗影值 = Player.AddStatusBuff(显示图标.暗影值, TBuffStatusType.stNone, 0, 0, 0) //给人物加个BUFF，方便增加一个BUFF图标
    //         Player.SetBuffIcon(暗影值.Handle, 'icons.data', 148, 148, ``, '', `{S=当前‘暗影值’数量:${Player.R.暗影值};C=251}`, true/*是否消失前3秒钟闪烁*/, true/*是否在图标底部显示剩余时间*/)
    //     }
    //     if (random(300) < (1 + Math.floor(Player.V.暴怒等级 / 100)) && Player.V.暴怒等级 > 0 && Player.R.暴怒状态 == false) {
    //         Player.R.暴怒状态 = true
    //         Player.SendMessage(`{S=【暴怒状态触发】;C=253}: 你进入了暴怒状态！`, 1)
    //     }
}

export function 攻击触发(Player: TPlayObject, UserMagic: TUserMagic, Target: TActor): void {
    Randomize()
    let Magic: TUserMagic
    // if (Player.V.职业 == '暗影') {
    // if (random(100) < 100 && (Player.R.暗影值 <= Player.V.暗影猎取等级 / 5 + 100)) {
    // Player.R.暗影值 += 1
    // 装备属性统计(Player)
    // let 暗影猎取 = Player.AddIntervalBuff(1, TBuffIntervalType.biNone, 0, 0, 0, 0)
    // Player.SetBuffIcon(暗影猎取.Handle, 'magicon.wzl', 2312, 2312, ``, '', `{S=当前暗影值: ${Player.R.暗影值} 点}`, true/*是否消失前3秒钟闪烁*/, true/*是否在图标底部显示剩余时间*/)
    // }
    // }
    // if (Player.Job == 0 && UserMagic.MagID == 0) {
    //     if (random(100) < 10) {
    //         Player.MagicAttack(Target, 技能ID.基础技能.攻杀剑术)
    //     } else
    //         Player.MagicAttack(Target, 技能ID.基础技能.半月弯刀)
    // }


}