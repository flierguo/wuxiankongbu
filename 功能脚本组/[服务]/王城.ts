import { 装备属性统计 } from '../../应用智能优化版';


export function 天赋(Npc: TNormNpc, Player: TPlayObject): void {
    const S = `\\\\\\\\\\\\\\\\\\
    <{M=493,493,494;F=职业图标.DATA;Hint=#123S#61生命[天赋]#59C#61251#125#92#123S#61效果:每点增加3%生命#59C#61254#125;X=100;Y=100}/@王城.生命天赋>\\
    <{M=673,673,674;F=职业图标.DATA;Hint=#123S#61防御[天赋]#59C#61251#125#92#123S#61效果:每点增加1%防御#59C#61254#125;X=250;Y=100}/@王城.防御天赋>\\
    <{M=481,481,482;F=职业图标.DATA;Hint=#123S#61进攻[天赋]#59C#61251#125#92#123S#61效果:每点增加1%攻魔道刺射武#59C#61254#125;X=400;Y=100}/@王城.进攻天赋>\\
    <{M=1348,1348,1349;F=职业图标.DATA;Hint=#123S#61速度[天赋]#59C#61251#125#92#123S#61效果:每点增加宝宝20速度#59C#61254#125;X=100;Y=200}/@王城.速度天赋>\\
    <{M=658,658,659;F=职业图标.DATA;Hint=#123S#61恢复[天赋]#59C#61251#125#92#123S#61效果:每点增加每秒恢复血量1‰#59C#61254#125;X=250;Y=200}/@王城.恢复天赋>\\
    <{M=922,922,923;F=职业图标.DATA;Hint=#123S#61躲避[天赋]#59C#61251#125#92#123S#61效果:每2点增加1%躲避伤害的几率#59C#61254#125;X=400;Y=200}/@王城.躲避天赋>\\
    <{M=1888,1888,1889;F=职业图标.DATA;Hint=#123S#61吸收[天赋]#59C#61251#125#92#123S#61效果:每2点增加1%物伤减免和法伤减免#59C#61254#125;X=100;Y=300}/@王城.吸收天赋>\\
    <{M=1906,1906,1907;F=职业图标.DATA;Hint=#123S#61反弹[天赋]#59C#61251#125#92#123S#61效果:每点增加1%反弹几率,反弹伤害为固定收到伤害的50%#59C#61254#125;X=250;Y=300}/@王城.反弹天赋>\\
    <{M=2239,2239,2240;F=职业图标.DATA;Hint=#123S#61契约[天赋]#59C#61251#125#92#123S#61效果:每点契约增加人物0.01#59C#61254#125#92萌萌浣熊:30点契约增加1只#92嗜血狼人:40点契约增加1只#92丛林虎王:50点契约增加1只#92猎人宠物:40点契约增加一只#92轮回宝宝:60点契约增加一只#92战神宝宝:50点契约增加一只;X=400;Y=300}/@王城.契约天赋>\\
    {S=点数:${Player.V.生命专精激活 ?Player.R.生命点数*2:Player.R.生命点数};C=251;X=140;Y=110}  {S=点数:${Player.V.防御专精激活?Player.R.防御点数*2:Player.R.防御点数};C=251;X=290;Y=110}  {S=点数:${Player.V.进攻专精激活?Player.R.进攻点数*2:Player.R.进攻点数};C=251;X=440;Y=110}\\
    {S=点数:${Player.V.速度专精激活?Player.R.速度点数*2:Player.R.速度点数};C=251;X=140;Y=210}  {S=点数:${Player.V.恢复专精激活?Player.R.恢复点数*2:Player.R.恢复点数};C=251;X=290;Y=210}  {S=点数:${Player.V.躲避专精激活?Player.R.躲避点数*2:Player.R.躲避点数};C=251;X=440;Y=210}\\
    {S=点数:${Player.V.吸收专精激活?Player.R.吸收点数*2:Player.R.吸收点数};C=251;X=140;Y=310}  {S=点数:${Player.V.反弹专精激活?Player.R.反弹点数*2:Player.R.反弹点数};C=251;X=290;Y=310}  {S=点数:${Player.V.契约专精激活?Player.R.契约点数*2:Player.R.契约点数};C=251;X=440;Y=310}\\\\\\
                                 {S=点亮专精图标可获得双倍天赋效果;C=250}\\
                                 {S=天赋属性只能再装备的词条中获得;C=250}\\\\\\
                                 <{S=重置专精;C=251;HINT=重置专精需要花费200礼卷}/@@Question(重置天赋将花费200点礼卷,@王城.重置专精)>       {S=剩余专精点数:${Player.V.天赋专精};C=243}\\
                                 $激活状态1$ $激活状态2$ $激活状态3$ $激活状态4$ $激活状态5$ $激活状态6$ $激活状态7$ $激活状态8$ $激活状态9$
`
    let M = '';
    M = S;
    Player.V.生命专精激活 ? M = ReplaceStr(M, '$激活状态1$', `{S=[已激活];C=250;X=95;Y=140}`) : M = ReplaceStr(M, '$激活状态1$', `{S=[未激活];C=249;X=95;Y=140}`)
    Player.V.防御专精激活 ? M = ReplaceStr(M, '$激活状态2$', `{S=[已激活];C=250;X=245;Y=140}`) : M = ReplaceStr(M, '$激活状态2$', `{S=[未激活];C=249;X=245;Y=140}`)
    Player.V.进攻专精激活 ? M = ReplaceStr(M, '$激活状态3$', `{S=[已激活];C=250;X=395;Y=140}`) : M = ReplaceStr(M, '$激活状态3$', `{S=[未激活];C=249;X=395;Y=140}`)
    Player.V.速度专精激活 ? M = ReplaceStr(M, '$激活状态4$', `{S=[已激活];C=250;X=95;Y=240}`) : M = ReplaceStr(M, '$激活状态4$', `{S=[未激活];C=249;X=95;Y=240}`)
    Player.V.恢复专精激活 ? M = ReplaceStr(M, '$激活状态5$', `{S=[已激活];C=250;X=245;Y=240}`) : M = ReplaceStr(M, '$激活状态5$', `{S=[未激活];C=249;X=245;Y=240}`)
    Player.V.躲避专精激活 ? M = ReplaceStr(M, '$激活状态6$', `{S=[已激活];C=250;X=395;Y=240}`) : M = ReplaceStr(M, '$激活状态6$', `{S=[未激活];C=249;X=395;Y=240}`)
    Player.V.吸收专精激活 ? M = ReplaceStr(M, '$激活状态7$', `{S=[已激活];C=250;X=95;Y=340}`) : M = ReplaceStr(M, '$激活状态7$', `{S=[未激活];C=249;X=95;Y=340}`)
    Player.V.反弹专精激活 ? M = ReplaceStr(M, '$激活状态8$', `{S=[已激活];C=250;X=245;Y=340}`) : M = ReplaceStr(M, '$激活状态8$', `{S=[未激活];C=249;X=245;Y=340}`)
    Player.V.契约专精激活 ? M = ReplaceStr(M, '$激活状态9$', `{S=[已激活];C=250;X=395;Y=340}`) : M = ReplaceStr(M, '$激活状态9$', `{S=[未激活];C=249;X=395;Y=340}`)

    Npc.SayEx(Player, '天赋', M)
}
export function 重置专精(Npc: TNormNpc, Player: TPlayObject): void {
    if (Player.GetGamePoint() < 200) { Player.MessageBox('礼卷不足200点,无法重置天赋!'); return }
    Player.SetGamePoint(Player.GetGamePoint() - 200)
    Player.GoldChanged()
    Player.V.生命专精激活=false
    Player.V.防御专精激活=false
    Player.V.进攻专精激活=false
    Player.V.速度专精激活=false
    Player.V.恢复专精激活=false
    Player.V.躲避专精激活=false
    Player.V.吸收专精激活=false
    Player.V.反弹专精激活=false
    Player.V.契约专精激活=false
    Player.V.天赋专精=3
    Player.MessageBox('重置专精完毕!')
    装备属性统计(Player,undefined,undefined,undefined);
    天赋(Npc, Player)
}
export function 生命天赋(Npc: TNormNpc, Player: TPlayObject): void {
    if (Player.V.天赋专精 < 1) { Player.MessageBox('专精点数不够了,无法选择天赋!'); return }
    if (Player.V.生命专精激活) { Player.MessageBox('你已经激活此天赋了!'); return }
    Player.V.生命专精激活 = true
    Player.V.天赋专精=Player.V.天赋专精-1
    装备属性统计(Player,undefined,undefined,undefined);
    天赋(Npc, Player)
}
export function 防御天赋(Npc: TNormNpc, Player: TPlayObject): void {
    if (Player.V.天赋专精 < 1) { Player.MessageBox('专精点数不够了,无法选择天赋!'); return }
    if (Player.V.防御专精激活) { Player.MessageBox('你已经激活此天赋了!'); return }
    Player.V.防御专精激活 = true
    Player.V.天赋专精=Player.V.天赋专精-1
    装备属性统计(Player,undefined,undefined,undefined);
    天赋(Npc, Player)
}
export function 进攻天赋(Npc: TNormNpc, Player: TPlayObject): void {
    if (Player.V.天赋专精 < 1) { Player.MessageBox('专精点数不够了,无法选择天赋!'); return }
    if (Player.V.进攻专精激活) { Player.MessageBox('你已经激活此天赋了!'); return }
    Player.V.进攻专精激活 = true
    Player.V.天赋专精=Player.V.天赋专精-1
    装备属性统计(Player,undefined,undefined,undefined);
    天赋(Npc, Player)
}
export function 速度天赋(Npc: TNormNpc, Player: TPlayObject): void {
    if (Player.V.天赋专精 < 1) { Player.MessageBox('专精点数不够了,无法选择天赋!'); return }
    if (Player.V.速度专精激活) { Player.MessageBox('你已经激活此天赋了!'); return }
    Player.V.速度专精激活 = true
    Player.V.天赋专精=Player.V.天赋专精-1
    装备属性统计(Player,undefined,undefined,undefined);
    天赋(Npc, Player)
}

