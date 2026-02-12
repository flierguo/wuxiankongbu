export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
         {S=以下两个地图怪物异常凶狠,特别是地狱无门又如人间炼狱;C=251}\\\\
                {S=缥缈之地怪物刷新:最高200000亿星;C=154}\\\\
                {S=地狱无门怪物刷新:最高1000000亿星;C=154}\\\\
                {S=缥缈之地进入条件:5000点券;C=19}\\\\
                {S=地狱无门进入条件:8000点券;C=19}\\\\
                 <缥缈之地/@缥缈>         <地狱无门/@地狱无门>
`
    Npc.SayEx(Player, 'NPC小窗口', S)
}

export function 缥缈(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.GetLevel() < 2000) { Player.MessageBox('等级不足2000,无法进入'); return }
    if (Player.GetGamePoint() < 5000) { Player.MessageBox('点券不足5000,无法进入'); return }
    Player.SetGamePoint(Player.GetGamePoint() - 5000)
    Player.GoldChanged()
    Player.RandomMove('缥缈之地')
}

export function 地狱无门(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.GetLevel() < 2000) { Player.MessageBox('等级不足2000,无法进入'); return }
    if (Player.GetGamePoint() < 8000) { Player.MessageBox('点券不足8000,无法进入'); return }
    Player.SetGamePoint(Player.GetGamePoint() - 8000)
    Player.GoldChanged()
    Player.RandomMove('地狱无门')
}