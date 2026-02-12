/*装备回收*/
import { js_number, js_war } from "../../全局脚本[公共单元]/utils/计算方法";
import { _P_P_AbilityData, } from "../[玩家]/_P_Base"
import { 基础属性第一条, 基础属性第十条, 备用四 } from "./_ITEM_Base";

export function Main(Npc: TNormNpc, Player: TPlayObject): void {  //装备回收
    Player.V.自动吃元宝 ??= false
    Player.V.屏蔽掉落 ??= false
    Player.V.伤害屏蔽 ??= false
    Player.V.自动随机 ??= false
    Player.V.自动随机秒数 ??= 0
    Player.V.首饰 ??= 0
    Player.V.时装 ??= false
    let 价格 = 0
    switch (Player.V.会员等级) {
        case 0: 价格 = 1; break
        case 1: 价格 = 1.2; break
        case 2: 价格 = 1.4; break
        case 3: 价格 = 1.6; break
        case 4: 价格 = 1.8; break
        case 5: 价格 = 2; break
        case 6: 价格 = 2.5; break
    }
    let 倍数 = 2
    if (GameLib.V.判断新区 == false) {
        倍数 = 4
    } else {
        倍数 = 2
    }
    const S = `\\
        {S=您当前的回收倍率:;C=154;x=50;Y=40}{S=${GameLib.V.判断新区 == false ? 4 : 2}倍;C=151;Ox=10;Y=40}{S=*;C=154;OX=5;Y=40}{S=${Player.V.回收元宝倍率}%;C=151;OX=5;Y=40}\\
         <{S=劣质;C=150;HINT=回收价格${Math.round(0 * 价格 * 倍数)}元宝;X=50;Y=65}/@_ITEM_zbhs.回收(劣质)>   <{I=$劣质$;F=装备图标.DATA;X=80;Y=65}/@_ITEM_zbhs.勾选(劣质)>\\
         <{S=超强;C=150;HINT=回收价格${Math.round(1 * 价格 * 倍数)}元宝;X=150;Y=65}/@_ITEM_zbhs.回收(超强)>   <{I=$超强$;F=装备图标.DATA;X=180;Y=65}/@_ITEM_zbhs.勾选(超强)>\\
         <{S=杰出;C=150;HINT=回收价格${Math.round(2 * 价格 * 倍数)}元宝;X=250;Y=65}/@_ITEM_zbhs.回收(杰出)>   <{I=$杰出$;F=装备图标.DATA;X=280;Y=65}/@_ITEM_zbhs.勾选(杰出)>\\
         <{S=传说;C=150;HINT=回收价格${Math.round(3 * 价格 * 倍数)}元宝;X=350;Y=65}/@_ITEM_zbhs.回收(传说)>   <{I=$传说$;F=装备图标.DATA;X=380;Y=65}/@_ITEM_zbhs.勾选(传说)>\\
         <{S=神话;C=150;HINT=回收价格${Math.round(4 * 价格 * 倍数)}元宝;X=50;Y=95}/@_ITEM_zbhs.回收(神话)>   <{I=$神话$;F=装备图标.DATA;X=80;Y=95}/@_ITEM_zbhs.勾选(神话)>\\
         <{S=传承;C=150;HINT=回收价格${Math.round(6 * 价格 * 倍数)}元宝;X=150;Y=95}/@_ITEM_zbhs.回收(传承)>   <{I=$传承$;F=装备图标.DATA;X=180;Y=95}/@_ITEM_zbhs.勾选(传承)>\\
         <{S=史诗;C=150;HINT=回收价格${Math.round(8 * 价格 * 倍数)}元宝;X=250;Y=95}/@_ITEM_zbhs.回收(史诗)>   <{I=$史诗$;F=装备图标.DATA;X=280;Y=95}/@_ITEM_zbhs.勾选(史诗)>
         <{S=绝世;C=150;HINT=回收价格${Math.round(10 * 价格 * 倍数)}元宝;X=350;Y=95}/@_ITEM_zbhs.回收(绝世)>   <{I=$绝世$;F=装备图标.DATA;X=380;Y=95}/@_ITEM_zbhs.勾选(绝世)>
         <{S=造化;C=150;HINT=回收价格${Math.round(20 * 价格 * 倍数)}元宝;X=50;Y=125}/@_ITEM_zbhs.回收(造化)>   <{I=$造化$;F=装备图标.DATA;X=80;Y=125}/@_ITEM_zbhs.勾选(造化)>
         <{S=混沌;C=150;HINT=回收价格${Math.round(50 * 价格 * 倍数)}元宝;X=150;Y=125}/@_ITEM_zbhs.回收(混沌)>   <{I=$混沌$;F=装备图标.DATA;X=180;Y=125}/@_ITEM_zbhs.勾选(混沌)>
         <{S=底材;C=150;HINT=回收价格${Math.round(2 * 价格 * 倍数)}元宝;X=250;Y=125}/@_ITEM_zbhs.回收(底材)>   <{I=$底材$;F=装备图标.DATA;X=280;Y=125}/@_ITEM_zbhs.勾选(底材)>
         <{S=首饰;C=150;HINT=首饰不区分品质,回收价格为固定${Math.round(5 * 价格 * 倍数)}元宝;X=350;Y=125}/@_ITEM_zbhs.回收(艾维)>   <{I=$首饰$;F=装备图标.DATA;X=380;Y=125}/@_ITEM_zbhs.勾选(首饰)>\\
         <{S=时装;C=150;HINT=时装不区分品质,回收价格为固定${Math.round(5 * 价格 * 倍数)}元宝;X=50;Y=155}/@_ITEM_zbhs.回收(时装)>   <{I=$时装$;F=装备图标.DATA;X=80;Y=155}/@_ITEM_zbhs.勾选(时装)>\\
                      {S=新区所有装备4倍回收,目前回收为${GameLib.V.判断新区 == false ? 4 : 2}倍;C=255;X=150;Y=155}\\
        <{S=一键清理劣质装备;X=50;Y=210}/@_ITEM_zbhs.清理劣质>       <{S=词条保留功能;HINT=1000充值以上开启此功能;OX=10;Y=210}/@_ITEM_zbhs.词条保留>       <{S=一键回收全部装备;OX=10;Y=210}/@_ITEM_zbhs.一键全部>\\\\
        <{S=开始回收;X=50;Y=250}/@_ITEM_zbhs.回收装备>               {S=自动拾取;C=9;HINT=沙巴克捐献50以下为4格拾取#92捐献50以上或者宣传10次以上为12格拾取;OX=15;Y=250} <{I=$自动拾取$;F=装备图标.DATA;OX=-2;Y=250}/@_ITEM_zbhs.勾选(自动拾取)>         {S=自动回收;C=9;OX=15;Y=250;HINT=需要捐献礼卷200或者宣传一次即可开启#92自动回收的元宝数量为二分之一,非挂机情况下请慎用;OX=15;Y=250} <{I=$自动回收$;F=装备图标.DATA;OX=-2;Y=250}/@_ITEM_zbhs.勾选(自动回收)>\\
        <{S=自动随机;C=9;X=50;Y=290;Hint=输入数值后开启挂机将自动按照秒数随机#92关闭挂机同时关闭自动随机#92玩家受到伤害5秒内将无法进行随机#92CTRL+Z开启/关闭挂机#92当前自动随机时间:${Player.V.自动随机秒数}秒}/@@_ITEM_zbhs.InPutInteger20(按秒执行，请输入1-3600的数值)> <{I=$自动随机$;F=装备图标.DATA;OX=-2;Y=290}/@_ITEM_zbhs.勾选(自动随机)>          {S=屏蔽掉落;C=9;OX=18;Y=290} <{I=$屏蔽掉落$;F=装备图标.DATA;OX=-2;Y=290}/@_ITEM_zbhs.勾选(屏蔽掉落)>       {S=自动吃元宝;C=9;OX=16;Y=290} <{I=$自动吃元宝$;F=装备图标.DATA;OX=-2;Y=290}/@_ITEM_zbhs.勾选(自动吃元宝)>
        

    `
    let M = '';
    M = S;
    Player.V.劣质 ? M = ReplaceStr(M, '$劣质$', '31') : M = ReplaceStr(M, '$劣质$', '30')
    Player.V.超强 ? M = ReplaceStr(M, '$超强$', '31') : M = ReplaceStr(M, '$超强$', '30')
    Player.V.杰出 ? M = ReplaceStr(M, '$杰出$', '31') : M = ReplaceStr(M, '$杰出$', '30')
    Player.V.传说 ? M = ReplaceStr(M, '$传说$', '31') : M = ReplaceStr(M, '$传说$', '30')
    Player.V.神话 ? M = ReplaceStr(M, '$神话$', '31') : M = ReplaceStr(M, '$神话$', '30')
    Player.V.传承 ? M = ReplaceStr(M, '$传承$', '31') : M = ReplaceStr(M, '$传承$', '30')
    Player.V.史诗 ? M = ReplaceStr(M, '$史诗$', '31') : M = ReplaceStr(M, '$史诗$', '30')
    Player.V.绝世 ? M = ReplaceStr(M, '$绝世$', '31') : M = ReplaceStr(M, '$绝世$', '30')
    Player.V.造化 ? M = ReplaceStr(M, '$造化$', '31') : M = ReplaceStr(M, '$造化$', '30')
    Player.V.混沌 ? M = ReplaceStr(M, '$混沌$', '31') : M = ReplaceStr(M, '$混沌$', '30')
    Player.V.底材 ? M = ReplaceStr(M, '$底材$', '31') : M = ReplaceStr(M, '$底材$', '30')
    Player.V.首饰 ? M = ReplaceStr(M, '$首饰$', '31') : M = ReplaceStr(M, '$首饰$', '30')
    Player.V.时装 ? M = ReplaceStr(M, '$时装$', '31') : M = ReplaceStr(M, '$时装$', '30')
    Player.V.自动回收 ? M = ReplaceStr(M, '$自动回收$', '31') : M = ReplaceStr(M, '$自动回收$', '30')
    Player.V.自动拾取 ? M = ReplaceStr(M, '$自动拾取$', '31') : M = ReplaceStr(M, '$自动拾取$', '30')
    Player.V.自动吃元宝 ? M = ReplaceStr(M, '$自动吃元宝$', '31') : M = ReplaceStr(M, '$自动吃元宝$', '30')
    Player.V.伤害屏蔽 ? M = ReplaceStr(M, '$伤害屏蔽$', '31') : M = ReplaceStr(M, '$伤害屏蔽$', '30')
    Player.V.屏蔽掉落 ? M = ReplaceStr(M, '$屏蔽掉落$', '31') : M = ReplaceStr(M, '$屏蔽掉落$', '30')
    Player.V.自动随机 ? M = ReplaceStr(M, '$自动随机$', '31') : M = ReplaceStr(M, '$自动随机$', '30')
    Npc.SayEx(Player, 'NPC中窗口', M);
    // Player.V.宣传次数 = 10;
    // Debug(`回收计算：赞助回收=${Player.V.赞助回收} 宣传回收=${Player.V.宣传次数}`)
}
const 装备类型 = [4, 5, 6, 10, 11, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 68, 35]

