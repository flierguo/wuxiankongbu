import { js_number, js_war } from "../../全局脚本[公共单元]/utils/计算方法_优化版";
import { 实时回血, 血量显示 } from "../../核心功能/字符计算";
import * as 地图 from '../[地图]/地图';
import { TAG, 允许鞭尸, 原始名字, 怪物星数, 怪物爆率文件, 怪物称号, 怪物超星数 } from "../[怪物]/_M_Base"
import * as 功能 from "../../全局脚本[公共单元]/utils/_功能"

// 怪物掉落配置接口
interface 怪物掉落配置 {
    物品名称: string;  // 掉落物品名称
    物品数量: number;  // 掉落物品数量
    掉落几率: number;  // 掉落几率（随机数上限，越小几率越高）
}

// 怪物掉落配置数据
const 怪物掉落表: 怪物掉落配置[] = [
    { 物品名称: '荒芜山谷', 物品数量: 1, 掉落几率: 500 },
    { 物品名称: '试炼之地', 物品数量: 1, 掉落几率: 450 },
    { 物品名称: '血之炼狱', 物品数量: 1, 掉落几率: 400 },
    { 物品名称: '竞技洞窟', 物品数量: 1, 掉落几率: 350 },
    { 物品名称: '血路之颠', 物品数量: 1, 掉落几率: 300 },

    { 物品名称: '沙漠绿洲', 物品数量: 1, 掉落几率: 250 },
    { 物品名称: '凄凉之地', 物品数量: 1, 掉落几率: 100 },
    { 物品名称: '狂风峭壁', 物品数量: 1, 掉落几率: 80 },
    { 物品名称: '崎岖索道', 物品数量: 1, 掉落几率: 60 },
    { 物品名称: '风暴峡谷', 物品数量: 1, 掉落几率: 40 },

    { 物品名称: '古船遗迹', 物品数量: 1, 掉落几率: 20 },
    { 物品名称: '森林迷宫', 物品数量: 1, 掉落几率: 20 },
    { 物品名称: '古之城墙', 物品数量: 1, 掉落几率: 20 },
    { 物品名称: '暗影迷宫', 物品数量: 1, 掉落几率: 20 },
    { 物品名称: '失落暗殿', 物品数量: 1, 掉落几率: 20 },

    { 物品名称: '神秘古国', 物品数量: 1, 掉落几率: 15 },
    { 物品名称: '海岛遗迹', 物品数量: 1, 掉落几率: 15 },
    { 物品名称: '魔之莽道', 物品数量: 1, 掉落几率: 15 },
    { 物品名称: '盘蛇古迹', 物品数量: 1, 掉落几率: 15 },
    { 物品名称: '泗水祭坛', 物品数量: 1, 掉落几率: 10 },

    { 物品名称: '铁血魔域', 物品数量: 1, 掉落几率: 10 },
    { 物品名称: '血腥森林', 物品数量: 1, 掉落几率: 10 },
    { 物品名称: '蛮荒丛林', 物品数量: 1, 掉落几率: 10 },
    { 物品名称: '血狱皇陵', 物品数量: 1, 掉落几率: 10 },
    { 物品名称: '星空廊道', 物品数量: 1, 掉落几率: 5 },

    { 物品名称: '黑暗森林', 物品数量: 1, 掉落几率: 5 },
    { 物品名称: '郊外平原', 物品数量: 1, 掉落几率: 5 },
    { 物品名称: '天然洞穴', 物品数量: 1, 掉落几率: 5 },
    { 物品名称: '矿区山谷', 物品数量: 1, 掉落几率: 5 },
    { 物品名称: '祖玛回廊', 物品数量: 1, 掉落几率: 4 },

    { 物品名称: '万妖森林', 物品数量: 1, 掉落几率: 4 },
    { 物品名称: '万妖峡谷', 物品数量: 1, 掉落几率: 4 },
    { 物品名称: '万妖之巢', 物品数量: 1, 掉落几率: 4 },
    { 物品名称: '万妖迷宫', 物品数量: 1, 掉落几率: 4 },
    { 物品名称: '万妖祭坛', 物品数量: 1, 掉落几率: 3 },

    { 物品名称: '邪恶洞穴', 物品数量: 1, 掉落几率: 3 },
    { 物品名称: '蛇妖山谷', 物品数量: 1, 掉落几率: 3 },
    { 物品名称: '沃玛寺庙', 物品数量: 1, 掉落几率: 3 },
    { 物品名称: '暗黑蛇谷', 物品数量: 1, 掉落几率: 3 },
    { 物品名称: '沉息之地', 物品数量: 1, 掉落几率: 3 },

    { 物品名称: '神域冰谷', 物品数量: 1, 掉落几率: 2 },
    { 物品名称: '纷争之地', 物品数量: 1, 掉落几率: 2 },
    { 物品名称: '上古禁地', 物品数量: 1, 掉落几率: 2 },
    { 物品名称: '封印之城', 物品数量: 1, 掉落几率: 2 },
    { 物品名称: '神庙主殿', 物品数量: 1, 掉落几率: 2 },


];

