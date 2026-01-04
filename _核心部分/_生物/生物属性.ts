/*怪物刷新单元 - 基于地图难度的生物属性系统*/

import { 血量显示, 大数值整数简写 } from "../字符计算"
import { 智能计算, js_范围随机 , 比较} from "../../大数值/核心计算方法"
import { 生成怪物随机技能, 获取技能2血量倍数, 获取技能2攻击倍数, 获取技能2防御倍数, 设置怪物技能变量, 生成怪物技能名字 } from "./生物随机技能"
import { 怪物类型, 怪物星星, 进化加一, TAG, 原始名字, 基础数值, 怪物攻速移速, 怪物爆率文件, 怪物等级, 怪物变量等级, 怪物显示称号, 怪物经验值 } from "../基础常量"
import { 地图配置, 取地图配置, 计算锚点, 锚点配置 } from "../世界配置"

// ==================== 生物类型定义 ====================
// 1-5: 正常刷新生物（难度递增）
// 6: 大陆BOSS（整个大陆所有地图刷新，难度很高）
// 7: 特殊BOSS（杀怪2000后刷新，难度比5高100倍）
export const 生物类型枚举 = {
    基础小怪: 1,      // 最弱
    挑战小怪: 2,      // 较弱
    稀有怪物: 3,      // 中等
    精英怪物: 4,      // 较强
    首领怪物: 5,      // 强
    大陆BOSS: 6,      // 很强（全大陆刷新）
    特殊BOSS: 7,      // 最强（杀怪2000后刷新）
} as const

// ==================== 怪物称号特效 ====================
const 怪物称号特效 = {
    无: 0,
    BOSS: 22,
    精英: 21,
    稀有: 0,
    首领: 23,
    大陆BOSS: 25,
    特殊BOSS: 22,
}

// ==================== 怪物颜色配置 ====================
const 怪物颜色配置 = {
    基础白: 255,
    挑战绿: 250,
    稀有蓝: 154,
    精英紫: 241,
    首领橙: 243,
    大陆BOSS红: 249,
    特殊BOSS金: 251,
}

// ==================== 生物配置接口 ====================
interface 生物配置项 {
    类型名称: string
    血量基础: string      // 单一基础值，实际血量 = 基础值 * 随机倍数(0.5-1.5)
    攻击基础: string      // 单一基础值
    防御基础: string      // 单一基础值
    经验倍数: number
    颜色: number
    称号: number
    爆率倍数: number
    难度系数: number      // 相对于普通小怪的难度倍数
}

// ==================== 生物配置表（基于类型） ====================
const 生物配置表: Record<number, 生物配置项> = {
    [生物类型枚举.基础小怪]: {
        类型名称: '基础',
        血量基础: '100',
        攻击基础: '10',
        防御基础: '5',
        经验倍数: 1,
        颜色: 怪物颜色配置.基础白,
        称号: 怪物称号特效.无,
        爆率倍数: 1,
        难度系数: 1,
    },
    [生物类型枚举.挑战小怪]: {
        类型名称: '精英',
        血量基础: '500',
        攻击基础: '30',
        防御基础: '15',
        经验倍数: 3,
        颜色: 怪物颜色配置.挑战绿,
        称号: 怪物称号特效.无,
        爆率倍数: 1,
        难度系数: 5,
    },
    [生物类型枚举.稀有怪物]: {
        类型名称: '稀有',
        血量基础: '2000',
        攻击基础: '100',
        防御基础: '50',
        经验倍数: 10,
        颜色: 怪物颜色配置.稀有蓝,
        称号: 怪物称号特效.无,
        爆率倍数: 1,
        难度系数: 20,
    },
    [生物类型枚举.精英怪物]: {
        类型名称: '精英',
        血量基础: '10000',
        攻击基础: '500',
        防御基础: '200',
        经验倍数: 30,
        颜色: 怪物颜色配置.精英紫,
        称号: 怪物称号特效.精英,
        爆率倍数: 1,
        难度系数: 100,
    },
    [生物类型枚举.首领怪物]: {
        类型名称: '首领',
        血量基础: '50000',
        攻击基础: '2000',
        防御基础: '1000',
        经验倍数: 100,
        颜色: 怪物颜色配置.首领橙,
        称号: 怪物称号特效.首领,
        爆率倍数: 2,
        难度系数: 500,
    },
    [生物类型枚举.大陆BOSS]: {
        类型名称: '大陆BOSS',
        血量基础: '500000',
        攻击基础: '10000',
        防御基础: '5000',
        经验倍数: 500,
        颜色: 怪物颜色配置.大陆BOSS红,
        称号: 怪物称号特效.大陆BOSS,
        爆率倍数: 4,
        难度系数: 5000,
    },
    [生物类型枚举.特殊BOSS]: {
        类型名称: '特殊BOSS',
        血量基础: '50000000',  // 比首领高100倍
        攻击基础: '20000',
        防御基础: '10000',
        经验倍数: 1000,
        颜色: 怪物颜色配置.特殊BOSS金,
        称号: 怪物称号特效.特殊BOSS,
        爆率倍数: 3,
        难度系数: 50000,  // 比首领高100倍
    },
}

