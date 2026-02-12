/*国王*/

// import { CreateGuildGold, WomaHorn, GuildWarPrice } from "../../全局脚本[公共单元]/DefiniensConst"
export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const TS = `\\我是比齐国王，掌管国家最高权力，希望我能对你有帮助。\\ \\<请求创建行会/@@InPutString01(请输入行会名称:)>\\
{S=申请行会战争;C=248}\\<如何建立行会/@HowToBuild>\\<有关行会战争/@AboutWar>\\ \\ \\<离开/@_GN_Close.exit>
`
    const FS = `\\我是比齐国王，掌管国家最高权力，希望我能对你有帮助。\\ \\
{S=请求创建行会;C=248}\\<申请行会战争/@@InPutString02(请输入对方行会名称:)>\\<如何建立行会/@HowToBuild>\\<有关行会战争/@guildwarexp>\\ \\ \\<离开/@_GN_Close.exit>
`
    if (Player.HasGuild) {
        Npc.Say(Player, FS)
    }
    else {
        Npc.Say(Player, TS)
    }
}
export function InPutString01(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let AGuildName = ""
    let AGuild: TGuild
    let AVar: TVarValue
    if (Player.Guild != null) {
        Player.SendCenterMessage('你已加入了行会。', 0)
        return
    }
    if ((Args.Count == 0) || ((Args.Str[Args.Count - 1]).trim().length == 0)) {
        Player.SendCenterMessage('请输入行会名称。', 0)
        return
    }
    AGuildName = (Args.Str[Args.Count - 1]).trim()
    if (AGuildName == '') {
        Player.SendCenterMessage('行会名称必须填写。', 0)
        return
    }
    if ((AGuildName == '部落') || (AGuildName == '联盟')) {
        Player.SendCenterMessage('部落联盟行会名称本游戏禁止使用。', 0)
        return
    }
    if (Player.GetItemCount('战斗号角') < 1) {Player.MessageBox(`你没有战斗号角无法创建行会!`);return}
    // if (Player.GetItemCount('WomaHorn')== 0) {
    //     Player.SendCenterMessage('创建行会需要{S=' + 'WomaHorn' + ';C=249}', 0)
    //     return
    // }
    if (GameLib.FindGuild(AGuildName)!= null) {
        Player.SendCenterMessage('已经存在名为{S=' + AGuildName + ';C=249}的行会', 0)
        return
    }
    AGuild = GameLib.CreateGuild(AGuildName, Player.Name)
    if (AGuild != null) {
        Npc.Take(Player, '战斗号角',1)
       // Npc.Take(Player, 'WomaHorn', 1)
        GameLib.BroadcastTopMessage(format('%s创建了行会[%s],江湖上又多了一个行侠仗义锄强扶弱的组织！', [Player.Name, AGuildName]))
        AGuild.VarDateTime('创建日期').AsDateTime = DateUtils.Now()
        AGuild.VarDateTime('创建日期').Save()
        Main(Npc, Player, Args)
        Player.SendCenterMessage('行会创建完成。', 0)
    }
    else {
        Player.SendCenterMessage('行会创建失败。', 0)
    }
}
export function InPutString02(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let AGuildName = ""
    if (Player.Guild == null) {
        return
    }
    if (!Player.IsGuildMaster) {
        Player.SendCenterMessage('只有行会掌门人才有权申请行会战。', 0)
        return
    }
    if (Args.Count == 0) {
        return
    }
    AGuildName = (Args.Str[Args.Count - 1]).trim()
    if (AGuildName == '') {
        Player.SendCenterMessage('对方行会名称必须填写。', 0)
        return
    }
    if (Player.GetGameGold()  < 10000) {
        Player.SendCenterMessage('申请行会战需要金币{S=' + String(10000)+ ';C=249}', 0)
        return
    }
    if (GameLib.FindGuild(AGuildName)== null) {
        Player.SendCenterMessage('行会{S=' + AGuildName + ';C=249}不存在', 0)
        return
    }
    if (GameLib.AddGuildWar(Player.Guild.Name, AGuildName)) {
        Player.SetGameGold(Player.GetGameGold()-10000)
        Player.GoldChanged()
        Player.SendCenterMessage('行会战申请成功', 0)
    }
}
export function HowToBuild(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\　　建立行会你应该证明你有资格。\\
需要1个战斗号角！\\
　　注意：{S=行会名称必需使用中文或中文特殊符号！;C=249}\\ \\<输入行会名称/@@InPutString01(请输入行会名称:)>\\\\\\\\<返回/@main>
`
    Npc.Say(Player, S)
}
export function AboutWar(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
}

export function guildwarexp(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\
<行会战/@guildwar2>是一种合法的战争，因为目前有许多行会和\\
玩家都同意，这是<合法的/@warrule>的行会间战争。\\
<返回/@main>`
Npc.Say(Player, S)
}
export function guildwar2(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\
当你请求行会战争的时候,相同行会成员的名字将会出现在蓝色的。\\
 在另一方面,敌人的行会成员名字将会变成橘色的.开战中的行会\\
成员在此期间登录,信息窗口会有[××在与你行会进行行会战]\\
的信息出现，在这个时候，如果你杀敌了人的行会某一个成员,\\
系统对你的行为将不会被视为 PK 。 \\
<返回/@guildwarexp>`
Npc.Say(Player, S)
}
export function warrule(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\
行会战争在城市中不能发生,它在城市某范围外或内部竞赛区\\
域(一些建筑物之内)被启动.否则你 PK 你的身份将会是红色\\
的!甚至在战争期间。\\
<返回/@guildwarexp>`
Npc.Say(Player, S)
}
