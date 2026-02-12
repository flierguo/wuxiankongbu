export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\\\\\
                                     {S=艾维双戒;C=250}\\\\\\
                    {S=获得艾维斯戒指和艾维利戒指可以进行升级;C=241}\\
                    {S=最高可升至10级,升级需要500点券*艾维双戒等级}\\
                    {S=艾维斯戒指升级介绍;C=254;Hint=戒指等级越高击杀人形怪获取的元宝越多#92击杀人形怪获取元宝数量=装备等级/10*装备升星#92升到10级击杀人形怪获取元宝几率变为100%}\\
                    {S=艾维利戒指升级介绍;C=154;Hint=戒指等级越高回收元宝数量越多#92回收元宝数量=(装备等级/20)+(装备升星*2)%#92升到10级回收元宝数量额外增加50%,并且自动回收的数量额外提高50%}\\
                    {S=升级成功率为100%,转移不收取任何费用}\\\\\\
                      <艾维双戒强化/@艾维双戒强化>           <艾维双戒转移/@艾维双戒转移>
    `
    Npc.SayEx(Player, 'Npc中窗口带2框返回', S)

}

export function 艾维双戒强化(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 艾维双戒 = Player.GetCustomItem(0)
    let 点券数量 = 0
    if (艾维双戒 == null || (艾维双戒.GetName() != '艾维斯之戒' && 艾维双戒.GetName() != '艾维利之戒')) { Player.MessageBox('请将艾维双戒放到左边框'); return }
    if (艾维双戒.GetOutWay3(40) >= 10) { Player.MessageBox(`${艾维双戒.GetName()}已经达到10星!`); return }
    点券数量 = 艾维双戒.GetOutWay3(40) * 500 + 500
    if (Player.GetGamePoint() < 点券数量) { Player.MessageBox(`点券数量不足${点券数量},无法升级!`); return }
    Player.SetGamePoint(Player.GetGamePoint() - 点券数量)
    Player.GoldChanged()

    if (艾维双戒.GetName() == '艾维斯之戒') {
        艾维双戒.SetOutWay3(40, 艾维双戒.GetOutWay3(40) + 1)
        艾维双戒.Rename(艾维双戒.GetName() + ` + ${艾维双戒.GetOutWay3(40)}星`)
        if (艾维双戒.GetOutWay3(40) < 10) {
            艾维双戒.SetOutWay2(1, 艾维双戒.GetNeedLevel() / 10 + 艾维双戒.GetNeedLevel() / 10 * 艾维双戒.GetOutWay3(40))
        } else {
            艾维双戒.SetOutWay1(1, 701)
            艾维双戒.SetOutWay2(1, 艾维双戒.GetNeedLevel() / 10 + 艾维双戒.GetNeedLevel() / 10 * 艾维双戒.GetOutWay3(40))
        }

    } else if (艾维双戒.GetName() == '艾维利之戒') {
        艾维双戒.SetOutWay3(40, 艾维双戒.GetOutWay3(40) + 1)
        艾维双戒.Rename(艾维双戒.GetName() + ` + ${艾维双戒.GetOutWay3(40)}星`)
        if (艾维双戒.GetOutWay3(40) < 10) {
            艾维双戒.SetOutWay2(1, 艾维双戒.GetNeedLevel() / 20 + 艾维双戒.GetOutWay3(40) * 2)
        } else {
            艾维双戒.SetOutWay2(1, 艾维双戒.GetNeedLevel() / 20 + 艾维双戒.GetOutWay3(40) * 2 + 50)
        }
    }
    艾维双戒.SetBind(true)
    艾维双戒.SetNeverDrop(true)
    艾维双戒.State.SetNoDrop(true)
    Player.UpdateItem(艾维双戒)
    Player.MessageBox(`升星完毕请查看!`)
    Main(Npc, Player, Args)
}

export function 艾维双戒转移(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 转移 = Player.GetCustomItem(0)
    let 继承 = Player.GetCustomItem(1)
    if (转移 == null || (转移.GetName() != '艾维斯之戒' && 转移.GetName() != '艾维利之戒')) { Player.MessageBox('左边框请放入要转移的艾维双戒'); return }
    if (继承 == null || (继承.GetName() != '艾维斯之戒' && 继承.GetName() != '艾维利之戒')) { Player.MessageBox('右边框请放入要继承的艾维双戒!'); return }
    if (转移.GetName() == '艾维斯之戒' && 继承.GetName() != '艾维斯之戒') { Player.MessageBox('转移和继承的窗口请放入相同的艾维戒指'); return }
    if (转移.GetName() == '艾维利之戒' && 继承.GetName() != '艾维利之戒') { Player.MessageBox('转移和继承的窗口请放入相同的艾维戒指'); return }
    if (转移.GetOutWay3(40) < 1) { Player.MessageBox('0星怎么转移?'); return }
    if (转移.GetName() == '艾维斯之戒' && 继承.GetName() == '艾维斯之戒') {
        继承.SetOutWay3(40, 转移.GetOutWay3(40))
        if (继承.GetOutWay3(40) < 10) {
            继承.SetOutWay2(1, 继承.GetNeedLevel() / 10 + 继承.GetNeedLevel() / 10 * 继承.GetOutWay3(40))
        } else {
            继承.SetOutWay1(1, 701)
            继承.SetOutWay2(1, 继承.GetNeedLevel() / 10 + 继承.GetNeedLevel() / 10 * 继承.GetOutWay3(40))
        }
        继承.Rename(继承.GetName() + ` + ${继承.GetOutWay3(40)}星`)
        继承.SetBind(true)
        继承.SetNeverDrop(true)
        继承.State.SetNoDrop(true)
        Player.UpdateItem(继承)
        转移.SetOutWay3(40, 0)
        转移.SetOutWay1(1, 700)
        转移.SetOutWay2(1, 转移.GetNeedLevel() / 10)
        转移.Rename(转移.GetName())
        Player.UpdateItem(转移)
        Player.MessageBox(`转移完毕请查看!`)
    } else if (转移.GetName() == '艾维利之戒' && 继承.GetName() == '艾维利之戒') {
        继承.SetOutWay3(40, 转移.GetOutWay3(40))
        if (继承.GetOutWay3(40) < 10) {
            继承.SetOutWay2(1, 继承.GetNeedLevel() / 20 + 继承.GetOutWay3(40) * 2)
        } else {
            继承.SetOutWay2(1, 继承.GetNeedLevel() / 20 + 继承.GetOutWay3(40) * 2 + 50)
        }
        继承.Rename(继承.GetName() + ` + ${继承.GetOutWay3(40)}星`)
        继承.SetBind(true)
        继承.SetNeverDrop(true)
        继承.State.SetNoDrop(true)
        Player.UpdateItem(继承)
        转移.SetOutWay3(40, 0)
        转移.SetOutWay2(1, 转移.GetNeedLevel() / 20)
        转移.Rename(转移.GetName())
        Player.MessageBox(`转移完毕请查看!`)
        Player.UpdateItem(转移)
    }
    Main(Npc, Player, Args)
}