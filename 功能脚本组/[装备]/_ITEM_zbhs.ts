/*装备回收
修复日期: 2025/07/15
修复内容:
1. 修复了检查词条保留函数中的逻辑问题:
   - 正确区分了只勾选主属性词条、只勾选本职业属性词条和同时勾选两者的情况
   - 根据职业ID正确检查对应的属性
   - 添加了详细的调试信息

2. 确保无条件执行回收逻辑函数真的不检查词条保留条件:
   - 只检查装备类型和是否绑定
   - 不进行任何词条保留检查

3. 添加了更多调试信息，以便更好地理解回收过程中的决策
*/
import { js_number, js_war } from "../../全局脚本[公共单元]/utils/计算方法";
import { 大数值整数简写 } from "../[服务]/延时跳转";
// import { _P_P_AbilityData, } from "../[玩家]/_P_Base"
import { 基础属性第一条, 基础属性第十条, 备用四 } from "./_ITEM_Base";
import * as 技能伤害选择 from "./技能伤害选择";
// 常量定义
const 装备类型 = [4, 5, 6, 10, 11, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 68, 35]

// 品质价格映射
const 品质价格映射 = {
    '普通': 200,
    '精良': 400,
    '优秀': 600,
    '稀有': 800,
    '史诗': 1200,
    '传说': 2000,
    '神话': 4000,
    '远古': 8000,
    '不朽': 15000,
}

// 会员等级价格倍率
const 会员价格倍率 = {
    0: 1,
    1: 1.2,
    2: 1.4,
    3: 1.6,
    4: 1.8,
    5: 2,
    6: 2.2,
    7: 2.4,
    8: 2.6,
    9: 2.8,
    10: 3
}

// 词条类型定义
interface 装备属性 {
    生命: string;
    防御: string;
    攻击: string;
    魔法: string;
    道术: string;
    射术: string;
    刺术: string;
    武术: string;
    属性: string;
    倍攻: string;
    生肖: string;
    种族: string;
    天赋: number;
    装备星星: string;
    技能伤害: string;
    攻速魔速: number;
    吸血比例: number;
}

// 初始化装备属性对象
function 初始化装备属性(): 装备属性 {
    return {
        生命: '0',
        防御: '0',
        攻击: '0',
        魔法: '0',
        道术: '0',
        射术: '0',
        刺术: '0',
        武术: '0',
        属性: '0',
        倍攻: '0',
        生肖: '0',
        种族: '0',
        天赋: 0,
        装备星星: '0',
        技能伤害: '0',
        攻速魔速: 0,
        吸血比例: 0
    }
}

// 获取回收倍数
function 获取回收倍数(Player: TPlayObject): number {
    // let 艾维利之戒指 = 1

    // if (Player.GetJewelrys(1) != null && Player.GetJewelrys(1).GetName() == '艾维利之戒') {
    //     const 戒指 = Player.GetJewelrys(1)
    //     if (戒指.GetOutWay3(40) < 10) {
    //         艾维利之戒指 = (戒指.GetOutWay2(1) / 20 + 戒指.GetOutWay3(40) * 2) / 100
    //     } else {
    //         艾维利之戒指 = (戒指.GetOutWay2(1) / 20 + 戒指.GetOutWay3(40) * 2 + 50) / 100
    //     }
    // }

    return Player.V.回收元宝倍率 / 100
}

// 获取会员价格倍率
function 获取会员价格倍率(会员等级: number): number {
    return 会员价格倍率[会员等级] || 1
}

// 解析装备属性
function 解析装备属性(AItem: TUserItem, Player: TPlayObject): 装备属性 {
    const 属性 = 初始化装备属性()

    if (AItem.GetCustomDesc() !== '') {
        try {
            const 装备字符串 = JSON.parse(AItem.GetCustomDesc())
            if (装备字符串.职业属性_职业) {
                const 装备属性条数 = 装备字符串.职业属性_职业.length
                for (let e = 0; e < 装备属性条数; e++) {
                    const 职业类型 = Number(装备字符串.职业属性_职业[e])
                    const 属性值 = String(装备字符串.职业属性_属性[e])

                    switch (职业类型) {
                        case 33: 属性.攻击 = js_number(属性.攻击, 属性值, 1); break;
                        case 34: 属性.魔法 = js_number(属性.魔法, 属性值, 1); break;
                        case 35: 属性.道术 = js_number(属性.道术, 属性值, 1); break;
                        case 36: 属性.射术 = js_number(属性.射术, 属性值, 1); break;
                        case 37: 属性.刺术 = js_number(属性.刺术, 属性值, 1); break;
                        case 38: 属性.武术 = js_number(属性.武术, 属性值, 1); break;
                        case 31: 属性.生命 = js_number(属性.生命, 属性值, 1); break;
                        case 32: 属性.防御 = js_number(属性.防御, 属性值, 1); break;
                        case 30: 属性.属性 = js_number(属性.属性, 属性值, 1); break;
                        case 350: case 351: case 352: 属性.种族 = js_number(属性.种族, 属性值, 1); break;
                        case 195: case 196: case 197: case 198: case 199: case 200: case 201: case 202: case 203: case 204: case 205: case 206: case 207: case 208: case 209: case 210:
                        case 211: case 212: case 213: case 214: case 215: case 216: case 217: case 218: case 219: case 220: case 221: case 222: case 223: case 224: case 225: case 226:
                        case 227: case 228: case 229: case 230: case 231: case 232: case 233: case 234: case 235: case 236: 属性.倍攻 = js_number(属性.倍攻, 属性值, 1); break;
                        case 401: case 402: case 403: case 404: case 405: case 406: case 407: case 408: case 409: case 410: case 411: case 412: case 413: case 414: case 415: case 416:
                        case 417: case 418: case 419: case 420: case 421: case 422: case 423: case 424: case 425: case 426: case 427: case 428: case 429: case 430: case 431: case 432:
                        case 433: case 434: case 435: case 436: case 437: case 438: case 439: case 440: 属性.技能伤害 = js_number(属性.技能伤害, 属性值, 1); break;
                    }
                }
            }
        } catch (e) {
            // JSON解析失败，忽略
        }
    }

    // 处理生肖和装备星级
    if (Player.V.生肖词条 && (AItem.StdMode == 68 || AItem.StdMode == 35)) {
        属性.生肖 = js_number(属性.生肖, AItem.GetCustomCaption(0), 1)
    }
    if (Player.V.装备星星词条 && AItem.StdMode != 68 && AItem.StdMode != 35) {
        属性.装备星星 = js_number(属性.装备星星, AItem.GetCustomCaption(0), 1)
    }

    // 处理基础属性
    for (let i = 基础属性第一条; i <= 备用四; i++) {
        switch (true) {
            case AItem.GetOutWay1(i) >= 620 && AItem.GetOutWay1(i) <= 628: 属性.天赋 += AItem.GetOutWay2(i); break
            case AItem.GetOutWay1(i) == 310: 属性.攻速魔速 += AItem.GetOutWay2(i); break
            case AItem.GetOutWay1(i) == 302: 属性.吸血比例 += AItem.GetOutWay2(i); break
        }
    }

    return 属性
}

