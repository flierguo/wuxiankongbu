import { 实时回血 } from "../../大数值版本/字符计算"
import { 装备属性统计 } from "../../大数值版本/装备属性统计"
import { 特效 } from "../[玩家]/_P_Base"
import { 装备特效 } from "../[装备]/_ITEM_Base"

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    实时回血(Player, Player.GetSVar(92))
    const S = `\\\\\\\\\\
        {S=勇士,你已经达到了最佳状态值了,请问还需要其他服务吗?;C=250}\\\\
        {S=[改变性别];C=242}  <男/@性别男>    <女/@性别女>      {S=[清洗红名];C=249}  <{S=我要清洗;HINT=需要10点礼卷}/@清洗红名>\\\\
        {s=[行会管理];c=253}  <[比奇皇宫]/@比奇皇宫>    {S=[货币兑换];C=243}  <{S=货币兑换;HINT=目前为${GameLib.V.判断新区 == false ? 2 : 1}倍兑换}/@货币兑换>\\\\
        {S=[任务转职];C=254}  <{S=付费转职;HINT=需要消耗5000元宝}/@转职>      [摧毁物品]  <销毁物品/@@Question(摧毁的装备将无法恢复请谨慎使用!,@销毁物品,1)>\\\\

    `
    Npc.SayEx(Player, 'NPC小窗口中下1框', S)
    // {S=[装备幻化];C=154}  <类别幻化/@类别置换>
}
const 幻化 = [
    { 装备职业: 98, },
]

