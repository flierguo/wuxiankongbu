
import { 特效 } from "../../_核心部分/基础常量";


export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\
     此NPC为内部测试NPC,正式开区后进行删除\\
     注意:请测试人员不要依赖此NPC,不要光顾着自己玩的爽\\
     尽量多换些职业,以及测试各种NPC功能,装备属性各种加成,怪物属性时候合理等\\
     还有职业的平衡性,种族以及天赋,特别注意的是装备属性超过20亿将会简写\\
     此简写为自己写的脚本,如果出现属性加成不正常或者-负数情况请联系管理\\
     发现BUG等问题请建立文档并且详细说明然后发送给管理\\
     {S=以下按钮请先鼠标到上边查看;C=191}\\\\
     <{S=领取充值金额;HINT=输入要领取的充值数量#92例如输入100那么会领取100真实充值以及100礼卷}/@@InPutInteger(输入数量即可领取礼卷以及充值)>      <{S=职业变更;HINT=转职不知道是否会有问题可能涉及到很多变量#92有问题及时联系管理修复#92转职只有基础技能}/@转职>   <{S=种族变更;HINT=转换种族不知道是否会有问题可能涉及到很多变量#92有问题及时联系管理修复}/@种族变更>  <领1000书页/@领取书页>\\\\
     <{S=领1000碎骨;HINT=换荣誉的材料}/@换碎骨>  <领取1000荣誉/@领取荣誉>   <领取命运之书/@命运之书>
    `
    Npc.SayEx(Player, 'Npc中窗口', S)

}
export function InPutInteger(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 数量 = Args.Int[0]
    if (数量 < 1 || 数量 > 10000) { Player.MessageBox('请输入1-10000之间的数值'); return }
    Player.V.真实充值 = Player.V.真实充值 + 数量
    Player.SetGamePoint(Player.GetGamePoint() + 数量)
    Player.GoldChanged()
    Player.MessageBox(`你领取了${数量}充值以及${数量}礼卷!`)

}


export function 清理每日(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.荣誉值 = Player.V.荣誉值 + 1000
}


export function 领取荣誉(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.荣誉值 = Player.V.荣誉值 + 1000
}

export function 换碎骨(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Npc.Give(Player, '碎骨', 1000)
}

export function 命运之书(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Npc.Give(Player, '命运之书', 10000)
}

export function 领取书页(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Npc.Give(Player, '书页', 10000)
}
export function 转职(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\
    <转职战神/@开始转职(1)>          <转职骑士/@开始转职(2)>         <转职火神/@开始转职(3)>           <转职冰法/@开始转职(4)>\\\\
    <转职驯兽师/@开始转职(5)>        <转职牧师/@开始转职(6)>         <转职神射手/@开始转职(9)>         <转职猎人/@开始转职(10)>\\\\
    <转职刺客/@开始转职(7)>          <转职鬼舞者/@开始转职(8)>       <转职武僧/@开始转职(11)>           <转职罗汉/@开始转职(12)>\\\\
`
    Npc.SayEx(Player, 'Npc中窗口', S)
}

