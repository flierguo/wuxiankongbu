import * as 功能 from '../_功能'
// import * as 交易市场 from "../../功能脚本组/[服务]/延时跳转"



const g = {
    //在售数量
    在售数: "在售数",
    出售计数: "出售计数", // 大于5个以后, 开始永久收费, 一个5元宝

    //订单状态
    出售中: 0,
    已售出: 1,
    完成: 2,
    主动取回: 3,
    超时: -1,

    //交易中心显示类型
    全部商品: 0,
    出售列表: 1,
    盔甲: 2,
    武器: 3,
    头盔: 4,
    项链: 5,
    手镯: 6,
    戒指: 7,
    腰带: 8,
    靴子: 9,
    时装: 10,
    材料: 11,

    类型: {
        盔甲: 0,
        武器: 1,
        头盔: 2,
        项链: 3,
        手镯: 4,
        戒指: 5,
        腰带: 6,
        靴子: 7,
        时装: 8,
        材料: 9,
    }
}


export function Main(Player: TPlayObject): void {
    显示交易中心(Player, 0, g.全部商品)
    // 显示交易中心(Player, 0)
}
export function 翻页(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 页码 = Args.Int[0]
    let 类型 = Args.Int[1]
    显示交易中心(Player, 页码, 类型)
}


function 读数据库(Player: TPlayObject, 显示类型: number): TDataSet {
    let 语句 = ""
    switch (显示类型) {
        case g.全部商品:
            语句 = `SELECT * FROM 交易中心 WHERE server = '${GameLib.ServerName}' AND 订单状态 = ${g.出售中}`
            break;
        case g.出售列表:
            语句 = `SELECT * FROM 交易中心 WHERE server = '${GameLib.ServerName}' AND 订单状态 != ${g.完成} AND 订单状态 != ${g.主动取回} and 出售人 = '${Player.Name}'`
            break;
        case g.盔甲:
            语句 = `SELECT * FROM 交易中心 WHERE server = '${GameLib.ServerName}' AND 订单状态 = ${g.出售中} and 物品类型 = ${g.类型.盔甲}`
            break;
        case g.武器:
            语句 = `SELECT * FROM 交易中心 WHERE server = '${GameLib.ServerName}' AND 订单状态 = ${g.出售中} and 物品类型 = ${g.类型.武器}`
            break;
        case g.头盔:
            语句 = `SELECT * FROM 交易中心 WHERE server = '${GameLib.ServerName}' AND 订单状态 = ${g.出售中} and 物品类型 = ${g.类型.头盔}`
            break;
        case g.项链:
            语句 = `SELECT * FROM 交易中心 WHERE server = '${GameLib.ServerName}' AND 订单状态 = ${g.出售中} and 物品类型 = ${g.类型.项链}`
            break;
        case g.手镯:
            语句 = `SELECT * FROM 交易中心 WHERE server = '${GameLib.ServerName}' AND 订单状态 = ${g.出售中} and 物品类型 = ${g.类型.手镯}`
            break;
        case g.戒指:
            语句 = `SELECT * FROM 交易中心 WHERE server = '${GameLib.ServerName}' AND 订单状态 = ${g.出售中} and 物品类型 = ${g.类型.戒指}`
            break;
        case g.靴子:
            语句 = `SELECT * FROM 交易中心 WHERE server = '${GameLib.ServerName}' AND 订单状态 = ${g.出售中} and 物品类型 = ${g.类型.靴子}`
            break;
        case g.腰带:
            语句 = `SELECT * FROM 交易中心 WHERE server = '${GameLib.ServerName}' AND 订单状态 = ${g.出售中} and 物品类型 = ${g.类型.腰带}`
            break;
        case g.时装:
            语句 = `SELECT * FROM 交易中心 WHERE server = '${GameLib.ServerName}' AND 订单状态 = ${g.出售中} and 物品类型 = ${g.类型.时装}`
            break;
        case g.材料:
            语句 = `SELECT * FROM 交易中心 WHERE server = '${GameLib.ServerName}' AND 订单状态 = ${g.出售中} and 物品类型 = ${g.类型.材料}`
            break;
        default:
            break;
    }
    return GameLib.DBEngine.Query('数据库', 语句)
}
function 显示交易中心(Player: TPlayObject, 页码: number, 显示类型: number) {
    // GameLib.V.时间[Player.GetName()] ??= {}
    let 商品列表: TDataSet = 读数据库(Player, 显示类型)

    //if (商品列表 == undefined) {
    //   功能.系统.信息框(Player, "交易中心维护中")
    //  return
    // }

    商品列表.Open()
    let str = ""
    let 物品总数 = 商品列表.RecordCount  //数据库条数
    let 显示上限 = 7
    let 总页码 = Math.ceil(物品总数 / 显示上限)
    页码 = 页码 >= 总页码 - 1 ? 总页码 - 1 : 页码
    页码 = 页码 < 0 ? 0 : 页码
    let 索引头 = 页码 * 显示上限
    let 索引尾 = 页码 * 显示上限 + 显示上限
    let 索引 = -1


    for (let i = 0; i < 物品总数; i++) {
        // 遍历已经超过最大显示i了, 直接跳出循环, 节省资源
        if (i > 索引尾) {
            break
        }
        if (商品列表.IsEmpty() == true) {
            break
        }
        if (i >= 索引头 && i < 索引尾) {
            索引++
            //console.log(i, 索引头, 索引尾, 商品列表.FieldByName('物品名').AsString)

            let y = 索引 * 50 + 130
            let 序号 = i + 1
            // let 时间 = 0
            let 数据库ID = 商品列表.FieldByName('ID').AsInteger
            let 物品名 = 商品列表.FieldByName('物品名').AsString
            let 颜色 = 商品列表.FieldByName('物品颜色').AsInteger
            let 物品str = 商品列表.FieldByName('物品s1').AsString
            let 数量 = 商品列表.FieldByName('数量').AsInteger
            let 价格 = 商品列表.FieldByName('出售价格').AsInteger
            let 订单状态 = 商品列表.FieldByName('订单状态').AsInteger
            let 换算 = ""
            let 显示文字 = ""
            let 换算颜色 = 255
            let 价格颜色 = 255
            let 我的点券 = 功能.获取.钻石(Player)
            if (显示类型 == g.出售列表) {
                switch (订单状态) {
                    case g.出售中: 换算 = "出售中"; 换算颜色 = 255; 显示文字 = "取回"; break;
                    case g.已售出: 换算 = `已售出`; 换算颜色 = 250; 显示文字 = "取出点券"; break;
                    case g.超时: 换算 = "超时"; 换算颜色 = 249; 显示文字 = "取回"; break;
                }

            } else {
                换算 = 商品列表.FieldByName('换算').AsString
                if (我的点券 >= 价格) {
                    价格颜色 = 250
                } else {
                    价格颜色 = 249
                }

            }
            str += `
            
            {s=${序号};c=255;x=50;y=${y}}
            {s=${物品名};c=${颜色};x=110;y=${y}}
            {u=${物品str};x=215;y=${y}}
            {s=${数量};x=275;y=${y}}
            {s=${价格};x=340;y=${y};c=${价格颜色}}
            {s=${换算};x=420;y=${y};c=${换算颜色}}    
            `//(}元宝)
            if (显示类型 == g.出售列表) {
                //显示文字=取回     显示文字=取出元宝
                str += `<{s=${显示文字};x=580;y=${y}}/@交易中心.${显示文字}(${页码},${显示类型},${数据库ID})>`
                if (订单状态 == g.已售出) {
                    str += `{s=(收益：${Math.ceil(价格 * 0.9)} 点券);x=630;y=${y};c=250}`
                }
            } else {
                str += `<{s=购买;x=580;y=${y}}/@交易中心.购买(${页码},${显示类型},${数据库ID},${价格})>`
                // str += `{s=剩余时间:${时间};c=255;x=650;y=${y}}`

            }
        }
        商品列表.Next();
    }

    //释放会报 TActor::Run 1 0 81 错误
    //商品列表.Free()

    let 颜色 = 0
    let 全部物品 = ""
    let 我的出售 = ""
    let 标签 = ""
    let y = 索引 == -1 ? 490 : 478  //当前页面如果没物品会让Y坐标偏移,修复一下
    let y2 = 索引 == -1 ? 65 : 53  //当前页面如果没物品会让Y坐标偏移,修复一下
    // console.log(g.材料)
    // console.log(g.戒指)
    switch (显示类型) {
        case g.全部商品:
            颜色 = 251;
            全部物品 = `{s=全部物品;x=80;y=${y};c=236}`
            我的出售 = `<{s=我的出售;x=160;y=${y}}/@交易中心.翻页(0,${g.出售列表})>`
            标签 = `
            {s=[全部];x=80;y=${y2};c=236}
            <{s=[盔甲];x=120;y=${y2}}/@交易中心.翻页(0,${g.盔甲})>
            <{s=[武器];x=160;y=${y2}}/@交易中心.翻页(0,${g.武器})>
            <{s=[头盔];x=200;y=${y2}}/@交易中心.翻页(0,${g.头盔})>
            <{s=[项链];x=240;y=${y2}}/@交易中心.翻页(0,${g.项链})>
            <{s=[手镯];x=280;y=${y2}}/@交易中心.翻页(0,${g.手镯})>
            <{s=[戒指];x=320;y=${y2}}/@交易中心.翻页(0,${g.戒指})>
            <{s=[腰带];x=360;y=${y2}}/@交易中心.翻页(0,${g.腰带})>
            <{s=[靴子];x=400;y=${y2}}/@交易中心.翻页(0,${g.靴子})>
            <{s=[时装];x=440;y=${y2}}/@交易中心.翻页(0,${g.时装})>
            <{s=[材料];x=480;y=${y2}}/@交易中心.翻页(0,${g.材料})>
            `
            break;
        case g.出售列表:
            颜色 = 254;
            全部物品 = `<{s=全部物品;x=80;y=${y}}/@交易中心.翻页(0,${g.全部商品})>`
            我的出售 = `{s=我的出售;x=160;y=${y};c=236}`
            标签 = `
            `
            break;
        case g.盔甲:
            颜色 = 251;
            全部物品 = `<{s=全部物品;x=80;y=${y}}/@交易中心.翻页(0,${g.全部商品})>`
            我的出售 = `<{s=我的出售;x=160;y=${y}}/@交易中心.翻页(0,${g.出售列表})>`
            标签 = `
            <{s=[全部];x=80;y=${y2}}/@交易中心.翻页(0,${g.全部商品})>
            {s=[盔甲];x=120;y=${y2};c=236}
            <{s=[武器];x=160;y=${y2}}/@交易中心.翻页(0,${g.武器})>
            <{s=[头盔];x=200;y=${y2}}/@交易中心.翻页(0,${g.头盔})>
            <{s=[项链];x=240;y=${y2}}/@交易中心.翻页(0,${g.项链})>
            <{s=[手镯];x=280;y=${y2}}/@交易中心.翻页(0,${g.手镯})>
            <{s=[戒指];x=320;y=${y2}}/@交易中心.翻页(0,${g.戒指})>
            <{s=[腰带];x=360;y=${y2}}/@交易中心.翻页(0,${g.腰带})>
            <{s=[靴子];x=400;y=${y2}}/@交易中心.翻页(0,${g.靴子})>
            <{s=[时装];x=440;y=${y2}}/@交易中心.翻页(0,${g.时装})>
            <{s=[材料];x=480;y=${y2}}/@交易中心.翻页(0,${g.材料})>
            `
            break;
        case g.武器:
            颜色 = 251;
            全部物品 = `<{s=全部物品;x=80;y=${y}}/@交易中心.翻页(0,${g.全部商品})>`
            我的出售 = `<{s=我的出售;x=160;y=${y}}/@交易中心.翻页(0,${g.出售列表})>`
            标签 = `
            <{s=[全部];x=80;y=${y2}}/@交易中心.翻页(0,${g.全部商品})>
            <{s=[盔甲];x=120;y=${y2}}/@交易中心.翻页(0,${g.盔甲})>
            {s=[武器];x=160;y=${y2};c=236}
            <{s=[头盔];x=200;y=${y2}}/@交易中心.翻页(0,${g.头盔})>
            <{s=[项链];x=240;y=${y2}}/@交易中心.翻页(0,${g.项链})>
            <{s=[手镯];x=280;y=${y2}}/@交易中心.翻页(0,${g.手镯})>
            <{s=[戒指];x=320;y=${y2}}/@交易中心.翻页(0,${g.戒指})>
            <{s=[腰带];x=360;y=${y2}}/@交易中心.翻页(0,${g.腰带})>
            <{s=[靴子];x=400;y=${y2}}/@交易中心.翻页(0,${g.靴子})>
            <{s=[时装];x=440;y=${y2}}/@交易中心.翻页(0,${g.时装})>
            <{s=[材料];x=480;y=${y2}}/@交易中心.翻页(0,${g.材料})>
                `
            break;
        case g.头盔:
            颜色 = 251;
            全部物品 = `<{s=全部物品;x=80;y=${y}}/@交易中心.翻页(0,${g.全部商品})>`
            我的出售 = `<{s=我的出售;x=160;y=${y}}/@交易中心.翻页(0,${g.出售列表})>`
            标签 = `
            <{s=[全部];x=80;y=${y2}}/@交易中心.翻页(0,${g.全部商品})>
            <{s=[盔甲];x=120;y=${y2}}/@交易中心.翻页(0,${g.盔甲})>
            <{s=[武器];x=160;y=${y2}}/@交易中心.翻页(0,${g.武器})>
            {s=[头盔];x=200;y=${y2};c=236}
            <{s=[项链];x=240;y=${y2}}/@交易中心.翻页(0,${g.项链})>
            <{s=[手镯];x=280;y=${y2}}/@交易中心.翻页(0,${g.手镯})>
            <{s=[戒指];x=320;y=${y2}}/@交易中心.翻页(0,${g.戒指})>
            <{s=[腰带];x=360;y=${y2}}/@交易中心.翻页(0,${g.腰带})>
            <{s=[靴子];x=400;y=${y2}}/@交易中心.翻页(0,${g.靴子})>
            <{s=[时装];x=440;y=${y2}}/@交易中心.翻页(0,${g.时装})>
            <{s=[材料];x=480;y=${y2}}/@交易中心.翻页(0,${g.材料})>
                        `
            break;
        case g.项链:
            颜色 = 251;
            全部物品 = `<{s=全部物品;x=80;y=${y}}/@交易中心.翻页(0,${g.全部商品})>`
            我的出售 = `<{s=我的出售;x=160;y=${y}}/@交易中心.翻页(0,${g.出售列表})>`
            标签 = `
            <{s=[全部];x=80;y=${y2}}/@交易中心.翻页(0,${g.全部商品})>
            <{s=[盔甲];x=120;y=${y2}}/@交易中心.翻页(0,${g.盔甲})>
            <{s=[武器];x=160;y=${y2}}/@交易中心.翻页(0,${g.武器})>
            <{s=[头盔];x=200;y=${y2}}/@交易中心.翻页(0,${g.头盔})>
            {s=[项链];x=240;y=${y2};c=236}
            <{s=[手镯];x=280;y=${y2}}/@交易中心.翻页(0,${g.手镯})>
            <{s=[戒指];x=320;y=${y2}}/@交易中心.翻页(0,${g.戒指})>
            <{s=[腰带];x=360;y=${y2}}/@交易中心.翻页(0,${g.腰带})>
            <{s=[靴子];x=400;y=${y2}}/@交易中心.翻页(0,${g.靴子})>
            <{s=[时装];x=440;y=${y2}}/@交易中心.翻页(0,${g.时装})>
            <{s=[材料];x=480;y=${y2}}/@交易中心.翻页(0,${g.材料})>
    
                                `
            break;
        case g.手镯:
            颜色 = 251;
            全部物品 = `<{s=全部物品;x=80;y=${y}}/@交易中心.翻页(0,${g.全部商品})>`
            我的出售 = `<{s=我的出售;x=160;y=${y}}/@交易中心.翻页(0,${g.出售列表})>`
            标签 = `
            <{s=[全部];x=80;y=${y2}}/@交易中心.翻页(0,${g.全部商品})>
            <{s=[盔甲];x=120;y=${y2}}/@交易中心.翻页(0,${g.盔甲})>
            <{s=[武器];x=160;y=${y2}}/@交易中心.翻页(0,${g.武器})>
            <{s=[头盔];x=200;y=${y2}}/@交易中心.翻页(0,${g.头盔})>
            <{s=[项链];x=240;y=${y2}}/@交易中心.翻页(0,${g.项链})>
            {s=[手镯];x=280;y=${y2};c=236}
            <{s=[戒指];x=320;y=${y2}}/@交易中心.翻页(0,${g.戒指})>
            <{s=[腰带];x=360;y=${y2}}/@交易中心.翻页(0,${g.腰带})>
            <{s=[靴子];x=400;y=${y2}}/@交易中心.翻页(0,${g.靴子})>
            <{s=[时装];x=440;y=${y2}}/@交易中心.翻页(0,${g.时装})>
            <{s=[材料];x=480;y=${y2}}/@交易中心.翻页(0,${g.材料})>
            
                                        `
            break;
        case g.戒指:
            颜色 = 251;
            全部物品 = `<{s=全部物品;x=80;y=${y}}/@交易中心.翻页(0,${g.全部商品})>`
            我的出售 = `<{s=我的出售;x=160;y=${y}}/@交易中心.翻页(0,${g.出售列表})>`
            标签 = `
            <{s=[全部];x=80;y=${y2}}/@交易中心.翻页(0,${g.全部商品})>
            <{s=[盔甲];x=120;y=${y2}}/@交易中心.翻页(0,${g.盔甲})>
            <{s=[武器];x=160;y=${y2}}/@交易中心.翻页(0,${g.武器})>
            <{s=[头盔];x=200;y=${y2}}/@交易中心.翻页(0,${g.头盔})>
            <{s=[项链];x=240;y=${y2}}/@交易中心.翻页(0,${g.项链})>
            <{s=[手镯];x=280;y=${y2}}/@交易中心.翻页(0,${g.手镯})>
            {s=[戒指];x=320;y=${y2};c=236}
            <{s=[腰带];x=360;y=${y2}}/@交易中心.翻页(0,${g.腰带})>
            <{s=[靴子];x=400;y=${y2}}/@交易中心.翻页(0,${g.靴子})>
            <{s=[时装];x=440;y=${y2}}/@交易中心.翻页(0,${g.时装})>
            <{s=[材料];x=480;y=${y2}}/@交易中心.翻页(0,${g.材料})>
                
                                            `
            break;
        case g.腰带:
            颜色 = 251;
            全部物品 = `<{s=全部物品;x=80;y=${y}}/@交易中心.翻页(0,${g.全部商品})>`
            我的出售 = `<{s=我的出售;x=160;y=${y}}/@交易中心.翻页(0,${g.出售列表})>`
            标签 = `
            <{s=[全部];x=80;y=${y2}}/@交易中心.翻页(0,${g.全部商品})>
            <{s=[盔甲];x=120;y=${y2}}/@交易中心.翻页(0,${g.盔甲})>
            <{s=[武器];x=160;y=${y2}}/@交易中心.翻页(0,${g.武器})>
            <{s=[头盔];x=200;y=${y2}}/@交易中心.翻页(0,${g.头盔})>
            <{s=[项链];x=240;y=${y2}}/@交易中心.翻页(0,${g.项链})>
            <{s=[手镯];x=280;y=${y2}}/@交易中心.翻页(0,${g.手镯})>
            <{s=[戒指];x=320;y=${y2}}/@交易中心.翻页(0,${g.戒指})>
            {s=[腰带];x=360;y=${y2};c=236}
            <{s=[靴子];x=400;y=${y2}}/@交易中心.翻页(0,${g.靴子})>
            <{s=[时装];x=440;y=${y2}}/@交易中心.翻页(0,${g.时装})>
            <{s=[材料];x=480;y=${y2}}/@交易中心.翻页(0,${g.材料})>
                        
                                                    `
            break;
        case g.靴子:
            颜色 = 251;
            全部物品 = `<{s=全部物品;x=80;y=${y}}/@交易中心.翻页(0,${g.全部商品})>`
            我的出售 = `<{s=我的出售;x=160;y=${y}}/@交易中心.翻页(0,${g.出售列表})>`
            标签 = `
            <{s=[全部];x=80;y=${y2}}/@交易中心.翻页(0,${g.全部商品})>
            <{s=[盔甲];x=120;y=${y2}}/@交易中心.翻页(0,${g.盔甲})>
            <{s=[武器];x=160;y=${y2}}/@交易中心.翻页(0,${g.武器})>
            <{s=[头盔];x=200;y=${y2}}/@交易中心.翻页(0,${g.头盔})>
            <{s=[项链];x=240;y=${y2}}/@交易中心.翻页(0,${g.项链})>
            <{s=[手镯];x=280;y=${y2}}/@交易中心.翻页(0,${g.手镯})>
            <{s=[戒指];x=320;y=${y2}}/@交易中心.翻页(0,${g.戒指})>
            <{s=[腰带];x=360;y=${y2}}/@交易中心.翻页(0,${g.腰带})>
            {s=[靴子];x=400;y=${y2};c=236}
            <{s=[时装];x=440;y=${y2}}/@交易中心.翻页(0,${g.时装})>   
            <{s=[材料];x=480;y=${y2}}/@交易中心.翻页(0,${g.材料})>                       
                                                                    `
            break;
        case g.时装:
            颜色 = 251;
            全部物品 = `<{s=全部物品;x=80;y=${y}}/@交易中心.翻页(0,${g.全部商品})>`
            我的出售 = `<{s=我的出售;x=160;y=${y}}/@交易中心.翻页(0,${g.出售列表})>`
            标签 = `
            <{s=[全部];x=80;y=${y2}}/@交易中心.翻页(0,${g.全部商品})>
            <{s=[盔甲];x=120;y=${y2}}/@交易中心.翻页(0,${g.盔甲})>
            <{s=[武器];x=160;y=${y2}}/@交易中心.翻页(0,${g.武器})>
            <{s=[头盔];x=200;y=${y2}}/@交易中心.翻页(0,${g.头盔})>
            <{s=[项链];x=240;y=${y2}}/@交易中心.翻页(0,${g.项链})>
            <{s=[手镯];x=280;y=${y2}}/@交易中心.翻页(0,${g.手镯})>
            <{s=[戒指];x=320;y=${y2}}/@交易中心.翻页(0,${g.戒指})>
            <{s=[腰带];x=360;y=${y2}}/@交易中心.翻页(0,${g.腰带})>
            <{s=[靴子];x=400;y=${y2}}/@交易中心.翻页(0,${g.靴子})>       
            {s=[时装];x=440;y=${y2};c=236}      
            <{s=[材料];x=480;y=${y2}}/@交易中心.翻页(0,${g.材料})>   
                                                                            `
            break;
        case g.材料:
            颜色 = 251;
            全部物品 = `<{s=全部物品;x=80;y=${y}}/@交易中心.翻页(0,${g.全部商品})>`
            我的出售 = `<{s=我的出售;x=160;y=${y}}/@交易中心.翻页(0,${g.出售列表})>`
            标签 = `
             <{s=[全部];x=80;y=${y2}}/@交易中心.翻页(0,${g.全部商品})>
             <{s=[盔甲];x=120;y=${y2}}/@交易中心.翻页(0,${g.盔甲})>
             <{s=[武器];x=160;y=${y2}}/@交易中心.翻页(0,${g.武器})>
             <{s=[头盔];x=200;y=${y2}}/@交易中心.翻页(0,${g.头盔})>
             <{s=[项链];x=240;y=${y2}}/@交易中心.翻页(0,${g.项链})>
             <{s=[手镯];x=280;y=${y2}}/@交易中心.翻页(0,${g.手镯})>
             <{s=[戒指];x=320;y=${y2}}/@交易中心.翻页(0,${g.戒指})>
             <{s=[腰带];x=360;y=${y2}}/@交易中心.翻页(0,${g.腰带})>
             <{s=[靴子];x=400;y=${y2}}/@交易中心.翻页(0,${g.靴子})>       
             <{s=[时装];x=440;y=${y2}}/@交易中心.翻页(0,${g.时装})>      
             {s=[材料];x=480;y=${y2};c=236}
                                                                                `
            break;
    }
    str += `<&{s=上一页;x=560;y=${y};c=${颜色}}/@交易中心.翻页(${页码 - 1},${显示类型})>
    {s= ${页码 + 1}/${总页码}  ;x=610;y=${y}}
    <&{s=下一页;x=653;y=${y};c=${颜色}}/@交易中心.翻页(${页码 + 1},${显示类型})>
    <{s=上架物品;x=240;y=${y}}/@交易中心.弹出出售窗口>
    {s=筛选：;x=40;y=${y2};c=254}

   `
    str += 全部物品 + 我的出售 + 标签
    if (页码 == 0 || 索引 > -1) {
        Player.SayEx('交易中心', str)
    }


}
export function 取出点券(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    let 页码 = Args.Int[0]
    let 显示类型 = Args.Int[1]
    let 数据库ID = Args.Int[2]
    let 是否成功 = 订单.取出元宝(数据库ID, Player)

    if (是否成功 == false) {
        功能.系统.信息框(Player, "取出失败,请联系GM")
        return
    }

    Player.V[g.在售数]--
    Player.V[g.在售数] = Player.V[g.在售数] < 0 ? 0 : Player.V[g.在售数]


    显示交易中心(Player, 页码, 显示类型)


}
export function 取回(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    let 页码 = Args.Int[0]
    let 显示类型 = Args.Int[1]
    let 数据库ID = Args.Int[2]
    let 物品对象 = 订单.取回物品(数据库ID, Player)

    if (物品对象 == undefined) {
        功能.系统.信息框(Player, "取回物品失败, 请重试或联系GM")
        return
    }

    Player.AddItemToBag(物品对象)
    Player.SendMessage('取回:' + 物品对象.Name, 1)
    Player.V[g.在售数]--
    Player.V[g.在售数] = Player.V[g.在售数] < 0 ? 0 : Player.V[g.在售数]


    显示交易中心(Player, 页码, 显示类型)


}

