import { BOSS技能1, BOSS技能2, BOSS技能3, BOSS技能4, 怪物技能1ID, 怪物技能1几率, 怪物技能4ID, 怪物技能4几率 } from "../基础常量"

/**
 * 怪物随机技能信息接口
 */
export interface 怪物技能信息 {
    技能1: string
    技能2: string
    技能3: string
    技能4: string
    距离: number
    技能几率: number
    技能ID: number
    攻速移速: number
}

/**
 * 根据技能名称获取技能配置（距离、几率、ID）
 */
function 获取技能配置(技能名称: string): { 距离: number; 技能几率: number; 技能ID: number } {
    let 距离 = 1
    let 技能几率 = 0
    let 技能ID = 0

    switch (技能名称) {
        case '火球术': 距离 = 5; 技能几率 = 100; 技能ID = 10030; break
        case '疾光电影': 距离 = 5; 技能几率 = 80; 技能ID = 10031; break
        case '爆裂火焰': 距离 = 5; 技能几率 = 50; 技能ID = 10032; break
        case '地狱雷光': 距离 = 3; 技能几率 = 80; 技能ID = 10033; break
        case '半月弯刀': 距离 = 1; 技能几率 = 100; 技能ID = 10034; break
        case '攻杀剑术': 距离 = 1; 技能几率 = 100; 技能ID = 10035; break
        case '治愈术': 距离 = 1; 技能几率 = 10; 技能ID = 10036; break
        case '刺杀剑术': 距离 = 1; 技能几率 = 100; 技能ID = 10037; break
        case '烈火剑法': 距离 = 1; 技能几率 = 50; 技能ID = 10038; break
        case '冰咆哮': 距离 = 5; 技能几率 = 80; 技能ID = 10039; break
        // case '气功波': 距离 = 1; 技能几率 = 10; 技能ID = 10040; break
        case '雷电术': 距离 = 5; 技能几率 = 100; 技能ID = 10041; break
        case '气功波': 距离 = 5; 技能几率 = 80; 技能ID = 10042; break
        case '寒冰掌': 距离 = 5; 技能几率 = 50; 技能ID = 10043; break
        case '噬血术': 距离 = 5; 技能几率 = 20; 技能ID = 10044; break
        case '灭天火': 距离 = 5; 技能几率 = 50; 技能ID = 10045; break
        case '流星火雨': 距离 = 5; 技能几率 = 80; 技能ID = 10046; break
        case '灵魂火符': 距离 = 5; 技能几率 = 20; 技能ID = 10047; break
        case '飓风破': 距离 = 5; 技能几率 = 20; 技能ID = 10048; break
        case '倚天辟地': 距离 = 1; 技能几率 = 10; 技能ID = 10049; break
        case '彻地钉': 距离 = 5; 技能几率 = 20; 技能ID = 10050; break
        case '群体雷电术': 距离 = 5; 技能几率 = 20; 技能ID = 10051; break
    }

    return { 距离, 技能几率, 技能ID }
}

/**
 * 根据技能2获取攻速移速
 */
function 获取攻速移速(技能2: string): number {
    let 攻速移速 = 1000
    switch (技能2) {
        case '高速': 攻速移速 = 800; break
        case '急速': 攻速移速 = 600; break
        case '神速': 攻速移速 = 300; break
    }
    return 攻速移速
}

/**
 * 为怪物添加随机技能
 * @param 取尾数 怪物的Tag值
 * @returns 怪物技能信息对象
 */
