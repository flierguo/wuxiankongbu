import { PlayerAttr } from './player'
import { MagicWeapon } from './type'

export interface players_info {
	playerId: number
	sChrName: string
	magicWeapons: MagicWeapon[]
	armsIdx: number[]
	attr: PlayerAttr
}
export interface zLRank {
	playerId: number
	playerName: string
	zl: number
}

export interface mapLogInfo {
	idx: number
	logInfo: string
	type: number
	time: number
	color: string
	desc: string
	region: number
	level: number
}

export interface padogoRank {
	playerId: number
	playerName: string
	layer: number
}
export interface placeRank {
	playerId: number
	playerName: string
	layer: number
	time: number
}

export interface roguelikeRank {
	playerId: number
	playerName: string
	maxTime: number
}

export interface abyssDamageMaxRank {
	playerId: number
	playerName: string
	abyssDamageMax: number
}

export interface abyssDamageMaxRanks {
	index: number
	abyssDamageMaxRank: abyssDamageMaxRank[]
}

export interface players_1 {
	playerId: number
	serverId: number
	sAccount: string
	sChrName: string
	boDeleted: string
	boSelected: string
	nSelectID: number
	dCreateDate: string
	dUpdateDate: string
	btMemberType: number
	btMemberLevel: number
	sCurMap: string
	wCurX: number
	wCurY: number
	btDir: number
	btHair: number
	btSex: number
	btJob: number
	btHeader: number
	btNation: number
	nLevel: number
	nGold: number
	Abil: string
	wStatusTimeArr: string
	sHomeMap: string
	wHomeX: number
	wHomeY: number
	sDearName: string
	sMasterName: string
	boMaster: string
	btCreditPoint: number
	btDivorce: number
	btMarryCount: number
	sStoragePwd: string
	btReLevel: number
	btAttatckMode: number
	BonusAbil: string
	nBonusPoint: number
	nGameGold: number
	nGameDiaMond: number
	nGameGird: number
	nGamePoint: number
	btGameGlory: number
	nPayMentPoint: number
	nPKPOINT: number
	btAllowGroup: number
	btIncHealth: number
	btIncSpell: number
	btIncHealing: number
	btFightZoneDieCount: number
	boLockLogon: string
	wContribution: number
	nHungerStatus: number
	boAllowGuildReCall: string
	wGroupRcallTime: number
	dBodyLuck: number
	boAllowGroupReCall: string
	boAllowDeal: string
	boAllowGuild: string
	boAllowReAlive: string
	boShowFashion: string
	nEXPRATE: number
	nExpTime: number
	btLastOutStatus: number
	wMasterCount: number
	btStatus: number
	UnKnow: string
	QuestFlag: string
	HumItems: string
	BagItems: string
	HumMagics: string
	StorageItems: string
	HumTitles: string
	n_WinExp: number
	n_UsesItemTick: number
	nReserved: number
	nReserved1: number
	nReserved2: number
	nReserved3: number
	n_Reserved: number
	n_Reserved1: number
	n_Reserved2: number
	n_Reserved3: number
	boReserved: string
	boReserved1: string
	boReserved2: string
	boReserved3: string
	m_GiveDate: number
	Exp68: number
	MaxExp68: number
	nExpSkill69: number
	HumNGMagics: string
	HumPulses: string
	HumBatterMagics: string
	BatterMagicOrder: string
	m_nVarData: string
	dataVersion: number
	nTotalAbil: number
	nMinPrimaryAbil: number
	nMaxPrimaryAbil: number
	BinData1: string
	nBagSpace: number
	nStorageSpace: number
	nBigStorageSpace: number
	sDefValue: string
	BigStorageItems: string
	Relation: string
	StallData: string
	Mail: string
	Missions: string
	customSaveStr: string
	itemFliters: string
}
