const myDate = new Date();
const year = myDate.getFullYear(); // 获取当前年
const mon = myDate.getMonth() + 1; // 获取当前月
const date = myDate.getDate(); // 获取当前日
const hours = myDate.getHours(); // 获取当前小时
const minutes = myDate.getMinutes(); // 获取当前分钟
const seconds = myDate.getSeconds(); // 获取当前秒
const now = year + '-' + mon + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const S = `\\\\\\\\\\
    1.去群文件下载宣传图片，发到相应数量的群.\\
    2.把宣传截图给群主，群主审核给你发放宣传码.\\
    3.输入宣传码到下方的输入框中，领取宣传奖励.\\
    4.宣传的群必须是传奇开区群,宣传,讨论,广告群等无效.\\
    {S=---------------------------------------------------------------------------;C=90}\\
    第一次宣传5个群:赠送全屏拾取+自动回收+真实充值*10+元宝*10000\\
    第二次宣传5个群:治疗药水*388,玄玉*5,生灵之息*10+真实充值*10+元宝*10000\\
    第三次宣传5个群:灵力*500,击杀小怪时增加%5的boss副本触发率+真实充值*10+元宝*10000\\
    第四次宣传5个群:赠送宣传纹佩+真实充值*10+元宝*10000\\
    后续每次宣传5个群:\\
    灵力*1000,玄玉*20,生灵之息*10,BUFF洗炼卡*1,元素符语洗炼卡*1,真实充值*10+元宝*10000\\
    {S=---------------------------------------------------------------------------;C=90}\\
    {S=注意;C=21}{S=领取奖励时包裹请留点空隙,否则可能会领取不到部分奖励!;C=251}\\\\\\
            <宣传领奖/@@InputInteger>           <离  开/@_GN_Close.exit>
`
    let Msg = S
    let Item: TUserItem
    Item = GameLib.CreateUserItemByName('宣传纹佩')
    if (Item != null) {
        Item.SetOutWay1(0, 520)
        Item.SetOutWay1(1, 521)
        Item.SetBind(true)
        Item.SetNeverDrop(true)
        Item.State.SetNoDrop(true)
    }
    Msg += format('<{U=%s;x=350;y=80}>\\', [Item.MakeString()])
    GameLib.DestoryUserItem(Item, true)
    Npc.SayEx(Player, 'NPC大窗口', Msg)
}

export function InputInteger(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let Item: TUserItem
    if (Args.Str[0].length <= 16) {
        if (Player.CheckTextList('D:\\宣传码\\宣传码.txt', Args.Str[0])) {
            Player.DelTextList('D:\\宣传码\\宣传码.txt', Args.Str[0]);
            Player.AddTextList('D:\\宣传码\\已领宣传码.txt', '当前宣传码:' + Args.Str[0] + '时间:' + now + '账号：' + Player.GetAccount() + 'IP：' + Player.GetIPAddress() + '角色名' + Player.GetName());
        } else {
            Player.MessageBox('没有此码，如有错误请联系管理员。')
        }

    } else {
        Player.MessageBox('您提交的宣传码无效！')
    }
}