/**
 * 装备回收系统
 * 包含前端UI和后台回收逻辑
 * 
 * 调用方式：
 * 1. 怪物掉落装备后 -> 筛选检查并回收 -> 符合条件入包
 * 2. 点击回收页面的开始回收 -> 检测背包内装备进行回收
 * 
 * 回收价格 = 基础属性翻倍倍率 * Player.R.最终回收倍率
 */

import { 智能计算, 大于等于 } from '../../_大数值/核心计算方法'
import { 基础词条, 装备颜色, 技能魔次, 装备需求等级 } from '../基础常量'
import { 大数值整数简写 } from '../字符计算'

// ==================== 类型定义 ====================
interface 装备属性记录 {
    职业属性_职业: number[]
    职业属性_属性: string[]
}

interface 回收结果 {
    应该回收: boolean
    回收价值: string
    货币类型: '金币' | '元宝'
    保留原因?: string
}

interface 批量回收结果 {
    回收数量: number
    总金币: string
    总元宝: string
}

// 技能魔次名称映射
const 技能魔次名称映射: Record<number, string> = {
    [技能魔次.攻杀剑术]: '攻杀剑术',
    [技能魔次.半月弯刀]: '半月弯刀',
    [技能魔次.雷电术]: '雷电术',
    [技能魔次.暴风雪]: '暴风雪',
    [技能魔次.灵魂火符]: '灵魂火符',
    [技能魔次.飓风破]: '飓风破',
    [技能魔次.暴击术]: '暴击术',
    [技能魔次.霜月]: '霜月',
    [技能魔次.精准箭术]: '精准箭术',
    [技能魔次.万箭齐发]: '万箭齐发',
    [技能魔次.罗汉棍法]: '罗汉棍法',
    [技能魔次.天雷阵]: '天雷阵',
    [技能魔次.天枢]: '天枢技能',
    [技能魔次.血神]: '血神技能',
    [技能魔次.暗影]: '暗影技能',
    [技能魔次.烈焰]: '烈焰技能',
    [技能魔次.正义]: '正义技能',
    [技能魔次.不动]: '不动技能',
    [技能魔次.全体]: '全体魔次',
    [技能魔次.怒斩]: '怒斩',
    [技能魔次.人之怒]: '人之怒',
    [技能魔次.地之怒]: '地之怒',
    [技能魔次.天之怒]: '天之怒',
    [技能魔次.神之怒]: '神之怒',
    [技能魔次.血气献祭]: '血气献祭',
    [技能魔次.血气燃烧]: '血气燃烧',
    [技能魔次.暗影袭杀]: '暗影袭杀',
    [技能魔次.暗影剔骨]: '暗影剔骨',
    [技能魔次.暗影风暴]: '暗影风暴',
    [技能魔次.暗影附体]: '暗影附体',
    [技能魔次.火焰追踪]: '火焰追踪',
    [技能魔次.烈焰护甲]: '烈焰护甲',
    [技能魔次.爆裂火冢]: '爆裂火冢',
    [技能魔次.烈焰突袭]: '烈焰突袭',
    [技能魔次.圣光]: '圣光',
    [技能魔次.行刑]: '行刑',
    [技能魔次.洗礼]: '洗礼',
    [技能魔次.如山]: '如山',
    [技能魔次.金刚掌]: '金刚掌',
}

// ==================== 常量定义 ====================
const 有效装备类型 = [5, 6, 10, 11, 15, 16, 19, 20, 21, 22, 23, 24, 26, 27, 28, 68]

