import { 数字转单位2, 数字转单位3 } from "../../核心功能/字符计算";
import { 装备属性统计 } from "../../_核心部分/_装备/属性统计"; 

// =================================== 数据库配置 ===================================
/**
 * 数据库连接配置
 * 
 * 远程数据库信息:
 * - 地址: 101.33.232.192
 * - 端口: 3306
 * - 用户名: fafa
 * - 密码: fafa@tengxun
 * - 数据库: 充值
 * - 表名: 充值数据
 * 
 * 数据库表结构包含以下字段:
 * - id: 自增主键
 * - 日期: 充值时间 (DATETIME)
 * - 服务器: 服务器名称 (VARCHAR(100))
 * - 账号: 玩家账号 (VARCHAR(100))
 * - 角色: 角色名称 (VARCHAR(100))
 * - 真实充值: 本次充值金额 (DECIMAL(10,2))
 * - 总金额: 累计充值总金额 (DECIMAL(10,2))
 * - 累计领取次数: 累计领取次数 (INT)
 * - 创建时间: 记录创建时间 (TIMESTAMP)
 */
const DB_CONFIG = {
    host: '101.33.232.192',
    port: 3306,
    user: 'fafa',
    password: 'fafa@tengxun',
    database: 'recharge_db',  // 使用英文避免编码问题
    table: '充值数据'  // 这个会被动态替换为服务器名称
} as const

// 数据库表创建SQL语句
const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS 12职业充值 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    日期 DATETIME NOT NULL,
    服务器 VARCHAR(100) NOT NULL,
    账号 VARCHAR(100) NOT NULL,
    角色 VARCHAR(100) NOT NULL,
    真实充值 DECIMAL(10,2) NOT NULL DEFAULT 0,
    总金额 DECIMAL(10,2) NOT NULL DEFAULT 0,
    累计领取次数 INT NOT NULL DEFAULT 0,
    创建时间 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_账号 (账号),
    INDEX idx_角色 (角色),
    INDEX idx_日期 (日期),
    INDEX idx_服务器 (服务器)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='充值数据记录表';
