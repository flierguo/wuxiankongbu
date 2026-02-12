export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\
                {S=开区第三天晚上20点准时攻沙巴!;C=250}\\\\\\
                        <{S=直飞沙大门前;HINT=传送需要100元宝}/@飞(3,642,288)>\\\\
                        <{S=直飞沙大门右;HINT=传送需要100元宝}/@飞(3,644,276)>\\\\
                        <{S=直飞沙大门左;HINT=传送需要100元宝}/@飞(3,628,290)>\\\\
    `
    Npc.SayEx(Player, 'Npc小窗口', S)

}
export function 飞(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 地图 = Args.Str[0]
    let 坐标X=Args.Int[1]
    let 坐标Y=Args.Int[2]
    if (Player.GetGameGold()<100){Player.MessageBox('元宝不足100,老老实实跑过去把!');return}
    Player.SetGameGold(Player.GetGameGold()-100)
    Player.GoldChanged()
    Player.MapMove(地图,坐标X,坐标Y)
}