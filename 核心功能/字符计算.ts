
import { js_number, js_war } from "../全局脚本[公共单元]/utils/计算方法"
import { 大数值整数简写 } from "../功能脚本组/[服务]/延时跳转"
import { 大数值单位 , 数字位数 } from "../大数值/大数值单位"


const UnitList = 大数值单位

export function 位数(num: string) {
  let index1 = num.indexOf(".")
  if (index1 >= 0) {
    num = num.substring(0, index1)
  }
  return num.length
}

export function formatNumber(value: string): number {
  let num = Number(value)
  if (isNaN(num)) {
    return 0
  }
  return num
}

//将大数转换成带单位的小数显示
export function tranNumber2(num: string): any {
  let index1 = num.indexOf(".")
  if (index1 >= 0) {
    num = num.substring(0, index1)
  }

  let index = UnitList.length - 1
  let tmp = num.length - MaxShowLen
  for (let i = 0; i < UnitList.length; i++) {
    let item = UnitList[i]
    if (tmp <= item.len) {
      index = i
      break
    }
  }
  if (index == 0) {
    return {
      num: formatNumber(num),
      index: 0
    }
  }
  else {
    let item = UnitList[index]
    let newNum = num.substring(0, num.length - item.len)
    return {
      num: formatNumber(newNum),
      index: index
    }
  }

}




const MaxShowLen = 4 //最大显示长度超过就转显示单位
export function 飘血数值1(num: string) {
  let index1 = num.indexOf(".")
  if (index1 >= 0) {
    num = num.substring(0, index1)
  }


  let index = UnitList.length - 1
  let tmp = num.length - MaxShowLen
  for (let i = 0; i < UnitList.length; i++) {
    let item = UnitList[i]
    if (tmp <= item.len) {
      index = i
      break
    }
  }
  if (index == 0) {
    return num
  }
  else {
    let item = UnitList[index]
    let newNum = num.substring(0, num.length - item.len)
    return `${newNum}`
  }
}

export function 飘血位数1(num: string) {
  let index1 = num.indexOf(".")
  if (index1 >= 0) {
    num = num.substring(0, index1)
  }

  let index = UnitList.length - 1
  let tmp = num.length - MaxShowLen
  for (let i = 0; i < UnitList.length; i++) {
    let item = UnitList[i]
    if (tmp <= item.len) {
      index = i
      break
    }
  }

  let item = UnitList[index]
  return `${item.图片位置}`
}


