import { 实时回血 } from "../字符计算"
import { 装备属性统计 } from "../_装备/属性统计"
import { 特效 } from "../基础常量"


export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    实时回血(Player, Player.GetSVar(92))
    const S = `\\\\\\\\\\
        {S=勇士,你已经达到了最佳状态值了,请问还需要其他服务吗?;C=250}\\\\
        {S=[改变性别];C=242}  <男/@性别男>    <女/@性别女>      {S=[清洗红名];C=249}  <{S=我要清洗;HINT=需要10点礼卷}/@清洗红名>\\\\
        {S=[货币兑换];C=243}  <{S=货币兑换;}/@货币兑换>      [摧毁物品]  <销毁物品/@@Question(摧毁的装备将无法恢复请谨慎使用!,@销毁物品,1)>\\\\\\
                  {S=[神器回收];C=254}      <{S=神器回收;HINT=点击这里可回收主神点数#92每天最多可回收 1000 点#92今日已回收 ${Player.V.今日神器回收} 点;C=22}/@神器回收>      \\\\

    `
    Npc.SayEx(Player, '综合功能带框', S)
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
    Npc.SayEx(Player, '综合功能带框', M)
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

export function 神器回收(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 装备 = Player.GetCustomItem(0)
    if (装备 == null) { Player.MessageBox('请将要回收的神器放入下方框内!'); return }
    
    // 检查是否为神器
    const 是否神器 = 装备.DisplayName?.includes('[神器]') || false
    if (!是否神器) {
        Player.MessageBox('这不是神器,无法回收!')
        return
    }
    
    // 解析神器倍数
    const match = 装备.DisplayName?.match(/\[神器\](\d+)倍/)
    const 神器倍数 = match ? parseInt(match[1]) : 0
    
    if (神器倍数 <= 0) {
        Player.MessageBox('神器倍数异常,无法回收!')
        return
    }
    
    // 初始化每日回收记录
    Player.V.今日神器回收 ??= 0
    
    // 检查每日上限
    const 今日已回收 = Player.V.今日神器回收 || 0
    if (今日已回收 >= 1000) {
        Player.MessageBox('今日神器回收已达上限(1000点),请明天再来!')
        return
    }
    
    // 计算本次可回收的点数
    let 实际回收点数 = 神器倍数
    if (今日已回收 + 神器倍数 > 1000) {
        实际回收点数 = 1000 - 今日已回收
        Player.MessageBox(`本次只能回收${实际回收点数}点(今日剩余额度),神器将被完全摧毁!`)
    }
    
    // 回收神器,获得GamePoint
    Player.SetGamePoint(Player.GetGamePoint() + 实际回收点数)
    Player.V.今日神器回收 = 今日已回收 + 实际回收点数
    Player.DeleteItem(装备)
    Player.GoldChanged()
    Player.SendMessage(`成功回收神器,获得${实际回收点数}点主神点数! 今日已回收:${Player.V.今日神器回收}/1000`, 1)
}


export function 比奇皇宫(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.MapMove('比奇皇宫', 39, 34)
}

export function 货币兑换(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 元宝兑换比例 = 1200
    const 礼卷兑换比例 = 120
    const 反向兑换比例 = 100

    const S = `\\\\
        {S=货币兑换中心;C=254;X=150;Y=5}\\\\

        {S=当前金币:${Player.GetGold()};C=227;X=30;Y=30}  {S=当前元宝:${Player.GetGameGold()};C=227;X=160;Y=30}  {S=当前主神点:${Player.GetGamePoint()};C=227;X=280;Y=30}\\\\
        
        <{S=金币兑换元宝;HINT=比例: ${元宝兑换比例}金币 = 1元宝;X=30;Y=60}/@@InPutString01(请输入要兑换的元宝数量,金币兑换)>
        <{S=元宝兑换主神点;HINT=比例: ${礼卷兑换比例}元宝 = 1主神点;X=160;Y=60}/@@InPutString01(请输入要兑换的主神点数量,元宝兑换)>
        <{S=主神点兑换元宝;HINT=比例: 1主神点 = ${反向兑换比例}元宝 (含手续费);X=30;Y=100}/@@InPutString01(请输入要兑换的主神点数量,反向兑换)>

        {S=兑换说明:;C=249;X=25;Y=150}
        {S=1. 金币→元宝: ${元宝兑换比例}金币 = 1元宝;C=250;X=25;Y=175}
        {S=2. 元宝→主神点: ${礼卷兑换比例}元宝 = 1主神点;C=250;X=25;Y=200}
        {S=3. 主神点→元宝: 1主神点 = ${反向兑换比例}元宝 (含手续费);C=250;X=25;Y=225}

        `

    Npc.SayEx(Player, 'NPC小窗口', S)
}

