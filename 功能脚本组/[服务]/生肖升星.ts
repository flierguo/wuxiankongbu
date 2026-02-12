import { js_number } from "../../全局脚本[公共单元]/utils/计算方法";
import { 数字转单位2, 数字转单位3 } from "../../大数值版本/字符计算";

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 升星几率 = 0
    let 装备 = Player.GetCustomItem(0)
    if (装备 != null && 装备.StdMode == 68) {
        switch (装备.GetOutWay3(40)) {
            case 0: 升星几率 = 100; break
            case 1: 升星几率 = 100; break
            case 2: 升星几率 = 100; break
            case 3: 升星几率 = 70; break
            case 4: 升星几率 = 65; break
            case 5: 升星几率 = 60; break
            case 6: 升星几率 = 55; break
            case 7: 升星几率 = 50; break
            case 8: 升星几率 = 45; break
            case 9: 升星几率 = 40; break
            case 10: 升星几率 = 35; break
            case 11: 升星几率 = 30; break
            case 12: 升星几率 = 25; break
            case 13: 升星几率 = 20; break
            case 14: 升星几率 = 15; break
            case 15: 升星几率 = 10; break
        }

    }
    const S = `\\\\\\\\\\
                             生肖升星\\\\
            {S=升星属性:根据生肖的品质按照比例增加攻击力;C=251}\\
            {S=升星要求:需要【等级*10】颗升星石;C=191}\\
            {S=星套属性:全套生肖总数值达到一定数量触发星套属性;C=254}\\\\
                     {S=查看星套属性;C=249;Hint=             星套属性#92数量达到10 星  所有技能倍功 + 10 #92数量达到20 星  所有技能倍功 + 20 #92数量达到30 星  所有技能倍功 + 30 #92数量达到40 星  所有技能倍功 + 40 #92数量达到50 星  所有技能倍功 + 50 #92数量达到60 星  所有技能倍功 + 60 #92数量达到70 星  所有技能倍功 + 70 #92数量达到80 星  所有技能倍功 + 80 #92数量达到90 星  所有技能倍功 + 90 #92数量达到100星  所有技能倍功 + 100#92数量达到110星  所有技能倍功 + 110#92数量达到120星  所有技能倍功 + 120#92数量达到130星  所有技能倍功 + 130#92数量达到140星  所有技能倍功 + 140#92数量达到150星  所有技能倍功 + 150#92数量达到160星  所有技能倍功 + 160#92数量达到170星  所有技能倍功 + 170#92数量达到180星  所有技能倍功 + 180#92数量达到200星  所有技能倍功 + 200}\\\\

            <升星/@升星>           {S=成功率:${升星几率}%;X=270;Y=170}\\
 

    
    `
    Npc.SayEx(Player, 'NPC小窗口带2框', S)  //<升星2/@升星2> <一键升星/@@InPutInteger(可设置升星次数输入5-16的数值，一键升星的次数=升星石数量)>
}
export function 升星2(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 装备 = Player.GetCustomItem(0)
    let 装备字符串 = JSON.parse(装备.GetCustomDesc())
    let 装备数值 = 装备字符串.职业属性_生肖[0]
    // console.log(装备.GetOutWay3(40))
    // console.log(装备字符串)
}
export const 生肖升星数值比例 = {
    0 : `1.20`, 
    1 : `1.50`, 
    2 : `1.75`, 
    3 : `2.00`, 
    4 : `2.25`, 
    5 : `2.50`, 
    6 : `3.00`, 
    7 : `3.50`, 
    8 : `4.00`, 
    9 : `4.50`, 
    10 : `5.00`, 
    11 : `7.00`, 
    12 : `11.00`, 
    13 : `18.00`, 
    14 : `25.00`, 
    15 : `40.00`, 
    16 : `75.00`, 
}
export function 升星(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 升星几率 = 0
    let 星星数量 = '0'
    let 几率 = random(100)
    let 装备 = Player.GetCustomItem(0)
    let 升星石 = Player.GetCustomItem(1)
    let 升星石数量 = (装备.GetOutWay3(40) + 1) * 10
    let 数值 ='0'
    if (装备 == null || 装备.StdMode != 68) { Player.MessageBox(`请放入生肖再进行升星!`); return }
    if (升星石 == null || 升星石.GetName() != '升星石' || 升星石.GetDura() < 升星石数量) { Player.MessageBox(`请放入升星石或升星石数量不足!当前需求数量: ${升星石数量}`); return }
    if (装备.GetOutWay3(40) >= 16) { Player.MessageBox(`当前生肖已经达到16颗星,无法再次提升!`); return }
    // console.log(升星石数量 + '升星石数量1' + 升星石.GetName() + '升星石名称' + 升星石.GetDura() + '升星石数量2' )
    switch (装备.GetOutWay3(40)) {
        case 0: 升星几率 = 100; break
        case 1: 升星几率 = 100; break
        case 2: 升星几率 = 100; break
        case 3: 升星几率 = 70; break
        case 4: 升星几率 = 65; break
        case 5: 升星几率 = 60; break
        case 6: 升星几率 = 55; break
        case 7: 升星几率 = 50; break
        case 8: 升星几率 = 45; break
        case 9: 升星几率 = 40; break
        case 10: 升星几率 = 35; break
        case 11: 升星几率 = 30; break
        case 12: 升星几率 = 25; break
        case 13: 升星几率 = 20; break
        case 14: 升星几率 = 15; break
        case 15: 升星几率 = 10; break
    }
    星星数量 = 装备.GetCustomCaption(0)
    let 装备字符串 = JSON.parse(装备.GetCustomDesc())
    // console.log(装备字符串)
    let 装备生肖 = 装备字符串.职业属性_生肖
    let 生肖数值 = 装备生肖[0]

    if (random(100) < 升星几率) {
        数值 = js_number(装备生肖[装备生肖.length-1], js_number(生肖数值, 生肖升星数值比例[装备.GetOutWay3(40)], 3), 1)
        装备.SetOutWay3(40, 装备.GetOutWay3(40) + 1)
        for (let a = 0; a < 6; a++) {
            let 前端数字 = 数字转单位2((数值))
            let 后端单位 = 数字转单位3((数值))
            装备.SetOutWay1(2 + a, 600 + a);
            装备.SetOutWay2(2 + a, Number(前端数字))
            装备.SetOutWay3(2 + a, Number(后端单位))

            装备字符串.职业属性_职业[a] = 600 + a
            装备字符串.职业属性_属性[a] = 数值
        }
        装备字符串.职业属性_生肖[装备.GetOutWay3(40)] = 数值
        let 装备属性记录 = 装备字符串
        装备.SetCustomDesc(JSON.stringify(装备属性记录))
        装备.Rename(装备.GetName() + `[${装备.GetOutWay3(40)}]星`)
        Npc.Take(Player, 升星石.GetName(), 升星石数量)
        Player.UpdateItem(装备)
        Player.SendMessage(`{S=${装备.GetName()};C=154}升星成功,当前星级:{S=${装备.GetOutWay3(40)};C=253}`, 1)
    } else if (几率 < 45) {
        Npc.Take(Player, 升星石.GetName(), 升星石数量)
        Player.SendMessage(`{S=${装备.GetName()};C=251}升星失败,运气不错没有降级.当前星级:{S=${装备.GetOutWay3(40)};C=255}`)
    } else if (几率 >= 45 && 几率 <= 80) {
        if (装备.GetOutWay3(40) > 0) { 装备.SetOutWay3(40, 装备.GetOutWay3(40) - 1) }
        数值 = 装备生肖[装备生肖.length-1-1]
        装备字符串.职业属性_生肖.pop()
        for (let a = 0; a < 6; a++) {
            let 前端数字 = 数字转单位2((数值))
            let 后端单位 = 数字转单位3((数值))
            装备.SetOutWay1(2 + a, 600 + a);
            装备.SetOutWay2(2 + a, Number(前端数字))
            装备.SetOutWay3(2 + a, Number(后端单位))

            装备字符串.职业属性_职业[a] = 600 + a
            装备字符串.职业属性_属性[a] = 数值
        }
        let 装备属性记录 = 装备字符串
        装备.SetCustomDesc(JSON.stringify(装备属性记录))

        装备.Rename(装备.GetName() + `[${装备.GetOutWay3(40)}]星`)
        Npc.Take(Player, 升星石.GetName(), 升星石数量)
        Player.UpdateItem(装备)
        Player.SendMessage(`{S=${装备.GetName()};C=251}升星失败,降1级.当前星级:{S=${装备.GetOutWay3(40)};C=255}`)
    } else {
        if (装备.GetOutWay3(40) > 1) { 装备.SetOutWay3(40, 装备.GetOutWay3(40) - 2) }
        数值 = 装备生肖[装备生肖.length-1-2]
        装备字符串.职业属性_生肖.pop()
        装备字符串.职业属性_生肖.pop()
        for (let a = 0; a < 6; a++) {
            let 前端数字 = 数字转单位2((数值))
            let 后端单位 = 数字转单位3((数值))
            装备.SetOutWay1(2 + a, 600 + a);
            装备.SetOutWay2(2 + a, Number(前端数字))
            装备.SetOutWay3(2 + a, Number(后端单位))

            装备字符串.职业属性_职业[a] = 600 + a
            装备字符串.职业属性_属性[a] = 数值
        }
        let 装备属性记录 = 装备字符串
        装备.SetCustomDesc(JSON.stringify(装备属性记录))
        装备.Rename(装备.GetName() + `[${装备.GetOutWay3(40)}]星`)
        Npc.Take(Player, 升星石.GetName(), 升星石数量)
        Player.UpdateItem(装备)
        Player.SendMessage(`{S=${装备.GetName()};C=251}升星失败,降2级.当前星级:{S=${装备.GetOutWay3(40)};C=255}`)
    }
    Main(Npc, Player, Args)
}

