import { js_number } from "../../全局脚本[公共单元]/utils/计算方法";
import { 实时回血 } from "../../大数值版本/字符计算";
import { 装备属性统计 } from '../../应用智能优化版';
import { 天赋五, 职业第一条 } from "../[装备]/_ITEM_Base";
import { 大数值整数简写 } from "./延时跳转";

export function Main2(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.R.临时力量 ??= '0'
    Player.R.临时耐力 ??= '0'
    Player.R.临时体质 ??= '0'
    Player.R.临时力量 = '0'
    Player.R.临时耐力 = '0'
    Player.R.临时体质 = '0'
    if (Player.Dress != null) { Main1(Npc, Player, Args, Player.Dress); }//衣服
    if (Player.Wepon != null) { Main1(Npc, Player, Args, Player.Wepon); }//武器
    if (Player.NeckLace != null) { Main1(Npc, Player, Args, Player.NeckLace); }//项链
    if (Player.Helmet != null) { Main1(Npc, Player, Args, Player.Helmet); }//头盔
    if (Player.ArmringLeft != null) { Main1(Npc, Player, Args, Player.ArmringLeft); }//左手镯
    if (Player.ArmringRight != null) { Main1(Npc, Player, Args, Player.ArmringRight); }//右手镯
    if (Player.RingLeft != null) { Main1(Npc, Player, Args, Player.RingLeft); }//左戒指
    if (Player.RingRight != null) { Main1(Npc, Player, Args, Player.RingRight); }//右戒指
    if (Player.Belt != null) { Main1(Npc, Player, Args, Player.Belt); }//腰带
    if (Player.Boots != null) { Main1(Npc, Player, Args, Player.Boots); }//鞋
    // Player.SendMessage(`请穿戴任意装备后再来查看。`)
}