export function 杀怪触发(Player: TPlayObject, Monster: TActor): void {
    Randomize()
    if (Player.V.神射手 && !Monster.IsPlayer() && Player.FindSkill('生存')) {
        let 生命 = js_number(Player.GetSVar(92), String(0.01 + Math.floor(Player.V.生存等级 / 6) * 0.01), 3)

        // let 恢复 = 0.1 + (Math.floor(Player.V.生存等级 / 6) / 20)
        // Player.SetHP(Math.min(生命, Player.GetHP() + 生命))
        实时回血(Player, 生命)
    }
    if (Player.V.猎人 && !Monster.IsPlayer() && Player.FindSkill('人宠合一')) {
        // let 击杀生命 = Player.GetMaxHP() * Math.max(1, (0.05 + (Math.floor(Player.V.生存等级 / 6) / 20)))
        let 击杀生命 = js_number(Player.GetSVar(92), String(0.01 + Math.floor(Player.V.人宠合一等级 / 6) * 0.01), 3)

        // Player.SetHP(Math.min(击杀生命, Player.GetHP() + 击杀生命))
        实时回血(Player, 击杀生命)

        for (let a = 0; a <= Player.SlaveCount; a++) {
            if (Player.GetSlave(a)) {
                let 击杀生命 = js_number(Player.GetSlave(a).GetSVar(92), String(0.01 + Math.floor(Player.V.人宠合一等级 / 6) * 0.01), 3)
                实时回血(Player.GetSlave(a), 击杀生命)
            }
        }

    }


    // 检查是否触发变异
    let 变异触发 = false;

    // 生物变异系统 - 只对非变异生物触发初次变异
    if (Monster.GetNVar(64) == 0 && Monster.GetNVar(99) == 0 && !Player.V.怪物变异) {
        变异触发 = 生物变异(Player, Monster);
    } else if (Monster.GetNVar(99) > 0 && !Player.V.怪物变异) {
        // 变异生物进化系统
        变异触发 = 生物进化(Player, Monster);
    }

    // 如果没有触发变异，才进行鞭尸
    if (!变异触发) {
        if (!GameLib.V.怪物变异) {
            if (Monster.GetNVar(64) == 0 && Monster.GetNVar(99) == 0) {
                let 鞭尸次数 = Player.V.鞭尸次数 + Player.R.鞭尸次数
                if (鞭尸次数 >= 1) {
                    // 如果有固定鞭尸次数，执行对应次数
                    for (let a = 0; a < 鞭尸次数; a++) {
                        杀怪鞭尸(Player, Monster);
                    }
                    Player.SendCountDownMessage(`{s=【鞭尸】;c=253}你击杀击杀怪物触发鞭尸,怪物原地又爆了${鞭尸次数}次!`, 0, 3000);
                } else if (random(100) < Player.V.鞭尸几率) {
                    // 否则判断鞭尸几率，仅执行1次
                    杀怪鞭尸(Player, Monster)
                    Player.SendCountDownMessage(`{s=【鞭尸】;c=253}你击杀击杀怪物触发鞭尸,怪物原地又爆了1次!`, 0, 3000);
                }
            }
        } else {
            let 鞭尸次数 = Player.V.鞭尸次数 + Player.R.鞭尸次数 + 1000
            if (鞭尸次数 >= 1) {
                // 如果有固定鞭尸次数，执行对应次数
                for (let a = 0; a < 鞭尸次数; a++) {
                    杀怪鞭尸(Player, Monster);
                }
                Player.SendCountDownMessage(`{s=【鞭尸】;c=253}你击杀击杀怪物触发鞭尸,怪物原地又爆了${鞭尸次数}次!`, 0, 3000);
            }
        }
    }

    大陆成就(Player);
    处理怪物掉落(Player, Monster);
    经验勋章(Player, Monster);
    特殊掉落(Player, Monster);


}
export function 宝宝杀怪触发(Player: TPlayObject, Slave: TActor, Monster: TActor): void {

    if (Player.V.猎人 && !Monster.IsPlayer() && Slave && Player.FindSkill('人宠合一')) {
        let 击杀生命 = js_number(Player.GetSVar(92), String(0.01 + Math.floor(Player.V.人宠合一等级 / 6) * 0.01), 3)
        实时回血(Player, 击杀生命)
        实时回血(Slave, 击杀生命)
    }

    if (Player.GetJewelrys(0) != null && Player.GetJewelrys(0).GetName() == '艾维斯之戒' && Player.GetJewelrys(0).GetOutWay3(40) < 10 && random(100) < 10 && Monster.GetName().includes('人形怪')) {
        Player.SetGameGold(Player.GetGameGold() + Player.GetJewelrys(0).GetNeedLevel() / 10 + Player.GetJewelrys(0).GetNeedLevel() / 10 * Player.GetJewelrys(0).GetOutWay3(40))
        Player.GoldChanged()
    } else if (Player.GetJewelrys(0) != null && Player.GetJewelrys(0).GetName() == '艾维斯之戒' && Player.GetJewelrys(0).GetOutWay3(40) >= 10 && Monster.GetName().includes('人形怪')) {
        Player.SetGameGold(Player.GetGameGold() + Player.GetJewelrys(0).GetNeedLevel() / 10 + Player.GetJewelrys(0).GetNeedLevel() / 10 * Player.GetJewelrys(0).GetOutWay3(40))
        Player.GoldChanged()
    }
    // 检查是否触发变异
    let 变异触发 = false;

    // 生物变异系统 - 只对非变异生物触发初次变异
    if (Monster.GetNVar(64) == 0 && Monster.GetNVar(99) == 0 && !Player.V.怪物变异) {
        变异触发 = 生物变异(Player, Monster);
    } else if (Monster.GetNVar(99) > 0 && !Player.V.怪物变异) {
        // 变异生物进化系统
        变异触发 = 生物进化(Player, Monster);
    }

    // 如果没有触发变异，才进行鞭尸
    if (!变异触发) {
        if (!GameLib.V.怪物变异) {
            if (Monster.GetNVar(64) == 0 && Monster.GetNVar(99) == 0) {
                let 鞭尸次数 = Player.V.鞭尸次数 + Player.R.鞭尸次数
                if (鞭尸次数 >= 1) {
                    // 如果有固定鞭尸次数，执行对应次数
                    for (let a = 0; a < 鞭尸次数; a++) {
                        杀怪鞭尸(Player, Monster);
                    }
                    Player.SendCountDownMessage(`{s=【鞭尸】;c=253}你击杀击杀怪物触发鞭尸,怪物原地又爆了${鞭尸次数}次!`, 0, 3000);
                } else if (random(100) < Player.V.鞭尸几率) {
                    // 否则判断鞭尸几率，仅执行1次
                    杀怪鞭尸(Player, Monster)
                    Player.SendCountDownMessage(`{s=【鞭尸】;c=253}你击杀击杀怪物触发鞭尸,怪物原地又爆了1次!`, 0, 3000);
                }
            }
        } else {
            let 鞭尸次数 = Player.V.鞭尸次数 + Player.R.鞭尸次数 + 1000
            if (鞭尸次数 >= 1) {
                // 如果有固定鞭尸次数，执行对应次数
                for (let a = 0; a < 鞭尸次数; a++) {
                    杀怪鞭尸(Player, Monster);
                }
                Player.SendCountDownMessage(`{s=【鞭尸】;c=253}你击杀击杀怪物触发鞭尸,怪物原地又爆了${鞭尸次数}次!`, 0, 3000);
            }
        }
    }

    大陆成就(Player);
    处理怪物掉落(Player, Monster);
    经验勋章(Player, Monster);
    特殊掉落(Player, Monster);
}
export function 杀怪鞭尸(Player: TPlayObject, Monster: TActor): void {

    if (!GameLib.V.怪物变异) {
        if (Monster.GetNVar(64) != 1) {
            // G    GameLib.MonGen(Player.Map.MapName, '鞭尸样本', 1, Player.GetMapX()+1, Player.GetMapY()+1, 0, 0)
            let Actor = GameLib.MonGen(Monster.Map.MapName, Monster.Name, 1, Monster.GetMapX() + 1, Monster.GetMapY() + 1, 0, 0).Actor(0)
            if (Actor) {
                Actor.Name = Monster.Name;
                Actor.SetSVar(怪物星数, Monster.GetSVar(怪物星数))
                Actor.SetDCMax(99999999)
                Actor.SetDCMin(99999999)
                Actor.SetACMax(0)
                Actor.SetACMin(0)
                Actor.SetMaxHP(100000000)
                Actor.SetHP(100000000)
                Actor.SetExp(Monster.Exp)
                Actor.SetDropName(Monster.DropName)
                Actor.SetSVar(怪物爆率文件, Monster.DropName)
                Actor.SetBlendColor(255)
                Actor.SetSVar(原始名字, Monster.Name)
                Actor.SetNameColor(Monster.NameColor)
                Actor.SetSVar(怪物称号, ``)
                Actor.SetSVar(97, Monster.GetSVar(97));
                Actor.SetSVar(92, Monster.GetSVar(92))
                Actor.SetSVar(91, Monster.GetSVar(92))
                Actor.SetSVar(93, Monster.GetSVar(93))
                Actor.SetSVar(94, Monster.GetSVar(94))
                Actor.SetSVar(95, Monster.GetSVar(95))   // 物理攻击
                Actor.SetSVar(96, Monster.GetSVar(96))   // 物理防御
                Actor.SetNVar(TAG, Monster.GetNVar(TAG))
                let 新字符 = { 怪物名字: Monster.GetSVar(97), 怪物等级: String(Monster.Level), 血量: Monster.GetSVar(92), 攻击: Monster.GetSVar(94), 防御: Monster.GetSVar(96), 怪物颜色: Monster.NameColor, 怪物标志: Monster.GetNVar(TAG), 怪物星数: Monster.GetSVar(怪物星数) }
                GameLib.R.怪物信息 = GameLib.R.怪物信息 || {};
                GameLib.R.怪物信息[`${Actor.Handle}`] = JSON.stringify(新字符)
                Actor.SetSVar(98, JSON.stringify(新字符))

                Actor.SetNVar(64, 1)

                Actor.GoDie(Player, Player)   // 死亡

                // ✅ 实时清理：怪物死亡时立即清理其信息缓存
                try {
                    const 怪物Handle = `${Actor.Handle}`;
                    if (怪物Handle && GameLib.R && GameLib.R.怪物信息 && GameLib.R.怪物信息[怪物Handle]) {
                        delete GameLib.R.怪物信息[怪物Handle];
                        // console.log(`🗑️ [杀怪触发]清理死亡怪物信息: ${Actor.GetName()}(${怪物Handle})`);
                    }
                } catch (cleanupError) {
                    console.log(`❌ [杀怪触发]清理怪物信息出错33333: ${cleanupError}`);
                }

                Actor.MakeGhost()
                // Player.Map.ClearMon(true, Monster.Name)

            }
            // Debug(`杀怪鞭尸` + Monster.Map.MapName + Actor + '次数' + (Player.V.鞭尸次数 + Player.R.鞭尸次数))
        }
    } else {

        // G    GameLib.MonGen(Player.Map.MapName, '鞭尸样本', 1, Player.GetMapX()+1, Player.GetMapY()+1, 0, 0)
        let Actor = GameLib.MonGen(Monster.Map.MapName, Monster.Name, 1, Monster.GetMapX() + 1, Monster.GetMapY() + 1, 0, 0).Actor(0)
        if (Actor) {
            Actor.Name = Monster.Name;
            Actor.SetSVar(怪物星数, Monster.GetSVar(怪物星数))
            Actor.SetDCMax(99999999)
            Actor.SetDCMin(99999999)
            Actor.SetACMax(0)
            Actor.SetACMin(0)
            Actor.SetMaxHP(100000000)
            Actor.SetHP(100000000)
            Actor.SetExp(Monster.Exp)
            Actor.SetDropName(Monster.DropName)
            Actor.SetSVar(怪物爆率文件, Monster.DropName)
            Actor.SetBlendColor(255)
            Actor.SetSVar(原始名字, Monster.Name)
            Actor.SetNameColor(Monster.NameColor)
            Actor.SetSVar(怪物称号, ``)
            Actor.SetSVar(97, Monster.GetSVar(97));
            Actor.SetSVar(92, Monster.GetSVar(92))
            Actor.SetSVar(91, Monster.GetSVar(92))
            Actor.SetSVar(93, Monster.GetSVar(93))
            Actor.SetSVar(94, Monster.GetSVar(94))
            Actor.SetSVar(95, Monster.GetSVar(95))   // 物理攻击
            Actor.SetSVar(96, Monster.GetSVar(96))   // 物理防御
            Actor.SetNVar(TAG, Monster.GetNVar(TAG))
            let 新字符 = { 怪物名字: Monster.GetSVar(97), 怪物等级: String(Monster.Level), 血量: Monster.GetSVar(92), 攻击: Monster.GetSVar(94), 防御: Monster.GetSVar(96), 怪物颜色: Monster.NameColor, 怪物标志: Monster.GetNVar(TAG), 怪物星数: Monster.GetSVar(怪物星数) }
            GameLib.R.怪物信息 = GameLib.R.怪物信息 || {};
            GameLib.R.怪物信息[`${Actor.Handle}`] = JSON.stringify(新字符)
            Actor.SetSVar(98, JSON.stringify(新字符))

            Actor.SetNVar(64, 1)

            // Player.Map.ClearMon(true, Monster.Name)
            Actor.GoDie(Player, Player)   // 死亡
            Actor.MakeGhost()


            // ✅ 实时清理：怪物死亡时立即清理其信息缓存
            // try {
            //     const 怪物Handle = `${Actor.Handle}`;
            //     if (怪物Handle && GameLib.R && GameLib.R.怪物信息 && GameLib.R.怪物信息[怪物Handle]) {
            //         delete GameLib.R.怪物信息[怪物Handle];
            //         // console.log(`🗑️ [杀怪触发2]清理死亡怪物信息: ${Actor.GetName()}(${怪物Handle})`);
            //     }
            // } catch (cleanupError) {
            //     console.log(`❌ [杀怪触发2]清理怪物信息出错2222: ${cleanupError}`);
            // }



        }
        // Debug(`杀怪鞭尸` + Monster.Map.MapName + Actor + '次数' + (Player.V.鞭尸次数 + Player.R.鞭尸次数))


    }



}

