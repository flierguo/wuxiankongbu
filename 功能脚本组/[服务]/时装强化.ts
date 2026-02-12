import { 数字转单位2, 数字转单位3, 添加属性, 添加职业 } from "../../大数值版本/字符计算";
import { 背包 } from "../[功能]/_GN_功能";

// 时装升级档次映射 - 按档次分组，男女为同一档次
const 时装升级档次 = [
    { 男: "布衣[男]", 女: "布衣[女]" },           // 0级
    { 男: "轻盔[男]", 女: "轻盔[女]" },           // 1级
    { 男: "中盔甲[男]", 女: "中盔甲[女]" },       // 2级
    { 男: "重盔甲[男]", 女: "重盔甲[女]" },       // 3级
    { 男: "战神盔甲[男]", 女: "战神盔甲[女]" },   // 4级
    { 男: "天魔神甲[男]", 女: "圣战宝甲[女]" },   // 5级
    { 男: "凤天魔甲[男]", 女: "凰天魔衣[女]" },   // 6级
    { 男: "上古神甲[男]", 女: "上古宝甲[女]" },   // 7级
    { 男: "天龙神甲[男]", 女: "天龙神衣[女]" },   // 8级
    { 男: "恶魔时装[男]", 女: "恶魔时装[女]" }    // 9级 (最高档次，之后开启等级系统)
];

// 获取时装档次
function 获取时装档次(时装名称: string): number {
    // 先去掉等级标记，如『1级』
    const 纯净名称 = 时装名称.replace(/『\d+级』/, '');

    for (let i = 0; i < 时装升级档次.length; i++) {
        if (纯净名称 === 时装升级档次[i].男 || 纯净名称 === 时装升级档次[i].女) {
            return i;
        }
    }
    return -1; // 未找到
}

// 获取时装性别
function 获取时装性别(时装名称: string): '男' | '女' | null {
    if (时装名称.includes('[男]')) return '男';
    if (时装名称.includes('[女]')) return '女';
    return null;
}

// 获取对应性别的时装名称
function 获取对应性别时装名称(时装名称: string): string | null {
    // 先去掉等级标记，如『1级』
    const 纯净名称 = 时装名称.replace(/『\d+级』/, '');
    
    // 查找当前时装在档次中的位置
    for (let i = 0; i < 时装升级档次.length; i++) {
        const 档次 = 时装升级档次[i];
        
        if (纯净名称 === 档次.男) {
            // 当前是男性时装，返回对应的女性时装
            return 档次.女;
        } else if (纯净名称 === 档次.女) {
            // 当前是女性时装，返回对应的男性时装
            return 档次.男;
        }
    }
    
    return null; // 未找到对应的时装
}

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 获取当前时装信息
    const 时装 = Player.GetCustomItem(0);
    let 时装信息 = '';

    if (时装 && (时装.StdMode == 17 || 时装.StdMode == 18)) {
        const 时装等级 = 获取时装等级(时装);
        时装信息 = `当前时装: ${时装.GetName()}${时装等级 > 0 ? ` (等级:${时装等级})` : ''}`;
    } else {
        时装信息 = '请放入时装';
    }

    const S = `\\\\\\\\\\\\
                                     {S=时装系统;C=250}\\\\
                                    {S=${时装信息};C=241}\\\\
                             {S=时装合成: 消耗无限玄晶200个+礼券100获得布衣;C=154}\\
                             {S=时装升级: 提升时装品质和属性;C=254}\\
                             {S=性别置换: 消耗无限玄晶200个置换性别;C=251}\\\\
                        {S=时装升级到恶魔时装后将获得等级系统和强大属性;C=19}\\\\
                           <{S=时装合成;HINT=消耗无限玄晶200个+礼券100}/@时装合成>           <{S=时装升级;HINT=提升时装品质}/@时装升级>           <{S=性别置换;HINT=消耗无限玄晶200个}/@性别置换>
    `
    Npc.SayEx(Player, '时装合成', S)
}

// 获取时装等级
function 获取时装等级(时装: TUserItem): number {
    const name = 时装.GetName();
    const match = name.match(/『(\d+)级』/);
    return match ? parseInt(match[1]) : 0;
}

// 时装合成功能
export function 时装合成(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 检查材料
    if (Player.GetItemCount('无限玄晶') < 200) {
        Player.MessageBox('无限玄晶不足200个！');
        return;
    }
    if (Player.GetGamePoint() < 100) {
        Player.MessageBox('礼券不足100个！');
        return;
    }

    // 随机选择性别
    const 性别 = Player.Gender === 0 ? '男' : '女';
    const 时装名称 = `布衣[${性别}]`;

    // 消耗材料
    背包.删除物品(Player, '无限玄晶', 200);
    Player.SetGamePoint(Player.GetGamePoint() - 100);
    Player.GoldChanged();

    // 给予时装
    let 时装 = Player.GiveItem(时装名称);
    console.log(`时装:${时装}`)
    if (时装) {
        时装.SetBind(true);
        时装.SetNeverDrop(true);
        时装.State.SetNoDrop(true);

        // 布衣为0档次，倍功10，百分比5
        时装.SetOutWay1(12, 871);
        时装.SetOutWay2(12, 10);
        时装.SetOutWay3(12, 5);

        Player.UpdateItem(时装);
        Player.SendMessage(`{S=时装合成成功！获得: ${时装名称} (倍功:10 百分比:5);C=154}`, 1);
    }


    Main(Npc, Player, Args);
}

