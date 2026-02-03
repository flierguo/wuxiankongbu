/**
 * 魔次转移系统
 * 
 * 功能：
 * - 将主装备的魔次属性转移到副装备对应位置
 * - 职业技能魔次（天枢、血神、暗影、烈焰、正义、不动、全体）花费 500 主神点
 * - 其他魔次花费 200 主神点
 * - 使用 NPC中大窗口带2框 界面，放入装备触发 Main 函数
 */

import { 大数值整数简写 } from '../字符计算'
import { 技能魔次, 职业第一条, 职业第六条 } from '../基础常量'
import { 装备属性统计 } from '../_装备/属性统计'

// ==================== 常量配置 ====================
const 职业魔次花费 = 1000
const 普通魔次花费 = 500
const 有效装备类型 = [5, 6, 10, 11, 15, 16, 19, 20, 21, 22, 23, 24, 26, 27, 28]

// 职业技能魔次ID集合
const 职业技能魔次集合 = new Set([
    技能魔次.天枢, 技能魔次.血神, 技能魔次.暗影,
    技能魔次.烈焰, 技能魔次.正义, 技能魔次.不动, 技能魔次.全体
])

// 魔次ID -> 名称映射
const 魔次名称表: { [id: number]: string } = {
    [技能魔次.攻杀剑术]: '攻杀剑术', [技能魔次.半月弯刀]: '半月弯刀',
    [技能魔次.雷电术]: '雷电术', [技能魔次.暴风雪]: '暴风雪',
    [技能魔次.灵魂火符]: '灵魂火符', [技能魔次.飓风破]: '飓风破',
    [技能魔次.暴击术]: '暴击术', [技能魔次.霜月]: '霜月',
    [技能魔次.精准箭术]: '精准箭术', [技能魔次.万箭齐发]: '万箭齐发',
    [技能魔次.罗汉棍法]: '罗汉棍法', [技能魔次.天雷阵]: '天雷阵',
    [技能魔次.天枢]: '天枢', [技能魔次.血神]: '血神', [技能魔次.暗影]: '暗影',
    [技能魔次.烈焰]: '烈焰', [技能魔次.正义]: '正义', [技能魔次.不动]: '不动',
    [技能魔次.全体]: '全体',
    [技能魔次.怒斩]: '怒斩', [技能魔次.人之怒]: '人之怒',
    [技能魔次.地之怒]: '地之怒', [技能魔次.天之怒]: '天之怒', [技能魔次.神之怒]: '神之怒',
    [技能魔次.血气献祭]: '血气献祭', [技能魔次.血气燃烧]: '血气燃烧',
    [技能魔次.暗影袭杀]: '暗影袭杀', [技能魔次.暗影剔骨]: '暗影剔骨',
    [技能魔次.暗影风暴]: '暗影风暴', [技能魔次.暗影附体]: '暗影附体',
    [技能魔次.火焰追踪]: '火焰追踪', [技能魔次.烈焰护甲]: '烈焰护甲',
    [技能魔次.爆裂火冢]: '爆裂火冢', [技能魔次.烈焰突袭]: '烈焰突袭',
    [技能魔次.圣光]: '圣光', [技能魔次.行刑]: '行刑', [技能魔次.洗礼]: '洗礼',
    [技能魔次.如山]: '如山', [技能魔次.金刚掌]: '金刚掌',
}

// ==================== 辅助函数 ====================

/** 获取魔次名称 */
function 获取魔次名称(属性ID: number): string {
    return 魔次名称表[属性ID] || `未知(${属性ID})`
}

/** 判断是否为职业技能魔次 */
function 是职业技能魔次(属性ID: number): boolean {
    return 职业技能魔次集合.has(属性ID)
}

/** 获取转移花费 */
function 获取转移花费(属性ID: number): number {
    return 是职业技能魔次(属性ID) ? 职业魔次花费 : 普通魔次花费
}

/** 解析装备JSON */
function 解析装备JSON(装备: TUserItem): any {
    const desc = 装备.GetCustomDesc()
    if (!desc) return null
    try {
        return JSON.parse(desc)
    } catch {
        return null
    }
}

/** 初始化玩家变量 */
function 初始化变量(Player: TPlayObject): void {
    Player.R.魔次转移勾选 ??= {} as { [key: number]: boolean }
}