export function 实时回血(Player: TActor, 回血数值: string) {
  if(js_war(Player.GetSVar(91), Player.GetSVar(92)) < 0){
    // let 飘血数值 = 数值飘血数值(回血数值).飘血数值
    // let 飘血位数 = 数值飘血数值(回血数值).飘血位数

    let 飘血数值11 = 飘血数值1(回血数值)
    let 飘血位数11 = 飘血位数1(回血数值)
    const 飘雪X偏移 = (飘血数值11.toString().length * -18) / 2 + (Number(飘血数值11) >= 15 && -35)
    // Player.ShowBleedNumberForDebug(`数字飘血.data`, 2, `0,0,0,`, 飘血数值, `${飘血位数 || 0},0,0,`, 1500, 飘雪X偏移, -24, 飘雪X偏移, -44)
    let 回血 = 整数相加(Player.GetSVar(91), 回血数值)
    回血 = js_war(回血, Player.GetSVar(92)) > 0 ? Player.GetSVar(92) : 回血
    Player.SetSVar(91, 回血)
    血量显示(Player)
  }
}
export function 自动实时回血(Player: TActor, 回血数值: string) {
  if(js_war(Player.GetSVar(91), Player.GetSVar(92)) < 0){
    let 回血 = 整数相加(Player.GetSVar(91), 回血数值)
    回血 = js_war(回血, Player.GetSVar(92)) > 0 ? Player.GetSVar(92) : 回血
    Player.SetSVar(91, 回血)
    血量显示(Player)
  }
}
export function 实时扣血(DamageSource: TActor, Target: TActor, 扣血数值: string) {
  let 血量: string
 if(js_war(Target.GetSVar(91), 扣血数值) > 0){
    血量 = js_number(Target.GetSVar(91), 扣血数值, 2)
  } else {
    血量 = `0`
    if (!Target.IsPlayer()) { 
      Target.GoDie(DamageSource, DamageSource)
      
      // ✅ 实时清理：怪物死亡时立即清理其信息缓存
      try {
        const 怪物Handle = `${Target.Handle}`;
        if (怪物Handle && GameLib.R && GameLib.R.怪物信息 && GameLib.R.怪物信息[怪物Handle]) {
          delete GameLib.R.怪物信息[怪物Handle];
          console.log(`🗑️ [实时扣血]清理死亡怪物信息: ${Target.GetName()}(${怪物Handle})`);
        }
      } catch (cleanupError) {
        console.log(`❌ [实时扣血]清理怪物信息出错: ${cleanupError}`);
      }
    } else { 
      Target.Die() 
    }
  }
  // let 飘血数值 = 数值飘血数值(扣血数值).飘血数值
  // let 飘血位数 = 数值飘血数值(扣血数值).飘血位数

  let 飘血数值11 = 飘血数值1(扣血数值)
  let 飘血位数11 = 飘血位数1(扣血数值)

  const 飘雪X偏移 = (飘血数值11.toString().length * -18) / 2 + (Number(飘血数值11) >= 15 && -35)
  if (Target.IsPlayer()) {
    Target.ShowBleedNumberForDebug(`数字飘血新.data`, 2, `0,0,0,`, Number(飘血数值11), `${飘血位数11 || 0},0,0,`, 1500, 飘雪X偏移, -24, 飘雪X偏移 - 50, +44)
  } else {
    Target.ShowBleedNumberForDebug(`数字飘血新.data`, 2, `0,0,0,`, Number(飘血数值11), `${飘血位数11 || 0},0,0,`, 1500, 飘雪X偏移, -24, 飘雪X偏移 + 100, -100)
  }
  Target.SetSVar(91, 血量)
  血量显示(Target)
}

export function 攻击飘血(Player: TActor, 最终攻击 = `0`, 时间 = 1500, 前缀特效 = 0) {
  let 飘血数值11 = 飘血数值1(最终攻击)
  let 飘血位数11 = 飘血位数1(最终攻击)
  // console.log(飘血数值11 + ' ' + 飘血位数11)
  const 飘雪X偏移 = (飘血数值11.toString().length * -18) / 2 + (Number(飘血数值11) >= 0 && -35)
  if(js_war(飘血数值11, `0`) > 0){
    if (Player.IsPlayer()) {
      Player.ShowBleedNumberForDebug(`数字飘血新.data`, 2, `0,0,0,`, Number(飘血数值11), `${飘血位数11 || 0},0,0,`, 1500, 飘雪X偏移, -24, 飘雪X偏移 - 50, + 44)
    } else {
      Player.ShowBleedNumberForDebug(`数字飘血新.data`, 2, `0,0,0,`, Number(飘血数值11), `${飘血位数11 || 0},0,0,`, 1500, 飘雪X偏移, -24, 飘雪X偏移 + 100, -100)
    }
  }
}


export function 数字转单位2(num: string) {
  let index1 = num.indexOf(".")
  if (index1 >= 0) {
    num = num.substring(0, index1)
  }

  let index = UnitList.length - 1
  let tmp = num.length - MaxShowLen
  for (let i = 0; i < UnitList.length; i++) {
    let item = UnitList[i]
    if (tmp <= item.len) {
      index = i
      break
    }
  }
  if (index == 0) {
    return num
  }
  else {
    let item = UnitList[index]
    let newNum = num.substring(0, num.length - item.len)
    return `${newNum}`
  }
}

