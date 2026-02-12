import { js_number, js_numberRandom2 } from "../../全局脚本[公共单元]/utils/计算方法"
import { 删除属性, 删除职业, 数字转单位2, 数字转单位3, 新返回, 添加属性, 添加职业 } from "../../大数值版本/字符计算"
import { 种族第四, 种族第五, 职业分割, 装备特效 } from "../[装备]/_ITEM_Base"

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\\\
                                  装备拆分说明\\\\\\\\\\\\
                               {S=拆分装备几率100%;C=250}\\
                               {S=拆分成功后装备将消失;C=106}\\\\
                                     <{S=开始拆分;C=253}/@开始拆分>\\\\
                 <{S=装备拆分;Hint=抽出装备中部分属性}/@Main>      <{S=装备重组;Hint=组装成超级蓝装}/@装备重组>      <{S=炼化粉装;Hint=将蓝装炼化成粉装}/@炼化粉装>      <{S=炼化黄装;Hint=将粉装炼化成黄装}/@炼化黄装>
`
    Npc.SayEx(Player, 'NPC中窗口带2框返回', S)
}



const 拆分值 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 28, 29, 30, 31, 32, 33, 34]
const 物品来源值 = [
    95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
    116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135,
    136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
    156, 157, 158, 159, 160, 161, 162, 163, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208,
    209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236,
    300, 301, 302, 303, 304, 305, 306, 310, 350, 351, 352, 620, 621, 622, 623, 624, 625, 626, 627, 628, 
    650, 651, 652, 653, 654, 
]
export function 开始拆分(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 装备名称 = ''
    let 装备 = Player.GetCustomItem(0)
    let 材料 = Player.GetCustomItem(1)
    let 数组1 = []
    let 数组2 = []
    let 数组3 = []
    let 基本属性_职业 = []
    let 基本属性_数值 = []
    let 装备属性记录 = {
        职业属性_职业: 基本属性_职业,
        职业属性_属性: 基本属性_数值,
    }
   
    if (装备 == null) { Player.MessageBox('请放入装备在进行拆分!'); return }
    if (材料 == null) { Player.MessageBox('请放入超级蓝水晶在进行拆分!'); return }
    if (装备.GetName().includes('艾维') || 装备.GetName().includes('阿拉贡') || 装备.GetName().includes('缺月')) { Player.MessageBox('请放入正确装备在进行拆分!'); return }
    for (let a = 0; a < 拆分值.length; a++) {
        if (物品来源值.includes(装备.GetOutWay1(a))) {
            数组1.push(装备.GetOutWay1(a))
            数组2.push(装备.GetOutWay2(a))
            数组3.push(装备.GetOutWay3(a))
        }
    }
    if (数组1.length < 1) { Player.MessageBox('装备上没有可拆分的属性!'); return }
    if (装备.DisplayName.includes('[蓝装]') || 装备.DisplayName.includes('[粉装]') || 装备.DisplayName.includes('[黄装]')) { Player.MessageBox('此装备无法进行拆分!'); return }
    if (!材料.DisplayName.includes('超级蓝水晶')) { Player.MessageBox('请放入超级蓝水晶再进行拆分!'); return }
    if (材料.GetOutWay1(0) > 0) { Player.MessageBox('超级蓝水晶已经被使用过!'); return }


    switch (true) {
        case 装备.StdMode == 5 || 装备.StdMode == 6: 装备名称 = '(武器)'; break
        case 装备.StdMode == 10 || 装备.StdMode == 11: 装备名称 = '(衣服)'; break
        case 装备.StdMode == 15: 装备名称 = '(头盔)'; break
        case 装备.StdMode == 19 || 装备.StdMode == 20 || 装备.StdMode == 21: 装备名称 = '(项链)'; break
        case 装备.StdMode == 22 || 装备.StdMode == 23: 装备名称 = '(戒指)'; break
        case 装备.StdMode == 24 || 装备.StdMode == 26: 装备名称 = '(手镯)'; break
        case 装备.StdMode == 27: 装备名称 = '(腰带)'; break
        case 装备.StdMode == 28: 装备名称 = '(靴子)'; break
    }
    let 随机 = random(数组1.length)
    let 随机1 = 数组1[随机]
    let 随机2 = 数组2[随机]
    let 随机3 = 数组3[随机]

    // console.log(数组1)
    // console.log(数组2)
    // console.log(数组3)

    材料.SetOutWay1(0, 21)
    材料.SetOutWay1(1, 随机1)
    材料.SetOutWay2(1, 随机2)
    材料.SetOutWay3(1, 随机3)
    if (材料.GetOutWay1(1) == 300 || 材料.GetOutWay1(1) == 303 || 材料.GetOutWay1(1) == 350 || 材料.GetOutWay1(1) == 351 || 材料.GetOutWay1(1) == 352 || (材料.GetOutWay1(1) >= 195 && 材料.GetOutWay1(1) <= 236)) {
        材料.SetCustomCaption(0, js_number(随机2, 新返回(随机3),3))
    }
    材料.SetCustomEffect(装备特效.超级蓝水晶)
    材料.Rename(材料.GetName() + 装备名称 + `等级(${装备.GetNeedLevel()})`)
    材料.SetNeedLevel(装备.GetNeedLevel())
    Player.DeleteItem(装备, 1)
    Player.UpdateItem(材料)
    Player.MessageBox('拆分完毕,请查看超级蓝水晶!')
    if (Player.V.任务2 == false) {
        Player.V.任务2 = true
    }

    Main(Npc, Player, Args)
}

const 材料啊 = [
    { 类型: '武器', 得到: '武器' },
    { 类型: '衣服', 得到: '衣服' },
    { 类型: '头盔', 得到: '头盔' },
    { 类型: '戒指', 得到: '戒指' },
    { 类型: '手镯', 得到: '手镯' },
    { 类型: '项链', 得到: '项链' },
    { 类型: '腰带', 得到: '腰带' },
    { 类型: '靴子', 得到: '靴子' },
]
const 装备啊 = [
    { 类型: '武器', st: 5, st1: 6 },
    { 类型: '衣服', st: 10, st1: 11 },
    { 类型: '头盔', st: 15, st1: 15 },
    { 类型: '戒指', st: 22, st1: 23 },
    { 类型: '手镯', st: 24, st1: 26 },
    { 类型: '项链', st: 19, st1: 20 },
    { 类型: '腰带', st: 27, st1: 27 },
    { 类型: '靴子', st: 28, st1: 28 },
]
export function 装备重组(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\\\\\\\\\\\\\\\
                                装备重组说明\\
                          {S=上面框放入带[底材]的装备;C=154}\\
              {S=下面3个框放入3颗不同属性并且与装备部位相同的超级蓝水晶;C=154}\\\\
                                 <{S=开始重组;C=253}/@开始重组>\\\\
            <{S=装备拆分;Hint=抽出装备中部分属性}/@Main>      <{S=装备重组;Hint=组装成超级蓝装}/@装备重组>      <{S=炼化粉装;Hint=将蓝装炼化成粉装}/@炼化粉装>      <{S=炼化黄装;Hint=将粉装炼化成黄装}/@炼化黄装>
`
    Npc.SayEx(Player, 'NPC中窗口带4框', S)
}

