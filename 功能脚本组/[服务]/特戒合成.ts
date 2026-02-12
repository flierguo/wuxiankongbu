export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
    {S=特戒合成需求:特戒碎片200个,元宝2000;C=2}\\
    {S=特戒等级提高需求:特戒等级*1000元宝,特戒等级 * 200个碎片;C=6}\\
    <{S=玉帝之玺合成;HINT=回收戒指,可升级300次;X=50;Y=150}/@特戒合成(玉帝之玺)>\\
    <{S=老君灵宝合成;HINT=爆率戒指,可升级300次;X=150;Y=150}/@特戒合成(老君灵宝)>\\
    <{S=女娲之泪合成;HINT=极品率戒指,可升级300次;X=250;Y=150}/@特戒合成(女娲之泪)>\\

    <{S=特戒等级提高;HINT=特戒等级 * 200元宝#92特戒碎片 200个;C=22;X=125;Y=220}/@提高特戒等级(300,100,100)>
    <{S=特戒修复;C=8;X=250;Y=220}/@特戒修复>
`
    Player.SayEx('NPC小窗口左下1框', S)
    // console.log(Player.Bujuk.GetOutWay2(0) + `专属装备属性` + Player.Bujuk.DisplayName)

}

export function 四大陆特戒提升(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
    {S=特戒等级提高需求:特戒等级*10000元宝,500个特戒碎片;C=6}\\
    {S=特戒等级提高介绍:在这里可提升至500级;C=6}\\
    <{S=特戒等级提高;HINT=特戒等级 * 10000元宝#92特戒碎片 500个;C=22;X=125;Y=220}/@提高特戒等级(500,300,300)>
    <{S=特戒修复;C=8;X=250;Y=220}/@特戒修复>
`
    Player.SayEx('NPC小窗口左下1框', S)
    // console.log(Player.Bujuk.GetOutWay2(0) + `专属装备属性` + Player.Bujuk.DisplayName)

}
export function 特戒修复(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 获取玩家当前特戒
    let 当前等级 = 0;

    let 特戒 = Player.GetCustomItem(0);
    if (!特戒) {
        Player.MessageBox('请先放入特戒！');
        return;
    }
    // 从特戒名称中提取等级
    const displayName = 特戒.DisplayName;
    const match = displayName.match(/『(\d+)级』/);

    if (!match) {
        Player.MessageBox('您放入的不是有效的特戒！');
        return;
    }

    // 获取当前等级
    当前等级 = parseInt(match[1]);


    let 特戒类型 = "";
    if (displayName.includes('玉帝之玺')) {
        特戒类型 = '玉帝之玺';
    } else if (displayName.includes('老君灵宝')) {
        特戒类型 = '老君灵宝';
    } else if (displayName.includes('女娲之泪')) {
        特戒类型 = '女娲之泪';
    }
    const newMedalName = `『${当前等级}级』${特戒类型}`;

    let OUT = 851
    let 属性 = 1 * 当前等级


    if (特戒类型.includes('玉帝之玺')) {
        特戒.SetOutWay1(12, OUT)
        特戒.SetOutWay2(12, 属性 * 3)
    } else if (特戒类型.includes('老君灵宝')) {
        特戒.SetOutWay1(12, OUT + 1)
        特戒.SetOutWay2(12, 属性)
    } else if (特戒类型.includes('女娲之泪')) {
        特戒.SetOutWay1(12, OUT + 2)
        特戒.SetOutWay2(12, 属性)
    }
    特戒.Rename(newMedalName);
    特戒.SetBind(true);
    特戒.SetNeverDrop(true);
    特戒.State.SetNoDrop(true);
    Player.UpdateItem(特戒);

    Player.MessageBox(`恭喜你成功将特戒修复到${当前等级}级！`);

}

