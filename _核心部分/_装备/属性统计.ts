/**
 * 属性统计模块 - 核心部分
 * 
 * 功能：
 * - 装备属性统计与计算
 * - 技能等级与魔次处理
 * - 人物额外属性计算
 * - UI显示更新
 * 
 * 使用大数值计算方法，支持超大数值运算
 */

import { 智能计算, 比较 } from "../../大数值/核心计算方法"
import { 大数值整数简写, 血量显示 } from "../字符计算"
import {
    基础属性第一条, 基础属性第八条,
    职业第一条, 职业第六条,
    基础词条, 技能魔次
} from "../基础常量"
import { 神器属性统计 } from "./神器统计"

// ==================== JSON缓存系统 ====================
class 装备JSON缓存 {
    private static cache = new Map<string, any>();
    private static readonly MAX_SIZE = 200;

    public static 获取(customDesc: string): any {
        if (!customDesc || customDesc === '') return null;
        if (this.cache.has(customDesc)) return this.cache.get(customDesc);
        try {
            const 解析数据 = JSON.parse(customDesc);
            if (this.cache.size >= this.MAX_SIZE) {
                const 最旧键 = this.cache.keys().next().value;
                this.cache.delete(最旧键);
            }
            this.cache.set(customDesc, 解析数据);
            return 解析数据;
        } catch { return null; }
    }
    public static 清空(): void { this.cache.clear(); }
}

// ==================== 工具函数 ====================

/** 获取身上装备 */
export function 获取身上装备(Player: TPlayObject, 位置: number): TUserItem | null {
    switch (位置) {
        case 0: return Player.Dress;
        case 1: return Player.Wepon;
        case 2: return Player.NeckLace;
        case 3: return Player.Helmet;
        case 4: return Player.RightHand;
        case 5: return Player.ArmringLeft;
        case 6: return Player.ArmringRight;
        case 7: return Player.RingLeft;
        case 8: return Player.RingRight;
        case 9: return Player.Belt;
        case 10: return Player.Boots;
        case 11: return Player.Shield;
        case 12: return Player.Charm;
        case 13: return Player.Bujuk;
        case 14: return Player.Fashion;
        case 15: return Player.Mount;
        case 16: return Player.Mask;
        case 17: case 18: case 19: case 20: case 21: case 22:
            return Player.GetJewelrys(位置 - 17);
        case 23: case 24: case 25: case 26: case 27: case 28:
        case 29: case 30: case 31: case 32: case 33: case 34:
            return Player.GetZodiacs(位置 - 23);
        default: return null;
    }
}

