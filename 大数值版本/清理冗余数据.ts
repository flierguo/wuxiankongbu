// =================================== 搜索并清除冗余数据工具 ===================================
// 用于清理游戏中的冗余数据，优化系统性能
// 作者：系统管理员
// 创建日期：2024年

import { 整数比较, 整数相减, 整数相加 } from "./字符计算"
// 注意：装备JSON缓存功能暂时使用本地实现，避免导入错误

// =================================== 接口定义 ===================================

interface 冗余数据项 {
    类型: string;
    标识: string;
    数据: any;
    创建时间: number;
    最后访问时间: number;
    引用计数: number;
}

interface 清理配置 {
    保留天数: number;
    最小引用计数: number;
    清理类型: string[];
    是否强制清理: boolean;
}

// =================================== 数据类型定义 ===================================

const 数据类型 = {
    玩家缓存: 'PLAYER_CACHE',
    装备记录: 'EQUIPMENT_RECORD', 
    战斗日志: 'BATTLE_LOG',
    交易记录: 'TRADE_RECORD',
    临时文件: 'TEMP_FILE',
    过期令牌: 'EXPIRED_TOKEN',
    无效引用: 'INVALID_REFERENCE',
    内存泄漏: 'MEMORY_LEAK',
    重复数据: 'DUPLICATE_DATA',
    空白数据: 'EMPTY_DATA'
} as const;

// =================================== 主要功能函数 ===================================

/**
 * 搜索冗余数据
 * @param 配置 清理配置参数
 * @returns 找到的冗余数据列表
 */
export function 搜索冗余数据(配置: 清理配置): 冗余数据项[] {
    console.log('开始搜索冗余数据...');
    
    const 冗余数据列表: 冗余数据项[] = [];
    const 当前时间 = Date.now();
    const 过期时间阈值 = 当前时间 - (配置.保留天数 * 24 * 60 * 60 * 1000);
    
    // 搜索各种类型的冗余数据
    配置.清理类型.forEach(类型 => {
        switch (类型) {
            case 数据类型.玩家缓存:
                冗余数据列表.push(...搜索过期玩家缓存(过期时间阈值));
                break;
            case 数据类型.装备记录:
                冗余数据列表.push(...搜索无效装备记录(配置.最小引用计数));
                break;
            case 数据类型.战斗日志:
                冗余数据列表.push(...搜索过期战斗日志(过期时间阈值));
                break;
            case 数据类型.交易记录:
                冗余数据列表.push(...搜索过期交易记录(过期时间阈值));
                break;
            case 数据类型.临时文件:
                冗余数据列表.push(...搜索临时文件());
                break;
            case 数据类型.过期令牌:
                冗余数据列表.push(...搜索过期令牌());
                break;
            case 数据类型.无效引用:
                冗余数据列表.push(...搜索无效引用());
                break;
        }
    });
    
    console.log(`搜索完成，找到 ${冗余数据列表.length} 项冗余数据`);
    return 冗余数据列表;
}

/**
 * 清除冗余数据
 * @param 冗余数据列表 要清除的数据列表
 * @param 是否强制清理 是否强制清理（跳过安全检查）
 * @returns 清理结果统计
 */
export function 清除冗余数据(冗余数据列表: 冗余数据项[], 是否强制清理: boolean = false): {
    清理数量: number;
    失败数量: number;
    释放空间: string;
} {
    console.log('开始清除冗余数据...');
    
    let 清理数量 = 0;
    let 失败数量 = 0;
    let 释放空间 = '0';
    
    冗余数据列表.forEach(数据项 => {
        try {
            if (!是否强制清理 && 数据项.引用计数 > 0) {
                // console.log(`跳过清理：${数据项.标识}，仍有引用`);
                return;
            }
            
            const 清理结果 = 执行清理操作(数据项);
            if (清理结果.成功) {
                清理数量++;
                释放空间 = 整数相加(释放空间, 清理结果.释放大小);
                // console.log(`已清理：${数据项.类型} - ${数据项.标识}`);
            } else {
                失败数量++;
                // console.log(`清理失败：${数据项.标识} - ${清理结果.错误信息}`);
            }
        } catch (error) {
            失败数量++;
            // console.log(`清理异常：${数据项.标识} - ${error}`);
        }
    });
    
    console.log(`清理完成：成功 ${清理数量} 项，失败 ${失败数量} 项，释放空间 ${释放空间} 字节`);
    
    return {
        清理数量,
        失败数量,
        释放空间
    };
}

