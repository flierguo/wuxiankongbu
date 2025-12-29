import { js_number, js_war } from "../../全局脚本[公共单元]/utils/计算方法";
import { 技能魔次} from "../../_核心部分/基础常量";

// 常量定义
const 选中 = 31;
const 未选中 = 30;

// 初始化玩家变量
export function 初始化(Player: TPlayObject) {
    Player.V.技能伤害词条 ??= false;
    Player.V.技能伤害词条数值 ??= '0';
    Player.V.已选择技能 ??= [];
}

// 获取技能名称
function 取技能名称(技能ID: number): string {
    // for (const key in 所有职业技能伤害) {
    //     // 使用类型断言和全等比较，避免类型错误
    //     if (isNaN(Number(key)) && 所有职业技能伤害[key as keyof typeof 所有职业技能伤害] === 技能ID) {
    //         return key;
    //     }
    // }
    return '未知技能';
}

// 检查技能是否已选择
function 是否已选择(Player: TPlayObject, 技能ID: number): boolean {
    return Player.V.已选择技能.includes(技能ID);
}

// 主函数
export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    初始化(Player);
    
    let str = `{s=技能伤害词条保留;x=200;y=35;c=239}\n`;
    
    // 构建技能选择界面，每行4个技能
    const 所有技能ID = Object.values(技能魔次).filter(id => typeof id === 'number') as number[];
    
    // 移除掉466-469的技能ID（根据你提供的数据，这些是速度技能，不是伤害技能）
    const 过滤技能ID = 所有技能ID.filter(id => id < 466);
    
    for (let i = 0; i < 过滤技能ID.length; i += 4) {
        let y = 70 + Math.floor(i / 4) * 30;
        
        for (let j = 0; j < 4 && i + j < 过滤技能ID.length; j++) {
            const 技能ID = 过滤技能ID[i + j];
            const 技能名称 = 取技能名称(技能ID);
            const x = 25 + j * 110;
            
            // 添加选择框和技能名称
            str += `<{I=${是否已选择(Player, 技能ID) ? 选中 : 未选中};F=装备图标.DATA;X=${x};Y=${y}}/@技能伤害选择.勾选技能(${技能ID})>{s=${技能名称};x=${x + 25};y=${y}}\n`;
        }
    }
    
    // 添加底部按钮
    // str += `<{s=保存设置;x=200;y=${70 + Math.ceil(过滤技能ID.length / 4) * 30}}/@技能伤害选择.保存设置>\n`;
    
    Npc.SayEx(Player, "NPC大窗口", str);
}

// 勾选技能
export function 勾选技能(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    初始化(Player);
    
    const 技能ID = Args.Int[0];
    
    if (是否已选择(Player, 技能ID)) {
        // 移除已选择的技能
        Player.V.已选择技能 = Player.V.已选择技能.filter(id => id !== 技能ID);
    } else {
        // 添加新选择的技能
        Player.V.已选择技能.push(技能ID);
    }
    
    Main(Npc, Player, Args);
    // console.log(Player.V.已选择技能);
}

// 保存设置
export function 保存设置(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    初始化(Player);
    
    Player.SendMessage(`技能伤害词条设置已保存，当前已选择${Player.V.已选择技能.length}个技能`, 1);
}

// 检查装备是否包含选定的技能倍攻
export function 检查倍攻技能(倍攻值: string, Player: TPlayObject): boolean {
    初始化(Player);
    
    // 如果没有设置倍攻词条阈值或没有选择技能，直接返回false
    if (!Player.V.倍攻词条 || !Player.V.倍攻词条数值) {
        return false;
    }
    
    // 如果没有选择任何技能，但倍攻值超过阈值，保留装备
    if (!Player.V.已选择技能 || Player.V.已选择技能.length === 0) {
        return js_war(倍攻值, Player.V.倍攻词条数值) > 0;
    }
    
    // 解析装备自定义属性
    try {
        // 检查倍攻值是否超过阈值
        if (js_war(倍攻值, Player.V.倍攻词条数值) > 0) {
            // 这里应该进一步检查是否包含选定的技能倍攻
            // 由于倍攻值已经是累加后的结果，无法直接判断是哪个技能的倍攻
            // 需要在调用此函数前进行判断
            return true;
        }
    } catch (e) {
        console.log("检查倍攻技能失败:", e);
    }
    
    return false;
}

