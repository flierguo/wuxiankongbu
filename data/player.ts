import { game_data } from './game'
import { BattleState, FivePagodaInfo, Info, MagicWeapon, Passive, RoguelikeInfoTMP } from './type'

export const getInfo = (player: TPlayObject): Info => player.V.info

//塔
// export const getPagodaByIdx = (player: TPlayObject, idx = getInfo(player).pagoda.main): PagodaInfo => game_data.pagodaInfo.find(obj => obj.idx == idx)

export const getfivePagodaByIdx = (type): FivePagodaInfo => game_data.fivePagodaInfo.find(obj => obj.idx == type)

//掉落列表
export const getLoots = (player: TPlayObject) => (player.R['loots'] ??= [])
//不重置的属性
export const getDynamicAttr = (player: TPlayObject): DynamicAttr => player.R['dynamicAttr']
//玩家属性
export const getPlayerAttr = (player: TPlayObject): PlayerAttr => player.R['attrs']

export const getPrimordialAttr = (player: TPlayObject): ItemAttr => player.R['primordialAttr']

export const getRealmAttr = (player: TPlayObject): RealmAttr => player.R['realm']
//装备属性
export const getItemAttr = (player: TPlayObject): ItemAttr => player.R['itemAttrs']
//技能属性
export const getSkillAttr = (player: TPlayObject): SkillAttr => player.R['skillAttr']
//法宝属性
export const getMagicAttr = (player: TPlayObject): MagicAttr => player.R['magicAttrs']
//羁绊属性
export const getFetterAttr = (player: TPlayObject): FetterAttr => player.R['fetterAttrs']
//五行属性
export const getFiveAttr = (player: TPlayObject): FiveAttr => player.R['fiveAttrs']
//修为属性
export const getPassiveAttr = (player: TPlayObject): PassiveAttr => player.R['passiveAttrs']
//职业属性
export const getJobAttr = (player: TPlayObject): PassiveAttr => player.R['jobAttrs']

// export const getPrimordialAttr = (player: TPlayObject): PrimordialAttr => player.R['primordialAttr']
//元神属性
export const getPrimordialMonAttr = (player: TPlayObject): PrimordialAttr => player.R['primordialMonAttr']
//轮回属性
//export const getRoguelikeAttr = (player: TPlayObject): RoguelikeAttr => player.R['roguelikeAttrs']
//轮回临时信息
export const getRoguelikeInfoTMP = (player: TPlayObject): RoguelikeInfoTMP => player.R['roguelikeInfoTMP']
//获得法宝缓存
export const getPlayerMagic = (player: TPlayObject, magicId: number): MagicWeapon => player.R['magic' + magicId]

export const getBattleState = (player: TPlayObject): BattleState => player.R['battleState']

// export const setArmSkills = (player: TPlayObject) => (player.R['armSkills'] = getInfo(player).armsId)

// export const getArmSkills = (player: TPlayObject): number[] => player.R['armSkills']

// export class PlayerDate {
// 	player: TPlayObject
// 	constructor(player: TPlayObject) {
// 		this.player = player
// 	}
// 	get battleState() {
// 		return this.player.R["battleState"]
// 	}
// 	set battleState(val) {
// 		this.player.R["battleState"] = val
// 	}
// }

export class Magic {
	id: number
	name: string
	lv: number
	type: number
	cd: number
	strong: number
	quality: number
	spell: number
	powerMin: number
	powerMax: number
	powerPct: number
	powerPct1: number
	isAct: number
	count: number
	start: number
	info: string
	effect1: string
	effect2: string
	effect3: string
	constructor() { }
}

export class PrimordialAttr {
	damageMin: number
	damageMax: number
	hp: number // 生命值
	dc: number // 攻击
	acb: number // 破甲
	ac: number // 护甲
	ps: number // 体质
	hpRenew: number

	constructor() {
		this.damageMin = 0
		this.damageMax = 0
		this.hp = 0
		this.dc = 0
		this.acb = 0
		this.ac = 0
		this.ps = 0
		this.hpRenew = 0
	}
}

export class FiveAttr {
	hpPct: number // 生命值提升百分比
	hpRenewPct: number //生命恢复效果百分比

	mpRenew: number // 内力恢复
	mpRenewPct: number // 内力恢复

	meleeDamagePct: number // 近战法宝伤害百分比
	meleeReduction: number // 近战防御百分比
	remoteDamagePct: number // 远程法宝伤害
	remoteReduction: number // 远程防御百分比

	/** 近战吸血 */
	meleeSuckBoold: number
	/**真实伤害 */
	realDamagePct: number
	/** 百分比伤害反弹 */
	reboundDamagePct: number

	/**暴击回蓝 */
	critMp: number

	metalPct: number // 金系伤害加成
	woodPct: number // 木系伤害加成
	waterPct: number // 水系伤害加成
	firePct: number // 火系伤害加成
	earthPct: number // 土系伤害加成

	quality0: number //金系品质
	quality1: number //木系品质
	quality2: number //水系品质
	quality3: number //火系品质
	quality4: number //土系品质

	constructor() {
		this.meleeDamagePct = 0
		this.remoteDamagePct = 0
		this.hpRenewPct = 0
		this.mpRenew = 0
		this.mpRenewPct = 0
		this.hpPct = 0
		this.remoteReduction = 0
		this.meleeReduction = 0
		this.reboundDamagePct = 0
		this.realDamagePct = 0
		this.meleeSuckBoold = 0
		this.critMp = 0

		this.metalPct = 0
		this.woodPct = 0
		this.waterPct = 0
		this.earthPct = 0
		this.firePct = 0

		this.quality0 = 0
		this.quality1 = 0
		this.quality2 = 0
		this.quality3 = 0
		this.quality4 = 0
	}
}

export class FetterAttr {
	atkDefense: number // 伤害减免
	hpPct: number // 生命值提升百分比
	suckBoold: number //吸血

	atkPct: number // 基础伤害加成
	mpMax: number // 内力值上限
	mpRenew: number // 内力恢复

	poisoningPct: number //中毒效果
	hpRenewPct: number //恢复效果
	petPct: number //宠物强化

	metalPct: number // 金系伤害加成
	woodPct: number // 木系伤害加成
	waterPct: number // 水系伤害加成
	earthPct: number // 土系伤害加成
	firePct: number // 火系伤害加成

	metalDefPct: number // 金系防御百分比
	woodDefPct: number // 木系防御百分比
	waterDefPct: number // 水系防御百分比
	earthDefPct: number // 土系防御百分比
	fireDefPct: number // 火系防御百分比

	s_metalPct: number // 金系相生加成
	s_woodPct: number // 木系相生加成
	s_waterPct: number // 水系相生加成
	s_earthPct: number // 土系相生加成
	s_firePct: number // 火系相生加成

	k_metalPct: number // 金系相克加成
	k_woodPct: number // 木系相克加成
	k_waterPct: number // 水系相克加成
	k_earthPct: number // 土系相克加成
	k_firePct: number // 火系相克加成

	constructor() {
		this.hpPct = 0
		this.atkDefense = 0
		this.suckBoold = 0
		this.hpRenewPct = 0
		this.poisoningPct = 0
		this.petPct = 0
		this.mpRenew = 0
		this.mpMax = 0
		this.atkPct = 0

		this.metalPct = 0
		this.woodPct = 0
		this.waterPct = 0
		this.earthPct = 0
		this.firePct = 0

		this.metalDefPct = 0
		this.woodDefPct = 0
		this.waterDefPct = 0
		this.earthDefPct = 0
		this.fireDefPct = 0

		this.s_metalPct = 0
		this.s_woodPct = 0
		this.s_waterPct = 0
		this.s_earthPct = 0
		this.s_firePct = 0

		this.k_metalPct = 0
		this.k_woodPct = 0
		this.k_waterPct = 0
		this.k_earthPct = 0
		this.k_firePct = 0
	}
}
export class SkillAttr {
	mpMax: number // 内力值上限
	mpPct: number // 内力值提升百分比
	hpRenew: number // 生命恢复
	hpRenewPct: number //生命恢复效果百分比
	mpRenew: number // 内力恢复
	atkPct: number // 攻击百分比加成
	atkDefense: number // 伤害减免
	meleeDamage: number // 近战法宝伤害
	meleeDamagePct: number // 近战法宝伤害百分比
	remoteDamage: number // 远程法宝伤害
	defense: number //护甲属性加成
	remoteDamagePct: number // 远程法宝伤害

	remoteReduction: number // 远程防御百分比
	meleeReduction: number // 近战防御百分比