export function 类别置换(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 装备 = Player.GetCustomItem(0)
    const S = `\\\\\\\\
    {S=武器和衣服可以进行幻化;C=250}\\\\
    {S=例如:神射手职业打到了一个乌木剑,可以幻化成对应等级的弓箭;C=251}\\\\
    {S=幻化一次费用100礼卷,请把幻化换的衣服或武器放入下面框;C=191}\\\\
    {S=装备只能幻化一次;C=154}\\\\
    $武器1$\\
    $武器2$\\
    $武器3$
    `
    let M = S

    if (装备 && (装备.StdMode == 5 || 装备.StdMode == 6)) {
        switch (装备.Job) {
            case 3:
                M = ReplaceStr(M, '$武器1$', '<{S=幻化战法道通用武器;HTIN;战法道通用武器:#92战神,骑士,火神,冰法,驯兽师,牧师均可通用}/@置换武器(乌木剑)>')
                M = ReplaceStr(M, '$武器2$', '<{S=幻化猎人通用武器;HTIN;猎人通用武器:#92驯兽师,猎人均可通用/@置换武器(桃木弓)>')
                M = ReplaceStr(M, '$武器3$', '<{S=幻化武僧通用武器;HTIN;武僧通用武器:#92武僧,罗汉均可通用/@置换武器(浑铁)>')
                break
            case 4:
                M = ReplaceStr(M, '$武器1$', '<{S=幻化战法道通用武器;HTIN;战法道通用武器:#92战神,骑士,火神,冰法,驯兽师,牧师均可通用}/@置换武器(乌木剑)>')
                M = ReplaceStr(M, '$武器2$', '<{S=幻化刺客,鬼舞者通用武器;HTIN;刺客通用武器:#92刺客,鬼舞者均可通用/@置换武器(柴刀)>')
                M = ReplaceStr(M, '$武器3$', '<{S=幻化武僧通用武器;HTIN;武僧通用武器:#92武僧,罗汉均可通用/@置换武器(浑铁)>')
                break
            case 5:
                M = ReplaceStr(M, '$武器1$', '<{S=幻化战法道通用武器;HTIN;战法道通用武器:#92战神,骑士,火神,冰法,驯兽师,牧师均可通用}/@置换武器(乌木剑)>')
                M = ReplaceStr(M, '$武器2$', '<{S=幻化刺客,鬼舞者通用武器;HTIN;刺客通用武器:#92刺客,鬼舞者均可通用/@置换武器(柴刀)>')
                M = ReplaceStr(M, '$武器3$', '<{S=幻化猎人通用武器;HTIN;猎人通用武器:#92驯兽师,猎人均可通用/@置换武器(桃木弓)>')
                break
            case 98:
                M = ReplaceStr(M, '$武器1$', '<{S=幻化刺客,鬼舞者通用武器;HTIN;刺客通用武器:#92刺客,鬼舞者均可通用/@置换武器(柴刀)>')
                M = ReplaceStr(M, '$武器2$', '<{S=幻化猎人通用武器;HTIN;猎人通用武器:#92驯兽师,猎人均可通用/@置换武器(桃木弓)>')
                M = ReplaceStr(M, '$武器3$', '<{S=幻化武僧通用武器;HTIN;武僧通用武器:#92武僧,罗汉均可通用/@置换武器(浑铁)>')
                break
        }
    } else if (装备 && 装备.StdMode == 10) {
        M = ReplaceStr(M, '$武器1$', '<幻化全职业通用男衣服/@置换男>')
        M = ReplaceStr(M, '$武器2$', '')
        M = ReplaceStr(M, '$武器3$', '')
    } else if (装备 && 装备.StdMode == 11) {
        M = ReplaceStr(M, '$武器1$', '<幻化全职业通用女衣服/@置换女>')
        M = ReplaceStr(M, '$武器2$', '')
        M = ReplaceStr(M, '$武器3$', '')
    } else {
        M = ReplaceStr(M, '$武器1$', '请放入武器或衣服')
        M = ReplaceStr(M, '$武器2$', '')
        M = ReplaceStr(M, '$武器3$', '')
    }
    Npc.SayEx(Player, 'NPC小窗口中下1框返回', M)
}
export function 置换武器(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 装备 = Player.GetCustomItem(0)
    let 武器 = Args.Str[0]
    let item: TUserItem
    if (装备 == null || (装备.StdMode != 5 && 装备.StdMode != 6 && 装备.StdMode != 10 && 装备.StdMode != 11)) { Player.MessageBox('请放入武器或衣服再进行幻化'); return }
    if (装备.DisplayName.includes('幻化')) { Player.MessageBox('一件装备只能幻化一次!'); return }
    if (Player.GetGamePoint() < 100) { Player.MessageBox(`礼卷不足100,无法幻化`); return }
    item = Player.GiveItem(武器)
    if (item) {
        for (let a = 0; a < 41; a++) {
            item.SetOutWay1(a, 装备.GetOutWay1(a))
            item.SetOutWay2(a, 装备.GetOutWay2(a))
            item.SetOutWay3(a, 装备.GetOutWay3(a))
        }
        item.SetNeedLevel(装备.GetNeedLevel())
        item.SetColor(装备.GetColor())
        item.Rename(`{S=[幻化.${武器}];C=7}` + 装备.DisplayName)
        item.SetBind(true)
        item.SetNeverDrop(true)
        item.State.SetNoDrop(true)
        Player.UpdateItem(item)
        // Npc.Take(Player, 装备.GetName())
        Player.DeleteItem(装备)
        Player.SetGamePoint(Player.GetGamePoint() - 100)
        Player.GoldChanged()
        Player.MessageBox('幻化完毕,请查看!')
    }
}
export function 置换男(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 装备 = Player.GetCustomItem(0)
    let item: TUserItem
    if (装备 == null || 装备.StdMode != 10) { Player.MessageBox('请放入男衣服再进行幻化'); return }
    if (装备.DisplayName.includes('幻化')) { Player.MessageBox('一件装备只能幻化一次!'); return }
    if (Player.GetGamePoint() < 100) { Player.MessageBox(`礼卷不足100,无法幻化`); return }
    item = Player.GiveItem('布衣(男)')
    if (item) {
        for (let a = 0; a < 41; a++) {
            item.SetOutWay1(a, 装备.GetOutWay1(a))
            item.SetOutWay2(a, 装备.GetOutWay2(a))
            item.SetOutWay3(a, 装备.GetOutWay3(a))
        }
        item.SetNeedLevel(装备.GetNeedLevel())
        item.SetColor(装备.GetColor())
        item.Rename(`{S=[幻化.布衣(男)];C=7}` + 装备.DisplayName)
        item.SetBind(true)
        item.SetNeverDrop(true)
        item.State.SetNoDrop(true)
        Player.UpdateItem(item)
        // Npc.Take(Player, 装备.GetName())
        Player.DeleteItem(装备)
        Player.SetGamePoint(Player.GetGamePoint() - 100)
        Player.GoldChanged()
        Player.MessageBox('幻化完毕,请查看!')
    }
}
export function 置换女(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 装备 = Player.GetCustomItem(0)
    let item: TUserItem
    if (装备 == null || 装备.StdMode != 11) { Player.MessageBox('请放入女衣服再进行幻化'); return }
    if (装备.DisplayName.includes('幻化')) { Player.MessageBox('一件装备只能幻化一次!'); return }
    if (Player.GetGamePoint() < 100) { Player.MessageBox(`礼卷不足100,无法幻化`); return }
    item = Player.GiveItem('布衣(女)')
    if (item) {
        for (let a = 0; a < 41; a++) {
            item.SetOutWay1(a, 装备.GetOutWay1(a))
            item.SetOutWay2(a, 装备.GetOutWay2(a))
            item.SetOutWay3(a, 装备.GetOutWay3(a))
        }
        item.SetNeedLevel(装备.GetNeedLevel())
        item.SetColor(装备.GetColor())
        item.Rename(`{S=[幻化.布衣(女)];C=7}` + 装备.DisplayName)
        item.SetBind(true)
        item.SetNeverDrop(true)
        item.State.SetNoDrop(true)
        Player.UpdateItem(item)
        // Npc.Take(Player, 装备.GetName())
        Player.DeleteItem(装备)
        Player.SetGamePoint(Player.GetGamePoint() - 100)
        Player.GoldChanged()
        Player.MessageBox('幻化完毕,请查看!')
    }
}