// ==================== 工具函数 ====================

/**
 * 生成区间随机倍数（0.5-1.5之间）
 * 返回50-150的整数，用于后续除以100
 */
function 生成随机倍数(): number {
    return randomRange(50, 200)
}

/**
 * 应用随机倍数到基础值
 * @param 基础值 字符串形式的基础数值
 * @returns 应用随机倍数后的结果
 */
function 应用随机倍数(基础值: string): string {
    const 倍数 = 生成随机倍数()
    // 基础值 * 倍数 / 100
    const 中间结果 = 智能计算(基础值, String(倍数), 3)
    return 智能计算(中间结果, '100', 4)
}

/**
 * 根据地图固定星级计算难度倍数
 * 星级越高，怪物越强
 */
function 计算星级难度倍数(固定星级: number): string {
    // 基础公式：2^(固定星级-1)
    // 星级1 = 1倍，星级2 = 2倍，星级3 = 4倍，星级4 = 8倍...
    if (固定星级 <= 1) return '1'
    return 智能计算('2', String(固定星级 - 1), 7)
}

// ==================== 获取地图信息 ====================

interface 地图难度信息 {
    地图等级: number
    固定星级: number
    难度名称: string
    爆率文件: string
    装备等级: number
    锚点信息: 锚点配置
    地图配置项?: typeof 地图配置[0]  // 保存原始配置项用于锚点计算
}

/**
 * 从地图获取难度信息（使用锚点系统 - 大数值版）
 */
function 获取地图难度信息(Envir: TEnvirnoment): 地图难度信息 {
    const 地图名 = Envir.GetMapName()
    const 显示名 = Envir.DisplayName || ''
    
    // 默认值
    let 地图等级 = 100
    let 固定星级 = 1
    let 难度名称 = '普通'
    let 爆率文件 = '默认'
    let 难度倍数 = 1
    let 找到的配置项: typeof 地图配置[0] | undefined
    
    // 尝试从副本池获取信息
    const 副本池 = GameLib.R.地图池 as any[]
    if (副本池 && 副本池.length > 0) {
        for (const 副本 of 副本池) {
            if (副本 && 副本.地图ID === 地图名) {
                地图等级 = 副本.地图等级 || 100
                固定星级 = 副本.固定星级 || 1
                难度名称 = 副本.难度 || '普通'
                爆率文件 = 副本.地图名 || '默认'
                break
            }
        }
    }
    
    // 根据显示名解析难度倍数
    if (显示名.includes('简单')) {
        难度名称 = '简单'
        难度倍数 = 4
    } else if (显示名.includes('普通')) {
        难度名称 = '普通'
        难度倍数 = 8
    } else if (显示名.includes('困难')) {
        难度名称 = '困难'
        难度倍数 = 12
    } else if (显示名.includes('精英')) {
        难度名称 = '精英'
        难度倍数 = 16
    } else if (显示名.includes('炼狱')) {
        难度名称 = '炼狱'
        难度倍数 = 20
    } else if (显示名.includes('圣耀')) {
        难度名称 = '圣耀'
        难度倍数 = 30
    }
    
    // 根据地图配置查找（优先使用世界配置中的地图配置）
    for (const 配置 of 地图配置) {
        if (显示名.includes(配置.地图名)) {
            地图等级 = 配置.地图等级
            固定星级 = 配置.固定星级
            爆率文件 = 配置.地图名
            找到的配置项 = 配置
            break
        }
    }
    
    // 使用锚点系统计算（大数值版，传入自定义生物强度倍数）
    const 锚点信息 = 计算锚点(地图等级, 难度倍数, 找到的配置项?.生物强度倍数)
    
    return {
        地图等级,
        固定星级,
        难度名称,
        爆率文件,
        装备等级: 锚点信息.装备等级基础,
        锚点信息,
        地图配置项: 找到的配置项
    }
}

/**
 * 根据Tag获取生物类型
 * Tag % 10 的值对应生物类型
 */
