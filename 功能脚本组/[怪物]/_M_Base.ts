import { KeyData } from "../../全局脚本[公共单元]/DefiniensConst"

export const _M_N_宝宝释放群雷 = 1;
export const _M_N_猎人宝宝群攻 = 2;
export const 怪物星数 = 3;
export const 怪物超星数 = 4;
export const 宝宝基础技能 = 5;
export const 宝宝高级技能 = 6;
export const TAG = 7;
export const 允许鞭尸 = 8;

export const _M_S_LEVEL = 9;
export const 怪物爆率文件 = 10;
export const 怪物称号 = 11;
export const 原始名字 = 12;






export enum 怪物颜色 {
	世界BOSS = 69,  // 删除
	人形红色 = 249,
	灭世BOSS橙 = 243,
	苍穹BOSS紫 = 241,
	洪荒BOSS黄 = 251,
	远古BOSS粉 = 253,
	深渊BOSS浅绿 = 254,
	头领BOSS蓝 = 154,
	精英小怪绿 = 250,
	弱小小怪白 = 255,


	蝼蚁白 = 255,
	平凡绿 = 250,
	野蛮浅绿 = 254,
	劲敌蓝 = 154,
	精英黄 = 251,
	骑士橙 = 243,
	头领紫 = 241,
	深渊粉 = 253,
	洪荒灰 = 233,
	灭世BOSS红 = 249,
}


// export const 人形红色: number = 249;
// export const 灭世BOSS: number = 243;
// export const 苍穹BOSS: number = 241;
// export const 洪荒BOSS: number = 251;
// export const 远古BOSS: number = 253;
// export const 深渊BOSS: number = 254;
// export const 头领BOSS: number = 252;
// export const 精英小怪: number = 250;
// export const 弱小小怪: number = 255;

//怪物牛逼程度  区分名字颜色 和怪物颜色   武魂·人形怪   灭世·魔神BOSS    苍穹·魔神BOSS 洪荒·邪恶BOSS  远古·邪恶BOSS 深渊·BOSS  头领·BOSS   精英·小怪  弱小·小怪
///////////////////怪物基础属性
export const _M_BaseData: KeyData = {
	///////////////////怪物基础属性
	"HP": 10,    //HP
	"DC": 10,    //攻击
	"AC": 10,    //防御
	"DCJS": 10,    //神力减伤
	"BGJS": 10,    //倍功减伤
	"MCJS": 10,    //魔次减伤
	"IT": 10,    //怪物赋予装备 的属性  DC ,MC, SC ... ...
	"ITMC": 10,    //怪物赋予装备魔次的属性
	///////////////////怪物基础倍率
	"HPRE": 1,
	"DCRE": 1,
	"ACRE": 1,
	"SCJSRE": 5,
	"BGJSRE": 5,
	"MCJSRE": 5,
	"ITRE": 1,
	"ITMCRE": 1,
}

export class MonsterData {
	HP: number
	DC: number
	AC: number
	DCJS: number
	MCJS: number
	IT: number
	ITMC: number
}




