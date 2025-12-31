
// import BigNumber from "../[功能]/bignumber"
import { 智能计算 } from "../../大数值/核心计算方法"
import { 大数值整数简写 } from "../字符计算"

export function 准备回收(Npc: TNormNpc, Player: TPlayObject): void {  //装备回收
    Player.V.自动拾取 ??= false
    const 血量数值 = 大数值整数简写(Player.V.血量数值)
    const 防御数值 = 大数值整数简写(Player.V.防御数值)
    const 攻击数值 = 大数值整数简写(Player.V.攻击数值)
    const 伤害数值 = 大数值整数简写(Player.V.伤害数值)
    const 等级数值 = 大数值整数简写(Player.V.等级数值)
    const 次数数值 = 大数值整数简写(Player.V.次数数值)
    const 宝宝数值 = 大数值整数简写(Player.V.宝宝数值)
    Player.V.材料1 ??= 0
    Player.V.材料2 ??= 0
    Player.V.材料3 ??= 0
    Player.V.材料4 ??= 0
    Player.V.材料5 ??= 0
    Player.V.材料6 ??= 0
    Player.V.材料7 ??= 0
    Player.V.材料8 ??= 0
    Player.V.材料9 ??= 0
    Player.V.材料自动存仓库 ??= false


    const S = `\\\\
                              {S=当前回收比例${Player.R.回收加成 * 100}%;C=253;y=20}\\
               {S=基础装备回收;C=224}         <技能石回收/@_ITEM_zbhs.技能石回收>         <护身符回收/@_ITEM_zbhs.护身符回收>\\
            {S=基础属性保留(大于);C=9}\\
    <{I=$血量$;F=装备图标.DATA;X=70;Y=80}/@_ITEM_zbhs.勾选(血量勾选)>  血量:${血量数值}  <{M=212,212,213;F=Prguse.WZL;X=300;Y=80}/@_ITEM_zbhs.加(血量数值)>    <{M=214,214,215;F=Prguse.WZL;X=320;Y=80}/@_ITEM_zbhs.减(血量数值)>                 <{S=设置数值;X=360;Y=78}/@@_ITEM_zbhs.InPutString1(请输入你的数值!!,血量数值)>\\
    <{I=$防御$;F=装备图标.DATA;X=70;Y=105}/@_ITEM_zbhs.勾选(防御勾选)>  防御:${防御数值}  <{M=212,212,213;F=Prguse.WZL;X=300;Y=105}/@_ITEM_zbhs.加(防御数值)>  <{M=214,214,215;F=Prguse.WZL;X=320;Y=105}/@_ITEM_zbhs.减(防御数值)>                 <{S=设置数值;X=360;Y=103}/@@_ITEM_zbhs.InPutString1(请输入你的数值!!,防御数值)>\\
    <{I=$攻击$;F=装备图标.DATA;X=70;Y=131}/@_ITEM_zbhs.勾选(攻击勾选)>  攻击:${攻击数值}  <{M=212,212,213;F=Prguse.WZL;X=300;Y=131}/@_ITEM_zbhs.加(攻击数值)>  <{M=214,214,215;F=Prguse.WZL;X=320;Y=131}/@_ITEM_zbhs.减(攻击数值)>                 <{S=设置数值;X=360;Y=129}/@@_ITEM_zbhs.InPutString1(请输入你的数值!!,攻击数值)>\\\\
            {S=词条属性保留(大于);C=243}\\\\
    <{I=$伤害$;F=装备图标.DATA;X=70;Y=200}/@_ITEM_zbhs.勾选(伤害勾选)>  {S=技能伤害:${伤害数值};Y=199}  <{M=212,212,213;F=Prguse.WZL;X=300;Y=200}/@_ITEM_zbhs.加(伤害数值)>    <{M=214,214,215;F=Prguse.WZL;X=320;Y=200}/@_ITEM_zbhs.减(伤害数值)>                 <{S=设置数值;X=360;Y=198}/@@_ITEM_zbhs.InPutString1(请输入你的数值!!,伤害数值)>\\\\
    <{I=$等级$;F=装备图标.DATA;X=70;Y=225}/@_ITEM_zbhs.勾选(等级勾选)>  {S=技能等级:${等级数值};Y=224}                  <{S=设置数值;X=360;Y=223}/@@_ITEM_zbhs.InPutString1(请输入你的数值!!,等级数值)>\\\\
    <{I=$次数$;F=装备图标.DATA;X=70;Y=250}/@_ITEM_zbhs.勾选(次数勾选)>  {S=技能次数:${次数数值};Y=249}  <{M=212,212,213;F=Prguse.WZL;X=300;Y=250}/@_ITEM_zbhs.加(次数数值)>    <{M=214,214,215;F=Prguse.WZL;X=320;Y=250}/@_ITEM_zbhs.减(次数数值)>                  <{S=设置数值;X=360;Y=248}/@@_ITEM_zbhs.InPutString1(请输入你的数值!!,次数数值)>\\\\
    <{I=$速度$;F=装备图标.DATA;X=70;Y=275}/@_ITEM_zbhs.勾选(宝宝勾选)>  {S=宝宝速度:${宝宝数值};Y=274}                  <{S=设置数值;X=360;Y=273}/@@_ITEM_zbhs.InPutString1(请输入你的数值!!,宝宝数值)>\\\\
    <{I=$自动拾取$;F=装备图标.DATA;X=70;Y=300}/@_ITEM_zbhs.勾选(材料自动存仓库)>  {S=材料自动存仓库;C=224;Y=300}      <{s=材料仓库;x=200;y=300}/@_ITEM_zbhs.材料仓库>
    <{I=$回收$;F=装备图标.DATA;X=70;Y=320}/@_ITEM_zbhs.勾选(自动回收)>  {S=自动回收;C=224;Y=320}      <{I=$本职$;F=装备图标.DATA;X=200;Y=320}/@_ITEM_zbhs.勾选(本职勾选)>  {S=只保留本职业;C=254;Y=320}       <{S=全部回收;C=251;X=360;Y=320}/@_ITEM_zbhs.全部回收>
`
    let M = '';
    M = S;
    Player.V.血量勾选 ? M = ReplaceStr(M, '$血量$', '1') : M = ReplaceStr(M, '$血量$', '0')
    Player.V.防御勾选 ? M = ReplaceStr(M, '$防御$', '1') : M = ReplaceStr(M, '$防御$', '0')
    Player.V.攻击勾选 ? M = ReplaceStr(M, '$攻击$', '1') : M = ReplaceStr(M, '$攻击$', '0')
    Player.V.伤害勾选 ? M = ReplaceStr(M, '$伤害$', '1') : M = ReplaceStr(M, '$伤害$', '0')
    Player.V.等级勾选 ? M = ReplaceStr(M, '$等级$', '1') : M = ReplaceStr(M, '$等级$', '0')
    Player.V.次数勾选 ? M = ReplaceStr(M, '$次数$', '1') : M = ReplaceStr(M, '$次数$', '0')
    Player.V.宝宝勾选 ? M = ReplaceStr(M, '$速度$', '1') : M = ReplaceStr(M, '$速度$', '0')
    Player.V.自动回收 ? M = ReplaceStr(M, '$回收$', '1') : M = ReplaceStr(M, '$回收$', '0')
    Player.V.本职勾选 ? M = ReplaceStr(M, '$本职$', '1') : M = ReplaceStr(M, '$本职$', '0')
    Player.V.材料自动存仓库 ? M = ReplaceStr(M, '$自动拾取$', '1') : M = ReplaceStr(M, '$自动拾取$', '0')
    Npc.SayEx(Player, 'npc中大窗口新', M)
}


