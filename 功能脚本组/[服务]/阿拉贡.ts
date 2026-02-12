export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\\\\\
                                     {S=阿拉贡双戒;C=250}\\\\\\
                    {S=获得阿拉贡神戒和阿拉贡魔戒可以进行升级;C=241}\\
                    {S=最高可升至10级,升级需要1000点券*阿拉贡双戒等级}\\
                    {S=阿拉贡神戒升级介绍;C=254;Hint=戒指等级越高爆率加成越多#92每升1级增加10%爆率#92满级额外增加爆率500%}\\
                    {S=阿拉贡魔戒升级介绍;C=154;Hint=戒指等级越高鞭尸几率越高#92此戒指为额外进行鞭尸几率#92每升1级鞭尸几率增加10%#92满级额外鞭尸5次}\\
                    {S=升级成功率为100%,转移不收取任何费用}\\\\\\
                      <阿拉贡双戒强化/@阿拉贡双戒强化>           <阿拉贡双戒转移/@阿拉贡双戒转移>
    `
    Npc.SayEx(Player, 'Npc中窗口带2框返回', S)

}

export function 阿拉贡双戒强化(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 阿拉贡双戒 = Player.GetCustomItem(0)
    let 点券数量 = 0
    if (阿拉贡双戒 == null || (阿拉贡双戒.GetName() != '阿拉贡神戒' && 阿拉贡双戒.GetName() != '阿拉贡魔戒')) { Player.MessageBox('请将阿拉贡双戒放到左边框'); return }
    if (阿拉贡双戒.GetOutWay3(40) >= 10) { Player.MessageBox(`${阿拉贡双戒.GetName()}已经达到10星!`); return }
    点券数量 = 阿拉贡双戒.GetOutWay3(40) * 1000 + 1000
    if (Player.GetGamePoint() < 点券数量) { Player.MessageBox(`点券数量不足${点券数量},无法升级!`); return }
    Player.SetGamePoint(Player.GetGamePoint() - 点券数量)
    Player.GoldChanged()

    if (阿拉贡双戒.GetName() == '阿拉贡神戒') {
        阿拉贡双戒.SetOutWay3(40, 阿拉贡双戒.GetOutWay3(40) + 1)
        阿拉贡双戒.Rename(阿拉贡双戒.GetName() + ` + ${阿拉贡双戒.GetOutWay3(40)}星`)
        if (阿拉贡双戒.GetOutWay3(40) < 10) {
            阿拉贡双戒.SetOutWay2(1, 阿拉贡双戒.GetNeedLevel() / 50 + 阿拉贡双戒.GetNeedLevel() / 50 * 阿拉贡双戒.GetOutWay3(40))
        } else {
            阿拉贡双戒.SetOutWay2(1, 阿拉贡双戒.GetNeedLevel() / 50 + 阿拉贡双戒.GetNeedLevel() / 50 * 阿拉贡双戒.GetOutWay3(40)+500)
        }

    } else if (阿拉贡双戒.GetName() == '阿拉贡魔戒') {
        阿拉贡双戒.SetOutWay3(40, 阿拉贡双戒.GetOutWay3(40) + 1)
        阿拉贡双戒.Rename(阿拉贡双戒.GetName() + ` + ${阿拉贡双戒.GetOutWay3(40)}星`)
        if (阿拉贡双戒.GetOutWay3(40) < 10) {
            阿拉贡双戒.SetOutWay2(1, 阿拉贡双戒.GetNeedLevel() / 100 + 阿拉贡双戒.GetOutWay3(40) * 10)
        } else {
            阿拉贡双戒.SetOutWay2(1, 100)
        }
    }
    阿拉贡双戒.SetBind(true)
    阿拉贡双戒.SetNeverDrop(true)
    阿拉贡双戒.State.SetNoDrop(true)
    Player.UpdateItem(阿拉贡双戒)
    Player.MessageBox(`升星完毕请查看!`)
    Main(Npc, Player, Args)
}

export function 阿拉贡双戒转移(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 转移 = Player.GetCustomItem(0)
    let 继承 = Player.GetCustomItem(1)
    if (转移 == null || (转移.GetName() != '阿拉贡神戒' && 转移.GetName() != '阿拉贡魔戒')) { Player.MessageBox('左边框请放入要转移的阿拉贡双戒'); return }
    if (继承 == null || (继承.GetName() != '阿拉贡神戒' && 继承.GetName() != '阿拉贡魔戒')) { Player.MessageBox('右边框请放入要继承的阿拉贡双戒!'); return }
    if (转移.GetName() == '阿拉贡神戒' && 继承.GetName() != '阿拉贡神戒') { Player.MessageBox('转移和继承的窗口请放入相同的阿拉贡戒指'); return }
    if (转移.GetName() == '阿拉贡魔戒' && 继承.GetName() != '阿拉贡魔戒') { Player.MessageBox('转移和继承的窗口请放入相同的阿拉贡戒指'); return }
    if (转移.GetOutWay3(40) < 1) { Player.MessageBox('0星怎么转移?'); return }
    if (转移.GetName() == '阿拉贡神戒' && 继承.GetName() == '阿拉贡神戒') {
        继承.SetOutWay3(40, 转移.GetOutWay3(40))
        if (继承.GetOutWay3(40) < 10) {
            继承.SetOutWay2(1, 继承.GetNeedLevel() / 50 + 继承.GetNeedLevel() / 50 * 继承.GetOutWay3(40))
        } else {
            继承.SetOutWay2(1, 继承.GetNeedLevel() / 50 + 继承.GetNeedLevel() / 50 * 继承.GetOutWay3(40)+500)
        }
        继承.Rename(继承.GetName() + ` + ${继承.GetOutWay3(40)}星`)
        继承.SetBind(true)
        继承.SetNeverDrop(true)
        继承.State.SetNoDrop(true)
        转移.SetOutWay3(40, 0)
        转移.SetOutWay2(1, 转移.GetNeedLevel() / 50)
        转移.Rename(转移.GetName())
        Player.UpdateItem(继承)
        Player.UpdateItem(转移)
        Player.MessageBox(`转移完毕请查看!`)
    } else if (转移.GetName() == '阿拉贡魔戒' && 继承.GetName() == '阿拉贡魔戒') {
        继承.SetOutWay3(40, 转移.GetOutWay3(40))
        if (继承.GetOutWay3(40) < 10) {
            继承.SetOutWay2(1, 继承.GetNeedLevel() / 100 + 继承.GetOutWay3(40) * 10)
        } else {
            继承.SetOutWay2(1, 100)
        }
        继承.Rename(继承.GetName() + ` + ${继承.GetOutWay3(40)}星`)
        继承.SetBind(true)
        继承.SetNeverDrop(true)
        继承.State.SetNoDrop(true)
        Player.UpdateItem(继承)
        转移.SetOutWay3(40, 0)
        转移.SetOutWay2(1, 转移.GetNeedLevel() / 100)
        转移.Rename(转移.GetName())
        Player.MessageBox(`转移完毕请查看!`)
        Player.UpdateItem(转移)
    }
    Main(Npc, Player, Args)
}