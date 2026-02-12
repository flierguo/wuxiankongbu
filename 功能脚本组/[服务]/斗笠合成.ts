// =================================== 导入依赖 ===================================
import { js_number, js_numberRandom2 } from "../../全局脚本[公共单元]/utils/计算方法"
import { 数字转单位2, 数字转单位3, 整数相加, 整数相乘, 整数比较, 整数相减 } from "../../大数值版本/字符计算"
import { 大数值整数简写, 随机小数 } from "./延时跳转"

// =================================== 类型定义 ===================================
interface 装备属性记录 {
    职业属性_职业: number[]
    职业属性_属性: string[]
    职业属性_生肖: string[]
}

// =================================== 装备记录功能 ===================================

/**
 * 初始化装备属性记录
 * @param UserItem 装备对象
 * @returns 装备属性记录对象
 */
function 初始化装备属性记录(UserItem: TUserItem): 装备属性记录 {
    const 现有描述 = UserItem.GetCustomDesc()

    if (现有描述 && 现有描述.length > 0) {
        try {
            const 装备属性记录 = JSON.parse(现有描述) as 装备属性记录
            return 装备属性记录
        } catch (e) {
            // 解析失败，重新初始化
        }
    }

    // 返回新的记录对象
    return { 职业属性_职业: [], 职业属性_属性: [], 职业属性_生肖: [] }
}

/**
 * 设置装备属性值
 * @param UserItem 装备对象
 * @param 属性值 属性值字符串
 * @param 是否清空记录 是否清空之前的记录，默认false
 */
function 设置装备属性值(UserItem: TUserItem, 属性值: string, 是否清空记录: boolean = false): void {
    let 装备属性记录 = 初始化装备属性记录(UserItem)

    if (是否清空记录) {
        // 清空之前的属性记录
        装备属性记录 = { 职业属性_职业: [], 职业属性_属性: [], 职业属性_生肖: [] }
    }

    // 使用新的格式设置属性值
    const 索引 = 0
    const 属性ID = 4
    const 前端数字 = 数字转单位2(属性值)
    const 后端单位 = 数字转单位3(属性值)

    UserItem.SetOutWay1(索引, 属性ID)
    UserItem.SetOutWay2(索引, Number(前端数字))
    UserItem.SetOutWay3(索引, Number(后端单位))

    // 记录属性
    装备属性记录.职业属性_职业.push(属性ID)
    装备属性记录.职业属性_属性.push(属性值)

    // 更新装备描述
    UserItem.SetCustomDesc(JSON.stringify(装备属性记录))
}

/**
 * 获取装备记录显示
 * @param UserItem 装备对象
 * @returns 记录显示字符串
 */
function 获取装备记录显示(UserItem: TUserItem): string {
    const 装备属性记录 = 初始化装备属性记录(UserItem)

    if (装备属性记录.职业属性_属性.length === 0) {
        return '{S=暂无属性记录;C=6}\\';
    }

    let 记录显示 = '';

    for (let i = 0; i < 装备属性记录.职业属性_属性.length; i++) {
        const 属性ID = 装备属性记录.职业属性_职业[i];
        const 属性值 = 装备属性记录.职业属性_属性[i];
        记录显示 += `{S=属性ID${属性ID}: ${属性值};C=6}\\`;
    }

    return 记录显示;
}

// =================================== 碎片消耗计算 ===================================

/**
 * 获取指定等级晋级所需的碎片数量
 * @param 等级 当前等级
 * @returns 晋级所需碎片数量
 */
function 获取晋级所需碎片(等级: number): number {
    if (等级 >= 1 && 等级 <= 5) {
        return 10;
    } else if (等级 >= 6 && 等级 <= 10) {
        return 20;
    } else if (等级 >= 11 && 等级 <= 15) {
        return 40;
    } else if (等级 >= 16 && 等级 <= 20) {
        return 60;
    } else if (等级 >= 21 && 等级 <= 25) {
        return 80;
    } else if (等级 >= 26 && 等级 <= 30) {
        return 100;
    } else if (等级 >= 31 && 等级 <= 35) {
        return 150;
    } else if (等级 >= 36 && 等级 <= 40) {
        return 200;
    } else if (等级 >= 41 && 等级 <= 45) {
        return 250;
    } else if (等级 >= 46 && 等级 <= 50) {
        return 400;
    } else if (等级 >= 51 && 等级 <= 70) {
        return 1000;
    } else if (等级 >= 71 && 等级 <= 100) {
        return 1200;
    } else if (等级 >= 101 ) {
        return 1500;
    } 
    return 0;
}

/**
 * 计算斗笠从1级到指定等级的总碎片消耗
 * @param 等级 目标等级
 * @returns 总碎片消耗数量
 */
