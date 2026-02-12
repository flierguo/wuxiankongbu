export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\\\\\
                                     {S=甘道夫之戒;C=250}\\\\\\
                {S=集齐10个残破的甘道夫之戒+5000点券可以合成一个甘道夫之戒;C=241}\\
                {S=甘道夫之戒可进行强化,最高等级为10级;C=250}\\
                {S=强化方式1:10枚残破的甘道夫之戒+1000点券强化1次,最高强化10次;C=154}\\
                {S=强化方式2:甘道夫之戒+5000点券强化1次,最高强化10次;C=154}\\
                {S=每强化1次复活次数增加1次,复活时间减少10秒}\\
                {S=强化为100%成功,转移为100%成功}\\\\\\
                <合成甘道夫之戒/@甘道夫之戒>   <强化方式一/@强化一>  <强化方式二/@强化二>   <甘道夫之戒转移/@转移>
    `
    Npc.SayEx(Player, 'Npc中窗口带2框返回', S)

}

export function 甘道夫之戒(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let item: TUserItem
    if (Player.GetItemCount('残破的甘道夫之戒') < 10) { Player.MessageBox(`残破的甘道夫之戒不足10个,无法合成`); return }
    if (Player.GetGamePoint() < 5000) { Player.MessageBox(`点券不足5000,无法合成甘道夫之戒!`); return }
    Player.SetGamePoint(Player.GetGamePoint() - 5000)
    Player.GoldChanged()
    Npc.Take(Player, '残破的甘道夫之戒', 10)
    item = Player.GiveItem('甘道夫之戒')
    if (item) {
        item.SetBind(true)
        item.SetNeverDrop(true)
        item.State.SetNoDrop(true)
        item.SetOutWay1(40, 715)
        item.SetOutWay3(40, 1)
        item.Rename(item.GetName() + ` + ${item.GetOutWay3(40)}星`)
    }
    Player.UpdateItem(item)
    Player.MessageBox(`合成完毕,请查看!`)
    Main(Npc, Player, Args)
}
export function 强化一(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 装备 = Player.GetCustomItem(0)
    let item: TUserItem
    if (装备 == null || 装备.GetName() != '甘道夫之戒') { Player.MessageBox(`左边框请放入甘道夫之戒`); return }
    if (Player.GetItemCount('残破的甘道夫之戒') < 10) { Player.MessageBox(`残破的甘道夫之戒不足10个,无法强化`); return }
    if (Player.GetGamePoint() < 1000) { Player.MessageBox(`点券不足1000,无法强化!`); return }
    if (装备.GetOutWay3(40) >= 10) { Player.MessageBox(`甘道夫之戒经验强化到满级!`); return }
    Player.SetGamePoint(Player.GetGamePoint() - 1000)
    Player.GoldChanged()
    Npc.Take(Player, '残破的甘道夫之戒', 10)
    装备.SetOutWay3(40, 装备.GetOutWay3(40) + 1)
    装备.Rename(装备.GetName() + ` + ${装备.GetOutWay3(40)}星`)
    Player.UpdateItem(装备)
    Player.MessageBox(`强化完毕,请查看!`)
    Main(Npc, Player, Args)
}
export function 强化二(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 装备 = Player.GetCustomItem(0)
    if (装备 == null || 装备.GetName() != '甘道夫之戒') { Player.MessageBox(`左边框请放入甘道夫之戒`); return }
    if (Player.GetGamePoint() < 5000) { Player.MessageBox(`点券不足5000,无法强化!`); return }
    if (装备.GetOutWay3(40) >= 10) { Player.MessageBox(`甘道夫之戒经验强化到满级!`); return }
    Player.SetGamePoint(Player.GetGamePoint() - 5000)
    Player.GoldChanged()
    装备.SetOutWay3(40, 装备.GetOutWay3(40) + 1)
    装备.Rename(装备.GetName() + ` + ${装备.GetOutWay3(40)}星`)
    Player.UpdateItem(装备)
    Player.MessageBox(`强化完毕,请查看!`)
    Main(Npc, Player, Args)
}
export function 转移(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 转移 = Player.GetCustomItem(0)
    let 继承 = Player.GetCustomItem(1)
    if (转移 == null || 转移.GetName() != '甘道夫之戒') { Player.MessageBox('左边框请放入要转移的甘道夫之戒'); return }
    if (继承 == null || 继承.GetName() != '甘道夫之戒') { Player.MessageBox('右边框请放入要继承的甘道夫之戒'); return }
    if (转移.GetOutWay3(40) < 1) { Player.MessageBox('0星怎么转移?'); return }
    if (转移.GetName() == '甘道夫之戒' && 继承.GetName() == '甘道夫之戒') {
        继承.SetOutWay3(40, 转移.GetOutWay3(40))
        继承.Rename(继承.GetName() + ` + ${继承.GetOutWay3(40)}星`)
        继承.SetBind(true)
        继承.SetNeverDrop(true)
        继承.State.SetNoDrop(true)
        转移.SetOutWay3(40, 1)
        转移.Rename(转移.GetName() + ` + ${转移.GetOutWay3(40)}星`)
        Player.UpdateItem(继承)
        Player.UpdateItem(转移)
        Player.MessageBox(`转移完毕请查看!`)
    }
    Main(Npc, Player, Args)
}