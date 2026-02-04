/**
 * 装备属性随机测试
 * 模拟装备掉落时的属性生成，检查每条属性是否独立随机
 */

// 模拟配置
const 数值平衡配置 = {
    随机倍数最小: 0.3,
    随机倍数最大: 1.7,
}

const 装备基础值配置 = {
    属性基础: 1000,
    魔次基础: 5,
}

const 难度系数配置 = {
    简单: 1,
    普通: 3,
    困难: 10,
}

// 模拟智能计算（简化版，仅用于测试）
function 智能计算(n1: string, n2: string, mode: number): string {
    const num1 = parseFloat(n1)
    const num2 = parseFloat(n2)
    if (mode === 3) {
        return String(Math.floor(num1 * num2))
    }
    return String(num1 * num2)
}

// 模拟 random 函数
function random(max: number): number {
    return Math.floor(Math.random() * max)
}

/**
 * 计算属性值（与装备掉落.ts中的函数相同）
 */
function 计算属性值(地图强度: number, 难度名: string, 极品倍率: number, 神器倍数: number, 装备倍数: number = 0): string {
    const 难度系数 = 难度系数配置[难度名 as keyof typeof 难度系数配置] || 1
    const 地图难度倍数 = 地图强度 * 难度系数
    
    // 生成独立随机倍数
    const 随机倍数 = 数值平衡配置.随机倍数最小 + Math.random() * (数值平衡配置.随机倍数最大 - 数值平衡配置.随机倍数最小)
    
    // 生成随机整数因子
    const 随机整数因子 = 1 + random(100)
    
    // 合并所有倍数
    let 总倍数 = 地图难度倍数 * 随机倍数 * 随机整数因子 / 50
    if (极品倍率 > 1) {
        总倍数 *= 极品倍率
    }
    if (神器倍数 > 1) {
        总倍数 *= 神器倍数
    }
    if (装备倍数 > 0) {
        总倍数 *= 装备倍数
    }
    
    const 属性值 = 智能计算(String(装备基础值配置.属性基础), 总倍数.toFixed(6), 3)
    
    // 输出调试信息
    console.log(`  随机倍数: ${随机倍数.toFixed(4)}, 随机整数因子: ${随机整数因子}, 总倍数: ${总倍数.toFixed(4)}, 属性值: ${属性值}`)
    
    return 属性值
}

/**
 * 模拟生成一件装备的多条属性
 */
function 模拟装备生成(词条数: number, 地图强度: number, 难度名: string): void {
    console.log(`\n========== 模拟装备生成 ==========`)
    console.log(`词条数: ${词条数}, 地图强度: ${地图强度}, 难度: ${难度名}`)
    console.log(`----------------------------------`)
    
    const 属性值列表: string[] = []
    
    for (let i = 0; i < 词条数; i++) {
        console.log(`词条 ${i + 1}:`)
        const 属性值 = 计算属性值(地图强度, 难度名, 1, 0, 0)
        属性值列表.push(属性值)
    }
    
    console.log(`----------------------------------`)
    console.log(`所有属性值: [${属性值列表.join(', ')}]`)
    
    // 检查是否有重复
    const 唯一值 = [...new Set(属性值列表)]
    console.log(`唯一属性值数量: ${唯一值.length} / ${词条数}`)
    if (唯一值.length < 词条数) {
        console.log(`⚠️ 存在重复属性值!`)
    } else {
        console.log(`✅ 所有属性值都不同`)
    }
}

// 运行测试
console.log('==========================================')
console.log('       装备属性随机测试')
console.log('==========================================')

// 测试1: 新手地图，简单难度，4条词条
模拟装备生成(4, 10, '简单')

// 测试2: 新手地图，简单难度，8条词条
模拟装备生成(8, 10, '简单')

// 测试3: 高强度地图，困难难度，6条词条
模拟装备生成(6, 100, '困难')

// 测试4: 多次生成同一配置，检查是否每次都不同
console.log('\n========== 多次生成测试 ==========')
console.log('生成5件相同配置的装备，检查属性值分布:')
for (let i = 0; i < 5; i++) {
    console.log(`\n--- 装备 ${i + 1} ---`)
    const 属性值列表: string[] = []
    for (let j = 0; j < 4; j++) {
        const 属性值 = 计算属性值(10, '简单', 1, 0, 0)
        属性值列表.push(属性值)
    }
    console.log(`属性值: [${属性值列表.join(', ')}]`)
}

console.log('\n==========================================')
console.log('       测试完成')
console.log('==========================================')
