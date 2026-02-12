/*退出 NPC 界面*/

export function exit(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Npc.CloseDialog(Player);
}