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

import { 大于, 智能计算, 比较 } from "../../_大数值/核心计算方法"
import { 大数值整数简写, 血量显示 } from "../字符计算"
import {
    基础属性第一条, 基础属性第八条,
    职业第一条, 职业第六条,
    基础词条, 技能魔次
} from "../基础常量"
import { 神器属性统计 } from "./神器统计"
import { 计算捐献爆率加成 } from "../_服务/捐献排名"
import { 获取血统加成 } from "../_服务/血统选择";
import { 获取津贴爆率加成 } from "../_服务/主神津贴";
import { 应用套装加成, 更新套装显示 as 玩家更新套装显示 } from "./随机套装";

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
    Player.R.生命百分比 = 0;
    Player.R.防御百分比 = 0;
    Player.R.攻击百分比 = 0;
    Player.R.魔法百分比 = 0;
    Player.R.道术百分比 = 0;
    Player.R.刺术百分比 = 0;
    Player.R.箭术百分比 = 0;
    Player.R.武术百分比 = 0;
    Player.R.天枢职业百分比 = 0;
    Player.R.血神职业百分比 = 0;
    Player.R.暗影职业百分比 = 0;
    Player.R.烈焰职业百分比 = 0;
    Player.R.正义职业百分比 = 0;
    Player.R.不动职业百分比 = 0;
    Player.R.全体职业百分比 = 0;

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
    Player.R.极品率加成 = 0;
    Player.R.回收倍率 = 100;
    Player.R.伤害吸收 = 0;

    Player.R.鞭尸几率 = 0;
    Player.R.鞭尸次数 = 0;

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
    Player.R.神器增伤加成 = 0;
    Player.R.基因锁等级 = 0; // 基因锁等级保留，不重置
    Player.R.暴击几率 = 0;
    Player.R.暴击伤害 = 0;
    Player.R.无视防御 = 0;
    Player.R.基因攻击伤害 = 0;

    Player.R.最终爆率加成 = 0;
    Player.R.最终回收倍率 = 0;
    Player.R.最终极品倍率 = 0;
    Player.R.最终鞭尸次数 = 0;
    Player.R.最终伤害加成 = 0;
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
        case 基础词条.攻击百分比:
            Player.R.攻击百分比 += Number(属性值);
            break;
        case 基础词条.魔法百分比:
            Player.R.魔法百分比 += Number(属性值);
            break;
        case 基础词条.道术百分比:
            Player.R.道术百分比 += Number(属性值);
            break;
        case 基础词条.刺术百分比:
            Player.R.刺术百分比 += Number(属性值);
            break;
        case 基础词条.箭术百分比:
            Player.R.箭术百分比 += Number(属性值);
            break;
        case 基础词条.武术百分比:
            Player.R.武术百分比 += Number(属性值);
            break;
        case 基础词条.血量百分比:
            Player.R.血量百分比 += Number(属性值);
            break;
        case 基础词条.防御百分比:
            Player.R.防御百分比 += Number(属性值);
            break;
        case 基础词条.天枢职业百分比:
            Player.R.天枢职业百分比 += Number(属性值);
            break;
        case 基础词条.血神职业百分比:
            Player.R.血神职业百分比 += Number(属性值);
            break;
        case 基础词条.暗影职业百分比:
            Player.R.暗影职业百分比 += Number(属性值);
            break;
        case 基础词条.烈焰职业百分比:
            Player.R.烈焰职业百分比 += Number(属性值);
            break;
        case 基础词条.正义职业百分比:
            Player.R.正义职业百分比 += Number(属性值);
            break;
        case 基础词条.不动职业百分比:
            Player.R.不动职业百分比 += Number(属性值);
            break;
        case 基础词条.全体职业百分比:
            Player.R.全体职业百分比 += Number(属性值);
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
/** 
 * 处理装备CustomDesc中的JSON属性
 * 
 * 注意：
 * - OutWay 保存的是截断后的数值，无法处理大数值
 * - CustomDesc JSON 保存的是完整的大数值字符串
 * - 因此仅使用 JSON 统计属性，确保大数值计算正确
 */
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

        // 基础词条处理（100-115 基础属性，116-130 百分比属性）
        if (词条ID >= 100 && 词条ID <= 130) {
            处理基础词条(Player, 词条ID, 属性值);
        }
        // 技能魔次处理
        else if (词条ID >= 10001 && 词条ID <= 10050) {
            处理技能魔次(Player, 词条ID, 属性值);
        }
    }
}