// ==================== 变量初始化 ====================
/** 清空玩家R变量 */
export function 清空变量(Player: TPlayObject): void {
    // 自定属性初始化
    Player.R.自定属性 = {};
    Player.R.自定属性[161] = '500';  // 攻击
    Player.R.自定属性[162] = '500';  // 魔法
    Player.R.自定属性[163] = '500';  // 道术
    Player.R.自定属性[164] = '500';  // 刺术
    Player.R.自定属性[165] = '500';  // 箭术
    Player.R.自定属性[166] = '500';  // 武术
    Player.R.自定属性[167] = '100000'; // 血量
    Player.R.自定属性[168] = '500';  // 防御
    Player.R.自定属性[169] = '0';    // 全属性

    // 基础属性倍数
    Player.R.生命倍数 = 1;
    Player.R.防御倍数 = 1;
    Player.R.攻击倍数 = 1;
    Player.R.魔法倍数 = 1;
    Player.R.道术倍数 = 1;
    Player.R.刺术倍数 = 1;
    Player.R.射术倍数 = 1;
    Player.R.武术倍数 = 1;

    // 基础技能魔次
    Player.R.攻杀剑术魔次 = '0';
    Player.R.半月弯刀魔次 = '0';
    Player.R.雷电术魔次 = '0';
    Player.R.暴风雪魔次 = '0';
    Player.R.灵魂火符魔次 = '0';
    Player.R.飓风破魔次 = '0';
    Player.R.暴击术魔次 = '0';
    Player.R.霜月魔次 = '0';
    Player.R.精准箭术魔次 = '0';
    Player.R.万箭齐发魔次 = '0';
    Player.R.罗汉棍法魔次 = '0';
    Player.R.天雷阵魔次 = '0';

    // 天枢职业技能魔次
    Player.R.怒斩魔次 = '0';
    Player.R.人之怒魔次 = '0';
    Player.R.地之怒魔次 = '0';
    Player.R.天之怒魔次 = '0';
    Player.R.神之怒魔次 = '0';

    // 血神职业技能魔次
    Player.R.血气献祭魔次 = '0';
    Player.R.血气燃烧魔次 = '0';

    // 暗影职业技能魔次
    Player.R.暗影袭杀魔次 = '0';
    Player.R.暗影剔骨魔次 = '0';
    Player.R.暗影风暴魔次 = '0';
    Player.R.暗影附体魔次 = '0';

    // 烈焰职业技能魔次
    Player.R.火焰追踪魔次 = '0';
    Player.R.烈焰护甲魔次 = '0';
    Player.R.爆裂火冢魔次 = '0';
    Player.R.烈焰突袭魔次 = '0';

    // 正义职业技能魔次
    Player.R.圣光魔次 = '0';
    Player.R.行刑魔次 = '0';
    Player.R.洗礼魔次 = '0';

    // 不动职业技能魔次
    Player.R.如山魔次 = '0';
    Player.R.金刚掌魔次 = '0';

    // 其他属性
    Player.R.经验加成 = 0;
    Player.R.爆率加成 = 0;
    Player.R.造成伤害 = '0';

    // 神器相关属性（每次统计时重置，由神器统计模块重新计算）
    Player.R.全体魔次 = '0';
    Player.R.狂化阶数 = 0;
    Player.R.融合阶数 = 0;
    Player.R.迅疾阶数 = 0;
    Player.R.念力阶数 = 0;
    Player.R.甲壳阶数 = 0;
    Player.R.协作阶数 = 0;
    Player.R.神器爆率加成 = 0;
    Player.R.神器回收加成 = 0;
    Player.R.神器增伤加成 = '0';
    Player.R.基因锁等级 = Player.R.基因锁等级 || 0; // 基因锁等级保留，不重置

    Player.RecalcAbilitys();
}


// ==================== 装备属性处理 ====================
/** 处理装备基础词条属性 */
function 处理基础词条(Player: TPlayObject, 词条ID: number, 属性值: string): void {
    switch (词条ID) {
        case 基础词条.攻击:
        case 基础词条.攻击2:
            Player.R.自定属性[161] = 智能计算(Player.R.自定属性[161], 属性值, 1);
            break;
        case 基础词条.魔法:
        case 基础词条.魔法2:
            Player.R.自定属性[162] = 智能计算(Player.R.自定属性[162], 属性值, 1);
            break;
        case 基础词条.道术:
        case 基础词条.道术2:
            Player.R.自定属性[163] = 智能计算(Player.R.自定属性[163], 属性值, 1);
            break;
        case 基础词条.刺术:
        case 基础词条.刺术2:
            Player.R.自定属性[164] = 智能计算(Player.R.自定属性[164], 属性值, 1);
            break;
        case 基础词条.箭术:
        case 基础词条.箭术2:
            Player.R.自定属性[165] = 智能计算(Player.R.自定属性[165], 属性值, 1);
            break;
        case 基础词条.武术:
        case 基础词条.武术2:
            Player.R.自定属性[166] = 智能计算(Player.R.自定属性[166], 属性值, 1);
            break;
        case 基础词条.血量:
        case 基础词条.血量2:
            Player.R.自定属性[167] = 智能计算(Player.R.自定属性[167], 属性值, 1);
            break;
        case 基础词条.防御:
        case 基础词条.防御2:
            Player.R.自定属性[168] = 智能计算(Player.R.自定属性[168], 属性值, 1);
            break;
    }
}

