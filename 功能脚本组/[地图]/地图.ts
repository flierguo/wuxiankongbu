interface 副本信息 {
    地图名: string
    地图ID: string
    显示名: string
    固定星级: number
    需求等级: number
    挑战倍数: number
    下标: number
    关闭计时器?: number  // 新增关闭计时器字段
    地图等级: number     // 新增地图等级字段
}

const 最大副本数 = 10

const 地图配置 = [
    { 地图名: '荒芜山谷', 下标: 1,   固定星级: 1,   需求等级: 1  },
    { 地图名: '试炼之地', 下标: 11,  固定星级: 2,   需求等级: 40 },
    { 地图名: '血之炼狱', 下标: 21,  固定星级: 3,   需求等级: 80 },
    { 地图名: '竞技洞窟', 下标: 31,  固定星级: 4,   需求等级: 120 },
    { 地图名: '血路之颠', 下标: 41,  固定星级: 5,   需求等级: 150 },
    { 地图名: '沙漠绿洲', 下标: 51,  固定星级: 6,   需求等级: 200 },
    { 地图名: '凄凉之地', 下标: 61,  固定星级: 7,   需求等级: 250 },
    { 地图名: '狂风峭壁', 下标: 71,  固定星级: 8,   需求等级: 300 },
    { 地图名: '崎岖索道', 下标: 81,  固定星级: 9,   需求等级: 350 },
    { 地图名: '风暴峡谷', 下标: 91,  固定星级: 10,  需求等级: 500 },
    { 地图名: '古船遗迹', 下标: 101, 固定星级: 11,  需求等级: 1000 },
    { 地图名: '森林迷宫', 下标: 111, 固定星级: 12,  需求等级: 1200 },
    { 地图名: '古之城墙', 下标: 121, 固定星级: 13,  需求等级: 1400 },
    { 地图名: '暗影迷宫', 下标: 131, 固定星级: 14,  需求等级: 1600 },
    { 地图名: '失落暗殿', 下标: 141, 固定星级: 15,  需求等级: 1800 },
    { 地图名: '神秘古国', 下标: 151, 固定星级: 16,  需求等级: 2000 },
    { 地图名: '海岛遗迹', 下标: 161, 固定星级: 17,  需求等级: 2200 },
    { 地图名: '魔之莽道', 下标: 171, 固定星级: 18,  需求等级: 2400 },
    { 地图名: '盘蛇古迹', 下标: 181, 固定星级: 19,  需求等级: 2600 },
    { 地图名: '泗水祭坛', 下标: 191, 固定星级: 20,  需求等级: 2800 },
    { 地图名: '铁血魔域', 下标: 201, 固定星级: 21,  需求等级: 3000 },
    { 地图名: '血腥森林', 下标: 211, 固定星级: 22,  需求等级: 3200 },
    { 地图名: '蛮荒丛林', 下标: 221, 固定星级: 23,  需求等级: 3400 },
    { 地图名: '血狱皇陵', 下标: 231, 固定星级: 24,  需求等级: 3600 },
    { 地图名: '星空廊道', 下标: 241, 固定星级: 25,  需求等级: 3800 },

    { 地图名: '黑暗森林', 下标: 251, 固定星级: 26,  需求等级: 4000 },
    { 地图名: '郊外平原', 下标: 261, 固定星级: 27,  需求等级: 4200 },
    { 地图名: '天然洞穴', 下标: 271, 固定星级: 28,  需求等级: 4400 },
    { 地图名: '矿区山谷', 下标: 281, 固定星级: 29,  需求等级: 4600 },
    { 地图名: '祖玛回廊', 下标: 291, 固定星级: 30,  需求等级: 4800 },

    { 地图名: '万妖森林', 下标: 301, 固定星级: 31,  需求等级: 5000 },
    { 地图名: '万妖峡谷', 下标: 311, 固定星级: 32,  需求等级: 5200 },
    { 地图名: '万妖之巢', 下标: 321, 固定星级: 33,  需求等级: 5400 },
    { 地图名: '万妖迷宫', 下标: 331, 固定星级: 34,  需求等级: 5600 },
    { 地图名: '万妖祭坛', 下标: 341, 固定星级: 35,  需求等级: 5800 },

    { 地图名: '邪恶洞穴', 下标: 351, 固定星级: 36,  需求等级: 6000 },
    { 地图名: '蛇妖山谷', 下标: 361, 固定星级: 37,  需求等级: 6200 },
    { 地图名: '沃玛寺庙', 下标: 371, 固定星级: 38,  需求等级: 6400 },
    { 地图名: '暗黑蛇谷', 下标: 381, 固定星级: 39,  需求等级: 6600 },
    { 地图名: '沉息之地', 下标: 391, 固定星级: 40,  需求等级: 6800 },

    { 地图名: '神域冰谷', 下标: 401, 固定星级: 41,  需求等级: 7000 },
    { 地图名: '纷争之地', 下标: 411, 固定星级: 42,  需求等级: 7200 },
    { 地图名: '上古禁地', 下标: 421, 固定星级: 43,  需求等级: 7400 },
    { 地图名: '封印之城', 下标: 431, 固定星级: 44,  需求等级: 7600 },
    { 地图名: '神庙主殿', 下标: 441, 固定星级: 45,  需求等级: 7800 },

]