export function 经验勋章(Player: TPlayObject, Monster: TActor): void {
    const 勋章 = Player.GetRightHand();
    if (!勋章 || 勋章.GetName() !== '经验勋章') return;

    // 从装备名字解析当前等级，默认为1级
    let currentLevel = 1;
    const displayName = 勋章.GetDisplayName();
    const levelMatch = displayName.match(/『(\d+)级』/);
    if (levelMatch) {
        currentLevel = parseInt(levelMatch[1]);
    }

    const kills = 勋章.GetOutWay2(0) || 0;

    // 定义各个等级的杀怪需求和属性加成
    const LEVELS = [];

    // 每一级升级需要杀的怪物数量，每次升级后重置为0重新计算
    // 1级升2级需要500个，2级升3级需要1000个，3级升4级需要1500个，以此类推
    for (let i = 1; i <= 60; i++) {
        LEVELS[i] = { name: `${i + 1}级`, kills: 250 * i, value: i * 100 };
    }

    // console.log(`经验勋章:${勋章.GetDisplayName()} , 杀怪数量:${kills} , 当前等级:${currentLevel} `);

    // 处理初始状态的勋章（没有等级标识）
    if (displayName === '经验勋章') {
        勋章.Rename('『1级』经验勋章');
        勋章.SetOutWay2(0, 0); // 初始化杀怪数量
        勋章.SetOutWay3(0, LEVELS[1].kills); // 设置1级升2级需要的杀怪数量
        Player.UpdateItem(勋章);
        // console.log(`初始化勋章: 『1级』经验勋章, 1级升2级需要${LEVELS[1].kills}个怪`);
        return; // 初始化后直接返回，等下次杀怪再继续
    }

    // 确保勋章目标数据正确（用于修复可能的数据不一致）
    if (currentLevel >= 1 && currentLevel <= 60 && LEVELS[currentLevel]) {
        const nextLevelData = LEVELS[currentLevel];
        const currentTarget = 勋章.GetOutWay3(0) || 0;

        // 如果目标杀怪数量不正确，修复它
        if (currentTarget !== nextLevelData.kills) {
            勋章.SetOutWay3(0, nextLevelData.kills);
            Player.UpdateItem(勋章);
            // console.log(`修复勋章目标: ${currentLevel}级勋章, 升${currentLevel + 1}级需要${nextLevelData.kills}个怪`);
        }
    }

    // 重新获取杀怪数量（可能在同步名字时被重置了）
    const currentKills = 勋章.GetOutWay2(0) || 0;

    // 检查是否达到下一级的升级要求
    if (currentLevel >= 1 && currentLevel <= 60 && LEVELS[currentLevel]) {
        const nextLevelData = LEVELS[currentLevel]; // 当前等级升级需要的数据
        // console.log(`检查升级: 当前${currentLevel}级 -> ${currentLevel + 1}级, 需要${nextLevelData.kills}个怪, 当前${currentKills}个`);

        if (currentKills < nextLevelData.kills) {
            // 还没达到升级要求，增加杀怪数量
            勋章.SetOutWay2(0, currentKills + 1);
            Player.UpdateItem(勋章);
            return;
        }

        // 达到升级要求，等级提升
        const newLevel = currentLevel + 1;

        // 升级后的名字应该是新等级的名字（等级信息完全存储在装备名字中）
        勋章.Rename(`『${newLevel}级』经验勋章`);

        勋章.SetOutWay1(0, 1);
        勋章.SetOutWay2(0, 0); // 升级后重置杀怪数量为0

        // 设置下一级需要的杀怪数量 (newLevel级升到newLevel+1级需要的数量)
        if (newLevel <= 60 && LEVELS[newLevel]) {
            const nextLevelRequirement = LEVELS[newLevel]; // LEVELS[newLevel]对应升到(newLevel+1)级需要的数据
            勋章.SetOutWay3(0, nextLevelRequirement.kills);
            // console.log(`升级成功！${currentLevel}级 -> ${newLevel}级，重置杀怪数量为0，${newLevel}级升${newLevel + 1}级需要${nextLevelRequirement.kills}个怪`);
        } else {
            勋章.SetOutWay3(0, 0); // 如果没有下一个等级，设置为0
            // console.log(`升级成功！${currentLevel}级 -> ${newLevel}级，已达到最高等级`);
        }

        勋章.SetBind(true);
        勋章.SetNeverDrop(true);
        勋章.GetState().SetNoDrop(true);

        Player.UpdateItem(勋章);
        Player.RecalcAbilitys();

        const msg = `杀怪数量已经达到${nextLevelData.kills},自动进阶为"『${newLevel}级』经验勋章"！`;
        Player.SendCenterMessage(msg, 0);
        Player.SendMessage(msg, 0);

        // 全服广播升级信息
        GameLib.Broadcast(format('玩家「{S=%S;C=227}」杀怪数量达到{S=%d;C=243},{S=经验勋章;C=243}升级为"{S=%S;C=250}"',
            [Player.Name, nextLevelData.kills, `『${newLevel}级』经验勋章`]));
    } else {
        // 如果没有有效的等级数据，只增加杀怪数量
        勋章.SetOutWay2(0, currentKills + 1);
        Player.UpdateItem(勋章);
    }

}


