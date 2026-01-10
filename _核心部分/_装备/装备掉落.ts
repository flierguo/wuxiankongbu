/**
 * 装备掉落系统
 * 根据怪物TAG生成装备词条
 */

import { 小于等于, 智能计算, 比较 } from '../../大数值/核心计算方法'
import { 数字转单位2, 数字转单位3, 随机小数 } from '../字符计算'
import { 取地图配置, 地图配置 } from '../世界配置'
import { TAG, 基础词条, 技能魔次, 装备颜色, 基础属性分割, 基础属性第一条, 基础属性第八条, 职业魔次分割, 职业第一条, 职业第六条, 装备需求等级, 基础数值 } from '../基础常量'
import { 掉落自动回收 } from './装备回收'
import { TAG装备倍数 } from '../进阶系统'

// ==================== 数值平衡配置（便于调整） ====================
/**
 * 装备属性倍数配置
 * 修改这些值可以快速调整装备强度和数值平衡
 */
const 数值平衡配置 = {
    基础属性倍数最小: 1.5,   // 基础属性随机倍数最小值（原0.8-1.5，提高到1.8-2.2）
    基础属性倍数最大: 4.5,   // 基础属性随机倍数最大值
    魔次属性倍数最小: 0.2,   // 魔次属性随机倍数最小值（原0.3-0.5，提高到0.9-1.1）
    魔次属性倍数最大: 1.2,   // 魔次属性随机倍数最大值
    基础翻倍最小: 50,        // 基础翻倍最小值（原1）
    基础翻倍最大: 200,       // 基础翻倍最大值（原201）
    基础翻倍范围: 100,        // 基础翻倍范围（原200）
} as const

// ==================== 类型定义 ====================
interface 装备属性记录 {
    职业属性_职业: number[]
    职业属性_属性: string[]
}

// ==================== TAG词条配置 ====================
const TAG词条配置 = {
    1: { 基础词条: { min: 1, max: 4 }, 魔次几率: 30, 魔次词条: { min: 1, max: 2 } },
    2: { 基础词条: { min: 2, max: 5 }, 魔次几率: 30, 魔次词条: { min: 1, max: 3 } },
    3: { 基础词条: { min: 2, max: 6 }, 魔次几率: 10, 魔次词条: { min: 1, max: 3 } },
    4: { 基础词条: { min: 3, max: 7 }, 魔次几率: 1, 魔次词条: { min: 2, max: 4 } },  // 必获得
    5: { 基础词条: { min: 4, max: 8 }, 魔次几率: 1, 魔次词条: { min: 2, max: 5 } },  // 必获得
    6: { 基础词条: { min: 5, max: 8 }, 魔次几率: 1, 魔次词条: { min: 3, max: 6 } },  // 必获得
    7: { 基础词条: { min: 6, max: 8 }, 魔次几率: 1, 魔次词条: { min: 3, max: 6 } },  // 必获得
} as const

// ==================== 基础词条池 ====================
const 基础词条池 = [
    基础词条.攻击, 基础词条.魔法, 基础词条.道术, 基础词条.刺术,
    基础词条.箭术, 基础词条.武术, 基础词条.血量, 基础词条.防御
]
const 基础词条池2 = [
    基础词条.攻击2, 基础词条.魔法2, 基础词条.道术2, 基础词条.刺术2,
    基础词条.箭术2, 基础词条.武术2, 基础词条.血量2, 基础词条.防御2
]

// ==================== 魔次词条池（分组） ====================
// 分组1: 基础技能 (只能有1条)
const 基础技能池 = [
    技能魔次.攻杀剑术, 技能魔次.半月弯刀, 技能魔次.雷电术, 技能魔次.暴风雪,
    技能魔次.灵魂火符, 技能魔次.飓风破, 技能魔次.暴击术, 技能魔次.霜月,
    技能魔次.精准箭术, 技能魔次.万箭齐发, 技能魔次.罗汉棍法, 技能魔次.天雷阵
]

// 分组2: 职业技能 (只能有1条)
const 职业技能池 = [
    技能魔次.天枢, 技能魔次.血神, 技能魔次.暗影, 技能魔次.烈焰,
    技能魔次.正义, 技能魔次.不动, 技能魔次.全体
]

