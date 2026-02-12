export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.暴怒等级 ??= 0
    Player.R.暴怒状态 ??= false
    let 数量 = (Player.V.暴怒等级 + 1) * 100
    let 元宝数量 = (Player.V.暴怒等级 + 1) * 5000
    if (元宝数量 >= 2000000) { 元宝数量 = 2000000 }
    if (数量 >= 10000) { 数量 = 10000 }
    const S = `\\\\
                             {S=暴怒;C=251} \\\\
    {S=暴怒属性介绍:;C=9}\\
    {S=① 杀怪时1/200几率进入暴怒状态;c=20}\\
    {S=② 暴怒状态时,所有攻击力提升100%;c=20}\\
    {S=③ 暴怒状态时,所有防御力提升100%;c=20}\\
    {S=④ 初始时暴怒状态持续5S;c=20}\\
    {S=提高等级可获得:;c=9}\\
    {S=等级每提高100级,几率提高1%;c=20}\\
    {S=等级每提高20级,暴怒状态持续时间增加1S;c=20}\\
    {S=等级每提高1级,伤害及防御力提高1%;c=20}\\
    {S=您当前的暴怒等级为;C=9}: {S=${Player.V.暴怒等级};C=23} 级\\
    {S=下一级需要材料:暴怒符文  ${数量} 个 +  ${元宝数量}元宝;C=253}\\      
                                         <{S=升级暴怒等级;HINT=可升级1000级}/@升级暴怒等级>\\        
    `
    Npc.SayEx(Player, 'Npc小窗口', S)

}
export function 升级暴怒等级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 数量 = (Player.V.暴怒等级 + 1) * 100
    let 元宝数量 = (Player.V.暴怒等级 + 1) * 5000
    if (元宝数量 >= 2000000) { 元宝数量 = 2000000 }
    if (数量 >= 10000) { 数量 = 10000 }
    if (Player.V.暴怒等级 >= 1000) { Player.MessageBox(`你暴怒等级已经达到了1000,并且发挥了最大值!`); return }
    if (Player.GetItemCount('暴怒符文') < 数量) { Player.MessageBox(`暴怒符文数量不足${数量}个,无法升级!`); return }
    if (Player.GetGameGold() < 元宝数量) { Player.MessageBox(`元宝数量不足${元宝数量}个,无法升级!`); return }
    Npc.Take(Player, '暴怒符文', 数量)
    Player.GameGold -= 元宝数量
    Player.GoldChanged()
    Player.V.暴怒等级 = Player.V.暴怒等级 + 1
    Player.MessageBox(`升级成功,当前暴怒等级${Player.V.暴怒等级}`)
    Main(Npc, Player, Args)
}