export function 性别男(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.SetGender(0)
    Player.SendMessage('你已经变成一位帅哥了!', 1)
    Main(Npc, Player, Args)
}
export function 性别女(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.GetJob() == 5) { Player.MessageBox('和尚怎么变性?你要还俗吗?'); return }
    Player.SetGender(1)
    Player.SendMessage('你已经变成一位美女了!', 1)
    Main(Npc, Player, Args)
}
export function 清洗红名(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.GetGamePoint() < 10) { Player.SendMessage('礼卷不足10点,无法清洗红名!'); return }
    Player.SetPkPoint(0)
    Player.SetGamePoint(Player.GetGamePoint() - 10)
    Player.GoldChanged()
    Player.MessageBox('清洗完毕,请不要在杀人了哟!')
    Main(Npc, Player, Args)
}
export function 付费转职(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.MessageBox('请联系管理员转职!')
    Main(Npc, Player, Args)
}

export function 销毁物品(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 装备 = Player.GetCustomItem(0)
    if (装备 == null) { Player.MessageBox('请将要摧毁的物品放入下放框内,摧毁后将无法恢复!'); return }
    Player.DeleteItem(装备)
    Player.SendMessage('摧毁完毕!')
}

export function 比奇皇宫(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.MapMove('比奇皇宫', 39, 34)
}

