
import { 原始名字, 怪物星数, 怪物超星数, 怪物颜色 } from "../[怪物]/_M_Base"
import { 分钟检测无人60分清理怪物, 按分钟检测, 秒钟第一次进入刷怪 } from "../[怪物]/_M_Robot";
import { 种族第二, 种族第三, 种族第一, 基础属性分割, 备用三 } from "../[装备]/_ITEM_Base";

import { 装备属性统计 } from '../../性能优化/index_智能优化';
import { 实时回血, 实时扣血, 数字转单位2, 数字转单位3, 血量显示 } from "../../_核心部分/字符计算";
import { js_number } from "../../全局脚本[公共单元]/utils/计算方法";
import { 转大数值  , 智能计算} from "../../大数值/核心计算方法";
import * as 地图2 from '../../_核心部分/_地图/地图';
import { 快速清理, 安全清理, 深度清理, 执行完整清理 } from '../../核心功能/清理冗余数据';
import { 增加 } from "../[功能]/_功能";

import { 大数值单位 } from "../../大数值/大数值单位";

const UnitList = 大数值单位

export function 清理啊(Npc: TNormNpc, Player: TPlayObject): void {
    GameLib.ClearMapMon(Player.GetMapName());
    GameLib.R[Player.GetMapName()] = false
}

export function 交易市场(Npc: TNormNpc, Player: TPlayObject): void {
    // Player.RemoveExtendButton('交易市场')
    // Player.AddExtendButton('交易市场', `\\{S=点击查看交易中心;C=251}`, '交易市场啊', 172, 450, 分辨率(Player))
}


export function 会员(Npc: TNormNpc, Player: TPlayObject): void {
    // Player.RemoveExtendButton('会员')
    // Player.AddExtendButton('会员', `{S=点击查看会员;C=251}`, '会员啊', 189, 1, 分辨率(Player))
    Player.AddSidebarButton("", "特殊")
}


export function 人物死亡(Npc: TNormNpc, Player: TPlayObject): void {
    const S = `\\\\
                {S=--------------------------;C=249}\\
                        {S=人物死亡;C=249}\\
                {S=--------------------------;C=249}\\\\
                    <免费复活/@延时跳转.免费复活> {S=返回安全区;C=224}\\\\
                    <原地复活/@延时跳转.收费复活> {S=消耗300元宝;C=243}\\\\
    `
    Player.SayEx('人物死亡', S)
}

export function 多开踢出(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.Kick();
}

export function 免费复活(Npc: TNormNpc, Player: TPlayObject): void {
    Player.SetSVar(91, Player.V.自定属性[1051])  //当前血量
    Player.SetSVar(92, Player.V.自定属性[1052])    //当前最大血量
    // 血量显示(Player)
    装备属性统计(Player, undefined, undefined, undefined)

    Player.ReAlive()
    Player.GoHome()
    // activation(Player);/*重新计算玩家身上的装备*/
    Player.RecalcAbilitys;/*重新计算能力值*/
}

export function 收费复活(Npc: TNormNpc, Player: TPlayObject): void {
    if (Player.GetGameGold() < 300) { Player.MessageBox(`元宝不足300,无法原地复活`); return }
    Player.SetGameGold(Player.GetGameGold() - 300)
    Player.GoldChanged()
    Player.SetSVar(91, Player.V.自定属性[1051])  //当前血量
    Player.SetSVar(92, Player.V.自定属性[1052])    //当前最大血量
    // 血量显示(Player)
    装备属性统计(Player, undefined, undefined, undefined)
    Player.ReAlive()
    // Player.GoHome()
    // activation(Player);/*重新计算玩家身上的装备*/
    Player.RecalcAbilitys;/*重新计算能力值*/
}

