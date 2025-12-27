import { random数字, 实时回血, 实时扣血, 整数相减, 血量显示 } from "./字符计算"

export function Main(Npc: TNormNpc, Player: TPlayObject) {
    const S =
`{S=管理平台;C=254}  {S=Hot~;C=249}\\\\
      <装备调试/@装备调试器.装备调试>    <后台功能/@后台功能.后台测试>
`
    const S1 = `\\我只是个神秘的Npc....`
    let str:string
    Player.IsAdmin ? str = S: str = S1
    Npc.Say(Player, str)
}
export function 后台测试(Npc: TNormNpc, Player: TPlayObject) {
    if(Player.IsAdmin){
        let X坐标 = 20
        let Y坐标 = 40
        let S = `\\\\`
        S += `<{S=清空包裹;X=${X坐标 += 10};Y=${Y坐标 = 70};}/@后台功能.清空包裹> `
        S += `<{S=测试按钮;X=${X坐标 += 60};Y=${Y坐标 = 70};}/@后台功能.测试按钮> `
        S += `<{S=清理怪物;X=${X坐标 += 60};Y=${Y坐标 = 70};}/@后台功能.清理怪物> `
    
        Npc.SayEx(Player, 'Npc大窗口', S);
    } else {
        Player.MessageBox('提示：\\\\对不起，没有权限使用。')
    }
}
export function 清理怪物(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.Map.ClearMon(false,``)
}
export function 测试按钮(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // Player.ShowBleedNumberForDebug(`数字飘血.data`, 2, `0,0,0,`, 100666746452298, `0,0,0,`,1500,0,-24,-50,44)
    // 实时扣血(Player,Player,`100`)
    Player.SetSVar(91,Player.GetSVar(92))
    血量显示(Player)
}
export function 清空包裹(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    for(let i=Player.GetItemSize() -1;i>=0;i--){
        let AItem = Player.GetBagItem(i)
        if(AItem){
            Player.DeleteItem(AItem)
        }
    }
    Player.GiveItem('回城石')
    Player.GiveItem('随机传送石')
}
