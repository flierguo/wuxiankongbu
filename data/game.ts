import { abyssDamageMaxRank, mapLogInfo, padogoRank, placeRank, players_info, roguelikeRank, zLRank } from './playerEntity'
import {
	affixInfo,
	affixMons,
	affixName,
	artifactInfo,
	Awaken,
	AwakenConsume,
	baseAttrsConfig,
	BuffInfo,
	dimensionalMap,
	DropConfig,
	duplicateMap,
	equipStrongConsume,
	eventMapNpcInfo,
	Fetter,
	FiveAttrConfig,
	FiveMagicConfig,
	FivePagodaInfo,
	fivePagodaReward,
	giftPack,
	Info,
	jobSkillInfo,
	loots,
	MagicWeapoExp,
	MagicWeaponAttr,
	MagicWeaponConfig,
	mapBossInfo,
	mapEventInfo,
	mapInfoEx,
	MapLevelInfo,
	mapRoute,
	MissionConfig,
	MonAttrInfo,
	MonAttrInfoFun,
	MonInfo,
	NpcInfo,
	PagodaInfo,
	pagodaReward,
	PassiveConfig,
	PrimordialConfig,
	PrimordialOffline,
	RankRewardInfo,
	RoguelikeExp,
	RoguelikeMap,
	RoguelikeMapInfo,
	ShopConfig,
	SkillConfig,
	skillRune,
	TitleInfo as TitleInfo,
	VipConfig
} from './type'

class GameData {
	get vipInfo() {
		return GameLib.R['vipInfo']
	}

	set vipInfo(val) {
		GameLib.R['vipInfo'] = val
	}

	get playerList(): players_info[] {
		return GameLib.V['playerList']
	}

	set playerList(val) {
		GameLib.V['playerList'] = val
	}

	get mapLogInfo(): mapLogInfo[] {
		return GameLib.R['mapLogInfo']
	}
	set mapLogInfo(val) {
		GameLib.R['mapLogInfo'] = val
	}

	get zLRanks(): zLRank[] {
		return GameLib.V['zLRanks']
	}

	set zLRanks(val) {
		GameLib.V['zLRanks'] = val
	}

	get padogoRanks(): padogoRank[] {
		return GameLib.V['padogoRanks']
	}

	set padogoRanks(val) {
		GameLib.V['padogoRanks'] = val
	}

	get placeRanks(): placeRank[] {
		return GameLib.V['placeRanks']
	}

	set placeRanks(val) {
		GameLib.V['placeRanks'] = val
	}

	get abyssDamageMaxRanks(): abyssDamageMaxRank[] {
		return GameLib.V['abyssDamageMaxRanks']
	}

	set abyssDamageMaxRanks(val) {
		GameLib.V['abyssDamageMaxRanks'] = val
	}

	get roguelikeRanks(): roguelikeRank[] {
		return GameLib.V['roguelikeRanks']
	}

	set roguelikeRanks(val) {
		GameLib.V['roguelikeRanks'] = val
	}

	get mapBossInfo(): mapBossInfo[] {
		return GameLib.R['mapBossInfo']
	}
	set mapBossInfo(val) {
		GameLib.R['mapBossInfo'] = val
	}

	get eventMapNpcInfo(): eventMapNpcInfo[] {
		return GameLib.R['eventMapNpcInfo']
	}

	set eventMapNpcInfo(val) {
		GameLib.R['eventMapNpcInfo'] = val
	}

	get 幻化列表() {
		return GameLib.R['Illustrated']
	}

	set 幻化列表(val) {
		GameLib.R['Illustrated'] = val
	}
	// get primordials(): Map<any, TActor> {
	// 	return GameLib.R['primordials']
	// }

	// set primordials(val) {
	// 	GameLib.R['primordials'] = val
	// }

	// get comprehendInfo(): ComprehendInfo[] {
	// 	return GameLib.R['comprehendInfo']
	// }

	// set comprehendInfo(val) {
	// 	GameLib.R['comprehendInfo'] = val
	// }