export function 初始化副本池() {
    // 初始化副本池到 GameLib.R.地图池
    GameLib.R.地图池 = [];
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    // 检查是否已经初始化过，避免重复创建
    if (副本池.length > 0) {
        // 检查是否已有固定副本存在（检查第一个固定副本位置）
        let 已有固定副本 = false
        for (let i = 1; i < 副本池.length; i += 最大副本数) {
            if (副本池[i] && 副本池[i].地图ID && 副本池[i].地图ID !== '' && 副本池[i].显示名 && 副本池[i].显示名 !== '') {
                已有固定副本 = true
                break
            }
        }
        
        if (已有固定副本) {
            console.log('固定副本已存在，跳过重复初始化')
            return
        }
    }
    
    // 如果副本池为空或没有固定副本，则重新初始化
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
            地图等级: 0  // 初始化地图等级
        }
    }
    
    // 将副本池存储到GameLib.R.地图池中
    GameLib.R.地图池 = 副本池
    GameLib.R.挑战倍数 ??= [1]

    // 初始化时创建每个地图类型的第一个副本
    地图配置.forEach((配置, 索引) => {
        let 起始下标 = 索引 * 最大副本数
        创建副本(配置.地图名, [起始下标 + 1], 配置.固定星级, 配置.需求等级)
    })

    console.log(`副本长度: `, 副本池.length, `++` + 副本池[1].地图ID + `++` + 副本池[1].地图名 + `++` + 副本池[1].显示名 + `++` + 副本池[1].需求等级 + `++` + 副本池[1].挑战倍数 + `++` + 副本池[1].下标);
}

export function 取地图(): 副本信息[] {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    if (!副本池 || 副本池.length === 0) {
        初始化副本池()
        副本池 = GameLib.R.地图池 as 副本信息[];
    }
    return 副本池;
}

export function 取地图1(): 副本信息[] {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    return 副本池;
}

