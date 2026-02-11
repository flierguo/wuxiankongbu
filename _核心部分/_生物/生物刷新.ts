/**
 * 生物刷新系统 - 基于地图面积的智能刷怪
 * 配置在 世界配置.ts 中统一管理
 * 生物属性在 生物属性.ts 中根据TAG自动计算
 * 
 * 刷怪逻辑：
 * - TAG 1-5: 首次进入10秒后刷全怪，5分钟补怪
 * - TAG 6: 大陆BOSS，2小时检测，没有则补怪
 * - TAG 7: 特殊BOSS，击杀2000怪触发
 * 
 */

import { 取地图 } from '../_地图/地图'
import {
    TAG刷怪比例,
    取生物名字,
    智能计算刷怪数量,
    取完整地图配置,
    完整地图配置
} from '../世界配置'

// ==================== 默认配置 ====================
const 默认配置 = {
    首次刷怪延迟: 10,        // 第一次进地图10秒后刷全怪
    补怪检测间隔: 300,       // 每5分钟检测补怪
    大陆BOSS检测间隔: 7200,  // 2小时检测大陆BOSS
    特殊BOSS击杀触发: 4000,  // 击杀4000怪触发
    补怪阈值: 0.5,           // 怪物数量低于50%时补怪
    无人清理延迟: 120,       // 地图无玩家2分钟（120秒）后清理
}

// ==================== 刷怪倍率初始化 ====================
/** 获取高TAG刷怪倍率（TAG 5/6/7），专区服务器翻倍 */
function 获取高TAG刷怪倍率(): number {
    GameLib.R.刷怪倍率 ??= 1
    if (GameLib.R.刷怪倍率 === 1 && GameLib.ServerName.includes('专区')) {
        GameLib.R.刷怪倍率 = 2
    }
    return GameLib.R.刷怪倍率
}

// ==================== 刷怪状态管理 ====================
interface 地图刷怪状态 {
    地图ID: string
    地图名: string
    首次刷怪完成: boolean
    首次进入时间: number
    上次补怪时间: number
    击杀计数: number
    大陆BOSS存活: boolean
    特殊BOSS存活: boolean
    目标怪物数: number       // 缓存计算后的目标数量
    无人开始时间: number     // 地图无玩家开始计时
}

function 获取刷怪状态(地图ID: string): 地图刷怪状态 {
    GameLib.R.刷怪状态 ??= {}
    if (!GameLib.R.刷怪状态[地图ID]) {
        GameLib.R.刷怪状态[地图ID] = {
            地图ID,
            地图名: '',
            首次刷怪完成: false,
            首次进入时间: 0,
            上次补怪时间: 0,
            击杀计数: 0,
            大陆BOSS存活: false,
            特殊BOSS存活: false,
            目标怪物数: 0,
            无人开始时间: 0
        }
    }
    return GameLib.R.刷怪状态[地图ID]
}

function 设置刷怪状态(地图ID: string, 状态: Partial<地图刷怪状态>): void {
    Object.assign(获取刷怪状态(地图ID), 状态)
}

// ==================== 核心刷怪函数 ====================

/** 刷新指定TAG的怪物 - 使用地图中心点和智能范围 */
function 刷新怪物(map: TEnvirnoment, 怪物名字: string, TAG: number, 数量: number): void {
    if (!map || 数量 <= 0 || !怪物名字) return

    const 地图宽度 = map.GetMapWidth() || 100
    const 地图高度 = map.GetMapHeight() || 100
    const 中心X = Math.floor(地图宽度 / 2)
    const 中心Y = Math.floor(地图高度 / 2)
    const 刷怪范围 = Math.floor(Math.max(地图宽度, 地图高度) / 2)

    GameLib.MonGenEx(map, 怪物名字, 数量, 中心X, 中心Y, 刷怪范围, 0, 0, TAG, true, true, true, true)
}