	metalPct: number // 金系加成
	woodPct: number // 木系加成
	waterPct: number // 水系加成
	earthPct: number // 土系加成
	firePct: number // 火系加成

	metalDefPct: number // 金系防御百分比
	woodDefPct: number // 木系防御百分比
	waterDefPct: number // 水系防御百分比
	earthDefPct: number // 土系防御百分比
	fireDefPct: number // 火系防御百分比

	poisoningPct: number //中毒效果提升
	magic25_Def: number
	magic84_hp: number
	magic84_Atk: number
	magic84_Def: number
	magic84_Crit: number

	magic89_hp: number

	sult701: number
	sult711: number
	sult721: number
	/** 近战吸血 */
	meleeSuckBoold: number
	/** 法术吸血 */
	remoteSuckBoold: number
	constructor() {
		this.defense = 0
		this.atkPct = 0
		this.mpPct = 0
		this.hpRenew = 0
		this.hpRenewPct = 0
		this.atkDefense = 0
		this.meleeDamage = 0
		this.meleeDamagePct = 0

		this.remoteDamage = 0
		this.remoteDamagePct = 0

		this.meleeReduction = 0
		this.remoteReduction = 0

		this.metalPct = 0
		this.woodPct = 0
		this.waterPct = 0
		this.earthPct = 0
		this.firePct = 0

		this.metalDefPct = 0
		this.woodDefPct = 0
		this.waterDefPct = 0
		this.earthDefPct = 0
		this.fireDefPct = 0

		this.mpMax = 0
		this.mpRenew = 0

		this.poisoningPct = 0
		this.magic25_Def = 0
		this.magic84_hp = 0
		this.magic84_Atk = 0
		this.magic84_Def = 0
		this.magic84_Crit = 0
		this.magic89_hp = 0

		this.meleeSuckBoold = 0
		this.remoteSuckBoold = 0

		this.sult701 = 0
		this.sult711 = 0
		this.sult721 = 0
	}
}
export class MagicAttr {
	生命值: number // 生命值
	攻击: number
	力量: number // 攻击
	精准: number
	抵抗: number
	敏捷: number
	根骨: number

	破甲: number // 破甲
	护甲: number // 护甲
	体质: number // 体质

	金系伤害百分比: number
	木系伤害百分比: number
	水系伤害百分比: number
	火系伤害百分比: number
	土系伤害百分比: number

	dcPct: number //攻击百分比
	acPct: number //护甲百分比
	psPct: number //体质百分比
	acbPct: number //破甲百分比
	hpRenewAttrPct: number //恢复属性百分比
	hpPct: number // 生命值提升百分比
	suckBoold: number //吸血
	mpMax: number // 内力值上限
	mpPct: number // 内力值提升百分比
	hpRenew: number // 生命恢复
	hpRenewPct: number //生命恢复效果百分比
	mpRenew: number // 内力恢复
	atkPct: number // 攻击百分比加成
	atkDefense: number // 伤害减免
	meleeDamage: number // 近战法宝伤害
	meleeDamagePct: number // 近战法宝伤害百分比
	remoteDamage: number // 远程法宝伤害
	remoteDamagePct: number // 远程法宝伤害
	remoteReduction: number // 远程防御百分比
	meleeReduction: number // 近战防御百分比

	metalPct: number // 金系加成
	woodPct: number // 木系加成
	waterPct: number // 水系加成
	earthPct: number // 土系加成
	firePct: number // 火系加成

	metalDefPct: number // 金系防御百分比
	woodDefPct: number // 木系防御百分比
	waterDefPct: number // 水系防御百分比
	earthDefPct: number // 土系防御百分比
	fireDefPct: number // 火系防御百分比

	poisoningPct: number //中毒效果提升

	critDef: number // 暴击抵抗率

	attrAddPro: number

	attrAdd: number
	/**战士技能数量 */
	job0SkillNum: number
	job1SkillNum: number
	job2SkillNum: number

	/**武技技能伤害加成 */
	skill1: number
	/**功法技能伤害加成 */
	skill2: number
	/**身法技能伤害加成 */
	skill3: number
	/**心法技能伤害加成 */
	skill4: number
	/**神通技能伤害加成 */
	skill5: number
	/**绝技技能伤害加成 */
	skill6: number
	/** 宠物属性 */
	petPct: number

	/**经验加成 */
	exp: number

	/**金币加成 */
	gold: number

	/**爆率加成*/
	probability: number

	magic15: number
	magic20: number
	magic21: number
	magic22: number
	magic23: number

	constructor() {
		this.生命值 = 0
		this.攻击 = 0
		this.力量 = 0
		this.精准 = 0
		this.抵抗 = 0
		this.敏捷 = 0
		this.根骨 = 0
		this.护甲 = 0
		this.破甲 = 0
		this.体质 = 0

		this.金系伤害百分比 = 0
		this.木系伤害百分比 = 0
		this.水系伤害百分比 = 0
		this.火系伤害百分比 = 0
		this.土系伤害百分比 = 0
		this.atkPct = 0
		this.dcPct = 0
		this.acPct = 0
		this.hpPct = 0
		this.mpPct = 0
		this.psPct = 0
		this.acbPct = 0
		this.petPct = 0
		this.hpRenewAttrPct = 0
		this.hpRenew = 0
		this.hpRenewPct = 0
		this.atkDefense = 0
		this.suckBoold = 0
		this.meleeDamage = 0
		this.meleeDamagePct = 0

		this.remoteDamage = 0
		this.remoteDamagePct = 0

		this.meleeReduction = 0
		this.remoteReduction = 0

		this.metalPct = 0
		this.woodPct = 0
		this.waterPct = 0
		this.earthPct = 0
		this.firePct = 0

		this.metalDefPct = 0
		this.woodDefPct = 0
		this.waterDefPct = 0
		this.earthDefPct = 0
		this.fireDefPct = 0

		this.mpMax = 0
		this.mpRenew = 0

		this.poisoningPct = 0
		this.attrAddPro = 0
		this.attrAdd = 0
		this.critDef = 0
		this.job0SkillNum = 0
		this.job1SkillNum = 0
		this.job2SkillNum = 0
		this.skill1 = 0
		this.skill2 = 0
		this.skill3 = 0
		this.skill4 = 0
		this.skill5 = 0
		this.skill6 = 0
		this.probability = 0
		this.magic15 = 0
		this.magic20 = -1
		this.magic21 = -1
		this.magic22 = -1
		this.magic23 = -1
		this.exp = 0
		this.gold = 0
	}
}

export class primordialAttr {
	damageMin: number // 最小伤害
	damageMax: number // 最大伤害
	dc: number // 攻击
	acb: number // 破甲
	hp: number // 生命值
	mp: number // 内力
	ac: number // 护甲
	ps: number // 体质
	hpRenew: number // 生命恢复

	constructor() {
		this.damageMin = 0
		this.damageMax = 0
		this.hp = 0
		this.mp = 0
		this.dc = 0
		this.ac = 0
		this.acb = 0
		this.ps = 0
		this.hpRenew = 0
	}
}

export class ItemAttr {
	攻击: string
	体质: string
	防御: string
	魔法: string
	魔御: string
	道术: string

	伤害下限: string
	伤害上限: string

	生命值: string

	力量: number
	破甲: number
	护甲: number
	根骨: number
	全能: number

	装备攻击百分比: number
	装备魔法百分比: number
	装备道术百分比: number
	装备体质百分比: number
	装备防御百分比: number
	装备魔御百分比: number

	攻击属性: number
	魔法属性: number
	道术属性: number
	体质属性: number
	防御属性: number
	魔御属性: number