export function 材料仓库(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //装备回收

    const S = `\\\\\\\\
                {S=材料存取;C=254}   {S=  不占背包和仓库位置;C=249}\\
                <一键存入材料/@_ITEM_zbhs.存入>    {S=材料自动存仓库;C=254} <{I=$材料$;F=装备图标.DATA;X=430;Y=80}/@_ITEM_zbhs.存材料>\\\\
    {S=【书页】;Hint=用于学习技能;C=243} {S=已存入;C=250} $X21$ {S=个;C=250}   <{S=取出;x=260}/@@_ITEM_zbhs.InPutInteger(输入要取出的数量,书页,材料1)>\\
    {S=【血石碎片】;Hint=用于合成升级血石;C=243} {S=已存入;C=250} $X22$ {S=个;C=250}   <{S=取出;x=260}/@@_ITEM_zbhs.InPutInteger(输入要取出的数量,血石碎片,材料2)>\\
    {S=【勋章碎片】;Hint=用于合成升级勋章;C=243} {S=已存入;C=250} $X23$ {S=个;C=250}   <{S=取出;x=260}/@@_ITEM_zbhs.InPutInteger(输入要取出的数量,勋章碎片,材料3)>\\
    {S=【盾牌碎片】;Hint=用于合成升级盾牌;C=243} {S=已存入;C=250} $X24$ {S=个;C=250}   <{S=取出;x=260}/@@_ITEM_zbhs.InPutInteger(输入要取出的数量,盾牌碎片,材料4)>\\
    {S=【护符碎片】;Hint=用于合成升级护符;C=243} {S=已存入;C=250} $X25$ {S=个;C=250}   <{S=取出;x=260}/@@_ITEM_zbhs.InPutInteger(输入要取出的数量,护符碎片,材料5)>\\
    {S=【符文碎片】;Hint=用于合成升级符文;C=243} {S=已存入;C=250} $X26$ {S=个;C=250}   <{S=取出;x=260}/@@_ITEM_zbhs.InPutInteger(输入要取出的数量,符文碎片,材料6)>\\
    {S=【种族雕像】;Hint=用于强化种族;C=243} {S=已存入;C=250} $X27$ {S=个;C=250}   <{S=取出;x=260}/@@_ITEM_zbhs.InPutInteger(输入要取出的数量,种族雕像,材料7)>\\
    {S=【进阶神石】;Hint=用于进阶地图阶段;C=243} {S=已存入;C=250} $X28$ {S=个;C=250}   <{S=取出;x=260}/@@_ITEM_zbhs.InPutInteger(输入要取出的数量,进阶神石,材料8)>\\
    {S=【超级斗笠碎片】;Hint=所有合成升级斗笠;C=243} {S=已存入;C=250} $X29$ {S=个;C=250}   <{S=取出;x=260}/@@_ITEM_zbhs.InPutInteger(输入要取出的数量,超级斗笠碎片,材料9)>\\

`
    let Mes = '';
    Mes = S;
    Mes = ReplaceStr(Mes, '$X21$', Player.V.材料1);
    Mes = ReplaceStr(Mes, '$X22$', Player.V.材料2);
    Mes = ReplaceStr(Mes, '$X23$', Player.V.材料3);
    Mes = ReplaceStr(Mes, '$X24$', Player.V.材料4);
    Mes = ReplaceStr(Mes, '$X25$', Player.V.材料5);
    Mes = ReplaceStr(Mes, '$X26$', Player.V.材料6);
    Mes = ReplaceStr(Mes, '$X27$', Player.V.材料7);
    Mes = ReplaceStr(Mes, '$X28$', Player.V.材料8);
    Mes = ReplaceStr(Mes, '$X29$', Player.V.材料9);
    Mes = ReplaceStr(Mes, '$元宝$', Player.V.元宝数量);
    Player.V.材料自动存仓库 ? Mes = ReplaceStr(Mes, '$材料$', '31') : Mes = ReplaceStr(Mes, '$材料$', '30')
    Npc.SayEx(Player, 'NPC小窗口', Mes);
}


export function 存入(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let count: number
    let AItem: TUserItem
    for (let I = Player.ItemSize - 1; I >= 0; I--) {
        AItem = Player.GetBagItem(I)
        if (AItem != null && AItem.GetState().GetBind() == false) {
            switch (AItem.GetName()) {
                case '书页':
                    if (AItem.GetDura() > 1) count = AItem.GetDura(); else count = 1;
                    if (Npc.TakeItem(Player, AItem))
                        Player.V.材料1 = Player.V.材料1 + count
                    材料仓库(Npc, Player, Args)
                    break
                case '血石碎片':
                    if (AItem.GetDura() > 1) count = AItem.GetDura(); else count = 1;
                    if (Npc.TakeItem(Player, AItem))
                        Player.V.材料2 = Player.V.材料2 + count
                    材料仓库(Npc, Player, Args)
                    break
                case '勋章碎片':
                    if (AItem.GetDura() > 1) count = AItem.GetDura(); else count = 1;
                    if (Npc.TakeItem(Player, AItem))
                        Player.V.材料3 = Player.V.材料3 + count
                    材料仓库(Npc, Player, Args)
                    break
                case '盾牌碎片':
                    if (AItem.GetDura() > 1) count = AItem.GetDura(); else count = 1;
                    if (Npc.TakeItem(Player, AItem))
                        Player.V.材料4 = Player.V.材料4 + count
                    材料仓库(Npc, Player, Args)
                    break
                case '护符碎片':
                    if (AItem.GetDura() > 1) count = AItem.GetDura(); else count = 1;
                    if (Npc.TakeItem(Player, AItem))
                        Player.V.材料5 = Player.V.材料5 + count
                    材料仓库(Npc, Player, Args)
                    break
                case '符文碎片':
                    if (AItem.GetDura() > 1) count = AItem.GetDura(); else count = 1;
                    if (Npc.TakeItem(Player, AItem))
                        Player.V.材料6 = Player.V.材料6 + count
                    材料仓库(Npc, Player, Args)
                    break
                case '种族雕像':
                    if (AItem.GetDura() > 1) count = AItem.GetDura(); else count = 1;
                    if (Npc.TakeItem(Player, AItem))
                        Player.V.材料7 = Player.V.材料7 + count
                    材料仓库(Npc, Player, Args)
                    break
                case '进阶神石':
                    if (AItem.GetDura() > 1) count = AItem.GetDura(); else count = 1;
                    if (Npc.TakeItem(Player, AItem))
                        Player.V.材料8 = Player.V.材料8 + count
                    材料仓库(Npc, Player, Args)
                    break
                case '超级斗笠碎片':
                    if (AItem.GetDura() > 1) count = AItem.GetDura(); else count = 1;
                    if (Npc.TakeItem(Player, AItem))
                        Player.V.材料9 = Player.V.材料9 + count
                    材料仓库(Npc, Player, Args)
                    break
            }
        }
    }
}


