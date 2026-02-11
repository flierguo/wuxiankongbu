
import * as 功能 from '../_功能';
import { TAG, 基础属性第一条, 基础词条 } from '../基础常量';
import { 神器套装配置 } from '../_服务/神器配置';

/**
 * 爆率系统 - 基于分组的物品掉落机制
 * 
 * 掉落几率公式: Player.AddedAbility.ItemRate / 配置几率
 * 例如: 几率3000，玩家ItemRate=100，则掉落几率为 100/3000 ≈ 3.33%
 */

// ==================== 掉落分组配置接口 ====================
interface 掉落分组 {
    分组名: string           // 分组名称，如"生化套"
    物品列表: string[]       // 物品名称数组
    基础几率: number         // 基础几率分母，如3000表示 ItemRate/3000
    地图限制?: string        // 可选：地图下标限制，'*'=全部地图，'1,100-200'=下标1和100到200
    TAG限制?: number[]       // 可选：限制掉落的怪物TAG（尾数）
    最低等级?: number        // 可选：怪物最低等级要求
}

type 难度名 = '简单' | '普通' | '困难' | '精英' | '炼狱' | '圣耀'

const 难度掉落倍率: Record<难度名, number> = {
    简单: 0.8,
    普通: 0.9,
    困难: 1,
    精英: 1.05,
    炼狱: 1.1,
    圣耀: 1.2, // 与炼狱相同
}

function 解析地图显示名难度(显示名: string | undefined | null): 难度名 | null {
    if (!显示名) return null
    const m = 显示名.match(/«([^»]+)»/)
    if (!m) return null

    const raw = m[1]
    if (raw.startsWith('圣耀')) return '圣耀'
    if (raw === '简单' || raw === '普通' || raw === '困难' || raw === '精英' || raw === '炼狱') return raw
    return null
}

function 取地图难度倍率(Monster: TActor): number {
    const map = Monster.Map
    const 显示名 = (map as any)?.DisplayName as string | undefined
    const 难度 = 解析地图显示名难度(显示名)
    if (难度) return 难度掉落倍率[难度]

    // 兜底：从副本池按地图ID找难度（避免依赖地图模块）
    const mapId = (map as any)?.MapName as string | undefined
    const 副本池 = (GameLib as any)?.R?.地图池 as Array<any> | undefined
    if (!mapId || !Array.isArray(副本池)) return 1

    const info = 副本池.find(v => v?.地图ID === mapId)
    const 难度名 = info?.难度 as 难度名 | undefined
    return (难度名 && (难度名 in 难度掉落倍率)) ? 难度掉落倍率[难度名] : 1
}

// ==================== 地图下标解析（带缓存） ====================

// 缓存已解析的地图下标集合，避免每次掉落重复解析
const 地图下标缓存 = new Map<string, Set<number> | null>()

/**
 * 解析地图限制字符串为下标集合
 * 支持格式: '*' = 全部地图, '1,100-200,50' = 下标1、50和100到200
 * 返回 null 表示全部地图（'*' 或未设置）
 */
function 解析地图下标(限制字符串: string | undefined): Set<number> | null {
    if (!限制字符串 || 限制字符串 === '*') return null

    // 查缓存
    const 缓存结果 = 地图下标缓存.get(限制字符串)
    if (缓存结果 !== undefined) return 缓存结果

    const 结果 = new Set<number>()
    const 片段列表 = 限制字符串.split(',')

    for (let i = 0; i < 片段列表.length; i++) {
        const 片段 = 片段列表[i].trim()
        if (!片段) continue

        const 范围索引 = 片段.indexOf('-')
        if (范围索引 > 0) {
            // 范围格式: 100-200
            const 起始 = parseInt(片段.substring(0, 范围索引), 10)
            const 结束 = parseInt(片段.substring(范围索引 + 1), 10)
            if (!isNaN(起始) && !isNaN(结束)) {
                for (let j = 起始; j <= 结束; j++) {
                    结果.add(j)
                }
            }
        } else {
            // 单个下标
            const 下标 = parseInt(片段, 10)
            if (!isNaN(下标)) {
                结果.add(下标)
            }
        }
    }

    地图下标缓存.set(限制字符串, 结果)
    return 结果
}

/**
 * 通过地图ID从地图池中查找下标
 * 返回 -1 表示未找到
 */
