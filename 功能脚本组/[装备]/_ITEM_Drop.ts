
import * as 地图 from '../[地图]/地图';

/*怪物装备掉落单元*/
import {
    基础属性第一条, 基础属性第十条,
    基础属性分割,
    职业分割, 职业第一条, 尾部名字, 装备颜色, 专属符文第一, 专属符文第二, 种族第一, 种族第二, 种族第三, 天赋一
} from "./_ITEM_Base"
import * as _M_Refresh from "../[怪物]/_M_Refresh"
import { 怪物星数, 怪物超星数, 怪物颜色 } from "../[怪物]/_M_Base"
import { 装备特效 } from "../[装备]/_ITEM_Base"
/*赋值方案 0:min 1:max ([x,y]相加最好不要大于 10)*/
/*装备属性赋值*/

export function ItemProperty(Player: TPlayObject, Monster: TActor, Item: TUserItem, Map: TEnvirnoment): void {
    Randomize()
    if ([5, 6, 10, 11, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 68, 35].indexOf(Item.StdMode) != -1) {
        let 神器几率 = random(2000 - Player.R.极品率), 品阶 = '', 职业技能条数 = 0, 随机额外属性 = 0, 额外属性的值 = 0, 职业 = '', 末尾 = '', 翻倍几率 = random(2000), 翻倍 = 2, 颜色 = 0, 星星数量 = 0
        let 末尾几率 = random(2000 - Player.R.极品率)
        let 白色条数 = 0
        switch (true) {
            case 神器几率 < 3: 品阶 = '神器'; 职业技能条数 = 5; break
            case 神器几率 >= 5 && 神器几率 <= 20: 品阶 = '旷世'; 职业技能条数 = 4; break
            case 神器几率 > 20 && 神器几率 <= 40: 品阶 = '精华'; 职业技能条数 = 3; break
            case 神器几率 > 40 && 神器几率 <= 65: 品阶 = '扩展'; 职业技能条数 = 2; break
            default: 品阶 = '粗糙'; 职业技能条数 = 1; break
        }

        // switch (Monster.GetNameColor()) {
        //     case 怪物颜色.人形红色:
        //         白色条数 = Math.min(8, 1 + random(2000 - Player.R.极品率) < 5 ? 7 : random(6));
        //         颜色区分(Player,Monster,Item,Map,白色条数,末尾几率)
        //         break
        // }


        switch (Monster.GetNameColor()) {
            case 怪物颜色.世界BOSS:
                switch (true) {
                    case 末尾几率 < 5: 末尾 = 尾部名字.混沌名字; 颜色 = 装备颜色.混沌颜色; break
                    case 末尾几率 >= 5 && 末尾几率 < 30: 末尾 = 尾部名字.造化名字; 颜色 = 装备颜色.造化颜色; break
                    case 末尾几率 > 30 && 末尾几率 <= 60: 末尾 = 尾部名字.绝世名字; 颜色 = 装备颜色.绝世颜色; break
                    case 末尾几率 > 60 && 末尾几率 <= 100: 末尾 = 尾部名字.史诗名字; 颜色 = 装备颜色.史诗颜色; break
                    case 末尾几率 > 100 && 末尾几率 <= 200: 末尾 = 尾部名字.底材名字; 颜色 = 装备颜色.底材颜色; break
                    default: 末尾 = 尾部名字.传承名字; 颜色 = 装备颜色.传承颜色; break
                }
                break
            case 怪物颜色.人形红色:
                switch (true) {
                    case 末尾几率 == 0: 末尾 = 尾部名字.混沌名字; 颜色 = 装备颜色.混沌颜色; break
                    case 末尾几率 >= 1 && 末尾几率 < 3: 末尾 = 尾部名字.造化名字; 颜色 = 装备颜色.造化颜色; break
                    case 末尾几率 > 3 && 末尾几率 <= 10: 末尾 = 尾部名字.绝世名字; 颜色 = 装备颜色.绝世颜色; break
                    case 末尾几率 > 10 && 末尾几率 <= 30: 末尾 = 尾部名字.史诗名字; 颜色 = 装备颜色.史诗颜色; break
                    case 末尾几率 > 30 && 末尾几率 <= 60: 末尾 = 尾部名字.底材名字; 颜色 = 装备颜色.底材颜色; break
                    default: 末尾 = 尾部名字.传承名字; 颜色 = 装备颜色.传承颜色; break
                }
                break
            case 怪物颜色.灭世BOSS橙:
                switch (true) {
                    case 末尾几率 == 0: 末尾 = 尾部名字.混沌名字; 颜色 = 装备颜色.混沌颜色; break
                    case 末尾几率 >= 1 && 末尾几率 < 3: 末尾 = 尾部名字.造化名字; 颜色 = 装备颜色.造化颜色; break
                    case 末尾几率 > 3 && 末尾几率 <= 10: 末尾 = 尾部名字.绝世名字; 颜色 = 装备颜色.绝世颜色; break
                    case 末尾几率 > 10 && 末尾几率 <= 30: 末尾 = 尾部名字.史诗名字; 颜色 = 装备颜色.史诗颜色; break
                    case 末尾几率 > 30 && 末尾几率 <= 60: 末尾 = 尾部名字.传承名字; 颜色 = 装备颜色.传承颜色; break
                    case 末尾几率 > 60 && 末尾几率 <= 90: 末尾 = 尾部名字.底材名字; 颜色 = 装备颜色.底材颜色; break
                    default: 末尾 = 尾部名字.神话名字; 颜色 = 装备颜色.神话颜色; break
                }
                break
            case 怪物颜色.苍穹BOSS紫:
                switch (true) {
                    case 末尾几率 == 0: 末尾 = 尾部名字.混沌名字; 颜色 = 装备颜色.混沌颜色; break
                    case 末尾几率 >= 1 && 末尾几率 < 3: 末尾 = 尾部名字.造化名字; 颜色 = 装备颜色.造化颜色; break
                    case 末尾几率 > 3 && 末尾几率 <= 10: 末尾 = 尾部名字.绝世名字; 颜色 = 装备颜色.绝世颜色; break
                    case 末尾几率 > 10 && 末尾几率 <= 30: 末尾 = 尾部名字.史诗名字; 颜色 = 装备颜色.史诗颜色; break
                    case 末尾几率 > 30 && 末尾几率 <= 60: 末尾 = 尾部名字.传承名字; 颜色 = 装备颜色.传承颜色; break
                    case 末尾几率 > 60 && 末尾几率 <= 100: 末尾 = 尾部名字.神话名字; 颜色 = 装备颜色.神话颜色; break
                    case 末尾几率 > 100 && 末尾几率 <= 130: 末尾 = 尾部名字.底材名字; 颜色 = 装备颜色.底材颜色; break
                    default: 末尾 = 尾部名字.传说名字; 颜色 = 装备颜色.传说颜色; break
                }
                break
            case 怪物颜色.洪荒BOSS黄:
                switch (true) {
                    case 末尾几率 == 0: 末尾 = 尾部名字.混沌名字; 颜色 = 装备颜色.混沌颜色; break
                    case 末尾几率 >= 1 && 末尾几率 < 3: 末尾 = 尾部名字.造化名字; 颜色 = 装备颜色.造化颜色; break
                    case 末尾几率 > 3 && 末尾几率 <= 10: 末尾 = 尾部名字.绝世名字; 颜色 = 装备颜色.绝世颜色; break
                    case 末尾几率 > 10 && 末尾几率 <= 30: 末尾 = 尾部名字.史诗名字; 颜色 = 装备颜色.史诗颜色; break
                    case 末尾几率 > 30 && 末尾几率 <= 60: 末尾 = 尾部名字.传承名字; 颜色 = 装备颜色.传承颜色; break
                    case 末尾几率 > 60 && 末尾几率 <= 100: 末尾 = 尾部名字.神话名字; 颜色 = 装备颜色.神话颜色; break
                    case 末尾几率 > 100 && 末尾几率 <= 130: 末尾 = 尾部名字.底材名字; 颜色 = 装备颜色.底材颜色; break
                    default: 末尾 = 尾部名字.传说名字; 颜色 = 装备颜色.传说颜色; break
                }
                break
            case 怪物颜色.远古BOSS粉:
                switch (true) {
                    case 末尾几率 == 0: 末尾 = 尾部名字.混沌名字; 颜色 = 装备颜色.混沌颜色; break
                    case 末尾几率 >= 1 && 末尾几率 < 3: 末尾 = 尾部名字.造化名字; 颜色 = 装备颜色.造化颜色; break
                    case 末尾几率 > 3 && 末尾几率 <= 10: 末尾 = 尾部名字.绝世名字; 颜色 = 装备颜色.绝世颜色; break
                    case 末尾几率 > 10 && 末尾几率 <= 30: 末尾 = 尾部名字.史诗名字; 颜色 = 装备颜色.史诗颜色; break
                    case 末尾几率 > 30 && 末尾几率 <= 60: 末尾 = 尾部名字.传承名字; 颜色 = 装备颜色.传承颜色; break
                    case 末尾几率 > 60 && 末尾几率 <= 100: 末尾 = 尾部名字.神话名字; 颜色 = 装备颜色.神话颜色; break
                    case 末尾几率 > 100 && 末尾几率 <= 130: 末尾 = 尾部名字.底材名字; 颜色 = 装备颜色.底材颜色; break
                    default: 末尾 = 尾部名字.传说名字; 颜色 = 装备颜色.传说颜色; break
                }
                break
            case 怪物颜色.深渊BOSS浅绿:
                switch (true) {
                    case 末尾几率 == 0: 末尾 = 尾部名字.混沌名字; 颜色 = 装备颜色.混沌颜色; break
                    case 末尾几率 >= 1 && 末尾几率 < 3: 末尾 = 尾部名字.造化名字; 颜色 = 装备颜色.造化颜色; break
                    case 末尾几率 > 3 && 末尾几率 <= 10: 末尾 = 尾部名字.绝世名字; 颜色 = 装备颜色.绝世颜色; break
                    case 末尾几率 > 10 && 末尾几率 <= 30: 末尾 = 尾部名字.史诗名字; 颜色 = 装备颜色.史诗颜色; break
                    case 末尾几率 > 30 && 末尾几率 <= 60: 末尾 = 尾部名字.传承名字; 颜色 = 装备颜色.传承颜色; break
                    case 末尾几率 > 60 && 末尾几率 <= 100: 末尾 = 尾部名字.神话名字; 颜色 = 装备颜色.神话颜色; break
                    case 末尾几率 > 100 && 末尾几率 <= 150: 末尾 = 尾部名字.传说名字; 颜色 = 装备颜色.传说颜色; break
                    case 末尾几率 > 150 && 末尾几率 <= 180: 末尾 = 尾部名字.底材名字; 颜色 = 装备颜色.底材颜色; break
                    default: 末尾 = 尾部名字.杰出名字; 颜色 = 装备颜色.杰出颜色; break
                }
                break
            case 怪物颜色.头领BOSS蓝:
                switch (true) {
                    case 末尾几率 == 0: 末尾 = 尾部名字.混沌名字; 颜色 = 装备颜色.混沌颜色; break
                    case 末尾几率 >= 1 && 末尾几率 < 3: 末尾 = 尾部名字.造化名字; 颜色 = 装备颜色.造化颜色; break
                    case 末尾几率 > 3 && 末尾几率 <= 10: 末尾 = 尾部名字.绝世名字; 颜色 = 装备颜色.绝世颜色; break
                    case 末尾几率 > 10 && 末尾几率 <= 30: 末尾 = 尾部名字.史诗名字; 颜色 = 装备颜色.史诗颜色; break
                    case 末尾几率 > 30 && 末尾几率 <= 60: 末尾 = 尾部名字.传承名字; 颜色 = 装备颜色.传承颜色; break
                    case 末尾几率 > 60 && 末尾几率 <= 100: 末尾 = 尾部名字.神话名字; 颜色 = 装备颜色.神话颜色; break
                    case 末尾几率 > 100 && 末尾几率 <= 150: 末尾 = 尾部名字.传说名字; 颜色 = 装备颜色.传说颜色; break
                    case 末尾几率 > 150 && 末尾几率 <= 210: 末尾 = 尾部名字.杰出名字; 颜色 = 装备颜色.杰出颜色; break
                    case 末尾几率 > 210 && 末尾几率 <= 240: 末尾 = 尾部名字.底材名字; 颜色 = 装备颜色.底材颜色; break
                    default: 末尾 = 尾部名字.超强名字; 颜色 = 装备颜色.超强颜色; break
                }
                break
            case 怪物颜色.精英小怪绿:
                switch (true) {
                    case 末尾几率 == 0: 末尾 = 尾部名字.混沌名字; 颜色 = 装备颜色.混沌颜色; break
                    case 末尾几率 >= 1 && 末尾几率 < 3: 末尾 = 尾部名字.造化名字; 颜色 = 装备颜色.造化颜色; break
                    case 末尾几率 > 3 && 末尾几率 <= 10: 末尾 = 尾部名字.绝世名字; 颜色 = 装备颜色.绝世颜色; break
                    case 末尾几率 > 10 && 末尾几率 <= 30: 末尾 = 尾部名字.史诗名字; 颜色 = 装备颜色.史诗颜色; break
                    case 末尾几率 > 30 && 末尾几率 <= 60: 末尾 = 尾部名字.传承名字; 颜色 = 装备颜色.传承颜色; break
                    case 末尾几率 > 60 && 末尾几率 <= 100: 末尾 = 尾部名字.神话名字; 颜色 = 装备颜色.神话颜色; break
                    case 末尾几率 > 100 && 末尾几率 <= 150: 末尾 = 尾部名字.传说名字; 颜色 = 装备颜色.传说颜色; break
                    case 末尾几率 > 150 && 末尾几率 <= 210: 末尾 = 尾部名字.杰出名字; 颜色 = 装备颜色.杰出颜色; break
                    case 末尾几率 > 210 && 末尾几率 <= 240: 末尾 = 尾部名字.底材名字; 颜色 = 装备颜色.底材颜色; break
                    default: 末尾 = 尾部名字.超强名字; 颜色 = 装备颜色.超强颜色; break
                }
                break
            case 怪物颜色.弱小小怪白:
                switch (true) {
                    case 末尾几率 == 0: 末尾 = 尾部名字.混沌名字; 颜色 = 装备颜色.混沌颜色; break
                    case 末尾几率 >= 1 && 末尾几率 < 3: 末尾 = 尾部名字.造化名字; 颜色 = 装备颜色.造化颜色; break
                    case 末尾几率 > 3 && 末尾几率 <= 10: 末尾 = 尾部名字.绝世名字; 颜色 = 装备颜色.绝世颜色; break
                    case 末尾几率 > 10 && 末尾几率 <= 30: 末尾 = 尾部名字.史诗名字; 颜色 = 装备颜色.史诗颜色; break
                    case 末尾几率 > 30 && 末尾几率 <= 60: 末尾 = 尾部名字.传承名字; 颜色 = 装备颜色.传承颜色; break
                    case 末尾几率 > 60 && 末尾几率 <= 100: 末尾 = 尾部名字.神话名字; 颜色 = 装备颜色.神话颜色; break
                    case 末尾几率 > 100 && 末尾几率 <= 150: 末尾 = 尾部名字.传说名字; 颜色 = 装备颜色.传说颜色; break
                    case 末尾几率 > 150 && 末尾几率 <= 210: 末尾 = 尾部名字.杰出名字; 颜色 = 装备颜色.杰出颜色; break
                    case 末尾几率 > 210 && 末尾几率 <= 280: 末尾 = 尾部名字.超强名字; 颜色 = 装备颜色.超强颜色; break
                    case 末尾几率 > 280 && 末尾几率 <= 310: 末尾 = 尾部名字.底材名字; 颜色 = 装备颜色.底材颜色; break
                    default: 末尾 = 尾部名字.劣质名字; 颜色 = 装备颜色.劣质颜色; break
                }
                break
            case 怪物颜色.世界BOSS:
                switch (true) {
                    case 末尾几率 == 0: 末尾 = 尾部名字.混沌名字; 颜色 = 装备颜色.混沌颜色; break
                    case 末尾几率 >= 1 && 末尾几率 < 8: 末尾 = 尾部名字.造化名字; 颜色 = 装备颜色.造化颜色; break
                    case 末尾几率 > 8 && 末尾几率 <= 20: 末尾 = 尾部名字.绝世名字; 颜色 = 装备颜色.绝世颜色; break
                    case 末尾几率 > 20 && 末尾几率 <= 40: 末尾 = 尾部名字.史诗名字; 颜色 = 装备颜色.史诗颜色; break
                    case 末尾几率 > 40 && 末尾几率 <= 80: 末尾 = 尾部名字.底材名字; 颜色 = 装备颜色.底材颜色; break
                    default: 末尾 = 尾部名字.传承名字; 颜色 = 装备颜色.传承颜色; break
                }
                break
            default:
                switch (true) {
                    case 末尾几率 == 0: 末尾 = 尾部名字.混沌名字; 颜色 = 装备颜色.混沌颜色; break
                    case 末尾几率 >= 1 && 末尾几率 < 3: 末尾 = 尾部名字.造化名字; 颜色 = 装备颜色.造化颜色; break
                    case 末尾几率 > 3 && 末尾几率 <= 10: 末尾 = 尾部名字.绝世名字; 颜色 = 装备颜色.绝世颜色; break
                    case 末尾几率 > 10 && 末尾几率 <= 30: 末尾 = 尾部名字.史诗名字; 颜色 = 装备颜色.史诗颜色; break
                    case 末尾几率 > 30 && 末尾几率 <= 60: 末尾 = 尾部名字.传承名字; 颜色 = 装备颜色.传承颜色; break
                    case 末尾几率 > 60 && 末尾几率 <= 100: 末尾 = 尾部名字.神话名字; 颜色 = 装备颜色.神话颜色; break
                    case 末尾几率 > 100 && 末尾几率 <= 150: 末尾 = 尾部名字.传说名字; 颜色 = 装备颜色.传说颜色; break
                    case 末尾几率 > 150 && 末尾几率 <= 210: 末尾 = 尾部名字.杰出名字; 颜色 = 装备颜色.杰出颜色; break
                    case 末尾几率 > 210 && 末尾几率 <= 280: 末尾 = 尾部名字.超强名字; 颜色 = 装备颜色.超强颜色; break
                    case 末尾几率 > 280 && 末尾几率 <= 310: 末尾 = 尾部名字.底材名字; 颜色 = 装备颜色.底材颜色; break
                    default: 末尾 = 尾部名字.劣质名字; 颜色 = 装备颜色.劣质颜色; break
                }
                break
        }
        let 职业触发 = ''
        switch (true) {
            case Player.V.战神: 职业触发 = '战神'; break
            case Player.V.骑士: 职业触发 = '骑士'; break
            case Player.V.火神: 职业触发 = '火神'; break
            case Player.V.冰法: 职业触发 = '冰法'; break
            case Player.V.驯兽师: 职业触发 = '驯兽师'; break
            case Player.V.牧师: 职业触发 = '牧师'; break
            case Player.V.刺客: 职业触发 = '刺客'; break
            case Player.V.鬼舞者: 职业触发 = '鬼舞者'; break
            case Player.V.神射手: 职业触发 = '神射手'; break
            case Player.V.猎人: 职业触发 = '猎人'; break
            case Player.V.武僧: 职业触发 = '武僧'; break
            case Player.V.罗汉: 职业触发 = '罗汉'; break
        }
        
        if (Player.V.真实充值 >= 5000 && random(1000) < 150+Player.R.本职装备几率) {
            职业 = 职业触发
        } else if (Player.V.真实充值 >= 1000 && Player.V.真实充值 < 5000 && random(1000) < 50+Player.R.本职装备几率) {
            职业 = 职业触发
        } else if (random(1000) < 10+Player.R.本职装备几率) {
            职业 = 职业触发
        } else {
            switch (random(12)) {
                case 0: 职业 = '战神'; break
                case 1: 职业 = '骑士'; break
                case 2: 职业 = '火神'; break
                case 3: 职业 = '冰法'; break
                case 4: 职业 = '驯兽师'; break
                case 5: 职业 = '牧师'; break
                case 6: 职业 = '刺客'; break
                case 7: 职业 = '鬼舞者'; break
                case 8: 职业 = '神射手'; break
                case 9: 职业 = '猎人'; break
                case 10: 职业 = '武僧'; break
                case 11: 职业 = '罗汉'; break
            }
        }

        const 劣质 = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4]
        const 超强 = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4]
        const 杰出 = [0, 0, 1, 1, 1, 1, 1, 2, 2, 3, 4]
        const 传说 = [0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 5]
        const 神话 = [, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5]
        const 传承 = [1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6]
        const 史诗 = [1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 6]
        const 绝世 = [2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6, 7]
        const 造化 = [3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 7, 7, 8]
        const 混沌 = [4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8, 8]
        const 底材 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 8,]



        let 装备特效显示 = 0
        let 下面几率 = 0
        switch (颜色) {
            case 装备颜色.混沌颜色:
                翻倍 = 20 + random(61);
                下面几率 = 50
                装备特效显示 = 装备特效.混沌颜色
                白色条数 = Math.min(8, random(2000 - Player.R.极品率) < 35 ? 8 : 混沌[random(混沌.length)])
                break
            case 装备颜色.造化颜色:
                下面几率 = 35
                装备特效显示 = 装备特效.造化颜色
                白色条数 = Math.min(8, random(2000 - Player.R.极品率) < 35 ? 7 : 造化[random(造化.length)])
                switch (true) {
                    case 翻倍几率 < 25: 翻倍 = 1 + random(80); break
                    case 翻倍几率 >= 25 && 翻倍几率 <= 50: 翻倍 = 8 + random(70); break
                    case 翻倍几率 > 50 && 翻倍几率 <= 80: 翻倍 = 8 + random(60); break
                    case 翻倍几率 > 80 && 翻倍几率 <= 115: 翻倍 = 8 + random(50); break
                    case 翻倍几率 > 115 && 翻倍几率 <= 155: 翻倍 = 8 + random(40); break
                    case 翻倍几率 > 155 && 翻倍几率 <= 200: 翻倍 = 8 + random(30); break
                    case 翻倍几率 > 200 && 翻倍几率 <= 250: 翻倍 = 8 + random(20); break
                    default: 翻倍 = 1 + random(10); break
                }
                break
            case 装备颜色.绝世颜色:
                下面几率 = 30
                装备特效显示 = 装备特效.绝世颜色
                白色条数 = Math.min(8, random(2000 - Player.R.极品率) < 35 ? 6 : 绝世[random(绝世.length)])
                switch (true) {
                    case 翻倍几率 < 20: 翻倍 = 1 + random(80); break
                    case 翻倍几率 >= 20 && 翻倍几率 <= 40: 翻倍 = 7 + random(70); break
                    case 翻倍几率 > 40 && 翻倍几率 <= 65: 翻倍 = 7 + random(60); break
                    case 翻倍几率 > 65 && 翻倍几率 <= 95: 翻倍 = 7 + random(50); break
                    case 翻倍几率 > 95 && 翻倍几率 <= 130: 翻倍 = 7 + random(40); break
                    case 翻倍几率 > 130 && 翻倍几率 <= 170: 翻倍 = 7 + random(30); break
                    case 翻倍几率 > 170 && 翻倍几率 <= 215: 翻倍 = 7 + random(20); break
                    default: 翻倍 = 1 + random(10); break
                }
                break
            case 装备颜色.史诗颜色:
                下面几率 = 25
                装备特效显示 = 装备特效.史诗颜色
                白色条数 = Math.min(8, random(2000 - Player.R.极品率) < 35 ? 5 : 史诗[random(史诗.length)])
                switch (true) {
                    case 翻倍几率 < 15: 翻倍 = 1 + random(80); break
                    case 翻倍几率 >= 15 && 翻倍几率 <= 30: 翻倍 = 6 + random(70); break
                    case 翻倍几率 > 30 && 翻倍几率 <= 50: 翻倍 = 6 + random(60); break
                    case 翻倍几率 > 50 && 翻倍几率 <= 75: 翻倍 = 6 + random(50); break
                    case 翻倍几率 > 75 && 翻倍几率 <= 100: 翻倍 = 6 + random(40); break
                    case 翻倍几率 > 100 && 翻倍几率 <= 130: 翻倍 = 6 + random(30); break
                    case 翻倍几率 > 130 && 翻倍几率 <= 145: 翻倍 = 6 + random(20); break
                    default: 翻倍 = 1 + random(10); break
                }
                break
            case 装备颜色.传承颜色:
                下面几率 = 20
                装备特效显示 = 装备特效.传承颜色
                白色条数 = Math.min(8, random(2000 - Player.R.极品率) < 35 ? 4 : 传承[random(传承.length)])
                switch (true) {
                    case 翻倍几率 < 12: 翻倍 = 1 + random(80); break
                    case 翻倍几率 >= 12 && 翻倍几率 <= 22: 翻倍 = 5 + random(70); break
                    case 翻倍几率 > 22 && 翻倍几率 <= 37: 翻倍 = 5 + random(60); break
                    case 翻倍几率 > 37 && 翻倍几率 <= 57: 翻倍 = 5 + random(50); break
                    case 翻倍几率 > 57 && 翻倍几率 <= 82: 翻倍 = 5 + random(40); break
                    case 翻倍几率 > 82 && 翻倍几率 <= 102: 翻倍 = 5 + random(30); break
                    case 翻倍几率 > 102 && 翻倍几率 <= 137: 翻倍 = 5 + random(20); break
                    default: 翻倍 = 1 + random(10); break
                }
                break
            case 装备颜色.神话颜色:
                下面几率 = 15
                装备特效显示 = 装备特效.神话颜色
                白色条数 = Math.min(8, random(2000 - Player.R.极品率) < 35 ? 3 : 神话[random(神话.length)])
                switch (true) {
                    case 翻倍几率 < 8: 翻倍 = 1 + random(80); break
                    case 翻倍几率 >= 8 && 翻倍几率 <= 13: 翻倍 = 4 + random(70); break
                    case 翻倍几率 > 13 && 翻倍几率 <= 23: 翻倍 = 4 + random(60); break
                    case 翻倍几率 > 23 && 翻倍几率 <= 38: 翻倍 = 4 + random(50); break
                    case 翻倍几率 > 38 && 翻倍几率 <= 58: 翻倍 = 4 + random(40); break
                    case 翻倍几率 > 58 && 翻倍几率 <= 83: 翻倍 = 4 + random(30); break
                    case 翻倍几率 > 83 && 翻倍几率 <= 113: 翻倍 = 4 + random(20); break
                    default: 翻倍 = 1 + random(10); break
                }
                break
            case 装备颜色.传说颜色:
                下面几率 = 10
                装备特效显示 = 装备特效.传说颜色
                白色条数 = Math.min(8, random(2000 - Player.R.极品率) < 35 ? 3 : 传说[random(传说.length)])
                switch (true) {
                    case 翻倍几率 < 5: 翻倍 = 1 + random(80); break
                    case 翻倍几率 >= 5 && 翻倍几率 <= 9: 翻倍 = 3 + random(70); break
                    case 翻倍几率 > 9 && 翻倍几率 <= 18: 翻倍 = 3 + random(60); break
                    case 翻倍几率 > 18 && 翻倍几率 <= 30: 翻倍 = 3 + random(50); break
                    case 翻倍几率 > 30 && 翻倍几率 <= 46: 翻倍 = 3 + random(40); break
                    case 翻倍几率 > 46 && 翻倍几率 <= 66: 翻倍 = 3 + random(30); break
                    case 翻倍几率 > 66 && 翻倍几率 <= 90: 翻倍 = 3 + random(20); break
                    default: 翻倍 = 1 + random(10); break
                }
                break
            case 装备颜色.杰出颜色:
                下面几率 = 8
                白色条数 = Math.min(8, random(2000 - Player.R.极品率) < 35 ? 3 : 杰出[random(杰出.length)])
                switch (true) {
                    case 翻倍几率 < 3: 翻倍 = 1 + random(80); break
                    case 翻倍几率 >= 3 && 翻倍几率 <= 6: 翻倍 = 3 + random(70); break
                    case 翻倍几率 > 6 && 翻倍几率 <= 12: 翻倍 = 3 + random(60); break
                    case 翻倍几率 > 12 && 翻倍几率 <= 21: 翻倍 = 3 + random(50); break
                    case 翻倍几率 > 21 && 翻倍几率 <= 33: 翻倍 = 3 + random(40); break
                    case 翻倍几率 > 33 && 翻倍几率 <= 48: 翻倍 = 3 + random(30); break
                    case 翻倍几率 > 48 && 翻倍几率 <= 66: 翻倍 = 3 + random(20); break
                    default: 翻倍 = 1 + random(10); break
                }
                break
            case 装备颜色.超强颜色:
                下面几率 = 5
                白色条数 = Math.min(8, random(2000 - Player.R.极品率) < 45 ? 3 : 超强[random(超强.length)])
                switch (true) {
                    case 翻倍几率 < 2: 翻倍 = 1 + random(80); break
                    case 翻倍几率 >= 2 && 翻倍几率 <= 4: 翻倍 = 2 + random(70); break
                    case 翻倍几率 > 4 && 翻倍几率 <= 7: 翻倍 = 2 + random(60); break
                    case 翻倍几率 > 7 && 翻倍几率 <= 13: 翻倍 = 2 + random(50); break
                    case 翻倍几率 > 13 && 翻倍几率 <= 22: 翻倍 = 2 + random(40); break
                    case 翻倍几率 > 22 && 翻倍几率 <= 34: 翻倍 = 2 + random(30); break
                    case 翻倍几率 > 34 && 翻倍几率 <= 49: 翻倍 = 2 + random(20); break
                    default: 翻倍 = 1 + random(10); break
                }
                break
            case 装备颜色.底材颜色:
                白色条数 = Math.min(8, random(2000 - Player.R.极品率) < 45 ? 3 : 底材[random(底材.length)])
                switch (true) {
                    case 翻倍几率 < 2: 翻倍 = 1 + random(80); break
                    case 翻倍几率 >= 2 && 翻倍几率 <= 4: 翻倍 = 1 + random(70); break
                    case 翻倍几率 > 4 && 翻倍几率 <= 7: 翻倍 = 1 + random(60); break
                    case 翻倍几率 > 7 && 翻倍几率 <= 13: 翻倍 = 1 + random(50); break
                    case 翻倍几率 > 13 && 翻倍几率 <= 22: 翻倍 = 1 + random(40); break
                    case 翻倍几率 > 22 && 翻倍几率 <= 34: 翻倍 = 1 + random(30); break
                    case 翻倍几率 > 34 && 翻倍几率 <= 49: 翻倍 = 1 + random(20); break
                    default: 翻倍 = 1 + random(10); break
                }
                break
            case 装备颜色.劣质颜色:
                下面几率 = 3
                白色条数 = Math.min(8, random(2000 - Player.R.极品率) < 45 ? 3 : 劣质[random(劣质.length)])
                switch (true) {
                    case 翻倍几率 < 1: 翻倍 = 1 + random(40); break
                    case 翻倍几率 >= 1 && 翻倍几率 <= 3: 翻倍 = 1 + random(30); break
                    case 翻倍几率 > 3 && 翻倍几率 <= 6: 翻倍 = 1 + random(20); break
                    case 翻倍几率 > 6 && 翻倍几率 <= 9: 翻倍 = 1 + random(10); break
                    case 翻倍几率 > 9 && 翻倍几率 <= 15: 翻倍 = 1 + random(5); break
                    default: 翻倍 = 1; break
                }
                break
        }
        if (Monster.GetNVar(怪物超星数) > 0) {
            星星数量 = (Math.max(10, randomRange(Monster.GetNVar(怪物超星数) / 10, Monster.GetNVar(怪物超星数) * 翻倍))) * 100000000
        } else {
            星星数量 = Math.max(10, randomRange(Monster.GetNVar(怪物星数) / 10, Monster.GetNVar(怪物星数) * 翻倍))
        }

        if (Item.StdMode == 68 || Item.StdMode == 35) { //生肖和马牌
            let 攻魔道 = Item.GetNeedLevel()
            if (星星数量 > 1000000000) {
                Item.SetOutWay1(基础属性分割, 19);// 分隔符 1
                Item.SetOutWay2(基础属性分割, 星星数量 / 100000000)
            } else {
                Item.SetOutWay1(基础属性分割, 20);// 分隔符 1
                Item.SetOutWay2(基础属性分割, 星星数量)
            }
            Item.Rename(Item.GetName() + `·[${末尾}]`)
            Item.SetOutWay1(2, 600)
            Item.SetOutWay1(3, 601)
            Item.SetOutWay1(4, 602)
            Item.SetOutWay1(5, 603)
            Item.SetOutWay1(6, 604)
            Item.SetOutWay1(7, 605)
            Item.SetOutWay2(2, 攻魔道)
            Item.SetOutWay2(3, 攻魔道)
            Item.SetOutWay2(4, 攻魔道)
            Item.SetOutWay2(5, 攻魔道)
            Item.SetOutWay2(6, 攻魔道)
            Item.SetOutWay2(7, 攻魔道)
            Item.SetOutWay3(2, 攻魔道)
            Item.SetOutWay3(3, 攻魔道)
            Item.SetOutWay3(4, 攻魔道)
            Item.SetOutWay3(5, 攻魔道)
            Item.SetOutWay3(6, 攻魔道)
            Item.SetOutWay3(7, 攻魔道)
            Item.SetCustomEffect(装备特效.时装马牌)
            Item.SetColor(颜色)
            Player.UpdateItem(Item)
            return
        }

        const 首饰名字 = ['艾维斯之戒', '艾维利之戒', '阿拉贡神戒', '阿拉贡魔戒', '巫王的项链']

        if (首饰名字.includes(Item.GetName())) {
            switch (Monster.DropName) {
                case '10人形': Item.SetNeedLevel(10); break
                case '20人形': Item.SetNeedLevel(20); break
                case '40人形': Item.SetNeedLevel(40); break
                case '60人形': Item.SetNeedLevel(60); break
                case '80人形': Item.SetNeedLevel(80); break
                case '100人形': Item.SetNeedLevel(100); break
                case '120人形': Item.SetNeedLevel(120); break
                case '140人形': Item.SetNeedLevel(140); break
                case '160人形': Item.SetNeedLevel(160); break
                case '180人形': Item.SetNeedLevel(180); break
                case '200人形': Item.SetNeedLevel(200); break
                case '220人形': Item.SetNeedLevel(220); break
                case '240人形': Item.SetNeedLevel(240); break
                case '260人形': Item.SetNeedLevel(260); break
                case '280人形': Item.SetNeedLevel(280); break
                case '300人形': Item.SetNeedLevel(300); break
                case '320人形': Item.SetNeedLevel(320); break
                case '340人形': Item.SetNeedLevel(340); break
                case '360人形': Item.SetNeedLevel(360); break
                case '380人形': Item.SetNeedLevel(380); break
                case '400人形': Item.SetNeedLevel(400); break
                case '420人形': Item.SetNeedLevel(420); break
                case '440人形': Item.SetNeedLevel(440); break
                case '460人形': Item.SetNeedLevel(460); break
                case '500人形': Item.SetNeedLevel(500); break
                case '550人形': Item.SetNeedLevel(550); break
                case '600人形': Item.SetNeedLevel(600); break
                case '650人形': Item.SetNeedLevel(650); break
                case '700人形': Item.SetNeedLevel(700); break
                case '750人形': Item.SetNeedLevel(750); break
                case '800人形': Item.SetNeedLevel(800); break
                case '850人形': Item.SetNeedLevel(850); break
                case '900人形': Item.SetNeedLevel(900); break
                default: Item.SetNeedLevel(1000); break
            }

            Item.SetColor(颜色)
            if (Item.GetName() == '艾维斯之戒') {
                Item.SetOutWay1(0, 21)
                Item.SetOutWay1(1, 700)
                Item.SetOutWay2(1, Item.GetNeedLevel() / 10)
            } else if (Item.GetName() == '艾维利之戒') {
                Item.SetOutWay1(0, 21)
                Item.SetOutWay1(1, 702)
                Item.SetOutWay2(1, Item.GetNeedLevel() / 20)
            } else if (Item.GetName() == '阿拉贡神戒') {
                Item.SetOutWay1(0, 21)
                Item.SetOutWay1(1, 705)
                Item.SetOutWay2(1, Item.GetNeedLevel() / 50)
            } else if (Item.GetName() == '阿拉贡魔戒') {
                Item.SetOutWay1(0, 21)
                Item.SetOutWay1(1, 706)
                Item.SetOutWay2(1, Item.GetNeedLevel() / 100)
            } else if (Item.GetName() == '巫王的项链') {
                Item.SetOutWay1(0, 21)
                Item.SetOutWay1(1, 720)
                Item.SetOutWay2(1, Item.GetNeedLevel() / 20)
                Item.SetOutWay1(2, 721)
                Item.SetOutWay2(2, Math.max(1, Item.GetNeedLevel() / 200))
            }
            Player.UpdateItem(Item)
            return
        }


        let 全属性 = false
        let an: number = 基础属性第一条 + 白色条数
        let 职业条数: number = 职业第一条 + 职业技能条数
        if (an > 基础属性第十条) { an = 基础属性第十条; }
        if (星星数量 > 1000000000) {
            Item.SetOutWay1(基础属性分割, 19);// 分隔符 1
            Item.SetOutWay2(基础属性分割, 星星数量 / 100000000)
            if (末尾 != 尾部名字.底材名字) {
                Item.SetOutWay1(职业分割, 21);// 分隔符 1
            }
            for (let i = 基础属性第一条; i < an; i++) {
                if (全属性 == false) {      //随机最多全属性随机1次
                    随机额外属性 = 50 + random(9)
                    全属性 = true
                } else {
                    随机额外属性 = 51 + random(8)
                }
                switch (随机额外属性) {
                    case 50: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break //全属性
                    case 51: 额外属性的值 = randomRange(星星数量 * 20, random(星星数量 * 100)); break//生命
                    case 52: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break//防御
                    case 53: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break//攻击
                    case 54: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break//魔法
                    case 55: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break//道术
                    case 56: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break//射术
                    case 57: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break//刺术
                    case 58: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break//武术
                }
                Item.SetOutWay1(i, 随机额外属性);
                Item.SetOutWay2(i, 额外属性的值 / 100000000);
            }
        } else {
            Item.SetOutWay1(基础属性分割, 20);// 分隔符 1
            Item.SetOutWay2(基础属性分割, 星星数量)
            if (末尾 != 尾部名字.底材名字) {
                Item.SetOutWay1(职业分割, 21);// 分隔符 1
            }
            for (let i = 基础属性第一条; i < an; i++) {
                if (全属性 == false) {      //随机最多全属性随机1次
                    随机额外属性 = 30 + random(9)
                    全属性 = true
                } else {
                    随机额外属性 = 31 + random(8)
                }
                switch (随机额外属性) {
                    case 30: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break //全属性
                    case 31: 额外属性的值 = randomRange(星星数量 * 20, random(星星数量 * 100)); break//生命
                    case 32: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break//防御
                    case 33: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break//攻击
                    case 34: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break//魔法
                    case 35: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break//道术
                    case 36: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break//射术
                    case 37: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break//刺术
                    case 38: 额外属性的值 = Math.max(5, randomRange(星星数量 / 10, 星星数量)); break//武术
                }
                if (随机额外属性 == 31 && 额外属性的值 > 1000000000) {
                    随机额外属性 = 51
                    Item.SetOutWay1(i, 随机额外属性);
                    Item.SetOutWay2(i, 额外属性的值 / 100000000);
                } else {
                    Item.SetOutWay1(i, 随机额外属性);
                    Item.SetOutWay2(i, 额外属性的值);
                }

            }
        }

        if (Item.StdMode == 17 || Item.StdMode == 18 || Item.StdMode == 25) {
            switch (Monster.DropName) {
                case '10人形': Item.SetNeedLevel(10); break
                case '20人形': Item.SetNeedLevel(20); break
                case '40人形': Item.SetNeedLevel(40); break
                case '60人形': Item.SetNeedLevel(60); break
                case '80人形': Item.SetNeedLevel(80); break
                case '100人形': Item.SetNeedLevel(100); break
                case '120人形': Item.SetNeedLevel(120); break
                case '140人形': Item.SetNeedLevel(140); break
                case '160人形': Item.SetNeedLevel(160); break
                case '180人形': Item.SetNeedLevel(180); break
                case '200人形': Item.SetNeedLevel(200); break
                case '220人形': Item.SetNeedLevel(220); break
                case '240人形': Item.SetNeedLevel(240); break
                case '260人形': Item.SetNeedLevel(260); break
                case '280人形': Item.SetNeedLevel(280); break
                case '300人形': Item.SetNeedLevel(300); break
                case '320人形': Item.SetNeedLevel(320); break
                case '340人形': Item.SetNeedLevel(340); break
                case '360人形': Item.SetNeedLevel(360); break
                case '380人形': Item.SetNeedLevel(380); break
                case '400人形': Item.SetNeedLevel(400); break
                case '420人形': Item.SetNeedLevel(420); break
                case '440人形': Item.SetNeedLevel(440); break
                case '460人形': Item.SetNeedLevel(460); break
                case '500人形': Item.SetNeedLevel(500); break
                case '550人形': Item.SetNeedLevel(550); break
                case '600人形': Item.SetNeedLevel(600); break
                case '650人形': Item.SetNeedLevel(650); break
                case '700人形': Item.SetNeedLevel(700); break
                case '750人形': Item.SetNeedLevel(750); break
                case '800人形': Item.SetNeedLevel(800); break
                case '850人形': Item.SetNeedLevel(850); break
                case '900人形': Item.SetNeedLevel(900); break
                default: Item.SetNeedLevel(1000); break
            }
            if (Item.GetName() == '缺月太极') {
                Item.SetOutWay1(12, 710)
            }
            Item.SetColor(颜色)
            Item.Rename(Item.GetName() + `·[${末尾}]`)
            Player.UpdateItem(Item)
            return
        }



        if (末尾 != 尾部名字.底材名字) {
            if (Item.StdMode == 5 || Item.StdMode == 6) {   //武器      
                for (let i = 职业第一条; i < 职业条数; i++) {
                    for (let 循环 of 职业技能重数有全倍攻) {
                        if (职业 == 循环.职业) {
                            if (random(120) < 4) {
                                随机额外属性 = 循环.倍攻[random(循环.倍攻.length)]
                                Item.SetOutWay1(i, 随机额外属性);
                                for (let 循环 of 倍攻几率) {
                                    if (地图.ID取地图名(Map.GetName()) == 循环.地图名字) {
                                        if (random(150) < 循环.几率) {
                                            Item.SetOutWay2(i, Math.min(16, 循环.固定 + random(循环.最高几率)))
                                        } else {
                                            Item.SetOutWay2(i, 1 + random(3))
                                        }
                                    }
                                }
                            } else {
                                随机额外属性 = 循环.技能重数[random(循环.技能重数.length)]
                                Item.SetOutWay1(i, 随机额外属性);
                                if (random(100) < 2) {
                                    Item.SetOutWay2(i, 1 + random(6))
                                } else {
                                    Item.SetOutWay2(i, 1 + random(4))
                                }
                            }
                        }

                    }
                }
            } else {
                for (let i = 职业第一条; i < 职业条数; i++) {
                    for (let 循环 of 职业技能重数没全倍攻) {
                        if (职业 == 循环.职业) {
                            if (random(120) < 4) {
                                随机额外属性 = 循环.倍攻[random(循环.倍攻.length)]
                                Item.SetOutWay1(i, 随机额外属性);
                                for (let 循环 of 倍攻几率) {
                                    if (Map.GetName() == 循环.地图名字) {
                                        if (random(150) < 循环.几率) {
                                            Item.SetOutWay2(i, Math.min(16, 循环.固定 + random(循环.最高几率)))
                                        } else {
                                            Item.SetOutWay2(i, 1 + random(3))
                                        }
                                    }
                                }
                            } else {
                                随机额外属性 = 循环.技能重数[random(循环.技能重数.length)]
                                Item.SetOutWay1(i, 随机额外属性);
                                if (random(100) < 2) {
                                    Item.SetOutWay2(i, 1 + random(6))
                                } else {
                                    Item.SetOutWay2(i, 1 + random(4))
                                }
                            }
                        }

                    }
                }
            }
            let 种族数值 = 0
            let 种族属性 = 0
            for (let a = 0; a < 3; a++) {
                if (random(100) < 下面几率) {
                    if (random(100) < 50) {
                        种族数值 = randomRange(1 + random(10) + 星星数量 / 40, 1 + random(10) + 星星数量 / 20)
                        if (种族数值 > 1000000000) {
                            种族属性 = 种族大属性[random(种族大属性.length)]
                            种族数值 = 种族数值 / 100000000
                        } else {
                            种族属性 = 种族小属性[random(种族小属性.length)]
                            种族数值 = 种族数值
                        }
                        Item.SetOutWay1(种族第一 + a, 种族属性)
                        Item.SetOutWay2(种族第一 + a, 种族数值)
                    } else {
                        if (random(100) < 1) {
                            Item.SetOutWay1(天赋一 + a, 天赋属性[random(天赋属性.length)])
                            Item.SetOutWay2(天赋一 + a, 1 + random(5))
                        } else if (random(100) < 2) {
                            Item.SetOutWay1(天赋一 + a, 天赋属性[random(天赋属性.length)])
                            Item.SetOutWay2(天赋一 + a, 1 + random(3))
                        } else {
                            Item.SetOutWay1(天赋一 + a, 天赋属性[random(天赋属性.length)])
                            Item.SetOutWay2(天赋一 + a, 1 + random(2))
                        }
                    }
                }
            }

            if (Item.StdMode == 5 || Item.StdMode == 6) {
                if (random(100) < 5) {
                    Item.SetOutWay1(专属符文第一, 攻击魔法速度)
                    if (random(100) < 5) {
                        let 速度几率 = random(9)
                        Item.SetAddHitSpeed(速度几率)
                        Item.SetOutWay2(专属符文第一, 1 + 速度几率)
                    } else {
                        let 速度几率 = random(4)
                        Item.SetAddHitSpeed(速度几率)
                        Item.SetOutWay2(专属符文第一, 1 + 速度几率)
                    }
                }
            }
            if (Item.StdMode == 10 || Item.StdMode == 11) {
                if (random(100) < 10) {
                    Item.SetOutWay1(专属符文第一, 伤害减少)
                    if (random(100) < 5) { Item.SetOutWay2(专属符文第一, 1 + random(20)) } else { Item.SetOutWay2(专属符文第一, 1 + random(10)) }
                }

            }
            for (let a = 0; a < 2; a++) {
                if (random(100) < 下面几率) {
                    if (Item.StdMode == 15) {
                        Item.SetOutWay1(专属符文第一 + a, 所有技能等级)
                        if (random(100) < 5) { Item.SetOutWay2(专属符文第一 + a, 1 + random(6)) } else { Item.SetOutWay2(专属符文第一 + a, 1 + random(4)) }
                    }

                    if (Item.StdMode == 22 || Item.StdMode == 23) {//戒指
                        Item.SetOutWay1(专属符文第一 + a, 吸血比例)
                        if (random(100) < 3) { Item.SetOutWay2(专属符文第一 + a, 1 + random(5)) } else { Item.SetOutWay2(专属符文第一 + a, 1 + random(2)) }
                    }
                    if (Item.StdMode == 24 || Item.StdMode == 26) {//搜桌
                        let 伤害OT1 = 0
                        let 随机伤害 = 0
                        随机伤害 = (randomRange(星星数量 / 2, 星星数量))
                        if (随机伤害 > 1000000000) {
                            随机伤害 = 随机伤害 / 100000000
                            伤害OT1 = 308
                        } else {
                            随机伤害 = 随机伤害
                            伤害OT1 = 300
                        }
                        Item.SetOutWay1(专属符文第一 + a, 伤害OT1)
                        Item.SetOutWay2(专属符文第一 + a, 随机伤害)
                    }
                    if (Item.StdMode == 19 || Item.StdMode == 20 || Item.StdMode == 21) {//项链
                        if (random(100) < 10) {
                            Item.SetOutWay1(专属符文第一 + a, 宝宝速度)
                            if (random(100) < 5) { Item.SetOutWay2(专属符文第一 + a, 1 + random(100)) } else { Item.SetOutWay2(专属符文第一 + a, 1 + random(50)) }
                        }
                    }
                    if (Item.StdMode == 27) {//腰带
                        let OT1 = 303
                        let 随机生命 = 0
                        随机生命 = (randomRange(星星数量 / 2, 星星数量))
                        if (随机生命 > 1000000000) {
                            随机生命 = 随机生命 / 100000000
                            OT1 = 309
                        } else {
                            随机生命 = 随机生命
                            OT1 = 303
                        }
                        Item.SetOutWay1(专属符文第一 + a, OT1)
                        Item.SetOutWay2(专属符文第一 + a, 随机生命)
                    }
                    if (Item.StdMode == 28) {//靴子
                        Item.SetOutWay1(专属符文第一 + a, 抵抗异常)
                        Item.SetOutWay2(专属符文第一 + a, randomRange(1 + random(5), 1 + random(30)))
                    }
                }
            }
        }
        if (品阶 == '神器') {
            装备特效显示 = 装备特效.神器特效
        }
        Item.SetCustomEffect(装备特效显示)
        Item.Rename(`${职业}·${品阶}·${Item.GetName()}·[${末尾}]`)
        Item.SetColor(颜色)
        Player.UpdateItem(Item)
        let APlayer: TPlayObject
        for (let I = 0; I <= GameLib.PlayCount - 1; I++) { //循环全部在线玩家
            APlayer = GameLib.GetPlayer(I);
            APlayer.V.屏蔽掉落 ??= false
            if (APlayer && APlayer.GetNotOnlineAddExp() == false && APlayer.V.屏蔽掉落 == false) {
                APlayer.SendMessage(`玩家{S=${Player.GetName()};C=253}在{S=${Player.GetMap().Name};C=253}击杀一只{S=${Monster.GetName()};C=253}掉落了一个{S=${Item.DisplayName};C=249}`, 1);
            }
        }
    }
}




