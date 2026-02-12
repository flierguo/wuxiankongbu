export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S=`\\\\\\\\\\
                <合成/@合成(灵石,30,超级灵石)> 灵石*30                    <合成/@合成(晶石,30,超级晶石)> 晶石*30\\\\\\\\\\
                <合成/@合成(粉水晶,8,超级粉水晶)> 粉水晶*8                    <合成/@合成(黄水晶,8,超级黄水晶)> 黄水晶*8\\\\\\\\

    `
    let Msg = S
    let Item: TUserItem
    for (let i = 0; i <= 3; i++) {
        switch (i) {
            case 0:
                Item = GameLib.CreateUserItemByName('超级灵石')
                Msg += format('<{U=%s;x=50;y=60}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 1:
                Item = GameLib.CreateUserItemByName('超级晶石')
                Msg += format('<{U=%s;x=240;y=60}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 2:
                Item = GameLib.CreateUserItemByName('超级粉水晶')
                Msg += format('<{U=%s;x=50;y=150}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 3:
                Item = GameLib.CreateUserItemByName('超级黄水晶')
                Msg += format('<{U=%s;x=240;y=150}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            }
    }
    Npc.SayEx(Player,'NPC小窗口',Msg)
}

export function 合成(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
let 材料 = Args.Str[0]
let 数量 = Args.Int[1]
let 合成后 = Args.Str[2]
if (Player.GetItemCount(材料) < 数量) {Player.MessageBox(`${材料}不足${数量}个,无法合成${合成后}！`);return}
Npc.Take(Player,材料,数量)
Npc.Give(Player,合成后,1)
Player.ReloadBag()
Player.SendMessage(`恭喜你合成了一个{S=${合成后};C=154}`,1)

}