export function 取地图本名(地图显示名: string): string {
    switch (true) {
        case 地图显示名.includes('荒芜山谷'): return '荒芜山谷'
        case 地图显示名.includes('试炼之地'): return '试炼之地'
        case 地图显示名.includes('血之炼狱'): return '血之炼狱'
        case 地图显示名.includes('竞技洞窟'): return '竞技洞窟'
        case 地图显示名.includes('血路之颠'): return '血路之颠'
        case 地图显示名.includes('沙漠绿洲'): return '沙漠绿洲'
        case 地图显示名.includes('凄凉之地'): return '凄凉之地'
        case 地图显示名.includes('狂风峭壁'): return '狂风峭壁'
        case 地图显示名.includes('崎岖索道'): return '崎岖索道'
        case 地图显示名.includes('风暴峡谷'): return '风暴峡谷'
        case 地图显示名.includes('古船遗迹'): return '古船遗迹'
        case 地图显示名.includes('森林迷宫'): return '森林迷宫'
        case 地图显示名.includes('古之城墙'): return '古之城墙'
        case 地图显示名.includes('暗影迷宫'): return '暗影迷宫'
        case 地图显示名.includes('失落暗殿'): return '失落暗殿'
        case 地图显示名.includes('神秘古国'): return '神秘古国'
        case 地图显示名.includes('海岛遗迹'): return '海岛遗迹'
        case 地图显示名.includes('魔之莽道'): return '魔之莽道'
        case 地图显示名.includes('盘蛇古迹'): return '盘蛇古迹'
        case 地图显示名.includes('泗水祭坛'): return '泗水祭坛'
        case 地图显示名.includes('铁血魔域'): return '铁血魔域'
        case 地图显示名.includes('血腥森林'): return '血腥森林'
        case 地图显示名.includes('蛮荒丛林'): return '蛮荒丛林'
        case 地图显示名.includes('血狱皇陵'): return '血狱皇陵'
        case 地图显示名.includes('星空廊道'): return '星空廊道'
        case 地图显示名.includes('黑暗森林'): return '黑暗森林'
        case 地图显示名.includes('郊外平原'): return '郊外平原'
        case 地图显示名.includes('天然洞穴'): return '天然洞穴'
        case 地图显示名.includes('矿区山谷'): return '矿区山谷'
        case 地图显示名.includes('祖玛回廊'): return '祖玛回廊'
        case 地图显示名.includes('万妖森林'): return '万妖森林'
        case 地图显示名.includes('万妖峡谷'): return '万妖峡谷'
        case 地图显示名.includes('万妖之巢'): return '万妖之巢'
        case 地图显示名.includes('万妖迷宫'): return '万妖迷宫'
        case 地图显示名.includes('万妖祭坛'): return '万妖祭坛'
        case 地图显示名.includes('邪恶洞穴'): return '邪恶洞穴'
        case 地图显示名.includes('蛇妖山谷'): return '蛇妖山谷'
        case 地图显示名.includes('沃玛寺庙'): return '沃玛寺庙'
        case 地图显示名.includes('暗黑蛇谷'): return '暗黑蛇谷'
        case 地图显示名.includes('沉息之地'): return '沉息之地'
        case 地图显示名.includes('神域冰谷'): return '神域冰谷'
        case 地图显示名.includes('纷争之地'): return '纷争之地'
        case 地图显示名.includes('上古禁地'): return '上古禁地'
        case 地图显示名.includes('封印之城'): return '封印之城'
        case 地图显示名.includes('神庙主殿'): return '神庙主殿'

        default: return '未知'
    }
}



export function 取副本信息(下标: number): 副本信息 | null {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    if (下标 < 0 || 下标 >= 副本池.length || !副本池[下标] || !副本池[下标].地图ID) {
        return null
    }
    return 副本池[下标]
}

//地图本名取下标
export function 地图本名取地图下标(地图Name: string): number[] {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    let 下标: number[] = []
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i] && 副本池[i].地图名 == 地图Name) {
            下标.push(i)
        }
    }
    return 下标
}

export function 地图本名取地图ID(地图Name: string): string[] {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    switch (地图Name) {
        case '新手地图': return ['4124']
    }
    let 地图ID: string[] = []
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i] && 副本池[i].地图名 == 地图Name) {
            地图ID.push(副本池[i].地图ID)
        }
    }
    return 地图ID
}

//根据地图显示名取地图ID
export function 地图显名取地图ID(地图名: string): string {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i] && 副本池[i].显示名 == 地图名) {
            return 副本池[i].地图ID
        }
    }
    return ''
}

//根据地图显示名取地图ID
export function 地图显名取地图ID1(地图名: string): string[] {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    let 地图ID: string[] = []
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i] && 副本池[i].显示名 == 地图名) {
            地图ID.push(副本池[i].地图ID)
        }
    }
    return 地图ID
}
export function 取地图ID(下标: number): string {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    return 副本池[下标]?.地图ID || ''
}