export function 勾选(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //装备勾选
    let 种类 = Args.Str[0]
    if (种类 == '自动回收' && !(Player.V.总捐献礼卷数量 >= 200 || Player.V.宣传次数 > 0)) { Player.MessageBox(`捐献数量不足200,或者宣传次数为0,无法使用自动回收功能!`); return }
    Player.V[种类] ? Player.V[种类] = false : Player.V[种类] = true
    Main(Npc, Player)
}

export function InPutInteger20(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 随机时间 = Args.Int[0]
    if (随机时间 < 1 || 随机时间 > 3600) { Player.MessageBox(`请输入1-3600之间的数值`); return }
    Player.V.自动随机秒数 = 随机时间
    Player.SendMessage(`设置成功,开启挂机后每${随机时间}秒将进行随机一次!`, 1)
}

export function 词条保留(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.攻速魔速词条数值 ??= 0
    Player.V.攻速魔速词条 ??= false
    Player.V.吸血比例词条数值 ??= 0
    Player.V.吸血比例词条 ??= false
    // if (Player.V.真实充值 < 1000) { Player.MessageBox('真实充值不足1000,无法使用此功能'); return }
    let 防御 = `${Math.floor(Player.V.防御词条数值 / Math.pow(10, Math.floor(Math.log10(Player.V.防御词条数值))))} * ${Math.floor(Math.log10(Player.V.防御词条数值))}位`
    let 生命 = `${Math.floor(Player.V.血量词条数值 / Math.pow(10, Math.floor(Math.log10(Player.V.血量词条数值))))} * ${Math.floor(Math.log10(Player.V.血量词条数值))}位`
    let 攻击 = `${Math.floor(Player.V.攻击词条数值 / Math.pow(10, Math.floor(Math.log10(Player.V.攻击词条数值))))} * ${Math.floor(Math.log10(Player.V.攻击词条数值))}位`
    let 魔法 = `${Math.floor(Player.V.魔法词条数值 / Math.pow(10, Math.floor(Math.log10(Player.V.魔法词条数值))))} * ${Math.floor(Math.log10(Player.V.魔法词条数值))}位`
    let 道术 = `${Math.floor(Player.V.道术词条数值 / Math.pow(10, Math.floor(Math.log10(Player.V.道术词条数值))))} * ${Math.floor(Math.log10(Player.V.道术词条数值))}位`
    let 刺术 = `${Math.floor(Player.V.刺术词条数值 / Math.pow(10, Math.floor(Math.log10(Player.V.刺术词条数值))))} * ${Math.floor(Math.log10(Player.V.刺术词条数值))}位`
    let 射术 = `${Math.floor(Player.V.射术词条数值 / Math.pow(10, Math.floor(Math.log10(Player.V.射术词条数值))))} * ${Math.floor(Math.log10(Player.V.射术词条数值))}位`
    let 武术 = `${Math.floor(Player.V.武术词条数值 / Math.pow(10, Math.floor(Math.log10(Player.V.武术词条数值))))} * ${Math.floor(Math.log10(Player.V.武术词条数值))}位`
    let 所有属性 = `${Math.floor(Player.V.属性词条数值 / Math.pow(10, Math.floor(Math.log10(Player.V.属性词条数值))))} * ${Math.floor(Math.log10(Player.V.属性词条数值))}位`
    let 倍攻 = `${Math.floor(Player.V.倍攻词条数值 / Math.pow(10, Math.floor(Math.log10(Player.V.倍攻词条数值))))} * ${Math.floor(Math.log10(Player.V.倍攻词条数值))}位`
    let 种族属性 = `${Math.floor(Player.V.种族词条数值 / Math.pow(10, Math.floor(Math.log10(Player.V.种族词条数值))))} * ${Math.floor(Math.log10(Player.V.种族词条数值))}位`
    let 装备星级 = `${Math.floor(Player.V.装备星星词条数值 / Math.pow(10, Math.floor(Math.log10(Player.V.装备星星词条数值))))} * ${Math.floor(Math.log10(Player.V.装备星星词条数值))}位`
    let 技能伤害 = `${Math.floor(Player.V.技能伤害词条数值 / Math.pow(10, Math.floor(Math.log10(Player.V.技能伤害词条数值))))} * ${Math.floor(Math.log10(Player.V.技能伤害词条数值))}位`
    const S = `\\
    {S=数值输入格式:例如30*4代表300000以上保留,即4代表4个0;C=116;X=80;Y=300}
    <{S=防御;C=150;X=50;Y=80;HINT=${防御}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,防御词条数值)>    <{I=$防御$;F=装备图标.DATA;X=80;Y=80}/@_ITEM_zbhs.勾选1(防御词条)>\\
    <{S=生命;C=150;X=150;Y=80;HINT=${生命}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,血量词条数值)>    <{I=$血量$;F=装备图标.DATA;X=180;Y=80}/@_ITEM_zbhs.勾选1(血量词条)>\\
    <{S=攻击;C=150;X=250;Y=80;HINT=${攻击}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,攻击词条数值)>    <{I=$攻击$;F=装备图标.DATA;X=280;Y=80}/@_ITEM_zbhs.勾选1(攻击词条)>\\
    <{S=魔法;C=150;X=350;Y=80;HINT=${魔法}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,魔法词条数值)>    <{I=$魔法$;F=装备图标.DATA;X=380;Y=80}/@_ITEM_zbhs.勾选1(魔法词条)>\\
    <{S=道术;C=150;X=50;Y=120;HINT=${道术}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,道术词条数值)>    <{I=$道术$;F=装备图标.DATA;X=80;Y=120}/@_ITEM_zbhs.勾选1(道术词条)>\\
    <{S=刺术;C=150;X=150;Y=120;HINT=${刺术}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,刺术词条数值)>   <{I=$刺术$;F=装备图标.DATA;X=180;Y=120}/@_ITEM_zbhs.勾选1(刺术词条)>\\
    <{S=射术;C=150;X=250;Y=120;HINT=${射术}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,射术词条数值)>   <{I=$射术$;F=装备图标.DATA;X=280;Y=120}/@_ITEM_zbhs.勾选1(射术词条)>\\
    <{S=武术;C=150;X=350;Y=120;HINT=${武术}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,武术词条数值)>   <{I=$武术$;F=装备图标.DATA;X=380;Y=120}/@_ITEM_zbhs.勾选1(武术词条)>\\
    <{S=所有属性;C=150;X=30;Y=160;HINT=${所有属性}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,属性词条数值)>   <{I=$属性$;F=装备图标.DATA;X=80;Y=160}/@_ITEM_zbhs.勾选1(属性词条)>\\
    <{S=倍攻;C=150;X=150;Y=160;HINT=${倍攻}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,倍攻词条数值)>   <{I=$倍攻$;F=装备图标.DATA;X=180;Y=160}/@_ITEM_zbhs.勾选1(倍攻词条)>\\
    <{S=生肖星级;C=150;X=230;Y=160;HINT=${Player.V.生肖词条数值}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,生肖词条数值)>   <{I=$生肖$;F=装备图标.DATA;X=280;Y=160}/@_ITEM_zbhs.勾选1(生肖词条)>\\
    <{S=种族属性;C=150;X=330;Y=160;HINT=${种族属性}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,种族词条数值)>   <{I=$种族$;F=装备图标.DATA;X=380;Y=160}/@_ITEM_zbhs.勾选1(种族词条)>
    <{S=天赋;C=150;X=50;Y=200;HINT=${Player.V.天赋词条数值}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,天赋词条数值)>   <{I=$天赋$;F=装备图标.DATA;X=80;Y=200}/@_ITEM_zbhs.勾选1(天赋词条)>
    <{S=技能伤害;C=150;X=130;Y=200;HINT=${技能伤害}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,技能伤害词条数值)>   <{I=$技能伤害$;F=装备图标.DATA;X=180;Y=200}/@_ITEM_zbhs.勾选1(技能伤害词条)>
    <{S=攻速魔速;C=150;X=230;Y=200;HINT=${Player.V.攻速魔速词条数值}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,攻速魔速词条数值)>   <{I=$攻速魔速$;F=装备图标.DATA;X=280;Y=200}/@_ITEM_zbhs.勾选1(攻速魔速词条)>
    <{S=吸血比例;C=150;X=330;Y=200;HINT=${Player.V.吸血比例词条数值}以上不回收}/@@_ITEM_zbhs.InPutString(高于输入的数值将不回收,吸血比例词条数值)>   <{I=$吸血比例$;F=装备图标.DATA;X=380;Y=200}/@_ITEM_zbhs.勾选1(吸血比例词条)>
    {S=请勾选需要保留的词条,勾选后所打出带有词条的装备无法被回收;C=191;X=65;Y=240}
    <{S=一键清理背包所有词条装备;C=251;X=155;Y=270}/@_ITEM_zbhs.清理词条装备>
    <{S=返回;X=435;Y=285}/@_ITEM_zbhs.Main>
    `
    let M = '';
    M = S;
    Player.V.防御词条 ? M = ReplaceStr(M, '$防御$', '31') : M = ReplaceStr(M, '$防御$', '30')
    Player.V.血量词条 ? M = ReplaceStr(M, '$血量$', '31') : M = ReplaceStr(M, '$血量$', '30')
    Player.V.攻击词条 ? M = ReplaceStr(M, '$攻击$', '31') : M = ReplaceStr(M, '$攻击$', '30')
    Player.V.魔法词条 ? M = ReplaceStr(M, '$魔法$', '31') : M = ReplaceStr(M, '$魔法$', '30')
    Player.V.道术词条 ? M = ReplaceStr(M, '$道术$', '31') : M = ReplaceStr(M, '$道术$', '30')
    Player.V.刺术词条 ? M = ReplaceStr(M, '$刺术$', '31') : M = ReplaceStr(M, '$刺术$', '30')
    Player.V.射术词条 ? M = ReplaceStr(M, '$射术$', '31') : M = ReplaceStr(M, '$射术$', '30')
    Player.V.武术词条 ? M = ReplaceStr(M, '$武术$', '31') : M = ReplaceStr(M, '$武术$', '30')
    Player.V.属性词条 ? M = ReplaceStr(M, '$属性$', '31') : M = ReplaceStr(M, '$属性$', '30')
    Player.V.倍攻词条 ? M = ReplaceStr(M, '$倍攻$', '31') : M = ReplaceStr(M, '$倍攻$', '30')
    Player.V.生肖词条 ? M = ReplaceStr(M, '$生肖$', '31') : M = ReplaceStr(M, '$生肖$', '30')
    Player.V.种族词条 ? M = ReplaceStr(M, '$种族$', '31') : M = ReplaceStr(M, '$种族$', '30')
    Player.V.天赋词条 ? M = ReplaceStr(M, '$天赋$', '31') : M = ReplaceStr(M, '$天赋$', '30')
    Player.V.装备星星词条 ? M = ReplaceStr(M, '$装备星星$', '31') : M = ReplaceStr(M, '$装备星星$', '30')
    Player.V.技能伤害词条 ? M = ReplaceStr(M, '$技能伤害$', '31') : M = ReplaceStr(M, '$技能伤害$', '30')
    Player.V.攻速魔速词条 ? M = ReplaceStr(M, '$攻速魔速$', '31') : M = ReplaceStr(M, '$攻速魔速$', '30')
    Player.V.吸血比例词条 ? M = ReplaceStr(M, '$吸血比例$', '31') : M = ReplaceStr(M, '$吸血比例$', '30')
    Npc.SayEx(Player, 'NPC中窗口', M);
}