	攻击百分比: number
	魔法百分比: number
	道术百分比: number
	体质百分比: number
	防御百分比: number
	魔御百分比: number
	怪物伤害: number
	首领伤害: number
	怪物法术伤害: number
	怪物物理伤害: number
	怪物真实伤害: number
	首领真实伤害: number
	怪物物理真伤: number
	怪物法术真伤: number
	怪物五行伤害: number
	怪物金系伤害: number
	怪物木系伤害: number
	怪物水系伤害: number
	怪物火系伤害: number
	怪物土系伤害: number
	怪物战士类伤害: number
	怪物法师类伤害: number
	怪物道士类伤害: number
	怪物战士伤害: number
	怪物剑魂伤害: number
	怪物天罡伤害: number
	怪物法师伤害: number
	怪物御剑伤害: number
	怪物元素伤害: number
	怪物道士伤害: number
	怪物阵法伤害: number
	怪物诡道伤害: number
	刺杀剑法: number
	烈火剑法: number
	开天斩: number
	横扫千军: number
	裂空斩: number
	万剑归宗: number
	水月斩: number
	十字斩: number
	逐日剑法: number
	回旋斩: number
	金色弯刀: number
	无敌斩: number
	烈焰斩: number
	利剑突刺: number
	龙影剑法: number
	旋风斩: number
	降魔杵: number
	虎啸山河: number
	火球术: number
	冰咆哮: number
	流星火雨: number
	寒冰冲击: number
	火焰陨石: number
	九龙神火: number
	剑气诀: number
	立剑诀: number
	火雷剑: number
	冰剑诀: number
	太极剑法: number
	万剑诀: number
	寒冰箭: number
	雷电术: number
	元素爆裂: number
	雷爆术: number
	冰霜雪雨: number
	聚能爆破: number
	灵魂火符: number
	召唤神兽: number
	召唤月灵: number
	召唤麒麟: number
	召唤白虎: number
	召唤圣兽: number
	噬魂术: number
	天雷阵: number
	落石阵: number
	火陨阵: number
	无极剑阵: number
	奇门阵法: number
	毒箭术: number
	毒云: number
	双龙破: number
	阴阳法环: number
	湮灭: number
	五行阵: number
	怪物次数: number
	首领次数: number
	怪物法术次数: number
	怪物物理次数: number
	怪物战士次数: number
	怪物剑魂次数: number
	怪物天罡次数: number
	怪物法师次数: number
	怪物御剑次数: number
	怪物元素次数: number
	怪物道士次数: number
	怪物阵法次数: number
	怪物诡道次数: number
	怪物战士类次数: number
	怪物法师类次数: number
	怪物道士类次数: number
	怪物五行次数: number
	怪物金系次数: number
	怪物木系次数: number
	怪物水系次数: number
	怪物火系次数: number
	怪物土系次数: number
	刺杀剑法次数: number
	烈火剑法次数: number
	开天斩次数: number
	横扫千军次数: number
	裂空斩次数: number
	万剑归宗次数: number
	水月斩次数: number
	十字斩次数: number
	逐日剑法次数: number
	回旋斩次数: number
	金色弯刀次数: number
	无敌斩次数: number
	烈焰斩次数: number
	利剑突刺次数: number
	龙影剑法次数: number
	旋风斩次数: number
	降魔杵次数: number
	虎啸山河次数: number
	火球术次数: number
	冰咆哮次数: number
	流星火雨次数: number
	寒冰冲击次数: number
	火焰陨石次数: number
	九龙神火次数: number
	剑气诀次数: number
	立剑诀次数: number
	火雷剑次数: number
	冰剑诀次数: number
	太极剑法次数: number
	万剑诀次数: number
	寒冰箭次数: number
	雷电术次数: number
	元素爆裂次数: number
	雷爆术次数: number
	冰霜雪雨次数: number
	聚能爆破次数: number
	灵魂火符次数: number
	召唤神兽次数: number
	召唤月灵次数: number
	召唤麒麟次数: number
	召唤白虎次数: number
	召唤圣兽次数: number
	噬魂术次数: number
	天雷阵次数: number
	落石阵次数: number
	火陨阵次数: number
	无极剑阵次数: number
	奇门阵法次数: number
	毒箭术次数: number
	毒云次数: number
	双龙破次数: number
	阴阳法环次数: number
	湮灭次数: number
	五行阵次数: number

	战士倍伤: number
	剑魂倍伤: number
	天罡倍伤: number
	法师倍伤: number
	御剑倍伤: number
	元素倍伤: number
	道士倍伤: number
	阵法倍伤: number
	诡道倍伤: number

	元神战士倍伤: number
	元神剑魂倍伤: number
	元神天罡倍伤: number
	元神法师倍伤: number
	元神御剑倍伤: number
	元神元素倍伤: number
	元神道士倍伤: number
	元神阵法倍伤: number
	元神诡道倍伤: number

	战士属性: number
	剑魂属性: number
	天罡属性: number
	法师属性: number
	御剑属性: number
	元素属性: number
	道士属性: number
	阵法属性: number
	诡道属性: number
	元神属性: number


	伤害提升: number
	伤害次数: number
	真实伤害: number
	物理减免: number
	法术减免: number
	伤害减免: number
	攻击吸血: number
	法术吸血百分比: number
	物理吸血百分比: number
	防止吸血: number
	防止真伤: number
	杀怪经验: number
	杀怪金币: number
	怪物爆率: number
	暴击伤害减少: number
	对玩家伤害提升: number
	玩家伤害减免: number
	血量提升: number
	内力提升: number
	生命恢复百分比: number
	内力恢复百分比: number
	普通怪物修为: number
	首领怪物修为: number


	暴击几率: number
	暴击伤害: number
	防止暴击: number
	命中几率: number
	躲闪几率: number
	血量上限: number
	内力上限: number
	物理吸血: number
	法术吸血: number
	物理免伤: number
	法术免伤: number
	额外真伤: number
	技能冷却: number

