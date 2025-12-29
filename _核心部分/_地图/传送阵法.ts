import * as 地图 from './地图';

const 地图声明 = 地图.地图配置

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // if (Player.V.任务1 == false) { Player.MessageBox('请先完成新手任务\\点击屏幕上方新手任务即可查看!'); return }
    let S = ``
    switch (Npc.Tag) {
        case 1:
            S = `\\\\\\\\\\\\
            {I=317;F=ASD.DATA;X=47;Y=80} {I=317;F=ASD.DATA;X=47;Y=120} {I=317;F=ASD.DATA;X=47;Y=160} {I=317;F=ASD.DATA;X=47;Y=200} {I=317;F=ASD.DATA;X=47;Y=240}
            <&{S=浣熊市;FS=15;C=103;CH=145;X=130;Y=80}/@副本传送(沙漠绿洲)>
            <&{S=蜂巢入口;FS=15;C=103;CH=145;X=130;Y=120}/@副本传送(凄凉之地)>
            <&{S=病毒研究室;FS=15;C=103;CH=145;X=130;Y=160}/@副本传送(狂风峭壁)>
            <&{S=生化实验室;FS=15;C=103;CH=145;X=130;Y=200}/@副本传送(崎岖索道)>
            <&{S=激光走廊;FS=15;C=103;CH=145;X=130;Y=240}/@副本传送(激光走廊)>
                
        
                    
            {S=地图挑战等级 = 地图固定星级 * 挑战倍数;X=50;Y=390}
        
            <{S=绑定回城石;X=50;Y=330}/@绑定回城石(1)>
            `
            break;
        default:
            // if (Player.GetLevel() >= 200) { Player.MessageBox('200级以上的玩家无法再进入!'); return }
            S = `\\\\\\\\\\\\
            {I=317;F=ASD.DATA;X=47;Y=80} {I=317;F=ASD.DATA;X=47;Y=120} {I=317;F=ASD.DATA;X=47;Y=160} {I=317;F=ASD.DATA;X=47;Y=200} {I=317;F=ASD.DATA;X=47;Y=240}{I=317;F=ASD.DATA;X=47;Y=280}
            <&{S=浣熊市;FS=15;C=103;CH=145;X=130;Y=80}/@副本传送(浣熊市)>
            <&{S=蜂巢入口;FS=15;C=103;CH=145;X=130;Y=120}/@副本传送(蜂巢入口)>
            <&{S=病毒研究室;FS=15;C=103;CH=145;X=130;Y=160}/@副本传送(病毒研究室)>
            <&{S=生化实验室;FS=15;C=103;CH=145;X=130;Y=200}/@副本传送(生化实验室)>
            <&{S=激光走廊;FS=15;C=103;CH=145;X=130;Y=240}/@副本传送(激光走廊)>
            <&{S=红后控制室;FS=15;C=103;CH=145;X=130;Y=280}/@副本传送(红后控制室)>

    {S=当前倍数: ${Player.V.挑战倍数} 倍;X=50;Y=360}          <{S=倍数设置;X=220;Y=360}/@@InPutString11(输入准备挑战的倍数。}>

    
    {S=地图挑战等级 = 地图固定星级 * 挑战倍数;X=50;Y=390}


    `
            break;
    }
    // Player.V.挑战倍数 = 10

    Npc.SayEx(Player, '传送', S)
}


export function 最高(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 最高倍数 = Args.Int[0];
    if (Player.V.最高挑战倍数 >= 最高倍数) {
        Player.V.挑战倍数 = 最高倍数;
    } else {
        Player.V.挑战倍数 = Player.V.最高挑战倍数;
    }
    console.log(`玩家:${Player.GetName()} , 最高倍数:${最高倍数} , 当前倍数:${Player.V.挑战倍数}`);
    Main(Npc, Player, Args);
}

export function InPutString11(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 最高倍数 = Args.Int[0];
    let 设置倍数 = Args.Int[1];
    if (设置倍数 > 最高倍数) {
        Player.MessageBox(`请输入小于${最高倍数}的数值`);
        return;
    }
    if (设置倍数 >= 2 && 设置倍数 <= Player.V.最高挑战倍数) {
        Player.V.挑战倍数 = 设置倍数;
    }
    else {
        Player.MessageBox(`请输入小于${Player.V.最高挑战倍数}的数值`);
    }
    Main(Npc, Player, Args);
}

