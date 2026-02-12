import Decimal = require("../bignumber/bignumber")

/**
 * 使用需要深拷贝
 */
export interface Info {
	lv: number
	/** 大数值血量 */
	hp: string[]
	/** 境界 0.境界，1 修为值  2。血量上限。3 防御类，4 攻击类. 5 渡劫丹 */
	realm: number[]
	/** 渡劫坐标 */
	realmXy: number[]
	/** 0:主职业 1:切换次数 */
	job: number[]
	/** 药水 0:hp间隔 1:mp间隔 2:hpCd 3:hpIndex,4:传送时间,5：自动吃药百分比*/
	potion: number[]
	/** 0:地图难度 1:区域位置 */
	mapInfo: number[]
	/** 充值  0.总计，1。每日,2.唯一赞助领取*/
	recharge: number[]
	/** 0：每日群推广，1。qq群，2。微信群.3 微信客服.4.累计群推广 */
	redeem: number[]
	/** 0.礼包  1.每日礼包. 2.VIP每日礼包 3.会员特惠礼包*/
	reward: number[][]
	vip: number
	/** 解锁高级VIP */
	gvip: number
	/** 词缀过滤 */
	affix: number[]
	/** 怪物词缀 */
	affixMons: string[]
	/** 每日怪物词缀上限 */
	affixMax: number[]
	/** 装备图鉴 装备,品质 等级 */
	items: number[][]
	/** boss首杀 */
	boss: number[][][]
	/** 个人boss */
	playerBoss: number[]
	/** 精力点  0，精力，1扫荡次数，2最大扫荡次数*/
	energy: number[]
	/** 幻化 */
	illusion: number[]
	/** 解锁 */
	illusions: number[][]
	/** 复活，0：地图，1：轮回，2：其他   [时间,次数]*/
	reAlive: number[][]
	/** 0 最大经验，1当前经验，2.药水时间，3经验记录 */
	exp: number[]
	monKey: number
	//comprehend: Comprehend
	//背包神器
	// bagItems: number[]
	lastLogin: number
	goHome: string
	setting: number[]
	setAffix: number[][]
	setTipAffix: number[][]
	buffs: any[]
	deBuff: any[]
	wishList: number[][]
	/** 0:id,1:等级，2，临时等级 3，是否激活 */
	passives: number[][]
	/** 0元神等级 */
	passivesRandoms: number[]
	/**剩余可领悟次数 */
	passivesCount: number
	//magicWeapons: MagicWeapon[]
	/** [0技能位置，] [1：技能信息  0:id： 1.等级，2.符文类型，3：觉醒1，4：觉醒2，5：觉醒3，6：觉醒4，7：觉醒5，9：觉醒6，10：觉醒7，] */
	skills: number[][]
	/** 最强技能  攻击属性，攻击倍数*/
	maxSkills: number[]
	/** 0 [神器位置] 1 [0.神器等级，1，神器星级] */
	artifacts: number[][]
	/** 0 [法宝位置] 1 [0.法宝词缀1 1. 法宝词缀2]*/
	extractions: number[][]
	resonance: number[]
	//roguelikeRecord: RoguelikeRecord
	armsId: number[]
	skillsCd: number[]
	/**0.count 1.award 2.award1 3.five 4.weakAward 5.weakCount 6.暂无 7.type 8.tcount */
	luckDraw: number[]
	/**0 [1-6难度] 1 [0 层级 1 时间] */
	pagoda: number[][]
	/**0.任务id  1.任务状态  2.任务类型  3.进度  4.是否显示Link  5.dataSource */
	mission: number[][]
	/** 0.progress.1 progressMax. 2.CD*/
	rewardMission: any[]
	/**0 引导任务。1.主线任务 ,2.悬赏任务次数*/
	missionMain: number[]
	missionDay: string
	fiveElement: number[]
	/** 0,装备等级,1 攻击类,2 防御类  */
	level: number[][]
	/** 0 大陆 1 幸运值 */
	luck: number[]
	luckday: number[]
	level_pct: number
	/** 0.元神修炼，1.修炼星级 2.元神等级 3.元神灵根 */
	primordial: number[]
	/** 元神技能，0。技能id 1.技能等级，2.技能品质,3技能cd */
	pSkill: number[][]
	/** 元神装备UUID */
	pEquip: string[]
	/** 属性翻倍 */
	pAttrPct: number[]
	/** 临时技能选择 [0.id 1品质] */
	pSkill_: number[][]
	duplicate: any[]
	/** 0.副本等级 [0.金币副本，1.装备材料副本 2.技能材料副本，3.修为副本] 1 完成次数[] */
	duplicateLv: number[][]
	/**0:基础数据统计  1:回收数据统计 2 杀怪数据统计 3 充值统计*/
	statistics: number[][]
	/**0.普通商店，1.每日装备强化商店.2.每日技能强化商店 */
	shop: number[][][]
	shopCount: number[]
	tipTime: number
	monCount: number
	// //购买礼包
	// reward: {
	// 	//赞助
	// 	sponsor: {
	// 		//赞助资格
	// 		qualification: number[]
	// 		//是否领取
	// 		receive: number[]
	// 		//是否赞助奖励
	// 		receive1: number[]
	// 		//新赞助奖励
	// 		newReceive: number[]
	// 		//累计充值奖励
	// 		totalReceive: number[]
	// 		//每日充值奖励
	// 		dayReceive: number[]
	// 	}
	// 	sponsorReceive: number[]
	// 	//充值激昂里
	// 	recharge: number[]
	// 	//每日礼包
	// 	day: number[]
	// 	//每周礼包
	// 	weak: number[]
	// 	//vip礼包
	// 	vip: number[]
	// }