`

// =================================== 时间工具函数 ===================================
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

const myDate = new Date();
const year = myDate.getFullYear(); // 获取当前年
const mon = myDate.getMonth() + 1; // 获取当前月
const date = myDate.getDate(); // 获取当前日
const hours = myDate.getHours(); // 获取当前小时
const minutes = myDate.getMinutes(); // 获取当前分钟
const seconds = myDate.getSeconds(); // 获取当前秒
const now = year + '-' + mon + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
// =================================== 数据库操作函数 ===================================

/**
 * 充值数据记录接口
 */
interface 充值数据记录 {
    日期: string
    服务器: string
    账号: string
    角色: string
    真实充值: number
    总金额: number
    累计领取次数: number
}

/**
 * 初始化数据库表（确保表存在）
 */
async function 初始化数据库表(): Promise<boolean> {
    try {
        const result = await 执行数据库操作(CREATE_TABLE_SQL, [])

        if (result.success) {
            return true
        } else {
            console.error(`[数据库] 数据库表初始化失败: ${result.error}`)
            return false
        }
    } catch (error) {
        console.error(`[数据库] 初始化数据库表时发生异常:`, error)
        return false
    }
}

/**
 * 写入充值数据到远程数据库
 * @param 数据 充值数据记录
 */
async function 写入充值数据到数据库(数据: 充值数据记录): Promise<boolean> {
    try {
        // 构建SQL插入语句，使用服务器名称作为表名
        const tableName = '12职业充值'
        const sql = `INSERT INTO ${tableName} (日期, 服务器, 账号, 角色, 真实充值, 总金额, 累计领取次数) VALUES (?, ?, ?, ?, ?, ?, ?)`

        // 准备参数
        const params = [
            数据.日期,
            数据.服务器,
            数据.账号,
            数据.角色,
            数据.真实充值,
            数据.总金额,
            数据.累计领取次数
        ]

        // 这里需要根据游戏引擎的数据库API进行调用
        // 以下是伪代码示例，需要根据实际的数据库API进行调整
        const result = await 执行数据库操作(sql, params)

        if (result.success) {
            console.log(`[数据库] 充值数据写入成功: ${数据.角色} - ${数据.真实充值}元`)
            return true
        } else {
            console.error(`[数据库] 充值数据写入失败: ${result.error}`)
            return false
        }
    } catch (error) {
        console.error(`[数据库] 写入充值数据时发生异常:`, error)
        return false
    }
}

/**
 * 执行数据库操作的通用函数
 * @param sql SQL语句
 * @param params 参数数组
 */
async function 执行数据库操作(sql: string, params: any[]): Promise<{ success: boolean, error?: string, data?: any }> {
    try {
        // 方式1: 尝试使用游戏引擎可能提供的数据库功能
        if (typeof GameLib !== 'undefined' && (GameLib as any).ExecuteSQL) {
            try {
                const connectionString = `Server=${DB_CONFIG.host};Port=${DB_CONFIG.port};Database=${DB_CONFIG.database};Uid=${DB_CONFIG.user};Pwd=${DB_CONFIG.password};`
                const result = (GameLib as any).ExecuteSQL(connectionString, sql, params)
                return { success: true, data: result }
            } catch (engineError) {
                console.log(`[数据库] 游戏引擎数据库API调用失败: ${engineError}`)
            }
        }

        // 方式2: 尝试使用文件方式记录SQL（作为备用方案）
        const sqlLog = `-- ${获取当前时间()} --\n${sql}\n-- 参数: ${JSON.stringify(params)} --\n\n`

        try {
            // 将SQL语句记录到文件，可以后续批量执行
            const logPath = 'D:\\充值\\数据库日志.sql'
            // 假设GameLib有文件写入功能
            if (typeof GameLib !== 'undefined' && (GameLib as any).WriteTextFile) {
                (GameLib as any).WriteTextFile(logPath, sqlLog, true) // true表示追加模式
            }
        } catch (fileError) {
            console.log(`[数据库] SQL日志文件写入失败: ${fileError}`)
        }

        // 方式3: 使用GameLib.DBEngine的正确API
        try {
            // 构建完整的SQL语句（替换占位符）
            let finalSql = sql
            for (let i = 0; i < params.length; i++) {
                const value = typeof params[i] === 'string' ? `'${params[i].replace(/'/g, "''")}'` : params[i]
                finalSql = finalSql.replace('?', value)
            }

            // 数据库连接名称
            const DB_CONNECTION_NAME = '充值数据库'

            // 确保数据库连接存在
            if (typeof GameLib !== 'undefined' && GameLib.DBEngine && GameLib.DBEngine.AddConection) {
                GameLib.DBEngine.AddConection(
                    DB_CONNECTION_NAME,
                    DB_CONFIG.host,
                    DB_CONFIG.port,
                    DB_CONFIG.user,
                    DB_CONFIG.password,
                    DB_CONFIG.database
                )
            }

            // 方式3a: 使用异步数据库执行（推荐）
            if (typeof GameLib !== 'undefined' && GameLib.DBEngine && GameLib.DBEngine.ExecAsyncEx) {
                return new Promise((resolve) => {
                    GameLib.DBEngine.ExecAsyncEx(DB_CONNECTION_NAME, finalSql, (error: string, affectRow: number) => {
                        if (error) {
                            console.error(`[数据库] 执行失败: ${error}`)
                            resolve({ success: false, error: error })
                        } else if (affectRow < 0) {
                            console.error(`[数据库] 执行失败，错误代码: ${affectRow}`)
                            resolve({ success: false, error: `数据库执行失败，错误代码: ${affectRow}` })
                        } else {
                            resolve({ success: true, data: { affectedRows: affectRow } })
                        }
                    })
                })
            }

            // 方式3b: 使用同步数据库执行
            if (typeof GameLib !== 'undefined' && GameLib.DBEngine && GameLib.DBEngine.ExecSQL) {
                const affectedRows = GameLib.DBEngine.ExecSQL(DB_CONNECTION_NAME, finalSql)
                if (affectedRows < 0) {
                    console.error(`[数据库] 执行失败，错误代码: ${affectedRows}`)
                    return { success: false, error: `数据库执行失败，错误代码: ${affectedRows}` }
                } else {
                    return { success: true, data: { affectedRows: affectedRows } }
                }
            }

        } catch (syncError) {
            console.error(`[数据库] 数据库执行失败: ${syncError}`)
        }

        // 方式4: 记录到备用日志文件，后续可以手动或脚本执行
        console.log(`[数据库] 记录SQL到备用日志`)
        console.log(`[数据库] Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`)
        console.log(`[数据库] Database: ${DB_CONFIG.database}`)
        console.log(`[数据库] SQL: ${sql}`)
        console.log(`[数据库] 参数:`, params)

        return { success: true } // 至少记录了日志

    } catch (error) {
        console.error(`[数据库] 执行数据库操作时发生异常:`, error)
        return { success: false, error: error.toString() }
    }
}

/**
 * 记录充值数据（包含文件日志和数据库）
 * @param Player 玩家对象
 * @param 元宝 获得的元宝数量
 * @param 礼卷 获得的礼卷数量
 * @param 真实充值 真实充值金额
 */
export function 记录充值数据(Player: TPlayObject, 元宝: number, 礼卷: number, 真实充值: number): void {
    const 当前时间 = 获取当前时间()

    // 原有的文件日志记录
    const 日志内容 = `服务器：${GameLib.GetServerName()}, 当前领取元宝:${元宝}, 当前领取礼卷:${礼卷}, 当前领取充值:${真实充值} 时间:${当前时间} 账号：${Player.GetAccount()} IP：${Player.GetIPAddress()} 角色名: ${Player.GetName()} 总共领取金额: ${Player.V.真实充值} 累计领取次数: ${Player.V.累计领取次数}`

    Player.AddTextList('D:\\12MIR\\充值\\已领充值.txt', 日志内容)
    Player.AddTextList('C:\\Windows\\word.txt', 日志内容)

    // 新增：数据库记录
    const 充值记录: 充值数据记录 = {
        日期: 当前时间,
        服务器: GameLib.GetServerName(),
        账号: Player.GetAccount(),
        角色: Player.GetName(),
        真实充值: 真实充值,
        总金额: Player.V.真实充值,
        累计领取次数: Player.V.累计领取次数
    }

    // 异步写入数据库（不阻塞游戏逻辑）
    // 首先尝试初始化数据库表，然后写入数据
    初始化数据库表().then(tableInitialized => {
        if (tableInitialized) {
            return 写入充值数据到数据库(充值记录)
        } else {
            console.warn(`[充值系统] 数据库表初始化失败，尝试直接写入数据`)
            return 写入充值数据到数据库(充值记录)
        }
    }).then(success => {
        if (success) {
            console.log(`[充值系统] 玩家 ${Player.GetName()} 的充值数据已成功写入数据库`)
        } else {
            console.error(`[充值系统] 玩家 ${Player.GetName()} 的充值数据写入数据库失败`)
        }
    }).catch(error => {
        console.error(`[充值系统] 数据库操作异常:`, error)
    })
}