// 检查词条保留条件
function 检查词条保留(属性: 装备属性, Player: TPlayObject, AItem?: TUserItem): boolean {
    // A. 如果没有设置任何词条保留条件，直接返回true表示可以回收
    const 有词条保留设置 = Player.V.主属性词条 ||
        Player.V.本职业属性词条 ||
        Player.V.防御词条 ||
        Player.V.血量词条 ||
        Player.V.倍攻词条 ||
        Player.V.技能伤害词条;

    if (!有词条保留设置) {
        return true; // 没有设置任何词条保留条件，按照装备品质回收
    }

    // B. 基础属性保留检查
    if (Player.V.防御词条 && js_war(属性.防御, Player.V.防御词条数值) > 0) {
        return false; // 保留装备
    }

    if (Player.V.血量词条 && js_war(属性.生命, Player.V.血量词条数值) > 0) {
        return false; // 保留装备
    }

    // 获取职业ID
    const 职业 = Player.GetJob();
    let 保留 = false;

    // 主属性词条检查 - 只勾选了主属性词条
    if (Player.V.主属性词条 && !Player.V.本职业属性词条) {
        // 检查所有属性，任一属性超过阈值就保留
        保留 = js_war(属性.攻击, Player.V.本职业属性词条数值) > 0 ||
            js_war(属性.魔法, Player.V.本职业属性词条数值) > 0 ||
            js_war(属性.道术, Player.V.本职业属性词条数值) > 0 ||
            js_war(属性.刺术, Player.V.本职业属性词条数值) > 0 ||
            js_war(属性.射术, Player.V.本职业属性词条数值) > 0 ||
            js_war(属性.武术, Player.V.本职业属性词条数值) > 0 ||
            js_war(属性.属性, Player.V.本职业属性词条数值) > 0;

        if (保留) {
            return false; // 保留装备
        }
    }
    // 本职业属性词条检查 - 同时勾选了主属性词条和本职业属性词条
    else if (Player.V.主属性词条 && Player.V.本职业属性词条) {
        // 根据职业ID检查对应的属性
        switch (职业) {
            case 0: // 战士系
                保留 = js_war(属性.攻击, Player.V.本职业属性词条数值) > 0 || js_war(属性.属性, Player.V.本职业属性词条数值) > 0;
                break;
            case 1: // 法师系
                保留 = js_war(属性.魔法, Player.V.本职业属性词条数值) > 0 || js_war(属性.属性, Player.V.本职业属性词条数值) > 0;
                break;
            case 2: // 道士系
                保留 = js_war(属性.道术, Player.V.本职业属性词条数值) > 0 || js_war(属性.属性, Player.V.本职业属性词条数值) > 0;
                break;
            case 3: // 刺客系
                保留 = js_war(属性.刺术, Player.V.本职业属性词条数值) > 0 || js_war(属性.属性, Player.V.本职业属性词条数值) > 0;
                break;
            case 4: // 弓箭手系
                保留 = js_war(属性.射术, Player.V.本职业属性词条数值) > 0 || js_war(属性.属性, Player.V.本职业属性词条数值) > 0;
                break;
            case 5: // 武僧系
                保留 = js_war(属性.武术, Player.V.本职业属性词条数值) > 0 || js_war(属性.属性, Player.V.本职业属性词条数值) > 0;
                break;
            default:
                // 未知职业，检查所有属性
                保留 = js_war(属性.攻击, Player.V.本职业属性词条数值) > 0 ||
                    js_war(属性.魔法, Player.V.本职业属性词条数值) > 0 ||
                    js_war(属性.道术, Player.V.本职业属性词条数值) > 0 ||
                    js_war(属性.刺术, Player.V.本职业属性词条数值) > 0 ||
                    js_war(属性.射术, Player.V.本职业属性词条数值) > 0 ||
                    js_war(属性.武术, Player.V.本职业属性词条数值) > 0 ||
                    js_war(属性.属性, Player.V.本职业属性词条数值) > 0;
                break;
        }

        if (保留) {
            return false; // 保留装备
        }
    }
    // 只勾选了本职业属性词条但没有勾选主属性词条
    else if (!Player.V.主属性词条 && Player.V.本职业属性词条) {
        // 根据职业ID检查对应的属性
        switch (职业) {
            case 0: // 战士系
                保留 = js_war(属性.攻击, Player.V.本职业属性词条数值) > 0 || js_war(属性.属性, Player.V.本职业属性词条数值) > 0;
                break;
            case 1: // 法师系
                保留 = js_war(属性.魔法, Player.V.本职业属性词条数值) > 0 || js_war(属性.属性, Player.V.本职业属性词条数值) > 0;
                break;
            case 2: // 道士系
                保留 = js_war(属性.道术, Player.V.本职业属性词条数值) > 0 || js_war(属性.属性, Player.V.本职业属性词条数值) > 0;
                break;
            case 3: // 刺客系
                保留 = js_war(属性.刺术, Player.V.本职业属性词条数值) > 0 || js_war(属性.属性, Player.V.本职业属性词条数值) > 0;
                break;
            case 4: // 弓箭手系
                保留 = js_war(属性.射术, Player.V.本职业属性词条数值) > 0 || js_war(属性.属性, Player.V.本职业属性词条数值) > 0;
                break;
            case 5: // 武僧系
                保留 = js_war(属性.武术, Player.V.本职业属性词条数值) > 0 || js_war(属性.属性, Player.V.本职业属性词条数值) > 0;
                break;
            default:
                // 未知职业，检查所有属性
                保留 = js_war(属性.攻击, Player.V.本职业属性词条数值) > 0 ||
                    js_war(属性.魔法, Player.V.本职业属性词条数值) > 0 ||
                    js_war(属性.道术, Player.V.本职业属性词条数值) > 0 ||
                    js_war(属性.刺术, Player.V.本职业属性词条数值) > 0 ||
                    js_war(属性.射术, Player.V.本职业属性词条数值) > 0 ||
                    js_war(属性.武术, Player.V.本职业属性词条数值) > 0 ||
                    js_war(属性.属性, Player.V.本职业属性词条数值) > 0;
                break;
        }

        if (保留) {
            return false; // 保留装备
        }
    }

    // C. 词条属性保留检查 - 技能伤害和倍攻
    if (Player.V.倍攻词条 && js_war(属性.倍攻, Player.V.倍攻词条数值) > 0) {
        // 检查是否包含 204 或 205 倍攻词条
        if (AItem) {
            try {
                const 装备字符串 = JSON.parse(AItem.GetCustomDesc() || '{}');
                if (装备字符串.职业属性_职业) {
                    const 装备属性条数 = 装备字符串.职业属性_职业.length;
                    let 包含204或205 = false;

                    for (let e = 0; e < 装备属性条数; e++) {
                        const 职业类型 = Number(装备字符串.职业属性_职业[e]);
                        const 属性值 = String(装备字符串.职业属性_属性[e]);

                        // 检查是否是 204 (人物技能倍攻) 或 205 (所有宝宝倍攻)
                        if (职业类型 === 204 || 职业类型 === 205) {
                            if (js_war(属性值, Player.V.倍攻词条数值) > 0) {
                                包含204或205 = true;
                                break;
                            }
                        }
                    }

                    // 如果包含204或205且高于设定数值，默认保留
                    if (包含204或205) {
                        return false; // 保留装备
                    }
                }
            } catch (e) {
                console.log("解析装备倍攻词条失败:", e);
            }
        }

        // 如果没有选择特定技能，保留所有倍攻装备
        if (!Player.V.已选择技能 || Player.V.已选择技能.length === 0) {
            return false; // 保留装备
        }

        // 如果有AItem参数，使用技能伤害选择模块的解析装备属性函数检查
        if (AItem) {
            try {
                if (技能伤害选择.解析装备属性 && !技能伤害选择.解析装备属性(AItem, Player)) {
                    return false; // 保留装备
                }
            } catch (e) {
                console.log("技能倍攻检查失败:", e);
                return false; // 出错时保留装备
            }
        } else {
            return false; // 没有AItem参数时保守处理，保留装备
        }
    }

    if (Player.V.技能伤害词条 && js_war(属性.技能伤害, Player.V.技能伤害词条数值) > 0) {
        // 如果没有选择特定技能，保留所有技能伤害装备
        if (!Player.V.已选择技能 || Player.V.已选择技能.length === 0) {
            return false; // 保留装备
        }

        // 如果有AItem参数，使用技能伤害选择模块的解析装备属性函数检查
        if (AItem) {
            try {
                if (技能伤害选择.解析装备属性 && !技能伤害选择.解析装备属性(AItem, Player)) {
                    return false; // 保留装备
                }
            } catch (e) {
                console.log("技能伤害检查失败:", e);
                return false; // 出错时保留装备
            }
        } else {
            return false; // 没有AItem参数时保守处理，保留装备
        }
    }

    return true; // 可以回收
}

