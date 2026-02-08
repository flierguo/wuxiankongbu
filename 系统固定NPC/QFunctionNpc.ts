

import { 攻击触发, 释放魔法触发 } from "../_核心部分/_玩家/攻击触发"
import { 装备掉落 } from "../_核心部分/_装备/装备掉落"
import { monitoring } from "../_核心部分/_服务/_GN_Monitoring"
import * as _P_Base from "../_核心部分/基础常量"

import { 使用物品 } from "../_核心部分/_装备/物品使用"
import { 取两点距离 } from "./RobotManageNpc"

import { 装备属性统计 } from "../_核心部分/_装备/属性统计"
import { 更新套装显示 as 玩家更新套装显示, 应用套装加成 } from "../_核心部分/_装备/随机套装"

import { Main } from "../后台管理"
import * as 地图 from '../_核心部分/_地图/地图';

import { 实时回血, 血量显示 } from "../_核心部分/字符计算"
import * as 随身仓库 from "../_核心部分/_服务/可视仓库"
import { 杀怪触发 } from "../_核心部分/_玩家/杀怪触发"

// 导入开关类/光环类技能函数
import { 圣光, 血气燃烧, 暗影剔骨, 烈焰护甲, 如山, 血魔临身, 暗影附体 } from "./MagicNpc"
import { 技能ID } from "../_核心部分/基础常量"