/** 处理技能魔次属性 */
function 处理技能魔次(Player: TPlayObject, 魔次ID: number, 属性值: string): void {
    switch (魔次ID) {
        // ==================== 基础技能魔次 ====================
        case 技能魔次.攻杀剑术:
            Player.R.攻杀剑术魔次 = 智能计算(Player.R.攻杀剑术魔次, 属性值, 1);
            break;
        case 技能魔次.半月弯刀:
            Player.R.半月弯刀魔次 = 智能计算(Player.R.半月弯刀魔次, 属性值, 1);
            break;
        case 技能魔次.雷电术:
            Player.R.雷电术魔次 = 智能计算(Player.R.雷电术魔次, 属性值, 1);
            break;
        case 技能魔次.暴风雪:
            Player.R.暴风雪魔次 = 智能计算(Player.R.暴风雪魔次, 属性值, 1);
            break;
        case 技能魔次.灵魂火符:
            Player.R.灵魂火符魔次 = 智能计算(Player.R.灵魂火符魔次, 属性值, 1);
            break;
        case 技能魔次.飓风破:
            Player.R.飓风破魔次 = 智能计算(Player.R.飓风破魔次, 属性值, 1);
            break;
        case 技能魔次.暴击术:
            Player.R.暴击术魔次 = 智能计算(Player.R.暴击术魔次, 属性值, 1);
            break;
        case 技能魔次.霜月:
            Player.R.霜月魔次 = 智能计算(Player.R.霜月魔次, 属性值, 1);
            break;
        case 技能魔次.精准箭术:
            Player.R.精准箭术魔次 = 智能计算(Player.R.精准箭术魔次, 属性值, 1);
            break;
        case 技能魔次.万箭齐发:
            Player.R.万箭齐发魔次 = 智能计算(Player.R.万箭齐发魔次, 属性值, 1);
            break;
        case 技能魔次.罗汉棍法:
            Player.R.罗汉棍法魔次 = 智能计算(Player.R.罗汉棍法魔次, 属性值, 1);
            break;
        case 技能魔次.天雷阵:
            Player.R.天雷阵魔次 = 智能计算(Player.R.天雷阵魔次, 属性值, 1);
            break;

        // ==================== 天枢职业技能魔次 ====================
        case 技能魔次.怒斩:
            Player.R.怒斩魔次 = 智能计算(Player.R.怒斩魔次, 属性值, 1);
            break;
        case 技能魔次.人之怒:
            Player.R.人之怒魔次 = 智能计算(Player.R.人之怒魔次, 属性值, 1);
            break;
        case 技能魔次.地之怒:
            Player.R.地之怒魔次 = 智能计算(Player.R.地之怒魔次, 属性值, 1);
            break;
        case 技能魔次.天之怒:
            Player.R.天之怒魔次 = 智能计算(Player.R.天之怒魔次, 属性值, 1);
            break;
        case 技能魔次.神之怒:
            Player.R.神之怒魔次 = 智能计算(Player.R.神之怒魔次, 属性值, 1);
            break;

        // ==================== 血神职业技能魔次 ====================
        case 技能魔次.血气献祭:
            Player.R.血气献祭魔次 = 智能计算(Player.R.血气献祭魔次, 属性值, 1);
            break;
        case 技能魔次.血气燃烧:
            Player.R.血气燃烧魔次 = 智能计算(Player.R.血气燃烧魔次, 属性值, 1);
            break;

        // ==================== 暗影职业技能魔次 ====================
        case 技能魔次.暗影袭杀:
            Player.R.暗影袭杀魔次 = 智能计算(Player.R.暗影袭杀魔次, 属性值, 1);
            break;
        case 技能魔次.暗影剔骨:
            Player.R.暗影剔骨魔次 = 智能计算(Player.R.暗影剔骨魔次, 属性值, 1);
            break;
        case 技能魔次.暗影风暴:
            Player.R.暗影风暴魔次 = 智能计算(Player.R.暗影风暴魔次, 属性值, 1);
            break;
        case 技能魔次.暗影附体:
            Player.R.暗影附体魔次 = 智能计算(Player.R.暗影附体魔次, 属性值, 1);
            break;

        // ==================== 烈焰职业技能魔次 ====================
        case 技能魔次.火焰追踪:
            Player.R.火焰追踪魔次 = 智能计算(Player.R.火焰追踪魔次, 属性值, 1);
            break;
        case 技能魔次.烈焰护甲:
            Player.R.烈焰护甲魔次 = 智能计算(Player.R.烈焰护甲魔次, 属性值, 1);
            break;
        case 技能魔次.爆裂火冢:
            Player.R.爆裂火冢魔次 = 智能计算(Player.R.爆裂火冢魔次, 属性值, 1);
            break;
        case 技能魔次.烈焰突袭:
            Player.R.烈焰突袭魔次 = 智能计算(Player.R.烈焰突袭魔次, 属性值, 1);
            break;

        // ==================== 正义职业技能魔次 ====================
        case 技能魔次.圣光:
            Player.R.圣光魔次 = 智能计算(Player.R.圣光魔次, 属性值, 1);
            break;
        case 技能魔次.行刑:
            Player.R.行刑魔次 = 智能计算(Player.R.行刑魔次, 属性值, 1);
            break;
        case 技能魔次.洗礼:
            Player.R.洗礼魔次 = 智能计算(Player.R.洗礼魔次, 属性值, 1);
            break;

        // ==================== 不动职业技能魔次 ====================
        case 技能魔次.如山:
            Player.R.如山魔次 = 智能计算(Player.R.如山魔次, 属性值, 1);
            break;
        case 技能魔次.金刚掌:
            Player.R.金刚掌魔次 = 智能计算(Player.R.金刚掌魔次, 属性值, 1);
            break;

        // ==================== 职业魔次（加成到该职业所有技能） ====================
        case 技能魔次.天枢:
            Player.R.怒斩魔次 = 智能计算(Player.R.怒斩魔次, 属性值, 1);
            Player.R.人之怒魔次 = 智能计算(Player.R.人之怒魔次, 属性值, 1);
            Player.R.地之怒魔次 = 智能计算(Player.R.地之怒魔次, 属性值, 1);
            Player.R.天之怒魔次 = 智能计算(Player.R.天之怒魔次, 属性值, 1);
            Player.R.神之怒魔次 = 智能计算(Player.R.神之怒魔次, 属性值, 1);
            break;
        case 技能魔次.血神:
            Player.R.血气献祭魔次 = 智能计算(Player.R.血气献祭魔次, 属性值, 1);
            Player.R.血气燃烧魔次 = 智能计算(Player.R.血气燃烧魔次, 属性值, 1);
            break;
        case 技能魔次.暗影:
            Player.R.暗影袭杀魔次 = 智能计算(Player.R.暗影袭杀魔次, 属性值, 1);
            Player.R.暗影剔骨魔次 = 智能计算(Player.R.暗影剔骨魔次, 属性值, 1);
            Player.R.暗影风暴魔次 = 智能计算(Player.R.暗影风暴魔次, 属性值, 1);
            Player.R.暗影附体魔次 = 智能计算(Player.R.暗影附体魔次, 属性值, 1);
            break;
        case 技能魔次.烈焰:
            Player.R.火焰追踪魔次 = 智能计算(Player.R.火焰追踪魔次, 属性值, 1);
            Player.R.烈焰护甲魔次 = 智能计算(Player.R.烈焰护甲魔次, 属性值, 1);
            Player.R.爆裂火冢魔次 = 智能计算(Player.R.爆裂火冢魔次, 属性值, 1);
            Player.R.烈焰突袭魔次 = 智能计算(Player.R.烈焰突袭魔次, 属性值, 1);
            break;
        case 技能魔次.正义:
            Player.R.圣光魔次 = 智能计算(Player.R.圣光魔次, 属性值, 1);
            Player.R.行刑魔次 = 智能计算(Player.R.行刑魔次, 属性值, 1);
            Player.R.洗礼魔次 = 智能计算(Player.R.洗礼魔次, 属性值, 1);
            break;
        case 技能魔次.不动:
            Player.R.如山魔次 = 智能计算(Player.R.如山魔次, 属性值, 1);
            Player.R.金刚掌魔次 = 智能计算(Player.R.金刚掌魔次, 属性值, 1);
            break;

        // ==================== 全体魔次（加成到所有技能） ====================
        case 技能魔次.全体:
            // 基础技能
            Player.R.攻杀剑术魔次 = 智能计算(Player.R.攻杀剑术魔次, 属性值, 1);
            Player.R.半月弯刀魔次 = 智能计算(Player.R.半月弯刀魔次, 属性值, 1);
            Player.R.雷电术魔次 = 智能计算(Player.R.雷电术魔次, 属性值, 1);
            Player.R.暴风雪魔次 = 智能计算(Player.R.暴风雪魔次, 属性值, 1);
            Player.R.灵魂火符魔次 = 智能计算(Player.R.灵魂火符魔次, 属性值, 1);
            Player.R.飓风破魔次 = 智能计算(Player.R.飓风破魔次, 属性值, 1);
            Player.R.暴击术魔次 = 智能计算(Player.R.暴击术魔次, 属性值, 1);
            Player.R.霜月魔次 = 智能计算(Player.R.霜月魔次, 属性值, 1);
            Player.R.精准箭术魔次 = 智能计算(Player.R.精准箭术魔次, 属性值, 1);
            Player.R.万箭齐发魔次 = 智能计算(Player.R.万箭齐发魔次, 属性值, 1);
            Player.R.罗汉棍法魔次 = 智能计算(Player.R.罗汉棍法魔次, 属性值, 1);
            Player.R.天雷阵魔次 = 智能计算(Player.R.天雷阵魔次, 属性值, 1);
            // 天枢技能
            Player.R.怒斩魔次 = 智能计算(Player.R.怒斩魔次, 属性值, 1);
            Player.R.人之怒魔次 = 智能计算(Player.R.人之怒魔次, 属性值, 1);
            Player.R.地之怒魔次 = 智能计算(Player.R.地之怒魔次, 属性值, 1);
            Player.R.天之怒魔次 = 智能计算(Player.R.天之怒魔次, 属性值, 1);
            Player.R.神之怒魔次 = 智能计算(Player.R.神之怒魔次, 属性值, 1);
            // 血神技能
            Player.R.血气献祭魔次 = 智能计算(Player.R.血气献祭魔次, 属性值, 1);
            Player.R.血气燃烧魔次 = 智能计算(Player.R.血气燃烧魔次, 属性值, 1);
            // 暗影技能
            Player.R.暗影袭杀魔次 = 智能计算(Player.R.暗影袭杀魔次, 属性值, 1);
            Player.R.暗影剔骨魔次 = 智能计算(Player.R.暗影剔骨魔次, 属性值, 1);
            Player.R.暗影风暴魔次 = 智能计算(Player.R.暗影风暴魔次, 属性值, 1);
            Player.R.暗影附体魔次 = 智能计算(Player.R.暗影附体魔次, 属性值, 1);
            // 烈焰技能
            Player.R.火焰追踪魔次 = 智能计算(Player.R.火焰追踪魔次, 属性值, 1);
            Player.R.烈焰护甲魔次 = 智能计算(Player.R.烈焰护甲魔次, 属性值, 1);
            Player.R.爆裂火冢魔次 = 智能计算(Player.R.爆裂火冢魔次, 属性值, 1);
            Player.R.烈焰突袭魔次 = 智能计算(Player.R.烈焰突袭魔次, 属性值, 1);
            // 正义技能
            Player.R.圣光魔次 = 智能计算(Player.R.圣光魔次, 属性值, 1);
            Player.R.行刑魔次 = 智能计算(Player.R.行刑魔次, 属性值, 1);
            Player.R.洗礼魔次 = 智能计算(Player.R.洗礼魔次, 属性值, 1);
            // 不动技能
            Player.R.如山魔次 = 智能计算(Player.R.如山魔次, 属性值, 1);
            Player.R.金刚掌魔次 = 智能计算(Player.R.金刚掌魔次, 属性值, 1);
            break;
    }
}


