/**
 * 基因系统模块
 * 
 * 功能：
 * - 基因介绍与选择（只能选择一个）
 * - 基因重置
 * 
 * 基因类型：
 * - 狂化：暴击几率提高20%，暴击伤害提高500%
 * - 迅疾：攻击无视防御20%，攻击伤害提高200%
 * - 甲壳：防御力提高30%，血量提高50%
 * - 融合：回收倍率提高50%，血量提高50%
 * - 念力：爆率提高20%，主属性提高10%
 * - 协作：极品率提高10%，主属性提高10%
 */

import { 装备属性统计 } from "../_装备/属性统计"

// 基因数据配置
const 基因数据 = {
    狂化: {
        图标: 306,
        描述: '暴击几率提高20%,暴击伤害提高500%',
        效果: { 暴击几率: 20, 暴击伤害: 500 }
    },
    迅疾: {
        图标: 307,
        描述: '攻击无视防御20%,攻击伤害提高200%',
        效果: { 无视防御: 20, 攻击伤害: 200 }
    },
    甲壳: {
        图标: 309,
        描述: '防御力提高30%,血量提高50%',
        效果: { 防御提高: 30, 血量提高: 50 }
    },
    融合: {
        图标: 310,
        描述: '回收倍率提高50%,血量提高50%',
        效果: { 回收倍率: 50, 血量提高: 50 }
    },
    念力: {
        图标: 305,
        描述: '爆率提高20%,主属性提高10%',
        效果: { 爆率提高: 20, 主属性提高: 10 }
    },
    协作: {
        图标: 310,
        描述: '极品率提高10%,主属性提高10%',
        效果: { 极品率提高: 10, 主属性提高: 10 }
    }
}

// 主界面 - 显示基因介绍与选择
export function Main(Npc: TNormNpc, Player: TPlayObject, _Args: TArgs): void {
    显示基因界面(Npc, Player)
}

// 显示基因界面（介绍+选择）
function 显示基因界面(Npc: TNormNpc, Player: TPlayObject): void {
    const 当前基因 = Player.V.基因 || ''
    const 基因显示 = 当前基因 ? 当前基因 : '未选择'
    const 基因介绍 = '基因等级会提高最终所造成的伤害倍数计算公式为：最终伤害 * 2的基因等级次方'

    let 基因列表 = ''
    const Y基准 = 60
    let 索引 = 0

    for (const [基因名, 数据] of Object.entries(基因数据)) {
        const Y位置 = Y基准 + 索引 * 40
        const 已选择 = 当前基因 === 基因名
        const 颜色 = 已选择 ? 249 : 251
        const 状态文字 = 已选择 ? '[已选择]' : '[选择此项]'
        const 状态颜色 = 已选择 ? 249 : 250
        基因列表 += `{i=${数据.图标};f=新UI素材文件.data;X=10;Y=${Y位置}}  {S=${基因名};X=60;Y=${Y位置};C=${颜色};FS=13}  {S=${数据.描述};X=110;Y=${Y位置};H=5;W=200;C=253}  <{S=${状态文字};X=380;Y=${Y位置};C=${状态颜色}}/@基因.选择基因(${基因名})>\\\\`
        索引++
    }

    const S = `
                              基因系统\\\\\\
    {S=当前已选基因：${基因显示};C=249;X=10;Y=30}  {S=(只能选择一个);C=253;X=150;Y=30}\
    {S=基因介绍：;C=150;X=10;Y=300}{S=基因等级会提高最终所造成的伤害倍数;0X=10;Y=300;C=154;}
    {S=计算公式：;C=150;X=10;Y=320}{S=技能伤害 * 技能魔次 * 2的基因等级次方;0X=10;Y=320;C=154;}
    {S=举例：;C=150;X=10;Y=340}{S=技能伤害1000,技能魔次10,基因等级10,则最终伤害为1000*10*2^10=10240000;0X=10;Y=340;C=154;}
${基因列表}\\\\
                                     <{S=基因重置;C=253;X=390;Y=320;HINT=需要1000元宝}/@基因.重置基因确认>

    `
    Npc.SayEx(Player, 'NPC大窗口', S);
}