export function 勾选1(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //装备勾选
    let 种类 = Args.Str[0]
    Player.V[种类] ? Player.V[种类] = false : Player.V[种类] = true
    词条保留(Npc, Player, Args)
}

export function InPutString(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 数值 = Args.Str[1]
    let 词条 = Args.Str[0]
    let 大数值 = ''
    if (数值.includes('*')) {
        const list: string[] = 数值.split('*')   //字符串转数字 以,分割  也就是说[数组1,数组2,,数组3,.......]
        // 大数值=calculateResult(list[1])
        switch (list[1]) {
            case '4': 大数值 = '10000'; break
            case '8': 大数值 = '100000000'; break
            case '12': 大数值 = '1000000000000'; break
            case '16': 大数值 = '10000000000000000'; break
            case '20': 大数值 = '100000000000000000000'; break
            case '24': 大数值 = '1000000000000000000000000'; break
            case '28': 大数值 = '10000000000000000000000000000'; break
            case '32': 大数值 = '100000000000000000000000000000000'; break
            case '36': 大数值 = '1000000000000000000000000000000000000'; break
            case '40': 大数值 = '10000000000000000000000000000000000000000'; break
            case '44': 大数值 = '100000000000000000000000000000000000000000000'; break
            case '48': 大数值 = '1000000000000000000000000000000000000000000000000'; break
            case '52': 大数值 = '10000000000000000000000000000000000000000000000000000'; break
            case '56': 大数值 = '100000000000000000000000000000000000000000000000000000000'; break
            case '60': 大数值 = '1000000000000000000000000000000000000000000000000000000000000'; break
            case '64': 大数值 = '10000000000000000000000000000000000000000000000000000000000000000'; break
            case '68': 大数值 = '100000000000000000000000000000000000000000000000000000000000000000000'; break
            case '72': 大数值 = '1000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '76': 大数值 = '10000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '80': 大数值 = '100000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '84': 大数值 = '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '88': 大数值 = '10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '92': 大数值 = '100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '96': 大数值 = '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '100': 大数值 = '10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '104': 大数值 = '100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '108': 大数值 = '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '112': 大数值 = '10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '116': 大数值 = '100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '120': 大数值 = '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '124': 大数值 = '10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '128': 大数值 = '100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '132': 大数值 = '1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '136': 大数值 = '10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            case '140': 大数值 = '100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'; break
            default: Player.MessageBox('请输入正确的乘法数值\\例如输入1*8代表1亿\\1*12代表1兆\\乘数(*号后面)必须位4的倍数'); return
        }
        // Player.V[词条] = 整数相乘(list[0], 大数值)
        Player.V[词条] = js_number(list[0], 大数值, 3)
    } else {
        Player.V[词条] = 数值
    }
    // Player.V[词条] = 数值
    词条保留(Npc, Player, Args)
}