export function 购买(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {


    let 页码 = Args.Int[0]
    let 显示类型 = Args.Int[1]
    let 数据库ID = Args.Int[2]
    let 出售价格 = Args.Int[3]
    let 物品名 = Args.Str[4]



    if (功能.获取.钻石(Player) < 出售价格) {
        Player.MessageBox('点券不足' + 出售价格 + ", 无法购买")
        return
    }
    if (订单.购买商品(数据库ID, Player, 出售价格) == true) {
        功能.扣除.钻石(Player, 出售价格, "交易中心购买,数据库ID:" + 数据库ID)
        Player.SendMessage('购买成功:' + 物品名, 1)
    } else {
        功能.系统.信息框(Player, "物品可能已经被别人买走了!")
    }



    显示交易中心(Player, 页码, 显示类型)
}

// function 从交易中心复制物品(params:type) {

// }


class 订单格式 {
    物品名: string
    物品对象: TUserItem
    出售人: string
    出售价格: number
    换算: string
    状态: string
}

const 订单 = {

    生成订单(Player: TPlayObject, Item: TUserItem, 出售价格: number): number {
        let 数量 = 是否为装备(Item) == true ? 1 : Item.Dura
        let 物品类型 = 0
        switch (true) {
            case Item.StdMode == 10 || Item.StdMode == 11: 物品类型 = g.类型.盔甲; break
            case Item.StdMode == 5 || Item.StdMode == 6: 物品类型 = g.类型.武器; break
            case Item.StdMode == 15: 物品类型 = g.类型.头盔; break
            case Item.StdMode == 19 || Item.StdMode == 20 || Item.StdMode == 21: 物品类型 = g.类型.项链; break
            case Item.StdMode == 24 || Item.StdMode == 26: 物品类型 = g.类型.手镯; break
            case Item.StdMode == 22 || Item.StdMode == 23: 物品类型 = g.类型.戒指; break
            case Item.StdMode == 27: 物品类型 = g.类型.腰带; break
            case Item.StdMode == 28: 物品类型 = g.类型.靴子; break
            case Item.StdMode == 17 || Item.StdMode == 18: 物品类型 = g.类型.时装; break
            default: 物品类型 = g.类型.材料; break
        }



        数量 = 数量 <= 0 ? 1 : 数量
        let 换算 = ""
        //物品s1 显示用    物品s2 转换对象用

        let 返回 = GameLib.DBEngine.ExecSQL('数据库', `INSERT INTO 交易中心 set
            server = '${GameLib.ServerName}',
            订单状态 = ${g.出售中},
            物品名 = '${Item.Name}',
            物品颜色 = ${Item.Color == 0 ? 255 : Item.Color},
            物品类型 = ${物品类型},
            数量 = ${数量},
            物品s1 ='${Item.MakeString()}',      
            物品s2 = '${GameLib.SaveUserItemToString(Item)}',   
            换算 = '${换算}', 
            出售时间 = now(),  
            出售价格 = ${出售价格},           
            出售人 = '${Player.Name}'`)

        return 返回

    },
    购买商品(ID: number, 购买人: TPlayObject, 出售价格: number): boolean {
        let 文本列表 = GameLib.CreateStringList()
        文本列表 = GameLib.DBEngine.ValueList('数据库', `SELECT 物品s2 FROM 交易中心 WHERE
        server = '${GameLib.ServerName}' AND 
        ID = ${ID} and 
        出售价格 = ${出售价格} and
        订单状态 = ${g.出售中}
        `);
        if (文本列表.Count == 1) { // 表示这个物品没有被卖出, 并且价格没问题, 没被封包
            //改变订单状态 !!!!!!!! 注意!!!  必须先在上一层函数里校验一下 包里的钱够不够, 只需要校验够不够就行, 其它我这里校验

            购买人.AddItemToBag(GameLib.LoadUserItemFromString(文本列表.GetStrings(0)))
            GameLib.DBEngine.ExecSQL('数据库', `UPDATE 交易中心 SET 
            订单状态 = ${g.已售出},
            购买人 = '${购买人.Name}',
            购买时间 = now()
            WHERE server = '${GameLib.ServerName}' AND ID = ${ID}`)
            return true
        } else {
            return false // 表示条件不满足, 可能已经被卖出, 可能被封包了校验失败, 不管是啥, 反正就返回假
        }

    },
    取回物品(ID: number, 取回人: TPlayObject): TUserItem {

        let 返回物品对象: TUserItem
        //先查询物品s2 ,如果查询到了  在改订单状态和取回时间, 然后把物品s2 转成物品对象返回
        let 文本列表 = GameLib.CreateStringList()
        文本列表 = GameLib.DBEngine.ValueList('数据库', `SELECT 物品s2 FROM 交易中心 WHERE 
        server = '${GameLib.ServerName}' AND
        订单状态 = ${g.出售中} and
        ID = ${ID} and 
        出售人 = '${取回人.Name}'`);
        if (文本列表.Count == 1) {
            //改取回状态
            let 错误代码 = GameLib.DBEngine.ExecSQL('数据库', `UPDATE 交易中心 SET 订单状态 = ${g.主动取回},取回时间 = now() WHERE server = '${GameLib.ServerName}' AND ID = ${ID}`)
            if (错误代码 == 1) {//1 = 无错误
                return GameLib.LoadUserItemFromString(文本列表.GetStrings(0))
            } else {
                return 返回物品对象
            }

        } else {
            return 返回物品对象
        }
    },

    取出元宝(ID: number, 取回人: TPlayObject): boolean {

        //先查询出售价格 ,如果查询到了  在改订单状态和取回时间
        let 文本列表 = GameLib.CreateStringList()
        文本列表 = GameLib.DBEngine.ValueList('数据库', `SELECT 出售价格 FROM 交易中心 WHERE 
        server = '${GameLib.ServerName}' AND
        订单状态 = ${g.已售出} and
        ID = ${ID} and 
        出售人 = '${取回人.Name}'`);
        if (文本列表.Count == 1) {
            //改取回状态
            let 错误代码 = GameLib.DBEngine.ExecSQL('数据库', `UPDATE 交易中心 SET 订单状态 = ${g.完成},取回时间 = now() WHERE server = '${GameLib.ServerName}' AND ID = ${ID}`)
            if (错误代码 == 1) {//1 = 无错误
                let 点券 = Number(文本列表.GetStrings(0))
                点券 = Math.ceil(点券 * 0.95) // 扣除5% 手续费
                功能.增加.钻石(取回人, 点券, "卖出物品,数据库ID:" + ID)
                取回人.SendMessage('成功取出: ' + 点券 + "点券, 祝老板生意兴隆, 发大财!", 1)
                return true
            } else {
                return false
            }

        } else {
            return false
        }
    },
}


function 是否为装备(物品对象: TUserItem): boolean {
    let strmode = [4, 5, 6, 7, 10, 11, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 33, 34, 35, 68]
    if (strmode.indexOf(物品对象.StdMode) > -1) {
        return true
    }
    return false
}


export function 弹出出售窗口(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 手续费 = Player.V[g.出售计数] <= 5 || Player.V[g.出售计数] == undefined ? 0 : 5
    let str = `
    {s=物品出售;x=137;y=15;c=254}
    {s=放入物品;x=41;y=145;c=251}
     {s=提示 ：;x=60;y=45;c=249}{s=交易市场的货币只支持点券;x=100;y=45;c=250}
     {s=手续费  ：;x=100;y=85;c=254}{s=交易成功收取10%的手续费;x=160;y=85;c=250}
    {s=出售价格 ：;x=100;y=112;c=254}`
    Npc.SayEx(Player, "交易中心卖物品", str)
}

export function 出售预览(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let Item: TUserItem
    let 放入的物品 = Player.GetCustomItem(0)
    let 出售价格 = Args.Int[0]
    if (放入的物品 == undefined) {
        功能.系统.信息框(Player, "请放入要出售的物品")
        return
    }
    // if (出售价格 <= 0) {
    //     功能.系统.信息框(Player, "请输入价格")
    //     return
    // }
    let 数量 = 是否为装备(放入的物品) == true ? 1 : 放入的物品.Dura
    数量 = 数量 <= 0 ? 1 : 数量
    // let 换算 = ""
    // if (Item.GetName() != '神农鼎①' && 数量 > 1 || Item.GetName() != '神农鼎②' && 数量 > 1 || Item.GetName() != '神农鼎③' && 数量 > 1 || Item.GetName() != '神农鼎④' && 数量 > 1 ||
    //     Item.GetName() != '神农鼎⑤' && 数量 > 1 || Item.GetName() != '神农鼎⑥' && 数量 > 1 || Item.GetName() != '神农鼎⑦' && 数量 > 1 || Item.GetName() != '神农鼎⑧' && 数量 > 1 ||
    //     Item.GetName() != '神农鼎⑨' && 数量 > 1 || Item.GetName() != '神农鼎MAX' && 数量 > 1
    // ) {
    //     换算 = "1元宝 = " + (数量 / 出售价格).toFixed(3) + "个"
    // }
    // 功能.系统.信息框(Player, `{s=出售的物品：}{s=${放入的物品.Name};c=${放入的物品.Color}}   {s=价格：${出售价格}}  {s=换算：}{s=${换算};c=250}`)

}
export function 出售物品(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.GetLevel() < 0) { Player.MessageBox('等级低于200级不允许出售物品'); return }
    let 放入的物品 = Player.GetCustomItem(0)
    let 出售价格 = Args.Int[0]
    let 手续费 = Player.V[g.出售计数] <= 5 || Player.V[g.出售计数] == undefined ? 0 : 5
    if (放入的物品 == undefined) {
        功能.系统.信息框(Player, "请放入要出售的物品")
        return
    }

    if (功能.背包.物品是否绑定(放入的物品) == true) {
        功能.系统.信息框(Player, "绑定物品无法上架")
        return
    }

    if (Player.V[g.在售数] >= 20) {
        功能.系统.信息框(Player, "你的在售物品已达到20个, 无法继续出售上架了")
        return
    }
    if (出售价格 <= 0) {
        功能.系统.信息框(Player, "请输入价格")
        return
    }
    // if (功能.获取.钻石(Player) < 手续费) {
    //     功能.系统.信息框(Player, "点券不足" + 手续费 + ", 无法上架")
    //     return
    // }


    // 功能.扣除.元宝(Player, 手续费, "上架" + 放入的物品.Name)
    let 数量 = 是否为装备(放入的物品) == true ? 1 : 放入的物品.Dura
    数量 = 数量 <= 0 ? 1 : 数量
    let 是否成功 = 订单.生成订单(Player, 放入的物品, 出售价格)
    if (是否成功 > 0) {
        Player.SendMessage(`{s=你以 }{s=${出售价格}点券;c=249}{s=的价格上架了}{s=${数量}个;}{s=${放入的物品.Name};c=250}`, 1)
        Player.DeleteItem(放入的物品)//删除    
        Player.V[g.在售数] = Player.V[g.在售数] == undefined ? 1 : Player.V[g.在售数] + 1
        Player.V[g.出售计数] = Player.V[g.出售计数] == undefined ? 1 : Player.V[g.出售计数] + 1
        弹出出售窗口(Npc, Player, undefined)
    } else {
        功能.系统.信息框(Player, "上架失败,请联系GM")
    }

    Main(Player)
}

