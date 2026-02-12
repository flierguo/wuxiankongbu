import { Decimal } from "./big_number";

/**
 * 高性能计算方法优化版
 * 主要优化：
 * 1. 对象池复用Decimal对象
 * 2. 缓存常用数值
 * 3. 快速路径处理简单计算
 * 4. 减少字符串转换
 * 
 * 计算模式：
 * mode 1: 加法 (n1 + n2)
 * mode 2: 减法 (n1 - n2) 
 * mode 3: 乘法 (n1 * n2)
 * mode 4: 除法 (n1 / n2) - 整数结果
 * mode 5: 除法 (n1 / n2) - 保留2位小数
 * mode 6: 除法 (n1 / n2) - 保留5位小数
 * mode 7: 幂运算 (n1^n2) - 新增
 * mode 8: 等差数列求和 (从n1到n2的连续整数求和) - 新增
 */

// 性能优化：对象池和缓存
class 计算优化器 {
    // Decimal对象池
    private static 对象池: Decimal[] = [];
    private static readonly 池大小 = 20;
    
    // 常用数值缓存
    private static 常用数值缓存 = new Map<string, Decimal>();
    private static readonly 最大缓存数量 = 100;
    
    // 预创建常用Decimal对象
    private static readonly ZERO = new Decimal('0');
    public static readonly ONE = new Decimal('1');
    public static readonly HUNDRED = new Decimal('100');
    
    // 初始化对象池
    static {
        for (let i = 0; i < this.池大小; i++) {
            this.对象池.push(new Decimal('0'));
        }
        
        // 缓存0-1000的整数
        for (let i = 0; i <= 1000; i++) {
            this.常用数值缓存.set(i.toString(), new Decimal(i.toString()));
        }
    }
    
    /**
     * 获取Decimal对象（从缓存或对象池）
     */
    public static 获取Decimal(value: string): Decimal {
        // 快速处理空值
        if (!value || value === '') return this.ZERO;
        
        // 检查常用数值缓存
        if (this.常用数值缓存.has(value)) {
            return this.常用数值缓存.get(value);
        }
        
        // 从对象池获取或创建新对象
        if (this.对象池.length > 0) {
            const decimal = this.对象池.pop();
            try {
                // 重用对象池中的对象
                decimal.constructor(value);
                return decimal;
            } catch {
                return new Decimal(value);
            }
        }
        
        return new Decimal(value);
    }
    
    /**
     * 归还Decimal对象到对象池
     */
    public static 归还对象(decimal: Decimal): void {
        if (this.对象池.length < this.池大小) {
            this.对象池.push(decimal);
        }
    }
    
    /**
     * 缓存计算结果（字符串版本）
     */
    private static 结果缓存 = new Map<string, string>();
    
    public static 获取缓存结果(key: string): string | null {
        return this.结果缓存.get(key) || null;
    }
    
    public static 缓存结果(key: string, result: string): void {
        if (this.结果缓存.size < 200) {
            this.结果缓存.set(key, result);
        }
    }
    
    /**
     * 缓存计算结果（Decimal对象版本）
     */
    private static Decimal结果缓存 = new Map<string, Decimal>();
    
    public static 获取Decimal缓存结果(key: string): Decimal | null {
        return this.Decimal结果缓存.get(key) || null;
    }
    
    public static 缓存Decimal结果(key: string, result: Decimal): void {
        if (this.Decimal结果缓存.size < 200) {
            // 创建新对象避免引用问题
            const cached = new Decimal(result);
            this.Decimal结果缓存.set(key, cached);
        }
    }
    
    /**
     * 获取Decimal对象（支持number和string类型）
     */
    public static 获取Decimal_数值版(value: number | string): Decimal {
        // 快速处理空值
        if (value == null || value === '') return this.ZERO;
        
        // 如果是number类型，直接转换
        if (typeof value === 'number') {
            if (isNaN(value) || !isFinite(value)) return this.ZERO;
            const valueStr = value.toString();
            // 检查常用数值缓存
            if (this.常用数值缓存.has(valueStr)) {
                return this.常用数值缓存.get(valueStr);
            }
            return new Decimal(value);
        }
        
        // string类型使用原有逻辑
        return this.获取Decimal(value);
    }
    
    public static 清理缓存(): void {
        this.结果缓存.clear();
        this.Decimal结果缓存.clear();
    }
}

/**
 * 高性能js_number函数
 */
