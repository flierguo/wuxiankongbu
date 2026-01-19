import { CreateAdminUI } from "./后台UI管理控制"
CreateAdminUI()

const UnitMap = new Map<string, any>()
import * as AINpc from "./系统固定NPC/AINpc"
import * as MissionsNpc from "./系统固定NPC/MissionsNpc"
import * as ExternalNpc from "./系统固定NPC/ExternalNpc"
import * as MagicNpc from "./系统固定NPC/MagicNpc"
import * as ManagerNpc from "./系统固定NPC/ManagerNpc"
import * as QFunctionNpc from "./系统固定NPC/QFunctionNpc"
import * as RobotManageNpc from "./系统固定NPC/RobotManageNpc"

//=======================自制=======================================
import * as 传送阵法 from "./_核心部分/_地图/传送阵法"
import * as 大陆传送 from "./_核心部分/_地图/大陆传送"

import * as 登录触发 from "./_核心部分/_玩家/登录触发"
import * as 延时触发 from "./_核心部分/_玩家/延时触发"

import * as 装备掉落 from "./_核心部分/_装备/装备掉落"
import * as 装备回收 from "./_核心部分/_装备/装备回收"

import * as 职业选择 from "./_核心部分/_服务/职业选择"
import * as 升级幸运 from "./_核心部分/_服务/升级幸运"
import * as 生命水池 from "./_核心部分/_服务/生命水池"
import * as 神器系统 from "./_核心部分/_服务/神器系统"
import * as 捐献排名 from "./_核心部分/_服务/捐献排名"
import * as 材料仓库 from "./_核心部分/_服务/材料仓库"
import * as 可视仓库 from "./_核心部分/_服务/可视仓库"
import * as 交易中心 from "./_核心部分/_服务/交易中心"
import * as 基因 from "./_核心部分/_服务/基因"

import * as 测试功能 from "./_核心部分/测试功能"
import * as 充值属性 from "./_核心部分/充值属性"
import * as 宣传使者 from "./_核心部分/宣传使者"

import * as 后台管理 from "./后台管理"
//=======================自制=======================================


// UnitMap.set("斗转星移", 斗转星移)
UnitMap.set("后台管理", 后台管理)
UnitMap.set("交易中心", 交易中心)

UnitMap.set("AINpc", AINpc)
UnitMap.set("ExternalNpc", ExternalNpc)
UnitMap.set("MagicNpc", MagicNpc)
UnitMap.set("ManagerNpc", ManagerNpc)
// UnitMap.set("MapEventNpc", MapEventNpc)
UnitMap.set("MissionsNpc", MissionsNpc)
UnitMap.set("QFunctionNpc", QFunctionNpc)
UnitMap.set("RobotManageNpc", RobotManageNpc)
UnitMap.set("装备回收", 装备回收)
UnitMap.set("捐献排名", 捐献排名)
UnitMap.set("神器系统", 神器系统)
UnitMap.set("基因", 基因)
UnitMap.set("职业选择", 职业选择)
UnitMap.set("升级幸运", 升级幸运)
UnitMap.set("生命水池", 生命水池)
UnitMap.set("充值属性", 充值属性)
UnitMap.set("可视仓库", 可视仓库)
UnitMap.set("材料仓库", 材料仓库)
UnitMap.set("大陆传送", 大陆传送)
UnitMap.set("传送阵法", 传送阵法)
UnitMap.set("延时触发", 延时触发)
UnitMap.set("测试功能", 测试功能)
UnitMap.set("宣传使者", 宣传使者)






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
