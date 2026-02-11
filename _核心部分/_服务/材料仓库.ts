import { 大数值整数简写 } from "../字符计算";

// 材料列表配置（变量名统一为 材料_名称）
const 材料列表: string[] = [
    '天枢职业技能书',
    '血神职业技能书',
    '暗影职业技能书',
    '烈焰职业技能书',
    '正义职业技能书',
    '不动职业技能书',
    '基础职业技能书',
    '幸运石',
    '魂血精魄',
    '粹血源核',
    '经验碎片',
];

// 获取材料变量名
const 获取变量名 = (名称: string): string => `材料_${名称}`;

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 初始化材料仓库变量
    材料列表.forEach(名称 => {
        Player.V[获取变量名(名称)] ??= 0;
    });

    // if(Player.GetName() == '鸿福'){
    //     材料列表.forEach(名称 => {
    //         Player.V[获取变量名(名称)] = 0;
    //     });
    //     Player.SendMessage(`{S=鸿福材料仓库初始化完成;C=154}`, 1);
    // }
    // 初始化当前页数
    Player.R.材料仓库当前页 ??= 0;
    const 当前页 = Player.R.材料仓库当前页;
    const 每页显示 = 10;
    const 总页数 = Math.ceil(材料列表.length / 每页显示);
    const 开始索引 = 当前页 * 每页显示;
    const 结束索引 = Math.min(开始索引 + 每页显示, 材料列表.length);

    let 界面内容 = `\\\\
            {S=材料仓库;C=251;X=40;Y=12}    {S=点击材料名称输入取出数量;C=9;X=140;Y=12} \\\\
    {S=第${当前页 + 1}页 / 共${总页数}页;C=22;X=200;Y=380}\\
    <{S=一键存入所有材料;C=254;X=360;Y=12}/@材料仓库.一键存入所有材料>
    \\\\
    `;

    // 生成当前页材料列表界面
    for (let i = 开始索引; i < 结束索引; i++) {
        const 名称 = 材料列表[i];
        const 当前数量 = Player.V[获取变量名(名称)] || 0;
        const 数量简写 = 大数值整数简写(当前数量.toString())
        const Y坐标 = 40 + (i - 开始索引) * 30;

        界面内容 += `<{S=${名称};HINT=点击名称取出物品;C=20;X=40;Y=${Y坐标}}/@@材料仓库.InPutInteger(请输入要取出的${名称}数量:,${名称})>`;
        界面内容 += `{S=当前库存${数量简写}个;HINT=${当前数量};C=22;X=180;Y=${Y坐标}}`;
        界面内容 += `<{S=取出全部;C=249;X=310;Y=${Y坐标}}/@材料仓库.取出本材料(${名称})>`;
        界面内容 += `<{S=存入全部;C=250;X=400;Y=${Y坐标}}/@材料仓库.存入本材料(${名称})>\\\\`;
    }

    // 翻页按钮
    const 翻页Y坐标 = 320;
    if (当前页 > 0) {
        界面内容 += `<{S=上一页;C=250;X=100;Y=${翻页Y坐标}}/@材料仓库.上一页>`;
    }
    if (当前页 < 总页数 - 1) {
        界面内容 += `<{S=下一页;C=250;X=300;Y=${翻页Y坐标}}/@材料仓库.下一页>`;
    }

    Npc.SayEx(Player, 'NPC中大窗口', 界面内容);
}

export function 一键存入所有材料(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 总存入数量 = 0;
    let 存入记录 = [];

    // 遍历所有材料，将背包中的材料存入到仓库
    for (const 名称 of 材料列表) {
        const 背包数量 = Player.GetItemCount(名称);
        if (背包数量 > 0) {
            const 变量名 = 获取变量名(名称);
            // 扣除背包中的物品
            Npc.Take(Player, 名称, 背包数量);
            // 增加仓库库存
            Player.V[变量名] = (Player.V[变量名] || 0) + 背包数量;
            总存入数量 += 背包数量;
            存入记录.push(`${名称}: ${背包数量}个`);
        }
    }

    if (总存入数量 > 0) {
        Player.SendMessage(`成功存入所有材料到仓库！总计: ${总存入数量}个物品`);
    }

}

// 取出仓库中所有指定材料到背包
export function 取出本材料(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 材料名称 = Args.Str[0];

    if (!材料列表.includes(材料名称)) {
        Player.MessageBox(`未找到材料: ${材料名称}`);
        Main(Npc, Player, Args);
        return;
    }

    const 变量名 = 获取变量名(材料名称);
    const 当前库存 = Player.V[变量名] || 0;

    if (当前库存 <= 0) {
        Player.MessageBox(`${材料名称}库存为空！`);
        Main(Npc, Player, Args);
        return;
    }

    // 扣除库存
    Player.V[变量名] = 0;

    // 给予材料到背包
    Npc.Give(Player, 材料名称, 当前库存);

    Player.MessageBox(`成功取出 ${当前库存}个 ${材料名称}！`);

    // 返回主界面
    Main(Npc, Player, Args);
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

    if (!材料列表.includes(材料名称)) {
        Player.MessageBox(`未找到材料: ${材料名称}`);
        Main(Npc, Player, Args);
        return;
    }

    const 变量名 = 获取变量名(材料名称);
    // 扣除背包中的物品
    Npc.Take(Player, 材料名称, 背包数量);

    // 增加库存
    Player.V[变量名] = (Player.V[变量名] || 0) + 背包数量;

    Player.MessageBox(`成功存入 ${背包数量}个 ${材料名称}！当前库存: ${Player.V[变量名]}个`);

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

    if (!材料列表.includes(材料名称)) {
        Player.MessageBox(`未找到材料: ${材料名称}`);
        Main(Npc, Player, Args);
        return;
    }

    const 变量名 = 获取变量名(材料名称);
    const 当前库存 = Player.V[变量名] || 0;
    if (当前库存 < 输入数量) {
        Player.MessageBox(`${材料名称}库存不足！当前库存: ${当前库存}个`);
        Main(Npc, Player, Args);
        return;
    }

    // 扣除库存
    Player.V[变量名] -= 输入数量;

    // 给予材料到背包
    Npc.Give(Player, 材料名称, 输入数量);

    Player.MessageBox(`成功取出 ${输入数量}个 ${材料名称}！剩余库存: ${Player.V[变量名]}个`);

    // 返回主界面
    Main(Npc, Player, Args);
}

// 上一页
export function 上一页(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.R.材料仓库当前页 > 0) {
        Player.R.材料仓库当前页 -= 1;
    }
    Main(Npc, Player, Args);
}

// 下一页
export function 下一页(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 总页数 = Math.ceil(材料列表.length / 10);
    if (Player.R.材料仓库当前页 < 总页数 - 1) {
        Player.R.材料仓库当前页 += 1;
    }
    Main(Npc, Player, Args);
}

export function 关闭(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 关闭对话框
}
