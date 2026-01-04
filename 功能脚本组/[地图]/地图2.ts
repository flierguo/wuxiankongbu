interface 副本信息 {
    地图名: string
    地图ID: string
    显示名: string
    固定星级: number
    需求等级: number
    挑战倍数: number
    下标: number
    关闭计时器?: number
    地图等级: number
    难度: string
    // 圣耀副本专属属性
    创建者ID?: string        // 创建者玩家ID
    队伍ID?: string          // 队伍ID（如果有）
    是圣耀副本?: boolean     // 是否为圣耀副本
    圣耀倍率?: number        // 圣耀倍率
    创建时间?: number        // 创建时间戳
    无人时间?: number        // 无玩家计时（秒）
}

// ==================== 常量定义 ====================
// 难度等级常量
export const 难度等级 = {
    简单: { 名称: '简单', 倍数: 1, 下标偏移: 0 },
    普通: { 名称: '普通', 倍数: 2, 下标偏移: 1 },
    困难: { 名称: '困难', 倍数: 3, 下标偏移: 2 },
    精英: { 名称: '精英', 倍数: 5, 下标偏移: 3 },
    炼狱: { 名称: '炼狱', 倍数: 10, 下标偏移: 4 },
} as const

export const 难度列表 = ['简单', '普通', '困难', '精英', '炼狱'] as const
export const 固定副本数量 = 5  // 每个地图的固定副本数量

// 地图名称常量
export const 地图名称 = {
    浣熊市: '浣熊市',
    蜂巢入口: '蜂巢入口',
    病毒研究室: '病毒研究室',
    生化实验室: '生化实验室',
    激光走廊: '激光走廊',
    红后控制室: '红后控制室',
} as const

// 地图配置
export const 地图配置 = [
    { 地图名: 地图名称.浣熊市,     下标: 1,   固定星级: 1,   需求等级: 1,   地图等级: 100 },
    { 地图名: 地图名称.蜂巢入口,   下标: 11,  固定星级: 2,   需求等级: 50,  地图等级: 200 },
    { 地图名: 地图名称.病毒研究室, 下标: 21,  固定星级: 3,   需求等级: 100, 地图等级: 300 },
    { 地图名: 地图名称.生化实验室, 下标: 31,  固定星级: 4,   需求等级: 150, 地图等级: 400 },
    { 地图名: 地图名称.激光走廊,   下标: 41,  固定星级: 5,   需求等级: 200, 地图等级: 500 },
    { 地图名: 地图名称.红后控制室, 下标: 51,  固定星级: 6,   需求等级: 250, 地图等级: 600 },
]

const 最大副本数 = 10

// ==================== 初始化函数 ====================
export function 初始化副本池() {
    GameLib.R.地图池 = []
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    
    // 存储地图名称和难度到 GameLib.R
    GameLib.R.地图名称 = 地图名称
    GameLib.R.难度等级 = 难度等级
    GameLib.R.难度列表 = 难度列表
    GameLib.R.地图配置 = 地图配置
    
    // 检查是否已初始化
    if (副本池.length > 0) {
        let 已有固定副本 = false
        for (let i = 1; i < 副本池.length; i += 最大副本数) {
            if (副本池[i]?.地图ID && 副本池[i].地图ID !== '') {
                已有固定副本 = true
                break
            }
        }
        if (已有固定副本) {
            console.log('固定副本已存在，跳过重复初始化')
            return
        }
    }
    
    // 初始化副本池数组
    副本池 = []
    for (let i = 0; i < 最大副本数 * 地图配置.length; i++) {
        副本池[i] = {
            地图名: '',
            地图ID: '',
            显示名: '',
            固定星级: 0,
            需求等级: 0,
            挑战倍数: 0,
            下标: i,
            地图等级: 0,
            难度: ''
        }
    }
    
    GameLib.R.地图池 = 副本池
    GameLib.R.挑战倍数 ??= [1]

    // 为每个地图创建5个固定难度副本
    地图配置.forEach((配置, 索引) => {
        let 起始下标 = 索引 * 最大副本数
        难度列表.forEach((难度名, 难度索引) => {
            let 下标 = 起始下标 + 难度索引 + 1  // 1-5
            let 难度配置 = 难度等级[难度名]
            let 实际星级 = 配置.固定星级 * 难度配置.倍数
            创建固定副本(配置.地图名, 下标, 实际星级, 配置.需求等级, 配置.地图等级, 难度名)
        })
    })

    console.log(`副本池初始化完成，总长度: ${副本池.length}`)
}

