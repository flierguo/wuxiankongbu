/**
 * 随机套装系统
 * 当 StdMode == 68 的装备掉落时，有 1/100 几率获得随机套装属性
 * 
 * 显示逻辑：
 * - 掉落时：显示未激活状态（0/3, 0/6, 0/9）
 * - 穿戴后：显示当前件数/需求件数（如 4/6），达到需求件数时激活属性
 * - 仅检索生肖盒（GetZodiacs）中 StdMode === 68 的装备
 * 
 * 套装种类（共11种）：
 * 【基因类 - 6种】受地图星级影响
 * 【固定类 - 3种】不受地图星级影响
 * 【浮动类 - 2种】受地图星级影响
 * 
 * 对照表索引结构（以迅疾基因3010为例）：
 * - 3010: 套装名称
 * - 3011: 3件效果未激活（显示 $OUTWAY2$/3）
 * - 3012: 3件效果已激活
 * - 3013: 6件效果未激活（显示 $OUTWAY2$/6）
 * - 3014: 6件效果已激活
 * - 3015: 9件效果未激活（显示 $OUTWAY2$/9）
 * - 3016: 9件效果已激活
 */

import { 地图ID取固定星级 } from '../_地图/地图'
import { 装备需求等级 } from '../基础常量'
import { 智能计算 } from '../../_大数值/核心计算方法'

// ==================== 套装类型枚举 ====================
export enum 套装类型 {
    狂化基因 = 1,
    迅疾基因 = 2,
    甲壳基因 = 3,
    融合基因 = 4,
    念力基因 = 5,
    协作基因 = 6,
    爆率 = 7,
    极品 = 8,
    回收 = 9,
    伤害 = 10,
    主属性 = 11,
}

// ==================== 套装配置接口 ====================
interface 套装配置 {
    类型: 套装类型
    名称: string
    颜色: number
    三件加成: number
    六件加成: number
    九件加成: number
    单位: string
    受星级影响: boolean
    对照表基础索引: number
}

// ==================== OutWay索引常量 ====================
// 索引20: 套装名称显示，OutWay1=对照表基础索引，OutWay2=倍率，OutWay3=套装类型ID
const OUTWAY_套装名称 = 16
const OUTWAY_3件状态 = 17        // OutWay1=对照表索引，OutWay2=件数，OutWay3=加成值
const OUTWAY_6件状态 = 18        // OutWay1=对照表索引，OutWay2=件数，OutWay3=加成值
const OUTWAY_9件状态 = 19        // OutWay1=对照表索引，OutWay2=件数，OutWay3=加成值


// ==================== 套装配置表 ====================
export const 套装配置表: Map<套装类型, 套装配置> = new Map([
    // 基因类套装 - 受星级影响（9件套）
    [套装类型.狂化基因, { 类型: 套装类型.狂化基因, 名称: '狂化基因', 颜色: 250, 三件加成: 2, 六件加成: 4, 九件加成: 6, 单位: '阶', 受星级影响: true, 对照表基础索引: 3000 }],
    [套装类型.迅疾基因, { 类型: 套装类型.迅疾基因, 名称: '迅疾基因', 颜色: 250, 三件加成: 2, 六件加成: 4, 九件加成: 6, 单位: '阶', 受星级影响: true, 对照表基础索引: 3010 }],
    [套装类型.甲壳基因, { 类型: 套装类型.甲壳基因, 名称: '甲壳基因', 颜色: 250, 三件加成: 2, 六件加成: 4, 九件加成: 6, 单位: '阶', 受星级影响: true, 对照表基础索引: 3020 }],
    [套装类型.融合基因, { 类型: 套装类型.融合基因, 名称: '融合基因', 颜色: 250, 三件加成: 2, 六件加成: 4, 九件加成: 6, 单位: '阶', 受星级影响: true, 对照表基础索引: 3030 }],
    [套装类型.念力基因, { 类型: 套装类型.念力基因, 名称: '念力基因', 颜色: 250, 三件加成: 2, 六件加成: 4, 九件加成: 6, 单位: '阶', 受星级影响: true, 对照表基础索引: 3040 }],
    [套装类型.协作基因, { 类型: 套装类型.协作基因, 名称: '协作基因', 颜色: 250, 三件加成: 2, 六件加成: 4, 九件加成: 6, 单位: '阶', 受星级影响: true, 对照表基础索引: 3050 }],
    // 固定类套装 - 不受星级影响（9件套）
    [套装类型.爆率, { 类型: 套装类型.爆率, 名称: '爆率', 颜色: 251, 三件加成: 50, 六件加成: 100, 九件加成: 200, 单位: '', 受星级影响: false, 对照表基础索引: 3060 }],
    [套装类型.极品, { 类型: 套装类型.极品, 名称: '极品', 颜色: 254, 三件加成: 20, 六件加成: 40, 九件加成: 80, 单位: '', 受星级影响: false, 对照表基础索引: 3070 }],
    [套装类型.回收, { 类型: 套装类型.回收, 名称: '回收', 颜色: 253, 三件加成: 100, 六件加成: 200, 九件加成: 400, 单位: '', 受星级影响: false, 对照表基础索引: 3080 }],
    // 浮动类套装 - 受星级影响（9件套）
    [套装类型.伤害, { 类型: 套装类型.伤害, 名称: '伤害', 颜色: 244, 三件加成: 200, 六件加成: 400, 九件加成: 1000, 单位: '', 受星级影响: true, 对照表基础索引: 3090 }],
    [套装类型.主属性, { 类型: 套装类型.主属性, 名称: '主属性', 颜色: 249, 三件加成: 100, 六件加成: 200, 九件加成: 300, 单位: '', 受星级影响: true, 对照表基础索引: 3100 }],
])