export function 大陆成就(Player: TPlayObject): void {
    let 随机 = random(300)
    if (Player.V.第一章成就 && 随机 < 1) {
        Player.SetGameGold(Player.GetGameGold() + (random(200) + 1))
        Player.GoldChanged()
        Player.SendMessage(`{S=【大陆成就触发】;C=253}: 你获得了{S=${random(200) + 1}元宝;C=250}`, 1)
        // console.log('{S=你获得了${random(100) + 1}元宝;C=250}第一章成就')
    } else if (Player.V.第二章成就 && 随机 < 1) {
        Player.SetGameGold(Player.GetGameGold() + (random(400) + 1))
        Player.GoldChanged()
        Player.SendMessage(`{S=【大陆成就触发】;C=253}: 你获得了{S=${random(400) + 1}元宝;C=250}`, 1)
    } else if (Player.V.第三章成就 && 随机 < 1) {
        Player.SetGameGold(Player.GetGameGold() + (random(600) + 1))
        Player.GoldChanged()
        Player.SendMessage(`{S=【大陆成就触发】;C=253}: 你获得了{S=${random(600) + 1}元宝;C=250}`, 1)
    } else if (Player.V.第四章成就 && 随机 < 1) {
        Player.SetGameGold(Player.GetGameGold() + (random(800) + 1))
        Player.GoldChanged()
        Player.SendMessage(`{S=【大陆成就触发】;C=253}: 你获得了{S=${random(800) + 1}元宝;C=250}`, 1)
    } else if (Player.V.第五章成就 && 随机 < 1) {
        Player.SetGameGold(Player.GetGameGold() + (random(1000) + 1))
        Player.GoldChanged()
        Player.SendMessage(`{S=【大陆成就触发】;C=253}: 你获得了{S=${random(1000) + 1}元宝;C=250}`, 1)
    } else if (Player.V.第六章成就 && 随机 < 1) {
        Player.SetGameGold(Player.GetGameGold() + (random(1200) + 1))
        Player.GoldChanged()
        Player.SendMessage(`{S=【大陆成就触发】;C=253}: 你获得了{S=${random(1200) + 1}元宝;C=250}`, 1)
    } else if (Player.V.第七章成就 && 随机 < 1) {
        Player.SetGameGold(Player.GetGameGold() + (random(1400) + 1))
        Player.GoldChanged()
        Player.SendMessage(`{S=【大陆成就触发】;C=253}: 你获得了{S=${random(1400) + 1}元宝;C=250}`, 1)
    } else if (Player.V.第八章成就 && 随机 < 1) {
        Player.SetGameGold(Player.GetGameGold() + (random(1600) + 1))
        Player.GoldChanged()
        Player.SendMessage(`{S=【大陆成就触发】;C=253}: 你获得了{S=${random(1600) + 1}元宝;C=250}`, 1)
    } else if (Player.V.第九章成就 && 随机 < 1) {
        Player.SetGameGold(Player.GetGameGold() + (random(1800) + 1))
        Player.GoldChanged()
        Player.SendMessage(`{S=【大陆成就触发】;C=253}: 你获得了{S=${random(1800) + 1}元宝;C=250}`, 1)
    } else if (Player.V.第十章成就 && 随机 < 1) {
        Player.SetGameGold(Player.GetGameGold() + (random(2000) + 1))
        Player.GoldChanged()
        Player.SendMessage(`{S=【大陆成就触发】;C=253}: 你获得了{S=${random(2000) + 1}元宝;C=250}`, 1)
    }

    if (Player.V.地图成就 > 0 && random(300) < 1) {
        Player.GameGold += random(Player.V.地图成就 * 5) + 1
        Player.GoldChanged()
        Player.SendMessage(`{S=【地图成就触发】;C=253}: 你获得了{S=${random(Player.V.地图成就 * 5) + 1}元宝;C=250}`, 1)
    }
}