export function 数字转单位3(num: string) {
  let index1 = num.indexOf(".")
  if (index1 >= 0) {
    num = num.substring(0, index1)
  }

  let index = UnitList.length - 1
  let tmp = num.length - MaxShowLen
  for (let i = 0; i < UnitList.length; i++) {
    let item = UnitList[i]
    if (tmp <= item.len) {
      index = i
      break
    }
  }

  let item = UnitList[index]
  // 保持原来“减 11 帧偏移”的逻辑
  let 图片位置 = item.图片位置 - 11
  if (图片位置 < 1) {
    图片位置 = 999999
  }
  return `${图片位置}`
}

export function 整数百分(numA: string, numB: string,) {
  if (numA.includes(`.`)) { numA = numA.split('.')[0]; }
  if (numB.includes(`.`)) { numB = numB.split('.')[0]; }
  let 比例 = 100
  let result = (Number(numA) / Number(numB)) * 比例; // 计算百分比，并将结果乘以 100
  return Math.floor(result * 比例 / 比例)
}

// 说明：第一个参数大 返回 1 否则返回 -1   相等返回 0
export function 整数比较(str1: string, str2: string) {
  if (str1.includes(`.`)) { str1 = str1.split('.')[0]; }
  if (str2.includes(`.`)) { str2 = str2.split('.')[0]; }
  str1 = str1.replace(/[^0-9]/g, '');
  str2 = str2.replace(/[^0-9]/g, '');
  let 返回大小: number
  Number(str1) > Number(str2) ? 返回大小 = 1 :
    Number(str1) < Number(str2) ? 返回大小 = -1 :
      返回大小 = 0
  return 返回大小
}
export function 整数相加(num1: string, num2: string) {//
  if (num1.includes(`.`)) { num1 = num1.split('.')[0]; }
  if (num2.includes(`.`)) { num2 = num2.split('.')[0]; }
  num1 = num1.replace(/[^0-9]/g, '');
  num2 = num2.replace(/[^0-9]/g, '');
  if (num1 == `0`) { return num2 }
  if (num2 == `0`) { return num1 }

  let carry = 0;
  let result = '';
  let i = num1.length - 1;
  let j = num2.length - 1;

  while (i >= 0 || j >= 0 || carry) {
    const x = i >= 0 ? parseInt(num1[i--]) : 0;
    const y = j >= 0 ? parseInt(num2[j--]) : 0;
    const sum = x + y + carry;
    result = (sum % 10) + result;
    carry = Math.floor(sum / 10);
  }
  let 结果 = result.replace(/^0+/, '')
  return 结果;
}
export function 整数相减(num1: string, num2: string) {
  if (num1.includes(`.`)) { num1 = num1.split('.')[0]; }
  if (num2.includes(`.`)) { num2 = num2.split('.')[0]; }
  num1 = num1.replace(/[^0-9]/g, '');
  num2 = num2.replace(/[^0-9]/g, '');
  if (整数比较(num2, num1) >= 0) { return `0` }
  if (num1 == `0`) { return num2 }
  if (num2 == `0`) { return num1 }

  let num11 = num1
  let num22 = num2
  if (+num1 < +num2) {
    [num1, num2] = [num2, num1];
  }
  // 计算两个数的长度
  const len1 = num1.length, len2 = num2.length;
  // 初始化结果数组，初始值全部设为0
  const result = new Array(len1).fill(0);
  // 字符串转换为数字，并逐位相减
  for (let i = 0; i < len1; i++) {
    const n1 = parseInt(num1.charAt(len1 - i - 1));
    const n2 = parseInt(num2.charAt(len2 - i - 1) || '0');
    result[len1 - i - 1] = n1 - n2;
  }
  // 处理结果数组中小于0的值
  for (let i = len1 - 1; i > 0; i--) {
    if (result[i] < 0) {
      result[i - 1]--;
      result[i] += 10;
    }
  }
  // 处理结果数组中的前导0
  const firstNonzero = result.findIndex(n => n !== 0);
  let output = firstNonzero === -1 ? '0' : result.slice(firstNonzero).join('');
  // 判断是否需要添加负号
  if (+num11 < +num22) {
    output = '-' + output;
  }
  output = output.includes(`-`) ? `0` : output
  return output;
}
export function 整数相除(num1: string, num2: string) {
  if (num1.includes(`.`)) { num1 = num1.split('.')[0]; }
  if (num2.includes(`.`)) { num2 = num2.split('.')[0]; }
  if (num1.includes(`-`) || num2.includes(`-`)) {
    console.log(`注意 注意 注意 注意 整数相除 运算出现了负数 !!!!`);
    return '0';
  }
  num1 = num1.replace(/[^0-9]/g, '');
  num2 = num2.replace(/[^0-9]/g, '');
  if (num1 == `0` || num2 == `0`) { return `0` }
  //--------------------------------------
  var carry = 0;
  var quotient = '';
  for (var i = 0; i < num1.length; i++) {
    var digit = parseInt(num1[i]) + carry * 10;
    var q = Math.floor(digit / parseInt(num2));
    carry = digit % parseInt(num2);
    quotient += q;
  }
  return quotient.replace(/^0+/, '');
}

