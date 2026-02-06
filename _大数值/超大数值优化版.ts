/**
 * 超大数值计算优化版 v2 - 对数直通架构
 * 
 * 核心设计：
 * Decimal 内部存储就是 l = log10(value)，即科学计数法的指数部分。
 * 所有加减乘除都在 l 值上运算，本身就是 O(1) 的。
 * 
 * 真正的 CPU 瓶颈在于：
 * 1. new Decimal(超长字符串) — 字符串解析开销
 * 2. toFixedString(几百位) — "0".repeat(几百) 字符串分配开销
 * 3. 每次计算都在 "字符串 → Decimal → 计算 → 字符串" 之间来回转换
 * 
 * 优化策略：
 * 1. 支持科学计数法输入（大小写 E/e，如 1E100、5e200）
 * 2. 超大数值（>13位指数）输出时只保留13位有效数字 + 补0，不生成几百位字符串
 * 3. 结果缓存 2000 项，避免重复计算
 * 4. 输入预处理：统一大写E为小写e，让 Decimal 构造函数正确解析
 * 
 * 精度说明：
 * Decimal 底层用 float64 存储 log10 值，有效精度约 15-16 位。
 * 对于几百位的超大数值，前13位有效数字是精确的，后面全是0。
 * 这对游戏来说完全够用 — 玩家看到的是简写（如 "1.5亿亿"），不会关心第14位以后的数字。
 */

import { Decimal } from "./big_number";

// ============================================
// 输入预处理
// ============================================

/**
 * 标准化输入字符串
 * - 空值处理
 * - 大写E转小写e（Decimal构造函数只认小写e）
 * - 支持 1E100、5E200、1.5E50 等测试用格式
 */
function 标准化输入(value: string): string {
    if (!value || value === '') return '0';
    // 快速检查：大部分输入不含E，直接返回
    if (value.indexOf('E') !== -1) {
        return value.replace('E', 'e');
    }
    return value;
}

// ============================================
// 超大数值优化器
// ============================================

class 超大数值优化器 {
    // 结果缓存
    private static 结果缓存 = new Map<string, string>();
    private static readonly 最大缓存大小 = 2000;

    // 预创建常用Decimal对象（避免重复创建）
    private static readonly ZERO = new Decimal('0');
    public static readonly ONE = new Decimal('1');
    public static readonly TWO = new Decimal('2');
    public static readonly HUNDRED = new Decimal('100');
    
    // 输入缓存（预计算常用大数值的Decimal对象）
    private static 输入缓存 = new Map<string, Decimal>();
    
    // 初始化
    static {
        // 预计算常用科学计数法数值（测试和游戏中常用）
        const 常用值 = [
            '0', '1', '2', '3', '5', '10', '100', '1000', '10000',
            '1e18', '1e20', '1e25', '1e30', '1e50', '1e100', '1e200',
            '2e18', '5e18', '1.5e18', '3e18',
        ];
        for (const v of 常用值) {
            this.输入缓存.set(v, new Decimal(v));
        }
    }
    
    /**
     * 获取Decimal对象（高性能版）
     * 优先从缓存获取，避免重复创建
     */
    public static 获取Decimal(value: string): Decimal {
        const cached = this.输入缓存.get(value);
        if (cached) return cached;
        return new Decimal(value);
    }
    
    /**
     * 格式化Decimal为字符串
     * 与 big_number.ts 的 toFixedString 完全一致的算法（MaxAccuracy = 13）
     */
    public static 格式化(decimal: Decimal, fixed: number = 0): string {
        if (decimal.l < -10) return '0';
        if (decimal.l === Number.POSITIVE_INFINITY) return 'Infinity';
        if (isNaN(decimal.l)) return '0';
        
        if (decimal.l > 13) {
            const exp = Math.floor(decimal.l) - 13;
            const num = decimal.l - exp;
            const str = Math.round(Math.pow(10, num)).toFixed(0);
            const end = '0'.repeat(exp);
            return `${str}${end}`;
        }
        
        return Math.pow(10, decimal.l).toFixed(fixed);
    }
    
