import { 大数值整数简写 } from "../字符计算";

// 材料仓库配置
interface 材料信息 {
    名称: string;
    变量名: string;
}

// 材料列表配置
const 材料列表: 材料信息[] = [
    { 名称: '书页', 变量名: '材料_书页' },
    { 名称: '挑战石', 变量名: '材料_挑战石' },
    { 名称: '血石精华', 变量名: '材料_血石精华' },
    { 名称: '泰坦结晶', 变量名: '材料_泰坦结晶' },
    { 名称: '专属碎片', 变量名: '材料_专属碎片' },
    { 名称: '种族雕像', 变量名: '材料_种族雕像' },
    { 名称: '特戒碎片', 变量名: '材料_特戒碎片' },
    { 名称: '斗笠碎片', 变量名: '材料_斗笠碎片' },
    { 名称: '烈焰精魄', 变量名: '材料_烈焰精魄' },
    { 名称: '无限玄晶', 变量名: '材料_无限玄晶' },
    { 名称: '暴怒符文', 变量名: '材料_暴怒符文' },
    { 名称: '熵之精魄', 变量名: '材料_熵之精魄' },
    { 名称: '妖族内丹', 变量名: '材料_妖族内丹' },

];

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 初始化材料仓库变量
    材料列表.forEach(材料 => {
        Player.V[材料.变量名] ??= 0;
    });

    // if(Player.GetName() == '鸿福'){
    //     材料列表.forEach(材料 => {
    //         Player.V[材料.变量名] = 0;
    //     });
    //     Player.SendMessage(`{S=鸿福材料仓库初始化完成;C=154}`, 1);
    // }
    // 初始化当前页数
    Player.V.材料仓库当前页 ??= 0;
    const 当前页 = Player.V.材料仓库当前页;
    const 每页显示 = 10;
    const 总页数 = Math.ceil(材料列表.length / 每页显示);
    const 开始索引 = 当前页 * 每页显示;
    const 结束索引 = Math.min(开始索引 + 每页显示, 材料列表.length);

    let 界面内容 = `\\\\
            {S=材料仓库;C=251;X=40;Y=35}    {S=点击材料名称输入取出数量;C=9;X=140;Y=35} \\\\
    {S=第${当前页 + 1}页 / 共${总页数}页;C=22;X=180;Y=320}\\
    <{S=一键存入所有材料;C=254;X=360;Y=35}/@材料仓库.一键存入所有材料>
    \\\\
    `;

    // 生成当前页材料列表界面
    for (let i = 开始索引; i < 结束索引; i++) {
        const 材料 = 材料列表[i];
        const 当前数量 = Player.V[材料.变量名] || 0;
        const 数量简写 = 大数值整数简写(当前数量.toString())
        const Y坐标 = 60 + (i - 开始索引) * 25;

        界面内容 += `<{S=${材料.名称};HINT=点击名称取出物品;C=20;X=40;Y=${Y坐标}}/@@材料仓库.InPutInteger(请输入要取出的${材料.名称}数量:,${材料.名称})>`;
        界面内容 += `{S=当前库存${数量简写}个;HINT=${当前数量};C=22;X=200;Y=${Y坐标}}`;
        界面内容 += `<{S=存入所有本材料;C=250;X=360;Y=${Y坐标}}/@材料仓库.存入本材料(${材料.名称})>\\\\`;
    }

    // 翻页按钮
    const 翻页Y坐标 = 320;
    if (当前页 > 0) {
        界面内容 += `<{S=上一页;C=250;X=100;Y=${翻页Y坐标}}/@材料仓库.上一页>`;
    }
    if (当前页 < 总页数 - 1) {
        界面内容 += `<{S=下一页;C=250;X=300;Y=${翻页Y坐标}}/@材料仓库.下一页>`;
    }

    Npc.SayEx(Player, 'NPC中窗口', 界面内容);
}

export function 一键存入所有材料(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 总存入数量 = 0;
    let 存入记录 = [];

    // 遍历所有材料，将背包中的材料存入到仓库
    for (const 材料 of 材料列表) {
        const 背包数量 = Player.GetItemCount(材料.名称);
        if (背包数量 > 0) {
            // 扣除背包中的物品
            Npc.Take(Player, 材料.名称, 背包数量);
            // 增加仓库库存
            Player.V[材料.变量名] = (Player.V[材料.变量名] || 0) + 背包数量;
            总存入数量 += 背包数量;
            存入记录.push(`${材料.名称}: ${背包数量}个`);
        }
    }

    if (总存入数量 > 0) {
        Player.SendMessage(`成功存入所有材料到仓库！总计: ${总存入数量}个物品`);
    }

}

// 存入背包中所有指定材料到仓库
export function 存入本材料(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 材料名称 = Args.Str[0];

    const 背包数量 = Player.GetItemCount(材料名称);
    if (背包数量 <= 0) {
        Player.MessageBox(`背包中没有 ${材料名称}！`);
        Main(Npc, Player, Args);
        return;
    }

    const 材料信息 = 材料列表.find(item => item.名称 === 材料名称);
    if (!材料信息) {
        Player.MessageBox(`未找到材料: ${材料名称}`);
        Main(Npc, Player, Args);
        return;
    }

    // 扣除背包中的物品
    Npc.Take(Player, 材料名称, 背包数量);

    // 增加库存
    Player.V[材料信息.变量名] = (Player.V[材料信息.变量名] || 0) + 背包数量;

    Player.MessageBox(`成功存入 ${背包数量}个 ${材料名称}！当前库存: ${Player.V[材料信息.变量名]}个`);

    // 返回主界面
    Main(Npc, Player, Args);
}

// 弹窗输入处理函数（取出）
export function InPutInteger(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 材料名称 = Args.Str[0];
    const 输入数量 = Args.Int[1] || 0;

    if (输入数量 <= 0) {
        Player.MessageBox('请输入有效的数量！');
        Main(Npc, Player, Args);
        return;
    }

    const 材料信息 = 材料列表.find(item => item.名称 === 材料名称);
    if (!材料信息) {
        Player.MessageBox(`未找到材料: ${材料名称}`);
        Main(Npc, Player, Args);
        return;
    }

    const 当前库存 = Player.V[材料信息.变量名] || 0;
    if (当前库存 < 输入数量) {
        Player.MessageBox(`${材料名称}库存不足！当前库存: ${当前库存}个`);
        Main(Npc, Player, Args);
        return;
    }

    // 扣除库存
    Player.V[材料信息.变量名] -= 输入数量;

    // 给予材料到背包
    Npc.Give(Player, 材料名称, 输入数量);

    Player.MessageBox(`成功取出 ${输入数量}个 ${材料名称}！剩余库存: ${Player.V[材料信息.变量名]}个`);

    // 返回主界面
    Main(Npc, Player, Args);
}

// 上一页
export function 上一页(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.材料仓库当前页 > 0) {
        Player.V.材料仓库当前页 -= 1;
    }
    Main(Npc, Player, Args);
}

// 下一页
export function 下一页(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 总页数 = Math.ceil(材料列表.length / 10);
    if (Player.V.材料仓库当前页 < 总页数 - 1) {
        Player.V.材料仓库当前页 += 1;
    }
    Main(Npc, Player, Args);
}

export function 关闭(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 关闭对话框
}
