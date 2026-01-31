/**
 * 神器系统
 * 三栏布局：左侧套装列表(竖列) -> 中间组件列表(2列) -> 右侧详细信息
 * 布局参考图片样式，使用坐标定位
 */

import { 神器套装配置, 特殊单件配置, type 神器套装数据, type 特殊单件数据 } from './神器配置';

// 合并套装和特殊单件用于左侧列表显示
interface 显示项 {
    类型: '套装' | '特殊单件';
    名称: string;
    索引: number; // 在原数组中的索引
}

// 生成显示列表
function 生成显示列表(): 显示项[] {
    const 列表: 显示项[] = [];
    // 添加特殊单件分类
    if (特殊单件配置.length > 0) {
        列表.push({ 类型: '特殊单件', 名称: '特殊单件', 索引: -1 });
    }

    // 添加所有套装
    神器套装配置.forEach((套装, index) => {
        列表.push({ 类型: '套装', 名称: 套装.套装名称, 索引: index });
    });


    return 列表;
}

const 显示列表 = 生成显示列表();

// 布局常量
const 左侧起始X = 30;
const 左侧起始Y = 45;
const 左侧行高 = 25;
const 左侧宽度 = 120;

const 中间起始X = 170;
const 中间起始Y = 100;
const 中间列宽 = 110;
const 中间行高 = 25;

const 右侧起始X = 170;
const 右侧起始Y = 300;
const 每行最大字符数 = 60; // 右侧区域每行最大字符数（中文算2个）

/**
 * 主入口 - 显示神器系统界面
 */
export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    显示主界面(Npc, Player, 0, -1);
}

/**
 * 显示主界面
 * @param 选中索引 当前选中的显示项索引
 * @param 选中组件索引 当前选中的组件索引，-1表示未选中
 */
function 显示主界面(Npc: TNormNpc, Player: TPlayObject, 选中索引: number, 选中组件索引: number): void {
    let S = '';

    // ========== 左侧：套装/单件列表 ==========
    for (let i = 0; i < 显示列表.length; i++) {
        const 项 = 显示列表[i];
        const Y坐标 = 左侧起始Y + i * 左侧行高;
        const 颜色 = i === 选中索引 ? 249 : 251;
        const 前缀 = i === 选中索引 ? '▶' : '　';
        S += `<&{S=${前缀}「${项.名称}」;C=${颜色};X=${左侧起始X};Y=${Y坐标 + 5};H=${左侧行高}}{M=295,295,295;F=新UI素材文件.data;X=25;Y=${Y坐标}}/@选择项(${i})>`;
    }

    // ========== 中间和右侧：根据选中类型显示不同内容 ==========
    const 当前项 = 显示列表[选中索引];

    if (当前项.类型 === '套装') {
        S = 显示套装详情(S, Player, 当前项.索引, 选中组件索引);
    } else {
        S = 显示特殊单件列表(S, Player, 选中组件索引);
    }

    Npc.SayEx(Player, '神器界面大', S);
}

/**
 * 显示套装详情
 */