// 时装升级功能
export function 时装升级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 时装 = Player.GetCustomItem(0);

    // 检查时装
    if (!时装 || (时装.StdMode !== 17 && 时装.StdMode !== 18)) {
        Player.MessageBox('请放入时装！');
        return;
    }

    const 当前名称 = 时装.GetName();
    const 当前等级 = 获取时装等级(时装);
    const 当前性别 = 获取时装性别(当前名称);

    // if (!当前性别) {
    //     Player.MessageBox('无法识别时装性别！');
    //     return;
    // }

    // 优先检查：如果时装名称包含"恶魔"，直接进行恶魔时装升级
    if (当前名称.includes('恶魔')) {
        const displayName = 时装.DisplayName;
        const match = displayName.match(/『(\d+)级』/);

        let 当前等级 = 0;
        if (!match) {
            当前等级 = 0;
        } else {
            当前等级 = parseInt(match[1]);
        }
        if (当前等级 >= 10000) {
            Player.MessageBox('时装已达到最高等级！');
            return;
        }
        const 下一级 = 当前等级 + 1;
        let 需要碎片 = 200 * 下一级;
        if (Player.R.魔器醍醐加成 > 0) {
            需要碎片 = Math.floor(需要碎片 / (1 + Player.R.魔器醍醐加成));
        }
        let 需要礼券 = 10 * 下一级;

        if (需要碎片 >= 5000) { 需要碎片 = 5000 }
        if (需要礼券 >= 100000) { 需要礼券 = 100000 }
        // 检查材料
        if (Player.GetItemCount('无限玄晶') < 需要碎片) {
            Player.MessageBox(`无限玄晶不足${需要碎片}个！`);
            return;
        }
        if (Player.GetGamePoint() < 需要礼券) {
            Player.MessageBox(`礼券不足${需要礼券}个！`);
            return;
        }

        // 消耗材料
        背包.删除物品(Player, '无限玄晶', 需要碎片);
        Player.SetGamePoint(Player.GetGamePoint() - 需要礼券);
        Player.GoldChanged();

        // 升级恶魔时装等级
        升级恶魔时装(时装, 下一级, Player);
        Main(Npc, Player, Args);
        return;
    }

    // 否则进行档次升级
    const 当前档次 = 获取时装档次(当前名称);

    if (当前档次 === -1) {
        Player.MessageBox('当前时装无法升级！');
        return;
    }

    if (当前档次 >= 时装升级档次.length - 1) {
        Player.MessageBox('时装已达到最高品质！');
        return;
    }

    const 下一档次 = 当前档次 + 1;
    let 需要碎片 = 200 * (下一档次 + 1);
    if (Player.R.魔器醍醐加成 > 0) {
        需要碎片 = Math.floor(需要碎片 / (1 + Player.R.魔器醍醐加成));
    }
    const 需要礼券 = 50 * (下一档次 + 1);

    // 检查材料
    if (Player.GetItemCount('无限玄晶') < 需要碎片) {
        Player.MessageBox(`无限玄晶不足${需要碎片}个！`);
        return;
    }
    if (Player.GetGamePoint() < 需要礼券) {
        Player.MessageBox(`礼券不足${需要礼券}个！`);
        return;
    }

    // 消耗材料
    背包.删除物品(Player, '无限玄晶', 需要碎片);
    Player.SetGamePoint(Player.GetGamePoint() - 需要礼券);
    Player.GoldChanged();

    // 升级时装档次
    升级时装档次(时装, 下一档次, 当前性别, Player);

    Main(Npc, Player, Args);
}

// 升级时装档次函数
function 升级时装档次(旧时装: TUserItem, 新档次: number, 性别: '男' | '女', Player: TPlayObject): void {
    const 新名称 = 时装升级档次[新档次][性别];

    // 删除旧时装
    Player.DeleteItem(旧时装, 1);

    // 给予新时装
    let 新时装: TUserItem;

    // 给予新时装（包括恶魔时装）
    新时装 = Player.GiveItem(新名称, false);

    if (新时装) {
        新时装.SetBind(true);
        新时装.SetNeverDrop(true);
        新时装.State.SetNoDrop(true);

        // 设置档次对应的属性
        const 倍功 = (新档次 + 1) * 10;
        const 百分比 = (新档次 + 1) * 5;

        新时装.SetOutWay1(12, 871);
        新时装.SetOutWay2(12, 倍功);
        新时装.SetOutWay3(12, 百分比);

        Player.UpdateItem(新时装);

        if (新档次 === 时装升级档次.length - 1) {
            Player.SendMessage(`{S=恭喜！时装进化为恶魔时装！;C=154}`, 1);
        } else {
            Player.SendMessage(`{S=时装升级成功！获得: ${新名称} (倍功:${倍功} 百分比:${百分比});C=154}`, 1);
        }
    }

    if (!新时装) {
        Player.MessageBox('时装升级失败，背包可能已满！');
    }
}