// 检查装备是否包含选定的技能伤害
export function 检查技能伤害(技能伤害值: string, Player: TPlayObject): boolean {
    初始化(Player);
    
    // 如果没有设置技能伤害词条阈值或没有选择技能，直接返回false
    if (!Player.V.技能伤害词条 || !Player.V.技能伤害词条数值) {
        return false;
    }
    
    // 如果没有选择任何技能，但技能伤害值超过阈值，保留装备
    if (!Player.V.已选择技能 || Player.V.已选择技能.length === 0) {
        return js_war(技能伤害值, Player.V.技能伤害词条数值) > 0;
    }
    
    // 解析装备自定义属性
    try {
        // 检查技能伤害值是否超过阈值
        if (js_war(技能伤害值, Player.V.技能伤害词条数值) > 0) {
            // 这里应该进一步检查是否包含选定的技能伤害
            // 由于技能伤害值已经是累加后的结果，无法直接判断是哪个技能的伤害
            // 需要在调用此函数前进行判断
            return true;
        }
    } catch (e) {
        console.log("检查技能伤害失败:", e);
    }
    
    return false;
}

// 检查装备属性中的技能伤害
export function 解析装备属性(AItem: TUserItem, Player: TPlayObject): boolean {
    初始化(Player);
    
    // 如果玩家没有选择任何技能且没有设置技能伤害词条和倍攻词条，直接返回true（可以回收）
    if (!Player.V.已选择技能 || Player.V.已选择技能.length === 0) {
        if (!Player.V.技能伤害词条 && !Player.V.倍攻词条) {
            return true;
        }
    }
    
    // 解析装备自定义属性
    if (AItem.GetCustomDesc() !== '') {
        try {
            const 装备字符串 = JSON.parse(AItem.GetCustomDesc());
            if (装备字符串.职业属性_职业) {
                const 装备属性条数 = 装备字符串.职业属性_职业.length;
                
                // 临时存储技能伤害值和倍功值
                let 技能伤害值 = '0';
                let 倍功值 = '0';
                // 标记是否有已选择的技能
                let 有已选技能 = false;
                
                // 遍历装备属性
                for (let e = 0; e < 装备属性条数; e++) {
                    const 职业类型 = Number(装备字符串.职业属性_职业[e]);
                    const 属性值 = String(装备字符串.职业属性_属性[e]);
                    
                    // 检查是否是已选择的技能
                    if (Player.V.已选择技能 && Player.V.已选择技能.includes(职业类型)) {
                        有已选技能 = true;
                        技能伤害值 = js_number(技能伤害值, 属性值, 1);
                    }
                    
                    // 检查是否是倍功技能 (195-236 ID范围是倍功技能)
                    if (职业类型 >= 195 && 职业类型 <= 236) {
                        倍功值 = js_number(倍功值, 属性值, 1);
                    }
                    
                    // 检查是否是技能伤害 (401-440 ID范围是技能伤害)
                    if (职业类型 >= 401 && 职业类型 <= 440) {
                        技能伤害值 = js_number(技能伤害值, 属性值, 1);
                    }
                }
                
                // 情况1: 选择了技能且填写了技能伤害或倍功阈值
                if (Player.V.已选择技能 && Player.V.已选择技能.length > 0) {
                    if (Player.V.技能伤害词条 && Player.V.倍攻词条) {
                        // 如果两者都设置了，任一超过阈值就保留
                        if (有已选技能 && (js_war(技能伤害值, Player.V.技能伤害词条数值) > 0 || js_war(倍功值, Player.V.倍攻词条数值) > 0)) {
                            return false; // 不回收
                        }
                    } else if (Player.V.技能伤害词条) {
                        // 只设置了技能伤害阈值
                        if (有已选技能 && js_war(技能伤害值, Player.V.技能伤害词条数值) > 0) {
                            return false; // 不回收
                        }
                    } else if (Player.V.倍攻词条) {
                        // 只设置了倍功阈值
                        if (有已选技能 && js_war(倍功值, Player.V.倍攻词条数值) > 0) {
                            return false; // 不回收
                        }
                    } else {
                        // 选择了技能但没设置阈值，有已选技能就保留
                        if (有已选技能) {
                            return false; // 不回收
                        }
                    }
                }
                // 情况2: 没选择技能但填写了技能伤害或倍功阈值
                else if ((!Player.V.已选择技能 || !Player.V.已选择技能.length) && (Player.V.技能伤害词条 || Player.V.倍攻词条)) {
                    if (Player.V.技能伤害词条 && Player.V.技能伤害词条数值 && js_war(技能伤害值, Player.V.技能伤害词条数值) > 0) {
                        return false; // 不回收
                    }
                    if (Player.V.倍攻词条 && Player.V.倍攻词条数值 && js_war(倍功值, Player.V.倍攻词条数值) > 0) {
                        return false; // 不回收
                    }
                }
            }
        } catch (e) {
            // JSON解析失败，忽略
            console.log("解析装备属性JSON失败:", e);
        }
    }
    
    // 默认可以回收
    return true;
} 