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
// import * as _GN_空的 from "./功能脚本组/[功能]/_GN_空的"
import * as 充值使者 from "./功能脚本组/[服务]/充值使者"
import * as 材料仓库 from "./功能脚本组/[服务]/材料仓库"
import * as _YXFW_King from "./功能脚本组/[服务]/_YXFW_King"
import * as _P_CanSeeStorage from "./功能脚本组/[玩家]/_P_CanSeeStorage"
import * as _ITEM_zbhs from "./功能脚本组/[装备]/_ITEM_zbhs"
import * as _ITEM_使用物品 from "./功能脚本组/[装备]/_ITEM_使用物品"
import * as _P_杀怪触发 from "./功能脚本组/[玩家]/_P_杀怪触发"
import * as _GN_Monitoring from "./功能脚本组/[功能]/_GN_Monitoring"
import * as _P_玩家登录 from "./功能脚本组/[玩家]/_P_玩家登录"
import * as 王城 from "./功能脚本组/[服务]/王城"
import * as 延时跳转 from "./功能脚本组/[服务]/延时跳转"
import * as 职业选择 from "./功能脚本组/[服务]/职业选择"
import * as 技能学习 from "./功能脚本组/[服务]/技能学习"
// import * as 装备增强 from "./功能脚本组/[服务]/装备增强"
// import * as 装备重组 from "./功能脚本组/[服务]/装备重组"
// import * as 宝石合成 from "./功能脚本组/[服务]/宝石合成"
// import * as 生肖升星 from "./功能脚本组/[服务]/生肖升星"
// import * as 星星转移 from "./功能脚本组/[服务]/星星转移"
import * as 种族强化 from "./功能脚本组/[服务]/种族强化"
import * as 斗笠血石 from "./功能脚本组/[服务]/斗笠血石"
import * as 泡点盾牌 from "./功能脚本组/[服务]/泡点盾牌"
// import * as 荣誉兑换 from "./功能脚本组/[服务]/荣誉兑换"
// import * as 神器回收 from "./功能脚本组/[服务]/神器回收"
// import * as 诸天神殿 from "./功能脚本组/[服务]/诸天神殿"
import * as 升级幸运 from "./功能脚本组/[服务]/升级幸运"
import * as 上古禁地 from "./功能脚本组/[服务]/上古禁地"
import * as 生命水池 from "./功能脚本组/[服务]/生命水池"
import * as 传送阵法 from "./功能脚本组/[服务]/传送阵法"
import * as 大陆传送 from "./功能脚本组/[服务]/大陆传送"
import * as 灵兽升星 from "./功能脚本组/[服务]/灵兽升星"
// import * as 世界地图 from "./功能脚本组/[服务]/世界地图" 
import * as 充值属性 from "./功能脚本组/[服务]/充值属性"
import * as 战神强化 from "./功能脚本组/[服务]/战神强化"
// import * as 沙巴克捐赠 from "./功能脚本组/[服务]/沙巴克捐赠" 
// import * as 领沙奖励 from "./功能脚本组/[服务]/领沙奖励" 
// import * as 攻沙老人 from "./功能脚本组/[服务]/攻沙老人"
import * as 勋章合成 from "./功能脚本组/[服务]/勋章合成"
import * as 特戒合成 from "./功能脚本组/[服务]/特戒合成"
import * as 外挂检测员 from "./功能脚本组/[服务]/外挂检测员"
import * as 测试NPC from "./功能脚本组/[服务]/测试NPC"
import * as 可视仓库 from "./功能脚本组/[服务]/可视仓库"
import * as 时装强化 from "./功能脚本组/[服务]/时装强化"
// import * as 艾维斯之戒 from "./功能脚本组/[服务]/艾维斯之戒"
import * as 阿拉贡 from "./功能脚本组/[服务]/阿拉贡"
import * as 缺月太极 from "./功能脚本组/[服务]/缺月太极"
// import * as 甘道夫之戒 from "./功能脚本组/[服务]/甘道夫之戒"
// import * as 堕入地狱 from "./功能脚本组/[服务]/堕入地狱"
// import * as 巫王的项链 from "./功能脚本组/[服务]/巫王的项链"
import * as _GN_功能 from "./功能脚本组/[功能]/_GN_功能"
import * as 交易中心 from "./功能脚本组/[服务]/交易中心"
import * as 后台管理 from "./后台管理"
// import * as 斗转星移 from "./功能脚本组/[服务]/斗转星移"
import * as 技能伤害选择 from "./功能脚本组/[装备]/技能伤害选择"
import * as 技能提高 from "./功能脚本组/[服务]/技能提高"
import * as 斗笠合成 from "./功能脚本组/[服务]/斗笠合成"
import * as 烈焰等级 from "./功能脚本组/[服务]/烈焰等级"
import * as 聚宝葫芦 from "./功能脚本组/[服务]/聚宝葫芦"
import * as 暴怒状态 from "./功能脚本组/[服务]/暴怒状态"
// import * as 地图成就 from "./功能脚本组/[服务]/地图成就"
import * as 无限之熵 from "./功能脚本组/[服务]/无限之熵"
import * as 暗之魔器 from "./功能脚本组/[服务]/暗之魔器"
import * as 血防加持 from "./功能脚本组/[服务]/血防加持"
import * as 圣墟 from "./功能脚本组/[服务]/圣墟"
import * as 变异增强 from "./功能脚本组/[服务]/变异增强"
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
UnitMap.set("_ITEM_zbhs", _ITEM_zbhs)
UnitMap.set("技能伤害选择", 技能伤害选择)
UnitMap.set("_ITEM_使用物品", _ITEM_使用物品)
UnitMap.set("_P_AbilityTo", _ITEM_使用物品)
UnitMap.set("_P_杀怪触发", _P_杀怪触发)
UnitMap.set("_GN_Monitoring", _GN_Monitoring)
// UnitMap.set("王城", 王城)
UnitMap.set("延时跳转", 延时跳转)
UnitMap.set("职业选择", 职业选择)
UnitMap.set("技能学习", 技能学习)
UnitMap.set("技能提高", 技能提高)
// UnitMap.set("装备增强", 装备增强)
// UnitMap.set("装备重组", 装备重组)
// UnitMap.set("宝石合成", 宝石合成)
// UnitMap.set("生肖升星", 生肖升星)
// UnitMap.set("星星转移", 星星转移)
UnitMap.set("种族强化", 种族强化)
UnitMap.set("斗笠血石", 斗笠血石)
UnitMap.set("泡点盾牌", 泡点盾牌)
// UnitMap.set("荣誉兑换", 荣誉兑换)
// UnitMap.set("神器回收", 神器回收)
// UnitMap.set("诸天神殿", 诸天神殿)
UnitMap.set("升级幸运", 升级幸运)
UnitMap.set("上古禁地", 上古禁地)
UnitMap.set("生命水池", 生命水池)
UnitMap.set("传送阵法", 传送阵法)
// UnitMap.set("灵兽升星", 灵兽升星)
// UnitMap.set("世界地图", 世界地图)
UnitMap.set("充值属性", 充值属性)
UnitMap.set("战神强化", 战神强化)
// UnitMap.set("领沙奖励", 领沙奖励)
// UnitMap.set("沙巴克捐赠", 沙巴克捐赠)
// UnitMap.set("攻沙老人", 攻沙老人)
UnitMap.set("勋章合成", 勋章合成)
UnitMap.set("特戒合成", 特戒合成)
UnitMap.set("斗笠合成", 斗笠合成)
UnitMap.set("外挂检测员", 外挂检测员)
UnitMap.set("可视仓库", 可视仓库)
UnitMap.set("时装强化", 时装强化)
// UnitMap.set("艾维斯之戒", 艾维斯之戒)
UnitMap.set("阿拉贡", 阿拉贡)
UnitMap.set("测试NPC", 测试NPC)
UnitMap.set("缺月太极", 缺月太极)
// UnitMap.set("甘道夫之戒", 甘道夫之戒)
// UnitMap.set("堕入地狱", 堕入地狱)
// UnitMap.set("巫王的项链", 巫王的项链)
UnitMap.set("大陆传送", 大陆传送)
UnitMap.set("烈焰等级", 烈焰等级)
UnitMap.set("聚宝葫芦", 聚宝葫芦)
UnitMap.set("暴怒状态", 暴怒状态)
UnitMap.set("无限之熵", 无限之熵)
UnitMap.set("暗之魔器", 暗之魔器)
// UnitMap.set("地图成就", 地图成就)
// UnitMap.set("TimeManageNpc", TimeManageNpc)
UnitMap.set("血防加持", 血防加持)
UnitMap.set("圣墟", 圣墟)
UnitMap.set("变异增强", 变异增强)







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
