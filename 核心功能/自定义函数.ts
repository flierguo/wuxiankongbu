//判断是否有宝宝
export function 是否有宝宝(Player: TPlayObject, SlaveName: string): boolean {
  let Accept: boolean = false
  for (let i = 0; i <= Player.SlaveCount - 1; i++) {
    if (Player.GetSlave(i).Name == SlaveName) {
      Accept = true
      break;
    }
  }
  return Accept
}
//判断当前时间是否在某个时间段之间
export function isBetweenNoonAndMidnight(Time1: number, Time2: number): boolean {
  let Accept: boolean
  const now = new Date();
  const hours = now.getHours();
  if (hours >= Time1 && hours < Time2) {
    Accept = true
  } else {
    Accept = false
  }
  return Accept
}
//取走玩家身上指定物品
export function 拿走物品(Player: TPlayObject, ItemName: string, num: number): boolean {
  let Accept: boolean
  let n = 0;
  for (let I = 0; I <= Player.MaxBagSize - 1; I++) {
    let AItem = Player.GetBagItem(I)
    if (AItem && AItem.Name == ItemName) {
      if (AItem.StdMode == 42 && AItem.Dura > 1) {
        n = n + AItem.Dura
      } else {
        n += 1
      }
    }
  }
  if (n >= num) {
    n = num
    Accept = true
    for (let r = 0; r <= num; r++) {
      for (let I = Player.MaxBagSize - 1; I >= 0; I--) {
        let AItem = Player.GetBagItem(I)
        if (AItem && AItem.Name == ItemName) {
          Player.DeleteItem(AItem, 1)
          break;
        }
      }
      n -= 1
      if (n == 0) {
        break;
      }
    }
  } else {
    Accept = false
  }
  return Accept
}
//检测对方身上GroupID是否存在 检测buff是否存在
export function CheckBuffGroupID(Actor: TActor, GroupID: number): boolean {
  let A = false
  for (let I = Actor.BuffCount - 1; I >= 0; I--) {
    let buff = Actor.GetBuffByIndex(I)
    if (buff && buff.GetGroupID() == GroupID) {
      A = true
      break
    }
  }
  return A
}
// 目标方向扇形坐标获取
export function GetActorSXxy(Actor: TActor, oldx: number, oldy: number, dir: number, attackRange: number) {
  let dir2 = (dir + 2) % DirectionSet.length;
  let point1 = DirectionSet[dir]
  let point2 = DirectionSet[dir2]
  let Ruselt = []
  for (let i = 0; i < attackRange; i++) {
    let x = oldx + (i + 1) * point1.x
    let y = oldy + (i + 1) * point1.y
    for (let j = -i; j <= i; j++) {
      let newX = x + j * point2.x
      let newY = y + j * point2.y
      //console.log(newX + " " + newY)
      Ruselt.push(newX)
      Ruselt.push(newY)
    }
  }
  return Ruselt
}
// 目标方向直线坐标获取
export function GetActorZXxy(Actor: TActor, oldx: number, oldy: number, dir: number, attackRange: number) {
  let point1 = DirectionSet[dir]
  let Ruselt = []
  for (let i = 0; i < attackRange; i++) {
    let x = oldx + (i + 1) * point1.x
    let y = oldy + (i + 1) * point1.y
    Ruselt.push(x)
    Ruselt.push(y)
  }
  return Ruselt
}
//方向配置
export const DirectionSet = [
  { x: 0, y: -1, },
  { x: 1, y: -1, },
  { x: 1, y: 0, },
  { x: 1, y: 1, },
  { x: 0, y: 1, },
  { x: -1, y: 1, },
  { x: -1, y: 0, },
  { x: -1, y: -1, },
]
// 技能ID转换技能名称
export function 技能ID转换技能名称(index: number): string {
  let Str: string
  switch (index) {
    case 0: Str = '普通攻击'; break;
    case 10000: Str = '怒斩'; break;
    case 10001: Str = '人之怒'; break;
    case 10002: Str = '地之怒'; break;
    case 10003: Str = '天之怒'; break;
    case 10004: Str = '神之怒'; break;
    case 10005: Str = '血气献祭'; break;
    case 10006: Str = '血气燃烧'; break;
    case 10007: Str = '血气吸纳'; break;
    case 10008: Str = '血气迸发'; break;
    case 10009: Str = '血魔临身'; break;
    case 10010: Str = '暗影猎取'; break;
    case 10011: Str = '暗影袭杀'; break;
    case 10012: Str = '暗影剔骨'; break;
    case 10013: Str = '暗影风暴'; break;
    case 10014: Str = '暗影附体'; break;
    case 10015: Str = '火焰追踪'; break;
    case 10016: Str = '火镰狂舞'; break;
    case 10017: Str = '烈焰护甲'; break;
    case 10018: Str = '爆裂火冢'; break;
    case 10019: Str = '烈焰突袭'; break;
    case 10020: Str = '圣光'; break;
    case 10021: Str = '行刑'; break;
    case 10022: Str = '洗礼'; break;
    case 10023: Str = '审判'; break;
    case 10024: Str = '神罚'; break;
    case 10025: Str = '如山'; break;
    case 10026: Str = '泰山'; break;
    case 10027: Str = '人王盾'; break;
    case 10028: Str = '铁布衫'; break;
    case 10029: Str = '金刚掌'; break;
    case 10055: Str = '攻杀剑术'; break;
    case 10063: Str = '刺杀剑术'; break;
    case 10056: Str = '半月弯刀'; break;
    case 10057: Str = '雷电术'; break;
    case 10058: Str = '暴风雪'; break;
    case 10059: Str = '灵魂火符'; break;
    case 10060: Str = '飓风破'; break;
    case 10061: Str = '暴击术'; break;
    case 10062: Str = '霜月'; break;
    case 150: Str = '精准剑术'; break;
    case 226: Str = '万箭齐发'; break;
    case 204: Str = '罗汉棍法'; break;
    case 207: Str = '天雷阵'; break;
    default: Str = '未知技能伤害';
  }
  return Str
}
export function JobToStr(Player: TPlayObject): string {
  switch (Player.Job) {
    case 0: return '战士';
    case 1: return '法师';
    case 2: return '道士';
    case 3: return '刺客';
    case 4: return '弓箭';
    case 5: return '和尚';
    default: return '未知';
  }
}
// 检查包裹空位
export function 检查包裹空位(Player: TPlayObject, Count: number): Boolean {
  if (Player.MaxBagSize - Player.ItemSize >= Count) {
    return true
  } else {
    Player.MessageBox('提示：\\\\请确认背包留有至少 ' + String(Count) + ' 格空位！');
    return false
  }
}