export function Main1(Npc: TNormNpc, Player: TPlayObject, Args: TArgs, UserItem: TUserItem): void {
    const 基础属性条数 = 0;
    // for (let i = 职业第一条; i <= 天赋五; i++) {
    //     switch (UserItem.GetOutWay1(i)) {
    //         case 350: Player.R.临时力量 = Player.R.临时力量 + UserItem.GetOutWay2(i); break
    //         case 351: Player.R.临时耐力 = Player.R.临时耐力 + UserItem.GetOutWay2(i); break
    //         case 352: Player.R.临时体质 = Player.R.临时体质 + UserItem.GetOutWay2(i); break
    //     }
    // }
    if (UserItem.GetCustomDesc() != ``) {
        let 装备字符串 = JSON.parse(UserItem.GetCustomDesc())
        if (装备字符串.职业属性_职业) {
            let 装备属性条数 = 装备字符串.职业属性_职业.length
            for (let e = 0; e < 装备属性条数; e++) {
                if (装备字符串.职业属性_职业[e] != null && 装备字符串.职业属性_属性[e] != null) {
                    switch (Number(装备字符串.职业属性_职业[e])) {
                        case 350: Player.R.临时力量 = js_number(Player.R.临时力量, 装备字符串.职业属性_属性[e], 1); break;
                        case 351: Player.R.临时耐力 = js_number(Player.R.临时耐力, 装备字符串.职业属性_属性[e], 1); break;
                        case 352: Player.R.临时体质 = js_number(Player.R.临时体质, 装备字符串.职业属性_属性[e], 1); break;
                    }

                }
            }
        }
    }

    let 体质倍数 = 0
    let 力量倍数 = 0
    let 耐力倍数 = 0
    switch (Player.V.种族) {
        case '人族':
            体质倍数 = 1.2
            力量倍数 = 1.6
            耐力倍数 = 1.2
            break
        case '妖族':
            体质倍数 = 1.5
            力量倍数 = 1.2
            耐力倍数 = 1.3
            break
        case '血族':
            体质倍数 = 1.6
            力量倍数 = 1.2
            耐力倍数 = 1.2
            break
        case '神族':
            体质倍数 = 1.2
            力量倍数 = 1.2
            耐力倍数 = 1.6
            break
        case '龙族':
            体质倍数 = 1.3
            力量倍数 = 1.3
            耐力倍数 = 1.3
            break
        case '魔族':
            体质倍数 = 1.4
            力量倍数 = 1.3
            耐力倍数 = 1.3
            break
        case '兽族':
            体质倍数 = 1.2
            力量倍数 = 1.5
            耐力倍数 = 1.3
            break
        case '精灵':
            体质倍数 = 1.3
            力量倍数 = 1.2
            耐力倍数 = 1.5
            break
    }
    let 百分比 = 0
    Player.V.种族阶数 <= 100 ? 百分比 = Player.V.种族阶数 * 1 : 百分比 = Player.V.种族阶数 * 2 - 100

    let 体质综合 = js_number(Player.R.临时体质, String(10 * Player.GetLevel() * 体质倍数 * (1 + Player.V.种族阶数 / 100)), 3)
    let 力量综合 = js_number(Player.R.临时力量, String(0.05 * Player.GetLevel() * 力量倍数 * (1 + Player.V.种族阶数 / 100)), 3)
    let 耐力综合 = js_number(Player.R.临时耐力, String(0.05 * Player.GetLevel() * 耐力倍数 * (1 + Player.V.种族阶数 / 100)), 3)

    const S = `\\\\\\\\\\
         当前种族:${Player.V.种族}\\
         种族阶数:${Player.V.种族阶数}         {S=强化种族属性:${百分比}%;C=253}\\\\
         种族属性:\\
         {S=${大数值整数简写(Player.R.临时体质)} 点体质*10*${Player.GetLevel()}(角色等级)*${体质倍数} * ${(1 + Player.V.种族阶数 / 100)} (种族等级加成) = ${大数值整数简写(体质综合)}  [生命值];C=251}\\
         {S=${大数值整数简写(Player.R.临时力量)} 点力量*0.05*${Player.GetLevel()}(角色等级)*${力量倍数} * ${(1 + Player.V.种族阶数 / 100)} (种族等级加成)  = ${大数值整数简写(力量综合)}  [攻魔道刺射武];C=251}\\
         {S=${大数值整数简写(Player.R.临时耐力)} 点耐力*0.05*${Player.GetLevel()}(角色等级)*${耐力倍数} * ${(1 + Player.V.种族阶数 / 100)} (种族等级加成)  = ${大数值整数简写(耐力综合)}  [防御];C=251}\\\\
         {S=升阶属性:100阶之前每阶段增加1%种族属性,100阶之后每阶增加2%;C=250}\\
         {S=升阶需要:种族雕像*${Player.V.种族阶数 + 1}个;C=191}\\
         {S=升阶几率:100%;C=224}\\\\\\
         <{S=强化种族;HINT=200阶封顶}/@强化种族>    <查看种族/@查看种族>

    `
    Npc.SayEx(Player, 'NPC大窗口', S)


}



