export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\\\\\
                                     {S=缺月太极;C=250}\\\\\\
                              {S=缺月太极可以进行升级;C=241}\\
                    {S=最高可升至10级,升级需要500点券*缺月太极等级;C=241}\\
                    {S=每强化1级增加2点全技能等级,满级额外增加30点全技能等级;C=254}\\
                    {S=升级成功率为100%,转移不收取任何费用;C=250}\\\\\\
                      <缺月太极强化/@阿拉贡双戒强化>           <缺月太极转移/@阿拉贡双戒转移>
    `
    Npc.SayEx(Player, 'Npc中窗口带2框返回', S)

}
export function 阿拉贡双戒强化(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 缺月太极 = Player.GetCustomItem(0)
    let 点券数量 = 0
    let a = ''
    if (缺月太极 == null || (缺月太极.GetName() != '缺月太极')) { Player.MessageBox('请将缺月太极放到左边框'); return }
    if (缺月太极.GetOutWay3(40) >= 10) { Player.MessageBox(`${缺月太极.GetName()}已经达到10星!`); return }
    点券数量 = 缺月太极.GetOutWay3(40) * 500 + 500
    if (Player.GetGamePoint() < 点券数量) { Player.MessageBox(`点券数量不足${点券数量},无法升级!`); return }
    Player.SetGamePoint(Player.GetGamePoint() - 点券数量)
    Player.GoldChanged()
    缺月太极.SetOutWay3(40, 缺月太极.GetOutWay3(40) + 1)
    a = 缺月太极.DisplayName.split(' + ')[0]
    缺月太极.Rename(a + ` + ${缺月太极.GetOutWay3(40)}星`)
    if (缺月太极.GetOutWay3(40) < 10) {
        缺月太极.SetOutWay2(12, 缺月太极.GetOutWay3(40) * 2)
    } else {
        缺月太极.SetOutWay2(12, 缺月太极.GetOutWay3(40) * 2 + 30)
    }
    缺月太极.SetBind(true)
    缺月太极.SetNeverDrop(true)
    缺月太极.State.SetNoDrop(true)
    Player.UpdateItem(缺月太极)
    Player.MessageBox(`升星完毕请查看!`)
    Main(Npc, Player, Args)
}

export function 阿拉贡双戒转移(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let a = ''
    let 转移 = Player.GetCustomItem(0)
    let 继承 = Player.GetCustomItem(1)
    if (转移 == null || 转移.GetName() != '缺月太极') { Player.MessageBox('左边框请放入要转移的缺月太极'); return }
    if (继承 == null || 继承.GetName() != '缺月太极') { Player.MessageBox('右边框请放入要继承的缺月太极!'); return }
    if (转移.GetOutWay3(40) < 1) { Player.MessageBox('0星怎么转移?'); return }
    if (转移.GetName() == '缺月太极' && 继承.GetName() == '缺月太极') {
        继承.SetOutWay3(40, 转移.GetOutWay3(40))
        if (继承.GetOutWay3(40) < 10) {
            继承.SetOutWay2(12, 继承.GetOutWay3(40) * 2)
        } else {
            继承.SetOutWay2(12, 继承.GetOutWay3(40) * 2 + 30)
        }
        a = 继承.DisplayName.split(' + ')[0]
        继承.Rename(a + ` + ${继承.GetOutWay3(40)}星`)
        继承.SetBind(true)
        继承.SetNeverDrop(true)
        继承.State.SetNoDrop(true)
        转移.SetOutWay3(40, 0)
        转移.SetOutWay1(12, 710)
        转移.SetOutWay2(12, 0)
        a = 转移.DisplayName.split(' + ')[0]
        转移.Rename(a)
        Player.UpdateItem(继承)
        Player.UpdateItem(转移)
        Player.MessageBox(`转移完毕请查看!`)
    }
    Main(Npc, Player, Args)
}