export function ID取地图名1(副本ID: string): string[] {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    let 地图名: string[] = []
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i] && 副本池[i].地图ID == 副本ID) {
            地图名.push(副本池[i].地图名)
        }
    }
    return 地图名
}
export function ID取地图名(副本ID: string): string {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i] && 副本池[i].地图ID == 副本ID) {
            return 副本池[i].地图名
        }
    }
    return '未知'
}

export function 取地图固定星级(地图名: string): number {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i] && 副本池[i].地图名 == 地图名) {
            return 副本池[i].固定星级
        }
    }
    return 0
}

export function 地图ID取固定星级(地图ID: string): number {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i] && 副本池[i].地图ID == 地图ID) {
            return 副本池[i].固定星级
        }
    }
    return 0
}

export function 创建副本(地图名: string, 下标数组: number[], 固定星级: number, 需求等级: number) {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    // 检查是否已存在相同配置的副本
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i] && 
            副本池[i].地图名 === 地图名 && 
            副本池[i].固定星级 === 固定星级 && 
            副本池[i].需求等级 === 需求等级 &&
            副本池[i].地图ID !== '' &&
            副本池[i].显示名 !== '') {
            console.log(`已存在相同配置的副本: ${地图名} (星级:${固定星级}, 等级:${需求等级})，跳过创建`)
            return
        }
    }

    下标数组.forEach(下标 => {
        if (下标 >= 0 && 下标 < 副本池.length) {
            // 检查该位置是否已有有效副本
            if (副本池[下标] && 副本池[下标].地图ID && 副本池[下标].地图ID !== '') {
                console.log(`下标 ${下标} 已有副本，跳过创建`)
                return
            }
            
            // 实际创建地图副本
            let map = GameLib.CreateDuplicateMap(地图名, 0)
            if (map) {
                副本池[下标] = {
                    地图名: 地图名,
                    地图ID: map.MapName,
                    显示名: `${地图名}(${固定星级}星)`,
                    固定星级: 固定星级,
                    需求等级: 需求等级,
                    挑战倍数: GameLib.R.挑战倍数[0] || 1,
                    下标: 下标,
                    地图等级: 固定星级  // 设置地图等级等于固定星级
                }
                
                // 设置地图显示名
                map.DisplayName = 副本池[下标].显示名
                // console.log(`创建固定副本成功: ${副本池[下标].显示名} (${固定星级}星, 需求等级:${需求等级}) , 下标: ${下标}, 地图ID: ${map.MapName}, 地图等级: ${副本池[下标].地图等级}`)
            } else {
                console.log(`创建固定副本失败: ${地图名}`)
            }
        }
    })
}

export function 创建单个副本(地图名: string, Player: TPlayObject): number {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    // 检查是否已存在相同配置的副本
    let 地图星级 = 0
    let 配置 = 地图配置.find(c => c.地图名 === 地图名)
    if (配置) {
        地图星级 = 配置.固定星级 * Player.V.挑战倍数
    }
    
    // 检查是否已存在相同配置的副本
    for (let i = 0; i < 副本池.length; i++) {
        if (副本池[i] && 
            副本池[i].地图名 === 地图名 && 
            副本池[i].显示名 === `${地图名}(${地图星级}星)` &&
            副本池[i].地图ID !== '') {
            Player.MessageBox(`已存在相同配置的副本: ${地图名}(${地图星级}星)，请勿重复创建！`)
            return -1
        }
    }

    // 查找配置
    if (!配置) {
        console.log(`错误：找不到地图配置 ${地图名}`)
        return -1
    }

    // 检查玩家等级
    if (Player.Level < 配置.需求等级) {
        Player.MessageBox(`等级不足 (需求等级:${配置.需求等级}, 当前:${Player.Level})`)
        return -1
    }

    // 查找该地图类型的第一个可用下标
    let 地图索引 = 地图配置.findIndex(c => c.地图名 === 地图名)
    if (地图索引 === -1) return -1

    let 起始下标 = 地图索引 * 最大副本数
    let 可用下标 = -1

    for (let i = 起始下标 + 1; i < 起始下标 + 最大副本数; i++) {
        if (!副本池[i] || !副本池[i].地图ID) {
            可用下标 = i
            break
        }
    }

    if (可用下标 === -1) {
        console.log(`错误：${地图名} 已达到最大副本数`)
        return -1
    }

    // 初始化挑战倍数数组
    GameLib.R.挑战倍数 ??= []

    // 记录新的挑战倍数
    GameLib.R.挑战倍数.push(Player.V.挑战倍数)
    GameLib.R.当前挑战倍数 = Player.V.挑战倍数

    地图星级 = 配置.固定星级 * Player.V.挑战倍数  // 使用公共变量计算
    
    let map = GameLib.CreateDuplicateMap(地图名, 0)
    if (map) {
        副本池[可用下标].地图名 = 地图名  // 确保保存原始地图名
        副本池[可用下标].地图ID = map.MapName
        副本池[可用下标].显示名 = `${地图名}(${地图星级}星)`
        副本池[可用下标].固定星级 = 配置.固定星级
        副本池[可用下标].需求等级 = 配置.需求等级
        副本池[可用下标].挑战倍数 = 地图星级
        副本池[可用下标].地图等级 = 配置.固定星级  // 设置地图等级等于固定星级

        map.DisplayName = 副本池[可用下标].显示名
        console.log(`创建单个副本成功: ${副本池[可用下标].显示名} : ${副本池[可用下标].地图ID} (挑战倍数:${地图星级})`)

        Player.RandomMove(map.MapName)
        return 可用下标
    }

    return -1
}