	constructor() {
		this.伤害下限 = `1`
		this.伤害上限 = `1`
		this.生命值 = `1`

		this.攻击 = `100`
		this.防御 = `100`
		this.魔法 = `100`
		this.魔御 = `100`
		this.道术 = `100`
		this.体质 = `100`

		this.力量 = 0
		this.全能 = 0
		this.护甲 = 0
		this.根骨 = 0
		this.破甲 = 0

		this.装备攻击百分比 = 0
		this.装备魔法百分比 = 0
		this.装备道术百分比 = 0
		this.装备体质百分比 = 0
		this.装备防御百分比 = 0
		this.装备魔御百分比 = 0

		this.攻击百分比 = 0
		this.魔法百分比 = 0
		this.道术百分比 = 0
		this.体质百分比 = 0
		this.防御百分比 = 0
		this.魔御百分比 = 0

		this.攻击属性 = 0
		this.魔法属性 = 0
		this.道术属性 = 0
		this.体质属性 = 0
		this.防御属性 = 0
		this.魔御属性 = 0

		this.怪物伤害 = 0
		this.首领伤害 = 0
		this.怪物法术伤害 = 0
		this.怪物物理伤害 = 0
		this.怪物真实伤害 = 0
		this.首领真实伤害 = 0
		this.怪物物理真伤 = 0
		this.怪物法术真伤 = 0
		this.怪物五行伤害 = 0
		this.怪物金系伤害 = 0
		this.怪物木系伤害 = 0
		this.怪物水系伤害 = 0
		this.怪物火系伤害 = 0
		this.怪物土系伤害 = 0
		this.怪物战士类伤害 = 0
		this.怪物法师类伤害 = 0
		this.怪物道士类伤害 = 0
		this.怪物战士伤害 = 0
		this.怪物剑魂伤害 = 0
		this.怪物天罡伤害 = 0
		this.怪物法师伤害 = 0
		this.怪物御剑伤害 = 0
		this.怪物元素伤害 = 0
		this.怪物道士伤害 = 0
		this.怪物阵法伤害 = 0
		this.怪物诡道伤害 = 0
		this.刺杀剑法 = 0
		this.烈火剑法 = 0
		this.开天斩 = 0
		this.横扫千军 = 0
		this.裂空斩 = 0
		this.万剑归宗 = 0
		this.水月斩 = 0
		this.十字斩 = 0
		this.逐日剑法 = 0
		this.回旋斩 = 0
		this.金色弯刀 = 0
		this.无敌斩 = 0
		this.烈焰斩 = 0
		this.利剑突刺 = 0
		this.龙影剑法 = 0
		this.旋风斩 = 0
		this.降魔杵 = 0
		this.虎啸山河 = 0
		this.火球术 = 0
		this.冰咆哮 = 0
		this.流星火雨 = 0
		this.寒冰冲击 = 0
		this.火焰陨石 = 0
		this.九龙神火 = 0
		this.剑气诀 = 0
		this.立剑诀 = 0
		this.火雷剑 = 0
		this.冰剑诀 = 0
		this.太极剑法 = 0
		this.万剑诀 = 0
		this.寒冰箭 = 0
		this.雷电术 = 0
		this.元素爆裂 = 0
		this.雷爆术 = 0
		this.冰霜雪雨 = 0
		this.聚能爆破 = 0
		this.灵魂火符 = 0
		this.召唤神兽 = 0
		this.召唤月灵 = 0
		this.召唤麒麟 = 0
		this.召唤白虎 = 0
		this.召唤圣兽 = 0
		this.噬魂术 = 0
		this.天雷阵 = 0
		this.落石阵 = 0
		this.火陨阵 = 0
		this.无极剑阵 = 0
		this.奇门阵法 = 0
		this.毒箭术 = 0
		this.毒云 = 0
		this.双龙破 = 0
		this.阴阳法环 = 0
		this.湮灭 = 0
		this.五行阵 = 0
		this.怪物次数 = 0
		this.首领次数 = 0
		this.怪物法术次数 = 0
		this.怪物物理次数 = 0
		this.怪物战士次数 = 0
		this.怪物剑魂次数 = 0
		this.怪物天罡次数 = 0
		this.怪物法师次数 = 0
		this.怪物御剑次数 = 0
		this.怪物元素次数 = 0
		this.怪物道士次数 = 0
		this.怪物阵法次数 = 0
		this.怪物诡道次数 = 0
		this.怪物战士类次数 = 0
		this.怪物法师类次数 = 0
		this.怪物道士类次数 = 0
		this.怪物五行次数 = 0
		this.怪物金系次数 = 0
		this.怪物木系次数 = 0
		this.怪物水系次数 = 0
		this.怪物火系次数 = 0
		this.怪物土系次数 = 0
		this.刺杀剑法次数 = 0
		this.烈火剑法次数 = 0
		this.开天斩次数 = 0
		this.横扫千军次数 = 0
		this.裂空斩次数 = 0
		this.万剑归宗次数 = 0
		this.水月斩次数 = 0
		this.十字斩次数 = 0
		this.逐日剑法次数 = 0
		this.回旋斩次数 = 0
		this.金色弯刀次数 = 0
		this.无敌斩次数 = 0
		this.烈焰斩次数 = 0
		this.利剑突刺次数 = 0
		this.龙影剑法次数 = 0
		this.旋风斩次数 = 0
		this.降魔杵次数 = 0
		this.虎啸山河次数 = 0
		this.火球术次数 = 0
		this.冰咆哮次数 = 0
		this.流星火雨次数 = 0
		this.寒冰冲击次数 = 0
		this.火焰陨石次数 = 0
		this.九龙神火次数 = 0
		this.剑气诀次数 = 0
		this.立剑诀次数 = 0
		this.火雷剑次数 = 0
		this.冰剑诀次数 = 0
		this.太极剑法次数 = 0
		this.万剑诀次数 = 0
		this.寒冰箭次数 = 0
		this.雷电术次数 = 0
		this.元素爆裂次数 = 0
		this.雷爆术次数 = 0
		this.冰霜雪雨次数 = 0
		this.聚能爆破次数 = 0
		this.灵魂火符次数 = 0
		this.召唤神兽次数 = 0
		this.召唤月灵次数 = 0
		this.召唤麒麟次数 = 0
		this.召唤白虎次数 = 0
		this.召唤圣兽次数 = 0
		this.噬魂术次数 = 0
		this.天雷阵次数 = 0
		this.落石阵次数 = 0
		this.火陨阵次数 = 0
		this.无极剑阵次数 = 0
		this.奇门阵法次数 = 0
		this.毒箭术次数 = 0
		this.毒云次数 = 0
		this.双龙破次数 = 0
		this.阴阳法环次数 = 0
		this.湮灭次数 = 0
		this.五行阵次数 = 0

		this.战士倍伤 = 0
		this.剑魂倍伤 = 0
		this.天罡倍伤 = 0
		this.法师倍伤 = 0
		this.御剑倍伤 = 0
		this.元素倍伤 = 0
		this.道士倍伤 = 0
		this.阵法倍伤 = 0
		this.诡道倍伤 = 0
		this.元神战士倍伤 = 0
		this.元神剑魂倍伤 = 0
		this.元神天罡倍伤 = 0
		this.元神法师倍伤 = 0
		this.元神御剑倍伤 = 0
		this.元神元素倍伤 = 0
		this.元神道士倍伤 = 0
		this.元神阵法倍伤 = 0
		this.元神诡道倍伤 = 0

		this.战士属性 = 0
		this.剑魂属性 = 0
		this.天罡属性 = 0
		this.法师属性 = 0
		this.御剑属性 = 0
		this.元素属性 = 0
		this.道士属性 = 0
		this.阵法属性 = 0
		this.诡道属性 = 0
		this.元神属性 = 0

		this.伤害提升 = 0
		this.伤害次数 = 0
		this.真实伤害 = 0
		this.物理减免 = 0
		this.法术减免 = 0
		this.伤害减免 = 0
		this.攻击吸血 = 0
		this.物理吸血百分比 = 0
		this.法术吸血百分比 = 0
		this.防止吸血 = 0
		this.防止真伤 = 0
		this.杀怪经验 = 0
		this.杀怪金币 = 0
		this.怪物爆率 = 0
		this.暴击伤害减少 = 0
		this.对玩家伤害提升 = 0
		this.玩家伤害减免 = 0
		this.血量提升 = 0
		this.内力提升 = 0
		this.生命恢复百分比 = 0
		this.内力恢复百分比 = 0
		this.普通怪物修为 = 0
		this.首领怪物修为 = 0

		this.暴击几率 = 0
		this.暴击伤害 = 0
		this.防止暴击 = 0
		this.命中几率 = 0
		this.躲闪几率 = 0
		this.血量上限 = 0
		this.内力上限 = 0
		this.物理吸血 = 0
		this.法术吸血 = 0
		this.物理免伤 = 0
		this.法术免伤 = 0
		this.额外真伤 = 0
		this.技能冷却 = 0

	}
}

export class DynamicAttr {
	exp: number
	probability: number
}

export class RealmAttr {
	攻击: number
	生命值: number
	每秒恢复: number
	constructor() {
		this.攻击 = 0
		this.生命值 = 0
		this.每秒恢复 = 0
	}
}
export class PlayerAttr {
	伤害: string
	//修为: number

	攻击: string
	体质: string
	防御: string
	魔御: string
	魔法: string
	道术: string

	破甲: string
	破魔: string
	恢复: number
	幸运点数: number

	生命值: string
	魔法值: number
	伤害次数: number
	伤害提升: number
	伤害百分比加成: number

	金系伤害: number
	木系伤害: number
	水系伤害: number
	土系伤害: number
	火系伤害: number

	金系伤害百分比: number
	木系伤害百分比: number
	水系伤害百分比: number
	土系伤害百分比: number
	火系伤害百分比: number

	金系减少: number
	木系减少: number
	水系减少: number
	土系减少: number
	火系减少: number

	金系减免: number
	木系减免: number
	水系减免: number
	土系减免: number
	火系减免: number

	冷却缩减: number
	宠物强化: number

	暴击抵抗: number
	暴击伤害减免: number
	暴击几率: number
	暴击伤害: number
	生命值百分比加成: number
	内力值上限: number
	伤害减免: number
	攻击速度百分比: number
	血量恢复百分比: number
	内力恢复: number
	内力恢复百分比: number

	近战伤害: number
	近战伤害百分比: number
	近战减少: number
	近战减免: number

	远程伤害: number
	远程伤害百分比: number
	远程减少: number
	远程减免: number


	吸血: number
	近战吸血: number
	远程吸血: number
	吸血百分比: number
	物理吸血百分比: number
	法术吸血百分比: number

	施毒伤害加成: number

	杀怪经验提升: number
	拾取金币加成: number
	技能间隔时间: number
	攻击速度: number
	武技技能加成: number
	功法技能加成: number
	身法技能加成: number
	心法技能加成: number
	神通技能加成: number
	绝技技能加成: number
	战士技能数量: number
	法师技能数量: number
	道士技能数量: number
	爆率加成: number
	实际爆率: number
	鞭尸几率: number
	真实伤害: number
	百分比真伤: number
	//近战吸血: number
	//法术吸血: number
	伤害反弹: number
	百分比伤害反弹: number
	暴击回蓝: number
	战力: number
	怪物近战减免: number
	怪物远程减免: number
	怪物命中几率: number
	怪物躲闪几率: number

