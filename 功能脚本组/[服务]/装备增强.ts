import { js_number } from "../../全局脚本[公共单元]/utils/计算方法";
import { 数字转单位2, 数字转单位3, 添加属性, 添加职业 } from "../../核心功能/字符计算";
import { 基础属性分割, 备用三, 天赋五, 装备增强一, 装备增强二 } from "../[装备]/_ITEM_Base";

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 几率 = 0
    let 元宝 = 0
    let 装备 = Player.GetCustomItem(0)
    if (装备 != null && 装备类型.includes(装备.StdMode)) {
        switch (装备.GetOutWay3(0)) {
            case 0: 几率 = 100; 元宝 = 100; break
            case 1: 几率 = 90; 元宝 = 200; break
            case 2: 几率 = 80; 元宝 = 300; break
            case 3: 几率 = 70; 元宝 = 400; break
            case 4: 几率 = 60; 元宝 = 500; break
            case 5: 几率 = 50; 元宝 = 600; break
            case 6: 几率 = 40; 元宝 = 700; break
            case 7: 几率 = 30; 元宝 = 800; break
            case 8: 几率 = 20; 元宝 = 900; break
            case 9: 几率 = 10; 元宝 = 1000; break
        }
    }
    const S = `\\\\\\\\\\\\\\\\\\\\
                                    增强说明\\\\
                    {S=武器增强后会增加伤害,增强6次以后增加所有技能;C=253}\\
                    {S=防具增强后会增加防御,增强6次以后增加人物气血;C=253}\\
                    {S=使用灵石,晶石增强失败后增强次数将为1;C=10}\\
                    {S=使用超级灵石,晶石增强失败增强次数不变;C=250}\\\\
                                    <{S=开始增强;C=253}/@开始增强>\\
                                    {S=增强成功几率:${几率};C=154;X=200;Y=105}
                                    {S=增强所需元宝:${元宝};C=154;X=200;Y=125}

`
    Npc.SayEx(Player, 'NPC中窗口带2框', S)
}
const 装备类型 = [4, 5, 6, 10, 11, 15, 19, 20, 21, 22, 23, 24, 26, 27, 28]
const 材料种类 = ['灵石', '超级灵石', '晶石', '超级晶石']
export function 开始增强(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 基本属性_职业 = []
    let 基本属性_数值 = []
    let 装备属性记录 = {
        职业属性_职业: 基本属性_职业,
        职业属性_属性: 基本属性_数值,
    }

    let 防御OT1 = 0
    let 防御OT2 = ''
    let 装备 = Player.GetCustomItem(0)
    let 材料 = Player.GetCustomItem(1)
    let 几率 = 0
    let 元宝 = 0
    let a = ''
    if (装备 == null || !装备类型.includes(装备.StdMode)) { Player.MessageBox('请放入正确装备进行增强!'); return }
    if (装备.GetName().includes('艾维') || 装备.GetName().includes('阿拉贡')) { Player.MessageBox('请放入正确装备进行增强!'); return }
    if (装备.DisplayName.includes('破碎') && 装备.GetOutWay3(40) > 0) { Player.MessageBox('新手装备只允许增强1次!'); return }
    if (装备.DisplayName.includes('破碎')) {
        装备.SetOutWay3(40, 装备.GetOutWay3(40) + 1)
        装备.Rename(装备.DisplayName + `『${装备.GetOutWay3(40)}』`)
        let 前端数字 = 数字转单位2(`10`)
        let 后端单位 = 数字转单位3(`10`)
        装备.SetOutWay1(装备增强一, 502)
        装备.SetOutWay2(装备增强一, Number(前端数字))
        装备.SetOutWay3(装备增强一, Number(后端单位))
        let 装备字符串 = JSON.parse(装备.GetCustomDesc())
        装备.SetCustomDesc(JSON.stringify(添加职业(装备, 502)))
        装备.SetCustomDesc(JSON.stringify(添加属性(装备, '10')))
        Player.UpdateItem(装备)
        Player.V.任务1 = true
        Player.MessageBox('新手武器已经增强完毕!')
        return
    }
    if (材料 == null || !材料种类.includes(材料.GetName())) { Player.MessageBox('请放入灵石或晶石!'); return }
    if (装备.GetOutWay3(40) >= 10) { Player.MessageBox('装备增强次数已经到达最高!'); return }
    switch (装备.GetOutWay3(40)) {
        case 0: 几率 = 100; 元宝 = 100; break
        case 1: 几率 = 90; 元宝 = 200; break
        case 2: 几率 = 80; 元宝 = 300; break
        case 3: 几率 = 70; 元宝 = 400; break
        case 4: 几率 = 60; 元宝 = 500; break
        case 5: 几率 = 50; 元宝 = 600; break
        case 6: 几率 = 40; 元宝 = 700; break
        case 7: 几率 = 30; 元宝 = 800; break
        case 8: 几率 = 20; 元宝 = 900; break
        case 9: 几率 = 10; 元宝 = 1000; break
    }
    if (Player.GetGameGold() < 元宝) { Player.MessageBox(`元宝不足${元宝}个,无法增强!`); return }
    if (装备.StdMode == 5 || 装备.StdMode == 6) {
        if (!材料.GetName().includes('灵石')) { Player.MessageBox('请放入灵石或超级灵石!'); return }
        if (装备.GetCustomText(0) == '1') {
            let 装备字符串 = JSON.parse(装备.GetCustomDesc())
            if (Array.isArray(装备字符串["职业属性_职业"])) {
                装备字符串["职业属性_职业"].pop();
            }
            if (Array.isArray(装备字符串["职业属性_属性"])) {
                装备字符串["职业属性_属性"].pop();
            }
            装备.SetCustomText(0, '')
            装备.SetCustomDesc(JSON.stringify(装备字符串))
        }
        if (random(100) < 几率) {
            Player.SetGameGold(Player.GetGameGold() - 元宝)
            Player.GoldChanged()
            Player.DeleteItem(材料, 1)
            装备.SetOutWay3(40, 装备.GetOutWay3(40) + 1)
            a = 装备.DisplayName.split('『')[0]
            装备.Rename(a + `『${装备.GetOutWay3(40)}』`)
            装备.SetBind(true)
            装备.SetNeverDrop(true)
            装备.State.SetNoDrop(true)
            Player.SendMessage(`{S=增强成功;C=250},{S=${装备.DisplayName};C=253}增强到了{S=${装备.GetOutWay3(40)};C=154}次!`, 1)
            // 防御OT2 = 装备.GetOutWay2(基础属性分割) / 2 * 装备.GetOutWay3(40)
            防御OT2 = js_number(js_number(装备.GetCustomCaption(0), `2`, 4), String(装备.GetOutWay3(40)), 3)
            防御OT1 = 502
            let 前端数字 = 数字转单位2((防御OT2))
            let 后端单位 = 数字转单位3((防御OT2))
            装备.SetOutWay1(装备增强一, 防御OT1)
            装备.SetOutWay2(装备增强一, Number(前端数字))
            装备.SetOutWay3(装备增强一, Number(后端单位))
            装备.SetCustomDesc(JSON.stringify(添加职业(装备, 防御OT1)))
            装备.SetCustomDesc(JSON.stringify(添加属性(装备, 防御OT2)))
            装备.SetCustomText(0, '1')
            if (装备.GetOutWay3(40) >= 6) {
                装备.SetOutWay1(装备增强二, 503)
                装备.SetOutWay2(装备增强二, 装备.GetOutWay3(40) - 5)
            } else
                if (装备.GetOutWay3(40) < 6) {
                    装备.SetOutWay1(装备增强二, undefined)
                    装备.SetOutWay2(装备增强二, undefined)
                }
                
        } else {
            if (材料.GetName() == '灵石') {
                Player.SetGameGold(Player.GetGameGold() - 元宝)
                Player.GoldChanged()
                Player.DeleteItem(材料, 1)
                装备.SetOutWay3(40, 1)
                a = 装备.DisplayName.split('『')[0]
                装备.Rename(a + `『${装备.GetOutWay3(40)}』`)
                装备.SetBind(true)
                装备.SetNeverDrop(true)
                装备.State.SetNoDrop(true)
                Player.SendMessage(`{S=增强失败;C=7},{S=${装备.DisplayName};C=253}增强变为{S=1;C=154}次!`, 1)
                防御OT2 = js_number(js_number(装备.GetCustomCaption(0), `2`, 4), String(装备.GetOutWay3(40)), 3)
                防御OT1 = 502
                let 前端数字 = 数字转单位2((防御OT2))
                let 后端单位 = 数字转单位3((防御OT2))
                装备.SetOutWay1(装备增强一, 防御OT1)
                装备.SetOutWay2(装备增强一, Number(前端数字))
                装备.SetOutWay3(装备增强一, Number(后端单位))
                装备.SetCustomDesc(JSON.stringify(添加职业(装备, 防御OT1)))
                装备.SetCustomDesc(JSON.stringify(添加属性(装备, 防御OT2)))
                装备.SetCustomText(0, '1')
                装备.SetOutWay1(装备增强二, undefined)
                装备.SetOutWay2(装备增强二, undefined)
            } else if (材料.GetName() == '超级灵石') {
                Player.SetGameGold(Player.GetGameGold() - 元宝)
                Player.GoldChanged()
                Player.DeleteItem(材料, 1)
                Player.SendMessage(`{S=增强失败;C=7},{S=${装备.DisplayName};C=253}增强次数不变!`, 1)
            }
        }

        Player.UpdateItem(装备)

    } else if (装备.StdMode != 5 && 装备.StdMode != 6) {
        if (!材料.GetName().includes('晶石')) { Player.MessageBox('请放入晶石或超级晶石!'); return }
        if (装备.GetCustomText(0) == '1') {  // 检查装备是否有增强标记
            let 装备字符串 = JSON.parse(装备.GetCustomDesc())  // 解析装备的自定义描述为JSON对象
            if (Array.isArray(装备字符串["职业属性_职业"])) {  // 检查职业属性数组是否存在
                装备字符串["职业属性_职业"].pop();  // 移除最后一个职业属性
            }
            if (Array.isArray(装备字符串["职业属性_属性"])) {  // 检查属性数值数组是否存在
                装备字符串["职业属性_属性"].pop();  // 移除最后一个属性数值
            }
            装备.SetCustomText(0, '')  // 清除增强标记
            装备.SetCustomDesc(JSON.stringify(装备字符串))  // 将修改后的JSON对象重新序列化为字符串
        }
        if (random(100) < 几率) {
            Player.SetGameGold(Player.GetGameGold() - 元宝)
            Player.GoldChanged()
            Player.DeleteItem(材料, 1)
            装备.SetOutWay3(40, 装备.GetOutWay3(40) + 1)
            a = 装备.DisplayName.split('『')[0]
            装备.Rename(a + `『${装备.GetOutWay3(40)}』`)
            装备.SetBind(true)
            装备.SetNeverDrop(true)
            装备.State.SetNoDrop(true)
            Player.SendMessage(`{S=增强成功;C=250},{S=${装备.DisplayName};C=253}增强到了{S=${装备.GetOutWay3(40)};C=154}次!`, 1)
            防御OT2 = js_number(js_number(装备.GetCustomCaption(0), `8`, 4), String(装备.GetOutWay3(40)), 3)
            防御OT1 = 501
            let 前端数字 = 数字转单位2((防御OT2))
            let 后端单位 = 数字转单位3((防御OT2))
            装备.SetOutWay1(装备增强一, 防御OT1)
            装备.SetOutWay2(装备增强一, Number(前端数字))
            装备.SetOutWay3(装备增强一, Number(后端单位))
            装备.SetCustomDesc(JSON.stringify(添加职业(装备, 防御OT1)))
            装备.SetCustomDesc(JSON.stringify(添加属性(装备, 防御OT2)))
            装备.SetCustomText(0, '1')
            if (装备.GetOutWay3(40) >= 6) {
                防御OT2 = js_number(js_number(装备.GetCustomCaption(0), `2`, 4), String(装备.GetOutWay3(40)), 3)
                防御OT1 = 500
                let 前端数字 = 数字转单位2((防御OT2))
                let 后端单位 = 数字转单位3((防御OT2))
                装备.SetOutWay1(装备增强二, 防御OT1)
                装备.SetOutWay2(装备增强二, Number(前端数字))
                装备.SetOutWay3(装备增强二, Number(后端单位))
                装备.SetCustomDesc(JSON.stringify(添加职业(装备, 防御OT1)))
                装备.SetCustomDesc(JSON.stringify(添加属性(装备, 防御OT2)))
                装备.SetCustomText(0, '1')
            } else {
                装备.SetOutWay1(装备增强二, undefined)
                装备.SetOutWay2(装备增强二, undefined)
            }
        } else {
            if (材料.GetName() == '晶石') {
                Player.SetGameGold(Player.GetGameGold() - 元宝)
                Player.GoldChanged()
                Player.DeleteItem(材料, 1)
                装备.SetOutWay3(40, 1)
                a = 装备.DisplayName.split('『')[0]
                装备.Rename(a + `『${装备.GetOutWay3(40)}』`)
                装备.SetBind(true)
                装备.SetNeverDrop(true)
                装备.State.SetNoDrop(true)
                Player.SendMessage(`{S=增强失败;C=7},{S=${装备.DisplayName};C=253}增强变为{S=1;C=154}次!`, 1)
                防御OT2 = js_number(js_number(装备.GetCustomCaption(0), `8`, 4), String(装备.GetOutWay3(40)), 3)
                防御OT1 = 501
                let 前端数字 = 数字转单位2((防御OT2))
                let 后端单位 = 数字转单位3((防御OT2))
                装备.SetOutWay1(装备增强一, 防御OT1)
                装备.SetOutWay2(装备增强一, Number(前端数字))
                装备.SetOutWay3(装备增强一, Number(后端单位))
                装备.SetCustomDesc(JSON.stringify(添加职业(装备, 防御OT1)))
                装备.SetCustomDesc(JSON.stringify(添加属性(装备, 防御OT2)))
                装备.SetCustomText(0, '1')
                装备.SetOutWay1(装备增强二, undefined)
                装备.SetOutWay2(装备增强二, undefined)
            } else if (材料.GetName() == '超级晶石') {
                Player.SetGameGold(Player.GetGameGold() - 元宝)
                Player.GoldChanged()
                Player.DeleteItem(材料, 1)
                Player.SendMessage(`{S=增强失败;C=7},{S=${装备.DisplayName};C=253}增强次数不变!`, 1)
            }
        }
        Player.UpdateItem(装备)

    }
    Main(Npc, Player, Args)
}