export function 特殊掉落(Player: TPlayObject, Monster: TActor): void {
    const 地图等级 = 地图.取地图固定星级(Player.GetMap().GetName());
    const 随机几率 = Math.random() * 2000; // 生成0-100的随机数
    let 取尾数 = Monster.GetNVar(TAG) % 10
    // } else if (取尾数 == 5) {
    //     Monster.SetDropItemRate(1.5)
    //     Player.GetMonDropItems('低级材料')
    const 爆率配置表 = [
        '低级材料',    // 索引0 → ≤5级（档位1）
        '二大陆材料',  // 索引1 → 6-10级（档位2）
        '三大陆材料',  // 索引2 → 11-15级（档位3）
        '四大陆材料',  // 索引3 → 16-20级（档位4）
        '五大陆材料',  // 索引4 → 21-25级（档位5）
        '六大陆材料',  // 索引5 → 26-30级（档位6）
        '七大陆材料',  // 索引6 → 31-35级（档位7）
        '八大陆材料',  // 索引7 → 36-40级（档位8）
        '九大陆材料',  // 索引8 → 41-45级（档位9）
        '十大陆材料',  // 索引9 → 46-50级（档位10）
        '十一大陆材料',// 索引10 → 51-55级（档位11）
        '十二大陆材料',// 索引11 → 56-60级（档位12）
        '十三大陆材料',// 索引12 → 61-65级（档位13）
        '十四大陆材料',// 索引13 → 66-70级（档位14）
        '十五大陆材料',// 索引14 → 71-75级（档位15）
        '十六大陆材料' // 索引15 → 76-80级（档位16）
    ];

    let 爆率索引 = Math.ceil(地图等级 / 5) - 1;

    爆率索引 = Math.min(爆率索引, 爆率配置表.length - 1);

    // 特殊掉落逻辑：地图等级>20且尾数=5时使用特殊爆率文件
    if (地图等级 > 20 && 地图等级 < 36 && 取尾数 === 5) {
        Player.GetMonDropItems(`${地图等级}图魔物`);
        // console.log(`[特殊掉落] 地图等级: ${地图等级}, 尾数: ${取尾数}, 使用特殊爆率文件: ${地图等级}图魔物`);
    } else {
        Player.GetMonDropItems(爆率配置表[爆率索引]);
    }



    if (js_war(Player.V.无限之熵等级, '0') > 0 && 地图等级 > 15) {
        const 基础属性值 = 取尾数 === 5 ? 1000 : 500;

        // 计算等级段数：每50级一个段
        const 无限之熵等级数值 = parseInt(Player.V.无限之熵等级);
        const 等级段数 = Math.floor(无限之熵等级数值 / 50);

        // 计算额外倍数：10^等级段数 (0-49级=1倍, 50-99级=10倍, 100-149级=100倍...)
        let 额外倍数 = '1';
        for (let i = 0; i < 等级段数; i++) {
            额外倍数 = js_number(额外倍数, '10', 3); // 每段乘以10
        }
        额外倍数 = js_number(额外倍数, Player.V.魔器离钩加成, 3);
        // 调整后的属性值 = 基础属性值 * 额外倍数
        const 调整后属性值 = js_number(String(基础属性值), 额外倍数, 3);

        const 等级加成 = js_number(Player.V.无限之熵等级, 调整后属性值, 3);
        // const 杀怪翻倍 = js_number('0', Player.V.杀怪翻倍, 8);


        const 翻倍加成 = js_number(等级加成, Player.V.无限之熵等级, 3);

        Player.V.杀怪属性值 = js_number(翻倍加成, Player.V.杀怪属性值, 1);

    }
    if (地图等级 === 20 && Math.random() < 0.0000001) {
        Player.Give('无限之殇', 1)
    }

    if (地图等级 >= 36) {
        let 圣墟点数 = 地图等级 - 36
        let 几率 = 0
        switch (取尾数) {
            case 1: 圣墟点数 += 1, 几率 = 10; break
            case 2: 圣墟点数 += 2, 几率 = 20; break
            case 3: 圣墟点数 += 3, 几率 = 30; break
            case 4: 圣墟点数 += 4, 几率 = 40; break
            case 5: 圣墟点数 += 5, 几率 = 50; break
            default: 几率 = 0; break
                break
        }
        if (random(几率 + 200) < 1) {
            Player.V.圣墟点数 += 圣墟点数
            Player.SendMessage(`{S=【圣墟点数触发】;C=253}: 你获得了{S=${圣墟点数}点圣墟点数;C=250},当前点数为${Player.V.圣墟点数}`, 1)
        }
        if (random(8000 - Player.AddedAbility.ItemRate) < 1) {
            if (取尾数 === 5) {
                功能.背包.给叠加物品(Player, '圣墟50点', 1, false)
            } else if (取尾数 === 1 || 取尾数 === 2) {
                功能.背包.给叠加物品(Player, '圣墟10点', 1, false)
            } else {
                功能.背包.给叠加物品(Player, '圣墟20点', 1, false)
            }
        }
    }


}