/**
 * 根据地图星级计算套装属性倍率
 */
export function 计算套装倍率(地图星级: number): number {
    let 倍率 = Math.floor(地图星级 * 0.01)
    if (倍率 < 1) 倍率 = 1
    return 倍率
}

/**
 * 计算套装实际加成数值（累计所有已激活档位）
 * 9件套：3件激活 + 6件激活 + 9件激活
 */
export function 获取套装加成(配置: 套装配置, 激活件数: number, 倍率: number): number {
    let 总加成 = 0
    if (激活件数 >= 3) {
        总加成 += 配置.受星级影响 ? 配置.三件加成 * 倍率 : 配置.三件加成
    }
    if (激活件数 >= 6) {
        总加成 += 配置.受星级影响 ? 配置.六件加成 * 倍率 : 配置.六件加成
    }
    if (激活件数 >= 9) {
        总加成 += 配置.受星级影响 ? 配置.九件加成 * 倍率 : 配置.九件加成
    }
    return 总加成
}

/**
 * 随机套装掉落处理
 * 掉落时显示未激活状态（0/3, 0/6, 0/9）
 */
export function 随机套装掉落(UserItem: TUserItem, 地图ID: string): boolean {
    if (UserItem.GetStdMode() !== 68) return false

    Randomize()
    if (random(100) !== 0) return false

    const 套装ID = (random(11) + 1) as 套装类型
    const 配置 = 套装配置表.get(套装ID)
    if (!配置) return false

    const 地图星级 = 地图ID取固定星级(地图ID)
    const 倍率 = 计算套装倍率(地图星级)
    const 实际倍率 = 配置.受星级影响 ? 倍率 : 1

    // 计算各档位数值
    const 三件数值 = 配置.三件加成 * 实际倍率
    const 六件数值 = 配置.六件加成 * 实际倍率
    const 九件数值 = 配置.九件加成 * 实际倍率

    // 套装名称显示：OutWay1=对照表基础索引，OutWay2=倍率，OutWay3=套装类型ID
    UserItem.SetOutWay1(OUTWAY_套装名称, 配置.对照表基础索引)
    UserItem.SetOutWay2(OUTWAY_套装名称, 实际倍率)
    UserItem.SetOutWay3(OUTWAY_套装名称, 套装ID)

    // 3件效果：初始0件，未激活
    // OutWay1 = 对照表索引（未激活用+1，已激活用+2）
    // OutWay2 = 当前件数（显示为 件数/3）
    // OutWay3 = 属性加成值
    UserItem.SetOutWay1(OUTWAY_3件状态, 配置.对照表基础索引 + 1)
    UserItem.SetOutWay2(OUTWAY_3件状态, 0)
    UserItem.SetOutWay3(OUTWAY_3件状态, 三件数值)

    // 6件效果：初始0件，未激活
    // OutWay1 = 对照表索引（未激活用+3，已激活用+4）
    // OutWay2 = 当前件数（显示为 件数/6）
    // OutWay3 = 属性加成值
    UserItem.SetOutWay1(OUTWAY_6件状态, 配置.对照表基础索引 + 3)
    UserItem.SetOutWay2(OUTWAY_6件状态, 0)
    UserItem.SetOutWay3(OUTWAY_6件状态, 六件数值)

    // 9件效果：初始0件，未激活
    // OutWay1 = 对照表索引（未激活用+5，已激活用+6）
    // OutWay2 = 当前件数（显示为 件数/9）
    // OutWay3 = 属性加成值
    UserItem.SetOutWay1(OUTWAY_9件状态, 配置.对照表基础索引 + 5)
    UserItem.SetOutWay2(OUTWAY_9件状态, 0)
    UserItem.SetOutWay3(OUTWAY_9件状态, 九件数值)

    // 设置套装装备价值（基础价值 × 地图星级倍率）
    // const 装备价值 = 套装基础价值 * 倍率
    // UserItem.SetOutWay1(装备需求等级, 3)
    // UserItem.SetOutWay2(装备需求等级, 1)
    // UserItem.SetOutWay3(装备需求等级, 装备价值)

    return true
}

