import { js_number } from "../../全局脚本[公共单元]/utils/计算方法"

// 掉落物品列表（除幸运精魄外的其他材料）
const 圣墟奖励物品列表 = [
    '书页',
    '书页',
    '书页',
    '书页',
    '书页',
    '幸运精魄',
    '幸运精魄',
    '幸运精魄',
    '幸运精魄',
    '血石精华',
    '血石精华',
    '血石精华',
    '泰坦结晶',
    '泰坦结晶',
    '专属碎片',
    '专属碎片',
    '种族雕像',
    '种族雕像',
    '特戒碎片',
    '特戒碎片',
    '斗笠碎片',
    '烈焰精魄',
    '无限玄晶',
    '暴怒符文',
    '殇之精魄',
    '挑战石',
];

// GameLib.AddNpc('圣墟守卫', '0', 35, 25, 513, '圣墟守卫');

export function 主城Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.圣墟等级 ??= 0  // 历史最高层级
    Player.V.圣墟跨越层级 ??= 1  // 每次跨越的层数
    Player.V.圣墟挑战层数记录 ??= 0  // 当前所在层数（如果为0表示未开始或从头开始）

    const 最高跨越层数 = Math.floor(Player.V.真实充值 / 10000 + 1) * 5
    const 圣墟几率 = Math.floor(Player.V.圣墟等级 / 10)  // 每10层获得1点几率

    // 继续挑战的显示文本
    const 继续挑战层数 = Player.V.圣墟挑战层数记录 > 0 ? Player.V.圣墟挑战层数记录 : 1
    const 继续挑战文本 = Player.V.圣墟挑战层数记录 > 0 ? `继续挑战(${继续挑战层数}层)` : '继续挑战(从头开始)'

    const S = `\\\\
                            {S=圣墟;AC=251,249,222,210} \\\\
    {S=圣墟介绍:;C=9}\\
    {S=① 每通关1层可获得1点圣墟点数;c=20}\\
    {S=② 每10点圣墟点数可提高获得圣墟装备的几率1‰;c=20}\\
    {S=③ 每100点圣墟点数可额外提高装备属性1倍;c=20}\\
    {S=④ 圣墟点数越高,装备越好,获得的几率也越高;c=20}\\
    {S=⑤ 圣墟难度每层提高20%,每50层额外提高5倍!!;c=20}\\
    {S=您历史通关的最高层级;C=9}: {S=${Player.V.圣墟等级};C=23} 级\\
    {S=您当前所在层数;C=9}: {S=${Player.V.圣墟挑战层数记录 > 0 ? Player.V.圣墟挑战层数记录 : '未开始'};C=23} 级\\
    {S=您当前的圣墟几率为;C=9}: {S=${圣墟几率};C=23} ‰\\
    {S=您当前的每次可跨越层数;C=9}: {S=${Player.V.圣墟跨越层级};C=23} 层\\
    <{S=设置跨越层数;X=20;Y=240;HINT=跨越层数是每次可增加的层数,默认为1#92数值随真实充值增加#9210000真实充值以内为5层#92之后每10000真实充值增加5层#92当前最大可跨越层数为${最高跨越层数}}/@@InPutInteger(请输入跨越层数)>                                
    <{S=${继续挑战文本};X=200;Y=240;HINT=需求礼卷:${继续挑战层数 * 100 / (1 + Player.R.魔器朝夕加成)}礼卷}/@@主城挑战(${继续挑战层数})>
    <{S=开始挑战(1层);X=300;Y=240;HINT=需求礼卷:100礼卷}/@主城挑战(1)>\\     

    `
    Npc.SayEx(Player, 'Npc小窗口', S)

}

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 生物剩余 = Player.Map.MonCount;
    const 当前层级 = Player.V.圣墟挑战层数记录 || 1;
    const 跨越层数 = Player.V.圣墟跨越层级 || 1;
    const 下一层级 = 当前层级 + 跨越层数;
    const 最高层数 = 100000;

    if (生物剩余 === 0) {
        // 怪物全部清理完毕，可以通关
        const 通关奖励数量 = Math.min(3 + Math.floor(当前层级 / 50), 5); // 基础3个，每50层增加1个，最多5个

        const S = `\\\\
                                {S=圣墟;AC=251,249,222,210} \\\\
        {S=恭喜通关圣墟第${当前层级}层！;C=23}\\\\
        {S=可获得${通关奖励数量}个随机奖励;C=20}\\
        <{S=领取奖励并离开;X=100;Y=200}/@领取奖励>\\
        ${下一层级 <= 最高层数 ? `<{S=挑战下一层(${下一层级}层);X=250;Y=200}/@下一层>\\` : ''}

        `
        Npc.SayEx(Player, 'Npc小窗口', S);
    } else {
        const S = `\\\\
                            {S=圣墟;AC=251,249,222,210} \\\\
        {S=清理所有生物即可通关;C=20} \\\\
        {S=当前圣墟层级为;C=9}: {S=${当前层级};C=23} 级\\
        {S=当前层级所剩怪物;C=9}: {S=${生物剩余};C=23} 只\\
        {S=每次跨越层数;C=9}: {S=${跨越层数};C=23} 层\\


        `
        Npc.SayEx(Player, 'Npc小窗口', S);
    }
}