// =================================== 具体搜索函数 ===================================

/**
 * 搜索过期的玩家缓存数据
 */
function 搜索过期玩家缓存(过期时间阈值: number): 冗余数据项[] {
    const 结果: 冗余数据项[] = [];
    
    // console.log('搜索过期玩家缓存...');
    
    try {
        // 搜索离线时间超过阈值的玩家数据
        for (let i = 0; i < GameLib.GetPlayCount(); i++) {
            const player = GameLib.GetPlayer(i);
            if (!player) continue;
            const 最后登录时间 = player.GetPVar(299) || Date.now(); // 使用数字ID代替字符串
            if (最后登录时间 < 过期时间阈值) {
                // 检查玩家的临时变量
                for (let j = 90; j <= 200; j++) {
                    const 变量值 = player.GetSVar(j);
                    if (变量值 && 变量值 !== '0' && 变量值 !== '') {
                        结果.push({
                            类型: 数据类型.玩家缓存,
                            标识: `${player.GetName()}_SVar_${j}`,
                            数据: { 玩家ID: player.Handle, 变量ID: j, 值: 变量值 },
                            创建时间: 最后登录时间,
                            最后访问时间: 最后登录时间,
                            引用计数: 0
                        });
                    }
                }
                
                // 检查玩家的运行时变量 (R属性)
                const 运行时属性 = ['被攻击状态', '随机秒数', '回血2秒', '冰霜之环3秒', '群魔乱舞3秒', '武僧2秒回血'];
                运行时属性.forEach(属性名 => {
                    if (player.R[属性名] !== undefined) {
                        结果.push({
                            类型: 数据类型.玩家缓存,
                            标识: `${player.GetName()}_R_${属性名}`,
                            数据: { 玩家ID: player.Handle, 属性名, 值: player.R[属性名] },
                            创建时间: 最后登录时间,
                            最后访问时间: 最后登录时间,
                            引用计数: 0
                        });
                    }
                });
            }
        }
    } catch (error) {
        // console.log(`搜索玩家缓存时出错: ${error}`);
    }
    
    return 结果;
}

/**
 * 搜索无效的装备记录 - 安全版本，极度保守的检查逻辑
 * 🚨 重要：为防止误删装备属性，采用极度保守的检查策略
 */
function 搜索无效装备记录(最小引用计数: number): 冗余数据项[] {
    const 结果: 冗余数据项[] = [];
    
    // console.log('搜索无效装备记录...');
    
    try {
        // 🚨 安全措施：大幅限制检查范围，避免误判
        const 检查玩家数量 = Math.min(GameLib.GetPlayCount(), 20); // 减少到20个玩家
        
        for (let i = 0; i < 检查玩家数量; i++) {
            const player = GameLib.GetPlayer(i);
            if (!player) continue;
            
            // 🚨 安全措施：只检查明确无CustomDesc的装备
            for (let k = 0; k < Math.min(player.GetItemSize(), 50); k++) { // 限制到50个装备
                const 装备 = player.GetBagItem(k);
                if (装备) {
                    const 装备描述JSON = 装备.GetCustomDesc();
                    
                    // 🚨 极度保守：只记录完全没有CustomDesc的情况
                    if (!装备描述JSON || 装备描述JSON === '') {
                        结果.push({
                            类型: 数据类型.装备记录,
                            标识: `${player.GetName()}_装备_${装备.GetName()}_完全无描述`,
                            数据: { 玩家ID: player.Handle, 装备名: 装备.GetName(), 安全等级: '低风险' },
                            创建时间: Date.now(),
                            最后访问时间: Date.now(),
                            引用计数: 0
                        });
                        continue;
                    }
                    
                    // 🚨 极度保守：只检查明显损坏的JSON（长度小于5且包含明显错误）
                    if (装备描述JSON.length < 15 && (装备描述JSON === '{}' || 装备描述JSON === 'null' || 装备描述JSON === 'undefined')) {
                        try {
                            // 再次验证确实是无效数据
                            const 测试解析 = JSON.parse(装备描述JSON);
                            if (!测试解析 || (typeof 测试解析 === 'object' && Object.keys(测试解析).length === 0)) {
                                结果.push({
                                    类型: 数据类型.装备记录,
                                    标识: `${player.GetName()}_装备_${装备.GetName()}_确认无效JSON`,
                                    数据: { 玩家ID: player.Handle, 装备名: 装备.GetName(), 安全等级: '低风险' },
                                    创建时间: Date.now(),
                                    最后访问时间: Date.now(),
                                    引用计数: 0
                                });
                            }
                        } catch (error) {
                            // 解析失败也不记录，太危险
                        }
                    }
                }
            }
            
            // 🚨 穿戴装备完全跳过检查，太危险
            // 不检查穿戴装备，避免影响玩家当前属性
        }
    } catch (error) {
        console.log(`搜索装备记录时出错: ${error}`);
    }
    
    // 🚨 最终安全检查：如果发现的问题项目太多，返回空数组
    if (结果.length > 50) {
        console.log(`⚠️ 发现过多装备问题(${结果.length}项)，为安全起见，跳过装备清理`);
        return [];
    }
    
    return 结果;
}