function 创建固定副本(地图名: string, 下标: number, 固定星级: number, 需求等级: number, 地图等级: number, 难度: string) {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    
    if (下标 < 0 || 下标 >= 副本池.length) return
    if (副本池[下标]?.地图ID && 副本池[下标].地图ID !== '') {
        console.log(`下标 ${下标} 已有副本，跳过`)
        return
    }
    
    let map = GameLib.CreateDuplicateMap(地图名, 0)
    if (map) {
        let 显示名 = `${地图名}(${难度})`
        副本池[下标] = {
            地图名: 地图名,
            地图ID: map.MapName,
            显示名: 显示名,
            固定星级: 固定星级,
            需求等级: 需求等级,
            挑战倍数: 1,
            下标: 下标,
            地图等级: 地图等级,
            难度: 难度
        }
        map.DisplayName = 显示名
        // console.log(`创建固定副本: ${显示名}, 星级:${固定星级}, 地图等级:${地图等级}`)
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

export function 取副本信息(下标: number): 副本信息 | null {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    if (下标 < 0 || 下标 >= 副本池.length || !副本池[下标]?.地图ID) {
        return null
    }
    return 副本池[下标]
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

// ==================== 地图名转换函数 ====================
export function 地图本名取地图下标(地图Name: string): number[] {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    let 下标: number[] = []
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i]?.地图名 === 地图Name) {
            下标.push(i)
        }
    }
    return 下标
}

export function 地图显名取地图ID(地图名: string): string {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i]?.显示名 === 地图名) {
            return 副本池[i].地图ID
        }
    }
    return ''
}

export function ID取地图名(副本ID: string): string {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i]?.地图ID === 副本ID) {
            return 副本池[i].地图名
        }
    }
    return '未知'
}

// ==================== 副本创建函数 ====================
export function 创建副本(地图名: string, 下标数组: number[], 固定星级: number, 需求等级: number) {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    
    // 检查是否已存在相同配置的副本
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i]?.地图名 === 地图名 && 
            副本池[i].固定星级 === 固定星级 && 
            副本池[i].需求等级 === 需求等级 &&
            副本池[i].地图ID !== '') {
            console.log(`已存在相同配置的副本: ${地图名} (星级:${固定星级})，跳过创建`)
            return
        }
    }

    下标数组.forEach(下标 => {
        if (下标 >= 0 && 下标 < 副本池.length) {
            if (副本池[下标]?.地图ID && 副本池[下标].地图ID !== '') {
                console.log(`下标 ${下标} 已有副本，跳过创建`)
                return
            }
            
            let map = GameLib.CreateDuplicateMap(地图名, 1440)
            if (map) {
                副本池[下标] = {
                    地图名: 地图名,
                    地图ID: map.MapName,
                    显示名: `${地图名}(${固定星级}星)`,
                    固定星级: 固定星级,
                    需求等级: 需求等级,
                    挑战倍数: GameLib.R.挑战倍数[0] || 1,
                    下标: 下标,
                    地图等级: 固定星级,
                    难度: ''
                }
                map.DisplayName = 副本池[下标].显示名
            }
        }
    })
}

