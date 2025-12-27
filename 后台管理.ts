import Decimal = require("./大数值/big_number");
import { js_number, js_numberRandom, js_numberRandom2, js_war } from "./全局脚本[公共单元]/utils/计算方法";
import { 分钟检测无人60分清理怪物 } from "./功能脚本组/[怪物]/_M_Robot";
import { 装备数值简写, 随机小数 } from "./功能脚本组/[服务]/延时跳转";
// import { _P_N_可复活次数 } from "./功能脚本组/[玩家]/_P_Base";
import { 数字转单位2, 数字转单位3 } from "./核心功能/字符计算";

import { 快速验证装备掉落 } from "./核心功能/装备掉落测试验证";


export function Main(Npc:TNormNpc,Player: TPlayObject, Args: TArgs):void {
    const S =
    `\\\\
    {S=后台调试系统：;C=254}\\\\
    <正常运算/@后台管理.New(1)>    <超大运算/@后台管理.New(2)>    <最新运算/@后台管理.New(3)>    <测试按钮/@后台管理.New(4)>    <测试按钮/@后台管理.New(5)>\\\\
    <测试按钮/@后台管理.New(6)>    <测试变异/@@后台管理.InputInteger2(输入01)>    \\\\
    {S=--------------------------------------------------------------------------;C=91}\\
    
    `
    Npc.SayEx(Player,`NPC大窗口`,S)
}
export function New(Npc:TNormNpc,Player: TPlayObject, Args: TArgs):void {
    switch(Args.Int[0]){
      case 5:{
        console.log(`经验: ${Player.GetExp()}`)
        console.log(`经验111: ${Player.Exp}`)
        // 装备属性统计(Player,null,null,null)

        // Player.SuperManMode = true
		    // Player.ObserverMode = true
        // GameLib.V[Player.PlayerID] ??= {}
        // let n = Object.keys(GameLib.V[Player.PlayerID])
        // console.log(GameLib.V[Player.PlayerID])
        // if(n.length > 0){
        //   for(let v=0;v<=n.length-1;v++){
        //     console.log(Trunc((GameLib.TickCount - GameLib.V[Player.PlayerID][n[v]]) / 1000))
        //     let 计算复活冷却时间 = Trunc((GameLib.TickCount - GameLib.V[Player.PlayerID][n[v]]) / 1000)
        //     // if(计算复活冷却时间 >= ){
              
        //     // }
        //   }
        // }      
        // console.log(n)
        // 分钟检测无人60分清理怪物()
        // Player.V.轮回次数 = 50
        // Player.V.鞭尸几率 = 10
        // Player.V.真实充值 = 6000
      //   let Actor = GameLib.GetActorByHandle(Player.R.鞭尸怪物记录Handle)
      //   if(Actor){
      //       console.log(Actor.Death)
      //       Actor.SetNVar(64, 1)
      //       Player.DamageDelay(Actor, 1, 100, 10103);
      //       Player.SendCountDownMessage(`{s=【鞭尸】;c=253}你击杀击杀怪物触发鞭尸,怪物原地又爆了一次!`, 0, 3000);
      //   }
      
      } break;
      case 4:{
        // let n1 = `123456789123456789`
        // let n2 = `12345678912345678912345678912345678912345678912345678789123456789123456789123456789123456789`
        // // let 前端数字 = 数字转单位2(new Decimal(n1))
        // // let 后端单位 = 数字转单位3(new Decimal(n1))
        // // console.log(前端数字)
        // // console.log(后端单位)

 
        // let 前端数字 = 数字转单位2(n1)
        // let 后端单位 = 数字转单位3(n1)
        // console.log(前端数字)
        // console.log(后端单位)
        快速验证装备掉落(Player);
      
      } break;
      case 3:{
        // let time = GameLib.TickCount
        // let n1 = `123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789`
        // let n2 = `12345678912345678912345678912345678912345678912345678789123456789`
        // let n3 = `123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789`
        // let n4 = `12345678912345678912345678912345678912345678912345678789123456789`
        
        // let s1 = 123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789
        // let s2 = 12345678912345678912345678912345678912345678912345678789123456789
        // let s3 = s1 + s2
        // let s4 = s1 - s2
        // let s5 = s1 * s2
        // let s6 = s1 / s2
        // // console.log(`加：${装备数值简写(s3.toString())} //   减：${装备数值简写(s4.toString())} / 乘：${装备数值简写(s5.toString())} / 除：${装备数值简写(s6.toString())}`)

        // // console.log(s1.toString().length)
        // // console.log(s2.toString().length)
        // console.log(`加：${s3.toString().length} // ${s3}`)
        // console.log(`减：${s4.toString().length} // ${s4}`)
        // console.log(`乘：${s5.toString().length} // ${s5}`)
        // console.log(`除：${s6.toString().length} // ${s6}`)

        // let d1 = new Decimal(n1)
        // let d2 = new Decimal(n2)
        // // .format() 转单位    .toFixedString() 转完整字符串
        // for(let i = 0; i <= 10000 ;i++){
        //   let n3 = d1.plus(d2)
        //   let n4 = d1.minus(d2)
        //   let n5 = d1.mul(d2)
        //   let n6 = d1.div(d2)
  
        //   // console.log('加：' + n3.toString())
        //   // console.log('减：' + n4.toFixed(2))
        //   // console.log('乘：' + n5.toFixed(2))
        //   // console.log('除：' + n6.format(2))
        //   // console.log(i)

        // }
        // console.log('计算时间：' + (GameLib.TickCount - time))
      } break;
      case 2:{
        // let time = GameLib.TickCount
        // for(let i=0;i<=100;i++){
        //   let n1 = `123456789123456789123456789183456789123456789123456789123456789123456789123456789123456789`
        //   let n2 = `123456789123456789123456789123456779123456789`
        //   let a: BigNumber = new BigNumber(n1)
        //   let b: BigNumber = new BigNumber(n2)
        //   let n3 = a.plus(b).toFixed()
        //   let n4 = a.minus(b).toFixed()
        //   let n5 = a.multipliedBy(b).toFixed()
        //   let n6 = a.div(b).toFixed(2)
        //   // console.log('加：' + n3)
        //   // console.log('减：' + n4)
        //   // console.log('乘：' + n5)
        //   // console.log('除：' + n6)
        // }
        // console.log('计算时间：' + (GameLib.TickCount - time))
      } break;
      case 1:{
        let time = GameLib.TickCount
        for(let i=0;i<=1000000;i++){
          let n1 = 987654321
          let n2 = 123456789
          let n3 = n1 + n2
          let n4 = n1 - n2
          let n5 = n1 * n2
          let n6 = n1 / n2
          // console.log(i)
        }
        console.log('计算时间：' + (GameLib.TickCount - time))
      } break;
      default:break;
    }
  }

  export function InputInteger2(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    GameLib.V.怪物变异 ??= false
    if (Args.Str[0] == 'RC8MEZRKMLPKT7QX01') {

        GameLib.V.怪物变异 = true
        Player.MessageBox('怪物变异开启！');
    } else if (Args.Str[0] == 'RC8MEZRKMLPKT7QX02') {
        GameLib.V.怪物变异 = false
        Player.MessageBox('怪物变异关闭！');
    }
}