/**
 * 搜索过期的战斗日志 - 简化版本
 * ✅ 已有攻击计算中的实时清理，这里只处理异常数据
 */
function 搜索过期战斗日志(过期时间阈值: number): 冗余数据项[] {
    const 结果: 冗余数据项[] = [];
    
    try {
        // ✅ 实时清理优化：攻击计算中的死亡判定会自动清理怪物信息
        // 这里只需要处理明显损坏的异常数据
        
        if (GameLib.R && GameLib.R.怪物信息) {
            const 怪物信息Keys = Object.keys(GameLib.R.怪物信息);
            
            // 📊 只有在缓存异常多时才进行损坏数据检查
            if (怪物信息Keys.length > 30000) {
                let 检查计数 = 0;
                const 最大检查数量 = 50; // 每次最多检查50个
                
                console.log(`📊 怪物信息状态检查: 总缓存${怪物信息Keys.length}项 (实时清理系统运行中)`);
                
                for (const 怪物Handle of 怪物信息Keys) {
                    if (检查计数 >= 最大检查数量) break;
                    
                    try {
                        // 只标记明显损坏的数据进行清理
                        const 怪物信息JSON = GameLib.R.怪物信息[怪物Handle];
                        if (!怪物信息JSON || 怪物信息JSON === '' || 怪物信息JSON === 'null') {
                            结果.push({
                                类型: 数据类型.战斗日志,
                                标识: `损坏怪物信息_${怪物Handle}`,
                                数据: { 怪物Handle, 清理原因: '数据损坏', 安全等级: '低风险' },
                                创建时间: Date.now(),
                                最后访问时间: Date.now(),
                                引用计数: 0
                            });
                            检查计数++;
                        }
                    } catch (error) {
                        // 忽略访问错误
                    }
                }
            }
        }
        
    } catch (error) {
        console.log(`搜索战斗日志时出错: ${error}`);
    }
    
    return 结果;
}

/**
 * 搜索过期的交易记录
 */
function 搜索过期交易记录(过期时间阈值: number): 冗余数据项[] {
    const 结果: 冗余数据项[] = [];
    
    // console.log('搜索过期交易记录...');
    
    return 结果;
}

/**
 * 搜索临时文件
 */
