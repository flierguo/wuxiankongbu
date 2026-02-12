export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\
        {S=经验说明:;C=2}\\\\
        {S=经验勋章可通过击杀任意怪物获得提高,;C=19}\\
        {S=也可以在这里通过元宝进行提高!!!;C=19}\\\\
        {S=经验倍率可通过礼卷进行提高!;C=6}\\\\
        {S=经验加成 = 勋章等级 + 经验倍率;C=9}

        <{S=提高勋章等级;HINT=勋章等级*5000元宝;X=200;Y=220}/@提高勋章等级>\\\\\\

        <{S=升级经验倍率;HINT=经验等级*10000礼卷;X=300;Y=220}/@升级经验倍率>\\

        <{S=勋章补领及修复;X=300;Y=150}/@勋章补领及修复>\\



    `
    Player.SayEx('NPC小窗口左下1框', S)
}

export function 勋章补领及修复(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    if (!Player.V.宣传奖励) {
        Player.MessageBox('请先完成宣传奖励！');
        return;
    }

    let 勋章 = Player.GiveItem('经验勋章');

    勋章.SetOutWay1(0, 1);
    勋章.SetOutWay2(0, 0);
    勋章.SetOutWay3(0, 500);

    勋章.Rename(`『1级』经验勋章`);
    勋章.SetBind(true);
    勋章.SetNeverDrop(true);
    勋章.State.SetNoDrop(true);
    Player.UpdateItem(勋章);

    Player.MessageBox('恭喜你成功补领及修复勋章！');
}

export function 提高勋章等级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 获取玩家当前勋章
    let currentLevel = 0;

    // 通过GetCustomItem(0)获取勋章
    const 勋章 = Player.GetCustomItem(0);

    // 如果没有找到勋章
    if (!勋章) {
        Player.MessageBox('请先放入勋章！');
        return;
    }

    // 从勋章名称中提取等级
    const displayName = 勋章.DisplayName;
    const match = displayName.match(/『(\d+)级』经验勋章/);

    if (!match) {
        Player.MessageBox('您放入的不是有效的经验勋章！');
        return;
    }

    // 获取当前等级
    currentLevel = parseInt(match[1]);

    // 计算所需元宝
    const nextLevel = currentLevel + 1;
    if (nextLevel > 60) {
        Player.MessageBox('你的勋章已经达到最高等级！');
        return;
    }

    const requiredGold = nextLevel * 5000;

    // 检查元宝是否足够
    if (Player.GetGameGold() < requiredGold) {
        Player.MessageBox(`提升勋章等级需要${requiredGold}元宝，你的元宝不足！`);
        return;
    }

    // 扣除元宝
    Player.SetGameGold(Player.GetGameGold() - requiredGold);

    // 直接修改勋章名称和属性
    const newMedalName = `『${nextLevel}级』经验勋章`;
    勋章.Rename(newMedalName);
    勋章.SetBind(true);
    勋章.SetNeverDrop(true);
    勋章.State.SetNoDrop(true);
    Player.UpdateItem(勋章);

    Player.MessageBox(`恭喜你成功将勋章提升到${nextLevel}级！`);
}

export function 升级经验倍率(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    // if (Player.V.经验等级 >= 40) {
    //     Player.MessageBox('您的经验倍率已经达到最高等级,请等待后续开放!!!');
    //     return;
    // }

    // 获取玩家的经验等级
    const currentLevel = Player.V.经验等级 || 0;

    // 检查最高等级限制
    if (currentLevel >= 40) {
        Player.MessageBox('你的经验等级已经达到最高等级！');
        return;
    }

    // 计算所需礼卷
    const requiredPoints = currentLevel * 10000;

    // 检查礼卷是否足够
    if (Player.GetGamePoint() < requiredPoints) {
        Player.MessageBox(`升级经验倍率需要${requiredPoints}礼卷，你的礼卷不足！`);
        return;
    }

    // 扣除礼卷
    Player.SetGamePoint(Player.GetGamePoint() - requiredPoints);
    Player.GoldChanged();

    // 计算新的经验倍率（这里可以根据需求调整倍率计算方式）
    const newExpRate = Math.min(currentLevel, 40); // 最高40级

    // 更新玩家经验等级
    Player.V.经验等级 += 1;

    Player.MessageBox(`恭喜你成功将勋章经验倍率提升到${newExpRate + 1}倍！`);
}

export function 专属合成main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
        {S=专属合成需求:专属碎片100个,元宝5000;C=2}\\
        {S=专属等级提高需求:专属等级*5000元宝,专属等级 * 100个碎片;C=6}\\

        <{S=攻击专属合成;HINT=合成攻击专属装备;X=50;Y=110}/@专属合成(攻击专属)>\\\\
        <{S=魔法专属合成;HINT=合成魔法专属装备;X=175;Y=110}/@专属合成(魔法专属)>\\\\
        <{S=道术专属合成;HINT=合成道术专属装备;X=300;Y=110}/@专属合成(道术专属)>\\\\
        <{S=刺术专属合成;HINT=合成刺术专属装备;X=50;Y=150}/@专属合成(刺术专属)>\\\\
        <{S=箭术专属合成;HINT=合成箭术专属装备;X=175;Y=150}/@专属合成(箭术专属)>\\\\
        <{S=武术专属合成;HINT=合成武术专属装备;X=300;Y=150}/@专属合成(武术专属)>\\\\

        <{S=专属等级提高;HINT=专属等级*5000元宝#92专属等级*100个碎片#92最高可升级到20级;X=175;Y=220}/@提高专属等级(20)>
        <{S=专属装备置换;HINT=消耗专属碎片1000个;X=275;Y=220}/@专属装备置换>
    `
    Player.SayEx('NPC小窗口左下1框', S)
    // console.log(Player.Bujuk.GetOutWay2(0) + `专属装备属性` + Player.Bujuk.DisplayName)

}
export function 专属装备置换(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 检查专属碎片
    if (Player.GetItemCount('专属碎片') < 1000) {
        Player.MessageBox('专属碎片不足1000个，无法置换！');
        return;
    }

    // 获取当前专属装备
    const 当前专属 = Player.GetCustomItem(0);
    if (!当前专属) {
        Player.MessageBox('请先放入专属装备！');
        return;
    }

    // 检查是否为有效的专属装备
    const displayName = 当前专属.DisplayName;
    const match = displayName.match(/『(\d+)级』(.+)专属/);
    if (!match) {
        Player.MessageBox('您放入的不是有效的专属装备！');
        return;
    }

    const 当前等级 = parseInt(match[1]);
    const 当前专属类型 = match[2];

    // 获取玩家职业
    const 玩家职业 = Player.GetJob();
    let 目标专属类型 = '';

    // 根据玩家职业确定目标专属类型
    switch (玩家职业) {
        case 0: // 战士
            目标专属类型 = '攻击';
            break;
        case 1: // 法师
            目标专属类型 = '魔法';
            break;
        case 2: // 道士
            目标专属类型 = '道术';
            break;
        case 3: // 刺客
            目标专属类型 = '刺术';
            break;
        case 4: // 弓箭手
            目标专属类型 = '箭术';
            break;
        case 5: // 武僧
            目标专属类型 = '武术';
            break;
        default:
            Player.MessageBox('未知职业，无法进行专属装备置换！');
            return;
    }

    // 检查是否已经是目标专属类型
    if (当前专属类型 === 目标专属类型) {
        Player.MessageBox(`您已经是${目标专属类型}职业，无需置换！`);
        return;
    }

    // 保存当前装备的属性
    const 原属性ID = 当前专属.GetOutWay1(0);
    const 原属性值 = 当前专属.GetOutWay2(0);
    const 原血量值 = 当前专属.GetOutWay3(0);

    // 扣除碎片
    Npc.Take(Player, '专属碎片', 1000);

    // 删除当前专属装备
    Player.DeleteItem(当前专属, 1);

    // 创建新的专属装备
    const 新专属装备 = Player.GiveItem(`${目标专属类型}专属`);

    if (!新专属装备) {
        Player.MessageBox('置换失败，背包可能已满！');
        return;
    }

    // 设置新专属装备的属性
    let OUT = 810;
    let 属性 = 原属性值;
    let 血量 = 原血量值;

    // 根据目标专属类型设置属性ID
    switch (目标专属类型) {
        case '攻击':
            新专属装备.SetOutWay1(0, OUT);
            break;
        case '魔法':
            新专属装备.SetOutWay1(0, OUT + 1);
            break;
        case '道术':
            新专属装备.SetOutWay1(0, OUT + 2);
            break;
        case '刺术':
            新专属装备.SetOutWay1(0, OUT + 3);
            break;
        case '箭术':
            新专属装备.SetOutWay1(0, OUT + 4);
            break;
        case '武术':
            新专属装备.SetOutWay1(0, OUT + 5);
            break;
    }

    // 设置属性和血量（保持原等级的属性值）
    新专属装备.SetOutWay2(0, 属性);
    新专属装备.SetOutWay3(0, 血量);

    // 设置装备名称和属性
    新专属装备.Rename(`『${当前等级}级』${目标专属类型}专属`);
    新专属装备.SetBind(true);
    新专属装备.SetNeverDrop(true);
    新专属装备.State.SetNoDrop(true);

    Player.UpdateItem(新专属装备);
    Player.ReloadBag();

    Player.MessageBox(`专属装备置换成功！\\\\${当前专属类型}专属 → ${目标专属类型}专属\\等级：${当前等级}级\\属性：${属性}\\血量：${血量}`);
}   
export function 专属三大陆main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
    {S=专属等级提高需求:专属等级*100000元宝,专属等级 * 200个碎片;C=6}\\\\
    {S=专属每级提高属性:主属性提高5%,血量提高10%;C=7}\\\\



        <{S=专属等级提高;HINT=专属等级*100000元宝#92专属等级 * 200个碎片#92最高可升级到50级;X=175;Y=220}/@提高专属等级(50)>
    `
    Player.SayEx('NPC小窗口左下1框', S)
    // console.log(Player.Bujuk.GetOutWay2(0) + `专属装备属性` + Player.Bujuk.DisplayName)

}
export function 专属合成(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 专属类型 = Args.Str[0]

    if (Player.GetItemCount('专属碎片') < 100) {
        Player.MessageBox('专属碎片不足100个，无法合成！');
        return;
    }

    if (Player.GetGameGold() < 5000) {
        Player.MessageBox('合成专属装备需要5000元宝，你的元宝不足！');
        return;
    }

    Npc.Take(Player, '专属碎片', 100);

    Player.SetGameGold(Player.GetGameGold() - 5000);
    Player.GoldChanged();

    let 专属装备 = Player.GiveItem(专属类型);

    let OUT = 810
    let 属性 = 10
    let 血量 = 20

    if (专属类型.includes('攻击专属')) {
        专属装备.SetOutWay1(0, OUT)
        专属装备.SetOutWay2(0, 属性)
        专属装备.SetOutWay3(0, 血量)
    } else if (专属类型.includes('魔法专属')) {
        专属装备.SetOutWay1(0, OUT + 1)
        专属装备.SetOutWay2(0, 属性)
        专属装备.SetOutWay3(0, 血量)
    } else if (专属类型.includes('道术专属')) {
        专属装备.SetOutWay1(0, OUT + 2)
        专属装备.SetOutWay2(0, 属性)
        专属装备.SetOutWay3(0, 血量)
    } else if (专属类型.includes('刺术专属')) {
        专属装备.SetOutWay1(0, OUT + 3)
        专属装备.SetOutWay2(0, 属性)
        专属装备.SetOutWay3(0, 血量)
    } else if (专属类型.includes('箭术专属')) {
        专属装备.SetOutWay1(0, OUT + 4)
        专属装备.SetOutWay2(0, 属性)
        专属装备.SetOutWay3(0, 血量)
    } else if (专属类型.includes('武术专属')) {
        专属装备.SetOutWay1(0, OUT + 5)
        专属装备.SetOutWay2(0, 属性)
        专属装备.SetOutWay3(0, 血量)
    }
    专属装备.Rename(`『1级』${专属类型}`);
    专属装备.SetBind(true);
    专属装备.SetNeverDrop(true);
    专属装备.State.SetNoDrop(true);
    Player.UpdateItem(专属装备);

    Player.MessageBox(`恭喜你成功合成1级${专属类型}专属！`);

    Player.ReloadBag();

}

export function 提高专属等级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 获取玩家当前勋章
    let 当前等级 = 0;
    let 最高等级 = Args.Int[0]

    // 通过GetCustomItem(0)获取勋章
    const 专属 = Player.GetCustomItem(0);

    // 如果没有找到勋章
    if (!专属) {
        Player.MessageBox('请先放入专属装备！');
        return;
    }

    // 从勋章名称中提取等级
    const displayName = 专属.DisplayName;
    const match = displayName.match(/『(\d+)级』/);

    if (!match) {
        Player.MessageBox('您放入的不是有效的专属装备！');
        return;
    }

    // 获取当前等级
    当前等级 = parseInt(match[1]);

    // 计算所需元宝
    const 下一级 = 当前等级 + 1;
    if (下一级 > 最高等级) {
        Player.MessageBox(`你的专属装备已经达到${最高等级}级！`);
        return;
    }

    let 所需元宝 = 下一级 * 5000;
    let 所需碎片 = 下一级 * 100;
    if (最高等级 > 20) {
        所需元宝 = 下一级 * 100000;
        所需碎片 = 下一级 * 200;
    }

    // 检查元宝是否足够
    if (Player.GetGameGold() < 所需元宝) {
        Player.MessageBox(`提升专属等级需要${所需元宝}元宝，你的元宝不足！`);
        return;
    }
    if (Player.GetItemCount('专属碎片') < 所需碎片) {
        Player.MessageBox(`提升专属等级需要${所需碎片}个专属碎片，你的专属碎片不足！`);
        return;
    }

    // 扣除元宝
    Player.SetGameGold(Player.GetGameGold() - 所需元宝);
    Player.GoldChanged();

    // 扣除碎片
    Npc.Take(Player, '专属碎片', 所需碎片);
    Player.ReloadBag();




    // 直接修改勋章名称和属性
    // 获取装备名称中的专属类型
    let 专属类型 = "";
    if (displayName.includes('攻击')) {
        专属类型 = '攻击';
    } else if (displayName.includes('魔法')) {
        专属类型 = '魔法';
    } else if (displayName.includes('道术')) {
        专属类型 = '道术';
    } else if (displayName.includes('刺术')) {
        专属类型 = '刺术';
    } else if (displayName.includes('箭术')) {
        专属类型 = '箭术';
    } else if (displayName.includes('武术')) {
        专属类型 = '武术';
    }

    const newMedalName = `『${下一级}级』${专属类型}专属`;

    let OUT = 810
    let 属性 = 10 * 下一级
    let 血量 = 20 * 下一级
    if (最高等级 > 20) {
        属性 = 200 + (下一级 - 20) * 5
        血量 = 400 + (下一级 - 20) * 10
    }

    // 输出调试信息，查看当前等级和计算后的属性值
    // Player.MessageBox(`调试信息: 当前等级=${当前等级}, 下一级=${下一级}, 属性=${属性}, 血量=${血量}`);

    // 使用之前获取的专属类型来设置属性
    if (专属类型 === '攻击') {
        专属.SetOutWay1(0, OUT)
        专属.SetOutWay2(0, 属性)
        专属.SetOutWay3(0, 血量)
    } else if (专属类型 === '魔法') {
        专属.SetOutWay1(0, OUT + 1)
        专属.SetOutWay2(0, 属性)
        专属.SetOutWay3(0, 血量)
    } else if (专属类型 === '道术') {
        专属.SetOutWay1(0, OUT + 2)
        专属.SetOutWay2(0, 属性)
        专属.SetOutWay3(0, 血量)
    } else if (专属类型 === '刺术') {
        专属.SetOutWay1(0, OUT + 3)
        专属.SetOutWay2(0, 属性)
        专属.SetOutWay3(0, 血量)
    } else if (专属类型 === '箭术') {
        专属.SetOutWay1(0, OUT + 4)
        专属.SetOutWay2(0, 属性)
        专属.SetOutWay3(0, 血量)
    } else if (专属类型 === '武术') {
        专属.SetOutWay1(0, OUT + 5)
        专属.SetOutWay2(0, 属性)
        专属.SetOutWay3(0, 血量)
    }
    专属.Rename(newMedalName);
    专属.SetBind(true);
    专属.SetNeverDrop(true);
    专属.State.SetNoDrop(true);
    Player.UpdateItem(专属);

    Player.MessageBox(`恭喜你成功将专属装备提升到${下一级}级！`);
    if (最高等级 <= 20) {                
        专属合成main(Npc, Player, Args);
    } else {
        专属三大陆main(Npc, Player, Args);
    }
}