/** 检查装备是否有效 */
function 是有效装备(装备: TUserItem): boolean {
    return 有效装备类型.includes(装备.StdMode)
}

/** 获取魔次位置信息 */
function 获取魔次信息(装备: TUserItem, 装备JSON: any): Array<{ 位置: number, 属性ID: number, 属性值: string }> {
    const 结果: Array<{ 位置: number, 属性ID: number, 属性值: string }> = []
    if (!装备JSON || !装备JSON.职业属性_职业 || !装备JSON.职业属性_属性) return 结果

    for (let i = 职业第一条; i <= 职业第六条; i++) {
        const 属性ID = 装备.GetOutWay1(i)
        // 魔次属性ID范围在10000以上
        if (属性ID >= 10000) {
            // 在JSON数组中查找对应属性ID的索引
            const JSON索引 = 装备JSON.职业属性_职业.indexOf(属性ID)
            const 属性值 = JSON索引 >= 0 ? (装备JSON.职业属性_属性[JSON索引] || '0') : '0'
            结果.push({ 位置: i, 属性ID, 属性值 })
        }
    }
    return 结果
}

// ==================== 界面显示 ====================

/** 主入口 - 放入装备触发 */
export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    初始化变量(Player)
    Player.R.魔次空位转移 == false
    打开转移界面(Npc, Player)
}

/** 打开转移界面 */
export function 打开转移界面(Npc: TNormNpc, Player: TPlayObject): void {
    初始化变量(Player)

    const 主装备 = Player.GetCustomItem(0)
    const 副装备 = Player.GetCustomItem(1)
    const 勾选状态 = Player.R.魔次转移勾选 as { [key: number]: boolean }

    let S = `
        {S=魔次转移;C=254;X=220;Y=10}
        {S=功能:将主装备的魔次属性转移到副装备;C=154;X=20;Y=35}
        {S=花费:职业魔次(天枢/血神/暗影/烈焰/正义/不动/全体): ${职业魔次花费}主神点;C=251;X=20;Y=55}
        {S=花费:其他魔次: ${普通魔次花费}主神点;C=250;X=20;Y=75}
        {S=当前主神点: ${Player.GetGamePoint()|| 0};C=249;X=20;Y=95}
    `

    // 检查装备是否放入
    if (!主装备 || !副装备) {
        S += `{S=请将主装备放入上面,副装备放入下面;C=161;X=130;Y=150}`
        Npc.SayEx(Player, 'NPC中大窗口带2框', S)
        return
    }
    // 检查装备类型
    if (!是有效装备(主装备)) {
        S += `{S=主装备类型不支持转移;C=161;X=180;Y=150}`
        Npc.SayEx(Player, 'NPC中大窗口带2框', S)
        return
    }

    if (!是有效装备(副装备)) {
        S += `{S=副装备类型不支持转移;C=161;X=180;Y=150}`
        Npc.SayEx(Player, 'NPC中大窗口带2框', S)
        return
    }

    const 主装备JSON = 解析装备JSON(主装备)
    const 副装备JSON = 解析装备JSON(副装备)

    if (!主装备JSON) {
        S += `{S=主装备数据异常;C=161;X=200;Y=150}`
        Npc.SayEx(Player, 'NPC中大窗口带2框', S)
        return
    }

    if (!副装备JSON) {
        S += `{S=副装备数据异常;C=161;X=200;Y=150}`
        Npc.SayEx(Player, 'NPC中大窗口带2框', S)
        return
    }

    S += `{S=主装备: ${主装备.GetName()};C=250;X=80;Y=120}`
    S += `{S=副装备: ${副装备.GetName()};C=250;X=300;Y=120}`

    const 主装备魔次 = 获取魔次信息(主装备, 主装备JSON)
    const 副装备魔次 = 获取魔次信息(副装备, 副装备JSON)

    if (主装备魔次.length === 0) {
        S += `{S=主装备没有魔次属性;C=252;X=180;Y=170}`
        Npc.SayEx(Player, 'NPC中大窗口带2框', S)
        return
    }

    S += `{S=━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━;C=154;X=10;Y=140}`
    S += `{S=勾选;C=251;X=20;Y=210}{S=主装备魔次;C=251;X=80;Y=160}{S=副装备魔次;C=251;X=250;Y=160}{S=花费;C=251;X=420;Y=160}`

    let Y坐标 = 180
    for (let i = 0; i < 主装备魔次.length; i++) {
        const 主魔次 = 主装备魔次[i]
        const 名称 = 获取魔次名称(主魔次.属性ID)
        const 数值简写 = 大数值整数简写(主魔次.属性值)
        const 花费 = 获取转移花费(主魔次.属性ID)
        const 颜色 = 是职业技能魔次(主魔次.属性ID) ? 249 : 250
        const 图标 = 勾选状态[主魔次.位置] ? '31' : '30'

        // 查找副装备对应位置
        const 副魔次 = 副装备魔次.find(m => m.位置 === 主魔次.位置)
        let 副装备显示 = '无'
        if (副魔次) {
            副装备显示 = `${获取魔次名称(副魔次.属性ID)}:${大数值整数简写(副魔次.属性值)}`
        }

        S += `<{I=${图标};F=装备图标.DATA;X=20;Y=${Y坐标}}/@魔次转移.勾选位置(${主魔次.位置})>`
        S += `{S=${名称}:${数值简写};C=${颜色};X=80;Y=${Y坐标};HINT=属性值:${主魔次.属性值}}`
        S += `{S=${副装备显示};C=154;X=250;Y=${Y坐标}}`
        S += `{S=${花费}点;C=251;X=420;Y=${Y坐标}}`
        Y坐标 += 25
    }

    S += `{S=━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━;C=154;X=10;Y=${Y坐标}}`
    Y坐标 += 25

    // 空位转移勾选框
    const 空位转移图标 = Player.R.魔次空位转移 ? '31' : '30'
    S += `<{I=${空位转移图标};F=装备图标.DATA;X=20;Y=${Y坐标}}/@魔次转移.勾选空位转移>`
    S += `{S=允许空位转移;C=154;X=50;Y=${Y坐标};HINT=勾选后可将魔次转移到副装备的空位置#92需累计充值达到一定额度才可使用!}`


    S += `<{S=[执行转移];C=254;X=400;Y=${Y坐标}}/@魔次转移.执行转移>`
    S += `<{S=[全选];C=250;X=200;Y=${Y坐标}}/@魔次转移.全选>`
    S += `<{S=[清空];C=154;X=300;Y=${Y坐标}}/@魔次转移.清空选择>`

    Npc.SayEx(Player, 'NPC中大窗口带2框', S)
}