/**
 * 怪物掉落处理函数
 * 根据配置表处理怪物死亡时的物品掉落
 * @param Player 玩家对象
 * @param Monster 怪物对象
 */
export function 处理怪物掉落(Player: TPlayObject, Monster: TActor): void {
    let 取尾数 = Monster.GetNVar(TAG) % 10
    const 物品名称 = 地图.ID取地图名(Monster.Map.MapName);
    const 随机几率 = Math.random() * 2000; // 生成0-2000的随机数


    // 查找匹配的怪物配置
    const 掉落配置 = 怪物掉落表.find(config => config.物品名称 === 物品名称);


    if (掉落配置 && 随机几率 < (掉落配置.掉落几率 + Math.floor(Player.AddedAbility.ItemRate / 200)) && 取尾数 == 5) {
        // 触发掉落
        Player.Give(掉落配置.物品名称, 掉落配置.物品数量);
        // console.log(`[处理怪物掉落] 物品名称: ${物品名称}, 随机几率: ${随机几率}, 取尾数: ${取尾数}`);
        // 可选：发送掉落提示消息
        // Player.SendMsg(`恭喜获得 ${掉落配置.物品名称} x${掉落配置.物品数量}！`, 1);
    }
}

/**
 * 生物变异系统
 * @param Player 玩家对象
 * @param Monster 怪物对象
 * @returns 是否触发了变异
 */
