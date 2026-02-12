import { 装备属性统计 } from '../../应用智能优化版';


export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.战神 == false) { Player.MessageBox('只有战神职业才可查看!'); return }
    const S = `\\\\\\\\\\
            <{S=战神觉醒;HINT=觉醒后可学习高级技能并继承人物吸血比例和吸血点数#92觉醒后继承人物的伤害减少#92需要50本命运之书}/@战神觉醒>                                <强化战神/@开始强化战神>\\\\\\
      {S=战神学习基础技能:;C=250} <学习基础技能/@学习基础>           当前强化等级:${Player.V.战神强化等级}\\
      攻杀剑术,刺杀剑术,半月弯刀,烈火剑法      {S=额外增加战神生命${Player.V.战神强化等级 * 4}%;C=250}\\
                                               {S=额外增加战神伤害${Player.V.战神强化等级 * 2}%;C=250}\\
      {S=战神学习高级技能:;C=253} <学习高级技能/@学习高级>           {S=强化战神需要${Player.V.战神强化等级 + 1}本[命运之书];C=191}\\
      开天斩,逐日剑法,倚天辟地                 {S=每级增加战神4%生命值;C=151}\\
                                               {S=每级增加战神2%伤害;C=151}\\
                                               {S=每级增加战神9点移速攻度;C=151}\\
    `
    Player.SayEx('NPC中窗口', S)
}
export function 学习基础(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.战神学习基础) { Player.MessageBox('你的战神已经学习过基础技能了!'); return }
    Player.V.战神学习基础 = true
    Player.MessageBox('你的战神基础技能已经学习完毕!')
    Main(Npc, Player, Args)
}
export function 学习高级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.战神觉醒 == false) { Player.MessageBox('你的战神未觉醒,无法学习高级技能!'); return }
    if (Player.V.战神学习高级) { Player.MessageBox('你的战神已经学习过高级技能了!'); return }
    Player.V.战神学习高级 = true
    Player.MessageBox('你的战神高级技能已经学习完毕!')
    Main(Npc, Player, Args)
}

export function 战神觉醒(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.战神觉醒) { Player.MessageBox('你的战神已经觉醒过了,无法再次觉醒!'); return }
    if (Player.GetItemCount('命运之书') < 50) { Player.MessageBox('命运之书数量不足50本,无法觉醒!'); return }
    Npc.Take(Player, '命运之书', 50)
    Player.V.战神觉醒 = true
    Player.MessageBox('你的战神已经成功觉醒!')
    Main(Npc, Player, Args)
}
export function 开始强化战神(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.战神强化等级 >= 100) { Player.MessageBox('你的战神已经觉醒最高次数了!'); return }
    if (Player.GetItemCount('命运之书') < Player.V.战神强化等级 + 1) { Player.MessageBox(`命运之书数量不足${Player.V.战神强化等级 + 1}本,无法强化!`); return }
    Npc.Take(Player, '命运之书', Player.V.战神强化等级 + 1)
    Player.V.战神强化等级 = Player.V.战神强化等级 + 1
    Player.SendMessage(`战神强化完毕,当前强化等级{S=${Player.V.战神强化等级};C=154}级!`, 1)
    Main(Npc, Player, Args)
}
export function 罗汉转生(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.罗汉 == false) { Player.MessageBox('只有罗汉职业才可查看!'); return }
    const S = `\\\\\\\\
                      当前转生次数:${Player.V.轮回次数}\\\\
      {S=需要书页:${Player.V.轮回次数 >= 50 ? '已经达到最高转生' : (Player.V.轮回次数 + 1) * 50};C=191}  {S=需要命运之书:${Player.V.轮回次数 >= 50 ? '已经达到最高转生' : (Player.V.轮回次数 + 1) * 20};C=191}\\\\
     {S=每提升一阶 +0.02 倍攻 最高50阶;C=253}\\
     {S=每提升一阶 +18 宝宝移动和攻击速度 最高50阶;C=253}\\\\
     {S=转生达到50阶后可进行进化;C=224}    {S=进化说明;C=224;HINT=进化后伤害提升500%#92每次攻击附带双毒效果#92宝宝将继承装备上其他职业的宝宝技能倍攻}\\\\
     {S=转生达到50阶后人物可获得90%伤害减免;C=251}\\\\
                    <转生/@转生>            <进化/@进化>
    `
    Player.SayEx('NPC小窗口', S)
}

export function 转生(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.轮回次数 >= 50) { Player.MessageBox('你已经完成50次转生了!'); return }
    if (Player.GetItemCount('书页') < (Player.V.轮回次数 + 1) * 50) { Player.MessageBox(`书页数量不足${(Player.V.轮回次数 + 1) * 50}本,无法转生!`); return }
    if (Player.GetItemCount('命运之书') < (Player.V.轮回次数 + 1) * 20) { Player.MessageBox(`命运之书数量不足${(Player.V.轮回次数 + 1) * 20}本,无法转生!`); return }
    Npc.Take(Player, '书页', (Player.V.轮回次数 + 1) * 50)
    Npc.Take(Player, '命运之书', (Player.V.轮回次数 + 1) * 20)
    Player.V.轮回次数 = Player.V.轮回次数 + 1
    Player.SendMessage(`转生完毕,当前转生等级{S=${Player.V.轮回次数};C=154}级!`, 1)
    装备属性统计(Player,undefined,undefined,undefined);
    if (Player.SlaveCount > 0) { Player.KillSlave('') }
    罗汉转生(Npc, Player, Args)
}

export function 进化(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.轮回次数 < 50) { Player.MessageBox('转生次数50次宝宝才技能进化!'); return }
    if (Player.V.罗汉宝宝进化) { Player.MessageBox('你的宝宝已经进化过了!'); return }
    Player.V.罗汉宝宝进化 = true
    Player.SendMessage(`进化完成!`, 1)
    if (Player.SlaveCount > 0) { Player.KillSlave('') }
    罗汉转生(Npc, Player, Args)
}