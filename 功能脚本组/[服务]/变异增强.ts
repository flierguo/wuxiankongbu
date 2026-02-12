export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.变异等级 ??= 1
    Player.V.当前变异等级 ??= 1

    let 材料数量 = Player.V.变异等级 * 10
    let 元宝数量 = Player.V.变异等级 * 1000
    if (元宝数量 >= 500000) { 元宝数量 = 500000 }
    if (材料数量 >= 2000) { 材料数量 = 2000 }
    const S = `\\\\
                            {S=变异增强;C=251} \\\\
    {S=变异增强属性介绍:;C=9}\\
    {S=① 变异等级可提高变异怪物的倍率;c=20}\\
    {S=② 每10级提高倍数1%;c=20}\\
    {S=③ 最高可提升到无限级;c=20}\\
    {S=您当前可设置的最高变异等级为;C=9}: {S=${Player.V.变异等级};C=23} 级\\\\
    {S=您当前的变异等级为;C=9}: {S=${Player.V.当前变异等级};C=23} 级\\\\
    {S=下一级需要材料:妖族内丹  ${材料数量} 个 +  ${元宝数量}元宝;HINT=元宝消耗50W封顶#92材料消耗2000封顶;C=253}\\

    <{S=提升等级;X=320;Y=240}/@提升等级>\\ 
    <{S=设置等级;X=320;Y=200}/@@InputInteger1(请输入需要设置的变异等级,最高等级为${Player.V.变异等级})>\\ 

    `
    Npc.SayEx(Player, 'Npc小窗口', S)

}
export function 提升等级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 材料数量 = Player.V.变异等级 * 10
    let 元宝数量 = Player.V.变异等级 * 1000
    if (元宝数量 >= 500000) { 元宝数量 = 500000 }
    if (材料数量 >= 2000) { 材料数量 = 2000 }

    if (Player.GetItemCount('妖族内丹') < 材料数量) { Player.MessageBox(`妖族内丹数量不足${材料数量}个,无法升级!`); return }
    if (Player.GetGameGold() < 元宝数量) { Player.MessageBox(`元宝数量不足${元宝数量}个,无法升级!`); return }
    Npc.Take(Player, '妖族内丹', 材料数量)
    Player.SetGameGold(Player.GetGameGold() - 元宝数量)
    Player.GoldChanged()
    Player.V.变异等级 = Player.V.变异等级 + 1
    Player.MessageBox(`升级成功,当前变异等级${Player.V.变异等级}`)
    Main(Npc, Player, Args)
}
export function InputInteger1(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
   const 等级 = Args.Int[1]
   const 最高等级 = Player.V.变异等级
   if (等级 > 最高等级) { Player.MessageBox(`最高等级为${最高等级}`); return }

   Player.V.当前变异等级 = 等级
    Player.MessageBox(`设置成功,当前变异等级${Player.V.当前变异等级}`)
    Main(Npc, Player, Args)
}

