import { js_number } from "../../全局脚本[公共单元]/utils/计算方法_优化版";

/**
 * 聚宝葫芦掉落材料函数
 * 检查玩家是否佩戴聚宝葫芦，如果有则随机掉落材料
 * 
 * 使用方法：
 * 在怪物掉落、杀怪触发等地方调用：
 * import * as 聚宝葫芦 from '../[服务]/聚宝葫芦';
 * 聚宝葫芦.聚宝葫芦掉落材料(Player);
 */
export function 聚宝葫芦掉落材料(Npc: TNormNpc, Player: TPlayObject): void {
    // 检查Player.GetJewelrys(3).DisplayName的名字是否包含聚宝葫芦
    const 葫芦 = Player.GetJewelrys(3);
    if (!葫芦 || !葫芦.DisplayName.includes('聚宝葫芦')) {
        return; // 没有聚宝葫芦，不执行掉落
    }

    // 检测Player.GetJewelrys(3).GetOutWay2(12)的值
    const 葫芦等级 = 葫芦.GetOutWay2(12);
    if (葫芦等级 <= 0) {
        return; // 等级为0或负数，不掉落
    }

    // 掉落物品列表（除幸运精魄外的其他材料）
    const 掉落物品列表 = [
        '书页',
        '书页',
        '书页',
        '书页',
        '书页',
        '血石精华', 
        '血石精华', 
        '血石精华', 
        '泰坦结晶',
        '泰坦结晶',
        '专属碎片',
        '妖族内丹',
        '种族雕像',
        '种族雕像',
        '特戒碎片',
        '斗笠碎片',
        '烈焰精魄',
        '无限玄晶',
        '暴怒符文',
        '熵之精魄',
        '挑战石',
    ];

    // 物品名称到材料仓库变量名的映射
    const 材料变量映射: { [key: string]: string } = {
        '书页': '材料_书页',
        '挑战石': '材料_挑战石',
        '血石精华': '材料_血石精华',
        '泰坦结晶': '材料_泰坦结晶',
        '专属碎片': '材料_专属碎片',
        '种族雕像': '材料_种族雕像',
        '特戒碎片': '材料_特戒碎片',
        '斗笠碎片': '材料_斗笠碎片',
        '烈焰精魄': '材料_烈焰精魄',
        '无限玄晶': '材料_无限玄晶',
        '暴怒符文': '材料_暴怒符文',
        '熵之精魄': '材料_熵之精魄',
        '妖族内丹': '材料_妖族内丹',
    };

    // 随机选择一个物品
    const 随机索引 = Math.floor(Math.random() * 掉落物品列表.length);
    const 选中物品 = 掉落物品列表[随机索引];

    // 数量为1到葫芦等级的随机值（确保至少掉落1个）
    let 掉落数量 = Math.floor(Math.random() * 葫芦等级) + 1;

    if (Player.R.魔器葫芦材料增加 > 0) {
        掉落数量 = Math.floor(掉落数量 * (1 + Player.R.魔器葫芦材料增加))
    }
    // 获取对应的材料变量名
    const 变量名 = 材料变量映射[选中物品];
    
    if (变量名) {
        // 初始化变量（如果不存在）
        Player.V[变量名] ??= 0;
        
        // 直接增加材料仓库变量值
        Player.V[变量名] += 掉落数量;
        
        // 发送消息提示
        if (!Player.V.葫芦屏蔽) {
            Player.SendMessage(`{S=[聚宝葫芦]材料仓库获得${选中物品} × ${掉落数量};C=154}`, 1);
        }
    }
}

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
    {S=聚宝葫芦合成需求:600礼卷;C=2}\\
    {S=等级提高需求:聚宝葫芦等级 * 20礼卷;C=6}\\
    {S=葫芦说明:获得材料时,几率额外获得除幸运精魄外的其他材料;C=7}\\
    {S=获得数量随等级提高,初始为1个,等级每提高10级,获得数量增加1个;C=7}\\
    {S=PS:获得数量为随机值1-最大值;C=6}\\
    {S=『木麒麟神戒』;C=161}{S=可直接兑换10级宝葫;C=110}                <{S=兑换宝葫;HINT=兑换木麒麟神戒;C=22}/@兑换(木麒麟神戒)>\\\\
    {S=『水麒麟神戒』;C=161}{S=可直接兑换20级宝葫;HINT=不建议兑换!!!#92不建议兑换!!!#92不建议兑换!!!;C=110}                <{S=兑换宝葫;HINT=兑换水麒麟神戒;C=22}/@兑换(水麒麟神戒)>\\

    <{S=聚宝葫芦合成;HINT=600礼卷;C=22;X=140;Y=220}/@合成(聚宝葫芦)>
    <{S=聚宝葫芦提高;HINT=葫芦等级 * 20礼卷;C=22;X=225;Y=220}/@提高等级(300,20)>

`
    Player.SayEx('NPC小窗口左下1框', S)
    // console.log(Player.GetJewelrys(3).GetOutWay2(12) + `专属装备属性` + Player.GetJewelrys(3).DisplayName)

}


export function Main2(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
    {S=等级提高需求:聚宝葫芦等级 * 50礼卷;C=6}\\
    {S=葫芦说明:获得材料时,几率额外获得除幸运精魄外的其他材料;C=7}\\
    {S=获得数量随等级提高,初始为1个,等级每提高10级,获得数量增加1个;C=7}\\
    {S=PS:获得数量为随机值1-最大值;C=6}\\

    <{S=聚宝葫芦提高;HINT=葫芦等级 * 50礼卷#92最高可升级到500级;C=22;X=225;Y=220}/@提高等级(500,50)>

`
    Player.SayEx('NPC小窗口左下1框', S)
    // console.log(Player.GetJewelrys(3).GetOutWay2(12) + `专属装备属性` + Player.GetJewelrys(3).DisplayName)

}
export function Main7(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
    {S=等级提高需求:聚宝葫芦等级 * 200礼卷;C=6}\\
    {S=葫芦说明:获得材料时,几率额外获得除幸运精魄外的其他材料;C=7}\\
    {S=获得数量随等级提高,初始为1个,等级每提高10级,获得数量增加1个;C=7}\\
    {S=PS:获得数量为随机值1-最大值;C=6}\\

    <{S=聚宝葫芦提高;HINT=葫芦等级 * 200礼卷#92最高可升级到800级;C=22;X=225;Y=220}/@提高等级(800,200)>

`
    Player.SayEx('NPC小窗口左下1框', S)
    // console.log(Player.GetJewelrys(3).GetOutWay2(12) + `专属装备属性` + Player.GetJewelrys(3).DisplayName)

}

export function 提高等级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 获取玩家当前特戒
    let 当前等级 = 0;
    let 最高等级 = Args.Int[0]
    let 礼卷 = Args.Int[1]

    // 通过GetCustomItem(0)获取特戒
    const 葫芦 = Player.GetCustomItem(0);

    // 如果没有找到特戒
    if (!葫芦 || !葫芦.GetName().includes('聚宝葫芦')) {
        Player.MessageBox('请先放入葫芦！');
        return;
    }

    // 从特戒名称中提取等级
    const displayName = 葫芦.DisplayName;
    const match = displayName.match(/『(\d+)级』/);

    if (!match) {
        Player.MessageBox('您放入的不是有效的聚宝葫芦！');
        return;
    }

    // 获取当前等级
    当前等级 = parseInt(match[1]);

    // 计算所需元宝
    const 下一级 = 当前等级 + 1;
    if (下一级 > 最高等级) {
        Player.MessageBox(`你的葫芦已经达到${最高等级}级,请去后面大陆继续升级！`);
        return;
    }

    let 所需礼卷 = 下一级 * 礼卷;

    // 检查元宝是否足够
    if (Player.GetGamePoint() < 所需礼卷) {
        Player.MessageBox(`提升葫芦等级需要${所需礼卷}礼卷，你的礼卷不足！`);
        return;
    }

    // 扣除礼卷
    Player.SetGamePoint(Player.GetGamePoint() - 所需礼卷);
    Player.GoldChanged();

    const newMedalName = `『${下一级}级』聚宝葫芦`;


    let OUT = 5
    let 属性 = Math.floor(1 * 下一级 / 10) + 1

    葫芦.SetOutWay1(12, OUT)
    葫芦.SetOutWay2(12, 属性)

    葫芦.Rename(newMedalName);
    葫芦.SetBind(true);
    葫芦.SetNeverDrop(true);
    葫芦.State.SetNoDrop(true);
    Player.UpdateItem(葫芦);

    Player.MessageBox(`恭喜你成功将葫芦提升到${下一级}级！`);
    // 提高葫芦等级(Npc, Player, Args);
}

export function 兑换(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 葫芦类型 = Args.Str[0]

    // 检查背包是否有对应的麒麟神戒（通过遍历背包检查DisplayName）
    let 找到物品 = false;
    let 目标物品: TUserItem | null = null;

    for (let i = 0; i < Player.GetItemSize(); i++) {
        const item = Player.GetBagItem(i);
        if (item && item.DisplayName.includes(葫芦类型)) {
            找到物品 = true;
            目标物品 = item;
            break;
        }
    }

    if (!找到物品 || !目标物品) {
        Player.MessageBox(`背包中没有找到${葫芦类型}！`);
        return;
    }

    let 等级 = 1;
    let OUT = 5;
    let 属性 = 1;

    switch (葫芦类型) {
        case '木麒麟神戒':
            等级 = 10;
            属性 = 2; // 20级属性
            break;
        case '水麒麟神戒':
            等级 = 20;
            属性 = 3; // 30级属性
            break;
        default:
            Player.MessageBox('你没有兑换需要的物品！');
            return;
    }

    // 删除找到的物品
    Player.DeleteItem(目标物品);

    // 给与聚宝葫芦
    let 葫芦 = Player.GiveItem('聚宝葫芦');
    
    if (葫芦) {
        // 设置属性（对应合成和提高等级中的逻辑）
        葫芦.SetOutWay1(12, OUT);
        葫芦.SetOutWay2(12, 属性);

        // 重命名为对应等级
        葫芦.Rename(`『${等级}级』聚宝葫芦`);
        葫芦.SetBind(true);
        葫芦.SetNeverDrop(true);
        葫芦.State.SetNoDrop(true);
        Player.UpdateItem(葫芦);

        Player.MessageBox(`恭喜你成功兑换${等级}级聚宝葫芦！`);
        Player.ReloadBag();
    } else {
        Player.MessageBox('兑换失败，背包可能已满！');
        // 如果给与失败，返还材料（给与原物品的DisplayName）
        Player.GiveItem(目标物品.DisplayName);
    }
}   

export function 合成(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 葫芦类型 = Args.Str[0]

    if (Player.GetGamePoint() < 600) {
        Player.MessageBox('合成葫芦需要600礼卷，你的礼卷不足！');
        return;
    }
    Player.SetGamePoint(Player.GetGamePoint() - 600);
    Player.GoldChanged();

    let 葫芦 = Player.GiveItem(葫芦类型);

    let OUT = 5
    let 属性 = 1

    葫芦.SetOutWay1(12, OUT)
    葫芦.SetOutWay2(12, 属性)

    葫芦.Rename(`『1级』${葫芦类型}`);
    葫芦.SetBind(true);
    葫芦.SetNeverDrop(true);
    葫芦.State.SetNoDrop(true);
    Player.UpdateItem(葫芦);

    Player.MessageBox(`恭喜你成功合成1级${葫芦类型}葫芦！`);

    Player.ReloadBag();

}