// ==================== JSON属性处理 ====================
/** 处理装备CustomDesc中的JSON属性 */
function 处理JSON属性(Player: TPlayObject, 属性数据: any): void {
    if (!属性数据) return;

    // 处理职业属性数组
    const 职业数组 = 属性数据.职业属性_职业;
    const 属性数组 = 属性数据.职业属性_属性;

    if (!职业数组 || !属性数组 || 职业数组.length !== 属性数组.length) return;

    for (let i = 0; i < 职业数组.length; i++) {
        const 词条ID = 职业数组[i];
        const 属性值 = String(属性数组[i]);

        if (词条ID == null || 属性值 === '' || 属性值 === '0') continue;

        // 基础词条处理
        if (词条ID >= 100 && 词条ID <= 115) {
            处理基础词条(Player, 词条ID, 属性值);
        }
        // 技能魔次处理
        else if (词条ID >= 10001 && 词条ID <= 10050) {
            处理技能魔次(Player, 词条ID, 属性值);
        }
        // 倍数属性处理
        else {
            switch (词条ID) {
                case 650: case 204: case 816:
                    Player.R.人物技能倍攻 = 智能计算(Player.R.人物技能倍攻 || '0', 属性值, 1);
                    break;
                case 651: case 205: case 817:
                    Player.R.所有宝宝倍攻 = 智能计算(Player.R.所有宝宝倍攻 || '0', 属性值, 1);
                    break;
                case 818:
                    Player.R.攻击属性倍率 = 智能计算(Player.R.攻击属性倍率 || '0', 属性值, 1);
                    break;
                case 819:
                    Player.R.技能伤害倍率 = 智能计算(Player.R.技能伤害倍率 || '0', 属性值, 1);
                    break;
            }
        }
    }
}