export function 玩家复活(Npc: TNormNpc, Player: TPlayObject): void {
    Player.SetSVar(91, Player.V.自定属性[1051])  //当前血量
    Player.SetSVar(92, Player.V.自定属性[1052])    //当前最大血量


    Player.ReAlive()
    Player.GoHome()

    // 血量显示(Player)
    装备属性统计(Player, undefined, undefined, undefined)
    // activation(Player);/*重新计算玩家身上的装备*/
    Player.RecalcAbilitys;/*重新计算能力值*/
}
export function 重新登录(Npc: TNormNpc, Player: TPlayObject): void {
    Player.Kick()
}



export function 测试用的(Npc: TNormNpc, Player: TPlayObject): void {
    Randomize()
    if (Player.IsAdmin) {
        // Player.SetMP(Player.GetMaxMP())
        //   Player.V.真实充值 = 1000
        //    Player.V.真实充值=10000
        let 基本属性_职业 = []
        let 基本属性_数值 = []
        let 装备属性记录 = {
            职业属性_职业: 基本属性_职业,
            职业属性_属性: 基本属性_数值,
        }
        // Player.V.轮回次数=50
        // let a = '100'
        // let b = '99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999'

        // let item:TUserItem


        装备属性统计(Player, undefined, undefined, undefined)

        const S = `\\\\\\\\
    人物爆率:${Player.R.爆率加成}    人物极品倍率:${Player.R.极品率} \\
    <转职/@延时跳转.转职> <来个装备/@延时跳转.来个装备>  <清空背包/@延时跳转.清空背包>  <修改技能等级/@@延时跳转.InPutString(输入技能名字)> <刷个怪/@延时跳转.刷怪>  <加满血蓝/@延时跳转.加满>  <清空血蓝/@延时跳转.清空>  \\
    <地图传送(下标)/@@延时跳转.InPutString23(输入下标)>   <地图传送(名称)/@@延时跳转.InPutString24(输入名字)>   <清理当前地图怪物/@延时跳转.地图(1)>  <执行当前地图刷怪/@延时跳转.地图(2)> \\
    <召唤宝宝/@延时跳转.召唤>     <刷稻草人/@延时跳转.刷稻草人>    <来个生肖/@延时跳转.来个生肖>     <清理地图/@延时跳转.清理地图>    <技能范围/@延时跳转.技能范围>\\
    <我要秒怪/@延时跳转.我要秒怪>  <领取货币/@延时跳转.领取货币>  <刷练功师/@延时跳转.刷练功师>   <清理冗余/@延时跳转.清理冗余数据>  \\
    <给玩家刷物品/@@延时跳转.InPutString20(格式：玩家名字-物品名字-数量)>   <给玩家刷属性/@@延时跳转.InPutString21(玩家-属性-类型1（积分）、2（元宝）、3（回收比例）、4（爆率）、5（等级）、6（挑战倍数）)>  <给玩家转职/@@延时跳转.InPutString22(格式:玩家名字-职业)>\\
    <给玩家刷特殊物品/@@延时跳转.InPutString25(格式：玩家名字-物品名字-数量)> <刷魔器/@延时跳转.刷魔器>  <学习技能/@@延时跳转.InPutString26(输入技能名字)>
    
    `

        Npc.SayEx(Player, 'NPC大窗口', S)
    }
}
export function 刷魔器(Npc: TNormNpc, Player: TPlayObject): void {
   Npc.Give(Player, '霜陨剑首', 30);
   Npc.Give(Player, '霜陨剑脊', 30);
   Npc.Give(Player, '霜陨剑锷', 30);
   Npc.Give(Player, '霜陨剑茎', 30);
   Npc.Give(Player, '霜陨剑鞘', 30);
}

export function 技能范围(Npc: TNormNpc, Player: TPlayObject): void {
    Player.AddSkill('万箭齐发啊', 10)
    let Magic = Player.FindSkill('万箭齐发啊')
    if (Magic) {
        Magic.SetLevel(10)
        Player.UpdateMagic(Magic);
    }

}
export function 清理冗余数据(Npc: TNormNpc, Player: TPlayObject): void {
    执行完整清理();
    console.log(`怪物数量 : ${Player.Map.MonCount}`)

}

