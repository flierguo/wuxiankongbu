import { js_number, js_war } from "../../全局脚本[公共单元]/utils/计算方法_优化版"
import { 大数值整数简写 } from "./延时跳转"

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.无限之熵等级 ??= '0'
    Player.V.杀怪属性值 ??= '0'
    Player.V.杀怪翻倍 ??= '1'

    const 基础属性值 = 5000;

    // 计算等级段数：每50级一个段
    const 无限之熵等级数值 = parseInt(Player.V.无限之熵等级);
    const 等级段数 = Math.floor(无限之熵等级数值 / 20);
    
    // 计算额外倍数：10^等级段数 (0-49级=1倍, 50-99级=10倍, 100-149级=100倍...)
    let 额外倍数 = '1';
    for (let i = 0; i < 等级段数; i++) {
        额外倍数 = js_number(额外倍数, '10', 3); // 每段乘以10
    }
   if ( js_war(Player.R.魔器离钩加成 ,'0') > 0) {
    额外倍数 = js_number(额外倍数, Player.R.魔器离钩加成, 3);
   }
   console.log(`额外倍数:${额外倍数} 魔器离钩加成:${Player.R.魔器离钩加成} 玩家:${Player.GetName()}`)
    // 调整后的属性值 = 基础属性值 * 额外倍数
    const 调整后属性值 = js_number(String(基础属性值), 额外倍数, 3);

    const S = `\\\\
                            {S=无限之熵;C=251} \\\\
    {S=无限之熵初始属性介绍:;C=9}\\
    {S=① 击杀4大陆及以上任意怪物;c=20}\\
    {S=② 击杀普通怪物主属性增加5000点;c=20}\\
    {S=③ 击杀BOSS怪物主属性增加10000点;c=20}\\
    {S=④ 等级提高一级,增加属性提高5000点(BOSS 10000点);c=20}\\
    {S=⑤ 最高可提升到无限级;c=20}\\
    {S=⑥ 特殊介绍:可通过使用 [无限之殇] 道具,使杀怪属性值翻倍;C=9}\\
    {S=您当前杀怪可增加属性为;C=9}: {S=${大数值整数简写(调整后属性值)};C=23} 点\\
    {S=您当前杀怪总增加属性为;C=9}: {S=${大数值整数简写(Player.V.杀怪属性值)};C=23} 点\\
    {S=您当前的无限之熵等级为;C=9}: {S=${Player.V.无限之熵等级};C=23} 级\\
    {S=下一级需要材料:500个熵之精魄 + ${(Number(Player.V.无限之熵等级) + 1) * 5000}元宝;C=253}\\
    {S=PS:人物和宠物击杀怪物均可增加属性(不享受各种百分比加成);C=254}\\
    {S=PS:[无限之殇] 道具在 泗水祭坛 BOSS掉落;C=254}       <提升等级/@提升等级>\\     

    `
    Npc.SayEx(Player, 'Npc小窗口', S)

}
export function 提升等级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 数量 = 500
    let 元宝数量 = (Number(Player.V.无限之熵等级) + 1) * 5000
    if (元宝数量 >= 5000000) { 元宝数量 = 5000000 }

    if (Player.GetItemCount('熵之精魄') < 数量) { Player.MessageBox(`熵之精魄数量不足${数量}个,无法升级!`); return }
    if (Player.GetGameGold() < 元宝数量) { Player.MessageBox(`元宝数量不足${元宝数量}个,无法升级!`); return }
    Npc.Take(Player, '熵之精魄', 数量)
    Player.SetGameGold(Player.GetGameGold() - 元宝数量)
    Player.GoldChanged()
    Player.V.无限之熵等级 = js_number(Player.V.无限之熵等级, '1', 1)
    Player.MessageBox(`升级成功,当前无限之熵等级${Player.V.无限之熵等级}`)
    Main(Npc, Player, Args)
}