export function js_number_高性能版(n1: string, n2: string, mode: number): string {
    // 快速处理特殊情况
    if (!n1 || n1 === '') n1 = '0';
    if (!n2 || n2 === '') n2 = '0';
    
    // 检查结果缓存
    const 缓存键 = `${n1}_${n2}_${mode}`;
    const 缓存结果 = 计算优化器.获取缓存结果(缓存键);
    if (缓存结果) {
        return 缓存结果;
    }
    
    let 结果: string;
    
    // 快速路径：简单的数值计算
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);
    
    // 如果是简单的小数值，使用原生JavaScript计算
    if (num1 < 100000000 && num2 < 100000000 && 
        Number.isInteger(num1) && Number.isInteger(num2) && 
        !isNaN(num1) && !isNaN(num2)) {
        
        let 简单结果: number;
        switch (mode) {
            case 1: 简单结果 = num1 + num2; break;
            case 2: 简单结果 = num1 - num2; break;
            case 3: 简单结果 = num1 * num2; break;
            case 4: 简单结果 = Math.floor(num1 / num2); break;
            case 5: 简单结果 = parseFloat((num1 / num2).toFixed(2)); break;
            case 6: 简单结果 = parseFloat((num1 / num2).toFixed(5)); break;
            case 7: 简单结果 = Math.pow(num1, num2); break; // 幂运算
            case 8: // 等差数列求和：从num1到num2的连续整数求和
                简单结果 = (num2 - num1 + 1) * (num1 + num2) / 2; break;
            default: 简单结果 = num1 + num2;
        }
        
        结果 = mode === 5 ? 简单结果.toFixed(2) : 
               mode === 6 ? 简单结果.toFixed(5) : 
               简单结果.toString();
    } else {
        // 复杂计算使用Decimal
        const a = 计算优化器.获取Decimal(n1);
        const b = 计算优化器.获取Decimal(n2);
        
        try {
            switch (mode) {
                case 1: 结果 = a.plus(b).toFixedString(0); break;
                case 2: 结果 = a.minus(b).toFixedString(0); break;
                case 3: 结果 = a.mul(b).toFixedString(0); break;
                case 4: 结果 = a.div(b).toFixedString(0); break;
                case 5: 结果 = a.div(b).toFixed(2); break;
                case 6: 结果 = a.div(b).toFixed(5); break;
                case 7: 结果 = a.pow(b).toFixedString(0); break; // 幂运算
                case 8: // 等差数列求和：从a到b的连续整数求和
                    const 项数 = b.minus(a).plus(计算优化器.ONE);
                    const 和 = a.plus(b);
                    结果 = 项数.mul(和).div(new Decimal('2')).toFixedString(0); break;
                default: 结果 = a.plus(b).toFixedString(0);
            }
        } catch (error) {
            console.log('计算错误:', error);
            结果 = n1; // 出错时返回第一个参数
        }
    }
    
    // 缓存结果
    计算优化器.缓存结果(缓存键, 结果);
    
    return 结果;
}

/**
 * 高性能数值运算函数（返回Decimal对象）
 * 支持number和string类型输入，返回Decimal对象以支持大数值计算
 * 
 * @param n1 第一个数值（number或string）
 * @param n2 第二个数值（number或string）
 * @param mode 计算模式（1-8，与字符串版本相同）
 * @returns Decimal对象，可通过.toNumber()转换为number，或.toString()转换为string
 * 
 * 计算模式：
 * mode 1: 加法 (n1 + n2)
 * mode 2: 减法 (n1 - n2) 
 * mode 3: 乘法 (n1 * n2)
 * mode 4: 除法 (n1 / n2) - 整数结果
 * mode 5: 除法 (n1 / n2) - 保留2位小数
 * mode 6: 除法 (n1 / n2) - 保留5位小数
 * mode 7: 幂运算 (n1^n2)
 * mode 8: 等差数列求和 (从n1到n2的连续整数求和)
 */