// export function 查看种族(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // const S = `\\\\\\\\\\\\\\\\
                            // 人族                                    妖族                                    血族\\
                        //  {I=73;F=职业图标.DATA;Hint=点击加入此种族}                             {I=78;F=职业图标.DATA;Hint=点击加入此种族}                             {I=83;F=职业图标.DATA;Hint=点击加入此种族}\\
                        //  {S=种族特长:攻魔道刺射武提升10%;C=253}            {S=种族特长:增加20%反弹几率;C=253}                {S=种族特长:增加20%生命上限;C=253}\\
                        //  {S=生命加成;C=255;Hint=1点生命=人物等级*10的血量}:{S=★★;C=251}                           {S=反弹伤害为收到伤害的50%;C=253}                 {S=生命加成;C=255;Hint=1点生命=人物等级*10的血量}:{S=★★★★★;C=251}\\
                        //  {S=力量加成;C=255;Hint=1点力量=人物等级*0.1的攻魔道刺射武}:{S=★★★★★;C=251}                     {S=生命加成;C=255;Hint=1点生命=人物等级*10的血量}:{S=★★★★★;C=251}                     {S=力量加成;C=255;Hint=1点力量=人物等级*0.1的攻魔道刺射武}:{S=★★;C=251}\\
                        //  {S=耐力加成;C=255;Hint=1点耐力=人物等级*0.1的双防}:{S=★★;C=251}                           {S=力量加成;C=255;Hint=1点力量=人物等级*0.1的攻魔道刺射武}:{S=★★;C=251}                           {S=耐力加成;C=255;Hint=1点耐力=人物等级*0.1的双防}:{S=★★;C=251}\\
                                                                //  {S=耐力加成;C=255;Hint=1点耐力=人物等级*0.1的双防}:{S=★★★;C=251}\\\\
                            // 神族                                    龙族                                    魔族\\
                        //  {I=84;F=职业图标.DATA;Hint=点击加入此种族}                             {I=74;F=职业图标.DATA;Hint=点击加入此种族}                              {I=82;F=职业图标.DATA;Hint=点击加入此种族}\\
                        //  {S=种族特长:增加10%伤害减少;C=253}                {S=种族特长:增加20%爆率,极品倍率+40%;C=253}       {S=种族特长:增加10%吸血;C=253}\\
                        //  {S=生命加成;C=255;Hint=1点生命=人物等级*10的血量}:{S=★★;C=251}                           {S=生命加成;C=255;Hint=1点生命=人物等级*10的血量}:{S=★★★;C=251}                         {S=生命加成;C=255;Hint=1点生命=人物等级*10的血量}:{S=★★★★;C=251}\\
                        //  {S=力量加成;C=255;Hint=1点力量=人物等级*0.1的攻魔道刺射武}:{S=★★;C=251}                           {S=力量加成;C=255;Hint=1点力量=人物等级*0.1的攻魔道刺射武}:{S=★★★;C=251}                         {S=力量加成;C=255;Hint=1点力量=人物等级*0.1的攻魔道刺射武}:{S=★★★;C=251}\\
                        //  {S=耐力加成;C=255;Hint=1点耐力=人物等级*0.1的双防}:{S=★★★★★;C=251}                     {S=耐力加成;C=255;Hint=1点耐力=人物等级*0.1的双防}:{S=★★★;C=251}                         {S=耐力加成;C=255;Hint=1点耐力=人物等级*0.1的双防}:{S=★★★;C=251}\\
                            // 兽族                                    精灵\\
                        //  {I=79;F=职业图标.DATA;Hint=点击加入此种族}                             {I=76;F=职业图标.DATA;Hint=点击加入此种族}\\
                        //  {S=种族特长:无视防御50%;C=253}                    {S=种族特长:免疫异常状态+100%;C=253}\\
                        //  {S=生命加成;C=255;Hint=1点生命=人物等级*10的血量}:{S=★★;C=251}                           {S=生命加成;C=255;Hint=1点生命=人物等级*10的血量}:{S=★★★;C=251}\\
                        //  {S=力量加成;C=255;Hint=1点力量=人物等级*0.1的攻魔道刺射武}:{S=★★★★★;C=251}                     {S=力量加成;C=255;Hint=1点力量=人物等级*0.1的攻魔道刺射武}:{S=★★;C=251}\\
                        //  {S=耐力加成;C=255;Hint=1点耐力=人物等级*0.1的双防}:{S=★★★;C=251}                         {S=耐力加成;C=255;Hint=1点耐力=人物等级*0.1的双防}:{S=★★★★★;C=251}\\
// `

    // Npc.SayEx(Player, '职业选择', S)
// }

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
        // 计算所需材料数量（基于阶段的递增倍数）
        const 所需材料数 = 计算种族强化材料需求(Player.V.种族阶数)
    const S = `
{I=35;F=装备图标.DATA;X=25;Y=85}{S=人族:;X=100;Y=65}
{S=生命加成2% 主属性加成3% 防御加成1%;X=100;Y=85}         <{S=加入种族;y=85}/@选择种族(人族)>
{S=你的主属性额外提高10%;x=100;y=105}

{I=38;F=装备图标.DATA;X=25;Y=165}{S=牛头:;X=100;Y=145}
{S=生命加成4% 主属性加成1% 防御加成1%;X=100;Y=165}         <{S=加入种族;y=165}/@选择种族(牛头)>
{S=你的生命额外提高20%;x=100;y=185}

{I=32;F=装备图标.DATA;X=25;Y=245}{S=精灵:;X=100;Y=225}
{S=生命加成2% 主属性加成2% 防御加成2%;X=100;Y=245}         <{S=加入种族;y=245}/@选择种族(精灵)>
{S=你的闪避几率额外提高15%;x=100;y=265}

{I=37;F=装备图标.DATA;X=25;Y=325}{S=兽族:;X=100;Y=305}
{S=生命加成1% 主属性加成1% 防御加成4%;X=100;Y=325}         <{S=加入种族;y=325}/@选择种族(兽族)>
{S=你的防御额外提高10%;x=100;y=345}

{S=当前强化等级 :;C=149;x=25;y=35}{S=${Player.V.种族阶数};C=151;OX=5;y=35}{S=当前等级强化需求:;C=149;ox=150;y=35}{S=种族雕像;C=151;OX=5;Y=35}{S=${所需材料数};C=20;OX=2;Y=35}{S=个;C=151;OX=2;Y=35}
<{S=强化种族;HINT=2000000阶封顶;C=253;x=450;y=245}/@强化种族>
<{S=重置种族;HINT=重置种族会清空强化等级#92需求2000元宝;C=253;x=450;y=325}/@重置种族>
`
       Npc.SayEx(Player, '大大窗口', S)
}