export function 整数相乘(num1: string, num2: string) {
  if (num1?.includes(`.`)) { num1 = num1.split('.')[0]; }
  if (num2?.includes(`.`)) { num2 = num2.split('.')[0]; }
  if (num1.includes(`-`) || num2.includes(`-`)) {
    console.log(`注意 注意 注意 注意 整数相乘运算 出现了负数 !!!!`);
    return '0';
  }
  num1 = num1.replace(/[^0-9]/g, '');
  num2 = num2.replace(/[^0-9]/g, '');
  if (num1 == `0` || num2 == `0`) { return `0` }
  if (num1 == `1`) { return num2 }
  if (num2 == `1`) { return num1 }
  //--------------------------------------

  var sign = (num1.charAt(0) === '-') != (num2.charAt(0) === '-') ? -1 : 1;
  num1 = num1.charAt(0) === '-' ? num1.substring(1) : num1;
  num2 = num2.charAt(0) === '-' ? num2.substring(1) : num2;

  var product = [];
  for (var i = num1.length - 1; i >= 0; i--) {
    for (var j = num2.length - 1; j >= 0; j--) {
      var digit1 = parseInt(num1.charAt(i));
      var digit2 = parseInt(num2.charAt(j));
      var pos1 = num1.length - i - 1;
      var pos2 = num2.length - j - 1;
      var pos = pos1 + pos2;

      let value: number = digit1 * digit2 + (product[pos] || 0);
      product[pos] = value % 10;
      product[pos + 1] = Math.floor(value / 10) + (product[pos + 1] || 0);
    }
  }

  var result = product.reverse().join('').replace(/^0+/, '');
  return sign === -1 ? '-' + result : result;
}

export function 整数百分比(num1: string, num2: string) {
  return 整数相除(整数相乘(num1, num2), `100`)
}

export function random基础(min = 1, max: number) {
  let 动态概率 = 500
  max = Math.floor(max / 1000 * 动态概率)
  let 最终数值 = randomRange(min, max)
  return 最终数值;
}

export function random数字(最大值 = '1', 最小值 = '1') {
  最大值 = 最大值.replace(/[^0-9]/g, '');
  最小值 = 最小值.replace(/[^0-9]/g, '');

  if (Number(最小值) >= Number(最大值)) { return 最小值 }
  let 字符 = 整数相减(最大值, 最小值);
  const 位数 = 16;
  const 字符数组 = [];
  for (let i = 0; i < 字符.length; i += 位数) {
    const 子字符串 = 字符.substring(i, i + 位数);
    字符数组.push(子字符串);
  }
  const 最后一个子字符串 = 字符.substring(字符数组.length * 位数);
  if (最后一个子字符串.length > 0) {
    字符数组.push(最后一个子字符串);
  }
  let 随机结果 = '';
  for (let index = 0; index < 字符数组.length; index++) {
    const 随机索引 = Math.floor(randomRange(1, Number(字符数组[index]) + 1));
    随机结果 += String(随机索引);
  }
  if (Number(整数相加(随机结果, 最小值)) > Number(最大值)) { return '1'; }
  return 整数相加(随机结果, 最小值);
}