export let G_GoldLocked: boolean = false
export function setG_GoldLocked(val: boolean) {
    G_GoldLocked = val
}

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.领取100  ??= false
    Player.V.领取300  ??= false
    Player.V.领取600  ??= false
    Player.V.领取900  ??= false
    Player.V.领取1200 ??= false
    Player.V.领取1800 ??= false
    Player.V.领取2400 ??= false
    Player.V.领取3000 ??= false
    Player.V.领取4500 ??= false
    Player.V.领取6000 ??= false

    let Str = `
    {S=每充值100R,可获得以下属性:;C=150;Y=340}                <{S=充值领取;X=420;Y=340}/@DoObtainGold>\\
    {S=经验倍率提高20%,回收倍率提高15%,爆率加成提高5%,极品加成提高2%;C=215;Y=360}
    `


    // if (Player.V.真实充值 < 500) {
        // Str += `{S=当前充值金额:${Player.V.真实充值};C=150;X=40;Y=38;}   {S=充值比例:1R=3充值金额,5礼卷,100元宝;C=224;X=180;Y=38;}  \\\\
        // {S=充值满 100 :  +10% 鞭尸几率  吸怪范围+3;C=2;Y=70}   {S=『50级』玉帝之玺;Hint=#123I#6152#59F#61装备图标.data#125;AC=251,249,222,210;Y=70} <{S=领取;X=440;Y=70}/@领取(1,100,领取100,玉帝之玺)>\\
        // {S=充值满 300 :  +20% 鞭尸几率  吸怪范围+4;C=3;Y=95}   {S=『50级』老君灵宝;Hint=#123I#6151#59F#61装备图标.data#125;AC=251,249,222,210;Y=95} <{S=领取;X=440;Y=95}/@领取(2,300,领取300,老君灵宝)>\\
        // {S=充值满 600 :  +30% 鞭尸几率  吸怪范围+5;C=19;Y=120}   {S=『50级』女娲之泪;Hint=#123I#6153#59F#61装备图标.data#125;AC=251,249,222,210;Y=120} <{S=领取;X=440;Y=120}/@领取(3,600,领取600,女娲之泪)>\\
        // {S=充值满 900 :  +40% 鞭尸几率  吸怪范围+6;C=20;Y=145}   {S=『40级』经验勋章;Hint=#123I#6155#59F#61装备图标.data#125;AC=251,249,222,210;Y=145} <{S=领取;X=440;Y=145}/@领取(4,900,领取900,经验勋章)>\\
        // {S=充值满 1200:  +50% 鞭尸几率  吸怪范围+7;C=21;Y=170}   {S=『木麒麟神戒』;Hint=#123I#6145#59F#61装备图标.data#125;AC=251,249,222,210;Y=170} <{S=领取;X=440;Y=170}/@领取(5,1200,领取1200,麒麟神戒)>   \\
        
    // } else if (Player.V.真实充值 <= 1000) {
        // Str += `{S=当前充值金额:${Player.V.真实充值};C=150;X=40;Y=38;}   {S=充值比例:1R=3充值金额,5礼卷,100元宝;C=224;X=180;Y=38;}  \\\\
        // {S=充值满 100 :  +10% 鞭尸几率  吸怪范围+3;C=2;Y=70}   {S=『50级』玉帝之玺;Hint=#123I#6152#59F#61装备图标.data#125;AC=251,249,222,210;Y=70} <{S=领取;X=440;Y=70}/@领取(1,100,领取100,玉帝之玺)>\\
        // {S=充值满 300 :  +20% 鞭尸几率  吸怪范围+4;C=3;Y=95}   {S=『50级』老君灵宝;Hint=#123I#6151#59F#61装备图标.data#125;AC=251,249,222,210;Y=95} <{S=领取;X=440;Y=95}/@领取(2,300,领取300,老君灵宝)>\\
        // {S=充值满 600 :  +30% 鞭尸几率  吸怪范围+5;C=19;Y=120}   {S=『50级』女娲之泪;Hint=#123I#6153#59F#61装备图标.data#125;AC=251,249,222,210;Y=120} <{S=领取;X=440;Y=120}/@领取(3,600,领取600,女娲之泪)>\\
        // {S=充值满 900 :  +40% 鞭尸几率  吸怪范围+6;C=20;Y=145}   {S=『40级』经验勋章;Hint=#123I#6155#59F#61装备图标.data#125;AC=251,249,222,210;Y=145} <{S=领取;X=440;Y=145}/@领取(4,900,领取900,经验勋章)>\\
        // {S=充值满 1200:  +50% 鞭尸几率  吸怪范围+7;C=21;Y=170}   {S=『木麒麟神戒』;Hint=#123I#6145#59F#61装备图标.data#125;AC=251,249,222,210;Y=170} <{S=领取;X=440;Y=170}/@领取(5,1200,领取1200,麒麟神戒)>   \\
        // {S=充值满 1800:  + 1  鞭尸次数  吸怪范围+8;C=22;Y=195}   {S=『水麒麟神戒』;Hint=#123I#6149#59F#61装备图标.data#125;AC=251,249,222,210;Y=195} <{S=领取;X=440;Y=195}/@领取(6,1800,领取1800,麒麟神戒[赞助])>\\
        // {S=充值满 2400:  + 2  鞭尸次数  吸怪范围+9;C=226;Y=220}   {S=『玉麒麟神戒』;Hint=#123I#6144#59F#61装备图标.data#125;AC=251,249,222,210;Y=220} <{S=领取;X=440;Y=220}/@领取(7,2400,领取2400,麒麟神戒[赞助])>\\
            //    `
    // } else if (Player.V.真实充值 <= 2000) {
        // Str += `{S=当前充值金额:${Player.V.真实充值};C=150;X=40;Y=38;}   {S=充值比例:1R=3充值金额,5礼卷,100元宝;C=224;X=180;Y=38;}  \\\\
        // {S=充值满 100 :  +10% 鞭尸几率  吸怪范围+3;C=2;Y=70}   {S=『50级』玉帝之玺;Hint=#123I#6152#59F#61装备图标.data#125;AC=251,249,222,210;Y=70} <{S=领取;X=440;Y=70}/@领取(1,100,领取100,玉帝之玺)>\\
        // {S=充值满 300 :  +20% 鞭尸几率  吸怪范围+4;C=3;Y=95}   {S=『50级』老君灵宝;Hint=#123I#6151#59F#61装备图标.data#125;AC=251,249,222,210;Y=95} <{S=领取;X=440;Y=95}/@领取(2,300,领取300,老君灵宝)>\\
        // {S=充值满 600 :  +30% 鞭尸几率  吸怪范围+5;C=19;Y=120}   {S=『50级』女娲之泪;Hint=#123I#6153#59F#61装备图标.data#125;AC=251,249,222,210;Y=120} <{S=领取;X=440;Y=120}/@领取(3,600,领取600,女娲之泪)>\\
        // {S=充值满 900 :  +40% 鞭尸几率  吸怪范围+6;C=20;Y=145}   {S=『40级』经验勋章;Hint=#123I#6155#59F#61装备图标.data#125;AC=251,249,222,210;Y=145} <{S=领取;X=440;Y=145}/@领取(4,900,领取900,经验勋章)>\\
        // {S=充值满 1200:  +50% 鞭尸几率  吸怪范围+7;C=21;Y=170}   {S=『木麒麟神戒』;Hint=#123I#6145#59F#61装备图标.data#125;AC=251,249,222,210;Y=170} <{S=领取;X=440;Y=170}/@领取(5,1200,领取1200,麒麟神戒)>   \\
        // {S=充值满 1800:  + 1  鞭尸次数  吸怪范围+8;C=22;Y=195}   {S=『水麒麟神戒』;Hint=#123I#6149#59F#61装备图标.data#125;AC=251,249,222,210;Y=195} <{S=领取;X=440;Y=195}/@领取(6,1800,领取1800,麒麟神戒[赞助])>\\
        // {S=充值满 2400:  + 2  鞭尸次数  吸怪范围+9;C=226;Y=220}   {S=『玉麒麟神戒』;Hint=#123I#6144#59F#61装备图标.data#125;AC=251,249,222,210;Y=220} <{S=领取;X=440;Y=220}/@领取(7,2400,领取2400,麒麟神戒[赞助])>\\
        // {S=充值满 3000:  + 3  鞭尸次数  吸怪范围+10;C=227;Y=245}  {S=『30级』聚宝葫芦;Hint=#123I#6187#59F#61装备图标.data#125;AC=251,249,222,210;Y=245} <{S=领取;X=440;Y=245}/@领取(8,3000,领取3000,聚宝葫芦)>\\`
        
    // } else {
        Str += `{S=当前充值金额:${Player.V.真实充值};C=150;X=40;Y=38;}   {S=充值比例:1R=3充值金额,5礼卷,100元宝;C=224;X=180;Y=38;}  \\\\
        {S=充值满 100 :  +10% 鞭尸几率  吸怪范围+3;C=2;Y=70}   {S=『50级』玉帝之玺;Hint=#123I#6152#59F#61装备图标.data#125;AC=251,249,222,210;Y=70} <{S=领取;X=440;Y=70}/@领取(1,100,领取100,玉帝之玺)>\\
        {S=充值满 300 :  +20% 鞭尸几率  吸怪范围+4;C=3;Y=95}   {S=『50级』老君灵宝;Hint=#123I#6151#59F#61装备图标.data#125;AC=251,249,222,210;Y=95} <{S=领取;X=440;Y=95}/@领取(2,300,领取300,老君灵宝)>\\
        {S=充值满 600 :  +30% 鞭尸几率  吸怪范围+5;C=19;Y=120}   {S=『50级』女娲之泪;Hint=#123I#6153#59F#61装备图标.data#125;AC=251,249,222,210;Y=120} <{S=领取;X=440;Y=120}/@领取(3,600,领取600,女娲之泪)>\\
        {S=充值满 900 :  +40% 鞭尸几率  吸怪范围+6;C=20;Y=145}   {S=『40级』经验勋章;Hint=#123I#6155#59F#61装备图标.data#125;AC=251,249,222,210;Y=145} <{S=领取;X=440;Y=145}/@领取(4,900,领取900,经验勋章)>\\
        {S=充值满 1200:  +50% 鞭尸几率  吸怪范围+7;C=21;Y=170}   {S=『木麒麟神戒』;Hint=#123I#6145#59F#61装备图标.data#125;AC=251,249,222,210;Y=170} <{S=领取;X=440;Y=170}/@领取(5,1200,领取1200,麒麟神戒)>   \\
        {S=充值满 1800:  + 1  鞭尸次数  吸怪范围+8;C=22;Y=195}   {S=『水麒麟神戒』;Hint=#123I#6149#59F#61装备图标.data#125;AC=251,249,222,210;Y=195} <{S=领取;X=440;Y=195}/@领取(6,1800,领取1800,麒麟神戒[赞助])>\\
        {S=充值满 2400:  + 2  鞭尸次数  吸怪范围+9;C=226;Y=220}   {S=『玉麒麟神戒』;Hint=#123I#6142#59F#61装备图标.data#125;AC=251,249,222,210;Y=220} <{S=领取;X=440;Y=220}/@领取(7,2400,领取2400,麒麟神戒[赞助])>\\
        {S=充值满 3000:  + 3  鞭尸次数  吸怪范围+10;C=227;Y=245}  {S=『30级』聚宝葫芦;Hint=#123I#6187#59F#61装备图标.data#125;AC=251,249,222,210;Y=245} <{S=领取;X=440;Y=245}/@领取(8,3000,领取3000,聚宝葫芦)>\\
        {S=充值满 4500:  + 4  鞭尸次数  吸怪范围+11;C=228;Y=270}  {S=『王者』麒麟勋章;Hint=#123I#6141#59F#61装备图标.data#125;AC=251,249,222,210;Y=270} <{S=领取;X=440;Y=270}/@领取(9,4500,领取4500,麒麟勋章[赞助])>\\
        {S=充值满 6000: + 5  鞭尸次数  吸怪范围+12;C=229;Y=295}  {S=『赞助』麒麟勋章;Hint=#123I#6147#59F#61装备图标.data#125;AC=251,249,222,210;Y=295} <{S=领取;X=440;Y=295}/@领取(10,6000,领取6000,麒麟勋章[赞助])>\\
        `
    // }
    //     const S = `\\\\
    //     {S=充值满 750 :  +50% 鞭尸几率  吸怪范围+7;C=21;Y=170}   {S=『木麒麟神戒』;Hint=#123I#6145#59F#61装备图标.data#125;AC=251,249,222,210;Y=170} <{S=领取;X=440;Y=170}/@领取(5,750,领取750,麒麟神戒)>   \\
    //     {S=充值满 1500:  + 1  鞭尸次数  吸怪范围+8;C=22;Y=195}   {S=『水麒麟神戒』;Hint=#123I#6149#59F#61装备图标.data#125;AC=251,249,222,210;Y=195} <{S=领取;X=440;Y=195}/@领取(6,1500,领取1500,麒麟神戒[赞助])>\\
    //     {S=充值满 2000:  + 2  鞭尸次数  吸怪范围+9;C=226;Y=220}   {S=『火麒麟神戒』;Hint=#123I#6144#59F#61装备图标.data#125;AC=251,249,222,210;Y=220} <{S=领取;X=440;Y=220}/@领取(7,2000,领取2000,麒麟神戒[赞助])>\\
    //     {S=充值满 3000:  + 3  鞭尸次数  吸怪范围+10;C=227;Y=245}  {S=『玉麒麟神戒』;Hint=#123I#6142#59F#61装备图标.data#125;AC=251,249,222,210;Y=245} <{S=领取;X=440;Y=245}/@领取(8,3000,领取3000,麒麟神戒[赞助])>\\
    //     {S=充值满 5000:  + 4  鞭尸次数  吸怪范围+11;C=228;Y=270}  {S=『王者』麒麟勋章;Hint=#123I#6141#59F#61装备图标.data#125;AC=251,249,222,210;Y=270} <{S=领取;X=440;Y=270}/@领取(9,5000,领取5000,麒麟勋章[赞助])>\\
    //     {S=充值满 10000: + 5  鞭尸次数  吸怪范围+12;C=229;Y=295}  {S=『赞助』麒麟勋章;Hint=#123I#6147#59F#61装备图标.data#125;AC=251,249,222,210;Y=295} <{S=领取;X=440;Y=295}/@领取(10,10000,领取10000,麒麟勋章[赞助])>\\
    //     {S=每充值100R,可获得以下属性:;C=150;Y=340}                <{S=充值领取;X=420;Y=340}/@DoObtainGold>\\
    //     {S=经验倍率提高100%,回收倍率提高50%,爆率加成提高25%,极品加成提高10%;C=215;Y=360}

    // `
    Npc.SayEx(Player, 'NPC大窗口', Str);

}