const 装备类型 = [4, 5, 6, 10, 11, 15, 19, 20, 21, 22, 23, 24, 26, 27, 28]
export function 开始重组(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let a = ''
    let 装备 = Player.GetCustomItem(0)
    let 材料1 = Player.GetCustomItem(1)
    let 材料2 = Player.GetCustomItem(2)
    let 材料3 = Player.GetCustomItem(3)
    let 基本属性_职业 = []
    let 基本属性_数值 = []
    let 装备属性记录 = {
        职业属性_职业: 基本属性_职业,
        职业属性_属性: 基本属性_数值,
    }

    if (装备 == null || !装备.DisplayName.includes('底材')) { Player.MessageBox('请将带[底材]的装备放入上面框!'); return }
    if (!装备类型.includes(装备.StdMode)) { Player.MessageBox('请放入正确装备进行重组!'); return }
    if (材料1 == null || !材料1.DisplayName.includes('超级蓝水晶')) { Player.MessageBox('请将带有属性的超级蓝水晶放入左边框!'); return }
    if (材料2 == null || !材料2.DisplayName.includes('超级蓝水晶')) { Player.MessageBox('请将带有属性的超级蓝水晶放入中间框!'); return }
    if (材料3 == null || !材料3.DisplayName.includes('超级蓝水晶')) { Player.MessageBox('请将带有属性的超级蓝水晶放入右边框!'); return }
    if (材料1.GetOutWay1(1) < 1) { Player.MessageBox('左边框超级蓝水晶没有属性无法重组!'); return }
    if (材料2.GetOutWay1(1) < 1) { Player.MessageBox('中间框超级蓝水晶没有属性无法重组!'); return }
    if (材料3.GetOutWay1(1) < 1) { Player.MessageBox('右边框超级蓝水晶没有属性无法重组!'); return }
    if (材料1.GetOutWay1(1) == 材料2.GetOutWay1(1) || 材料1.GetOutWay1(1) == 材料3.GetOutWay1(1)) { Player.MessageBox('相同技能无法进行重组!'); return }
    if (材料2.GetOutWay1(1) == 材料3.GetOutWay1(1)) { Player.MessageBox('相同技能无法进行重组!'); return }
    if (材料1.GetNeedLevel() > 装备.GetNeedLevel()) { Player.MessageBox(`${材料1.DisplayName}等级大于${装备.DisplayName}等级,无法进行重组!`); return }
    if (材料2.GetNeedLevel() > 装备.GetNeedLevel()) { Player.MessageBox(`${材料2.DisplayName}等级大于${装备.DisplayName}等级,无法进行重组!`); return }
    if (材料3.GetNeedLevel() > 装备.GetNeedLevel()) { Player.MessageBox(`${材料3.DisplayName}等级大于${装备.DisplayName}等级,无法进行重组!`); return }
    for (let 循环 of 材料啊) {
        if (材料1.DisplayName.includes(循环.类型)) {
            if (!材料2.DisplayName.includes(循环.得到) || !材料3.DisplayName.includes(循环.得到)) { Player.MessageBox('超级蓝水晶类型不相同无法进行重组!'); return }
        }
    }
    for (let 循环 of 装备啊) {
        if (材料1.DisplayName.includes(循环.类型)) {
            if (装备.StdMode != 循环.st && 装备.StdMode != 循环.st1) { Player.MessageBox('超级蓝水晶类型与底材装备类型不相同,无法进行重组!'); return }
        }
    }
    if (装备.GetOutWay3(40) > 0) { Player.MessageBox('增强后的装备不允许进行重组!'); return }


    // console.log(材料1.GetCustomCaption(0))
    // console.log(材料2.GetCustomCaption(0))
    // console.log(材料3.GetCustomCaption(0))

    装备.SetOutWay1(职业分割, 21)

    if (材料1.GetCustomCaption(0) == '') {
        装备.SetOutWay1(12, 材料1.GetOutWay1(1))
        装备.SetOutWay2(12, 材料1.GetOutWay2(1))
    } else {
        if(材料1.GetCustomCaption(0) == '0'){
            装备.SetOutWay1(12, 材料1.GetOutWay1(1))
            装备.SetOutWay2(12, 材料1.GetOutWay2(1))
        } else {
            let 前端数字 = 数字转单位2((材料1.GetCustomCaption(0)))
            let 后端单位 = 数字转单位3((材料1.GetCustomCaption(0)))
            装备.SetOutWay1(12, 材料1.GetOutWay1(1))
            装备.SetOutWay2(12, Number(前端数字))
            装备.SetOutWay3(12, Number(后端单位))
            装备.SetCustomDesc(JSON.stringify(添加职业(装备, 材料1.GetOutWay1(1))))
            装备.SetCustomDesc(JSON.stringify(添加属性(装备, 材料1.GetCustomCaption(0))))
        }
    }
    if (材料2.GetCustomCaption(0) == '') {
        装备.SetOutWay1(13, 材料2.GetOutWay1(1))
        装备.SetOutWay2(13, 材料2.GetOutWay2(1))
    } else {
        if(材料2.GetCustomCaption(0) == '0'){
            装备.SetOutWay1(13, 材料2.GetOutWay1(1))
            装备.SetOutWay2(13, 材料2.GetOutWay2(1))
        } else {
            let 前端数字 = 数字转单位2((材料2.GetCustomCaption(0)))
            let 后端单位 = 数字转单位3((材料2.GetCustomCaption(0)))
            装备.SetOutWay1(13, 材料2.GetOutWay1(1))
            装备.SetOutWay2(13, Number(前端数字))
            装备.SetOutWay3(13, Number(后端单位))
            装备.SetCustomDesc(JSON.stringify(添加职业(装备, 材料2.GetOutWay1(1))))
            装备.SetCustomDesc(JSON.stringify(添加属性(装备, 材料2.GetCustomCaption(0))))
        }
    }
    if (材料3.GetCustomCaption(0) == '') {
        装备.SetOutWay1(14, 材料3.GetOutWay1(1))
        装备.SetOutWay2(14, 材料3.GetOutWay2(1))
    } else {
        if(材料3.GetCustomCaption(0) == '0'){
            装备.SetOutWay1(14, 材料3.GetOutWay1(1))
            装备.SetOutWay2(14, 材料3.GetOutWay2(1))
        } else {
            let 前端数字 = 数字转单位2((材料3.GetCustomCaption(0)))
            let 后端单位 = 数字转单位3((材料3.GetCustomCaption(0)))
            装备.SetOutWay1(14, 材料3.GetOutWay1(1))
            装备.SetOutWay2(14, Number(前端数字))
            装备.SetOutWay3(14, Number(后端单位))
            装备.SetCustomDesc(JSON.stringify(添加职业(装备, 材料3.GetOutWay1(1))))
            装备.SetCustomDesc(JSON.stringify(添加属性(装备, 材料3.GetCustomCaption(0))))
        }
    }
    装备.SetColor(154)
    if (装备.GetOutWay3(0) >= 1) {
        a = 装备.DisplayName.split('[底材]')[0]
        装备.Rename(a + '[蓝装]' + `『${装备.GetOutWay3(0)}』`)
    } else {
        a = 装备.DisplayName.split('[底材]')[0]
        装备.Rename(a + '[蓝装]')
    }
    装备.SetBind(true)
    装备.SetNeverDrop(true)
    装备.State.SetNoDrop(true)
    Player.UpdateItem(装备)
    Player.DeleteItem(材料1, 1)
    Player.DeleteItem(材料2, 1)
    Player.DeleteItem(材料3, 1)
    Player.MessageBox(`装备重组完毕,请查看!`)
    装备重组(Npc, Player, Args)
    if (Player.V.任务3 == false) {
        Player.V.任务3 = true
    }
}
const 职业技能重数 = [
    { 职业: '战神', 技能重数: [95, 96, 105, 106, 107, 108, 109], 倍攻: [195, 196, 207, 208, 209] },
    { 职业: '骑士', 技能重数: [95, 96, 110, 111, 112, 113, 114], 倍攻: [195, 196, 210, 211, 212] },
    { 职业: '火神', 技能重数: [97, 100, 115, 116, 117, 118], 倍攻: [197, 199, 213, 214] },
    { 职业: '冰法', 技能重数: [97, 100, 119, 120, 121, 122], 倍攻: [197, 199, 215, 216, 217] },
    { 职业: '驯兽师', 技能重数: [98, 99, 101, 123, 124, 125, 126, 161], 倍攻: [198, 200, 206, 306] },
    { 职业: '牧师', 技能重数: [98, 99, 101, 127, 128, 129, 130, 131], 倍攻: [198, 200, 218, 219, 220] },
    { 职业: '刺客', 技能重数: [102, 132, 133, 134, 135], 倍攻: [201, 221, 222] },
    { 职业: '鬼舞者', 技能重数: [102, 136, 137, 138, 139, 140], 倍攻: [201, 223, 224, 225] },
    { 职业: '神射手', 技能重数: [141, 142, 143, 144, 145], 倍攻: [226, 227, 228] },
    { 职业: '猎人', 技能重数: [146, 147, 148, 149, 160], 倍攻: [229, 230, 205, 306] },
    { 职业: '武僧', 技能重数: [103, 104, 150, 151, 152, 153, 154], 倍攻: [202, 203, 231, 232, 233] },
    { 职业: '罗汉', 技能重数: [103, 104, 155, 156, 157, 158, 159], 倍攻: [202, 203, 234, 235] },
]
const 全体倍攻 = 204
const 全体宝宝倍攻 = 205
const 武器速度 = 310
const 伤害减少 = 301
const 造成伤害 = 300
const 击中恢复生命 = 303
const 所有技能等级 = 304
const 吸血比例 = 302
const 宝宝速度 = 305
const 宝宝倍攻 = 306
const 抵抗异常 = 307
const 种族属性 = [350, 351, 352]
const 天赋属性 = [620, 621, 622, 623, 624, 625, 626, 627, 628]
export function 炼化粉装(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\\\
                                  炼化粉装说明\\\\\\\\\\\\
                         {S=将蓝装炼化成粉装,随机增加一条属性;C=253}\\
                         {S=超级粉水晶可反复炼化;C=253}\\\\
                                     <{S=炼化粉装;C=253}/@开始炼化粉>\\\\
                 <{S=装备拆分;Hint=抽出装备中部分属性}/@Main>      <{S=装备重组;Hint=组装成超级蓝装}/@装备重组>      <{S=炼化粉装;Hint=将蓝装炼化成粉装}/@炼化粉装>      <{S=炼化黄装;Hint=将粉装炼化成黄装}/@炼化黄装>
`
    Npc.SayEx(Player, 'NPC中窗口带2框', S)
}

export function 开始炼化粉(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let a = ''
    let 数值 = `0`
    let ot1 = 0
    let 装备 = Player.GetCustomItem(0)
    let 材料 = Player.GetCustomItem(1)
    if (装备 == null || (!装备.DisplayName.includes('蓝装') && !装备.DisplayName.includes('粉装'))) { Player.MessageBox('请将带[蓝装]或[粉装]的装备放入左边框!'); return }
    if (材料 == null || !材料.DisplayName.includes('粉水晶')) { Player.MessageBox('请将粉水晶或超级粉水晶放入右边框!'); return }
    if (材料.GetName() == '粉水晶' && 装备.GetOutWay1(种族第四) > 0) { Player.MessageBox('粉水晶已经无法炼化,请换成超级粉水晶!'); return }
    if (装备.GetOutWay3(40) > 0) { Player.MessageBox('增强后的装备不允许进行炼化!'); return }
    
    if (材料.GetName() == '粉水晶' || 材料.GetName() == '超级粉水晶') {
        // let 星星数量 = 装备.GetOutWay2(0)
        let 星星数量 = 装备.GetCustomCaption(0)
        if (装备.GetCustomCaption(1) == '1') {
            let 装备字符串 = JSON.parse(装备.GetCustomDesc())
            if (Array.isArray(装备字符串["职业属性_职业"])) {
                装备字符串["职业属性_职业"].pop();
            }
            if (Array.isArray(装备字符串["职业属性_属性"])) {
                装备字符串["职业属性_属性"].pop();
            }
            装备.SetCustomCaption(1, '')
            装备.SetCustomDesc(JSON.stringify(装备字符串))
        }
        for (let 循环 of 职业技能重数) {
            if (装备.DisplayName.includes(循环.职业)) {
                if (random(100) < 20) {
                    if (装备.StdMode == 5 || 装备.StdMode == 6) {
                        if (random(100) < 20) {
                            装备.SetOutWay1(种族第四, 武器速度)
                            装备.SetOutWay2(种族第四, 1 + random(10))
                        } else {
                            if (random(100) < 50) {
                                装备.SetOutWay1(种族第四, 全体倍攻)
                                for (let 循环 of 倍攻几率) {
                                    if (装备.GetNeedLevel() == 循环.装备等级) {
                                        if (random(100) < 循环.几率) {
                                            let 倍攻加成 = js_number(String(循环.固定) , String(random(循环.最高几率)), 1)
                                            let 前端数字 = 数字转单位2((倍攻加成))
                                            let 后端单位 = 数字转单位3((倍攻加成))
                                            装备.SetOutWay2(种族第四, Number(前端数字))
                                            装备.SetOutWay3(种族第四, Number(后端单位))
                                            装备.SetCustomDesc(JSON.stringify(添加职业(装备, 全体倍攻)))
                                            装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                            装备.SetCustomCaption(1, '1')
                                        } else {
                                            let 倍攻加成 = js_number(`1`,String(random(3)), 1)
                                            let 前端数字 = 数字转单位2((倍攻加成))
                                            let 后端单位 = 数字转单位3((倍攻加成))
                                            装备.SetOutWay2(种族第四, Number(前端数字))
                                            装备.SetOutWay3(种族第四, Number(后端单位))
                                            装备.SetCustomDesc(JSON.stringify(添加职业(装备, 全体倍攻)))
                                            装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                            装备.SetCustomCaption(1, '1')
                                        }
                                        break
                                    } else {
                                        let 倍攻加成 = js_number(`1`,String(random(3)), 1)
                                        let 前端数字 = 数字转单位2((倍攻加成))
                                        let 后端单位 = 数字转单位3((倍攻加成))
                                        装备.SetOutWay2(种族第四, Number(前端数字))
                                        装备.SetOutWay3(种族第四, Number(后端单位))
                                        装备.SetCustomDesc(JSON.stringify(添加职业(装备, 全体倍攻)))
                                        装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                        装备.SetCustomCaption(1, '1')
                                    }
                                   
                                }
                            } else {
                                装备.SetOutWay1(种族第四, 全体宝宝倍攻)
                                for (let 循环 of 倍攻几率) {
                                    if (装备.GetNeedLevel() == 循环.装备等级) {
                                        if (random(100) < 循环.几率) {
                                            let 倍攻加成 = js_number(String(循环.固定) , String(random(循环.最高几率)), 1)
                                            let 前端数字 = 数字转单位2((倍攻加成))
                                            let 后端单位 = 数字转单位3((倍攻加成))
                                            装备.SetOutWay2(种族第四, Number(前端数字))
                                            装备.SetOutWay3(种族第四, Number(后端单位))
                                            装备.SetCustomDesc(JSON.stringify(添加职业(装备, 全体宝宝倍攻)))
                                            装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                            装备.SetCustomCaption(1, '1')
                                        } else {
                                            let 倍攻加成 =js_number(`1`,String(random(3)), 1)
                                            let 前端数字 = 数字转单位2((倍攻加成))
                                            let 后端单位 = 数字转单位3((倍攻加成))
                                            装备.SetOutWay2(种族第四, Number(前端数字))
                                            装备.SetOutWay3(种族第四, Number(后端单位))
                                            装备.SetCustomDesc(JSON.stringify(添加职业(装备, 全体宝宝倍攻)))
                                            装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                            装备.SetCustomCaption(1, '1')
                                        }
                                        break
                                    } else {
                                        let 倍攻加成 = js_number(`1`,String(random(3)), 1)
                                        let 前端数字 = 数字转单位2((倍攻加成))
                                        let 后端单位 = 数字转单位3((倍攻加成))
                                        装备.SetOutWay2(种族第四, Number(前端数字))
                                        装备.SetOutWay3(种族第四, Number(后端单位))
                                        装备.SetCustomDesc(JSON.stringify(添加职业(装备, 全体宝宝倍攻)))
                                        装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                        装备.SetCustomCaption(1, '1')
                                    }
                                }
                            }

                        }
                    }
                     else if (装备.StdMode == 10 || 装备.StdMode == 11) {
                        装备.SetOutWay1(种族第四, 伤害减少)
                        if (random(100) < 5) {
                            装备.SetOutWay2(种族第四, 1 + random(20))
                        } else {
                            装备.SetOutWay2(种族第四, 1 + random(10))
                        }
                    } else if (装备.StdMode == 15) {
                        装备.SetOutWay1(种族第四, 所有技能等级)
                        if (random(100) < 5) {
                            装备.SetOutWay2(种族第四, 1 + random(6))
                        } else {
                            装备.SetOutWay2(种族第四, 1 + random(4))
                        }
                    } else if (装备.StdMode == 22 || 装备.StdMode == 23) {
                        装备.SetOutWay1(种族第四, 吸血比例)
                        if (random(100) < 2) {
                            装备.SetOutWay2(种族第四, 1 + random(10))
                        } else {
                            装备.SetOutWay2(种族第四, 1 + random(2))
                        }
                    } else if (装备.StdMode == 24 || 装备.StdMode == 26) {
                        // 数值 = randomRange(10 + 星星数量 / 2, 10 + 星星数量)
                        数值 = js_numberRandom2(js_number(js_number(星星数量, `2`, 4), `10`, 1), js_number(`10`, 星星数量, 1))

                        ot1 = 造成伤害
                        let 前端数字 = 数字转单位2((数值))
                        let 后端单位 = 数字转单位3((数值))
                        装备.SetOutWay1(种族第四, ot1)
                        装备.SetOutWay2(种族第四, Number(前端数字))
                        装备.SetOutWay3(种族第四, Number(后端单位))
                        装备.SetCustomDesc(JSON.stringify(添加职业(装备, ot1)))
                        装备.SetCustomDesc(JSON.stringify(添加属性(装备, 数值)))
                        装备.SetCustomCaption(1, '1')


                    } else if (装备.StdMode == 19 || 装备.StdMode == 20 || 装备.StdMode == 21) {
                        装备.SetOutWay1(种族第四, 宝宝速度)
                        if (random(100) < 5) { 装备.SetOutWay2(种族第四, 1 + random(100)) } else { 装备.SetOutWay2(种族第四, 1 + random(50)) }
                    } else if (装备.StdMode == 27) {
                        let OT1 = 303
                        // let 击中恢复生命啊 = (randomRange(10 + 星星数量 / 2, 10 + 星星数量))
                        let 击中恢复生命啊 = js_numberRandom2(js_number(js_number(星星数量, `2`, 4), `10`, 1), js_number(`10`, 星星数量, 1))

                        let 前端数字 = 数字转单位2((击中恢复生命啊))
                        let 后端单位 = 数字转单位3((击中恢复生命啊))
                        装备.SetOutWay1(种族第四, OT1)
                        装备.SetOutWay2(种族第四, Number(前端数字))
                        装备.SetOutWay2(种族第四, Number(后端单位))
                        装备.SetCustomDesc(JSON.stringify(添加职业(装备, ot1)))
                        装备.SetCustomDesc(JSON.stringify(添加属性(装备, 击中恢复生命啊)))
                        装备.SetCustomCaption(1, '1')
                    } else if (装备.StdMode == 28) {
                        装备.SetOutWay1(种族第四, 抵抗异常)
                        装备.SetOutWay2(种族第四, randomRange(1 + random(5), 1 + random(30)))
                    }
                } else if (random(100) < 10) {
                    if (random(100) == 0) {
                        装备.SetOutWay1(种族第四, 天赋属性[random(天赋属性.length)])
                        装备.SetOutWay2(种族第四, 3 + random(3))
                    } else if (random(100) > 0 && random(100) < 5) {
                        装备.SetOutWay1(种族第四, 天赋属性[random(天赋属性.length)])
                        装备.SetOutWay2(种族第四, 1 + random(4))
                    } else {
                        装备.SetOutWay1(种族第四, 天赋属性[random(天赋属性.length)])
                        装备.SetOutWay2(种族第四, 1 + random(2))
                    }

                } else if (random(100) < 10) {
                    let 数值1 = js_numberRandom2(js_number(js_number(星星数量, `40`, 4), String(1 + random(10)), 1), js_number(js_number(星星数量, `20`, 4), String(1 + random(10)), 1))
                    let 前端数字 = 数字转单位2((数值1))
                    let 后端单位 = 数字转单位3((数值1))
                    let 随机ot1 = 种族属性[random(种族属性.length)]
                    装备.SetOutWay1(种族第四, 随机ot1)
                    装备.SetOutWay2(种族第四, Number(前端数字))
                    装备.SetOutWay3(种族第四, Number(后端单位))
                    装备.SetCustomDesc(JSON.stringify(添加职业(装备, 随机ot1)))
                    装备.SetCustomDesc(JSON.stringify(添加属性(装备, 数值1)))
                    装备.SetCustomCaption(1, '1')
                } else if (random(100) < 10) {
                    let 随机倍攻 =循环.倍攻[random(循环.倍攻.length)]
                    装备.SetOutWay1(种族第四, 随机倍攻)
                    for (let 循环 of 倍攻几率) {
                        if (装备.GetNeedLevel() == 循环.装备等级) {
                            if (random(100) < 循环.几率) {
                                let 倍攻加成 = js_number(String(循环.固定) , String(random(循环.最高几率)), 1)

                                let 前端数字 = 数字转单位2((倍攻加成))
                                let 后端单位 = 数字转单位3((倍攻加成))
                                装备.SetOutWay2(种族第四, Number(前端数字))
                                装备.SetOutWay3(种族第四, Number(后端单位))
                                装备.SetCustomDesc(JSON.stringify(添加职业(装备, 随机倍攻)))
                                装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                装备.SetCustomCaption(1, '1')
                            } else {
                                let 倍攻加成 = js_number(`1`,String(random(3)), 1)

                                let 前端数字 = 数字转单位2((倍攻加成))
                                let 后端单位 = 数字转单位3((倍攻加成))
                                装备.SetOutWay2(种族第四, Number(前端数字))
                                装备.SetOutWay3(种族第四, Number(后端单位))
                                装备.SetCustomDesc(JSON.stringify(添加职业(装备, 随机倍攻)))
                                装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                装备.SetCustomCaption(1, '1')
                            }
                        }
                    }
                } else {
                    装备.SetOutWay1(种族第四, 循环.技能重数[random(循环.技能重数.length)])
                    if (random(100) < 5) {
                        if (装备.GetOutWay1(种族第四) == 160 || 装备.GetOutWay1(种族第四) == 161) {
                            装备.SetOutWay2(种族第四, 1 + random(100))
                        } else {
                            装备.SetOutWay2(种族第四, 1 + random(6))
                        }

                    } else {
                        if (装备.GetOutWay1(种族第四) == 160 || 装备.GetOutWay1(种族第四) == 161) {
                            装备.SetOutWay2(种族第四, 1 + random(50))
                        } else {
                            装备.SetOutWay2(种族第四, 1 + random(6))
                        }
                    }
                }
            }
        }
        if (装备.DisplayName.includes('蓝装')) {
            a = 装备.DisplayName.split('[蓝装]')[0]
            装备.Rename(a + '[粉装]')
        }
        Player.DeleteItem(材料, 1)
        装备.SetColor(253)
        Player.UpdateItem(装备)
        Player.MessageBox('炼化完毕,请查看!')
        if (Player.V.任务4 == false) {
            Player.V.任务4 = true
        }
    }
    炼化粉装(Npc, Player, Args)
}

export function 炼化黄装(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\\\
                                  炼化黄装说明\\\\\\\\\\\\
                         {S=将粉装炼化成黄装,随机增加一条属性;C=253}\\
                         {S=超级黄水晶可反复炼化;C=253}\\\\
                                     <{S=炼化黄装;C=253}/@开始炼化黄>\\\\
                 <{S=装备拆分;Hint=抽出装备中部分属性}/@Main>      <{S=装备重组;Hint=组装成超级蓝装}/@装备重组>      <{S=炼化粉装;Hint=将蓝装炼化成粉装}/@炼化粉装>      <{S=炼化黄装;Hint=将粉装炼化成黄装}/@炼化黄装>
`
    Npc.SayEx(Player, 'NPC中窗口带2框', S)
}

