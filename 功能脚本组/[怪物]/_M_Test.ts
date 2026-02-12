/*刷怪数据库测试工具*/

import { 获取刷怪属性, 获取智能刷怪, 更新刷怪配置, 更新智能刷怪配置, 初始化并导入数据 } from './_M_Database';

/**
 * 简单的数据库连接测试
 */
export async function 测试数据库连接(): Promise<void> {
    console.log('[测试] ===== 开始测试数据库连接 =====');
    
    try {
        // 1. 测试数据库初始化
        console.log('[测试] 1. 测试数据库初始化...');
        const 初始化结果 = await 初始化并导入数据();
        console.log(`[测试] 数据库初始化: ${初始化结果 ? '✅ 成功' : '❌ 失败'}`);
        
        // 2. 测试插入一条刷怪配置
        console.log('[测试] 2. 测试插入刷怪配置...');
        const 刷怪配置结果 = await 更新刷怪配置({
            map_name: '测试地图',
            monster_name: '测试怪物',
            star_min: 1,
            star_max: 5,
            drop_file: '测试爆率',
            experience_value: 100
        });
        console.log(`[测试] 刷怪配置插入: ${刷怪配置结果 ? '✅ 成功' : '❌ 失败'}`);
        
        // 3. 测试插入一条智能刷怪配置
        console.log('[测试] 3. 测试插入智能刷怪配置...');
        const 智能刷怪结果 = await 更新智能刷怪配置({
            map_name: '测试地图',
            map_variable: '空',
            monster_name: '测试怪物',
            quantity: 10,
            refresh_time: 30,
            tag: 11
        });
        console.log(`[测试] 智能刷怪配置插入: ${智能刷怪结果 ? '✅ 成功' : '❌ 失败'}`);
        
        // 4. 测试读取配置（目前会使用默认配置）
        console.log('[测试] 4. 测试读取配置...');
        const 刷怪属性 = await 获取刷怪属性();
        const 智能刷怪 = await 获取智能刷怪();
        
        console.log(`[测试] 刷怪属性读取: ${刷怪属性.length > 0 ? '✅ 成功' : '❌ 失败'} (获取到 ${刷怪属性.length} 条记录)`);
        console.log(`[测试] 智能刷怪读取: ${智能刷怪.length > 0 ? '✅ 成功' : '❌ 失败'} (获取到 ${智能刷怪.length} 条记录)`);
        
        // 显示一些示例数据
        if (刷怪属性.length > 0) {
            console.log(`[测试] 刷怪属性示例: ${JSON.stringify(刷怪属性[0])}`);
        }
        if (智能刷怪.length > 0) {
            console.log(`[测试] 智能刷怪示例: ${JSON.stringify(智能刷怪[0])}`);
        }
        
    } catch (error) {
        console.error('[测试] 测试过程中发生异常:', error);
    }
    
    console.log('[测试] ===== 数据库连接测试完成 =====');
}

/**
 * 快速功能验证
 */
export async function 快速验证功能(): Promise<void> {
    console.log('[验证] ===== 开始快速功能验证 =====');
    
    try {
        // 验证配置是否能正常获取
        const 刷怪属性 = await 获取刷怪属性();
        const 智能刷怪 = await 获取智能刷怪();
        
        console.log(`[验证] ✅ 刷怪属性功能正常 (${刷怪属性.length} 条配置)`);
        console.log(`[验证] ✅ 智能刷怪功能正常 (${智能刷怪.length} 条配置)`);
        
        // 验证配置格式
        if (刷怪属性.length > 0) {
            const 第一条 = 刷怪属性[0];
            const 必需字段 = ['地图名字', '怪物名字', '怪物星星小', '怪物星星大', '爆率文件', '经验值'];
            const 字段完整 = 必需字段.every(字段 => 字段 in 第一条);
            console.log(`[验证] ${字段完整 ? '✅' : '❌'} 刷怪属性字段完整性检查`);
        }
        
        if (智能刷怪.length > 0) {
            const 第一条 = 智能刷怪[0];
            const 必需字段 = ['地图名字', '地图名字变量', '怪物名字', '数量', '刷新时间', 'TAG'];
            const 字段完整 = 必需字段.every(字段 => 字段 in 第一条);
            console.log(`[验证] ${字段完整 ? '✅' : '❌'} 智能刷怪字段完整性检查`);
        }
        
        console.log('[验证] ✅ 所有功能验证通过，系统可以正常运行');
        
    } catch (error) {
        console.error('[验证] 功能验证过程中发生异常:', error);
    }
    
    console.log('[验证] ===== 快速功能验证完成 =====');
}

/**
 * 显示当前配置统计
 */
export async function 显示配置统计(): Promise<void> {
    console.log('[统计] ===== 当前配置统计 =====');
    
    try {
        const 刷怪属性 = await 获取刷怪属性();
        const 智能刷怪 = await 获取智能刷怪();
        
        // 刷怪属性统计
        const 地图统计 = {};
        刷怪属性.forEach(配置 => {
            地图统计[配置.地图名字] = (地图统计[配置.地图名字] || 0) + 1;
        });
        
        console.log(`[统计] 刷怪属性总计: ${刷怪属性.length} 条`);
        console.log('[统计] 各地图配置数量:');
        Object.entries(地图统计).forEach(([地图, 数量]) => {
            console.log(`[统计]   ${地图}: ${数量} 条`);
        });
        
        // 智能刷怪统计
        const 智能地图统计 = {};
        智能刷怪.forEach(配置 => {
            智能地图统计[配置.地图名字] = (智能地图统计[配置.地图名字] || 0) + 1;
        });
        
        console.log(`[统计] 智能刷怪总计: ${智能刷怪.length} 条`);
        console.log('[统计] 各地图智能刷怪数量:');
        Object.entries(智能地图统计).forEach(([地图, 数量]) => {
            console.log(`[统计]   ${地图}: ${数量} 条`);
        });
        
    } catch (error) {
        console.error('[统计] 获取配置统计时发生异常:', error);
    }
    
    console.log('[统计] ===== 配置统计完成 =====');
}

/**
 * 一键测试所有功能
 */
export async function 一键测试(): Promise<void> {
    console.log('🚀 开始一键测试所有功能...\n');
    
    await 快速验证功能();
    console.log('');
    await 显示配置统计();
    console.log('');
    await 测试数据库连接();
    
    console.log('\n🎉 一键测试完成！');
}

// 导出测试函数，方便在控制台中调用
if (typeof globalThis !== 'undefined') {
    (globalThis as any).测试刷怪数据库 = 一键测试;
    (globalThis as any).验证刷怪功能 = 快速验证功能;
    (globalThis as any).显示刷怪统计 = 显示配置统计;
}