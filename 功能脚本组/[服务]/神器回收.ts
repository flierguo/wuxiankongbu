export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    GameLib.V.每日回收神器次数 ??= {}
    GameLib.V.每日回收神器次数[Player.GetName()] ??= 0
    const S = `\\\\\\\\\\\\
                              今日可回收次数${GameLib.V.每日回收神器次数[Player.GetName()]}/10\\\\
                          {S=神器★★★★★劣质:100元宝;C=255}\\
                          {S=神器★★★★★超强:1元充值;C=250}\\
                          {S=神器★★★★★杰出:2元充值;C=154}\\
                          {S=神器★★★★★传说:3元充值;C=254}\\
                          {S=神器★★★★★神话:5元充值;C=251}\\
                          {S=神器★★★★★传承:10元充值;C=253}\\
                          {S=神器★★★★★史诗:20元充值;C=241}\\
                          {S=神器★★★★★绝世:50元充值;C=243}\\
                          {S=神器★★★★★造化:100元充值;C=249}\\
                          {S=神器★★★★★混沌:500元充值;C=128}\\\\\\\\\\\\
                                  <{S=回收神器;X=205;Y=365}/@回收神器>

    `

    Npc.SayEx(Player, 'Npc长窗口底框', S)

}

export function 回收神器(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 装备 = Player.GetCustomItem(0)
    let 数量 = 0
    if (GameLib.V.每日回收神器次数[Player.GetName()] >= 10) { Player.MessageBox('进入回收神器装备已经达到上限,请明日再来吧!'); return }
    if (装备 == null || !装备.DisplayName.includes('神器')) { Player.MessageBox('请放入带有神器字样的装备装备!'); return }
    GameLib.V.每日回收神器次数[Player.GetName()]=GameLib.V.每日回收神器次数[Player.GetName()]+1
    if (装备.DisplayName.includes('劣质')) {
        Player.MessageBox(`你成功回收了一件${装备.DisplayName},获得了100元宝!`)
        Player.DeleteItem(装备,1)
        Player.SetGameGold(Player.GetGameGold() + 100)
        Player.GoldChanged()

    } else {
        switch (true) {
            case 装备.DisplayName.includes('超强'): 数量 = 1; break
            case 装备.DisplayName.includes('杰出'): 数量 = 2; break
            case 装备.DisplayName.includes('传说'): 数量 = 3; break
            case 装备.DisplayName.includes('神话'): 数量 = 5; break
            case 装备.DisplayName.includes('传承'): 数量 = 10; break
            case 装备.DisplayName.includes('史诗'): 数量 = 20; break
            case 装备.DisplayName.includes('绝世'): 数量 = 50; break
            case 装备.DisplayName.includes('造化'): 数量 = 100; break
            case 装备.DisplayName.includes('混沌'): 数量 = 500; break
        }
        Player.MessageBox(`你成功回收了一件${装备.DisplayName},获得了${数量}充值+${数量}礼卷!`)
        Player.DeleteItem(装备,1)
        Player.V.真实充值 = Player.V.真实充值 + 数量
        Player.SetGamePoint(Player.GetGamePoint()+数量)

    }
    Main(Npc,Player,Args)
}