export function js_number_数值版(n1: number | string, n2: number | string, mode: number): Decimal {
    // 快速处理特殊情况
    if (n1 == null || n1 === '') n1 = 0;
    if (n2 == null || n2 === '') n2 = 0;
    
    // 转换为字符串用于缓存键
    const n1Str = typeof n1 === 'number' ? n1.toString() : n1;
    const n2Str = typeof n2 === 'number' ? n2.toString() : n2;
    
    // 检查结果缓存
    const 缓存键 = `${n1Str}_${n2Str}_${mode}`;
    const 缓存结果 = 计算优化器.获取Decimal缓存结果(缓存键);
    if (缓存结果) {
        return new Decimal(缓存结果); // 返回新对象避免引用问题
    }
    
    let 结果: Decimal;
    
    // 快速路径：简单的数值计算
    const num1 = typeof n1 === 'number' ? n1 : parseFloat(n1Str);
    const num2 = typeof n2 === 'number' ? n2 : parseFloat(n2Str);
    
    // 如果是简单的小数值，使用原生JavaScript计算后转换为Decimal
    if (num1 < 100000000 && num2 < 100000000 && 
        Number.isInteger(num1) && Number.isInteger(num2) && 
        !isNaN(num1) && !isNaN(num2)) {
        
        let 简单结果: number;
        switch (mode) {
            case 1: 简单结果 = num1 + num2; break;
            case 2: 简单结果 = num1 - num2; break;
            case 3: 简单结果 = num1 * num2; break;
            case 4: 简单结果 = Math.floor(num1 / num2); break;
            case 5: 简单结果 = parseFloat((num1 / num2).toFixed(2)); break;
            case 6: 简单结果 = parseFloat((num1 / num2).toFixed(5)); break;
            case 7: 简单结果 = Math.pow(num1, num2); break; // 幂运算
            case 8: // 等差数列求和：从num1到num2的连续整数求和
                简单结果 = (num2 - num1 + 1) * (num1 + num2) / 2; break;
            default: 简单结果 = num1 + num2;
        }
        
        结果 = new Decimal(简单结果);
    } else {
        // 复杂计算使用Decimal
        const a = 计算优化器.获取Decimal_数值版(n1);
        const b = 计算优化器.获取Decimal_数值版(n2);
        
        try {
            switch (mode) {
                case 1: 结果 = a.plus(b); break;
                case 2: 结果 = a.minus(b); break;
                case 3: 结果 = a.mul(b); break;
                case 4: 结果 = a.div(b).floor(); break; // 整数结果
                case 5: 
                    // 保留2位小数：先计算，然后通过toFixed再转回Decimal
                    const div5 = a.div(b);
                    const num5 = div5.toNumber();
                    if (isFinite(num5)) {
                        结果 = new Decimal(parseFloat(num5.toFixed(2)));
                    } else {
                        结果 = div5; // 超出范围时返回原始结果
                    }
                    break;
                case 6:
                    // 保留5位小数
                    const div6 = a.div(b);
                    const num6 = div6.toNumber();
                    if (isFinite(num6)) {
                        结果 = new Decimal(parseFloat(num6.toFixed(5)));
                    } else {
                        结果 = div6;
                    }
                    break;
                case 7: 
                    // 幂运算：a^b
                    // Decimal.pow(power) 中power是实际的指数值（number类型）
                    const powerNum = b.toNumber();
                    if (isFinite(powerNum) && !isNaN(powerNum)) {
                        // b可以转换为number，直接使用Decimal.pow
                        结果 = a.pow(powerNum);
                    } else {
                        // b太大无法转换为number，使用对数方法计算
                        // a^b = 10^(log10(a) * b)，其中b = 10^log10(b) = 10^b.l
                        // 所以：a^b = 10^(a.l * 10^b.l)
                        // 但10^b.l可能还是太大，所以需要检查
                        if (b.l < 15 && isFinite(b.l)) {
                            const bValue = Math.pow(10, b.l);
                            if (isFinite(bValue)) {
                                结果 = a.pow(bValue);
                            } else {
                                // 仍然太大，返回Infinity
                                结果 = Decimal.fromLog10(Number.POSITIVE_INFINITY);
                            }
                        } else {
                            // b.l本身也很大，结果必然是Infinity
                            结果 = Decimal.fromLog10(Number.POSITIVE_INFINITY);
                        }
                    }
                    break;
                case 8: // 等差数列求和：从a到b的连续整数求和
                    const 项数 = b.minus(a).plus(计算优化器.ONE);
                    const 和 = a.plus(b);
                    结果 = 项数.mul(和).div(new Decimal('2')); break;
                default: 结果 = a.plus(b);
            }
        } catch (error) {
            console.log('计算错误:', error);
            结果 = 计算优化器.获取Decimal_数值版(n1); // 出错时返回第一个参数
        }
    }
    
    // 缓存结果
    计算优化器.缓存Decimal结果(缓存键, 结果);
    
    return 结果;
}

/**
 * 高性能js_war函数
 */
export function js_war_高性能版(n1: string, n2: string): number {
    // 快速处理特殊情况
    if (!n1 || n1 === '') n1 = '0';
    if (!n2 || n2 === '') n2 = '0';
    
    // 快速路径：简单的数值比较
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);
    
    if (num1 < 990000000000000 && num2 < 990000000000000 && 
        !isNaN(num1) && !isNaN(num2)) {
        
        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
        return 0;
    }
    
    // 复杂比较使用Decimal
    try {
        const a = 计算优化器.获取Decimal(n1);
        const b = 计算优化器.获取Decimal(n2);
        return a.compareTo(b);
    } catch (error) {
        console.log('比较错误:', error);
        return 0;
    }
}