	// brushBoss: {
	// 	count: number
	// 	max: number
	// }
}

export interface 测速 {
	attack: {
		start: number
		count: number
		限制: number
	}
	speed: {
		start: number
		count: number
		限制: number
	}
}

export interface RoguelikeRecord {
	lv: number
	time: number
	round: number
	killMons: []
	killPlayer: []
	other: []
}

export class RoguelikeInfoTMP {
	lv: number
	type: number
	time: number
	isReceive: boolean
	round: number
	roguelikeEffect: {
		randomsEffect: number[]
		count: number
		monCount: number
		freeCount: number
		totalCount: number
		refreshCount: number
	}
	killMons: number[]
	killPlayer: any[]
	skillIds: number[]
	skillCds: number[]
	skillsEffect: number[]
	passives: Passive[]
	loots: []
	constructor() {
		this.lv = 1
		this.type = 0
		this.time = 0
		this.isReceive = false
		this.round = 1
		this.killMons = [0, 0, 0]
		this.roguelikeEffect = {
			randomsEffect: undefined,
			count: 0,
			monCount: 0,
			freeCount: 0,
			totalCount: 0,
			refreshCount: 0
		}
		this.killPlayer = []
		this.skillIds = [0, 0, 0, 0, 0, 0]
		this.skillsEffect = []
		this.loots = []
	}
}

/**
 * 肉鸽属性
 */
export class RoguelikeInfo {
	// level: number
	// type: number
	// randoms: number[]
	// count: number
	// monCount: number
	// freeCount: number
	// totalCount: number
	// randomsCount: number
	// randomSkillsId: number[]
	// randomSkillsIdx: number[]
	// randomSkillsEffect: number[]
	// passives: Passive[]
	// constructor() {
	// 	this.level = 1
	// 	this.type = 0
	// 	this.randoms = undefined
	// 	this.count = 0
	// 	this.monCount = 0
	// 	this.freeCount = 0
	// 	this.totalCount = 0
	// 	this.randomsCount = 0
	// 	this.randomSkillsId = [0, 0, 0, 0, 0, 0]
	// 	this.randomSkillsIdx = []
	// 	this.randomSkillsEffect = []
	// 	this.passives = []
	// }
}

export interface NpcInfo {
	name: string
	unitName: string
	mainMethod: string
	npcType: number
	mapName: string
	mapId: string
	mapX: number
	mapY: number
	appr: number
	flag: number
}

export interface RandomsEffectInfo {
	randoms: number[]
	roguelikeEffects: roguelikeEffect[]
	count: {
		surplus: 0
		level: 0
		pagoda: 0
		monster: 0
		place: 0
		other: 0
	}
}

export interface roguelikeEffect {
	id: number
	type: number
	level: number
	attr1: number
	attr2: number
	attr3: number
}

export interface Effects {
	id: number
	index: number
}

export interface Comprehend {
	count: number
	randoms: number[]
	activatedList: number[]
	activatedMax: number
	/** 0:id,1:等级，2，临时等级 3，是否激活,4 可领悟次数 */
	passives: number[][]
}

