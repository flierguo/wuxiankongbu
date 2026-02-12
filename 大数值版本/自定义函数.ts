//判断是否有宝宝
export function 是否有宝宝(Player:TPlayObject, SlaveName:string):boolean {  
  let Accept:boolean =  false
  for(let i=0;i<=Player.SlaveCount-1;i++){
    if(Player.GetSlave(i).Name == SlaveName){
      Accept = true
      break;
    }
  }
  return Accept 
}
//判断当前时间是否在某个时间段之间
export function isBetweenNoonAndMidnight(Time1:number, Time2:number):boolean {  
  let Accept:boolean
  const now = new Date();  
  const hours = now.getHours();  
  if(hours >= Time1 && hours < Time2){
    Accept = true
  } else {
    Accept = false
  }
  return Accept 
}
//取走玩家身上指定物品
export function 拿走物品(Player: TPlayObject, ItemName:string, num:number):boolean {
  let Accept:boolean
  let n = 0;
  for (let I=0;I<= Player.MaxBagSize-1;I++){
    let AItem = Player.GetBagItem(I)
    if(AItem && AItem.Name == ItemName){
      if(AItem.StdMode == 42 && AItem.Dura > 1){
        n = n + AItem.Dura
      } else {
        n += 1
      }
    }
  }
  if(n >= num){
    n = num
    Accept = true
    for(let r=0;r<=num;r++){
      for (let I=Player.MaxBagSize-1;I>=0;I--){
        let AItem = Player.GetBagItem(I)
        if(AItem && AItem.Name == ItemName){
          Player.DeleteItem(AItem, 1)
          break;
        }
      } 
      n -= 1
      if(n==0){
        break;
      }
    }
  } else {
    Accept = false
  }
  return Accept
}
//检测对方身上GroupID是否存在 检测buff是否存在
export function CheckBuffGroupID(Actor: TActor, GroupID: number):boolean {
  let A = false
  for (let I = Actor.BuffCount-1; I >= 0; I--){
    let buff = Actor.GetBuffByIndex(I)
    if (buff && buff.GetGroupID() == GroupID){
      A = true
      break
    }
  }
  return A
}
// 目标方向扇形坐标获取
export function GetActorSXxy(Actor:TActor,oldx: number,oldy:number, dir: number, attackRange: number) {
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
export function GetActorZXxy(Actor:TActor,oldx: number,oldy:number, dir: number, attackRange: number) {
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
  {x: 0,y: -1,},
  {x: 1,y: -1,},
  {x: 1,y: 0,},
  {x: 1,y: 1,},
  {x: 0,y: 1,},
  {x: -1,y: 1,},
  {x: -1,y: 0,},
  {x: -1,y: -1,},
]
// 技能ID转换技能名称
export function 技能ID转换技能名称(index:number):string {
  let Str:string
  switch(index){
    case 0:     Str = '普通攻击'; break;
    case 1:     Str = '火球术'; break;
    case 7:     Str = '攻杀剑术'; break;
    case 12:    Str = '刺杀剑术'; break;
    case 22:    Str = '火墙'; break;
    case 150:   Str = '精准剑术'; break;
    case 170:   Str = '霜月X'; break;
    case 204:   Str = '罗汉棍法'; break;
    case 209:   Str = '达摩棍法'; break;
    case 216:   Str = '命运刹印'; break;
    case 217:   Str = '冰咆哮'; break;
    case 218:   Str = '雷电术'; break;
    case 219:   Str = '流星火雨'; break;
    case 220:   Str = '暴风雨'; break;
    case 221:   Str = '寒冬领域'; break;
    case 222:   Str = '灵魂火符'; break;
    case 223:   Str = '飓风破'; break;
    case 224:   Str = '剧毒火海'; break;
    case 225:   Str = '末日降临'; break;
    case 226:   Str = '万箭齐发'; break;
    case 227:   Str = '神灵救赎'; break;
    case 10000: Str = '万剑归宗'; break;
    case 10001: Str = '圣光打击'; break;
    case 10002: Str = '愤怒'; break;
    case 10003: Str = '审判救赎'; break;
    case 10004: Str = '冰霜之环'; break;
    case 10006: Str = '狂怒'; break;
    case 10008: Str = '战神附体'; break;
    case 10009: Str = '天神附体'; break;
    case 10010: Str = '防御姿态'; break;
    case 10011: Str = '惩罚'; break;
    case 10012: Str = '法术奥义'; break;
    case 10013: Str = '闪现'; break;
    case 10014: Str = '致命一击'; break;
    case 10015: Str = '打击符文'; break;
    case 10017: Str = '萌萌浣熊'; break;
    case 10018: Str = '凶猛野兽'; break;
    case 10019: Str = '嗜血狼人'; break;
    case 10020: Str = '丛林虎王'; break;
    case 10023: Str = '妙手回春'; break;
    case 10024: Str = '互相伤害'; break;
    case 10025: Str = '恶魔附体'; break;
    case 10027: Str = '弱点'; break;
    case 10028: Str = '增伤'; break;
    case 10029: Str = '致命打击'; break;
    case 10030: Str = '暗影杀阵'; break;
    case 10031: Str = '鬼舞斩'; break;
    case 10032: Str = '鬼舞术'; break;
    case 10033: Str = '鬼舞之殇'; break;
    case 10034: Str = '鬼舞者'; break;
    case 10035: Str = '群魔乱舞'; break;
    case 10036: Str = '复仇'; break;
    case 10037: Str = '成长'; break;
    case 10038: Str = '生存'; break;
    case 10040: Str = '分裂箭'; break;
    case 10041: Str = '召唤宠物'; break;
    case 10042: Str = '宠物突变'; break;
    case 10043: Str = '人宠合一'; break;
    case 10045: Str = '碎石破空'; break;
    case 10046: Str = '体质强化'; break;
    case 10047: Str = '至高武术'; break;
    case 10048: Str = '护法灭魔'; break;
    case 10049: Str = '金刚护法'; break;
    case 10050: Str = '金刚不败'; break;
    case 10051: Str = '金刚护体'; break;
    case 10052: Str = '擒龙功'; break;
    case 10053: Str = '罗汉金钟'; break;
    case 10059: Str = '天雷阵'; break;
    case 10062: Str = '施毒术'; break;
    case 10106: Str = '嘲讽吸怪'; break;
    case 10057: Str = '万箭齐发啊'; break;
    default:    Str = '未知技能伤害';
  }
  return Str
}
export function JobToStr(Player:TPlayObject):string{
  switch(Player.Job){
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