/**
 * 高性能百分比计算
 */
export function js_percentage_高性能版(n1: string): string {
    if (!n1 || n1 === '') return '0.00';
    
    const num = parseFloat(n1);
    if (!isNaN(num) && num < 1000000) {
        return (num / 100).toFixed(2);
    }
    
    try {
        const a = 计算优化器.获取Decimal(n1);
        return a.div(计算优化器.HUNDRED).toFixed(2);
    } catch (error) {
        return '0.00';
    }
}

/**
 * 批量计算优化函数
 * 用于批量处理多个相同类型的计算
 */
export function js_number_批量计算(
    数值对数组: Array<{n1: string, n2: string}>, 
    mode: number
): string[] {
    const 结果: string[] = [];
    
    for (const {n1, n2} of 数值对数组) {
        结果.push(js_number_高性能版(n1, n2, mode));
    }
    
    return 结果;
}

/**
 * 清理优化器缓存
 */
export function 清理计算缓存(): void {
    计算优化器.清理缓存();
}

/**
 * 幂运算函数
 * @param base 底数
 * @param exponent 指数
 * @returns base的exponent次方
 */
export function js_power(base: string, exponent: string): string {
    return js_number_高性能版(base, exponent, 7);
}

/**
 * 平方计算函数（幂运算的特殊情况）
 * @param n 要计算平方的数值
 * @returns n的平方
 */
export function js_square(n: string): string {
    return js_power(n, '2');
}

/**
 * 立方计算函数（幂运算的特殊情况）
 * @param n 要计算立方的数值
 * @returns n的立方
 */
export function js_cube(n: string): string {
    return js_power(n, '3');
}

/**
 * 等差数列求和函数
 * @param start 起始数值
 * @param end 结束数值
 * @returns 从start到end的连续整数求和
 * @example js_sum_range('1', '100') 返回 '5050' (1+2+3+...+100的结果)
 */
export function js_sum_range(start: string, end: string): string {
    return js_number_高性能版(start, end, 8);
}

/**
 * 计算1到n的连续整数求和
 * @param n 结束数值
 * @returns 1到n的连续整数求和
 * @example js_sum_to_n('100') 返回 '5050' (1+2+3+...+100的结果)
 */
export function js_sum_to_n(n: string): string {
    return js_sum_range('1', n);
}

/**
 * 数值运算的便捷函数（返回number类型，超出范围时返回Infinity）
 * 注意：大数值会丢失精度，建议使用js_number_数值版获取Decimal对象
 */
export function js_number_数值版_转number(n1: number | string, n2: number | string, mode: number): number {
    const result = js_number_数值版(n1, n2, mode);
    return result.toNumber();
}

/**
 * 数值运算的便捷函数（返回string类型）
 */
export function js_number_数值版_转string(n1: number | string, n2: number | string, mode: number): string {
    const result = js_number_数值版(n1, n2, mode);
    return result.toString();
}

/**
 * 数值比较函数（支持number和string类型）
 * @returns 1: n1 > n2, -1: n1 < n2, 0: n1 == n2
 */
export function js_war_数值版(n1: number | string, n2: number | string): number {
    // 快速处理特殊情况
    if (n1 == null || n1 === '') n1 = 0;
    if (n2 == null || n2 === '') n2 = 0;
    
    // 快速路径：简单的数值比较
    const num1 = typeof n1 === 'number' ? n1 : parseFloat(n1.toString());
    const num2 = typeof n2 === 'number' ? n2 : parseFloat(n2.toString());
    
    if (num1 < 990000000000000 && num2 < 990000000000000 && 
        !isNaN(num1) && !isNaN(num2)) {
        
        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
        return 0;
    }
    
    // 复杂比较使用Decimal
    try {
        const a = 计算优化器.获取Decimal_数值版(n1);
        const b = 计算优化器.获取Decimal_数值版(n2);
        return a.compareTo(b);
    } catch (error) {
        console.log('比较错误:', error);
        return 0;
    }
}

/**
 * 获取计算器统计
 */
export function 获取计算器统计(): {
    缓存数量: number,
    Decimal缓存数量: number,
    对象池大小: number,
    常用数值缓存数量: number
} {
    return {
        缓存数量: 计算优化器['结果缓存'].size,
        Decimal缓存数量: 计算优化器['Decimal结果缓存'].size,
        对象池大小: 计算优化器['对象池'].length,
        常用数值缓存数量: 计算优化器['常用数值缓存'].size
    };
}

// 兼容性：导出原始函数名的高性能版本
export const js_number = js_number_高性能版;
export const js_war = js_war_高性能版;
export const js_percentage = js_percentage_高性能版;