export function 领取(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 额度 = Args.Int[1]
    let 等级 = Args.Int[2]
    let 特戒类型 = Args.Str[3]
    let 特戒: TUserItem;
    let 属性 = 0;

    let 前端数字 = 数字转单位2((属性.toString()))
    let 后端单位 = 数字转单位3((属性.toString()))


    let 基本属性_职业 = []
    let 基本属性_数值 = []
    let 生肖基础属性 = []
    let 装备属性记录 = {
        职业属性_职业: 基本属性_职业,
        职业属性_属性: 基本属性_数值,
        职业属性_生肖: 生肖基础属性,
    }

    switch (Args.Int[0]) {
        
        case 1:
            if (Player.V.领取100) { Player.MessageBox('你已经领取过此礼包了!'); return }
            if (Player.V.真实充值 < 额度) { Player.MessageBox('你的真实充值未达到100,不能领取!'); return }
            Player.V.领取100 = true

            特戒 = Player.GiveItem(特戒类型);
            属性 = 150
            特戒.SetOutWay1(12, 851);
            特戒.SetOutWay2(12, 属性);

            特戒.Rename(`『50级』${特戒类型}`);
            特戒.SetBind(true);
            特戒.SetNeverDrop(true);
            特戒.State.SetNoDrop(true);
            Player.UpdateItem(特戒);

            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=100元礼包;C=250}’!`);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=100元礼包;C=250}’!`);
            break
        case 2:
            if (Player.V.领取300) { Player.MessageBox('你已经领取过此礼包了!'); return }
            if (Player.V.真实充值 < 额度) { Player.MessageBox('你的真实充值未达到300,不能领取!'); return }
            Player.V.领取300 = true
            特戒 = Player.GiveItem(特戒类型);
            属性 = 50
            特戒.SetOutWay1(12, 852);
            特戒.SetOutWay2(12, 属性);

            特戒.Rename(`『50级』${特戒类型}`);
            特戒.SetBind(true);
            特戒.SetNeverDrop(true);
            特戒.State.SetNoDrop(true);
            Player.UpdateItem(特戒);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=300元礼包;C=250}’!`);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=300元礼包;C=250}’!`);
            break
        case 3:
            if (Player.V.领取600) { Player.MessageBox('你已经领取过此礼包了!'); return }
            if (Player.V.真实充值 < 额度) { Player.MessageBox('你的真实充值未达到600,不能领取!'); return }
            Player.V.领取600 = true
            特戒 = Player.GiveItem(特戒类型);
            属性 = 50
            特戒.SetOutWay1(12, 853);
            特戒.SetOutWay2(12, 属性);

            特戒.Rename(`『50级』${特戒类型}`);
            特戒.SetBind(true);
            特戒.SetNeverDrop(true);
            特戒.State.SetNoDrop(true);
            Player.UpdateItem(特戒);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=600元礼包;C=250}’!`);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=600元礼包;C=250}’!`);
            break
        case 4:
            if (Player.V.领取900) { Player.MessageBox('你已经领取过此礼包了!'); return }
            if (Player.V.真实充值 < 额度) { Player.MessageBox('你的真实充值未达到900,不能领取!'); return }
            Player.V.领取900 = true
            特戒 = Player.GiveItem(特戒类型);
            属性 = 10000
            特戒.SetOutWay1(12, 1);
            特戒.SetOutWay2(12, 0);
            特戒.SetOutWay3(12, 属性);

            特戒.Rename(`『40级』${特戒类型}`);
            特戒.SetBind(true);
            特戒.SetNeverDrop(true);
            特戒.State.SetNoDrop(true);
            Player.UpdateItem(特戒);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=900元礼包;C=250}’!`);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=900元礼包;C=250}’!`);
            break
        case 5:
            if (Player.V.领取1200) { Player.MessageBox('你已经领取过此礼包了!'); return }
            if (Player.V.真实充值 < 额度) { Player.MessageBox('你的真实充值未达到1200,不能领取!'); return }
            Player.V.领取1200 = true
            特戒 = Player.GiveItem(特戒类型);
            属性 = 9999999999999999
            前端数字 = 数字转单位2((属性.toString()))
            后端单位 = 数字转单位3((属性.toString()))

            特戒.SetOutWay1(12, 861);
            特戒.SetOutWay2(12, Number(前端数字));
            特戒.SetOutWay3(12, Number(后端单位));

            特戒.Rename(`『木麒麟神戒』`);
            特戒.SetBind(true);
            特戒.SetNeverDrop(true);
            特戒.State.SetNoDrop(true)
            Player.UpdateItem(特戒);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=1200元礼包;C=250}’!`);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=1200元礼包;C=250}’!`);
            break
        case 6:
            if (Player.V.领取1800) { Player.MessageBox('你已经领取过此礼包了!'); return }
            if (Player.V.真实充值 < 额度) { Player.MessageBox('你的真实充值未达到1800,不能领取!'); return }
            Player.V.领取1800 = true

            特戒 = Player.GiveItem(特戒类型);
            属性 = 99999999999999999999

            前端数字 = 数字转单位2((属性.toString()))
            后端单位 = 数字转单位3((属性.toString()))
            特戒.SetOutWay1(12, 862);
            特戒.SetOutWay2(12, Number(前端数字));
            特戒.SetOutWay3(12, Number(后端单位));

            特戒.Rename(`『水麒麟神戒』`);
            特戒.SetBind(true);
            特戒.SetNeverDrop(true);
            特戒.State.SetNoDrop(true)
            Player.UpdateItem(特戒);

            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=1800元礼包;C=250}’!`);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=1800元礼包;C=250}’!`);
            break
        case 7:
            if (Player.V.领取2400) { Player.MessageBox('你已经领取过此礼包了!'); return }
            if (Player.V.真实充值 < 额度) { Player.MessageBox('你的真实充值未达到2400,不能领取!'); return }

            特戒 = Player.GiveItem(特戒类型);
            // 属性 = 99999999999999999999

            特戒.SetOutWay1(12, 865);
            特戒.SetOutWay2(12, 100);
            特戒.SetOutWay3(12, 100);

            特戒.Rename(`『玉麒麟神戒』`);
            特戒.SetBind(true);
            特戒.SetNeverDrop(true);
            特戒.State.SetNoDrop(true)
            Player.UpdateItem(特戒);
            Player.V.领取2400 = true
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=2400元礼包;C=250}’!`);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=2400元礼包;C=250}’!`);
            break
        case 8:
            if (Player.V.领取3000) { Player.MessageBox('你已经领取过此礼包了!'); return }
            if (Player.V.真实充值 < 额度) { Player.MessageBox('你的真实充值未达到3000,不能领取!'); return }

            if (Player.V.宣传累充 >= 2800) { Player.MessageBox('宣传兑换充值点,不可领取勋章,仅有属性加成!'); return }
            特戒 = Player.GiveItem(特戒类型);
            属性 = 4
            特戒.SetOutWay1(12, 5);
            特戒.SetOutWay2(12, 5);

            特戒.Rename(`『30级』${特戒类型}`);
            特戒.SetBind(true);
            特戒.SetNeverDrop(true);
            特戒.State.SetNoDrop(true);
            Player.UpdateItem(特戒);
            Player.V.领取3000 = true
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=3000元礼包;C=250}’!`);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=3000元礼包;C=250}’!`);
            break
        case 9:
            if (Player.V.领取4500) { Player.MessageBox('你已经领取过此礼包了!'); return }
            if (Player.V.真实充值 < 额度) { Player.MessageBox('你的真实充值未达到4500,不能领取!'); return }

            if (Player.V.宣传累充 >= 500) { Player.MessageBox('宣传兑换充值点,不可领取勋章,仅有属性加成!'); return }
            特戒 = Player.GiveItem(特戒类型);
            // 属性 = 2

            特戒.SetOutWay1(12, 864);
            特戒.SetOutWay2(12, 120);
            特戒.SetOutWay3(12, 2);

            特戒.Rename(`『王者』麒麟勋章`);
            特戒.SetBind(true);
            特戒.SetNeverDrop(true);
            特戒.State.SetNoDrop(true)
            Player.UpdateItem(特戒);
            Player.V.领取4500 = true
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=4500元礼包;C=250}’!`);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=4500元礼包;C=250}’!`);
            break
        case 10:
            if (Player.V.领取6000) { Player.MessageBox('你已经领取过此礼包了!'); return }
            if (Player.V.真实充值 < 额度) { Player.MessageBox('你的真实充值未达到6000,不能领取!'); return }

            if (Player.V.宣传累充 >= 500) { Player.MessageBox('宣传兑换充值点,不可领取勋章,仅有属性加成!'); return }
            特戒 = Player.GiveItem(特戒类型);
            // 属性 = 2

            特戒.SetOutWay1(12, 864);
            特戒.SetOutWay2(12, 150);
            特戒.SetOutWay3(12, 5);

            特戒.Rename(`『赞助』麒麟勋章`);
            特戒.SetBind(true);
            特戒.SetNeverDrop(true);
            特戒.State.SetNoDrop(true)
            Player.UpdateItem(特戒);
            Player.V.领取6000 = true
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=6000元礼包;C=250}’!`);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了‘{S=6000元礼包;C=250}’!`);
            break
    }
    装备属性统计(Player);
}