export interface ComprehendInfo {
	id: number
	name: string
	pic: number
	value1: number
	value2: number
	value3: number
	typeName: number
	levelUp1: number
	levelUp2: number
	levelUp3: number
	levelMax: number
	info: string
	isPool: number
}

export interface Passive {
	id: number
	level: number
	tmp_lv: number
	isAct: number
}

export interface Abyss {
	damageMax: number
	count: number
	countMax: number
}

export interface ChallengeabyssRank {
	playerID: number
	damageMax: number
}

export interface Challengeabyss {
	rank: number
	count: number
	damage: number
	damageMax: number
}

export interface FiveElement {
	lv: number
	magicNeed: number
	magic_lv: number[]
}

// export interface Statistics {
// 	// roguleLike: {
// 	// 	mon: {
// 	// 		boss: number
// 	// 		elite: number
// 	// 		normal: number
// 	// 	}
// 	// 	player: {
// 	// 		kill: number
// 	// 		death: number
// 	// 	}
// 	// 	count: number
// 	// 	maxTime: number
// 	// }
// 	today: {
// 		world: {
// 			world: number
// 			boss: number
// 			elite: number
// 			normal: number
// 		}
// 		mon: {
// 			world: number
// 			boss: number
// 			elite: number
// 			total: number
// 		}
// 		recov: {
// 			common: number //普通
// 			uncommon: number //精良
// 			rare: number //稀有
// 			epic: number //史诗
// 			legendary: number //传奇
// 			divine: number //非凡(远古)
// 			mythic: number //神话(上古)
// 		}
// 		duplicate: {
// 			abyss: number
// 			dimensional: number
// 			pagoda: number
// 			place: number
// 			challengePlace: number
// 			roguelike: number
// 			fiveRoguelike: number
// 		}
// 		player: {
// 			kill: number
// 			death: number
// 		}
// 	}
// 	mon: {
// 		world: number
// 		boss: number
// 		elite: number
// 		total: number
// 	}
// 	recov: {
// 		common: number //普通
// 		uncommon: number //精良
// 		rare: number //稀有
// 		epic: number //史诗
// 		legendary: number //传奇
// 		divine: number //非凡(远古)
// 		mythic: number //神话(上古)
// 	}
// 	duplicate: {
// 		abyss: number
// 		challengeAbyss: number
// 		dimensional: number
// 		pagoda: number
// 		place: number
// 		challengePlace: number
// 		roguelike: number
// 		fiveRoguelike: number
// 	}
// 	player: {
// 		kill: number
// 		death: number
// 	}
// 	createDate: number
// 	day: number
// 	recharge: number
// }

/**
 export interface Shop {
	time: number
	type: Type[]
}
 */
export interface Day {
	day: number
	weak: number
}

export interface Type {
	item: any[]
	refresh_count: number
	refresh_time: number
}

// export interface Duplicate {
// 	lv: number
// 	name: string
// 	type: number
// 	time: number
// 	num: number
// 	count: number
// 	boss: number
// 	round: number
// 	progress: number
// 	progressMax: number
// 	progress1: number
// 	progressMax1: number
// 	isboss: boolean
// 	isRefresh: boolean
// 	enterTime: number
// 	leaveTime: number
// }

export interface TitleInfo {
	id: number
	type: number
	typeName: string
	name: string
	startPic: number
	endPic: number
}

export interface Name {
	abyss: string
	pagoda: string
	place_normal: string
	place_challenge: string
}

export interface Primordial {
	lv: number
	progress: number
	progressMax: number
	handle: number
	hp: number
	maxHp: number
	dayKillMon: number[]
	totleKillMon: number[]
	xy: number[]
	state: number
	mapId: string
	mapName: string
	mapIndex: number
	mapLevel: number
	time: number
	startTime: number
	endTime: number
	isAct: number
	inBattleTime: number
	deathCount: number
	equip: Equip

	// goldPct: number
	// stonePct: number
	// dustPct: number
	// gold: number
	// stone: number
	// dust: number
}
export class Equip {
	wDress: string //衣服
	wWeapon: string //武器
	wNecklace: string //项链
	wHelmet: string //头盔
	wArmringL: string //左手镯
	wArmringR: string //右手镯
	wRingL: string //左戒指
	wRingR: string //右戒指
	wBelt: string //腰带
	wBoots: string //鞋子
}
export interface PrimordialAttr {
	lv: number
	name: string
	hpmax: number
	hp: number
	damageMin: number
	damageMax: number
	defense: number
	distance: number
	skill: number[]
}