export function InPutString26(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 技能名字 = Args.Str[0]
    Player.AddSkill(技能名字, 10)
    let Magic = Player.FindSkill(技能名字)
    if (Magic) {
        Magic.SetLevel(10)
        Player.UpdateMagic(Magic);
    }
}
export function InPutString25(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const str: string = Args.Str[0]
    const list: string[] = str.split('-')   //字符串转数字 以,分割  也就是说[数组1,数组2,,数组3,.......]
    let Item: TUserItem
    let PlayerName = list[0] //数组1 也就是从0开始
    let 物品名字 = list[1] //数组1 也就是从0开始
    let 物品等级 = Number(list[2])
    let a: TPlayObject = GameLib.FindPlayer(PlayerName);
    // console.log(物品数量)
    if (a == null) { Player.MessageBox('玩家名字不正确!'); return }

    let out = 12
    let 属性 = 1
    let 特殊物品 = Player.GiveItem(物品名字);

    if (物品名字 == '聚宝葫芦') {out = 5; 属性 = Math.floor(物品等级/10) + 1 }
    if (物品名字 == '玉帝之玺') {out = 851; 属性 = 物品等级 * 3 }
    if (物品名字 == '老君灵宝') {out = 852; 属性 = 物品等级}
    if (物品名字 == '女娲之泪') {out = 853; 属性 = 物品等级}

   特殊物品.SetOutWay1(12, out)
   特殊物品.SetOutWay2(12, 属性)
   特殊物品.Rename(`『${物品等级}级』${物品名字}`);
   特殊物品.SetBind(true);
   特殊物品.SetNeverDrop(true);
   特殊物品.State.SetNoDrop(true);
    a.UpdateItem(特殊物品);


    Player.MessageBox(`成功给{S=${PlayerName};C=224}刷新了{S=${物品名字};C=251}!`)

}
export function InPutString24(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {   //
    let 下标 = Args.Str[0];
    if (下标 != null) {
        Player.RandomMove(下标)
    } else { Player.MessageBox('玩家名字不正确,或者不在线'); }

}
export function InPutString23(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //地图传送

    let 下标 = Args.Int[0];
    if (下标 != null) {
        Player.Move(地图2.取地图ID(下标), 1, 1)
    } else { Player.MessageBox('玩家名字不正确,或者不在线'); }

}
export function InPutString22(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //格式：玩家名字-职业  转职
    const str: string = Args.Str[0]
    const list: string[] = str.split('-')   //字符串转数字 以,分割  也就是说[数组1,数组2,,数组3,.......]
    let PlayerName = list[0] //数组1 也就是从0开始
    let 职业 = list[1]
    let a: TPlayObject = GameLib.FindPlayer(PlayerName);
}

export function InPutString21(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //格式: 玩家名字-属性-数量  刷属性
    const str: string = Args.Str[0];
    const list: string[] = str.split('-');   // 格式：玩家名字-数量-类型

    // 参数校验
    if (list.length < 3) {
        Player.MessageBox('输入格式错误，请使用：玩家名字-数量-类型\\（1=积分，2=元宝，3=回收比例，4=爆率，5=等级，6=挑战倍数）');
        return;
    }

    const PlayerName = list[0].trim();
    const 数量 = Number(list[1]);
    const 类型 = list[2].trim();

    // 数值校验
    if (isNaN(数量) || 数量 < 0) {
        Player.MessageBox('数量必须大于0');
        return;
    }

    const a: TPlayObject = GameLib.FindPlayer(PlayerName);
    if (!a) {
        Player.MessageBox(`玩家【${PlayerName}】不存在或不在线`);
        return;
    }

    switch (类型) {
        case '1': // 真实充值
            a.V.真实充值 = a.V.真实充值 + 数量;
            Player.MessageBox(`成功给玩家【${PlayerName}】增加真实充值 ${数量}`);
            a.MessageBox(`管理员 ${Player.Name} 给你增加了 ${数量} 真实充值`);
            break;

        case '2': // 元宝
            增加.元宝(a, 数量, `成功给玩家【${PlayerName}】增加元宝 ${数量}`);
            a.MessageBox(`管理员 ${Player.Name} 给你增加了 ${数量} 元宝`);
            break;

        case '3': // 回收比例
            a.V.赞助回收 = 数量
            Player.MessageBox(`成功为玩家【${PlayerName}】设置回收比例为 ${数量}`);
            a.MessageBox(`管理员 ${Player.Name} 给你设置了回收比例为 ${数量}`);
            break;

        case '4': // 爆率
            a.V.赞助爆率 = 数量
            Player.MessageBox(`成功为玩家【${PlayerName}】设置爆率为 ${数量}`);
            a.MessageBox(`管理员 ${Player.Name} 给你设置了爆率为 ${数量}`);
            break;

        case '5': // 等级
            a.SetLevel(数量);
            Player.MessageBox(`成功为玩家【${PlayerName}】设置等级为 ${数量}`);
            a.MessageBox(`管理员 ${Player.Name} 给你设置了等级为 ${数量}`);
            break;
        case '6': // 挑战
            a.V.最高挑战倍数 = 数量
            Player.MessageBox(`成功为玩家【${PlayerName}】设置挑战倍数为 ${数量}`);
            a.MessageBox(`管理员 ${Player.Name} 给你设置了挑战倍数为 ${数量}`);
            break;
        default:
            Player.MessageBox('类型错误，请输入1（积分）、2（元宝）、3（回收比例）、4（爆率）、5（等级）、6（挑战倍数）');
            return;
    }
}
export function InPutString20(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //格式：玩家名字-物品名字-数量   刷物品
    const str: string = Args.Str[0]
    const list: string[] = str.split('-')   //字符串转数字 以,分割  也就是说[数组1,数组2,,数组3,.......]
    let item: TUserItem
    let PlayerName = list[0] //数组1 也就是从0开始
    let 物品名字 = list[1]
    let 物品数量 = Number(list[2])
    let a: TPlayObject = GameLib.FindPlayer(PlayerName);
    if (a == null) { Player.MessageBox('玩家名字不正确!'); return }
    Npc.Give(a, 物品名字, 物品数量)
    if (item) {
        item.SetOutWay1(种族第一, 种族属性[random(种族属性.length)])
        item.SetOutWay2(种族第一, randomRange(1 + random(10), 1 + random(10)))
        Player.UpdateItem(item)
    }
    Player.MessageBox(`给玩家'${a.GetName()}'${物品数量}个${物品名字}`)
}
export function InPutString(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const str: string = Args.Str[0]
    const list: string[] = str.split('-')   //字符串转数字 以,分割  也就是说[数组1,数组2,,数组3,.......]
    let Magic: TUserMagic;
    let 技能名字 = list[0] //数组1 也就是从0开始
    let 技能等级 = Number(list[1])
    Magic = Player.FindSkill(技能名字);
    if (Magic) {
        Magic.Level = 技能等级;
        Player.UpdateMagic(Magic);
    } else { Player.MessageBox(`${技能名字}不正确!`) }

}
export function 我要秒怪(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.我要秒怪 == false) {
        Player.V.我要秒怪 = true
        Player.MessageBox('秒怪已经开启,打怪就是秒')
    } else {
        Player.V.我要秒怪 = false
        Player.MessageBox('秒怪已经恢复')
    }
}
export function 从新刷怪(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    GameLib.R[Player.GetMapName()] = false
    Player.MessageBox('从新刷怪完毕')
    // Player.AddSkill('嘲讽吸怪')
}
export function 刷练功师(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 喽啰: TActorList
    let Actor: TActor
    喽啰 = GameLib.MonGen(Player.GetMapName(), '弓箭护卫', 1, Player.GetMapX(), Player.GetMapY(), 0, 0, 0, 1, true, true, true, true)
    Actor = 喽啰.Actor(0)
    Actor.SetMaxHP(9999999999999)
    Actor.SetHP(Actor.GetMaxHP())
    Actor.SetDCMin(1)
    Actor.SetDCMax(1)
    Actor.SetACMin(1)
    Actor.SetACMax(1)
    Actor.SetTriggerSelectMagicBeforeAttack(true)
    // let 宝宝血量 = '200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000'
    let 宝宝血量原始 = '5e200'
    let 宝宝血量 = 转大数值(宝宝血量原始)  // 将 '5e200' 转换为 '5' + '0'.repeat(200)
    let 宝宝攻击小 = '1000'
    let 宝宝攻击大 = '1000'
    let 宝宝防御小 = '1'
    let 宝宝防御大 = '10'
    Actor.SetSVar(原始名字, '弓箭护卫')
    Actor.SetSVar(92, String(宝宝血量))
    // Actor.SetSVar(91, Actor.GetSVar(92))
    Actor.SetSVar(91, 宝宝血量)
    // let 攻击计算 = 整数相乘(整数相乘(整数相乘(怪怪星星.toString(), 攻击大), 乘以倍数.toString()), 循环.翻倍.toString())
    Actor.SetSVar(93, String(宝宝攻击小))
    Actor.SetSVar(94, String(宝宝攻击大))
    // let 物理防御 = 整数相乘(整数相乘(整数相乘(怪怪星星.toString(), 怪物防御), 乘以倍数.toString()), 循环.翻倍.toString())
    Actor.SetSVar(95, String(宝宝防御小))
    Actor.SetSVar(96, String(宝宝防御大))
    let 新字符 = { 怪物名字: Actor.Name, 怪物等级: String(Actor.Level), 血量: 宝宝血量, 攻击: 宝宝攻击大, 防御: 宝宝防御大, 怪物颜色: '', 怪物标志: 1, }
    GameLib.R.怪物信息 = GameLib.R.怪物信息 || {};
    GameLib.R.怪物信息[`${Actor.Handle}`] = JSON.stringify(新字符)
    Actor.SetSVar(98, JSON.stringify(新字符))
    血量显示(Actor)

}

