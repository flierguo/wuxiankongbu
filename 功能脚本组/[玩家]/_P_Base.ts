/*玩家data*/
import { KeyData, NumData } from "../../全局脚本[公共单元]/DefiniensConst"

/* S[index: Integer ]: String  角色的临时字符串变量（index为1-300）*/
export const _P_S_玩家名字 = 3;
///////////////////怪物P变量



/* N[index: Integer ]: Integer  角色的整形变量，该变量会保存到数据库（index为1-300）*/
export const 玩家杀怪数量 = 288;//玩家杀怪记录record
export const _P_N_JAIL = 2;//玩家被抓进监狱次数
export const _P_N_监狱计时 = 5;
export const 仓库总格子数 = 7;
export const _P_N_可复活次数 = 8;






/* P[index: Integer ]: Integer  角色的临时整型变量（index为1-300）*/
export const _P_P_ATTACK = 1;// 监控玩家的 攻击     次数
export const _P_P_MAGIC = 2;// 监控玩家的 魔法     次数
export const _P_P_RIDING = 3;// 监控玩家的 骑马跑动 次数
export const _P_P_RUNNING = 4;// 监控玩家的 跑步     次数
export const _P_P_WALK = 5;// 监控玩家的 走路     次数
export const _P_P_PRISON = 6;// 监控玩家的 监狱变量 Prison
export const _P_P_PAGE = 7;// NPC 当前页面
/*玩家附加属性*/
export const _P_P_AbilityData: KeyData = {
    'AC': 10,
    'ACMax': 11,
    'MAC': 12,
    'MACMax': 13,
    'DCMax': 14,
    'DC': 15,
    'MC': 16,
    'MCMax': 17,
    'SC': 18,
    'SCMax': 19,
    'TC': 20,
    'TCMax': 21,
    'PC': 22,
    'PCMax': 23,
    'WC': 24,
    'WCMax': 25,
    'HP': 26,
    'MP': 27,

    'HitPoint': 28,
    'AntiPoison': 29,
    'PoisonRecover': 30,
    'HealthRecover': 31,
    'SpellRecover': 32,
    'AntiMagic': 33,
    'ExpRate': 34,
    'GoldRate': 35,
    'ItemRate': 36,
    'HitSpeed': 37,

    'CriticalHit': 38,
    'CriticalHitDef': 39,
    'PunchHit': 40,
    'PunchHitDef': 41,
    'AppendDamage': 42,
    'AppendDamageDef': 43,
    'DamageAbsorb': 44,
    'DamageAdd': 45,
    '回收倍率': 46,
    'HP倍率': 47,
    'MP倍率': 48,

}
export const 关闭仓库 = 8;// NPC 当前页面
export const 仓库第一页 = 9;// NPC 当前页面

/* Check[Index: Integer ]: Boolean Check变量 */
export const _P_CH_按钮伸缩 = 2; // 
/*玩家装备颜色Check (颜色对应于 _G_Color_1，如果 _G_Color_1 改变。记得这里也要改变)*/
export const _P_CH_ITEMCOLOR: NumData = {
    255: 101,
    250: 102,
    251: 103,
    249: 104,
    244: 105,
    242: 106,
    243: 107,
    70: 108,
    94: 109,
}




export enum 所有职业技能等级 {
    攻杀剑术 = 95, 刺杀剑术 = 96, 雷电术 = 97, 灵魂火符 = 98, 施毒术 = 99, 冰咆哮 = 100, 飓风破 = 101,
    霜月X = 102, 罗汉棍法 = 103, 达摩棍法 = 104, 狂怒 = 105, 召唤战神 = 106, 战神附体 = 107, 天神附体 = 108,
    万剑归宗 = 109, 圣光打击 = 110, 防御姿态 = 111, 愤怒 = 112, 惩罚 = 113, 审判救赎 = 114, 法术奥义 = 115,
    火墙 = 116, 流星火雨 = 117, 致命一击 = 118, 打击符文 = 119, 暴风雨 = 120, 寒冬领域 = 121, 冰霜之环 = 122,
    拉布拉多 = 123, 凶猛野兽 = 124, 嗜血狼人 = 125, 丛林虎王 = 126, 剧毒火海 = 127, 妙手回春 = 128, 互相伤害 = 129,
    恶魔附体 = 130, 末日降临 = 131, 增伤 = 132, 弱点 = 133, 致命打击 = 134, 暗影杀阵 = 135, 鬼舞斩 = 136,
    鬼舞术 = 137, 鬼舞之殇 = 138, 鬼舞者 = 139, 群魔乱舞 = 140, 万箭齐发 = 141, 复仇 = 142, 成长 = 143,
    神灵救赎 = 144, 生存 = 145, 分裂箭 = 146, 召唤宠物 = 147, 人宠合一 = 148, 命运刹印 = 149, 天雷阵 = 150,
    护法灭魔 = 151, 体质强化 = 152, 碎石破空 = 153, 至高武术 = 154, 金刚护法 = 155, 转生 = 156, 金刚护体 = 157,
    擒龙功 = 158, 轮回之道 = 159, 猎人宝宝速度 = 160, 驯兽宝宝速度 = 161, 战神宝宝速度 = 162, 罗汉宝宝速度 = 163
}