function 地图ID取下标(地图ID: string): number {
    const 副本池 = GameLib.R.地图池 as any[]
    if (!Array.isArray(副本池)) return -1
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i]?.地图ID === 地图ID) return i
    }
    return -1
}

// ==================== 掉落配置表 ====================
// 配置说明：
// - 基础几率越大，掉落越难（ItemRate/基础几率）
// - 地图限制: '*'=全部地图, '1,100-200'=下标1和100到200, 不填=全部地图
// - TAG限制为空则所有TAG怪物都可掉落
const 掉落配置表: 掉落分组[] = [
    // ==================== 职业技能书 ====================
    {
        分组名: '职业技能书',
        物品列表: ['天枢职业技能书', '血神职业技能书', '暗影职业技能书', '烈焰职业技能书', '正义职业技能书', '不动职业技能书', '基础职业技能书',],
        基础几率: 20000,
        地图限制: '*',
        TAG限制: [3 , 4 , 5 , 6 , 7],
    },
    // ==================== 特殊单件 ====================
    {
        分组名: '特殊单件',
        物品列表: ['『1阶』主神玄笠',],
        基础几率: 40000,
        地图限制: '101-160',
        TAG限制: [4 , 5 , 6 , 7],
    },
]

// ==================== 神器掉落（按地图配置） ====================

interface 神器地图掉落配置项 {
    地图名: string
    套装名称: string
    基础几率: number // 分母：ItemRate/基础几率（再叠加难度倍率与保底倍率）
    TAG限制: number[] // 掉落怪 TAG（尾数）
}

const 神器地图掉落配置: 神器地图掉落配置项[] = [
    {
        地图名: '浣熊市',
        套装名称: '蜂巢生存套',
        基础几率: 45000,
        TAG限制: [5, 6, 7],
    },
    {
        地图名: '蜂巢入口',
        套装名称: '丧尸近战套',
        基础几率: 50000,
        TAG限制: [5, 6, 7],
    },
    {
        地图名: '病毒研究室',
        套装名称: '舔食远程套',
        基础几率: 55000,
        TAG限制: [5, 6, 7],
    },
    {
        地图名: '生化实验室',
        套装名称: '病毒研究套',
        基础几率: 60000,
        TAG限制: [5, 6, 7],
    },
    {
        地图名: '激光走廊',
        套装名称: '应急逃生套',
        基础几率: 65000,
        TAG限制: [5, 6, 7],
    },
    {
        地图名: '红后控制室',
        套装名称: '团队支援套',
        基础几率: 70000,
        TAG限制: [5, 6, 7],
    },
]

function 取地图本名(地图名或显示名: string): string {
    const idx = 地图名或显示名.indexOf('«')
    return idx >= 0 ? 地图名或显示名.slice(0, idx) : 地图名或显示名
}

function 取神器套装组件列表(套装名称: string): string[] {
    return 神器套装配置.find(v => v.套装名称 === 套装名称)?.组件列表 || []
}

function 取玩家保底信息(Player: TPlayObject, key: string): { 击杀数: number } {
    const r = (Player as any).R || ((Player as any).R = {})
    const v = r[key]
    if (typeof v === 'number' && Number.isFinite(v) && v >= 0) return { 击杀数: Math.floor(v) }
    r[key] = 0
    return { 击杀数: 0 }
}

function 设置玩家保底击杀数(Player: TPlayObject, key: string, kills: number): void {
    const r = (Player as any).R || ((Player as any).R = {})
    r[key] = Math.max(0, Math.floor(kills))
}

const 保底冷却怪数 = 6000  // 掉落后6000只怪内不增加保底倍率

function 计算保底倍率(击杀数: number): number {
    // 6000只怪以内保底倍率不增加，超过后才开始累加
    if (击杀数 <= 保底冷却怪数) return 1
    const 有效击杀 = 击杀数 - 保底冷却怪数
    const 段数 = Math.floor(有效击杀 / 500)
    return 1 + 段数 * 0.02
}

// ==================== 核心掉落函数 ====================

/**
 * 计算并执行物品掉落（简化版，自动获取地图和TAG）
 * @param Player 玩家对象
 * @param Monster 被击杀的怪物
 */
