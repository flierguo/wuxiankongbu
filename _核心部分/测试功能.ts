import { 装备属性统计 } from "./_装备/属性统计"
import * as 地图 from "./_地图/地图"
import * as 功能 from "./_功能"
import { 神器套装配置 } from "./_装备/神器统计"
import { 原始名字 } from "./基础常量"
import { 血量显示 } from "./字符计算"
import { 转大数值 } from "../_大数值/核心计算方法"




export function 测试功能(Npc: TNormNpc, Player: TPlayObject): void {
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


        装备属性统计(Player)

        const S = `\\\\\\\\
    <{S=清空背包;X=20;Y=30}/@测试功能.清空背包>
    <{S=刷练功师;X=120;Y=30}/@测试功能.刷练功师>
    <{S=我要秒怪;X=220;Y=30}/@测试功能.我要秒怪>
    <{S=给与套装;X=320;Y=30}/@@测试功能.InPutString1(格式:玩家-套装名称)>

    <{S=地图传送(下标);X=20;Y=60}/@@测试功能.InPutString2(输入下标)> 
    <{S=地图传送(名称);X=120;Y=60}/@@测试功能.InPutString3(输入名字)> \\
    <{S=给玩家刷属性;X=220;Y=60}/@@测试功能.InPutString4(玩家-属性-类型1（积分）、2（元宝）、3（回收比例）、4（爆率）、5（等级）)>
    <{S=属性测试输出;X=320;Y=60}/@测试功能.属性测试输出>

    
    `

        Npc.SayEx(Player, 'NPC大窗口', S)
    }
}

export function 属性测试输出(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.SendMessage(`最终爆率加成:${Player.R.最终爆率加成}`)
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
/**
 * 套装给与 - 给予玩家整套神器组件
 * @param 参数 格式：玩家名称-套装名称
 * @returns 是否给予成功
 */
export function InPutString1(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): boolean {  //套装给与
    // 验证用户是否输入了内容
    if (!Args.Str || !Args.Str[0]) {
        Player.SendMessage('请输入参数，格式：玩家名称-套装名称');
        return false;
    }

    const str: string = Args.Str[0];
    const 分割: string[] = str.split('-');

    if (分割.length !== 2) {
        Player.SendMessage('参数格式错误，正确格式：玩家名称-套装名称');
        return false;
    }

    const 玩家名称 = 分割[0].trim();
    const 套装名称 = 分割[1].trim();

    console.log(玩家名称, 套装名称);
    // 查找套装配置
    const 套装 = 神器套装配置.find(s => s.套装名称 === 套装名称);
    if (!套装) {
        Player.SendMessage(`未找到套装：${套装名称}`);
        Player.SendMessage(`可用套装：${神器套装配置.map(s => s.套装名称).join('、')}`);
        return false;
    }

    // 使用 GameLib.FindPlayer 查找玩家（91m2说明书推荐方式）
    const 目标玩家: TPlayObject = GameLib.FindPlayer(玩家名称);
    if (!目标玩家) {
        Player.SendMessage(`未找到在线玩家：${玩家名称}`);
        return false;
    }

    // 给予所有组件
    let 成功数量 = 0;
    for (const 组件名称 of 套装.组件列表) {
        const item = 目标玩家.GiveItem(组件名称);
        if (item) {
            成功数量++;
        }
    }

    if (成功数量 > 0) {
        目标玩家.SendMessage(`获得 ${套装名称} 全套组件(${成功数量}/${套装.组件列表.length})`, 1);
        Player.SendMessage(`成功给予 ${玩家名称} ${套装名称} 全套组件(${成功数量}/${套装.组件列表.length})`);
        return true;
    } else {
        Player.SendMessage(`给予失败，可能是背包已满或物品不存在`);
        return false;
    }
}


export function InPutString2(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //地图传送
    let 下标 = Args.Int[0];
    if (下标 != null) {
        Player.Move(地图.取地图ID(下标), 1, 1)
    } else { Player.MessageBox('玩家名字不正确,或者不在线'); }

}

export function InPutString3(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {   //
    let 下标 = Args.Str[0];
    if (下标 != null) {
        Player.RandomMove(下标)
    } else { Player.MessageBox('玩家名字不正确,或者不在线'); }

}

export function InPutString4(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //格式: 玩家名字-属性-数量  刷属性
    const str: string = Args.Str[0];
    const list: string[] = str.split('-');   // 格式：玩家名字-数量-类型

    // 参数校验
    if (list.length < 3) {
        Player.MessageBox('输入格式错误，请使用：玩家名字-数量-类型\\（1=积分，2=元宝，3=回收比例，4=爆率，5=等级）');
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
            功能.增加.元宝(a, 数量, `成功给玩家【${PlayerName}】增加元宝 ${数量}`);
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
        default:
            Player.MessageBox('类型错误，请输入1（积分）、2（元宝）、3（回收比例）、4（爆率）、5（等级）');
            return;
    }
}