//人物杀怪
GameLib.onKillMonster = (Player: TPlayObject, Monster: TActor): void => {
    Randomize()
    杀怪触发(Player, Monster);  //人物杀怪获得经验

}
//宝宝杀怪触发
GameLib.onSlaveKillMonster = (Player: TPlayObject, Slave: TActor, Monster: TActor): void => {
    Randomize()
    // 宝宝杀怪触发(Player, Slave, Monster);//宝宝杀怪人物获得经验;

}
//人物死亡触发
GameLib.onPlayerDie = (Player: TPlayObject, Killer: TActor): void => {
    // console.log(Killer.Name)
    // GameLib.BroadcastSay(`{S=玩家:;C=251}{S=${Player.GetName()};C=250}{S=在;C=251}{S=${Player.GetMap().GetName()}.${Player.GetMapX()}.${Player.GetMapY()};C=254}{S=被;C=251}{S=${Killer.GetName()};C=249}{S=杀死了.;C=251}`, 249, 12);
    Player.SetNoDropItem(false) //不爆出背包物品,设置为False则允许爆出
    Player.SetNoDropUseItem(false)  //不爆出穿戴物品,设置为False则允许爆出

    if (Player.V.猎人) {
        Player.R.猎人宝宝释放群攻 = false
    }
    if (Player.V.驯兽师) {
        Player.R.宝宝释放群雷 = false
    }

    Player.ReloadBag()
    if (Player.SlaveCount > 0) { Player.KillSlave(''); Player.GetSlave(0).MakeGhost() }
    // console.log(`宝宝数量=${Player.SlaveCount}`)
    // const 圣墟地图 = 地图.ID取地图名(Player.Map.MapName)
    // if(圣墟地图 == '圣墟'){
    //     Player.V.圣墟等级 = 0
    //     Player.V.圣墟跨越层级 = 1
    //     Player.V.圣墟挑战层数记录 = 0
    // }

    // 显示复活选择弹窗
    const S = `\\\\
    {S=你已经死亡，请选择复活方式:;C=249;X=120;Y=60}\\
    \\
    <{S=回城复活;HINT=免费回到安全区复活;C=250;X=60;Y=120}/@延时触发.免费复活>\\
    <{S=原地复活;HINT=消耗2000元宝原地满血复活;C=251;X=260;Y=120}/@延时触发.收费复活>\\
`
    Player.SayEx('人物死亡', S)
}
//人物复活触发
GameLib.onPlayerReAlive = (Player: TPlayObject): void => { }
//人物升级触发
GameLib.onPlayerLevelUp = (Player: TPlayObject, Level: number): void => {
    实时回血(Player, Player.GetSVar(92))
    血量显示(Player)
    装备属性统计(Player);/*重新计算玩家身上的装备*/

}
//BB升级触发 Master:BB属于谁(可能是人形怪) Slave:当前升级的BB NewLevel:将要升到的级数 Accept:是否允许升级,默认为True,如果设置为False则BB不可升级
GameLib.onSlaveLevelUp = (Master: TActor, Slave: TActor, NewLevel: number): boolean => { return false }
//PlayerAction函数，可以用来脚本封挂。Accept值为True 则执行动作，反之则不执行。默认为True。Action值代表不同的动作：
/* 1 攻击 2 魔法 3 骑马跑动 4 跑动 5 走路 6 转向 7 挖肉 8 点击脚本 9 点击NPC */
GameLib.onPlayerAction = (PlayObject: TPlayObject, Action: number, Allow: boolean): boolean => {
    monitoring(PlayObject, Action);
    // if (Action==4){
    // PlayObject.MagicAttack(PlayObject,22,false)
    // }
    return true
}
//人物修习技能触发
GameLib.onPlayAddSkill = (Player: TPlayObject, Magic: TUserMagic): boolean => { return true }
//杀人触发
GameLib.onKillPlayer = (Killer: TPlayObject, Player: TPlayObject): void => {
    // if (GameLib.FindCastle('沙巴克').GetUnderWar() && Player.GetMapName() == '0150') {
    // 沙巴克(Killer, Player)
    // }

}
//宝宝杀人触发
GameLib.onSlaveKillPlayer = (Master: TPlayObject, Slave: TActor, Player: TPlayObject): void => { }
//人物攻击时触发: UserMagic为当前技能,可能为nil;Target为当前攻击的目标,可能为nil;Accept是否允许本次攻击,默认为是
GameLib.onPlayerAttack = (Player: TPlayObject, UserMagic: TUserMagic, Target: TActor): boolean => {

    if (Player.CheckState(2)) {   //被麻痹状态
        return false
    }
    if (Player.Job == 3 && UserMagic.MagID == 0) {
        Player.MagicAttack(Target, 技能ID.基础技能.霜月)
        return false
    }
    if (Player.Job == 0 && UserMagic.MagID == 0) {
        if (random(100) < 10) {
            Player.MagicAttack(Target, 技能ID.基础技能.攻杀剑术)
        } else
            Player.MagicAttack(Target, 技能ID.基础技能.半月弯刀)
        return false
    }

    if (Target) {
        攻击触发(Player, UserMagic, Target)
    }

    return true
}
GameLib.onMagicSpell = (Player: TPlayObject, UserMagic: TUserMagic, nTargetX: number, nTargetY: number, Target: TActor): boolean => {
    if (Player.CheckState(2)) {   //被麻痹状态
        return true
    }
    if (UserMagic.GetMagID() == 166) {  //用了潜行再用自定义技能随便放个内置技能强行退出隐身
        return true
    }

    // ==================== 开关类/光环类技能处理 ====================
    // 这些技能无需目标即可触发，直接在此处理
    const 技能名 = UserMagic.GetName();
    const 开关类技能映射: { [key: string]: (Source: TActor, Target: TActor) => void } = {
        '圣光': 圣光,
        '血气燃烧': 血气燃烧,
        '暗影剔骨': 暗影剔骨,
        '烈焰护甲': 烈焰护甲,
        '如山': 如山,
        '血魔临身': 血魔临身,
        '暗影附体': 暗影附体,
    };

    const 技能函数 = 开关类技能映射[技能名];
    if (技能函数) {
        // 开关类技能直接调用对应的处理函数，传入玩家自身作为 Source 和 Target
        技能函数(Player, Player);
        return true; // 返回 true 表示已处理，不再执行引擎默认逻辑
    }

    释放魔法触发(Player, UserMagic, Target)


    return false
}
//人物获得经验值时触发