function 显示套装详情(S: string, Player: TPlayObject, 套装索引: number, 选中组件索引: number): string {
    const 当前套装 = 神器套装配置[套装索引];

    // ========== 中间：组件列表 ==========
    S += `{S=${当前套装.套装名称}组件:;C=239;X=${中间起始X};Y=${中间起始Y - 40};FS=12}`;

    for (let i = 0; i < 当前套装.组件列表.length; i++) {
        const 组件名称 = 当前套装.组件列表[i];
        const 炼化次数 = Player.V[组件名称] || 0;
        const 已获得 = 炼化次数 > 0;

        // 计算位置：每行3个
        const 行号 = Math.floor(i / 3);
        const 列号 = i % 3;
        const X坐标 = 中间起始X + 列号 * 中间列宽;
        const Y坐标 = 中间起始Y + 行号 * 中间行高;

        // 颜色：选中=金色，已获得=绿色，未获得=灰色
        let 颜色: number;
        if (i === 选中组件索引) {
            颜色 = 249;
        } else if (已获得) {
            颜色 = 250;
        } else {
            颜色 = 246;
        }

        const 状态标记 = 已获得 ? '✓' : '✗';
        S += `<&{S=${状态标记} ${组件名称};C=${颜色};X=${X坐标};Y=${Y坐标};H=${中间行高}}/@选择组件(${套装索引},${i})>`;
    }

    // ========== 右侧：详细信息 ==========
    let 右侧Y = 右侧起始Y;

    // 属性加成标题
    S += `{S=属性加成:;C=191;X=${右侧起始X};Y=${右侧Y - 25}}`;

    // 单件属性
    for (const 属性 of 当前套装.单件属性) {
        S += `{S=${属性};C=250;X=${右侧起始X};Y=${右侧Y}}`;
        右侧Y += 20;
    }

    右侧Y += 15;

    // 全套激活效果标题
    S += `{S=全套激活效果:;C=191;X=${右侧起始X};Y=${右侧Y}}`;
    右侧Y += 25;

    // 套装属性
    for (const 属性 of 当前套装.套装属性) {
        const 换行文本 = 自动换行(属性);
        for (const 行 of 换行文本) {
            S += `{S=${行};C=249;X=${右侧起始X};Y=${右侧Y}}`;
            右侧Y += 20;
        }
    }

    右侧Y += 15;

    // 获取信息
    S += `{S=获取:;C=252;X=${右侧起始X};Y=${右侧Y}}{S=${当前套装.来源};C=251;X=${右侧起始X + 40};Y=${右侧Y}}`;
    右侧Y += 25;

    // 如果选中了组件，显示该组件的状态
    if (选中组件索引 >= 0 && 选中组件索引 < 当前套装.组件列表.length) {
        const 组件名称 = 当前套装.组件列表[选中组件索引];
        const 炼化次数 = Player.V[组件名称] || 0;
        const 获得状态 = 炼化次数 > 0 ? '已获得' : '未获得';
        const 状态颜色 = 炼化次数 > 0 ? 250 : 251;

        S += `{S=状态:;C=146;X=${右侧起始X};Y=${右侧Y}}{S=${获得状态};C=${状态颜色};X=${右侧起始X + 40};Y=${右侧Y}}`;
        S += `{S=已炼化:;C=146;X=${右侧起始X + 115};Y=${右侧Y}}{S=${炼化次数}次;C=249;X=${右侧起始X + 160};Y=${右侧Y}}`;
    }

    return S;
}

/**
 * 显示特殊单件列表
 */
function 显示特殊单件列表(S: string, Player: TPlayObject, 选中组件索引: number): string {
    // ========== 中间：特殊单件列表 ==========
    S += `{S=特殊单件列表:;C=239;X=${中间起始X};Y=${中间起始Y - 40};FS=12}`;

    for (let i = 0; i < 特殊单件配置.length; i++) {
        const 单件 = 特殊单件配置[i];
        const 炼化次数 = Player.V[单件.组件名称] || 0;
        const 已获得 = 炼化次数 > 0;

        // 计算位置：每行3个
        const 行号 = Math.floor(i / 3);
        const 列号 = i % 3;
        const X坐标 = 中间起始X + 列号 * 中间列宽;
        const Y坐标 = 中间起始Y + 行号 * 中间行高;

        // 颜色：选中=金色，已获得=绿色，未获得=灰色
        let 颜色: number;
        if (i === 选中组件索引) {
            颜色 = 249;
        } else if (已获得) {
            颜色 = 250;
        } else {
            颜色 = 246;
        }

        const 状态标记 = 已获得 ? '✓' : '✗';
        S += `<&{S=${状态标记} ${单件.组件名称};C=${颜色};X=${X坐标};Y=${Y坐标};H=${中间行高}}/@选择特殊单件(${i})>`;
    }

    // ========== 右侧：特殊单件详细信息 ==========
    if (选中组件索引 >= 0 && 选中组件索引 < 特殊单件配置.length) {
        const 单件 = 特殊单件配置[选中组件索引];
        let 右侧Y = 右侧起始Y;

        // 属性加成标题
        S += `{S=属性加成:;C=191;X=${右侧起始X};Y=${右侧Y - 25}}`;

        // 单件属性
        for (const 属性 of 单件.属性描述) {
            const 换行文本 = 自动换行(属性);
            for (const 行 of 换行文本) {
                S += `{S=${行};C=250;X=${右侧起始X};Y=${右侧Y}}`;
                右侧Y += 20;
            }
        }

        右侧Y += 15;

        // 获取信息
        S += `{S=获取:;C=252;X=${右侧起始X};Y=${右侧Y}}{S=${单件.来源};C=251;X=${右侧起始X + 40};Y=${右侧Y}}`;
        右侧Y += 25;

        // 状态信息
        const 炼化次数 = Player.V[单件.组件名称] || 0;
        const 获得状态 = 炼化次数 > 0 ? '已获得' : '未获得';
        const 状态颜色 = 炼化次数 > 0 ? 250 : 251;

        S += `{S=状态:;C=146;X=${右侧起始X};Y=${右侧Y}}{S=${获得状态};C=${状态颜色};X=${右侧起始X + 40};Y=${右侧Y}}`;
        S += `{S=已炼化:;C=146;X=${右侧起始X + 115};Y=${右侧Y}}{S=${炼化次数}次;C=249;X=${右侧起始X + 160};Y=${右侧Y}}`;
    }

    return S;
}