// 选择基因（只能选择一个）
export function 选择基因(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 基因名 = Args.Str[0]

    if (!基因数据[基因名 as keyof typeof 基因数据]) {
        Player.MessageBox('无效的基因类型!')
        return
    }

    const 当前基因 = Player.V.基因 || ''

    // 如果已选择同一个基因，不做任何操作
    if (当前基因 === 基因名) {
        Player.SendMessage(`你已经选择了基因：${基因名}`)
        显示基因界面(Npc, Player)
        return
    }

    // 如果已有其他基因，提示需要先重置
    if (当前基因 && 当前基因 !== 基因名) {
        Player.MessageBox(`你已选择基因【${当前基因}】，如需更换请先重置！`)
        显示基因界面(Npc, Player)
        return
    }

    // 选择新基因
    Player.V.基因 = 基因名
    Player.SendMessage(`已选择基因：${基因名}`)

    // 更新基因阶数
    更新基因阶数(Player)

    // 重新统计属性
    装备属性统计(Player)

    // 刷新界面
    显示基因界面(Npc, Player)
}

// 重置基因确认
export function 重置基因确认(Npc: TNormNpc, Player: TPlayObject, _Args: TArgs): void {
    const 当前基因 = Player.V.基因 || ''

    if (!当前基因) {
        Player.MessageBox('你还未选择任何基因,无需重置!')
        return
    }

    if (Player.GetGameGold() < 1000) {
        Player.MessageBox('元宝不足1000,重置失败!')
        return
    }

    Player.Question(
        `确定要重置基因吗？\\\\当前基因：【${当前基因}】\\\\重置需要消耗1000元宝！`,
        '基因.确认重置基因',
        '基因.Main'
    )
}

// 确认重置基因
export function 确认重置基因(Npc: TNormNpc, Player: TPlayObject, _Args: TArgs): void {
    if (Player.GetGameGold() < 1000) {
        Player.MessageBox('元宝不足1000,重置失败!')
        return
    }

    const 当前基因 = Player.V.基因 || ''
    if (!当前基因) {
        Player.MessageBox('你还未选择任何基因,无需重置!')
        return
    }

    // 扣除元宝
    Player.SetGameGold(Player.GetGameGold() - 1000)
    Player.GoldChanged()

    // 清空基因
    Player.V.基因 = ''

    // 重置基因阶数
    Player.R.狂化阶数 = 0
    Player.R.迅疾阶数 = 0
    Player.R.甲壳阶数 = 0
    Player.R.融合阶数 = 0
    Player.R.念力阶数 = 0
    Player.R.协作阶数 = 0

    Player.SendMessage('基因已重置,可以重新选择!')

    // 重新统计属性
    装备属性统计(Player)

    // 返回主界面
    显示基因界面(Npc, Player)
}

// 更新基因阶数（根据选择的基因更新对应阶数）
function 更新基因阶数(Player: TPlayObject): void {
    const 当前基因 = Player.V.基因 || ''

    // 重置所有阶数
    Player.R.狂化阶数 = 0
    Player.R.迅疾阶数 = 0
    Player.R.甲壳阶数 = 0
    Player.R.融合阶数 = 0
    Player.R.念力阶数 = 0
    Player.R.协作阶数 = 0

    // 根据选择的基因设置阶数为1
    switch (当前基因) {
        case '狂化':
            Player.R.狂化阶数 = 1
            break
        case '迅疾':
            Player.R.迅疾阶数 = 1
            break
        case '甲壳':
            Player.R.甲壳阶数 = 1
            break
        case '融合':
            Player.R.融合阶数 = 1
            break
        case '念力':
            Player.R.念力阶数 = 1
            break
        case '协作':
            Player.R.协作阶数 = 1
            break
    }
}