/** 
 * 首次刷全怪 - 分批刷新，避免一帧内刷出上千只怪导致卡顿
 * 每次调用刷一个TAG，通过计数器控制分批进度
 */
function 首次刷全怪(map: TEnvirnoment, 地图名: string): void {
    const 地图ID = map.MapName
    const 状态 = 获取刷怪状态(地图ID)
    if (状态.首次刷怪完成) return

    // 计算总怪物数（只算一次，缓存起来）
    if (状态.目标怪物数 <= 0) {
        状态.目标怪物数 = 智能计算刷怪数量(map)
        状态.地图名 = 地图名
    }

    const 总怪物数 = 状态.目标怪物数

    // 使用分批计数器，每秒刷一个TAG（1-5），共5秒刷完
    GameLib.R.刷怪分批进度 ??= {}
    GameLib.R.刷怪分批进度[地图ID] ??= 1
    const 当前TAG = GameLib.R.刷怪分批进度[地图ID] as number

    if (当前TAG <= 5) {
        const 比例 = TAG刷怪比例[当前TAG as keyof typeof TAG刷怪比例]
        let 数量 = Math.floor(总怪物数 * 比例)
        // TAG5 应用高TAG刷怪倍率（专区翻倍）
        if (当前TAG === 5) 数量 = Math.floor(数量 * 获取高TAG刷怪倍率())
        if (数量 > 0) {
            const 怪物名字 = 取生物名字(地图名, 当前TAG)
            刷新怪物(map, 怪物名字, 当前TAG, 数量)
        }
        GameLib.R.刷怪分批进度[地图ID] = 当前TAG + 1
    }

    // 5个TAG全部刷完
    if (当前TAG >= 5) {
        设置刷怪状态(地图ID, { 首次刷怪完成: true, 上次补怪时间: GameLib.TickCount })
        delete GameLib.R.刷怪分批进度[地图ID]
    }
}

/** 补怪检测 - 智能计算 */
function 补怪(map: TEnvirnoment, 地图名: string): void {
    const 状态 = 获取刷怪状态(map.MapName)
    const 当前怪物数 = map.GetMonCount() || 0

    // 使用缓存的目标数量，或重新计算
    let 目标怪物数 = 状态.目标怪物数
    if (目标怪物数 <= 0) {
        目标怪物数 = 智能计算刷怪数量(map)
        状态.目标怪物数 = 目标怪物数
    }

    if (当前怪物数 < 目标怪物数 * 默认配置.补怪阈值) {
        const 需补充总数 = 目标怪物数 - 当前怪物数
        for (let TAG = 1; TAG <= 5; TAG++) {
            const 比例 = TAG刷怪比例[TAG as keyof typeof TAG刷怪比例]
            let 数量 = Math.floor(需补充总数 * 比例)
            // TAG5 应用高TAG刷怪倍率（专区翻倍）
            if (TAG === 5) 数量 = Math.floor(数量 * 获取高TAG刷怪倍率())
            if (数量 > 0) {
                const 怪物名字 = 取生物名字(地图名, TAG)
                刷新怪物(map, 怪物名字, TAG, 数量)
            }
        }
        设置刷怪状态(map.MapName, { 上次补怪时间: GameLib.TickCount })
    }
}


// ==================== TAG 7 大陆BOSS刷新 ====================

/** 
 * 大陆BOSS刷新检测 - 每2小时检测
 * TAG7 = 大陆BOSS（全大陆刷新，最强）
 */