    /**
     * 获取缓存结果
     */
    public static 获取缓存(key: string): string | null {
        return this.结果缓存.get(key) || null;
    }
    
    /**
     * 缓存结果
     */
    public static 设置缓存(key: string, result: string): void {
        if (this.结果缓存.size < this.最大缓存大小) {
            this.结果缓存.set(key, result);
        } else {
            const 删除数量 = Math.floor(this.最大缓存大小 * 0.2);
            const iter = this.结果缓存.keys();
            for (let i = 0; i < 删除数量; i++) {
                const key = iter.next().value;
                if (key !== undefined) this.结果缓存.delete(key);
            }
            this.结果缓存.set(key, result);
        }
    }
    
    /**
     * 清理缓存
     */
    public static 清理缓存(): void {
        this.结果缓存.clear();
    }
    
    /**
     * 获取统计
     */
    public static 获取统计(): {
        缓存数量: number,
        输入缓存数量: number
    } {
        return {
            缓存数量: this.结果缓存.size,
            输入缓存数量: this.输入缓存.size
        };
    }
}


// ============================================
// 超大数值计算函数
// ============================================

/**
 * 超大数值计算函数（优化版 v2）
 * 
 * 支持输入格式：
 * - 纯数字字符串：'999000000000000000000'
 * - 小写科学计数法：'1e100', '5e200', '1.5e50'
 * - 大写科学计数法：'1E100', '5E200'（自动转小写）
 * 
 * 输出格式：
 * - 完整数字字符串（与 toFixedString 一致）
 * - 精度：前13位有效数字精确，后面补0
 * 
 * @param n1 第一个数值
 * @param n2 第二个数值
 * @param mode 计算模式 1-8
 */
export function js_number_超大数值版(n1: string, n2: string, mode: number): string {
    n1 = 标准化输入(n1);
    n2 = 标准化输入(n2);
    
    // 检查缓存
    const 缓存键 = `${n1}_${n2}_${mode}`;
    const 缓存结果 = 超大数值优化器.获取缓存(缓存键);
    if (缓存结果) return 缓存结果;
    
    const a = 超大数值优化器.获取Decimal(n1);
    const b = 超大数值优化器.获取Decimal(n2);
    
    let 结果: string;
    
    try {
        switch (mode) {
            case 1:
                结果 = 超大数值优化器.格式化(a.plus(b));
                break;
            case 2:
                结果 = 超大数值优化器.格式化(a.minus(b));
                break;
            case 3:
                结果 = 超大数值优化器.格式化(a.mul(b));
                break;
            case 4:
                结果 = 超大数值优化器.格式化(a.div(b).floor());
                break;
            case 5:
                结果 = a.div(b).toFixed(2);
                break;
            case 6:
                结果 = a.div(b).toFixed(5);
                break;
            case 7:
                结果 = 超大数值优化器.格式化(a.pow(b));
                break;
            case 8:
                {
                    const 项数 = b.minus(a).plus(超大数值优化器.ONE);
                    const 和 = a.plus(b);
                    结果 = 超大数值优化器.格式化(项数.mul(和).div(超大数值优化器.TWO));
                }
                break;
            default:
                结果 = 超大数值优化器.格式化(a.plus(b));
        }
    } catch (error) {
        console.log('超大数值计算错误:', error);
        结果 = n1;
    }
    
    超大数值优化器.设置缓存(缓存键, 结果);
    return 结果;
}

/**
 * 超大数值比较函数
 * 支持科学计数法输入（大小写E/e）
 */
export function js_war_超大数值版(n1: string, n2: string): number {
    n1 = 标准化输入(n1);
    n2 = 标准化输入(n2);
    
    try {
        const a = 超大数值优化器.获取Decimal(n1);
        const b = 超大数值优化器.获取Decimal(n2);
        return a.compareTo(b);
    } catch (error) {
        console.log('超大数值比较错误:', error);
        return 0;
    }
}

// ============================================
// 导出管理函数
// ============================================

export function 清理超大数值缓存(): void {
    超大数值优化器.清理缓存();
}

export function 获取超大数值统计(): {
    缓存数量: number,
    输入缓存数量: number
} {
    return 超大数值优化器.获取统计();
}