export function InPutInteger(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void { //材料仓库
    let 材料名字 = Args.Str[0]
    let 材料变量 = Args.Str[1]
    let 材料数量 = Args.Int[2]
    // console.log(Args.Str[0])
    // console.log(Args.Str[1])
    // console.log(Args.Int[2])
    if (材料数量 < 1 || 材料数量 > 999999999) { return }
    if (Player.MaxBagSize - Player.ItemSize >= 10) {
        if (Player.V[材料变量] > 材料数量) {
            Player.V[材料变量] = Player.V[材料变量] - 材料数量
            Npc.Give(Player, 材料名字, 材料数量, false);
            材料仓库(Npc, Player, Args)
        } else {
            Player.MessageBox(`${材料名字}不足${材料数量},取出失败!`)
        }
    } else {
        Player.SendMessage('背包请多留点空位!!!');
    }

}



export function 存材料(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //装备勾选
    Player.V.材料自动存仓库 ? Player.V.材料自动存仓库 = false : Player.V.材料自动存仓库 = true
    材料仓库(Npc, Player, Args)
}

export function 技能石回收(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //装备回收

    if (Player.V.回收职业选择 == '') {
        Player.V.回收职业选择 = Player.V.职业
    }
    let 技能1 = '', 技能2 = '', 技能3 = '', 技能4 = '', 技能5 = '', 技能6 = ''
    switch (Player.V.回收职业选择) {
        case '圣骑士':
            技能1 = `<{I=$半月弯刀$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,半月弯刀)> {S=半月弯刀;C=145;Y=130}`
            技能2 = `<{I=$攻杀剑术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,攻杀剑术)> {S=攻杀剑术;C=145;Y=130}`
            技能3 = `<{I=$神圣之盾$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,神圣之盾)> {S=神圣之盾;C=145;Y=130}`
            技能4 = `<{I=$鲜血圣印$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,鲜血圣印)> {S=鲜血圣印;C=145;Y=130}`
            技能5 = `<{I=$复仇圣印$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石5技能,复仇圣印)> {S=复仇圣印;C=145;Y=130}`
            break
        case '十字军':
            技能1 = `<{I=$刺杀剑术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,刺杀剑术)> {S=刺杀剑术;C=145;Y=130}`
            技能2 = `<{I=$攻杀剑术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,攻杀剑术)> {S=攻杀剑术;C=145;Y=130}`
            技能3 = `<{I=$夺命十字$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,夺命十字)> {S=夺命十字;C=145;Y=130}`
            技能4 = `<{I=$十步一杀$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,十步一杀)> {S=十步一杀;C=145;Y=130}`
            break
        case '毁灭者':
            技能1 = `<{I=$半月弯刀$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,半月弯刀)> {S=半月弯刀;C=145;Y=130}`
            技能2 = `<{I=$攻杀剑术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,攻杀剑术)> {S=攻杀剑术;C=145;Y=130}`
            技能3 = `<{I=$毁灭之球$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,毁灭之球)> {S=毁灭之球;C=145;Y=130}`
            技能4 = `<{I=$彻地钉$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,彻地钉)> {S=彻地钉;C=145;Y=130}`
            技能5 = `<{I=$倚天辟地$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石5技能,倚天辟地)> {S=倚天辟地;C=145;Y=130}`
            break
        case '鬼剑士':
            技能1 = `<{I=$攻杀剑术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,攻杀剑术)> {S=攻杀剑术;C=145;Y=130}`
            技能2 = `<{I=$刺杀剑术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,刺杀剑术)> {S=刺杀剑术;C=145;Y=130}`
            技能3 = `<{I=$烈火剑法$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,烈火剑法)> {S=烈火剑法;C=145;Y=130}`
            技能4 = `<{I=$逐日剑法$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,逐日剑法)> {S=逐日剑法;C=145;Y=130}`
            技能5 = `<{I=$开天斩$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石5技能,开天斩)> {S=开天斩;C=145;Y=130}`
            break
        case '幻影之刃':
            技能1 = `<{I=$霜月$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,霜月)> {S=霜月;C=145;Y=130}`
            技能2 = `<{I=$幻剑$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,幻剑)> {S=幻剑;C=145;Y=130}`
            break
        case '终结者':
            技能1 = `<{I=$霜月$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,霜月)> {S=霜月;C=145;Y=130}`
            技能2 = `<{I=$炎龙波$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,炎龙波)> {S=炎龙波;C=145;Y=130}`
            技能3 = `<{I=$火镰狂舞$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,烈火剑法)> {S=火镰狂舞;C=145;Y=130}`
            break
        case '暗之使徒':
            技能1 = `<{I=$霜月$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,霜月)> {S=霜月;C=145;Y=130}`
            技能2 = `<{I=$灵魂陷阱$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,灵魂陷阱)> {S=灵魂陷阱;C=145;Y=130}`
            break
        case '阴影之王':
            技能1 = `<{I=$霜月$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,霜月)> {S=霜月;C=145;Y=130}`
            技能2 = `<{I=$黑暗气息$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,黑暗气息)> {S=黑暗气息;C=145;Y=130}`
            技能3 = `<{I=$影袭$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,影袭)> {S=影袭;C=145;Y=130}`
            技能4 = `<{I=$淬毒匕首$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,淬毒匕首)> {S=淬毒匕首;C=145;Y=130}`
            break
        case '金刚罗汉':
            技能1 = `<{I=$罗汉棍法$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,罗汉棍法)> {S=罗汉棍法;C=145;Y=130}`
            技能2 = `<{I=$推山掌$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,推山掌)> {S=推山掌;C=145;Y=130}`
            技能3 = `<{I=$金刚掌$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,金刚掌)> {S=金刚掌;C=145;Y=130}`
            break
        case '神圣使者':
            技能1 = `<{I=$罗汉棍法$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,罗汉棍法)> {S=罗汉棍法;C=145;Y=130}`
            技能2 = `<{I=$推山掌$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,推山掌)> {S=推山掌;C=145;Y=130}`
            技能3 = `<{I=$降魔棍法$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,降魔棍法)> {S=降魔棍法;C=145;Y=130}`
            技能4 = `<{I=$达摩棍法$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,达摩棍法)> {S=达摩棍法;C=145;Y=130}`
            技能5 = `<{I=$降龙伏虎$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石5技能,降龙伏虎)> {S=降龙伏虎;C=145;Y=130}`
            break
        case '审判者':
            技能1 = `<{I=$罗汉棍法$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,罗汉棍法)> {S=罗汉棍法;C=145;Y=130}`
            技能2 = `<{I=$推山掌$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,推山掌)> {S=推山掌;C=145;Y=130}`
            技能3 = `<{I=$天雷阵$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,天雷阵)> {S=天雷阵;C=145;Y=130}`
            break
        case '血修罗':
            技能1 = `<{I=$罗汉棍法$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,罗汉棍法)> {S=罗汉棍法;C=145;Y=130}`
            技能2 = `<{I=$推山掌$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,推山掌)> {S=推山掌;C=145;Y=130}`
            技能3 = `<{I=$血缀天涯$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,血缀天涯)> {S=血缀天涯;C=145;Y=130}`
            break
        case '契约师':
            技能1 = `<{I=$火球术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,火球术)> {S=火球术;C=145;Y=130}`
            技能2 = `<{I=$灵魂契约$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,灵魂契约)> {S=灵魂契约;C=145;Y=130}`
            技能3 = `<{I=$雷电术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,雷电术)> {S=雷电术;C=145;Y=130}`
            技能4 = `<{I=$灵魂重生$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,灵魂重生)> {S=灵魂重生;C=145;Y=130}`
            break
        case '元素师':
            技能1 = `<{I=$火球术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,火球术)> {S=火球术;C=145;Y=130}`
            技能2 = `<{I=$火墙$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,火墙)> {S=火墙;C=145;Y=130}`
            技能3 = `<{I=$燃烧$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,燃烧)> {S=燃烧;C=145;Y=130}`
            技能4 = `<{I=$流星火雨$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,流星火雨)> {S=流星火雨;C=145;Y=130}`
            技能5 = `<{I=$龙卷风$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石5技能,龙卷风)> {S=龙卷风;C=145;Y=130}`
            break
        case '秘术师':
            技能1 = `<{I=$火球术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,火球术)> {S=火球术;C=145;Y=130}`
            技能2 = `<{I=$寒冰掌$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,寒冰掌)> {S=寒冰掌;C=145;Y=130}`
            技能3 = `<{I=$寒冰护甲$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,寒冰护甲)> {S=寒冰护甲;C=145;Y=130}`
            技能4 = `<{I=$能量振波$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,能量振波)> {S=能量振波;C=145;Y=130}`
            break
        case '死灵法师':
            技能1 = `<{I=$火球术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,火球术)> {S=火球术;C=145;Y=130}`
            技能2 = `<{I=$统御骷髅$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,统御骷髅)> {S=统御骷髅;C=145;Y=130}`
            技能3 = `<{I=$骨矛$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,骨矛)> {S=骨矛;C=145;Y=130}`
            技能4 = `<{I=$死亡军团$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,死亡军团)> {S=死亡军团;C=145;Y=130}`
            break
        case '驭兽者':
            技能1 = `<{I=$灵魂火符$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,灵魂火符)> {S=灵魂火符;C=145;Y=130}`
            技能2 = `<{I=$召唤神兽$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,召唤神兽)> {S=召唤神兽;C=145;Y=130}`
            break
        case '噬魂者':
            技能1 = `<{I=$灵魂火符$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,灵魂火符)> {S=灵魂火符;C=145;Y=130}`
            技能2 = `<{I=$噬血术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,噬血术)> {S=噬血术;C=145;Y=130}`
            技能3 = `<{I=$嗜血蝙蝠$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,嗜血蝙蝠)> {S=嗜血蝙蝠;C=145;Y=130}`
            技能4 = `<{I=$噬魂沼泽$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,噬魂沼泽)> {S=噬魂沼泽;C=145;Y=130}`
            break
        case '巫毒萨满':
            技能1 = `<{I=$灵魂火符$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,灵魂火符)> {S=灵魂火符;C=145;Y=130}`
            技能2 = `<{I=$蛊毒$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,蛊毒)> {S=蛊毒;C=145;Y=130}`
            技能3 = `<{I=$蛊虫$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,蛊虫)> {S=蛊虫;C=145;Y=130}`
            技能4 = `<{I=$召唤毒龙$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,召唤毒龙)> {S=召唤毒龙;C=145;Y=130}`
            break
        case '牧师':
            技能1 = `<{I=$灵魂火符$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,灵魂火符)> {S=灵魂火符;C=145;Y=130}`
            技能2 = `<{I=$神圣光辉$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,神圣光辉)> {S=神圣光辉;C=145;Y=130}`
            break
        case '神射手':
            技能1 = `<{I=$精准箭术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,精准箭术)> {S=精准箭术;C=145;Y=130}`
            技能2 = `<{I=$火焰箭$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,火焰箭)> {S=火焰箭;C=145;Y=130}`
            技能3 = `<{I=$寒冰箭$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,寒冰箭)> {S=寒冰箭;C=145;Y=130}`
            技能4 = `<{I=$魔法箭$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,魔法箭)> {S=魔法箭;C=145;Y=130}`
            break
        case '丛林猎手':
            技能1 = `<{I=$精准箭术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,精准箭术)> {S=精准箭术;C=145;Y=130}`
            技能2 = `<{I=$召唤狂狼$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,召唤狂狼)> {S=召唤狂狼;C=145;Y=130}`
            技能3 = `<{I=$召唤虎王$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,召唤虎王)> {S=召唤虎王;C=145;Y=130}`
            break
        case '风行者':
            技能1 = `<{I=$精准箭术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,精准箭术)> {S=精准箭术;C=145;Y=130}`
            技能2 = `<{I=$恶魔降临$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,恶魔降临)> {S=恶魔降临;C=145;Y=130}`
            技能3 = `<{I=$狂风之力$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,狂风之力)> {S=狂风之力;C=145;Y=130}`
            技能4 = `<{I=$疾风连闪$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,疾风连闪)> {S=疾风连闪;C=145;Y=130}`
            break
        case '镜像游侠':
            技能1 = `<{I=$精准箭术$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石1技能,精准箭术)> {S=精准箭术;C=145;Y=130}`
            技能2 = `<{I=$万箭齐发$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石2技能,万箭齐发)> {S=万箭齐发;C=145;Y=130}`
            技能3 = `<{I=$雷光之眼$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石3技能,雷光之眼)> {S=雷光之眼;C=145;Y=130}`
            技能4 = `<{I=$排山倒海$;F=装备图标.DATA;Y=130}/@_ITEM_zbhs.技能石选择勾选(技能石4技能,排山倒海)> {S=排山倒海;C=145;Y=130}`
            break
    }

    const S = `\\\\
                              {S=当前回收比例${Player.R.回收加成 * 100}%;C=253;y=20}\\
               <基础装备回收/@_ITEM_zbhs.准备回收>         {S=技能石回收;C=224}         <护身符回收/@_ITEM_zbhs.护身符回收>\\\\
       {S=职业:;C=31}<${Player.V.回收职业选择 == '' ? '选择职业' : Player.V.回收职业选择}/@_ITEM_zbhs.选择职业>\\\\
       技能:\\
       ${技能1}  ${技能2}  ${技能3}  ${技能4}  ${技能5}\\\\\\
       按阶数保留全部: <{I=$保留全部技能石$;F=装备图标.DATA}/@_ITEM_zbhs.技能石勾选(保留全部技能石)>\\\\
       技能石阶数保留: {S=${Player.V.技能石阶数保留}阶以上:;C=31}  <等级加/@_ITEM_zbhs.等级加减(加)>  <等级减/@_ITEM_zbhs.等级加减(减)>\\\\
       技能石自动回收: <{I=$自动回收技能石$;F=装备图标.DATA}/@_ITEM_zbhs.技能石勾选(自动回收技能石)>\\\\
       <按保留回收技能石/@_ITEM_zbhs.按保留回收技能石>             <回收背包{s=全部;c=249}技能石/@_ITEM_zbhs.回收背包全部技能石>
    `
    let M = '';
    M = S;
    Player.V.技能石1技能勾选 ? M = ReplaceStr(M, `$${Player.V.技能石1技能}$`, '1') : M = ReplaceStr(M, `$${Player.V.技能石1技能}$`, '0')
    Player.V.技能石2技能勾选 ? M = ReplaceStr(M, `$${Player.V.技能石2技能}$`, '1') : M = ReplaceStr(M, `$${Player.V.技能石2技能}$`, '0')
    Player.V.技能石3技能勾选 ? M = ReplaceStr(M, `$${Player.V.技能石3技能}$`, '1') : M = ReplaceStr(M, `$${Player.V.技能石3技能}$`, '0')
    Player.V.技能石4技能勾选 ? M = ReplaceStr(M, `$${Player.V.技能石4技能}$`, '1') : M = ReplaceStr(M, `$${Player.V.技能石4技能}$`, '0')
    Player.V.技能石5技能勾选 ? M = ReplaceStr(M, `$${Player.V.技能石5技能}$`, '1') : M = ReplaceStr(M, `$${Player.V.技能石5技能}$`, '0')
    Player.V.保留全部技能石 ? M = ReplaceStr(M, '$保留全部技能石$', '1') : M = ReplaceStr(M, '$保留全部技能石$', '0')
    Player.V.自动回收技能石 ? M = ReplaceStr(M, '$自动回收技能石$', '1') : M = ReplaceStr(M, '$自动回收技能石$', '0')
    Player.V.自动回收 ? M = ReplaceStr(M, '$回收$', '1') : M = ReplaceStr(M, '$回收$', '0')
    Player.V.本职勾选 ? M = ReplaceStr(M, '$本职$', '1') : M = ReplaceStr(M, '$本职$', '0')
    Npc.SayEx(Player, 'npc中大窗口新', M)
}

export function 护身符回收(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //装备回收

    const 护身符血量数值 = 大数值整数简写(Player.V.护身符血量数值)
    const 护身符防御数值 = 大数值整数简写(Player.V.护身符防御数值)
    const 护身符攻击数值 = 大数值整数简写(Player.V.护身符攻击数值)
    const 护身符伤害数值 = 大数值整数简写(Player.V.护身符伤害数值)
    const 护身符等级数值 = 大数值整数简写(Player.V.护身符等级数值)
    const 护身符次数数值 = 大数值整数简写(Player.V.护身符次数数值)
    const 护身符宝宝数值 = 大数值整数简写(Player.V.护身符宝宝数值)
    Player.V.自动至尊勾选 ??= false


    const S = `\\\\
                              {S=当前回收比例${Player.R.回收加成 * 100}%;C=253;y=20}
                              {S=至尊护身符回收礼券在第二幕NPC进行;C=95;x=150}\\
               <基础装备回收/@_ITEM_zbhs.准备回收>         <技能石回收/@_ITEM_zbhs.技能石回收>         {S=护身符回收;C=224}\\
            {S=护身符属性保留(大于);C=9}\\
    <{I=$护身符血量$;F=装备图标.DATA;X=70;Y=80}/@_ITEM_zbhs.护身符勾选(护身符血量勾选)>  护身符血量:${护身符血量数值}  <{M=212,212,213;F=Prguse.WZL;X=300;Y=80}/@_ITEM_zbhs.护身符加(护身符血量数值)>    <{M=214,214,215;F=Prguse.WZL;X=320;Y=80}/@_ITEM_zbhs.护身符减(护身符血量数值)>                 <{S=设置数值;X=360;Y=78}/@@_ITEM_zbhs.InPutString10(请输入你的数值!!,护身符血量数值)>\\
    <{I=$护身符防御$;F=装备图标.DATA;X=70;Y=105}/@_ITEM_zbhs.护身符勾选(护身符防御勾选)>  护身符防御:${护身符防御数值}  <{M=212,212,213;F=Prguse.WZL;X=300;Y=105}/@_ITEM_zbhs.护身符加(护身符防御数值)>  <{M=214,214,215;F=Prguse.WZL;X=320;Y=105}/@_ITEM_zbhs.护身符减(护身符防御数值)>                 <{S=设置数值;X=360;Y=103}/@@_ITEM_zbhs.InPutString10(请输入你的数值!!,护身符防御数值)>\\
    <{I=$护身符攻击$;F=装备图标.DATA;X=70;Y=131}/@_ITEM_zbhs.护身符勾选(护身符攻击勾选)>  护身符攻击:${护身符攻击数值}  <{M=212,212,213;F=Prguse.WZL;X=300;Y=131}/@_ITEM_zbhs.护身符加(护身符攻击数值)>  <{M=214,214,215;F=Prguse.WZL;X=320;Y=131}/@_ITEM_zbhs.护身符减(护身符攻击数值)>                 <{S=设置数值;X=360;Y=129}/@@_ITEM_zbhs.InPutString10(请输入你的数值!!,护身符攻击数值)>\\
            {S=护身符词条属性保留(大于);C=243}\\
    <{I=$护身符伤害$;F=装备图标.DATA;X=70;Y=175}/@_ITEM_zbhs.护身符勾选(护身符伤害勾选)>  {S=护身符技能伤害:${护身符伤害数值};Y=174}  <{M=212,212,213;F=Prguse.WZL;X=300;Y=175}/@_ITEM_zbhs.护身符加(护身符伤害数值)>    <{M=214,214,215;F=Prguse.WZL;X=320;Y=175}/@_ITEM_zbhs.护身符减(护身符伤害数值)>                 <{S=设置数值;X=360;Y=173}/@@_ITEM_zbhs.InPutString10(请输入你的数值!!,护身符伤害数值)>\\\\
    <{I=$护身符等级$;F=装备图标.DATA;X=70;Y=200}/@_ITEM_zbhs.护身符勾选(护身符等级勾选)>  {S=护身符技能等级:${护身符等级数值};Y=199}                  <{S=设置数值;X=360;Y=197}/@@_ITEM_zbhs.InPutString10(请输入你的数值!!,护身符等级数值)>\\\\
    <{I=$护身符次数$;F=装备图标.DATA;X=70;Y=225}/@_ITEM_zbhs.护身符勾选(护身符次数勾选)>  {S=护身符技能次数:${护身符次数数值};Y=224}  <{M=212,212,213;F=Prguse.WZL;X=300;Y=224}/@_ITEM_zbhs.护身符加(护身符次数数值)>    <{M=214,214,215;F=Prguse.WZL;X=320;Y=224}/@_ITEM_zbhs.护身符减(护身符次数数值)>                  <{S=设置数值;X=360;Y=223}/@@_ITEM_zbhs.InPutString10(请输入你的数值!!,护身符次数数值)>\\\\
    <{I=$护身符速度$;F=装备图标.DATA;X=70;Y=250}/@_ITEM_zbhs.护身符勾选(护身符宝宝勾选)>  {S=护身符宝宝速度:${护身符宝宝数值};Y=249}                  <{S=设置数值;X=360;Y=248}/@@_ITEM_zbhs.InPutString10(请输入你的数值!!,护身符宝宝数值)>\\\\
    <{I=$护身符颜色保留$;F=装备图标.DATA;X=70;Y=275}/@_ITEM_zbhs.护身符勾选(护身符颜色保留)>  {S=颜色保留:${Player.V.颜色保留数值 + Player.V.颜色保留内容}以上;C=${Player.V.颜色保留显示};Y=274}  <{M=212,212,213;F=Prguse.WZL;X=220;Y=277}/@_ITEM_zbhs.护身符颜色加减(加)>    <{M=214,214,215;F=Prguse.WZL;X=240;Y=277}/@_ITEM_zbhs.护身符颜色加减(减)>   <{I=$至尊护身符保留$;F=装备图标.DATA;X=300;Y=275}/@_ITEM_zbhs.护身符勾选(至尊护身符保留)>  {S=至尊护身符保留;C=224;X=330;Y=275}\\\\
    <{I=$护身符回收$;F=装备图标.DATA;X=70;Y=300}/@_ITEM_zbhs.护身符勾选(护身符自动回收)>  {S=自动回收;C=31;Y=300}      <{I=$护身符本职勾选$;F=装备图标.DATA;X=300;Y=300}/@_ITEM_zbhs.护身符勾选(护身符本职勾选)>  {S=自动回收至尊;C=242;x=200;Y=300}      <{I=$自动至尊勾选$;F=装备图标.DATA;X=170;Y=300}/@_ITEM_zbhs.护身符勾选(自动至尊勾选)>  {S=只保留本职业;C=254;X=330;Y=300}\\
            <{S=按保留回收护身符;Y=330}/@_ITEM_zbhs.按保留回收护身符>                      <{S=回收背包;Y=330}{S=全部;c=249;Y=330}{S=护身符;Y=330}/@_ITEM_zbhs.回收背包全部护身符>
`
    let M = '';
    M = S;
    Player.V.护身符血量勾选 ? M = ReplaceStr(M, '$护身符血量$', '1') : M = ReplaceStr(M, '$护身符血量$', '0')
    Player.V.护身符防御勾选 ? M = ReplaceStr(M, '$护身符防御$', '1') : M = ReplaceStr(M, '$护身符防御$', '0')
    Player.V.护身符攻击勾选 ? M = ReplaceStr(M, '$护身符攻击$', '1') : M = ReplaceStr(M, '$护身符攻击$', '0')
    Player.V.护身符伤害勾选 ? M = ReplaceStr(M, '$护身符伤害$', '1') : M = ReplaceStr(M, '$护身符伤害$', '0')
    Player.V.护身符等级勾选 ? M = ReplaceStr(M, '$护身符等级$', '1') : M = ReplaceStr(M, '$护身符等级$', '0')
    Player.V.护身符次数勾选 ? M = ReplaceStr(M, '$护身符次数$', '1') : M = ReplaceStr(M, '$护身符次数$', '0')
    Player.V.护身符宝宝勾选 ? M = ReplaceStr(M, '$护身符速度$', '1') : M = ReplaceStr(M, '$护身符速度$', '0')
    Player.V.护身符自动回收 ? M = ReplaceStr(M, '$护身符回收$', '1') : M = ReplaceStr(M, '$护身符回收$', '0')
    Player.V.护身符本职勾选 ? M = ReplaceStr(M, '$护身符本职$', '1') : M = ReplaceStr(M, '$护身符本职$', '0')
    Player.V.护身符颜色保留 ? M = ReplaceStr(M, '$护身符颜色保留$', '1') : M = ReplaceStr(M, '$护身符颜色保留$', '0')
    Player.V.至尊护身符保留 ? M = ReplaceStr(M, '$至尊护身符保留$', '1') : M = ReplaceStr(M, '$至尊护身符保留$', '0')
    Player.V.护身符本职勾选 ? M = ReplaceStr(M, '$护身符本职勾选$', '1') : M = ReplaceStr(M, '$护身符本职勾选$', '0')
    Player.V.自动至尊勾选 ? M = ReplaceStr(M, '$自动至尊勾选$', '1') : M = ReplaceStr(M, '$自动至尊勾选$', '0')
    Npc.SayEx(Player, 'npc中大窗口新', M)
}

export function 护身符颜色加减(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 加减 = Args.Str[0]
    if (加减 == '加') {
        Player.V.颜色保留数值 = Player.V.颜色保留数值 + 1
        if (Player.V.颜色保留数值 > 7) {
            Player.V.颜色保留数值 = 7
        }
    }
    if (加减 == '减') {
        Player.V.颜色保留数值 = Player.V.颜色保留数值 - 1
        if (Player.V.颜色保留数值 < 0) {
            Player.V.颜色保留数值 = 0
        }
    }
    switch (Player.V.颜色保留数值) {
        case 0: Player.V.颜色保留内容 = '白色'; Player.V.颜色保留显示 = 255; break
        case 1: Player.V.颜色保留内容 = '浅蓝'; Player.V.颜色保留显示 = 254; break
        case 2: Player.V.颜色保留内容 = '绿色'; Player.V.颜色保留显示 = 224; break
        case 3: Player.V.颜色保留内容 = '浅红'; Player.V.颜色保留显示 = 191; break
        case 4: Player.V.颜色保留内容 = '橙色'; Player.V.颜色保留显示 = 243; break
        case 5: Player.V.颜色保留内容 = '紫色'; Player.V.颜色保留显示 = 241; break
        case 6: Player.V.颜色保留内容 = '大红'; Player.V.颜色保留显示 = 249; break
        case 7: Player.V.颜色保留内容 = '粉色'; Player.V.颜色保留显示 = 253; break
    }

    护身符回收(Npc, Player, Args)
}


export function 按保留回收护身符(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let item: TUserItem;
    let 倍数 = 0
    let 数量 = 0
    let 金币数量 = 0
    let 生命 = '', 攻击 = '', 防御 = '', 魔法 = '', 道术 = '', 射术 = '', 刺术 = '', 武术 = '', 基础伤害 = '', 宠物速度 = '', 攻击次数 = '', 技能等级 = ''
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        生命 = '', 攻击 = '', 防御 = '', 魔法 = '', 道术 = '', 射术 = '', 刺术 = '', 武术 = '', 基础伤害 = '', 宠物速度 = '', 攻击次数 = '', 技能等级 = ''
        item = Player.GetBagItem(I);
        if (Player.V.至尊护身符保留 && item.Name.includes('至尊护身符')) { continue }
        if (item.Name.includes('护身符') && item.GetState().GetBind() == false) {
            if (Player.V.护身符颜色保留 && Player.V.颜色保留显示 == item.Color) { continue }


            for (let i = 1; i <= 40; i++) {
                if (item.GetOutWay1(i) >= 21 && item.GetOutWay1(i) <= 153) {
                    技能等级 = String(item.GetOutWay2(i))
                    if (Player.V.护身符等级勾选 && Number(String(技能等级)) > Number(String(Player.V.护身符等级数值))) {
                        break
                    }
                }
                if (item.GetOutWay1(i) >= 320 && item.GetOutWay1(i) <= 330) {
                    宠物速度 = String(item.GetOutWay2(i))
                    if (Player.V.护身符宝宝勾选 && Number(宠物速度) > Number(Player.V.护身符宝宝数值)) {
                        break
                    }
                }
            }

            if (item.GetCustomDesc() != ``) {
                let 装备字符串 = JSON.parse(item.GetCustomDesc())
                if (装备字符串.职业属性_职业) {
                    let 装备属性条数 = 装备字符串.职业属性_职业.length
                    for (let e = 0; e <= 装备属性条数 - 1; e++) {
                        switch (Number(装备字符串.职业属性_职业[e])) {
                            case 0: 生命 = 装备字符串.职业属性_属性[e]; break;
                            case 1: 防御 = 装备字符串.职业属性_属性[e]; break;
                            case 2: 攻击 = 装备字符串.职业属性_属性[e]; break;
                            case 3: 魔法 = 装备字符串.职业属性_属性[e]; break;
                            case 4: 道术 = 装备字符串.职业属性_属性[e]; break;
                            case 5: 刺术 = 装备字符串.职业属性_属性[e]; break;
                            case 6: 射术 = 装备字符串.职业属性_属性[e]; break;
                            case 7: 武术 = 装备字符串.职业属性_属性[e]; break;
                            case 160: case 161: case 162: case 163: case 164: case 165: case 166: case 167: case 168: case 169:
                            case 170: case 171: case 172: case 173: case 174: case 175: case 176: case 177: case 178: case 179:
                            case 180: case 181: case 182: case 183: case 184: case 185: case 186: case 187: case 188: case 189:
                            case 190: case 191: case 192: case 193: case 194: case 195: case 196: case 197: case 198: case 199:
                            case 200: case 201: case 202: case 203: case 204: case 205: case 206: case 207: case 208: case 209:
                            case 210: case 211: case 212: case 213: case 214: case 215: case 216: case 217: case 218: case 219:
                            case 220: case 221: case 222: case 223: case 224: case 225:
                                基础伤害 = 装备字符串.职业属性_属性[e]; break
                            case 240: case 241: case 242: case 243: case 244: case 245: case 246: case 247: case 248: case 249:
                            case 250: case 251: case 252: case 253: case 254: case 255: case 256: case 257: case 258: case 259:
                            case 260: case 261: case 262: case 263: case 264: case 265: case 266: case 267: case 268: case 269:
                            case 270: case 271: case 272: case 273: case 274: case 275: case 276: case 277: case 278: case 279:
                            case 280: case 281: case 282: case 283: case 284: case 285: case 286: case 287: case 288: case 289:
                            case 290: case 291: case 292: case 293: case 294: case 295: case 296: case 297: case 298: case 299:
                            case 300: case 301: case 302: case 303: case 304: case 305:
                                攻击次数 = 装备字符串.职业属性_属性[e]; break
                            default: break;
                        }
                    }
                }
            }
            if (Player.V.护身符血量勾选 && Number(生命) > Number(Player.V.护身符血量数值)) { continue }
            if (Player.V.护身符防御勾选 && Number(防御) > Number(Player.V.护身符防御数值)) { continue }
            if (Player.V.护身符攻击勾选 && Number(攻击) > Number(Player.V.护身符攻击数值)) { continue }
            if (Player.V.护身符攻击勾选 && Number(魔法) > Number(Player.V.护身符魔法数值)) { continue }
            if (Player.V.护身符攻击勾选 && Number(道术) > Number(Player.V.护身符道术数值)) { continue }
            if (Player.V.护身符攻击勾选 && Number(刺术) > Number(Player.V.护身符刺术数值)) { continue }
            if (Player.V.护身符攻击勾选 && Number(射术) > Number(Player.V.护身符射术数值)) { continue }
            if (Player.V.护身符攻击勾选 && Number(武术) > Number(Player.V.护身符武术数值)) { continue }
            if (Player.V.护身符伤害勾选 && Number(基础伤害) > Number(Player.V.护身符伤害数值)) { continue }
            if (Player.V.护身符次数勾选 && Number(攻击次数) > Number(Player.V.护身符次数数值)) { continue }

            金币数量 += 10
            Player.DeleteItem(item)
        }
    }
    if (金币数量 > 0) {
        Player.SetGold(Player.GetGold() + 金币数量 + 金币数量 * Player.R.回收加成)
    }
    Player.GoldChanged()
}