export function 回收(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let AItem: TUserItem;
    let 倍数 = 2
    let 艾维利之戒指 = 0
    let 品质 = ''
    if (Player.GetJewelrys(1) != null && Player.GetJewelrys(1).GetName() == '艾维利之戒' && Player.GetJewelrys(1).GetOutWay3(40) < 10) {
        艾维利之戒指 = (Player.GetJewelrys(1).GetOutWay2(1) / 20 + Player.GetJewelrys(1).GetOutWay3(40) * 2) / 100
    } else if (Player.GetJewelrys(1) != null && Player.GetJewelrys(1).GetName() == '艾维利之戒' && Player.GetJewelrys(1).GetOutWay3(40) >= 10) {
        艾维利之戒指 = (Player.GetJewelrys(1).GetOutWay2(1) / 20 + Player.GetJewelrys(1).GetOutWay3(40) * 2 + 50) / 100
    }

    if (GameLib.V.判断新区 == false) {
        倍数 = 4 + 艾维利之戒指
    } else {
        倍数 = 2 + 艾维利之戒指
    }
    if (Args.Str[0] == '阿拉贡') {
        品质 = '阿拉贡'
    } else if (Args.Str[0] == '艾维') {
        品质 = '艾维'
    } else {
        品质 = '[' + Args.Str[0] + ']'
    }
    let 元宝数量 = 0
    let 数量 = 0, 生命 = '0', 防御 = '0', 攻击 = '0', 魔法 = '0', 道术 = '0', 射术 = '0', 刺术 = '0', 武术 = '0', 属性 = '0', 倍攻 = '0', 生肖 = '0', 种族 = '0', 天赋 = 0, 装备星星 = '0', 技能伤害 = '0', 攻速魔速 = 0, 吸血比例 = 0
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        生命 = '0', 防御 = '0', 攻击 = '0', 魔法 = '0', 道术 = '0', 射术 = '0', 刺术 = '0', 武术 = '0', 属性 = '0', 倍攻 = '0', 生肖 = '0', 种族 = '0', 天赋 = 0, 装备星星 = '0', 技能伤害 = '0', 攻速魔速 = 0, 吸血比例 = 0
        AItem = Player.GetBagItem(I);
        if (装备类型.includes(AItem.StdMode) && AItem.GetState().GetBind() == false && AItem.DisplayName.includes(品质)) {
            if (AItem.GetCustomDesc() != ``) {
                let 装备字符串 = JSON.parse(AItem.GetCustomDesc())
                if (装备字符串.职业属性_职业) {
                    let 装备属性条数 = 装备字符串.职业属性_职业.length
                    for (let e = 0; e <= 装备属性条数 - 1; e++) {
                        switch (Number(装备字符串.职业属性_职业[e])) {
                            case 33: 攻击 = js_number(攻击, String(装备字符串.职业属性_属性[e]), 1); break;
                            case 34: 魔法 = js_number(魔法, String(装备字符串.职业属性_属性[e]), 1); break;
                            case 35: 道术 = js_number(道术, String(装备字符串.职业属性_属性[e]), 1); break;
                            case 36: 刺术 = js_number(刺术, String(装备字符串.职业属性_属性[e]), 1); break;
                            case 37: 射术 = js_number(射术, String(装备字符串.职业属性_属性[e]), 1); break;
                            case 38: 武术 = js_number(武术, String(装备字符串.职业属性_属性[e]), 1); break;
                            case 31: 生命 = js_number(生命, String(装备字符串.职业属性_属性[e]), 1); break;
                            case 32: 防御 = js_number(防御, String(装备字符串.职业属性_属性[e]), 1); break;
                            case 30: 属性 = js_number(属性, String(装备字符串.职业属性_属性[e]), 1); break;
                            case 350: case 351: case 352: 种族 = js_number(种族, String(装备字符串.职业属性_属性[e]), 1); break;
                            case 195: case 196: case 197: case 198: case 199: case 200: case 201: case 202: case 203: case 204: case 205: case 206: case 207: case 208: case 209: case 210:
                            case 211: case 212: case 213: case 214: case 215: case 216: case 217: case 218: case 219: case 220: case 221: case 222: case 223: case 224: case 225: case 226:
                            case 227: case 228: case 229: case 230: case 231: case 232: case 233: case 234: case 235: case 236: 倍攻 = js_number(倍攻, String(装备字符串.职业属性_属性[e]), 1); break;
                            case 401: case 402: case 403: case 404: case 405: case 406: case 407: case 408: case 409: case 410: case 411: case 412: case 413: case 414: case 415: case 416:
                            case 417: case 418: case 419: case 420: case 421: case 422: case 423: case 424: case 425: case 426: case 427: case 428: case 429: case 430: case 431: case 432:
                            case 433: case 434: case 435: case 436: case 437: case 438: case 439: case 440: 技能伤害 = js_number(技能伤害, String(装备字符串.职业属性_属性[e]), 1); break;
                            default: break;
                        }
                        if (Player.V.生肖词条 && (AItem.StdMode == 68 || AItem.StdMode == 35)) {
                            生肖 = js_number(生肖, AItem.GetCustomCaption(0), 1)
                        }
                        if (Player.V.装备星星词条 && AItem.StdMode != 68 && AItem.StdMode != 35) {
                            装备星星 = js_number(装备星星, AItem.GetCustomCaption(0), 1)
                        }

                    }
                }
            }



            for (let i = 基础属性第一条; i <= 备用四; i++) {
                switch (true) {
                    case AItem.GetOutWay1(i) >= 620 && AItem.GetOutWay1(i) <= 628: 天赋 = 天赋 + AItem.GetOutWay2(i); break
                    case AItem.GetOutWay1(i) == 310: 攻速魔速 = 攻速魔速 + AItem.GetOutWay2(i); break
                    case AItem.GetOutWay1(i) == 302: 吸血比例 = 吸血比例 + AItem.GetOutWay2(i); break
                }
            }

            if (Player.V.防御词条 && js_war(防御, Player.V.防御词条数值) > 0) { continue }
            if (Player.V.血量词条 && js_war(生命, Player.V.血量词条数值) > 0) { continue }
            if (Player.V.攻击词条 && js_war(攻击, Player.V.攻击词条数值) > 0) { continue }
            if (Player.V.魔法词条 && js_war(魔法, Player.V.魔法词条数值) > 0) { continue }
            if (Player.V.道术词条 && js_war(道术, Player.V.道术词条数值) > 0) { continue }
            if (Player.V.刺术词条 && js_war(刺术, Player.V.刺术词条数值) > 0) { continue }
            if (Player.V.射术词条 && js_war(射术, Player.V.射术词条数值) > 0) { continue }
            if (Player.V.武术词条 && js_war(武术, Player.V.武术词条数值) > 0) { continue }
            if (Player.V.属性词条 && js_war(属性, Player.V.属性词条数值) > 0) { continue }
            if (Player.V.倍攻词条 && js_war(倍攻, Player.V.倍攻词条数值) > 0) { continue }
            if (Player.V.天赋词条 && js_war(String(天赋), Player.V.天赋词条数值) > 0) { continue }
            if (Player.V.攻速魔速词条 && 攻速魔速 > Player.V.攻速魔速词条数值) { continue }
            if (Player.V.吸血比例词条 && 吸血比例 > Player.V.吸血比例词条数值) { continue }
            if (Player.V.种族词条 && js_war(种族, Player.V.种族词条数值) > 0) { continue }
            if (Player.V.生肖词条 && js_war(生肖, Player.V.生肖词条数值) > 0) { continue }
            if (Player.V.装备星星词条 && js_war(装备星星, Player.V.装备星星词条数值) > 0) { continue }
            if (Player.V.技能伤害词条 && js_war(技能伤害, Player.V.技能伤害词条数值) > 0) { continue }

            数量++
            switch (品质) {
                case '[劣质]': 元宝数量 += 0; break
                case '[超强]': 元宝数量 += 1; break
                case '[杰出]': 元宝数量 += 2; break
                case '[传说]': 元宝数量 += 3; break
                case '[神话]': 元宝数量 += 4; break
                case '[传承]': 元宝数量 += 6; break
                case '[史诗]': 元宝数量 += 8; break
                case '[绝世]': 元宝数量 += 10; break
                case '[造化]': 元宝数量 += 20; break
                case '[混沌]': 元宝数量 += 50; break
                case '[底材]': 元宝数量 += 2; break
                case '艾维': 元宝数量 += 5; break
                case '阿拉贡': 元宝数量 += 5; break
            }
            Player.DeleteItem(AItem)
            // Npc.Take(Player, AItem.GetName())
        }
    }
    if (元宝数量 > 0) {
        Player.SetGameGold(Player.GetGameGold() + Math.round(元宝数量 * (Player.V.回收元宝倍率 / 100) * 倍数))
        Player.GoldChanged()
        Player.SendMessage(`回收了{S=${数量};C=154}件装备,共获得{S=${Math.round(元宝数量 * (Player.V.回收元宝倍率 / 100) * 倍数)};C=253}枚元宝!`, 1)
    }
}

