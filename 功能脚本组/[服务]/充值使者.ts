import { 装备属性统计 } from '../../性能优化/index_智能优化';
import { 特效 } from "../../_核心部分/基础常量";

/*充值使者*/
const myDate = new Date();
const year = myDate.getFullYear(); // 获取当前年
const mon = myDate.getMonth() + 1; // 获取当前月
const date = myDate.getDate(); // 获取当前日
const hours = myDate.getHours(); // 获取当前小时
const minutes = myDate.getMinutes(); // 获取当前分钟
const seconds = myDate.getSeconds(); // 获取当前秒
const now = year + '-' + mon + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
export let G_GoldLocked: boolean = false
export function setG_GoldLocked(val: boolean) {
    G_GoldLocked = val
}



export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.宣传累充 ??= 0
    let S = ``
    S = `\\\\\\\\
    {S=${Player.GetName()};C=251}你好,欢迎来到{S=${GameLib.ServerName};C=251},很高兴为您服务!\\\\
    当前服务器状态为: ${GameLib.V.判断新区 === false ? '{S=新区;C=254}' : '{S=老区;C=251}'}\\\\
    每次宣传可累计宣传次数,宣传次数可兑换多种赞助物品!!!\\\\
    群礼包码可获得  {S=『1级』经验勋章;AC=251,249,222,210}\\\\


    <{S=群礼包码领取;C=251;X=300;Y=170}/@@InputInteger1>
    <{S=宣传次数兑换;C=251;X=300;Y=200}/@次数兑换>
    <{S=宣传码兑换;C=251;X=300;Y=230}/@@充值使者.InputInteger2(输入宣传码)>

`
    Npc.SayEx(Player, 'NPC小窗口', S);
    Player.V.每日宣传兑换次数 ??= 0
}

export function InputInteger2(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 宣传码 = Args.Str[0];

    // 验证宣传码长度
    if (宣传码.length > 16) {
        Player.MessageBox('宣传码长度不能超过16位');
        return;
    }

    // 宣传码配置
    const 宣传码配置 = [
        { 文件路径: '../../宣传码/宣传码.txt', 名称: '普通宣传码', 倍数: 1 },
        { 文件路径: '../../宣传码/雪儿宣传码.txt', 名称: '雪儿宣传码', 倍数: 1 },
        { 文件路径: '../../宣传码/5倍宣传码.txt', 名称: '5倍宣传码', 倍数: 5 },
        { 文件路径: '../../宣传码/10倍宣传码.txt', 名称: '10倍宣传码', 倍数: 10 },
        { 文件路径: '../../宣传码/50倍宣传码.txt', 名称: '50倍宣传码', 倍数: 50 },
        { 文件路径: '../../宣传码/100倍宣传码.txt', 名称: '100倍宣传码', 倍数: 100 },

    ];

    // 遍历检查各种宣传码
    for (const 配置 of 宣传码配置) {
        if (Player.CheckTextList(配置.文件路径, 宣传码)) {
            // 记录使用日志
            const 使用记录 = `当前宣传码:${宣传码} 时间:${now} 账号:${Player.GetAccount()} IP:${Player.GetIPAddress()} 角色名:${Player.GetName()} 已领次数:${Player.V.宣传次数} 类型:${配置.名称}`;
            Player.AddTextList('../../已领宣传码.txt', 使用记录);

            // 从可用列表中删除
            Player.DelTextList(配置.文件路径, 宣传码);

            // 给予奖励
            Player.V.宣传次数 += 配置.倍数;
            
            GameLib.BroadcastSay(format('玩家【{S=%s;C=250}】成功使用{S=%s;C=249},宣传次数+{S=%d;C=249}', [Player.Name, 配置.名称, 配置.倍数]), 249, 255);
            GameLib.BroadcastSay(format('玩家【{S=%s;C=250}】成功使用{S=%s;C=249},宣传次数+{S=%d;C=249}', [Player.Name, 配置.名称, 配置.倍数]), 249, 255);
            Player.MessageBox(`兑换成功，宣传次数+${配置.倍数}`);
            return;
        }
    }

    // 所有宣传码都无效
    Player.MessageBox('无效的宣传码或已被使用');
}