/**
 * 获取装备的套装类型（通过索引20的OutWay3获取）
 */
export function 获取套装类型(UserItem: TUserItem): 套装类型 | 0 {
    return UserItem.GetOutWay3(OUTWAY_套装名称) as 套装类型 | 0
}

/**
 * 获取装备的套装倍率（通过索引20的OutWay2获取）
 */
export function 获取装备倍率(UserItem: TUserItem): number {
    return UserItem.GetOutWay2(OUTWAY_套装名称) || 1
}

/**
 * 统计玩家身上的套装件数
 * 仅统计生肖盒（GetZodiacs）中 StdMode === 68 的装备
 */
export function 统计套装件数(Player: TPlayObject): Map<套装类型, number> {
    const 统计 = new Map<套装类型, number>()

    // 只检索生肖盒装备（位置0-11）
    for (let i = 0; i < 12; i++) {
        const 装备 = Player.GetZodiacs(i)
        if (!装备) continue

        // 只统计 StdMode === 68 的装备
        if (装备.GetStdMode() !== 68) continue

        const 类型 = 获取套装类型(装备)
        if (类型 === 0) continue
        统计.set(类型, (统计.get(类型) || 0) + 1)
    }
    return 统计
}

/**
 * 套装加成结果接口
 */
export interface 套装加成结果 {
    狂化阶数: number
    迅疾阶数: number
    甲壳阶数: number
    融合阶数: number
    念力阶数: number
    协作阶数: number
    爆率加成: number
    极品加成: number
    回收加成: number
    伤害加成: number
    主属性加成: number
}

/**
 * 计算玩家套装加成
 * 仅计算生肖盒（GetZodiacs）中 StdMode === 68 的装备
 */
export function 计算玩家套装加成(Player: TPlayObject): 套装加成结果 {
    const 结果: 套装加成结果 = {
        狂化阶数: 0, 迅疾阶数: 0, 甲壳阶数: 0,
        融合阶数: 0, 念力阶数: 0, 协作阶数: 0,
        爆率加成: 0, 极品加成: 0, 回收加成: 0,
        伤害加成: 0, 主属性加成: 0,
    }

    const 套装统计 = 统计套装件数(Player)

    // 获取每种套装的最低倍率（只检索生肖盒装备）
    const 倍率统计 = new Map<套装类型, number>()
    for (let i = 0; i < 12; i++) {
        const 装备 = Player.GetZodiacs(i)
        if (!装备) continue
        if (装备.GetStdMode() !== 68) continue

        const 类型 = 获取套装类型(装备)
        if (类型 === 0) continue
        const 倍率 = 获取装备倍率(装备)
        const 当前最低 = 倍率统计.get(类型)
        if (当前最低 === undefined || 倍率 < 当前最低) {
            倍率统计.set(类型, 倍率)
        }
    }

    // 计算各套装加成
    for (const [类型, 件数] of 套装统计) {
        const 配置 = 套装配置表.get(类型)
        if (!配置) continue
        const 倍率 = 倍率统计.get(类型) || 1
        const 加成 = 获取套装加成(配置, 件数, 倍率)

        switch (类型) {
            case 套装类型.狂化基因: 结果.狂化阶数 = 加成; break
            case 套装类型.迅疾基因: 结果.迅疾阶数 = 加成; break
            case 套装类型.甲壳基因: 结果.甲壳阶数 = 加成; break
            case 套装类型.融合基因: 结果.融合阶数 = 加成; break
            case 套装类型.念力基因: 结果.念力阶数 = 加成; break
            case 套装类型.协作基因: 结果.协作阶数 = 加成; break
            case 套装类型.爆率: 结果.爆率加成 = 加成; break
            case 套装类型.极品: 结果.极品加成 = 加成; break
            case 套装类型.回收: 结果.回收加成 = 加成; break
            case 套装类型.伤害: 结果.伤害加成 = 加成; break
            case 套装类型.主属性: 结果.主属性加成 = 加成; break
        }
    }
    return 结果
}