export function 货币兑换(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 服务器类型 = GameLib.ServerName.includes('包区') || GameLib.V.判断新区 ? '老区' : '新区'
    const 今日兑换礼卷 = Player.V.今日兑换礼卷 || 0
    const 元宝兑换比例 = 1200
    const 礼卷兑换比例 = 120
    const 反向兑换比例 = 100

    
    const S = `\\\\
        {S=当前服务器: ${服务器类型};C=253;X=25;Y=38}\\{S=货币兑换中心;C=254;X=185;Y=38}        {S=今日已兑换礼卷: ${今日兑换礼卷}/1000000;C=249;X=290;Y=38}\\

        {S=当前金币:${Player.GetGold()};C=227;X=25}          {S=当前元宝:${Player.GetGameGold()};C=227}          {S=当前礼卷:${Player.GetGamePoint()};C=227}\\\\
        
        <{S=兑换100   元宝;HINT=需要${元宝兑换比例 * 100}金币;X=30;Y=95}/@执行金币兑换(100)>
        <{S=兑换500   元宝;HINT=需要${元宝兑换比例 * 500}金币;X=30;Y=125}/@执行金币兑换(500)>
        <{S=兑换1000  元宝;HINT=需要${元宝兑换比例 * 1000}金币;X=30;Y=155}/@执行金币兑换(1000)>
        <{S=兑换5000  元宝;HINT=需要${元宝兑换比例 * 5000}金币;X=30;Y=185}/@执行金币兑换(5000)>
        <{S=兑换10000 元宝;HINT=需要${元宝兑换比例 * 10000}金币;X=30;Y=215}/@执行金币兑换(10000)>
        <{S=兑换100000元宝;HINT=需要${元宝兑换比例 * 100000}金币;X=30;Y=245}/@执行金币兑换(100000)>

        <{S=兑换10    礼卷;HINT=需要${礼卷兑换比例 * 10}元宝;X=185;Y=95}/@开始兑换礼卷(10)>
        <{S=兑换100   礼卷;HINT=需要${礼卷兑换比例 * 100}元宝;X=185;Y=125}/@开始兑换礼卷(100)>
        <{S=兑换500   礼卷;HINT=需要${礼卷兑换比例 * 500}元宝;X=185;Y=155}/@开始兑换礼卷(500)>
        <{S=兑换1000  礼卷;HINT=需要${礼卷兑换比例 * 1000}元宝;X=185;Y=185}/@开始兑换礼卷(1000)>
        <{S=兑换5000  礼卷;HINT=需要${礼卷兑换比例 * 5000}元宝;X=185;Y=215}/@开始兑换礼卷(5000)>
        <{S=兑换50000 礼卷;HINT=需要${礼卷兑换比例 * 50000}元宝;X=185;Y=245}/@开始兑换礼卷(50000)>

        <{S=兑换${反向兑换比例 * 10}     元宝;HINT=需要10礼卷;X=330;Y=95}/@反向兑换(10)>
        <{S=兑换${反向兑换比例 * 100}    元宝;HINT=需要100礼卷;X=330;Y=125}/@反向兑换(100)>
        <{S=兑换${反向兑换比例 * 1000}   元宝;HINT=需要1000礼卷;X=330;Y=155}/@反向兑换(1000)>
        <{S=兑换${反向兑换比例 * 10000}  元宝;HINT=需要10000礼卷;X=330;Y=185}/@反向兑换(10000)>
        <{S=兑换${反向兑换比例 * 100000} 元宝;HINT=需要100000礼卷;X=330;Y=215}/@反向兑换(100000)>
        <{S=兑换${反向兑换比例 * 1000000}元宝;HINT=需要1000000礼卷;X=330;Y=245}/@反向兑换(1000000)>

        {S=兑换说明: 「${元宝兑换比例}金币 = 1元宝」 「${礼卷兑换比例}元宝 = 1礼卷」 「1礼卷 = ${反向兑换比例}元宝」;C=249;X=25;Y=275}
        {S=注意:金币超过20E会自动兑换为160W元宝(老区为120W,专区为200W);C=249;X=25;Y=300}

        `

    Npc.SayEx(Player, 'NPC中窗口', S)
}

export function 执行金币兑换(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 兑换数量 = Args.Int[0]

    // 根据服务器类型确定兑换比例
    const 兑换比例 = 1200


    // 计算所需金币
    const 所需金币 = 兑换数量 * 兑换比例

    // 检查金币是否足够
    if (Player.GetGold() < 所需金币) {
        Player.MessageBox(`金币不足！需要${所需金币}金币，你只有${Player.GetGold()}金币`)
        return
    }

    // 执行兑换
    Player.SetGold(Player.GetGold() - 所需金币)
    Player.SetGameGold(Player.GetGameGold() + 兑换数量)
    Player.GoldChanged()
    Player.SendMessage(`使用{S=${所需金币}金币;C=154}成功兑换了{S=${兑换数量}元宝;C=154}`, 1)
    Player.MessageBox(`兑换成功！获得${兑换数量}元宝`)
    货币兑换(Npc, Player, Args)
}

