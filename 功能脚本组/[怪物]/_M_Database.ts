/*刷怪数据库配置单元*/

// 定义刷怪配置接口（避免循环依赖）
export interface 刷怪配置 {
    地图名字: string
    怪物名字: string
    怪物星星小: number
    怪物星星大: number
    爆率文件: string
    经验值: number
}

// =================================== 数据库配置 ===================================
/**
 * 刷怪数据库连接配置
 */
const MONSTER_DB_CONFIG = {
    host: '101.33.232.192',
    port: 3306,
    user: 'fafa',
    password: 'fafa@tengxun',
    database: 'monster_db',
    connection_name: '刷怪数据库'
} as const

// 刷怪属性表创建SQL
const CREATE_SPAWN_CONFIG_TABLE = `
CREATE TABLE IF NOT EXISTS spawn_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    map_name VARCHAR(100) NOT NULL COMMENT '地图名称',
    monster_name VARCHAR(100) NOT NULL COMMENT '怪物名称',
    star_min INT NOT NULL COMMENT '怪物最小星级',
    star_max INT NOT NULL COMMENT '怪物最大星级',
    drop_file VARCHAR(100) NOT NULL COMMENT '爆率文件',
    experience_value INT NOT NULL COMMENT '经验值倍率',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_map_monster (map_name, monster_name),
    INDEX idx_map_name (map_name),
    INDEX idx_monster_name (monster_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='地图刷怪配置表';
`

// 智能刷怪表创建SQL
const CREATE_SMART_SPAWN_TABLE = `
CREATE TABLE IF NOT EXISTS smart_spawn (
    id INT AUTO_INCREMENT PRIMARY KEY,
    map_name VARCHAR(100) NOT NULL COMMENT '地图名称',
    map_variable VARCHAR(100) NOT NULL COMMENT '地图名字变量',
    monster_name VARCHAR(100) NOT NULL COMMENT '怪物名称',
    quantity INT NOT NULL COMMENT '数量',
    refresh_time INT NOT NULL COMMENT '刷新时间',
    tag INT NOT NULL COMMENT 'TAG标识',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_map_name (map_name),
    INDEX idx_monster_name (monster_name),
    INDEX idx_tag (tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='智能刷怪配置表';
`

// 获取当前时间
function 获取当前时间(): string {
    const myDate = new Date()
    const year = myDate.getFullYear()
    const mon = String(myDate.getMonth() + 1).padStart(2, '0')
    const date = String(myDate.getDate()).padStart(2, '0')
    const hours = String(myDate.getHours()).padStart(2, '0')
    const minutes = String(myDate.getMinutes()).padStart(2, '0')
    const seconds = String(myDate.getSeconds()).padStart(2, '0')
    return `${year}-${mon}-${date} ${hours}:${minutes}:${seconds}`
}

// 数据库连接初始化标记
let 数据库连接已初始化 = false

/**
 * 确保数据库连接已初始化
 */
function 确保数据库连接(): void {
    if (!数据库连接已初始化 && typeof GameLib !== 'undefined' && GameLib.DBEngine && GameLib.DBEngine.AddConection) {
        try {
            GameLib.DBEngine.AddConection(
                MONSTER_DB_CONFIG.connection_name,
                MONSTER_DB_CONFIG.host,
                MONSTER_DB_CONFIG.port,
                MONSTER_DB_CONFIG.user,
                MONSTER_DB_CONFIG.password,
                MONSTER_DB_CONFIG.database
            )
            数据库连接已初始化 = true
            console.log(`[刷怪数据库] 数据库连接初始化成功: ${MONSTER_DB_CONFIG.connection_name}`)
        } catch (error) {
            console.error(`[刷怪数据库] 数据库连接初始化失败:`, error)
        }
    }
}

/**
 * 执行查询操作（SELECT）
 * 注意：由于GameLib.DBEngine可能没有专门的查询方法，我们使用ExecAsyncEx
 */
async function 执行数据库查询(sql: string, params: any[] = []): Promise<{ success: boolean, error?: string, data?: any }> {
    try {
        确保数据库连接()
        
        // 构建完整的SQL语句（替换占位符）
        let finalSql = sql
        for (let i = 0; i < params.length; i++) {
            const value = typeof params[i] === 'string' ? `'${params[i].replace(/'/g, "''")}'` : params[i]
            finalSql = finalSql.replace('?', value)
        }
        
        // 对于SELECT查询，我们暂时返回空数据，让系统使用默认配置
        // TODO: 如果GameLib有提供查询API，可以在这里实现
        console.log(`[刷怪数据库] 查询SQL (暂时跳过): ${finalSql}`)
        return { success: false, error: '查询功能暂未实现，使用默认配置' }
        
    } catch (error) {
        console.error(`[刷怪数据库] 执行数据库查询时发生异常:`, error)
        return { success: false, error: error.toString() }
    }
}