// ==================== 基因加成应用 ====================
/** 应用基因加成到属性 */
function 应用基因加成(Player: TPlayObject): void {

    // 根据职业提高主属性
    const 主属性索引 = 161 + Player.Job; // 161-166对应job 0-5
    const 主属性原值 = Player.R.自定属性[主属性索引] || '0';
    // 狂化：暴击几率提高20%，暴击伤害提高500%
    if (Player.V.基因 === '狂化') {
        Player.R.暴击几率 += 20;
        Player.R.暴击伤害 += 500;
    }

    // 迅疾：攻击无视防御20%，攻击伤害提高200%
    if (Player.V.基因 === '迅疾') {
        Player.R.无视防御 += 20;
        Player.R.基因攻击伤害 += 200;
    }

    // 甲壳：防御力提高30%，血量提高50%
    if (Player.V.基因 === '甲壳') {
        const 防御原值 = Player.R.自定属性[168] || '0';
        const 防御增量 = 智能计算(防御原值, '0.3', 3);
        Player.R.自定属性[168] = 智能计算(防御原值, 防御增量, 1);

        const 血量原值 = Player.R.自定属性[167] || '0';
        const 血量增量 = 智能计算(血量原值, '0.5', 3);
        Player.R.自定属性[167] = 智能计算(血量原值, 血量增量, 1);
    }

    // 融合：回收倍率提高50%，血量提高50%
    if (Player.V.基因 === '融合') {
        Player.R.神器回收加成 += 50;

        const 血量原值 = Player.R.自定属性[167] || '0';
        const 血量增量 = 智能计算(血量原值, '0.5', 3);
        Player.R.自定属性[167] = 智能计算(血量原值, 血量增量, 1);
    }

    // 念力：爆率提高20%，主属性提高10%
    if (Player.V.基因 === '念力') {
        Player.R.神器爆率加成 += 20;
        const 主属性增量 = 智能计算(主属性原值, '0.1', 3);
        Player.R.自定属性[主属性索引] = 智能计算(主属性原值, 主属性增量, 1);
    }

    // 协作：极品率提高10%，主属性提高10%
    if (Player.V.基因 === '协作') {
        Player.R.极品率加成 += 10;
        const 主属性增量 = 智能计算(主属性原值, '0.1', 3);
        Player.R.自定属性[主属性索引] = 智能计算(主属性原值, 主属性增量, 1);
    }
    if (Player.V.职业 == '暗影') {
        const 增量 = Player.R.暗影值 / 100
        const 主属性增量 = 智能计算(主属性原值, String(增量), 3);
        Player.R.自定属性[主属性索引] = 智能计算(主属性原值, 主属性增量, 1);
    }
    if (Player.V.泰山等级 > 0 && Player.V.职业 == '不动') {
        const 增量 = (Player.V.泰山等级 * 0.03) + 0.27
        const 主属性增量 = 智能计算(主属性原值, String(增量), 3);
        Player.R.自定属性[主属性索引] = 智能计算(主属性原值, 主属性增量, 1);
    }
}