/**
 * 选择项（套装或特殊单件）
 */
export function 选择项(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 索引 = Args.Int[0];
    if (索引 >= 0 && 索引 < 显示列表.length) {
        显示主界面(Npc, Player, 索引, -1);
    }
}

/**
 * 选择套装（兼容旧接口）
 */
export function 选择套装(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 套装索引 = Args.Int[0];
    if (套装索引 >= 0 && 套装索引 < 神器套装配置.length) {
        显示主界面(Npc, Player, 套装索引, -1);
    }
}

/**
 * 选择组件
 */
export function 选择组件(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 套装索引 = Args.Int[0];
    const 组件索引 = Args.Int[1];

    if (套装索引 >= 0 && 套装索引 < 神器套装配置.length) {
        const 套装 = 神器套装配置[套装索引];
        if (组件索引 >= 0 && 组件索引 < 套装.组件列表.length) {
            显示主界面(Npc, Player, 套装索引 + 1, 组件索引);
        }
    }
}

/**
 * 选择特殊单件
 */
export function 选择特殊单件(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 单件索引 = Args.Int[0];

    // 找到特殊单件在显示列表中的索引
    const 显示索引 = 显示列表.findIndex(项 => 项.类型 === '特殊单件');

    if (显示索引 >= 0 && 单件索引 >= 0 && 单件索引 < 特殊单件配置.length) {
        显示主界面(Npc, Player, 显示索引, 单件索引);
    }
}

/**
 * 获取玩家已收集的组件数量
 */
export function 获取收集进度(Player: TPlayObject, 套装索引: number): { 已收集: number; 总数: number } {
    if (套装索引 < 0 || 套装索引 >= 神器套装配置.length) {
        return { 已收集: 0, 总数: 0 };
    }

    const 套装 = 神器套装配置[套装索引];
    let 已收集 = 0;

    for (const 组件名称 of 套装.组件列表) {
        const 炼化次数 = Player.V[组件名称] || 0;
        if (炼化次数 > 0) {
            已收集++;
        }
    }

    return { 已收集, 总数: 套装.组件列表.length };
}


/**
 * 自动换行处理
 * @param 文本 原始文本
 * @param 最大宽度 每行最大字符数（中文算2个字符）
 * @returns 换行后的文本数组
 */
function 自动换行(文本: string, 最大宽度: number = 每行最大字符数): string[] {
    const 结果: string[] = [];
    let 当前行 = '';
    let 当前宽度 = 0;

    for (let i = 0; i < 文本.length; i++) {
        const 字符 = 文本[i];
        // 中文字符宽度为2，其他为1
        const 字符宽度 = 字符.charCodeAt(0) > 127 ? 2 : 1;

        if (当前宽度 + 字符宽度 > 最大宽度) {
            结果.push(当前行);
            当前行 = 字符;
            当前宽度 = 字符宽度;
        } else {
            当前行 += 字符;
            当前宽度 += 字符宽度;
        }
    }

    if (当前行.length > 0) {
        结果.push(当前行);
    }

    return 结果;
}


/**
 * 检查套装是否激活
 */
export function 检查套装激活(Player: TPlayObject, 套装索引: number): boolean {
    const 进度 = 获取收集进度(Player, 套装索引);
    return 进度.已收集 >= 进度.总数;
}

/**
 * 增加组件炼化次数
 */
export function 增加炼化次数(Player: TPlayObject, 组件名称: string, 次数: number = 1): void {
    const 当前次数 = Player.V[组件名称] || 0;
    Player.V[组件名称] = 当前次数 + 次数;
}

/**
 * 获取所有套装列表（供外部调用）
 */
export function 获取套装列表(): 神器套装数据[] {
    return 神器套装配置;
}

/**
 * 根据名称获取套装索引
 */
export function 获取套装索引(套装名称: string): number {
    return 神器套装配置.findIndex(套装 => 套装.套装名称 === 套装名称);
}