// 分组3: 新职业技能 (可多条但不重复)
const 新职业技能池 = [
    技能魔次.怒斩, 技能魔次.人之怒, 技能魔次.地之怒, 技能魔次.天之怒, 技能魔次.神之怒,
    技能魔次.血气献祭, 技能魔次.血气燃烧,
    技能魔次.暗影袭杀, 技能魔次.暗影剔骨, 技能魔次.暗影风暴, 技能魔次.暗影附体,
    技能魔次.火焰追踪, 技能魔次.烈焰护甲, 技能魔次.爆裂火冢, 技能魔次.烈焰突袭,
    技能魔次.圣光, 技能魔次.行刑, 技能魔次.洗礼,
    技能魔次.如山, 技能魔次.金刚掌
]

// ==================== 工具函数 ====================

/** 计算位数 */
const 计算位数 = (num: string): number => num.toString().replace(/\.\d+/, '').length

/** 随机范围整数 */
const 随机范围 = (min: number, max: number): number => min + random(max - min + 1)

/**
 * 设置基础装备属性
 */
function 设置基础属性(物品: TUserItem, 索引: number, 属性ID: number, 属性值: string, 记录: 装备属性记录): void {
    const 前端数字 = 数字转单位2(属性值)
    const 后端单位 = 数字转单位3(属性值)
    const 位数 = 计算位数(属性值)

    物品.SetOutWay1(索引, 属性ID)
    物品.SetOutWay2(索引, Number(前端数字))
    物品.SetOutWay3(索引, Number(后端单位))
    物品.SetCustomValue(属性ID - 100, 位数)  // 基础词条额外设置

    记录.职业属性_职业.push(属性ID)
    记录.职业属性_属性.push(属性值)
}

/**
 * 设置魔次装备属性
 */
function 设置魔次属性(物品: TUserItem, 索引: number, 属性ID: number, 属性值: string, 记录: 装备属性记录, 分组: number): void {
    const 前端数字 = 数字转单位2(属性值)
    const 后端单位 = 数字转单位3(属性值)
    const 位数 = 计算位数(属性值)

    物品.SetOutWay1(索引, 属性ID)
    物品.SetOutWay2(索引, Number(前端数字))
    物品.SetOutWay3(索引, Number(后端单位))

    // 根据分组设置CustomValue
    if (分组 === 1) {
        物品.SetCustomValue(0, 位数)  // 基础技能 属性ID为0
    } else if (分组 === 2) {
        物品.SetCustomValue(20, 位数) // 职业技能 属性ID为20
    } else {
        物品.SetCustomValue(属性ID - 10021, 位数) // 新职业技能
    }

    记录.职业属性_职业.push(属性ID)
    记录.职业属性_属性.push(属性值)
}


/**
 * 计算属性基础值（使用进阶系统倍数）
 * @param 地图等级 地图等级
 * @param 翻倍类型 'basic' | 'extreme' | 'divine'
 * @param Player 玩家对象
 * @param 基础翻倍 外部传入的基础翻倍值
 * @param TAG倍数 TAG装备倍数
 */
function 计算属性值(地图等级: number, 翻倍类型: string, Player: TPlayObject, 基础翻倍: number, 装备基础: string): string {
    // 基础值 = 地图等级 * 随机倍数 * 装备基础
    const 随机倍数 = 随机小数(0.5, 2).toFixed(2)
    let 基础值 = 智能计算(String(地图等级), 随机倍数, 3)

    基础值 = 智能计算(基础值, 装备基础, 3)
    // 使用传入的基础翻倍
    基础值 = 智能计算(基础值, String(基础翻倍), 3)

    基础值 = 智能计算(基础值, '0.1', 3)
    // 极品倍率 = 1-(Player.R.极品率/100 + 20)  1/(2000-Player.R.极品率)几率
    const 极品率 = Player.R?.极品率 || 0
    const 极品几率分母 = Math.max(100, 1500 - 极品率)
    if (random(极品几率分母) < 1) {
        const 极品倍率 = 1 + random(Math.floor(极品率 / 100) + 20)
        基础值 = 智能计算(基础值, String(极品倍率), 3)
    }

    // 神品倍率 = 1-10  1/1000几率
    let 神品倍数 = 0
    if (翻倍类型 === 'divine' && random(1000) < 1) {
        神品倍数 = 1 + random(10)
        基础值 = 智能计算(基础值, String(神品倍数), 3)
    }

    return 基础值
}

/**
 * 计算魔次属性值（使用进阶系统倍数）
 */