export enum 所有职业技能伤害 {
    攻杀剑术 = 401, 刺杀剑术 = 402, 雷电术 = 403, 灵魂火符 = 404, 冰咆哮 = 405, 飓风破 = 406, 霜月X = 407,
    罗汉棍法 = 408, 达摩棍法 = 409, 猎人宝宝 = 410, 驯兽宝宝 = 411, 战神宝宝 = 412, 罗汉宝宝 = 413,

    狂怒 = 414, 万剑归宗 = 415, 圣光打击 = 416, 愤怒 = 417, 审判救赎 = 418, 
    火墙 = 419, 流星火雨 = 420, 暴风雨 = 421, 寒冬领域 = 422, 冰霜之环 = 423,
    剧毒火海 = 424, 互相伤害 = 425, 末日降临 = 426,
    弱点 = 427, 暗影杀阵 = 428, 鬼舞斩 = 429, 鬼舞术 = 430, 群魔乱舞 = 431, 
    万箭齐发 = 432, 复仇 = 433, 神灵救赎 = 434, 
    分裂箭 = 435, 命运刹印 = 436, 
    天雷阵 = 437, 碎石破空 = 439, 至高武术 = 438, 金刚护法 = 440,
    猎人宝宝速度 = 466, 驯兽宝宝速度 = 467, 战神宝宝速度 = 468, 罗汉宝宝速度 = 469
}



export enum 所有职业技能倍攻 {
    攻杀剑术 = 195, 刺杀剑术 = 196, 雷电术 = 197, 灵魂火符 = 198, 冰咆哮 = 199, 飓风破 = 200, 霜月X = 201,
    罗汉棍法 = 202, 达摩棍法 = 203, 人物技能倍攻 = 204, 所有宝宝倍攻 = 205, 猎人宝宝攻击倍攻 = 206, 驯兽宝宝攻击倍攻 = 207, 战神宝宝攻击倍攻 = 208, 罗汉宝宝攻击倍攻 = 209,
    狂怒 = 210, 万剑归宗 = 211, 圣光打击 = 212, 愤怒 = 213, 审判救赎 = 214, 火墙 = 215, 流星火雨 = 216,
    暴风雨 = 217, 寒冬领域 = 218, 冰霜之环 = 219, 剧毒火海 = 220, 互相伤害 = 221, 末日降临 = 222, 弱点 = 223,
    暗影杀阵 = 224, 鬼舞斩 = 225, 鬼舞术 = 226, 群魔乱舞 = 227, 万箭齐发 = 228, 复仇 = 229, 神灵救赎 = 230,
    分裂箭 = 231, 命运刹印 = 232, 天雷阵 = 233, 至高武术 = 234, 碎石破空 = 235, 金刚护法 = 236
}


export enum 飘血 {
    延迟1000 = 1, 延迟1400 = 2, 延迟1500 = 3, 延迟1600 = 4, 延迟1700 = 5, 延迟1800 = 6, 延迟1900 = 7, 延迟2000 = 8, 延迟2100 = 9, 延迟2200 = 10,
    法宝伤害 = 23, 暴击 = 24, 未命中25 = 25, 元素伤害 = 26, 回血 = 27
}
export enum 基础技能 {
    攻杀剑术 = 7, 刺杀剑术 = 12
}
export enum 显示图标 {
    宝宝群雷 = 1, 刺客增伤 = 2, 暗影值 = 3, 猎人宝宝群攻 = 4, 武僧金刚护体 = 5
}
export enum 特效占位 {
    狂怒状态 = 1,
}
export enum 特效 {
    冰冻 = 100, 妙手回春 = 101, 刺客弱点 = 102, 鬼舞群魔乱舞 = 103, 武僧天雷阵 = 104, 罗汉无敌 = 105, 冰封 = 106 ,狂怒状态 = 107
}

