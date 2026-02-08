/**
 * 地图副本系统
 * 地图配置已迁移到 世界配置.ts 统一管理
 */

import { 装备属性统计 } from '../_装备/属性统计'
import {
    难度系数配置,
    难度列表,
    固定副本数量,
    最大副本数,
    完整地图配置,
    取完整地图配置
} from '../世界配置'

// 重新导出供其他模块使用
export { 难度系数配置, 难度列表, 固定副本数量, 完整地图配置 }

// ==================== 副本信息接口 ====================
interface 副本信息 {
    地图名: string
    地图ID: string
    显示名: string
    固定星级: number
    需求等级: number
    下标: number
    关闭计时器?: number
    难度: string
    // 圣耀副本专属属性
    创建者ID?: string
    创建者名字?: string
    队伍ID?: string
    队伍名字?: string
    是圣耀副本?: boolean
    圣耀倍率?: number
    创建时间?: number
    无人时间?: number
}

// ==================== 初始化函数 ====================
export function 初始化副本池() {
    // 存储配置到 GameLib.R（供其他模块访问）
    GameLib.R.难度系数配置 = 难度系数配置
    GameLib.R.难度列表 = 难度列表
    GameLib.R.完整地图配置 = 完整地图配置

    // 检查是否已初始化
    let 现有副本池 = GameLib.R.地图池 as 副本信息[]
    if (现有副本池 && 现有副本池.length > 0) {
        let 已有固定副本 = false
        for (let i = 1; i < 现有副本池.length; i += 最大副本数) {
            if (现有副本池[i]?.地图ID && 现有副本池[i].地图ID !== '') {
                已有固定副本 = true
                break
            }
        }
        if (已有固定副本) return
    }

    // 初始化副本池数组
    let 副本池: 副本信息[] = []
    for (let i = 0; i < 最大副本数 * 完整地图配置.length; i++) {
        副本池[i] = {
            地图名: '',
            地图ID: '',
            显示名: '',
            固定星级: 0,
            需求等级: 0,
            下标: i,
            难度: ''
        }
    }

    GameLib.R.地图池 = 副本池

    // 为每个地图创建固定难度副本（使用新的难度系数配置）
    完整地图配置.forEach((配置, 索引) => {
        let 起始下标 = 索引 * 最大副本数
        难度列表.forEach((难度名, 难度索引) => {
            let 下标 = 起始下标 + 难度索引 + 1
            let 难度系数 = 难度系数配置[难度名] || 1
            let 实际星级 = 配置.固定星级 * 难度系数
            创建固定副本(配置.地图名, 下标, 实际星级, 配置.需求等级, 难度名)
        })
    })
}

function 创建固定副本(地图名: string, 下标: number, 固定星级: number, 需求等级: number, 难度: string) {
    let 副本池 = GameLib.R.地图池 as 副本信息[]

    if (!副本池 || 下标 < 0 || 下标 >= 副本池.length) return
    if (副本池[下标]?.地图ID && 副本池[下标].地图ID !== '') return

    let map = GameLib.CreateDuplicateMap(地图名, 0)
    if (map) {
        let 显示名 = `${地图名}«${难度}»`
        副本池[下标] = {
            地图名: 地图名,
            地图ID: map.MapName,
            显示名: 显示名,
            固定星级: 固定星级,
            需求等级: 需求等级,
            下标: 下标,
            难度: 难度
        }
        map.DisplayName = 显示名
    }
}

// ==================== 查询函数 ====================
export function 取地图(): 副本信息[] {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    if (!副本池 || 副本池.length === 0) {
        初始化副本池()
        副本池 = GameLib.R.地图池 as 副本信息[]
    }
    return 副本池
}


export function 取地图ID(下标: number): string {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    return 副本池[下标]?.地图ID || ''
}

export function 地图ID取固定星级(地图ID: string): number {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i]?.地图ID === 地图ID) {
            return 副本池[i].固定星级
        }
    }
    return 0
}

export function 地图ID取地图下标(地图ID: string): number {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i]?.地图ID === 地图ID) {
            return 副本池[i].下标
        }
    }
    return 0
}


