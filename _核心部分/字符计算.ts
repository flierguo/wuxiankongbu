import { 智能计算, js_war, 转大数值 } from "../_大数值/核心计算方法"
import { 大数值单位 } from "../_大数值/大数值单位"
import { 增加击杀计数, 特殊BOSS死亡, 大陆BOSS死亡 } from "./_生物/生物刷新"
import { TAG } from "./基础常量"


const UnitList = 大数值单位
const MaxShowLen = 4 //最大显示长度超过就转显示单位

export function 大数值整数简写(num: string): string {
  // 支持科学计数法格式（如 1E100, 1e100）
  if (num.includes('e') || num.includes('E')) {
    num = 转大数值(num)
  }

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
    // 修改部分开始
    let cutPos = num.length - item.len
    if (cutPos <= 0) cutPos = 1

    // 先提取整数部分
    let mainPart = num.substring(0, cutPos)
    // 直接用Number处理，确保没有前导零
    let mainNum = Number(mainPart)
    // 如果转换结果无效，默认为1
    if (isNaN(mainNum) || mainNum === 0) mainNum = 1

    // 提取小数部分
    let decimalPart = ""
    if (cutPos < num.length) {
      decimalPart = num.substring(cutPos, cutPos + 2).padEnd(2, '0')
    } else {
      decimalPart = "00"
    }

    return `${mainNum}.${decimalPart}${item.name}`
    // 修改部分结束
  }
}
export function 整数百分(numA: string, numB: string,) {
  if (numA.includes(`.`)) { numA = numA.split('.')[0]; }
  if (numB.includes(`.`)) { numB = numB.split('.')[0]; }
  let 比例 = 100
  let result = (Number(numA) / Number(numB)) * 比例; // 计算百分比，并将结果乘以 100
  return Math.floor(result * 比例 / 比例)
}
export function 随机小数(min: number, max: number): number {
  if (min > max) {
    [min, max] = [max, min]; // 交换参数，确保 min <= max
  }
  return Math.random() * (max - min) + min;
}
export function 飘血数值1(num: string) {
  // 支持科学计数法格式（如 1E100, 1e100）
  if (num.includes('e') || num.includes('E')) {
    num = 转大数值(num)
  }

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
  // 支持科学计数法格式（如 1E100, 1e100）
  if (num.includes('e') || num.includes('E')) {
    num = 转大数值(num)
  }

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
  // 支持科学计数法格式（如 1E100, 1e100）
  if (回血数值.includes('e') || 回血数值.includes('E')) {
    回血数值 = 转大数值(回血数值)
  }

  if (js_war(Player.GetSVar(91), Player.GetSVar(92)) < 0) {
    // let 飘血数值 = 数值飘血数值(回血数值).飘血数值
    // let 飘血位数 = 数值飘血数值(回血数值).飘血位数

    let 飘血数值11 = 飘血数值1(回血数值)
    let 飘血位数11 = 飘血位数1(回血数值)
    const 飘雪X偏移 = (飘血数值11.toString().length * -18) / 2 + (Number(飘血数值11) >= 15 && -35)
    // Player.ShowBleedNumberForDebug(`数字飘血.data`, 2, `0,0,0,`, 飘血数值, `${飘血位数 || 0},0,0,`, 1500, 飘雪X偏移, -24, 飘雪X偏移, -44)
    let 回血 = 智能计算(Player.GetSVar(91), 回血数值, 1)
    回血 = js_war(回血, Player.GetSVar(92)) > 0 ? Player.GetSVar(92) : 回血
    Player.SetSVar(91, 回血)
    血量显示(Player)
  }
}

export function 自动实时回血(Player: TActor, 回血数值: string) {
  // 支持科学计数法格式（如 1E100, 1e100）
  if (回血数值.includes('e') || 回血数值.includes('E')) {
    回血数值 = 转大数值(回血数值)
  }

  if (js_war(Player.GetSVar(91), Player.GetSVar(92)) < 0) {
    let 回血 = 智能计算(Player.GetSVar(91), 回血数值, 1)
    回血 = js_war(回血, Player.GetSVar(92)) > 0 ? Player.GetSVar(92) : 回血
    Player.SetSVar(91, 回血)
    血量显示(Player)
  }
}