GameLib.onGetExpEx = (Player: TPlayObject, ExpActor: TActor, Exp: number, ResultExp: number): number => {

    const 随机15经验 = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100];
    // if (Exp >= 1000000000) { Exp = 1; console.log('怪物名字=' + ExpActor + '玩家名字=' + Player.GetName()) }
    if (ResultExp >= 1000000) { ResultExp = 1000000 }

    // 获取玩家所在地图强度
    const 玩家地图ID = Player.GetMap().MapName;
    const 玩家地图强度 = 地图.地图ID取固定星级(玩家地图ID);

    // 如果地图强度低于10，1%的几率获得额外经验值
    if (玩家地图强度 < 20) {
        const 随机几率 = Math.random() * 50; // 生成0-100的随机数
        if (随机几率 < 3) { // 1%的几率
            const 随机索引 = Math.floor(Math.random() * 随机15经验.length);
            const 随机倍数 = 随机15经验[随机索引];
            Exp = Exp * 随机倍数;
            // console.log(`怪物名字=${ExpActor} 玩家名字=${Player.GetName()} 随机倍数=${随机倍数} 最终经验值=${Exp}`);
        }
    }

    if (Player.GetLevel() <= 300) {
        Exp = Exp * 50
    }
    if (Player.GetLevel() <= 500 && Player.GetLevel() > 300) {
        Exp = Exp * 10
    }
    if (Player.GetLevel() <= 1000 && Player.GetLevel() > 500) {
        Exp = Exp / 5
    }


    if (Exp >= 20000000) {
        Exp = 20000000;
        // console.log('怪物名字=' + ExpActor + '玩家名字=' + Player.GetName() + '经验值=' + Exp)
    }
    if (Player.Level >= 1000) {
        Exp = 0;
        ResultExp = 0;
    }
    return Exp
}

//决斗结束
GameLib.onDuelEnd = (Winner: TPlayObject, Loser: TPlayObject): void => { }
/*
    OnBagItemEvent:背包物品事件
    Item:和当前事件相关的物品
    EventType: 事件类型
        0:增加到背包
        1:从背包中移出
    EventID：事件ID
        EventType:0,
        EventID:
            0:捡取
            1:怪物身上挖出
            2:挖矿挖出  
            3:解包 
            4:从身上取下
            5:商店购买
            6:元宝商城购买
            7:礼金商城购买
            8:玩家交易获得
            9:交易市场购买
            10:交易市场下架   
            11:命令制造获得
            12:取仓库
            13:其他
        EventType:1,
        EventID:  
            0:丢弃
            1:死亡爆出
            2:出售
            3:正常使用   
            4:穿戴到身上
            5:交易给其他玩家
            6:到期销毁
            7:破损销毁
            8:上架到交易市场
            9:用脚本执行销毁或拿走
            10:存  
            11:其他
*/
GameLib.onBagItemEvent = (Player: TPlayObject, Item: TUserItem, EventType: number, EventID: number): void => {
}
//人物掉落物品(扔物)触发(针对监视物品):Player：玩家,Item: 物品,ISUseItem:是否为身上穿戴的物品,Accept:是否允许掉落(当物品规则中指定死亡必掉物品此参数无效)
GameLib.onPlayerDropItem = (Player: TPlayObject, Item: TUserItem, MapX: number, MapY: number, ISUseItem: boolean): boolean => { ; return true }
//人物扔物品触发(针对监视物品):Player：玩家,Item: 物品,Accept:是否允许扔出
GameLib.onPlayerThrowItem = (Player: TPlayObject, Item: TUserItem, MapX: number, MapY: number): boolean => {
    // let 装备字符串 = JSON.parse(Item.GetCustomDesc())
    // console.log(装备字符串)
    // const 拆分值 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 28, 29, 30, 31, 32, 33, 34]
    // for (let a = 0; a < 拆分值.length; a++) {
    //     console.log(Item.GetOutWay3(a))
    // }

    return true
}
//怪物掉落物品触发(针对监视物品)：Owner:物品所属玩家，Monster:掉落怪物,item:物品，Accept：是否允许掉落
GameLib.onMonDropItem = (Actor: TActor, Monster: TActor, Item: TUserItem, Map: TEnvirnoment, X: number, Y: number, Accept: boolean): boolean => {
    let Player: TPlayObject = Actor as TPlayObject;

    // 背包满了，掉落到地上
    if (Player.GetMaxBagSize() <= Player.GetItemSize()) {
        return false
    }

    // 先获取物品信息（防止后续被释放）
    const 物品名 = Item.Name
    const 物品StdMode = Item.StdMode
    const 物品数量 = Item.Dura || 1

    // 检查是否为装备类型
    const 有效装备类型 = [5, 6, 10, 11, 15, 16, 19, 20, 21, 22, 23, 24, 26, 27, 28, 68]

    if (有效装备类型.includes(物品StdMode)) {
        // 装备类型：调用装备掉落处理
        装备掉落(Player, Monster, Item)
    } else {
        // 非装备类型（材料等）：使用给叠加物品方式入包
        // 检测背包是否有这个物品
        if (Player.GetItemCount(物品名) > 0) {
            // 有物品，找到它并增加数量
            for (let i = 0; i < Player.GetItemSize(); i++) {
                const 背包物品 = Player.GetBagItem(i);
                if (背包物品 && 背包物品.GetName() === 物品名) {
                    背包物品.Dura += 物品数量;
                    Player.UpdateItem(背包物品);
                    break;
                }
            }
        } else {
            // 没有物品，给予新物品
            let item = Player.GiveItem(物品名);
            if (item) {
                item.Dura = 物品数量;
                Player.UpdateItem(item);
            }
        }
    }

    return false
}
//根据怪物名称爆出物品触发(针对监视物品)：Owner:物品所属玩家，Monster:怪物名称,item:物品，Accept：是否允许掉落
GameLib.onDropItemByMonName = (Owner: TPlayObject, Monster: string, Item: TUserItem): boolean => {
    // 默认允许掉落
    return true;
}