function 计算总碎片消耗(等级: number): number {
    let 总消耗 = 0;

    for (let i = 1; i < 等级; i++) {
        总消耗 += 获取晋级所需碎片(i);
    }

    return 总消耗;
}

/**
 * 计算晋升后的属性值
 * @param 当前等级 当前斗笠等级
 * @param 当前属性值 当前属性值字符串
 * @returns 晋升后的属性值字符串
 */
function 计算晋升后属性值(当前等级: number, 当前属性值: string): string {
    // if (当前等级 === 100) {
    //     return '200000000000000000000000';
    // }
    if (当前等级 < 20) {
        return js_number(js_number(当前属性值, 随机小数(1, 1.2).toFixed(2), 3), 当前属性值, 1);
    } else if (当前等级 < 40) {
        return js_number(js_number(当前属性值, 随机小数(0.8, 1).toFixed(2), 3), 当前属性值, 1);
    } else if (当前等级 < 60) {
        return js_number(js_number(当前属性值, 随机小数(0.6, 0.8).toFixed(2), 3), 当前属性值, 1);
    } else if (当前等级 < 80) {
        return js_number(js_number(当前属性值, 随机小数(0.4, 0.6).toFixed(2), 3), 当前属性值, 1);
    } else if (当前等级 < 100) {
        return js_number(js_number(当前属性值, 随机小数(0.4, 0.6).toFixed(2), 3), 当前属性值, 1);
    } else if (当前等级 === 100) {
        return '500000000000000000000000';
    } else if (当前等级 < 120) {
        return js_number(js_number(当前属性值, 随机小数(0.4, 0.6).toFixed(2), 3), 当前属性值, 1);
    } else if (当前等级 < 140) {
        return js_number(js_number(当前属性值, 随机小数(0.4, 0.6).toFixed(2), 3), 当前属性值, 1);
    } else if (当前等级 === 150) {
        return '50000000000000000000000000000';
    } else if (当前等级 < 200) {
        return js_number(js_number(当前属性值, 随机小数(0.4, 0.6).toFixed(2), 3), 当前属性值, 1);
    } else if (当前等级 === 200) {
        return '50000000000000000000000000000000000000';
    } else if (当前等级 < 400) {
        return js_number(js_number(当前属性值, 随机小数(0.4, 0.6).toFixed(2), 3), 当前属性值, 1);
    } else if (当前等级 === 400) {
        return '200000000000000000000000000000000000000000000000000000000000000';
    } else if (当前等级 < 600)  {
        return js_number(js_number(当前属性值, 随机小数(0.3, 0.5).toFixed(2), 3), 当前属性值, 1);
    } else if (当前等级 === 600) {
        return '30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    } else if (当前等级 < 900) {
        return js_number(js_number(当前属性值, 随机小数(0.3, 0.5).toFixed(2), 3), 当前属性值, 1);
    } else if (当前等级 === 900) {
        return '100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    } else if (当前等级 < 1000) {
        return js_number(js_number(当前属性值, 随机小数(0.3, 0.5).toFixed(2), 3), 当前属性值, 1);
    } else if (当前等级 === 1000) {
        return '35000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    } else {
        return js_number(js_number(当前属性值, '0.1', 3), 当前属性值, 1);
    }
}

/**
 * 计算当前等级可获得的最大属性值
 * @param 等级 斗笠等级
 * @returns 该等级可获得的最大属性值字符串
 */
function 计算等级最大属性值(等级: number): string {
    if (等级 <= 1) {
        return '1';
    }

    // 使用字符串计算避免数值限制
    // 基础公式：1.5^(等级-1)，但使用字符串计算
    let 结果 = '1';

    // 将1.5转换为字符串计算：每次乘以1.5相当于 结果 * 3 / 2
    for (let i = 1; i < 等级; i++) {
        // 结果 = 结果 * 3 / 2
        结果 = 整数相乘(结果, '3');
        结果 = js_number(结果, '2', 2); // 除以2
    }

    return 结果;
}

