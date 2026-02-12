export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\
                             上古禁地\\\\
            地图星级:千星\\
            地图刷新:1-5大陆所有人形BOSS\\
            刷新时间:每隔两小时刷新一次\\
            怪物后缀:地图刷新怪物全部为幻化后缀\\
            地图等级:地图太过凶险,需要240级以上玩家才能进入\\
            地图费用:100礼卷\\\\
                             <挑战BOSS/@挑战BOSS>
    `
    Npc.SayEx(Player, 'Npc小窗口', S)

}
export function 挑战BOSS(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.GetLevel()<240){Player.MessageBox('你的等级不足240级,进去就是送死!');return}
    if (Player.GetGamePoint()<100){Player.MessageBox('你的礼卷不足100,无法进入!');return}
    Player.SetGamePoint(Player.GetGamePoint()-100)
    Player.GoldChanged()
    Player.RandomMove('上古禁地')
}

export function 圣域试炼(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\
                             上古禁地\\\\
            地图星级:十万星\\
            地图刷新:6-8大陆所有人形BOSS\\
            刷新时间:每隔两小时刷新一次\\
            怪物后缀:地图刷新怪物全部为幻化后缀\\
            地图等级:地图太过凶险,需要400级以上玩家才能进入\\
            地图费用:1000礼卷\\\\
                             <挑战BOSS/@开始挑战BOSS>
    `
    Npc.SayEx(Player, 'Npc小窗口', S)

}
export function 开始挑战BOSS(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.GetLevel()<400){Player.MessageBox('你的等级不足400级,进去就是送死!');return}
    if (Player.GetGamePoint()<1000){Player.MessageBox('你的礼卷不足1000,无法进入!');return}
    Player.SetGamePoint(Player.GetGamePoint()-1000)
    Player.GoldChanged()
    Player.RandomMove('圣域试炼')
}