//挖矿时挖出物品触发: Player挖矿人 UserItem挖出的物品 Envir当前挖矿地图 Accept是否允许将该物品给玩家，默认为是
GameLib.onMineDropItem = (Player: TPlayObject, Item: TUserItem, Envir: TEnvirnoment, X: number, Y: number): boolean => { return true }
//当玩家点击采集物时执行 Player:当前进行采集的玩家 Monster:被采集的资源对象 Accept:是否允许执行采集
GameLib.onBeforeCollect = (Player: TPlayObject, Monster: TActor): boolean => {
    return false
}
//当玩家采集完成 Player:当前进行采集的玩家 Monster:被采集的资源对象 Accept:是否允许采集到物品
GameLib.onCollect = (TPlayObject, Monster: TActor): boolean => {
    return true
}
//从怪物升上挖掘道具触发:Accept表示该物品允许玩家拥有，默认为True
GameLib.onButchItem = (Player: TPlayObject, Monster: TActor, UserItem: TUserItem): boolean => { return true }
//购买商铺物品触发
GameLib.onBuyShopItem = (Player: TPlayObject, UserItem: TUserItem, Kind: number, ShopType: number, Count: number, Price: number): void => {
    // console.log(Price)
}
//商铺购买完成时触发
GameLib.onBuyShopItemEnd = (Player: TPlayObject, ItemName: string, Kind: number, ShopType: number, Count: number, ActualCount: number, Price: number): void => { }
//脱装备触发,Accept是否允许脱下,默认为True
GameLib.onTakeOffItem = (Player: TPlayObject, UserItem: TUserItem, ItemWhere: TItemWhere): boolean => {
    // 清空套(Player, UserItem, ItemWhere, false)
    // offItemSuit(Player, UserItem, ItemWhere, false)
    // Player.UpdateItem(UserItem)
    return true
}
//脱下装备且属性属性变化后触发
GameLib.onAfterTakeOffItem = (Player: TPlayObject, TakeOffItem: TUserItem, ItemWhere: number) => {
    // 如果脱下的是套装装备，清零该装备的穿戴数并设为未激活状态
    if (TakeOffItem.GetStdMode() === 68 && TakeOffItem.GetOutWay3(16) !== 0) {
        const 基础索引 = TakeOffItem.GetOutWay1(16)
        TakeOffItem.SetOutWay1(17, 基础索引 + 1)
        TakeOffItem.SetOutWay2(17, 0)
        TakeOffItem.SetOutWay1(18, 基础索引 + 3)
        TakeOffItem.SetOutWay2(18, 0)
        TakeOffItem.SetOutWay1(19, 基础索引 + 5)
        TakeOffItem.SetOutWay2(19, 0)
    }

    玩家更新套装显示(Player)
    应用套装加成(Player)
    装备属性统计(Player)
    Player.UpdateItem(TakeOffItem);
}
//穿装备触发,Accept是否允许穿戴,默认为True