	get passivesConfig(): PassiveConfig[] {
		return GameLib.R['passivesConfig']
	}

	set passivesConfig(val) {
		GameLib.R['passivesConfig'] = val
	}

	get roguelikeConfig(): PassiveConfig[] {
		return GameLib.R['roguelikeConfig']
	}

	set roguelikeConfig(val) {
		GameLib.R['roguelikeConfig'] = val
	}

	get fiveMagicsEffectInfo(): PassiveConfig[] {
		return GameLib.R['fiveMagicsEffectInfo']
	}

	set fiveMagicsEffectInfo(val) {
		GameLib.R['fiveMagicsEffectInfo'] = val
	}

	get fiveMagicsInfo(): FiveMagicConfig[] {
		return GameLib.R['fiveMagicsInfo']
	}

	set fiveMagicsInfo(val) {
		GameLib.R['fiveMagicsInfo'] = val
	}

	get playerDate(): Info {
		return GameLib.R['player_data']
	}

	set playerDate(val) {
		GameLib.R['player_data'] = val
	}

	get awaken(): Awaken[] {
		return GameLib.R['awaken']
	}

	set awaken(val) {
		GameLib.R['awaken'] = val
	}

	get awakenConsume(): AwakenConsume[] {
		return GameLib.R['awakenConsume']
	}

	set awakenConsume(val) {
		GameLib.R['awakenConsume'] = val
	}

	get loots(): loots[] {
		return GameLib.R['loots']
	}

	set loots(val) {
		GameLib.R['loots'] = val
	}

	get drops_bags() {
		return GameLib.R['drops_bags']
	}

	set drops_bags(val) {
		GameLib.R['drops_bags'] = val
	}

	get drops_config(): DropConfig[] {
		return GameLib.R['drop_config']
	}

	set drops_config(val) {
		GameLib.R['drop_config'] = val
	}

	get missions_fun() {
		return GameLib.R['missions_fun']
	}

	set missions_fun(val) {
		GameLib.R['missions_fun'] = val
	}

	get missions(): MissionConfig[] {
		return GameLib.R['missions']
	}

	set missions(val) {
		GameLib.R['missions'] = val
	}

	get jobSkillInfos(): jobSkillInfo[] {
		return GameLib.R['jobSkillInfos']
	}

	set jobSkillInfos(val) {
		GameLib.R['jobSkillInfos'] = val
	}

	get jobSkills() {
		return GameLib.R['jobSkills']
	}

	set jobSkills(val) {
		GameLib.R['jobSkills'] = val
	}

	get artifact(): artifactInfo[] {
		return GameLib.R['artifact']
	}

	set artifact(val) {
		GameLib.R['artifact'] = val
	}

	get magicWeaponsInfo(): MagicWeaponConfig[] {
		return GameLib.R['magicWeaponsInfo']
	}

	set magicWeaponsInfo(val) {
		GameLib.R['magicWeaponsInfo'] = val
	}

	get skillsInfo(): SkillConfig[] {
		return GameLib.R['skillsInfo']
	}

	set skillsInfo(val) {
		GameLib.R['skillsInfo'] = val
	}

	get skillsIndex() {
		return GameLib.R['skillsIndex']
	}
	set skillsIndex(val) {
		GameLib.R['skillsIndex'] = val
	}

	get magicWeaponsAttr(): MagicWeaponAttr[] {
		return GameLib.R['magicWeaponsAttr']
	}

	set magicWeaponsAttr(val) {
		GameLib.R['magicWeaponsAttr'] = val
	}

	get magicWeaponsConsume(): MagicWeapoExp[] {
		return GameLib.R['magicWeaponsConsume']
	}

	set magicWeaponsConsume(val) {
		GameLib.R['magicWeaponsConsume'] = val
	}

	get spawnNpc(): NpcInfo[] {
		return GameLib.R['spawnNpc']
	}

	set spawnNpc(val) {
		GameLib.R['spawnNpc'] = val
	}