export function 特戒合成(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 特戒类型 = Args.Str[0]

    if (Player.GetItemCount('特戒碎片') < 200) {
        Player.MessageBox('特戒碎片不足200个，无法合成！');
        return;
    }

    if (Player.GetGameGold() < 2000) {
        Player.MessageBox('合成特戒需要2000元宝，你的元宝不足！');
        return;
    }

    Npc.Take(Player, '特戒碎片', 200);

    Player.SetGameGold(Player.GetGameGold() - 2000);
    Player.GoldChanged();

    let 特戒 = Player.GiveItem(特戒类型);

    let OUT = 851
    let 属性 = 1


    if (特戒类型.includes('玉帝之玺')) {
        特戒.SetOutWay1(12, OUT)
        特戒.SetOutWay2(12, 属性 * 3)
    } else if (特戒类型.includes('老君灵宝')) {
        特戒.SetOutWay1(12, OUT + 1)
        特戒.SetOutWay2(12, 属性)
    } else if (特戒类型.includes('女娲之泪')) {
        特戒.SetOutWay1(12, OUT + 2)
        特戒.SetOutWay2(12, 属性)
    }
    特戒.Rename(`『1级』${特戒类型}`);
    特戒.SetBind(true);
    特戒.SetNeverDrop(true);
    特戒.State.SetNoDrop(true);
    Player.UpdateItem(特戒);

    Player.MessageBox(`恭喜你成功合成1级${特戒类型}特戒！`);

    Player.ReloadBag();

}

export function 提高特戒等级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 最大等级 = Args.Int[0]
    let 碎片数量 = Args.Int[1]
    let 元宝数量 = Args.Int[2]
    // 获取玩家当前特戒
    let 当前等级 = 0;


    // 通过GetCustomItem(0)获取特戒
    const 特戒 = Player.GetCustomItem(0);
    // console.log(`特戒.GetName() ${特戒.GetName()}`);
    // 如果没有找到特戒
    if (!特戒 || (特戒.GetName() != '玉帝之玺' && 特戒.GetName() != '老君灵宝' && 特戒.GetName() != '女娲之泪')) {
        Player.MessageBox('请先放入特戒！');
        return;
    }

    // 从特戒名称中提取等级
    const displayName = 特戒.DisplayName;
    const match = displayName.match(/『(\d+)级』/);

    if (!match) {
        Player.MessageBox('您放入的不是有效的特戒！');
        return;
    }

    // 获取当前等级
    当前等级 = parseInt(match[1]);

    // 计算所需元宝
    const 下一级 = 当前等级 + 1;
    if (下一级 > 最大等级) {
        Player.MessageBox(`你的特戒已经达到最高等级${最大等级}级！`);
        return;
    }

    const 所需元宝 = 下一级 * 元宝数量;

    // 检查元宝是否足够
    if (Player.GetGameGold() < 所需元宝) {
        Player.MessageBox(`提升特戒等级需要${所需元宝}元宝，你的元宝不足！`);
        return;
    }
    if (Player.GetItemCount('特戒碎片') < 碎片数量) {
        Player.MessageBox(`提升特戒等级需要${碎片数量}个特戒碎片，你的特戒碎片不足！`);
        return;
    }

    // 扣除元宝
    Player.SetGameGold(Player.GetGameGold() - 所需元宝);
    Player.GoldChanged();

    // 扣除碎片
    Npc.Take(Player, '特戒碎片', 碎片数量);
    Player.ReloadBag();

    // 直接修改勋章名称和属性
    // 获取装备名称中的专属类型
    let 特戒类型 = "";
    if (displayName.includes('玉帝之玺')) {
        特戒类型 = '玉帝之玺';
    } else if (displayName.includes('老君灵宝')) {
        特戒类型 = '老君灵宝';
    } else if (displayName.includes('女娲之泪')) {
        特戒类型 = '女娲之泪';
    }

    const newMedalName = `『${下一级}级』${特戒类型}`;


    let OUT = 851
    let 属性 = 1 * 下一级


    if (特戒类型.includes('玉帝之玺')) {
        特戒.SetOutWay1(12, OUT)
        特戒.SetOutWay2(12, 属性 * 3)
    } else if (特戒类型.includes('老君灵宝')) {
        特戒.SetOutWay1(12, OUT + 1)
        特戒.SetOutWay2(12, 属性)
    } else if (特戒类型.includes('女娲之泪')) {
        特戒.SetOutWay1(12, OUT + 2)
        特戒.SetOutWay2(12, 属性)
    }
    特戒.Rename(newMedalName);
    特戒.SetBind(true);
    特戒.SetNeverDrop(true);
    特戒.State.SetNoDrop(true);
    Player.UpdateItem(特戒);

    Player.MessageBox(`恭喜你成功将特戒提升到${下一级}级！`);
    // 提高特戒等级(Npc, Player, Args);
}