export function 生物变异(Player: TPlayObject, Monster: TActor): boolean {
    // 只对非玩家怪物进行变异判断
    if (Monster.IsPlayer()) return false;

    // 获取变异几率，如果没有初始化则设为默认值5%
    const 变异几率 = Player.R.变异几率 || 5;

    // 变异几率判断：Player.R.变异几率 / 100
    const 变异随机数 = random(200);
    if (变异随机数 >= 变异几率) return false;

    // 获取怪物当前的变异次数，如果没有则为0
    let 当前变异次数 = Monster.GetNVar(99) || 0;

    // 检查是否已达到最大变异次数（5次）
    if (当前变异次数 >= 3) return false;

    // 变异次数增加
    当前变异次数++;
    Monster.SetNVar(99, 当前变异次数);

    // 计算属性提升倍数：每次变异10倍，累积计算
    let 属性倍数 = Math.pow(10, 当前变异次数);

    if (Player.V.当前变异等级 > 0) {
        const 变异等级数值 = Player.V.当前变异等级;
        const 等级段数 = Math.floor(变异等级数值 / 10);
        属性倍数 = 属性倍数 * (1 + 等级段数 * 0.01);
    }
    // 在怪物周围生成变异怪物（只生成一个）
    生成变异怪物(Player, Monster, 当前变异次数, 属性倍数);

    // 发送变异提示消息
    const 变异提示 = `{s=【生物变异】;c=253}怪物发生第${当前变异次数}次变异！属性提升${属性倍数}倍！`;
    Player.SendCountDownMessage(变异提示, 0, 5000);

    // 如果变异次数达到3次，给予特殊提示
    if (当前变异次数 >= 3) {
        const 最终提示 = `{s=【究极变异】;c=249}怪物已达到最高变异等级！属性提升${属性倍数}倍！`;
        Player.SendCountDownMessage(最终提示, 0, 8000);

        // 全服广播最高变异
        GameLib.Broadcast(format('玩家「{S=%S;C=227}」触发了{S=究极生物变异;C=249}！怪物属性提升{S=%d倍;C=253}！',
            [Player.Name, 属性倍数]));
    }

    return true; // 成功触发变异
}

/**
 * 生物进化系统 - 处理已变异生物的继续进化
 * @param Player 玩家对象
 * @param Monster 已变异的怪物对象
 * @returns 是否触发了进化
 */
export function 生物进化(Player: TPlayObject, Monster: TActor): boolean {
    // 只对已变异的怪物进行进化判断
    if (Monster.IsPlayer() || Monster.GetNVar(99) === 0) return false;

    // 获取进化几率，比变异几率低一些（默认5%）
    const 进化几率 = Player.R.变异几率 || 5;

    // 进化几率判断
    const 进化随机数 = random(200);
    if (进化随机数 >= 进化几率) return false;

    // 获取怪物当前的变异次数
    let 当前变异次数 = Monster.GetNVar(99);

    // 检查是否已达到最大变异次数（5次）
    if (当前变异次数 >= 3) return false;

    // 变异次数增加
    当前变异次数++;
    Monster.SetNVar(99, 当前变异次数);

    // 计算属性提升倍数：每次变异10倍，累积计算
    let 属性倍数 = Math.pow(10, 当前变异次数);

    if (Player.V.当前变异等级 > 0) {
        const 变异等级数值 = Player.V.当前变异等级;
        const 等级段数 = Math.floor(变异等级数值 / 10);
        属性倍数 = 属性倍数 * (1 + 等级段数 * 0.01);
    }
    // 在怪物周围生成进化怪物（只生成一个）
    生成变异怪物(Player, Monster, 当前变异次数, 属性倍数);

    // 发送进化提示消息
    const 进化提示 = `{s=【生物进化】;c=22}变异生物发生第${当前变异次数}次进化！属性提升${属性倍数}倍！`;
    Player.SendCountDownMessage(进化提示, 0, 5000);

    // 如果进化次数达到5次，给予特殊提示
    if (当前变异次数 >= 3) {
        const 最终提示 = `{s=【究极进化】;c=249}变异生物已达到最高进化等级！属性提升${属性倍数}倍！`;
        Player.SendCountDownMessage(最终提示, 0, 8000);

        // 全服广播最高进化
        GameLib.Broadcast(format('玩家「{S=%S;C=227}」触发了{S=究极生物进化;C=249}！怪物属性提升{S=%d倍;C=253}！',
            [Player.Name, 属性倍数]));
    }

    return true; // 成功触发进化
}

/**
 * 生成变异怪物
 * @param Player 玩家对象
 * @param Monster 原始怪物对象
 * @param 变异次数 当前变异次数
 * @param 属性倍数 属性提升倍数
 */
