/**
 * 经验勋章系统
 * 
 * 功能说明：
 * 1. 购买经验勋章：花费200元宝，获得『1级』经验勋章，经验百分比+100
 * 2. 升级勋章：消耗 当前等级*100 个经验碎片，每升一级经验百分比+100
 * 3. 购买经验碎片：100元宝/个，弹窗输入数量
 * 
 * 属性存储方式：
 * - OutWay1[1] = 经验百分比词条ID（131），用于客户端显示词条名
 * - OutWay3[1] = 勋章等级，用于读取等级
 * - OutWay2[1] = 属性值（等级*100），用于客户端显示数值
 * - CustomDesc = JSON格式属性数据，用于属性统计系统读取
 */

import { 基础属性第一条, 基础词条 } from '../基础常量'
import { 装备属性统计 } from '../_装备/属性统计'

// ==================== 工具函数 ====================
/** 生成勋章的JSON属性数据 */
function 生成勋章属性(等级: number): string {
    return JSON.stringify({
        职业属性_职业: [基础词条.经验百分比],
        职业属性_属性: [String(等级 * 100)]
    })
}

/** 更新勋章属性（OutWay + JSON） */
function 更新勋章属性(item: TUserItem, 等级: number): void {
    const 属性值 = 等级 * 100
    // OutWay1=词条ID，OutWay3=等级（用于读取），OutWay2=属性值（用于客户端显示）
    item.SetOutWay1(基础属性第一条, 基础词条.经验百分比)
    item.SetOutWay2(基础属性第一条, 属性值)
    item.SetOutWay3(基础属性第一条, 等级)
    // JSON用于属性统计系统读取
    item.SetCustomDesc(生成勋章属性(等级))
}

// ==================== 主界面 ====================
export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 勋章 = Player.GetCustomItem(0)
    let 当前等级 = 0
    let 当前经验加成 = 0
    let 升级消耗 = 0
    const 碎片数量 = Player.GetItemCount('经验碎片')

    if (勋章 && 勋章.GetName() === '经验勋章') {
        当前等级 = 勋章.GetOutWay3(基础属性第一条) || 1
        当前经验加成 = 当前等级 * 100
        升级消耗 = 当前等级 * 50
    }

    const S = `\\\\
        {S=经验勋章;C=254;X=140;Y=5}\\\\
        {S=当前元宝: ${Player.GetGameGold()};C=227;X=30;Y=30}  {S=经验碎片: ${碎片数量};C=227;X=200;Y=30}\\\\
        {S=勋章等级: ${当前等级 > 0 ? 当前等级 + '级' : '未拥有'};C=250;X=30;Y=55}  {S=经验加成: ${当前经验加成}%;C=250;X=200;Y=55}\\\\
        <{S=【购买勋章】;C=249;HINT=花费200元宝购买一个1级经验勋章#92经验百分比+100%;X=30;Y=90}/@@Question(确定花费200元宝购买经验勋章吗?,@购买勋章)>\\\\
        <{S=【升级勋章】;C=251;HINT=消耗经验碎片升级勋章#92需要放入勋章到下方框内#92升级消耗: ${升级消耗 > 0 ? 升级消耗 : '?'}个经验碎片;X=30;Y=120}/@@Question(确定消耗${升级消耗}个经验碎片升级勋章吗?,@升级勋章)>\\\\
        <{S=【购买碎片】;C=243;HINT=100元宝/个#92点击输入购买数量;X=30;Y=150}/@@InPutInteger01(请输入购买经验碎片数量:,购买碎片)>\\\\
        {S=说明:;C=154;X=30;Y=185}\\
        {S=1. 购买勋章: 200元宝;C=250;X=30;Y=205}\\
        {S=2. 升级消耗: 当前等级×50 个碎片;C=250;X=30;Y=225}\\
        {S=3. 碎片价格: 100元宝/个;C=250;X=30;Y=245}
    `
    Npc.SayEx(Player, '经验勋章', S)
}


// ==================== 购买勋章 ====================
export function 购买勋章(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 勋章 = Player.GetCustomItem(0)
    if (勋章 && 勋章.GetName() === '经验勋章') {
        Player.MessageBox('你已经拥有经验勋章了，请升级它！')
        return
    }

    if (Player.GetGameGold() < 200) {
        Player.MessageBox('元宝不足！需要200元宝')
        return
    }

    Player.SetGameGold(Player.GetGameGold() - 200)
    Player.GoldChanged()

    const item = Player.GiveItem('经验勋章')
    if (item) {
        更新勋章属性(item, 1)
        item.Rename('『1级』经验勋章')
        item.SetColor(251)
        item.SetBind(true)
        item.SetNeverDrop(true)
        item.State.SetNoDrop(true)
        Player.UpdateItem(item)
        Player.SendMessage('{S=恭喜获得『1级』经验勋章，经验百分比+100%！;C=251}', 1)
        装备属性统计(Player)
    }
    Main(Npc, Player, Args)
}

// ==================== 升级勋章 ====================
export function 升级勋章(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 勋章 = Player.GetCustomItem(0)
    if (!勋章 || 勋章.GetName() !== '经验勋章') {
        Player.MessageBox('请将经验勋章放入下方框内！')
        return
    }

    const 当前等级 = 勋章.GetOutWay3(基础属性第一条) || 1
    const 需要碎片 = 当前等级 * 50
    const 拥有碎片 = Player.GetItemCount('经验碎片')

    if (当前等级 >= 100) {
        Player.MessageBox('勋章已达到最高等级！')
        return
    }

    if (拥有碎片 < 需要碎片) {
        Player.MessageBox(`经验碎片不足！需要${需要碎片}个，你只有${拥有碎片}个`)
        return
    }

    Npc.Take(Player, '经验碎片', 需要碎片)

    const 新等级 = 当前等级 + 1
    更新勋章属性(勋章, 新等级)
    勋章.Rename(`『${新等级}级』经验勋章`)
    Player.UpdateItem(勋章)
    Player.SendMessage(`{S=勋章升级成功！当前${新等级}级，经验百分比+${新等级 * 100}%！;C=251}`, 1)
    装备属性统计(Player)
    Main(Npc, Player, Args)
}

// ==================== 购买碎片（输入框回调） ====================
export function InPutInteger01(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 类型 = Args.Str[0]
    const 数量 = Args.Int[1]

    if (类型 === '购买碎片') {
        购买碎片处理(Npc, Player, 数量)
    }
}

function 购买碎片处理(Npc: TNormNpc, Player: TPlayObject, 数量: number): void {
    if (isNaN(数量) || 数量 <= 0) {
        Player.MessageBox('请输入有效的数量！')
        return
    }

    const 总价 = 数量 * 100

    if (Player.GetGameGold() < 总价) {
        Player.MessageBox(`元宝不足！需要${总价}元宝，你只有${Player.GetGameGold()}元宝`)
        return
    }

    Player.SetGameGold(Player.GetGameGold() - 总价)
    Player.GoldChanged()
    Player.Give('经验碎片', 数量)
    Player.SendMessage(`{S=成功购买${数量}个经验碎片，花费${总价}元宝！;C=243}`, 1)
    Main(Npc, Player, {} as TArgs)
}