export function 创建单个副本(地图名: string, Player: TPlayObject): number {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    let 地图星级 = 0
    let 配置 = 地图配置.find(c => c.地图名 === 地图名)
    
    if (!配置) {
        console.log(`错误：找不到地图配置 ${地图名}`)
        return -1
    }
    
    地图星级 = 配置.固定星级 * Player.V.挑战倍数
    
    // 检查是否已存在相同配置的副本
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i]?.地图名 === 地图名 && 
            副本池[i].显示名 === `${地图名}(${地图星级}星)` &&
            副本池[i].地图ID !== '') {
            Player.MessageBox(`已存在相同配置的副本: ${地图名}(${地图星级}星)，请勿重复创建！`)
            return -1
        }
    }

    // 检查玩家等级
    if (Player.Level < 配置.需求等级) {
        Player.MessageBox(`等级不足 (需求等级:${配置.需求等级}, 当前:${Player.Level})`)
        return -1
    }

    // 查找该地图类型的可用下标（跳过固定副本位置1-5）
    let 地图索引 = 地图配置.findIndex(c => c.地图名 === 地图名)
    if (地图索引 === -1) return -1

    let 起始下标 = 地图索引 * 最大副本数
    let 可用下标 = -1

    // 从第6个位置开始查找（1-5是固定副本）
    for (let i = 起始下标 + 固定副本数量 + 1; i < 起始下标 + 最大副本数; i++) {
        if (!副本池[i] || !副本池[i].地图ID) {
            可用下标 = i
            break
        }
    }

    if (可用下标 === -1) {
        console.log(`错误：${地图名} 已达到最大副本数`)
        return -1
    }

    GameLib.R.挑战倍数 ??= []
    GameLib.R.挑战倍数.push(Player.V.挑战倍数)
    GameLib.R.当前挑战倍数 = Player.V.挑战倍数

    地图星级 = 配置.固定星级 * Player.V.挑战倍数
    
    let map = GameLib.CreateDuplicateMap(地图名, 0)
    if (map) {
        副本池[可用下标] = {
            地图名: 地图名,
            地图ID: map.MapName,
            显示名: `${地图名}(${地图星级}星)`,
            固定星级: 配置.固定星级,
            需求等级: 配置.需求等级,
            挑战倍数: 地图星级,
            下标: 可用下标,
            地图等级: 配置.地图等级,
            难度: ''
        }

        map.DisplayName = 副本池[可用下标].显示名
        console.log(`创建单个副本成功: ${副本池[可用下标].显示名} : ${副本池[可用下标].地图ID}`)

        Player.RandomMove(map.MapName)
        return 可用下标
    }

    return -1
}

// ==================== 圣耀副本系统 ====================
/**
 * 创建圣耀副本（单人/组队专属副本）
 * - 只有创建者和同队伍玩家可进入
 * - 副本持续24小时，无人30分钟后自动删除
 * - 进入时给予爆率加成标记
 */
export function 创建圣耀副本(地图名: string, Player: TPlayObject): number {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    let 配置 = 地图配置.find(c => c.地图名 === 地图名)
    
    if (!配置) {
        Player.MessageBox(`错误：找不到地图配置 ${地图名}`)
        return -1
    }

    // 读取玩家圣耀地图爆率加成
    let 圣耀倍率 = Player.R.圣耀地图爆率加成 || 1
    if (圣耀倍率 < 1) 圣耀倍率 = 1

    // 检查玩家等级
    if (Player.Level < 配置.需求等级) {
        Player.MessageBox(`等级不足 (需求等级:${配置.需求等级}, 当前:${Player.Level})`)
        return -1
    }

    // 检查玩家是否已有圣耀副本
    let 玩家ID = String(Player.PlayerID)
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i]?.是圣耀副本 && 副本池[i].创建者ID === 玩家ID && 副本池[i].地图ID !== '') {
            let 旧副本下标 = i
            let 旧副本名 = 副本池[i].显示名
            // 询问玩家是否关闭之前的副本
            Player.R.待重建圣耀副本地图名 = 地图名
            Player.R.待关闭圣耀副本下标 = 旧副本下标
            Player.Question(`您已有一个圣耀副本: ${旧副本名}，是否关闭并重新创建？`, `地图.确认重建圣耀副本`, '')
            return -1
        }
    }

    // 查找可用下标
    let 地图索引 = 地图配置.findIndex(c => c.地图名 === 地图名)
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

    // 创建副本（24小时 = 1440分钟）
    let map = GameLib.CreateDuplicateMap(地图名, 1440)
    if (map) {
        let 显示名 = `${地图名}(圣耀${圣耀倍率}倍)`
        // 获取队伍队长ID（如果有队伍）
        let 队伍队长 = Player.GetGroupOwner()
        let 队伍ID = 队伍队长 ? String(队伍队长.PlayerID) : ''

        副本池[可用下标] = {
            地图名: 地图名,
            地图ID: map.MapName,
            显示名: 显示名,
            固定星级: 配置.固定星级 * 圣耀倍率,
            需求等级: 配置.需求等级,
            挑战倍数: 圣耀倍率,
            下标: 可用下标,
            地图等级: 配置.地图等级,
            难度: '圣耀',
            // 圣耀副本专属
            创建者ID: 玩家ID,
            队伍ID: 队伍ID,
            是圣耀副本: true,
            圣耀倍率: 圣耀倍率,
            创建时间: GameLib.TickCount,
            无人时间: 0
        }

        map.DisplayName = 显示名
        console.log(`创建圣耀副本成功: ${显示名}, 创建者: ${Player.GetName()}, 队伍队长ID: ${队伍ID || '无'}`)

        // 传送玩家并给予爆率标记
        进入圣耀副本(Player, 可用下标)
        return 可用下标
    }

    return -1
}