export function 整数中文(敌人攻击: string, 保留 = 1) {
  if (敌人攻击 == `0` || 敌人攻击 == undefined) { return `0` }
  敌人攻击 = 敌人攻击.replace(/[^0-9]/g, '');
  let 飘血数值 = 敌人攻击, 位数 = ``;

  if (整数比较(敌人攻击, `9999`) == 1) {
    for (let i = 数字位数.length - 1; i >= 0; i--) {
      const [单位, 倍数] = 数字位数[i];
      if (整数比较(敌人攻击, `${倍数}`) >= 0) {
        飘血数值 = (Number(敌人攻击) / Number(倍数)).toFixed(保留);
        // 传(`整数中文 ${飘血数值}`)
        位数 = String(单位);
        break;
      }
    }
  }
  return 飘血数值 + 位数;
}

export function 整数小数(敌人攻击: string, 保留 = 2) {
  if (敌人攻击 == `0` || 敌人攻击 == undefined) { return `0` }
  敌人攻击 = 敌人攻击.replace(/[^0-9]/g, '');
  let 飘血数值 = 敌人攻击, 位数 = ``;

  if (整数比较(敌人攻击, `9999`) == 1) {
    for (let i = 数字位数.length - 1; i >= 0; i--) {
      const [单位, 倍数] = 数字位数[i];
      if (整数比较(敌人攻击, `${倍数}`) >= 0) {
        飘血数值 = Number(敌人攻击) <= 99 ? String(敌人攻击) : (Number(敌人攻击) / Number(倍数)).toFixed(保留);
        位数 = String(单位);
        break;
      }
    }

  }
  return 飘血数值 + 位数;
}

export function 随机数(a, b) {
  // 确保 a 是最小值，b 是最大值
  let min = Math.min(a, b);
  let max = Math.max(a, b);

  // 生成 [min, max) 范围内的随机浮点数
  let randomDecimal = (Math.random() * (max - min)) + min;

  return randomDecimal;
}

export function 新返回(数值: number): string {
  let 返回 = '0'
  switch (数值) {
    case 0: 返回 = '1'; break
    case 1: 返回 = '10000'; break
    case 2: 返回 = '100000000'; break
    case 3: 返回 = '1000000000000'; break
    case 4: 返回 = '10000000000000000'; break
    case 5: 返回 = '100000000000000000000'; break
    case 6: 返回 = '1000000000000000000000000'; break
    case 7: 返回 = '10000000000000000000000000000'; break
    case 8: 返回 = '100000000000000000000000000000000'; break
    case 9: 返回 = '1000000000000000000000000000000000000'; break
    case 10: 返回 = '1000000000000000000000000000000000000000'; break
    case 11: 返回 = '10000000000000000000000000000000000000000000'; break
    case 12: 返回 = '100000000000000000000000000000000000000000000000'; break
    case 13: 返回 = '1000000000000000000000000000000000000000000000000000'; break
    case 14: 返回 = '10000000000000000000000000000000000000000000000000000000'; break
    case 15: 返回 = '100000000000000000000000000000000000000000000000000000000000'; break
    default: 返回 = `0`
  }
  return 返回
}

export function 添加职业(装备: TUserItem, 数值: number): any {
  let jsonString = 装备.GetCustomDesc();
  let obj = JSON.parse(jsonString, (key, value) => {
    if (Array.isArray(value) && key === "职业属性_职业") {
      return [...value, 数值]; // 在数组末尾添加 100
    }
    return value;
  });
  return obj
}
export function 添加属性(装备: TUserItem, 数值: string): any {
  let jsonString = 装备.GetCustomDesc();
  let obj = JSON.parse(jsonString, (key, value) => {
    if (Array.isArray(value) && key === "职业属性_属性") {
      return [...value, 数值]; // 在数组末尾添加 100
    }
    return value;
  });
  return obj
}