export function 副本清理(): void {
    let 副本池 = GameLib.R.地图池 as 副本信息[];
    Randomize()
    for (let i = 0; i < 副本池.length; i++) {
        // 跳过固定副本(下标%10==1)
        // if (副本池[i].下标 % 10 === 1) continue

        if (副本池[i] && 副本池[i].地图ID != '') {
            let map = GameLib.FindMap(副本池[i].地图ID)
            // console.log(`检测副本 ${副本池[i].显示名} 副本ID: ${副本池[i].地图ID}, 玩家数量: ${map?.GetHumCount()}`)
            if (map) {
                GameLib.R[`副本_${i}_检测清理`] ??= 0
                if ((map.GetHumCount() < 1 || map.GetHumCount() == undefined) && GameLib.R[`副本_${i}_检测清理`] < 30 && GameLib.R[副本池[i].地图ID] == true) {
                    GameLib.R[`副本_${i}_检测清理`]++
                    if (GameLib.R[`副本_${i}_检测清理`] >= 10) {
                        if (副本池[i].下标 % 10 === 1) {
                            GameLib.ClearMapMon(副本池[i].地图ID)
                            GameLib.R[`副本_${i}_检测清理`] = 0
                            GameLib.R[副本池[i].地图ID] = false
                            // console.log(`副本 ${map.DisplayName} 无人，检测清理完成: ${副本池[i].地图ID},状态: ${GameLib.R[副本池[i].地图ID]}`)
                        } else {
                            GameLib.ClearMapMon(副本池[i].地图ID)
                            GameLib.CloseDuplicateMap(副本池[i].地图ID)
                            GameLib.R[副本池[i].地图ID] = false
                            GameLib.R[`副本_${i}_检测清理`] = 0
                            副本池[i].地图ID = ''
                            副本池[i].显示名 = ''
                            副本池[i].固定星级 = 0
                            副本池[i].需求等级 = 0
                            副本池[i].地图等级 = 0  // 清理时重置地图等级
                            GameLib.R[`副本_${i}_检测清理`] = 0
                        }
                        console.log(`副本 ${map.DisplayName} 已重置`)
                    }
                } else if (map.GetHumCount() > 0) {
                    GameLib.R[`副本_${i}_检测清理`] = 0
                    // console.log(`副本 ${map.DisplayName} 有人，检测清理次数: ${GameLib.R[`副本_${i}_检测清理`]}`)
                }
            }
        }
    }

    //   GameLib.R.挑战倍数 = [1];
    // Debug('挑战倍数:' + GameLib.R.挑战倍数 + '长度' + GameLib.R.挑战倍数.length)
}


export function 初始化单个副本() {
    // 先初始化副本池
    初始化副本池()
    // console.log(`副本传送: `, 副本池.length, `++`, GameLib.R.副本池.length);
}