export function InPutInteger(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 跨越层数 = Args.Int[0]
    const 最高跨越层数 = Math.floor(Player.V.真实充值 / 10000 + 1) * 5

    if (跨越层数 > 最高跨越层数) {
        Player.MessageBox(`跨越层数不能超过${最高跨越层数}`)
        return
    }
    if (跨越层数 < 1) {
        Player.MessageBox(`跨越层数不能小于1`)
        return
    }
    Player.V.圣墟跨越层级 = 跨越层数
    Player.MessageBox(`设置成功，当前圣墟跨越层数为${跨越层数}`)
    主城Main(Npc, Player, Args)
}

/**
 * 主城挑战入口 - 需要检查和扣除礼卷
 */
export function 主城挑战(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 挑战层数 = Args.Int[0] || 1;
    const 需求礼卷 = 挑战层数 > 1 ? 挑战层数 * 100 / (1 + Player.R.魔器朝夕加成) : 0;

    // 检查礼卷是否足够
    if (Player.GetGamePoint() < 需求礼卷) {
        Player.MessageBox(`挑战${挑战层数}层需要${需求礼卷}礼卷，你的礼卷不足！当前礼卷：${Player.GetGamePoint()}`);
        return;
    }

    // 扣除礼卷
    Player.SetGamePoint(Player.GetGamePoint() - 需求礼卷);
    Player.GoldChanged();
    Player.MessageBox(`已扣除${需求礼卷}礼卷，剩余礼卷：${Player.GetGamePoint()}`);

    // 调用挑战函数
    挑战(Npc, Player, Args);
}

/**
 * 挑战函数 - 创建副本和刷新怪物（不检查礼卷）
 */
export function 挑战(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 挑战层数 = Args.Int[0] || 1;

    // 创建副本（不设置自动关闭时间，手动管理）
    const 副本地图 = GameLib.CreateDuplicateMap('圣墟', 0);
    if (!副本地图) {
        Player.MessageBox('创建副本失败，请稍后重试');
        return;
    }

    // 设置副本显示名
    副本地图.DisplayName = `圣墟(${挑战层数}层)`;

    // 更新玩家当前所在层数
    Player.V.圣墟挑战层数记录 = 挑战层数;

    const 随机 = random(10);
    // 在副本中添加圣墟守卫NPC
    GameLib.AddNpc('圣墟守卫', 副本地图.MapName, 35 + 随机, 25 + 随机, 513, '圣墟');
    Player.SendCountDownMessage('离副本关闭还有<$Time:3600$>', 0);

    // 计算怪物星星数值：基础1000 * (层数 * 10) * (每10层的额外100倍)
    // 使用字符运算避免大数值溢出
    const 基础星星 = "1000";
    const 层数倍率 = Math.pow(1.2, 挑战层数).toString(); // 每层10倍
    const 十层倍率 = Math.pow(4.5, Math.floor(挑战层数 / 50)).toString(); // 每10层额外4.5倍

    // 使用字符运算进行乘法计算
    const 第一步 = js_number(基础星星, 层数倍率, 3); // 基础星星 * 层数倍率
    const 最终星星 = js_number(第一步, 十层倍率, 3); // 第一步 * 十层倍率
    const 星星字符串 = 最终星星;



    // 将副本信息临时存储到全局变量，供_M_Refresh使用
    GameLib.R.圣墟当前副本信息 = {
        地图ID: 副本地图.MapName,
        挑战层数: 挑战层数,
        星星: 星星字符串
    };

    // 三种圣墟怪物名称
    const 怪物名称列表 = ['火之圣墟', '光之圣墟', '冰之圣墟'];

    // 刷新怪物
    怪物名称列表.forEach((怪物名, index) => {
        // 使用优化后的参数刷新怪物，每种20个
        GameLib.MonGen(
            副本地图.MapName,      // 地图名称
            怪物名,                // 怪物名称
            20,                    // 数量（恢复为20个）
            35,                    // X坐标（使用成功的坐标）
            25,                    // Y坐标（使用成功的坐标）
            15,                    // 范围
            0,                     // 阵营
            0,                     // 国家
            5,                     // TAG为5（对应洪荒·BOSS和灭世·BOSS）
            true,                  // 刷新触发
            true,                  // 死亡触发
            true,                  // 杀人触发
            true                   // 受伤触发
        );
    });

    // 传送玩家到副本
    Player.RandomMove(副本地图.MapName);

    // Player.MessageBox(`成功进入圣墟第${挑战层数}层！`);
}