export function 生成怪物随机技能(取尾数: number): 怪物技能信息 {
    let 技能名字 = ['火球术', '极光电影', '爆裂火焰', '地狱雷光', '半月弯刀', '攻杀剑术', '治愈术', '刺杀剑术', '烈火剑法', '雷电术', '气功波', '寒冰掌', '噬血术', '灭天火',
        '流星火雨', '灵魂火符', '飓风破', '冰咆哮', '倚天辟地', '彻地钉', '群体雷电术', '万箭齐发']
    let 被动技能 = ['高速', '急速', '神速', '健体', '强身', '强壮', '肉盾', '抗体', '不催', '勇猛', '强攻', '穿透']
    let 被动技能无用 = ['静态', '腐败', '震撼', '光荣', '腐烂', '腐蚀', '寒冬', '维持', '瘟疫', '残忍', '野蛮', '崇高', '颤抖', '发光', '雪王', '恶毒', '残酷', '剧毒', '翁叫', '结实', '稳重', '海蛇', '龙', '巴哈姆', '神圣', '弯曲', '诅咒']

    let 技能1 = ''
    let 技能2 = ''
    let 技能3 = ''
    let 技能4 = ''

    let 怪物技能1 = 技能名字[random(技能名字.length)]
    技能名字 = 技能名字.filter(where => where != 怪物技能1)

    // 根据取尾数随机选择技能
    if (取尾数 == 15 || 取尾数 == 16 || 取尾数 == 17 || 取尾数 == 18 || 取尾数 == 19 || 取尾数 == 10 || 取尾数 == 21) {
        技能1 = 怪物技能1
        if (取尾数 == 16 && random(100) < 20) {
            技能2 = 被动技能[random(被动技能.length)]
            技能3 = 被动技能无用[random(被动技能无用.length)]
        } else if (取尾数 == 16) {
            技能2 = 被动技能[random(被动技能.length)]
        }
        if (random(100) < 20) {
            技能2 = 被动技能[random(被动技能.length)]
            技能3 = 被动技能无用[random(被动技能无用.length)]
            技能4 = 技能名字[random(技能名字.length)]
        } else {
            技能2 = 被动技能[random(被动技能.length)]
            技能3 = 被动技能无用[random(被动技能无用.length)]
        }
    } else if (random(100) < 20) {
        技能1 = 技能名字[random(技能名字.length)]
        技能2 = 被动技能[random(被动技能.length)]
    } else if (random(100) < 40) {
        技能1 = 技能名字[random(技能名字.length)]
    }

    // 获取技能配置（优先使用技能4，如果没有则使用技能1）
    let 技能配置 = { 距离: 1, 技能几率: 0, 技能ID: 0 }
    if (技能4 != '') {
        技能配置 = 获取技能配置(技能4)
    } else if (技能1 != '') {
        技能配置 = 获取技能配置(技能1)
    }

    // 获取攻速移速
    let 攻速移速 = 获取攻速移速(技能2)

    return {
        技能1,
        技能2,
        技能3,
        技能4,
        距离: 技能配置.距离,
        技能几率: 技能配置.技能几率,
        技能ID: 技能配置.技能ID,
        攻速移速
    }
}

/**
 * 根据技能2获取血量倍数（相对于基础值的倍数，例如120表示1.2倍）
 * @param 技能2 被动技能名称
 * @returns 倍数（100表示1倍，120表示1.2倍）
 */
export function 获取技能2血量倍数(技能2: string): number {
    switch (技能2) {
        case '健体': return 1.2
        case '强身': return 1.5
        case '强壮': return 2
        default: return 1
    }
}

/**
 * 根据技能2获取攻击倍数（相对于基础值的倍数）
 * @param 技能2 被动技能名称
 * @returns 倍数（100表示1倍，120表示1.2倍）
 */
export function 获取技能2攻击倍数(技能2: string): number {
    switch (技能2) {
        case '勇猛': return 1.2
        case '强攻': return 1.5
        case '穿透': return 2
        default: return 1
    }
}

/**
 * 根据技能2获取防御倍数（相对于基础值的倍数）
 * @param 技能2 被动技能名称
 * @returns 倍数（100表示1倍，120表示1.2倍）
 */
export function 获取技能2防御倍数(技能2: string): number {
    switch (技能2) {
        case '肉盾': return 1.2
        case '抗体': return 1.5
        case '不催': return 2
        default: return 1
    }
}

/**
 * 设置怪物的技能相关变量
 * @param Monster 怪物对象
 * @param 技能信息 怪物技能信息
 */
export function 设置怪物技能变量(Monster: TActor, 技能信息: 怪物技能信息): void {
    Monster.SetNVar(怪物技能1几率, 技能信息.技能几率)
    Monster.SetNVar(怪物技能1ID, 技能信息.技能ID)
    Monster.SetNVar(怪物技能4ID, 技能信息.技能ID)
    Monster.SetNVar(怪物技能4几率, 技能信息.技能几率)

    // 设置BOSS技能变量
    if (技能信息.技能1 != '') {
        Monster.SetSVar(BOSS技能1, 技能信息.技能1)
    }
    if (技能信息.技能2 != '') {
        Monster.SetSVar(BOSS技能2, 技能信息.技能2)
    }
    if (技能信息.技能3 != '') {
        Monster.SetSVar(BOSS技能3, 技能信息.技能3)
    }
    if (技能信息.技能4 != '') {
        Monster.SetSVar(BOSS技能4, 技能信息.技能4)
    }
}

/**
 * 根据技能组合生成怪物名字后缀
 * @param 技能信息 怪物技能信息
 * @param 原始名字 怪物的原始名字
 * @param 阶段 怪物阶段
 * @param 星数简写 星数简写字符串
 * @returns 怪物名字后缀（例如："火球术★高速★僵尸[100]阶\\魔化10星"）
 */
export function 生成怪物技能名字(技能信息: 怪物技能信息, 原始名字: string,): string {
    if (技能信息.技能4 != '') {
        return `${技能信息.技能1}★${技能信息.技能2}★${技能信息.技能3}★${技能信息.技能4}★${原始名字}`
    } else if (技能信息.技能3 != '') {
        return `${技能信息.技能1}★${技能信息.技能2}★${技能信息.技能3}★${原始名字}`
    } else if (技能信息.技能2 != '') {
        return `${技能信息.技能1}★${技能信息.技能2}★${原始名字}`
    } else if (技能信息.技能1 != '') {
        return `${技能信息.技能1}★${原始名字}`
    } else {
        return `★${原始名字}`
    }
}