export function 回收背包全部护身符(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let item: TUserItem;
    let 倍数 = 0
    let 数量 = 0
    let 金币数量 = 0
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        item = Player.GetBagItem(I);
        if (item.Name.includes('护身符') && item.GetState().GetBind() == false) {
            数量++
            金币数量 += 10
            Player.DeleteItem(item)
        }
    }
    if (金币数量 > 0) {
        Player.SetGold(Player.GetGold() + 金币数量 + 金币数量 * Player.R.回收加成)
    }
    Player.GoldChanged()
}


export function 按保留回收技能石(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let item: TUserItem;
    let 倍数 = 0
    let 数量 = 0
    let 金币数量 = 0
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        item = Player.GetBagItem(I);
        if (item.StdMode == 68 && item.GetState().GetBind() == false) {
            if ((Player.V.技能石1技能勾选 && item.Name.includes(Player.V.技能石1技能)) || (Player.V.技能石2技能勾选 && item.Name.includes(Player.V.技能石2技能)) || (Player.V.技能石3技能勾选 && item.Name.includes(Player.V.技能石3技能)) ||
                (Player.V.技能石4技能勾选 && item.Name.includes(Player.V.技能石4技能)) || (Player.V.技能石5技能勾选 && item.Name.includes(Player.V.技能石5技能))) {
                continue
            }
            if (Player.V.保留全部技能石 && item.GetOutWay2(2) > Player.V.技能石阶数保留) {
                continue
            }

            数量++
            金币数量 += 10
            Player.DeleteItem(item)
        }
    }
    if (金币数量 > 0) {
        Player.SetGold(Player.GetGold() + 金币数量 + 金币数量 * Player.R.回收加成)
    }
    Player.GoldChanged()
}