// 获取装备品质价格
function 获取装备品质价格(装备名称: string): number {
    for (const [品质, 价格] of Object.entries(品质价格映射)) {
        if (装备名称.includes(品质)) {
            return 价格
        }
    }
    return 0
}

// 解析神器倍数
function 解析神器倍数(displayName: string): number {
    // 匹配格式：[神器]${倍数}倍
    const match = displayName.match(/\[神器\]\$\{(\d+)\}倍/);
    if (match) {
        return parseInt(match[1]);
    }

    // 备用匹配格式：[神器]数字倍
    const backupMatch = displayName.match(/\[神器\](\d+)倍/);
    if (backupMatch) {
        return parseInt(backupMatch[1]);
    }

    return 0;
}

// 检查是否为神器装备
function 是神器装备(displayName: string): boolean {
    return displayName.includes('[神器]');
}

// 检查装备是否应该回收
function 应该回收装备(AItem: TUserItem, Player: TPlayObject): boolean {
    if (!装备类型.includes(AItem.StdMode) || AItem.GetState().GetBind()) {
        return false
    }

    // 检查神器装备
    if (是神器装备(AItem.DisplayName)) {
        return Player.V.神器; // 只有勾选神器才回收神器装备
    }

    const 品质检查 = [
        { 条件: Player.V.普通, 品质: '普通' },
        { 条件: Player.V.精良, 品质: '精良' },
        { 条件: Player.V.优秀, 品质: '优秀' },
        { 条件: Player.V.稀有, 品质: '稀有' },
        { 条件: Player.V.史诗, 品质: '史诗' },
        { 条件: Player.V.传说, 品质: '传说' },
        { 条件: Player.V.神话, 品质: '神话' },
        { 条件: Player.V.远古, 品质: '远古' },
        { 条件: Player.V.不朽, 品质: '不朽' },
    ]

    for (const 检查 of 品质检查) {
        if (检查.条件) {
            if (Array.isArray(检查.品质)) {
                if (检查.品质.some(品质 => AItem.DisplayName.includes(品质))) {
                    return true
                }
            } else if (AItem.DisplayName.includes(检查.品质)) {
                return true
            }
        }
    }
    return false
}
// 不检查条件的装备回收函数 - 专门给回收和一键全部函数使用
function 无条件应该回收装备(AItem: TUserItem): boolean {
    if (!装备类型.includes(AItem.StdMode) || AItem.GetState().GetBind()) {
        return false
    }

    // 检查神器装备（无条件回收时也包括神器）
    if (是神器装备(AItem.DisplayName)) {
        return true
    }

    const 品质列表 = [
        '普通', '精良', '优秀', '稀有', '史诗', '传说', '神话', '远古', '不朽'
    ]

    // 只检查装备品质，不检查玩家设置的条件
    for (const 品质 of 品质列表) {
        if (AItem.DisplayName.includes(品质)) {
            return true
        }
    }

    return false
}

// 执行回收逻辑
function 执行回收逻辑(Player: TPlayObject, 装备列表: TUserItem[], 检查词条: boolean = true): { 数量: number, 金币数量: number, 神器元宝: number } {
    let 数量 = 0;
    let 金币数量 = 0;
    let 神器元宝 = 0;
    let 保留数量 = 0;
    let 不符合品质数量 = 0;

    // 初始化技能伤害选择模块
    try {
        if (技能伤害选择.初始化) {
            技能伤害选择.初始化(Player);
        }
    } catch (e) {
        console.log("技能伤害选择模块初始化失败:", e);
    }

    for (let I = 装备列表.length - 1; I >= 0; I--) {
        const AItem = 装备列表[I];

        // 检查装备品质是否符合回收条件
        if (!应该回收装备(AItem, Player)) {
            不符合品质数量++;
            continue;
        }

        // 如果勾选了神器，优先执行筛选（词条保留功能），然后进行神器回收
        if (Player.V.神器 && 是神器装备(AItem.DisplayName)) {
            // 检查词条保留（如果启用）
            if (检查词条) {
                const 属性 = 解析装备属性(AItem, Player);

                if (!检查词条保留(属性, Player, AItem)) {
                    保留数量++;
                    continue; // 词条检查不通过，保留装备
                }
            }

            // 执行神器回收
            const 倍数 = 解析神器倍数(AItem.DisplayName);
            if (倍数 > 0) {
                数量++;
                神器元宝 += 倍数 * Math.floor(Player.V.回收元宝倍率 / 100);
                
                // ✅ 实时清理：装备回收时立即清理其信息缓存
                try {
                    const 装备标识 = `${AItem.GetName()}_${Date.now()}`;
                    const 装备描述 = AItem.GetCustomDesc();
                    
                    // 清理装备JSON缓存
                    if (装备描述 && 装备描述.length > 0) {
                        // 这里可以清理装备JSON缓存中的条目
                        // 由于装备JSON缓存是私有的，我们在这里记录清理信息
                        // console.log(`🗑️ [神器回收]清理装备信息: ${装备标识}`);
                    }
                } catch (cleanupError) {
                    console.log(`❌ [神器回收]清理装备信息出错: ${cleanupError}`);
                }
                
                Player.DeleteItem(AItem);
                continue;
            }
        }

        // 普通装备回收逻辑
        if (!是神器装备(AItem.DisplayName)) {
            // 检查词条保留
            if (检查词条) {
                const 属性 = 解析装备属性(AItem, Player);

                if (!检查词条保留(属性, Player, AItem)) {
                    保留数量++;
                    continue; // 词条检查不通过，保留装备
                }
            }

            数量++;
            金币数量 += 获取装备品质价格(AItem.DisplayName);
            
            // ✅ 实时清理：装备回收时立即清理其信息缓存
            try {
                const 装备标识 = `${AItem.GetName()}_${Date.now()}`;
                const 装备描述 = AItem.GetCustomDesc();
                
                // 清理装备JSON缓存和相关信息
                if (装备描述 && 装备描述.length > 0) {
                    // console.log(`🗑️ [普通回收]清理装备信息: ${装备标识}`);
                }
            } catch (cleanupError) {
                console.log(`❌ [普通回收]清理装备信息出错: ${cleanupError}`);
            }
            
            Player.DeleteItem(AItem);
        }
    }

    return { 数量, 金币数量, 神器元宝 };
}