	get spawnMonInfo(): MonInfo[] {
		return GameLib.R['spawnMonInfo']
	}

	set spawnMonInfo(val) {
		GameLib.R['spawnMonInfo'] = val
	}

	get pagodaInfo(): PagodaInfo[] {
		return GameLib.R['pagodaInfo']
	}

	set pagodaInfo(val) {
		GameLib.R['pagodaInfo'] = val
	}

	get fivePagodaInfo(): FivePagodaInfo[] {
		return GameLib.R['fivePagodaInfo']
	}

	set fivePagodaInfo(val) {
		GameLib.R['fivePagodaInfo'] = val
	}

	get monAttrs() {
		return GameLib.R['monAttrs']
	}
	set monAttrs(val) {
		GameLib.R['monAttrs'] = val
	}

	get days() {
		return GameLib.V['days']
	}

	set days(val) {
		GameLib.V['days'] = val
	}

	get magicWeaponType() {
		return GameLib.V['magicWeaponType']
	}

	set magicWeaponType(val) {
		GameLib.V['magicWeaponType'] = val
	}

	get clearDuplicateMap() {
		return GameLib.R['clearDuplicateMap']
	}

	set clearDuplicateMap(val) {
		GameLib.R['clearDuplicateMap'] = val
	}

	get mapInfoEx(): mapInfoEx[] {
		return GameLib.R['mapInfoEx']
	}

	set mapInfoEx(val) {
		GameLib.R['mapInfoEx'] = val
	}

	get mapLevelInfos(): MapLevelInfo[] {
		return GameLib.R['mapLevelInfos']
	}

	set mapLevelInfos(val) {
		GameLib.R['mapLevelInfos'] = val
	}

	// get mapInfos(): mapInfo[] {
	// 	return GameLib.V['mapInfos']
	// }
	// set mapInfos(val) {
	// 	GameLib.V['mapInfos'] = val
	// }

	get lootsItems() {
		return GameLib.R['lootsItems']
	}
	set lootsItems(val) {
		GameLib.R['lootsItems'] = val
	}
	get roguelikeMaps(): RoguelikeMap[] {
		return GameLib.R['roguelikeMaps']
	}

	set roguelikeMaps(val) {
		GameLib.R['roguelikeMaps'] = val
	}

	get 领域Maps(): mapInfoEx[] {
		return GameLib.R['领域Maps']
	}

	set 领域Maps(val) {
		GameLib.R['领域Maps'] = val
	}

	get roguelikeExp(): RoguelikeExp[] {
		return GameLib.R['roguelikeExp']
	}

	set roguelikeExp(val) {
		GameLib.R['roguelikeExp'] = val
	}

	get roguelikeMapsInfo(): RoguelikeMapInfo[] {
		return GameLib.R['roguelikeMapsInfo']
	}

	set roguelikeMapsInfo(val) {
		GameLib.R['roguelikeMapsInfo'] = val
	}

	get brushMonsters() {
		return GameLib.R['brushMonsters']
	}

	set brushMonsters(val) {
		GameLib.R['brushMonsters'] = val
	}

	get mapRoutes(): mapRoute[] {
		return GameLib.R['mapRoutes']
	}

	set mapRoutes(val) {
		GameLib.R['mapRoutes'] = val
	}

	get buffInfo(): BuffInfo[] {
		return GameLib.R['buffInfo']
	}

	set buffInfo(val) {
		GameLib.R['buffInfo'] = val
	}
	get affixInfo(): affixInfo[] {
		return GameLib.R['affixInfo']
	}
	set affixInfo(val) {
		GameLib.R['affixInfo'] = val
	}
	get affixPool(): affixInfo[] {
		return GameLib.R['affixPool']
	}
	set affixPool(val) {
		GameLib.R['affixPool'] = val
	}


	get affixName(): affixName[] {
		return GameLib.R['affixName']
	}

	set affixName(val) {
		GameLib.R['affixName'] = val
	}

