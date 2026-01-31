import * as _P_Base from "../基础常量"
import { 装备属性统计 } from "../_装备/属性统计";

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

export function 免费复活(Npc: TNormNpc, Player: TPlayObject): void {
    // 复活时恢复满血
    Player.SetSVar(91, Player.GetSVar(92))  // 当前血量 = 最大血量
    Player.V.自定属性[1051] = Player.GetSVar(91)  // 同步到V变量
    装备属性统计(Player)
    Player.ReAlive()
    Player.MapMove('主城', 105, 120)
    Player.CloseWindow('人物死亡')
    Player.RecalcAbilitys;
}

export function 收费复活(Npc: TNormNpc, Player: TPlayObject): void {
    if (Player.GetGameGold() < 2000) { Player.MessageBox(`元宝不足2000,无法原地复活`); return }
    Player.SetGameGold(Player.GetGameGold() - 2000)
    Player.GoldChanged()
    // 复活时恢复满血
    Player.SetSVar(91, Player.GetSVar(92))  // 当前血量 = 最大血量
    Player.V.自定属性[1051] = Player.GetSVar(91)  // 同步到V变量
    装备属性统计(Player)
    Player.ReAlive()
    Player.RecalcAbilitys;
    Player.CloseWindow('人物死亡')
}

export function 玩家复活(Npc: TNormNpc, Player: TPlayObject): void {
    // 恢复保存的当前血量（如果没有保存则恢复满血）
    Player.SetSVar(91, Player.V.自定属性[1051] || Player.GetSVar(92))
    // 最大血量由装备属性统计计算，这里不需要设置
    Player.ReAlive()
    Player.GoHome()
    装备属性统计(Player)
    Player.RecalcAbilitys;
}