function 获取生物类型(Tag: number): number {
    const 尾数 = Tag % 10
    // 映射Tag尾数到生物类型
    switch (尾数) {
        case 1: return 生物类型枚举.基础小怪
        case 2: return 生物类型枚举.挑战小怪
        case 3: return 生物类型枚举.稀有怪物
        case 4: return 生物类型枚举.精英怪物
        case 5: return 生物类型枚举.首领怪物
        case 6: return 生物类型枚举.大陆BOSS
        case 7: return 生物类型枚举.特殊BOSS
        default: return 生物类型枚举.基础小怪
    }
}


// ==================== 主刷新函数 ====================

export function Refresh(Envir: TEnvirnoment, Monster: TActor, Tag: number): void {
    Randomize()
    
    // 检查是否已进化
    if (Monster.GetNVar(进化加一) == 1) {
        return
    }
    
    // 保存原始名字
    Monster.SetSVar(原始名字, Monster.GetName())
    Monster.SetAlwaysShowHP(true)
    
    // 获取地图难度信息
    const 地图信息 = 获取地图难度信息(Envir)
    
    // 获取生物类型
    const 生物类型 = 获取生物类型(Tag)
    const 配置 = 生物配置表[生物类型]
    
    if (!配置) {
        console.log(`[生物属性] 未找到生物类型配置: ${生物类型}`)
        return
    }
    
    // 生成怪物随机技能
    const 技能信息 = 生成怪物随机技能(生物类型)
    
    // ==================== 计算属性（大数值版） ====================
    
    // 使用锚点系统计算倍数（大数值字符串）
    const 锚点 = 地图信息.锚点信息
    const 生物强度 = 锚点.生物强度倍数  // 已经是大数值字符串
    const 星级难度倍数 = 计算星级难度倍数(地图信息.固定星级)  // 使用固定星级计算难度倍数
    const 地图等级倍数 = String(地图信息.地图等级)
    let 攻击倍数 = js_范围随机('5','50')
    let 防御倍数 = js_范围随机('1','20')
    
    // 计算最终属性（基础值 * 地图倍数 * 星级难度倍数 * 固定倍数 * 随机倍数）
    // 全部使用智能计算进行大数值运算
    let 血量 = 智能计算(配置.血量基础, 生物强度, 3)
    血量 = 智能计算(血量, 星级难度倍数, 3)
    血量 = 智能计算(血量, 地图等级倍数, 3)
    血量 = 智能计算(血量, '200', 3)
    血量 = 应用随机倍数(血量)
    
    let 攻击 = 智能计算(配置.攻击基础, 生物强度, 3)
    攻击 = 智能计算(攻击, 星级难度倍数, 3)
    攻击 = 智能计算(攻击, 地图等级倍数, 3)
    攻击 = 智能计算(攻击, 攻击倍数, 3)
    攻击 = 应用随机倍数(攻击)
    
    let 防御 = 智能计算(配置.防御基础, 生物强度, 3)
    防御 = 智能计算(防御, 星级难度倍数, 3)
    防御 = 智能计算(防御, 地图等级倍数, 3)
    防御 = 智能计算(防御, 防御倍数, 3)
    防御 = 应用随机倍数(防御)
    
    let 魔次抵抗 = 智能计算(防御, '10000', 4)
    // 经验值计算（使用地图等级）
    let 经验值 = 地图信息.地图等级 * 配置.经验倍数
    
    // 根据技能调整属性
    const 血量技能倍数 = 获取技能2血量倍数(技能信息.技能2)
    const 攻击技能倍数 = 获取技能2攻击倍数(技能信息.技能2)
    const 防御技能倍数 = 获取技能2防御倍数(技能信息.技能2)
    
    if (血量技能倍数 != 100) {
        血量 = 智能计算(血量, String(血量技能倍数), 3)
        血量 = 智能计算(血量, '10', 4)
    }
    if (攻击技能倍数 != 100) {
        攻击 = 智能计算(攻击, String(攻击技能倍数), 3)
        攻击 = 智能计算(攻击, '100', 4)
    }
    if (防御技能倍数 != 100) {
        防御 = 智能计算(防御, String(防御技能倍数), 3)
        防御 = 智能计算(防御, '100', 4)
    }

    if (地图信息.地图等级 < 1000 || 比较( 魔次抵抗 , '1') < 0){
        魔次抵抗 = '0'
    }
    
    // ==================== 设置怪物属性 ====================
    
    // 基础属性（引擎限制内的固定值）
    Monster.SetDCMax(999)
    Monster.SetDCMin(999)
    Monster.SetACMax(0)
    Monster.SetACMin(0)
    Monster.SetMaxHP(99999999999999)
    Monster.SetHP(99999999999999)
    
    // 经验和爆率
    Monster.SetExp(经验值)
    Monster.SetDropName(地图信息.爆率文件)
    Monster.SetDropItemRate(配置.爆率倍数)
    
    // 攻速移速
    Monster.SetAttackSpeed(技能信息.攻速移速)
    Monster.SetWalkSpeed(技能信息.攻速移速)
    Monster.SetAttackRange(技能信息.距离)
    
    // 颜色和称号
    Monster.SetNameColor(配置.颜色)
    if (配置.称号 > 0) {
        Monster.SetTitleEffect(配置.称号)
    }
    
    // 设置变量
    Monster.SetNVar(怪物类型, 生物类型)
    Monster.SetNVar(怪物等级, 地图信息.装备等级)
    Monster.SetNVar(怪物经验值, 经验值)
    Monster.SetNVar(怪物攻速移速, 技能信息.攻速移速)
    Monster.SetNVar(怪物显示称号, 配置.称号)
    Monster.SetNVar(怪物变量等级, 地图信息.地图等级)
    Monster.SetNVar(TAG, Tag % 10)
    
    Monster.SetSVar(怪物爆率文件, 地图信息.爆率文件)
    Monster.SetSVar(基础数值, 配置.血量基础)
    
    // 设置怪物技能变量
    设置怪物技能变量(Monster, 技能信息)
    Monster.SetTriggerSelectMagicBeforeAttack(true)
    Monster.SetConfuseBitTimeBeAttacked(true)
    
    // 存储计算后的属性（用于战斗计算）
    Monster.SetSVar(91, 血量)  // 当前血量
    Monster.SetSVar(92, 血量)  // 最大血量
    Monster.SetSVar(93, 攻击)  // 攻击
    Monster.SetSVar(94, 防御)  // 防御
    Monster.SetSVar(95, 魔次抵抗)  // 魔次抵抗
    Monster.SetSVar(96, 防御)  // 防御大
    
    // 生成怪物名字
    const 怪物原始名字 = Monster.GetSVar(原始名字) || Monster.GetName()
    const 怪物技能名字 = 生成怪物技能名字(技能信息, 怪物原始名字 )
    Monster.SetSVar(97, 怪物技能名字)
    Monster.Name = 怪物技能名字
    
    // 广播特殊怪物出现
    if (生物类型 === 生物类型枚举.大陆BOSS) {
        GameLib.BroadcastCountDownMessage(`{s=【大陆BOSS】;c=247}${Monster.Name} 出现在 ${Envir.DisplayName} 坐标 ${Monster.GetMapX()} ${Monster.GetMapY()} 显示时间:<$Time:20$>…`)
    } else if (生物类型 === 生物类型枚举.特殊BOSS) {
        GameLib.BroadcastTopMessage(`{s=【特殊BOSS】${Monster.Name} 出现在 ${Envir.DisplayName} 坐标 ${Monster.GetMapX()} ${Monster.GetMapY()};c=249}`)
        GameLib.BroadcastCountDownMessage(`{s=【特殊BOSS】${Monster.Name} 出现在 ${Envir.DisplayName};c=249} 显示时间:<$Time:20$>…`)
    }
    
    // 存储怪物信息到全局
    const 怪物信息 = {
        怪物名字: Monster.GetSVar(97),
        怪物等级: String(Monster.Level),
        血量: 血量,
        攻击: 攻击,
        防御: 防御,
        怪物颜色: 配置.颜色,
        怪物标志: Tag,
        生物类型: 生物类型,
        地图等级: 地图信息.地图等级,
    }
    GameLib.R.怪物信息 = GameLib.R.怪物信息 || {}
    GameLib.R.怪物信息[`${Monster.Handle}`] = JSON.stringify(怪物信息)
    Monster.SetSVar(98, JSON.stringify(怪物信息))
    
    // 显示血量
    血量显示(Monster)
}

// ==================== 辅助函数 ====================

/**
 * 获取随机小数（用于兼容旧代码）
 */
export function getRandomDecimal(min: number, max: number): number {
    if (min >= max) {
        return min
    }
    return min + (max - min) * Math.random()
}

/**
 * 根据地图刷新特殊BOSS（杀怪2000后调用）
 */
export function 刷新特殊BOSS(Envir: TEnvirnoment, x: number, y: number): void {
    // 特殊BOSS的Tag尾数为7
    const 特殊BOSSTag = 7
    // 这里需要调用引擎的刷怪函数，具体实现取决于引擎API
    // Envir.CreateMonster('特殊BOSS名字', x, y, 特殊BOSSTag)
}

/**
 * 检查是否应该刷新大陆BOSS
 * @param 章节名 当前章节名称（如"生化篇章"）
 */
export function 检查大陆BOSS刷新(章节名: string): boolean {
    // 大陆BOSS在整个章节的所有地图都有概率刷新
    // 具体刷新逻辑可以在定时器中调用
    return random(1000) < 1  // 0.1%概率
}