export function 执行掉落(Player: TPlayObject, Monster: TActor): void {
    // 自动获取地图ID和怪物TAG
    const 地图标识 = Monster.Map?.DisplayName || Monster.Map?.MapName || ''
    const 地图本名 = 取地图本名(地图标识)
    const 地图ID = Monster.Map?.MapName || ''
    const 怪物TAG = Monster.GetNVar(TAG) % 10
    const 玩家爆率 = (Player.AddedAbility.ItemRate / 10) || 1
    const 难度倍率 = 取地图难度倍率(Monster)

    // 通过地图ID查找当前地图在地图池中的下标
    const 当前地图下标 = 地图ID取下标(地图ID)

    for (const 分组 of 掉落配置表) {
        // 检查地图下标限制
        if (分组.地图限制 && 分组.地图限制 !== '*') {
            if (当前地图下标 < 0) continue
            const 允许下标集合 = 解析地图下标(分组.地图限制)
            if (允许下标集合 && !允许下标集合.has(当前地图下标)) continue
        }
        
        // 检查TAG限制
        if (分组.TAG限制 && 分组.TAG限制.length > 0) {
            if (!分组.TAG限制.includes(怪物TAG)) continue
        }
        
        // 检查等级限制
        if (分组.最低等级 && Monster.Level < 分组.最低等级) continue
        
        // 随机判定: random(基础几率) < 玩家爆率 * 难度倍率
        if (random(分组.基础几率) < 玩家爆率 * 难度倍率) {
            // 从物品列表随机选一个
            const 随机索引 = random(分组.物品列表.length)
            const 物品名 = 分组.物品列表[随机索引]
            
            // 给予玩家物品
            掉落物品(Player, 物品名)
        }
    }

    // 神器掉落：按地图 -> 套装组件池
    const 神器配置 = 神器地图掉落配置.find(v => v.地图名 === 地图本名)
    if (!神器配置) {
        return
    }
    if (!神器配置.TAG限制.includes(怪物TAG)) {
        return
    }

    const 组件列表 = 取神器套装组件列表(神器配置.套装名称)
    if (组件列表.length <= 0) {
        return
    }

    const 保底Key = `神器掉落击杀数_${地图本名}`
    const { 击杀数 } = 取玩家保底信息(Player, 保底Key)
    const 本次击杀数 = 击杀数 + ( 1 + Player.R.最终鞭尸次数)
    const 保底倍率 = 计算保底倍率(本次击杀数)


    // 掉落判定：random(基础几率) < 玩家爆率 * 难度倍率 * 保底倍率
    const 阈值 = 玩家爆率 * 难度倍率 * 保底倍率
    const 随机值 = random(神器配置.基础几率)

    if (随机值 < 阈值) {
        const idx = random(组件列表.length)
        const 组件名 = 组件列表[idx]
        掉落物品(Player, 组件名)
        设置玩家保底击杀数(Player, 保底Key, 0)
    } else {
        设置玩家保底击杀数(Player, 保底Key, 本次击杀数)
    }
}

/**
 * 给予玩家掉落物品
 */
function 掉落物品(Player: TPlayObject, 物品名: string): void {
    // 特殊处理：斗笠掉落赋予极品百分比属性
    if (物品名 === '『1阶』主神玄笠') {
        const item = Player.GiveItem(物品名)
        if (item) {
            const 极品率 = 1 + random(30) // 1-30随机
            item.SetOutWay1(基础属性第一条, 基础词条.极品百分比)
            item.SetOutWay2(基础属性第一条, 极品率)
            item.SetCustomDesc(JSON.stringify({
                职业属性_职业: [基础词条.极品百分比],
                职业属性_属性: [String(极品率)]
            }))
            Player.UpdateItem(item)
        }
        GameLib.Broadcast(`{S=【掉落】;C=250}恭喜玩家 {S=${Player.GetName()};C=249} 运气爆发,获得主神物品 {S=${物品名};C=249} 极品率+${1}%~30%`)
        return
    }
    // 直接给予玩家叠加物品
    功能.背包.给叠加物品(Player, 物品名, 1)
    // 发送掉落提示
    GameLib.Broadcast(`{S=【掉落】;C=250}恭喜玩家 {S=${Player.GetName()};C=249} 运气爆发,获得主神物品 {S=${物品名};C=249}`)
}