// ==================== 交互功能 ====================

/** 勾选空位转移 */
export function 勾选空位转移(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    if(Player.V.真实累充 < 6000) {        
        Player.MessageBox('累计充值不足6000，无法使用此功能。')
        return
    }
    Player.R.魔次空位转移 = !Player.R.魔次空位转移
    打开转移界面(Npc, Player)
}

/** 勾选位置 */
export function 勾选位置(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    初始化变量(Player)
    const 位置 = Args.Int[0]
    const 勾选状态 = Player.R.魔次转移勾选 as { [key: number]: boolean }
    勾选状态[位置] = !勾选状态[位置]
    Player.R.魔次转移勾选 = 勾选状态
    打开转移界面(Npc, Player)
}

/** 全选 */
export function 全选(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    初始化变量(Player)
    const 主装备 = Player.GetCustomItem(0)
    if (!主装备) {
        打开转移界面(Npc, Player)
        return
    }

    const 主装备JSON = 解析装备JSON(主装备)
    if (!主装备JSON) {
        打开转移界面(Npc, Player)
        return
    }

    const 主装备魔次 = 获取魔次信息(主装备, 主装备JSON)
    const 勾选状态 = Player.R.魔次转移勾选 as { [key: number]: boolean }

    for (const 魔次 of 主装备魔次) {
        勾选状态[魔次.位置] = true
    }
    Player.R.魔次转移勾选 = 勾选状态
    打开转移界面(Npc, Player)
}

/** 清空选择 */
export function 清空选择(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.R.魔次转移勾选 = {}
    打开转移界面(Npc, Player)
}