export function 来个生肖(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 基本属性_职业 = []
    let 基本属性_数值 = []
    let 生肖基础属性 = []
    let 装备属性记录 = {
        职业属性_职业: 基本属性_职业,
        职业属性_属性: 基本属性_数值,
        职业属性_生肖: 生肖基础属性,
    }
    let item: TUserItem
    item = Player.GiveItem('新手龙')

    // let 数值 = '99999999999999999999999999999999999999999999999999999999999999'
    let 数值 = '1000'
    let OUT = 30 // 万箭齐发倍功 228   伤害 432   

    let 前端数字 = 数字转单位2((数值))
    let 后端单位 = 数字转单位3((数值))
    // let 位数 = 数值.length
    // let 位数2 = 数值2.length
    // let 新数值 = 装备数值简写(数值) + ' {S=251;C=251;T=' + 位数 + '}'
    // let 新数值2 = 装备数值简写(数值2) + ' {S=' + 位数2 + ';C=251}'

    // item.SetCustomText(0, 前端数字)
    // item.SetCustomText(1, 后端单位)

    item.SetOutWay1(40, OUT)
    item.SetOutWay2(40, Number(前端数字))
    item.SetOutWay3(40, Number(后端单位))
    item.SetOutWay1(39, 31)
    item.SetOutWay2(39, Number(前端数字))
    item.SetOutWay3(39, Number(后端单位))
    // item.SetOutWay4(40, Number(位数))
    // item.SetCustomText(1, 新数值)
    // // item.SetCustomText(1, 位数.toString())
    // item.SetOutWay1(39, OUT + 1)
    // item.SetCustomText(0, 新数值2)

    基本属性_职业.push(OUT)
    基本属性_数值.push(数值)

    item.SetCustomDesc(JSON.stringify(装备属性记录))
    Player.UpdateItem(item)

    // let item1 = Player.GiveItem('经验勋章')
// item1.SetOutWay1(0,1)
// item1.SetOutWay2(0,0)
// item1.SetOutWay3(0,100)
// 
// Player.UpdateItem(item1)
// 
    console.log(`Player.R.万箭齐发伤害:${Player.R.万箭齐发伤害}`)
}
export function 地图(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    switch (Args.Int[0]) {
        case 1: GameLib.ClearMapMon(Player.GetMapName()); break
        case 2: 按分钟检测(Player); break
    }
}
export function 刷稻草人(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    GameLib.MonGen(Player.Map.MapName, '稻草人', 1, 106, 97,  0, 0, 0, 1, true, true, true, true)
}
export function 传送(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Args.Str[0] == '边界村') {
        Player.MapMove('边界村', 69, 119)
    } else {
        Player.RandomMove(Args.Str[0])
    }

}