GameLib.onTakeOnItem = (Player: TPlayObject, UserItem: TUserItem, ItemWhere: TItemWhere): boolean => {
    // try {
    //     // 安全获取装备名称
    //     const itemName = UserItem.GetName();
    //     const displayName = UserItem.DisplayName || itemName;

    //     if (displayName.indexOf('戒指') >= 0) {
    //         // DisplayName 包含"戒指"的装备可放入首饰盒任意槽位
    //         const jewelrySlots = [
    //             TItemWhere.wJewelry1, TItemWhere.wJewelry2, TItemWhere.wJewelry3,
    //             TItemWhere.wJewelry4, TItemWhere.wJewelry5, TItemWhere.wJewelry6
    //         ];

    //         for (let slot of jewelrySlots) {
    //             if (!Player.GetArmItem(slot)) {
    //                 Player.TakeOnItem(UserItem, slot);
    //                 break;
    //             }
    //         }
    //     }
    // } catch (e) {
    //     // 如果UserItem已被释放，跳过处理
    //     console.error(`[装备] 穿戴装备时发生错误: ${e}`);
    //     return true;
    // }
    return true
}
//穿戴装备且属性变化后触发，与OnTakeOnItem不同是 OnTakeOnItem 触发执行的时候装备附加的属性没有加到人身上。OnAfterTakeOnItem是属性已经附加到人物身上了。
GameLib.onAfterTakeOnItem = (Player: TPlayObject, TakeOnUserItem: TUserItem, TakeOffItem: TUserItem, ItemWhere: number) => {
    玩家更新套装显示(Player)
    应用套装加成(Player)
    装备属性统计(Player)
}

//使用物品时触发: StdMode=31,Accept:执行之后是否删除物品,默认为True,如果设置为False,则执行函数的同时不删除物品
GameLib.onStdModeFunc = (Player: TPlayObject, UserItem: TUserItem): boolean => {
    if (Player.GetStallState() == 3) {
        Player.MessageBox('摆摊期间禁止使用任何物品!')
        return false
    }
    使用物品(GameLib.QFunctionNpc, Player, UserItem);
    return true
}

