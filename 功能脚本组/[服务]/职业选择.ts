import { 实时回血, 数字转单位2, 数字转单位3 } from "../../大数值版本/字符计算"
import { 装备属性统计 } from "../../大数值版本/装备属性统计"
import { 特效 } from "../[玩家]/_P_Base"
import { 职业词条 } from "./延时跳转"

const 战神骑士 = `\\\\\\
                            职业分支:战神                                                                      职业分支:骑士\\\\
          {S=狂怒:[被动]10%几率造成200%伤害,每级增加20%伤害;C=250}                                {S=圣光打击:[被动]攻击目标时20%的几率对3格范围敌人造成100%伤害,每级增加20%;C=250}\\\\
          {S=召唤战神:[主动]使用技能召唤战神,可在庄园对战神进行强化,;C=254}                       {S=愤怒:[被动]受到伤害时反击自身100%攻击给目标,每级增加20%伤害;C=254}\\
          {S=战神继承攻击100%,每级+5%;C=254}\\
          {S=战神附体:[被动]每级增加5%生命值;C=251}                                               {S=防御姿态:[被动]每级提升15%防御;C=251}\\\\
          {S=天神附体:[被动]受到的伤害减少20%,每3级增加1%;C=154}                                  {S=惩罚:[被动]被攻击时有5%几率冰冻敌方1秒,每2级提升1%;C=154}\\\\
          {S=万剑归宗:[主动]对周围5格敌人造成300%伤害,麻痹3秒;C=253}                              {S=审判救赎:[主动]对5格范围目标每秒造成200%伤害,持续3秒;C=253}\\
          {S=每级增加40%伤害.CD10秒;C=253}                                                        {S=每级提升40%伤害.CD10秒;C=253}\\\\\\
                             <选择职业/@职业选择.职业选择(1,战神,0)>                                                                            <选择职业/@职业选择.职业选择(2,骑士,0)>`
const 冰法火法 = `\\\\\\
                            职业分支:火神                                                                      职业分支:冰法\\\\
          {S=法术奥义:[被动]每级增加3%魔法;C=250}                                                 {S=暴风雨:[主动]对目标3格敌人造成100%伤害,15%几率冰冻1秒,每级提升20%伤害;C=250}\\\\
          {S=闪现:[主动]在屏幕中5格距离任意传送.CD5秒;C=254}                                      {S=魔法盾:[主动]开启后可吸收部分伤害;C=254}\\\\
          {S=致命一击:[被动]每级增加0.01倍攻;C=251}                                               {S=冰霜之环:[被动]每3秒对3格敌人造成100%伤害,冰冻1秒,每级提升20%伤害;C=251}\\\\
          {S=火墙之术:[被动]目标受到伤害后脚下会释放一个火墙,造成100%伤害,每级增加20%;C=154}      {S=打击符文:[被动]每级增加4%伤害;C=154}\\\\
          {S=群星火雨:[主动]释放技能对目标造成100%伤害,每级增加20%;C=253}                         {S=寒冬领域:[主动]对5格范围内目标造成300%伤害,并且冰冻4秒;C=253}\\
                                                                                        {S=每级提升40%伤害.CD15秒;C=253}\\\\\\
                             <选择职业/@职业选择.职业选择(3,火神,1)>                                                                            <选择职业/@职业选择.职业选择(4,冰法,1)>`
const 驯兽牧师 = `\\\\\\
                             职业分支:驯兽师                                                                     职业分支:牧师\\\\
          {S=萌萌浣熊:[主动]召唤一只浣熊,继承攻击100%,每级+5%;C=250}                              {S=剧毒火海:[主动]对目标3格范围敌人造成100%伤害并且中毒,每级增加20%;C=250}\\\\
          {S=凶猛野兽:[被动]每级增加宠物10%攻击和血量;C=254}                                      {S=妙手回春:[主动]使用技能,让附近5格队友回血,恢复为道术的2倍,每级加20%;C=254} \\\\
          {S=嗜血狼人:[主动]召唤一个嗜血狼人远程攻击,攻击目标时给人物回血;C=251}                  {S=互相伤害:[被动]受到伤害对5格范围敌人造成50%伤害,每级加20%;C=251}\\
          {S=继承攻击100%.每级加5%;C=251}\\
                                                                                        {S=恶魔附体:[被动]每级增加5%道术;C=154}\\
          {S=丛林虎王:[主动]召唤一只老虎,老虎存在时人物的暴击提高20%;C=154}\\
          {S=继承攻击200%.每级加10%;C=154}                                                        {S=末日降临:[主动]对5格范围敌人造成300%伤害,麻痹1秒,每级加40%,CD10秒;C=253}\\\\
          {S=雷暴之怒:[主动]使用技能后,宠物攻击时附带群体雷电术,持续40秒,CD60秒;C=253}\\\\
                             <选择职业/@职业选择.职业选择(5,驯兽师,2)>                                                                            <选择职业/@职业选择.职业选择(6,牧师,2)>`