export function InputInteger1(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.宣传奖励 ??= false
    if (Args.Str[0] == 'TXJ666888' && Player.V.宣传奖励 == false) {

        let 勋章 = Player.GiveItem('经验勋章');

        勋章.SetOutWay1(0, 1);
        勋章.SetOutWay2(0, 0);
        勋章.SetOutWay3(0, 500);

        勋章.Rename(`『1级』经验勋章`);
        勋章.SetBind(true);
        勋章.SetNeverDrop(true);
        勋章.State.SetNoDrop(true);
        Player.UpdateItem(勋章);
        Player.V.宣传奖励 = true
        Player.MessageBox('恭喜你成功领取群礼包码！');
    } else {
        Player.MessageBox('礼包码错误或已领取')
    }
}

export function 次数兑换(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    GameLib.V.每日宣传兑换次数 ??= {}
    GameLib.V.每日宣传兑换次数[Player.GetName()] ??= 0
    const S = `\\\\\\\\
    {S=${Player.GetName()};C=251}你好,欢迎来到{S=${GameLib.ServerName};C=251},很高兴为您服务!\\
    您当前宣传次数为: ${Player.V.宣传次数} \\\\
    <{S=宣传1次兑换1真实充值;HINT=仅增加充值,不增加货币#92每日最高150次}/@次数(1)>        <{S=宣传1次的兑换10礼卷;HINT=无每日限制}/@次数(2)>\\\\
    <{S=宣传5次兑换1%回收加成;HINT=最高可兑换500次#92无每日限制}/@次数(5)>       <{S=宣传10次的兑换100礼卷;HINT=无每日限制}/@次数(3)>\\\\
    <{S=宣传10次兑换1%爆率加成;HINT=最高可兑换300次#92无每日限制}/@次数(6)>      <{S=宣传20次兑换1%鞭尸几率;HINT=最高兑换50次}/@次数(4)>\\\\
    <{S=宣传15次兑换1%极品加成;HINT=最高可兑换200次#92无每日限制}/@次数(7)>      <{S=宣传10次兑换10真实充值;HINT=仅增加充值,不增加货币#92每日最高15次}/@次数(8)> 
    
    `
    // Player.R.伤害提示 = true;
    Npc.SayEx(Player, 'NPC小窗口', S);
}