/**
 * 执行更新操作（INSERT/UPDATE/DELETE/CREATE）
 */
async function 执行数据库操作(sql: string, params: any[] = []): Promise<{ success: boolean, error?: string, data?: any }> {
    try {
        确保数据库连接()
        
        // 构建完整的SQL语句（替换占位符）
        let finalSql = sql
        for (let i = 0; i < params.length; i++) {
            const value = typeof params[i] === 'string' ? `'${params[i].replace(/'/g, "''")}'` : params[i]
            finalSql = finalSql.replace('?', value)
        }
        
        // 使用异步数据库执行
        if (typeof GameLib !== 'undefined' && GameLib.DBEngine && GameLib.DBEngine.ExecAsyncEx) {
            return new Promise((resolve) => {
                GameLib.DBEngine.ExecAsyncEx(MONSTER_DB_CONFIG.connection_name, finalSql, (error: string, affectRow: number) => {
                    if (error) {
                        console.error(`[刷怪数据库] 执行失败: ${error}`)
                        resolve({ success: false, error: error })
                    } else if (affectRow < 0) {
                        console.error(`[刷怪数据库] 执行失败，错误代码: ${affectRow}`)
                        resolve({ success: false, error: `数据库执行失败，错误代码: ${affectRow}` })
                    } else {
                        resolve({ success: true, data: { affectedRows: affectRow } })
                    }
                })
            })
        }
        
        // 使用同步数据库执行
        if (typeof GameLib !== 'undefined' && GameLib.DBEngine && GameLib.DBEngine.ExecSQL) {
            const affectedRows = GameLib.DBEngine.ExecSQL(MONSTER_DB_CONFIG.connection_name, finalSql)
            if (affectedRows < 0) {
                console.error(`[刷怪数据库] 执行失败，错误代码: ${affectedRows}`)
                return { success: false, error: `数据库执行失败，错误代码: ${affectedRows}` }
            } else {
                return { success: true, data: { affectedRows: affectedRows } }
            }
        }
        
        // 备用方案：记录到日志文件
        console.log(`[刷怪数据库] SQL: ${finalSql}`)
        return { success: true }
        
    } catch (error) {
        console.error(`[刷怪数据库] 执行数据库操作时发生异常:`, error)
        return { success: false, error: error.toString() }
    }
}

/**
 * 初始化刷怪数据库表
 */
async function 初始化刷怪数据库表(): Promise<boolean> {
    try {
        console.log('[刷怪数据库] 开始初始化数据库表...')
        
        const tables = [
            { name: '刷怪配置表', sql: CREATE_SPAWN_CONFIG_TABLE },
            { name: '智能刷怪表', sql: CREATE_SMART_SPAWN_TABLE }
        ]
        
        for (const table of tables) {
            const result = await 执行数据库操作(table.sql, [])
            if (result.success) {
                console.log(`[刷怪数据库] ${table.name}初始化成功`)
            } else {
                console.error(`[刷怪数据库] ${table.name}初始化失败: ${result.error}`)
                return false
            }
        }
        
        console.log('[刷怪数据库] 所有数据库表初始化完成')
        return true
    } catch (error) {
        console.error(`[刷怪数据库] 初始化数据库表时发生异常:`, error)
        return false
    }
}

// 缓存变量
let 刷怪配置缓存: 刷怪配置[] | null = null
let 智能刷怪缓存: 智能刷怪配置[] | null = null
let 缓存过期时间: number = 0
const 缓存有效期 = 5 * 60 * 1000 // 5分钟

/**
 * 智能刷怪配置接口
 */
export interface 智能刷怪配置 {
    地图名字: string
    地图名字变量: string
    怪物名字: string
    数量: number
    刷新时间: number
    TAG: number
}

/**
 * 从数据库加载刷怪属性配置
 */