export function 开始炼化黄(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let a = ''
    let 数值 = `0`
    let ot1 = 0
    let 装备 = Player.GetCustomItem(0)
    let 材料 = Player.GetCustomItem(1)
    if (装备 == null || (!装备.DisplayName.includes('粉装') && !装备.DisplayName.includes('黄装'))) { Player.MessageBox('请将带[蓝装]或[粉装]的装备放入左边框!'); return }
    if (材料 == null || !材料.DisplayName.includes('黄水晶')) { Player.MessageBox('请将黄水晶或超级黄水晶放入右边框!'); return }
    if (材料.GetName() == '黄水晶' && 装备.GetOutWay1(种族第五) > 0) { Player.MessageBox('黄水晶已经无法炼化,请换成超级黄水晶!'); return }
    if (材料.GetName() == '黄水晶' || 材料.GetName() == '超级黄水晶') {
        if (装备.GetOutWay3(40) > 0) { Player.MessageBox('增强后的装备不允许进行炼化!'); return }
        // let 星星数量 = 装备.GetOutWay2(0)
        let 星星数量 = 装备.GetCustomCaption(0)
        if (装备.GetCustomCaption(2) == '1') {
            let 装备字符串 = JSON.parse(装备.GetCustomDesc())
            if (Array.isArray(装备字符串["职业属性_职业"])) {
                装备字符串["职业属性_职业"].pop();
            }
            if (Array.isArray(装备字符串["职业属性_属性"])) {
                装备字符串["职业属性_属性"].pop();
            }
            装备.SetCustomCaption(2, '')
            装备.SetCustomDesc(JSON.stringify(装备字符串))
        }
        for (let 循环 of 职业技能重数) {
            if (装备.DisplayName.includes(循环.职业)) {
                if (random(100) < 20) {
                    if (装备.StdMode == 5 || 装备.StdMode == 6) {
                        if (random(100) < 20) {
                            装备.SetOutWay1(种族第五, 武器速度)
                            装备.SetOutWay2(种族第五, 1 + random(10))
                        } else {
                            if (random(100) < 50) {
                                装备.SetOutWay1(种族第五, 全体倍攻)
                                for (let 循环 of 倍攻几率) {
                                    if (装备.GetNeedLevel() == 循环.装备等级) {
                                        if (random(100) < 循环.几率) {
                                            let 倍攻加成 =js_number(String(循环.固定) , String(random(循环.最高几率)), 1)
                                            let 前端数字 = 数字转单位2((倍攻加成))
                                            let 后端单位 = 数字转单位3((倍攻加成))
                                            装备.SetOutWay2(种族第四, Number(前端数字))
                                            装备.SetOutWay3(种族第四, Number(后端单位))
                                            装备.SetCustomDesc(JSON.stringify(添加职业(装备, 全体倍攻)))
                                            装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                            装备.SetCustomCaption(2, '1')
                                        } else {
                                            let 倍攻加成 =js_number(`1`,String(random(3)), 1)
                                            let 前端数字 = 数字转单位2((倍攻加成))
                                            let 后端单位 = 数字转单位3((倍攻加成))
                                            装备.SetOutWay2(种族第四, Number(前端数字))
                                            装备.SetOutWay3(种族第四, Number(后端单位))
                                            装备.SetCustomDesc(JSON.stringify(添加职业(装备, 全体倍攻)))
                                            装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                            装备.SetCustomCaption(2, '1')
                                        }
                                        break
                                    } else {
                                        let 倍攻加成 =js_number(`1`,String(random(3)), 1)
                                        let 前端数字 = 数字转单位2((倍攻加成))
                                        let 后端单位 = 数字转单位3((倍攻加成))
                                        装备.SetOutWay2(种族第四, Number(前端数字))
                                        装备.SetOutWay3(种族第四, Number(后端单位))
                                        装备.SetCustomDesc(JSON.stringify(添加职业(装备, 全体倍攻)))
                                        装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                        装备.SetCustomCaption(2, '1')
                                    }
                                }
                            } else {
                                装备.SetOutWay1(种族第五, 全体宝宝倍攻)
                                for (let 循环 of 倍攻几率) {
                                    if (装备.GetNeedLevel() == 循环.装备等级) {
                                        if (random(100) < 循环.几率) {
                                            let 倍攻加成 =js_number(String(循环.固定) , String(random(循环.最高几率)), 1)
                                            let 前端数字 = 数字转单位2((倍攻加成))
                                            let 后端单位 = 数字转单位3((倍攻加成))
                                            装备.SetOutWay2(种族第四, Number(前端数字))
                                            装备.SetOutWay3(种族第四, Number(后端单位))
                                            装备.SetCustomDesc(JSON.stringify(添加职业(装备, 全体宝宝倍攻)))
                                            装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                            装备.SetCustomCaption(2, '1')
                                        } else {
                                            let 倍攻加成 =js_number(`1`,String(random(3)), 1)
                                            let 前端数字 = 数字转单位2((倍攻加成))
                                            let 后端单位 = 数字转单位3((倍攻加成))
                                            装备.SetOutWay2(种族第四, Number(前端数字))
                                            装备.SetOutWay3(种族第四, Number(后端单位))
                                            装备.SetCustomDesc(JSON.stringify(添加职业(装备, 全体宝宝倍攻)))
                                            装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                            装备.SetCustomCaption(2, '1')
                                        }
                                        break
                                    } else {
                                        let 倍攻加成 =js_number(`1`,String(random(3)), 1)
                                        let 前端数字 = 数字转单位2((倍攻加成))
                                        let 后端单位 = 数字转单位3((倍攻加成))
                                        装备.SetOutWay2(种族第四, Number(前端数字))
                                        装备.SetOutWay3(种族第四, Number(后端单位))
                                        装备.SetCustomDesc(JSON.stringify(添加职业(装备, 全体宝宝倍攻)))
                                        装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                        装备.SetCustomCaption(2, '1')
                                    }
                                }
                            }

                        }

                    } else if (装备.StdMode == 10 || 装备.StdMode == 11) {
                        装备.SetOutWay1(种族第五, 伤害减少)
                        if (random(100) < 5) {
                            装备.SetOutWay2(种族第五, 1 + random(20))
                        } else {
                            装备.SetOutWay2(种族第五, 1 + random(10))
                        }
                    } else if (装备.StdMode == 15) {
                        装备.SetOutWay1(种族第五, 所有技能等级)
                        if (random(100) < 5) {
                            装备.SetOutWay2(种族第五, 1 + random(6))
                        } else {
                            装备.SetOutWay2(种族第五, 1 + random(4))
                        }
                    } else if (装备.StdMode == 22 || 装备.StdMode == 23) {
                        装备.SetOutWay1(种族第五, 吸血比例)
                        if (random(100) < 2) {
                            装备.SetOutWay2(种族第五, 1 + random(10))
                        } else {
                            装备.SetOutWay2(种族第五, 1 + random(2))
                        }
                    } else if (装备.StdMode == 24 || 装备.StdMode == 26) {
                        // 数值 = randomRange(10 + 星星数量 / 2, 10 + 星星数量)
                        数值 = js_numberRandom2(js_number(js_number(星星数量, `2`, 4), `10`, 1), js_number(`10`, 星星数量, 1))

                        ot1 = 造成伤害
                        let 前端数字 = 数字转单位2((数值))
                        let 后端单位 = 数字转单位3((数值))
                        装备.SetOutWay1(种族第五, ot1)
                        装备.SetOutWay2(种族第五, Number(前端数字))
                        装备.SetOutWay3(种族第五, Number(后端单位))
                        装备.SetCustomDesc(JSON.stringify(添加职业(装备, ot1)))
                        装备.SetCustomDesc(JSON.stringify(添加属性(装备, 数值)))
                        装备.SetCustomCaption(2, '1')
                    } else if (装备.StdMode == 19 || 装备.StdMode == 20 || 装备.StdMode == 21) {
                        装备.SetOutWay1(种族第五, 宝宝速度)
                        if (random(100) < 5) { 装备.SetOutWay2(种族第五, 1 + random(100)) } else { 装备.SetOutWay2(种族第五, 1 + random(50)) }
                    } else if (装备.StdMode == 27) {
                        let OT1 = 303
                        let 击中恢复生命啊 = js_numberRandom2(js_number(js_number(星星数量, `2`, 4), `10`, 1), js_number(`10`, 星星数量, 1))
                        let 前端数字 = 数字转单位2((击中恢复生命啊))
                        let 后端单位 = 数字转单位3((击中恢复生命啊))
                        装备.SetOutWay1(种族第五, OT1)
                        装备.SetOutWay2(种族第五, Number(前端数字))
                        装备.SetOutWay2(种族第五, Number(后端单位))
                        装备.SetCustomDesc(JSON.stringify(添加职业(装备, ot1)))
                        装备.SetCustomDesc(JSON.stringify(添加属性(装备, 击中恢复生命啊)))
                        装备.SetCustomCaption(2, '1')
                        // 装备.SetOutWay1(种族第五, OT1)
                        // 装备.SetOutWay2(种族第五, 击中恢复生命)
                    } else if (装备.StdMode == 28) {
                        装备.SetOutWay1(种族第五, 抵抗异常)
                        装备.SetOutWay2(种族第五, randomRange(1 + random(5), 1 + random(30)))
                    }
                } else if (random(100) < 10) {
                    if (random(100) == 0) {
                        装备.SetOutWay1(种族第五, 天赋属性[random(天赋属性.length)])
                        装备.SetOutWay2(种族第五, 3 + random(3))
                    } else if (random(100) > 0 && random(100) < 5) {
                        装备.SetOutWay1(种族第五, 天赋属性[random(天赋属性.length)])
                        装备.SetOutWay2(种族第五, 1 + random(4))
                    } else {
                        装备.SetOutWay1(种族第五, 天赋属性[random(天赋属性.length)])
                        装备.SetOutWay2(种族第五, 1 + random(2))
                    }
                } else if (random(100) < 10) {

                    let 数值1 = js_numberRandom2(js_number(js_number(星星数量, `40`, 4), String(1 + random(10)), 1), js_number(js_number(星星数量, `20`, 4), String(1 + random(10)), 1))

                    let 前端数字 = 数字转单位2((数值1))
                    let 后端单位 = 数字转单位3((数值1))
                    let 随机ot1 = 种族属性[random(种族属性.length)]

                    装备.SetOutWay1(种族第五, 随机ot1)
                    装备.SetOutWay2(种族第五, Number(前端数字))
                    装备.SetOutWay3(种族第五, Number(后端单位))
                    装备.SetCustomDesc(JSON.stringify(添加职业(装备, 随机ot1)))
                    装备.SetCustomDesc(JSON.stringify(添加属性(装备, 数值1)))
                    装备.SetCustomCaption(2, '1')
                } else if (random(100) < 10) {
                    let 随机倍攻 =循环.倍攻[random(循环.倍攻.length)]
                    装备.SetOutWay1(种族第五, 随机倍攻)
                    for (let 循环 of 倍攻几率) {
                        if (装备.GetNeedLevel() == 循环.装备等级) {
                            if (random(100) < 循环.几率) {
                                let 倍攻加成 =js_number(String(循环.固定) , String(random(循环.最高几率)), 1)
                                let 前端数字 = 数字转单位2((倍攻加成))
                                let 后端单位 = 数字转单位3((倍攻加成))
                                装备.SetOutWay2(种族第四, Number(前端数字))
                                装备.SetOutWay3(种族第四, Number(后端单位))
                                装备.SetCustomDesc(JSON.stringify(添加职业(装备, 随机倍攻)))
                                装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                装备.SetCustomCaption(2, '1')
                            } else {
                                let 倍攻加成 =js_number(`1`,String(random(3)), 1)
                                let 前端数字 = 数字转单位2((倍攻加成))
                                let 后端单位 = 数字转单位3((倍攻加成))
                                装备.SetOutWay2(种族第四, Number(前端数字))
                                装备.SetOutWay3(种族第四, Number(后端单位))
                                装备.SetCustomDesc(JSON.stringify(添加职业(装备, 随机倍攻)))
                                装备.SetCustomDesc(JSON.stringify(添加属性(装备, 倍攻加成)))
                                装备.SetCustomCaption(2, '1')
                            }
                        }
                    }
                } else {
                    装备.SetOutWay1(种族第五, 循环.技能重数[random(循环.技能重数.length)])
                    if (random(100) < 5) {
                        if (装备.GetOutWay1(种族第五) == 160 || 装备.GetOutWay1(种族第五) == 161) {
                            装备.SetOutWay2(种族第五, 1 + random(100))
                        } else {
                            装备.SetOutWay2(种族第五, 1 + random(6))
                        }

                    } else {
                        if (装备.GetOutWay1(种族第五) == 160 || 装备.GetOutWay1(种族第五) == 161) {
                            装备.SetOutWay2(种族第五, 1 + random(50))
                        } else {
                            装备.SetOutWay2(种族第五, 1 + random(6))
                        }
                    }
                }
            }
        }
        if (装备.DisplayName.includes('粉装')) {
            a = 装备.DisplayName.split('[粉装]')[0]
            装备.Rename(a + '[黄装]')
        }
        Player.DeleteItem(材料, 1)
        装备.SetColor(251)
        Player.UpdateItem(装备)
        Player.MessageBox('炼化完毕,请查看!')
    }
    炼化黄装(Npc, Player, Args)
}