// ==================== 初始化玩家变量 ====================
export function 初始化回收变量(Player: TPlayObject): void {
    // 自动回收开关
    Player.V.自动回收 ??= false
    Player.V.自动拾取 ??= false

    // 品质回收勾选
    Player.V.回收普通 ??= false
    Player.V.回收优秀 ??= false
    Player.V.回收稀有 ??= false
    Player.V.回收史诗 ??= false
    Player.V.回收传说 ??= false
    Player.V.回收神话 ??= false
    Player.V.回收神器 ??= false

    // 词条保留设置
    Player.V.本职勾选 ??= false
    Player.V.攻击勾选 ??= false
    Player.V.攻击数值 ??= '0'
    Player.V.血量勾选 ??= false
    Player.V.血量数值 ??= '0'
    Player.V.防御勾选 ??= false
    Player.V.防御数值 ??= '0'
    Player.V.技能勾选 ??= false
    Player.V.技能数值 ??= '0'

    // 技能魔次选择
    Player.V.已选择技能魔次 ??= [] as number[]

    // 回收倍率
    Player.R.最终回收倍率 ??= 100

    // 回收屏蔽
    Player.V.回收屏蔽 ??= false
}

// ==================== 核心回收逻辑 ====================

/**
 * 获取装备基础翻倍倍率（装备价值）
 * 从装备的 装备需求等级 索引的 OutWay3 位置读取
 */
function 获取装备翻倍倍率(UserItem: TUserItem): number {
    return UserItem.GetOutWay3(装备需求等级) || 1
}

/**
 * 检查装备是否为神器
 */
function 是否神器(UserItem: TUserItem): boolean {
    return UserItem.DisplayName?.includes('[神器]') || false
}

/**
 * 解析神器倍数
 */
function 解析神器倍数(displayName: string): number {
    const match = displayName.match(/\[神器\](\d+)倍/)
    return match ? parseInt(match[1]) : 0
}

/**
 * 获取装备品质
 * 根据装备颜色 btItemExtColor 判断
 */