	get affixMons(): affixMons[] {
		return GameLib.R['affixMons']
	}

	set affixMons(val) {
		GameLib.R['affixMons'] = val
	}


	get mapEventInfos(): mapEventInfo[] {
		return GameLib.R['mapEventInfo']
	}
	set mapEventInfos(val) {
		GameLib.R['mapEventInfo'] = val
	}

	get bossData() {
		return GameLib.R['bossDate']
	}

	set bossData(val) {
		GameLib.R['bossDate'] = val
	}
	// get bossBrushInfos(): BossBurshInfo[] {
	// 	return GameLib.R['bossBrushInfos']
	// }

	// set bossBrushInfos(val) {
	// 	GameLib.R['bossBrushInfos'] = val
	// }

	// get bossInfos(): BossInfo[] {
	// 	return GameLib.R['bossInfos']
	// }
	//
	// set bossInfos(val) {
	// 	GameLib.R['bossInfos'] = val
	// }

	/** 元神出窍 */
	get primordialOffline(): PrimordialOffline[] {
		return GameLib.R['primordialOffline']
	}

	set primordialOffline(val) {
		GameLib.R['primordialOffline'] = val
	}

	get primordialConfig(): PrimordialConfig[] {
		return GameLib.R['primordialConfig']
	}

	set primordialConfig(val) {
		GameLib.R['primordialConfig'] = val
	}

	/** 特权 */
	get vipConfig(): VipConfig[] {
		return GameLib.R['vipConfig']
	}

	set vipConfig(val) {
		GameLib.R['vipConfig'] = val
	}

	get shop(): ShopConfig[] {
		return GameLib.R['shop']
	}

	set shop(val) {
		GameLib.R['shop'] = val
	}

	get duplicateMapsInfo(): duplicateMap[] {
		return GameLib.R['duplicateMapInfo']
	}

	set duplicateMapsInfo(val) {
		GameLib.R['duplicateMapInfo'] = val
	}

	get equipStrongConsume(): equipStrongConsume[] {
		return GameLib.R['equipStrongConsume']
	}

	set equipStrongConsume(val) {
		GameLib.R['equipStrongConsume'] = val
	}

	get baseAttrs(): baseAttrsConfig[] {
		return GameLib.R['baseAttrs']
	}

	set baseAttrs(val) {
		GameLib.R['baseAttrs'] = val
	}

	get pagodaReward(): pagodaReward[] {
		return GameLib.R['pagodaReward']
	}

	set pagodaReward(val) {
		GameLib.R['pagodaReward'] = val
	}

	get fivePagodaReward(): fivePagodaReward[] {
		return GameLib.R['fivePagodaReward']
	}

	set fivePagodaReward(val) {
		GameLib.R['fivePagodaReward'] = val
	}

	get giftPacks(): giftPack[] {
		return GameLib.R['giftPacks']
	}

	set giftPacks(val) {
		GameLib.R['giftPacks'] = val
	}

	get fetter(): Fetter[] {
		return GameLib.R['fetter']
	}

	set fetter(val) {
		GameLib.R['fetter'] = val
	}

	//深渊每轮伤害
	get abyss() {
		return GameLib.R['abyss']
	}

	set abyss(val) {
		GameLib.R['abyss'] = val
	}

	//法宝池
	// get magicWeaponPool() {
	// 	return GameLib.R['magicWeaponPool']
	// }

	// set magicWeaponPool(val) {
	// 	GameLib.R['magicWeaponPool'] = val
	// }

	//五行属性
	get fiveAttr(): FiveAttrConfig[] {
		return GameLib.R['fiveAttr']
	}

	set fiveAttr(val) {
		GameLib.R['fiveAttr'] = val
	}

	//怪物动作
	get monsAction() {
		return GameLib.R['monsAction']
	}

	set monsAction(val) {
		GameLib.R['monsAction'] = val
	}

	//深渊排行奖励
	get abyssReward(): RankRewardInfo[] {
		return GameLib.R['abyssInfo']
	}