const 刺客鬼舞者 = `\\\\\\
                            职业分支:刺客                                                                      职业分支:鬼舞者\\\\
          {S=潜行:[主动]可以对人和怪物隐身,隐身时无法使用技能和道具,获得2点暗影值,CD5秒;C=250}       {S=鬼舞斩:[被动]对周围2格敌人造成100%伤害,每级提升20%;C=250}\\\\
          {S=弱点:[主动]消耗1点暗影值,释放技能对自身4格范围敌人造成200%伤害,每级增加20%;C=254}       {S=鬼舞术:[被动]每过5秒钟攻击时对目标造成3次伤害,每次伤害为50%,每级增加30%;C=254} \\\\
          {S=致命打击:[被动]攻击有10%几率获得1点暗影值,每级加1%几率,每级加2%暴击伤害;C=251}          {S=鬼舞之殇:[被动]攻击目标有10%几率恢复自身5%血量,每级提升1%;C=251}\\\\
          {S=增伤:[主动]消耗1点暗影值,增加暴击几率10%,每级加1%,持续110秒,CD120秒;C=154}              {S=鬼舞者:[被动]每级增加5%刺术;C=154}\\\\\\
          {S=暗影杀阵:[主动]闪现到目标处并对目标5格敌人造成500%伤害,每级增加40%,CD10秒;C=253}        {S=群魔乱舞:[被动]每3秒对自身3格范围敌人造成300%伤害,每级增加20%;C=253}\\\\\\
                             <选择职业/@职业选择.职业选择(7,刺客,3)>                                                                            <选择职业/@职业选择.职业选择(8,鬼舞者,3)>`

const 神射手猎人 = `\\\\\\
                            职业分支:神射手                                                                      职业分支:猎人\\\\
          {S=复仇:[被动]每第三次攻击对目标造成200%伤害,每级增加20%;C=250}                      {S=分裂箭:[被动]对目标3格范围敌人造成100%伤害,每级增加20%;C=250}\\\\
          {S=成长:[被动]每级增加5%射术;C=254}                                                  {S=召唤宠物:[主动]召唤一只宠物,继承人物射术100%攻击,每级增加+5%;C=254}\\\\
          {S=生存:[被动][被动]击杀目标后恢复自身10%血量,每6级增加2%;C=251}                      {S=宠物突变:[主动]将你的宠物变成远程群攻,伤害和生命提高100%,持续30秒,CD60秒;C=251}\\\\
          {S=万箭齐发:[主动]对目标3格敌人造成100%伤害,每级增加20%;C=154}                       {S=人宠合一:[被动]你和你的宠物击杀目标都会使你和你的宠物恢复1%血量,每6级增加1%;C=154}\\\\
          {S=神灵救赎:[主动]对目标5格范围敌人造成400%伤害,并且冰冻2秒;C=253}                   {S=命运刹印:[主动]对5格范围敌人造成500%伤害,每级增加40%,CD10秒;C=253}\\
          {S=每级增加40%,CD10秒;C=253}\\\\\\
                             <选择职业/@职业选择.职业选择(9,神射手,4)>                                                                            <选择职业/@职业选择.职业选择(10,猎人,4)>`