function 获取装备品质(UserItem: TUserItem): string {
    const 颜色 = UserItem.Color
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

/**
 * 检查品质是否应该回收
 */
function 检查品质回收(Player: TPlayObject, 品质: string): boolean {
    switch (品质) {
        case '普通': return Player.V.回收普通
        case '优秀': return Player.V.回收优秀
        case '稀有': return Player.V.回收稀有
        case '史诗': return Player.V.回收史诗
        case '传说': return Player.V.回收传说
        case '神话': return Player.V.回收神话
        case '神器': return Player.V.回收神器
        default: return false
    }
}

/**
 * 解析装备属性用于词条检查
 */
function 解析装备属性(UserItem: TUserItem): 装备属性记录 | null {
    const desc = UserItem.GetCustomDesc()
    if (!desc) return null

    try {
        return JSON.parse(desc) as 装备属性记录
    } catch {
        return null
    }
}

/**
 * 检查词条保留条件
 * @returns true = 应该保留, false = 可以回收
 */
function 检查词条保留(Player: TPlayObject, UserItem: TUserItem): boolean {
    const 装备属性 = 解析装备属性(UserItem)
    if (!装备属性) return false

    // 本职业检查
    if (Player.V.本职勾选) {
        const 玩家职业 = Player.GetJob()
        const 装备职业 = UserItem.GetJob?.() ?? 98
        if (装备职业 !== 98 && 装备职业 !== 99 && 装备职业 !== 玩家职业) {
            return false // 非本职业装备，不保留
        }
    }

    // 遍历装备属性检查保留条件
    for (let i = 0; i < 装备属性.职业属性_职业.length; i++) {
        const 属性ID = 装备属性.职业属性_职业[i]
        const 属性值 = 装备属性.职业属性_属性[i]

        // 攻击类属性检查 (100-115)
        if (属性ID >= 100 && 属性ID <= 115) {
            if (Player.V.攻击勾选) {
                const 阈值 = Player.V.攻击数值 || '0'
                if (大于等于(属性值, 阈值)) {
                    return true // 达到保留标准
                }
            }
        }

        // 血量检查
        if (属性ID === 基础词条.血量 || 属性ID === 基础词条.血量2) {
            if (Player.V.血量勾选) {
                const 阈值 = Player.V.血量数值 || '0'
                if (大于等于(属性值, 阈值)) {
                    return true
                }
            }
        }

        // 防御检查
        if (属性ID === 基础词条.防御 || 属性ID === 基础词条.防御2) {
            if (Player.V.防御勾选) {
                const 阈值 = Player.V.防御数值 || '0'
                if (大于等于(属性值, 阈值)) {
                    return true
                }
            }
        }

        // 技能魔次检查 (10001-10040)
        if (属性ID >= 10001 && 属性ID <= 10040) {
            if (Player.V.技能勾选) {
                const 阈值 = Player.V.技能数值 || '0'
                const 已选技能 = Player.V.已选择技能魔次 as number[] || []

                // 如果选择了特定技能，只检查已选技能
                if (已选技能.length > 0) {
                    if (已选技能.includes(属性ID) && 大于等于(属性值, 阈值)) {
                        return true
                    }
                } else {
                    // 没有选择特定技能，检查所有技能魔次
                    if (大于等于(属性值, 阈值)) {
                        return true
                    }
                }
            }
        }
    }

    return false // 没有达到任何保留条件
}

/**
 * 计算装备回收价值
 * 回收价格 = 基础属性翻倍倍率 * Player.R.最终回收倍率
 */
function 计算回收价值(Player: TPlayObject, UserItem: TUserItem): { 价值: string, 货币类型: '金币' | '元宝' } {
    const 翻倍倍率 = 获取装备翻倍倍率(UserItem)
    const 最终倍率 = Player.R.最终回收倍率 / 100 || 1

    if (是否神器(UserItem)) {
        // 神器回收获得元宝
        const 神器倍数 = 解析神器倍数(UserItem.DisplayName || '')
        const 元宝价值 = 智能计算(String(神器倍数), String(最终倍率), 3)
        return { 价值: 元宝价值, 货币类型: '元宝' }
    } else {
        // 普通装备回收获得金币
        const 金币价值 = 智能计算(String(翻倍倍率), String(最终倍率), 3)
        return { 价值: String(翻倍倍率), 货币类型: '金币' }
    }
}

/**
 * 核心回收检查函数
 * 用于掉落时筛选和手动回收
 * @returns 回收结果
 */
export function 检查装备回收(Player: TPlayObject, UserItem: TUserItem): 回收结果 {
    // 初始化变量
    初始化回收变量(Player)

    // 检查装备类型
    if (!有效装备类型.includes(UserItem.StdMode)) {
        return { 应该回收: false, 回收价值: '0', 货币类型: '金币', 保留原因: '装备类型不符' }
    }

    // 检查是否绑定
    if (UserItem.GetState()?.GetBind()) {
        return { 应该回收: false, 回收价值: '0', 货币类型: '金币', 保留原因: '绑定装备' }
    }

    // 获取品质
    const 品质 = 获取装备品质(UserItem)

    // 检查品质是否在回收列表
    if (!检查品质回收(Player, 品质)) {
        return { 应该回收: false, 回收价值: '0', 货币类型: '金币', 保留原因: '品质不在回收列表' }
    }

    // 检查词条保留
    if (检查词条保留(Player, UserItem)) {
        return { 应该回收: false, 回收价值: '0', 货币类型: '金币', 保留原因: '词条达到保留标准' }
    }

    // 计算回收价值
    const { 价值, 货币类型 } = 计算回收价值(Player, UserItem)

    return { 应该回收: true, 回收价值: 价值, 货币类型 }
}

/**
 * 执行单件装备回收
 */
export function 执行装备回收(Player: TPlayObject, UserItem: TUserItem): boolean {
    const 结果 = 检查装备回收(Player, UserItem)

    if (!结果.应该回收) return false

    // 发放奖励
    if (结果.货币类型 === '元宝') {
        const 当前元宝 = Player.GetGamePoint() || 0
        Player.SetGamePoint(当前元宝 + Number(结果.回收价值))
    } else {
        const 当前金币 = Player.GetGold() || 0
        Player.SetGold(当前金币 + Number(结果.回收价值))
        Player.GoldChanged()
    }

    // 删除装备
    Player.DeleteItem(UserItem)

    return true
}

/**
 * 批量回收背包装备
 */
export function 批量回收背包(Player: TPlayObject): 批量回收结果 {
    初始化回收变量(Player)

    let 回收数量 = 0
    let 总金币 = '0'
    let 总元宝 = '0'

    // 倒序遍历避免索引问题
    for (let i = Player.GetItemSize() - 1; i >= 0; i--) {
        const item = Player.GetBagItem(i)
        if (!item) continue

        const 结果 = 检查装备回收(Player, item)
        if (!结果.应该回收) continue

        // 累计价值
        if (结果.货币类型 === '元宝') {
            总元宝 = 智能计算(总元宝, 结果.回收价值, 1)
        } else {
            总金币 = 智能计算(总金币, 结果.回收价值, 1)
        }

        Player.DeleteItem(item)
        回收数量++
    }

    // 发放奖励
    if (总金币 !== '0') {
        Player.SetGold(Player.GetGold() + Number(总金币))
        Player.GoldChanged()
    }
    if (总元宝 !== '0') {
        Player.SetGamePoint(Player.GetGamePoint() + Number(总元宝))
    }

    return { 回收数量, 总金币, 总元宝 }
}

/**
 * 掉落时自动回收检查
 * 用于怪物掉落物品触发时调用
 * @returns true = 已回收(不入包), false = 保留(入包)
 */
export function 掉落自动回收(Player: TPlayObject, UserItem: TUserItem): boolean {
    初始化回收变量(Player)

    // 未开启自动回收
    if (!Player.V.自动回收) return false

    return 执行装备回收(Player, UserItem)
}


// ==================== 前端UI部分 ====================

/**
 * 装备回收主界面
 */
export function Main(Npc: TNormNpc, Player: TPlayObject): void {
    初始化回收变量(Player)

    const 最终倍率 = Player.R.最终回收倍率 || 1
    const 攻击显示 = 简化数值显示(Player.V.攻击数值)
    const 血量显示 = 简化数值显示(Player.V.血量数值)
    const 防御显示 = 简化数值显示(Player.V.防御数值)
    const 技能显示 = 简化数值显示(Player.V.技能数值)
    const 攻击位数 = Player.V.攻击数值?.length || 0
    const 血量位数 = Player.V.血量数值?.length || 0
    const 防御位数 = Player.V.防御数值?.length || 0
    const 技能位数 = Player.V.技能数值?.length || 0

    const S = `\\
        {S=装备回收系统;C=251;X=240;Y=10}
        {S=当前回收倍率:;C=154;X=50;Y=10}{S=${最终倍率}%;C=253;OX=5;Y=10}
        
        {S=品质回收设置;C=251;X=50;Y=50}
        <{I=$回收普通$;F=装备图标.DATA;X=50;Y=80}/@装备回收.勾选(回收普通)> {S=普通;C=255;OX=3;Y=80}
        <{I=$回收优秀$;F=装备图标.DATA;X=120;Y=80}/@装备回收.勾选(回收优秀)> {S=优秀;C=250;OX=3;Y=80}
        <{I=$回收稀有$;F=装备图标.DATA;X=190;Y=80}/@装备回收.勾选(回收稀有)> {S=稀有;C=154;OX=3;Y=80}
        <{I=$回收史诗$;F=装备图标.DATA;X=260;Y=80}/@装备回收.勾选(回收史诗)> {S=史诗;C=254;OX=3;Y=80}
        <{I=$回收传说$;F=装备图标.DATA;X=50;Y=110}/@装备回收.勾选(回收传说)> {S=传说;C=251;OX=3;Y=110}
        <{I=$回收神话$;F=装备图标.DATA;X=120;Y=110}/@装备回收.勾选(回收神话)> {S=神话;C=244;OX=3;Y=110}
        <{I=$回收神器$;F=装备图标.DATA;X=190;Y=110}/@装备回收.勾选(回收神器)> {S=神器;C=249;OX=3;Y=110;HINT=神器回收获得元宝}


        {S=词条保留设置;C=251;X=50;Y=150}{S=勾选后,高于设定数值的装备将被保留;C=154;X=150;Y=150}        
        
        <{I=$本职勾选$;F=装备图标.DATA;X=50;Y=175}/@装备回收.勾选(本职勾选)> {S=只保留本职业装备;C=9;OX=3;Y=175}        
        <{I=$攻击勾选$;F=装备图标.DATA;X=50;Y=210}/@装备回收.勾选(攻击勾选)> {S=攻击     ≥ ${攻击显示};OX=3;Y=210}{S=${攻击位数}位;X=230;Y=210}
        <{S=设置;X=300;Y=210}/@@装备回收.InPutString01(高于输入的数值将不回收#92输入格式:数值*位数 或者 数值,攻击数值)@装备回收.设置数值(攻击数值)>
        
        <{I=$血量勾选$;F=装备图标.DATA;X=50;Y=245}/@装备回收.勾选(血量勾选)> {S=血量     ≥ ${血量显示};OX=3;Y=245}{S=${血量位数}位;X=230;Y=245}
        <{S=设置;X=300;Y=245}/@@装备回收.InPutString01(高于输入的数值将不回收#92输入格式:数值*位数 或者 数值,血量数值)@装备回收.设置数值(血量数值)>
        
        <{I=$防御勾选$;F=装备图标.DATA;X=50;Y=280}/@装备回收.勾选(防御勾选)> {S=防御     ≥ ${防御显示};OX=3;Y=280}{S=${防御位数}位;X=230;Y=280}
        <{S=设置;X=300;Y=280}/@@装备回收.InPutString01(高于输入的数值将不回收#92输入格式:数值*位数 或者 数值,防御数值)@装备回收.设置数值(防御数值)>\
        
        <{I=$技能勾选$;F=装备图标.DATA;X=50;Y=315}/@装备回收.勾选(技能勾选)> {S=技能魔次 ≥ ${技能显示};OX=3;Y=315}{S=${技能位数}位;X=230;Y=315}
        <{S=设置;X=300;Y=315}/@@装备回收.InPutString01(高于输入的数值将不回收#92输入格式:数值*位数 或者 数值,技能数值)@装备回收.设置数值(技能数值)>
        <{S=技能选择;C=251;X=350;Y=315;HINT=选择需要保留的技能魔次}/@装备回收.技能魔次选择界面>
        
        
        {S=自动功能;C=154;X=400;Y=50}
        <{I=$自动回收$;F=装备图标.DATA;X=390;Y=85}/@装备回收.勾选(自动回收)> {S=自动回收;C=9;OX=3;Y=85}
        <{I=$自动拾取$;F=装备图标.DATA;X=390;Y=120}/@装备回收.勾选(自动拾取)> {S=自动拾取;C=9;OX=3;Y=120}
        <{I=$回收屏蔽$;F=装备图标.DATA;X=390;Y=155}/@装备回收.勾选(回收屏蔽)> {S=屏蔽提示;C=9;OX=3;Y=155;HINT=可屏蔽回收信息提示}
        

        <{S=开始回收;C=253;X=420;Y=320}/@装备回收.开始回收>\\
        <{S=一键全部回收;C=249;X=410;Y=360;HINT=回收背包内所有符合条件的装备}/@装备回收.一键全部回收>
    `

    const M = 生成UI字符串(Player, S)
    Npc.SayEx(Player, 'NPC中大窗口', M)
}

// ==================== UI辅助函数 ====================

function 生成UI字符串(Player: TPlayObject, 模板: string): string {
    const 映射: Record<string, string> = {
        '回收普通': Player.V.回收普通 ? '31' : '30',
        '回收优秀': Player.V.回收优秀 ? '31' : '30',
        '回收稀有': Player.V.回收稀有 ? '31' : '30',
        '回收史诗': Player.V.回收史诗 ? '31' : '30',
        '回收传说': Player.V.回收传说 ? '31' : '30',
        '回收神话': Player.V.回收神话 ? '31' : '30',
        '回收神器': Player.V.回收神器 ? '31' : '30',
        '自动回收': Player.V.自动回收 ? '31' : '30',
        '自动拾取': Player.V.自动拾取 ? '31' : '30',
        '回收屏蔽': Player.V.回收屏蔽 ? '31' : '30',
        '本职勾选': Player.V.本职勾选 ? '31' : '30',
        '攻击勾选': Player.V.攻击勾选 ? '31' : '30',
        '血量勾选': Player.V.血量勾选 ? '31' : '30',
        '防御勾选': Player.V.防御勾选 ? '31' : '30',
        '技能勾选': Player.V.技能勾选 ? '31' : '30',
    }

    let 结果 = 模板
    for (const [键, 值] of Object.entries(映射)) {
        结果 = ReplaceStr(结果, `$${键}$`, 值)
    }
    return 结果
}


function 简化数值显示(数值: string): string {
    if (!数值 || 数值 === '0') return '0'
    return 大数值整数简写(数值)
}

// ==================== UI交互函数 ====================

export function 勾选(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 类型 = Args.Str[0]
    Player.V[类型] = !Player.V[类型]
    Main(Npc, Player)
}



export function InPutString01(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 类型 = Args.Str[0]
    let 数值 = Args.Str[1] || ''

    // 如果有输入值，处理并保存
    if (数值 !== '') {
        // 支持 数字*位数 格式，如 5*10 表示 50000000000
        if (数值.includes('*')) {
            const parts = 数值.split('*')
            if (parts.length === 2) {
                const 基数 = parts[0]
                const 位数 = parseInt(parts[1])
                if (!isNaN(位数) && 位数 >= 0) {
                    数值 = 基数 + '0'.repeat(位数)
                }
            }
        }

        Player.V[类型] = 数值
        Player.SendMessage(`${类型.replace('数值', '')}保留阈值已设置为: ${简化数值显示(数值)}`, 1)
    }

    Main(Npc, Player)
}

export function 开始回收(Npc: TNormNpc, Player: TPlayObject): void {
    const 结果 = 批量回收背包(Player)

    if (结果.回收数量 === 0) {
        Player.SendMessage('没有找到符合回收条件的装备', 1)
        return
    }

    let 消息 = `回收了{S=${结果.回收数量};C=154}件装备`
    if (结果.总金币 !== '0') {
        消息 += `，获得{S=${简化数值显示(结果.总金币)};C=253}金币`
    }
    if (结果.总元宝 !== '0') {
        消息 += `，获得{S=${结果.总元宝};C=251}元宝`
    }

    if (!Player.V.回收屏蔽) {
        Player.SendMessage(消息, 1)
    }

    Main(Npc, Player)
}

export function 一键全部回收(Npc: TNormNpc, Player: TPlayObject): void {
    初始化回收变量(Player)

    let 回收数量 = 0
    let 总金币 = '0'
    let 总元宝 = '0'

    // 倒序遍历背包避免索引问题
    for (let i = Player.GetItemSize() - 1; i >= 0; i--) {
        const item = Player.GetBagItem(i)
        if (!item) continue

        // 只检查类型和绑定，其余全部回收
        // 1. 检查装备类型
        if (!有效装备类型.includes(item.StdMode)) {
            continue
        }

        // 2. 检查是否绑定
        if (item.GetState()?.GetBind()) {
            continue
        }

        // 符合条件，计算回收价值并回收
        const { 价值, 货币类型 } = 计算回收价值(Player, item)

        // 累计价值
        if (货币类型 === '元宝') {
            总元宝 = 智能计算(总元宝, 价值, 1)
        } else {
            总金币 = 智能计算(总金币, 价值, 1)
        }

        Player.DeleteItem(item)
        回收数量++
    }

    // 发放奖励
    if (总金币 !== '0') {
        Player.SetGold(Player.GetGold() + Number(总金币))
        Player.GoldChanged()
    }
    if (总元宝 !== '0') {
        Player.SetGamePoint(Player.GetGamePoint() + Number(总元宝))
    }

    if (回收数量 === 0) {
        Player.SendMessage('没有找到可回收的装备', 1)
        return
    }

    let 消息 = `一键回收了{S=${回收数量};C=154}件装备`
    if (总金币 !== '0') {
        消息 += `，获得{S=${简化数值显示(总金币)};C=253}金币`
    }
    if (总元宝 !== '0') {
        消息 += `，获得{S=${总元宝};C=251}元宝`
    }

    if (!Player.V.回收屏蔽) {
        Player.SendMessage(消息, 1)
    }

    Main(Npc, Player)
}

// ==================== 技能魔次选择界面 ====================

/**
 * 技能魔次选择界面
 */
export function 技能魔次选择界面(Npc: TNormNpc, Player: TPlayObject): void {
    初始化回收变量(Player)

    const 已选技能 = Player.V.已选择技能魔次 as number[] || []
    const 所有技能ID = Object.values(技能魔次).filter(id => typeof id === 'number') as number[]

    let str = `{S=技能魔次词条保留;X=180;Y=-10;C=251}\n`
    str += `{S=勾选后只保留包含已选技能魔次的装备;X=120;Y=15;C=154}\n`

    // 构建技能选择界面，每行4个技能
    for (let i = 0; i < 所有技能ID.length; i += 4) {
        const y = 50 + Math.floor(i / 4) * 30

        for (let j = 0; j < 4 && i + j < 所有技能ID.length; j++) {
            const 技能ID = 所有技能ID[i + j]
            const 技能名称 = 技能魔次名称映射[技能ID] || '未知'
            const x = 20 + j * 120
            const 图标 = 已选技能.includes(技能ID) ? '31' : '30'

            str += `<{I=${图标};F=装备图标.DATA;X=${x};Y=${y}}/@装备回收.勾选技能魔次(${技能ID})>{S=${技能名称};X=${x + 25};Y=${y}}\n`
        }
    }

    // 底部按钮
    const 底部Y = 40 + Math.ceil(所有技能ID.length / 4) * 30 + 20
    str += `<{S=清空选择;X=400;Y=${底部Y};C=254}/@装备回收.清空技能选择>`
    // str += `<{S=返回;X=300;Y=${底部Y};C=253}/@装备回收.CloseDialog(player)>`

    Npc.SayEx(Player, 'NPC大窗口', str)
}

/**
 * 勾选技能魔次
 */
export function 勾选技能魔次(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    初始化回收变量(Player)

    const 技能ID = Args.Int[0]
    const 已选技能 = Player.V.已选择技能魔次 as number[] || []

    if (已选技能.includes(技能ID)) {
        // 移除已选择的技能
        Player.V.已选择技能魔次 = 已选技能.filter(id => id !== 技能ID)
    } else {
        // 添加新选择的技能
        已选技能.push(技能ID)
        Player.V.已选择技能魔次 = 已选技能
    }

    技能魔次选择界面(Npc, Player)
}

/**
 * 清空技能选择
 */
export function 清空技能选择(Npc: TNormNpc, Player: TPlayObject): void {
    Player.V.已选择技能魔次 = []
    Player.SendMessage('已清空技能魔次选择', 1)
    技能魔次选择界面(Npc, Player)
}