function 计算魔次属性值(地图等级: number, 分组: number, Player: TPlayObject, 装备基础: string): string {
    // 魔次基础值 = 地图等级 * 随机倍数 * TAG倍数（每件装备独立随机）
    const 随机倍数 = 随机小数(0.2, 8).toFixed(2)
    let 基础值 = 智能计算(String(地图等级), 随机倍数, 3)

    // 基础翻倍
    const 基础翻倍 = 1 + random(10)
    基础值 = 智能计算(基础值, String(基础翻倍), 3)

    // 职业技能(分组2)数值为其他的1/10000
    if (分组 === 2) {
        基础值 = 智能计算(基础值, '0.0001', 3)
    } else {
        基础值 = 智能计算(基础值, '0.01', 3)
    }
    // 极品倍率 = 1-(Player.R.极品率/100 + 20)  1/(2000-Player.R.极品率)几率
    const 极品率 = Player.R?.极品率 || 0
    const 极品几率分母 = Math.max(100, 2000 - 极品率)
    if (random(极品几率分母) < 1) {
        const 极品倍率 = 1 + random(Math.floor(极品率 / 100) + 20)
        基础值 = 智能计算(基础值, String(极品倍率), 3)
    }
    // 神品倍率
    if (random(1000) < 1) {
        const 神品倍数 = 1 + random(Math.floor(极品率 / 200) + 5)
        基础值 = 智能计算(基础值, String(神品倍数), 3)
    }
    if (小于等于(基础值, '0')) { 基础值 = String(1 + random(20)) }

    return 基础值
}

/**
 * 根据总词条数获取装备颜色
 */
function 获取装备颜色(总词条数: number, 是否神器: boolean): number {
    if (是否神器) return 装备颜色.神器颜色
    if (总词条数 >= 10) return 装备颜色.神话颜色
    if (总词条数 >= 8) return 装备颜色.传说颜色
    if (总词条数 >= 6) return 装备颜色.史诗颜色
    if (总词条数 >= 5) return 装备颜色.稀有颜色
    if (总词条数 >= 3) return 装备颜色.优秀颜色
    return 装备颜色.普通颜色
}

/**
 * 装备掉落主函数
 */