export function 次数(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    Player.V.鞭尸兑换次数 ??= 0
    Player.V.极品兑换次数 ??= 0
    Player.V.爆率兑换次数 ??= 0
    Player.V.回收兑换次数 ??= 0

    switch (Args.Int[0]) {
        case 1:
            if (GameLib.V.每日宣传兑换次数[Player.GetName()] >= 150) {
                Player.MessageBox('每日最多可兑换150次');
                return;
            }
            if (Player.V.宣传次数 >= 1) {
                Player.V.宣传次数 -= 1;
                Player.V.真实充值 += 1;
                Player.V.宣传累充 += 1;
                GameLib.V.每日宣传兑换次数[Player.GetName()] = GameLib.V.每日宣传兑换次数[Player.GetName()] + 1;
                Player.MessageBox("兑换成功，获得1元真实充值");
            } else {
                Player.MessageBox("您的宣传次数不足1次");
            }
            次数兑换(Npc, Player, Args);
            装备属性统计(Player,undefined,undefined,undefined)
            break;
        case 2:
            if (Player.V.宣传次数 >= 1) {
                Player.V.宣传次数 -= 1;
                Player.GamePoint += 10
                Player.GoldChanged()
                Player.MessageBox("兑换成功，获得10礼卷");
            } else {
                Player.MessageBox("您的宣传次数不足1次");
            }
            次数兑换(Npc, Player, Args);
            // 装备属性统计(Player,undefined,undefined,undefined)
            break;
        case 3:
            if (Player.V.宣传次数 >= 10) {
                Player.V.宣传次数 -= 10;
                Player.GamePoint += 100
                Player.GoldChanged()
                Player.MessageBox("兑换成功，获得100礼卷");
            } else {
                Player.MessageBox("您的宣传次数不足10次");
            }
            次数兑换(Npc, Player, Args);
            // 装备属性统计(Player,undefined,undefined,undefined)
            break;
        case 4:
            if (Player.V.宣传次数 >= 20 && Player.V.鞭尸兑换次数 < 50) {
                Player.V.宣传次数 -= 20;
                Player.V.鞭尸几率 += 1
                Player.V.鞭尸兑换次数 += 1
                Player.MessageBox("兑换成功，获得1%鞭尸几率");
            } else {
                Player.MessageBox("您的宣传次数不足20次或已达到50次");
            }
            次数兑换(Npc, Player, Args);
            装备属性统计(Player, undefined, undefined, undefined)
            break;
        case 5:
            if (Player.V.宣传次数 >= 5 && Player.V.回收兑换次数 < 500) {
                Player.V.宣传次数 -= 5;
                Player.V.宣传回收 += 1
                Player.V.回收兑换次数 += 1
                Player.MessageBox("兑换成功，获得1%回收加成");
            } else {
                Player.MessageBox("您的宣传次数不足5次或已达到500次");
            }
            次数兑换(Npc, Player, Args);
            装备属性统计(Player, undefined, undefined, undefined)
            break;
        case 6:
            if (Player.V.宣传次数 >= 10 && Player.V.爆率兑换次数 < 300) {
                Player.V.宣传次数 -= 10;
                Player.V.宣传爆率 += 1
                Player.V.爆率兑换次数 += 1
                Player.MessageBox("兑换成功，获得1%爆率加成");
            } else {
                Player.MessageBox("您的宣传次数不足10次或已达到300次");
            }
            次数兑换(Npc, Player, Args);
            装备属性统计(Player, undefined, undefined, undefined)
            break;
        case 7:
            if (Player.V.宣传次数 >= 15 && Player.V.极品兑换次数 < 200) {
                Player.V.宣传次数 -= 15;
                Player.V.宣传极品率 += 1
                Player.V.极品兑换次数 += 1
                Player.MessageBox("兑换成功，获得1%极品加成");
            } else {
                Player.MessageBox("您的宣传次数不足15次或已达到200次");
            }
            次数兑换(Npc, Player, Args);
            装备属性统计(Player, undefined, undefined, undefined)
            break;
        case 8:
            if (Player.V.宣传次数 >= 10 && GameLib.V.每日宣传兑换次数[Player.GetName()] <= 140) {
                Player.V.宣传次数 -= 10;
                Player.V.真实充值 += 10;
                Player.V.宣传累充 += 10;
                GameLib.V.每日宣传兑换次数[Player.GetName()] = GameLib.V.每日宣传兑换次数[Player.GetName()] + 10;
                Player.MessageBox("兑换成功，获得10真实充值");
            } else {
                Player.MessageBox("您的宣传次数不足10次或今日已达到150次");
            }
            次数兑换(Npc, Player, Args);
            装备属性统计(Player, undefined, undefined, undefined)
            break;
    }
}

// export function Main1(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

//     let S = ``
//         S = `\\\\\\\\
//     {S=${Player.GetName()};C=251}你好,欢迎来到{S=${GameLib.ServerName};C=251},很高兴为您服务!\\
//     当前服务器状态为: ${GameLib.V.判断新区 === false ? '{S=新区;C=254}' : '{S=老区;C=251}'}\\
//     ------------注意充值事项------------\\
//     ①本服捐增比例为:1元=1点充值+100点礼券(新区享双倍福利)\\
//     ②申明:本服捐赠渠道只有联系群客服,具体事宜都可咨询客服解决!!\\\\\\\\
//     <领取充值/@DoObtainGold>          <点击充值/@充值>    
// `
//     Npc.SayEx(Player, 'NPC小窗口', S);
// }