	set abyssReward(val) {
		GameLib.R['abyssInfo'] = val
	}

	get rogueLikeReward(): RankRewardInfo[] {
		return GameLib.R['rogueLikeReward']
	}

	set rogueLikeReward(val) {
		GameLib.R['rogueLikeReward'] = val
	}

	get placeReward(): RankRewardInfo[] {
		return GameLib.R['placeReward']
	}

	set placeReward(val) {
		GameLib.R['placeReward'] = val
	}

	get illusionInfo() {
		return GameLib.R['illusionInfo']
	}

	set illusionInfo(val) {
		GameLib.R['illusionInfo'] = val
	}

	get dimensionalMap(): dimensionalMap {
		return GameLib.R['dimensionalMap']
	}
	set dimensionalMap(val) {
		GameLib.R['dimensionalMap'] = val
	}

	get monAttrInfo(): MonAttrInfo[] {
		return GameLib.R['monAttrInfo']
	}
	set monAttrInfo(val) {
		GameLib.R['monAttrInfo'] = val
	}

	get monAttrInfo_fun(): MonAttrInfoFun[][] {
		return GameLib.R['monAttrInfo_fun']
	}
	set monAttrInfo_fun(val) {
		GameLib.R['monAttrInfo_fun'] = val
	}

	get titleInfo(): TitleInfo[] {
		return GameLib.R['titleInfo']
	}
	set titleInfo(val) {
		GameLib.R['titleInfo'] = val
	}

	get skillRunes(): skillRune[] {
		return GameLib.R['skillRunes']
	}
	set skillRunes(val) {
		GameLib.R['skillRunes'] = val
	}

	get illustrated() {
		return GameLib.R['illustrated']
	}
	set illustrated(val) {
		GameLib.R['illustrated'] = val
	}

	get realm() {
		return GameLib.R['realm']
	}
	set realm(val) {
		GameLib.R['realm'] = val
	}

	getMagicWeaponsById = (magic_id: number): MagicWeaponConfig => this.magicWeaponsInfo[magic_id - 1]
}

export const game_data: GameData = new GameData()

export const mons_magic_data = {}

export const MonstersMap = [
	'昆仑中谷',
	'昆仑峡谷',
	'昆仑深谷',
	'月氏谷一层',
	'月氏谷二层',
	'月氏神殿左室',
	'古代月氏谷一层',
	'古代月氏谷二层',
	'古代月氏圣殿左室',
	'异秘洞一层',
	'异秘洞二层',
	'异秘洞三层',
	'尖啸地狱一层',
	'尖啸地狱二层',
	'尖啸地狱三层',
	'石槽矿洞一层',
	'石槽矿洞二层',
	'石槽矿洞三层',
	'黄泉路',
	'望乡台',
	'奈何桥',
	'货船仓库',
	'货船船员舱',
	'货船船艄',
	'业火地狱一层',
	'业火地狱二层',
	'业火地狱三层',
	'冰寒地狱-洞穴',
	'冰寒地狱神殿-南',
	'冰寒地狱神殿-北',
	'如何神殿一层',
	'如何神殿二层',
	'如何神殿三层',
	'弦月林一层',
	'弦月林二层',
	'弦月林三层',
	'雪原洞穴一层',
	'雪原洞穴二层',
	'冰河原',
	'支柱宫广场',
	'支柱宫北书库',
	'支柱宫南书库'
]

// export const placeBoss = ['尸王', '火焰蛇王', '邪恶钳虫', '沃玛教主', '白野猪', '祖玛教主', '黄泉教主', '牛魔王', '赤月恶魔', '千年树妖']

export const SMALLBOSS_LIST = [
	'骷髅精灵',
	'半兽统帅',
	'电僵尸',
	'尸王',
	'蛇王',
	'沃玛战将',
	'沃玛卫士',
	'沃玛教主',
	'邪恶钳虫',
	'虹魔猪卫',
	'虹魔教主',
	'黄泉教主',
	'白野猪',
	'祖玛教主',
	'牛魔王',
	'赤月恶魔',
	'魔龙教主',
]

