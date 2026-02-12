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

export const 输出 = {
    /**0：红色消息  1: 绿色消息 2：蓝色消息 3: 直接模拟玩家聊天信息，比如：“/张三 你好！” */
    聊天框(Player: TPlayObject, 信息: string, 颜色: number = 0) {
        Player.SendMessage(信息, 颜色)
    },
    广播(国家ID: number = 0, 信息: string) {
        for (let i = 0; i < GameLib.PlayCount; i++) {
            let player = GameLib.GetPlayer(i)
            if (player && (player.Nation == 国家ID || 国家ID == 0)) {
                输出.聊天框(player, 信息,1)
            }
        }
    },
    个人: {
        /** 类型:0 :自己可见 1：所有人可见 2：行会可见 3：当前地图所有玩家可见 */
        中部(Player: TPlayObject, 信息: string, 类型: number = 0, 显示毫秒: number = 1000) {
            Player.SendCenterMessage(信息, 类型, 显示毫秒)
        },
        底部(Player: TPlayObject, 信息: string, 类型: number = 0) {
            Player.SendCountDownMessage(信息, 类型)
        },
    },
    公告: {
        顶部(信息: string) {
            GameLib.BroadcastTopMessage(信息)
        },
        中部(信息: string, 时间: number = 1000) {
            GameLib.BroadcastCenterMessage(信息, 时间)
        },
        底部(信息: string) {
            GameLib.BroadcastCountDownMessage(信息)
        },
        系统(信息: string) {
            GameLib.Broadcast(信息)
        },
        系统EX(信息: string) {
            GameLib.BroadcastSay(信息, 94, 0)
        },
        系统EX2(信息: string, 颜色代码: number) {
            GameLib.BroadcastSay(信息, 颜色代码, 0)
        }
    }
}

