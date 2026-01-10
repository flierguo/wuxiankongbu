
import { 装备属性统计 } from "../../_核心部分/_装备/属性统计";
import { js_number } from "../../全局脚本[公共单元]/utils/计算方法_优化版";
export function 使用物品(Npc: TNormNpc, Player: TPlayObject, UserItem: TUserItem): void {
    Randomize()
    let X = random(10)
    switch (UserItem.AniCount) {
        case 99: //随机传送石
            //if (Player.R.被攻击状态) { Player.SendMessage(`战斗状态下无法使用随机传送石!剩余时间:${5-Player.R.被攻击不允许随机}`); return }
            Player.RandomMove(Player.GetMapName())
            return
        case 100: //回城石
            if (Player.V.职业 == '') { Player.MessageBox('请先选择职业!'); return }
            // if (Player.V.种族 == '') { Player.MessageBox('请先选择种族!'); Player.MapMove('边界村', 69, 119); return }
            Player.MapMove('主城', random(10) + 105, random(10) + 120)
            break
        case 101: //灵晶盒
            const 灵晶盒物品 = ['灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石',
                '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石',
                '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石',
                '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '灵石', '晶石', '超级灵石', '超级晶石']
            let 灵晶盒物品几率 = 灵晶盒物品[random(灵晶盒物品.length)]
            Npc.Give(Player, 灵晶盒物品几率, 1)
            // GameLib.BroadcastCenterMessage(`玩家${Player.GetName()}打开灵晶盒获取了1个${灵晶盒物品几率}`);
            return
        case 102: //锦囊
            const 锦囊物品 = ['种族雕像', '粉水晶', '黄水晶', '超级蓝水晶', '晶石', '灵石', '血脉精玉', '种族雕像', '粉水晶', '黄水晶', '超级蓝水晶', '晶石', '灵石', '血脉精玉',
                '种族雕像', '粉水晶', '黄水晶', '超级蓝水晶', '晶石', '灵石', '血脉精玉', '种族雕像', '粉水晶', '黄水晶', '超级蓝水晶', '晶石', '灵石', '血脉精玉',
                '种族雕像', '粉水晶', '黄水晶', '超级蓝水晶', '晶石', '灵石', '血脉精玉', '种族雕像', '粉水晶', '黄水晶', '超级蓝水晶', '晶石', '灵石', '血脉精玉',
                '种族雕像', '粉水晶', '黄水晶', '超级蓝水晶', '晶石', '灵石', '血脉精玉', '种族雕像', '粉水晶', '黄水晶', '超级蓝水晶', '晶石', '灵石', '血脉精玉',
                '种族雕像', '粉水晶', '黄水晶', '超级蓝水晶', '晶石', '灵石', '血脉精玉', '种族雕像', '粉水晶', '黄水晶', '超级蓝水晶', '晶石', '灵石', '血脉精玉',
                '种族雕像', '粉水晶', '黄水晶', '超级蓝水晶', '晶石', '灵石', '血脉精玉', '种族雕像', '粉水晶', '黄水晶', '超级蓝水晶', '晶石', '灵石', '血脉精玉',
                '种族雕像', '粉水晶', '黄水晶', '超级蓝水晶', '晶石', '灵石', '血脉精玉', '种族雕像', '粉水晶', '黄水晶', '超级蓝水晶', '晶石', '灵石', '血脉精玉',
                '命运之书', '超级粉水晶', '超级黄水晶', '超级灵石', '超级晶石']
            let 锦囊物品几率 = 锦囊物品[random(锦囊物品.length)]
            Npc.Give(Player, 锦囊物品几率, 1)
            // GameLib.BroadcastCenterMessage(`玩家${Player.GetName()}打开锦囊获取了1个${锦囊物品几率}`);
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
        case 115: //等级石500
            if (Player.GetLevel() < 500) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到500级,无法使用;C=250}`, 1)
            }
            return
        case 116: //等级石1000
            if (Player.GetLevel() < 1000) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到1000级,无法使用;C=250}`, 1)
            }
            return
        case 117: //等级石1500
            if (Player.GetLevel() < 1500) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到1500级,无法使用;C=250}`, 1)
            }
            return
        case 118: //等级石2000
            if (Player.GetLevel() < 2000) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到2000级,无法使用;C=250}`, 1)
            }
            return
        case 119: //等级石2500
            if (Player.GetLevel() < 2500) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到2500级,无法使用;C=250}`, 1)
            }
            return
        case 120: //等级石3000
            if (Player.GetLevel() < 3000) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到3000级,无法使用;C=250}`, 1)
            }
            return
        case 121: //等级石3500
            if (Player.GetLevel() < 3500) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到3500级,无法使用;C=250}`, 1)
            }
            return
        case 122: //等级石4000
            if (Player.GetLevel() < 4000) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到4000级,无法使用;C=250}`, 1)
            }
            return
        case 123: //等级石4500
            if (Player.GetLevel() < 4500) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到4500级,无法使用;C=250}`, 1)
            }
            return
        case 124: //等级石5000
            if (Player.GetLevel() < 5000) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到5000级,无法使用;C=250}`, 1)
            }
            return
        case 125: //等级石5500
            if (Player.GetLevel() < 5500) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到5500级,无法使用;C=250}`, 1)
            }
            return
        case 126: //等级石6000
            if (Player.GetLevel() < 6000) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到6000级,无法使用;C=250}`, 1)
            }
            return
        case 127: //等级石6500
            if (Player.GetLevel() < 6500) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到6500级,无法使用;C=250}`, 1)
            }
            return
        case 128: //等级石7000
            if (Player.GetLevel() < 7000) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到7000级,无法使用;C=250}`, 1)
            }
            return
        case 129: //等级石7500
            if (Player.GetLevel() < 7500) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到7500级,无法使用;C=250}`, 1)
            }
            return
        case 130: //等级石8000
            if (Player.GetLevel() < 8000) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到8000级,无法使用;C=250}`, 1)
            }
            return
        case 131: //等级石8500
            if (Player.GetLevel() < 8500) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到8500级,无法使用;C=250}`, 1)
            }
            return
        case 132: //等级石9000
            if (Player.GetLevel() < 9000) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到9000级,无法使用;C=250}`, 1)
            }
            return
        case 133: //等级石9500
            if (Player.GetLevel() < 9500) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到9500级,无法使用;C=250}`, 1)
            }
            return
        case 134: //等级石10000
            if (Player.GetLevel() < 10000) {
                Player.SetLevel(Player.GetLevel() + 1)
                Player.SendMessage(`{S=你成功提升到${Player.GetLevel()}级;C=250}`, 1)
                return
            } else {
                Player.SendMessage(`{S=你已经达到10000级,无法使用;C=250}`, 1)
            }
            return
        case 135: //无限之殇
            Player.V.杀怪翻倍 = js_number(Player.V.杀怪翻倍, '1', 1)
            const 总倍率 = js_number('0', Player.V.杀怪翻倍, 8);
            Player.SendMessage(`{S=你成功使用无限之殇,当前已使用${Player.V.杀怪翻倍}个,杀怪增加属性提高${总倍率}倍;C=250}`, 1)
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=9}使用‘{S=无限之殇;C=22},当前已使用${Player.V.杀怪翻倍}个,杀怪增加属性提高{S=${总倍率}倍;C=58}!`);
            GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=9}使用‘{S=无限之殇;C=22},当前已使用${Player.V.杀怪翻倍}个,杀怪增加属性提高{S=${总倍率}倍;C=58}!`);
            return
        case 136: //圣墟点数
            Player.V.圣墟点数 += 10
            Player.SendMessage(`{S=你成功使用圣墟点数,当前圣墟点数为${Player.V.圣墟点数};C=250}`, 1)
            return
        case 137: //圣墟点数
            Player.V.圣墟点数 += 20
            Player.SendMessage(`{S=你成功使用圣墟点数,当前圣墟点数为${Player.V.圣墟点数};C=250}`, 1)
            return
        case 138: //圣墟点数
            Player.V.圣墟点数 += 50
            Player.SendMessage(`{S=你成功使用圣墟点数,当前圣墟点数为${Player.V.圣墟点数};C=250}`, 1)
            return
        case 201:
            Player.GamePoint += 1
            Player.GoldChanged()
            return
        case 202:
            Player.GamePoint += 5
            Player.GoldChanged()
            return
        case 203:
            Player.GamePoint += 10
            Player.GoldChanged()
            return
        case 204:
            Player.GamePoint += 100
            Player.GoldChanged()
            return

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