// 不检查条件的回收逻辑 - 专门给回收和一键全部函数使用
function 无条件执行回收逻辑(Player: TPlayObject, 装备列表: TUserItem[]): { 数量: number, 金币数量: number, 神器元宝: number } {
    let 数量 = 0;
    let 金币数量 = 0;
    let 神器元宝 = 0;
    let 不符合条件数量 = 0;

    for (let I = 装备列表.length - 1; I >= 0; I--) {
        const AItem = 装备列表[I];

        // 只检查装备类型和是否绑定，不检查任何词条保留条件
        if (!无条件应该回收装备(AItem)) {
            不符合条件数量++;
            continue;
        }

        // 处理神器装备
        if (是神器装备(AItem.DisplayName)) {
            const 倍数 = 解析神器倍数(AItem.DisplayName);
            if (倍数 > 0) {
                数量++;
                神器元宝 += 倍数 * Math.floor(Player.V.回收元宝倍率 / 100);
                
                // ✅ 实时清理：无条件神器回收时立即清理装备信息缓存
                try {
                    const 装备标识 = `${AItem.GetName()}_${Date.now()}`;
                    const 装备描述 = AItem.GetCustomDesc();
                    if (装备描述 && 装备描述.length > 0) {
                        // console.log(`🗑️ [无条件神器回收]清理装备信息: ${装备标识}`);
                    }
                } catch (cleanupError) {
                    console.log(`❌ [无条件神器回收]清理装备信息出错: ${cleanupError}`);
                }
                
                Player.DeleteItem(AItem);
                continue;
            }
        }

        // 处理普通装备
        数量++;
        金币数量 += 获取装备品质价格(AItem.DisplayName);
        
        // ✅ 实时清理：无条件普通回收时立即清理装备信息缓存
        try {
            const 装备标识 = `${AItem.GetName()}_${Date.now()}`;
            const 装备描述 = AItem.GetCustomDesc();
            if (装备描述 && 装备描述.length > 0) {
                // console.log(`🗑️ [无条件普通回收]清理装备信息: ${装备标识}`);
            }
        } catch (cleanupError) {
            console.log(`❌ [无条件普通回收]清理装备信息出错: ${cleanupError}`);
        }
        
        Player.DeleteItem(AItem);
    }

    return { 数量, 金币数量, 神器元宝 };
}

// 计算最终金币数量
function 计算最终金币数量(基础元宝: number, Player: TPlayObject): number {
    const 倍数 = 获取回收倍数(Player)
    const 价格倍率 = 获取会员价格倍率(Player.V.会员等级)
    const 新区倍数 = GameLib.V.判断新区 ? 1.5 : 3
    return Math.round(基础元宝 * 倍数 * 价格倍率 * 新区倍数)
}

// 生成UI字符串
function 生成UI字符串(Player: TPlayObject, 模板: string): string {
    const 图标映射 = {
        '普通': Player.V.普通 ? '31' : '30',
        '精良': Player.V.精良 ? '31' : '30',
        '优秀': Player.V.优秀 ? '31' : '30',
        '稀有': Player.V.稀有 ? '31' : '30',
        '史诗': Player.V.史诗 ? '31' : '30',
        '传说': Player.V.传说 ? '31' : '30',
        '神话': Player.V.神话 ? '31' : '30',
        '远古': Player.V.远古 ? '31' : '30',
        '不朽': Player.V.不朽 ? '31' : '30',
        '神器': Player.V.神器 ? '31' : '30',
        '混沌': Player.V.混沌 ? '31' : '30',
        '底材': Player.V.底材 ? '31' : '30',
        '首饰': Player.V.首饰 ? '31' : '30',
        '时装': Player.V.时装 ? '31' : '30',
        '自动回收': Player.V.自动回收 ? '31' : '30',
        '自动拾取': Player.V.自动拾取 ? '31' : '30',
        '自动吃元宝': Player.V.自动吃元宝 ? '31' : '30',
        '屏蔽掉落': Player.V.屏蔽掉落 ? '31' : '30',
        '伤害屏蔽': Player.V.伤害屏蔽 ? '31' : '30',
        '怪物变异': Player.V.怪物变异 ? '31' : '30',
        '材料入仓': Player.V.材料入仓 ? '31' : '30',
        '自动随机': Player.V.自动随机 ? '31' : '30',
        '回收屏蔽': Player.V.回收屏蔽 ? '31' : '30',
        '葫芦屏蔽': Player.V.葫芦屏蔽 ? '31' : '30',
        '自动吃等级丹': Player.V.自动吃等级丹 ? '31' : '30',
        '自动吃圣墟点数': Player.V.自动吃圣墟点数 ? '31' : '30',
    }

    let 结果 = 模板
    for (const [键, 值] of Object.entries(图标映射)) {
        结果 = ReplaceStr(结果, `$${键}$`, 值)
    }

    return 结果
}

