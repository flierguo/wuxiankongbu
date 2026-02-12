import { _G_GA_DonationData } from "./_P_Base"

export function 沙巴克(Killer: TPlayObject, Player: TPlayObject): void {
    // if (GameLib.FindCastle('沙巴克').GetUnderWar() && Player.GetMapName() == '0150') {  //判断开始是否开始攻城和地图是不是沙巴克皇宫
        if (Killer.Guild != null && Player.Guild != null) {
            GameLib.V.沙巴克杀人数量 ??= {}
            GameLib.V.沙巴克杀人数量[Killer.Guild.GetName()] ??= 0
            GameLib.V.沙巴克杀人数量[Killer.Guild.GetName()] = GameLib.V.沙巴克杀人数量[Killer.Guild.GetName()] + 1
            let 玩家: string
            let 数量: number
            let 排名Index: number = 100
            /*寻找玩家是否已经在排名内*/
            for (let a = 0; a < 3; a++) {
                if (Killer.Guild.GetName() == GameLib.GetAVar(_G_GA_DonationData[a]._A_行会名字)) {
                    GameLib.SetGVar(_G_GA_DonationData[a]._G_杀人数量, GameLib.V.沙巴克杀人数量[Killer.Guild.GetName()])
                    GameLib.SetAVar(_G_GA_DonationData[a]._A_行会名字, Killer.Guild.GetName())
                }
            }
            if (Killer.Guild.GetName() == GameLib.GetAVar(_G_GA_DonationData[0]._A_行会名字)) {
                GameLib.SetGVar(_G_GA_DonationData[0]._G_杀人数量, GameLib.V.沙巴克杀人数量[Killer.Guild.GetName()])
                GameLib.SetAVar(_G_GA_DonationData[0]._A_行会名字, Killer.Guild.GetName())
            } else {
                for (let i = 2; i >= 1; i--) {
                    if (Killer.Guild.GetName() == GameLib.GetAVar(_G_GA_DonationData[i]._A_行会名字)) {
                        排名Index = i - 1;
                        break
                    }
                }
                if (排名Index == 100) 排名Index = 2;
                /*排序排名*/
                for (let i = 排名Index; i >= 0; i--) {
                    if (GameLib.V.沙巴克杀人数量[Killer.Guild.GetName()] > GameLib.GetGVar(_G_GA_DonationData[i]._G_杀人数量)) {
                        //Debug('ssss')
                        /*先将 old 玩家替换下去*/
                        玩家 = GameLib.GetAVar(_G_GA_DonationData[i]._A_行会名字)// old 玩家赋值给零时变量
                        GameLib.SetAVar(_G_GA_DonationData[i]._A_行会名字, Killer.Guild.GetName())// new 玩家替换位置
                        GameLib.SetAVar(_G_GA_DonationData[i + 1]._A_行会名字, 玩家)// old 玩家赋值到下级排名

                        数量 = GameLib.GetGVar(_G_GA_DonationData[i]._G_杀人数量)// old 玩家赋值给零时变量
                        GameLib.SetGVar(_G_GA_DonationData[i]._G_杀人数量, GameLib.V.沙巴克杀人数量[Killer.Guild.GetName()])// new 玩家替换位置
                        GameLib.SetGVar(_G_GA_DonationData[i + 1]._G_杀人数量, 数量)// old 玩家赋值到下级排名
                    } else {
                        break
                    }
                }
                /*重新赋值，玩家捐献的属性*/
            }
            /*回到 NPC 界面*/
            // 行会排名(Player)
        }
    // }
}


    // if()
