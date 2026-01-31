
const 选项 = ['装备', '材料']
const 选中 = 239
const 取消 = 238

class 物品 {
    ID: number
    名称: string
    阶数: number
    StmMode: number
    穿戴等级: number
    限制职业: number
    constructor(ID: number, 名称: string, 阶数: number, StmMode: number, 穿戴等级: number, 限制职业: number) {
        this.ID = ID
        this.名称 = 名称
        this.阶数 = 阶数
        this.StmMode = StmMode
        this.穿戴等级 = 穿戴等级
        this.限制职业 = 限制职业
    }
}


interface 筛选 {
    选项: boolean[]
}
function 初始化(Player: TPlayObject) {
    Player.R.可视仓库 ??= {}
    Player.R.可视仓库.选项 ??= []
    let V = 取V(Player)

    for (let i = 0; i < 选项.length; i++) {
        V.选项[i] ??= true
    }
}

function 取V(Player: TPlayObject): 筛选 {
    return Player.R.可视仓库
}

//=======================
//=======  入 口  =======
//=======================
export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    // if (VIP.取VIP等级(Player) < 4) {
    //     功能.系统.信息框(Player, 'VIP4以上才能使用随身仓库')
    //     return
    // }


    初始化(Player)
    let V = 取V(Player)
    const 当前页码 = Args.Int[0] == 0 ? 1 : Args.Int[0]
    // let str = `<{s=全选;x=580;y=60}/@可视仓库.设置(${Args.Int[0]},全选)>    <{s=全消;y=60}/@可视仓库.设置(${Args.Int[0]},全消)>    <{s=反选;y=60}/@可视仓库.设置(${Args.Int[0]},反选)>`
    let str = ``
    //遍历到项链以后,在起一行
    for (let i = 0; i < 选项.length; i++) {
        //i到14以后, x=30
        let x = 30 + i % 14 * 53
        let y = i >= 14 ? 75 : 55
        str += `<&{i=${V.选项?.[i] == true ? 选中 : 取消};x=${x};y=${y}}{s=${选项[i]};y=${y};c=${V.选项?.[i] == true ? 116 : 248}}/@可视仓库.选择(${当前页码},${i})>`
    }

    let 显示物品 = 筛选物品(Player)
    const 一页数量 = 153
    const 总页码 = Math.ceil(显示物品.length / 一页数量)

    let a = -1
    for (let i = 0; i < 显示物品.length; i++) {
        if (i < (当前页码 - 1) * 一页数量 || i >= 当前页码 * 一页数量) {
            continue
        }
        a++
        //每行显示15个
        let x = 32 + (a) % 17 * 43
        //向下取整
        let y = 98 + Math.floor(a / 17) * 43
        let item = Player.GetBigStorageItem(显示物品[i])
        str += `\\<{u=${item.MakeString()};x=${x};y=${y}}/@可视仓库.取物品(${当前页码},${显示物品[i]})>`
    }
    //上一页 当前页码/总页码 下一页
    str += 当前页码 > 1 ? `<&{s=上一页;x=600;y=480}/@可视仓库.翻页(${当前页码 - 1})>` : `{s=上一页;x=600;y=480;c=236}`
    str += `{s=  ${当前页码}/${总页码}  ;y=480}`
    str += 当前页码 < 总页码 ? `<&{s=下一页;y=475}/@可视仓库.翻页(${当前页码 + 1})>` : `{s=下一页;y=480;c=236}`


    // str += `\\<{u=${item.MakeString()};x=${x};y=${y}}/@可视仓库.取物品(${i})>`
    Npc.SayEx(Player, "随身仓库", str)

 
}

export function 翻页(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Main(Npc, Player, Args)
}


export function 选择(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    let 选项 = Args.Int[1]
    let V = 取V(Player)
    V.选项[选项] = !V.选项[选项]
    Main(Npc, Player, Args)
}
export function 设置(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 设置 = Args.Str[1]
    let V = 取V(Player)
    switch (设置) {
        case '全选':
            for (let i = 0; i < V.选项.length; i++) {
                V.选项[i] = true
            }
            break;
        case '全消':
            for (let i = 0; i < V.选项.length; i++) {
                V.选项[i] = false
            }
            break;
        case '反选':
            for (let i = 0; i < V.选项.length; i++) {
                V.选项[i] = !V.选项[i]
            }
    }
    Main(Npc, Player, Args)
}
export function 取物品(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let ID = Args.Int[1]
    Player.TakebackBigStorageItem(ID)
    Main(Npc, Player, Args)
}

