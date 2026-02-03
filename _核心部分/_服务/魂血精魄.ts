/**
 * 魂血精魄系统
 * 
 * 功能：
 * - 每级提高 血量百分比 +1
 * - 每20级提高 吸血千分比 +1
 * - 消耗公式：100 * 等级的等差数列之和 = 100 * n * (n + 1) / 2 = 50 * n * (n + 1)
 */

import { 装备属性统计 } from "../_装备/属性统计"

// ==================== 常量配置 ====================
const 魂血精魄物品名 = '魂血精魄'
const 每级血量百分比 = 1
const 吸血间隔等级 = 20
const 每次吸血千分比 = 1
const 基础消耗 = 100

// ==================== 计算函数 ====================

/** 计算从当前等级升到下一级的消耗 */
function 计算单次升级消耗(当前等级: number): number {
    return 基础消耗 * (当前等级 + 1)
}

/** 获取魂血精魄等级 */
export function 获取魂血等级(Player: TPlayObject): number {
    return Player.V.魂血精魄等级 || 0
}

/** 获取血量百分比加成 */
export function 获取魂血血量加成(Player: TPlayObject): number {
    return 获取魂血等级(Player) * 每级血量百分比
}

/** 获取吸血千分比加成 */
export function 获取魂血吸血加成(Player: TPlayObject): number {
    return Math.floor(获取魂血等级(Player) / 吸血间隔等级 - 1) * 每次吸血千分比
}

/** 删除指定数量的魂血精魄 */
function 删除魂血精魄(Player: TPlayObject, 数量: number): boolean {
    let 剩余删除 = 数量
    for (let i = Player.GetItemSize() - 1; i >= 0 && 剩余删除 > 0; i--) {
        const item = Player.GetBagItem(i)
        if (!item || item.GetName() !== 魂血精魄物品名) continue

        const 物品数量 = item.GetDura() || 1
        if (物品数量 <= 剩余删除) {
            Player.DeleteItem(item, 物品数量)
            剩余删除 -= 物品数量
        } else {
            item.Dura -= 剩余删除
            Player.UpdateItem(item)
            剩余删除 = 0
        }
    }
    return 剩余删除 === 0
}

// ==================== 核心功能 ====================

/** 魂血精魄升级 */
export function 魂血升级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 当前等级 = 获取魂血等级(Player)
    const 升级消耗 = 计算单次升级消耗(当前等级)
    const 拥有数量 = Player.GetItemCount(魂血精魄物品名)

    if (拥有数量 < 升级消耗) {
        Player.MessageBox(`魂血精魄不足，升级需要 ${升级消耗} 个，当前拥有 ${拥有数量} 个`)
        return
    }

    // 扣除物品
    if (!删除魂血精魄(Player, 升级消耗)) {
        Player.MessageBox('扣除物品失败')
        return
    }

    // 升级
    const 新等级 = 当前等级 + 1
    Player.V.魂血精魄等级 = 新等级

    // 计算加成
    const 血量加成 = 新等级 * 每级血量百分比
    const 吸血加成 = Math.floor(新等级 / 吸血间隔等级) * 每次吸血千分比

    Player.MessageBox(`魂血精魄升级成功！当前等级: ${新等级}\\血量百分比: +${血量加成}%  吸血千分比: +${吸血加成}‰`)
    装备属性统计(Player)
    // 刷新界面
    打开魂血界面(Npc, Player, Args)
}

/** 一键升级（消耗所有魂血精魄） */
export function 一键升级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 拥有数量 = Player.GetItemCount(魂血精魄物品名)
    if (拥有数量 <= 0) {
        Player.MessageBox('没有魂血精魄可用于升级')
        return
    }

    let 当前等级 = 获取魂血等级(Player)
    let 剩余数量 = 拥有数量
    let 升级次数 = 0
    let 总消耗 = 0

    // 计算可升级次数
    while (剩余数量 >= 计算单次升级消耗(当前等级)) {
        const 消耗 = 计算单次升级消耗(当前等级)
        剩余数量 -= 消耗
        总消耗 += 消耗
        当前等级++
        升级次数++
    }

    if (升级次数 === 0) {
        const 需要 = 计算单次升级消耗(当前等级)
        Player.MessageBox(`魂血精魄不足，升级需要 ${需要} 个，当前拥有 ${拥有数量} 个`)
        return
    }

    // 扣除物品
    if (!删除魂血精魄(Player, 总消耗)) {
        Player.MessageBox('扣除物品失败')
        return
    }

    Player.V.魂血精魄等级 = 当前等级

    const 血量加成 = 当前等级 * 每级血量百分比
    const 吸血加成 = Math.floor(当前等级 / 吸血间隔等级) * 每次吸血千分比

    Player.MessageBox(`一键升级成功！升级 ${升级次数} 次，当前等级: ${当前等级}\\血量百分比: +${血量加成}%  吸血千分比: +${吸血加成}‰`)
    装备属性统计(Player)
    打开魂血界面(Npc, Player, Args)
}

// ==================== 界面显示 ====================

/** 打开魂血精魄界面 */
export function 打开魂血界面(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 当前等级 = 获取魂血等级(Player)
    const 血量加成 = 当前等级 * 每级血量百分比
    const 吸血加成 = Math.floor(当前等级 / 吸血间隔等级) * 每次吸血千分比
    const 下级消耗 = 计算单次升级消耗(当前等级)
    const 拥有数量 = Player.GetItemCount(魂血精魄物品名)

    const S = `\\\\
        {S=魂血精魄;C=254;X=200;Y=5}\\\\
        {S=当前等级: ${当前等级};C=250;X=50;Y=30}\\\\
        {S=血量百分比: +${血量加成}%;C=149;X=50;Y=60}\\\\
        {S=吸血千分比: +${吸血加成}‰;C=149;X=50;Y=90}\\\\
        {S=（每20级+1‰吸血）;C=154;X=50;Y=120}\\\\
        {S=拥有魂血精魄: ${拥有数量};C=250;X=50;Y=150}\\\\
        {S=升级消耗: ${下级消耗};C=251;X=50;Y=180}\\\\
        <{S=[升级];C=249;X=120;Y=240}/@魂血精魄.魂血升级>\\\\
        <{S=[一键升级];C=249;X=220;Y=240}/@魂血精魄.一键升级>\\\\
    `
    Npc.SayEx(Player, 'NPC小窗口', S)
}

/** 主入口 */
export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    打开魂血界面(Npc, Player, Args)
}
