import { 装备属性统计 } from '../../应用智能优化版';


export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
          {S=当前总捐献;C=8} {S=${GameLib.V.总捐献};C=254} {S=礼卷;C=243}   {S=总捐献的25%作为沙奖励;C=191}\\\\
          {S=沙巴克胜利方获得:;C=55}{S=${Math.floor(GameLib.V.总捐献 * 0.25 * 0.75) };C=241}   {S=失败方方获得:;C=55}{S=${Math.floor(GameLib.V.总捐献 * 0.25 * 0.25)};C=241}\\\\
          失败方按照活跃度排名来计算\\\\
          {S=捐献达到 50礼卷  可开通 自动拾取 功能;C=150}\\
          {S=捐献达到 200礼卷 可开通 自动回收 功能;C=150}\\\\
          {S=当前您的总捐献礼卷数量为${Player.V.总捐献礼卷数量}!可累计合区不消失;C=31}\\\\
          <捐赠1000礼卷/@捐赠(1000,100)>  <捐赠100礼卷/@捐赠(100,10)>  <捐赠10礼卷/@捐赠(10,1)>\\
    `
    Npc.SayEx(Player, 'Npc小窗口', S)

}

export function 捐赠(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 礼卷数量 = Args.Int[0]
    let 荣誉值 = Args.Int[1]
    if (Player.GetGamePoint() < 礼卷数量) { Player.MessageBox(`你的礼卷数量不足${礼卷数量},捐赠失败!`); return }
    Player.SetGamePoint(Player.GetGamePoint() - 礼卷数量)
    Player.GoldChanged()
    Player.V.总捐献礼卷数量 = Player.V.总捐献礼卷数量 + 礼卷数量
    GameLib.V.总捐献 = GameLib.V.总捐献 + 礼卷数量
    Main(Npc, Player, Args)
    switch (true) {
        case Player.V.总捐献礼卷数量 < 50: Player.V.会员等级 = 0; break
        case Player.V.总捐献礼卷数量 >= 50 && Player.V.总捐献礼卷数量 < 200: Player.V.会员等级 = 1; break
        case Player.V.总捐献礼卷数量 >= 200 && Player.V.总捐献礼卷数量 < 1000: Player.V.会员等级 = 2; break
        case Player.V.总捐献礼卷数量 >= 1000 && Player.V.总捐献礼卷数量 < 1750: Player.V.会员等级 = 3; break
        case Player.V.总捐献礼卷数量 >= 1750 && Player.V.总捐献礼卷数量 < 5000: Player.V.会员等级 = 4; break
        case Player.V.总捐献礼卷数量 >= 5000 && Player.V.总捐献礼卷数量 < 10000: Player.V.会员等级 = 5; break
        case Player.V.总捐献礼卷数量 >= 10000: Player.V.会员等级 = 6; break
    }
    Player.V.荣誉值 = Player.V.荣誉值+荣誉值
    装备属性统计(Player,undefined,undefined,undefined);

}