export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    GameLib.V.挑战世界BOSS ??= {}
    GameLib.V.挑战世界BOSS[Player.GetName()] ??= 0
    const S = `\\\\\\\\\\\\\\\\\\
                                                                                   剩余挑战次数:${10 - GameLib.V.挑战世界BOSS[Player.GetName()]}/10\\
                     {S=每隔4小时刷新一次世界BOSS;C=154}\\\\\\
                     {S=每天可免费进入10次,后续每次进入需要5点礼卷;C=154}\\\\\\\\\\\\\\
                            {S=爆出大量装备和材料;C=239}\\\\\\\\\\
                     {S=远古树精;C=150;X=470;Y=200}  $远古树精$     <{S=挑战;X=590;Y=200}/@挑战(1,诸天神殿[一幕])>\\
                     {S=暗黑法师;C=150;X=470;Y=250}    $暗黑法师$      <{S=挑战;X=590;Y=250}/@挑战(2,诸天神殿[二幕])>\\
                     {S=圣光骑士;C=150;X=470;Y=300}   $圣光骑士$   <{S=挑战;X=590;Y=300}/@挑战(3,诸天神殿[三幕])>\\
                     {S=暗影虎王;C=150;X=470;Y=350}   $暗影虎王$   <{S=挑战;X=590;Y=350}/@挑战(4,诸天神殿[四幕])>\\
                     {S=地狱九头蛇;C=150;X=470;Y=400}       $地狱九头蛇$      <{S=挑战;X=590;Y=400}/@挑战(5,诸天神殿[五幕])>\\
                     {s=剩余时间:;c=251;X=500;Y=100}{S=${240 - GameLib.V.开始刷世界BOSS}分钟;X=560;Y=100}
      

    `
    let Msg = S
    let AMap: TEnvirnoment;
    AMap = GameLib.FindMap('诸天神殿[一幕]')
    AMap.GetMonCount() < 1 ? Msg = ReplaceStr(Msg, '$远古树精$', '{S=未刷新;C=249;X=535;Y=200}') : Msg = ReplaceStr(Msg, '$远古树精$', '{S=已刷新;C=250;X=535;Y=200}')
    AMap = GameLib.FindMap('诸天神殿[二幕]')
    AMap.GetMonCount() < 1 ? Msg = ReplaceStr(Msg, '$暗黑法师$', '{S=未刷新;C=249;X=535;Y=250}') : Msg = ReplaceStr(Msg, '$暗黑法师$', '{S=已刷新;C=250;X=535;Y=250}')
    AMap = GameLib.FindMap('诸天神殿[三幕]')
    AMap.GetMonCount() < 1 ? Msg = ReplaceStr(Msg, '$圣光骑士$', '{S=未刷新;C=249;X=535;Y=300}') : Msg = ReplaceStr(Msg, '$圣光骑士$', '{S=已刷新;C=250;X=535;Y=300}')
    AMap = GameLib.FindMap('诸天神殿[四幕]')
    AMap.GetMonCount() < 1 ? Msg = ReplaceStr(Msg, '$暗影虎王$', '{S=未刷新;C=249;X=535;Y=350}') : Msg = ReplaceStr(Msg, '$暗影虎王$', '{S=已刷新;C=250;X=535;Y=350}')
    AMap = GameLib.FindMap('诸天神殿[五幕]')
    AMap.GetMonCount() < 1 ? Msg = ReplaceStr(Msg, '$地狱九头蛇$', '{S=未刷新;C=249;X=535;Y=400}') : Msg = ReplaceStr(Msg, '$地狱九头蛇$', '{S=已刷新;C=250;X=535;Y=400}')
    Npc.SayEx(Player, '世界BOSS', Msg)

}
export function 挑战(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 地图名字 = Args.Str[1]
    if (GameLib.V.挑战世界BOSS[Player.GetName()] >= 10) {
        if (Player.GetGamePoint() < 5) { Player.MessageBox('你今日挑战次数已经达到10次,再次挑战需要5点券\\你点券不足5点,进入失败!'); return }
        Player.SetGamePoint(Player.GetGamePoint() - 5)
        Player.GoldChanged()
        Player.RandomMove(地图名字)
        return
    }
    GameLib.V.挑战世界BOSS[Player.GetName()] = GameLib.V.挑战世界BOSS[Player.GetName()] + 1
    Player.RandomMove(地图名字)
}