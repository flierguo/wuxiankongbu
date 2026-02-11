/**
 * 极品斗笠系统
 * 
 * 功能：
 * 1. 合成高级斗笠：3个相同阶数的斗笠合成更高一阶的斗笠
 * 2. 刷新斗笠属性：消耗同等级斗笠刷新极品率（范围：当前值 ~ 阶数*30）
 * 
 * 斗笠列表（StdMode=16）：
 * 『1阶』主神玄笠 ~ 『10阶』破妄清笠
 * 
 * 属性存储：
 * - OutWay1[1] = 极品百分比词条ID（132）
 * - OutWay2[1] = 极品率数值（用于客户端显示）
 * - OutWay3[1] = 极品率数值（用于读取）
 * - CustomDesc = JSON格式属性数据
 */

import { 基础属性第一条, 基础词条 } from '../基础常量'
import { 装备属性统计 } from '../_装备/属性统计'

// ==================== 斗笠配置 ====================
const 斗笠列表 = [
    '『1阶』主神玄笠',
    '『2阶』基因启笠',
    '『3阶』蜂巢隐笠',
    '『4阶』噬疫寒笠',
    '『5阶』舔影追笠',
    '『6阶』轮回战笠',
    '『7阶』念力凝笠',
    '『8阶』狂化怒笠',
    '『9阶』异形御笠',
    '『10阶』破妄清笠',
] as const

// 斗笠名 -> 阶数映射（预计算，避免运行时正则）
const 斗笠阶数表: { [name: string]: number } = {}
for (let i = 0; i < 斗笠列表.length; i++) {
    斗笠阶数表[斗笠列表[i]] = i + 1
}

const 斗笠StdMode = 16

// ==================== 工具函数 ====================

/** 获取斗笠阶数（通过名字查表） */
function 获取斗笠阶数(名字: string): number {
    return 斗笠阶数表[名字] || 0
}

/** 生成斗笠JSON属性 */
function 生成斗笠属性JSON(极品率: number): string {
    return JSON.stringify({
        职业属性_职业: [基础词条.极品百分比],
        职业属性_属性: [String(极品率)]
    })
}

/** 更新斗笠属性 */
function 更新斗笠属性(item: TUserItem, 极品率: number): void {
    item.SetOutWay1(基础属性第一条, 基础词条.极品百分比)
    item.SetOutWay2(基础属性第一条, 极品率)
    item.SetCustomDesc(生成斗笠属性JSON(极品率))
}

/** 获取读取斗笠极品率 */
function 获取斗笠极品率(item: TUserItem): number {
    return item.GetOutWay2(基础属性第一条) || 0
}

/** 遍历背包查找指定阶数的斗笠数量 */
function 统计背包斗笠(Player: TPlayObject, 目标阶数: number): number {
    const 目标名 = 斗笠列表[目标阶数 - 1]
    if (!目标名) return 0
    let 数量 = 0
    for (let i = 0; i < Player.ItemSize; i++) {
        const item = Player.GetBagItem(i)
        if (!item) continue
        if (item.StdMode === 斗笠StdMode && item.DisplayName === 目标名) {
            数量++
        }
    }
    return 数量
}

/** 删除背包中指定阶数的斗笠N个 */
function 删除背包斗笠(Player: TPlayObject, 目标阶数: number, 数量: number): boolean {
    const 目标名 = 斗笠列表[目标阶数 - 1]
    if (!目标名) return false
    let 已删除 = 0
    for (let i = Player.ItemSize - 1; i >= 0 && 已删除 < 数量; i--) {
        const item = Player.GetBagItem(i)
        if (!item) continue
        if (item.StdMode === 斗笠StdMode && item.DisplayName === 目标名) {
            Player.DeleteBagItem(item, 1)
            已删除++
        }
    }
    return 已删除 >= 数量
}