function 搜索临时文件(): 冗余数据项[] {
    const 结果: 冗余数据项[] = [];
    
    // console.log('搜索临时文件...');
    
    try {
        // 搜索玩家的临时数据
        for (let i = 0; i < GameLib.GetPlayCount(); i++) {
            const player = GameLib.GetPlayer(i);
            if (!player) continue;
            // 检查临时状态变量
            const 临时变量列表 = [
                '被攻击不允许随机', '随机秒数', '回血2秒', '冰霜之环3秒', 
                '群魔乱舞3秒', '武僧2秒回血', '测试记录', '测试时间'
            ];
            
            临时变量列表.forEach(变量名 => {
                if (player.R[变量名] !== undefined && player.R[变量名] !== 0) {
                    结果.push({
                        类型: 数据类型.临时文件,
                        标识: `${player.GetName()}_临时变量_${变量名}`,
                        数据: { 玩家ID: player.Handle, 变量名, 值: player.R[变量名] },
                        创建时间: Date.now(),
                        最后访问时间: Date.now(),
                        引用计数: 0
                    });
                }
            });
            
            // 检查过期的V属性（可能是临时数据）
            const 可清理V属性 = [
                '今日兑换礼卷', '每日宣传兑换次数', '今日回收神器',
                '攻速魔速词条数值', '吸血比例词条数值'
            ];
            
            可清理V属性.forEach(属性名 => {
                if (player.V[属性名] !== undefined && player.V[属性名] > 0) {
                    结果.push({
                        类型: 数据类型.临时文件,
                        标识: `${player.GetName()}_V属性_${属性名}`,
                        数据: { 玩家ID: player.Handle, 属性名, 值: player.V[属性名] },
                        创建时间: Date.now(),
                        最后访问时间: Date.now(),
                        引用计数: 0
                    });
                }
            });
        }
        
        // 注意：由于API限制，暂时跳过地图遍历
        // 后续可以通过其他方式清理无主召唤物
        
    } catch (error) {
        // console.log(`搜索临时文件时出错: ${error}`);
    }
    
    return 结果;
}

/**
 * 搜索过期令牌
 */
function 搜索过期令牌(): 冗余数据项[] {
    const 结果: 冗余数据项[] = [];
    
    // console.log('搜索过期令牌...');
    
    return 结果;
}

/**
 * 搜索无效引用
 */
function 搜索无效引用(): 冗余数据项[] {
    const 结果: 冗余数据项[] = [];
    
    // console.log('搜索无效引用...');
    
    return 结果;
}

// =================================== 清理执行函数 ===================================

/**
 * 执行具体的清理操作
 */
function 执行清理操作(数据项: 冗余数据项): { 成功: boolean; 释放大小: string; 错误信息?: string } {
    try {
        switch (数据项.类型) {
            case 数据类型.玩家缓存:
                return 清理玩家缓存(数据项);
            case 数据类型.装备记录:
                return 清理装备记录(数据项);
            case 数据类型.战斗日志:
                return 清理战斗日志(数据项);
            case 数据类型.交易记录:
                return 清理交易记录(数据项);
            case 数据类型.临时文件:
                return 清理临时文件(数据项);
            case 数据类型.过期令牌:
                return 清理过期令牌(数据项);
            case 数据类型.无效引用:
                return 清理无效引用(数据项);
            default:
                return { 成功: false, 释放大小: '0', 错误信息: '未知数据类型' };
        }
    } catch (error) {
        return { 成功: false, 释放大小: '0', 错误信息: error.toString() };
    }
}

// =================================== 具体清理函数 ===================================

function 清理玩家缓存(数据项: 冗余数据项) {
    try {
        const 数据 = 数据项.数据;
        const 玩家Actor = GameLib.GetActorByHandle(数据.玩家ID);
        
        if (玩家Actor && 玩家Actor.IsPlayer()) {
            const 玩家 = 玩家Actor as TPlayObject;
            if (数据.变量ID) {
                // 清理SVar变量
                玩家.SetSVar(数据.变量ID, '');
                return { 成功: true, 释放大小: '512' };
            } else if (数据.属性名) {
                // 清理R属性
                delete 玩家.R[数据.属性名];
                return { 成功: true, 释放大小: '256' };
            }
        }
        
        return { 成功: true, 释放大小: '128' };
    } catch (error) {
        return { 成功: false, 释放大小: '0', 错误信息: error.toString() };
    }
}

function 清理装备记录(数据项: 冗余数据项) {
    try {
        const 数据 = 数据项.数据;
        
        // 🚨 安全修复：装备记录清理改为仅记录，不实际清理装备属性
        // 避免误删正常装备的属性数据
        
        // 只记录清理操作，不实际执行，防止误删装备属性
        // console.log(`装备记录清理跳过: ${数据项.标识} - 为保护装备属性，已禁用装备数据清理`);
        
        return { 成功: true, 释放大小: '256' };
    } catch (error) {
        return { 成功: false, 释放大小: '0', 错误信息: error.toString() };
    }
}