/**
 * 更新玩家套装显示
 * 仅更新生肖盒（GetZodiacs）中 StdMode === 68 的装备
 */
export function 更新套装显示(Player: TPlayObject): void {
    const 套装统计 = 统计套装件数(Player)

    for (let i = 0; i < 12; i++) {
        const 装备 = Player.GetZodiacs(i)
        if (!装备) continue
        if (装备.GetStdMode() !== 68) continue

        const 类型 = 获取套装类型(装备)
        if (类型 === 0) continue

        const 配置 = 套装配置表.get(类型)
        if (!配置) continue

        const 件数 = 套装统计.get(类型) || 0

        // 3件效果
        装备.SetOutWay1(OUTWAY_3件状态, 配置.对照表基础索引 + (件数 >= 3 ? 2 : 1))
        装备.SetOutWay2(OUTWAY_3件状态, 件数)

        // 6件效果
        装备.SetOutWay1(OUTWAY_6件状态, 配置.对照表基础索引 + (件数 >= 6 ? 4 : 3))
        装备.SetOutWay2(OUTWAY_6件状态, 件数)

        // 9件效果
        装备.SetOutWay1(OUTWAY_9件状态, 配置.对照表基础索引 + (件数 >= 9 ? 6 : 5))
        装备.SetOutWay2(OUTWAY_9件状态, 件数)

        Player.UpdateItem(装备)
    }
}

/**
 * 应用套装加成到玩家
 * 注意：套装阶数是累加到现有阶数上，不是覆盖
 */
export function 应用套装加成(Player: TPlayObject): void {
    const 加成 = 计算玩家套装加成(Player)

    // 套装阶数累加到现有阶数（基因选择会设置初始阶数为1）
    Player.R.狂化阶数 = (Player.R.狂化阶数 || 0) + 加成.狂化阶数
    Player.R.迅疾阶数 = (Player.R.迅疾阶数 || 0) + 加成.迅疾阶数
    Player.R.甲壳阶数 = (Player.R.甲壳阶数 || 0) + 加成.甲壳阶数
    Player.R.融合阶数 = (Player.R.融合阶数 || 0) + 加成.融合阶数
    Player.R.念力阶数 = (Player.R.念力阶数 || 0) + 加成.念力阶数
    Player.R.协作阶数 = (Player.R.协作阶数 || 0) + 加成.协作阶数

    // 套装爆率/极品/回收是累加，不是覆盖
    Player.R.爆率加成 = (Player.R.爆率加成 || 0) + 加成.爆率加成
    Player.R.极品率加成 = (Player.R.极品率加成 || 0) + 加成.极品加成
    Player.R.回收倍率 = (Player.R.回收倍率 || 100) + 加成.回收加成

    // 套装伤害加成累加到最终伤害加成
    Player.R.最终伤害加成 = (Player.R.最终伤害加成 || 0) + 加成.伤害加成

    // 套装主属性加成（百分比）
    if (加成.主属性加成 > 0) {
        const 主属性索引 = 161 + Player.Job
        const 主属性原值 = Player.R.自定属性?.[主属性索引] || '0'
        const 倍率 = 加成.主属性加成 * 0.01
        const 增量 = 智能计算(主属性原值, String(倍率), 3)
        Player.R.自定属性[主属性索引] = 智能计算(主属性原值, 增量, 1)
    }
}

/**
 * 清除装备的套装属性
 */
