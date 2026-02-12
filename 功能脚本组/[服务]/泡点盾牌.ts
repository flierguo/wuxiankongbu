export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // Player.V.荣誉值=1000
    const S = `\\\\\\\\
    {S=龙木守卫;C=243;X=46;Y=70} {S=魔钢铸盾;C=243;X=146;Y=70} {S=折戟壁垒;C=243;X=246;Y=70} {S=骑士徽记;C=243;X=346;Y=70}\\
    {S=统筹之墙;C=243;X=46;Y=190} {S=骨火之灾;C=243;X=146;Y=190} {S=沙巴克征服者;C=243;X=246;Y=190} {S=上古爽龙壁垒;C=243;X=346;Y=190}\\
    {S=所需泰坦结晶;C=150;X=40;Y=130} {S=所需泰坦结晶;C=150;X=140;Y=130} {S=所需泰坦结晶;C=150;X=240;Y=130} {S=所需泰坦结晶;C=150;X=340;Y=130}\\
    {S=所需泰坦结晶;C=150;X=40;Y=250} {S=所需泰坦结晶;C=150;X=140;Y=250} {S=所需泰坦结晶;C=150;X=240;Y=250} {S=所需泰坦结晶;C=150;X=340;Y=250}\\
    {S=100;C=241;X=60;Y=145} {S=200;C=241;X=160;Y=145} {S=300;C=241;X=260;Y=145} {S=400;C=241;X=360;Y=145}\\
    {S=500;C=241;X=60;Y=265} {S=600;C=241;X=160;Y=265} {S=700;C=241;X=258;Y=265} {S=800;C=241;X=358;Y=265}\\
    <{S=升级;X=55;Y=160}/@升级盾牌(1,100,新手盾牌,龙木守卫)> <{S=升级;X=158;Y=160}/@升级盾牌(2,200,龙木守卫,魔钢铸盾)> <{S=升级;X=258;Y=160}/@升级盾牌(3,300,魔钢铸盾,折戟壁垒)> <{S=升级;X=358;Y=160}/@升级盾牌(4,400,折戟壁垒,骑士徽记)>\\
    <{S=升级;X=58;Y=280}/@升级盾牌(5,500,骑士徽记,统筹之墙)> <{S=升级;X=158;Y=280}/@升级盾牌(6,600,统筹之墙,骨火之灾)> <{S=升级;X=258;Y=280}/@升级盾牌(7,700,骨火之灾,沙巴克征服者)> <{S=升级;X=358;Y=280}/@升级盾牌(8,800,沙巴克征服者,上古爽龙壁垒)>\\
    {S=升级盾牌需要消耗上一级盾牌和对应数量的泰坦结晶;X=120;Y=290}  {S=当前泰坦结晶:${Player.GetItemCount('泰坦结晶')};C=251;X=50;Y=27} {S=护体神盾,每提高一级伤害减免提高10%;C=21;X=160;Y=27}
    `
    let Msg = S
    let Item: TUserItem
    for (let i = 0; i <= 7; i++) {
        switch (i) {
            case 0:
                Item = GameLib.CreateUserItemByName('龙木守卫')
                Msg += format('<{U=%s;x=50;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 1:
                Item = GameLib.CreateUserItemByName('魔钢铸盾')
                Msg += format('<{U=%s;x=150;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 2:
                Item = GameLib.CreateUserItemByName('折戟壁垒')
                Msg += format('<{U=%s;x=250;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 3:
                Item = GameLib.CreateUserItemByName('骑士徽记')
                Msg += format('<{U=%s;x=350;y=90}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 4:
                Item = GameLib.CreateUserItemByName('统筹之墙')
                Msg += format('<{U=%s;x=50;y=210}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 5:
                Item = GameLib.CreateUserItemByName('骨火之灾')
                Msg += format('<{U=%s;x=150;y=210}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 6:
                Item = GameLib.CreateUserItemByName('沙巴克征服者')
                Msg += format('<{U=%s;x=250;y=210}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
            case 7:
                Item = GameLib.CreateUserItemByName('上古爽龙壁垒')
                Msg += format('<{U=%s;x=350;y=210}>\\', [Item.MakeString()])
                GameLib.DestoryUserItem(Item, true)
                break
        }
    }
    Npc.SayEx(Player, 'NPC中窗口', Msg)
}

export function 升级盾牌(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let Item: TUserItem
    let 等级 = Args.Int[0]
    let 碎片数量 = Args.Int[1]
    let 上一级盾牌 = Args.Str[2]
    let 下一级盾牌 = Args.Str[3]
    
    // 检查玩家是否有足够的泰坦结晶
    if (Player.GetItemCount('泰坦结晶') < 碎片数量) {
        Player.MessageBox(`泰坦结晶不足${碎片数量}个，无法升级到${下一级盾牌}`)
        return
    }
    
    // 检查玩家是否有上一级盾牌
    if (Player.GetItemCount(上一级盾牌) < 1) {
        Player.MessageBox(`你背包内没有${上一级盾牌}，无法升级到${下一级盾牌}`)
        return
    }
    
    // 扣除材料
    Npc.Take(Player, '泰坦结晶', 碎片数量)
    Npc.Take(Player, 上一级盾牌)
    
    // 给予新盾牌
    Item = Player.GiveItem(下一级盾牌)
    if (Item) {
        Item.SetBind(true)
        Item.SetNeverDrop(true)
        Item.State.SetNoDrop(true)
        Player.UpdateItem(Item)
    }
    
    Player.MessageBox(`你成功将${上一级盾牌}升级为${下一级盾牌}!`)
    Main(Npc, Player, Args)
}