export function 删除职业(装备: TUserItem): any {
  let jsonString = 装备.GetCustomDesc();
  if (Array.isArray(jsonString["职业属性_职业"])) {
    jsonString["职业属性_职业"].pop();
  }
  // console.log(jsonString)
  return jsonString
}

export function 删除属性(装备: TUserItem): any {
  let jsonString = 装备.GetCustomDesc();
  if (Array.isArray(jsonString["职业属性_属性"])) {
    jsonString["职业属性_属性"].pop();
  }
  return jsonString
}
export function 血量显示(Player: TActor) {
  let 返回名称 = ``
  // 确保血量值有效
  let 当前血量 = Player.GetSVar(91) || '100000'
  let 最大血量 = Player.GetSVar(92) || '100000'
  
  // 检查是否为无效值
  if (!当前血量 || 当前血量 === '' || 当前血量 === 'undefined' || 当前血量 === 'NaN' || 当前血量 === '0') {
    当前血量 = '100000'
  }
  if (!最大血量 || 最大血量 === '' || 最大血量 === 'undefined' || 最大血量 === 'NaN' || 最大血量 === '0') {
    最大血量 = '100000'
  }
  
  let 百分比值 = js_number( js_number(当前血量, 最大血量, 5), `100`, 3)
  let 百分比 = Number(百分比值)
  
  // 确保百分比在合理范围内
  if (isNaN(百分比) || !isFinite(百分比)) {
    百分比 = 100
  }
  Player.MaxHP = 百分比 * 9999999
  Player.HP=Player.MaxHP
  Player.HP=Player.HP*百分比/100
  let 百分比值A = 整数百分(当前血量, 最大血量)
  const 最小血量 = 大数值整数简写(当前血量)
  const 最大血量显示 = 大数值整数简写(最大血量)

const 数值字符串 = 最大血量.toString();
const 位数 = 数值字符串.includes('.') ? 数值字符串.split('.')[0].length : 数值字符串.length;

  if (Player.IsPlayer()) {
    let 玩家 = Player as TPlayObject;
    let a = ''
    let 坐标 = -12
    let 职业显示 = ''
    let 种族显示 = ''
    let 成就显示 = ''
    switch (true) {
      case 玩家.V.战神: 职业显示 = '战神'; break
      case 玩家.V.骑士: 职业显示 = '骑士'; break
      case 玩家.V.火神: 职业显示 = '火神'; break
      case 玩家.V.冰法: 职业显示 = '冰法'; break
      case 玩家.V.驯兽师: 职业显示 = '驯兽师'; break
      case 玩家.V.牧师: 职业显示 = '牧师'; break
      case 玩家.V.刺客: 职业显示 = '刺客'; break
      case 玩家.V.鬼舞者: 职业显示 = '鬼舞者'; break
      case 玩家.V.神射手: 职业显示 = '神射手'; break
      case 玩家.V.猎人: 职业显示 = '猎人'; break
      case 玩家.V.武僧: 职业显示 = '武僧'; break
      case 玩家.V.罗汉: 职业显示 = '罗汉'; break
    }
    switch (玩家.V.种族) {
      case '人族': 种族显示 = '人族'; break
      case '牛头': 种族显示 = '牛头'; break
      case '精灵': 种族显示 = '精灵'; break
      case '兽族': 种族显示 = '兽族'; break
     }
     if(玩家.V.第一章成就 ){  成就显示 = '第一章'}
     else if(玩家.V.第二章成就){  成就显示 = '第二章'}
     else if(玩家.V.第三章成就){  成就显示 = '第三章'}
     else if(玩家.V.第四章成就){  成就显示 = '第四章'}
     else if(玩家.V.第五章成就){  成就显示 = '第五章'}
     else if(玩家.V.第六章成就){  成就显示 = '第六章'}
     else if(玩家.V.第七章成就){  成就显示 = '第七章'}
     else if(玩家.V.第八章成就){  成就显示 = '第八章'}
     else if(玩家.V.第九章成就){  成就显示 = '第九章'}
     else if(玩家.V.第十章成就){  成就显示 = '第十章'}
     else if(玩家.V.第十一章成就){  成就显示 = '第十一章'}
     else if(玩家.V.第十二章成就){  成就显示 = '第十二章'}
     else if(玩家.V.第十三章成就){  成就显示 = '第十三章'}
     else if(玩家.V.第十四章成就){  成就显示 = '第十四章'}
     else if(玩家.V.第十五章成就){  成就显示 = '第十五章'}
     else if(玩家.V.第十六章成就){  成就显示 = '第十六章'}
     else if(玩家.V.第十七章成就){  成就显示 = '第十七章'}
     else if(玩家.V.第十八章成就){  成就显示 = '第十八章'}
     else if(玩家.V.第十九章成就){  成就显示 = '第十九章'}
     else if(玩家.V.第二十章成就){  成就显示 = '第二十章'}

    if (职业显示 != '' && 种族显示 != '' && 成就显示 != '') {
      a = `{S=${职业显示};C=21}({S=${成就显示};C=46})\\${种族显示}[${玩家.V.种族阶数}]阶`
      坐标 = -25
    } else if (职业显示 != '' && 种族显示 != '') {
      a = `{S=${职业显示};C=21}\\${种族显示}[${玩家.V.种族阶数}]阶`
      坐标 = -25
    }

    if (Player.Guild) {
      坐标 = -25
    }

    let 行会偏移 = Player.Guild?.Name ? -12 : 0
    let 自定义称号显示 = (Player as TPlayObject).VarString('自定义称号显示').AsString = `${a}`
        let 前缀偏移 = 自定义称号显示 == '' ? 0 : 坐标
    返回名称 += `{S=${最小血量}/${最大血量显示};X=0;Y=${-71 + 行会偏移 + 前缀偏移}}\\`    //-71
    返回名称 += `{I=${百分比值};C=251;X=-1;Y=-40}\\{S=%s;X=0;Y=-6}\\`;       /**S=神器; */
    (Player as TPlayObject).RankLevelName = 自定义称号显示;
    (Player as TPlayObject).ShowRankLevelName = true;
    (Player as TPlayObject).SetClientUIProperty(`侧边血量`, `Caption.Text =${当前血量}/${最大血量}`)
    GameLib.FindPlayer(Player.Name)?.UpdateName();

    let C = 百分比 / 100;
    
    玩家.SetClientUIProperty(`血球`, `Dynamicclipvalue=${C};`);
    玩家.SetClientUIProperty(`显示血量`, `Caption.text=${当前血量}/${最大血量};`);
    玩家.SetClientUIProperty(`血球数值`, `Caption.Text =${百分比.toFixed(0)}%`);
    玩家.SetClientUIProperty(`HP值`, `Caption.Text =${百分比.toFixed(0)}%`);
    玩家.SetClientUIProperty(`DTHPText` , `Caption.text=${玩家.V.种族阶数};`);
 

    Player.SetHudHPStr(`${最小血量}/${最大血量显示}(${位数}位 ${百分比.toFixed(2)}%)`)
  } else {
    if (最大血量 && 最大血量 !== '0') {
      Player.HP=Player.HP*百分比/100
      Player.SetHudHPStr(`${最小血量}/${最大血量显示}(${位数}位 ${百分比值}%)`) 
    } else {
      Player.HP=Player.HP*百分比/100
      Player.SetHudHPStr(`${最小血量}/${最大血量显示}(${位数}位 ${百分比值}%)`) 
    }
  }
  Player.RecalcAbilitys() 
}