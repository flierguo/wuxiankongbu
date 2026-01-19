
import * as 地图 from './_核心部分/_地图/地图';

import { Decimal } from "./_大数值/big_number";
import { 智能计算 } from "./_大数值/核心计算方法";

import * as _P_Base from "./_核心部分/基础常量"

export function 执行性能测试(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    try {
        console.log('🧪 [定时器集成] 开始执行性能测试...');
        // 性能优化管理器.测试优化效果();
    } catch (error) {
        console.log('❌ [定时器集成] 性能测试失败:', error);
    }
}
//版本后台UI范例.ts
export function CreateAdminUI() {
    //-------------------------------------------------------------增加一个数据库控制页面-------------------------------------------------------------
    GameLib.AdminUI.AddPage("数据库页", 100, 30, 3)
    GameLib.AdminUI.AddButton('数据库页', '重新加载脚本')
    GameLib.AdminUI.AddButton('数据库页', '清空全服怪物')
    GameLib.AdminUI.AddButton('数据库页', '地图刷怪')
    GameLib.AdminUI.AddButton('数据库页', '打印性能报告')
    GameLib.AdminUI.AddButton('数据库页', '清空所有缓存')
    GameLib.AdminUI.AddButton('数据库页', '重置所有统计')
    GameLib.AdminUI.AddButton('数据库页', '测试功能输出')

    //-------------------------------------------------------------增加一个地图控制页面----------------------------------------------------------------
    //创建一个后台管理页面 名称叫地图控制 控件像素宽度 160 高度 40 ,每4个为一列
    GameLib.AdminUI.AddPage("地图控制", 160, 40, 4)
    //在地图控制页面创建一个 名称为 鼠标移动有提示 的按钮 鼠标移动过去停留一下 会提示 提示:点击清空全服变量 
    GameLib.AdminUI.AddButton('地图控制', '鼠标移动有提示', '提示:点击清空全服变量')
    //在地图控制页面创建一个 名称为 鼠标移动提示确认 的按钮 鼠标移动过去停留一下 会提示 提示:点击清空全服变量  
    //并且点击会有确认执行对话框
    GameLib.AdminUI.AddButton('地图控制', '鼠标移动提示确认', '提示:点击清空全服变量', true)
    GameLib.AdminUI.AddButton('地图控制', '清空版本日志内容', '提示:点击清空全服变量')
    GameLib.AdminUI.AddButton('地图控制', '增加日志', '提示:点我增加一条日志到版本日志')
    //添加一个复选框 
    GameLib.AdminUI.AddCheckBox('地图控制', '怪物死亡不掉落装备', true, '提示:勾选后怪物死亡将不掉落装备')
    //添加一个确认编辑框
    GameLib.AdminUI.AddEdit('地图控制', '清空指定玩家变量', '请输入玩家名称')
    GameLib.AdminUI.AddEdit('地图控制', '带提示的编辑确认框', '移动到OK上有提示哦', '我是提示')
    GameLib.AdminUI.AddEdit('地图控制', '带提示的编辑确认框2', '点击OK有确认框哦', '我是提示', true)
    GameLib.AdminUI.AddButton('地图控制', '修改复选框为不勾选状态', '提示:修改复选框为不勾选状态')
    GameLib.AdminUI.AddButton('地图控制', '设置编辑框', '提示:设置编辑框内容')
    GameLib.AdminUI.AddButton('地图控制', '数据库测试', '提示:测试Mysql数据')
    //-------------------------------------------------------------增加一个角色控制页面-------------------------------------------------------------------
    //增加一个角色控制页面
    GameLib.AdminUI.AddPage("角色控制", 120, 35, 4)
    GameLib.AdminUI.AddButton('角色控制', '清空角色变量1', '提示:点击清空角色变量')
    GameLib.AdminUI.AddButton('角色控制', '清空角色变量2', '提示:点击清空角色变量')
    GameLib.AdminUI.AddButton('角色控制', '增加角色日志', '提示:点我增加一条日志到版本日志')


    //-------------------------------------------------------------增加一个日志框页面页面-------------------------------------------------------------------    

    //添加一个日志框页面 名称为 版本日志
    GameLib.AdminUI.AddLogPage('版本日志')
    //往日志框页面内添加信息
    GameLib.AdminUI.AddLog('版本日志', '创建UI时间为 : ' + new Date().toString())
}



//当按钮点击后 会触发此函数
GameLib.onAdminUIButtonClick = (controlName: string): void => {
    console.log("版本后台按钮被点击:", controlName)
    //----------------------------------------------------------------数据库操作---------------------------------------------------------------------
    if (controlName == '重新加载脚本') {
        console.log("后台操作：重新开始加载脚本")
        GameLib.ReLoadScriptEngine()
    }



    if (controlName == '清空全服怪物') {
        地图.副本清理()
    }

    if (controlName == '地图刷怪') {
        // 秒钟第一次进入刷怪()
    }

    if (controlName == '测试功能输出') {
        // const 大数值 = Decimal.mul('500000', '1e100')
        const 大数值2 = 智能计算('300000', '1e100', 3)
        console.log('大数值:', 大数值2)
        console.log('副本长度:', GameLib.R.地图池.length)
        let Player = GameLib.FindPlayer('鸿福'); //查找玩家
        if (Player != null) {

            Player.SetCustomEffect(_P_Base.永久特效.血魔临身, _P_Base.特效.血魔临身);
            console.log(`Player.R.怒斩范围:${Player.R.怒斩范围}`)
        }
    }

    if (controlName == '打印性能报告') {


    }

    if (controlName == '清空所有缓存') {

    }

    if (controlName == '重置所有统计') {

    }

    //------------------------------------------------------------以下示范-------------------------------------------------------------
    if (controlName == '增加日志') {
        //往日志框页面内添加信息
        GameLib.AdminUI.AddLog('版本日志', '现在的时间是:' + new Date().toString())
    }

    if (controlName == '增加角色日志') {
        //往日志框页面内添加信息
        GameLib.AdminUI.AddLog('版本日志', '角色日志按钮增加数据:' + new Date().toString())
    }

    if (controlName == '修改复选框为不勾选状态') {
        GameLib.AdminUI.UpdateCheckBoxState('怪物死亡不掉落装备', false)
    }

    if (controlName == '设置编辑框') {
        GameLib.AdminUI.UpdateInputText('清空指定玩家变量', '热血传奇')
    }

    if (controlName == '清空版本日志内容') {
        GameLib.AdminUI.ClearLogPage('版本日志')
    }
}
//当复选框 勾选状态改变会触发此函数
GameLib.onAdminUICheckBoxChange = (controlName: string, checked: boolean): void => {
    if (checked) {
        console.log("版本后台 复选框  :", controlName, '被勾选')
    } else {
        console.log("版本后台 复选框  :", controlName, '取消勾选')
    }
}
//当输入确认框点击确认后会执行此代码
GameLib.onAdminUIEditOk = (controlName: string, inputTex: string): void => {
    console.log(`版本后台 输入框 ${controlName} 被确认, 输入内容为:` + inputTex)
}
console.log("自定义后台UI单元被引用...")