export function 创建圣耀副本(地图名: string, Player: TPlayObject): number {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    let 配置 = 完整地图配置.find(c => c.地图名 === 地图名)

    if (!配置) {
        Player.MessageBox(`错误：找不到地图配置 ${地图名}`)
        return -1
    }

    let 圣耀倍率 = Player.R.圣耀地图爆率加成 || 1
    if (圣耀倍率 < 1) 圣耀倍率 = 1

    if (Player.Level < 配置.需求等级) {
        Player.MessageBox(`等级不足 (需求等级:${配置.需求等级}, 当前:${Player.Level})`)
        return -1
    }

    let 玩家ID = String(Player.PlayerID)
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i]?.是圣耀副本 && 副本池[i].创建者ID === 玩家ID && 副本池[i].地图ID !== '') {
            Player.R.待重建圣耀副本地图名 = 地图名
            Player.R.待关闭圣耀副本下标 = i
            Player.Question(`您已有一个圣耀副本: ${副本池[i].显示名}，是否关闭并重新创建？`, `传送阵法.确认重建圣耀副本`, '')
            return -1
        }
    }

    let 地图索引 = 完整地图配置.findIndex(c => c.地图名 === 地图名)
    if (地图索引 === -1) return -1

    let 起始下标 = 地图索引 * 最大副本数
    let 可用下标 = -1

    for (let i = 起始下标 + 固定副本数量 + 1; i < 起始下标 + 最大副本数; i++) {
        if (!副本池[i] || !副本池[i].地图ID || 副本池[i].地图ID === '') {
            可用下标 = i
            break
        }
    }

    if (可用下标 === -1) {
        Player.MessageBox(`${地图名} 已达到最大副本数，请稍后再试`)
        return -1
    }

    let map = GameLib.CreateDuplicateMap(地图名, 1440)
    if (map) {
        let 显示名 = `${地图名}«圣耀${圣耀倍率}倍»`
        let 队伍队长 = Player.GetGroupOwner()
        let 队伍ID = 队伍队长 ? String(队伍队长.PlayerID) : ''
        let 队长名字 = 队伍队长 ? 队伍队长.GetName() : ''

        副本池[可用下标] = {
            地图名: 地图名,
            地图ID: map.MapName,
            显示名: 显示名,
            固定星级: 配置.固定星级 * 圣耀倍率,
            需求等级: 配置.需求等级,
            下标: 可用下标,
            难度: '圣耀',
            创建者ID: 玩家ID,
            创建者名字: Player.GetName(),
            队伍ID: 队伍ID,
            队伍名字: 队长名字,
            是圣耀副本: true,
            圣耀倍率: 圣耀倍率,
            创建时间: GameLib.TickCount,
            无人时间: 0
        }

        map.DisplayName = 显示名
        console.log(`创建圣耀副本成功: ${显示名}, 创建者: ${Player.GetName()}`)

        进入圣耀副本(Player, 可用下标)
        return 可用下标
    }

    return -1
}

export function 检查圣耀副本权限(Player: TPlayObject, 下标: number): boolean {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    let 副本 = 副本池[下标]

    if (!副本 || !副本.是圣耀副本 || !副本.地图ID) return false

    let 玩家ID = String(Player.PlayerID)
    if (副本.创建者ID === 玩家ID) return true

    let 队伍队长 = Player.GetGroupOwner()
    let 玩家队伍ID = 队伍队长 ? String(队伍队长.PlayerID) : ''
    if (副本.队伍ID && 副本.队伍ID !== '' && 玩家队伍ID === 副本.队伍ID) return true

    return false
}

export function 进入圣耀副本(Player: TPlayObject, 下标: number): boolean {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    let 副本 = 副本池[下标]

    if (!副本 || !副本.地图ID) {
        Player.MessageBox('副本不存在或已关闭')
        return false
    }

    if (副本.是圣耀副本 && !检查圣耀副本权限(Player, 下标)) {
        Player.MessageBox('您没有权限进入此圣耀副本！')
        return false
    }

    Player.RandomMove(副本.地图ID)

    if (副本.是圣耀副本) {
        Player.R.圣耀副本爆率加成 = true
        Player.R.圣耀副本倍率 = 副本.圣耀倍率 || 1
        Player.R.当前圣耀副本ID = 副本.地图ID
        装备属性统计(Player)
        Player.SendMessage(`{S=【圣耀副本】;C=250}进入圣耀副本，爆率提升 {S=${副本.圣耀倍率};C=253} %！`, 1)
    }

    return true
}

export function 离开圣耀副本检测(Player: TPlayObject): void {
    if (Player.R.圣耀副本爆率加成) {
        let 当前地图 = Player.GetMapName()
        if (当前地图 !== Player.R.当前圣耀副本ID) {
            Player.R.圣耀副本爆率加成 = false
            Player.R.圣耀副本倍率 = 0
            Player.R.当前圣耀副本ID = ''
            装备属性统计(Player)
            Player.MessageBox(`{S=【圣耀副本】;C=254}离开圣耀副本，爆率加成已取消`)
        }
    }
}