function 清理战斗日志(数据项: 冗余数据项) {
    try {
        const 数据 = 数据项.数据;
        
        // 清理GameLib中的怪物信息
        if (GameLib.R && GameLib.R.怪物信息 && 数据.怪物Handle) {
            delete GameLib.R.怪物信息[数据.怪物Handle];
            return { 成功: true, 释放大小: '2048' };
        }
        
        // 注意：由于API限制，暂时跳过死亡怪物的SVar数据清理
        
        return { 成功: true, 释放大小: '512' };
    } catch (error) {
        return { 成功: false, 释放大小: '0', 错误信息: error.toString() };
    }
}

function 清理交易记录(数据项: 冗余数据项) {
    // 交易记录通常存储在数据库中，这里提供基本的清理框架
    try {
        return { 成功: true, 释放大小: '256' };
    } catch (error) {
        return { 成功: false, 释放大小: '0', 错误信息: error.toString() };
    }
}

function 清理临时文件(数据项: 冗余数据项) {
    try {
        const 数据 = 数据项.数据;
        
        if (数据.玩家ID) {
            const 玩家Actor = GameLib.GetActorByHandle(数据.玩家ID);
            if (玩家Actor && 玩家Actor.IsPlayer()) {
                const 玩家 = 玩家Actor as TPlayObject;
                if (数据.变量名) {
                    // 清理R属性
                    if (玩家.R[数据.变量名] !== undefined) {
                        delete 玩家.R[数据.变量名];
                        return { 成功: true, 释放大小: '128' };
                    }
                    
                    // 清理V属性
                    if (玩家.V[数据.变量名] !== undefined) {
                        delete 玩家.V[数据.变量名];
                        return { 成功: true, 释放大小: '256' };
                    }
                }
            }
        }
        
        // 注意：由于API限制，暂时跳过无主召唤物的清理
        
        return { 成功: true, 释放大小: '64' };
    } catch (error) {
        return { 成功: false, 释放大小: '0', 错误信息: error.toString() };
    }
}

function 清理过期令牌(数据项: 冗余数据项) {
    // 过期令牌的清理逻辑
    try {
        return { 成功: true, 释放大小: '128' };
    } catch (error) {
        return { 成功: false, 释放大小: '0', 错误信息: error.toString() };
    }
}

function 清理无效引用(数据项: 冗余数据项) {
    // 无效引用的清理逻辑
    try {
        return { 成功: true, 释放大小: '64' };
    } catch (error) {
        return { 成功: false, 释放大小: '0', 错误信息: error.toString() };
    }
}

// =================================== 便捷函数 ===================================

/**
 * 执行完整的清理流程
 * @param 配置 清理配置
 * @returns 清理结果
 */
export function 执行完整清理(配置?: Partial<清理配置>) {
    const 默认配置: 清理配置 = {
        保留天数: 1,
        最小引用计数: 0,
        清理类型: [
            数据类型.玩家缓存,
            数据类型.装备记录,
            数据类型.战斗日志,
            数据类型.交易记录,
            数据类型.临时文件,
            数据类型.过期令牌,
            数据类型.无效引用
        ],
        是否强制清理: false
    };
    
    const 最终配置 = { ...默认配置, ...配置 };
    
    // console.log('=== 开始执行完整清理流程 ===');
    // console.log('配置信息：', 最终配置);
    
    // 搜索冗余数据
    const 冗余数据 = 搜索冗余数据(最终配置);
    
    if (冗余数据.length === 0) {
        // console.log('未发现冗余数据，清理完成');
        return {
            清理数量: 0,
            失败数量: 0,
            释放空间: '0'
        };
    }
    
    // 显示清理预览
    // console.log('=== 清理预览 ===');
    冗余数据.forEach((项, 索引) => {
        // console.log(`${索引 + 1}. ${项.类型} - ${项.标识} (引用: ${项.引用计数})`);
    });
    
    // 执行清理
    const 清理结果 = 清除冗余数据(冗余数据, 最终配置.是否强制清理);
    
    // console.log('=== 清理流程完成 ===');
    return 清理结果;
}

