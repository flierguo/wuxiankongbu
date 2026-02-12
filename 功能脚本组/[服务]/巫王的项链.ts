export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\\\\\
                                     {S=巫王的项链;C=250}\\\\\\
                              {S=巫王的项链可以进行升级;C=241}\\
                    {S=最高可升至10级,升级需要1000点券*巫王的项链等级;C=241}\\
                    {S=每强化1级增加获取本职业装备几率10%,满级额外增加400%;C=254}\\
                    {S=每强化1级增加5%暴击几率,满级暴击几率+100%,暴击伤害+500%;C=254}\\
                    {S=升级成功率为100%,转移不收取任何费用;C=250}\\\\\\
                      <巫王的项链强化/@巫王的项链强化>           <巫王的项链转移/@巫王的项链转移>
    `
    Npc.SayEx(Player, 'Npc中窗口带2框返回', S)

}

export function 巫王的项链强化(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 巫王的项链 = Player.GetCustomItem(0)
    let 点券数量 = 0
    let a = ''
    if (巫王的项链 == null || (巫王的项链.GetName() != '巫王的项链')) { Player.MessageBox('请将巫王的项链放到左边框'); return }
    if (巫王的项链.GetOutWay3(40) >= 10) { Player.MessageBox(`${巫王的项链.GetName()}已经达到10星!`); return }
    点券数量 = 巫王的项链.GetOutWay3(40) * 1000 + 1000
    if (Player.GetGamePoint() < 点券数量) { Player.MessageBox(`点券数量不足${点券数量},无法升级!`); return }
    Player.SetGamePoint(Player.GetGamePoint() - 点券数量)
    Player.GoldChanged()
    巫王的项链.SetOutWay3(40, 巫王的项链.GetOutWay3(40) + 1)
    巫王的项链.Rename(巫王的项链.GetName() + ` + ${巫王的项链.GetOutWay3(40)}星`)
    if (巫王的项链.GetOutWay3(40) < 10) {
        巫王的项链.SetOutWay2(1, 巫王的项链.GetNeedLevel() / 20 + 巫王的项链.GetOutWay3(40) * 10)
        巫王的项链.SetOutWay2(2, Math.max(1, 巫王的项链.GetNeedLevel() / 200) + 巫王的项链.GetOutWay3(40) * 10)
    } else {
        巫王的项链.SetOutWay2(1, 巫王的项链.GetNeedLevel() / 20 + 巫王的项链.GetOutWay3(40) * 10 + 400)
        巫王的项链.SetOutWay2(2, 100)
    }
    巫王的项链.SetBind(true)
    巫王的项链.SetNeverDrop(true)
    巫王的项链.State.SetNoDrop(true)
    Player.UpdateItem(巫王的项链)
    Player.MessageBox(`升星完毕请查看!`)
    Main(Npc, Player, Args)
}

export function 巫王的项链转移(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 转移 = Player.GetCustomItem(0)
    let 继承 = Player.GetCustomItem(1)
    if (转移 == null || 转移.GetName() != '巫王的项链') { Player.MessageBox('左边框请放入要转移的巫王的项链'); return }
    if (继承 == null || 继承.GetName() != '巫王的项链') { Player.MessageBox('右边框请放入要继承的巫王的项链!'); return }
    if (转移.GetOutWay3(40) < 1) { Player.MessageBox('0星怎么转移?'); return }
    if (转移.GetName() == '巫王的项链' && 继承.GetName() == '巫王的项链') {
        继承.SetOutWay3(40, 转移.GetOutWay3(40))
        if (继承.GetOutWay3(40) < 10) {
            继承.SetOutWay2(1, 继承.GetNeedLevel() / 20 + 继承.GetOutWay3(40) * 10)
            继承.SetOutWay2(2, 继承.GetNeedLevel()/200 + 继承.GetOutWay3(40) * 10)
        } else {
            继承.SetOutWay2(1, 继承.GetNeedLevel() / 20 + 继承.GetOutWay3(40) * 10 + 400)
            继承.SetOutWay2(2, 100)
        }
        继承.Rename(继承.GetName() + ` + ${继承.GetOutWay3(40)}星`)
        继承.SetBind(true)
        继承.SetNeverDrop(true)
        继承.State.SetNoDrop(true)
        转移.SetOutWay3(40, 0)
        转移.SetOutWay2(1, 转移.GetNeedLevel() / 20)
        转移.SetOutWay2(2, Math.max(1, 转移.GetNeedLevel() / 100))
        转移.Rename(转移.GetName() + ` + ${转移.GetOutWay3(40)}星`)
        Player.UpdateItem(继承)
        Player.UpdateItem(转移)
        Player.MessageBox(`转移完毕请查看!`)
    }
    Main(Npc, Player, Args)
}