// 初始化玩家变量
function 初始化玩家变量(Player: TPlayObject): void {
    // 初始化自动功能相关变量
    Player.V.自动吃元宝 ??= false
    Player.V.自动吃等级丹 ??= false
    Player.V.自动吃圣墟点数 ??= false
    Player.V.葫芦屏蔽 ??= false

    Player.V.屏蔽掉落 ??= false
    Player.V.伤害屏蔽 ??= false
    Player.V.怪物变异 ??= false
    Player.V.材料入仓 ??= false
    Player.V.自动随机 ??= false
    Player.V.自动随机秒数 ??= 0
    Player.V.自动回收 ??= false
    Player.V.自动拾取 ??= false
    Player.V.回收屏蔽 ??= false
    Player.V.首饰 ??= 0
    Player.V.时装 ??= false

    // 初始化品质相关变量
    Player.V.普通 ??= false
    Player.V.精良 ??= false
    Player.V.优秀 ??= false
    Player.V.稀有 ??= false
    Player.V.史诗 ??= false
    Player.V.传说 ??= false
    Player.V.神话 ??= false
    Player.V.远古 ??= false
    Player.V.不朽 ??= false
    Player.V.混沌 ??= false
    Player.V.底材 ??= false
    Player.V.神器 ??= false

    // 初始化词条相关变量
    Player.V.主属性词条 ??= false
    Player.V.本职业属性词条 ??= false
    Player.V.本职业属性词条数值 ??= '0'
    Player.V.防御词条 ??= false
    Player.V.防御词条数值 ??= '0'
    Player.V.血量词条 ??= false
    Player.V.血量词条数值 ??= '0'
    Player.V.倍攻词条 ??= false
    Player.V.倍攻词条数值 ??= '0'
    Player.V.技能伤害词条 ??= false
    Player.V.技能伤害词条数值 ??= '0'
    Player.V.攻速魔速词条 ??= false
    Player.V.攻速魔速词条数值 ??= 0
    Player.V.吸血比例词条 ??= false
    Player.V.吸血比例词条数值 ??= 0
    Player.V.回收元宝倍率 ??= 100




}

export function Main(Npc: TNormNpc, Player: TPlayObject): void {  //装备回收
    // 初始化玩家变量
    初始化玩家变量(Player)

    const 基础价格 = 200
    const 价格 = 获取会员价格倍率(Player.V.会员等级)
    const 倍数 = 获取回收倍数(Player)
    const 新区倍数 = GameLib.V.判断新区 ? 1.5 : 3
    const 回收价格 = 基础价格 * 价格 * 倍数 * 新区倍数

    /*
             <{S=混沌;C=150;HINT=回收价格${Math.round(50 *回收价格)}金币;X=150;Y=125}/@_ITEM_zbhs.回收(混沌)>   <{I=$混沌$;F=装备图标.DATA;OX=-10;Y=125}/@_ITEM_zbhs.勾选(混沌)>
             <{S=底材;C=150;HINT=回收价格${Math.round(2 *回收价格)}金币;X=250;Y=125}/@_ITEM_zbhs.回收(底材)>   <{I=$底材$;F=装备图标.DATA;OX=-10;Y=125}/@_ITEM_zbhs.勾选(底材)>
             <{S=首饰;C=150;HINT=首饰不区分品质,回收价格为固定${Math.round(5 *回收价格)}金币;X=350;Y=125}/@_ITEM_zbhs.回收(艾维)>   <{I=$首饰$;F=装备图标.DATA;OX=-10;Y=125}/@_ITEM_zbhs.勾选(首饰)>\\
             <{S=时装;C=150;HINT=时装不区分品质,回收价格为固定${Math.round(5 *回收价格)}金币;X=50;Y=155}/@_ITEM_zbhs.回收(时装)>   <{I=$时装$;F=装备图标.DATA;OX=-10;Y=155}/@_ITEM_zbhs.勾选(时装)>\\
    
    */

    const S = `\\
        {S=您当前的回收倍率:;C=154;x=50;Y=40}{S=${新区倍数}倍;C=151;Ox=5;Y=40}{S=*;C=154;OX=5;Y=40}{S=${Player.V.回收元宝倍率}%;C=151;OX=5;Y=40} {S=新区所有装备3倍回收,目前回收为${新区倍数}倍;C=255;OX=10;Y=40}\\
         <{S=普通;C=150;HINT=回收价格${Math.round(1 * 回收价格)}金币;X=50;Y=65}/@_ITEM_zbhs.回收(普通)>   <{I=$普通$;F=装备图标.DATA;OX=-10;Y=65}/@_ITEM_zbhs.勾选(普通)>\\
         <{S=精良;C=150;HINT=回收价格${Math.round(2 * 回收价格)}金币;X=150;Y=65}/@_ITEM_zbhs.回收(精良)>   <{I=$精良$;F=装备图标.DATA;OX=-10;Y=65}/@_ITEM_zbhs.勾选(精良)>\\
         <{S=优秀;C=150;HINT=回收价格${Math.round(3 * 回收价格)}金币;X=250;Y=65}/@_ITEM_zbhs.回收(优秀)>   <{I=$优秀$;F=装备图标.DATA;OX=-10;Y=65}/@_ITEM_zbhs.勾选(优秀)>\\
         <{S=稀有;C=150;HINT=回收价格${Math.round(4 * 回收价格)}金币;X=50;Y=105}/@_ITEM_zbhs.回收(稀有)>   <{I=$稀有$;F=装备图标.DATA;OX=-10;Y=105}/@_ITEM_zbhs.勾选(稀有)>\\
         <{S=史诗;C=150;HINT=回收价格${Math.round(6 * 回收价格)}金币;X=150;Y=105}/@_ITEM_zbhs.回收(史诗)>   <{I=$史诗$;F=装备图标.DATA;OX=-10;Y=105}/@_ITEM_zbhs.勾选(史诗)>\\
         <{S=传说;C=150;HINT=回收价格${Math.round(10 * 回收价格)}金币;X=250;Y=105}/@_ITEM_zbhs.回收(传说)>   <{I=$传说$;F=装备图标.DATA;OX=-10;Y=105}/@_ITEM_zbhs.勾选(传说)>\\
         <{S=神话;C=150;HINT=回收价格${Math.round(20 * 回收价格)}金币;X=50;Y=145}/@_ITEM_zbhs.回收(神话)>   <{I=$神话$;F=装备图标.DATA;OX=-10;Y=145}/@_ITEM_zbhs.勾选(神话)>
         <{S=远古;C=150;HINT=回收价格${Math.round(40 * 回收价格)}金币;X=150;Y=145}/@_ITEM_zbhs.回收(远古)>   <{I=$远古$;F=装备图标.DATA;OX=-10;Y=145}/@_ITEM_zbhs.勾选(远古)>
         <{S=不朽;C=150;HINT=回收价格${Math.round(100 * 回收价格)}金币;X=250;Y=145}/@_ITEM_zbhs.回收(不朽)>   <{I=$不朽$;F=装备图标.DATA;OX=-10;Y=145}/@_ITEM_zbhs.勾选(不朽)>
         <{S=神器;C=150;HINT=回收相应倍数 * 回收比例1/100的元宝;X=50;Y=185}/@_ITEM_zbhs.回收(神器)>   <{I=$神器$;F=装备图标.DATA;OX=-10;Y=185}/@_ITEM_zbhs.勾选(神器)>\\

        {S=自动拾取;C=9;HINT=沙巴克捐献50以下为4格拾取#92捐献50以上或者宣传10次以上为12格拾取;X=350;Y=65} <{I=$自动拾取$;F=装备图标.DATA;OX=-5;Y=65}/@_ITEM_zbhs.勾选(自动拾取)>   
        {S=自动回收;C=9;HINT=领取宣传即可开启;X=350;Y=105} <{I=$自动回收$;F=装备图标.DATA;OX=-5;Y=105}/@_ITEM_zbhs.勾选(自动回收)>
        <{S=开始回收;X=350;Y=145}/@_ITEM_zbhs.回收装备>

        <{S=技能选择;HINT=技能伤害词条保留;X=50;Y=225}/@技能伤害选择.Main>
        <{S=词条保留功能;HINT=50充值以上开启此功能;OX=10;Y=225}/@_ITEM_zbhs.词条保留>
        <{S=一键回收全部装备;OX=10;Y=225}/@_ITEM_zbhs.一键全部>\\\\
                     \\
        <{S=自动随机;C=9;X=50;Y=290;Hint=输入数值后开启挂机将自动按照秒数随机#92关闭挂机同时关闭自动随机#92玩家受到伤害5秒内将无法进行随机#92CTRL+Z开启/关闭挂机#92当前自动随机时间:${Player.V.自动随机秒数}秒}/@@_ITEM_zbhs.InPutInteger20(按秒执行，请输入1-3600的数值)> <{I=$自动随机$;F=装备图标.DATA;OX=-2;Y=290}/@_ITEM_zbhs.勾选(自动随机)>
        
        <{S=屏蔽掉落;C=31;X=400;Y=290}/@_ITEM_zbhs.信息屏蔽>
        {S=变异取消;C=9;X=150;Y=290} <{I=$怪物变异$;F=装备图标.DATA;OX=-2;Y=290}/@_ITEM_zbhs.勾选(怪物变异)>
        {S=材料入仓;C=9;X=250;Y=290} <{I=$材料入仓$;F=装备图标.DATA;OX=-2;Y=290}/@_ITEM_zbhs.勾选(材料入仓)>
    `
    // {S=伤害屏蔽;C=9;X=250;Y=290} <{I=$伤害屏蔽$;F=装备图标.DATA;OX=-2;Y=290}/@_ITEM_zbhs.勾选(伤害屏蔽)>
    // {S=变异取消;C=9;X=350;Y=290} <{I=$怪物变异$;F=装备图标.DATA;OX=-2;Y=290}/@_ITEM_zbhs.勾选(怪物变异)>
    // <{S=清理背包;HINT=会清空背包内所有装备!!!仅测试时使用;X=50;Y=240}/@_ITEM_zbhs.清理背包>
    const M = 生成UI字符串(Player, S)
    Npc.SayEx(Player, 'NPC大窗口', M)
}