export namespace 技能ID {
    export enum 战神 { 万剑归宗主动 = 10000, 狂怒被动 = 10006, 战神附体被动 = 10008, 天神附体被动 = 10009 }
    export enum 骑士 { 圣光打击被动 = 10001, 愤怒被动 = 10002, 审判救赎主动 = 10003, 防御姿态被动 = 10010, 惩罚被动 = 10011 }
    export enum 火神 { 法术奥义被动 = 10012, 闪现主动 = 10013, 致命一击被动 = 10014, 火墙主动 = 22, 流星火雨主动 = 219, 火墙之术主动 = 22 }
    export enum 冰法 { 暴风雨主动 = 220, 冰霜之环被动 = 10004, 寒冬领域主动 = 221, 打击符文被动 = 10015 }
    export enum 驯兽师 { 萌萌浣熊主动 = 10017, 凶猛野兽被动 = 10018, 嗜血狼人主动 = 10019, 丛林虎王主动 = 10020 }
    export enum 牧师 { 剧毒火海主动 = 224, 妙手回春主动 = 10023, 互相伤害被动 = 10024, 恶魔附体被动 = 10025, 末日降临主动 = 225 }
    export enum 刺客 { 弱点主动 = 10027, 增伤主动 = 10028, 致命打击被动 = 10029, 暗影杀阵主动 = 10030 }
    export enum 鬼舞者 { 鬼舞斩被动 = 10031, 鬼舞术被动 = 10032, 鬼舞之殇主动 = 10033, 鬼舞者被动 = 10034, 群魔乱舞被动 = 10035 }
    export enum 神射手 { 万箭齐发主动 = 226, 复仇被动 = 10036, 成长被动 = 10037, 生存被动 = 10038, 神灵救赎主动 = 227 , 万箭齐发啊 = 10057}
    export enum 猎人 { 分裂箭被动 = 10040, 召唤宠物主动 = 10041, 宠物突变主动 = 10042, 人宠合一被动 = 10043, 命运刹印主动 = 216 }
    export enum 武僧 { 天雷阵被动 = 10059, 护法灭魔被动 = 10048, 体质强化被动 = 10046, 至高武术主动 = 10047, 碎石破空被动 = 10045 }
    export enum 罗汉 { 金刚护法被动 = 10049, 金刚不败被动 = 10050, 金刚护体被动 = 10051, 擒龙功主动 = 10052, 罗汉金钟主动 = 10053 }
    export enum 通用 { 雷电术 = 218, 冰咆哮 = 217, 施毒术给伤害 = 10062, 罗汉棍法 = 204, 达摩棍法 = 209, 灵魂火符 = 222, 霜月X = 170, 飓风破 = 223 }
}

export function 人物属性随机(Player: TPlayObject): number {
    let 上限 = 0, 下限 = 0
    switch (Player.GetJob()) {
        case 0:
            上限 = Player.GetDCMin()
            下限 = Player.GetDCMax()
            break
        case 1:
            上限 = Player.GetMCMin()
            下限 = Player.GetMCMax()
            break
        case 2:
            上限 = Player.GetSCMin()
            下限 = Player.GetSCMax()
            break
        case 3:
            上限 = Player.GetPCMin()
            下限 = Player.GetPCMax()
            break
        case 4:
            上限 = Player.GetTCMin()
            下限 = Player.GetTCMax()
            break
        case 5:
            上限 = Player.GetWCMin()
            下限 = Player.GetWCMax()
            break
    }
    let 最小值 = (下限 - 上限) / 99 * Player.V.幸运值
    return randomRange(最小值, 下限)
}

// export function 人物防御随机(Player: TPlayObject): number {
//     let 上限 = 0, 下线 = 0
//     上限 = Player.GetACMin()
//     下线 = Player.GetACMax()
//     let 最小值 = (下线 - 上限) / 9 * Player.V.幸运值
//     return randomRange(上限 + 最小值, 下线)
// }

export function 人物防御随机(Actor: TActor): number {
    let Player: TPlayObject = Actor as TPlayObject
    let 上限 = 0, 下限 = 0

    if (Player.IsPlayer()) {
        上限 = Player.GetACMin()
        下限 = Player.GetACMax()
        let 最小值 = (下限 - 上限) / 9 * Player.V.幸运值
        return randomRange(上限 + 最小值, 下限)
    }
    上限 = Actor.GetACMin()
    下限 = Actor.GetACMax()
    return randomRange(上限, 下限)


}


interface DonationData {
    _A_行会名字: number,
    _G_杀人数量: number
}

export const _G_GA_DonationData: DonationData[] = [
    { _A_行会名字: 1, _G_杀人数量: 1 },//0
    { _A_行会名字: 2, _G_杀人数量: 2 },//1
    { _A_行会名字: 3, _G_杀人数量: 3 },//2
    { _A_行会名字: 4, _G_杀人数量: 4 },
]