/**
 * 检查玩家是否可以进入圣耀副本
 */
export function 检查圣耀副本权限(Player: TPlayObject, 下标: number): boolean {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    let 副本 = 副本池[下标]

    if (!副本 || !副本.是圣耀副本 || !副本.地图ID) {
        return false
    }

    let 玩家ID = String(Player.PlayerID)

    // 创建者可以进入
    if (副本.创建者ID === 玩家ID) {
        return true
    }

    // 同队伍玩家可以进入（通过队长ID判断）
    let 队伍队长 = Player.GetGroupOwner()
    let 玩家队伍ID = 队伍队长 ? String(队伍队长.PlayerID) : ''
    if (副本.队伍ID && 副本.队伍ID !== '' && 玩家队伍ID === 副本.队伍ID) {
        return true
    }

    return false
}

/**
 * 进入圣耀副本（给予爆率标记）
 */
export function 进入圣耀副本(Player: TPlayObject, 下标: number): boolean {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    let 副本 = 副本池[下标]

    if (!副本 || !副本.地图ID) {
        Player.MessageBox('副本不存在或已关闭')
        return false
    }

    // 如果是圣耀副本，检查权限
    if (副本.是圣耀副本 && !检查圣耀副本权限(Player, 下标)) {
        Player.MessageBox('您没有权限进入此圣耀副本！只有创建者和同队伍玩家可以进入。')
        return false
    }

    // 传送玩家
    Player.RandomMove(副本.地图ID)

    // 如果是圣耀副本，给予爆率标记
    if (副本.是圣耀副本) {
        Player.R.圣耀副本爆率加成 = true
        Player.R.圣耀副本倍率 = 副本.圣耀倍率 || 1
        Player.R.当前圣耀副本ID = 副本.地图ID
        Player.SendMessage(`{S=【圣耀副本】;C=250}进入圣耀副本，爆率提升 {S=${副本.圣耀倍率};C=253} 倍！`, 1)
    }

    return true
}

/**
 * 离开圣耀副本（取消爆率标记）
 * 在玩家离开地图时调用
 */
export function 离开圣耀副本检测(Player: TPlayObject): void {
    if (Player.R.圣耀副本爆率加成) {
        let 当前地图 = Player.GetMapName()
        // 如果玩家不在圣耀副本地图中，取消爆率加成
        if (当前地图 !== Player.R.当前圣耀副本ID) {
            Player.R.圣耀副本爆率加成 = false
            Player.R.圣耀副本倍率 = 0
            Player.R.当前圣耀副本ID = ''
            Player.MessageBox(`{S=【圣耀副本】;C=254}离开圣耀副本，爆率加成已取消`)
        }
    }
}

/**
 * 关闭指定圣耀副本
 */
export function 关闭圣耀副本(下标: number): void {
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    let 副本 = 副本池[下标]
    
    if (!副本 || !副本.是圣耀副本 || !副本.地图ID || 副本.地图ID === '') return
    
    console.log(`手动关闭圣耀副本: ${副本.显示名}`)
    GameLib.ClearMapMon(副本.地图ID)
    GameLib.CloseDuplicateMap(副本.地图ID)
    
    // 重置副本信息
    副本池[下标] = {
        地图名: '',
        地图ID: '',
        显示名: '',
        固定星级: 0,
        需求等级: 0,
        挑战倍数: 0,
        下标: 下标,
        地图等级: 0,
        难度: ''
    }
}

