export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
    {S=荣誉斗笠;C=243;X=46;Y=70} {S=列兵斗笠;C=243;X=146;Y=70} {S=军士斗笠;C=243;X=246;Y=70} {S=士官斗笠;C=243;X=346;Y=70}\\
    {S=骑士斗笠;C=243;X=46;Y=190} {S=校尉斗笠;C=243;X=146;Y=190} {S=将军斗笠;C=243;X=246;Y=190} {S=元帅斗笠;C=243;X=346;Y=190}\\
    {S=所需礼卷;C=150;X=40;Y=130} {S=所需礼卷;C=150;X=140;Y=130} {S=所需礼卷;C=150;X=240;Y=130} {S=所需礼卷;C=150;X=340;Y=130}\\
    {S=所需礼卷;C=150;X=40;Y=250} {S=所需礼卷;C=150;X=140;Y=250} {S=所需礼卷;C=150;X=240;Y=250} {S=所需礼卷;C=150;X=340;Y=250}\\
    {S=200;C=241;X=60;Y=145} {S=400;C=241;X=160;Y=145} {S=600;C=241;X=260;Y=145} {S=800;C=241;X=360;Y=145}\\
    {S=1000;C=241;X=60;Y=265} {S=1200;C=241;X=160;Y=265} {S=1400;C=241;X=258;Y=265} {S=1600;C=241;X=358;Y=265}\\
    <{S=购买;X=55;Y=160}/@购买斗笠(1,200,荣誉斗笠)> <{S=购买;X=158;Y=160}/@购买斗笠(2,400,列兵斗笠,荣誉斗笠)> <{S=购买;X=258;Y=160}/@购买斗笠(3,600,军士斗笠,列兵斗笠)> <{S=购买;X=358;Y=160}/@购买斗笠(4,800,士官斗笠,军士斗笠)>\\
    <{S=购买;X=58;Y=280}/@购买斗笠(5,1000,骑士斗笠,士官斗笠)> <{S=购买;X=158;Y=280}/@购买斗笠(6,1200,校尉斗笠,骑士斗笠)> <{S=购买;X=258;Y=280}/@购买斗笠(7,1400,将军斗笠,校尉斗笠)> <{S=购买;X=358;Y=280}/@购买斗笠(8,1600,元帅斗笠,将军斗笠)>\\
    {S=领取斗笠需要扣除上一级斗笠和对应的礼卷;X=120;Y=290} {S=当前礼卷:${Player.GetGamePoint()};C=251;X=50;Y=27}  {S=获取途径;C=243;X=300;Y=27;Hint=途径1:充值获得#92途径2:活动获取#92途径3:特殊奖励}
    `
    let Msg = S
    let Item: TUserItem
    for (let i = 0; i <= 7; i++) {
        switch (i) {
            case 0:
                Item = GameLib.CreateUserItemByName('荣誉斗笠')
                Msg += format('<{U=%s;x=50;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 1:
                Item = GameLib.CreateUserItemByName('列兵斗笠')
                Msg += format('<{U=%s;x=150;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 2:
                Item = GameLib.CreateUserItemByName('军士斗笠')
                Msg += format('<{U=%s;x=250;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 3:
                Item = GameLib.CreateUserItemByName('士官斗笠')
                Msg += format('<{U=%s;x=350;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 4:
                Item = GameLib.CreateUserItemByName('骑士斗笠')
                Msg += format('<{U=%s;x=50;y=210}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 5:
                Item = GameLib.CreateUserItemByName('校尉斗笠')
                Msg += format('<{U=%s;x=150;y=210}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 6:
                Item = GameLib.CreateUserItemByName('将军斗笠')
                Msg += format('<{U=%s;x=250;y=210}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 7:
                Item = GameLib.CreateUserItemByName('元帅斗笠')
                Msg += format('<{U=%s;x=350;y=210}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
        }
    }
    Npc.SayEx(Player, 'NPC中窗口', Msg)
}

export function Main1(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
    {S=荣誉血石;C=243;X=46;Y=70} {S=列兵血石;C=243;X=146;Y=70} {S=军士血石;C=243;X=246;Y=70} {S=士官血石;C=243;X=346;Y=70}\\
    {S=骑士血石;C=243;X=46;Y=190} {S=校尉血石;C=243;X=146;Y=190} {S=将军血石;C=243;X=246;Y=190} {S=元帅血石;C=243;X=346;Y=190}\\
    {S=所需血石精华;C=150;X=40;Y=130} {S=所需血石精华;C=150;X=140;Y=130} {S=所需血石精华;C=150;X=240;Y=130} {S=所需血石精华;C=150;X=340;Y=130}\\
    {S=所需血石精华;C=150;X=40;Y=250} {S=所需血石精华;C=150;X=140;Y=250} {S=所需血石精华;C=150;X=240;Y=250} {S=所需血石精华;C=150;X=340;Y=250}\\
    {S=100;C=241;X=60;Y=145} {S=200;C=241;X=160;Y=145} {S=300;C=241;X=260;Y=145} {S=400;C=241;X=360;Y=145}\\
    {S=500;C=241;X=60;Y=265} {S=600;C=241;X=160;Y=265} {S=700;C=241;X=258;Y=265} {S=800;C=241;X=358;Y=265}\\
    <{S=购买;X=55;Y=160}/@购买血石(1,100,荣誉血石)> <{S=购买;X=158;Y=160}/@购买血石(2,200,列兵血石,荣誉血石)> <{S=购买;X=258;Y=160}/@购买血石(3,300,军士血石,列兵血石)> <{S=购买;X=358;Y=160}/@购买血石(4,400,士官血石,军士血石)>\\
    <{S=购买;X=58;Y=280}/@购买血石(5,500,骑士血石,士官血石)> <{S=购买;X=158;Y=280}/@购买血石(6,600,校尉血石,骑士血石)> <{S=购买;X=258;Y=280}/@购买血石(7,700,将军血石,校尉血石)> <{S=购买;X=358;Y=280}/@购买血石(8,800,元帅血石,将军血石)>\\
    {S=领取血石需要扣除上一级血石和对应的血石精华;X=120;Y=290} 
    `
    // <{S=查看斗笠;X=420;Y=290}/@Main>
    let Msg = S
    let Item: TUserItem
    for (let i = 0; i <= 7; i++) {
        switch (i) {
            case 0:
                Item = GameLib.CreateUserItemByName('荣誉血石')
                Msg += format('<{U=%s;x=50;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 1:
                Item = GameLib.CreateUserItemByName('列兵血石')
                Msg += format('<{U=%s;x=150;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 2:
                Item = GameLib.CreateUserItemByName('军士血石')
                Msg += format('<{U=%s;x=250;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 3:
                Item = GameLib.CreateUserItemByName('士官血石')
                Msg += format('<{U=%s;x=350;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 4:
                Item = GameLib.CreateUserItemByName('骑士血石')
                Msg += format('<{U=%s;x=50;y=210}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 5:
                Item = GameLib.CreateUserItemByName('校尉血石')
                Msg += format('<{U=%s;x=150;y=210}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 6:
                Item = GameLib.CreateUserItemByName('将军血石')
                Msg += format('<{U=%s;x=250;y=210}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 7:
                Item = GameLib.CreateUserItemByName('元帅血石')
                Msg += format('<{U=%s;x=350;y=210}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
        }
    }
    Npc.SayEx(Player, 'NPC中窗口', Msg)
}

export function 购买斗笠(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let Item: TUserItem
    let 礼卷数量 = Args.Int[1]
    let 合成装备 = Args.Str[2]
    let 需要斗笠 = Args.Str[3]
    if (Args.Int[0] == 1) {
        if (Player.GetGamePoint() < 200) { Player.MessageBox(`礼卷不足200,购买荣誉斗笠失败!`); return }
        Player.SetGamePoint(Player.GetGamePoint() - 200)
        Item = Player.GiveItem('荣誉斗笠')
        if (Item) {
            Item.SetBind(true)
            Item.SetNeverDrop(true)
            Item.State.SetNoDrop(true)
            Player.UpdateItem(Item)
        }
        Player.MessageBox(`你成功购买了一个荣誉斗笠`)
        Main(Npc,Player,Args)
        return
    }

    if (Player.GetGamePoint() < 礼卷数量) { Player.MessageBox(`礼卷不足${礼卷数量},购买${合成装备}失败!`); return }
    if (Player.GetItemCount(需要斗笠) < 1) { Player.MessageBox(`你背包内没有${需要斗笠}无法购买${合成装备}`); return }
    Player.SetGamePoint(Player.GetGamePoint() - 礼卷数量)
    Npc.Take(Player, 需要斗笠)
    Item = Player.GiveItem(合成装备)
    if (Item) {
        Item.SetBind(true)
        Item.SetNeverDrop(true)
        Item.State.SetNoDrop(true)
        Player.UpdateItem(Item)
    }
    Player.MessageBox(`你成功购买了一个${合成装备}`)
    Main(Npc,Player,Args)
}
export function 购买血石(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let Item: TUserItem
    let 血石精华数量 = Args.Int[1]
    let 合成装备 = Args.Str[2]
    let 需要血石 = Args.Str[3]
    if (Args.Int[0] == 1) {
        if (Player.GetItemCount('血石精华') < 100) { Player.MessageBox(`血石精华不足100,购买荣誉血石失败!`); return }
        Npc.Take(Player,'血石精华',100)
        Item = Player.GiveItem('荣誉血石')
        if (Item) {
            Item.SetBind(true)
            Item.SetNeverDrop(true)
            Item.State.SetNoDrop(true)
            Player.UpdateItem(Item)
        }
        Player.MessageBox(`你成功购买了一个荣誉血石`)
        Main1(Npc,Player,Args)
        return
    }

    if (Player.GetItemCount('血石精华') < 血石精华数量) { Player.MessageBox(`血石精华不足${血石精华数量},购买${合成装备}失败!`); return }
    if (Player.GetItemCount(需要血石) < 1) { Player.MessageBox(`你背包内没有${需要血石}无法购买${合成装备}`); return }
    Npc.Take(Player,'血石精华',血石精华数量)
    Npc.Take(Player, 需要血石)
    Item = Player.GiveItem(合成装备)
    if (Item) {
        Item.SetBind(true)
        Item.SetNeverDrop(true)
        Item.State.SetNoDrop(true)
        Player.UpdateItem(Item)
    }
    Player.MessageBox(`你成功购买了一个${合成装备}`)
    Main1(Npc,Player,Args)
}