export function 清除套装属性(UserItem: TUserItem): void {
    for (let i = OUTWAY_套装名称; i <= OUTWAY_9件状态; i++) {
        UserItem.SetOutWay1(i, 0)
        UserItem.SetOutWay2(i, 0)
        UserItem.SetOutWay3(i, 0)
    }
}

/**
 * 判断装备是否有套装属性
 */
export function 是否有套装属性(UserItem: TUserItem): boolean {
    return 获取套装类型(UserItem) !== 0
}


/**
 * 测试套装 - 给玩家刷带套装属性的装备
 * 格式：玩家名-套装名-装备名
 * 套装名：狂化基因、迅疾基因、甲壳基因、融合基因、念力基因、协作基因、爆率、极品、回收、伤害、主属性
 */
export function 测试套装(Player: TPlayObject, 参数: string): void {
    if (!参数) {
        Player.SendMessage('请输入参数，格式：玩家名-套装名-装备名')
        return
    }

    const 分割 = 参数.split('-')
    if (分割.length !== 3) {
        Player.SendMessage('参数格式错误，正确格式：玩家名-套装名-装备名')
        return
    }

    const 玩家名称 = 分割[0].trim()
    const 套装名称 = 分割[1].trim()
    const 装备名称 = 分割[2].trim()

    // 查找目标玩家
    const 目标玩家: TPlayObject = GameLib.FindPlayer(玩家名称)
    if (!目标玩家) {
        Player.SendMessage(`未找到在线玩家：${玩家名称}`)
        return
    }

    // 查找套装类型
    let 套装ID: 套装类型 | null = null
    for (const [类型, 配置] of 套装配置表) {
        if (配置.名称 === 套装名称) {
            套装ID = 类型
            break
        }
    }

    if (!套装ID) {
        const 可用套装 = Array.from(套装配置表.values()).map(c => c.名称).join('、')
        Player.SendMessage(`未找到套装：${套装名称}，可用套装：${可用套装}`)
        return
    }

    // 给玩家刷装备
    const 装备 = 目标玩家.GiveItem(装备名称)
    if (!装备) {
        Player.SendMessage(`装备【${装备名称}】不存在或背包已满`)
        return
    }

    // 检查是否是 StdMode === 68 的装备
    if (装备.GetStdMode() !== 68) {
        Player.SendMessage(`装备【${装备名称}】不是生肖装备(StdMode !== 68)，无法附加套装属性`)
        return
    }

    // 附加套装属性
    const 配置 = 套装配置表.get(套装ID)!
    const 地图星级 = 100  // 测试用固定星级
    const 倍率 = 计算套装倍率(地图星级)
    const 实际倍率 = 配置.受星级影响 ? 倍率 : 1

    // 计算各档位数值
    const 三件数值 = 配置.三件加成 * 实际倍率
    const 六件数值 = 配置.六件加成 * 实际倍率
    const 九件数值 = 配置.九件加成 * 实际倍率

    // 套装名称显示：OutWay1=对照表基础索引，OutWay2=倍率，OutWay3=套装类型ID
    装备.SetOutWay1(OUTWAY_套装名称, 配置.对照表基础索引)
    装备.SetOutWay2(OUTWAY_套装名称, 实际倍率)
    装备.SetOutWay3(OUTWAY_套装名称, 套装ID)

    // 3件效果：初始0件，未激活
    装备.SetOutWay1(OUTWAY_3件状态, 配置.对照表基础索引 + 1)
    装备.SetOutWay2(OUTWAY_3件状态, 0)
    装备.SetOutWay3(OUTWAY_3件状态, 三件数值)

    // 6件效果：初始0件，未激活
    装备.SetOutWay1(OUTWAY_6件状态, 配置.对照表基础索引 + 3)
    装备.SetOutWay2(OUTWAY_6件状态, 0)
    装备.SetOutWay3(OUTWAY_6件状态, 六件数值)

    // 9件效果：初始0件，未激活
    装备.SetOutWay1(OUTWAY_9件状态, 配置.对照表基础索引 + 5)
    装备.SetOutWay2(OUTWAY_9件状态, 0)
    装备.SetOutWay3(OUTWAY_9件状态, 九件数值)

    // 更新装备显示
    目标玩家.UpdateItem(装备)

    Player.SendMessage(`成功给玩家【${玩家名称}】刷装备【${装备名称}】，套装：${套装名称}`)
    目标玩家.SendMessage(`获得套装装备【${装备名称}】(${套装名称})`)
}
