/*玩家 注册 登陆 单元*/

import { 装备属性统计 } from '../../应用智能优化版';
import { GetSameIPPlayerCount } from "../[功能]/_GN_MorePlayer"
import {
	_P_P_AbilityData, 特效,
} from "./_P_Base"

///////////////登陆///////////////

export function PlayerRegister(Player: TPlayObject): void {
	if (GetSameIPPlayerCount(Player, 100) > 6) {
		Player.DelayCallMethod('延时跳转.多开踢出', 5000, false);  //延迟5000毫秒跳转执行 属性特效清空
		Player.MessageBox('请爱护游戏环境，不要同时登陆3个以上账号游戏,5秒后将踢出游戏！');
		return
	}
	if (Player.Level < 15) {
		Player.SendMessage('[提示]:为避免新人恶意捣乱，15级以下禁止发言！', 1);
		Player.AllowSendMessage = false;
	} else {
		Player.AllowSendMessage = true;
	}
	if (Player.Level >= 1000) {
		let exp1 = Player.Exp
		Player.AddExp(-exp1)
	}
	// if (Player.GetIsAdmin()) {
	// 	Player.SetIsAdminMode(true)
	// }



	
	if (Player.GetJewelrys(4) != null && Player.GetJewelrys(4).GetName() == '甘道夫之戒') {
		if (Player.V.隐身开关 == false) {
			Player.AddStatusBuff(6, TBuffStatusType.stObserverForMon, 999999999, 0, 0)
		} else {
			Player.AddStatusBuff(6, TBuffStatusType.stObserverForMon, -1, 0, 0)
		}
	}

	if ((Player.V.战神 == false && Player.V.骑士 == false && Player.V.火神 == false && Player.V.冰法 == false && Player.V.驯兽师 == false && Player.V.牧师 == false &&
		Player.V.刺客 == false && Player.V.鬼舞者 == false && Player.V.神射手 == false && Player.V.猎人 == false && Player.V.武僧 == false && Player.V.罗汉 == false) || Player.V.种族 == '') {
		Player.MapMove('边界村', 69, 119)
	} else {
		Player.MapMove('主城', random(15) + 98, random(15) + 112)
	}

	// console.log(`生命倍数:${Player.R.生命倍数} , 防御倍数:${Player.R.防御倍数} , 攻击倍数:${Player.R.攻击倍数} , 魔法倍数:${Player.R.魔法倍数} , 道术倍数:${Player.R.道术倍数} , 刺术倍数:${Player.R.刺术倍数} , 射术倍数:${Player.R.射术倍数} , 武术倍数:${Player.R.武术倍数}`)
	
	// if (Player.Name == `鸿福` && Player.Account == `775800`) {
	// 	Player.SetPermission(10)

	// 	// Player.IsAdminMode = true
	// 	// Player.SuperManMode = false
	// 	// Player.ObserverMode = true
	// }
	Player.SetMaxBagSize(206);
	delete GameLib.V[Player.PlayerID]
	GameLib.V[Player.PlayerID] = {}
	Player.SetAttackMode(1) //每次登录和平模式
	Player.V.自动回收 = false //清空自动回收开关,防止某些玩家上限忘记开关结果回收了好装备BB
	Player.SetSuperManMode(false)
	Player.SetDenyAutoAddHP(false)
	装备属性统计(Player, undefined, undefined, undefined);/*重新计算玩家身上的装备*/
}
///////////////注册///////////////
export function GiveNewPlayer(Player: TPlayObject): void {
	// if (Player.IsNewHuman)--先要判断是否是新玩家
	/*初始化玩家变量*/
	for (let i = 1; i <= 300; i++) {
		Player.SetSVar(i, "");
		Player.SetNVar(i, 0);
		Player.SetPVar(i, 0);
	}
	for (let i = 1; i <= 1024; i++) {
		Player.SetCheck(i, false);
	}
	/* 背包/包裹 数量设置 */
	Player.SetMaxBagSize(206);
	/*赠送的装备*/
	/*新手赠送的 技能*/
	// 背包对比加箭头(Player)
	Player.SetFunctionState(TFunctionFlag.ffJewelryBox, true);//首饰盒
	Player.SetFunctionState(TFunctionFlag.ffZodiac, true);//生肖盒
	Player.MapMove('边界村', 69, 119)
	/*系统消息提示*/
	switch (Player.Job) {
		case 0: GameLib.Broadcast(format('{S=喜讯ぐ;C=151}：欢迎新玩家战士〖{S=%s;C=227}〗踏上了让人热血沸腾的征战之路！我们区又多了一位新朋友！！！', [Player.Name])); break;
		case 1: GameLib.Broadcast(format('{S=喜讯ぐ;C=151}：欢迎新玩家法师〖{S=%s;C=227}〗踏上了让人热血沸腾的征战之路！我们区又多了一位新朋友！！！', [Player.Name])); break;
		case 2: GameLib.Broadcast(format('{S=喜讯ぐ;C=151}：欢迎新玩家道士〖{S=%s;C=227}〗踏上了让人热血沸腾的征战之路！我们区又多了一位新朋友！！！', [Player.Name])); break;
		case 3: GameLib.Broadcast(format('{S=喜讯ぐ;C=151}：欢迎新玩家刺客〖{S=%s;C=227}〗踏上了让人热血沸腾的征战之路！我们区又多了一位新朋友！！！', [Player.Name])); break;
		case 4: GameLib.Broadcast(format('{S=喜讯ぐ;C=151}：欢迎新玩家弓箭〖{S=%s;C=227}〗踏上了让人热血沸腾的征战之路！我们区又多了一位新朋友！！！', [Player.Name])); break;
		case 5: GameLib.Broadcast(format('{S=喜讯ぐ;C=151}：欢迎新玩家武僧〖{S=%s;C=227}〗踏上了让人热血沸腾的征战之路！我们区又多了一位新朋友！！！', [Player.Name])); break;
	}
}
export function 自定义变量(Player: TPlayObject): void {

	Player.V.全屏拾取 ??= false
	Player.R.爆率加成 ??= 0
	Player.R.经验加成 ??= 0
	Player.V.鞭尸几率 ??= 0
	Player.R.鞭尸几率 ??= 0
	Player.V.自动拾取 ??= true
	Player.V.自动回收 ??= false
	Player.V.开通回收 ??= false
	Player.V.自动存材料 ??= false
	Player.V.时装 ??= false
	Player.V.种族 ??= ''
	Player.V.我要秒怪 ??= false
	Player.R.暴怒状态 ??= false

	Player.R.攻击范围 ??= '0'
	Player.V.烈焰一击所需货币缩减 ??= '0'
	Player.V.暴怒的加成 ??= '0'
	Player.V.魔器葫芦材料增加 ??= '0'
	Player.V.攻击范围 ??= '0'

	Player.V.人物技能倍攻 ??= '0'
	Player.V.所有宝宝倍攻 ??= '0'
    Player.V.攻击属性倍率 ??= '0'
    Player.V.技能伤害倍率 ??= '0'
	Player.V.魔器离钩加成 ??= '1'
	Player.V.魔器醍醐加成 ??= '0'
	Player.V.魔器霜陨加成 ??= '0'
	Player.V.魔器朝夕加成 ??= '0'

	Player.V.血量加持 ??= 0
    Player.V.防御加持 ??= 0

	Player.V.第一章成就 ??= false
	Player.V.第二章成就 ??= false
	Player.V.第三章成就 ??= false
	Player.V.第四章成就 ??= false
	Player.V.第五章成就 ??= false
	Player.V.第六章成就 ??= false
	Player.V.第七章成就 ??= false
	Player.V.第八章成就 ??= false
	Player.V.第九章成就 ??= false
	Player.V.第十章成就 ??= false
	Player.V.第十一章成就 ??= false
	Player.V.第十二章成就 ??= false

    Player.V.圣墟等级 ??= 0  // 历史最高层级
    Player.V.圣墟跨越层级 ??= 1  // 每次跨越的层数
    Player.V.圣墟挑战层数记录 ??= 0  // 当前所在层数（如果为0表示未开始或从头开始）

    Player.V.圣墟点数 ??= 0
    Player.V.圣墟点数等级 ??= 0

	// 经验勋章等级现在完全基于装备本身，不再需要初始化玩家变量
	// 但为了向后兼容，仍保留玩家变量（虽然实际逻辑中不再使用）

	Player.R.全属性 ??= '0'
	Player.R.生命 ??= '0'
	Player.R.防御 ??= '0'
	Player.R.攻击 ??= '0'
	Player.R.魔法 ??= '0'
	Player.R.道术 ??= '0'
	Player.R.射术 ??= '0'
	Player.R.刺术 ??= '0'
	Player.R.武术 ??= '0'
	Player.R.一键升星开始 ??= false
	Player.R.防御倍数最终 ??= '0'
	Player.R.生命倍数最终 ??= '0'
	Player.R.攻击倍数最终 ??= '0'
	Player.R.魔法倍数最终 ??= '0'
	Player.R.道术倍数最终 ??= '0'
	Player.R.刺术倍数最终 ??= '0'
	Player.R.射术倍数最终 ??= '0'
	Player.R.武术倍数最终 ??= '0'


	Player.R.倍攻 ??= 0
	Player.R.生命倍数 ??= 1
	Player.R.防御倍数 ??= 1
	Player.R.攻击倍数 ??= 1
	Player.R.魔法倍数 ??= 1
	Player.R.道术倍数 ??= 1
	Player.R.刺术倍数 ??= 1
	Player.R.射术倍数 ??= 1
	Player.R.武术倍数 ??= 1
	Player.R.伤害倍数 ??= 1
	Player.R.暴击几率 ??= 0
	Player.R.宝宝释放群雷 ??= false
	Player.R.猎人宝宝释放群攻 ??= false

	Player.V.攻杀剑术等级 ??= 1
	Player.V.刺杀剑术等级 ??= 1
	Player.V.半月弯刀等级 ??= 1
	Player.V.烈火剑法等级 ??= 1
	Player.V.逐日剑法等级 ??= 1
	Player.V.开天斩等级 ??= 1
	Player.V.雷电术等级 ??= 1
	Player.V.冰咆哮等级 ??= 1
	Player.V.飓风破等级 ??= 1
	Player.V.灵魂火符等级 ??= 1
	Player.V.施毒术等级 ??= 1
	Player.V.霜月X等级 ??= 1
	Player.V.雷光之眼等级 ??= 1
	Player.V.罗汉棍法等级 ??= 1
	Player.V.达摩棍法等级 ??= 1
	Player.V.狂怒等级 ??= 1
	Player.V.战神附体等级 ??= 1
	Player.V.天神附体等级 ??= 1
	Player.V.万剑归宗等级 ??= 1
	Player.V.圣光打击等级 ??= 1
	Player.V.防御姿态等级 ??= 1
	Player.V.愤怒等级 ??= 1
	Player.V.惩罚等级 ??= 1
	Player.V.审判救赎等级 ??= 1
	Player.V.法术奥义等级 ??= 1
	Player.V.火墙等级 ??= 1
	Player.V.流星火雨等级 ??= 1
	Player.V.致命一击等级 ??= 1
	Player.V.打击符文等级 ??= 1
	Player.V.暴风雨等级 ??= 1
	Player.V.寒冬领域等级 ??= 1
	Player.V.冰霜之环等级 ??= 1
	Player.V.拉布拉多等级 ??= 1
	Player.V.凶猛野兽等级 ??= 1
	Player.V.嗜血狼人等级 ??= 1
	Player.V.丛林虎王等级 ??= 1
	Player.V.剧毒火海等级 ??= 1
	Player.V.妙手回春等级 ??= 1
	Player.V.互相伤害等级 ??= 1
	Player.V.恶魔附体等级 ??= 1
	Player.V.末日降临等级 ??= 1
	Player.V.增伤等级 ??= 1
	Player.V.弱点等级 ??= 1
	Player.V.致命打击等级 ??= 1
	Player.V.暗影杀阵等级 ??= 1
	Player.V.鬼舞斩等级 ??= 1
	Player.V.鬼舞术等级 ??= 1
	Player.V.鬼舞之殇等级 ??= 1
	Player.V.鬼舞者等级 ??= 1
	Player.V.群魔乱舞等级 ??= 1
	Player.V.万箭齐发等级 ??= 1
	Player.V.复仇等级 ??= 1
	Player.V.成长等级 ??= 1
	Player.V.神灵救赎等级 ??= 1
	Player.V.生存等级 ??= 1
	Player.V.分裂箭等级 ??= 1
	Player.V.召唤宠物等级 ??= 1
	Player.V.人宠合一等级 ??= 1
	Player.V.命运刹印等级 ??= 1
	Player.V.天雷阵等级 ??= 1
	Player.V.护法灭魔等级 ??= 1
	Player.V.体质强化等级 ??= 1
	Player.V.碎石破空等级 ??= 1
	Player.V.至高武术等级 ??= 1
	Player.V.金刚护法等级 ??= 1
	Player.V.金刚护体等级 ??= 1
	Player.V.擒龙功等级 ??= 1
	Player.V.罗汉金钟等级 ??= 1

	Player.R.猎人宝宝速度 ??= 0
	Player.R.驯兽宝宝速度 ??= 0
	Player.R.攻杀剑术倍攻 ??= '0'
	Player.R.刺杀剑术倍攻 ??= '0'
	Player.R.半月弯刀倍攻 ??= '0'
	Player.R.烈火剑法倍攻 ??= '0'
	Player.R.逐日剑法倍攻 ??= '0'
	Player.R.开天斩倍攻 ??= '0'
	Player.R.雷电术倍攻 ??= '0'
	Player.R.冰咆哮倍攻 ??= '0'
	Player.R.飓风破倍攻 ??= '0'
	Player.R.灵魂火符倍攻 ??= '0'
	Player.R.霜月X倍攻 ??= '0'
	Player.R.雷光之眼倍攻 ??= '0'
	Player.R.罗汉棍法倍攻 ??= '0'
	Player.R.达摩棍法倍攻 ??= '0'
	Player.R.人物技能倍攻 ??= '0'
	Player.R.猎人宝宝攻击倍攻 ??= '0'
	Player.R.驯兽宝宝攻击倍攻 ??= '0'
	Player.R.战神宝宝攻击倍攻 ??= '0'
	Player.R.罗汉宝宝攻击倍攻 ??= '0'
	Player.R.狂怒倍攻 ??= '0'
	Player.R.万剑归宗倍攻 ??= '0'
	Player.R.圣光打击倍攻 ??= '0'
	Player.R.愤怒倍攻 ??= '0'
	Player.R.审判救赎倍攻 ??= '0'
	Player.R.火墙倍攻 ??= '0'
	Player.R.流星火雨倍攻 ??= '0'
	Player.R.暴风雨倍攻 ??= '0'
	Player.R.寒冬领域倍攻 ??= '0'
	Player.R.冰霜之环倍攻 ??= '0'
	Player.R.剧毒火海倍攻 ??= '0'
	Player.R.互相伤害倍攻 ??= '0'
	Player.R.末日降临倍攻 ??= '0'
	Player.R.弱点倍攻 ??= '0'
	Player.R.暗影杀阵倍攻 ??= '0'
	Player.R.鬼舞斩倍攻 ??= '0'
	Player.R.鬼舞术倍攻 ??= '0'
	Player.R.群魔乱舞倍攻 ??= '0'
	Player.R.万箭齐发倍攻 ??= '0'
	Player.R.复仇倍攻 ??= '0'
	Player.R.神灵救赎倍攻 ??= '0'
	Player.R.分裂箭倍攻 ??= '0'
	Player.R.命运刹印倍攻 ??= '0'
	Player.R.天雷阵倍攻 ??= '0'
	Player.R.至高武术倍攻 ??= '0'
	Player.R.碎石破空倍攻 ??= '0'
	Player.R.金刚护法倍攻 ??= '0'
	Player.R.罗汉金钟倍攻 ??= '0'
	Player.R.造成伤害 ??= '0'
	Player.R.伤害减少 ??= 0
	Player.R.伤害加成 ??= 0
	Player.R.击中吸血比例 ??= 0
	Player.R.击中恢复生命 ??= '0'
	Player.R.所有技能等级 ??= 0
	Player.R.所有宝宝速度 ??= 0
	Player.R.所有宝宝倍攻 ??= '0'
	Player.R.抵抗异常 ??= 0
	Player.R.力量 ??= '0'
	Player.R.耐力 ??= '0'
	Player.R.体质 ??= '0'
	Player.R.强化血量 ??= '0'
	Player.R.强化双防 ??= '0'
	Player.R.强化技能等级 ??= 0
	Player.R.召唤战神等级 ??= 0

	Player.V.战神 ??= false
	Player.V.骑士 ??= false
	Player.V.火神 ??= false
	Player.V.冰法 ??= false
	Player.V.驯兽师 ??= false
	Player.V.牧师 ??= false
	Player.V.刺客 ??= false
	Player.V.鬼舞者 ??= false
	Player.V.神射手 ??= false
	Player.V.猎人 ??= false
	Player.V.武僧 ??= false
	Player.V.罗汉 ??= false

	Player.V.种族阶数 ??= 0
	Player.V.荣誉值 ??= 0

	Player.R.暗影值 ??= 0
	Player.R.神射手第三次攻击 ??= 0
	Player.R.罗汉技能伤害 ??= false

	Player.R.极品率 ??= 0
	Player.V.永久极品率 ??= 0

	Player.V.真实充值 ??= 0
	Player.V.累计充值 ??= 0
	Player.V.幸运值 ??= 0


	Player.V.天赋专精 ??= 3
	Player.V.生命专精激活 ??= false
	Player.V.防御专精激活 ??= false
	Player.V.进攻专精激活 ??= false
	Player.V.速度专精激活 ??= false
	Player.V.恢复专精激活 ??= false
	Player.V.躲避专精激活 ??= false
	Player.V.吸收专精激活 ??= false
	Player.V.反弹专精激活 ??= false
	Player.V.契约专精激活 ??= false
	Player.R.躲避 ??= 0

	Player.R.生命点数 ??= 0
	Player.R.防御点数 ??= 0
	Player.R.进攻点数 ??= 0
	Player.R.速度点数 ??= 0
	Player.R.恢复点数 ??= 0
	Player.R.躲避点数 ??= 0
	Player.R.吸收点数 ??= 0
	Player.R.反弹点数 ??= 0
	Player.R.契约点数 ??= 0

	Player.V.战神觉醒 ??= false
	Player.V.战神强化等级 ??= 0
	Player.V.战神学习基础 ??= false
	Player.V.战神学习高级 ??= false

	Player.R.轮回之道等级 ??= 0
	Player.R.转生等级 ??= 0
	Player.V.轮回次数 ??= 0
	Player.R.战神宝宝速度 ??= 0
	Player.R.罗汉宝宝速度 ??= 0

	Player.R.攻击魔法速度 ??= 0

	Player.R.所有攻击倍数 ??= 0


	Player.V.普通 ??= false
	Player.V.精良 ??= false
	Player.V.优秀 ??= false
	Player.V.稀有 ??= false
	Player.V.史诗 ??= false
	Player.V.传说 ??= false
	Player.V.神话 ??= false
	Player.V.远古 ??= false
	Player.V.不朽 ??= false

	Player.V.劣质 ??= false
	Player.V.超强 ??= false
	Player.V.杰出 ??= false
	Player.V.传说 ??= false
	Player.V.神话 ??= false
	Player.V.传承 ??= false
	Player.V.史诗 ??= false
	Player.V.绝世 ??= false
	Player.V.造化 ??= false
	Player.V.混沌 ??= false
	Player.V.底材 ??= false
	Player.V.会员等级 ??= 0
	Player.V.总捐献礼卷数量 ??= 0
	GameLib.V.首区攻杀 ??= false
	GameLib.V.总捐献 ??= 0
	Player.R.被攻击状态 ??= false
	Player.R.鞭尸执行 ??= false
	Player.V.任务1 ??= false
	Player.V.任务2 ??= false
	Player.V.任务3 ??= false
	Player.V.任务4 ??= false

	Player.V.完成任务1 ??= false
	Player.V.完成任务2 ??= false
	Player.V.完成任务3 ??= false
	Player.V.完成任务4 ??= false
	Player.V.回收元宝倍数 ??= 100
	Player.R.攻击倍数 ??= 0
	Player.R.鞭尸次数 ??= 0
	Player.V.鞭尸次数 ??= 0
	Player.R.时装生肖攻击 ??= 0
	Player.R.时装生肖魔法 ??= 0
	Player.R.时装生肖道术 ??= 0
	Player.R.时装生肖射术 ??= 0
	Player.R.时装生肖刺术 ??= 0
	Player.R.时装生肖武术 ??= 0
	Player.V.罗汉宝宝进化 ??= false

	Player.R.暴击伤害 ??= '0'

	Player.R.本职装备几率 ??= 0

	Player.V.本职业属性词条 ??= false
	Player.V.本职业属性词条数值 ??= '0'

	Player.V.防御词条 ??= false
	Player.V.血量词条 ??= false
	Player.V.攻击词条 ??= false
	Player.V.魔法词条 ??= false
	Player.V.道术词条 ??= false
	Player.V.刺术词条 ??= false
	Player.V.射术词条 ??= false
	Player.V.武术词条 ??= false
	Player.V.属性词条 ??= false
	Player.V.倍攻词条 ??= false
	Player.V.生肖词条 ??= false
	Player.V.种族词条 ??= false
	Player.V.天赋词条 ??= false
	Player.V.装备星星词条 ??= false
	Player.V.技能伤害词条 ??= false


	Player.V.防御词条数值 ??= '0'
	Player.V.血量词条数值 ??= '0'
	Player.V.攻击词条数值 ??= '0'
	Player.V.魔法词条数值 ??= '0'
	Player.V.道术词条数值 ??= '0'
	Player.V.刺术词条数值 ??= '0'
	Player.V.射术词条数值 ??= '0'
	Player.V.武术词条数值 ??= '0'
	Player.V.属性词条数值 ??= '0'
	Player.V.倍攻词条数值 ??= '0'
	Player.V.生肖词条数值 ??= '0'
	Player.V.种族词条数值 ??= '0'
	Player.V.天赋词条数值 ??= 0
	Player.V.装备星星词条数值 ??= '0'
	Player.V.技能伤害词条数值 ??= '0'

	Player.V.隐身开关 ??= false
	Player.R.被攻击不允许随机 ??= 0

	Player.V.宣传爆率 ??= 0
	Player.V.宣传回收 ??= 0
	Player.V.宣传极品率 ??= 0
	Player.V.宣传次数 ??= 0

	Player.V.赞助爆率 ??= 0
	Player.V.赞助回收 ??= 0
	Player.V.赞助极品率 ??= 0

	Player.V.神之守护 ??= 0
	Player.V.神之祝福 ??= 0

	Player.V.经验等级 ??= 0

	Player.V.回收元宝倍率 ??= 0
	Player.R.属性按钮 ??= true
	Player.V.挑战倍数 = Math.max(2, Player.V.挑战倍数 ?? 2)
	Player.V.最高挑战倍数 = Math.max(10, Player.V.最高挑战倍数 ?? 10)

	Player.V.杀怪数量 ??= 0
	// GameLib.V.每日回收神器次数 ??= {}
	// GameLib.V.每日回收神器次数[Player.GetName()] ??= 0

}