export const BOSS_LIST = [
	'雪域魔王',
	'瘟疫统帅',
	'半兽人首领',
	'蓝色水灵',
	'丛林破坏者',
	'蛮王',
	'雪国大祭司',
	'迷失洞主',
	'阳龙王',
	'魔风石王',
	'血池守护者',
	'蛮族首领',
	'金锤巨魔',
	'震天神魔',
	'奥玛黑灵',
	'死亡领主'
]

export const MON_LIST = [
	'狂热火蜥蜴',
	'恶魔蜘蛛',
	'黑牙蜘蛛',
	'剧毒蜘蛛',
	'蓝影刀客',
	'雪域侍卫',
	'雪域寒冰魔',
	'雪域灭天魔',
	'雪域五毒魔',
	'雪域野人',
	'雪域羊人',
	'雪域冰甲虫',
	'雪域冰狼',
	'掳玛赤狐',
	'掳玛白狐',
	'狐月黄蛙',
	'狐月褐蛙',
	'触角神魔',
	'沙漠石人',
	'地狱猎犬',
	'重甲守卫',
	'红衣法师',
	'恶形怪',
	'瘟疫鱼人',
	'瘟疫金蟾',
	'剧毒鱼人',
	'沙漠秃鹰',
	'半兽人巡逻兵',
	'半兽人矿工',
	'半兽人长矛兵',
	'半兽人狂战士',
	'血池战士',
	'血池兵役',
	'黑熊',
	'棕熊',
	'豹',
	'狮子',
	'精英战士',
	'废墟矿工',
	'废墟蜥蜴',
	'废墟弩手',
	'双刀客',
	'急先锋',
	'暗影媚刺',
	'强毒法师',
	'陶俑弩兵',
	'苦命矿工',
	'道场战士',
	'道场术士',
	'道场禅僧',
	'泽国蚁妖',
	'泽国树妖',
	'泽国兽妖',
	'泽国法师',
	'泽国野毛怪',
	'雪国蛤蟆',
	'雪国残兵',
	'雪国蛊魔',
	'雪山狼',
	'火山狼',
	'地狱弩兵',
	'地狱射手',
	'荒野石人',
	'消瘦的恶鬼',
	'残酷的恶灵',
	'冻伤的恶灵',
	'人头蜘蛛',
	'邪恶爬虫',
	'三角龙',
	'冰原刺客',
	'浮龙金蛇',
	'食蚁兽'
]

export const ELITE_LIST = [
	'圣殿卫士',
	'绿魔蜘蛛',
	'蓝背蜘蛛',
	'灵魂收割者',
	'铁翼巨蛾',
	'巨镰蜘蛛',
	'金杖蜘蛛',
	'圣殿护卫',
	'雪域战将',
	'雪域天将',
	'雪域卫士',
	'雪域力士',
	'神殿护卫',
	'狮虎',
	'轻甲守卫',
	'海神将领',
	'霸王守卫',
	'血兽',
	'瘟疫使者',
	'瘟疫长老',
	'半兽人驯兽师',
	'半兽人骑兵',
	'半兽人巫医',
	'血池守卫',
	'血池巨魔',
	'血池战将',
	'烈焰法师',
	'废墟剑客',
	'废墟蜥蜴法师',
	'金胜锤兵',
	'巨刃力士',
	'流觞弓匠',
	'泽国巴哈',
	'泽国巴丘',
	'泽国筋肉人',
	'泥潭怪兽',
	'黑袍战士',
	'红袍战士',
	'灰袍战士',
	'白衣射手',
	'死灵法师',
	'地狱巨镰鬼',
	'死亡女神',
	'侩子手',
	'地狱狂战士',
	'勾魂使者',
	'灵魂吞噬者',
	'灵魂收集者',
	'黑色剑牙虎',
	'白色剑牙虎',
	'双头金蛇',
	'叛乱法师'
]