const 倍攻几率 = [
    { 地图名字: '新手地图', 几率: 1, 固定: 1, 最高几率: 16 },
    { 地图名字: '郊外平原', 几率: 1, 固定: 1, 最高几率: 16 },
    { 地图名字: '天然洞穴', 几率: 1, 固定: 1, 最高几率: 16 },
    { 地图名字: '矿区山谷', 几率: 1, 固定: 1, 最高几率: 16 },
    { 地图名字: '沉息之地', 几率: 1, 固定: 1, 最高几率: 16 },
    { 地图名字: '邪恶洞穴', 几率: 1, 固定: 1, 最高几率: 16 },
    { 地图名字: '暗黑比奇', 几率: 1, 固定: 1, 最高几率: 16 },

    { 地图名字: '蛇妖山谷', 几率: 2, 固定: 2, 最高几率: 15 },
    { 地图名字: '黑暗森林', 几率: 2, 固定: 2, 最高几率: 15 },
    { 地图名字: '沃玛寺庙', 几率: 2, 固定: 2, 最高几率: 15 },
    { 地图名字: '神庙主殿', 几率: 2, 固定: 2, 最高几率: 15 },
    { 地图名字: '失落暗殿', 几率: 2, 固定: 2, 最高几率: 15 },
    { 地图名字: '暗黑蛇谷', 几率: 2, 固定: 2, 最高几率: 15 },

    { 地图名字: '死亡山谷', 几率: 3, 固定: 3, 最高几率: 14 },
    { 地图名字: '幽暗石墓', 几率: 3, 固定: 3, 最高几率: 14 },
    { 地图名字: '祖玛回廊', 几率: 3, 固定: 3, 最高几率: 14 },
    { 地图名字: '灰石墓穴', 几率: 3, 固定: 3, 最高几率: 14 },
    { 地图名字: '诸侯领地', 几率: 3, 固定: 3, 最高几率: 14 },
    { 地图名字: '暗黑盟重', 几率: 3, 固定: 3, 最高几率: 14 },

    { 地图名字: '万妖森林', 几率: 4, 固定: 4, 最高几率: 13 },
    { 地图名字: '万妖峡谷', 几率: 4, 固定: 4, 最高几率: 13 },
    { 地图名字: '万妖之塔', 几率: 4, 固定: 4, 最高几率: 13 },
    { 地图名字: '万妖塔顶', 几率: 4, 固定: 4, 最高几率: 13 },
    { 地图名字: '万妖之巢', 几率: 4, 固定: 4, 最高几率: 13 },
    { 地图名字: '暗黑白日门', 几率: 4, 固定: 4, 最高几率: 13 },

    { 地图名字: '封魔谷', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '恶魔监牢', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '铁血魔域', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '封魔殿', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '不归路', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '暗黑封魔谷', 几率: 4, 固定: 5, 最高几率: 12 },

    { 地图名字: '尸魔洞', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '骨魔洞', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '牛魔寺庙', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '奈何桥', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '寺庙大厅', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '暗黑苍月岛', 几率: 4, 固定: 5, 最高几率: 12 },

    { 地图名字: '魔龙沼泽', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '火龙巢穴', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '九幽海域', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '火龙神殿', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '魔龙圣地', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '暗黑魔龙城', 几率: 4, 固定: 5, 最高几率: 12 },

    { 地图名字: '狐月小径', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '雪域冰山', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '雪域冰宫', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '雪域王殿', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '神域冰谷', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '暗黑狐月山', 几率: 4, 固定: 5, 最高几率: 12 },

    { 地图名字: '四方祭坛', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '蛮荒丛林', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '沙漠绿洲', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '暗黑神殿', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '荒芜山谷', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '暗黑埋骨荒原', 几率: 4, 固定: 5, 最高几率: 12 },

    { 地图名字: '三叉岛', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '纷争之地', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '熔火地狱', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '神魔战场', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '神舰之地', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '暗黑魔神遗迹', 几率: 4, 固定: 5, 最高几率: 12 },

    { 地图名字: '血狱皇陵', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '暗夜大殿', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '血腥森林', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '星空廊道', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '赤色战场', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '暗黑血狱', 几率: 4, 固定: 5, 最高几率: 12 },
    
    { 地图名字: '屠龙之路', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '光明大殿', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '困兽之地', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '边陲小岛', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '暴风营地', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '暗黑北冥魔境', 几率: 4, 固定: 5, 最高几率: 12 },

    { 地图名字: '缥缈之地', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '地狱无门', 几率: 4, 固定: 5, 最高几率: 12 },

    { 地图名字: '诸天神殿[一幕]', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '诸天神殿[二幕]', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '诸天神殿[三幕]', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '诸天神殿[四幕]', 几率: 4, 固定: 5, 最高几率: 12 },
    { 地图名字: '诸天神殿[五幕]', 几率: 4, 固定: 5, 最高几率: 12 },

    { 地图名字: '上古禁地', 几率: 10, 固定: 2, 最高几率: 15 },
    { 地图名字: '圣域试炼', 几率: 15, 固定: 5, 最高几率: 12 },
]