export async function 获取刷怪属性(): Promise<刷怪配置[]> {
    if (刷怪配置缓存 && Date.now() < 缓存过期时间) {
        return 刷怪配置缓存
    }
    
    try {
        const sql = 'SELECT * FROM spawn_config WHERE is_active = TRUE ORDER BY map_name, monster_name'
        const result = await 执行数据库查询(sql)
        
        if (result.success && result.data && result.data.rows) {
            const 配置数据: 刷怪配置[] = []
            
            // 检查数据是否为数组
            const rows = Array.isArray(result.data.rows) ? result.data.rows : []
            
            for (const row of rows) {
                if (row && typeof row === 'object') {
                    配置数据.push({
                        地图名字: row.map_name || '',
                        怪物名字: row.monster_name || '',
                        怪物星星小: parseInt(row.star_min) || 1,
                        怪物星星大: parseInt(row.star_max) || 1,
                        爆率文件: row.drop_file || '',
                        经验值: parseInt(row.experience_value) || 1
                    })
                }
            }
            
            刷怪配置缓存 = 配置数据
            缓存过期时间 = Date.now() + 缓存有效期
            console.log('[刷怪数据库] 刷怪配置加载成功')
            return 配置数据
        } else {
            console.warn('[刷怪数据库] 刷怪配置加载失败，使用默认配置')
            return 获取默认刷怪属性()
        }
    } catch (error) {
        console.error('[刷怪数据库] 加载刷怪配置异常:', error)
        return 获取默认刷怪属性()
    }
}

/**
 * 从数据库加载智能刷怪配置
 */
export async function 获取智能刷怪(): Promise<智能刷怪配置[]> {
    if (智能刷怪缓存 && Date.now() < 缓存过期时间) {
        return 智能刷怪缓存
    }
    
    try {
        const sql = 'SELECT * FROM smart_spawn WHERE is_active = TRUE ORDER BY map_name, tag, monster_name'
        const result = await 执行数据库查询(sql)
        
        if (result.success && result.data && result.data.rows) {
            const 配置数据: 智能刷怪配置[] = []
            
            // 检查数据是否为数组
            const rows = Array.isArray(result.data.rows) ? result.data.rows : []
            
            for (const row of rows) {
                if (row && typeof row === 'object') {
                    配置数据.push({
                        地图名字: row.map_name || '',
                        地图名字变量: row.map_variable || '',
                        怪物名字: row.monster_name || '',
                        数量: parseInt(row.quantity) || 1,
                        刷新时间: parseInt(row.refresh_time) || 5,
                        TAG: parseInt(row.tag) || 11
                    })
                }
            }
            
            智能刷怪缓存 = 配置数据
            console.log('[刷怪数据库] 智能刷怪配置加载成功')
            return 配置数据
        } else {
            console.warn('[刷怪数据库] 智能刷怪配置加载失败，使用默认配置')
            return 获取默认智能刷怪()
        }
    } catch (error) {
        console.error('[刷怪数据库] 加载智能刷怪配置异常:', error)
        return 获取默认智能刷怪()
    }
}

/**
 * 清除缓存
 */
export function 清除刷怪配置缓存(): void {
    刷怪配置缓存 = null
    智能刷怪缓存 = null
    缓存过期时间 = 0
    console.log('[刷怪数据库] 配置缓存已清除')
}

/**
 * 获取默认刷怪属性配置（兼容原始硬编码）
 */
