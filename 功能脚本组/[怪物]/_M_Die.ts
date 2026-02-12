import { 玩家杀怪数量 } from "../[玩家]/_P_Base";

export function funcDie(Envir: TEnvirnoment, Actor: TActor, Killer: TActor, Tag: number): void {
	if (Actor == null || Killer == null) { return }// 判断对象是否为 null
	let Player: TPlayObject;
	Player = Killer as TPlayObject;
	if (!Actor.IsPlayer()) {
		// // ✅ 实时清理：怪物死亡时立即清理其信息缓存
		// try {
		// 	const 怪物Handle = `${Actor.Handle}`;
		// 	if (怪物Handle && GameLib.R && GameLib.R.怪物信息 && GameLib.R.怪物信息[怪物Handle]) {
		// 		delete GameLib.R.怪物信息[怪物Handle];
		// 		console.log(`🗑️ [怪物死亡]清理死亡怪物信息: ${Actor.GetName()}(${怪物Handle})`);
		// 	}
		// } catch (cleanupError) {
		// 	console.log(`❌ [怪物死亡]清理怪物信息出错: ${cleanupError}`);
		// }
		
		Actor.MakeGhost() //清理尸体
	}

	_func_KillMonsterAmount(Envir, Player);/*杀怪数量记录*/

}

/*杀怪数量记录*/
function _func_KillMonsterAmount(Envir: TEnvirnoment, Player: TPlayObject): void {
	/*玩家击杀怪物记录*/
	Player.SetNVar(玩家杀怪数量, Player.GetNVar(玩家杀怪数量) + 1);
}