export function 副本传送(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 地图名 = Args.Str[0];

    if (!地图名) {
        console.error('错误：地图名参数无效');
        return;
    }
    const 地图配置 = 地图声明.find(m => m.地图名 === 地图名);
    if (!地图配置) return;
    let str = ``;

    let 副本池 = 地图.取地图()
    str += `{S=${地图名} ${地图配置.需求等级} 级;FS=11;C=154;X=80;Y=10}`;

    if (Player.V.地图成就 + 1 < 地图配置.固定星级) {
        Player.MessageBox(`您的地图成就不足，无法进入${地图名}。`);
        return;
    }

    // Y坐标：1-5固定副本，6-10圣耀副本
    const yPositions = [22, 60, 98, 136, 174, 212, 250, 288, 326, 364, 402];
    const 固定副本数 = 5;

    // 计算该地图的起始下标
    let 地图索引 = 地图声明.findIndex(c => c.地图名 === 地图名);
    if (地图索引 === -1) return;
    let 起始下标 = 地图索引 * 10;

    // 生成固定副本按钮（1-5）
    for (let i = 1; i <= 固定副本数; i++) {
        const y = yPositions[i];
        const 下标 = 起始下标 + i;
        const 副本 = 副本池[下标];

        if (副本 && 副本.地图ID && 副本.地图ID !== '') {
            let map = GameLib.FindMap(副本.地图ID);
            let 人数 = map ? map.GetHumCount() : 0;
            let hint = `当前地图:#123S#61${副本.显示名}#59C#61146#125#92#92地图人数:#123S#61 ${人数} 人#59C#61251#125#92#92创建者  :#123S#61系统自建#59C#6194#125#92#92剩余时间:#123S#61无限#59C#6170#125`;
            str += `{S=${副本.显示名};FS=11;C=103;X=80;Y=${y}}<{M=2649,2649,2649;F=界面素材.data;X=28;Y=${y - 12};HINT=${hint}}/@固定传送(${地图名},${下标})>`;
        } else {
            str += `<&{S=副本加载中...;FS=11;C=154;X=80;Y=${y}}/>`;
        }
    }

    //<{M=2649,2649,2649;F=界面素材.data;X=28;;HINT=${hint}

    // 生成圣耀副本按钮（6-10）
    for (let i = 固定副本数 + 1; i <= 10; i++) {
        const y = yPositions[i];
        const 下标 = 起始下标 + i;
        const 副本 = 副本池[下标];

        if (副本 && 副本.地图ID && 副本.地图ID !== '' && 副本.是圣耀副本) {
            let map = GameLib.FindMap(副本.地图ID);
            let 人数 = map ? map.GetHumCount() : 0;

            // 计算剩余时间
            let 剩余时间 = '未知';
            if (副本.创建时间) {
                let 已过毫秒 = GameLib.TickCount - 副本.创建时间;
                let 剩余毫秒 = 24 * 60 * 60 * 1000 - 已过毫秒;
                if (剩余毫秒 > 0) {
                    let 剩余分钟 = Math.floor(剩余毫秒 / 60000);
                    剩余时间 = `${剩余分钟}分`;
                } else {
                    剩余时间 = '即将关闭';
                }
            }

            // 获取创建者名称（优先使用存储的名字）
            let 创建者名 = 副本.创建者名字 || '未知';
            
            // 获取队长名称
            let 队长名 = 副本.队伍名字 || '无';

            // 圣耀副本HINT - 使用 \\ 作为换行符
            let hint = `{当前地图:#123S#61${副本.显示名}#59C#61146#125#92#92地图人数:#123S#61 ${人数} 人#59C#61251#125#92#92创建者  :#123S#61${创建者名}#59C#6194#125#92#92队长    :#123S#61${队长名}#59C#61220#125#92#92剩余时间:#123S#61${剩余时间}#59C#6170#125}`;
            str += `{S=${副本.显示名};FS=11;C=250;X=80;Y=${y}}<{M=2649,2649,2649;F=界面素材.data;X=28;Y=${y - 12};HINT=${hint}}/@圣耀副本传送(${下标})>`;
        } else {
            str += `{S=创建圣耀副本;FS=11;C=154;X=80;Y=${y}}<{M=2649,2649,2649;F=界面素材.data;X=28;Y=${y - 12};HINT=点击创建圣耀副本}/@创建圣耀副本(${地图名})>`;
        }
    }

    Npc.SayEx(Player, '传送层数', str);
}

