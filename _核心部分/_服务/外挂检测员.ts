
export let G_GoldLocked: boolean = false
export function setG_GoldLocked(val: boolean) {
    G_GoldLocked = val
}
export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\
       {S=监狱;C=254;fn=楷体;fs=15}                {S=当前礼卷数量：${Player.GetGamePoint()};c=22}\\\\
       {S= ${Player.GetName()};c=215}{S=  检测到你开了加速;c=156},{S=1000礼卷充值即可出监狱;c=155}\\
   {S=-------------------------------------------------------------;C=91}\\
   {S=本服可以用外挂挂机,但是严禁加速行为,坚决打击加速;C=249}\\
   {S=开加速了就别舔个脸找管理员!;C=249}\\
   {S=任何人只要你开了加速关监狱,不管任何人;C=249}\\
   {S=100礼卷即可出狱,或者选择不玩退服!;C=249}\\
   {S=-------------------------------------------------------------;C=91}\\\\
   <花费1000礼卷出狱/@ChuJianYU>`
    Npc.SayEx(Player, 'NPC小窗口', S)
}
export function ChuJianYU(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.GetGamePoint() > 999) {
        Player.SetGamePoint(Player.GetGamePoint() - 1000)
        Player.GoldChanged()
        Debug(`"出狱了"...玩家[${Player.GetName()}]的真实充值为${Player.V.真实充值}]`);
        Player.MessageBox('出狱了就好好表现,不要在开加速了!');
        Player.GoHome();//回主城
    } else {
        Player.MessageBox('你的礼卷点数不够,请充值!。');
    }
}