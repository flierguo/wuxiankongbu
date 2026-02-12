export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // Player.V.荣誉值=1000
    const S = `\\\\\\\\
    {S=碎骨;C=243;X=58;Y=70} {S=失落符文;C=243;X=148;Y=70} {S=烈焰印记;C=243;X=258;Y=70}  {S=妖族内丹;C=243;X=365;Y=70}\\
     {S=恶魔妖骨;C=243;X=50;Y=160} {S=鬼怪符文;C=243;X=148;Y=160} {S=圣地龙骨;C=243;X=258;Y=160} {S=神域水晶;C=243;X=364;Y=160}\\
    <{S=兑换;X=55;Y=140}/@兑换(1,碎骨,10,3)> <{S=兑换;X=158;Y=140}/@兑换(2,失落符文,10,3)> <{S=兑换;X=266;Y=140}/@兑换(3,烈焰印记,10,3)>  <{S=兑换;X=377;Y=140}/@兑换(4,妖族内丹,10,3)>\\
     <{S=兑换;X=55;Y=230}/@兑换(5,恶魔妖骨,10,3)> <{S=兑换;X=158;Y=230}/@兑换(6,鬼怪符文,10,3)> <{S=兑换;X=265;Y=230}/@兑换(6,圣地龙骨,10,3)> <{S=兑换;X=377;Y=230}/@兑换(6,神域水晶,10,3)>\\
     {S=兑换比例:10:3;C=191;X=180;Y=28}
    `
    let Msg = S
    let Item: TUserItem
    for (let i = 0; i <= 7; i++) {
        switch (i) {
            case 0:
                Item = GameLib.CreateUserItemByName('碎骨')
                Msg += format('<{U=%s;x=50;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 1:
                Item = GameLib.CreateUserItemByName('失落符文')
                Msg += format('<{U=%s;x=152;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 2:
                Item = GameLib.CreateUserItemByName('烈焰印记')
                Msg += format('<{U=%s;x=260;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 3:
                Item = GameLib.CreateUserItemByName('妖族内丹')
                Msg += format('<{U=%s;x=370;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 4:
                Item = GameLib.CreateUserItemByName('恶魔妖骨')
                Msg += format('<{U=%s;x=50;y=180}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 5:
                Item = GameLib.CreateUserItemByName('鬼怪符文')
                Msg += format('<{U=%s;x=152;y=180}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 6:
                Item = GameLib.CreateUserItemByName('圣地龙骨')
                Msg += format('<{U=%s;x=262;y=180}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 7:
                Item = GameLib.CreateUserItemByName('神域水晶')
                Msg += format('<{U=%s;x=372;y=180}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
        }
        Npc.SayEx(Player, 'NPC中窗口', Msg)
    }
}

export function 兑换(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 兑换材料 = Args.Str[1]
    let 需要数量 = Args.Int[2]
    let 荣誉值 = Args.Int[3]
    if (Player.GetItemCount(`${兑换材料}`) < 需要数量) { Player.MessageBox(`${兑换材料}不足${需要数量}个,兑换失败!`); return }
    Npc.Take(Player, 兑换材料, 需要数量)
    Player.V.荣誉值 = Player.V.荣誉值 + 荣誉值
    Player.SendMessage(`成功兑换${荣誉值}点荣誉值!`)

}

// {S=兑换比例:10:3;C=150;X=40;Y=130} {S=兑换比例:10:3;C=150;X=160;Y=130} {S=兑换比例:10:3;C=150;X=300;Y=130}\\
// {S=兑换比例:10:3;C=150;X=40;Y=250} {S=兑换比例:10:3;C=150;X=160;Y=250} {S=兑换比例:10:3;C=150;X=300;Y=250}\\