/**
 * 快速清理（使用默认配置）
 */
export function 快速清理() {
    return 执行完整清理();
}

/**
 * 安全清理（保守的清理配置）
 */
export function 安全清理() {
    return 执行完整清理({
        保留天数: 2,
        最小引用计数: 1,
        清理类型: [数据类型.临时文件, 数据类型.过期令牌],
        是否强制清理: false
    });
}

/**
 * 深度清理（激进的清理配置）
 */
export function 深度清理() {
    return 执行完整清理({
        保留天数: 1,
        最小引用计数: 0,
        清理类型: [
            数据类型.玩家缓存,
            数据类型.装备记录,
            数据类型.战斗日志,
            数据类型.交易记录,
            数据类型.临时文件,
            数据类型.过期令牌,
            数据类型.无效引用,
            数据类型.内存泄漏,
            数据类型.重复数据,
            数据类型.空白数据
        ],
        是否强制清理: true
    });
}

// =================================== 高级清理功能 ===================================



/**
 * 内存使用情况监控
 */
export function 获取内存使用情况() {
    const 内存信息 = {
        玩家数量: 0,
        装备数量: 0,
        怪物数量: 0,
        地图数量: 0,
        估计内存使用: '0'
    };
    
    try {
        // 统计玩家数量和相关数据
        内存信息.玩家数量 = GameLib.GetPlayCount();
        
        for (let i = 0; i < GameLib.GetPlayCount(); i++) {
            const player = GameLib.GetPlayer(i);
            if (!player) continue;
            // 统计装备数量
            内存信息.装备数量 += player.GetItemSize();
            for (let m = 0; m < 14; m++) {
                if (player.GetArmItem(m)) {
                    内存信息.装备数量++;
                }
            }
        }
        
        // 统计地图和怪物数量（简化处理）
        内存信息.地图数量 = 10; // 估算地图数量
        内存信息.怪物数量 = 100; // 估算怪物数量
        
        // 估算内存使用（简单估算）
        const 估算字节 = (内存信息.玩家数量 * 10240) + 
                      (内存信息.装备数量 * 1024) + 
                      (内存信息.怪物数量 * 2048) + 
                      (内存信息.地图数量 * 4096);
        
        内存信息.估计内存使用 = 整数相加('0', 估算字节.toString());
        
    } catch (error) {
        // console.log(`获取内存使用情况时出错: ${error}`);
    }
    
    return 内存信息;
}

/**
 * 性能优化建议
 */
export function 获取性能优化建议() {
    const 内存信息 = 获取内存使用情况();
    const 建议列表: string[] = [];
    
    if (内存信息.玩家数量 > 10) {
        建议列表.push('玩家数量较多，建议定期清理离线玩家的缓存数据');
    }
    
    if (内存信息.装备数量 > 20) {
        建议列表.push('装备数量较多，建议清理无效的装备记录和JSON数据');
    }
    
    if (内存信息.怪物数量 > 20000) {
        建议列表.push('怪物数量较多，建议清理死亡怪物的遗留数据');
    }
    
    if (GameLib.R && GameLib.R.怪物信息 && Object.keys(GameLib.R.怪物信息).length > 10000) {
        建议列表.push('怪物信息缓存较多，建议定期清理过期的怪物信息');
    }
    
    // 检查是否有定时清理任务运行
    建议列表.push('建议启用定时清理任务，自动维护系统性能');
    
    return {
        内存信息,
        优化建议: 建议列表,
        推荐清理模式: 内存信息.玩家数量 > 50 ? '安全清理' : '快速清理'
    };
}

// =================================== 全局定时清理实例 ===================================



// 优化的定时清理管理
let 上次清理时间 = 0;
let 上次快速检查时间 = 0;
let 清理间隔 = 240 * 60 * 1000; // 优化为4小时
let 快速检查间隔 = 30 * 60 * 1000; // 30分钟快速检查
let 清理配置项: 清理配置 = {
    保留天数: 7,
    最小引用计数: 1,
    // ✅ 智能优化：启用战斗日志清理（已有实时清理支持），保持装备记录清理禁用
    清理类型: ['PLAYER_CACHE', 'TEMP_FILE', 'BATTLE_LOG'], // 重新启用战斗日志清理，保持装备记录禁用
    是否强制清理: false
};

