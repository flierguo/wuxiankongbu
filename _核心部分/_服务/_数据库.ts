/**
 * 数据库操作封装模块
 * 提供简洁的MySQL数据库操作接口
 */

// =================================== 数据库配置 ===================================
const DB_CONFIG = {
    host: '101.33.232.192',
    port: 3306,
    user: 'fafa',
    password: 'fafa@tengxun',
    database: 'recharge_db',
    connectionName: '游戏数据库'
} as const;

// 连接状态缓存
let 已初始化连接 = false;

// =================================== 核心函数 ===================================

/**
 * 确保数据库连接存在
 */
function 确保连接(): void {
    if (已初始化连接) return;
    
    if (typeof GameLib !== 'undefined' && GameLib.DBEngine?.AddConection) {
        GameLib.DBEngine.AddConection(
            DB_CONFIG.connectionName,
            DB_CONFIG.host,
            DB_CONFIG.port,
            DB_CONFIG.user,
            DB_CONFIG.password,
            DB_CONFIG.database
        );
        已初始化连接 = true;
    }
}

/**
 * 转义SQL参数值
 */
function 转义值(value: any): string {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? '1' : '0';
    return `'${String(value).replace(/'/g, "''")}'`;
}

/**
 * 构建完整SQL（替换占位符）
 */
function 构建SQL(sql: string, params: any[]): string {
    let result = sql;
    for (const param of params) {
        result = result.replace('?', 转义值(param));
    }
    return result;
}

// =================================== 公开接口 ===================================

export interface DB操作结果 {
    success: boolean;
    error?: string;
    data?: any;
    affectedRows?: number;
}

/**
 * 执行SQL（异步，推荐）
 * @param sql SQL语句，使用?作为占位符
 * @param params 参数数组
 * @param callback 可选回调函数
 */
export function 执行SQL(sql: string, params: any[] = [], callback?: (result: DB操作结果) => void): void {
    确保连接();
    const finalSql = 构建SQL(sql, params);
    
    if (GameLib?.DBEngine?.ExecAsyncEx) {
        GameLib.DBEngine.ExecAsyncEx(DB_CONFIG.connectionName, finalSql, (error: string, affectRow: number) => {
            const result: DB操作结果 = error || affectRow < 0
                ? { success: false, error: error || `错误代码: ${affectRow}` }
                : { success: true, affectedRows: affectRow };
            callback?.(result);
        });
    } else if (GameLib?.DBEngine?.ExecSQL) {
        const rows = GameLib.DBEngine.ExecSQL(DB_CONFIG.connectionName, finalSql);
        const result: DB操作结果 = rows < 0
            ? { success: false, error: `错误代码: ${rows}` }
            : { success: true, affectedRows: rows };
        callback?.(result);
    } else {
        callback?.({ success: false, error: '数据库引擎不可用' });
    }
}

/**
 * 执行SQL（同步）
 */
export function 执行SQL同步(sql: string, params: any[] = []): DB操作结果 {
    确保连接();
    const finalSql = 构建SQL(sql, params);
    
    if (GameLib?.DBEngine?.ExecSQL) {
        const rows = GameLib.DBEngine.ExecSQL(DB_CONFIG.connectionName, finalSql);
        return rows < 0
            ? { success: false, error: `错误代码: ${rows}` }
            : { success: true, affectedRows: rows };
    }
    return { success: false, error: '数据库引擎不可用' };
}

/**
 * 插入数据
 * @param 表名 数据表名称
 * @param 数据 键值对对象
 */
export function 插入(表名: string, 数据: Record<string, any>, callback?: (result: DB操作结果) => void): void {
    const 字段 = Object.keys(数据);
    const 占位符 = 字段.map(() => '?').join(', ');
    const sql = `INSERT INTO ${表名} (${字段.join(', ')}) VALUES (${占位符})`;
    执行SQL(sql, Object.values(数据), callback);
}

/**
 * 更新数据
 * @param 表名 数据表名称
 * @param 数据 要更新的键值对
 * @param 条件 WHERE条件（如 "id = ?" 或 "角色 = ?"）
 * @param 条件参数 条件中的参数值
 */
export function 更新(表名: string, 数据: Record<string, any>, 条件: string, 条件参数: any[] = [], callback?: (result: DB操作结果) => void): void {
    const 设置 = Object.keys(数据).map(k => `${k} = ?`).join(', ');
    const sql = `UPDATE ${表名} SET ${设置} WHERE ${条件}`;
    执行SQL(sql, [...Object.values(数据), ...条件参数], callback);
}

/**
 * 删除数据
 */
export function 删除(表名: string, 条件: string, 条件参数: any[] = [], callback?: (result: DB操作结果) => void): void {
    const sql = `DELETE FROM ${表名} WHERE ${条件}`;
    执行SQL(sql, 条件参数, callback);
}

/**
 * 创建表（如果不存在）
 */
export function 创建表(建表SQL: string, callback?: (result: DB操作结果) => void): void {
    执行SQL(建表SQL, [], callback);
}

// =================================== 工具函数 ===================================

/**
 * 获取当前时间字符串（MySQL格式）
 */
export function 获取当前时间(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