export const 背包 = {
    取物品数量(Player: TPlayObject, 物品名: string): number {
        return Player.GetItemCount(物品名)
    },
    删除物品(Player: TPlayObject, 物品名: string, 数量: number) {
        let 需要删除的数量 = 数量
        if (数量 <= 0) {
            return
        }
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
    物品是否绑定(物品: TUserItem): boolean {
        return 物品.State.Bind
    },
    绑定物品(Player: TPlayObject, 物品: TUserItem) {
        物品.State.Bind = true
        刷新.物品(Player, 物品)
    },
    取空格数(Player: TPlayObject): number {
        console.log(Player.MaxBagSize, Player.ItemSize);

        return Player.MaxBagSize - Player.ItemSize - 6
    },
    给物品(Player: TPlayObject, 物品名: string, 数量: number, 绑定: boolean = false, 叠加物品: boolean = false) {
        if (叠加物品) {
            let item = Player.GiveItem(物品名)
            if (item) {
                if (数量 > 1) {
                    item.Dura = 数量
                }
                if (绑定 == true) {
                    item.State.Bind = true
                }
                刷新.物品(Player, item)
            }

        } else {
            for (let i = 0; i < 数量; i++) {
                let item = Player.GiveItem(物品名)
                if (item) {
                    if (绑定 == true) {
                        item.State.Bind = true
                    }
                    刷新.物品(Player, item)
                }
            }
        }

    },
    
    给叠加物品(Player: TPlayObject, 物品名: string, 数量: number, 绑定: boolean = false) {
        // 检测背包是否有这个物品
        if (Player.GetItemCount(物品名) > 0) {
            // 有物品，找到它并增加数量
            for (let i = 0; i < Player.GetItemSize(); i++) {
                const 背包物品 = Player.GetBagItem(i);
                if (背包物品 && 背包物品.GetName() === 物品名) {
                    背包物品.Dura += 数量;
                    if (绑定 == true) {
                        背包物品.State.Bind = true;
                    }
                    Player.UpdateItem(背包物品);
                    break;
                }
            }
        } else {
            // 没有物品，给予新物品
            let item = Player.GiveItem(物品名);
            if (item) {
                item.Dura = 数量;
                if (绑定 == true) {
                    item.State.Bind = true;
                }
                刷新.物品(Player, item);
            }
        }
    },

    给物品byID(Player: TPlayObject, 数据库ID: number, 数量: number, 绑定: boolean = false) {
        let item = Player.GiveItemByIndex(数据库ID + 1)
        if (数量 > 1) {
            item.Dura = 数量
        }
        if (绑定 == true) {
            item.State.Bind = true
        }
        刷新.物品(Player, item)
    }

}

export const 增加 = {
    金币(Player: TPlayObject, 数量: number, 备注: string) {
        Player.AddGameMoney(1, 数量, 备注)//金币=1,元宝=2,礼金(灵符)=3
    },
    元宝(Player: TPlayObject, 数量: number, 备注: string) {
        Player.AddGameMoney(2, 数量, 备注)//金币=1,元宝=2,礼金(灵符)=3
    },
    灵符(Player: TPlayObject, 数量: number, 备注: string) {
        Player.AddGameMoney(3, 数量, 备注)//金币=1,元宝=2,礼金(灵符)=3
    },
    经验(Player: TPlayObject, 经验值: number) {
        Player.AddExp(经验值)
    },
}
export const 获取 = {
    金币(Player: TPlayObject): number {
        return Player.GetGameMoney(1) //金币=1,元宝=2,礼金(灵符)=3
    },
    元宝(Player: TPlayObject): number {
        return Player.GetGameMoney(2) //金币=1,元宝=2,礼金(灵符)=3
    },
    灵符(Player: TPlayObject): number {
        return Player.GetGameMoney(3) //金币=1,元宝=2,礼金(灵符)=3
    },

}
export const 扣除 = {
    金币(Player: TPlayObject, 数量: number, 备注: string) {
        Player.TakeGameMoney(1, 数量, 备注)//金币=1,元宝=2,礼金(灵符)=3
    },
    元宝(Player: TPlayObject, 数量: number, 备注: string) {
        Player.TakeGameMoney(2, 数量, 备注)//金币=1,元宝=2,礼金(灵符)=3
    },
    灵符(Player: TPlayObject, 数量: number, 备注: string) {
        Player.TakeGameMoney(3, 数量, 备注)//金币=1,元宝=2,礼金(灵符)=3
    },
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
export const 时间 = {
    格式化(): string {
        let 时间 = new Date()
        return 时间.getFullYear() + "-" + (时间.getMonth() + 1) + "-" + 时间.getDate() + " " + 时间.getHours() + ":" + 时间.getMinutes() + ":" + 时间.getSeconds()
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
    刷怪(地图对象: TEnvirnoment, 国家ID: number, 怪物名: string, 数量: number, X: number, Y: number, 范围: number): TActorList {
        //let 国家ID = undefined
        const 阵营ID = undefined
        const 标记 = undefined
        const 刷新触发 = true
        const 死亡触发 = true
        const 杀人触发 = false
        const 受到伤害触发 = true
        return GameLib.MonGenEx(地图对象, 怪物名, 数量, X, Y, 范围, 阵营ID, 国家ID, 标记, 刷新触发, 死亡触发, 杀人触发, 受到伤害触发)
    },
    刷怪NPC(怪物名: string, NPC名: string, Map: TEnvirnoment, X: number, Y: number, 脚本文件?: string, 国家ID?: number) {
        const 阵营ID = 0
        const 攻击不同阵营 = true
        const 攻击不同国家 = true
        const 攻击红名 = false
        const 攻击怪物 = true
        // 添加一个怪物NPC
        // MonName: 怪物名称；NpcName: NPC名称；MapName: 目标地图名称；MapX, MapY: 刷新位置；AUnitName: 和怪物NPC关联的脚本单元名；
        // Camp: 阵营；Nation: 国别；AttackDiffCamp: 是否攻击不同阵营对象；AttackDiffNation: 是否攻击不同国别对象；AttackRed: 是否攻击红名；AttackMon: 是否攻击怪物

        return GameLib.AddMonNpcEx(怪物名, NPC名, Map, X, Y, 脚本文件, 阵营ID, 国家ID, 攻击不同阵营, 攻击不同国家, 攻击红名, 攻击怪物)

    }
}