export function 信息屏蔽(Npc: TNormNpc, Player: TPlayObject): void {
    const S = `\\
        {S=掉落屏蔽;C=9;X=50;Y=50}      <{I=$屏蔽掉落$;F=装备图标.DATA;OX=-2;Y=50}/@_ITEM_zbhs.勾选2(屏蔽掉落)>
        {S=伤害屏蔽;C=9;X=50;Y=80}      <{I=$伤害屏蔽$;F=装备图标.DATA;OX=-2;Y=80}/@_ITEM_zbhs.勾选2(伤害屏蔽)>
        {S=回收屏蔽;C=9;X=50;Y=110}      <{I=$回收屏蔽$;F=装备图标.DATA;OX=-2;Y=110}/@_ITEM_zbhs.勾选2(回收屏蔽)>
        {S=葫芦屏蔽;C=9;X=50;Y=140}      <{I=$葫芦屏蔽$;F=装备图标.DATA;OX=-2;Y=140}/@_ITEM_zbhs.勾选2(葫芦屏蔽)>
        {S=自动吃等级丹;C=9;X=50;Y=170}  <{I=$自动吃等级丹$;F=装备图标.DATA;OX=-2;Y=170}/@_ITEM_zbhs.勾选2(自动吃等级丹)>
        {S=自动吃圣墟点;C=9;X=50;Y=200}  <{I=$自动吃圣墟点数$;F=装备图标.DATA;OX=-2;Y=200}/@_ITEM_zbhs.勾选2(自动吃圣墟点数)>

            `

    const M = 生成UI字符串(Player, S)
    Npc.SayEx(Player, 'NPC小窗口', M)

}

export function 勾选2(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //装备勾选
    初始化玩家变量(Player)
    const 种类 = Args.Str[0]
    // if (种类 == '自动回收' && !(Player.V.宣传奖励)) {
    //     Player.MessageBox(`未领取宣传奖励,无法使用自动回收功能!`)
    //     return
    // }
    Player.V[种类] = !Player.V[种类]
    信息屏蔽(Npc, Player)
    // console.log(Player.V.怪物变异)
}
export function 勾选(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //装备勾选
    初始化玩家变量(Player)
    const 种类 = Args.Str[0]
    // if (种类 == '自动回收' && !(Player.V.宣传奖励)) {
    //     Player.MessageBox(`未领取宣传奖励,无法使用自动回收功能!`)
    //     return
    // }
    Player.V[种类] = !Player.V[种类]
    Main(Npc, Player)
    // console.log(Player.V.怪物变异)
}

export function InPutInteger20(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 随机时间 = Args.Int[0]
    if (随机时间 < 1 || 随机时间 > 3600) {
        Player.MessageBox(`请输入1-3600之间的数值`)
        return
    }
    Player.V.自动随机秒数 = 随机时间
    Player.SendMessage(`设置成功,开启挂机后每${随机时间}秒将进行随机一次!`, 1)
}

