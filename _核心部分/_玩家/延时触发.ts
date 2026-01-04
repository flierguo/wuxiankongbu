import * as _P_Base from "../基础常量"


export function 血魔临身结束(Npc: TNormNpc, Player: TPlayObject): void {
    Player.R.血魔临身 = false;
    Player.R.血魔临身回血百分比 = 0;
    Player.SetCustomEffect(_P_Base.永久特效.血魔临身, -1);
    Player.SendMessage('血魔临身结束', 2);
}

export function 暗影附体结束(Npc: TNormNpc, Player: TPlayObject): void {
    Player.R.暗影附体 = false;
    Player.SetCustomEffect(_P_Base.永久特效.暗影附体, -1);
    Player.SendMessage('暗影附体结束', 2);
}


export function 重新登录(Npc: TNormNpc, Player: TPlayObject): void {
    Player.Kick()
}

// export function 免费复活(Npc: TNormNpc, Player: TPlayObject): void {
//     Player.SetSVar(91, Player.V.自定属性[1051])  //当前血量
//     Player.SetSVar(92, Player.V.自定属性[1052])    //当前最大血量
//     // 血量显示(Player)
//     装备属性统计(Player, undefined, undefined, undefined)

//     Player.ReAlive()
//     Player.GoHome()
//     // activation(Player);/*重新计算玩家身上的装备*/
//     Player.RecalcAbilitys;/*重新计算能力值*/
// }

// export function 收费复活(Npc: TNormNpc, Player: TPlayObject): void {
//     if (Player.GetGameGold() < 300) { Player.MessageBox(`元宝不足300,无法原地复活`); return }
//     Player.SetGameGold(Player.GetGameGold() - 300)
//     Player.GoldChanged()
//     Player.SetSVar(91, Player.V.自定属性[1051])  //当前血量
//     Player.SetSVar(92, Player.V.自定属性[1052])    //当前最大血量
//     // 血量显示(Player)
//     装备属性统计(Player, undefined, undefined, undefined)
//     Player.ReAlive()
//     // Player.GoHome()
//     // activation(Player);/*重新计算玩家身上的装备*/
//     Player.RecalcAbilitys;/*重新计算能力值*/
// }

// export function 玩家复活(Npc: TNormNpc, Player: TPlayObject): void {
//     Player.SetSVar(91, Player.V.自定属性[1051])  //当前血量
//     Player.SetSVar(92, Player.V.自定属性[1052])    //当前最大血量


//     Player.ReAlive()
//     Player.GoHome()

//     // 血量显示(Player)
//     装备属性统计(Player, undefined, undefined, undefined)
//     // activation(Player);/*重新计算玩家身上的装备*/
//     Player.RecalcAbilitys;/*重新计算能力值*/
// }


