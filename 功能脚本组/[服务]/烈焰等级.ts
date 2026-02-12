export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.烈焰等级 ??= 0

    let 数量 = Player.V.烈焰等级 * 50
    let 元宝数量 = Player.V.烈焰等级 * 2000
    if (Player.R.烈焰一击所需货币缩减 > 0) {
        元宝数量 = Math.floor(元宝数量 / (1 + Player.R.烈焰一击所需货币缩减))
    }
    if (元宝数量 >= 2000000) { 元宝数量 = 2000000 }
    if (数量 >= 10000) { 数量 = 10000 }
    const S = `\\\\
                            {S=烈焰一击;C=251} \\\\
    {S=烈焰属性介绍:;C=9}\\
    {S=① 1/100几率触发10倍伤害;c=20}\\
    {S=② 1/1000几率触发100倍伤害;c=20}\\
    {S=③ 1/10000几率触发1000倍伤害;c=20}\\
    {S=提高等级可获得:;c=9}\\
    {S=等级每提高1级,② ③的几率提高1‰;c=20}\\
    {S=等级每提高1级,① ② ③的伤害提高10%;c=20}\\
    {S=您当前的烈焰等级为;C=9}: {S=${Player.V.烈焰等级};C=23} 级\\
    {S=下一级需要材料:烈焰精魄  ${数量} 个 +  ${元宝数量}元宝;C=253}\\
    {S=PS:人物的技能和普攻都可以触发烈焰一击,可升级1W级;C=254}\\\\       
                                            <升级烈焰等级/@升级烈焰等级>\\     

    `
    Npc.SayEx(Player, 'Npc小窗口', S)

}
export function 升级烈焰等级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 数量 = Player.V.烈焰等级 * 50
    let 元宝数量 = Player.V.烈焰等级 * 2000
    if (Player.R.烈焰一击所需货币缩减 > 0) {
        元宝数量 = Math.floor(元宝数量 / (1 + Player.R.烈焰一击所需货币缩减))
    }
    if (元宝数量 >= 2000000) { 元宝数量 = 2000000 }
    if (数量 >= 10000) { 数量 = 10000 }
    if (Player.V.烈焰等级 >= 9999) { Player.MessageBox(`你烈焰等级已经达到了9999,并且发挥了最大值!`); return }
    if (Player.GetItemCount('烈焰精魄') < 数量) { Player.MessageBox(`烈焰精魄数量不足${数量}个,无法升级!`); return }
    if (Player.GetGameGold() < 元宝数量) { Player.MessageBox(`元宝数量不足${元宝数量}个,无法升级!`); return }
    Npc.Take(Player, '烈焰精魄', 数量)
    Player.SetGameGold(Player.GetGameGold() - 元宝数量)
    Player.GoldChanged()
    Player.V.烈焰等级 = Player.V.烈焰等级 + 1
    Player.MessageBox(`升级成功,当前烈焰等级${Player.V.烈焰等级}`)
    Main(Npc, Player, Args)
}