//PickSender 拾取者, Item 拾取的物品. Gold . 金币数量(如果物品是金币 那么 此变量 不等于 0 否则 此变量等于0.可根据此变量是否为 0 判断拾取的是物品还是金币)  WhoPicker .最终拾取者(通过改变此值 可实现 A拾取 到B背包的功能)
//ItemState 0: 可以继续拾取 1.不允许继续拾取物品还在地图上 2.不允许继续拾取直接从地图删除物品
GameLib.onPickupItem = (Player: TPlayObject, Envir: TEnvirnoment, UserItem: TUserItem): boolean => {
    // console.log(UserItem.GetCustomEffect2())
    // 背包对比加箭头(Player)
    // UserItem.SetCustomEffect(0);
    // Player.UpdateItem(UserItem)
    // 拾取回收(Player,Envir,UserItem)
    // Player.DeleteItem(UserItem)
    return true
}
//玩家使用物品点击目标物品触发, 使用物品的StdMode=33,Accept:执行后是否删除使用物品，默认为是
GameLib.onItemClickItem = (Player: TPlayObject, Source: TUserItem, Dest: TUserItem): boolean => { return true }
//玩家使用物品点击身上穿戴的物品触发, 使用物品的StdMode=33,Accept:执行后是否删除使用物品，默认为是
GameLib.onItemClickUseItem = (Player: TPlayObject, ItemWhere: TItemWhere, Source: TUserItem, Dest: TUserItem): boolean => { return true }
//点击了背包中淬炼装备按钮 Handled设置为True后客户端将不弹出默认的淬炼窗口,Handled默认为False;如果需要在点击淬炼按钮的时候执行其他处理则在此事件中执行,同时将Handled设置为True
GameLib.onRefineButtonClick = (Player: TPlayObject): boolean => { return true }
//淬炼装备
GameLib.onRefineItem = (Player: TPlayObject, Item1: TUserItem, Item2: TUserItem, Item3: TUserItem): boolean => { return true }
//加入行会前触发
GameLib.onBeforeGuildAddMember = (Guild: TGuild, Player: TPlayObject): boolean => { return true }
//加入行会后触发
GameLib.onGuildAddedMember = (Guild: TGuild, Player: TPlayObject): void => { }
//退出行会前触发
GameLib.onBeforeGuildRemoveMember = (Guild: TGuild, Player: string): boolean => { return true }
//退出行会后触发
GameLib.onGuildRemovedMember = (Guild: TGuild, Player: string): void => { }
//队伍有角色加入时触发
GameLib.onGroupAddedMember = (Owner: TPlayObject, Member: TPlayObject): void => { }
//队伍有角色退出触发
GameLib.onGroupRemovedMember = (Owner: TPlayObject, Member: TPlayObject): void => { }
//获取宝箱物品触发
GameLib.onGetBoxItem = (Player: TPlayObject, Item: TUserItem, BoxID: number): void => { }
//用户执行进度条事件触发，只有脚本调用ShowProgress函数且最终执行其事件才会触发本函数
GameLib.onProgressEvent = (Player: TPlayObject, EventID: number): void => { }
//用户角度条执行失败触发
GameLib.onProgressFaild = (Player: TPlayObject, EventID: number): void => { }
//装备的魂炼等级提升时触发：
GameLib.onItemSoulLevelUp = (Player: TPlayObject, Item: TUserItem): void => { }
//角色称号系统当前称号发生变化后触发
GameLib.onActiveTitleChanged = (Player: TPlayObject): void => { }
//自由市场
GameLib.onStallPutOn = (Player: TPlayObject, Item: TUserItem, GoldPrice: number, GameGoldPrice: number, GamePointPrice: number): boolean => { return true }
GameLib.onStallPutOff = (Player: TPlayObject, Item: TUserItem, GoldPrice: number, GameGoldPrice: number, GamePointPrice: number): boolean => { return true }
//购买
GameLib.onStallBuyItem = (Player: TPlayObject, StallName: string, Item: TUserItem, Gold: number, GameGold: number, GamePointPrice: number): boolean => {
    return true
}
//修改物品价格
GameLib.onStallUpdateItem = (Player: TPlayObject, Item: TUserItem, OldGold: number, OldGameGold: number, OldGamePoint: number, Gold: number, GameGold: number, GamePoint: number): boolean => { return true }
//提取货款
GameLib.onStallExtractGold = (Player: TPlayObject, Gold: number, GameGold: number, GamePoint: number): boolean => {
    return true
}
//个人摊位
GameLib.onBeforeOpenStall = (Player: TPlayObject): boolean => {
    if (Player.GetMapName() != '摆摊地图') {
        Player.MessageBox('此地图无法摆摊!\\请去交易市场再执行此操作!')
        return false
    }
    return true
}
GameLib.onBeforeStartStall = (Player: TPlayObject): boolean => {
    return true
}
//玩家在摊位界面点击停止摆摊后触发
//Procedure Onafterstopstall(Npc: TNormNpc; Player: TPlayObject)
GameLib.onAfterStopStall = (Player: TPlayObject): void => { }
//邮件系统
GameLib.onMailBeforeSend = (Player: TPlayObject, SendTo: string, Item: TUserItem): boolean => {
    return false
}
GameLib.onMailAfterSend = (Player: TPlayObject, SendTo: string): void => { }
//坐骑 RideOn是骑马还是下马,True表示骑马;Accept表示是否允许本次骑马操作
GameLib.onRideOnHorse = (Player: TPlayObject, RideOn: boolean): boolean => { return true }
//客户端点击感叹号图标
GameLib.onClickSighIcon = (Player: TPlayObject, MethodID: number): void => { }
//ALT+左键点击背包物品触发,Item为被点击的物品
GameLib.onAltAndLButtonClickBagItem = (Player: TPlayObject, Item: TUserItem): void => {
    // let Npc = GameLib.QFunctionNpc
    // SaveItem(Npc, Player, Item)
}
//ALT+左键点击穿戴物品触发,Item为被点击的物品,AItemWhere为穿戴位置
GameLib.onAltAndLButtonClickUseItem = (Player: TPlayObject, Item: TUserItem, AItemWhere: TItemWhere): void => { }
//客户端骰子动画播放完毕触发处理事件 ATag:骰子标志 APoint: 骰子点数
GameLib.onDiceEvent = (Player: TPlayObject, ATag: number, APoint1: number, APoint2: number, APoint3: number): void => { }
//自定义UI中通过脚本发送的命令
GameLib.onCustomMessage = (Player: TPlayObject, AMessageToken: number, AParam1: number, AParam2: number, AParam3: number, AData: string): void => { }
//变身开始触发函数
GameLib.onChangeToMonsterStart = (Actor: TActor, sMonName: string, nSec: number): void => { }
//变身结束触发函数
GameLib.onChangeToMonsterEnd = (Actor: TActor, sMonName: string): void => { }
//PickSender 拾取者, Item 拾取的物品. Gold . 金币数量(如果物品是金币 那么 此变量 不等于 0 否则 此变量等于0.可根据此变量是否为 0 判断拾取的是物品还是金币)  WhoPicker .最终拾取者(通过改变此值 可实现 A拾取 到B背包的功能)
//ItemState 0: 可以继续拾取 1.不允许继续拾取物品还在地图上 2.不允许继续拾取直接从地图删除物品
GameLib.onPickUpItemChangePicker = (PickSender: TPlayObject, Item: TUserItem, Gold: number, WhoPicker: TPlayObject, ItemState: number): [number, TPlayObject, number] => {
    return [Gold, WhoPicker, ItemState]
}
GameLib.onUseExpStoneItem = (PlayObject: TPlayObject, Item: TUserItem): boolean => { return true }
//客户端左侧增加一个按钮
GameLib.onSideBarButtonClick = (Player: TPlayObject, AName: string): void => {
    // if (AName == '特殊') {
    //     let Args = new TArgs()
    //     Args.Add(1)
    //     ViewItems(GameLib.QFunctionNpc, Player, Args)
    // }

}
//自定义间隔作用类Buff触发(当添加自定义间隔作用类Buff之后 在间隔设定时间后)
GameLib.onCustomBuffAct = function (Actor: TActor, Buff: TBuff): void {
}