// ==================== 主界面 ====================
export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 统计背包中各阶斗笠数量，生成3列合成按钮
    let 合成列表 = ''
    let Y = 130
    const 列X = [20, 160, 300] // 3列的X坐标
    for (let 阶数 = 1; 阶数 <= 9; 阶数++) {
        const 列 = (阶数 - 1) % 3
        const 数量 = 统计背包斗笠(Player, 阶数)
        const 颜色 = 数量 >= 3 ? 249 : 254
        合成列表 += `<{S=[合成${阶数 + 1}阶 ${数量}/3];C=${颜色};X=${列X[列]};Y=${Y}}/@极品斗笠.合成斗笠(${阶数})>`
        if (列 === 2) Y += 25
    }

    // 刷新属性区域（使用框内物品）
    const 主装备 = Player.GetCustomItem(0)
    const 副装备 = Player.GetCustomItem(1)
    let 主装备信息 = ''
    let 刷新提示 = ''
    if (主装备 && 主装备.StdMode === 斗笠StdMode) {
        const 主阶数 = 获取斗笠阶数(主装备.DisplayName)
        if (主阶数 > 0) {
            const 当前极品率 = 获取斗笠极品率(主装备)
            const 最大极品率 = 主阶数 * 30
            主装备信息 = `${主装备.DisplayName} 极品率:${当前极品率}% / 上限:${最大极品率}%`
            if (副装备 && 副装备.StdMode === 斗笠StdMode) {
                const 副阶数 = 获取斗笠阶数(副装备.DisplayName)
                if (副阶数 === 主阶数) {
                    刷新提示 = `消耗副装备刷新,范围:${当前极品率}~${最大极品率}%`
                } else if (副阶数 > 0) {
                    刷新提示 = '刷新需要同阶斗笠作为材料'
                }
            }
        }
    }

    const S = `
        {S=极品斗笠;C=254;X=200;Y=10}
        {S=规则: 3个相同阶数斗笠合成更高一阶;C=154;X=20;Y=35}
        {S=极品率上限: 阶数×30%;C=154;X=20;Y=55}
        {S=━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━;C=154;X=10;Y=90}
        {S=【合成高级斗笠】;C=251;X=20;Y=105}
        ${合成列表}
        {S=━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━;C=154;X=10;Y=${Y}}
        {S=【刷新斗笠属性】;C=251;X=20;Y=${Y + 20}}
        <{S=[刷新属性];C=254;X=220;Y=${Y + 20}}/@极品斗笠.刷新属性>
        {S=规则: 消耗同阶斗笠刷新极品率(不低于当前值);C=154;X=20;Y=${Y + 42}}
        {S=上框: ${主装备信息 || '未放入斗笠'};C=250;X=20;Y=${Y + 62}}
        {S=${刷新提示};C=249;X=20;Y=${Y + 82}}
    `
    Npc.SayEx(Player, '极品斗笠', S)
}

// ==================== 合成斗笠 ====================
export function 合成斗笠(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 优先用 Int，备用 Str 转换
    let 源阶数 = Args.Int[0]
    if (!源阶数) {
        源阶数 = Number(Args.Str[0]) || 0
    }
    if (源阶数 < 1 || 源阶数 > 9) {
        Player.MessageBox('无效的合成阶数')
        return
    }

    // 检查背包中同阶斗笠数量（需要3个）
    const 背包数量 = 统计背包斗笠(Player, 源阶数)
    if (背包数量 < 3) {
        Player.MessageBox(`背包中${斗笠列表[源阶数 - 1]}不足,需要3个,当前${背包数量}个`)
        return
    }

    // 删除背包中3个同阶斗笠
    if (!删除背包斗笠(Player, 源阶数, 3)) {
        Player.MessageBox('删除材料失败,请重试')
        return
    }

    // 生成新斗笠
    const 新阶数 = 源阶数 + 1
    const 新名字 = 斗笠列表[新阶数 - 1]
    const 新极品率 = 1 + random(新阶数 * 30) // 1 ~ 阶数*30

    const item = Player.GiveItem(新名字)
    if (item) {
        更新斗笠属性(item, 新极品率)
        Player.UpdateItem(item)
    }

    Player.MessageBox(`{S=合成成功！获得 ${新名字} 极品率+ ${新极品率} %;C=251}`)
    Main(Npc, Player, Args)
}