export function 恢复天赋(Npc: TNormNpc, Player: TPlayObject): void {
    if (Player.V.天赋专精 < 1) { Player.MessageBox('专精点数不够了,无法选择天赋!'); return }
    if (Player.V.恢复专精激活) { Player.MessageBox('你已经激活此天赋了!'); return }
    Player.V.恢复专精激活 = true
    Player.V.天赋专精=Player.V.天赋专精-1
    装备属性统计(Player,undefined,undefined,undefined);
    天赋(Npc, Player)
}

export function 躲避天赋(Npc: TNormNpc, Player: TPlayObject): void {
    if (Player.V.天赋专精 < 1) { Player.MessageBox('专精点数不够了,无法选择天赋!'); return }
    if (Player.V.躲避专精激活) { Player.MessageBox('你已经激活此天赋了!'); return }
    Player.V.躲避专精激活 = true
    Player.V.天赋专精=Player.V.天赋专精-1
    装备属性统计(Player,undefined,undefined,undefined);
    天赋(Npc, Player)
}

export function 吸收天赋(Npc: TNormNpc, Player: TPlayObject): void {
    if (Player.V.天赋专精 < 1) { Player.MessageBox('专精点数不够了,无法选择天赋!'); return }
    if (Player.V.吸收专精激活) { Player.MessageBox('你已经激活此天赋了!'); return }
    Player.V.吸收专精激活 = true
    Player.V.天赋专精=Player.V.天赋专精-1
    装备属性统计(Player,undefined,undefined,undefined);
    天赋(Npc, Player)
}
export function 反弹天赋(Npc: TNormNpc, Player: TPlayObject): void {
    if (Player.V.天赋专精 < 1) { Player.MessageBox('专精点数不够了,无法选择天赋!'); return }
    if (Player.V.反弹专精激活) { Player.MessageBox('你已经激活此天赋了!'); return }
    Player.V.反弹专精激活 = true
    Player.V.天赋专精=Player.V.天赋专精-1
    装备属性统计(Player,undefined,undefined,undefined);
    天赋(Npc, Player)
}
export function 契约天赋(Npc: TNormNpc, Player: TPlayObject): void {
    if (Player.V.天赋专精 < 1) { Player.MessageBox('专精点数不够了,无法选择天赋!'); return }
    if (Player.V.契约专精激活) { Player.MessageBox('你已经激活此天赋了!'); return }
    Player.V.契约专精激活 = true
    Player.V.天赋专精=Player.V.天赋专精-1
    装备属性统计(Player,undefined,undefined,undefined);
    天赋(Npc, Player)
}