const 职业技能重数有全倍攻 = [
    { 职业: '战神', 技能重数: [95, 96, 105, 106, 107, 108, 109], 倍攻: [195, 196, 208, 210, 211, 204, 205] },
    { 职业: '骑士', 技能重数: [95, 96, 110, 111, 112, 113, 114], 倍攻: [195, 196, 212, 213, 214, 204, 205] },
    { 职业: '火神', 技能重数: [97, 100, 115, 116, 117, 118], 倍攻: [197, 199, 215, 216, 204, 205] },
    { 职业: '冰法', 技能重数: [97, 100, 119, 120, 121, 122], 倍攻: [197, 199, 217, 218, 219, 204, 205] },
    { 职业: '驯兽师', 技能重数: [98, 99, 101, 123, 124, 125, 126, 161], 倍攻: [198, 200, 207, 204, 205] },
    { 职业: '牧师', 技能重数: [98, 99, 101, 127, 128, 129, 130, 131], 倍攻: [198, 200, 220, 221, 222, 204, 205] },
    { 职业: '刺客', 技能重数: [102, 132, 133, 134, 135], 倍攻: [201, 223, 224, 204, 205] },
    { 职业: '鬼舞者', 技能重数: [102, 136, 137, 138, 139, 140], 倍攻: [201, 225, 226, 227, 204, 205] },
    { 职业: '神射手', 技能重数: [141, 142, 143, 144, 145], 倍攻: [228, 229, 230, 204, 205] },
    { 职业: '猎人', 技能重数: [146, 147, 148, 149, 160], 倍攻: [231, 232, 206, 204, 205] },
    { 职业: '武僧', 技能重数: [103, 104, 150, 151, 152, 153, 154], 倍攻: [202, 203, 233, 234, 235, 204, 205] },
    { 职业: '罗汉', 技能重数: [103, 104, 155, 156, 157, 158, 159], 倍攻: [202, 203, 236, 209, 204, 205] },
]