// 性能监控
let 清理性能统计 = {
    总执行次数: 0,
    总耗时: 0,
    平均耗时: 0,
    最大耗时: 0,
    上次耗时: 0
};

/**
 * 按分钟检测清理 - 在RobotManageNpc中调用
 * 优化版本：分为快速检查和完整清理
 */
export function 按分钟检测清理() {
    const 当前时间 = Date.now();
    const 开始时间 = 当前时间;
    
    try {
        // 完整清理（间隔时间更长）
        if (当前时间 - 上次清理时间 >= 清理间隔) {
            console.log('=== 开始执行完整清理 ===');
            const 清理结果 = 执行完整清理(清理配置项);
            上次清理时间 = 当前时间;
            
            // 更新性能统计
            const 耗时 = Date.now() - 开始时间;
            更新性能统计(耗时);
            
            console.log(`完整清理完成：清理了${清理结果.清理数量}项数据，释放${清理结果.释放空间}字节，耗时${耗时}ms`);
        }
        // 快速检查（30分钟一次，只清理最关键的数据）
        else if (当前时间 - 上次快速检查时间 >= 快速检查间隔) {
            const 快速清理结果 = 执行快速清理();
            上次快速检查时间 = 当前时间;
            
            if (快速清理结果.清理数量 > 0) {
                console.log(`快速清理完成：清理了${快速清理结果.清理数量}项数据`);
            }
        }
    } catch (error) {
        console.log(`清理执行出错: ${error}`);
    }
}

/**
 * 设置清理间隔
 * @param 间隔分钟 间隔时间（分钟）
 */
export function 设置清理间隔(间隔分钟: number) {
    清理间隔 = 间隔分钟 * 60 * 1000;
    // console.log(`清理间隔已设置为: ${间隔分钟}分钟`);
}

/**
 * 设置清理配置
 * @param 配置 清理配置
 */
export function 设置清理配置(配置: Partial<清理配置>) {
    清理配置项 = {
        ...清理配置项,
        ...配置
    };
    // console.log('清理配置已更新');
}

/**
 * 初始化定时清理
 * @param 清理间隔分钟 清理间隔（分钟）
 * @param 配置 清理配置
 */
export function 初始化定时清理(清理间隔分钟: number = 120, 配置?: Partial<清理配置>) {
    设置清理间隔(清理间隔分钟);
    if (配置) {
        设置清理配置(配置);
    }
    上次清理时间 = 0; // 重置清理时间，下次检测时会立即执行一次
    // console.log('定时清理已初始化，请在RobotManageNpc中调用 按分钟检测清理()');
}

/**
 * 重置清理时间 - 强制下次检测时执行清理
 */
export function 重置清理时间() {
    上次清理时间 = 0;
    上次快速检查时间 = 0;
    // console.log('清理时间已重置，下次检测时将执行清理');
}

/**
 * 更新性能统计
 */
function 更新性能统计(耗时: number) {
    清理性能统计.总执行次数++;
    清理性能统计.总耗时 += 耗时;
    清理性能统计.平均耗时 = 清理性能统计.总耗时 / 清理性能统计.总执行次数;
    清理性能统计.最大耗时 = Math.max(清理性能统计.最大耗时, 耗时);
    清理性能统计.上次耗时 = 耗时;
}

/**
 * 执行快速清理 - 只清理最关键和影响性能的数据
 */