/** 执行转移 */
export function 执行转移(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    初始化变量(Player)

    const 主装备 = Player.GetCustomItem(0)
    const 副装备 = Player.GetCustomItem(1)

    if (!主装备 || !副装备) {
        Player.MessageBox('请将主装备放入第一格,副装备放入第二格')
        return
    }

    if (!是有效装备(主装备) || !是有效装备(副装备)) {
        Player.MessageBox('装备类型不支持转移')
        return
    }

    const 主装备JSON = 解析装备JSON(主装备)
    const 副装备JSON = 解析装备JSON(副装备)

    if (!主装备JSON || !副装备JSON) {
        Player.MessageBox('装备数据异常')
        return
    }

    const 主装备魔次 = 获取魔次信息(主装备, 主装备JSON)
    const 副装备魔次 = 获取魔次信息(副装备, 副装备JSON)
    const 勾选状态 = Player.R.魔次转移勾选 as { [key: number]: boolean }

    // 筛选已勾选的位置
    const 待转移 = 主装备魔次.filter(m => 勾选状态[m.位置])

    if (待转移.length === 0) {
        Player.MessageBox('请先勾选要转移的魔次位置')
        return
    }

    // 检查副装备对应位置是否有魔次（空位转移检查）
    const 允许空位转移 = Player.R.魔次空位转移 === true
    if (!允许空位转移) {
        for (const 魔次 of 待转移) {
            const 副装备对应魔次 = 副装备魔次.find(m => m.位置 === 魔次.位置)
            if (!副装备对应魔次) {
                Player.MessageBox(`副装备第${魔次.位置 - 职业第一条 + 1}个魔次位置为空,不允许转移到空位置!\\如需转移到空位置,请先开启[允许空位转移]选项`)
                return
            }
        }
    }

    // 计算总花费
    let 总花费 = 0
    for (const 魔次 of 待转移) {
        总花费 += 获取转移花费(魔次.属性ID)
    }

    const 当前主神点 = Player.GetGamePoint() || 0
    if (当前主神点 < 总花费) {
        Player.MessageBox(`主神点不足,需要${总花费}点,当前${当前主神点}点`)
        return
    }

    // 执行转移
    副装备JSON.职业属性_职业 = 副装备JSON.职业属性_职业 || []
    副装备JSON.职业属性_属性 = 副装备JSON.职业属性_属性 || []

    let 转移数量 = 0
    for (const 魔次 of 待转移) {
        // 更新副装备OutWay
        副装备.SetOutWay1(魔次.位置, 魔次.属性ID)
        副装备.SetOutWay2(魔次.位置, 主装备.GetOutWay2(魔次.位置))
        副装备.SetOutWay3(魔次.位置, 主装备.GetOutWay3(魔次.位置))

        // 更新副装备JSON：查找副装备中是否已有该属性ID
        const 已有索引 = 副装备JSON.职业属性_职业.indexOf(魔次.属性ID)
        if (已有索引 >= 0) {
            副装备JSON.职业属性_属性[已有索引] = 魔次.属性值
        } else {
            副装备JSON.职业属性_职业.push(魔次.属性ID)
            副装备JSON.职业属性_属性.push(魔次.属性值)
        }

        // 删除主装备魔次：清空OutWay
        主装备.SetOutWay1(魔次.位置, 0)
        主装备.SetOutWay2(魔次.位置, 0)
        主装备.SetOutWay3(魔次.位置, 0)

        // 删除主装备JSON中的魔次
        const 主装备魔次索引 = 主装备JSON.职业属性_职业.indexOf(魔次.属性ID)
        if (主装备魔次索引 >= 0) {
            主装备JSON.职业属性_职业.splice(主装备魔次索引, 1)
            主装备JSON.职业属性_属性.splice(主装备魔次索引, 1)
        }

        转移数量++
    }

    // 保存副装备
    副装备.SetCustomDesc(JSON.stringify(副装备JSON))
    Player.UpdateItem(副装备)

    // 保存主装备
    主装备.SetCustomDesc(JSON.stringify(主装备JSON))
    Player.UpdateItem(主装备)

    // 扣除主神点
    Player.SetGamePoint(当前主神点 - 总花费)

    // 清空勾选状态
    Player.R.魔次转移勾选 = {}

    Player.MessageBox(`成功转移${转移数量}个魔次属性,花费${总花费}主神点`)

    // 刷新属性
    装备属性统计(Player)
    打开转移界面(Npc, Player)
}
