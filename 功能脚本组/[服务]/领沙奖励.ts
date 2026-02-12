import { _G_GA_DonationData } from "../[玩家]/_P_Base"

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
                    {S=活跃度计算方式: 在皇宫内击杀敌方行会时累计值;C=55}\\\\
                    {S=胜利方奖励:;C=254}{S=500礼卷;C=243}   {S=失败方奖励:;C=55}{S=300礼卷;C=241}\\\\
          {S=攻杀活跃度排行;C=253}             名次              {S=行会名称;C=253}\\
          {S=${GameLib.GetGVar(_G_GA_DonationData[0]._G_杀人数量)};C=255;X=80;Y=150}  {S=No1;C=255;X=226;Y=150}  {S=【${GameLib.GetAVar(_G_GA_DonationData[0]._A_行会名字)}】;C=255;X=340;Y=150}\\
          {S=${GameLib.GetGVar(_G_GA_DonationData[1]._G_杀人数量)};C=255;X=80;Y=180}  {S=No2;C=255;X=226;Y=180}  {S=【${GameLib.GetAVar(_G_GA_DonationData[1]._A_行会名字)}】;C=255;X=340;Y=180}\\
          {S=${GameLib.GetGVar(_G_GA_DonationData[2]._G_杀人数量)};C=255;X=80;Y=210}  {S=No3;C=255;X=226;Y=210}  {S=【${GameLib.GetAVar(_G_GA_DonationData[2]._A_行会名字)}】;C=255;X=340;Y=210}\\\\\\\\
                 首沙根据当前区总捐献的礼卷领取,后面固定礼卷领取\\\\
                     <领取胜利方奖励/@领取胜利>         <领取失败方奖励/@领取失败>\\
    `
    Npc.SayEx(Player, 'Npc中窗口', S)

}

export function 领取胜利(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.Guild == null) { Player.MessageBox('你还没有行会呢?'); return }
    if (GameLib.V.胜利领奖 == undefined) { Player.MessageBox('请等待攻城完毕在来领奖!'); return }
    if (!Player.ISCastleMaster) { Player.MessageBox('请让沙巴克老大前来领取!'); return }
    if (GameLib.V.胜利领奖) { Player.MessageBox('胜利方奖励已被领取完毕!'); return }
    if (GameLib.V.首区攻杀 == false) {
        Player.SetGamePoint(Player.GetGamePoint() + GameLib.V.总捐献 * 0.25 * 0.75)
        Player.GoldChanged()
        GameLib.V.胜利领奖 = true
    } else {
        Player.SetGamePoint(Player.GetGamePoint() + 500)
        Player.GoldChanged()
        GameLib.V.胜利领奖 = true
    }

}
export function 领取失败(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.Guild == null) { Player.MessageBox('你还没有行会呢?'); return }
    if (!Player.IsGuildMaster) { Player.MessageBox('请让你们行会掌门前来领奖!'); return }
    if (GameLib.V.失败领奖 == undefined) { Player.MessageBox('请等待攻城完毕在来领奖!'); return }
    if (Player.ISCastleMaster) { Player.MessageBox('你无法领取失败方奖励!'); return }
    if (GameLib.V.失败领奖) { Player.MessageBox('失败方奖励已被领取完毕!'); return }
    if (Player.Guild.Name == GameLib.GetAVar(_G_GA_DonationData[0]._A_行会名字)) {
        GameLib.V.失败领奖 = true
        if (GameLib.V.首区攻杀 == false) {
            Player.SetGamePoint(Player.GetGamePoint() + GameLib.V.总捐献 * 0.25 * 0.25)
            Player.GoldChanged()

        } else {
            Player.SetGamePoint(Player.GetGamePoint() + 300)
            Player.GoldChanged()

        }
    } else if (Player.Guild.Name == GameLib.GetAVar(_G_GA_DonationData[1]._A_行会名字)) {
        GameLib.V.失败领奖 = true
        if (GameLib.V.首区攻杀 == false) {
            Player.SetGamePoint(Player.GetGamePoint() + GameLib.V.总捐献 * 0.25 * 0.25)
            Player.GoldChanged()
        } else {
            Player.SetGamePoint(Player.GetGamePoint() + 300)
            Player.GoldChanged()
        }
    } else { Player.MessageBox('你所在的行会杀人活跃度不够,无法领取失败方奖励!'); return }
}