export function 大陆BOSS刷新检测(): void {
    GameLib.R.大陆BOSS上次刷新时间 ??= 0
    const 当前时间 = GameLib.TickCount
    if (当前时间 - GameLib.R.大陆BOSS上次刷新时间 < 默认配置.大陆BOSS检测间隔 * 1000) return

    GameLib.R.大陆BOSS上次刷新时间 = 当前时间
    const 副本池 = 取地图()

    // 难度对应BOSS数量：简单=1, 普通=2, 困难=3, 精英=4, 炼狱=5
    const 难度BOSS数量映射: { [key: string]: number } = {
        '简单': 1,
        '普通': 2,
        '困难': 3,
        '精英': 4,
        '炼狱': 5,
        '圣耀': 10  // 圣耀副本统一10个
    }

    for (const 配置 of 完整地图配置) {
        const 大陆名 = 配置.大陆名
        const 地图名 = 配置.地图名

        for (const 副本 of 副本池) {
            if (!副本?.地图ID || 副本.地图名 !== 地图名) continue

            const map = GameLib.FindMap(副本.地图ID)
            if (!map) continue

            const 状态 = 获取刷怪状态(副本.地图ID)

            // 如果大陆BOSS存活，跳过
            if (状态.大陆BOSS存活) continue

            // 根据难度或圣耀副本确定BOSS数量
            let BOSS数量 = 1
            if (副本.是圣耀副本) {
                BOSS数量 = 10
            } else {
                BOSS数量 = 难度BOSS数量映射[副本.难度] || 1
            }

            // TAG7 = 大陆BOSS（应用高TAG刷怪倍率）
            刷新怪物(map, 配置.大陆BOSS名字, 7, BOSS数量 * 获取高TAG刷怪倍率())
            状态.大陆BOSS存活 = true

            GameLib.BroadcastTopMessage(`{s=【大陆BOSS】${配置.大陆BOSS名字} x${BOSS数量} 出现在 ${map.DisplayName || 地图名}!;c=249}`)
            GameLib.BroadcastCountDownMessage(`{s=【大陆BOSS】;c=249}${配置.大陆BOSS名字} x${BOSS数量} 出现在 ${map.DisplayName || 地图名}! 显示时间:<$Time:20$>…`)
        }
    }
}

// ==================== TAG 6 特殊BOSS刷新 ====================

/** 增加击杀计数 */
export function 增加击杀计数(地图ID: string): void {
    获取刷怪状态(地图ID).击杀计数++
}

/** 特殊BOSS刷新检测 - 击杀2000怪后刷新 */
export function 特殊BOSS刷新检测(): void {
    const 副本池 = 取地图()

    for (const 副本 of 副本池) {
        if (!副本?.地图ID) continue

        const 状态 = 获取刷怪状态(副本.地图ID)
        if (状态.特殊BOSS存活) continue
        if (状态.击杀计数 < 默认配置.特殊BOSS击杀触发) continue

        const map = GameLib.FindMap(副本.地图ID)
        if (!map) continue

        const 配置 = 取完整地图配置(副本.地图名)
        const BOSS名字 = 配置?.特殊BOSS名字 || '特殊BOSS'
        // // TAG6 = 特殊BOSS（应用高TAG刷怪倍率）
        // 刷新怪物(map, BOSS名字, 6, 获取高TAG刷怪倍率())

        // TAG6 = 特殊BOSS
        刷新怪物(map, BOSS名字, 6, 1)

        状态.击杀计数 = 0
        状态.特殊BOSS存活 = true

        GameLib.BroadcastCountDownMessage(`{s=【特殊BOSS】;c=251}${BOSS名字} 出现在 ${map.DisplayName}! 击杀${默认配置.特殊BOSS击杀触发}怪物触发! 显示时间:<$Time:20$>…`)
    }
}

/** 特殊BOSS死亡回调 */
export function 特殊BOSS死亡(地图ID: string): void {
    const 状态 = 获取刷怪状态(地图ID)
    状态.特殊BOSS存活 = false
    状态.击杀计数 = 0
}

/** 大陆BOSS死亡回调 */
export function 大陆BOSS死亡(地图ID: string): void {
    获取刷怪状态(地图ID).大陆BOSS存活 = false
}

/** 获取地图击杀进度（用于玩家界面显示） */
export function 获取击杀进度(地图ID: string): { 当前击杀: number, 需要击杀: number, 特殊BOSS存活: boolean } {
    const 状态 = 获取刷怪状态(地图ID)
    return {
        当前击杀: 状态.击杀计数,
        需要击杀: 默认配置.特殊BOSS击杀触发,
        特殊BOSS存活: 状态.特殊BOSS存活
    }
}

