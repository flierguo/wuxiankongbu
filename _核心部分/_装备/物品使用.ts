import { 使用神器组件 } from "./神器统计"
import { 组件套装映射, 特殊单件映射 } from "../_服务/神器配置"
import { 装备属性统计 } from "./属性统计"
import { 小于, 智能计算 } from "../../_大数值/核心计算方法";
import { 实时回血 } from "../字符计算";

export function 使用物品(Npc: TNormNpc, Player: TPlayObject, UserItem: TUserItem): void {
    const X = random(10)

    // 检查是否为神器组件（套装组件或特殊单件）
    const 物品名称 = UserItem.GetName();
    if (组件套装映射.has(物品名称) || 特殊单件映射.has(物品名称)) {
        使用神器组件(Player, 物品名称)
        装备属性统计(Player)
        return  // 神器组件使用后直接返回
    }
    switch (UserItem.AniCount) {
        case 99: //随机传送石
            //if (Player.R.被攻击状态) { Player.SendMessage(`战斗状态下无法使用随机传送石!剩余时间:${5-Player.R.被攻击不允许随机}`); return }
            Player.RandomMove(Player.GetMapName())
            return
        case 100: //回城石
            // if (Player.V.职业 == '') { Player.MessageBox('请先选择职业!'); return }
            // if (Player.V.种族 == '') { Player.MessageBox('请先选择种族!'); Player.MapMove('边界村', 69, 119); return }
            Player.MapMove('主城', random(10) + 105, random(10) + 120)
            return
        case 101: //血瓶
            if (小于(Player.GetSVar(91), Player.GetSVar(92))) {
                const 回血量 = 智能计算(Player.GetSVar(92), '0.05', 3);
                实时回血(Player, 回血量);
            }
            return
        case 103: //修复神水
            Player.RepairAll()
            Player.SendMessage('全身装备已经修理完毕!', 1)
            return
        case 104: //1元宝
            Player.SetGameGold(Player.GetGameGold() + 1)
            Player.GoldChanged()
            return
        case 105: //5元宝
            Player.SetGameGold(Player.GetGameGold() + 5)
            Player.GoldChanged()
            return
        case 106: //20元宝
            Player.SetGameGold(Player.GetGameGold() + 20)
            Player.GoldChanged()
            return
        case 107: //50元宝
            Player.SetGameGold(Player.GetGameGold() + 50)
            Player.GoldChanged()
            return
        case 108: //100元宝
            Player.SetGameGold(Player.GetGameGold() + 100)
            Player.GoldChanged()
            return
        case 109: //500元宝
            Player.SetGameGold(Player.GetGameGold() + 500)
            Player.GoldChanged()
            return
        case 110: //200元宝
            Player.SetGameGold(Player.GetGameGold() + 200)
            Player.GoldChanged()
            return
        case 111: //1000
            Player.SetGameGold(Player.GetGameGold() + 1000)
            Player.GoldChanged()
            return
        case 112: //2000
            Player.SetGameGold(Player.GetGameGold() + 2000)
            Player.GoldChanged()
            return
        case 113: //5000
            Player.SetGameGold(Player.GetGameGold() + 5000)
            Player.GoldChanged()
            return
        case 114: //10000
            Player.SetGameGold(Player.GetGameGold() + 10000)
            Player.GoldChanged()
            return
        default: // 其他物品继续往下执行
            break
    }

    switch (UserItem.GetDisplayName()) {
        case '第二章回城石':
            Player.MapMove('第二章', 39 + X, 57 + X)
            break;
        case '第三章回城石':
            Player.MapMove('第三章', 330 + X, 330 + X)
            break;
        case '第四章回城石':
            Player.MapMove('第四章', 175 + X, 325 + X)
            break;
        case '第五章回城石':
            Player.MapMove('第五章', 240 + X, 199 + X)
            break;
        case '第六章回城石':
            Player.MapMove('第六章', 90 + X, 110 + X)
            break;
        case '第七章回城石':
            Player.MapMove('第七章', 123 + X, 156 + X)
            break;
        case '第八章回城石':
            Player.MapMove('第八章', 39 + X, 57 + X)
            break;
        case '第九章回城石':
            Player.MapMove('第九章', 330 + X, 330 + X)
            break;
        case '第十章回城石':
            Player.MapMove('第十章', 10, 10)
            break;
        case '第十一章回城石':
            Player.MapMove('第十一章', 10, 10)
            break;
        case '第十二章回城石':
            Player.MapMove('第十二章', 10, 10)
            break;
        case '第十三章回城石':
            Player.MapMove('第十三章', 10, 10)
            break;
        case '第十四章回城石':
            Player.MapMove('第十四章', 10, 10)
            break;
        case '第十五章回城石':
            Player.MapMove('第十五章', 10, 10)
            break;
    }
    装备属性统计(Player)
}