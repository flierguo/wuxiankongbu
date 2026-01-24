/**
 * 捐献排名系统
 * 
 * 功能：
 * - 玩家可捐献背包内指定品质的装备（优秀及以上）
 * - 根据装备魔次获得捐献点
 * - 全服排名前五获得爆率加成：300/200/150/100/50
 */

import { 智能计算, 比较 } from '../../_大数值/核心计算方法'
import { 装备属性统计 } from '../_装备/属性统计'
import { 装备颜色 } from '../基础常量'
import { 大数值整数简写 } from '../字符计算'

// ==================== 类型定义 ====================
interface 装备属性记录 {
    职业属性_职业: number[]
    职业属性_属性: string[]
}

interface 排名数据 {
    玩家名称: string
    捐献点数: string
}

// ==================== 常量配置 ====================
const 可捐献品质 = [
    装备颜色.神器颜色,
    装备颜色.神话颜色,
    装备颜色.传说颜色,
    装备颜色.史诗颜色,
    装备颜色.稀有颜色,
    装备颜色.优秀颜色,
    装备颜色.普通颜色
]

const 有效装备类型 = [5, 6, 10, 11, 15, 16, 19, 20, 21, 22, 23, 24, 26, 27, 28, 68]

// 排名奖励配置（爆率加成%）
const 排名奖励 = [300, 200, 150, 100, 50]

// ==================== 工具函数 ====================

function 获取品质名称(颜色: number): string {
    switch (颜色) {
        case 装备颜色.神器颜色: return '神器'
        case 装备颜色.神话颜色: return '神话'
        case 装备颜色.传说颜色: return '传说'
        case 装备颜色.史诗颜色: return '史诗'
        case 装备颜色.稀有颜色: return '稀有'
        case 装备颜色.优秀颜色: return '优秀'
        case 装备颜色.普通颜色: return '普通'
        default: return '普通'
    }
}

function 检查可捐献(UserItem: TUserItem): boolean {
    if (!有效装备类型.includes(UserItem.StdMode)) return false
    return 可捐献品质.includes(UserItem.Color)
}

function 计算装备魔次(UserItem: TUserItem): string {
    const desc = UserItem.GetCustomDesc()
    if (!desc) return '0'

    try {
        const 属性记录 = JSON.parse(desc) as 装备属性记录
        let 总魔次 = '0'

        for (let i = 0; i < 属性记录.职业属性_职业.length; i++) {
            const 属性ID = 属性记录.职业属性_职业[i]
            const 属性值 = 属性记录.职业属性_属性[i]

            // 魔次属性ID范围: 10001-10040
            if (属性ID >= 10001 && 属性ID <= 10040) {
                总魔次 = 智能计算(总魔次, 属性值, 1)
            }
        }
        return 总魔次
    } catch {
        return '0'
    }
}

// ==================== 排名数据管理（使用GameLib.R全局变量） ====================

function 获取排名数据(): 排名数据[] {
    GameLib.V.捐献排名 ??= []
    return GameLib.V.捐献排名 as 排名数据[]
}

function 更新排名(玩家名称: string, 新增点数: string): void {
    const 排名数据 = 获取排名数据()
    const 索引 = 排名数据.findIndex(item => item.玩家名称 === 玩家名称)

    if (索引 >= 0) {
        排名数据[索引].捐献点数 = 智能计算(排名数据[索引].捐献点数, 新增点数, 1)
    } else {
        排名数据.push({ 玩家名称, 捐献点数: 新增点数 })
    }

    // 按捐献点数降序排序
    排名数据.sort((a, b) => 比较(b.捐献点数, a.捐献点数))

    GameLib.V.捐献排名 = 排名数据
}

function 获取玩家捐献点(Player: TPlayObject): string {
    Player.V.捐献点数 ??= '0'
    return Player.V.捐献点数
}

function 获取玩家排名(玩家名称: string): number {
    const 排名数据 = 获取排名数据()
    const 索引 = 排名数据.findIndex(item => item.玩家名称 === 玩家名称)
    return 索引 >= 0 ? 索引 + 1 : 0
}

// ==================== 爆率加成计算 ====================

/**
 * 计算玩家捐献爆率加成（在属性统计时调用）
 */
export function 计算捐献爆率加成(Player: TPlayObject): number {
    const 玩家名称 = Player.GetName()
    const 排名 = 获取玩家排名(玩家名称)

    if (排名 >= 1 && 排名 <= 5) {
        return 排名奖励[排名 - 1]
    }
    return 0
}

// ==================== 捐献操作 ====================

/**
 * 一键捐献背包所有可捐献装备
 */
