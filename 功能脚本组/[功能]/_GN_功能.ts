// 系统 物品 背包


export const 刷新 = {
    物品(Player: TPlayObject, 物品对象: TUserItem) {
        Player.UpdateItem(物品对象)
    },
    外观(Player: TPlayObject) {
        Player.RefFeature()//刷新外观
    },
    属性(Player: TPlayObject) {
        Player.RecalcAbilitys()//刷新属性
    }

}


export const 背包 = {
    取物品数量(Player: TPlayObject, 物品名: string): number {
        return Player.GetItemCount(物品名)
    },
    删除物品(Player: TPlayObject, 物品名: string, 数量: number) {
        let 需要删除的数量 = 数量
        for (let i = Player.MaxBagSize; i > -1; i--) {
            let 物品对象 = Player.GetBagItem(i)
            //  console.log(物品对象)
            if (物品对象 != undefined && 物品对象.Name == 物品名) {
                let 当前数量 = 物品对象.Dura
                if (当前数量 >= 需要删除的数量) {
                    Player.DeleteItem(物品对象, 需要删除的数量)
                    return
                } else {
                    Player.DeleteItem(物品对象, 当前数量)
                    需要删除的数量 = 需要删除的数量 - 当前数量
                }


            }
        }
    },
    物品是否绑定(物品:TUserItem):boolean{
        return 物品.State.Bind
    },
    绑定物品(Player:TPlayObject,物品:TUserItem){
        物品.State.Bind = true
        刷新.物品(Player,物品)
    }

}

export const 增加 = {
    金币(Player: TPlayObject, 数量: number, 备注: string) {
        Player.AddGameMoney(1, 数量, 备注)//金币=1,元宝=2,礼金(钻石)=3
    },
    元宝(Player: TPlayObject, 数量: number, 备注: string) {
        Player.AddGameMoney(2, 数量, 备注)//金币=1,元宝=2,礼金(钻石)=3
    },
    钻石(Player: TPlayObject, 数量: number, 备注: string) {
        Player.AddGameMoney(3, 数量, 备注)//金币=1,元宝=2,礼金(钻石)=3
    },
    经验(Player: TPlayObject, 经验值: number) {
        Player.AddExp(经验值)
    },
}
export const 获取 = {
    金币(Player: TPlayObject): number {
        return Player.GetGameMoney(1) //金币=1,元宝=2,礼金(钻石)=3
    },
    元宝(Player: TPlayObject): number {
        return Player.GetGameMoney(2) //金币=1,元宝=2,礼金(钻石)=3
    },
    钻石(Player: TPlayObject): number {
        return Player.GetGameMoney(3) //金币=1,元宝=2,礼金(钻石)=3
    },

}
export const 扣除 = {
    金币(Player: TPlayObject, 数量: number, 备注: string) {
        Player.TakeGameMoney(1, 数量, 备注)//金币=1,元宝=2,礼金(钻石)=3
    },
    元宝(Player: TPlayObject, 数量: number, 备注: string) {
        Player.TakeGameMoney(2, 数量, 备注)//金币=1,元宝=2,礼金(钻石)=3
    },
    钻石(Player: TPlayObject, 数量: number, 备注: string) {
        Player.TakeGameMoney(3, 数量, 备注)//金币=1,元宝=2,礼金(钻石)=3
    },
}

export const 系统 = {
    信息框(Player: TPlayObject, 信息内容: string) {
        Player.MessageBox(信息内容)
    },
    取随机数(最小数: number, 最大数: number): number {
        return 最小数 + Math.round(Math.random() * (最大数 - 最小数))
    },
    取文本中间(总文本: string, 前文本: string, 后文本: string): string {
        let 索引1 = 总文本.indexOf(前文本)
        let 索引2 = 总文本.indexOf(后文本)
        return 总文本.substring(索引1 + 1, 索引2)
    },
    取文本左边(文本: string, 标识文本: string): string {
        let 位置 = 文本.indexOf(标识文本)
        let 返回 = 文本.substring(0, 位置)
        return 返回 != "" ? 返回 : ""
    },
    取文本右边(文本: string, 标识文本: string): string {
        let 位置 = 文本.indexOf(标识文本)
        let 返回 = 文本.substring(位置+1, 文本.length)
        return 返回 != "" ? 返回 : ""
    },
    触发几率(百分比: number): boolean {
        if (百分比 <= 0) {
            return false
        } else {
            let 随机数 = 系统.取随机数(1, 100)
            //如果百分比为40 ,那随机数取 1 到 40 就返回真
            if (随机数 <= 百分比) {
                return true
            } else {
                return false
            }
        }
    },
    被整除(除号前: number, 除号后: number): boolean {
        return 除号前 >= 除号后 && 除号前 % 除号后 == 0 ? true : false
    },
}

export const 时间 = {
    格式化():string{
        let 时间 = new Date()
        return 时间.getFullYear()+"-"+(时间.getMonth() + 1)+"-"+时间.getDate()+" "+时间.getHours()+":"+时间.getMinutes()+":"+时间.getSeconds()
    }

    // Player.SendMessage("年：" + new Date().getFullYear())
    // Player.SendMessage("月：" + new Date().getMonth() + 1)
    // Player.SendMessage("日：" + new Date().getDate())
    // Player.SendMessage("星期：" + new Date().getDay())
    // Player.SendMessage("时：" + new Date().getHours())
    // Player.SendMessage("分：" + new Date().getMinutes())
    // Player.SendMessage("秒：" + new Date().getSeconds())
}

export const 地图 = {
    取可移动坐标(地图对象: TEnvirnoment, 最小X: number, 最大X: number, 最小Y: number, 最大Y: number): { X: number, Y: number } {
        while (true) {
            let X = 系统.取随机数(最小X, 最大X)
            let Y = 系统.取随机数(最小Y, 最大Y)
            if (地图对象.CanMove(X, Y, true) == true) {
                return { X, Y }
            }
        }
    },
    刷怪(地图对象: TEnvirnoment, 怪物名: string, 数量: number, X: number, Y: number, 范围: number): TActorList {
        let 阵营ID = undefined
        let 国家ID = undefined
        let 标记 = undefined
        let 刷新触发 = false
        let 死亡触发 = true
        let 杀人触发 = false
        let 受到伤害触发 = true
        return GameLib.MonGenEx(地图对象, 怪物名, 数量, X, Y, 范围, 阵营ID, 国家ID, 标记, 刷新触发, 死亡触发, 杀人触发, 受到伤害触发)
    }
}

export const 文本 = {
    转义(文本: string): string {
        文本 = ReplaceStr(文本, "\\", "#92")
        文本 = ReplaceStr(文本, "{", "#123")
        文本 = ReplaceStr(文本, "}", "#125")
        文本 = ReplaceStr(文本, ";", "#59")
        文本 = ReplaceStr(文本, `
        `, "")
        return 文本
    },
    //小写数字转大写
    转大写(小写数字: number): string {
        return new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十')[小写数字]
    }
}


