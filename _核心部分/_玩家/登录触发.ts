/*玩家 注册 登陆 单元*/

import { 装备属性统计 } from '../../_核心部分/_装备/属性统计';
import { GetSameIPPlayerCount } from "../_功能"
import { 新人职业技能 } from '../_服务/职业选择';
import { 设置基础属性 } from '../_装备/装备掉落';
import { 检查津贴状态, 检测津贴特效 } from '../_服务/主神津贴';

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

	if (Player.GetJewelrys(4) != null && Player.GetJewelrys(4).GetName() == '甘道夫之戒') {
		if (Player.V.隐身开关 == false) {
			Player.AddStatusBuff(6, TBuffStatusType.stObserverForMon, 999999999, 0, 0)
		} else {
			Player.AddStatusBuff(6, TBuffStatusType.stObserverForMon, -1, 0, 0)
		}
	}


	Player.SetMaxBagSize(226);
	delete GameLib.V[Player.PlayerID]
	GameLib.V[Player.PlayerID] = {}
	Player.SetAttackMode(1) //每次登录和平模式
	Player.V.自动回收 = false //清空自动回收开关,防止某些玩家上限忘记开关结果回收了好装备BB
	Player.SetSuperManMode(false)
	Player.SetDenyAutoAddHP(false)
	检查津贴状态(Player); // 检查主神津贴是否过期
	检测津贴特效(Player);
	装备属性统计(Player);/*重新计算玩家身上的装备*/
	人物登录BUFF(Player)
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
	Player.SetMaxBagSize(226);
	Player.SetFunctionState(TFunctionFlag.ffJewelryBox, true);//首饰盒
	Player.SetFunctionState(TFunctionFlag.ffZodiac, true);//生肖盒
	Player.MapMove('主城', 105, 120)
	新手装备(Player)
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
export function 登录初始化变量(Player: TPlayObject): void {
	const vAny = Player.V as any;
	const rAny = Player.R as any;

	// 基础属性倍数
	Player.R.生命百分比 ??= 0;
	Player.R.防御百分比 ??= 0;
	Player.R.攻击百分比 ??= 0;
	Player.R.魔法百分比 ??= 0;
	Player.R.道术百分比 ??= 0;
	Player.R.刺术百分比 ??= 0;
	Player.R.箭术百分比 ??= 0;
	Player.R.武术百分比 ??= 0;
	Player.R.天枢职业百分比 ??= 0;
	Player.R.血神职业百分比 ??= 0;
	Player.R.暗影职业百分比 ??= 0;
	Player.R.烈焰职业百分比 ??= 0;
	Player.R.正义职业百分比 ??= 0;
	Player.R.不动职业百分比 ??= 0;
	Player.R.全体职业百分比 ??= 0;
	Player.R.经验百分比 ??= 0

	// ==================== 自定属性数组初始化 ====================
	// 初始化自定属性数组（161-168为基础属性）
	for (let i = 161; i <= 168; i++) {
		Player.R.自定属性 ??= {}
		Player.R.自定属性[i] ??= '0'
	}

	// ==================== 技能部分初始化 ====================
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
		rAny[`${技能名}CD`] ??= 1;
	}

	// 技能开启状态
	Player.R.血气燃烧 ??= false
	Player.R.血魔临身 ??= false
	Player.R.暗影剔骨 ??= false
	Player.R.暗影附体 ??= false
	Player.R.烈焰护甲 ??= false
	Player.R.圣光 ??= false
	Player.R.如山 ??= false

	Player.R.暗影值 ??= 0

	// 职业魔次加成（各职业专属魔次）
	Player.R.天枢魔次 ??= '0';
	Player.R.血神魔次 ??= '0';
	Player.R.暗影魔次 ??= '0';
	Player.R.烈焰魔次 ??= '0';
	Player.R.正义魔次 ??= '0';
	Player.R.不动魔次 ??= '0';

	// 全体魔次加成（对所有技能生效）
	Player.R.全体魔次 ??= '0';

	// ==================== 神器相关初始化 ====================
	Player.R.狂化阶数 ??= 0
	Player.R.迅疾阶数 ??= 0
	Player.R.甲壳阶数 ??= 0
	Player.R.融合阶数 ??= 0
	Player.R.念力阶数 ??= 0
	Player.R.协作阶数 ??= 0

	Player.R.暴击几率 ??= 0
	Player.R.暴击伤害 ??= 0
	Player.R.无视防御 ??= 0
	Player.R.基因增加伤害 ??= 0

	Player.R.神器爆率加成 ??= 0;
	Player.R.神器回收加成 ??= 0;
	Player.R.神器增伤加成 ??= '0';
	Player.R.基因锁等级 ??= 0;

	// ==================== 战斗相关初始化 ====================
	Player.R.伤害吸收 ??= 0
	Player.R.人王盾护盾值 ??= '0'
	Player.R.人王盾开启 ??= false

	// ==================== 爆率回收相关初始化 ====================
	Player.R.爆率加成 ??= 0
	Player.R.鞭尸几率 ??= 0
	Player.R.鞭尸次数 ??= 0
	Player.R.极品倍率 ??= 0
	Player.R.极品率加成 ??= 0
	Player.R.最终极品倍率 ??= 0
	Player.R.回收倍率 ??= 100
	Player.R.最终回收倍率 ??= 0
	Player.R.最终爆率加成 ??= 0
	Player.R.最终鞭尸次数 ??= 0

	Player.R.神器获得几率 ??= 0
	Player.R.未极品基础计数 ??= 0
	Player.R.未极品技能计数 ??= 0

	// ==================== 圣耀副本相关初始化 ====================
	Player.R.圣耀地图爆率加成 ??= 0
	Player.R.圣耀副本倍率 ??= 0
	Player.R.圣耀副本爆率加成 ??= false

	// ==================== 玩家状态初始化 ====================

	Player.V.职业 ??= ''

	Player.V.血统 ??= ''
	Player.V.血统等级 ??= 0

	Player.V.基因 ??= ''

	Player.V.今日神器回收 ??= 0

	Player.V.主神津贴 ??= false

	Player.V.捐献点数 ??= '0'

	Player.V.魂血精魄等级 ??= 0
	// ==================== 宣传赞助相关初始化 ====================
	Player.V.宣传爆率 ??= 0
	Player.V.宣传回收 ??= 0
	Player.V.宣传极品率 ??= 0
	Player.V.宣传次数 ??= 0

	Player.V.赞助爆率 ??= 0
	Player.V.赞助回收 ??= 0
	Player.V.赞助极品 ??= 0
	Player.V.赞助鞭尸 ??= 0
	Player.V.赞助极品率 ??= 0

	Player.V.真实累充 ??= 0
	Player.R.BOSS变异几率 ??= 0	
	// ==================== 其他功能初始化 ====================
	Player.V.幸运值 ??= 1

	Player.V.全屏拾取 ??= false
	Player.V.自动拾取 ??= true
	Player.V.自动回收 ??= false
	Player.V.材料入仓 ??= false
	Player.V.自动吃元宝 ??= false

	Player.V.伤害提示 ??= true
	Player.V.护盾提示 ??= true
	Player.V.掉落提示 ??= true
	Player.V.鞭尸提示 ??= true
	Player.V.回收屏蔽 ??= true
	Player.V.合成斗笠 ??= false


	Player.V.我要秒怪 ??= false

	Player.V.圣耀积分 ??= 0
	Player.V.杀怪数量 ??= 0

	// 累计回收货币（用于10秒提示）
	Player.R.累计回收金币 ??= 0
	Player.R.累计回收元宝 ??= 0
	Player.R.累计回收数量 ??= 0

	Player.V.血量保护百分比 ??= 0
	Player.V.随机保护百分比 ??= 0
	Player.V.血量保护间隔 ??= 10
	Player.V.随机保护间隔 ??= 0

	Player.R.变异几率 ??= 0
	// ==================== 性能计数器初始化 ====================
	Player.R.性能计数器 ??= 0
}