export function 测试领取(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.测试领取啊 ??= false
    if (Player.V.测试领取啊) { Player.MessageBox(`1人最多领取一次`); return }
    Player.V.测试领取啊 = true
    Player.V.真实充值 = Player.V.真实充值 + 10
    Player.GamePoint = Player.GamePoint + 100
    Player.MessageBox(`领取完毕`)

}
export function 充值(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 网站 = ''
    let 路径 = ''


    // if (GameLib.GetServerName().includes('修魔传说')) {
    //     网站 = "https://lwxy1.170o.com/Recharge/Group/S1A"  //老头
    //     路径 = 'D:\\MirServer_New开始制作老头01\\Mir200\\Envir\\QuestDiary\\641pay充值灵符\\灵符\\%d.txt'
    // }

    // if (GameLib.GetServerName().includes('魔幻传说')) {
    //     网站 = "https://lwxy1.170o.com/Recharge/Group/by1"  //电脑
    //     路径 = 'D:\\MirServer_New开始制作电脑01\\Mir200\\Envir\\QuestDiary\\64p1ay充值灵符\\灵符\\%d.txt'
    // }



    // if (GameLib.GetServerName().includes('恶魔法则')) {
    //     网站 = "http://cqzfpay.com/game/group/8830AFEC2E2569A8"  //小怪兽
    //     路径 = 'D:\\MirServer恶魔法则\\Mir200\\Envir\\QuestDiary\\76pay充值元宝\\元宝\\%d.txt'
    // }
    // if (GameLib.GetServerName().includes('暗黑12职业')) {//菜鸟
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/Ayk"
    //     路径 = 'D:\\MirServer_New开始制作菜鸟01\\Mir200\\Envir\\QuestDiary\\64p1ay充值灵符\\灵符\\%d.txt'
    // }
    // if (GameLib.GetServerName().includes('暗黑联盟')) {//羊羊
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/k1y"
    //     路径 = 'D:\\MirServer_New开始制作羊羊01\\Mir200\\Envir\\QuestDiary\\64pa1y充值灵符\\灵符\\%d.txt'
    // }
    // if (GameLib.GetServerName().includes('12职业恶魔法则')) {//彼岸花
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/vwy"
    //     路径 = 'D:\\MirServer_New开始制作彼岸花01\\Mir200\\Envir\\QuestDiary\\64pa1y充值灵符\\灵符\\%d.txt'
    // }
    // if (GameLib.GetServerName().includes('魔鬼暗黑')) {//彼岸花
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/GI1"
    //     路径 = 'D:\\MirServer_New开始制作奋斗01\\Mir200\\Envir\\QuestDiary\\64p1ay充值灵符\\灵符\\%d.txt'
    // }
    // if (GameLib.GetServerName().includes('暗黑起源')) {//天影怒斩
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/1M0"
    //     路径 = 'D:\\MirServer_New开始制作暗黑起源01\\Mir200\\Envir\\QuestDiary\\641pay充值灵符\\灵符\\%d.txt'
    // }
    // Npc.CloseDialog(Player)
    // Player.OpenURL(网站, 0, 0)
    Player.MessageBox(`请联系管理员`)
}