export function 关闭圣耀副本(下标: number): void {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    let 副本 = 副本池[下标]

    if (!副本 || !副本.是圣耀副本 || !副本.地图ID || 副本.地图ID === '') return

    console.log(`手动关闭圣耀副本: ${副本.显示名}`)
    GameLib.ClearMapMon(副本.地图ID)
    GameLib.CloseDuplicateMap(副本.地图ID)

    副本池[下标] = {
        地图名: '', 地图ID: '', 显示名: '', 固定星级: 0, 需求等级: 0,
        下标: 下标, 难度: ''
    }
}

export function 确认重建圣耀副本(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 地图名 = Player.R.待重建圣耀副本地图名
    let 旧副本下标 = Player.R.待关闭圣耀副本下标

    if (!地图名 || 旧副本下标 === undefined) {
        Player.MessageBox('操作已过期，请重新尝试')
        return
    }

    关闭圣耀副本(旧副本下标)
    Player.R.待重建圣耀副本地图名 = undefined
    Player.R.待关闭圣耀副本下标 = undefined
    创建圣耀副本(地图名, Player)
}

export function 圣耀副本清理(): void {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    let 当前时间 = GameLib.TickCount
    let 二十四小时毫秒 = 24 * 60 * 60 * 1000
    let 三十分钟秒数 = 30 * 60

    for (let i = 0; i < 副本池.length; i++) {
        let 副本 = 副本池[i]
        if (!副本 || !副本.是圣耀副本 || !副本.地图ID || 副本.地图ID === '') continue

        let map = GameLib.FindMap(副本.地图ID)
        if (!map) continue

        let 玩家数量 = map.GetHumCount() || 0
        let 需要删除 = false

        if (副本.创建时间 && (当前时间 - 副本.创建时间) >= 二十四小时毫秒) {
            需要删除 = true
        }

        if (玩家数量 < 1) {
            副本.无人时间 = (副本.无人时间 || 0) + 60
            if (副本.无人时间 >= 三十分钟秒数) 需要删除 = true
        } else {
            副本.无人时间 = 0
        }

        if (需要删除) {
            console.log(`圣耀副本清理: ${副本.显示名}`)
            GameLib.ClearMapMon(副本.地图ID)
            GameLib.CloseDuplicateMap(副本.地图ID)
            副本池[i] = {
                地图名: '', 地图ID: '', 显示名: '', 固定星级: 0, 需求等级: 0,
                下标: i, 难度: ''
            }
        }
    }
}


// ==================== 副本清理函数 ====================
export function 副本清理(): void {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    Randomize()

    for (let i = 0; i < 副本池.length; i++) {
        if (!副本池[i] || 副本池[i].地图ID === '') continue

        let map = GameLib.FindMap(副本池[i].地图ID)
        if (!map) continue

        GameLib.R[`副本_${i}_检测清理`] ??= 0
        let 玩家数量 = map.GetHumCount() || 0
        let 已激活 = GameLib.R[副本池[i].地图ID] === true

        if (玩家数量 < 1 && GameLib.R[`副本_${i}_检测清理`] < 30 && 已激活) {
            GameLib.R[`副本_${i}_检测清理`]++

            if (GameLib.R[`副本_${i}_检测清理`] >= 10) {
                let 是固定副本 = (副本池[i].下标 % 最大副本数) >= 1 && (副本池[i].下标 % 最大副本数) <= 固定副本数量

                if (是固定副本) {
                    GameLib.ClearMapMon(副本池[i].地图ID)
                    GameLib.R[`副本_${i}_检测清理`] = 0
                    GameLib.R[副本池[i].地图ID] = false
                } else {
                    GameLib.ClearMapMon(副本池[i].地图ID)
                    GameLib.CloseDuplicateMap(副本池[i].地图ID)
                    GameLib.R[副本池[i].地图ID] = false
                    GameLib.R[`副本_${i}_检测清理`] = 0
                    副本池[i].地图ID = ''
                    副本池[i].显示名 = ''
                    副本池[i].固定星级 = 0
                    副本池[i].需求等级 = 0
                    副本池[i].难度 = ''
                }
                console.log(`副本 ${map.DisplayName} 已重置`)
            }
        } else if (玩家数量 > 0) {
            GameLib.R[`副本_${i}_检测清理`] = 0
        }
    }
}


// ==================== 工具函数（从世界配置导入） ====================
export { 取完整地图配置 } from '../世界配置'