// =================================== 主要功能 ===================================

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 检查是否放入了斗笠
    const 斗笠 = Player.GetCustomItem(0);
    let 斗笠信息 = '';

    if (斗笠 && 斗笠.DisplayName.includes('魔血斗笠')) {
        // 提取斗笠等级
        const match = 斗笠.DisplayName.match(/『(\d+)级』/);
        if (match) {
            const 当前等级 = parseInt(match[1]);
            // 从装备记录中获取属性值
            const 装备属性记录 = 初始化装备属性记录(斗笠);
            let 当前属性值 = '0';
            if (装备属性记录.职业属性_属性.length > 0) {
                当前属性值 = 装备属性记录.职业属性_属性[装备属性记录.职业属性_属性.length - 1];
            }
            const 下一级 = 当前等级 + 1;

            // 计算刷新范围
            const 刷新最小值 = 计算等级最大属性值(当前等级);
            const 刷新最大值 = 整数相乘(刷新最小值, '10');

            // 计算晋级所需碎片
            const 晋级所需碎片 = 获取晋级所需碎片(当前等级);

            // 计算晋级后属性值
            const 晋级后属性值 = 计算晋升后属性值(当前等级, 当前属性值);

            const 拥有碎片 = Player.GetItemCount('斗笠碎片');

            // 获取装备记录
            const 装备记录 = 获取装备记录显示(斗笠);

            斗笠信息 = `\\
     {S=━━━ 当前斗笠信息 ━━━;C=2}\\
     {S=斗笠等级: ${当前等级}级;C=6}\\
     {S=当前属性值: (${大数值整数简写(当前属性值)});C=6}\\
     {S=拥有碎片: ${拥有碎片}个;C=6}\\
        `;

            if (当前等级 >= 40000) {
                斗笠信息 += `
     {S=已达到最高等级!;C=4}\\`;
            } else {
                斗笠信息 += `\\
     {S=晋级后等级: ${下一级}级;C=6}\\
     {S=晋级需要: ${晋级所需碎片}个碎片;C=${拥有碎片 >= 晋级所需碎片 ? '6' : '4'}}\\`;
            }

        }
    }

    const S = `\\\\\\\\
    {S=斗笠合成需求:斗笠碎片10个;C=2;X=120}\\
    {S=斗笠晋级需求:根据等级消耗不同数量碎片;C=22;X=120}\\
    ${斗笠信息}

    <{S=斗笠回收;HINT=返还一半的斗笠碎片;X=400;Y=240}/@斗笠回收>\\
    <{S=斗笠合成;HINT=合成1级魔血斗笠;X=400;Y=270}/@斗笠合成>\\
    <{S=斗笠晋级;HINT=提升斗笠等级,最高40000级;X=400;Y=300}/@斗笠晋级>\\
`
    // <{S=属性刷新;HINT=刷新斗笠属性值;X=400;Y=270}/@斗笠刷新>\\
    Player.SayEx('斗笠合成', S)
}


export function 斗笠回收(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 斗笠 = Player.GetCustomItem(0);
    if (!斗笠 || !斗笠.GetName().includes('魔血斗笠')) {
        Player.MessageBox('请先放入斗笠！');
        return;
    }

    // 提取斗笠等级
    const match = 斗笠.DisplayName.match(/『(\d+)级』/);
    if (!match) {
        Player.MessageBox('无法识别斗笠等级！');
        return;
    }

    const 斗笠等级 = parseInt(match[1]);

    // 计算从1级到当前等级的总碎片消耗
    const 总碎片消耗 = 计算总碎片消耗(斗笠等级);

    // 计算回收碎片数量（一半）
    const 回收碎片数量 = Math.floor(总碎片消耗 / 2);

    // 确认回收
    const 确认消息 = `确定要回收这个${斗笠等级}级斗笠吗？\\` +
        `斗笠等级：${斗笠等级}级\\` +
        `总消耗碎片：${总碎片消耗}个\\` +
        `回收碎片：${回收碎片数量}个\\` +
        `回收后斗笠将被删除！`;

    // 显示确认对话框
    Player.MessageBox(确认消息);

    // 删除斗笠
    const 斗笠物品 = Player.GetCustomItem(0);
    if (斗笠物品) {
        Player.DeleteItem(斗笠物品, 1);
    }

    // 给予回收碎片
    if (回收碎片数量 > 0) {

        Npc.Give(Player, '斗笠碎片', 回收碎片数量)

        Player.MessageBox(`回收成功！\\获得斗笠碎片：${回收碎片数量}个`);
    } else {
        Player.MessageBox('回收成功！\\该斗笠等级较低，无碎片返还。');
    }
}

export function 斗笠合成(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.GetItemCount('斗笠碎片') < 10) {
        Player.MessageBox('斗笠碎片不足10个，无法合成！');
        return;
    }

    Npc.Take(Player, '斗笠碎片', 10);

    let 斗笠 = Player.GiveItem('魔血斗笠');

    // 设置斗笠属性 - 使用1级可获得的最大属性值
    const 等级最大属性值 = 计算等级最大属性值(1);
    const 最大值 = 整数相乘(等级最大属性值, '10');
    let 随机属性值 = js_numberRandom2(等级最大属性值, 最大值);

    斗笠.Rename(`『1级』魔血斗笠`);
    斗笠.SetBind(true);
    斗笠.SetNeverDrop(true);
    斗笠.State.SetNoDrop(true);

    // 使用新格式设置属性值（合成时记录属性）
    设置装备属性值(斗笠, 随机属性值, false);

    Player.UpdateItem(斗笠);

    Player.MessageBox(`恭喜你成功合成1级魔血斗笠！属性值：${随机属性值}`);

    Player.ReloadBag();
    Main(Npc, Player, Args) // 刷新窗口
}

