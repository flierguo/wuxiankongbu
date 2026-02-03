import { 文本 } from '../_功能';
import * as 地图 from './地图';

const 地图声明 = 地图.完整地图配置

// 传送阵地图配置表 - 根据 Npc.Tag 配置不同地图列表
const 传送阵配置: Record<number, { 地图列表: string[], 显示倍数设置?: boolean, 显示地图信息?: boolean, 绑定回城石?: number }> = {
    // 默认配置 (Tag=0 或其他未定义的Tag)
    0: {
        地图列表: ['新手地图'],
        显示倍数设置: false,
        显示地图信息: true
    },
    1: {
        地图列表: ['浣熊市', '蜂巢入口', '病毒研究室', '生化实验室', '激光走廊', '红后控制室'],
        显示倍数设置: true,
    },
    2: {
        地图列表: ['沙漠绿洲', '凄凉之地', '狂风峭壁', '崎岖索道', '激光走廊'],
        显示倍数设置: false,
        绑定回城石: 1
    },
    // 可继续添加更多Tag配置...
    // 2: { 地图列表: ['地图A', '地图B', '地图C'], 显示倍数设置: true },
}
const 圣耀比例 = 50
export function Main(Npc: TNormNpc, Player: TPlayObject, _Args: TArgs): void {
    const 配置 = 传送阵配置[Npc.Tag] || 传送阵配置[0]
    const 地图列表 = 配置.地图列表
    const Y坐标 = [80, 120, 160, 200, 240, 280]
    const HINT = 文本.转义(`{S=圣耀地图的难度是炼狱级的100倍, 并且拥有更多的BOSS;C=8}\\{S=进入圣耀地图会增加相应倍数的爆率;C=9}\\{S=例如: 设置100倍,爆率增加 100%;C=7}\\{S=圣耀地图持续时间为24小时, 并且只有创建者和同队伍玩家可进入!!;C=6}\\{S=每${圣耀比例}点主神点可提高1倍圣耀倍数;C=21}`)

    // 生成图标和按钮
    let 图标 = 地图列表.map((_, i) => `{I=330;F=新UI素材文件.DATA;X=47;Y=${Y坐标[i]}}`).join(' ')
    let 按钮 = 地图列表.map((名, i) =>
        `<&{S=${名};FS=15;C=103;CH=145;X=130;Y=${Y坐标[i]}}/@副本传送(${名})>`
    ).join('\n            ')

    let S = `\\\\\\\\\\\\
            ${图标}
            ${按钮}
`

    // 根据配置显示倍数设置
    if (配置.显示倍数设置) {
        S += `{S=圣耀地图说明;HINT=${HINT};AC=251,249,222,210;X=50;Y=330}`
        S += `{S=当前圣耀倍数: ${Player.R.圣耀地图爆率加成} 倍;X=50;Y=360}          <{S=倍数设置;X=220;Y=360}/@@InPutString11(请输入倍数。}>`
    }
    // 根据配置显示地图信息
    if (配置.显示地图信息) {
        S += `{S=地图介绍:除新手地图外,其他均可掉落主神宝物.;C=9;X=50;Y=150}`
        S += `{S=难度越高的怪,掉落的几率越高.;C=9;X=50;Y=175}`
        S += `{S=橙色BOSS随地图小怪刷新;C=9;X=50;Y=200}`
        S += `{S=红色BOSS为固定时间刷新;C=9;X=50;Y=225}`
        S += `{S=金色BOSS为当前地图杀怪数达到指定数量刷新;C=9;X=50;Y=250}`
        S += `{S=圣耀地图BOSS数量翻倍,还有爆率加成;C=9;X=50;Y=275}`
    }

    // 根据配置显示绑定回城石
    if (配置.绑定回城石) {
        S += `\n            <{S=绑定回城石;X=50;Y=330}/@绑定回城石(${配置.绑定回城石})>`
    }

    Npc.SayEx(Player, '传送', S)
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
            str += `{S=${副本.显示名};FS=11;C=103;X=80;Y=${y}}<{M=304,304,304;F=新UI素材文件.data;X=28;Y=${y - 12};HINT=${hint}}/@固定传送(${地图名},${下标})>`;
        } else {
            str += `<&{S=副本加载中...;FS=11;C=154;X=80;Y=${y}}/>`;
        }
    }

    //<{M=297,297,297;F=新UI素材文件.data;X=28;;HINT=${hint}

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
            str += `{S=${副本.显示名};FS=11;C=250;X=80;Y=${y}}<{M=304,304,304;F=新UI素材文件.data;X=28;Y=${y - 12};HINT=${hint}}/@圣耀副本传送(${下标})>`;
        } else {
            str += `{S=创建圣耀副本;FS=11;C=154;X=80;Y=${y}}<{M=304,304,304;F=新UI素材文件.data;X=28;Y=${y - 12};HINT=点击创建圣耀副本}/@创建圣耀副本(${地图名})>`;
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
    // if (Player.V.地图成就 + 1 < 地图配置.固定星级) {
    //     Player.MessageBox(`您的地图成就不足，无法进入${地图名}。`);
    //     return;
    // }
    Player.RandomMove(地图.取地图ID(下标))

}


// ==================== 圣耀副本传送 ====================
/**
 * 创建圣耀副本入口
 */
export function 创建圣耀副本(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 地图名 = Args.Str[0];
    if (Player.R.圣耀地图爆率加成 < 100) {
        Player.MessageBox(`请先设置圣耀地图倍数!!!`)
        return
    }

    // 检查玩家是否设置了圣耀地图爆率加成
    if (!Player.R.圣耀地图爆率加成 || Player.R.圣耀地图爆率加成 < 1) {
        Player.R.圣耀地图爆率加成 = 1
    }

    const 需要主神点 = Player.R.圣耀地图爆率加成 * 圣耀比例
    if (Player.GamePoint < 需要主神点) {
        Player.MessageBox(`主神点不足，需要 ${需要主神点} 主神点`)
        return
    }

    Player.GamePoint -= 需要主神点

    地图.创建圣耀副本(地图名, Player)
}

/**
 * 设置圣耀倍率
 */
export function InPutString11(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 倍率 = Args.Int[0];
    const 最大倍率 = Args.Int[1] || 1000;

    if (倍率 < 100 || 倍率 > 最大倍率) {
        Player.MessageBox(`请输入100-${最大倍率}之间的倍率`)
        return
    }
    Player.R.圣耀地图爆率加成 = 倍率
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