function 执行捐献(Player: TPlayObject): { 数量: number, 总点数: string } {
    let 数量 = 0
    let 总点数 = '0'

    for (let i = Player.GetItemSize() - 1; i >= 0; i--) {
        const item = Player.GetBagItem(i)
        if (!item) continue
        if (!检查可捐献(item)) continue

        const 魔次值 = 计算装备魔次(item)
        // 累加魔次值（即使为0也删除装备）
        if (魔次值 !== '0') {
            总点数 = 智能计算(总点数, 魔次值, 1)
        }
        
        Player.DeleteItem(item)
        数量++
    }

    if (数量 > 0) {
        const 玩家名称 = Player.GetName()
        // 更新玩家自身捐献点
        Player.V.捐献点数 = 智能计算(获取玩家捐献点(Player), 总点数, 1)
        // 更新全服排名
        更新排名(玩家名称, 总点数)
    }

    return { 数量, 总点数 }
}

// ==================== 前端UI ====================

/**
 * 捐献排名主界面
 */
export function Main(Npc: TNormNpc, Player: TPlayObject): void {
    const 玩家名称 = Player.GetName()
    const 我的点数 = 获取玩家捐献点(Player)
    const 我的排名 = 获取玩家排名(玩家名称)
    const 我的爆率加成 = 计算捐献爆率加成(Player)
    const 排名数据 = 获取排名数据()

    let str = `\\
        {S=捐献排名系统;C=251;X=180;Y=0}
        {S=捐献装备可获得捐献点，排名前五可获得爆率加成;C=154;X=80;Y=20}
        
        {S=全服排名;C=253;X=50;Y=50}
        {S=排名;C=251;X=50;Y=80}{S=玩家;C=251;X=120;Y=80}{S=捐献点数;C=251;X=250;Y=80}{S=爆率加成;C=251;X=380;Y=80}
    `

    // 显示前5名
    for (let i = 0; i < 5; i++) {
        const y = 110 + i * 30
        const 排名颜色 = i === 0 ? 249 : (i === 1 ? 251 : (i === 2 ? 254 : 255))

        if (i < 排名数据.length) {
            const 数据 = 排名数据[i]
            const 点数显示 = 大数值整数简写(数据.捐献点数)
            str += `{S=第${i + 1}名;C=${排名颜色};X=50;Y=${y}}{S=${数据.玩家名称};C=255;X=120;Y=${y}}{S=${点数显示};HINT=${数据.捐献点数};C=253;X=250;Y=${y}}{S=+${排名奖励[i]}%;C=250;X=380;Y=${y}}\n`
        } else {
            str += `{S=第${i + 1}名;C=${排名颜色};X=50;Y=${y}}{S=虚位以待;C=154;X=120;Y=${y}}{S=--;C=154;X=250;Y=${y}}{S=+${排名奖励[i]}%;C=250;X=380;Y=${y}}\n`
        }
    }

    // 我的信息
    const 我的排名显示 = 我的排名 > 0 ? `第${我的排名}名` : '未上榜'
    const 我的点数显示 = 大数值整数简写(我的点数)

    str += `
        {S=我的信息;C=253;X=50;Y=280}
        {S=当前排名:;C=154;X=50;Y=310}{S=${我的排名显示};C=251;X=120;Y=310}
        {S=捐献点数:;C=154;X=220;Y=310}{S=${我的点数显示};HINT=${我的点数};C=253;X=290;Y=310}
        {S=爆率加成:;C=154;X=50;Y=340}{S=+${我的爆率加成}%;C=250;X=120;Y=340}
        
        <{S=[一键捐献];C=249;X=340;Y=340;HINT=捐献背包内所有优秀及以上品质装备}/@捐献排名.确认捐献>
    \\`

    Npc.SayEx(Player, 'NPC大窗口', str)
}

/**
 * 确认捐献弹窗
 */
export function 确认捐献(Npc: TNormNpc, Player: TPlayObject): void {
    Player.Question(
        '确定要捐献吗？\\\\将捐献背包内所有优秀及以上品质的装备！',
        '捐献排名.执行一键捐献',
        '捐献排名.Main'
    )
}

/**
 * 执行一键捐献
 */
export function 执行一键捐献(Npc: TNormNpc, Player: TPlayObject): void {
    const 结果 = 执行捐献(Player)

    if (结果.数量 === 0) {
        Player.SendMessage('背包内没有可捐献的装备', 1)
    } else {
        Player.SendMessage(`成功捐献${结果.数量}件装备，共获得捐献点: ${大数值整数简写(结果.总点数)}`, 1)
    }
    装备属性统计(Player)
    Main(Npc, Player)
}
