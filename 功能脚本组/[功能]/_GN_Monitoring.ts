/*监控*/
import { G_GoldLocked, setG_GoldLocked } from "../[服务]/充值使者";
import { _P_P_ATTACK, _P_P_MAGIC, _P_P_RIDING, _P_P_RUNNING, _P_P_WALK, _P_P_PRISON, _P_N_JAIL, _P_N_监狱计时 } from "../[玩家]/_P_Base"

const Prison = '0156';//监狱 MapName
const RMB = 100;//玩家出狱需要RMB点的数量

export function monitoring(Player: TPlayObject, Action: number): void {
    // _P_P_ATTACK  监控玩家的 攻击     次数
    // _P_P_MAGIC   监控玩家的 魔法     次数
    // _P_P_RIDING  监控玩家的 骑马跑动 次数
    // _P_P_RUNNING 监控玩家的 跑步     次数
    // _P_P_WALK    监控玩家的 走路     次数
    // _P_P_PRISON  监控玩家的 监狱变量 Prison
    switch (Action) {
        case 1: Player.SetPVar(_P_P_ATTACK, Player.GetPVar(_P_P_ATTACK) + 1); break
        case 2: Player.SetPVar(_P_P_MAGIC, Player.GetPVar(_P_P_MAGIC) + 1); break
        case 3: Player.SetPVar(_P_P_RIDING, Player.GetPVar(_P_P_RIDING) + 1); break
        case 4: Player.SetPVar(_P_P_RUNNING, Player.GetPVar(_P_P_RUNNING) + 1); break
        case 5: Player.SetPVar(_P_P_WALK, Player.GetPVar(_P_P_WALK) + 1); break
    }
}
/*机器人监控    10秒调用一次*/
export function RobotPlugIn(Player: TPlayObject): void {
    
    // 攻速 0 = 12 攻速 1 = 13 攻速 2 = 13 攻速 3 = 14 攻速 4 = 15 攻速 5 = 16 攻速 6 = 17 攻速 7 = 18 攻速 8 = 19 
    /*攻击 次数*/
    if (Player.GetPVar(_P_P_ATTACK) > 23) {   //攻速
        // if (Player.GetPVar(_P_P_PRISON) > 2) {  //监控速度过快次数
        //     Player.RandomMove(Prison);  //传送监狱
        //     Player.SetPVar(_P_P_PRISON, 0);  //传送到监狱然后清0
        //     Player.SetNVar(_P_N_JAIL, Player.GetNVar(_P_N_JAIL) + 1);  //进监狱次数
        //     Debug('玩家[' + Player.Name + ']因"攻击速度"异常被抓进监狱，该玩家被抓[' + String(Player.GetNVar(_P_N_JAIL)) + ']次')
        // }
        // Player.SetPVar(_P_P_PRISON, Player.GetPVar(_P_P_PRISON) + 1);
        Player.SendMessage('发现（攻击速度）不法行为,石化60秒！', 2);
        Player.SetState(5,60,0)
        // Player.SendMessage('发现（攻击速度）不法行为，再次就要抓监狱啊！', 2);
        // Player.SendMessage('发现（攻击速度）不法行为，再次就要抓监狱啊！', 2);
        // Player.MessageBox('发现（攻击速度）不法行为，再次就要抓监狱啊！')
        // Debug('玩家[' + Player.Name + ']因"攻击速度"异常被抓进监狱，该玩家被抓[' + String(Player.GetNVar(_P_N_JAIL)) + ']次')
        Player.SetPVar(_P_P_ATTACK, 0);
    }else {
        Player.SetPVar(_P_P_ATTACK, 0);
    }
    /*魔法 次数*/
    // 魔速 0 = 8 魔速 1 = 8 魔速 2 = 9 魔速 3 = 9 魔速 4 = 9 魔速 5 = 9 魔速 6 = 11 魔速 7 = 11 魔速 8 = 12 魔速 9 = 13
    if (Player.GetPVar(_P_P_MAGIC) > 24) {
        // if (Player.GetPVar(_P_P_PRISON) > 2) {
        //     Player.RandomMove(Prison);
        //     Player.SetPVar(_P_P_PRISON, 0);
        //     Player.SetPVar(_P_P_PRISON, Player.GetPVar(_P_P_PRISON) + 1);
        //     Player.SetNVar(_P_N_JAIL, Player.GetNVar(_P_N_JAIL) + 1);

        //     Debug('玩家[' + Player.Name + ']因"魔法速度"异常被抓进监狱，该玩家被抓[' + String(Player.GetNVar(_P_N_JAIL)) + ']次')
        // }
        Player.SendMessage('发现（魔法速度）不法行为,石化60秒！', 2);
        Player.SetState(5,60,0)
        // Player.SetPVar(_P_P_PRISON, Player.GetPVar(_P_P_PRISON) + 1);
        // Player.SendMessage('发现（魔法速度）不法行为，再次就要抓监狱啊！', 2);
        // Player.SendMessage('发现（魔法速度）不法行为，再次就要抓监狱啊！', 2);
        // Player.SendMessage('发现（魔法速度）不法行为，再次就要抓监狱啊！', 2);
        // Player.MessageBox('发现（魔法速度）不法行为，再次就要抓监狱啊！')
        // Debug('玩家[' + Player.Name + ']因"魔法速度"异常被抓进监狱，该玩家被抓[' + String(Player.GetNVar(_P_N_JAIL)) + ']次')
        Player.SetPVar(_P_P_MAGIC, 0);
    } else {
        Player.SetPVar(_P_P_MAGIC, 0);
    }
    /*跑步 次数*/
    if (Player.GetPVar(_P_P_RUNNING) > 24) {
        // if (Player.GetPVar(_P_P_PRISON) > 2) {
        //     Player.RandomMove(Prison);
        //     Player.SetPVar(_P_P_PRISON, 0);
        //     Player.SetPVar(_P_P_PRISON, Player.GetPVar(_P_P_PRISON) + 1);
        //     Player.SetNVar(_P_N_JAIL, Player.GetNVar(_P_N_JAIL) + 1);
        //     Debug('玩家[' + Player.Name + ']因"跑步速度"异常被抓进监狱，该玩家被抓[' + String(Player.GetNVar(_P_N_JAIL)) + ']次')
        // }
        // Player.SetPVar(_P_P_PRISON, Player.GetPVar(_P_P_PRISON) + 1);
        // Player.SendMessage('发现（跑步速度）不法行为，再次就要抓监狱啊！', 2);
        // Player.SendMessage('发现（跑步速度）不法行为，再次就要抓监狱啊！', 2);
        // Player.SendMessage('发现（跑步速度）不法行为，再次就要抓监狱啊！', 2);
        // Player.MessageBox('发现（跑步速度）不法行为，再次就要抓监狱啊！')
        // Debug('玩家[' + Player.Name + ']因"跑步速度"异常被抓进监狱，该玩家被抓[' + String(Player.GetNVar(_P_N_JAIL)) + ']次')
        Player.SendMessage('发现（跑步速度）不法行为,石化60秒！', 2);
        Player.SetState(5,60,0)
        Player.SetPVar(_P_P_RUNNING, 0);
        console.log('发现（跑步速度）不法行为,石化60秒！', Player.Name)
    } else {
        Player.SetPVar(_P_P_RUNNING, 0);
    }
    /*走路 次数*/
    if (Player.GetPVar(_P_P_WALK) > 25) {
        // if (Player.GetPVar(_P_P_PRISON) > 2) {
        //     Player.RandomMove(Prison);
        //     Player.SetPVar(_P_P_PRISON, 0);
        //     Player.SetPVar(_P_P_PRISON, Player.GetPVar(_P_P_PRISON) + 1);
        //     Player.SetNVar(_P_N_JAIL, Player.GetNVar(_P_N_JAIL) + 1);
        //     Debug('玩家[' + Player.Name + ']因"走路速度"异常被抓进监狱，该玩家被抓[' + String(Player.GetNVar(_P_N_JAIL)) + ']次')
        // }
        // Player.SetPVar(_P_P_PRISON, Player.GetPVar(_P_P_PRISON) + 1);
        // Player.SendMessage('发现（走路速度）不法行为，再次就要抓监狱啊！', 2);
        // Player.SendMessage('发现（走路速度）不法行为，再次就要抓监狱啊！', 2);
        // Player.SendMessage('发现（走路速度）不法行为，再次就要抓监狱啊！', 2);
        // Player.MessageBox('发现（走路速度）不法行为，再次就要抓监狱啊！')
        // Debug('玩家[' + Player.Name + ']因"走路速度"异常被抓进监狱，该玩家被抓[' + String(Player.GetNVar(_P_N_JAIL)) + ']次')
        Player.SendMessage('发现（走路速度）不法行为,石化60秒！', 2);
        Player.SetState(5,60,0)
        Player.SetPVar(_P_P_WALK, 0);
        console.log('发现（走路速度）不法行为,石化60秒！', Player.Name)
    } else {
        Player.SetPVar(_P_P_WALK, 0);
    }
}