function 生成变异怪物(Player: TPlayObject, Monster: TActor, 变异次数: number, 属性倍数: number): void {
    // 在怪物附近生成变异怪物
    const 生成X = Monster.GetMapX() + random(3) - 1;
    const 生成Y = Monster.GetMapY() + random(3) - 1;

    const 变异怪物 = GameLib.MonGen(Monster.Map.MapName, Monster.Name, 1, 生成X, 生成Y, 0, 0, 0, TAG, true, true, true, true).Actor(0);
    if (!变异怪物) return;

    // console.log(`[生成变异怪物] 变异次数: ${变异次数}, 属性倍数: ${属性倍数}`);
    // 复制原始怪物的基本属性
    变异怪物.Name = Monster.Name;
    变异怪物.SetSVar(怪物星数, Monster.GetSVar(怪物星数));
    变异怪物.SetExp(Monster.Exp * 5);
    变异怪物.SetDropName(Monster.DropName);
    变异怪物.SetSVar(怪物爆率文件, Monster.DropName);
    变异怪物.SetSVar(原始名字, Monster.Name);
    变异怪物.SetSVar(97, Monster.GetSVar(97));
    变异怪物.SetNVar(TAG, Monster.GetNVar(TAG));

    // 设置变异次数
    变异怪物.SetNVar(99, 变异次数);

    // 根据变异次数设置怪物名字颜色和特效
    let 怪物颜色: number;
    let 变异称号: string;

    switch (变异次数) {
        case 1:
            怪物颜色 = 250; // 绿色
            变异称号 = "『变异』";
            break;
        case 2:
            怪物颜色 = 154; // 蓝色
            变异称号 = "『进化』";
            break;
        case 3:
            怪物颜色 = 251; // 黄色
            变异称号 = "『突变』";
            break;
        case 4:
            怪物颜色 = 243; // 橙色
            变异称号 = "『超变』";
            break;
        case 5:
            怪物颜色 = 249; // 红色
            变异称号 = "『究极』";
            break;
        default:
            怪物颜色 = 255; // 白色
            变异称号 = "";
            break;
    }

    变异怪物.SetNameColor(怪物颜色);
    变异怪物.SetSVar(怪物称号, 变异称号);

    // 计算变异后的属性（基于原怪物属性）
    const 原始血量 = Monster.GetSVar(92) || "1000000";  // 提高默认血量
    const 原始攻击 = Monster.GetSVar(94) || "10";    // 提高默认攻击
    const 原始防御 = Monster.GetSVar(96) || "1000";

    // 调试输出
    // console.log(`变异怪物属性计算: 原始血量=${原始血量}, 属性倍数=${属性倍数}, 变异次数=${变异次数}`);

    // 使用大数值计算进行属性提升
    const 变异血量 = js_number(原始血量, String(属性倍数 * 1.5), 3);
    const 变异攻击 = js_number(原始攻击, String(属性倍数), 3);
    const 变异防御 = js_number(原始防御, String(属性倍数), 3);
    const 变异星数 = js_number(Monster.GetSVar(怪物星数), String(属性倍数 * 1.5), 3);

    // 调试输出变异后的数值
    // console.log(`变异后属性: 血量=${变异血量}, 攻击=${变异攻击}, 防御=${变异防御}`);

    // 设置变异后的属性
    变异怪物.SetSVar(92, 变异血量); // 最大血量
    变异怪物.SetSVar(91, 变异血量); // 当前血量
    变异怪物.SetSVar(93, 原始攻击); // 魔法攻击
    变异怪物.SetSVar(94, 变异攻击); // 物理攻击  
    变异怪物.SetSVar(95, 原始防御); // 物理防御小
    变异怪物.SetSVar(96, 变异防御); // 物理防御大
    变异怪物.SetSVar(怪物星数, 变异星数);
    变异怪物.SetNVar(TAG, Monster.GetNVar(TAG));

    // 重要：设置怪物信息和字符计算相关属性
    const 变异怪物信息 = {
        怪物名字: 变异怪物.GetSVar(97),
        怪物等级: String(变异怪物.Level),
        血量: 变异血量,
        攻击: 变异攻击,
        防御: 变异防御,
        怪物颜色: 怪物颜色,
        怪物标志: Monster.GetNVar(TAG),
        怪物星数: 变异星数
    };

    // 更新怪物信息到全局变量和SVar，这对字符计算很重要
    GameLib.R.怪物信息 = GameLib.R.怪物信息 || {};
    GameLib.R.怪物信息[`${变异怪物.Handle}`] = JSON.stringify(变异怪物信息);
    变异怪物.SetSVar(98, JSON.stringify(变异怪物信息));
    let 怪物显明 = 变异怪物.GetSVar(97);
    变异怪物.SetSVar(97, 怪物显明 + 变异称号);

    // 设置实际血量和攻击力
    // 由于变异后的数值可能非常大，需要转换为合适的显示值
    const 显示血量 = Math.min(Number(变异血量) || 999999999, 999999999);
    const 显示攻击 = Math.min(Number(变异攻击) || 9, 9);
    const 显示防御 = Math.min(Number(变异防御) || 10, 10);

    变异怪物.SetMaxHP(1000000);
    变异怪物.SetHP(1000000);
    变异怪物.SetDCMax(1);
    变异怪物.SetDCMin(1);
    变异怪物.SetACMax(1);
    变异怪物.SetACMin(1);

    变异怪物.AddShowName(变异怪物.GetSVar(97));
    // 添加变异特效
    变异怪物.SetBlendColor(怪物颜色);
    变异怪物.SetState(5, 1, 0);

    // 保存怪物信息
    const 怪物信息 = {
        怪物名字: Monster.GetSVar(97),
        怪物等级: String(Monster.Level),
        血量: 变异血量,
        攻击: 变异攻击,
        防御: 变异防御,
        怪物颜色: 怪物颜色,
        怪物标志: Monster.GetNVar(TAG),
        怪物星数: Monster.GetSVar(怪物星数),
        变异次数: 变异次数,
        变异称号: 变异称号
    };

    GameLib.R.怪物信息 = GameLib.R.怪物信息 || {};
    GameLib.R.怪物信息[`${变异怪物.Handle}`] = JSON.stringify(怪物信息);
    变异怪物.SetSVar(98, JSON.stringify(怪物信息));
    // 显示血量
    血量显示(变异怪物);

}   