// ==================== 属性倍数应用 ====================
/** 应用属性倍数到自定属性 */
function 应用属性倍数(Player: TPlayObject): void {
    // 全属性加成
    const 全属性 = Player.R.自定属性[169] || '0';
    if (全属性 !== '0') {
        for (let i = 161; i <= 168; i++) {
            Player.R.自定属性[i] = 智能计算(Player.R.自定属性[i], 全属性, 1);
        }
    }

    // 职业属性倍数映射
    const 倍数映射: { [key: number]: string } = {
        120: '攻击倍数', 162: '魔法倍数', 163: '道术倍数',
        164: '刺术倍数', 165: '射术倍数', 166: '武术倍数',
        167: '生命倍数', 168: '防御倍数'
    };

    // 应用倍数
    for (const [索引, 倍数名] of Object.entries(倍数映射)) {
        const 倍数 = Player.R[倍数名] || 1;
        if (倍数 > 1) {
            const idx = Number(索引);
            const 原值 = Player.R.自定属性[idx] || '0';
            const 增量 = 智能计算(原值, String(倍数 - 1), 3);
            Player.R.自定属性[idx] = 智能计算(原值, 增量, 1);
        }
    }
}

// ==================== 人物额外属性计算 ====================
/** 计算人物额外属性并更新UI显示 */
export function 人物额外属性计算(Player: TPlayObject): void {
    // 初始化AddedAbility
    Player.AddedAbility.AC = 0;
    Player.AddedAbility.ACMax = 0;
    Player.AddedAbility.MAC = 0;
    Player.AddedAbility.MACMax = 0;
    Player.AddedAbility.DC = 0;
    Player.AddedAbility.DCMax = 0;
    Player.AddedAbility.MC = 0;
    Player.AddedAbility.MCMax = 0;
    Player.AddedAbility.SC = 0;
    Player.AddedAbility.SCMax = 0;
    Player.AddedAbility.HP = 0;
    Player.AddedAbility.MP = Player.Level * 1000;
    Player.AddedAbility.HitPoint = 0;
    Player.AddedAbility.SpeedPoint = 0;
    Player.AddedAbility.AntiPoison = 0;
    Player.AddedAbility.PoisonRecover = 0;
    Player.AddedAbility.HealthRecover = 0;
    Player.AddedAbility.SpellRecover = 0;
    Player.AddedAbility.AntiMagic = 0;
    Player.AddedAbility.ExpRate = Player.R.经验加成 || 0;
    Player.AddedAbility.GoldRate = 0;
    Player.AddedAbility.ItemRate = (Player.R.爆率加成 || 0) + (Player.V.赞助爆率 || 0) + (Player.V.宣传爆率 || 0);
    Player.AddedAbility.DamageAdd = 0;
    Player.AddedAbility.AppendDamage = 0;
    Player.AddedAbility.Rebound = 0;
    Player.AddedAbility.AppendDamageDef = 0;
    Player.AddedAbility.CriticalHit = 0;
    Player.AddedAbility.CriticalHitDef = 0;
    Player.AddedAbility.DamageAbsorb = 0;
    Player.AddedAbility.PunchHit = 0;
    Player.AddedAbility.PunchHitDef = 0;
    Player.AddedAbility.PunchHitAppendDamage = 0;
    Player.AddedAbility.CriticalHitAppendDamage = 0;
    Player.AddedAbility.HPRate = 0;
    Player.AddedAbility.MPRate = 0;
    Player.AddedAbility.WearWeight = 0;
    Player.AddedAbility.MaxWeight = 65535;

    // 同步血量
    Player.SetSVar(92, Player.R.自定属性[167]);
    if (比较(Player.GetSVar(91), Player.GetSVar(92)) >= 0) {
        Player.SetSVar(91, Player.GetSVar(92));
    }

    // 显示属性页面
    显示属性页面(Player, Player.R.属性页码 || 0);
    显示技能页面(Player)

    Player.RecalcAbilitys();
}