export function 开始转职(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.战神 = false
    Player.V.骑士 = false
    Player.V.火神 = false
    Player.V.冰法 = false
    Player.V.驯兽师 = false
    Player.V.牧师 = false
    Player.V.神射手 = false
    Player.V.猎人 = false
    Player.V.刺客 = false
    Player.V.鬼舞者 = false
    Player.V.武僧 = false
    Player.V.罗汉 = false
    Player.V.轮回次数 = 0
    Player.V.战神觉醒 = false
    Player.V.战神强化等级 = 0
    Player.V.战神学习基础 = false
    Player.V.战神学习高级 = false
    Player.ClearSkill()
    Player.RecalcAbilitys()
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
            break
        case 2:
            Player.AddSkill('基本剑术', 3);
            Player.AddSkill('攻杀剑术', 3);
            Player.AddSkill('刺杀剑术', 3);
            Player.AddSkill('圣光打击');
            Player.AddSkill('防御姿态');
            Player.SetJob(0)
            Player.V.骑士 = true
            break
        case 3:
            Player.AddSkill('雷电术', 3);
            Player.AddSkill('冰咆哮', 3);
            Player.AddSkill('法术奥义');
            Player.AddSkill('闪现');
            Player.SetJob(1)
            Player.V.火神 = true
            break
        case 4:
            Player.AddSkill('雷电术', 3);
            Player.AddSkill('冰咆哮', 3);
            Player.AddSkill('暴风雨');
            Player.AddSkill('打击符文');
            Player.SetJob(1)
            Player.V.冰法 = true
            break
        case 5:
            Player.AddSkill('精神力战法', 3);
            Player.AddSkill('灵魂火符', 3);
            Player.AddSkill('施毒术', 3);
            Player.AddSkill('飓风破', 3);
            Player.AddSkill('萌萌浣熊');
            Player.AddSkill('凶猛野兽');
            Player.V.驯兽师 = true
            Player.SetJob(2)
            break
        case 6:
            Player.AddSkill('精神力战法', 3);
            Player.AddSkill('灵魂火符', 3);
            Player.AddSkill('施毒术', 3);
            Player.AddSkill('飓风破', 3);
            Player.AddSkill('剧毒火海');
            Player.AddSkill('妙手回春');
            Player.SetJob(2)
            Player.V.牧师 = true
            break
        case 7:
            Player.AddSkill('精准术', 3);
            Player.AddSkill('霜月X', 3);
            Player.AddSkill('潜行', 3);
            Player.AddSkill('弱点');
            Player.SetJob(3)
            Player.V.刺客 = true
            break
        case 8:
            Player.AddSkill('精准术', 3);
            Player.AddSkill('霜月X', 3);
            Player.AddSkill('鬼舞斩');
            Player.AddSkill('鬼舞者');
            Player.SetJob(3)
            Player.V.鬼舞者 = true
            break
        case 9:
            Player.AddSkill('精准箭术', 3);
            Player.AddSkill('天罡震气', 3);
            Player.AddSkill('成长');
            Player.AddSkill('万箭齐发');
            Player.SetJob(4)
            Player.V.神射手 = true
            break
        case 10:
            Player.AddSkill('精准箭术', 3);
            Player.AddSkill('天罡震气', 3);
            Player.AddSkill('分裂箭');
            Player.AddSkill('召唤宠物');
            Player.SetJob(4)
            Player.V.猎人 = true
            break
        case 11:
            Player.AddSkill('罗汉棍法', 3);
            Player.AddSkill('达摩棍法', 3);
            Player.AddSkill('天雷阵');
            Player.AddSkill('护法灭魔');
            Player.SetJob(5)
            Player.V.武僧 = true
            // Player.ShowEffectEx2(特效.鬼舞群魔乱舞, -10, 20, true, 99999)
            break
        case 12:
            Player.AddSkill('罗汉棍法', 3);
            Player.AddSkill('达摩棍法', 3);
            Player.AddSkill('金刚护法');
            Player.AddSkill('转生');
            Player.SetJob(5)
            Player.V.罗汉 = true
            break
    }
    Player.MessageBox('转职完毕,建议小退!')
    Player.RecalcAbilitys()

}

export function 种族变更(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\
    <换人族/@换种族(人族)>  <换妖族/@换种族(妖族)>  <换血族/@换种族(血族)>  <换神族/@换种族(神族)>\\\\
    <换龙族/@换种族(龙族)>  <换魔族/@换种族(魔族)>  <换兽族/@换种族(兽族)>  <换精灵/@换种族(精灵)>\\\\
`
    Npc.SayEx(Player, 'Npc中窗口', S)

}


export function 换种族(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 种族 = Args.Str[0]
    Player.V.种族 = 种族
    Player.MessageBox(`你换成了一个${种族}`)

}