	命中几率: number
	躲闪几率: number
	技能命中: number
	技能躲避: number
	近战命中: number
	近战躲避: number
	防止暴击: number
	战士伤害: number
	法师伤害: number
	道士伤害: number
	额外伤害: number
	近战额外伤害: number
	远程额外伤害: number
	怪物伤害: number
	首领伤害: number
	受伤反击: number
	攻击百分比: number
	体质百分比: number
	护甲百分比: number
	抗性百分比: number
	破甲百分比: number
	破魔百分比: number
	全属性百分比: number
	攻击类百分比: number
	防御类百分比: number
	伤害下限百分比: number
	伤害上限百分比: number
	伤害增加百分比: number
	随机上限几率: number
	战士伤害百分比: number
	法师伤害百分比: number
	道士伤害百分比: number
	额外伤害百分比: number
	近战额外伤害百分比: number
	远程额外伤害百分比: number
	怪物伤害百分比: number
	首领伤害百分比: number
	受伤反击百分比: number
	伤害减少: number
	怪物减少: number
	战士减少: number
	法师减少: number
	道士减少: number
	首领减少: number
	战士技能减少: number
	法师技能减少: number
	道士技能减少: number
	击中回血: number
	杀怪经验: number
	杀怪恢复血量: number
	杀怪恢复内力: number
	杀怪下次伤害: number
	杀怪下次冷却: number
	怪物金币: number
	每秒经验: number
	内力上限: number
	基础血量: number
	每秒恢复: number
	怪物减免: number
	战士减免: number
	法师减免: number
	道士减免: number
	首领减免: number
	战士技能减免: number
	法师技能减免: number
	道士技能减免: number
	杀怪恢复百分比血量: number
	杀怪恢复内力百分比: number
	杀怪下次伤害提升: number
	杀怪冷却缩减百分比: number
	杀怪金币提升: number
	内力上限百分比: number
	生命上限百分比: number
	生命恢复百分比: number
	宠物伤害增加: number
	宠物真实伤害: number
	宠物每秒恢复: number
	宠物攻击吸血: number
	宠物受伤减少: number
	宠物攻击属性: number
	宠物防御属性: number
	宠物对怪伤害: number
	宠物首领伤害: number
	宠物玩家伤害: number
	宠物属性: number
	宠物真伤百分比: number
	宠物每秒恢复分百比: number
	宠物攻击吸血百分比: number
	宠物受伤减少百分比: number
	宠物攻击属性百分比: number
	宠物防御属性百分比: number
	宠物对怪伤害百分比: number
	宠物首领伤害百分比: number
	宠物玩家伤害百分比: number
	宠物全属性百分比: number
	宠物技能冷却缩减: number
	宠物攻速提升: number
	宠物无视防御: number
	宠物伤害百分比: number

	剑魂伤害: number
	天罡伤害: number
	御剑伤害: number
	元素伤害: number
	阵法伤害: number
	诡道伤害: number

	剑魂伤害百分比: number
	天罡伤害百分比: number
	御剑伤害百分比: number
	元素伤害百分比: number
	阵法伤害百分比: number
	诡道伤害百分比: number
	剑魂减少: number
	天罡减少: number
	御剑减少: number
	元素减少: number
	阵法减少: number
	诡道减少: number
	剑魂减免: number
	天罡减免: number
	御剑减免: number
	元素减免: number
	阵法减免: number
	诡道减免: number

	怪物装备爆率: number
	修为装备掉落: number
	玩家伤害减免: number
	暴击伤害减少: number
	对玩家伤害提升: number
	血量提升: number
	内力提升: number

	constructor() {
		this.伤害 = `0`
		//this.修为 = 0
		this.生命值 = `100`
		this.攻击 = `0`
		this.防御 = `0`
		this.魔御 = `0`
		this.魔法 = `0`
		this.道术 = `0`
		this.体质 = `0`
		this.破甲 == `0`
		this.破魔 == `0`
		this.幸运点数 = 0
		this.恢复 = 0
		this.魔法值 = 100
		this.伤害提升 = 0
		this.伤害次数 = 0
		this.伤害百分比加成 = 0
		this.金系伤害 = 0
		this.木系伤害 = 0
		this.水系伤害 = 0
		this.土系伤害 = 0
		this.火系伤害 = 0

		this.金系伤害百分比 = 0
		this.木系伤害百分比 = 0
		this.水系伤害百分比 = 0
		this.土系伤害百分比 = 0
		this.火系伤害百分比 = 0

		this.金系减少 = 0
		this.木系减少 = 0
		this.水系减少 = 0
		this.土系减少 = 0
		this.火系减少 = 0

		this.金系减免 = 0
		this.木系减免 = 0
		this.水系减免 = 0
		this.土系减免 = 0
		this.火系减免 = 0

		this.冷却缩减 = 0
		this.宠物强化 = 0
		this.暴击几率 = 0
		this.暴击伤害 = 0
		this.生命值百分比加成 = 0
		this.内力值上限 = 100
		this.伤害减免 = 0
		this.攻击速度百分比 = 0
		this.暴击抵抗 = 0
		this.血量恢复百分比 = 0
		this.内力恢复 = 10
		this.内力恢复百分比 = 0
		this.近战伤害 = 0
		this.近战伤害百分比 = 0
		this.远程伤害 = 0
		this.远程伤害百分比 = 0
		this.战力 = 0
		this.暴击伤害减免 = 0
		this.远程减少 = 0
		this.近战减少 = 0
		this.远程减免 = 0
		this.近战减免 = 0
		this.施毒伤害加成 = 0
		this.技能间隔时间 = 300
		this.攻击速度 = 0
		this.杀怪经验提升 = 100
		this.鞭尸几率 = 0
		this.拾取金币加成 = 0
		this.爆率加成 = 100
		this.战士技能数量 = 0
		this.法师技能数量 = 0
		this.道士技能数量 = 0

		this.武技技能加成 = 0
		this.功法技能加成 = 0
		this.身法技能加成 = 0
		this.心法技能加成 = 0
		this.神通技能加成 = 0
		this.绝技技能加成 = 0

		this.真实伤害 = 0
		this.百分比真伤 = 0


		this.吸血 = 0
		this.近战吸血 = 0
		this.远程吸血 = 0

		this.吸血百分比 = 0
		this.物理吸血百分比 = 0
		this.法术吸血百分比 = 0

		this.伤害反弹 = 0
		this.百分比伤害反弹 = 0
		this.暴击回蓝 = 0

		this.命中几率 = 0
		this.躲闪几率 = 0
		this.暴击几率 = 0
		this.暴击伤害 = 0
		this.技能命中 = 0
		this.技能躲避 = 0
		this.近战命中 = 0
		this.近战躲避 = 0
		this.防止暴击 = 0
		this.战士伤害 = 0
		this.剑魂伤害 = 0
		this.天罡伤害 = 0
		this.法师伤害 = 0
		this.御剑伤害 = 0
		this.元素伤害 = 0
		this.道士伤害 = 0
		this.阵法伤害 = 0
		this.诡道伤害 = 0
		this.金系伤害 = 0
		this.木系伤害 = 0
		this.水系伤害 = 0
		this.火系伤害 = 0
		this.土系伤害 = 0
		this.远程伤害 = 0
		this.近战伤害 = 0
		this.额外伤害 = 0
		this.近战额外伤害 = 0
		this.远程额外伤害 = 0
		this.怪物伤害 = 0
		this.首领伤害 = 0
		this.受伤反击 = 0
		this.攻击百分比 = 0
		this.体质百分比 = 0
		this.护甲百分比 = 0
		this.抗性百分比 = 0
		this.破甲百分比 = 0
		this.破魔百分比 = 0
		this.全属性百分比 = 0
		this.攻击类百分比 = 0
		this.防御类百分比 = 0
		this.伤害下限百分比 = 0
		this.伤害上限百分比 = 0
		this.伤害增加百分比 = 0
		this.随机上限几率 = 0
		this.战士伤害百分比 = 0
		this.剑魂伤害百分比 = 0
		this.天罡伤害百分比 = 0
		this.法师伤害百分比 = 0
		this.御剑伤害百分比 = 0
		this.元素伤害百分比 = 0
		this.道士伤害百分比 = 0
		this.阵法伤害百分比 = 0
		this.诡道伤害百分比 = 0
		this.金系伤害百分比 = 0
		this.木系伤害百分比 = 0
		this.水系伤害百分比 = 0
		this.火系伤害百分比 = 0
		this.土系伤害百分比 = 0
		this.远程伤害百分比 = 0
		this.近战伤害百分比 = 0
		this.额外伤害百分比 = 0
		this.近战额外伤害百分比 = 0
		this.远程额外伤害百分比 = 0
		this.怪物伤害百分比 = 0
		this.首领伤害百分比 = 0
		this.受伤反击百分比 = 0
		this.伤害减少 = 0
		this.近战减少 = 0
		this.远程减少 = 0
		this.怪物减少 = 0
		this.首领减少 = 0
		this.战士减少 = 0
		this.剑魂减少 = 0
		this.天罡减少 = 0
		this.法师减少 = 0
		this.御剑减少 = 0
		this.元素减少 = 0
		this.道士减少 = 0
		this.阵法减少 = 0
		this.诡道减少 = 0
		this.金系减少 = 0
		this.木系减少 = 0
		this.水系减少 = 0
		this.火系减少 = 0
		this.土系减少 = 0
		this.击中回血 = 0
		this.杀怪经验 = 0
		this.杀怪恢复血量 = 0
		this.杀怪恢复内力 = 0
		this.杀怪下次伤害 = 0
		this.杀怪下次冷却 = 0
		this.怪物金币 = 0
		this.每秒经验 = 0
		this.内力恢复 = 0
		this.内力上限 = 0
		this.基础血量 = 0
		this.每秒恢复 = 1
		this.伤害减免 = 0
		this.近战减免 = 0
		this.远程减免 = 0
		this.怪物减免 = 0
		this.首领减免 = 0
		this.战士减免 = 0
		this.剑魂减免 = 0
		this.天罡减免 = 0
		this.法师减免 = 0
		this.御剑减免 = 0
		this.元素减免 = 0
		this.道士减免 = 0
		this.阵法减免 = 0
		this.诡道减免 = 0
		this.金系减免 = 0
		this.木系减免 = 0
		this.水系减免 = 0
		this.火系减免 = 0
		this.土系减免 = 0
		this.杀怪恢复百分比血量 = 0
		this.杀怪恢复内力百分比 = 0
		this.杀怪经验提升 = 0
		this.杀怪下次伤害提升 = 0
		this.杀怪冷却缩减百分比 = 0
		this.杀怪金币提升 = 0
		this.内力恢复百分比 = 0
		this.内力上限百分比 = 0
		this.生命上限百分比 = 0
		this.生命恢复百分比 = 0
		this.宠物伤害增加 = 0
		this.宠物真实伤害 = 0
		this.宠物每秒恢复 = 0
		this.宠物攻击吸血 = 0
		this.宠物受伤减少 = 0
		this.宠物攻击属性 = 0
		this.宠物防御属性 = 0
		this.宠物对怪伤害 = 0
		this.宠物首领伤害 = 0
		this.宠物玩家伤害 = 0
		this.宠物属性 = 0
		this.宠物真伤百分比 = 0
		this.宠物每秒恢复分百比 = 0
		this.宠物攻击吸血百分比 = 0
		this.宠物受伤减少百分比 = 0
		this.宠物攻击属性百分比 = 0
		this.宠物防御属性百分比 = 0
		this.宠物对怪伤害百分比 = 0
		this.宠物首领伤害百分比 = 0
		this.宠物玩家伤害百分比 = 0
		this.宠物全属性百分比 = 0
		this.宠物技能冷却缩减 = 0
		this.宠物攻速提升 = 0
		this.宠物无视防御 = 0
		this.宠物伤害百分比 = 0

		this.怪物装备爆率 = 0
		this.修为装备掉落 = 0
		this.玩家伤害减免 = 0
		this.暴击伤害减少 = 0
		this.对玩家伤害提升 = 0
		this.血量提升 = 0
		this.内力提升 = 0
	}
}