/**
 * 确认重建圣耀副本（Question回调）
 */
export function 确认重建圣耀副本(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 地图名 = Player.R.待重建圣耀副本地图名
    let 旧副本下标 = Player.R.待关闭圣耀副本下标
    
    if (!地图名 || 旧副本下标 === undefined) {
        Player.MessageBox('操作已过期，请重新尝试')
        return
    }
    
    let 副本池 = GameLib.R.地图池 as 副本信息[]
    let 旧副本名 = 副本池[旧副本下标]?.显示名 || '未知副本'
    
    // 关闭旧副本
    关闭圣耀副本(旧副本下标)
    Player.SendMessage(`{S=【圣耀副本】;C=254}已关闭旧副本: ${旧副本名}`, 1)
    
    // 清理临时数据
    Player.R.待重建圣耀副本地图名 = undefined
    Player.R.待关闭圣耀副本下标 = undefined
    
    // 重新创建副本
    创建圣耀副本(地图名, Player)
}

/**
 * 圣耀副本清理（每分钟调用）
 * - 24小时到期自动删除
 * - 无人30分钟后删除
 */
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
        let 删除原因 = ''

        // 检查24小时到期
        if (副本.创建时间 && (当前时间 - 副本.创建时间) >= 二十四小时毫秒) {
            需要删除 = true
            删除原因 = '24小时到期'
        }

        // 检查无人30分钟
        if (玩家数量 < 1) {
            副本.无人时间 = (副本.无人时间 || 0) + 60 // 每分钟+60秒
            if (副本.无人时间 >= 三十分钟秒数) {
                需要删除 = true
                删除原因 = '无人30分钟'
            }
        } else {
            副本.无人时间 = 0
        }

        // 执行删除
        if (需要删除) {
            console.log(`圣耀副本清理: ${副本.显示名} (${删除原因})`)
            GameLib.ClearMapMon(副本.地图ID)
            GameLib.CloseDuplicateMap(副本.地图ID)
            
            // 重置副本信息
            副本池[i] = {
                地图名: '',
                地图ID: '',
                显示名: '',
                固定星级: 0,
                需求等级: 0,
                挑战倍数: 0,
                下标: i,
                地图等级: 0,
                难度: ''
            }
        }
    }
}

/**
 * 获取玩家的圣耀爆率加成
 */
export function 取圣耀爆率加成(Player: TPlayObject): number {
    if (Player.R.圣耀副本爆率加成 && Player.R.圣耀副本倍率) {
        return Player.R.圣耀副本倍率
    }
    return 1
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
                // 判断是否为固定副本（下标在1-5范围内）
                let 是固定副本 = (副本池[i].下标 % 最大副本数) >= 1 && (副本池[i].下标 % 最大副本数) <= 固定副本数量
                
                if (是固定副本) {
                    // 固定副本只清怪不关闭
                    GameLib.ClearMapMon(副本池[i].地图ID)
                    GameLib.R[`副本_${i}_检测清理`] = 0
                    GameLib.R[副本池[i].地图ID] = false
                } else {
                    // 非固定副本清怪并关闭
                    GameLib.ClearMapMon(副本池[i].地图ID)
                    GameLib.CloseDuplicateMap(副本池[i].地图ID)
                    GameLib.R[副本池[i].地图ID] = false
                    GameLib.R[`副本_${i}_检测清理`] = 0
                    副本池[i].地图ID = ''
                    副本池[i].显示名 = ''
                    副本池[i].固定星级 = 0
                    副本池[i].需求等级 = 0
                    副本池[i].地图等级 = 0
                    副本池[i].难度 = ''
                }
                console.log(`副本 ${map.DisplayName} 已重置`)
            }
        } else if (玩家数量 > 0) {
            GameLib.R[`副本_${i}_检测清理`] = 0
        }
    }
}

export function 初始化单个副本() {
    初始化副本池()
}

// ==================== 工具函数 ====================
export function 取难度配置(难度名: string) {
    return 难度等级[难度名 as keyof typeof 难度等级] || null
}

export function 取地图配置(地图名: string) {
    return 地图配置.find(c => c.地图名 === 地图名) || null
}

export function 取所有地图名(): string[] {
    return 地图配置.map(c => c.地图名)
}