export function 筛选物品(Player: TPlayObject): number[] {
    let V = 取V(Player)
    let 待显示信息: 物品[] = []
    for (let i = 0; i < Player.BigStorageItemsCount; i++) {
        let item = Player.GetBigStorageItem(i)
        if (item && 是否加入(Player, item)) {

            待显示信息.push(new 物品(i, item.Name, 取阶数(item), item.StdMode, item.NeedLevel, item.Job))
        }
    }

    return 排序(待显示信息)
}

function 是否加入(Player: TPlayObject, item: TUserItem): boolean {
    let V = 取V(Player)
    for (let i = 0; i < 选项.length; i++) {
        let 是否选中 = V.选项[i] == true
        if (是否选中 == false) {
            continue
        }
        let 是否为装备 = 是否为装备啊(item)
        switch (true) {
            case 选项[i] == '装备' && 是否为装备: return true
            case 选项[i] == '材料' && !是否为装备: return true
        }
    }

    return false
}
//待筛选信息排序
function 排序(待显示信息: 物品[]): number[] {
    待显示信息.sort((a, b) => {
        if (a.阶数 != b.阶数) {

            return a.阶数 - b.阶数
        }
        if (a.穿戴等级 != b.穿戴等级) {
            return a.穿戴等级 - b.穿戴等级
        }
        if (a.限制职业 != b.限制职业) {
            return a.限制职业 - b.限制职业
        }
        if (a.名称 != b.名称) {
            return a.名称 > b.名称 ? 1 : -1
        }
        return 0
    })



    return 待显示信息.map(i => i.ID)
}

//取阶数
export function 取阶数(item: TUserItem): number {
    let name = item.Name

    if (name.includes('品]')) {
        return Number(系统.取文本中间(item.Name, ']', '阶'))
    }

    if (name.includes('】·')) {
        return Number(系统.取文本中间(item.Name, '·', '阶'))
    }

    return 0
}



export const 系统 = {
    信息框(Player: TPlayObject, 信息内容: string) {
        Player.MessageBox(信息内容)
    },
    确认取消框(Player: TPlayObject, 信息内容: string, 确认函数: string, 取消函数: string) {
        Player.Question(信息内容, 确认函数, 取消函数)
    },
    取随机数(最小数: number, 最大数: number): number {
        return 最小数 + Math.round(Math.random() * (最大数 - 最小数))
    },
    取文本中间(总文本: string, 前文本: string, 后文本: string): string {
        let 开始位置 = 总文本.indexOf(前文本)
        if (开始位置 == -1) {
            return ""
        }
        let 结束位置 = 总文本.indexOf(后文本, 开始位置 + 前文本.length)
        if (结束位置 == -1) {
            return ""
        }
        return 总文本.substring(开始位置 + 前文本.length, 结束位置)
    },
    取文本左边(文本: string, 标识文本: string): string {
        let 位置 = 文本.indexOf(标识文本)
        let 返回 = 文本.substring(0, 位置)
        return 返回 != "" ? 返回 : ""
    },
    取文本右边(文本: string, 标识文本: string): string {
        let 位置 = 文本.indexOf(标识文本)
        let 返回 = 文本.substring(位置 + 1, 文本.length)
        return 返回 != "" ? 返回 : ""
    },
    百分比几率(百分比: number): boolean {
        if (百分比 <= 0) {
            return false
        }
        if (百分比 >= 100) {
            return true
        }

        let 随机数 = 系统.取随机数(1, 100)
        //如果百分比为40 ,那随机数取 1 到 40 就返回真
        if (随机数 <= 百分比) {
            return true
        } else {
            return false
        }

    },
    千分比几率(千分比: number): boolean {
        if (千分比 <= 0) {
            return false
        } else {
            let 随机数 = 系统.取随机数(1, 1000)
            //如果百分比为40 ,那随机数取 1 到 40 就返回真
            if (随机数 <= 千分比) {
                return true
            } else {
                return false
            }
        }
    },
    被整除(除号前: number, 除号后: number): boolean {
        return 除号前 >= 除号后 && 除号前 % 除号后 == 0 ? true : false
    },
    取Player(actor: TActor): TPlayObject {
        if (!actor) {
            return undefined
        }
        if (actor.IsPlayer()) {
            return actor as TPlayObject
        }
        if (actor.Master && actor.Master.IsPlayer()) {
            return actor.Master as TPlayObject
        }

        return undefined
    },

    //两点之间的距离
    取两点距离(x1: number, y1: number, x2: number, y2: number): number {
        let dx: number, dy: number
        dx = x1 - x2;
        dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    },




}
export const 装备StdMode = [5, 6, 8, 10, 11, 15, 16, 19, 20, 21, 22, 23, 24, 26, 27, 28, 68,]

//是否为装备
export function 是否为装备啊(item: TUserItem): boolean {
    return 装备StdMode.includes(item.StdMode)
}