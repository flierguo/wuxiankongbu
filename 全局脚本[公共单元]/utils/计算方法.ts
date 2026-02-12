import { Decimal } from "./big_number";

// 1、加法  2、减法  3、乘法  4、整除  5、除（余2位小数）
export function js_number(n1:string, n2:string, mode:number):string {
  let Result:string
  let a = new Decimal(n1)
  let b = new Decimal(n2)
  switch(mode){
    case 1 : Result = a.plus(b).toFixedString(0); break;
    case 2 : Result = a.minus(b).toFixedString(0); break;
    case 3 : Result = a.mul(b).toFixedString(0); break;
    case 4 : Result = a.div(b).toFixedString(0); break;
    case 5 : Result = a.div(b).toFixed(2); break;
    case 6 : Result = a.div(b).toFixed(5); break;
  }
  return Result
}
// 百分比
export function js_percentage(n1:string, ):string {
  let a = new Decimal(n1)
  let b = new Decimal(`100`)
  let n = a.div(b).toFixed(2);
return n
}

// 取随机 生成一个范围在 0 到 n1-1 之间的随机整数。
export function js_Random(n1: string): string {
  let a = new Decimal(n1)
  return a.random(0).toFixedString(0)
}
// 取随机(范围)   生成一个范围在 n1 到 n2 之间的随机整数（包含 n1 和 n2）。
export function js_numberRandom(n1: string, n2: string, ): string {
  let a = new Decimal(n2)
  return a.random(n1).toFixedString(0)
//   const range = n2 - n1; // 3 - 0 = 3
// return Decimal.random().mul(range).add(n1).floor().toFixedString(0);
}
// 取随机(范围)   范围在 n1 到 n1 + n2 之间的随机整数（字符串形式）
export function js_numberRandom2(n1: string, n2: string, ): string {
  let a = new Decimal(n1)
  return a.random(n2).toFixedString(0)
}
// 比大小 返回值 (n1 > n2 = 1)  (n1 = n2 = 0)  (n1 < n2 = -1)
export function js_war(n1:string, n2:string, ):number {
    let a = new Decimal(n1)
    let b = new Decimal(n2)
  return a.compareTo(b)
}

