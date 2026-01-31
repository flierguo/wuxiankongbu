
import * as 功能 from '../_功能';
import { TAG } from '../基础常量';

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
    地图限制?: string[]      // 可选：限制掉落的地图名
    TAG限制?: number[]       // 可选：限制掉落的怪物TAG（尾数）
    最低等级?: number        // 可选：怪物最低等级要求
}

// ==================== 掉落配置表 ====================
// 配置说明：
// - 基础几率越大，掉落越难（ItemRate/基础几率）
// - 地图限制为空则所有地图都可掉落
// - TAG限制为空则所有TAG怪物都可掉落
const 掉落配置表: 掉落分组[] = [
    // ==================== 新手装备 ====================
    {
        分组名: '新手装备',
        物品列表: ['新手盾牌', '新手剑', '新手衣服'],
        基础几率: 500,
        地图限制: ['浣熊市'],
        TAG限制: [1, 2, 3],
    },
    
    // ==================== 生化套装 ====================
    {
        分组名: '生化套',
        物品列表: ['生化头盔', '生化护甲', '生化护腿', '生化战靴'],
        基础几率: 3000,
        地图限制: ['浣熊市', '蜂巢入口'],
        TAG限制: [3, 4, 5],
    },
    
    // ==================== 蜂巢套装 ====================
    {
        分组名: '蜂巢套',
        物品列表: ['蜂巢头盔', '蜂巢护甲', '蜂巢护腿', '蜂巢战靴'],
        基础几率: 5000,
        地图限制: ['蜂巢入口', '病毒研究室'],
        TAG限制: [4, 5],
    },
    
    // ==================== BOSS专属 ====================
    {
        分组名: 'BOSS专属',
        物品列表: ['暴君之心', '红后核心', '威斯克墨镜'],
        基础几率: 10000,
        TAG限制: [5, 6, 7],
    },
]

// ==================== 核心掉落函数 ====================

/**
 * 计算并执行物品掉落（简化版，自动获取地图和TAG）
 * @param Player 玩家对象
 * @param Monster 被击杀的怪物
 */
export function 执行掉落(Player: TPlayObject, Monster: TActor): void {
    // 自动获取地图名和怪物TAG
    const 地图名 = Monster.Map?.MapName || ''
    const 怪物TAG = Monster.GetNVar(TAG) % 10
    const 玩家爆率 = (Player.AddedAbility.ItemRate / 100) || 1
    
    for (const 分组 of 掉落配置表) {
        // 检查地图限制
        if (分组.地图限制 && 分组.地图限制.length > 0) {
            if (!分组.地图限制.includes(地图名)) continue
        }
        
        // 检查TAG限制
        if (分组.TAG限制 && 分组.TAG限制.length > 0) {
            if (!分组.TAG限制.includes(怪物TAG)) continue
        }
        
        // 检查等级限制
        if (分组.最低等级 && Monster.Level < 分组.最低等级) continue
        
        // 随机判定: random(基础几率) < 玩家爆率
        if (random(分组.基础几率) < 玩家爆率) {
            // 从物品列表随机选一个
            const 随机索引 = random(分组.物品列表.length)
            const 物品名 = 分组.物品列表[随机索引]
            
            // 给予玩家物品
            掉落物品(Player, 物品名)
        }
    }
}

/**
 * 给予玩家掉落物品
 */
function 掉落物品(Player: TPlayObject, 物品名: string): void {
    // 直接给予玩家叠加物品
    功能.背包.给叠加物品(Player, 物品名, 1)
    // 发送掉落提示
    GameLib.Broadcast(`{S=【掉落】;C=250}恭喜玩家 {S=${Player.GetName()};C=249} 运气爆发,获得主神物品 {S=${物品名};C=249}`)
}

// ==================== 辅助函数 ====================

/**
 * 添加新的掉落分组（运行时动态添加）
 */
export function 添加掉落分组(分组: 掉落分组): void {
    掉落配置表.push(分组)
}

/**
 * 根据分组名获取配置
 */
export function 获取掉落分组(分组名: string): 掉落分组 | undefined {
    return 掉落配置表.find(g => g.分组名 === 分组名)
}

/**
 * 修改分组几率
 */
export function 修改分组几率(分组名: string, 新几率: number): boolean {
    const 分组 = 获取掉落分组(分组名)
    if (分组) {
        分组.基础几率 = 新几率
        return true
    }
    return false
}

/**
 * 获取玩家实际掉落几率（百分比显示）
 */
export function 获取实际掉落几率(Player: TPlayObject, 分组名: string): string {
    const 分组 = 获取掉落分组(分组名)
    if (!分组) return '0%'
    
    const 玩家爆率 = Player.AddedAbility.ItemRate || 1
    const 几率 = (玩家爆率 / 分组.基础几率) * 100
    return `${几率.toFixed(2)}%`
}

/**
 * 获取所有掉落分组名
 */
export function 获取所有分组名(): string[] {
    return 掉落配置表.map(g => g.分组名)
}