export function 装备掉落(Player: TPlayObject, Monster: TActor, UserItem: TUserItem): void {
    // 验证装备类型
    const 有效装备类型 = [5, 6, 10, 11, 15, 16, 19, 20, 21, 22, 23, 24, 26, 27, 28, 68]
    if (!有效装备类型.includes(UserItem.StdMode)) return

    // 获取怪物TAG
    const 怪物TAG = Monster.GetNVar(TAG) % 10
    const 配置 = TAG词条配置[怪物TAG as keyof typeof TAG词条配置]
    if (!配置) return

    // 获取地图等级和TAG装备倍数
    const 地图名 = Monster.Map?.DisplayName || ''
    const 当前地图配置 = 取地图配置(地图名)
    const 需求等级 = 当前地图配置?.需求等级 || 1
    const 地图等级 = 当前地图配置?.地图等级 || 100
    const 装备基础 = Monster.GetSVar(基础数值)

    // 初始化记录
    const 装备属性记录: 装备属性记录 = {
        职业属性_职业: [],
        职业属性_属性: []
    }

    // 计算基础词条数
    const 基础词条数 = 随机范围(配置.基础词条.min, 配置.基础词条.max)

    // 计算魔次词条数（根据几率）
    let 魔次词条数 = 0
    if (配置.魔次几率 === 1 || random(配置.魔次几率) < 1) {
        魔次词条数 = 随机范围(配置.魔次词条.min, 配置.魔次词条.max)
    }

    const 总词条数 = 基础词条数 + 魔次词条数

    // 计算极品倍率
    const 极品率 = Player.R?.最终极品倍率 || 0
    let 基础极品倍率 = 1
    let 技能极品倍率 = 1

    const 极品几率分母 = Math.max(100, 2000 - 极品率)
    if (random(极品几率分母) < 1) {
        基础极品倍率 = 1 + random(Math.floor(极品率 / 100) + 20)
    }
    if (random(极品几率分母) < 1) {
        技能极品倍率 = 1 + random(Math.floor(极品率 / 100) + 10)
    }

    // 神品判定
    let 是否神器 = false
    let 神器倍数 = 0
    if (random(1000) < 1) {
        是否神器 = true
        神器倍数 = 1 + random(10)
    }

    // 生成基础翻倍值（用于装备价值计算）
    const 基础翻倍 = (数值平衡配置.基础翻倍最小 + random(数值平衡配置.基础翻倍范围)) * Player.R.最终回收倍率 / 10

    // 设置装备需求及价值（OutWay3存储基础翻倍作为装备价值）
    UserItem.SetOutWay1(装备需求等级, 3)
    UserItem.SetOutWay2(装备需求等级, 需求等级)
    UserItem.SetOutWay3(装备需求等级, 基础翻倍)

    // 设置基础属性分割
    UserItem.SetOutWay1(基础属性分割, 1)
    UserItem.SetOutWay2(基础属性分割, 基础极品倍率)

    // 生成基础词条
    const 已用基础词条: number[] = []
    const 已用基础词条2: number[] = []
    let 当前索引 = 基础属性第一条

    for (let i = 0; i < 基础词条数 && 当前索引 <= 基础属性第八条; i++) {
        // 随机选择词条类型（0-7对应8种属性）
        let 词条类型 = random(8)

        // 检查是否已有该类型词条
        if (已用基础词条.includes(词条类型)) {
            // 尝试使用第二条
            if (!已用基础词条2.includes(词条类型)) {
                已用基础词条2.push(词条类型)
                const 属性ID = 基础词条池2[词条类型]
                const 属性值 = 计算属性值(地图等级, 是否神器 ? 'divine' : 'basic', Player, 基础翻倍, 装备基础)
                设置基础属性(UserItem, 当前索引, 属性ID, 属性值, 装备属性记录)
                当前索引++
            }
            // 已有两条同类型，跳过
            continue
        }

        已用基础词条.push(词条类型)
        const 属性ID = 基础词条池[词条类型]
        const 属性值 = 计算属性值(地图等级, 是否神器 ? 'divine' : 'basic', Player, 基础翻倍, 装备基础)
        设置基础属性(UserItem, 当前索引, 属性ID, 属性值, 装备属性记录)
        当前索引++
    }

    // 生成魔次词条
    let 魔次索引 = 职业第一条
    let 已有基础技能 = false
    let 已有职业技能 = false
    const 已用新职业技能: number[] = []

    for (let i = 0; i < 魔次词条数 && 魔次索引 <= 职业第六条; i++) {
        // 决定分组：职业技能几率为其他的1/30
        let 分组: number
        const 分组随机 = random(62) // 30+30+2 = 62

        if (分组随机 < 30 && !已有基础技能) {
            分组 = 1 // 基础技能
        } else if (分组随机 < 31 && !已有职业技能) {
            分组 = 2 // 职业技能 (1/30几率)
        } else {
            分组 = 3 // 新职业技能
        }

        let 属性ID: number

        if (分组 === 1) {
            已有基础技能 = true
            属性ID = 基础技能池[random(基础技能池.length)]
        } else if (分组 === 2) {
            已有职业技能 = true
            属性ID = 职业技能池[random(职业技能池.length)]
        } else {
            // 新职业技能不能重复
            let 可用池 = 新职业技能池.filter(id => !已用新职业技能.includes(id))
            if (可用池.length === 0) continue
            属性ID = 可用池[random(可用池.length)]
            已用新职业技能.push(属性ID)
        }

        const 属性值 = 计算魔次属性值(地图等级, 分组, Player, 装备基础)
        设置魔次属性(UserItem, 魔次索引, 属性ID, 属性值, 装备属性记录, 分组)
        魔次索引++
    }

    // 只有生成了魔次词条时才设置魔次分割
    if (魔次索引 > 职业第一条) {
        UserItem.SetOutWay1(职业魔次分割, 2)
        UserItem.SetOutWay2(职业魔次分割, 技能极品倍率)
    }

    // 设置装备颜色
    const 颜色 = 获取装备颜色(总词条数, 是否神器)
    UserItem.SetColor(颜色)

    // 设置装备名称
    let 新名称 = UserItem.GetName()
    if (是否神器) {
        新名称 = `[神器]${神器倍数}倍${新名称}`
    }
    UserItem.Rename(新名称)

    // 保存属性记录
    UserItem.SetCustomDesc(JSON.stringify(装备属性记录))
    Player.UpdateItem(UserItem)

    // 自动回收检查 - 如果开启自动回收且符合回收条件则回收
    if (掉落自动回收(Player, UserItem)) {
        return // 已回收，不入包
    }

    // 装备入包逻辑
    Player.R.a复制装备 = GameLib.SaveUserItemToString(UserItem)
    Player.AddItemToBag(GameLib.LoadUserItemFromString(Player.R.a复制装备))
}