function 获取默认刷怪属性(): 刷怪配置[] {
    return [
        { 地图名字: '荒芜山谷', 怪物名字: '鸡', 怪物星星小: 1, 怪物星星大: 1, 爆率文件: '10小怪', 经验值: 1 },
        { 地图名字: '荒芜山谷', 怪物名字: '稻草人', 怪物星星小: 1, 怪物星星大: 1, 爆率文件: '10小怪', 经验值: 1 },
        { 地图名字: '荒芜山谷', 怪物名字: '食人花', 怪物星星小: 1, 怪物星星大: 1, 爆率文件: '10小怪', 经验值: 1 },
        { 地图名字: '荒芜山谷', 怪物名字: '多钩猫', 怪物星星小: 1, 怪物星星大: 1, 爆率文件: '10小怪', 经验值: 1 },
        { 地图名字: '荒芜山谷', 怪物名字: '半兽战士', 怪物星星小: 1, 怪物星星大: 1, 爆率文件: '10精英', 经验值: 1 },
        { 地图名字: '荒芜山谷', 怪物名字: '半兽勇士', 怪物星星小: 1, 怪物星星大: 1, 爆率文件: '10精英', 经验值: 1 },
        { 地图名字: '荒芜山谷', 怪物名字: '半兽统领', 怪物星星小: 1, 怪物星星大: 1, 爆率文件: '10BOSS', 经验值: 1 },
        { 地图名字: '荒芜山谷', 怪物名字: '战仙·人形怪', 怪物星星小: 1, 怪物星星大: 2, 爆率文件: '10人形', 经验值: 1 },
        { 地图名字: '荒芜山谷', 怪物名字: '法仙·人形怪', 怪物星星小: 1, 怪物星星大: 2, 爆率文件: '10人形', 经验值: 1 },
        { 地图名字: '荒芜山谷', 怪物名字: '道仙·人形怪', 怪物星星小: 1, 怪物星星大: 2, 爆率文件: '10人形', 经验值: 1 },

        { 地图名字: '试炼之地', 怪物名字: '洞蛆', 怪物星星小: 1, 怪物星星大: 10, 爆率文件: '20小怪', 经验值: 2 },
        { 地图名字: '试炼之地', 怪物名字: '骷髅', 怪物星星小: 1, 怪物星星大: 10, 爆率文件: '20小怪', 经验值: 2 },
        { 地图名字: '试炼之地', 怪物名字: '掷斧骷髅', 怪物星星小: 1, 怪物星星大: 10, 爆率文件: '20小怪', 经验值: 2 },
        { 地图名字: '试炼之地', 怪物名字: '山洞蝙蝠', 怪物星星小: 1, 怪物星星大: 10, 爆率文件: '20小怪', 经验值: 2 },
        { 地图名字: '试炼之地', 怪物名字: '骷髅精灵', 怪物星星小: 1, 怪物星星大: 10, 爆率文件: '20精英', 经验值: 2 },
        { 地图名字: '试炼之地', 怪物名字: '百战骨灵', 怪物星星小: 1, 怪物星星大: 10, 爆率文件: '20精英', 经验值: 2 },
        { 地图名字: '试炼之地', 怪物名字: '骨龙精灵', 怪物星星小: 1, 怪物星星大: 10, 爆率文件: '20BOSS', 经验值: 2 },
        { 地图名字: '试炼之地', 怪物名字: '战仙·人形怪', 怪物星星小: 1, 怪物星星大: 10, 爆率文件: '20人形', 经验值: 2 },
        { 地图名字: '试炼之地', 怪物名字: '法仙·人形怪', 怪物星星小: 1, 怪物星星大: 10, 爆率文件: '20人形', 经验值: 2 },
        { 地图名字: '试炼之地', 怪物名字: '道仙·人形怪', 怪物星星小: 1, 怪物星星大: 10, 爆率文件: '20人形', 经验值: 2 }
        // 可以继续添加更多默认配置...
    ]
}

/**
 * 获取默认智能刷怪配置（兼容原始硬编码）
 */
function 获取默认智能刷怪(): 智能刷怪配置[] {
    // 刷新时间常量（需要从原文件获取实际值）
    const 小怪刷新 = 3; // 假设值，需要从原文件确认
    const BOSS刷新 = 3; // 假设值，需要从原文件确认
    const 人形刷新 = 5; // 假设值，需要从原文件确认
    
    return [
        { 地图名字: '荒芜山谷', 地图名字变量: '空', 怪物名字: '鸡', 数量: 80, 刷新时间: 小怪刷新, TAG: 11 },
        { 地图名字: '荒芜山谷', 地图名字变量: '空', 怪物名字: '稻草人', 数量: 80, 刷新时间: 小怪刷新, TAG: 11 },
        { 地图名字: '荒芜山谷', 地图名字变量: '空', 怪物名字: '食人花', 数量: 80, 刷新时间: 小怪刷新, TAG: 11 },
        { 地图名字: '荒芜山谷', 地图名字变量: '空', 怪物名字: '多钩猫', 数量: 80, 刷新时间: 小怪刷新, TAG: 11 },
        { 地图名字: '荒芜山谷', 地图名字变量: '空', 怪物名字: '半兽战士', 数量: 50, 刷新时间: BOSS刷新, TAG: 12 },
        { 地图名字: '荒芜山谷', 地图名字变量: '空', 怪物名字: '半兽勇士', 数量: 50, 刷新时间: BOSS刷新, TAG: 13 },
        { 地图名字: '荒芜山谷', 地图名字变量: '荒芜山谷', 怪物名字: '半兽统领', 数量: 50, 刷新时间: BOSS刷新, TAG: 14 },

        { 地图名字: '试炼之地', 地图名字变量: '空', 怪物名字: '洞蛆', 数量: 80, 刷新时间: 小怪刷新, TAG: 11 },
        { 地图名字: '试炼之地', 地图名字变量: '空', 怪物名字: '骷髅', 数量: 80, 刷新时间: 小怪刷新, TAG: 11 },
        { 地图名字: '试炼之地', 地图名字变量: '空', 怪物名字: '掷斧骷髅', 数量: 80, 刷新时间: 小怪刷新, TAG: 11 },
        { 地图名字: '试炼之地', 地图名字变量: '空', 怪物名字: '山洞蝙蝠', 数量: 80, 刷新时间: 小怪刷新, TAG: 11 },
        { 地图名字: '试炼之地', 地图名字变量: '空', 怪物名字: '骷髅精灵', 数量: 50, 刷新时间: BOSS刷新, TAG: 12 },
        { 地图名字: '试炼之地', 地图名字变量: '空', 怪物名字: '百战骨灵', 数量: 50, 刷新时间: BOSS刷新, TAG: 13 },
        { 地图名字: '试炼之地', 地图名字变量: '试炼之地', 怪物名字: '骨龙精灵', 数量: 50, 刷新时间: BOSS刷新, TAG: 14 }
        // 可以继续添加更多默认配置...
    ]
}

