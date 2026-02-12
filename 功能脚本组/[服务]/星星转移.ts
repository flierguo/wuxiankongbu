import { js_number } from "../../全局脚本[公共单元]/utils/计算方法"
import { 数字转单位2, 数字转单位3 } from "../../大数值版本/字符计算"
import { 灵兽升星数值比例 } from "./灵兽升星"

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
                           星星转移\\\\
                 {S=我可以免费帮你转移生肖和马牌上的星星;C=254}\\\\\\\\\\
          {S=放入要转移的生肖;C=251}          {S=放入要继承的生肖;C=251}\\\\\\
                           <开始转移/@开始转移>
    `
    Npc.SayEx(Player, 'NPC小窗口中间2框', S)
}

export function 开始转移(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 转移 = Player.GetCustomItem(0)
    let 继承 = Player.GetCustomItem(1)
    let 基本属性_职业 = []
    let 基本属性_数值 = []
    let 装备属性记录 = {
        职业属性_职业: 基本属性_职业,
        职业属性_属性: 基本属性_数值,
    }
    if (转移 == null || (转移.StdMode != 68 && 转移.StdMode != 35)) { Player.MessageBox('请放入要转移的生肖或马牌!'); return }
    if (继承 == null || (继承.StdMode != 68 && 继承.StdMode != 35)) { Player.MessageBox('请放入要继承的生肖或马牌!'); return }
    if (转移.StdMode == 68 && 继承.StdMode != 68) { Player.MessageBox('转移的是生肖,继承的也必须是生肖!'); return }
    if (转移.StdMode == 35 && 继承.StdMode != 35) { Player.MessageBox('转移的是马牌,继承的也必须是马牌!'); return }
    if (转移.GetOutWay3(40) < 1) { Player.MessageBox('转啥啊,要转移的装备上1个星星都没有!'); return }

    let 装备字符串1 = JSON.parse(转移.GetCustomDesc())
    let 装备字符串2 = JSON.parse(继承.GetCustomDesc())

    let 升星次数 = 转移.GetOutWay3(40)
    let 基础底数 = 装备字符串2.职业属性_生肖[0]

    let 继承数值数组 = [基础底数, ]
    if(升星次数 > 0){

        // 写入转移属性
        for(let i=1;i<=升星次数;i++){
            let 数值 = js_number(基础底数, js_number(基础底数, 灵兽升星数值比例[i], 3), 1)
            继承数值数组.push(数值)
        }
        let 最终属性 = 继承数值数组[继承数值数组.length-1]
        for (let a = 0; a < 6; a++) {
            let 前端数字 = 数字转单位2((最终属性))
            let 后端单位 = 数字转单位3((最终属性))
            继承.SetOutWay1(2 + a, 600 + a);
            继承.SetOutWay2(2 + a, Number(前端数字))
            继承.SetOutWay3(2 + a, Number(后端单位))

            装备字符串2.职业属性_职业[a] = 600 + a
            装备字符串2.职业属性_属性[a] = 最终属性
        }
        继承.SetOutWay3(40, 升星次数)
        装备字符串2.职业属性_生肖 = 继承数值数组
        let 装备属性记录 = 装备字符串2
        继承.SetCustomDesc(JSON.stringify(装备属性记录))
        继承.Rename(继承.GetName() + `[${继承.GetOutWay3(40)}]星`)
        Player.UpdateItem(继承)
        Player.SendMessage(`{S=${继承.GetName()};C=154} 星星转移成功,当前星级: {S=${继承.GetOutWay3(40)};C=253}`, 1)


        // 还原物品属性
        let 还原属性 = 装备字符串1.职业属性_生肖[0]
        for (let a = 0; a < 6; a++) {
            let 前端数字 = 数字转单位2((还原属性))
            let 后端单位 = 数字转单位3((还原属性))
            转移.SetOutWay1(2 + a, 600 + a);
            转移.SetOutWay2(2 + a, Number(前端数字))
            转移.SetOutWay3(2 + a, Number(后端单位))

            装备字符串1.职业属性_职业[a] = 600 + a
            装备字符串1.职业属性_属性[a] = 还原属性
        }
        转移.SetOutWay3(40, 0)
        装备字符串1.职业属性_生肖 = [还原属性, ]
        let 装备记录 = 装备字符串1
        转移.SetCustomDesc(JSON.stringify(装备记录))
        转移.Rename(转移.GetName() + `[${转移.GetOutWay3(40)}]星`)
        Player.UpdateItem(转移)
        Player.MessageBox('转移完毕,请查看!')
    }
    Main(Npc, Player, Args)
}