// ==================== 鞭尸相关函数 ====================

/**
 * 鞭尸处理
 * @param Player 玩家对象
 * @param Monster 怪物对象
 * @returns 鞭尸获得的奖励信息
 */
export function 鞭尸处理(Player: TPlayObject, Monster: TActor): { 成功: boolean, 奖励类型?: string, 奖励数量?: number } {
    // 检查是否开启鞭尸
    if (!Player.V?.开启鞭尸) {
        return { 成功: false }
    }

    // 检查怪物是否已死亡
    if (!Monster.GetDeath()) {
        return { 成功: false }
    }

    // 检查鞭尸冷却
    const 当前时间 = DateUtils.Now()
    const 上次鞭尸时间 = Player.VarDateTime('上次鞭尸时间')?.AsDateTime
    if (上次鞭尸时间 && DateUtils.MilliSecondSpan(当前时间, 上次鞭尸时间) < 500) {
        return { 成功: false }
    }
    Player.VarDateTime('上次鞭尸时间').AsDateTime = 当前时间

    // 获取怪物TAG决定奖励
    const 怪物TAG = Monster.GetNVar(TAG) % 10
    let 奖励类型 = '金币'
    let 奖励数量 = 0

    // 根据TAG计算奖励
    switch (怪物TAG) {
        case 1:
            奖励数量 = 10 + random(20)
            break
        case 2:
            奖励数量 = 30 + random(50)
            break
        case 3:
            奖励数量 = 80 + random(100)
            break
        case 4:
            奖励数量 = 200 + random(300)
            break
        case 5:
            奖励数量 = 500 + random(500)
            break
        case 6:
            奖励数量 = 1000 + random(1000)
            if (random(100) < 10) {
                奖励类型 = '元宝'
                奖励数量 = 1 + random(5)
            }
            break
        case 7:
            奖励数量 = 2000 + random(3000)
            if (random(100) < 20) {
                奖励类型 = '元宝'
                奖励数量 = 5 + random(10)
            }
            break
        default:
            奖励数量 = 5 + random(10)
    }

    // 应用鞭尸加成
    const 鞭尸加成 = Player.R?.鞭尸加成 || 0
    奖励数量 = Math.floor(奖励数量 * (1 + 鞭尸加成 / 100))

    // 发放奖励
    if (奖励类型 === '金币') {
        Player.SetGold(Player.GetGold() + 奖励数量)
        Player.GoldChanged()
    } else if (奖励类型 === '元宝') {
        Player.SetGamePoint(Player.GetGamePoint() + 奖励数量)
    }

    return { 成功: true, 奖励类型, 奖励数量 }
}

/**
 * 批量鞭尸处理（范围内所有尸体）
 * @param Player 玩家对象
 * @param 范围 鞭尸范围
 */
export function 批量鞭尸(Player: TPlayObject, 范围: number = 3): void {
    if (!Player.V?.开启鞭尸) return

    const 地图 = Player.Map
    if (!地图) return

    const X = Player.GetMapX()
    const Y = Player.GetMapY()

    // 获取范围内的怪物列表
    const 怪物列表 = 地图.GetActorListInRange(X, Y, 范围, '')

    let 总金币 = 0
    let 总元宝 = 0

    for (let i = 0; i < 怪物列表.Count; i++) {
        const 怪物 = 怪物列表.Actor(i)
        if (怪物 && 怪物.GetDeath() && !怪物.IsPlayer() && !怪物.IsNPC()) {
            const 结果 = 鞭尸处理(Player, 怪物)
            if (结果.成功) {
                if (结果.奖励类型 === '金币') {
                    总金币 += 结果.奖励数量 || 0
                } else if (结果.奖励类型 === '元宝') {
                    总元宝 += 结果.奖励数量 || 0
                }
            }
        }
    }

    // 显示鞭尸结果
    if (总金币 > 0 || 总元宝 > 0) {
        let 消息 = '鞭尸获得: '
        if (总金币 > 0) 消息 += `金币+${总金币} `
        if (总元宝 > 0) 消息 += `元宝+${总元宝}`
        Player.SendMessage(消息, 1)
    }
}