export interface MissionInfo {
	main: number
	mission: Mission[]
	/** 完成悬赏小任务 5个任务完成之后可以领取悬赏奖励 */
	reward: number
	/** 是否已经完成悬赏任务 */
	isReward: number
	lastTime: number
	updateDay: number
	updateWeak: number
	count: Count
}

export interface Mission {
	id: number
	content: string
	progress: number
	progressMax: number
	dataSource: string
	state: number
	type: number
	autoComplete: number
	isShow: number
}

export interface Count {
	/** 悬赏总次数 */
	tReward: number
	/** 每日悬赏次数 */
	dReward: number
	/** 总奇遇次数 */
	tAdventure: number
	/** 每日奇遇次数 */
	dAdventure: number
}

export interface FivePagoda {
	layer: number
	count: number
	dayCount: number
	reward: number[]
}

export interface mapInfoEx {
	id: number
	chapter: number
	mapId: string
	level: number
	//primordialNum: number
	mapName: string
	bossNum: number
	playerNum: number
	clearTime: number
	brushTime: number
	needClear: boolean
	needBrush: boolean
}

export interface MapLevelInfo {
	readonly id: number
	readonly chapter: number
	readonly level: number
	readonly mapId: string
	readonly mapName: string
	readonly mapX: number
	readonly mapY: number
	readonly monList: string[]
	readonly boss: string
	readonly monNums: number
	readonly needLv: number
	readonly maxLv: number
	readonly exp: number
	readonly items: string[]
	items1: string[]
	readonly npc: string
	readonly loots: string
	readonly Illustrated: number
	readonly damageCount: number
	地图对象: mapInfo[]
}

// export interface 地图对象 {

// }

export interface mapInfo {
	mapId: string,
	map: TEnvirnoment,
	bossMap: TEnvirnoment,
	bossName: string,
	最低伤害: string,
	普通怪物位置: string,
	BOSS位置: string,
	Npc位置: string,
	玩家位置: string,
	Boss数量: number,
	清理怪物时间: number,
	刷新怪物时间: number,
	玩家数量: number
}

export interface RoguelikeMap {
	readonly lv: number
	readonly needscore: number
	readonly max: number
	readonly mapName: string
	readonly level: number
	readonly isNpc: number
	readonly monlv1: number
	readonly monlv2: number
	readonly monlv3: number
	readonly monlv4: number
	readonly monlv5: number
	readonly monScore1: number
	readonly monScore2: number
	readonly monScore3: number
	readonly monScore4: number
	readonly monScore5: number
}

export interface RoguelikeExp {
	readonly lv: number
	readonly scoreMax: number
}
export interface RoguelikeMapInfo {
	mapId: string
	lv: number
	rankInfo: RoguelikeRankInfo[]
	time: number
	refresh: number
	clearTime: number
	needClear: boolean
	needBrush: boolean
}

export interface RoguelikeRankInfo {
	playerId: number
	playerName: string
	score: number
	totelscore: number
	killNum: number
	killMon: number
	killBoss: number
	passive: number
	rank: number
}

export interface Pagoda {
	layer: number //当前章节关卡数量
	time: number //上次战斗时间保存
	count: number //当前阶段最大层数
}

export interface SecretPlace {
	normal: Normal
	challenge: Challenge
}

export interface Challenge {
	lv: number
	time: number
	rank: number
	count: number
}

export interface Normal {
	level: number
	count: number
	dayCount: number
}

export interface LuckDraw {
	count: number
	award: number
	award1: number
	five: number
	weakAward: number
	weakCount: number
	loveCount: number
	type: number
	tcount: number
}

export interface Resonance {
	lv: number
	flag: boolean
	tmp_lv: number
	max_lv: number
	sum_max: number //共鸣列表最大数量
	list: number[]
	magics_idx: any[]
}

export interface Hp {
	lv: number
	pct: number
	cd: number
	cd_time: number
}

export interface Cd {
	cd: number
	time: number
}

export interface Flag {
	mission: number
	magic: number
	statis: number
}