export function 回收背包全部技能石(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let item: TUserItem;
    let 倍数 = 0
    let 数量 = 0
    let 金币数量 = 0
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        item = Player.GetBagItem(I);
        if (item.StdMode == 68 && item.GetState().GetBind() == false) {
            数量++
            金币数量 += 10
            Player.DeleteItem(item)
        }
    }
    if (金币数量 > 0) {
        Player.SetGold(Player.GetGold() + 金币数量 + 金币数量 * Player.R.回收加成)
    }
    Player.GoldChanged()
}
export function 选择职业(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
        <圣骑士/@_ITEM_zbhs.职业选择(圣骑士)>       <十字军/@_ITEM_zbhs.职业选择(十字军)>       <毁灭者/@_ITEM_zbhs.职业选择(毁灭者)>       <鬼剑士/@_ITEM_zbhs.职业选择(鬼剑士)>\\\\
        <幻影之刃/@_ITEM_zbhs.职业选择(幻影之刃)>     <终结者/@_ITEM_zbhs.职业选择(终结者)>       <暗之使徒/@_ITEM_zbhs.职业选择(暗之使徒)>     <阴影之王/@_ITEM_zbhs.职业选择(阴影之王)>\\\\
        <金刚罗汉/@_ITEM_zbhs.职业选择(金刚罗汉)>     <神圣使者/@_ITEM_zbhs.职业选择(神圣使者)>     <审判者/@_ITEM_zbhs.职业选择(审判者)>       <血修罗/@_ITEM_zbhs.职业选择(血修罗)>\\\\
        <契约师/@_ITEM_zbhs.职业选择(契约师)>       <元素师/@_ITEM_zbhs.职业选择(元素师)>       <秘术师/@_ITEM_zbhs.职业选择(秘术师)>       <死灵法师/@_ITEM_zbhs.职业选择(死灵法师)> \\\\
        <噬魂者/@_ITEM_zbhs.职业选择(噬魂者)>       <驭兽者/@_ITEM_zbhs.职业选择(驭兽者)>       <巫毒萨满/@_ITEM_zbhs.职业选择(巫毒萨满)>     <牧师/@_ITEM_zbhs.职业选择(牧师)> \\\\
        <神射手/@_ITEM_zbhs.职业选择(神射手)>       <丛林猎手/@_ITEM_zbhs.职业选择(丛林猎手)>     <风行者/@_ITEM_zbhs.职业选择(风行者)>       <镜像游侠/@_ITEM_zbhs.职业选择(镜像游侠)>  \\ 
    `
    Npc.SayEx(Player, 'NPC小窗口', S)
}
export function 职业选择(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.技能石1技能勾选 = false
    Player.V.技能石2技能勾选 = false
    Player.V.技能石3技能勾选 = false
    Player.V.技能石4技能勾选 = false
    Player.V.技能石5技能勾选 = false
    Player.V.技能石1技能 = ''
    Player.V.技能石2技能 = ''
    Player.V.技能石3技能 = ''
    Player.V.技能石4技能 = ''
    Player.V.技能石5技能 = ''
    let 职业 = Args.Str[0]
    Player.V.回收职业选择 = 职业
    技能石回收(Npc, Player, Args)
}

export function 技能石勾选(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 种类 = Args.Str[0]
    // if (种类 == '本职勾选' && Player.V.充值积分 < 1000) { Player.MessageBox('你的充值不足 1000 无法开启'); return }
    Player.V[种类] ? Player.V[种类] = false : Player.V[种类] = true
    技能石回收(Npc, Player, Args)
}

export function 技能石选择勾选(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 变量 = Args.Str[0]
    let 技能 = Args.Str[1]
    Player.V[变量] = 技能
    Player.V[变量 + '勾选'] ? Player.V[变量 + '勾选'] = false : Player.V[变量 + '勾选'] = true
    技能石回收(Npc, Player, Args)
}

export function 等级加减(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 加减 = Args.Str[0]
    if (加减 == '加') {
        if (Player.V.技能石阶数保留 >= 5) {
            Player.V.技能石阶数保留 = 5
        } else {
            Player.V.技能石阶数保留 = Player.V.技能石阶数保留 + 1
        }
    } else if (加减 == '减') {
        if (Player.V.技能石阶数保留 <= 0) {
            Player.V.技能石阶数保留 = 0
        } else {
            Player.V.技能石阶数保留 = Player.V.技能石阶数保留 - 1
        }
    }
    技能石回收(Npc, Player, Args)
}

export function 护身符勾选(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 种类 = Args.Str[0]
    let 说明 = ``
    switch (Player.Job) {
        case 0: 说明 = `你是战士类职业,回收的护身符属性只会保留攻击属性!`; break
        case 1: 说明 = `你是法师类职业,回收的护身符属性只会保留魔法属性!`; break
        case 2: 说明 = `你是道士类职业,回收的护身符属性只会保留道术属性!`; break
        case 3: 说明 = `你是刺客类职业,回收的护身符属性只会保留刺术属性!`; break
        case 4: 说明 = `你是射手雷职业,回收的护身符属性只会保留射术属性!`; break
        case 5: 说明 = `你是武僧类职业,回收的护身符属性只会保留武术属性!`; break
    }
    if (种类 == `自动至尊勾选` && Player.V.充值积分 < 100000) { Player.MessageBox(`充值积分低于10万无法选择!`);return}
    Player.V[种类] ? Player.V[种类] = false : Player.V[种类] = true





    if (种类 == `护身符本职勾选` && Player.V.护身符本职勾选) {
        Player.MessageBox(`勾选了本职业回收\\\\${说明}`)
    }
    护身符回收(Npc, Player, Args)
}

export function 护身符加(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 种类 = Args.Str[0]
    Player.V[种类] = 智能计算((Player.V[种类]),'10000', 3)    
    护身符回收(Npc, Player, Args)
}
export function 护身符减(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 种类 = Args.Str[0]
    Player.V[种类] = 智能计算((Player.V[种类]),'10000', 4)  
    护身符回收(Npc, Player, Args)
}

export function InPutString10(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 数值 = Args.Str[1]
    let 词条 = Args.Str[0]
    Player.V[词条] = 数值
    护身符回收(Npc, Player, Args)
}




export function 勾选(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 种类 = Args.Str[0]
    let 说明 = ``
    // if (种类 == '本职勾选' && Player.V.充值积分 < 1000) { Player.MessageBox('你的充值不足 1000 无法开启'); return }
    Player.V[种类] ? Player.V[种类] = false : Player.V[种类] = true
    switch (Player.Job) {
        case 0: 说明 = `你是战士类职业,回收的装备属性只会保留攻击属性!`; break
        case 1: 说明 = `你是法师类职业,回收的装备属性只会保留魔法属性!`; break
        case 2: 说明 = `你是道士类职业,回收的装备属性只会保留道术属性!`; break
        case 3: 说明 = `你是刺客类职业,回收的装备属性只会保留刺术属性!`; break
        case 4: 说明 = `你是射手雷职业,回收的装备属性只会保留射术属性!`; break
        case 5: 说明 = `你是武僧类职业,回收的装备属性只会保留武术属性!`; break
    }
    if (种类 == `本职勾选` && Player.V.本职勾选) {
        Player.MessageBox(`勾选了本职业回收\\\\不是你所在职业的武器和衣服将被回收\\\\${说明}`)
    }
    准备回收(Npc, Player)
}

export function 加(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 种类 = Args.Str[0]
    // Player.V[种类] = new BigNumber(Player.V[种类]).multipliedBy('10000').toFixed(0)
    Player.V[种类] = 智能计算((Player.V[种类]) , '10000', 3)
    准备回收(Npc, Player)
}
export function 减(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 种类 = Args.Str[0]
    Player.V[种类] = 智能计算((Player.V[种类]) , '10000', 4)
    准备回收(Npc, Player)
}

export function InPutString1(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 数值 = Args.Str[1]
    let 词条 = Args.Str[0]
    Player.V[词条] = 数值
    准备回收(Npc, Player)
}

const 装备类型 = [4, 5, 6, 10, 11, 15, 19, 20, 21, 22, 23, 24, 26, 27, 28, 68]
export function 全部回收(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let item: TUserItem;
    let 倍数 = 0
    let 数量 = 0
    let 金币数量 = 0
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        item = Player.GetBagItem(I);
        if (装备类型.includes(item.StdMode) && item.GetState().GetBind() == false && item.StdMode != 68 && !item.Name.includes('护身符')) {
            数量++
            金币数量 += 10
            Player.DeleteItem(item)
        }
    }
    if (金币数量 > 0) {
        Player.SetGold(Player.GetGold() + 金币数量 + 金币数量 * Player.R.回收加成)
    }
    Player.GoldChanged()
}