import { js_number } from "../../全局脚本[公共单元]/utils/计算方法_优化版"

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.血量加持 ??= 0
    Player.V.防御加持 ??= 0
    const S = `\\\\
                            {S=血防加持;C=251} \\\\
    {S=血防加持属性介绍:;C=9}\\
    {S=① 可使用血石精华提高血量百分比;c=20}\\
    {S=② 可使用泰坦结晶提高防御百分比;c=20}\\
    {S=③ 每提高100%消耗碎片增加200个;c=20}\\
    {S=当前血量加持为;C=9}: {S=${Player.V.血量加持};C=23} %\\
    {S=当前需求血石精华;C=9}: {S=${(Math.floor(Player.V.血量加持/100) + 1) * 200};C=23} 个\\
    {S=当前防御加持为;C=10}: {S=${Player.V.防御加持};C=23} %\\
    {S=当前需求泰坦结晶;C=10}: {S=${(Math.floor(Player.V.防御加持/100) + 1) * 200};C=23} 个\\
   
    <{S=升级血量;X=300;Y=200}/@升级(血量)>
    <{S=升级防御;X=300;Y=240}/@升级(防御)>\\     

    `
    Npc.SayEx(Player, 'Npc小窗口', S)

}
export function 升级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 类型 = Args.Str[0]
    let 所需血石精华 = (Math.floor(Player.V.血量加持/100) + 1) * 200
    let 所需泰坦结晶 = (Math.floor(Player.V.防御加持/100) + 1) * 200

    const 百级血石 = js_number(js_number(String(Player.V.血量加持), String(Player.V.血量加持 + 100), 8), String(所需血石精华), 3)
    const 百级泰坦 = js_number(js_number(String(Player.V.防御加持), String(Player.V.防御加持 + 100), 8), String(所需泰坦结晶), 3)
    const 十级血石 = js_number(js_number(String(Player.V.血量加持), String(Player.V.血量加持 + 10), 8), String(所需血石精华), 3)
    const 十级泰坦 = js_number(js_number(String(Player.V.防御加持), String(Player.V.防御加持 + 10), 8), String(所需泰坦结晶), 3)
    const 测试 = js_number('1', '10', 8)

    console.log(`防御加持:${Player.V.防御加持} 测试:${测试} 类型:${类型} 所需血石精华:${所需血石精华} 所需泰坦结晶:${所需泰坦结晶} 百级血石:${百级血石} 百级泰坦:${百级泰坦} 十级血石:${十级血石} 十级泰坦:${十级泰坦} 测试:${测试}`)
    if (类型 == '血量') {
        if (Player.GetItemCount('血石精华') > Number(百级血石)) {
            Npc.Take(Player, '血石精华', Number(百级血石))
            Player.V.血量加持 = Player.V.血量加持 + 100

        }else if (Player.GetItemCount('血石精华') > Number(十级血石)) {
            Npc.Take(Player, '血石精华', Number(十级血石))
            Player.V.血量加持 = Player.V.血量加持 + 10

        }else if (Player.GetItemCount('血石精华') > Number(所需血石精华)) {
            Npc.Take(Player, '血石精华', Number(所需血石精华))
            Player.V.血量加持 = Player.V.血量加持 + 1
        }else {
            Player.MessageBox(`血石精华数量不足,无法升级!`)
        }
    } else if (类型 == '防御') {
        if (Player.GetItemCount('泰坦结晶') > Number(百级泰坦)) {
            Npc.Take(Player, '泰坦结晶', Number(百级泰坦))
            Player.V.防御加持 = Player.V.防御加持 + 100

        }else if (Player.GetItemCount('泰坦结晶') > Number(十级泰坦)) {
            Npc.Take(Player, '泰坦结晶', Number(十级泰坦))
            Player.V.防御加持 = Player.V.防御加持 + 10

        }else if (Player.GetItemCount('泰坦结晶') > Number(所需泰坦结晶)) {
            Npc.Take(Player, '泰坦结晶', Number(所需泰坦结晶))
            Player.V.防御加持 = Player.V.防御加持 + 1

        }else {
            Player.MessageBox(`泰坦结晶数量不足,无法升级!`)

        }
    }
    return Main(Npc, Player, Args)
}