const 武僧罗汉 = `\\\\\\
                            职业分支:武僧                                                                      职业分支:罗汉\\\\
          {S=天雷阵:[被动]每秒对自身3格范围敌人造成100%伤害,每级增加20%;C=250}                 {S=金刚护法:[被动]攻击时7%几率对目标5格范围敌人造成100%伤害,每级提升20%;C=250}\\\\
          {S=护法灭魔:[被动]每级增加5%武术;C=254}                                              {S=转生:[被动]消耗书页进行转生,每转+0.02倍攻,每重技能再加0.02倍攻;C=254}\\\\
          {S=至高武术:[主动]对自身3格范围敌人麻痹2秒,每10级提升1秒,CD12秒;C=251}               {S=金刚护体:[主动]释放后增加5%伤害,持续40秒,每级+5%,CD60秒;C=251}\\\\
          {S=体质强化:[被动]每2秒回复自身2%血量,每8级增加1%;C=154}                             {S=擒龙功:[主动]将目标抓到自己身边并且冰冻2秒,每10级增加1秒冰冻时间,CD15秒;C=154}\\\\
          {S=碎石破空:[主动]对自身5格范围敌人造成500%伤害,每级增加40%,CD10秒;C=253}            {S=轮回之道:[主动]召唤一只转生兽,转生次数越高,召唤兽越牛B;C=253}\\
                                                                                     {S=继承人物200%武术,每级+10%;C=253} \\\\\\
                             <选择职业/@职业选择.职业选择(11,武僧,5)>                                                                            <选择职业/@职业选择.职业选择(12,罗汉,5)>`