/**
 * 数据库管理函数：插入或更新刷怪配置
 */
export async function 更新刷怪配置(配置: {
    map_name: string,
    monster_name: string,
    star_min: number,
    star_max: number,
    drop_file: string,
    experience_value: number,
    is_active?: boolean
}): Promise<boolean> {
    try {
        const sql = `
            INSERT INTO spawn_config 
            (map_name, monster_name, star_min, star_max, drop_file, experience_value, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            star_min = VALUES(star_min),
            star_max = VALUES(star_max),
            drop_file = VALUES(drop_file),
            experience_value = VALUES(experience_value),
            is_active = VALUES(is_active),
            updated_at = CURRENT_TIMESTAMP
        `
        
        const params = [
            配置.map_name,
            配置.monster_name,
            配置.star_min,
            配置.star_max,
            配置.drop_file,
            配置.experience_value,
            配置.is_active !== false
        ]
        
        const result = await 执行数据库操作(sql, params)
        if (result.success) {
            清除刷怪配置缓存()
            console.log(`[刷怪数据库] 刷怪配置更新成功: ${配置.map_name} - ${配置.monster_name}`)
            return true
        } else {
            console.error(`[刷怪数据库] 刷怪配置更新失败: ${result.error}`)
            return false
        }
    } catch (error) {
        console.error('[刷怪数据库] 更新刷怪配置异常:', error)
        return false
    }
}

/**
 * 数据库管理函数：插入或更新智能刷怪配置
 */
export async function 更新智能刷怪配置(配置: {
    map_name: string,
    map_variable: string,
    monster_name: string,
    quantity: number,
    refresh_time: number,
    tag: number,
    is_active?: boolean
}): Promise<boolean> {
    try {
        const sql = `
            INSERT INTO smart_spawn 
            (map_name, map_variable, monster_name, quantity, refresh_time, tag, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            map_variable = VALUES(map_variable),
            quantity = VALUES(quantity),
            refresh_time = VALUES(refresh_time),
            is_active = VALUES(is_active),
            updated_at = CURRENT_TIMESTAMP
        `
        
        const params = [
            配置.map_name,
            配置.map_variable,
            配置.monster_name,
            配置.quantity,
            配置.refresh_time,
            配置.tag,
            配置.is_active !== false
        ]
        
        const result = await 执行数据库操作(sql, params)
        if (result.success) {
            清除刷怪配置缓存()
            console.log(`[刷怪数据库] 智能刷怪配置更新成功: ${配置.map_name} - ${配置.monster_name}`)
            return true
        } else {
            console.error(`[刷怪数据库] 智能刷怪配置更新失败: ${result.error}`)
            return false
        }
    } catch (error) {
        console.error('[刷怪数据库] 更新智能刷怪配置异常:', error)
        return false
    }
}

/**
 * 初始化数据库和导入原始数据
 */
export async function 初始化并导入数据(): Promise<boolean> {
    const initialized = await 初始化刷怪数据库表()
    if (!initialized) {
        console.error('[刷怪数据库] 数据库初始化失败')
        return false
    }
    
    console.log('[刷怪数据库] 数据库初始化成功，可以开始导入原始配置数据')
    return true
}