//移除Buff时触发
GameLib.onRemoveBuff = function (Actor: TActor, Buff: TBuff): void {
    // 🚀 性能优化：移除高频BUFF事件中的装备属性统计，避免每秒多次重复计算
    // 装备属性统计会在穿脱装备、升级等关键时机自动触发
}
//添加BUFF触发
GameLib.onAddBuff = (Actor: TActor, Buff: TBuff, Accept: boolean): boolean => {
    // 🚀 性能优化：移除高频BUFF事件中的装备属性统计，避免每秒多次重复计算
    // 装备属性统计会在穿脱装备、升级等关键时机自动触发
    return true
}
//点击背包物品触发 
GameLib.onUIActivedBagItemEvent = (Player: TPlayObject, UIName: string, ClientItemBagIndex: number, Item: TUserItem, KeyCtrl: boolean, KeyAlt: boolean, MouseButton: TMouseButton): void => {
    //console.log("点击背包物品触发", UIName, ClientItemBagIndex, Item, KeyCtrl, KeyAlt, MouseButton)
    if (UIName == '随身仓库' && Item) {
        if (Player.AddItemToBigStorage(Item)) {
            // Player.DeleteItem(Item)
        }

        let Args = new TArgs()
        Args.Add(1)
        随身仓库.Main(GameLib.QFunctionNpc, Player, Args)
    }
}