export class titleAttrs { }

export class RoguelikeAttr {
	skillIds: number[]
	skillCds: number[]
	randomsEffect: number[]
	passives: Passive[]
	/** 总计积分 */
	totalScore: number
	totalCount: number
	count: number
	skillNumb: number
	killPlayer: number
	/** 攻击属性增加 {1} */
	attr1: number[]
	/** 体质属性增加 {1} */
	attr2: number[]
	/** 护甲属性增加 {1} */
	attr3: number[]
	/** 破甲属性增加 {1} */
	attr4: number[]
	/** 恢复属性增加 {1} */
	attr5: number[]
	/** 攻击属性增加 {1}% */
	attr6: number[]
	/** 体质属性增加 {1}% */
	attr7: number[]
	/** 护甲属性增加 {1}% */
	attr8: number[]
	/** 破甲属性增加 {1}% */
	attr9: number[]
	/** 恢复属性增加 {1}% */
	attr10: number[]
	/** 伤害加成 {1}% */
	attr11: number[]
	/** 伤害减免 {1}% */
	attr12: number[]
	/** 攻击速度 {1}% */
	attr13: number[]
	/** 冷却缩减 {1}% */
	attr14: number[]
	/** 暴击抵抗 {1}% */
	attr15: number[]
	/** 暴击几率 {1}% */
	attr16: number[]
	/** 暴击伤害 {1}% */
	attr17: number[]
	/** 爆伤减免 {1}% */
	attr18: number[]
	/** 近战吸血 {1}% */
	attr19: number[]
	/** 远程吸血 {1}% */
	attr20: number[]
	/** 受到近战伤害减少 {1}% */
	attr21: number[]
	/** 所有远程技能造成伤害提升 {1}% */
	attr22: number[]
	/** 受到近战伤害减少 {1}% */
	attr23: number[]
	/** 受到远程伤害减少 {1}% */
	attr24: number[]
	/** 生命恢复提升 {1}% */
	attr25: number[]
	/** 内力恢复提升 {1}% */
	attr26: number[]
	/** 使你所有武技技能造成伤害提升 */
	attr27: number[]
	/** 使你所有功法技能造成伤害提升 {1}% */
	attr28: number[]
	/** 使你所有身法技能造成伤害提升 {1}% */
	attr29: number[]
	/** 使你所有心法技能造成伤害提升 {1}% */
	attr30: number[]
	/** 使你所有神通技能造成伤害提升 {1}% */
	attr31: number[]
	/** 使你所有绝技技能造成伤害提升 {1}% */
	attr32: number[]
	/** 使你所有战士技能造成伤害提升 {1}% */
	attr33: number[]
	/** 使你所有法师技能造成伤害提升 {1}% */
	attr34: number[]
	/** 使你所有道士技能造成伤害提升 {1}% */
	attr35: number[]
	/**金 */
	attr36: number[]
	/**木 */
	attr37: number[]
	/**水 */
	attr38: number[]
	/**火 */
	attr39: number[]
	/**土 */
	attr40: number[]
	constructor() {
		this.skillIds = [0, 0, 0, 0, 0, 0]
		this.skillCds = [0, 0, 0, 0, 0, 0]
		this.killPlayer = 0
		this.passives = []
		this.totalScore = 0
		this.totalCount = 0
		this.count = 0
		this.skillNumb = 0
		this.attr1 = [0, 0]
		this.attr2 = [0, 0]
		this.attr3 = [0, 0]
		this.attr4 = [0, 0]
		this.attr5 = [0, 0]
		this.attr6 = [0, 0]
		this.attr7 = [0, 0]
		this.attr8 = [0, 0]
		this.attr9 = [0, 0]
		this.attr10 = [0, 0]
		this.attr11 = [0, 0]
		this.attr12 = [0, 0]
		this.attr13 = [0, 0]
		this.attr14 = [0, 0]
		this.attr15 = [0, 0]
		this.attr16 = [0, 0]
		this.attr17 = [0, 0]
		this.attr18 = [0, 0]
		this.attr19 = [0, 0]
		this.attr20 = [0, 0]
		this.attr21 = [0, 0]
		this.attr22 = [0, 0]
		this.attr23 = [0, 0]
		this.attr24 = [0, 0]
		this.attr25 = [0, 0]
		this.attr26 = [0, 0]
		this.attr27 = [0, 0]
		this.attr28 = [0, 0]
		this.attr29 = [0, 0]
		this.attr30 = [0, 0]
		this.attr31 = [0, 0]
		this.attr32 = [0, 0]
		this.attr33 = [0, 0]
		this.attr34 = [0, 0]
		this.attr35 = [0, 0]
		this.attr36 = [0, 0]
		this.attr37 = [0, 0]
		this.attr38 = [0, 0]
		this.attr39 = [0, 0]
		this.attr40 = [0, 0]
	}
}