// 升级恶魔时装等级函数
function 升级恶魔时装(时装: TUserItem, 新等级: number, Player: TPlayObject): void {

    时装.SetBind(true);
    时装.SetNeverDrop(true);
    时装.State.SetNoDrop(true);

    // 恶魔时装等级提升
    const 原名称 = 时装.DisplayName.replace(/『\d+级』/, '');
    const 新名称 = `『${新等级}级』${原名称}`;

    时装.Rename(新名称);


    // 设置属性 - 恶魔时装基础属性100倍功50百分比，每级+1倍功，每10级+5百分比
    const 倍功 = 100 + 新等级;
    const 百分比 = 50 + Math.floor(新等级 / 10) * 5;


    时装.SetOutWay1(12, 871);
    时装.SetOutWay2(12, 倍功);
    时装.SetOutWay3(12, 百分比);

    // 立即更新物品
    Player.UpdateItem(时装);

    Player.SendMessage(`{S=时装升级成功！当前等级: ${新等级}级 (倍功:${倍功} 百分比:${百分比});C=154}`, 1);
    Player.SendMessage(`{S=时装升级成功！当前等级: ${新等级}级 (倍功:${倍功} 百分比:${百分比});C=154}`, 1);
    Player.SendMessage(`{S=时装升级成功！当前等级: ${新等级}级 (倍功:${倍功} 百分比:${百分比});C=154}`, 1);
}

// 性别置换功能
export function 性别置换(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    // Player.MessageBox(`暂时取消`);
    // return
    const 时装 = Player.GetCustomItem(0);

    // 检查时装
    if (!时装 || (时装.StdMode !== 17 && 时装.StdMode !== 18)) {
        Player.MessageBox('请放入时装！');
        return;
    }

    // 检查材料
    if (Player.GetItemCount('无限玄晶') < 200) {
        Player.MessageBox('无限玄晶不足200个！');
        return;
    }

    // 获取DisplayName检查是否包含级』（恶魔时装标识）
    const displayName = 时装.DisplayName;
    const 当前名称 = 时装.GetName();

    // 保存原有属性（如果是恶魔时装需要保持）
    const 原倍功 = 时装.GetOutWay2(12);
    const 原百分比 = 时装.GetOutWay3(12);

    // 消耗材料
    背包.删除物品(Player, '无限玄晶', 200);

    // 删除当前装备
    Player.DeleteItem(时装, 1);

    if (displayName.includes('级』')) {
        // 恶魔时装处理：给与另一性别的恶魔时装，赋予属性，改名为当前名称
        let 新名称 = '';

        // 判断当前性别并置换
        if (当前名称.includes('[男]')) {
            新名称 = 当前名称.replace('[男]', '[女]');
        } else if (当前名称.includes('[女]')) {
            新名称 = 当前名称.replace('[女]', '[男]');
        } else {
            Player.MessageBox('该恶魔时装无法进行性别置换！');
            return;
        }

        // 给予新时装
        const 新时装 = Player.GiveItem(新名称, false);

        if (新时装) {
            新时装.SetBind(true);
            新时装.SetNeverDrop(true);
            新时装.State.SetNoDrop(true);

            // 赋予属性（保持原有的OutWay2(12)和OutWay3(12)）
            新时装.SetOutWay1(12, 871);
            新时装.SetOutWay2(12, 原倍功);
            新时装.SetOutWay3(12, 原百分比);

            // 修改DisplayName为当前的名字（保持等级信息）
            新时装.Rename(displayName.replace(/\[男\]|\[女\]/, 新名称.includes('[男]') ? '[男]' : '[女]'));

            Player.UpdateItem(新时装);
            Player.SendMessage(`{S=恶魔时装性别置换成功！${当前名称} → ${新名称};C=154}`, 1);
        } else {
            Player.MessageBox('性别置换失败，背包可能已满！');
        }

    } else {
        // 非恶魔时装处理：直接给与另一性别并赋予属性
        const 对应时装名称 = 获取对应性别时装名称(当前名称);
        if (!对应时装名称) {
            Player.MessageBox('无法识别时装性别！');
            return;
        }
        // 给予新时装
        const 新时装 = Player.GiveItem(对应时装名称, false);

        if (新时装) {
            新时装.SetBind(true);
            新时装.SetNeverDrop(true);
            新时装.State.SetNoDrop(true);

            新时装.SetOutWay1(12, 871);
            新时装.SetOutWay2(12, 原倍功);
            新时装.SetOutWay3(12, 原百分比);

            Player.UpdateItem(新时装);
            Player.SendMessage(`{S=时装性别置换成功！${当前名称} → ${对应时装名称};C=154}`, 1);
        } else {
            Player.MessageBox('性别置换失败，背包可能已满！');
        }
    }

    Main(Npc, Player, Args);
}