export function InPutInteger(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 输入数量 = Args.Int[0]
    if (输入数量 < 5 || 输入数量 > 16) { Player.MessageBox('请输入5-16的数值'); return }
    let 升星几率 = 0
    let 星星数量 = '0'
    let 装备 = Player.GetCustomItem(0)
    let 升星石 = Player.GetCustomItem(1)
    let 数值 = '0'
    if (装备 == null || 装备.StdMode != 68) { Player.MessageBox(`请放入生肖再进行升星!`); return }
    if (升星石 == null || 升星石.GetName() != '升星石') { Player.MessageBox(`请放入升星石在进行升星!`); return }
    if (装备.GetOutWay3(40) >= 16) { Player.MessageBox(`当前马牌已经达到16颗星,无法再次提升!`); return }
    while (升星石.Dura !=1) {
        let 基本属性_职业 = []
        let 基本属性_数值 = []
        let 装备属性记录 = {
            职业属性_职业: 基本属性_职业,
            职业属性_属性: 基本属性_数值,
        }
        let 几率 = random(100)
        if (装备.GetOutWay3(40) >= 输入数量) { Player.MessageBox('升星完毕,请查看!'); return }
        装备.SetCustomDesc('')
        switch (装备.GetOutWay3(40)) {
            case 0: 升星几率 = 85; break
            case 1: 升星几率 = 80; break
            case 2: 升星几率 = 75; break
            case 3: 升星几率 = 70; break
            case 4: 升星几率 = 65; break
            case 5: 升星几率 = 60; break
            case 6: 升星几率 = 55; break
            case 7: 升星几率 = 50; break
            case 8: 升星几率 = 45; break
            case 9: 升星几率 = 40; break
            case 10: 升星几率 = 35; break
            case 11: 升星几率 = 30; break
            case 12: 升星几率 = 25; break
            case 13: 升星几率 = 20; break
            case 14: 升星几率 = 15; break
            case 15: 升星几率 = 10; break
        }
        星星数量 = 装备.GetCustomCaption(0)
        if (random(100) < 升星几率) {
            装备.SetOutWay3(40, 装备.GetOutWay3(40) + 1)
            数值 = js_number(String(装备.GetNeedLevel()), js_number(js_number(星星数量, `10`, 4), String(装备.GetOutWay3(40)), 3), 1)
            for (let a = 0; a < 6; a++) {
                let 前端数字 = 数字转单位2((数值))
                let 后端单位 = 数字转单位3((数值))
                装备.SetOutWay1(2 + a, 600 + a);// 分隔符 1
                装备.SetOutWay2(2 + a, Number(前端数字))
                装备.SetOutWay3(2 + a, Number(后端单位))
                基本属性_职业.push(600 + a)
                基本属性_数值.push(数值)
            }
            装备.Rename(装备.GetName() + `[${装备.GetOutWay3(40)}]星`)
            装备.SetCustomDesc(JSON.stringify(装备属性记录))
            Player.UpdateItem(装备)
            Player.SendMessage(`{S=${装备.GetName()};C=154}升星成功,当前星级:{S=${装备.GetOutWay3(40)};C=253}`, 1)
        } else if (几率 < 45) {
            Player.SendMessage(`{S=${装备.GetName()};C=251}升星失败,运气不错没有降级.当前星级:{S=${装备.GetOutWay3(40)};C=255}`)
        } else if (几率 >= 45 && 几率 <= 80) {
            if (装备.GetOutWay3(40) > 0) { 装备.SetOutWay3(40, 装备.GetOutWay3(40) - 1) }
            装备.SetCustomDesc('')
            数值 = js_number(String(装备.GetNeedLevel()), js_number(js_number(星星数量, `10`, 4), String(装备.GetOutWay3(40)), 3), 1)
            for (let a = 0; a < 6; a++) {
                let 前端数字 = 数字转单位2((数值))
                let 后端单位 = 数字转单位3((数值))
                装备.SetOutWay1(2 + a, 600 + a);// 分隔符 1
                装备.SetOutWay2(2 + a, Number(前端数字))
                装备.SetOutWay3(2 + a, Number(后端单位))
                基本属性_职业.push(600 + a)
                基本属性_数值.push(数值)
            }
            装备.SetCustomDesc(JSON.stringify(装备属性记录))
            装备.Rename(装备.GetName() + `[${装备.GetOutWay3(40)}]星`)
            Player.UpdateItem(装备)
            Player.SendMessage(`{S=${装备.GetName()};C=251}升星失败,降1级.当前星级:{S=${装备.GetOutWay3(40)};C=255}`)
        } else {
            if (装备.GetOutWay3(40) > 1) { 装备.SetOutWay3(40, 装备.GetOutWay3(40) - 2) }
            装备.SetCustomDesc('')
            数值 = js_number(String(装备.GetNeedLevel()), js_number(js_number(星星数量, `10`, 4), String(装备.GetOutWay3(40)), 3), 1)
            for (let a = 0; a < 6; a++) {
                let 前端数字 = 数字转单位2((数值))
                let 后端单位 = 数字转单位3((数值))
                装备.SetOutWay1(2 + a, 600 + a);// 分隔符 1
                装备.SetOutWay2(2 + a, Number(前端数字))
                装备.SetOutWay3(2 + a, Number(后端单位))
                基本属性_职业.push(600 + a)
                基本属性_数值.push(数值)
            }
            装备.SetCustomDesc(JSON.stringify(装备属性记录))
            装备.Rename(装备.GetName() + `[${装备.GetOutWay3(40)}]星`)
            Npc.Take(Player, 升星石.GetName(), 1)
            Player.UpdateItem(装备)
            Player.SendMessage(`{S=${装备.GetName()};C=251}升星失败,降2级.当前星级:{S=${装备.GetOutWay3(40)};C=255}`)
        }
        Npc.Take(Player, 升星石.GetName(), 1)
    }
}