export function 固定传送(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 地图名 = Args.Str[0];
    const 下标 = Args.Int[1];
    const 地图配置 = 地图声明.find(m => m.地图名 === 地图名);
    if (!地图配置) return;
    if (Player.GetLevel() < 地图配置.需求等级) {
        Player.MessageBox(`您的等级不足，无法进入${地图名}。`);
        return;
    }
    if (Player.V.地图成就 + 1 < 地图配置.固定星级) {
        Player.MessageBox(`您的地图成就不足，无法进入${地图名}。`);
        return;
    }
    Player.RandomMove(地图.取地图ID(下标))

}

export function 创建副本(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 地图名 = Args.Str[0];

    地图.创建单个副本(地图名, Player)

    // 创建副本的逻辑
    // Player.MessageBox(`正在创建${地图名}星副本...`);
    // 这里添加实际的创建副本逻辑
}

// ==================== 圣耀副本传送 ====================
/**
 * 创建圣耀副本入口
 */
export function 创建圣耀副本(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 地图名 = Args.Str[0];

    // 检查玩家是否设置了地图倍率
    if (!Player.R.地图倍率 || Player.R.地图倍率 < 1) {
        Player.R.地图倍率 = 1
    }

    地图.创建圣耀副本(地图名, Player)
}

/**
 * 设置圣耀倍率
 */
export function 设置圣耀倍率(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 倍率 = Args.Int[0];
    const 最大倍率 = Args.Int[1] || 1000;

    if (倍率 < 1 || 倍率 > 最大倍率) {
        Player.MessageBox(`请输入1-${最大倍率}之间的倍率`)
        return
    }

    Player.R.地图倍率 = 倍率
    Player.MessageBox(`{S=【圣耀副本】;C=250}圣耀倍率已设置为 {S=${倍率};C=253} 倍`)
}

/**
 * 圣耀副本传送（带权限检查）
 */
export function 圣耀副本传送(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 下标 = Args.Int[0];

    地图.进入圣耀副本(Player, 下标)
}



export function 绑定回城石(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 定义章节与回城石名称的映射关系，避免冗长的switch
    const 列表映射 = [
        '', // 索引0占位，对应case 0（无意义）
        '第二章回城石',   // case 1
        '第三章回城石',   // case 2
        '第四章回城石',   // case 3
        '第五章回城石',   // case 4
        '第六章回城石',   // case 5
        '第七章回城石',   // case 6
        '第八章回城石',   // case 7
        '第九章回城石',   // case 8
        '第十章回城石',   // case 9
        '第十一章回城石', // case 10
        '第十二章回城石', // case 11
        '第十三章回城石', // case 12
        '第十四章回城石', // case 13
        '第十五章回城石', // case 14
        '第十六章回城石'  // case 15
    ];

    const 大陆 = Args.Int[0];
    // 校验大陆编号是否在有效范围（1-15）
    if (大陆 < 1 || 大陆 >= 列表映射.length) {
        Player.MessageBox('无效的大陆编号');
        return;
    }

    // 查找玩家背包中的回城石
    let targetItem: TUserItem | null = null;
    for (let i = Player.GetItemSize() - 1; i >= 0; i--) {
        const item = Player.GetBagItem(i);
        if (item.GetName() === '回城石') {
            targetItem = item;
            break; // 找到第一个回城石后退出循环
        }
    }

    // 处理物品不存在的情况
    if (!targetItem) {
        Player.MessageBox('未找到回城石');
        return;
    }

    // 统一执行物品修改操作（所有case共用的逻辑）
    targetItem.Rename(列表映射[大陆]);
    targetItem.SetBind(true);
    targetItem.SetNeverDrop(true);
    targetItem.State.SetNoDrop(true);
    Player.UpdateItem(targetItem); // 统一在最后更新，避免重复调用

    Player.MessageBox('绑定成功');
}




/**
 * 确认重建圣耀副本（Question回调中转函数）
 */
export function 确认重建圣耀副本(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    地图.确认重建圣耀副本(Npc, Player, Args)
}