export interface DropConfig {
	readonly idx: string
	readonly name: string
	readonly group_idx: number
	readonly count_min: number
	readonly count_max: number
	readonly group_name: string
	readonly bag_type: number
	readonly bag_id: string
	readonly quality: number
	readonly bag_min: number
	readonly bag_max: number
	readonly probability: number
}

export type MailInfo = {
	mailId: number
	playerId: number
	fromInfo: string
	subject: string
	content: string
	date: number
	state: number
	items: string
	equips: string
	need: string
}

// export interface SkillIndex {
// 	id: number
// 	cd_end: number
// }

export interface SkillEx {
	id: number
	lv: number
	rune: number
	quality: number
}

export interface Skill {
	id: number
	idx: number
	name: string
	pic: number
	job: number
	lv: number
	cd: number
	spell: number
	startEffect: number
	spellCastingTime: number
	damageMin: string
	damageMax: string
	skillType: number
	damagePower: number
	realPower: number
	power: number
	arg: number[]
	type: number
	quality: number[]
	count: number
	skillCount: string
	/** 手动激活 */
	isAct: number
	range: number
	awaken: number[]
	rune: number[][] //符文
}

export interface WeaponSkill {
	id: number
	cd: number
	type: number
	range: number
	baseDamage: number
	damagePower: number
	arg: number[]
}

export type SkillConfig = {
	//序号
	readonly idx: number
	//编号
	readonly id: number
	readonly name: string
	job: number
	readonly pic: number
	readonly cd: number
	readonly spell: number
	readonly startEffect: number
	readonly spellCastingTime: number
	readonly damageMin: number
	readonly damageMax: number
	readonly hp: number
	readonly attr: number
	skillType: number
	readonly power: number
	readonly arg1: number
	readonly arg2: number
	readonly arg3: number
	readonly type: number
	readonly quality: number
	readonly range: number
	readonly rangeType: string
	readonly isPool: number
	readonly info: string
	readonly effect1: string
	readonly effect2: string
	readonly effect3: string
	readonly awaken_info: string
	readonly awaken_info1: string
	readonly awaken1: string
	readonly awaken2: string
	readonly awaken3: string
}
export type artifactInfo = {
	readonly id: number
	readonly name: string
	readonly display: string
	readonly need: number
	readonly max: number
	readonly outway: number
	readonly pic: number
	readonly type: number
	readonly info0: string
	readonly info1: string
	readonly info2: string
	readonly attr0: number
	readonly attr1: number
	readonly attr2: number
	readonly upgradeInfo: string
	readonly effectInfo0: string
	readonly effectInfo1: string
	readonly base: number
	readonly upgrade: number
	readonly upgradeIndex: number
	readonly realm: number
	readonly source: string
	readonly isUpgrade: number
	readonly isPool: number
}
export type MagicWeaponConfig = {
	readonly id: number
	readonly name: string
	readonly pic: number
	readonly type: number
	readonly source: number
	readonly mapID: number
	readonly boss: string
	readonly map: string
	readonly level: number
	readonly isPool: number
}
export type mapRoute = {
	name: string
	mapId: string
	type: number
	intoRoutes: string
	outRoutes: string
}

export class BattleState {
	isInBattle: boolean
	inBattleTime: number
	//连杀数量
	consecutiveKills: number
	constructor() {
		this.isInBattle = false
		this.inBattleTime = 0
		this.consecutiveKills = 0
	}
}

export type MagicWeapon = {
	id: number
	name: string
	lv: number
	dc: number
	hc: number
	quality: number
	fragments: number
}

export type affixInfo = {
	idx: number
	outway: number
	mons: string
	name: string
	desc: string
	type: number
	min: number
	max: number
	job: number
	isPool: number
}

export type affixName = {
	idx: number
	outway: number
	name: string
	type: number
	job: number
}

export type affixMons = {
	outway: number[]
	mons: string
}

export type mapEventInfo = {
	name: string
	time: number
	level: number
	region: number
	desc: string
	isDeath: boolean
	isLook: string
}

export type BuffInfo = {
	id: number
	buffId: number
	type: number
	pic: number
	data: string
	cd: number
	count: number
	timeEnd: number
	isTime: number
	info: string
	infoCount: number
	isPool: number
}