export function 人物登录BUFF(Player: TPlayObject): void {
	let Magic: TUserMagic
	Magic = Player.FindSkill('查看属性')
	if (!Magic) {
		新人职业技能(Player)
		Player.MapMove('主城', 105, 120)
	}
}
// ==================== 类型定义 ====================

// ==================== 类型定义 ====================
interface 装备属性记录 {
	职业属性_职业: number[]
	职业属性_属性: string[]
}

function 新手装备(Player: TPlayObject): void {
	// 初始化记录
	const 装备属性记录: 装备属性记录 = {
		职业属性_职业: [],
		职业属性_属性: []
	}
	let Magic: TUserMagic;
	let item: TUserItem
	let 武器名字 = ''
	let 衣服名字 = ''
	const 武器值 = '10000'
	const 衣服值 = '100000'
	Player.Give('回城石', 1)
	Player.Give('随机传送石', 1)
	Player.Give('生命药水', 3)
	switch (Player.GetJob()) {
		case 0: 武器名字 = '乌木剑'; break
		case 1: 武器名字 = '乌木剑'; break
		case 2: 武器名字 = '乌木剑'; break
		case 3: 武器名字 = '青铜匕首'; break
		case 4: 武器名字 = '劣质的木弓'; break
		case 5: 武器名字 = '盘龙棍'; break
	}

	item = Player.GiveItem(武器名字)
	if (item) {
		const 属性ID = Player.GetJob() + 100
		设置基础属性(item, 1, 属性ID, 武器值, 装备属性记录)
		item.SetCustomDesc(JSON.stringify(装备属性记录))
	}
	if (Player.GetGender() == 0) { 衣服名字 = '布衣(男)'; }
	else { 衣服名字 = '布衣(女)'; }
	item = Player.GiveItem(衣服名字)
	if (item) {
		设置基础属性(item, 1, 106, 衣服值, 装备属性记录)
		设置基础属性(item, 2, 107, 衣服值, 装备属性记录)
	}
	// 保存属性记录
	item.SetCustomDesc(JSON.stringify(装备属性记录))
	Player.UpdateItem(item)
	新人职业技能(Player)

}