export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\\\\\\
                                战士                                法师                                道士\\
                             <{I=21;F=职业图标.DATA}/@职业选择.Main(1)>                         <{I=157;F=职业图标.DATA}/@职业选择.Main(2)>                         <{I=396;F=职业图标.DATA}/@职业选择.Main(3)>\\\\
                                刺客                               弓箭手                               武僧\\
                             <{I=5;F=职业图标.DATA}/@职业选择.Main(4)>                         <{I=183;F=职业图标.DATA}/@职业选择.Main(5)>                         <{I=305;F=职业图标.DATA}/@职业选择.Main(6)>\\\\
                           $职业$
    `
    let M = S

    switch (true) {
        case Args.Int[0] == 1: M = ReplaceStr(M, '$职业$', `${战神骑士}`); break
        case Args.Int[0] == 2: M = ReplaceStr(M, '$职业$', `${冰法火法}`); break
        case Args.Int[0] == 3: M = ReplaceStr(M, '$职业$', `${驯兽牧师}`); break
        case Args.Int[0] == 4: M = ReplaceStr(M, '$职业$', `${刺客鬼舞者}`); break
        case Args.Int[0] == 5: M = ReplaceStr(M, '$职业$', `${神射手猎人}`); break
        case Args.Int[0] == 6: M = ReplaceStr(M, '$职业$', `${武僧罗汉}`); break
        default: M = ReplaceStr(M, '$职业$', ``); break
    }
    Npc.SayEx(Player, '职业选择', M)

}



export function 职业选择(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.战神 || Player.V.骑士 || Player.V.火神 || Player.V.冰法 || Player.V.驯兽师 || Player.V.牧师 ||
        Player.V.刺客 || Player.V.鬼舞者 || Player.V.神射手 || Player.V.猎人 || Player.V.武僧 || Player.V.罗汉) { Player.MessageBox('你已经选择过职业了!'); return }
    Player.ClearSkill()
    let item: TUserItem
    let 武器名字 = ''
    Player.AddSkill('心灵召唤');
    Player.AddSkill('查看属性');
    Player.AddSkill('嘲讽吸怪');
    switch (Args.Int[0]) {
        case 1:
            Player.AddSkill('基本剑术', 3);
            Player.AddSkill('攻杀剑术', 3);
            Player.AddSkill('刺杀剑术', 3);
            Player.AddSkill('狂怒');
            Player.AddSkill('战神附体');
            Player.SetJob(0)
            Player.V.战神 = true
            武器名字 = '乌木剑'
            break
        case 2:
            Player.AddSkill('基本剑术', 3);
            Player.AddSkill('攻杀剑术', 3);
            Player.AddSkill('刺杀剑术', 3);
            Player.AddSkill('圣光打击');
            Player.AddSkill('防御姿态');
            Player.SetJob(0)
            Player.V.骑士 = true
            武器名字 = '乌木剑'
            break
        case 3:
            Player.AddSkill('雷电术', 3);
            Player.AddSkill('冰咆哮', 3);
            Player.AddSkill('法术奥义');
            Player.AddSkill('闪现');
            Player.SetJob(1)
            Player.V.火神 = true
            武器名字 = '乌木剑'
            break
        case 4:
            Player.AddSkill('雷电术', 3);
            Player.AddSkill('冰咆哮', 3);
            Player.AddSkill('暴风雨');
            Player.AddSkill('打击符文');
            Player.SetJob(1)
            Player.V.冰法 = true
            武器名字 = '乌木剑'
            break
        case 5:
            Player.AddSkill('精神力战法', 3);
            Player.AddSkill('灵魂火符', 3);
            Player.AddSkill('施毒术', 3);
            Player.AddSkill('隐身术', 3);
            Player.AddSkill('飓风破', 3);
            Player.AddSkill('萌萌浣熊');
            Player.AddSkill('凶猛野兽');
            Player.SetJob(2)
            Player.V.驯兽师 = true
            武器名字 = '乌木剑'
            break
        case 6:
            Player.AddSkill('精神力战法', 3);
            Player.AddSkill('灵魂火符', 3);
            Player.AddSkill('施毒术', 3);
            Player.AddSkill('隐身术', 3);
            Player.AddSkill('飓风破', 3);
            Player.AddSkill('剧毒火海');
            Player.AddSkill('妙手回春');
            Player.SetJob(2)
            Player.V.牧师 = true
            武器名字 = '乌木剑'
            break
        case 7:
            Player.AddSkill('精准术', 3);
            Player.AddSkill('霜月X', 3);
            Player.AddSkill('潜行', 3);
            Player.AddSkill('弱点');
            Player.SetJob(3)
            Player.V.刺客 = true
            武器名字 = '青铜匕首'
            break
        case 8:
            Player.AddSkill('精准术', 3);
            Player.AddSkill('霜月X', 3);
            Player.AddSkill('鬼舞斩');
            Player.AddSkill('鬼舞者');
            Player.SetJob(3)
            Player.V.鬼舞者 = true
            武器名字 = '青铜匕首'
            break
        case 9:
            Player.AddSkill('精准箭术', 3);
            Player.AddSkill('天罡震气', 3);
            Player.AddSkill('成长');
            Player.AddSkill('万箭齐发');
            Player.SetJob(4)
            Player.V.神射手 = true
            武器名字 = '劣质的木弓'
            break
        case 10:
            Player.AddSkill('精准箭术', 3);
            Player.AddSkill('天罡震气', 3);
            Player.AddSkill('分裂箭');
            Player.AddSkill('召唤宠物');
            Player.SetJob(4)
            Player.V.猎人 = true
            武器名字 = '劣质的木弓'
            break
        case 11:
            Player.AddSkill('罗汉棍法', 3);
            Player.AddSkill('达摩棍法', 3);
            Player.AddSkill('天雷阵');
            Player.AddSkill('护法灭魔');
            Player.SetJob(5)
            Player.V.武僧 = true
            Player.ShowEffectEx2(特效.武僧天雷阵, -10, 20, true, 99999)
            武器名字 = '盘龙棍'
            break
        case 12:
            Player.AddSkill('罗汉棍法', 3);
            Player.AddSkill('达摩棍法', 3);
            Player.AddSkill('金刚护法');
            Player.AddSkill('转生');
            Player.SetJob(5)
            Player.V.罗汉 = true
            武器名字 = '盘龙棍'
            break
    }

    Player.V.第一次选择职业 ??= true

    if(Player.V.第一次选择职业 == true){
        item = Player.GiveItem(武器名字)
        if (item) {
            let 基本属性_职业 = []
            let 基本属性_数值 = []
            let 装备属性记录 = {
                职业属性_职业: 基本属性_职业,
                职业属性_属性: 基本属性_数值,
            }
            let 装备属性 = `12000`
            let 前端数字 = 数字转单位2(装备属性)
            let 后端单位 = 数字转单位3(装备属性)
            item.SetOutWay1(0, 19)
            item.SetOutWay2(0, 1)
            for (let a = 0; a < 6; a++) {
                item.SetOutWay1(2 + a, 33+a)
                item.SetOutWay2(2 + a, Number(前端数字))
                item.SetOutWay3(2 + a, Number(后端单位))
                基本属性_职业.push(33 + a)
                基本属性_数值.push(装备属性)
    
            }
            item.SetCustomDesc(JSON.stringify(装备属性记录))
            item.Rename(`新手${item.GetName()}[破碎]`)
            Player.UpdateItem(item)
        }
        item = Player.GiveItem('新手盾牌')
        if (item) {
            item.SetBind(true)
            item.SetNeverDrop(true)
            item.State.SetNoDrop(true)
            Player.UpdateItem(item)
        }
        if (Player.GetGender() == 0) {
            item = Player.GiveItem('布衣(男)')
            if (item) {
                let 基本属性_职业 = []
                let 基本属性_数值 = []
                let 装备属性记录 = {
                    职业属性_职业: 基本属性_职业,
                    职业属性_属性: 基本属性_数值,
                }
                let 装备属性 = `12000`
                let 前端数字 = 数字转单位2(装备属性)
                let 后端单位 = 数字转单位3(装备属性)
                item.SetOutWay1(0, 19)
                item.SetOutWay2(0, 1)
                for (let a = 0; a < 2; a++) {
                    item.SetOutWay1(2 + a, 31+a)
                    item.SetOutWay2(2 + a, Number(前端数字))
                    item.SetOutWay3(2 + a, Number(后端单位))
                    基本属性_职业.push(31 + a)
                    基本属性_数值.push(装备属性)
        
                }
                item.SetCustomDesc(JSON.stringify(装备属性记录))
                item.Rename(`新手${item.GetName()}`)
                Player.UpdateItem(item)
            }
        } else {
            item = Player.GiveItem('布衣(女)')
            if (item) {
                let 基本属性_职业 = []
                let 基本属性_数值 = []
                let 装备属性记录 = {
                    职业属性_职业: 基本属性_职业,
                    职业属性_属性: 基本属性_数值,
                }
                let 装备属性 = `12000`
                let 前端数字 = 数字转单位2(装备属性)
                let 后端单位 = 数字转单位3(装备属性)
                item.SetOutWay1(0, 19)
                item.SetOutWay2(0, 1)
                for (let a = 0; a < 2; a++) {
                    item.SetOutWay1(2 + a, 31+a)
                    item.SetOutWay2(2 + a, Number(前端数字))
                    item.SetOutWay3(2 + a, Number(后端单位))
                    基本属性_职业.push(31 + a)
                    基本属性_数值.push(装备属性)
        
                }
                item.SetCustomDesc(JSON.stringify(装备属性记录))
                item.Rename(`新手${item.GetName()}`)
                Player.UpdateItem(item)
            }
        }
        Player.V.第一次选择职业 = false
        Npc.Give(Player, '回城石')
        Npc.Give(Player, '随机传送石')
        Player.SetGold(Player.GetGold() + 100000)
        Player.GoldChanged()
    }
    Player.CloseWindow('职业选择')
    Player.RecalcAbilitys()
    装备属性统计(Player,undefined,undefined,undefined);

}
export function 种族选择(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.战神 == false && Player.V.骑士 == false && Player.V.火神 == false && Player.V.冰法 == false && Player.V.驯兽师 == false && Player.V.牧师 == false &&
        Player.V.刺客 == false && Player.V.鬼舞者 == false && Player.V.神射手 == false && Player.V.猎人 == false && Player.V.武僧 == false && Player.V.罗汉 == false) { Player.MessageBox('请先选择职业!'); return }
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
        
        `
               Npc.SayEx(Player, '大大窗口', S)

}
export function 选择种族(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.种族 != '') { Player.MessageBox('你已经选择过种族了!'); return }
    let 种族 = Args.Str[0]
    Player.V.种族 = 种族
    Player.MapMove('主城', 100 + random(5), 115 + random(5))
    装备属性统计(Player,undefined,undefined,undefined);
    实时回血(Player, Player.GetSVar(92))
}


export function Main22222(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
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

{S=当前强化等级 :;C=149;x=25;y=35}{S=${Player.V.种族阶数};C=151;OX=5;y=35}
<{S=强化种族;HINT=200阶封顶;C=253;x=450;y=245}/@强化种族>
<{S=重置种族;HINT=重置种族会清空强化等级#92需求2000元宝;C=253;x=450;y=325}/@重置种族>
`
       Npc.SayEx(Player, '大大窗口', S)
}