export class PassiveAttr {
	/** 暴击几率提升 */
	attr1: number[]
	/** 受到伤害增加,同时暴击几率提升 */
	attr2: number[]
	/** 触发暴击之后,将会恢复 {1} 点内力 */
	attr3: number[]
	/** 攻击速度减少 {1}%,但是暴击伤害提升 {2}% */
	attr4: number[]
	/** 造成伤害提升 {1}% */
	attr5: number[]
	/** 吸血效果提升 {1}%*/
	attr6: number[]
	/** 攻击速度提升 {1}%,同时造成伤害也减少 {2}% */
	attr7: number[]
	/** 每次攻击都有 {1}% 的几率,额外造成 {2}% 的真实伤害 */
	attr8: number[]
	/** 血量上限提升 {1}% */
	attr9: number[]
	/** 受到伤害的同时将会对敌人造成自身血量 {1}% 的真实伤害 */
	attr10: number[]
	/** 受到伤害时将会反弹 {1}% 的伤害 */
	attr11: number[]
	/** 距离敌人 {1} 码 受到伤害减少 {2}% */
	attr12: number[]
	/** 宠物攻击距离提升 {1} 码 */
	attr13: number[]
	/** 宠物造成伤害提升 {1}% */
	attr14: number[]
	/** 宠物所有属性提升 {1}% */
	attr15: number[]
	/** 攻击怪物有 {1}% 让其晕迷 {2} 秒 */
	attr16: number[]
	/** 所有远程技能造成伤害提升 {1}% */
	attr17: number[]
	/** 受到远程伤害减少 {1}% */
	attr18: number[]
	/** 所有技能的冷却时间减少 {1}% */
	attr19: number[]
	/** 初始冷却时间超过 {1} 秒的技能造成伤害提升 {2}% */
	attr20: number[]
	/** 受到近战伤害减少 {1}% */
	attr21: number[]
	/** 所有近战技能伤害提升 {1}% */
	attr22: number[]
	/** 血量越低,造成的伤害越高,最高可造成 {1}% */
	attr23: number[]
	/** 身边附近敌人超过3个受到的伤害减少 {1}% */
	attr24: number[]
	/** 自身生命值恢复效果提升 {1}% */
	attr25: number[]
	/** 每秒恢复 {1} 点内力 */
	attr26: number[]
	/** 使你所有武技技能造成伤害提升 */
	attr27: number[]
	/** 使你所有功法技能造成伤害提升 {1}% */
	attr28: number[]
	/** 使你所有身法技能造成伤害提升 {1}% */
	attr29: number[]
	/** 使你所有心法技能造成伤害提升 {1}% */
	attr30: number[]
	/** 使你所有神通技能造成伤害提升 {1}% */
	attr31: number[]
	/** 使你所有绝技技能造成伤害提升 {1}% */
	attr32: number[]
	/** 使你所有战士技能造成伤害提升 {1}% */
	attr33: number[]
	/** 使你所有法师技能造成伤害提升 {1}% */
	attr34: number[]
	/** 使你所有道士技能造成伤害提升 {1}% */
	attr35: number[]
	/** 攻击时有 {1}% 的几率使你的破甲效果翻倍 */
	attr36: number[]
	/**金 */
	attr37: number[]
	/**木 */
	attr38: number[]
	/**水 */
	attr39: number[]
	/**火 */
	attr40: number[]
	/**土 */
	attr41: number[]
	constructor() {
		this.attr1 = [0, 0]
		this.attr2 = [0, 0]
		this.attr3 = [0, 0]
		this.attr4 = [0, 0]
		this.attr5 = [0, 0]
		this.attr6 = [0, 0]
		this.attr7 = [0, 0]
		this.attr8 = [0, 0]
		this.attr9 = [0, 0]
		this.attr10 = [0, 0]
		this.attr11 = [0, 0]
		this.attr12 = [0, 0]
		this.attr13 = [0, 0]
		this.attr14 = [0, 0]
		this.attr15 = [0, 0]
		this.attr16 = [0, 0]
		this.attr17 = [0, 0]
		this.attr18 = [0, 0]
		this.attr19 = [0, 0]
		this.attr20 = [0, 0]
		this.attr21 = [0, 0]
		this.attr22 = [0, 0]
		this.attr23 = [0, 0]
		this.attr24 = [0, 0]
		this.attr25 = [0, 0]
		this.attr26 = [0, 0]
		this.attr27 = [0, 0]
		this.attr28 = [0, 0]
		this.attr29 = [0, 0]
		this.attr30 = [0, 0]
		this.attr31 = [0, 0]
		this.attr32 = [0, 0]
		this.attr33 = [0, 0]
		this.attr34 = [0, 0]
		this.attr35 = [0, 0]
		this.attr36 = [0, 0]
		this.attr37 = [0, 0]
		this.attr38 = [0, 0]
		this.attr39 = [0, 0]
		this.attr40 = [0, 0]
		this.attr41 = [0, 0]
	}
}


export class recoveryItemsObj {
	gold: number
	item1: number
	item2: number
	item3: number
	item4: number
	元宝: number
	constructor() {
		this.gold = 0
		this.item1 = 0
		this.item2 = 0
		this.item3 = 0
		this.item4 = 0
		this.元宝 = 0
	}

}
// export class JobAttr {

// }

export interface 伤害统计 {
	技能名字: string
	技能伤害: string
	使用次数: number
}

// export class 法宝效果 {
// 	冷静沉着: number
// 	武学奇才: number
// 	技能大师: number
// 	唯快不破: number
// 	多重施法: number
// 	多重攻击: number
// 	拘灵遣将: number
// 	行尸走肉: number
// 	灵魂连接: number
// 	保留精力: number
// 	内力深厚: number
// 	法力无边: number
// 	剑法逆练: number
// 	精准爆头: number
// 	近战吸血: number
// 	远程吸血: number
// 	高人指点: number
// 	范围攻击: number
// 	技能弹射: number
// 	分裂符文: number
// 	攻无不克: number
// 	魅惑之心: number
// 	破甲之刃: number
// 	绝地反击: number
// 	顽强意志: number
// 	残酷斩杀: number
// 	满血斩杀: number
// 	constructor() {
// 		this.冷静沉着 = 0
// 		this.武学奇才 = 0
// 		this.技能大师 = 0
// 		this.唯快不破 = 0
// 		this.多重施法 = 0
// 		this.多重攻击 = 0
// 		this.拘灵遣将 = 0
// 		this.行尸走肉 = 0
// 		this.灵魂连接 = 0
// 		this.保留精力 = 0
// 		this.内力深厚 = 0
// 		this.法力无边 = 0
// 		this.剑法逆练 = 0
// 		this.精准爆头 = 0
// 		this.近战吸血 = 0
// 		this.远程吸血 = 0
// 		this.高人指点 = 0
// 		this.范围攻击 = 0
// 		this.技能弹射 = 0
// 		this.分裂符文 = 0
// 		this.攻无不克 = 0
// 		this.魅惑之心 = 0
// 		this.破甲之刃 = 0
// 		this.绝地反击 = 0
// 		this.顽强意志 = 0
// 		this.残酷斩杀 = 0
// 		this.满血斩杀 = 0
// 	}
// }

// export class PassiveAttr {
// 	damage: number[] // 伤害
// 	weapons: number[] // 武器
// 	reduction: number[] // 减少防御
// 	experience: number[] // 经验
// 	equipment: number[] // 强化装备
// 	primordial: number // 元神属性
// 	repository: number[] // 仓库
// 	health: number[] // 生命上限
// 	attack: number[] // 攻击上限

// 	metalPct: number // 法宝金系加成
// 	woodPct: number // 法宝木系加成
// 	waterPct: number // 法宝水系加成
// 	earthPct: number // 法宝土系加成
// 	firePct: number // 法宝火系加成

// 	ancientdc: number // 远古强化攻击
// 	ancientps: number // 远古强化体质
// 	ancientac: number // 远古强化护甲
// 	ancientacb: number // 远古强化破甲
// 	ancienthpRenew: number // 远古强化恢复

// 	cultivationdc: number // 修为强化攻击
// 	cultivationps: number // 修为强化体质
// 	cultivationac: number // 修为强化护甲
// 	cultivationacb: number // 修为强化破甲
// 	cultivationthpRenew: number // 修为强化恢复

// 	artifactdc: number // 法宝强化攻击
// 	artifactps: number // 法宝强化体质
// 	artifactac: number // 法宝强化护甲
// 	artifactacb: number // 法宝强化破甲
// 	artifacthpRenew: number // 法宝强化恢复

// 	recovery: number // 内力恢复
// 	energy: number[] // 能量恢复
// 	elite: number[] // 精英伤害
// 	cooldown: number[] // 冷却时间
// 	suckBoold: number // 吸血
// 	armor: number // 护甲强化
// 	penetration: number //攻击破甲                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                – 穿透力
// 	criticals: number // 暴击恢复
// 	pet: number // 宠物
// 	duration: number // 秘境特效持续时间
// 	drop: number // 秘境掉落强化

// 	constructor() {
// 		this.damage = [0, 0]
// 		this.weapons = [0, 0, 0]
// 		this.reduction = [0, 0]
// 		this.experience = [0, 0]
// 		this.equipment = [0, 0]
// 		this.primordial = 0
// 		this.repository = [0, 0]
// 		this.health = [0, 0]
// 		this.attack = [0, 0]
// 		this.metalPct = 0
// 		this.woodPct = 0
// 		this.waterPct = 0
// 		this.earthPct = 0
// 		this.firePct = 0