const 职业技能重数没全倍攻 = [
    { 职业: '战神', 技能重数: [95, 96, 105, 106, 107, 108, 109], 倍攻: [195, 196, 208, 210, 211] },
    { 职业: '骑士', 技能重数: [95, 96, 110, 111, 112, 113, 114], 倍攻: [195, 196, 212, 213, 214] },
    { 职业: '火神', 技能重数: [97, 100, 115, 116, 117, 118], 倍攻: [197, 199, 215, 216] },
    { 职业: '冰法', 技能重数: [97, 100, 119, 120, 121, 122], 倍攻: [197, 199, 217, 218, 219] },
    { 职业: '驯兽师', 技能重数: [98, 99, 101, 123, 124, 125, 126, 161], 倍攻: [198, 200, 207] },
    { 职业: '牧师', 技能重数: [98, 99, 101, 127, 128, 129, 130, 131], 倍攻: [198, 200, 220, 221, 222] },
    { 职业: '刺客', 技能重数: [102, 132, 133, 134, 135], 倍攻: [201, 223, 224] },
    { 职业: '鬼舞者', 技能重数: [102, 136, 137, 138, 139, 140], 倍攻: [201, 225, 226, 227] },
    { 职业: '神射手', 技能重数: [141, 142, 143, 144, 145], 倍攻: [228, 229, 230] },
    { 职业: '猎人', 技能重数: [146, 147, 148, 149, 160], 倍攻: [231, 232, 206] },
    { 职业: '武僧', 技能重数: [103, 104, 150, 151, 152, 153, 154], 倍攻: [202, 203, 233, 234, 235] },
    { 职业: '罗汉', 技能重数: [103, 104, 155, 156, 157, 158, 159], 倍攻: [202, 203, 236, 209] },
]
const 攻击魔法速度 = 310
const 伤害减少 = 301
const 所有技能等级 = 304
const 吸血比例 = 302
const 造成伤害 = 300
const 造成伤害超 = 308
const 宝宝速度 = 305
const 抵抗异常 = 307
const 种族小属性 = [350, 351, 352]
const 种族大属性 = [360, 361, 362]
const 天赋属性 = [620, 621, 622, 623, 624, 625, 626, 627, 628]