export function 词条保留(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    if (!(Player.V.真实充值 >= 50)) {
        Player.MessageBox(`充值50元以上,才能使用词条保留功能!`)
        return
    }
    // 初始化词条相关变量
    初始化玩家变量(Player)

    // 格式化词条数值显示
    const 格式化词条数值 = (数值: number): string => {
        if (数值 === 0) return '0 * 0位'
        const 位数 = Math.floor(Math.log10(数值))
        const 系数 = Math.floor(数值 / Math.pow(10, 位数))
        return `${系数} * ${位数}位`
    }

    const 计算位数 = (num: string) => num.toString().replace(/\.\d+/, '').length

    const 防御 = 大数值整数简写(Player.V.防御词条数值)
    const 生命 = 大数值整数简写(Player.V.血量词条数值)
    const 职业属性 = 大数值整数简写(Player.V.本职业属性词条数值)

    const 魔法 = 大数值整数简写(Player.V.魔法词条数值)
    const 道术 = 大数值整数简写(Player.V.道术词条数值)
    const 刺术 = 大数值整数简写(Player.V.刺术词条数值)
    const 射术 = 格式化词条数值(Player.V.射术词条数值)
    const 武术 = 格式化词条数值(Player.V.武术词条数值)
    const 所有属性 = 格式化词条数值(Player.V.属性词条数值)
    const 倍攻 = 大数值整数简写(Player.V.倍攻词条数值)
    const 种族属性 = 格式化词条数值(Player.V.种族词条数值)
    const 装备星级 = 格式化词条数值(Player.V.装备星星词条数值)
    const 技能伤害 = 大数值整数简写(Player.V.技能伤害词条数值)

    const S = `\\
{S=基础属性保留(攻击即为主属性);C=154;X=25;Y=33}

<{I=$血量$;F=装备图标.DATA;X=25;Y=65}/@_ITEM_zbhs.勾选1(血量词条)> {S=血量 : ${生命};OX=3;Y=65}  {S=${计算位数(Player.V.血量词条数值)}位;X=250;Y=65} <{M=212,212,213;F=Prguse.wzl;X=320;Y=68}/@_ITEM_zbhs.属性加(血量词条数值)><{M=214,214,215;F=Prguse.wzl;X=350;Y=68}/@_ITEM_zbhs.属性减(血量词条数值)><{S=设置数值;X=400;Y=65}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收#92输入格式:数值*位数 或者 数值,血量词条数值)>\\
<{I=$防御$;F=装备图标.DATA;X=25;Y=100}/@_ITEM_zbhs.勾选1(防御词条)> {S=防御 : ${防御};OX=3;Y=100}  {S=${计算位数(Player.V.防御词条数值)}位;X=250;Y=100} <{M=212,212,213;F=Prguse.wzl;X=320;Y=103}/@_ITEM_zbhs.属性加(防御词条数值)><{M=214,214,215;F=Prguse.wzl;X=350;Y=103}/@_ITEM_zbhs.属性减(防御词条数值)><{S=设置数值;X=400;Y=100}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收#92输入格式:数值*位数 或者 数值,防御词条数值)>\\
<{I=$主属性$;F=装备图标.DATA;X=25;Y=135}/@_ITEM_zbhs.勾选1(主属性词条)> {S=攻击 : ${职业属性};OX=3;Y=135}  {S=${计算位数(Player.V.本职业属性词条数值)}位;X=250;Y=135} <{M=212,212,213;F=Prguse.wzl;X=320;Y=138}/@_ITEM_zbhs.属性加(本职业属性词条数值)><{M=214,214,215;F=Prguse.wzl;X=350;Y=138}/@_ITEM_zbhs.属性减(本职业属性词条数值)><{S=设置数值;X=400;Y=135}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收#92输入格式:数值*位数 或者 数值,本职业属性词条数值)>\\

{S=词条属性保留;C=125;X=25;Y=170}
<{I=$技能伤害$;F=装备图标.DATA;X=25;Y=210}/@_ITEM_zbhs.勾选1(技能伤害词条)> {S=技能伤害 : ${技能伤害};OX=3;Y=210}  {S=${计算位数(Player.V.技能伤害词条数值)}位;X=250;Y=210} <{M=212,212,213;F=Prguse.wzl;X=320;Y=213}/@_ITEM_zbhs.属性加(技能伤害词条数值)><{M=214,214,215;F=Prguse.wzl;X=350;Y=213}/@_ITEM_zbhs.属性减(技能伤害词条数值)><{S=设置数值;X=400;Y=210}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收#92输入格式:数值*位数 或者 数值,技能伤害词条数值)>\\
<{I=$倍攻$;F=装备图标.DATA;X=25;Y=245}/@_ITEM_zbhs.勾选1(倍攻词条)> {S=技能倍攻 : ${倍攻};HINT=默认保留所有倍功;OX=3;Y=245}  {S=${计算位数(Player.V.倍攻词条数值)}位;X=250;Y=245}   <{S=设置数值;X=400;Y=245}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收#92输入格式:数值*位数 或者 数值,倍攻词条数值)>\\

<{S=开始回收;X=25;Y=285}/@_ITEM_zbhs.回收装备>          <{S=技能选择;HINT=技能伤害词条保留;X=150;Y=285}/@技能伤害选择.Main>   <{I=$本职业属性$;F=装备图标.DATA;X=250;Y=285}/@_ITEM_zbhs.勾选1(本职业属性词条)> {S=只保留本职业属性;C=215;X=280;Y=285;HINT=#123S#61如果勾选本职业属性保留#44那么无论是否勾选攻击,都会默认保留本职业主属性高于攻击设置数值的装备!!!#59C#61249#125} <{S=返回;X=425;Y=285}/@_ITEM_zbhs.Main>
`
    const 词条图标映射 = {
        '主属性': Player.V.主属性词条 ? '31' : '30',
        '本职业属性': Player.V.本职业属性词条 ? '31' : '30',
        '防御': Player.V.防御词条 ? '31' : '30',
        '血量': Player.V.血量词条 ? '31' : '30',
        '倍攻': Player.V.倍攻词条 ? '31' : '30',
        '技能伤害': Player.V.技能伤害词条 ? '31' : '30',
        '攻击': Player.V.攻击词条 ? '31' : '30',
    }

    let M = S
    for (const [键, 值] of Object.entries(词条图标映射)) {
        M = ReplaceStr(M, `$${键}$`, 值)
    }

    Npc.SayEx(Player, 'NPC中窗口', M)
}

export function 勾选1(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //装备勾选
    const 种类 = Args.Str[0]
    Player.V[种类] = !Player.V[种类]
    词条保留(Npc, Player, Args)
}

export function 属性加(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //装备勾选
    const 词条 = Args.Str[0]
    Player.V[词条] = js_number(Player.V[词条], '10000', 3)
    词条保留(Npc, Player, Args)
}

export function 属性减(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //装备勾选
    const 词条 = Args.Str[0]
    Player.V[词条] = js_number(Player.V[词条], '10000', 4)
    词条保留(Npc, Player, Args)

}

export function InPutString(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 数值 = Args.Str[1]
    const 词条 = Args.Str[0]

    // 检查是否为 "数字*数字" 格式（如 10*32 表示10后面32个0）
    if (数值.includes('*')) {
        const parts = 数值.split('*')
        if (parts.length === 2) {
            const 基数 = parts[0]
            const 零的个数 = parseInt(parts[1])
            if (!isNaN(零的个数) && 零的个数 >= 0) {
                数值 = 基数 + '0'.repeat(零的个数)
            }
        }
    }

    Player.V[词条] = 数值

    词条保留(Npc, Player, Args)
}

export function 回收(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    初始化玩家变量(Player)
    const 品质 = Args.Str[0] === '阿拉贡' ? '阿拉贡' : Args.Str[0] === '艾维' ? '艾维' : Args.Str[0] === '神器' ? '[神器]' : '[' + Args.Str[0] + ']'

    // 获取玩家背包中的所有装备
    const 装备列表: TUserItem[] = []
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        const AItem = Player.GetBagItem(I)
        if (装备类型.includes(AItem.StdMode) && AItem.GetState().GetBind() == false && AItem.DisplayName.includes(品质)) {
            装备列表.push(AItem)
        }
    }

    // 使用无条件执行回收逻辑，不检查玩家设置的条件
    const { 数量, 金币数量, 神器元宝 } = 无条件执行回收逻辑(Player, 装备列表)

    let 消息 = '';
    let 有收益 = false;

    if (金币数量 > 0) {
        const 最终金币 = 计算最终金币数量(金币数量, Player)
        Player.SetGold(Player.GetGold() + 最终金币)
        Player.GoldChanged()
        消息 += `获得{S=${最终金币};C=253}枚金币`;
        有收益 = true;
    }

    if (神器元宝 > 0) {
        Player.SetGameGold(Player.GetGameGold() + 神器元宝);
        Player.GoldChanged();
        if (有收益) {
            消息 += `，`;
        }
        消息 += `获得{S=${神器元宝};C=251}元宝`;
        有收益 = true;
    }

    if (有收益 && Player.V.回收屏蔽) {
        Player.SendMessage(`回收了{S=${数量};C=154}件装备，${消息}!`, 1);
        console.log(`回收了${数量}件装备，${消息}! 回收屏蔽:${Player.V.回收屏蔽}`)
    }
    // console.log(`品质:${品质} 数量:${数量} 金币数量:${金币数量} 神器元宝:${神器元宝}`)
}