// ==================== 刷新属性 ====================
export function 刷新属性(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 主装备 = Player.GetCustomItem(0)
    const 副装备 = Player.GetCustomItem(1)

    if (!主装备 || 主装备.StdMode !== 斗笠StdMode) {
        Player.MessageBox('请将要刷新的斗笠放入上方框内')
        return
    }
    if (!副装备 || 副装备.StdMode !== 斗笠StdMode) {
        Player.MessageBox('请将材料斗笠放入下方框内')
        return
    }

    const 主阶数 = 获取斗笠阶数(主装备.DisplayName)
    const 副阶数 = 获取斗笠阶数(副装备.DisplayName)

    if (主阶数 <= 0 || 副阶数 <= 0) {
        Player.MessageBox('无法识别斗笠阶数')
        return
    }
    if (主阶数 !== 副阶数) {
        Player.MessageBox('刷新需要同阶斗笠作为材料')
        return
    }

    const 当前极品率 = 获取斗笠极品率(主装备)
    const 最大极品率 = 主阶数 * 30

    if (当前极品率 >= 最大极品率) {
        Player.MessageBox(`极品率已达上限${最大极品率}%,无需刷新`)
        return
    }

    // 消耗副装备
    Player.DeleteItem(副装备)

    // 刷新极品率：范围为 当前值+1 ~ 阶数*30（未满时最少+1）
    const 范围 = 最大极品率 - 当前极品率
    const 新极品率 = 范围 > 1 ? 当前极品率 + 1 + random(范围) : 最大极品率

    // 更新主装备属性
    更新斗笠属性(主装备, 新极品率)
    Player.UpdateItem(主装备)

    const 变化 = 新极品率 - 当前极品率
    Player.MessageBox(`{S=刷新成功！极品率: ${当前极品率}% → ${新极品率}% (${变化 >= 0 ? '+' : ''}${变化}%);C=251}`)
    Main(Npc, Player, Args)
}


// ==================== 自动合成（每1分钟调用） ====================

/**
 * 自动合成斗笠（在RobotManageNpc的个人1分钟中调用）
 * 逻辑：遍历背包，找到3个及以上同阶斗笠时自动合成为更高一阶
 * 从低阶到高阶依次检查，每次合成一个
 */
export function 自动合成斗笠(Player: TPlayObject): void {
    // 从1阶到9阶依次检查（10阶无法继续合成）
    for (let 阶数 = 1; 阶数 <= 9; 阶数++) {
        const 目标名 = 斗笠列表[阶数 - 1]
        if (!目标名) continue

        // 统计背包中该阶数斗笠数量
        let 数量 = 0
        for (let i = 0; i < Player.ItemSize; i++) {
            const item = Player.GetBagItem(i)
            if (!item) continue
            if (item.StdMode === 斗笠StdMode && item.DisplayName === 目标名) {
                数量++
            }
        }

        // 不足3个，跳过
        if (数量 < 3) continue

        // 删除3个同阶斗笠
        let 已删除 = 0
        for (let i = Player.ItemSize - 1; i >= 0 && 已删除 < 3; i--) {
            const item = Player.GetBagItem(i)
            if (!item) continue
            if (item.StdMode === 斗笠StdMode && item.DisplayName === 目标名) {
                Player.DeleteBagItem(item, 1)
                已删除++
            }
        }

        if (已删除 < 3) continue

        // 生成新斗笠
        const 新阶数 = 阶数 + 1
        const 新名字 = 斗笠列表[新阶数 - 1]
        const 新极品率 = 1 + random(新阶数 * 30)

        const item = Player.GiveItem(新名字)
        if (item) {
            更新斗笠属性(item, 新极品率)
            Player.UpdateItem(item)
        }

        Player.SendMessage(`{S=【自动合成】3个${目标名} → ${新名字} 极品率+${新极品率}%;C=251}`, 1)
        // 每次只合成一个，下次再继续
        return
    }
}