export function InPutString22(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const str: string = Args.Str[0]
    const list: string[] = str.split('-')   //字符串转数字 以,分割  也就是说[数组1,数组2,,数组3,.......]
    let PlayerName = list[0] //数组1 也就是从0开始
    let 职业 = list[1]
    let a: TPlayObject = GameLib.FindPlayer(PlayerName);
    if (a != null) {
        a.V.战神 = false
        a.V.骑士 = false
        a.V.火神 = false
        a.V.冰法 = false
        a.V.驯兽师 = false
        a.V.牧师 = false
        a.V.神射手 = false
        a.V.猎人 = false
        a.V.刺客 = false
        a.V.鬼舞者 = false
        a.V.武僧 = false
        a.V.罗汉 = false
        a.V.轮回次数 = 0
        a.V.战神觉醒 = false
        a.V.战神强化等级 = 0
        a.V.战神学习基础 = false
        a.V.战神学习高级 = false
        a.V.罗汉宝宝进化 = false
        a.ClearSkill()
        a.RecalcAbilitys()
        a.AddSkill('心灵召唤');
        a.AddSkill('查看属性');
        a.AddSkill('嘲讽吸怪');
        switch (职业) {
            case '战神':
                a.AddSkill('基本剑术', 3);
                a.AddSkill('攻杀剑术', 3);
                a.AddSkill('刺杀剑术', 3);
                a.AddSkill('狂怒');
                a.AddSkill('战神附体');
                a.SetJob(0)
                a.V.战神 = true
                break
            case '骑士':
                a.AddSkill('基本剑术', 3);
                a.AddSkill('攻杀剑术', 3);
                a.AddSkill('刺杀剑术', 3);
                a.AddSkill('圣光打击');
                a.AddSkill('防御姿态');
                a.SetJob(0)
                a.V.骑士 = true
                break
            case '火神':
                a.AddSkill('雷电术', 3);
                a.AddSkill('冰咆哮', 3);
                a.AddSkill('法术奥义');
                a.AddSkill('闪现');
                a.SetJob(1)
                a.V.火神 = true
                break
            case '冰法':
                a.AddSkill('雷电术', 3);
                a.AddSkill('冰咆哮', 3);
                a.AddSkill('暴风雨');
                a.AddSkill('打击符文');
                a.SetJob(1)
                a.V.冰法 = true
                break
            case '驯兽师':
                a.AddSkill('精神力战法', 3);
                a.AddSkill('灵魂火符', 3);
                a.AddSkill('施毒术', 3);
                a.AddSkill('飓风破', 3);
                a.AddSkill('萌萌浣熊');
                a.AddSkill('凶猛野兽');
                a.V.驯兽师 = true
                a.SetJob(2)
                break
            case '牧师':
                a.AddSkill('精神力战法', 3);
                a.AddSkill('灵魂火符', 3);
                a.AddSkill('施毒术', 3);
                a.AddSkill('飓风破', 3);
                a.AddSkill('剧毒火海');
                a.AddSkill('妙手回春');
                a.SetJob(2)
                a.V.牧师 = true
                break
            case '刺客':
                a.AddSkill('精准术', 3);
                a.AddSkill('霜月X', 3);
                a.AddSkill('潜行', 3);
                a.AddSkill('弱点');
                a.SetJob(3)
                a.V.刺客 = true
                break
            case '鬼舞者':
                a.AddSkill('精准术', 3);
                a.AddSkill('霜月X', 3);
                a.AddSkill('鬼舞斩');
                a.AddSkill('鬼舞者');
                a.SetJob(3)
                a.V.鬼舞者 = true
                break
            case '神射手':
                a.AddSkill('精准箭术', 3);
                a.AddSkill('天罡震气', 3);
                a.AddSkill('成长');
                a.AddSkill('万箭齐发');
                a.SetJob(4)
                a.V.神射手 = true
                break
            case '猎人':
                a.AddSkill('精准箭术', 3);
                a.AddSkill('天罡震气', 3);
                a.AddSkill('分裂箭');
                a.AddSkill('召唤宠物');
                a.SetJob(4)
                a.V.猎人 = true
                break
            case '武僧':
                a.AddSkill('罗汉棍法', 3);
                a.AddSkill('达摩棍法', 3);
                a.AddSkill('天雷阵');
                a.AddSkill('护法灭魔');
                a.SetJob(5)
                a.V.武僧 = true
                // a.ShowEffectEx2(特效.武僧天雷阵, -10, 20, true, 99999)
                break
            case '罗汉':
                a.AddSkill('罗汉棍法', 3);
                a.AddSkill('达摩棍法', 3);
                a.AddSkill('金刚护法');
                a.AddSkill('转生');
                a.SetJob(5)
                a.V.罗汉 = true
                break
            default: Player.MessageBox('职业输入的不正确'); return
        }
        a.MessageBox('转职完毕,请从新登录游戏!')
        a.RecalcAbilitys()
        装备属性统计(a, undefined, undefined, undefined);
        a.Kick()
    } else { Player.MessageBox('玩家名字不正确') }
}

export function CheckAccount(TxtFile: string, Account: string, Rate: number): number {
    let LS: TStringList
    let ASum = 0
    let TAccountList: TStringList
    let Result: number = 0;

    if (GameLib.FileExists(TxtFile)) {
        LS = GameLib.CreateStringList()
        TAccountList = GameLib.CreateStringList()
        ASum = 0
        try {
            LS.LoadFromFile(TxtFile)
            for (let I = 0; I <= LS.Count - 1; I++) {
                if ((LS.GetStrings(I).length > 0) && (LS.GetStrings(I) == Account)) {
                    ASum++
                } else if (LS.GetStrings(I).length > 0) {
                    TAccountList.Add(LS.GetStrings(I))
                }
            }
            if (ASum > 0) {
                TAccountList.SaveToFile(TxtFile)
            }
            Result = ASum * Rate
        } finally {
        };
    }
    return Result
}