// 		this.ancientdc = 0
// 		this.ancientps = 0
// 		this.ancientac = 0
// 		this.ancientacb = 0
// 		this.ancienthpRenew = 0

// 		this.cultivationdc = 0
// 		this.cultivationps = 0
// 		this.cultivationac = 0
// 		this.cultivationacb = 0
// 		this.cultivationthpRenew = 0

// 		this.artifactdc = 0
// 		this.artifactps = 0
// 		this.artifactac = 0
// 		this.artifactacb = 0
// 		this.artifacthpRenew = 0

// 		this.recovery = 0
// 		this.energy = [0, 0]
// 		this.elite = [0, 0]

// 		this.cooldown = [0, 0] // 冷却时间
// 		this.suckBoold = 0 // 近战恢复
// 		this.armor = 0 // 护甲强化
// 		this.penetration = 0 //攻击破甲                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                – 穿透力
// 		this.criticals = 0 // 暴击恢复
// 		this.pet = 0 // 宠物
// 		this.duration = 0 // 秘境特效持续时间
// 		this.drop = 0 // 秘境掉落强化
// 	}
// }


// export const CUSTOMATTRIBUTES = {
// 	10: '攻击',
// 	11: '体质',
// 	12: '护甲',
// 	13: '抗性',
// 	14: '破甲',
// 	15: '破魔',
// 	16: '恢复',

// 	20: '攻击',
// 	21: '体质',
// 	22: '护甲',
// 	23: '抗性',
// 	24: '破甲',
// 	25: '破魔',
// 	26: '恢复',

// 	30: '力量',
// 	31: '智力',
// 	32: '精神',
// 	33: '敏捷',
// 	34: '根骨',

// 	41: '力量',
// 	42: '智力',
// 	43: '精神',
// 	44: '敏捷',
// 	45: '根骨'
// }
export const CUSTOMATTRIBUTESNAME = {
	0: '',
	10: '攻击 + {1}',
	11: '魔法 + {1}',
	12: '道术 + {1}',
	13: '体质 + {1}',
	14: '防御 + {1}',
	15: '魔御 + {1}',

	16: '攻击 + {1}',
	17: '魔法 + {1}',
	18: '道术 + {1}',
	19: '体质 + {1}',
	20: '防御 + {1}',
	21: '魔御 + {1}',

	22: '攻击 + {1}',
	23: '魔法 + {1}',
	24: '道术 + {1}',
	25: '体质 + {1}',
	26: '防御 + {1}',
	27: '魔御 + {1}',

	30: '+ {1} 点力量',
	31: '+ {1} 点智力',
	32: '+ {1} 点精神',
	33: '+ {1} 点敏捷',
	34: '+ {1} 点根骨',

	40: '增加 {1} 点修为',
	41: '增加 {1} 点力量',
	42: '增加 {1} 点智力',
	43: '增加 {1} 点精神',
	44: '增加 {1} 点敏捷',
	45: '增加 {1} 点根骨',
	46: '增加 {1} 点命中等级',
	47: '增加 {1} 点暴击等级',

	319: '触发间隔 {1} 秒',
	320: '冷却时间 {1}',
	321: '伤害范围 {1}',
	322: '技能伤害 {1}%',
	323: '触发几率 {1}%',
	324: '恢复血量 {1}%',
	325: '落地范围 {1} 码',
	326: '吸收伤害 {1}%',
	327: '使你的真实伤害增加 {1}%',
	328: '修为提升 {1}%',
	329: '获得经验提升 {1}%',
	330: '怪物装备爆率 {1}%',
	331: '怪物掉落金币增加 {1}%',
	332: '怪物掉落修为装备几率提升 {1}%',
	333: '力量提升 {1}%',
	334: '受到怪物伤害减少 {1}%',
	335: '受到玩家伤害减少 {1}%',
	336: '受到暴击几率减少 {1}%',
	337: '受到暴击伤害减少 {1}%',
	338: '智力提升 {1}%',
	339: '暴击几率提升 {1}%',
	340: '暴击伤害提升 {1}%',
	341: '对怪物伤害提升 {1}%',
	342: '对玩家伤害提升 {1}%',
	343: '精神提升 {1}%',
	344: '血量上限提升 {1}%',
	345: '内力上限提升 {1}%',
	346: '生命恢复效果提升 {1}%',
	347: '内力恢复效果提升 {1}%'
}

export const CUSTOMATTRIBUTESNAME1 = {
	0: '',
	10: '攻击 + [{1} - {2}]',
	11: '体质 + [{1} - {2}]',
	12: '护甲 + [{1} - {2}]',
	13: '抗性 + [{1} - {2}]',
	14: '破甲 + [{1} - {2}]',
	15: '破魔 + [{1} - {2}]',
	16: '恢复 + [{1} - {2}]',

	18: '冷却时间缩短 [{1} - {2}]%',
	19: '攻击速度提升 [{1} - {2}]%',
	20: '伤害加成提升 [{1} - {2}]%',
	21: '宠物属性提升 [{1} - {2}]%',
	22: '暴击几率提升 [{1} - {2}]%',
	23: '暴击伤害提升 [{1} - {2}]%',

	24: '内力恢复效果 [{1} - {2}]%',
	25: '内力上限增加 [{1} - {2}] 点',
	26: '生命上限提升 [{1} - {2}]%',
	27: '生命恢复效果提升 [{1} - {2}]%',
	28: '受到所有伤害减少 [{1} - {2}]%',
	29: '受到暴击几率减少 [{1} - {2}]% ',

	30: '金系法宝伤害提升 [{1} - {2}]%',
	31: '木系法宝伤害提升 [{1} - {2}]%',
	32: '水系法宝伤害提升 [{1} - {2}]%',
	33: '火系法宝伤害提升 [{1} - {2}]%',
	34: '土系法宝伤害提升 [{1} - {2}]%',

	35: '受到金系法宝减少 [{1} - {2}]%',
	36: '受到木系法宝减少 [{1} - {2}]%',
	37: '受到水系法宝减少 [{1} - {2}]%',
	38: '受到火系法宝减少 [{1} - {2}]%',
	39: '受到土系法宝减少 [{1} - {2}]%',

	43: '怪物爆率提升 [{1} - {2}]%',

	610: '受到首领伤害减少 {1}%',
	611: '受到玩家伤害减少 {1}%',
	612: '受到暴击几率减少 {1}%',
	613: '受到暴击伤害减少 {1}%',
	614: '体质属性效果提升 {1}%',
	615: '护甲属性效果提升 {1}%',
	616: '怪物爆率提升 {1}%',
	617: '五系伤害减免提升 {1}%',
	618: '杀怪经验获取提升 {1}%',
	619: '护符冷却时间减少 {1}%',

	630: '对首领造成伤害提升 {1}%',
	631: '对玩家造成伤害提升 {1}%',
	632: '额外造成 {1}% 的真实伤害',
	633: '暴击几率提升 {1}%',
	634: '暴击伤害提升 {1}%',
	635: '鞭尸几率增加 {1}%',
	636: '获得 {1}% 的攻击吸血',
	637: '获得 {1}% 的法术吸血',
	638: '攻击属性提升 {1}%',
	639: '破甲属性提升 {1}%',
	640: '护符冷却时间减少 {1}%',

	319: '触发间隔 {1} 秒',
	320: '冷却时间 {1}',
	321: '伤害范围 {1}',
	322: '技能伤害 {1}%',
	323: '触发几率 {1}%',
	324: '恢复血量 {1}%',
	325: '落地范围 {1} 码',
	326: '吸收伤害 {1}%',
	327: '真实伤害 {1}%',
	328: '修为提升 {1}%',
	329: '获得经验提升 {1}%',
	330: '怪物装备爆率 {1}%',
	331: '怪物掉落金币增加 {1}%',
	332: '怪物掉落修为装备几率提升 {1}%',
	333: '力量提升 {1}%',
	334: '受到怪物伤害减少 {1}%',
	335: '受到玩家伤害减少 {1}%',
	336: '受到暴击几率减少 {1}%',
	337: '受到暴击伤害减少 {1}%',
	338: '智力提升 {1}%',
	339: '暴击几率提升 {1}%',
	340: '暴击伤害提升 {1}%',
	341: '对怪物伤害提升 {1}%',
	342: '对玩家伤害提升 {1}%',
	343: '精神提升 {1}%',
	344: '血量上限提升 {1}%',
	345: '内力上限提升 {1}%',
	346: '生命恢复效果提升 {1}%',
	347: '内力恢复效果提升 {1}%'
}
