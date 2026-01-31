export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\
                       {S=幸运提升;C=251} \\\\
    {S=升级幸运可以增加人物的属性下限!;C=254}\\\\
    {S=假如幸运值为0 ;c=253},\\
    {S=那么输出伤害就是: 属性下线 到 属性上线 的随机值;c=241}\\
    {S=假如幸运值为50 ;c=253},\\
    {s=那么输出伤害就是:(属性上线*50% + 属性下线) 到 属性上线的随机值;C=241}\\\\
    {S=您当前的幸运值为:${Player.V.幸运值};C=23}\\\\
    {S=下一级需要材料:${Player.V.幸运值 + 100}幸运精魄+${Player.V.幸运值 + 100}元宝;C=253}\\\\
                                                    <升级幸运/@升级幸运>\\

      

    `
    Npc.SayEx(Player, 'Npc小窗口', S)

}
export function 升级幸运(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 数量 = Player.V.幸运值 + 100
    if (Player.V.幸运值 >= 99) { Player.MessageBox(`你幸运值已经达到了99,并且发挥了最大值!`); return }
    if (Player.GetItemCount('幸运精魄') < 数量) { Player.MessageBox(`幸运精魄数量不足${数量}个,无法升级!`); return }
    if (Player.GetGameGold() < 数量) { Player.MessageBox(`元宝数量不足${数量}个,无法升级!`); return }
    Npc.Take(Player, '幸运精魄', 数量)
    Player.SetGameGold(Player.GetGameGold() - 数量)
    Player.GoldChanged()
    Player.V.幸运值 = Player.V.幸运值 + 1
    Player.MessageBox(`升级成功,当前幸运等级${Player.V.幸运值}`)
    Main(Npc, Player, Args)
}


export function 转生使者(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // 计算下一转生等级需求
    const 转生等级 = Player.GetReNewLevel();
    const 下一转需求等级 = (转生等级 + 1) * 10;
    const 降低等级 = 转生等级 * 5;
    
    let S = `\\\\\\\\
    {S=转生系统;C=251}\\\\
    {S=当前转生等级:${转生等级};C=254}\\\\
    {S=下一转生需求等级:${下一转需求等级};C=253}\\
    {S=此次转生降低人物等级:${降低等级};C=253}\\
    {S=每转提高人物的伤害吸收2%,40转以后提高1%.封顶90%;C=254}\\\\
                                                    <确认转生/@确认转生>\\

    `
    Npc.SayEx(Player, 'Npc小窗口', S)
}

export function 确认转生(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 转生等级 = Player.GetReNewLevel();
    const 下一转需求等级 = (转生等级 + 1) * 10;
    const 降低等级 = 转生等级 * 5;
    
    // 检查等级是否满足要求
    if (Player.GetLevel() < 下一转需求等级) {
        Player.MessageBox(`转生失败，您的等级不足${下一转需求等级}级！`);
        return;
    }
    if (Player.GetReNewLevel() >= 50) {
        Player.MessageBox(`转生失败，您已经转生50次，无法再转生！`);
        return;
    }
    // 执行转生
    Player.SetReNewLevel(转生等级 + 1);
    
    // 降低等级
    const 当前等级 = Player.GetLevel();
    const 新等级 = Math.max(1, 当前等级 - 降低等级); // 确保等级不低于1
    Player.SetLevel(新等级);
    
    Player.MessageBox(`恭喜您成功转生，当前转生等级为${转生等级 + 1}级！`);
    转生使者(Npc, Player, Args);
}