export function DoObtainGold(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 网站 = ''
    let 路径 = 'D:\\充值\\' + GameLib.GetServerName() + '\\%d.txt'
    // if (GameLib.GetServerName().includes('无限')) {
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/4yE"  //
    //     路径 = 'D:\\充值\\%d.txt'
    // }
    // else if (GameLib.GetServerName().includes('恶魔法则')) {
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/4yE"  //小怪兽 } 
    //     路径 = 'D:\\MirServer_New开始制作\\Mir200\\Envir\\QuestDiary\\64p1ay充值灵符\\灵符\\%d.txt'
    // } else if (GameLib.GetServerName().includes('暗黑12职业')) {//菜鸟
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/Ayk"
    //     路径 = 'D:\\MirServer_New开始制作菜鸟01\\Mir200\\Envir\\QuestDiary\\64pa1y充值灵符\\灵符\\%d.txt'
    // } else if (GameLib.GetServerName().includes('暗黑联盟')) {//羊羊
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/k1y"
    //     路径 = 'D:\\MirServer_New开始制作羊羊01\\Mir200\\Envir\\QuestDiary\\64p1ay充值灵符\\灵符\\%d.txt'
    // } else if (GameLib.GetServerName().includes('12职业恶魔法则')) {//彼岸花1
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/vwy"
    //     路径 = 'D:\\MirServer_New开始制作彼岸花01\\Mir200\\Envir\\QuestDiary\\641ay充值灵符\\灵符\\%d.txt'
    // } else if (GameLib.GetServerName().includes('魔鬼暗黑')) {//奋斗
    //     网站 = "https://lwxy1.1710o.com/Recharge/Group/GI1"
    //     路径 = 'D:\\MirServer_New开始制作奋斗01\\Mir200\\Envir\\QuestDiary\\64pa1y充值灵符\\灵符\\%d.txt'
    // } else if (GameLib.GetServerName().includes('暗黑起源')) {//天影怒斩
    //     网站 = "https://lwxy1.170o1.com/Recharge/Group/1M0"
    //     路径 = 'D:\\MirServer_New开始制作暗黑起源01\\Mir200\\Envir\\QuestDiary\\64p1ay充值灵符\\灵符\\%d.txt'
    // } else if (GameLib.GetServerName().includes('修魔传说')) {
    //     网站 = "https://lwxy1.170o.com/Rec1harge/Group/S1A"  //老头
    //     路径 = 'D:\\MirServer_New开始制作老头01\\Mir200\\Envir\\QuestDiary\\641pay充值灵符\\灵符\\%d.txt'
    // } else {
    //     网站 = "https://lwxy1.170o.com/Recharge/Group/kpy"
    //     路径 = 'Envir\\QuestDiary\\64pay充值灵符\\灵符\\%d.txt'
    // }

    let 数量 = 0
    let 礼卷 = 0
    let 真实充值 = 0
    let FList = [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 20, 30, 40, 50, 60, 70, 80, 90,
        100, 200, 300, 400, 500, 600, 700, 800, 900,
        1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000,
        10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000,
        100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000,
        1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000,
    ]
    if (G_GoldLocked) {
        Player.SendCenterMessage('我正在为其他玩家发放赞助回馈，请稍后。', 0)
        return
    }
    setG_GoldLocked(true)
    try {
        for (let I = 0; I <= FList.length - 1; I++) {
            数量 = 数量 + CheckAccount(format(路径, [FList[I]]), Player.Account, FList[I])
        }
        if (数量 > 0) {
            Player.V.累计领取次数 ??= 0
            礼卷 = Math.floor(数量 * 1) * 20
            真实充值 = Math.floor(数量 * 1)
            Player.V.真实充值 += 真实充值
            Player.GamePoint += 礼卷
            Player.GoldChanged()
            Player.SendCenterMessage(`领取成功，一共领取:${礼卷}点礼卷,${真实充值}点真实充值...`, 0)
            Player.V.累计领取次数 = Player.V.累计领取次数 + 1
            Player.AddTextList('D:\\领取充值\\已领充值.txt', '服务器：' + GameLib.GetServerName() + ',当前领取金额:' + 礼卷 + '时间:' + now + '账号：' + Player.GetAccount() + 'IP：' + Player.GetIPAddress() + '角色名' + Player.GetName() + '总共领取金额' + Player.V.真实充值 + '累计领取次数' + Player.V.累计领取次数);
            GameLib.BroadcastSay(`【系统】:玩家${Player.GetName()}领取了${礼卷}点礼卷,${真实充值}点真实充值`, 249, 255);
            Npc.CloseDialog(Player)
        }
        else {
            Player.SendCenterMessage('领取失败，暂时没有你的充值信息。', 0)
        }
    } finally {
        setG_GoldLocked(false)
        FList = []
    };
    Main(Npc, Player, null);
}