export function 斗笠刷新(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 通过GetCustomItem(0)获取斗笠
    const 斗笠 = Player.GetCustomItem(0);

    // 如果没有找到斗笠
    if (!斗笠 || !斗笠.GetName().includes('魔血斗笠')) {
        Player.MessageBox('请先放入斗笠！');
        return;
    }

    // 检查是否为斗笠装备
    const displayName = 斗笠.DisplayName;
    const match = displayName.match(/『(\d+)级』/);
    // 获取当前等级
    const 当前等级 = parseInt(match[1]);
    const 下一级 = 当前等级 + 1;

    // 检查斗笠碎片是否足够
    if (Player.GetItemCount('斗笠碎片') < 500) {
        Player.MessageBox('斗笠刷新需要500个斗笠碎片，你的斗笠碎片不足！');
        return;
    }

    // 从装备记录中获取当前属性值
    const 装备属性记录 = 初始化装备属性记录(斗笠);
    let 当前属性值 = '0';
    if (装备属性记录.职业属性_属性.length > 0) {
        当前属性值 = 装备属性记录.职业属性_属性[装备属性记录.职业属性_属性.length - 1];
    }

    // 计算当前等级可获得的最大属性值作为刷新范围
    const 等级最大属性值 = 计算等级最大属性值(当前等级);
    const 最小值 = 等级最大属性值;
    const 最大值 = 整数相乘(等级最大属性值, '10');

    // 生成新的随机属性值（最小值到最大值之间）
    const 新属性值 = js_numberRandom2(最小值, 最大值);

    // 扣除碎片
    Npc.Take(Player, '斗笠碎片', 500);

    // 刷新时清空之前的属性记录并写入新属性
    设置装备属性值(斗笠, 新属性值, true);

    Player.UpdateItem(斗笠);

    Player.MessageBox(`斗笠刷新成功！属性值从 ${当前属性值} 变为 ${新属性值}`);
    Player.ReloadBag();
    Main(Npc, Player, Args) // 刷新窗口
}

export function 斗笠晋级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 通过GetCustomItem(0)获取斗笠
    const 斗笠 = Player.GetCustomItem(0);

    // 如果没有找到斗笠
    if (!斗笠) {
        Player.MessageBox('请先放入斗笠！');
        return;
    }

    // 从斗笠名称中提取等级
    const displayName = 斗笠.DisplayName;
    const match = displayName.match(/『(\d+)级』/);

    if (!match || !displayName.includes('魔血斗笠')) {
        Player.MessageBox('您放入的不是有效的魔血斗笠！');
        return;
    }

    // 获取当前等级
    const 当前等级 = parseInt(match[1]);
    const 下一级 = 当前等级 + 1;

    if (当前等级 === 5000 ) {
        Player.MessageBox('斗笠等级达到5000级，无法晋级！');
        return;
    }

    // 检查是否超过最高等级
    if (下一级 > 40000) {
        Player.MessageBox('你的斗笠已经达到最高等级40000级！');
        return;
    }

    // 计算所需碎片数量
    const 晋级所需碎片 = 获取晋级所需碎片(当前等级);

    // 检查碎片是否足够
    if (Player.GetItemCount('斗笠碎片') < 晋级所需碎片) {
        Player.MessageBox(`斗笠晋级需要${晋级所需碎片}个斗笠碎片，你的斗笠碎片不足！`);
        return;
    }

    // 扣除碎片
    Npc.Take(Player, '斗笠碎片', 晋级所需碎片);
    // 从装备记录中获取当前属性值
    const 装备属性记录 = 初始化装备属性记录(斗笠);
    let 当前属性值 = '0';
    if (装备属性记录.职业属性_属性.length > 0) {
        当前属性值 = 装备属性记录.职业属性_属性[装备属性记录.职业属性_属性.length - 1];
    }

    // 计算晋升后的属性值
    const 新属性值 = 计算晋升后属性值(当前等级, 当前属性值);

    // 更新斗笠
    const 新名称 = `『${下一级}级』魔血斗笠`;
    斗笠.Rename(新名称);
    斗笠.SetBind(true);
    斗笠.SetNeverDrop(true);
    斗笠.State.SetNoDrop(true);

    // 晋级时清空之前的属性记录并写入新属性
    设置装备属性值(斗笠, 新属性值, true);

    Player.UpdateItem(斗笠);

    Player.MessageBox(`恭喜你成功将斗笠提升到${下一级}级！新属性值：${大数值整数简写(新属性值)}`);
    Player.ReloadBag();
    Main(Npc, Player, Args) // 刷新窗口
}