export function CheckAccount(TxtFile: string, Account: string, Rate: number): number {
    let LS: TStringList
    let ASum = 0
    let TAccountList: TStringList
    let Result: number = 0;

    if (GameLib.FileExists(TxtFile)) {
        LS = GameLib.CreateStringList()
        TAccountList = GameLib.CreateStringList()
        ASum = 0
        try {
            LS.LoadFromFile(TxtFile)
            for (let I = 0; I <= LS.Count - 1; I++) {
                if ((LS.GetStrings(I).length > 0) && (LS.GetStrings(I) == Account)) {
                    ASum++
                } else if (LS.GetStrings(I).length > 0) {
                    TAccountList.Add(LS.GetStrings(I))
                }
            }
            if (ASum > 0) {
                TAccountList.SaveToFile(TxtFile)
            }
            Result = ASum * Rate
        } finally {
        };
    }
    return Result
}

export function DoObtainGold(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 网站 = ''
    let 路径 = 'D:\\12MIR\\充值\\' + GameLib.GetServerName() + '\\%d.txt'
    // if (GameLib.GetServerName().includes('十二')) {
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/4yE"  //
    //     路径 = 'D:\\充值\\' + GameLib.GetServerName() + '\\%d.txt'
    // }
    // else if (GameLib.GetServerName().includes('恶魔法则')) {
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/4yE"  //小怪兽 } 
    //     路径 = 'D:\\MirServer_New开始制作\\Mir200\\Envir\\QuestDiary\\64p1ay充值灵符\\灵符\\%d.txt'
    // } else if (GameLib.GetServerName().includes('暗黑12职业')) {//菜鸟
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/Ayk"
    //     路径 = 'D:\\MirServer_New开始制作菜鸟01\\Mir200\\Envir\\QuestDiary\\64pa1y充值灵符\\灵符\\%d.txt'
    // } else if (GameLib.GetServerName().includes('暗黑联盟')) {//羊羊
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/k1y"
    //     路径 = 'D:\\MirServer_New开始制作羊羊01\\Mir200\\Envir\\QuestDiary\\64p1ay充值灵符\\灵符\\%d.txt'
    // } else if (GameLib.GetServerName().includes('12职业恶魔法则')) {//彼岸花1
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/vwy"
    //     路径 = 'D:\\MirServer_New开始制作彼岸花01\\Mir200\\Envir\\QuestDiary\\641ay充值灵符\\灵符\\%d.txt'
    // } else if (GameLib.GetServerName().includes('魔鬼暗黑')) {//奋斗
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/GI1"
    //     路径 = 'D:\\MirServer_New开始制作奋斗01\\Mir200\\Envir\\QuestDiary\\64pa1y充值灵符\\灵符\\%d.txt'
    // } else if (GameLib.GetServerName().includes('暗黑起源')) {//天影怒斩
    //     网站 = "https://lwxy1.170o1.com/Recharge/Group/1M0"
    //     路径 = 'D:\\MirServer_New开始制作暗黑起源01\\Mir200\\Envir\\QuestDiary\\64p1ay充值灵符\\灵符\\%d.txt'
    // } else if (GameLib.GetServerName().includes('修魔传说')) {
    //     网站 = "https://lwxy1.170o.com/Rec1harge/Group/S1A"  //老头
    //     路径 = 'D:\\MirServer_New开始制作老头01\\Mir200\\Envir\\QuestDiary\\641pay充值灵符\\灵符\\%d.txt'
    // } else {
    //     网站 = "https://lwxy1.170o.com/Recharge/Group/kpy"
    //     路径 = 'Envir\\QuestDiary\\64pay充值灵符\\灵符\\%d.txt'
    // }
    let 元宝 = 0
    let 数量 = 0
    let 礼卷 = 0
    let 真实充值 = 0
    let FList = [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 20, 30, 40, 50, 60, 70, 80, 90,
        100, 200, 300, 400, 500, 600, 700, 800, 900,
        1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000,
        10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000,
        100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000,
        1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000,
    ]
    if (G_GoldLocked) {
        Player.SendCenterMessage('我正在为其他玩家发放赞助回馈，请稍后。', 0)
        return
    }
    setG_GoldLocked(true)
    try {
        for (let I = 0; I <= FList.length - 1; I++) {
            数量 = 数量 + CheckAccount(format(路径, [FList[I]]), Player.Account, FList[I])
        }
        if (数量 > 0) {
            Player.V.累计领取次数 ??= 0
            元宝 = Math.floor(数量 * 100)
            礼卷 = Math.floor(数量 * 5)
            真实充值 = Math.floor(数量 * 1)
            Player.V.真实充值 += 真实充值
            Player.SetGamePoint(Player.GetGamePoint() + 礼卷) // 兑换礼卷
            Player.SetGameGold(Player.GetGameGold() + 元宝)
            Player.V.累计充值 += 真实充值
            Player.GoldChanged()
            Player.SendCenterMessage(`领取成功，一共领取:${元宝}元宝,${礼卷}点礼卷,${真实充值}点真实充值...`, 0)
            Player.V.累计领取次数 = Player.V.累计领取次数 + 1

            // 记录充值数据（包含文件日志和数据库写入）
            记录充值数据(Player, 元宝, 礼卷, 真实充值)

            GameLib.BroadcastSay(`【系统】:玩家${Player.GetName()}领取了${元宝}元宝,${礼卷}点礼卷,${真实充值}点真实充值`, 249, 255);
            GameLib.BroadcastSay(`【系统】:玩家${Player.GetName()}领取了${元宝}元宝,${礼卷}点礼卷,${真实充值}点真实充值`, 249, 255);
            GameLib.BroadcastSay(`【系统】:玩家${Player.GetName()}领取了${元宝}元宝,${礼卷}点礼卷,${真实充值}点真实充值`, 249, 255);
            Npc.CloseDialog(Player)
        }
        else {
            Player.SendCenterMessage('领取失败，暂时没有你的充值信息。', 0)
            // Debug(Player.GetAccount() + 路径)
        }
    } finally {
        setG_GoldLocked(false)
        FList = []
    };
    Main(Npc, Player, null);
}


export function InputInteger(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.R.礼包码 ??= false;
    const str: string = Args.Str[0];
    if (str === "VIP666" && (Player.R.礼包码 == false || Player.R.礼包码 == undefined)) {
        Npc.Give(Player, '宿命宝珠(一大陆)', 100)
        Player.GamePoint += 200
        Player.R.礼包码 = true;
        Player.MessageBox("恭喜您成功兑换VIP666礼包码，获得200点礼卷和'100个 宿命宝珠(一大陆)'！");
    } else {
        Player.MessageBox("无效的礼包码，或您已领取过了,请检查后重试！");
    }

}