export function 开始兑换礼卷(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 兑换数量 = Args.Int[0]
    // 根据服务器类型确定兑换比例
    const 兑换比例 = 120

    const 今日兑换礼卷 = Player.V.今日兑换礼卷 || 0

    // 检查每日限额
    // if (今日兑换礼卷 + 兑换数量 > 1000000) {
    //     Player.MessageBox(`超出每日兑换限额！还可兑换${1000000 - 今日兑换礼卷}礼卷`)
    //     return
    // }
    // 计算所需金币
    const 所需元宝 = 兑换数量 * 兑换比例

    // if (Player.GetGamePoint() < 兑换数量) { Player.MessageBox(`礼卷不足${兑换数量},兑换失败!`); return }
    if (Player.GetGameGold() < 所需元宝) { Player.MessageBox(`元宝不足${所需元宝},兑换失败!`); return }
    Player.SetGamePoint(Player.GetGamePoint() + 兑换数量)   // 兑换礼卷
    Player.SetGameGold(Player.GetGameGold() - 所需元宝)
    Player.V.今日兑换礼卷 = 今日兑换礼卷 + 兑换数量
    Player.GoldChanged()
    Player.SendMessage(`使用{S=${所需元宝}元宝;C=154}成功兑换了{S=${兑换数量}点礼卷;C=154}`, 1)
    Player.MessageBox(`兑换成功！获得${兑换数量}点礼卷`)
    货币兑换(Npc, Player, Args)
}

export function 反向兑换(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 兑换数量 = Args.Int[0]

    // 根据服务器类型确定兑换比例
    const 兑换比例 = 100

    // 计算所需元宝
    const 兑换元宝 = 兑换数量 * 兑换比例

    // 检查元宝是否足够
    if (Player.GetGamePoint() < 兑换数量) {
        Player.MessageBox(`礼卷不足！需要${兑换数量}礼卷，你只有${Player.GetGamePoint()}礼卷`)
        return
    }

    // 执行兑换
    Player.SetGameGold(Player.GetGameGold() + 兑换元宝)
    Player.SetGamePoint(Player.GetGamePoint() - 兑换数量)

    Player.GoldChanged()
    Player.SendMessage(`使用{S=${兑换数量}礼;C=154}成功兑换了{S=${兑换元宝}元宝;C=154}`, 1)
    Player.MessageBox(`兑换成功！获得${兑换元宝}元宝`)
    货币兑换(Npc, Player, Args)
}

export function 转职(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //格式：玩家名字-职业  转职
    if (Player.GetGameGold() < 5000) { Player.SendMessage('元宝不足5000,无法转职!'); return }
    Player.SetGameGold(Player.GetGameGold() - 5000)
    Player.GoldChanged()

    Player.V.战神 = false
    Player.V.骑士 = false
    Player.V.火神 = false
    Player.V.冰法 = false
    Player.V.驯兽师 = false
    Player.V.牧师 = false
    Player.V.神射手 = false
    Player.V.猎人 = false
    Player.V.刺客 = false
    Player.V.鬼舞者 = false
    Player.V.武僧 = false
    Player.V.罗汉 = false
    Player.V.轮回次数 = 0
    Player.V.战神觉醒 = false
    Player.V.战神强化等级 = 0
    Player.V.战神学习基础 = false
    Player.V.战神学习高级 = false
    Player.V.罗汉宝宝进化 = false
    Player.ClearSkill()
    Player.RecalcAbilitys()
    Player.MapMove('边界村', 69, 119)
    装备属性统计(Player, undefined, undefined, undefined);
    // a.Kick()

}