export function 下一层(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 当前层级 = Player.V.圣墟挑战层数记录 || 1;
    const 跨越层数 = Player.V.圣墟跨越层级 || 1;
    const 下一层级 = 当前层级 + 跨越层数;
    const 通关奖励数量 = Math.min(3 + Math.floor(当前层级 / 50), 5); // 基础3个，每50层增加1个，最多5个

    // 检查下一层级是否超过最大层数
    if (下一层级 > 100000) {
        Player.MessageBox(`已到最大层级`);
        return;
    }

    // 更新历史最高层级
    if (当前层级 > (Player.V.圣墟等级 || 0)) {
        Player.V.圣墟等级 = 当前层级;
        const 圣墟几率 = Math.floor(当前层级 / 10);
        Player.MessageBox(`恭喜！圣墟等级提升至 ${当前层级} 级`);
    }

    // 发放随机奖励
    for (let i = 0; i < 通关奖励数量; i++) {
        const 随机奖励 = 圣墟奖励物品列表[Math.floor(Math.random() * 圣墟奖励物品列表.length)];
        Npc.Give(Player, 随机奖励, 10);
    }

    Player.SendMessage(`通关奖励已发放：${通关奖励数量}个随机物品`);

    // 延时关闭副本（2秒后，确保玩家已离开）
    GameLib.AddRobot(2, `
        const 地图 = GameLib.FindMap('${Player.Map.MapName}');
        if (地图) {
            GameLib.CloseDuplicateMapEx(地图);
            console.log('[圣墟] 副本已关闭: ${Player.Map.MapName}');
        }
    `);

    // 使用CreateTArgs创建正确的TArgs对象，进入下一层
    const 下一层Args = CreateTArgs(下一层级.toString());
    挑战(Npc, Player, 下一层Args);
}

export function 领取奖励(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 当前层级 = Player.V.圣墟挑战层数记录 || 1;
    const 通关奖励数量 = Math.min(3 + Math.floor(当前层级 / 50), 5); // 基础3个，每50层增加1个，最多5个

    // 更新历史最高层级
    if (当前层级 > (Player.V.圣墟等级 || 0)) {
        Player.V.圣墟等级 = 当前层级;
        const 圣墟几率 = Math.floor(当前层级 / 10);
        Player.SendMessage(`恭喜！圣墟等级提升至 ${当前层级} 级`);
    }

    // 发放随机奖励
    for (let i = 0; i < 通关奖励数量; i++) {
        const 随机奖励 = 圣墟奖励物品列表[Math.floor(Math.random() * 圣墟奖励物品列表.length)];
        Npc.Give(Player, 随机奖励, 10);
    }

    Player.SendMessage(`通关奖励已发放：${通关奖励数量}个随机物品`);

    // 传送玩家回主城
    Player.Move('主城', 105, 120);

    // 延时关闭副本（2秒后，确保玩家已离开）
    GameLib.AddRobot(2, `
        const 地图 = GameLib.FindMap('${Player.Map.MapName}');
        if (地图) {
            GameLib.CloseDuplicateMapEx(地图);
        }
    `);
}



export function 圣墟提高(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.圣墟点数 ??= 0
    Player.V.圣墟点数等级 ??= 0
    let 圣墟等级 = Player.V.圣墟点数等级
    const S = `\\\\
                             {S=圣墟点数;C=251} \\\\
    {S=圣墟点数介绍:;C=9}\\
    {S=每10点圣墟点数可额外提高装备属性1倍;c=20}\\
    {S=您当前的圣墟点数为;C=9}: {S=${Player.V.圣墟点数};C=23} 点\\
    {S=您当前的圣墟点数提高的属性为;C=9}: {S=${圣墟等级};C=23} 倍\\
    {S=当前需求的圣墟点数为;C=9}: {S=${(圣墟等级 + 1)* 5000}点;C=23}\\
    <{S=升级圣墟点数;X=300;Y=240}/@升级圣墟点数(1000)>\\
    `
    Npc.SayEx(Player, 'Npc小窗口', S)
}

export function 升级圣墟点数(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 最高等级 = Args.Int[0] 
    let 所需点数 = (Player.V.圣墟点数等级 + 1) * 5000
    if (Player.V.圣墟点数等级 >= 最高等级) {
        Player.MessageBox(`已达到当前最高等级,无法继续升级`)
        return
    }
    if (Player.V.圣墟点数 < 所需点数) {
        Player.MessageBox(`圣墟点数不足，当前圣墟点数为${Player.V.圣墟点数}，所需点数为${所需点数}`)
        return
    }
    Player.V.圣墟点数等级 += 1
    Player.V.圣墟点数 -= 所需点数
    Player.MessageBox(`升级成功，当前圣墟点数等级为${Player.V.圣墟点数等级}`)
    圣墟提高(Npc, Player, Args)
}