// ==================== 血统加成应用 ====================
/** 应用血统加成到属性 */
function 应用血统加成(Player: TPlayObject): void {
    const 血统加成 = 获取血统加成(Player);

    if (!血统加成 || (血统加成.血量 === 0 && 血统加成.主属性 === 0 && 血统加成.防御 === 0)) {
        return;
    }

    // 应用血量加成
    if (血统加成.血量 > 0) {
        const 血量原值 = Player.R.自定属性[167] || '0';
        const 倍率 = 血统加成.血量 / 100;
        const 血量增量 = 智能计算(血量原值, String(倍率), 3);
        Player.R.自定属性[167] = 智能计算(血量原值, 血量增量, 1);
    }

    // 应用主属性加成
    if (血统加成.主属性 > 0) {
        const 主属性索引 = 161 + Player.Job; // 161-166对应job 0-5
        const 主属性原值 = Player.R.自定属性[主属性索引] || '0';
        const 倍率 = 血统加成.主属性 / 100;
        const 主属性增量 = 智能计算(主属性原值, String(倍率), 3);
        Player.R.自定属性[主属性索引] = 智能计算(主属性原值, 主属性增量, 1);
    }

    // 应用防御加成
    if (血统加成.防御 > 0) {
        const 防御原值 = Player.R.自定属性[168] || '0';
        const 倍率 = 血统加成.防御 / 100;
        const 防御增量 = 智能计算(防御原值, String(倍率), 3);
        Player.R.自定属性[168] = 智能计算(防御原值, 防御增量, 1);
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

    // 百分比属性映射：自定属性索引 -> 百分比变量名
    const 百分比映射: { [key: number]: string } = {
        161: '攻击百分比', 162: '魔法百分比', 163: '道术百分比',
        164: '刺术百分比', 165: '箭术百分比', 166: '武术百分比',
        167: '生命百分比', 168: '防御百分比'
    };

    // 应用百分比加成（基础值 * 百分比 / 100）
    for (const [索引, 百分比名] of Object.entries(百分比映射)) {
        const 百分比 = Player.R[百分比名] || 0;
        if (百分比 > 0) {
            const idx = Number(索引);
            const 原值 = Player.R.自定属性[idx] || '0';
            // 增量 = 原值 * (百分比 - 100) / 100 = 原值 * 倍率
            const 倍率 = 百分比 / 100;
            const 增量 = 智能计算(原值, String(倍率), 3);
            Player.R.自定属性[idx] = 智能计算(原值, 增量, 1);
        }
    }

    // 职业技能魔次百分比映射
    const 职业魔次映射: { [key: string]: string[] } = {
        '天枢职业百分比': ['怒斩魔次', '人之怒魔次', '地之怒魔次', '天之怒魔次', '神之怒魔次'],
        '血神职业百分比': ['血气献祭魔次', '血气燃烧魔次'],
        '暗影职业百分比': ['暗影袭杀魔次', '暗影剔骨魔次', '暗影风暴魔次', '暗影附体魔次'],
        '烈焰职业百分比': ['火焰追踪魔次', '烈焰护甲魔次', '爆裂火冢魔次', '烈焰突袭魔次'],
        '正义职业百分比': ['圣光魔次', '行刑魔次', '洗礼魔次'],
        '不动职业百分比': ['如山魔次', '金刚掌魔次'],
    };

    // 全部技能魔次列表（用于全体职业百分比）
    const 全部魔次列表 = [
        '攻杀剑术魔次', '半月弯刀魔次', '雷电术魔次', '暴风雪魔次',
        '灵魂火符魔次', '飓风破魔次', '暴击术魔次', '霜月魔次',
        '精准箭术魔次', '万箭齐发魔次', '罗汉棍法魔次', '天雷阵魔次',
        '怒斩魔次', '人之怒魔次', '地之怒魔次', '天之怒魔次', '神之怒魔次',
        '血气献祭魔次', '血气燃烧魔次',
        '暗影袭杀魔次', '暗影剔骨魔次', '暗影风暴魔次', '暗影附体魔次',
        '火焰追踪魔次', '烈焰护甲魔次', '爆裂火冢魔次', '烈焰突袭魔次',
        '圣光魔次', '行刑魔次', '洗礼魔次',
        '如山魔次', '金刚掌魔次'
    ];

    // 应用职业技能魔次百分比
    for (const [百分比名, 魔次列表] of Object.entries(职业魔次映射)) {
        const 百分比 = Player.R[百分比名] || 0;
        if (百分比 > 0) {
            const 倍率 = 百分比 / 100;
            for (const 魔次名 of 魔次列表) {
                const 原值 = Player.R[魔次名] || '0';
                if (大于(原值, '0')) {
                    const 增量 = 智能计算(原值, String(倍率), 3);
                    Player.R[魔次名] = 智能计算(原值, 增量, 1);
                }
            }
        }
    }

    // 应用全体职业百分比（影响所有技能魔次）
    const 全体百分比 = Player.R.全体职业百分比 || 0;
    if (全体百分比 > 0) {
        const 倍率 = 全体百分比 / 100;
        for (const 魔次名 of 全部魔次列表) {
            const 原值 = Player.R[魔次名] || '0';
            if (大于(原值, '0')) {
                const 增量 = 智能计算(原值, String(倍率), 3);
                Player.R[魔次名] = 智能计算(原值, 增量, 1);
            }
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
    Player.AddedAbility.MP = Player.Level * 100;
    Player.AddedAbility.HitPoint = 0;
    Player.AddedAbility.SpeedPoint = 0;
    Player.AddedAbility.AntiPoison = 0;
    Player.AddedAbility.PoisonRecover = 0;
    Player.AddedAbility.HealthRecover = 0;
    Player.AddedAbility.SpellRecover = 0;
    Player.AddedAbility.AntiMagic = 0;
    Player.AddedAbility.ExpRate = Player.R.经验加成 || 0;
    Player.AddedAbility.GoldRate = 0;
    Player.AddedAbility.ItemRate = Player.R.最终爆率加成 || 0;
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

    // // 同步血量
    // Player.SetSVar(92, Player.R.自定属性[167]);
    // if (比较(Player.GetSVar(91), Player.GetSVar(92)) >= 0) {
    //     Player.SetSVar(91, Player.GetSVar(92));
    // }

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

        // 仅处理CustomDesc JSON属性（大数值完整保存在JSON中）
        // 注意：OutWay 保存的是截断后的数值，无法处理大数值，因此不再使用
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

    // 步骤3.6：应用基因加成
    应用基因加成(Player);

    // 步骤3.7：应用血统加成
    应用血统加成(Player);

    应用套装加成(Player)

    // 步骤3.8：应用捐献爆率加成
    const 捐献爆率加成 = 计算捐献爆率加成(Player);

    // 步骤3.9：应用主神津贴爆率加成
    const 津贴爆率加成 = 获取津贴爆率加成(Player);

    const 转生等级 = Player.GetReNewLevel();
    if (转生等级 <= 40) {
        Player.R.伤害吸收 = 转生等级 * 2
    } else (
        Player.R.伤害吸收 = 40 + 转生等级
    )


    if (GameLib.V.是新区 === true) {
        Player.R.爆率加成 += 50
        Player.R.回收倍率 += 100
        Player.R.极品率加成 += 20
    }

    if (Player.R.鞭尸几率 >= 100) {
        Player.R.鞭尸次数 += 1;
        Player.R.鞭尸几率 = 100;
    }
    if (Player.V.赞助鞭尸 >= 1) { Player.R.鞭尸几率 = 100; }

    Player.R.最终爆率加成 = Math.max((Player.R.神器爆率加成 || 0) + (Player.R.爆率加成 || 0) + (Player.V.宣传爆率 || 0) + (Player.V.赞助爆率 || 0) + 捐献爆率加成 + 津贴爆率加成, 0)

    Player.R.最终回收倍率 = Math.max((Player.R.神器回收加成 || 0) + (Player.R.回收倍率 || 100) + (Player.V.宣传回收 || 0) + (Player.V.赞助回收 || 0), 100)

    Player.R.最终极品倍率 = Math.max((Player.R.极品率加成 || 0) + (Player.V.宣传极品 || 0) + (Player.V.赞助极品 || 0), 0)

    Player.R.最终鞭尸次数 = Math.max(Player.R.鞭尸次数 + (Player.V.赞助鞭尸 || 0), 0)

    if (Player.R.圣耀副本爆率加成) { Player.R.最终爆率加成 += Player.R.圣耀副本倍率 }

    // 步骤4：刷新属性并更新显示
    Player.SetSVar(92, Player.R.自定属性[167]); // 最大血量

    // 同步当前血量：如果当前血量超过最大血量，则限制为最大血量
    if (比较(Player.GetSVar(91), Player.GetSVar(92)) > 0) {
        Player.SetSVar(91, Player.GetSVar(92)); // 当前血量不超过最大
        Player.V.自定属性[1051] = Player.GetSVar(91); // 同步到V变量
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
    ['爆率百分比', 19, p => String(p.R.最终爆率加成) || '100'],
    ['极品百分比', 19, p => String(p.R.最终极品倍率) || '0'],
    ['回收百分比', 19, p => String(p.R.最终回收倍率) || '100'],
    ['鞭尸几率', 19, p => String(p.R.鞭尸几率) || '0'],
    ['鞭尸次数', 19, p => String(p.R.最终鞭尸次数) || '0'],
    ['生命百分比', 21, p => String(p.R.生命百分比) || '0'],
    ['防御百分比', 21, p => String(p.R.防御百分比) || '0'],
    ['攻击百分比', 21, p => String(p.R.攻击百分比) || '0'],
    ['魔法百分比', 21, p => String(p.R.魔法百分比) || '0'],
    ['道术百分比', 21, p => String(p.R.道术百分比) || '0'],
    ['刺术百分比', 21, p => String(p.R.刺术百分比) || '0'],
    ['箭术百分比', 21, p => String(p.R.箭术百分比) || '0'],
    ['武术百分比', 21, p => String(p.R.武术百分比) || '0'],
    ['天枢魔次百分比', 21, p => String(p.R.天枢职业百分比) || '0'],
    ['血神魔次百分比', 21, p => String(p.R.血神职业百分比) || '0'],
    ['暗影魔次百分比', 21, p => String(p.R.暗影职业百分比) || '0'],
    ['烈焰魔次百分比', 21, p => String(p.R.烈焰职业百分比) || '0'],
    ['正义魔次百分比', 21, p => String(p.R.正义职业百分比) || '0'],
    ['不动魔次百分比', 21, p => String(p.R.不动职业百分比) || '0'],
    ['全体魔次百分比', 21, p => String(p.R.全体职业百分比) || '0'],
    ['基因类型', 9, p => String(p.V.基因) || '未选择'],
    ['狂化阶数', 9, p => String(p.R.狂化阶数) || '0'],
    ['迅疾阶数', 9, p => String(p.R.迅疾阶数) || '0'],
    ['甲壳阶数', 9, p => String(p.R.甲壳阶数) || '0'],
    ['融合阶数', 9, p => String(p.R.融合阶数) || '0'],
    ['念力阶数', 9, p => String(p.R.念力阶数) || '0'],
    ['协作阶数', 9, p => String(p.R.协作阶数) || '0'],
    ['血统类型', 116, p => String(p.V.血统) || '未选择'],
    ['血统等级', 116, p => String(p.V.血统等级) || '0'],
    ['伤害吸收百分比', 116, p => String(p.R.伤害吸收) || '0'],
    ['基因锁等级', 116, p => String(p.R.基因锁等级) || '0'],


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
        内容 += `#123S#61${大数值整数简写(值)}#59X#61115#59Y#61${y}#59H#6125#59HINT#61${值}#125`;
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

/** 本职业技能配置 - 根据Job显示 [技能名] */
const 本职业技能施法配置: { [job: number]: string[] } = {
    1: ['雷电术', '暴风雪'],          // 法师
    2: ['灵魂火符', '飓风破'],        // 道士
    4: ['精准箭术', '万箭齐发'],      // 弓箭
};

/** 新职业技能配置 - 根据V.职业显示 [技能名] */
const 新职业技能施法配置: { [职业: string]: string[] } = {
    '天枢': ['怒斩'],
    '血神': ['血气献祭', '血气燃烧', '血魔临身'],
    '暗影': ['暗影袭杀', '暗影剔骨', '暗影风暴', '暗影附体'],
    '烈焰': ['火焰追踪', '烈焰护甲'],
    '正义': ['圣光'],
    '不动': ['如山', '人王盾', '金刚掌'],
};

/**
 * 初始化自动施法变量
 */
function 初始化自动施法变量(Player: TPlayObject): void {
    // 基础职业技能自动施法开关

    Player.V.自动_雷电术 ??= false;
    Player.V.自动_暴风雪 ??= false;
    Player.V.自动_灵魂火符 ??= false;
    Player.V.自动_飓风破 ??= false;
    Player.V.自动_精准箭术 ??= false;
    Player.V.自动_万箭齐发 ??= false;

    // 新职业技能自动施法开关
    Player.V.自动_怒斩 ??= false;
    Player.V.自动_血气献祭 ??= false;
    Player.V.自动_血气燃烧 ??= false;
    Player.V.自动_血魔临身 ??= false;
    Player.V.自动_暗影袭杀 ??= false;
    Player.V.自动_暗影剔骨 ??= false;
    Player.V.自动_暗影风暴 ??= false;
    Player.V.自动_暗影附体 ??= false;
    Player.V.自动_火焰追踪 ??= false;
    Player.V.自动_烈焰护甲 ??= false;
    Player.V.自动_圣光 ??= false;
    Player.V.自动_如山 ??= false;
    Player.V.自动_人王盾 ??= false;
    Player.V.自动_金刚掌 ??= false;
}

/**
 * 自动施法设置主界面
 */
export function 自动设置(Npc: TNormNpc, Player: TPlayObject): void {
    初始化自动施法变量(Player);

    const jobId = Player.Job;
    const 职业名 = Player.V.职业 || '';

    let str = `{S=自动施法设置;C=251;X=200;Y=10}\n`;
    str += `{S=勾选后技能将自动释放;C=154;X=20;Y=40}\n\n`;

    let y = 70;

    // 合并基础技能和新职业技能为一个列表
    const 基础技能列表 = 本职业技能施法配置[jobId] || [];
    const 新职业技能列表 = 新职业技能施法配置[职业名] || [];
    const 全部技能列表 = [...基础技能列表, ...新职业技能列表];

    // 每行4个顺序排列显示
    for (let i = 0; i < 全部技能列表.length; i++) {
        const 技能名 = 全部技能列表[i];
        const x = 20 + (i % 5) * 100;
        const 当前Y = y + Math.floor(i / 5) * 35;
        const 变量名 = `自动_${技能名}`;
        const 图标 = Player.V[变量名] ? '31' : '30';

        str += `<{I=${图标};F=装备图标.DATA;X=${x};Y=${当前Y}}/@属性统计.勾选技能(${变量名})>{S=${技能名};C=9;OX=3;Y=${当前Y}}\n`;
    }

    y += Math.ceil(全部技能列表.length / 5) * 35 + 20;

    Npc.SayEx(Player, 'NPC小窗口', str);
}

/**
 * 勾选技能自动施法
 */
export function 勾选技能(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 变量名 = Args.Str[0];
    Player.V[变量名] = !Player.V[变量名];

    const 技能名 = 变量名.replace('自动_', '');
    const 状态 = Player.V[变量名] ? '开启' : '关闭';
    Player.SendMessage(`${技能名}自动施法已${状态}`, 1);

    自动设置(Npc, Player);
}

/**
 * 自动施法设置主界面
 */
export function 提示设置(Npc: TNormNpc, Player: TPlayObject): void {
    let str = `{S=提示设置;C=251;X=200;Y=10}\n`;
    str += `{S=取消勾选后将不再提示;C=154;X=20;Y=40}\n\n`;

    let y = 70;

    // 合并基础技能和新职业技能为一个列表
    const 提示列表 = ['伤害提示', '护盾提示', '掉落提示', '鞭尸提示', '回收屏蔽']

    // 每行4个顺序排列显示
    for (let i = 0; i < 提示列表.length; i++) {
        const 提示名 = 提示列表[i];
        const x = 20 + (i % 4) * 100;
        const 当前Y = y + Math.floor(i / 4) * 35;
        const 变量名 = `${提示名}`;
        const 图标 = Player.V[变量名] ? '31' : '30';

        str += `<{I=${图标};F=装备图标.DATA;X=${x};Y=${当前Y}}/@属性统计.勾选提示(${变量名})>{S=${提示名};C=9;OX=3;Y=${当前Y}}\n`;
    }

    y += Math.ceil(提示列表.length / 4) * 35 + 20;

    Npc.SayEx(Player, 'NPC小窗口', str);
}
/**
 * 勾选技能自动施法
 */
export function 勾选提示(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 变量名 = Args.Str[0];
    Player.V[变量名] = !Player.V[变量名];

    const 提示名 = 变量名.replace('提示', '');
    const 状态 = Player.V[变量名] ? '开启' : '关闭';
    Player.SendMessage(`${提示名}提示已${状态}`, 1);

    提示设置(Npc, Player);
}