export function 一键全部(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    初始化玩家变量(Player)
    // 获取玩家背包中的所有装备
    const 装备列表: TUserItem[] = []
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        const AItem = Player.GetBagItem(I)
        if (装备类型.includes(AItem.StdMode) && AItem.GetState().GetBind() == false) {
            装备列表.push(AItem)
        }
    }

    // 使用无条件执行回收逻辑，不检查玩家设置的条件
    const { 数量, 金币数量, 神器元宝 } = 无条件执行回收逻辑(Player, 装备列表)

    let 消息 = '';
    let 有收益 = false;

    if (金币数量 > 0) {
        const 最终金币 = 计算最终金币数量(金币数量, Player)
        Player.SetGold(Player.GetGold() + 最终金币)
        Player.GoldChanged()
        消息 += `获得{S=${最终金币};C=253}枚金币`;
        有收益 = true;
    }

    if (神器元宝 > 0) {
        Player.SetGameGold(Player.GetGameGold() + 神器元宝);
        Player.GoldChanged();
        if (有收益) {
            消息 += `，`;
        }
        消息 += `获得{S=${神器元宝};C=251}元宝`;
        有收益 = true;
    }

    if (有收益 && !Player.V.回收屏蔽) {
        Player.SendMessage(`回收了{S=${数量};C=154}件装备，${消息}!`, 1);
    }
}

export function 回收装备(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    初始化玩家变量(Player)

    // 获取玩家背包中的所有装备
    const 装备列表: TUserItem[] = []
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        const AItem = Player.GetBagItem(I)
        if (装备类型.includes(AItem.StdMode) && AItem.GetState().GetBind() == false) {
            装备列表.push(AItem)
        }
    }

    // 如果没有找到任何符合条件的装备，直接返回
    if (装备列表.length === 0) {
        // Player.SendMessage(`背包中没有找到可回收的装备!`, 1)
        return
    }

    const { 数量, 金币数量, 神器元宝 } = 执行回收逻辑(Player, 装备列表)

    let 消息 = '';
    let 有收益 = false;

    if (金币数量 > 0) {
        const 最终金币 = 计算最终金币数量(金币数量, Player)
        Player.SetGold(Player.GetGold() + 最终金币)
        Player.GoldChanged()
        消息 += `获得{S=${最终金币};C=253}枚金币`;
        有收益 = true;
    }

    if (神器元宝 > 0) {
        Player.SetGameGold(Player.GetGameGold() + 神器元宝);
        Player.GoldChanged();
        if (有收益) {
            消息 += `，`;
        }
        消息 += `获得{S=${神器元宝};C=251}元宝`;
        有收益 = true;
    }

    if (有收益 && !Player.V.回收屏蔽) {
        Player.SendMessage(`回收了{S=${数量};C=154}件装备，${消息}!`, 1);
    }
}

export function 清理词条装备(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    初始化玩家变量(Player)
    // 获取玩家背包中的所有装备
    const 装备列表: TUserItem[] = []
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        const AItem = Player.GetBagItem(I)
        if (装备类型.includes(AItem.StdMode) && AItem.GetState().GetBind() == false) {
            装备列表.push(AItem)
        }
    }

    const { 数量, 金币数量, 神器元宝 } = 执行回收逻辑(Player, 装备列表, false)

    let 消息 = '';
    let 有收益 = false;

    if (金币数量 > 0) {
        const 最终金币 = 计算最终金币数量(金币数量, Player)
        Player.SetGold(Player.GetGold() + 最终金币)
        Player.GoldChanged()
        消息 += `获得{S=${最终金币};C=253}枚金币`;
        有收益 = true;
    }

    if (神器元宝 > 0) {
        Player.SetGameGold(Player.GetGameGold() + 神器元宝);
        Player.GoldChanged();
        if (有收益) {
            消息 += `，`;
        }
        消息 += `获得{S=${神器元宝};C=251}元宝`;
        有收益 = true;
    }

    if (有收益 && !Player.V.回收屏蔽) {
        Player.SendMessage(`回收了{S=${数量};C=154}件装备，${消息}!`, 1);
    }
}


// 导出用于怪物掉落装备回收检查的函数
export function 检查装备回收(装备: TUserItem, Player: TPlayObject): { 应该回收: boolean, 应该保留: boolean, 回收类型: string } {
    // 检查装备类型
    if (!装备类型.includes(装备.StdMode) || 装备.GetState().GetBind()) {
        return { 应该回收: false, 应该保留: false, 回收类型: '不符合回收条件' };
    }
    
    // 检查是否符合基本回收条件
    if (!应该回收装备(装备, Player)) {
        return { 应该回收: false, 应该保留: false, 回收类型: '品质不符合' };
    }
    
    // 解析装备属性
    const 属性 = 解析装备属性(装备, Player);
    
    // 检查词条保留条件
    const 应该保留 = !检查词条保留(属性, Player, 装备);
    
    // 确定回收类型
    let 回收类型 = '普通装备';
    if (是神器装备(装备.DisplayName)) {
        回收类型 = '神器装备';
    }
    
    return {
        应该回收: true,
        应该保留: 应该保留,
        回收类型: 回收类型
    };
}

// 导出计算装备回收价值的函数
export function 计算装备回收价值(装备: TUserItem, Player: TPlayObject): { 价值: number, 货币类型: string } {
    if (是神器装备(装备.DisplayName)) {
        // 神器回收获得元宝
        const 倍数 = 解析神器倍数(装备.DisplayName);
        if (倍数 > 0) {
            const 元宝价值 = 倍数 * Math.floor(Player.V.回收元宝倍率 / 100);
            return { 价值: 元宝价值, 货币类型: '元宝' };
        }
    } else {
        // 普通装备回收获得金币
        const 基础价值 = 获取装备品质价格(装备.DisplayName);
        if (基础价值 > 0) {
            const 最终金币 = 计算最终金币数量(基础价值, Player);
            return { 价值: 最终金币, 货币类型: '金币' };
        }
    }
    
    return { 价值: 0, 货币类型: '无' };
}

export function 清理背包(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let item: TUserItem
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        item = Player.GetBagItem(I);
        if (item.GetName() != '回城石' && item.GetName() != '随机传送石') {
            Npc.Take(Player, item.GetName())
        }
    }
    // Npc.Give(Player, '回城石', 1)
    // Npc.Give(Player, '随机传送石', 1)
}