export function 实时扣血(DamageSource: TActor, Target: TActor, 扣血数值: string) {
  // 支持科学计数法格式（如 1E100, 1e100）
  if (扣血数值.includes('e') || 扣血数值.includes('E')) {
    扣血数值 = 转大数值(扣血数值)
  }

  let 血量: string
  if (js_war(Target.GetSVar(91), 扣血数值) > 0) {
    血量 = 智能计算(Target.GetSVar(91), 扣血数值, 2)
  } else {
    血量 = `0`
    if (!Target.IsPlayer()) {
      Target.GoDie(DamageSource, DamageSource)

      // ✅ 增加击杀计数（用于TAG 7特殊BOSS触发）
      try {
        const 地图ID = Target.Map?.MapName
        if (地图ID) {
          增加击杀计数(地图ID)

          // 检查是否为特殊BOSS或大陆BOSS死亡
          const 怪物TAG = Target.GetNVar(TAG)
          if (怪物TAG === 7) {
            特殊BOSS死亡(地图ID)
          } else if (怪物TAG === 6) {
            大陆BOSS死亡(地图ID)
          }
        }
      } catch (e) {
        // 忽略错误
      }

      // ✅ 实时清理：怪物死亡时立即清理其信息缓存
      try {
        const 怪物Handle = `${Target.Handle}`;
        if (怪物Handle && GameLib.R && GameLib.R.怪物信息 && GameLib.R.怪物信息[怪物Handle]) {
          delete GameLib.R.怪物信息[怪物Handle];
        }
      } catch (cleanupError) {
        // 忽略清理错误
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
  // 支持科学计数法格式（如 1E100, 1e100）
  if (最终攻击.includes('e') || 最终攻击.includes('E')) {
    最终攻击 = 转大数值(最终攻击)
  }

  let 飘血数值11 = 飘血数值1(最终攻击)
  let 飘血位数11 = 飘血位数1(最终攻击)
  // console.log(飘血数值11 + ' ' + 飘血位数11)
  const 飘雪X偏移 = (飘血数值11.toString().length * -18) / 2 + (Number(飘血数值11) >= 0 && -35)
  if (js_war(飘血数值11, `0`) > 0) {
    if (Player.IsPlayer()) {
      Player.ShowBleedNumberForDebug(`数字飘血新.data`, 2, `0,0,0,`, Number(飘血数值11), `${飘血位数11 || 0},0,0,`, 1500, 飘雪X偏移, -24, 飘雪X偏移 - 50, + 44)
    } else {
      Player.ShowBleedNumberForDebug(`数字飘血新.data`, 2, `0,0,0,`, Number(飘血数值11), `${飘血位数11 || 0},0,0,`, 1500, 飘雪X偏移, -24, 飘雪X偏移 + 100, -100)
    }
  }
}

export function 数字转单位2(num: string) {
  // 支持科学计数法格式（如 1E100, 1e100）
  if (num.includes('e') || num.includes('E')) {
    num = 转大数值(num)
  }

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

  // 支持科学计数法格式（如 1E100, 1e100）
  if (当前血量.includes('e') || 当前血量.includes('E')) {
    当前血量 = 转大数值(当前血量)
  }
  if (最大血量.includes('e') || 最大血量.includes('E')) {
    最大血量 = 转大数值(最大血量)
  }

  let 百分比值 = 智能计算(智能计算(当前血量, 最大血量, 5), `100`, 3)
  let 百分比 = Number(百分比值)

  // 确保百分比在合理范围内
  if (isNaN(百分比) || !isFinite(百分比)) {
    百分比 = 100
  }
  Player.MaxHP = 百分比 * 9999999
  Player.HP = Player.MaxHP
  Player.HP = Player.HP * 百分比 / 100
  let 百分比值A = 整数百分(当前血量, 最大血量)
  const 最小血量 = 大数值整数简写(当前血量)
  const 最大血量显示 = 大数值整数简写(最大血量)

  const 数值字符串 = 最大血量.toString();
  const 位数 = 数值字符串.includes('.') ? 数值字符串.split('.')[0].length : 数值字符串.length;

  if (Player.IsPlayer()) {
    let 玩家 = Player as TPlayObject;
    let a = ''
    let 坐标 = -12
    const 职业显示 = 玩家.V.职业
    const 种族显示 = 玩家.V.种族
    let 成就显示 = ''


    if (职业显示 != '' && 种族显示 != '') {
      a = `{S=▁▂▃;C=147}{S=(${职业显示});C=21}{S=▃▂▁;C=147}\\${种族显示}[${玩家.V.种族阶数}]阶`
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
    玩家.SetClientUIProperty(`DTHPText`, `Caption.text=${玩家.V.种族阶数};`);


    Player.SetHudHPStr(`${最小血量}/${最大血量显示}(${位数}位 ${百分比.toFixed(2)}%)`)
  } else {
    if (最大血量 && 最大血量 !== '0') {
      Player.HP = Player.HP * 百分比 / 100
      Player.SetHudHPStr(`${最小血量}/${最大血量显示}(${位数}位 ${百分比值}%)`)
    } else {
      Player.HP = Player.HP * 百分比 / 100
      Player.SetHudHPStr(`${最小血量}/${最大血量显示}(${位数}位 ${百分比值}%)`)
    }
  }
  Player.RecalcAbilitys()
}