export function 一键全部(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let AItem: TUserItem;
    let 倍数 = 2
    let 艾维利之戒指 = 0
    if (Player.GetJewelrys(1) != null && Player.GetJewelrys(1).GetName() == '艾维利之戒' && Player.GetJewelrys(1).GetOutWay3(40) < 10) {
        艾维利之戒指 = (Player.GetJewelrys(1).GetOutWay2(1) / 20 + Player.GetJewelrys(1).GetOutWay3(40) * 2) / 100
    } else if (Player.GetJewelrys(1) != null && Player.GetJewelrys(1).GetName() == '艾维利之戒' && Player.GetJewelrys(1).GetOutWay3(40) >= 10) {
        艾维利之戒指 = (Player.GetJewelrys(1).GetOutWay2(1) / 20 + Player.GetJewelrys(1).GetOutWay3(40) * 2 + 50) / 100
    }

    if (GameLib.V.判断新区 == false) {
        倍数 = 4 + 艾维利之戒指
    } else {
        倍数 = 2 + 艾维利之戒指
    }
    let 元宝数量 = 0
    let 数量 = 0, 生命 = 0, 生命超 = 0, 防御 = 0, 防御超 = 0, 攻击 = 0, 攻击超 = 0, 魔法 = 0, 魔法超 = 0, 道术 = 0, 道术超 = 0, 射术 = 0, 射术超 = 0, 刺术 = 0, 刺术超 = 0, 武术 = 0, 武术超 = 0, 属性 = 0, 属性超 = 0, 技能伤害 = 0, 技能伤害超 = 0, 倍攻 = 0, 生肖 = 0, 生肖超 = 0, 种族 = 0, 天赋 = 0, 种族超 = 0, 装备星星 = 0, 装备星星超 = 0, 攻速魔速 = 0, 吸血比例 = 0
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        生命 = 0, 生命超 = 0, 防御 = 0, 防御超 = 0, 攻击 = 0, 攻击超 = 0, 魔法 = 0, 魔法超 = 0, 道术 = 0, 道术超 = 0, 射术 = 0, 射术超 = 0, 刺术 = 0, 刺术超 = 0, 武术 = 0, 武术超 = 0, 属性 = 0, 属性超 = 0, 技能伤害 = 0, 技能伤害超 = 0, 倍攻 = 0, 生肖 = 0, 生肖超 = 0, 种族 = 0, 种族超 = 0, 天赋 = 0, 装备星星 = 0, 装备星星超 = 0, 攻速魔速 = 0, 吸血比例 = 0
        AItem = Player.GetBagItem(I);
        if (装备类型.includes(AItem.StdMode) && AItem.GetState().GetBind() == false) {

            if (AItem.GetCustomDesc() != ``) {
                let 装备字符串 = JSON.parse(AItem.GetCustomDesc())
                if (装备字符串.职业属性_职业) {
                    let 装备属性条数 = 装备字符串.职业属性_职业.length
                    for (let e = 0; e <= 装备属性条数 - 1; e++) {
                        switch (Number(装备字符串.职业属性_职业[e])) {
                            case 33: 攻击 = 攻击 + Number(装备字符串.职业属性_属性[e]); break;
                            case 34: 魔法 = 魔法 + Number(装备字符串.职业属性_属性[e]); break;
                            case 35: 道术 = 道术 + Number(装备字符串.职业属性_属性[e]); break;
                            case 36: 刺术 = 刺术 + Number(装备字符串.职业属性_属性[e]); break;
                            case 37: 射术 = 射术 + Number(装备字符串.职业属性_属性[e]); break;
                            case 38: 武术 = 武术 + Number(装备字符串.职业属性_属性[e]); break;
                            case 31: 生命 = 生命 + Number(装备字符串.职业属性_属性[e]); break;
                            case 32: 防御 = 防御 + Number(装备字符串.职业属性_属性[e]); break;
                            case 30: 属性 = 属性 + Number(装备字符串.职业属性_属性[e]); break;
                            case 350: case 351: case 352: 种族 = 种族 + Number(装备字符串.职业属性_属性[e]); break;
                            case 195: case 196: case 197: case 198: case 199: case 200: case 201: case 202: case 203: case 204: case 205: case 206: case 207: case 208: case 209: case 210:
                            case 211: case 212: case 213: case 214: case 215: case 216: case 217: case 218: case 219: case 220: case 221: case 222: case 223: case 224: case 225: case 226:
                            case 227: case 228: case 229: case 230: case 231: case 232: case 233: case 234: case 235: case 236: 倍攻 = 倍攻 + Number(装备字符串.职业属性_属性[e]); break;
                            case 401: case 402: case 403: case 404: case 405: case 406: case 407: case 408: case 409: case 410: case 411: case 412: case 413: case 414: case 415: case 416:
                            case 417: case 418: case 419: case 420: case 421: case 422: case 423: case 424: case 425: case 426: case 427: case 428: case 429: case 430: case 431: case 432:
                            case 433: case 434: case 435: case 436: case 437: case 438: case 439: case 440: 技能伤害 = 技能伤害 + Number(装备字符串.职业属性_属性[e]); break;
                            default: break;
                        }
                        if (Player.V.生肖词条 && (AItem.StdMode == 68 || AItem.StdMode == 35)) {
                            // 生肖 = Decimal.plus(生肖, String(装备字符串.职业属性_属性[e]))
                            生肖 = 生肖 + Number(AItem.GetCustomCaption(0))
                        }
                        if (Player.V.装备星星词条 && AItem.StdMode != 68 && AItem.StdMode != 35) {
                            // 装备星星 = Decimal.plus(装备星星, String(装备字符串.职业属性_属性[e]))
                            装备星星 = 装备星星 + Number(AItem.GetCustomCaption(0))
                        }

                    }
                }
            }


            for (let i = 基础属性第一条; i <= 备用四; i++) {
                switch (true) {
                    case AItem.GetOutWay1(i) >= 620 && AItem.GetOutWay1(i) <= 628: 天赋 = 天赋 + AItem.GetOutWay2(i); break
                    case AItem.GetOutWay1(i) == 310: 攻速魔速 = 攻速魔速 + AItem.GetOutWay2(i); break
                    case AItem.GetOutWay1(i) == 302: 吸血比例 = 吸血比例 + AItem.GetOutWay2(i); break
                }
            }


            if (Player.V.防御词条 && 防御 > Player.V.防御词条数值) { continue }
            if (Player.V.血量词条 && 生命 > Player.V.血量词条数值) { continue }
            if (Player.V.攻击词条 && 攻击 > Player.V.攻击词条数值) { continue }
            if (Player.V.魔法词条 && 魔法 > Player.V.魔法词条数值) { continue }
            if (Player.V.道术词条 && 道术 > Player.V.道术词条数值) { continue }
            if (Player.V.刺术词条 && 刺术 > Player.V.刺术词条数值) { continue }
            if (Player.V.射术词条 && 射术 > Player.V.射术词条数值) { continue }
            if (Player.V.武术词条 && 武术 > Player.V.武术词条数值) { continue }
            if (Player.V.属性词条 && 属性 > Player.V.属性词条数值) { continue }
            if (Player.V.倍攻词条 && 倍攻 > Player.V.倍攻词条数值) { continue }
            if (Player.V.天赋词条 && 天赋 > Player.V.天赋词条数值) { continue }
            if (Player.V.攻速魔速词条 && 攻速魔速 > Player.V.攻速魔速词条数值) { continue }
            if (Player.V.吸血比例词条 && 吸血比例 > Player.V.吸血比例词条数值) { continue }
            if (Player.V.种族词条 && 种族 > Player.V.种族词条数值) { continue }
            if (Player.V.生肖词条 && 生肖 > Player.V.生肖词条数值) { continue }
            if (Player.V.装备星星词条 && 装备星星 > Player.V.装备星星词条数值) { continue }
            if (Player.V.技能伤害词条 && 技能伤害 > Player.V.技能伤害词条数值) { continue }

            数量++
            switch (true) {
                case AItem.DisplayName.includes('[劣质]'): 元宝数量 += 0; break
                case AItem.DisplayName.includes('[超强]'): 元宝数量 += 1; break
                case AItem.DisplayName.includes('[杰出]'): 元宝数量 += 2; break
                case AItem.DisplayName.includes('[传说]'): 元宝数量 += 3; break
                case AItem.DisplayName.includes('[神话]'): 元宝数量 += 4; break
                case AItem.DisplayName.includes('[传承]'): 元宝数量 += 6; break
                case AItem.DisplayName.includes('[史诗]'): 元宝数量 += 8; break
                case AItem.DisplayName.includes('[绝世]'): 元宝数量 += 10; break
                case AItem.DisplayName.includes('[造化]'): 元宝数量 += 20; break
                case AItem.DisplayName.includes('[混沌]'): 元宝数量 += 50; break
                case AItem.DisplayName.includes('[底材]'): 元宝数量 += 2; break
                case AItem.DisplayName.includes('艾维'): 元宝数量 += 5; break
                case AItem.DisplayName.includes('阿拉贡'): 元宝数量 += 5; break
            }
            Player.DeleteItem(AItem)
            // Npc.Take(Player, AItem.GetName())
        }
    }
    if (元宝数量 > 0) {
        Player.SetGameGold(Player.GetGameGold() + Math.round(元宝数量 * (Player.V.回收元宝倍率 / 100) * 倍数))
        Player.GoldChanged()
        Player.SendMessage(`回收了{S=${数量};C=154}件装备,共获得{S=${Math.round(元宝数量 * (Player.V.回收元宝倍率 / 100) * 倍数)};C=253}枚元宝!`, 1)
    }
}

