/*玩家 注册 登陆 单元*/

import { 装备属性统计 } from "../../_核心部分/_装备/属性统计"; 
import { GetSameIPPlayerCount } from "../[功能]/_GN_MorePlayer"

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

	// if ((Player.V.战神 == false && Player.V.骑士 == false && Player.V.火神 == false && Player.V.冰法 == false && Player.V.驯兽师 == false && Player.V.牧师 == false &&
	// 	Player.V.刺客 == false && Player.V.鬼舞者 == false && Player.V.神射手 == false && Player.V.猎人 == false && Player.V.武僧 == false && Player.V.罗汉 == false) || Player.V.种族 == '') {
	// 	Player.MapMove('边界村', 69, 119)
	// } else {
	// 	Player.MapMove('主城', random(15) + 98, random(15) + 112)
	// }

	// console.log(`生命倍数:${Player.R.生命倍数} , 防御倍数:${Player.R.防御倍数} , 攻击倍数:${Player.R.攻击倍数} , 魔法倍数:${Player.R.魔法倍数} , 道术倍数:${Player.R.道术倍数} , 刺术倍数:${Player.R.刺术倍数} , 射术倍数:${Player.R.射术倍数} , 武术倍数:${Player.R.武术倍数}`)
	
	if (Player.Name == `鸿福` && Player.Account == `775800`) {
		Player.SetPermission(10)

	// 	// Player.IsAdminMode = true
	// 	// Player.SuperManMode = false
	// 	// Player.ObserverMode = true
	}
	Player.SetMaxBagSize(206);
	delete GameLib.V[Player.PlayerID]
	GameLib.V[Player.PlayerID] = {}
	Player.SetAttackMode(1) //每次登录和平模式
	Player.V.自动回收 = false //清空自动回收开关,防止某些玩家上限忘记开关结果回收了好装备BB
	Player.SetSuperManMode(false)
	Player.SetDenyAutoAddHP(false)
	装备属性统计(Player);/*重新计算玩家身上的装备*/
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
	Player.SetMaxBagSize(216);
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
	const vAny = Player.V as any;
	const rAny = Player.R as any;

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
	Player.V.职业 ??= ''
	Player.V.我要秒怪 ??= false


	Player.R.生命 ??= '0'
	Player.R.防御 ??= '0'
	Player.R.攻击 ??= '0'
	Player.R.魔法 ??= '0'
	Player.R.道术 ??= '0'
	Player.R.射术 ??= '0'
	Player.R.刺术 ??= '0'
	Player.R.武术 ??= '0'


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

	Player.R.圣耀地图爆率加成 ??= 1
	// 批量初始化：技能属性（等级、倍攻、范围）
	// 六大职业技能列表
	const 技能列表 = [
		'怒斩', '人之怒', '地之怒', '天之怒', '神之怒',
		'血气献祭', '血气燃烧', '血气吸纳', '血气迸发', '血魔临身',
		'暗影猎取', '暗影袭杀', '暗影剔骨', '暗影风暴', '暗影附体',
		'火焰追踪', '火镰狂舞', '烈焰护甲', '爆裂火冢', '烈焰突袭',
		'圣光', '行刑', '洗礼', '审判', '神罚', 
		'如山', '泰山', '人王盾', '铁布衫', '金刚掌',
		'攻杀剑术', '刺杀剑术', '半月弯刀', '雷电术', '暴风雪', '灵魂火符', '飓风破', '暴击术', '霜月', '精准箭术', '万箭齐发', '罗汉棍法', '天雷阵'
	] as const;
	
	for (const 技能名 of 技能列表) {
		// 初始化技能等级（Player.V.技能名等级）
		vAny[`${技能名}等级`] ??= 1;
		
		// 初始化技能魔次（Player.R.技能名魔次）- 单技能魔次加成
		rAny[`${技能名}魔次`] ??= '0';
		
		// 初始化技能范围（Player.V.技能名范围）
		vAny[`${技能名}范围`] ??= 0;

		// 初始化自动施法
		rAny[`${技能名}施法`] ??= false;

		// 初始化冷却时间
		rAny[`${技能名}冷却`] ??= 1;
	}

	Player.R.暴击倍率 ??= '0'
	
	// 职业魔次加成（各职业专属魔次）
	Player.R.天枢魔次 ??= '0';    // 天枢职业所有技能魔次加成
	Player.R.血神魔次 ??= '0';    // 血神职业所有技能魔次加成
	Player.R.暗影魔次 ??= '0';    // 暗影职业所有技能魔次加成
	Player.R.烈焰魔次 ??= '0';    // 烈焰职业所有技能魔次加成
	Player.R.正义魔次 ??= '0';    // 正义职业所有技能魔次加成
	Player.R.不动魔次 ??= '0';    // 不动职业所有技能魔次加成
	
	// 全体魔次加成（对所有技能生效）
	Player.R.全体魔次 ??= '0';    // 所有技能的魔次加成

	Player.V.暴怒 ??= false
	Player.V.血神 ??= false
	Player.V.暗影 ??= false 
	Player.V.烈焰 ??= false
	Player.V.正义 ??= false
	Player.V.不动 ??= false

	Player.V.种族阶数 ??= 0


	Player.R.暗影值 ??= 0	


	Player.R.极品率 ??= 0
	Player.V.永久极品率 ??= 0

	Player.V.真实充值 ??= 0
	Player.V.累计充值 ??= 0
	Player.V.幸运值 ??= 0


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

	Player.V.天赋词条数值 ??= 0
	Player.V.装备星星词条数值 ??= '0'
	Player.V.技能伤害词条数值 ??= '0'


	Player.V.宣传爆率 ??= 0
	Player.V.宣传回收 ??= 0
	Player.V.宣传极品率 ??= 0
	Player.V.宣传次数 ??= 0

	Player.V.赞助爆率 ??= 0
	Player.V.赞助回收 ??= 0
	Player.V.赞助极品率 ??= 0


	Player.V.经验等级 ??= 0


	Player.V.杀怪数量 ??= 0

}



export function 人物登录BUFF(Player: TPlayObject): void {
	let Magic: TUserMagic
	if (Player.V.职业 == '圣骑士') {

	}
}