// ==================== 核心统计函数 ====================
/**
 * 装备属性统计 - 核心函数
 * 遍历玩家全身装备，统计所有属性
 */
export function 装备属性统计(Player: TPlayObject): void {
    // 步骤1：清空并初始化变量
    清空变量(Player);

    // 步骤2：遍历所有装备位置（0-34）
    for (let 位置 = 0; 位置 <= 34; 位置++) {
        const 装备 = 获取身上装备(Player, 位置);
        if (!装备) continue;

        // 处理OutWay属性（基础属性 1-8条）
        for (let i = 基础属性第一条; i <= 基础属性第八条; i++) {
            const 词条ID = 装备.GetOutWay1(i);
            const 属性值 = String(装备.GetOutWay2(i));
            if (词条ID > 0 && 属性值 !== '0') {
                处理基础词条(Player, 词条ID, 属性值);
            }
        }

        // 处理职业魔次属性（10-15条）
        for (let i = 职业第一条; i <= 职业第六条; i++) {
            const 魔次ID = 装备.GetOutWay1(i);
            const 属性值 = String(装备.GetOutWay2(i));
            if (魔次ID > 0 && 属性值 !== '0') {
                处理技能魔次(Player, 魔次ID, 属性值);
            }
        }

        // 处理CustomDesc JSON属性
        const customDesc = 装备.GetCustomDesc();
        if (customDesc) {
            const 装备数据 = 装备JSON缓存.获取(customDesc);
            if (装备数据) {
                处理JSON属性(Player, 装备数据);
            }
        }
    }

    // 步骤3：应用属性倍数
    应用属性倍数(Player);

    // 步骤3.5：统计神器属性
    神器属性统计(Player);

    // 步骤4：刷新属性并更新显示
    Player.SetSVar(92, Player.R.自定属性[167]); // 最大血量
    if (比较(Player.GetSVar(91), Player.GetSVar(92)) > 0) {
        Player.SetSVar(91, Player.GetSVar(92)); // 当前血量不超过最大
    }

    Player.RecalcAbilitys();
    Player.UpdateName();
    人物额外属性计算(Player);
    血量显示(Player);
}


