/*秘境地图 NPC*/
import { _P_N_MJ_layer, _P_P_MJ_layer_temp, _P_P_MJ_Robot, _P_CH_MJ_complete, } from "./_MAP_Base"

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S1 = `【<{S=奖励}/@Reward($layer$)>】`
    const S2 = `请清除地图里的所有怪物，才能领取奖励。`

    if (Player.GetGroupOwner() != null) {//如果存在队长
        let OwnerPlayer: TPlayObject = Player.GetGroupOwner();//队长玩家
        if (OwnerPlayer.GetCheck(_P_CH_MJ_complete)) {// 任务完成的情况
            let M = ReplaceStr(S1, '$layer$', OwnerPlayer.GetPVar(_P_P_MJ_layer_temp));
            Npc.Say(Player, M);
        } else {
            Npc.Say(Player, S2);
        }
    } else {// 个人
        if (Player.GetCheck(_P_CH_MJ_complete)) {
            let M = ReplaceStr(S1, '$layer$', Player.GetPVar(_P_P_MJ_layer_temp));
            Npc.Say(Player, M);
        } else {
            Npc.Say(Player, S2);
        }
    }
}

/*获得秘境的奖励*/
function Reward(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

}