// export type MissionInfo = {
// 	readonly aKind: number
// 	readonly id: string
// 	readonly subject: string
// 	readonly content: string
// 	readonly rewards: string
// 	readonly needType: number
// 	readonly needName: string
// 	readonly needMax: number
// 	readonly needQuality: number
// 	readonly limit: number
// 	readonly targetNPC: number
// 	readonly autoComplete: boolean
// 	readonly state: number
// 	readonly key: string
// 	readonly value: string
// 	readonly drop: string
// 	readonly drop_pr: number
// 	readonly next_mission: number
// }
export type jobSkillInfo = {
	idx: number
	job: number
	name: string
	pic: number
	attr1: string
	attr2: string
	passive: string
	passivePic: number
	skill0: string
	skill1: string
	skill2: string
	skill3: string
	skill4: string
	skill5: string
	desc: string
}

export type MissionConfig = {
	id: number
	type: number
	subject: string
	content: string
	rewards: string
	needMax: number
	state: number
	key: string
	value: string
	dataSource: number
	drop: string
	dropPro: number
	autoComplete: number
	nextMission: number
	needLevel: number
	rewardIndex: number[]
	linkHint: string
}

export interface MonAttr {
	readonly lv: number
	readonly hp: number
	readonly dc: number
	readonly ac: number
	readonly tc: number
	readonly pc: number
}

export interface Awaken {
	readonly lv: number
	readonly damage: number
	readonly hp: number
	readonly attr: number
}

export interface FiveAttrConfig {
	readonly lv: number
	readonly damageMin: number
	readonly damageMax: number
	readonly mpRenew: number
	readonly cd: number
	readonly sum: number
	readonly range: number
	readonly five: number
	readonly need: number
	readonly gold: number
}

export interface AwakenConsume {
	readonly lv: number
	readonly field_1: number
	readonly field_2: number
	readonly field_3: number
}

export class ExAttr {
	攻击: string
	魔法: string
	道术: string
	防御: string
	魔御: string
	破甲: string
	破魔: string
	伤害减免: number
	暴击抵抗: number
	暴击伤害减少: number
	近战减少: number
	远程减少: number
	近战减免: number
	远程减免: number
	命中几率: number
	躲闪几率: number
	暴击几率: number
	暴击伤害: number
	金系减少: number
	木系减少: number
	水系减少: number
	土系减少: number
	火系减少: number

	金系减免: number // 金系防御百分比
	木系减免: number // 木系防御百分比
	水系减免: number // 水系防御百分比
	土系减免: number // 土系防御百分比
	火系减免: number // 火系防御百分比

	中毒: number //中毒
	吸血: number //吸血

	怪物类型: number //怪物类型

	constructor() {
		this.攻击 = `0`,
			this.魔法 = `0`,
			this.道术 = `0`,
			this.破甲 = `0`,
			this.破魔 = `0`,
			this.防御 = `0`,
			this.魔御 = `0`,
			this.伤害减免 = 0,
			this.暴击抵抗 = 0,
			this.近战减少 = 0,
			this.远程减少 = 0,
			this.近战减免 = 0,
			this.远程减免 = 0,
			this.命中几率 = 0,
			this.躲闪几率 = 0,
			this.暴击几率 = 0,
			this.暴击伤害 = 0,
			this.暴击伤害减少 = 0,
			this.金系减少 = 0, // 金系防御百分比
			this.木系减少 = 0, // 木系防御百分比
			this.水系减少 = 0, // 水系防御百分比
			this.土系减少 = 0, // 土系防御百分比
			this.火系减少 = 0, // 火系防御百分比
			this.金系减免 = 0, // 金系防御百分比
			this.木系减免 = 0, // 木系防御百分比
			this.水系减免 = 0, // 水系防御百分比
			this.土系减免 = 0, // 土系防御百分比
			this.火系减免 = 0, // 火系防御百分比
			this.中毒 = 0, //中毒
			this.吸血 = 0, //吸血
			this.怪物类型 = 0 //怪物类型
	}
}

export interface dimensionalMap {
	boss: any[]
	events: dimensionalEvent[][]
}
export interface dimensionalEvent {
	id: string
	world: {
		lv: number
		skillNum: string
		target: string
		isDead: number
		lastTime: number
	}
	boss: dimensionalBoss[]
	bossCount: number
	lv: number
	primordialNum: number
	arg1: any[]
}

export interface dimensionalBoss {
	isDead: number
	lastTime: number
}

export const enum buffType {
	attributes,
	skill,
	change
}