const 倍攻几率 = [
    { 装备等级: 10, 几率: 1, 固定: 1, 最高几率: 16 },
    { 装备等级: 20, 几率: 1, 固定: 1, 最高几率: 16 },
    { 装备等级: 40, 几率: 1, 固定: 1, 最高几率: 16 },
    { 装备等级: 60, 几率: 2, 固定: 2, 最高几率: 15 },
    { 装备等级: 80, 几率: 2, 固定: 2, 最高几率: 15 },
    { 装备等级: 100, 几率: 2, 固定: 2, 最高几率: 15 },
    { 装备等级: 120, 几率: 3, 固定: 3, 最高几率: 14 },
    { 装备等级: 140, 几率: 3, 固定: 3, 最高几率: 14 },
    { 装备等级: 160, 几率: 3, 固定: 3, 最高几率: 14 },
    { 装备等级: 180, 几率: 4, 固定: 4, 最高几率: 13 },
    { 装备等级: 200, 几率: 4, 固定: 4, 最高几率: 13 },
    { 装备等级: 220, 几率: 4, 固定: 4, 最高几率: 13 },
    { 装备等级: 240, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 260, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 280, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 300, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 320, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 340, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 360, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 380, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 400, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 420, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 440, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 460, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 500, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 550, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 600, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 650, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 700, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 750, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 800, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 850, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 900, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 1000, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 1200, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 1400, 几率: 5, 固定: 5, 最高几率: 12 },
    { 装备等级: 2000, 几率: 5, 固定: 5, 最高几率: 12 },
]