// ==================== 定时器调用接口 ====================

/** 秒钟检测首次刷怪 - 使用计数器降低扫描频率 */
export function 秒钟检测首次刷怪(): void {
    // 性能优化：每2秒扫描一次，而非每秒（降低50%的CPU消耗）
    GameLib.R.刷怪扫描计数器 ??= 0
    GameLib.R.刷怪扫描计数器++
    if (GameLib.R.刷怪扫描计数器 % 2 !== 0) return

    const 副本池 = 取地图()
    const 当前时间 = GameLib.TickCount

    for (const 副本 of 副本池) {
        if (!副本?.地图ID || 副本.地图ID === '') continue
        if (!副本.地图名 || 副本.地图名 === '') continue

        const 状态 = 获取刷怪状态(副本.地图ID)

        // 已完成刷怪的地图直接跳过（最常见情况，提前退出）
        if (状态.首次刷怪完成) continue

        const map = GameLib.FindMap(副本.地图ID)
        if (!map) continue

        const 玩家数量 = map.GetHumCount() || 0

        if (玩家数量 > 0) {
            if (状态.首次进入时间 === 0) {
                状态.首次进入时间 = 当前时间
                GameLib.R[副本.地图ID] = true
            }
            if (当前时间 - 状态.首次进入时间 >= 默认配置.首次刷怪延迟 * 1000) {
                // 分批刷怪：每次调用刷一个TAG
                首次刷全怪(map, 副本.地图名)
            }
        }
    }
}

/** 定时补怪检测 */
export function 定时补怪检测(): void {
    const 副本池 = 取地图()

    for (const 副本 of 副本池) {
        if (!副本?.地图ID) continue

        const map = GameLib.FindMap(副本.地图ID)
        if (!map) continue

        const 玩家数量 = map.GetHumCount() || 0
        const 状态 = 获取刷怪状态(副本.地图ID)

        if (玩家数量 > 0 && 状态.首次刷怪完成) {
            补怪(map, 副本.地图名)
        }
    }
}

/** 五分钟全面补怪 */
export function 五分钟全面补怪(): void {
    const 副本池 = 取地图()

    for (const 副本 of 副本池) {
        if (!副本?.地图ID) continue

        const map = GameLib.FindMap(副本.地图ID)
        if (!map || (map.GetHumCount() || 0) === 0) continue

        补怪(map, 副本.地图名)
    }
}

/** 清理无人地图怪物 - 2分钟无人后清理 */
export function 清理无人地图怪物(): void {
    const 副本池 = 取地图()
    const 当前时间 = GameLib.TickCount

    for (const 副本 of 副本池) {
        if (!副本?.地图ID) continue

        const map = GameLib.FindMap(副本.地图ID)
        if (!map) continue

        const 玩家数量 = map.GetHumCount() || 0
        const 状态 = 获取刷怪状态(副本.地图ID)

        if (玩家数量 === 0 && 状态.首次刷怪完成) {
            // 开始计时或检查是否超过2分钟
            if (状态.无人开始时间 === 0) {
                // 首次检测到无人，开始计时
                状态.无人开始时间 = 当前时间
            } else if (当前时间 - 状态.无人开始时间 >= 默认配置.无人清理延迟 * 1000) {
                // 超过2分钟，清理地图
                状态.首次刷怪完成 = false
                状态.首次进入时间 = 0
                状态.击杀计数 = 0
                状态.大陆BOSS存活 = false
                状态.特殊BOSS存活 = false
                状态.目标怪物数 = 0
                状态.无人开始时间 = 0
                GameLib.ClearMapMon(副本.地图ID)
                GameLib.R[副本.地图ID] = false
            }
        } else if (玩家数量 > 0) {
            // 有玩家，重置无人计时
            状态.无人开始时间 = 0
        }
    }
}