export const enum ItemEventType {
	other, //其他
	pick, //拾取物品
	give, //给物品
	strong = 'strong', //强化
	wear = 'wear', //装备
	magic_upgrade = 'magic_upgrade', //法宝升级
	magic_recovery = 'magic_recovery', //法宝回收
	recovery = 'recovery', //回收
	dram = 'dram' //抽卡
}

export const enum LootsColors {
	grey = 230,
	green = 250,
	bule = 154,
	purple = 253,
	yellow = 251,
	orange = 70,
	red = 58,
	white = 246
}

export const enum LootsColors_ {
	_230,
	_250,
	_154,
	_253,
	_251,
	_70,
	_58,
	_246
}


export interface Fetter {
	type: number
	pic: number
	info: string
}

export type CodeKey = {
	readonly keyId: number
	readonly codeKey: string
	readonly name: string
	readonly keyType: number
	readonly reward: string
	readonly valid: number
	readonly generatedCount: number
	readonly startTime: string
	readonly endTime: string
	readonly mailTemplateId: string
	readonly otherLimit: string
}
export type giftPack = {
	readonly idx: number
	readonly type: number
	readonly packName: string
	readonly packImg: number
	readonly items: string[]
	readonly currency: number
	readonly currencyType: number
	readonly limit: number
}
export type MonInfo = {
	readonly map: string
	readonly mons: string
	readonly lv: number
	readonly tag: number
	readonly item_lv: number
	readonly attrOffx: number
}

// export type BossBurshInfo = {
// 	readonly type: number
// 	readonly id: number
// 	readonly mapId: string
// 	readonly name: string
// 	x: number
// 	y: number
// 	readonly interval: number
// 	lastTime: number
// 	readonly tag: number
// 	readonly lv: number
// 	readonly item_lv: number
// 	readonly five: number
// }

// export type BossInfo = {
// 	readonly id: number
// 	readonly mapId: string
// 	readonly name: string
// 	readonly lv: number
// 	readonly itemLv: number
// 	boss: bossBrushInfo[]
// 	bossTag: number
// }

export type eventMapNpcInfo = {
	level: number
	handle: number
	createTime: number
	interval: number
	isLook: string
}

export type mapBossInfo = {
	mapId: string
	level: number
	lvMin: number
	lvMax: number
	chapter: number
	bossList: bossBrushInfo[]
}
export type bossBrushInfo = {
	handle: number
	time: number
	deathTime: number
	interval: number
	kill: number
	type: number
	tag: number
	mapX: number
	mapY: number
	range: number
	isLook: string
	name: string
}

export type skillRune = {
	id: number
	name: string
	type: number
	pic: number
	quality: number
	attr1: number
	attr2: number
	attr3: number
	levelMax: number
	info: string
	isPool: number
}
export type MonAttrInfo = {
	readonly lv: number
	exp: number
	attr: string
	attak: string
	hp: string
	pct: number
	skillcount: number

}

export type MonAttrInfoFun = {
	lv: number
	exp: number
	hp: string
	attr: string
	attak: string
}

export type PagodaInfo = {
	readonly idx: number
	readonly name: string
	readonly map_id: string
	readonly entrance_xy: string
	readonly next_xy: string
	readonly reward_xy: string
	readonly count: number
	readonly mons: string
	readonly mons_xy: string
	readonly normal_sum: number
	readonly elite_sum: number
	readonly boss_map: string
	readonly boss_reward_xy: string
	readonly boss: string
	readonly need_item: string
	readonly initialLlv: number
	readonly attrOffx: number
	readonly divisor: number
	readonly item_lv: number
}


export type FivePagodaInfo = {
	readonly idx: number
	readonly name: string
	readonly map_id: string
	readonly entrance_xy: string
	readonly mons_xy: string
	readonly next_xy: string
	readonly reward_xy: string
	readonly count: number
}

export type PrimordialConfig = {
	readonly lv: number
	readonly exp: number
	readonly attr: number
	readonly renew: number
}

export type PrimordialOffline = {
	readonly lv: number
	readonly gold: number
	readonly exp: number
	readonly primordial: number
	readonly stone: number
	readonly dust: number
	readonly essence: number
	readonly five: number
	readonly field_1: number
	readonly field_2: number
	readonly field_3: number
	readonly equipment_1: number
	readonly equipment_2: number
	readonly equipment_3: number
	readonly equipment_4: number
	readonly equi_6: number
	readonly equi_7: number
	readonly equi_8: number
}