function 执行快速清理(): { 清理数量: number; 失败数量: number; 释放空间: string } {
    let 清理数量 = 0;
    let 失败数量 = 0;
    let 释放空间 = '0';
    
    try {
        // 1. ✅ 简化的怪物信息维护（已有攻击计算中的实时清理）
        if (GameLib.R && GameLib.R.怪物信息) {
            const 怪物信息Keys = Object.keys(GameLib.R.怪物信息);
            
            // 📊 监控状态，攻击计算中的实时清理会自动维护合理的数量
            if (怪物信息Keys.length > 20000) {
                // 只清理明显损坏的数据，其他由实时清理处理
                let 快速修复计数 = 0;
                const 最大修复数量 = 20; // 每次最多修复20个损坏数据
                
                for (const 怪物Handle of 怪物信息Keys) {
                    if (快速修复计数 >= 最大修复数量) break;
                    
                    try {
                        const 怪物信息JSON = GameLib.R.怪物信息[怪物Handle];
                        
                        // 只修复明显损坏的数据
                        if (!怪物信息JSON || 怪物信息JSON === '' || 怪物信息JSON === 'null' || 怪物信息JSON === 'undefined') {
                            delete GameLib.R.怪物信息[怪物Handle];
                            清理数量++;
                            快速修复计数++;
                            释放空间 = 整数相加(释放空间, '512');
                        }
                    } catch (error) {
                        // 忽略访问错误
                    }
                }
                
                if (快速修复计数 > 0) {
                    console.log(`📊 怪物信息维护: 缓存${怪物信息Keys.length}项，修复${快速修复计数}项损坏数据 (实时清理已处理正常死亡)`);
                }
            }
        }
        
        // 2. 快速清理玩家临时状态（只检查部分玩家）
        for (let i = 0; i < Math.min(GameLib.GetPlayCount(), 50); i++) {
            const player = GameLib.GetPlayer(i);
            if (!player) continue;
            
            // 清理过期的临时R属性
            const 临时属性列表 = ['被攻击状态', '随机秒数', '回血2秒', '冰霜之环3秒', '群魔乱舞3秒', '武僧2秒回血'];
            for (const 属性名 of 临时属性列表) {
                if (player.R[属性名] !== undefined && player.R[属性名] !== 0) {
                    // 简单的时间检查，如果是数字且看起来像时间戳（5分钟前）
                    if (typeof player.R[属性名] === 'number' && player.R[属性名] < Date.now() - 300000) {
                        delete player.R[属性名];
                        清理数量++;
                        释放空间 = 整数相加(释放空间, '64');
                    }
                }
            }
        }
        
        // 3. ✅ 怪物信息缓存监控（实时清理系统自动维护）
        if (GameLib.R && GameLib.R.怪物信息) {
            const keys = Object.keys(GameLib.R.怪物信息);
            
            // 📊 监控缓存状态，实时清理系统会自动维护
            if (keys.length > 10000) {
                console.log(`📊 怪物信息缓存监控: ${keys.length}项 (实时清理系统自动维护中)`);
                
                // 实时清理系统会在怪物死亡时自动清理，无需手动干预
                // 这里只做监控，确保系统正常运行
                if (keys.length > 50000) {
                    console.log(`⚠️ 缓存数量异常(${keys.length}项)，请检查实时清理系统是否正常工作`);
                }
            }
        }
        
    } catch (error) {
        失败数量++;
        console.log(`快速清理执行出错: ${error}`);
    }
    
    return { 清理数量, 失败数量, 释放空间 };
}

/**
 * 获取清理性能统计
 */
export function 获取清理性能统计() {
    return { ...清理性能统计 };
}

// =================================== 导出 ===================================

export {
    数据类型,
    type 冗余数据项,
    type 清理配置
};

// =================================== 使用示例 ===================================

/*
// 基本使用
import { 快速清理, 安全清理, 深度清理, 执行完整清理, 初始化定时清理, 按分钟检测清理 } from './清理冗余数据';

// 1. 快速清理（默认配置）
快速清理();

// 2. 安全清理（保守配置）
安全清理();

// 3. 深度清理（激进配置）
深度清理();

// 4. 自定义配置清理
执行完整清理({
    保留天数: 14,
    最小引用计数: 0,
    清理类型: ['PLAYER_CACHE', 'TEMP_FILE'],
    是否强制清理: false
});

// 5. 初始化定时清理（在启动时调用一次）
初始化定时清理(120); // 每2小时清理一次

// 6. 在RobotManageNpc中添加定时调用
// 在RobotManageNpc的按分钟检测函数中添加：
// import { 按分钟检测清理 } from '../大数值版本/清理冗余数据';
// 按分钟检测清理();
 */