// 金币兑换元宝处理函数
export function InPutString01(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // Args.Str[0] = 提示文字
    // Args.Str[1] = 兑换类型 (金币兑换/元宝兑换/反向兑换)
    // Args.Str[2] = 玩家输入的数量
    
    const 兑换类型 = Args.Str[0]
    const 输入数量 = parseInt(Args.Str[1])

    // 验证输入
    if (isNaN(输入数量) || 输入数量 <= 0) {
        Player.MessageBox('请输入有效的数量！')
        货币兑换(Npc, Player, Args)
        return
    }

    // 根据兑换类型执行不同的兑换逻辑
    if (兑换类型 === '金币兑换') {
        执行金币兑换元宝(Npc, Player, 输入数量)
    } else if (兑换类型 === '元宝兑换') {
        执行元宝兑换主神点(Npc, Player, 输入数量)
    } else if (兑换类型 === '反向兑换') {
        执行主神点兑换元宝(Npc, Player, 输入数量)
    }
}

// 金币兑换元宝
function 执行金币兑换元宝(Npc: TNormNpc, Player: TPlayObject, 兑换数量: number): void {
    const 兑换比例 = 1200
    const 所需金币 = 兑换数量 * 兑换比例

    if (Player.GetGold() < 所需金币) {
        Player.MessageBox(`金币不足！需要${所需金币}金币，你只有${Player.GetGold()}金币`)
        货币兑换(Npc, Player, {} as TArgs)
        return
    }

    Player.SetGold(Player.GetGold() - 所需金币)
    Player.SetGameGold(Player.GetGameGold() + 兑换数量)
    Player.GoldChanged()
    Player.SendMessage(`使用{S=${所需金币}金币;C=154}成功兑换了{S=${兑换数量}元宝;C=154}`, 1)
    Player.MessageBox(`兑换成功！获得${兑换数量}元宝`)
    货币兑换(Npc, Player, {} as TArgs)
}

// 元宝兑换主神点
function 执行元宝兑换主神点(Npc: TNormNpc, Player: TPlayObject, 兑换数量: number): void {
    const 兑换比例 = 120
    const 所需元宝 = 兑换数量 * 兑换比例

    if (Player.GetGameGold() < 所需元宝) {
        Player.MessageBox(`元宝不足！需要${所需元宝}元宝，你只有${Player.GetGameGold()}元宝`)
        货币兑换(Npc, Player, {} as TArgs)
        return
    }

    Player.SetGamePoint(Player.GetGamePoint() + 兑换数量)
    Player.SetGameGold(Player.GetGameGold() - 所需元宝)
    Player.V.今日兑换礼卷 = (Player.V.今日兑换礼卷 || 0) + 兑换数量
    Player.GoldChanged()
    Player.SendMessage(`使用{S=${所需元宝}元宝;C=154}成功兑换了{S=${兑换数量}点主神点;C=154}`, 1)
    Player.MessageBox(`兑换成功！获得${兑换数量}点主神点`)
    货币兑换(Npc, Player, {} as TArgs)
}

// 主神点兑换元宝（反向兑换，含手续费）
function 执行主神点兑换元宝(Npc: TNormNpc, Player: TPlayObject, 兑换数量: number): void {
    const 兑换比例 = 100
    const 兑换元宝 = 兑换数量 * 兑换比例

    if (Player.GetGamePoint() < 兑换数量) {
        Player.MessageBox(`主神点不足！需要${兑换数量}主神点，你只有${Player.GetGamePoint()}主神点`)
        货币兑换(Npc, Player, {} as TArgs)
        return
    }

    Player.SetGameGold(Player.GetGameGold() + 兑换元宝)
    Player.SetGamePoint(Player.GetGamePoint() - 兑换数量)
    Player.GoldChanged()
    Player.SendMessage(`使用{S=${兑换数量}主神点;C=154}成功兑换了{S=${兑换元宝}元宝;C=154}`, 1)
    Player.MessageBox(`兑换成功！获得${兑换元宝}元宝`)
    货币兑换(Npc, Player, {} as TArgs)
}