/////  {S= 转码 #123S#61  } 转码 #125  ; 转码 #59  

// ==================== 属性页面显示 ====================
/** 属性配置列表 - [名称, 取值函数] */
const 属性配置: Array<[string, number, (p: TPlayObject) => string]> = [
    ['等级', 149, p => String(p.GetLevel())],
    ['幸运', 149, p => String(p.V.幸运值 || 0)],
    ['生命', 149, p => p.GetSVar(92) || '0'],
    ['防御', 149, p => p.R.自定属性[168] || '0'],
    ['攻击', 149, p => p.R.自定属性[161] || '0'],
    ['魔法', 149, p => p.R.自定属性[162] || '0'],
    ['道术', 149, p => p.R.自定属性[163] || '0'],
    ['刺术', 149, p => p.R.自定属性[164] || '0'],
    ['箭术', 149, p => p.R.自定属性[165] || '0'],
    ['武术', 149, p => p.R.自定属性[166] || '0'],
    ['爆率百分比', 19, p => String(p.AddedAbility.ItemRate) || '100'],
    ['极品百分比', 19, p => String(p.R.最终极品倍率) || '0'],
    ['回收百分比', 19, p => String(p.R.最终回收倍率) || '0'],
    ['武术', 149, p => p.R.自定属性[166] || '0'],

];

const 每页条数 = 10;
const 计算位数 = (v: string) => String(v).replace(/\.\d+/, '').length;

/** 显示属性页面 */
export function 显示属性页面(Player: TPlayObject, 页码: number): void {
    Player.R.属性页码 = 页码;
    const 总页数 = Math.ceil(属性配置.length / 每页条数);
    const 起始 = 页码 * 每页条数;
    const 当页数据 = 属性配置.slice(起始, 起始 + 每页条数);

    let 内容 = '';
    for (let i = 0; i < 当页数据.length; i++) {
        const [名称, 色值, 取值] = 当页数据[i];
        const 值 = 取值(Player);
        const y = i * 25;
        // HINT转码: HINT= -> HINT#61
        内容 += `#123S#61${名称}#59C#61${色值}#59X#6110#59Y#61${y}#59H#6125#125`;
        内容 += `#123S#61${大数值整数简写(值)}#59X#6180#59Y#61${y}#59H#6125#59HINT#61${值}#125`;
        内容 += `#123S#61${计算位数(值)}位#59X#61220#59Y#61${y}#59H#6125#125`;
    }
    Player.SetClientUIProperty('新属性显示', `SayText=${内容}`);
}
/** 切换属性页 - 循环翻页 */
export function 属性下一页(Player: TPlayObject): void {
    const 总页数 = Math.ceil(属性配置.length / 每页条数);
    const 当前页 = Player.R.属性页码 || 0;
    const 新页码 = (当前页 + 1) % 总页数; // 到最后一页后回到第一页
    显示属性页面(Player, 新页码);
}