//开始挂机
GameLib.onStartAutoFight = function (Player: TPlayObject): void {
    Player.R.开启挂机 ??= false
    // Player.V.自动随机 =true
    Player.R.开启挂机 = true
    if (Player.V.随机读秒 > 0 && Player.V.自动随机) {
        Player.SendMessage(`开始挂机,每${Player.V.随机读秒}秒将自动随机一次!`, 1)
    } else {
        Player.SendMessage(`开始挂机,当前未开启自动随机功能或未设置随机秒数将正常挂机!`, 1)
    }
}
//结束挂机
GameLib.onStopAutoFight = function (Player: TPlayObject): void {
    Player.R.开启挂机 = false
    Player.SendMessage(`你关闭了挂机功能,自动随机功能也将关闭!`)
}

GameLib.onAINpcExecute = function Run(Actor: TActor): void {
}


GameLib.onClientBleedNumber = (Player: TPlayObject, Actor: TActor, DamageSource: TActor, BleedNum: number, NumType: TDamageValueType, MagID: number, MagLv: number, BleedType: TBleedType, Allow: boolean): boolean => {
    // 目标飘血触发
    // Player：玩家 Actor：受攻击者 DamageSource：攻击者 BleedNum：飘血量
    // NumType：客户端显示飘血类型（0：HP 1：MP） MagID：技能ID MagLv：技能等级
    // BleedType:飘血伤害类型
    // btNone = 0 ,                //未知
    // btNormal = 1,               //普通
    // btCritical = 2,             //会心一击(无视防御) + 会心额外伤害
    // btPunchHit = 3,             //致命一击(双倍伤害 + 致命额外伤害)
    // btMapDamageEvent = 4,       //地图伤害事件
    // btDamageRebound = 5,        //伤害反弹
    // btSpell = 6,                //施法
    // btMapRecovery = 7,          //地图自动恢复
    // btPoison = 8,               //中毒
    // btLevelChange = 9,          //等级变更
    // btUseMedicine = 10,         //使用药品
    // btAutoRecovery = 11 ,       //自动恢复 站立休息一定时间会恢复
    // btHealing = 12 ,            //治愈术
    // btHongMoSuit = 13,          //虹魔套装 吸血
    // btRunTired = 14 ,           //跑步掉血
    // btHealthStone = 15 ,        //血魔石增加
    // btHunger = 16 ,             //饥饿系统
    // btMagicProtected = 17 ,     //护身戒指生效减蓝
    // // Allow 是否拦截本次飘血显示
    // if (BleedType == 8) {//目标中毒
    // }

    return false
}
GameLib.onAttackActorDamageIsZero = (Attacker: TActor, Target: TActor, Reason: number, Damage: number): number => {
    return 0
}

// 自定义热键触发（Akey的值代表按下的按键字符值,KeyCtrl，KeyAlt 代表 Ctrl，Alt按键的状态 False为没有按下 True为按下。ATargetActor代表客户端鼠标指向的TActor，X,Y代表TActor所在位置坐标，如果TActor为nil，则X,Y代表客户端鼠标指向的坐标。）
GameLib.onSendHotKey = (Player: TPlayObject, Akey: number, KeyCtrl: boolean, KeyAlt: boolean, ATargetActor: TActor, X: number, Y: number): void => {
    if (KeyCtrl && Akey == 82) {
        let 宝宝: TActor
        if (ATargetActor && Player.SlaveCount > 0) {
            for (let a = 0; a <= Player.SlaveCount; a++) {
                if (Player.GetSlave(a) != null && ATargetActor != null && ATargetActor.Handle != Player.GetSlave(a).Handle && ATargetActor.Handle != Player.Handle && !ATargetActor.IsNPC()) {
                    宝宝 = Player.GetSlave(a)
                    if (取两点距离(ATargetActor.GetMapX(), ATargetActor.GetMapY(), 宝宝.GetMapX(), 宝宝.GetMapY()) >= 16) {
                        Player.SendMessage(`${宝宝.GetName()}距离目标超过16格,无法去攻击目标!`)
                        continue
                    }
                    宝宝.SetTargetActorEx(ATargetActor, 10000)
                }
            }
            Player.SendMessage(`当前宝宝攻击目标:${ATargetActor.GetName()}`)
        }
    }
    if (KeyAlt) {
        switch (Akey) {
            case 57: {
                Main(GameLib.ManagerNpc, Player, null);
                Player.SendMessage('【系统】调试面板已打开！', 2);
            } break;
        }

    }
}
