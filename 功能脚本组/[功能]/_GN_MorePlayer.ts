/*判断玩家同一个IP数量*/

export function GetSameIPPlayerCount(Player: TPlayObject, LimitLevel: number): number {

	let UserCount: number = 0;
	for (let i = 0; i < GameLib.PlayCount; i++) {
		if (GameLib.GetPlayer(i).GetNotOnlineAddExp() == false && GameLib.GetPlayer(i).Level >= LimitLevel && GameLib.GetPlayer(i).MachineCode == Player.MachineCode) {
			UserCount = UserCount + 1;
		}
	}
	return UserCount
}