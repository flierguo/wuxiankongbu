import {CreateAdminUI} from "./后台UI管理控制"
CreateAdminUI()

const UnitMap = new Map<string, any>()
import * as AINpc from "./系统固定NPC/AINpc"
import * as ExternalNpc from "./系统固定NPC/ExternalNpc"
import * as MagicNpc from "./系统固定NPC/MagicNpc"
import * as ManagerNpc from "./系统固定NPC/ManagerNpc"
import * as MissionsNpc from "./系统固定NPC/MissionsNpc"

import * as QFunctionNpc from "./系统固定NPC/QFunctionNpc"
import * as RobotManageNpc from "./系统固定NPC/RobotManageNpc"
// import * as TimeManageNpc from "./系统固定NPC/TimeManageNpc"
// import * as XXXX from "./XXXX"
import * as _GN_Close from "./功能脚本组/[功能]/_GN_Close"
import * as 充值使者 from "./功能脚本组/[服务]/充值使者"
import * as 材料仓库 from "./功能脚本组/[服务]/材料仓库"
import * as _YXFW_King from "./功能脚本组/[服务]/_YXFW_King"
import * as _P_CanSeeStorage from "./功能脚本组/[玩家]/_P_CanSeeStorage"
import * as 装备回收 from "./_核心部分/_装备/装备回收"
import * as _ITEM_使用物品 from "./功能脚本组/[装备]/_ITEM_使用物品"
import * as _P_杀怪触发 from "./功能脚本组/[玩家]/_P_杀怪触发"
import * as _GN_Monitoring from "./功能脚本组/[功能]/_GN_Monitoring"
import * as 登录触发 from "./_核心部分/_玩家/登录触发"

import * as 充值属性 from "./功能脚本组/[服务]/充值属性"

import * as 延时跳转 from "./功能脚本组/[服务]/延时跳转"
import * as 职业选择 from "./功能脚本组/[服务]/职业选择"
import * as 技能学习 from "./功能脚本组/[服务]/技能学习"
import * as 可视仓库 from "./功能脚本组/[服务]/可视仓库"

import * as 升级幸运 from "./功能脚本组/[服务]/升级幸运"

import * as 测试NPC from "./功能脚本组/[服务]/测试NPC"
import * as 生命水池 from "./功能脚本组/[服务]/生命水池"
import * as 传送阵法 from "./_核心部分/_地图/传送阵法"

import * as 大陆传送 from "./功能脚本组/[服务]/大陆传送"
import * as 勋章合成 from "./功能脚本组/[服务]/勋章合成"
import * as _GN_功能 from "./功能脚本组/[功能]/_功能"
import * as 交易中心 from "./功能脚本组/[服务]/交易中心"
import * as 后台管理 from "./后台管理"
import * as 技能伤害选择 from "./功能脚本组/[装备]/技能伤害选择"
import * as 技能提高 from "./功能脚本组/[服务]/技能提高"
import * as 血防加持 from "./功能脚本组/[服务]/血防加持"


// UnitMap.set("斗转星移", 斗转星移)
UnitMap.set("后台管理", 后台管理)
UnitMap.set("交易中心", 交易中心)
UnitMap.set("_GN_功能", _GN_功能)
UnitMap.set("AINpc", AINpc)
UnitMap.set("ExternalNpc", ExternalNpc)
UnitMap.set("MagicNpc", MagicNpc)
UnitMap.set("ManagerNpc", ManagerNpc)
// UnitMap.set("MapEventNpc", MapEventNpc)
UnitMap.set("MissionsNpc", MissionsNpc)
UnitMap.set("QFunctionNpc", QFunctionNpc)
UnitMap.set("RobotManageNpc", RobotManageNpc)
UnitMap.set("_GN_Close", _GN_Close)
UnitMap.set("充值使者", 充值使者)
UnitMap.set("材料仓库", 材料仓库)
UnitMap.set("_YXFW_King", _YXFW_King)
UnitMap.set("_P_CanSeeStorage", _P_CanSeeStorage)
UnitMap.set("装备回收", 装备回收)
UnitMap.set("技能伤害选择", 技能伤害选择)
UnitMap.set("_ITEM_使用物品", _ITEM_使用物品)
UnitMap.set("_P_AbilityTo", _ITEM_使用物品)
UnitMap.set("_P_杀怪触发", _P_杀怪触发)
UnitMap.set("_GN_Monitoring", _GN_Monitoring)

UnitMap.set("延时跳转", 延时跳转)
UnitMap.set("职业选择", 职业选择)
UnitMap.set("技能学习", 技能学习)
UnitMap.set("技能提高", 技能提高)
UnitMap.set("升级幸运", 升级幸运)
UnitMap.set("生命水池", 生命水池)
UnitMap.set("传送阵法", 传送阵法)
UnitMap.set("充值属性", 充值属性)
UnitMap.set("可视仓库", 可视仓库)
UnitMap.set("测试NPC", 测试NPC)
UnitMap.set("大陆传送", 大陆传送)

UnitMap.set("血防加持", 血防加持)









//引擎启动检查创建必要文件
if (!GameLib.DirectoryExists(GameLib.EnvirPath + 'PetData\\'))
    GameLib.CreateDir(GameLib.EnvirPath + 'PetData\\')

if (!GameLib.DirectoryExists(GameLib.EnvirPath + 'DebugData\\'))
    GameLib.CreateDir(GameLib.EnvirPath + 'DebugData\\');

if (!GameLib.DirectoryExists(GameLib.EnvirPath + 'Gua\\'))
    GameLib.CreateDir(GameLib.EnvirPath + 'Gua\\');

if (!GameLib.DirectoryExists(GameLib.EnvirPath + 'TiXian\\'))
    GameLib.CreateDir(GameLib.EnvirPath + 'TiXian\\');

//设定点击NPC触发回调
GameLib.onNpcClicked = (Npc: TNormNpc, PlayObject: TPlayObject, ClickLabel: string, AUnitName: string, AParams: string) => {

    //console.log("NpcClicked,", AUnitName, ClickLabel, AParams)

    let module = UnitMap.get(AUnitName)
    if (!module) {
        console.error("没有找到有效的NPC执行单元", AUnitName, ClickLabel)
        return
    }
    do {
        if (ClickLabel.charAt(0) == "@") {
            ClickLabel = ClickLabel.substr(1)
        }
    } while (ClickLabel.charAt(0) == "@");

    if (ClickLabel == 'main')
        ClickLabel = 'Main'

    let func = module[ClickLabel]
    if (!func) {
        console.error("单元内没有找到有效的执行函数", AUnitName, ClickLabel)
        return
    }

    let args = CreateTArgs(AParams)
    try {
        func(Npc, PlayObject, args)
    } catch (e) {
        console.error("点击NPC出现异常:", e.message, e.stack)
    }

}