export function 召唤(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let Actor: TActor
    Player.KillSlave('')
    let List = GameLib.MonGen(Player.Map.MapName, '沃玛战士', 1, Player.MapX, Player.MapY, 0, 0)
    Actor = List.Actor(0)
    Actor.SetMaxHP(100)
    Actor.SetHP(Actor.GetMaxHP())
    Actor.SetViewRange(15)
    Actor.SetMaster(Player)
    Actor.SetMasterRoyaltyTick(108000000)
    Actor.SetThroughHuman(true)
    Actor.SetThroughMonster(true)
    Actor.SetDCMin(10)
    Actor.SetDCMax(10)
    Actor.SetAttackSpeed(300)
    Actor.SetWalkSpeed(300)
}
export function 刷怪(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    实时扣血(Player, Player, js_number(Player.GetSVar(91), `0.3`, 3))
}
const 种族属性 = [350, 351, 352]
const 拆分值 = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
export function 来个装备(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let item: TUserItem
    item = Player.GiveItem('青铜戒指')
    if (item) {
        item.Rename(item.GetName() + '[传承]')
        item.SetOutWay1(种族第一, 种族属性[random(种族属性.length)])
        item.SetOutWay2(种族第一, randomRange(1 + random(10), 1 + random(10)))
        // item.SetOutWay1(种族第一,350)
        // item.SetOutWay2(种族第一,78)

        // item.SetOutWay1(种族第二,351)
        // item.SetOutWay2(种族第二,45)

        // item.SetOutWay1(种族第三,352)
        // item.SetOutWay2(种族第三,209)
        // item.SetOutWay1(2, 37)
        // item.SetOutWay2(2, 1000)
        // item.SetOutWay1(3,51)
        // item.SetOutWay2(3,5)
        // item.Rename('猎人·' + item.GetName() + '[底材]')
        // item.Rename('猎人·' + '粗糙' + item.GetName() + '·[劣质]')
        Player.UpdateItem(item)
    }
}
export function 清空背包(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let item: TUserItem
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        item = Player.GetBagItem(I);
        if (item.GetName() != '回城石' && item.GetName() != '随机传送石') {
            // Npc.Take(Player, item.GetName())
            Player.DeleteItem(item)
        }
    }
    // Npc.Give(Player, '回城石', 1)
    // Npc.Give(Player, '随机传送石', 1)
}
export function 加满(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    实时回血(Player, Player.GetSVar(92))
}
export function 清空(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.SetSVar(91, '1')
    // 实时扣血(Player,Player,Decimal.mul(Player.GetSVar(92),1))
    血量显示(Player)
    // console.log(Decimal.mul(Player.GetSVar(91), 99).div(100))
    // 实时扣血(Player, Player, Decimal.mul(Player.GetSVar(91), 99).div(100))
    // console.log(Player.GetSVar(91).toString())
    // console.log(Decimal.mul(Player.GetSVar(91), 99).div(100).toString())
    // console.log(Decimal.div(Player.GetSVar(91), 100).toString())
}
export function 宝宝群雷关闭(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.R.宝宝释放群雷 = false
}
export function 猎人宝宝群攻关闭(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.R.猎人宝宝释放群攻 = false
    Player.KillSlave('')
}
export function 罗汉金刚护体关闭(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.R.罗汉技能伤害 = false
}
export function 罗汉无敌关闭(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.SetSuperManMode(false)
}