// ==================== 技能显示页面 ====================
/** 本职业技能配置 - 根据Job显示 [技能名] */
const 本职业技能配置: { [job: number]: string[] } = {
    0: ['攻杀剑术', '半月弯刀'],      // 战士
    1: ['雷电术', '暴风雪'],          // 法师
    2: ['灵魂火符', '飓风破'],        // 道士
    3: ['暴击术', '霜月'],            // 刺客
    4: ['精准箭术', '万箭齐发'],      // 弓箭
    5: ['罗汉棍法', '天雷阵'],        // 武僧
};

/** 新职业技能配置 - 根据V.职业显示 [技能名] */
const 新职业技能配置: { [职业: string]: string[] } = {
    '天枢': ['怒斩', '人之怒', '地之怒', '天之怒', '神之怒'],
    '血神': ['血气献祭', '血气燃烧', '血气吸纳', '血气迸发', '血魔临身'],
    '暗影': ['暗影猎取', '暗影袭杀', '暗影剔骨', '暗影风暴', '暗影附体'],
    '烈焰': ['火焰追踪', '火镰狂舞', '烈焰护甲', '爆裂火冢', '烈焰突袭'],
    '正义': ['圣光', '行刑', '洗礼', '审判', '神罚'],
    '不动': ['如山', '泰山', '人王盾', '铁布衫', '金刚掌'],
};

/** 显示技能详细信息 - 根据职业显示：技能名 | 等级/魔次 | 位数 */
export function 显示技能页面(Player: TPlayObject): void {
    const jobId = Player.Job;
    const 职业名 = Player.V.职业 || '';

    // 获取当前职业的技能列表
    const 本职技能 = 本职业技能配置[jobId] || [];
    const 新职技能 = 职业名 ? (新职业技能配置[职业名] || []) : [];

    let 内容 = '';
    let 行号 = 0;

    // 显示本职业技能 - 等级
    for (const 技能名 of 本职技能) {
        const 等级 = String((Player.V as any)[`${技能名}等级`] || 0);
        const y = 行号 * 25;
        内容 += `#123S#61${技能名}#59X#610#59Y#61${y}#59H#6125#125`;
        内容 += `#123S#61${大数值整数简写(等级)}级#59C#61146#59X#61100#59Y#61${y}#59H#6125#59HINT#61等级:${等级}#125`;
        内容 += `#123S#61${计算位数(等级)}位#59X#61200#59Y#61${y}#59H#6125#125`;
        行号++;
    }

    // 显示新职业技能 - 等级
    for (const 技能名 of 新职技能) {
        const 等级 = String((Player.V as any)[`${技能名}等级`] || 0);
        const y = 行号 * 25;
        内容 += `#123S#61${技能名}#59X#610#59Y#61${y}#59H#6125#125`;
        内容 += `#123S#61${大数值整数简写(等级)}级#59C#61146#59X#61100#59Y#61${y}#59H#6125#59HINT#61等级:${等级}#125`;
        内容 += `#123S#61${计算位数(等级)}位#59X#61200#59Y#61${y}#59H#6125#125`;
        行号++;
    }

    // 显示本职业技能 - 魔次
    for (const 技能名 of 本职技能) {
        const 魔次 = (Player.R as any)[`${技能名}魔次`] || '0';
        const y = 行号 * 25;
        内容 += `#123S#61${技能名}#59X#610#59Y#61${y}#59H#6125#125`;
        内容 += `#123S#61${大数值整数简写(魔次)}魔次#59C#61149#59X#61100#59Y#61${y}#59H#6125#59HINT#61魔次:${魔次}#125`;
        内容 += `#123S#61${计算位数(魔次)}位#59X#61200#59Y#61${y}#59H#6125#125`;
        行号++;
    }

    // 显示新职业技能 - 魔次
    for (const 技能名 of 新职技能) {
        const 魔次 = (Player.R as any)[`${技能名}魔次`] || '0';
        const y = 行号 * 25;
        内容 += `#123S#61${技能名}#59X#610#59Y#61${y}#59H#6125#125`;
        内容 += `#123S#61${大数值整数简写(魔次)}魔次#59C#61149#59X#61100#59Y#61${y}#59H#6125#59HINT#61魔次:${魔次}#125`;
        内容 += `#123S#61${计算位数(魔次)}位#59X#61200#59Y#61${y}#59H#6125#125`;
        行号++;
    }

    Player.SetClientUIProperty('技能详细信息', `SayText=${内容}`);
}