export type VipConfig = {
	readonly lv: number
	readonly max: number
	readonly gold: number
	readonly stone: number
	readonly dust: number
	readonly hangUp: number
	readonly bagMax: number
	readonly magicBag: number
	readonly hangUpLimit: number
}

export type MagicWeapoExp = {
	readonly lv: number
	readonly gold: number
	readonly stone: number
	readonly dust: number
}

export type PlayerBaseAttr = {
	readonly lv: number
	readonly exp: number
	readonly damageMin: number
	readonly damageMax: number
	readonly attr: number
}

export type BaseAttr = {
	readonly lv: number
	readonly damageMin: number
	readonly damageMax: number
	readonly attr: number
}

export type MonBaseAttr = {
	readonly lv: number
	readonly exp: number
	readonly monHp: Decimal
	readonly monDc: Decimal
	readonly monDef: Decimal
}

export type MagicWeaponAttr = {
	readonly lv: number
	readonly hp: number
	readonly exp: number
	readonly attr: number
	readonly damageMin: number
	readonly damageMax: number
}

export type ShopConfig = {
	readonly idx: number
	readonly type: number
	readonly name: string
	readonly sum: number
	readonly price: number
	readonly pool: number
	readonly currency: number
	readonly count: number
	readonly where: number
	readonly index: number
	readonly isBatch: number
}

export type Shop = {
	time: number
	type: [
		{
			//0 idx: number
			//1	isPurchase: number
			//2 count: number
			item: number[][]
			refresh_count: number
			refresh_time: number
		},
		{
			item: number[][]
			refresh_count: number
			refresh_time: number
		}
	]
}

export type ShopInfo = {
	idx: number
	isPurchase: number
	count: number
}

export type DuplicateInfo = {
	readonly name: any
	readonly type: number
	readonly time: number
	readonly num: number
	readonly count: number
	readonly boss: number
	round: number
	progress: number
	readonly progressMax: number
	readonly isboss: boolean
}

export type duplicateMap = {
	readonly idx: string
	readonly name: string
	readonly type: number
	readonly join: string
}

export interface equipStrongConsume {
	readonly lv: number
	readonly gold: number
	readonly item1: number
	readonly item2: number
	readonly item3: number
	readonly item4: number
}

export interface baseAttrsConfig {
	readonly lv: number
	readonly baseAttr: number
	readonly baseHp: number
	readonly exp: number
	readonly hp: number
	readonly monAttack: number
	readonly monHP: number
	readonly monExp: number
	readonly mapExp: number
}

export interface loots {
	readonly type: number
	readonly level: number
	readonly name: string
}

export type pagodaReward = {
	readonly layer: number
	readonly info: string
	readonly diamondBind: number
	readonly gold: number
	readonly dust: number
	readonly reel: number
	readonly fragment_1: number
}

export type fivePagodaReward = {
	readonly layer: number
	readonly gold: number
	readonly dust: number
	readonly stone: number
	readonly diamond: number
	readonly fiveMagic_0: number
	readonly fragment_1: number
	readonly field_2: number
	readonly field_3: number
	readonly five_reel: number
}

export interface RankRewardInfo {
	readonly rank: number
	readonly item_sum: number
	readonly gold: number
	readonly diamond: number
	readonly five: number
	readonly dust: number
	readonly stone: number
	readonly 随机符文: number
	readonly equi_6: number
	readonly equi_7: number
	readonly equi_8: number
	readonly 修为石: number
}

export interface PassiveConfig {
	id: number
	name: string
	type: number
	pic: number
	quality: number
	attr1: number
	attr2: number
	attr3: number
	levelUp1: number
	levelUp2: number
	levelUp3: number
	levelMax: number
	info: string
}

export interface FiveMagicConfig {
	readonly type: number
	readonly level: number
	readonly cd: number
	readonly sum: number
	readonly range: number
	readonly mpRenew: number
	readonly power: number
	readonly info: string
	readonly info1: string
	readonly info2: string
	readonly info3: string
	readonly info4: string
	readonly info5: string
}

export interface FiveMagic {
	type: number
	level: number
	attrMin: number
	attrMax: number
	cd: number
	cd_end: number
	sum: number
	range: number
	mpRenew: number
	power1: number
	power2: number
	power3: number
	power4: number
	power41: number
}

export interface primordials {
	//handle: number
	actor: TActor
}