export function 回收装备(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //
    let AItem: TUserItem;
    let 元宝数量 = 0
    let 数量 = 0, 生命 = 0, 生命超 = 0, 防御 = 0, 防御超 = 0, 攻击 = 0, 攻击超 = 0, 魔法 = 0, 魔法超 = 0, 道术 = 0, 道术超 = 0, 射术 = 0, 射术超 = 0, 刺术 = 0, 刺术超 = 0, 武术 = 0, 武术超 = 0, 属性 = 0, 属性超 = 0, 倍攻 = 0, 生肖 = 0, 生肖超 = 0, 种族 = 0, 天赋 = 0, 种族超 = 0, 装备星星 = 0, 装备星星超 = 0, 技能伤害 = 0, 技能伤害超 = 0, 攻速魔速 = 0, 吸血比例 = 0
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        生命 = 0, 生命超 = 0, 防御 = 0, 防御超 = 0, 攻击 = 0, 攻击超 = 0, 魔法 = 0, 魔法超 = 0, 道术 = 0, 道术超 = 0, 射术 = 0, 射术超 = 0, 刺术 = 0, 刺术超 = 0, 武术 = 0, 武术超 = 0, 属性 = 0, 属性超 = 0, 倍攻 = 0, 生肖 = 0, 生肖超 = 0, 种族 = 0, 种族超 = 0, 天赋 = 0, 装备星星 = 0, 装备星星超 = 0, 技能伤害 = 0, 技能伤害超 = 0, 攻速魔速 = 0, 吸血比例 = 0
        AItem = Player.GetBagItem(I);
        if (装备类型.includes(AItem.StdMode) && AItem.GetState().GetBind() == false) {
            if ((Player.V.劣质 && AItem.DisplayName.includes('劣质')) || (Player.V.超强 && AItem.DisplayName.includes('超强')) || (Player.V.杰出 && AItem.DisplayName.includes('杰出'))
                || (Player.V.传说 && AItem.DisplayName.includes('传说')) || (Player.V.神话 && AItem.DisplayName.includes('神话')) || (Player.V.传承 && AItem.DisplayName.includes('传承'))
                || (Player.V.史诗 && AItem.DisplayName.includes('史诗')) || (Player.V.绝世 && AItem.DisplayName.includes('绝世')) || (Player.V.造化 && AItem.DisplayName.includes('造化'))
                || (Player.V.混沌 && AItem.DisplayName.includes('混沌')) || (Player.V.底材 && AItem.DisplayName.includes('底材')) || (Player.V.首饰 && (AItem.DisplayName.includes('艾维') || AItem.DisplayName.includes('阿拉贡') || AItem.DisplayName.includes('缺月')))
                || (Player.V.时装 && AItem.DisplayName.includes('恶魔'))) {

                if (AItem.GetCustomDesc() != ``) {
                    let 装备字符串 = JSON.parse(AItem.GetCustomDesc())
                    if (装备字符串.职业属性_职业) {
                        let 装备属性条数 = 装备字符串.职业属性_职业.length
                        for (let e = 0; e <= 装备属性条数 - 1; e++) {
                            switch (Number(装备字符串.职业属性_职业[e])) {
                                case 33: 攻击 = 攻击 + Number(装备字符串.职业属性_属性[e]); break;
                                case 34: 魔法 = 魔法 + Number(装备字符串.职业属性_属性[e]); break;
                                case 35: 道术 = 道术 + Number(装备字符串.职业属性_属性[e]); break;
                                case 36: 刺术 = 刺术 + Number(装备字符串.职业属性_属性[e]); break;
                                case 37: 射术 = 射术 + Number(装备字符串.职业属性_属性[e]); break;
                                case 38: 武术 = 武术 + Number(装备字符串.职业属性_属性[e]); break;
                                case 31: 生命 = 生命 + Number(装备字符串.职业属性_属性[e]); break;
                                case 32: 防御 = 防御 + Number(装备字符串.职业属性_属性[e]); break;
                                case 30: 属性 = 属性 + Number(装备字符串.职业属性_属性[e]); break;
                                case 350: case 351: case 352: 种族 = 种族 + Number(装备字符串.职业属性_属性[e]); break;
                                case 195: case 196: case 197: case 198: case 199: case 200: case 201: case 202: case 203: case 204: case 205: case 206: case 207: case 208: case 209: case 210:
                                case 211: case 212: case 213: case 214: case 215: case 216: case 217: case 218: case 219: case 220: case 221: case 222: case 223: case 224: case 225: case 226:
                                case 227: case 228: case 229: case 230: case 231: case 232: case 233: case 234: case 235: case 236: 倍攻 = 倍攻 + Number(装备字符串.职业属性_属性[e]); break;
                                case 401: case 402: case 403: case 404: case 405: case 406: case 407: case 408: case 409: case 410: case 411: case 412: case 413: case 414: case 415: case 416:
                                case 417: case 418: case 419: case 420: case 421: case 422: case 423: case 424: case 425: case 426: case 427: case 428: case 429: case 430: case 431: case 432:
                                case 433: case 434: case 435: case 436: case 437: case 438: case 439: case 440: 技能伤害 = 技能伤害 + Number(装备字符串.职业属性_属性[e]); break;
                                default: break;
                            }
                            if (Player.V.生肖词条 && (AItem.StdMode == 68 || AItem.StdMode == 35)) {
                                // 生肖 = Decimal.plus(生肖, String(装备字符串.职业属性_属性[e]))
                                生肖 = 生肖 + Number(AItem.GetCustomCaption(0))
                            }
                            if (Player.V.装备星星词条 && AItem.StdMode != 68 && AItem.StdMode != 35) {
                                // 装备星星 = Decimal.plus(装备星星, String(装备字符串.职业属性_属性[e]))
                                装备星星 = 装备星星 + Number(AItem.GetCustomCaption(0))
                            }
                        }
                    }
                }


                for (let i = 基础属性第一条; i <= 备用四; i++) {
                    switch (true) {
                        case AItem.GetOutWay1(i) >= 620 && AItem.GetOutWay1(i) <= 628: 天赋 = 天赋 + AItem.GetOutWay2(i); break
                        case AItem.GetOutWay1(i) == 310: 攻速魔速 = 攻速魔速 + AItem.GetOutWay2(i); break
                        case AItem.GetOutWay1(i) == 302: 吸血比例 = 吸血比例 + AItem.GetOutWay2(i); break
                    }
                }


                if (Player.V.防御词条 && 防御 > Player.V.防御词条数值) { continue }
                if (Player.V.血量词条 && 生命 > Player.V.血量词条数值) { continue }
                if (Player.V.攻击词条 && 攻击 > Player.V.攻击词条数值) { continue }
                if (Player.V.魔法词条 && 魔法 > Player.V.魔法词条数值) { continue }
                if (Player.V.道术词条 && 道术 > Player.V.道术词条数值) { continue }
                if (Player.V.刺术词条 && 刺术 > Player.V.刺术词条数值) { continue }
                if (Player.V.射术词条 && 射术 > Player.V.射术词条数值) { continue }
                if (Player.V.武术词条 && 武术 > Player.V.武术词条数值) { continue }
                if (Player.V.属性词条 && 属性 > Player.V.属性词条数值) { continue }
                if (Player.V.倍攻词条 && 倍攻 > Player.V.倍攻词条数值) { continue }
                if (Player.V.天赋词条 && 天赋 > Player.V.天赋词条数值) { continue }
                if (Player.V.攻速魔速词条 && 攻速魔速 > Player.V.攻速魔速词条数值) { continue }
                if (Player.V.吸血比例词条 && 吸血比例 > Player.V.吸血比例词条数值) { continue }
                if (Player.V.种族词条 && 种族 > Player.V.种族词条数值) { continue }
                if (Player.V.生肖词条 && 生肖 > Player.V.生肖词条数值) { continue }
                if (Player.V.装备星星词条 && 装备星星 > Player.V.装备星星词条数值) { continue }
                if (Player.V.技能伤害词条 && 技能伤害 > Player.V.技能伤害词条数值) { continue }



                数量++
                switch (true) {
                    case AItem.DisplayName.includes('[劣质]'): 元宝数量 += 0; break
                    case AItem.DisplayName.includes('[超强]'): 元宝数量 += 1; break
                    case AItem.DisplayName.includes('[杰出]'): 元宝数量 += 2; break
                    case AItem.DisplayName.includes('[传说]'): 元宝数量 += 3; break
                    case AItem.DisplayName.includes('[神话]'): 元宝数量 += 4; break
                    case AItem.DisplayName.includes('[传承]'): 元宝数量 += 6; break
                    case AItem.DisplayName.includes('[史诗]'): 元宝数量 += 8; break
                    case AItem.DisplayName.includes('[绝世]'): 元宝数量 += 10; break
                    case AItem.DisplayName.includes('[造化]'): 元宝数量 += 20; break
                    case AItem.DisplayName.includes('[混沌]'): 元宝数量 += 50; break
                    case AItem.DisplayName.includes('[底材]'): 元宝数量 += 2; break
                    case AItem.DisplayName.includes('艾维'): 元宝数量 += 5; break
                    case AItem.DisplayName.includes('阿拉贡'): 元宝数量 += 5; break
                }
                Player.DeleteItem(AItem)
                // Npc.Take(Player, AItem.GetName())
            }
        }
    }
    if (元宝数量 > 0) {
        let 倍数 = 2
        let 艾维利之戒指 = 0
        if (Player.GetJewelrys(1) != null && Player.GetJewelrys(1).GetName() == '艾维利之戒' && Player.GetJewelrys(1).GetOutWay3(40) < 10) {
            艾维利之戒指 = (Player.GetJewelrys(1).GetOutWay2(1) / 20 + Player.GetJewelrys(1).GetOutWay3(40) * 2) / 100
        } else if (Player.GetJewelrys(1) != null && Player.GetJewelrys(1).GetName() == '艾维利之戒' && Player.GetJewelrys(1).GetOutWay3(40) >= 10) {
            艾维利之戒指 = (Player.GetJewelrys(1).GetOutWay2(1) / 20 + Player.GetJewelrys(1).GetOutWay3(40) * 2 + 50) / 100
        }

        if (GameLib.V.判断新区 == false) {
            倍数 = 4 + 艾维利之戒指
        } else {
            倍数 = 2 + 艾维利之戒指
        }
        Player.SetGameGold(Player.GetGameGold() + Math.round(元宝数量 * (Player.V.回收元宝倍率 / 100) * 倍数))
        Player.GoldChanged()
        Player.SendMessage(`回收了{S=${数量};C=154}件装备,共获得{S=${Math.round(元宝数量 * (Player.V.回收元宝倍率 / 100) * 倍数)};C=253}枚元宝!`, 1)
    }
}
export function 清理词条装备(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //
    let AItem: TUserItem;
    let 元宝数量 = 0
    let 数量 = 0, 生命 = 0, 生命超 = 0, 防御 = 0, 防御超 = 0, 攻击 = 0, 攻击超 = 0, 魔法 = 0, 魔法超 = 0, 道术 = 0, 道术超 = 0, 射术 = 0, 射术超 = 0, 刺术 = 0, 刺术超 = 0, 武术 = 0, 武术超 = 0, 属性 = 0, 属性超 = 0, 倍攻 = 0, 生肖 = 0, 生肖超 = 0, 种族 = 0, 种族超 = 0, 天赋 = 0, 装备星星 = 0, 装备星星超 = 0, 技能伤害 = 0, 技能伤害超 = 0, 攻速魔速 = 0, 吸血比例 = 0
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        生命 = 0, 生命超 = 0, 防御 = 0, 防御超 = 0, 攻击 = 0, 攻击超 = 0, 魔法 = 0, 魔法超 = 0, 道术 = 0, 道术超 = 0, 射术 = 0, 射术超 = 0, 刺术 = 0, 刺术超 = 0, 武术 = 0, 武术超 = 0, 属性 = 0, 属性超 = 0, 倍攻 = 0, 生肖 = 0, 生肖超 = 0, 种族 = 0, 种族超 = 0, 天赋 = 0, 装备星星 = 0, 装备星星超 = 0, 技能伤害 = 0, 技能伤害超 = 0, 攻速魔速 = 0, 吸血比例 = 0
        AItem = Player.GetBagItem(I);
        if (装备类型.includes(AItem.StdMode) && AItem.GetState().GetBind() == false) {


            if (AItem.GetCustomDesc() != ``) {
                let 装备字符串 = JSON.parse(AItem.GetCustomDesc())
                if (装备字符串.职业属性_职业) {
                    let 装备属性条数 = 装备字符串.职业属性_职业.length
                    for (let e = 0; e <= 装备属性条数 - 1; e++) {
                        switch (Number(装备字符串.职业属性_职业[e])) {
                            case 33: 攻击 = 攻击 + Number(装备字符串.职业属性_属性[e]); break;
                            case 34: 魔法 = 魔法 + Number(装备字符串.职业属性_属性[e]); break;
                            case 35: 道术 = 道术 + Number(装备字符串.职业属性_属性[e]); break;
                            case 36: 刺术 = 刺术 + Number(装备字符串.职业属性_属性[e]); break;
                            case 37: 射术 = 射术 + Number(装备字符串.职业属性_属性[e]); break;
                            case 38: 武术 = 武术 + Number(装备字符串.职业属性_属性[e]); break;
                            case 31: 生命 = 生命 + Number(装备字符串.职业属性_属性[e]); break;
                            case 32: 防御 = 防御 + Number(装备字符串.职业属性_属性[e]); break;
                            case 30: 属性 = 属性 + Number(装备字符串.职业属性_属性[e]); break;
                            case 350: case 351: case 352: 种族 = 种族 + Number(装备字符串.职业属性_属性[e]); break;
                            case 195: case 196: case 197: case 198: case 199: case 200: case 201: case 202: case 203: case 204: case 205: case 206: case 207: case 208: case 209: case 210:
                            case 211: case 212: case 213: case 214: case 215: case 216: case 217: case 218: case 219: case 220: case 221: case 222: case 223: case 224: case 225: case 226:
                            case 227: case 228: case 229: case 230: case 231: case 232: case 233: case 234: case 235: case 236: 倍攻 = 倍攻 + Number(装备字符串.职业属性_属性[e]); break;
                            case 401: case 402: case 403: case 404: case 405: case 406: case 407: case 408: case 409: case 410: case 411: case 412: case 413: case 414: case 415: case 416:
                            case 417: case 418: case 419: case 420: case 421: case 422: case 423: case 424: case 425: case 426: case 427: case 428: case 429: case 430: case 431: case 432:
                            case 433: case 434: case 435: case 436: case 437: case 438: case 439: case 440: 技能伤害 = 技能伤害 + Number(装备字符串.职业属性_属性[e]); break;
                            default: break;
                        }
                        if (Player.V.生肖词条 && (AItem.StdMode == 68 || AItem.StdMode == 35)) {
                            // 生肖 = Decimal.plus(生肖, String(装备字符串.职业属性_属性[e]))
                            生肖 = 生肖 + Number(AItem.GetCustomCaption(0))
                        }
                        if (Player.V.装备星星词条 && AItem.StdMode != 68 && AItem.StdMode != 35) {
                            // 装备星星 = Decimal.plus(装备星星, String(装备字符串.职业属性_属性[e]))
                            装备星星 = 装备星星 + Number(AItem.GetCustomCaption(0))
                        }

                    }
                }
            }


            for (let i = 基础属性第一条; i <= 备用四; i++) {
                switch (true) {
                    case AItem.GetOutWay1(i) >= 620 && AItem.GetOutWay1(i) <= 628: 天赋 = 天赋 + AItem.GetOutWay2(i); break
                    case AItem.GetOutWay1(i) == 310: 攻速魔速 = 攻速魔速 + AItem.GetOutWay2(i); break
                    case AItem.GetOutWay1(i) == 302: 吸血比例 = 吸血比例 + AItem.GetOutWay2(i); break
                }
            }

            //    console.log('装备名字='+AItem.DisplayName+'生命超='+生命超+'生命='+生命)
            if ((Player.V.防御词条 && 防御 > Player.V.防御词条数值) || (Player.V.血量词条 && 生命 > Player.V.血量词条数值)
                || (Player.V.攻击词条 && 攻击 > Player.V.攻击词条数值) || (Player.V.魔法词条 && 魔法 > Player.V.魔法词条数值)
                || (Player.V.道术词条 && 道术 > Player.V.道术词条数值) || (Player.V.刺术词条 && 刺术 > Player.V.刺术词条数值)
                || (Player.V.射术词条 && 射术 > Player.V.射术词条数值) || (Player.V.武术词条 && 武术 > Player.V.武术词条数值)
                || (Player.V.属性词条 && 属性 > Player.V.属性词条数值) || (Player.V.倍攻词条 && 倍攻 > Player.V.倍攻词条数值)
                || (Player.V.种族词条 && 种族 > Player.V.种族词条数值) || (Player.V.生肖词条 && 生肖 > Player.V.生肖词条数值)
                || (Player.V.天赋词条 && 天赋 > Player.V.天赋词条数值) || (Player.V.装备星星词条 && 装备星星 > Player.V.装备星星词条数值)
                || (Player.V.技能伤害词条 && 技能伤害 > Player.V.技能伤害词条数值)
                || (Player.V.攻速魔速词条 && 攻速魔速 > Player.V.攻速魔速词条数值) || (Player.V.吸血比例词条 && 吸血比例 > Player.V.吸血比例词条数值)) {
                数量++
                switch (true) {
                    case AItem.DisplayName.includes('[劣质]'): 元宝数量 += 0; break
                    case AItem.DisplayName.includes('[超强]'): 元宝数量 += 1; break
                    case AItem.DisplayName.includes('[杰出]'): 元宝数量 += 2; break
                    case AItem.DisplayName.includes('[传说]'): 元宝数量 += 3; break
                    case AItem.DisplayName.includes('[神话]'): 元宝数量 += 4; break
                    case AItem.DisplayName.includes('[传承]'): 元宝数量 += 6; break
                    case AItem.DisplayName.includes('[史诗]'): 元宝数量 += 8; break
                    case AItem.DisplayName.includes('[绝世]'): 元宝数量 += 10; break
                    case AItem.DisplayName.includes('[造化]'): 元宝数量 += 20; break
                    case AItem.DisplayName.includes('[混沌]'): 元宝数量 += 50; break
                    case AItem.DisplayName.includes('[底材]'): 元宝数量 += 2; break

                }
                Player.DeleteItem(AItem)
                // Npc.Take(Player, AItem.GetName())
            }
        }

    }
    if (元宝数量 > 0) {
        let 倍数 = 2
        let 艾维利之戒指 = 0
        if (Player.GetJewelrys(1) != null && Player.GetJewelrys(1).GetName() == '艾维利之戒' && Player.GetJewelrys(1).GetOutWay3(40) < 10) {
            艾维利之戒指 = (Player.GetJewelrys(1).GetOutWay2(1) / 20 + Player.GetJewelrys(1).GetOutWay3(40) * 2) / 100
        } else if (Player.GetJewelrys(1) != null && Player.GetJewelrys(1).GetName() == '艾维利之戒' && Player.GetJewelrys(1).GetOutWay3(40) >= 10) {
            艾维利之戒指 = (Player.GetJewelrys(1).GetOutWay2(1) / 20 + Player.GetJewelrys(1).GetOutWay3(40) * 2 + 50) / 100
        }

        if (GameLib.V.判断新区 == false) {
            倍数 = 4 + 艾维利之戒指
        } else {
            倍数 = 2 + 艾维利之戒指
        }
        Player.SetGameGold(Player.GetGameGold() + Math.round(元宝数量 * (Player.V.回收元宝倍率 / 100) * 倍数))
        Player.GoldChanged()
        Player.SendMessage(`回收了{S=${数量};C=154}件装备,共获得{S=${Math.round(元宝数量 * (Player.V.回收元宝倍率 / 100) * 倍数)};C=253}枚元宝!`, 1)
    }
}
export function 清理劣质(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let AItem: TUserItem;
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        AItem = Player.GetBagItem(I);
        if (装备类型.includes(AItem.StdMode) && AItem.GetState().GetBind() == false && AItem.DisplayName.includes('劣质')) {
            Npc.Take(Player, AItem.GetName())
        }
    }

}