export function 选择种族(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.种族 != '') { Player.MessageBox('你已经选择过种族了,请先重置种族!'); return }
    let 种族 = Args.Str[0]
    Player.V.种族 = 种族
    // Player.MapMove('主城', 100 + random(5), 115 + random(5))
    装备属性统计(Player,undefined,undefined,undefined);
    实时回血(Player, Player.GetSVar(92))
    Main(Npc, Player, Args)
}
export function 强化种族(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.种族阶数 >= 2000000) { Player.MessageBox('你已经强化到满级了!'); return }
    
    // 计算所需材料数量（基于阶段的递增倍数）
    const 所需材料数 = 计算种族强化材料需求(Player.V.种族阶数)
    
    if (Player.GetItemCount('种族雕像') < 所需材料数) { 
        Player.MessageBox(`种族雕像不足${所需材料数}个,无法强化`); 
        return 
    }
    
    Npc.Take(Player, '种族雕像', 所需材料数)
    Player.V.种族阶数 = Player.V.种族阶数 + 1
    Player.SendMessage(`强化成功,当前{S=种族阶数;C=154}:${Player.V.种族阶数}`, 1)
    Main(Npc, Player, Args)
    装备属性统计(Player,undefined,undefined,undefined);
}

/**
 * 计算种族强化所需材料数量
 * @param 当前阶数 玩家当前种族阶数
 * @returns 所需种族雕像数量
 */
function 计算种族强化材料需求(当前阶数: number): number {
    const 下一阶数 = 当前阶数 + 1
    
    if (下一阶数 <= 100) {
        // 1-100级：基础消耗 = 阶数 + 1
        return 下一阶数
    } else if (下一阶数 <= 200) {
        // 101-200级：消耗 = 阶数 * 2
        return 下一阶数 * 2
    } else if (下一阶数 <= 300) {
        // 201-300级：消耗 = 阶数 * 3
        return 下一阶数 * 3
    } else if (下一阶数 <= 400) {
        // 301-400级：消耗 = 阶数 * 4
        return 下一阶数 * 4
    } else if (下一阶数 <= 500) {
        // 401-500级：消耗 = 阶数 * 5
        return 下一阶数 * 5
    } else if (下一阶数 <= 600) {
        // 501-600级：消耗 = 阶数 * 6
        return 下一阶数 * 6
    } else if (下一阶数 <= 700) {
        // 601-700级：消耗 = 阶数 * 7
        return 下一阶数 * 7
    } else if (下一阶数 <= 800) {
        // 701-800级：消耗 = 阶数 * 8
        return 下一阶数 * 8
    } else if (下一阶数 <= 900) {
        // 801-900级：消耗 = 阶数 * 9
        return 下一阶数 * 9
    } else if (下一阶数 <= 1000) {
        // 901-1000级：消耗 = 阶数 * 10
        return 下一阶数 * 10
    } else {
        // 1000级以上：消耗 = 阶数 * (10 + 超出的千位数)
        const 超出千位数 = Math.floor((下一阶数 - 1000) / 100) + 1
        return 下一阶数 * (10 + 超出千位数)
    }
}

export function 重置种族(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.GetGameGold() < 2000) { Player.MessageBox('你的元宝不足,无法重置!'); return }
    Player.SetGameGold(Player.GetGameGold() - 2000)
    Player.GoldChanged()
    Player.V.种族阶数 = 0
    Player.V.种族 = ''
    Player.SendMessage(`重置成功!!!`, 1)
    Main(Npc, Player, Args)
    装备属性统计(Player,undefined,undefined,undefined);
}

