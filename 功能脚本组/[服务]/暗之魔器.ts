import { js_number } from "../../全局脚本[公共单元]/utils/计算方法_优化版";
import { 数字转单位2, 数字转单位3 } from "../../大数值版本/字符计算";
// import { 装备属性统计 } from '../../应用智能优化版';
import { 装备属性统计 } from '../../应用智能优化版';


export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    Player.V.魔器1回收次数 ??= 0
    Player.V.魔器2回收次数 ??= 0
    Player.V.魔器3回收次数 ??= 0
    Player.V.魔器4回收次数 ??= 0
    Player.V.魔器5回收次数 ??= 0
    Player.V.魔器6回收次数 ??= 0
    Player.V.魔器7回收次数 ??= 0
    Player.V.魔器8回收次数 ??= 0
    Player.V.魔器9回收次数 ??= 0
    Player.V.魔器10回收次数 ??= 0
    Player.V.魔器11回收次数 ??= 0
    Player.V.魔器12回收次数 ??= 0

    const S = `\\\\
                             {S=暗之魔器;C=251} \\\\
    {S=暗之魔器属性介绍:;C=9}\\
    {S=① 每个地图BOSS掉落对应材料,可合成魔器;c=20}\\
    {S=② 每种魔器都有不同的功效;c=20}\\
    {S=③ 魔器回收可获得初始属性的20%.可回收10次;c=20}\\
    {S=④ 5图掉落特殊道具,可用于升级本大陆魔器;c=20}\\
    {S=⑤ 每提高或回收一级,可提高属性20%,最高可提高10级;c=20}\\
    <{S=魔器弑皇合成;HINT=初始属性介绍:#92技能倍功+200#92需求材料:#92弑皇剑首 3个#92弑皇剑脊 3个#92弑皇剑锷 3个#92弑皇剑茎 3个#92弑皇剑鞘 3个;X=110;Y=190}/@合成(魔器弑皇)>\\
    <{S=魔器裂天合成;HINT=初始属性介绍:#92宝宝倍攻+100#92需求材料:#92裂天剑首 3个#92裂天剑脊 3个#92裂天剑锷 3个#92裂天剑茎 3个#92裂天剑鞘 3个;X=200;Y=190}/@合成(魔器裂天)>\\
    <{S=魔器擒龙合成;HINT=初始属性介绍:#92攻击属性倍率+100%#92需求材料:#92擒龙剑首 3个#92擒龙剑脊 3个#92擒龙剑锷 3个#92擒龙剑茎 3个#92擒龙剑鞘 3个;X=110;Y=220}/@合成(魔器擒龙)>\\
    <{S=魔器星瀚合成;HINT=初始属性介绍:#92技能伤害倍率+100%#92需求材料:#92星瀚剑首 3个#92星瀚剑脊 3个#92星瀚剑锷 3个#92星瀚剑茎 3个#92星瀚剑鞘 3个;X=200;Y=220}/@合成(魔器星瀚)>\\
    
    <{S=魔器升级;HINT=需求材料: 20个暗之魔血#92需要礼卷: 200 * 等级;C=22;X=300;Y=190}/@升级(暗之魔血)>
    <{S=魔器回收;HINT=可回收10次;C=22;X=300;Y=220}/@回收>
    <{S=材料抽奖;HINT=花费10000礼卷#92有20%几率获得本大陆随机材料1个;C=249;X=300;Y=160}/@材料抽奖(五大陆)>       
    `
    Npc.SayEx(Player, 'NPC小窗口左下1框', S)

}

export function Main六大陆(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    Player.V.魔器1回收次数 ??= 0
    Player.V.魔器2回收次数 ??= 0
    Player.V.魔器3回收次数 ??= 0
    Player.V.魔器4回收次数 ??= 0
    Player.V.魔器5回收次数 ??= 0
    Player.V.魔器6回收次数 ??= 0
    Player.V.魔器7回收次数 ??= 0
    Player.V.魔器8回收次数 ??= 0
    Player.V.魔器9回收次数 ??= 0
    Player.V.魔器10回收次数 ??= 0
    Player.V.魔器11回收次数 ??= 0
    Player.V.魔器12回收次数 ??= 0


    const S = `\\\\
                             {S=暗之魔器;C=251} \\\\
    {S=暗之魔器属性介绍:;C=9}\\
    {S=① 每个地图BOSS掉落对应材料,可合成魔器;c=20}\\
    {S=② 每种魔器都有不同的功效;c=20}\\
    {S=③ 魔器回收可获得属性.最多可回收10次;c=20}\\
    {S=④ 5图掉落特殊道具,可用于升级本大陆魔器;c=20}\\
    {S=⑤ 每提高或回收一级,可提高属性,最高可提高10级;c=20}\\
    <{S=魔器鸣鸿合成;HINT=初始属性介绍:#92暴怒的加成提高100%#92需求材料:#92鸣鸿剑首 3个#92鸣鸿剑脊 3个#92鸣鸿剑锷 3个#92鸣鸿剑茎 3个#92鸣鸿剑鞘 3个;X=110;Y=190}/@合成(魔器鸣鸿)>\\
    <{S=魔器碎寂合成;HINT=初始属性介绍:#92攻击范围+1,10级范围+2#92需求材料:#92碎寂剑首 3个#92碎寂剑脊 3个#92碎寂剑锷 3个#92碎寂剑茎 3个#92碎寂剑鞘 3个;X=200;Y=190}/@合成(魔器碎寂)>\\
    <{S=魔器浮犀合成;HINT=初始属性介绍:#92烈焰一击所需货币缩减10%#92需求材料:#92浮犀剑首 3个#92浮犀剑脊 3个#92浮犀剑锷 3个#92浮犀剑茎 3个#92浮犀剑鞘 3个;X=110;Y=220}/@合成(魔器浮犀)>\\
    <{S=魔器九霄合成;HINT=初始属性介绍:#92葫芦获得的材料数提高+10%#92需求材料:#92九霄剑首 3个#92九霄剑脊 3个#92九霄剑锷 3个#92九霄剑茎 3个#92九霄剑鞘 3个;X=200;Y=220}/@合成(魔器九霄)>\\
    
    <{S=魔器升级;HINT=需求材料: 20个暗之魔血(六大陆)#92需要礼卷: 200 * 等级;C=22;X=300;Y=190}/@升级(六大陆)>
    <{S=魔器回收;HINT=可回收10次;C=22;X=300;Y=220}/@回收>
    <{S=材料抽奖;HINT=花费10000礼卷#92有20%几率获得本大陆随机材料1个;C=249;X=300;Y=160}/@材料抽奖(六大陆)>       
    `
    Npc.SayEx(Player, 'NPC小窗口左下1框', S)

}
export function Main七大陆(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    Player.V.魔器1回收次数 ??= 0
    Player.V.魔器2回收次数 ??= 0
    Player.V.魔器3回收次数 ??= 0
    Player.V.魔器4回收次数 ??= 0
    Player.V.魔器5回收次数 ??= 0
    Player.V.魔器6回收次数 ??= 0
    Player.V.魔器7回收次数 ??= 0
    Player.V.魔器8回收次数 ??= 0
    Player.V.魔器9回收次数 ??= 0
    Player.V.魔器10回收次数 ??= 0
    Player.V.魔器11回收次数 ??= 0
    Player.V.魔器12回收次数 ??= 0


    const S = `\\\\
                             {S=暗之魔器;C=251} \\\\
    {S=暗之魔器属性介绍:;C=9}\\
    {S=① 每个地图BOSS掉落对应材料,可合成魔器;c=20}\\
    {S=② 每种魔器都有不同的功效;c=20}\\
    {S=③ 魔器回收可获得属性.最多可回收10次;c=20}\\
    {S=④ 5图掉落特殊道具,可用于升级本大陆魔器;c=20}\\
    {S=⑤ 每提高一级,可提高属性,最高可提高10级;c=20}\\
    <{S=魔器离钩合成;HINT=初始属性介绍:#92使你的无限之殇杀怪增加属性提高10倍#9210级加回收10次,总提升1W倍#92需求材料:#92离钩剑首 3个#92离钩剑脊 3个#92离钩剑锷 3个#92离钩剑茎 3个#92离钩剑鞘 3个;X=110;Y=190}/@合成(魔器离钩)>\\
    <{S=魔器醍醐合成;HINT=初始属性介绍:#92使你升级时装所消耗的材料缩减10%#92每提高或回收一级再缩减10%#92需求材料:#92醍醐剑首 3个#92醍醐剑脊 3个#92醍醐剑锷 3个#92醍醐剑茎 3个#92醍醐剑鞘 3个;X=200;Y=190}/@合成(魔器醍醐)>\\
    <{S=魔器霜陨合成;HINT=初始属性介绍:#92使你的特戒属性额外提高50%#92每提高或回收一级再提高50%#92需求材料:#92霜陨剑首 3个#92霜陨剑脊 3个#92霜陨剑锷 3个#92霜陨剑茎 3个#92霜陨剑鞘 3个;X=110;Y=220}/@合成(魔器霜陨)>\\
    <{S=魔器朝夕合成;HINT=初始属性介绍:#92使你继续爬塔的需求货币降低100%#92每提高或回收一级再降低100%#92需求材料:#92朝夕剑首 3个#92朝夕剑脊 3个#92朝夕剑锷 3个#92朝夕剑茎 3个#92朝夕剑鞘 3个;X=200;Y=220}/@合成(魔器朝夕)>\\   

    <{S=魔器升级;HINT=需求材料: 20个暗之魔血(七大陆)#92需要礼卷: 200 * 等级;C=22;X=300;Y=190}/@升级(七大陆)>
    <{S=魔器回收;HINT=可回收10次;C=22;X=300;Y=220}/@回收>
    <{S=材料抽奖;HINT=花费10000礼卷#92有20%几率获得本大陆随机材料1个;C=249;X=300;Y=160}/@材料抽奖(七大陆)>       
    `
    Npc.SayEx(Player, 'NPC小窗口左下1框', S)

}
export function 合成(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 魔器 = Args.Str[0]
    if (Player.GetGamePoint() < 10000) {
        Player.MessageBox(`合成魔器需要10000礼卷，你的礼卷不足！`);
        return;
    }
    if (魔器 == '魔器弑皇') {
        if (Player.GetItemCount('弑皇剑首') < 3 || Player.GetItemCount('弑皇剑脊') < 3 || Player.GetItemCount('弑皇剑锷') < 3 || Player.GetItemCount('弑皇剑茎') < 3 || Player.GetItemCount('弑皇剑鞘') < 3) {
            Player.MessageBox(`材料数量不足,无法合成!`); 
            return;
        }

        Npc.Take(Player, '弑皇剑首', 3)
        Npc.Take(Player, '弑皇剑脊', 3)
        Npc.Take(Player, '弑皇剑锷', 3)
        Npc.Take(Player, '弑皇剑茎', 3)
        Npc.Take(Player, '弑皇剑鞘', 3)
        Player.SetGamePoint(Player.GetGamePoint() - 5000);
        Player.GoldChanged();
        let 魔器 = Player.GiveItem('魔器弑皇');
        魔器.SetBind(true);
        魔器.SetNeverDrop(true);
        魔器.State.SetNoDrop(true);

        设置装备属性值(魔器, 816 ,'200', false);

        Player.UpdateItem(魔器);
        Player.MessageBox(`魔器弑皇合成成功!`)
        return;
    }
    
    if (魔器 == '魔器裂天') {
        if (Player.GetItemCount('裂天剑首') < 3 || Player.GetItemCount('裂天剑脊') < 3 || Player.GetItemCount('裂天剑锷') < 3 || Player.GetItemCount('裂天剑茎') < 3 || Player.GetItemCount('裂天剑鞘') < 3) {
            Player.MessageBox(`材料数量不足,无法合成!`); 
            return;
        }

        Npc.Take(Player, '裂天剑首', 3)
        Npc.Take(Player, '裂天剑脊', 3)
        Npc.Take(Player, '裂天剑锷', 3)
        Npc.Take(Player, '裂天剑茎', 3)
        Npc.Take(Player, '裂天剑鞘', 3)
        Player.SetGamePoint(Player.GetGamePoint() - 5000);
        Player.GoldChanged();
        let 魔器 = Player.GiveItem('魔器裂天');
        魔器.SetBind(true);
        魔器.SetNeverDrop(true);
        魔器.State.SetNoDrop(true);

        设置装备属性值(魔器, 817 ,'100', false);

        Player.UpdateItem(魔器);
        Player.MessageBox(`魔器裂天合成成功!`)
        return;
    }
    
    if (魔器 == '魔器擒龙') {
        if (Player.GetItemCount('擒龙剑首') < 3 || Player.GetItemCount('擒龙剑脊') < 3 || Player.GetItemCount('擒龙剑锷') < 3 || Player.GetItemCount('擒龙剑茎') < 3 || Player.GetItemCount('擒龙剑鞘') < 3) {
            Player.MessageBox(`材料数量不足,无法合成!`); 
            return;
        }

        Npc.Take(Player, '擒龙剑首', 3)
        Npc.Take(Player, '擒龙剑脊', 3)
        Npc.Take(Player, '擒龙剑锷', 3)
        Npc.Take(Player, '擒龙剑茎', 3)
        Npc.Take(Player, '擒龙剑鞘', 3)
        Player.SetGamePoint(Player.GetGamePoint() - 5000);
        Player.GoldChanged();
        let 魔器 = Player.GiveItem('魔器擒龙');
        魔器.SetBind(true);
        魔器.SetNeverDrop(true);
        魔器.State.SetNoDrop(true);

        设置装备属性值(魔器, 818 ,'100', false);

        Player.UpdateItem(魔器);
        Player.MessageBox(`魔器擒龙合成成功!`)
        return;
    }
    
    if (魔器 == '魔器星瀚') {
        if (Player.GetItemCount('星瀚剑首') < 3 || Player.GetItemCount('星瀚剑脊') < 3 || Player.GetItemCount('星瀚剑锷') < 3 || Player.GetItemCount('星瀚剑茎') < 3 || Player.GetItemCount('星瀚剑鞘') < 3) {
            Player.MessageBox(`材料数量不足,无法合成!`); 
            return;
        }

        Npc.Take(Player, '星瀚剑首', 3)
        Npc.Take(Player, '星瀚剑脊', 3)
        Npc.Take(Player, '星瀚剑锷', 3)
        Npc.Take(Player, '星瀚剑茎', 3)
        Npc.Take(Player, '星瀚剑鞘', 3)
        Player.SetGamePoint(Player.GetGamePoint() - 5000);
        Player.GoldChanged();
        let 魔器 = Player.GiveItem('魔器星瀚');
        魔器.SetBind(true);
        魔器.SetNeverDrop(true);
        魔器.State.SetNoDrop(true);

        设置装备属性值(魔器, 819 ,'100', false);
        Player.UpdateItem(魔器);
        Player.MessageBox(`魔器星瀚合成成功!`)
        return;
    }

    if (魔器 == '魔器鸣鸿') {
        if (Player.GetItemCount('鸣鸿剑首') < 3 || Player.GetItemCount('鸣鸿剑脊') < 3 || Player.GetItemCount('鸣鸿剑锷') < 3 || Player.GetItemCount('鸣鸿剑茎') < 3 || Player.GetItemCount('鸣鸿剑鞘') < 3) {
            Player.MessageBox(`材料数量不足,无法合成!`); 
            return;
        }

        Npc.Take(Player, '鸣鸿剑首', 3)
        Npc.Take(Player, '鸣鸿剑脊', 3)
        Npc.Take(Player, '鸣鸿剑锷', 3)
        Npc.Take(Player, '鸣鸿剑茎', 3)
        Npc.Take(Player, '鸣鸿剑鞘', 3)
        Player.SetGamePoint(Player.GetGamePoint() - 5000);
        Player.GoldChanged();
        let 魔器 = Player.GiveItem('魔器鸣鸿');
        魔器.SetBind(true);
        魔器.SetNeverDrop(true);
        魔器.State.SetNoDrop(true);


        设置装备属性值(魔器, 820 ,'100', false);

        Player.UpdateItem(魔器);
        Player.MessageBox(`魔器鸣鸿合成成功!`)
        return;
    }
    if (魔器 == '魔器碎寂') {
        if (Player.GetItemCount('碎寂剑首') < 3 || Player.GetItemCount('碎寂剑脊') < 3 || Player.GetItemCount('碎寂剑锷') < 3 || Player.GetItemCount('碎寂剑茎') < 3 || Player.GetItemCount('碎寂剑鞘') < 3) {
            Player.MessageBox(`材料数量不足,无法合成!`); 
            return;
        }

        Npc.Take(Player, '碎寂剑首', 3)
        Npc.Take(Player, '碎寂剑脊', 3)
        Npc.Take(Player, '碎寂剑锷', 3)
        Npc.Take(Player, '碎寂剑茎', 3)
        Npc.Take(Player, '碎寂剑鞘', 3)
        Player.SetGamePoint(Player.GetGamePoint() - 5000);
        Player.GoldChanged();
        let 魔器 = Player.GiveItem('魔器碎寂');
        魔器.SetBind(true);
        魔器.SetNeverDrop(true);
        魔器.State.SetNoDrop(true);

        设置装备属性值(魔器, 821 ,'1', false);

        Player.UpdateItem(魔器);
        Player.MessageBox(`魔器碎寂合成成功!`)
        return;
    }
    if (魔器 == '魔器浮犀') {
        if (Player.GetItemCount('浮犀剑首') < 3 || Player.GetItemCount('浮犀剑脊') < 3 || Player.GetItemCount('浮犀剑锷') < 3 || Player.GetItemCount('浮犀剑茎') < 3 || Player.GetItemCount('浮犀剑鞘') < 3) {
            Player.MessageBox(`材料数量不足,无法合成!`); 
            return;
        }
        
        Npc.Take(Player, '浮犀剑首', 3)
        Npc.Take(Player, '浮犀剑脊', 3)
        Npc.Take(Player, '浮犀剑锷', 3)
        Npc.Take(Player, '浮犀剑茎', 3)
        Npc.Take(Player, '浮犀剑鞘', 3)
        Player.SetGamePoint(Player.GetGamePoint() - 5000);
        Player.GoldChanged();
        let 魔器 = Player.GiveItem('魔器浮犀');
        魔器.Rename(`『1级』魔器浮犀`);
        魔器.SetBind(true);
        魔器.SetNeverDrop(true);
        魔器.State.SetNoDrop(true);

        设置装备属性值(魔器, 822 ,'10', false);

        Player.UpdateItem(魔器);
        Player.MessageBox(`魔器浮犀合成成功!`)
        return;
    }
    if (魔器 == '魔器九霄') {
        if (Player.GetItemCount('九霄剑首') < 3 || Player.GetItemCount('九霄剑脊') < 3 || Player.GetItemCount('九霄剑锷') < 3 || Player.GetItemCount('九霄剑茎') < 3 || Player.GetItemCount('九霄剑鞘') < 3) {
            Player.MessageBox(`材料数量不足,无法合成!`); 
            return;
        }

        Npc.Take(Player, '九霄剑首', 3)
        Npc.Take(Player, '九霄剑脊', 3)
        Npc.Take(Player, '九霄剑锷', 3)
        Npc.Take(Player, '九霄剑茎', 3)
        Npc.Take(Player, '九霄剑鞘', 3)
        Player.SetGamePoint(Player.GetGamePoint() - 5000);
        Player.GoldChanged();
        let 魔器 = Player.GiveItem('魔器九霄');
        魔器.Rename(`『1级』魔器九霄`);
        魔器.SetBind(true);
        魔器.SetNeverDrop(true);
        魔器.State.SetNoDrop(true);

        设置装备属性值(魔器, 823 ,'10', false);

        Player.UpdateItem(魔器);
        Player.MessageBox(`魔器九霄合成成功!`)
        return;
    }
    if (魔器 == '魔器离钩') {
        if (Player.GetItemCount('离钩剑首') < 3 || Player.GetItemCount('离钩剑脊') < 3 || Player.GetItemCount('离钩剑锷') < 3 || Player.GetItemCount('离钩剑茎') < 3 || Player.GetItemCount('离钩剑鞘') < 3) {
            Player.MessageBox(`材料数量不足,无法合成!`); 
            return;
        }
        
        Npc.Take(Player, '离钩剑首', 3)
        Npc.Take(Player, '离钩剑脊', 3)
        Npc.Take(Player, '离钩剑锷', 3)
        Npc.Take(Player, '离钩剑茎', 3)
        Npc.Take(Player, '离钩剑鞘', 3)
        Player.SetGamePoint(Player.GetGamePoint() - 5000);
        Player.GoldChanged();
        let 魔器 = Player.GiveItem('魔器离钩');
        魔器.Rename(`『1级』魔器离钩`);
        魔器.SetBind(true);
        魔器.SetNeverDrop(true);
        魔器.State.SetNoDrop(true);
        设置装备属性值(魔器, 824 ,'10', false);
        Player.UpdateItem(魔器);
        Player.MessageBox(`魔器离钩合成成功!`)
        return;
    }
    if (魔器 == '魔器醍醐') {
        if (Player.GetItemCount('醍醐剑首') < 3 || Player.GetItemCount('醍醐剑脊') < 3 || Player.GetItemCount('醍醐剑锷') < 3 || Player.GetItemCount('醍醐剑茎') < 3 || Player.GetItemCount('醍醐剑鞘') < 3) {
            Player.MessageBox(`材料数量不足,无法合成!`); 
            return;
        }
        Npc.Take(Player, '醍醐剑首', 3)
        Npc.Take(Player, '醍醐剑脊', 3)
        Npc.Take(Player, '醍醐剑锷', 3)
        Npc.Take(Player, '醍醐剑茎', 3)
        Npc.Take(Player, '醍醐剑鞘', 3)
        Player.SetGamePoint(Player.GetGamePoint() - 5000);
        Player.GoldChanged();
        let 魔器 = Player.GiveItem('魔器醍醐');
        魔器.Rename(`『1级』魔器醍醐`);
        魔器.SetBind(true);
        魔器.SetNeverDrop(true);
        魔器.State.SetNoDrop(true);
        设置装备属性值(魔器, 825 ,'10', false);
        Player.UpdateItem(魔器);
        Player.MessageBox(`魔器醍醐合成成功!`)
        return;
    }
    if (魔器 == '魔器霜陨') {
        if (Player.GetItemCount('霜陨剑首') < 3 || Player.GetItemCount('霜陨剑脊') < 3 || Player.GetItemCount('霜陨剑锷') < 3 || Player.GetItemCount('霜陨剑茎') < 3 || Player.GetItemCount('霜陨剑鞘') < 3) {
            Player.MessageBox(`材料数量不足,无法合成!`); 
            return;
        }
        Npc.Take(Player, '霜陨剑首', 3)
        Npc.Take(Player, '霜陨剑脊', 3)
        Npc.Take(Player, '霜陨剑锷', 3)
        Npc.Take(Player, '霜陨剑茎', 3)
        Npc.Take(Player, '霜陨剑鞘', 3)
        Player.SetGamePoint(Player.GetGamePoint() - 5000);
        Player.GoldChanged();
        let 魔器 = Player.GiveItem('魔器霜陨');
        魔器.Rename(`『1级』魔器霜陨`);
        魔器.SetBind(true);
        魔器.SetNeverDrop(true);
        魔器.State.SetNoDrop(true);
        设置装备属性值(魔器, 826 ,'50', false);
        Player.UpdateItem(魔器);
        Player.MessageBox(`魔器霜陨合成成功!`)
        return;
    }
    if (魔器 == '魔器朝夕') {
        if (Player.GetItemCount('朝夕剑首') < 3 || Player.GetItemCount('朝夕剑脊') < 3 || Player.GetItemCount('朝夕剑锷') < 3 || Player.GetItemCount('朝夕剑茎') < 3 || Player.GetItemCount('朝夕剑鞘') < 3) {
            Player.MessageBox(`材料数量不足,无法合成!`); 
            return;
        }
        Npc.Take(Player, '朝夕剑首', 3)
        Npc.Take(Player, '朝夕剑脊', 3)
        Npc.Take(Player, '朝夕剑锷', 3)
        Npc.Take(Player, '朝夕剑茎', 3)
        Npc.Take(Player, '朝夕剑鞘', 3)
        Player.SetGamePoint(Player.GetGamePoint() - 5000);
        Player.GoldChanged();
        let 魔器 = Player.GiveItem('魔器朝夕');
        魔器.Rename(`『1级』魔器朝夕`);
        魔器.SetBind(true);
        魔器.SetNeverDrop(true);
        魔器.State.SetNoDrop(true);
        设置装备属性值(魔器, 827 ,'100', false);
        Player.UpdateItem(魔器);
        Player.MessageBox(`魔器朝夕合成成功!`)
        return;
    }
}

export function 升级(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 材料 = Args.Str[0];
    if (材料 == '六大陆') {
        材料 = '暗之魔血(六大陆)';
    }
    if (材料 == '七大陆') {
        材料 = '暗之魔血(七大陆)';
    }
    // 通过GetCustomItem(0)获取特戒
    const 魔器 = Player.GetCustomItem(0);
    const 魔器名 = 魔器.GetName();
    let 当前等级 = 0;
    // 如果没有找到特戒
    if (!魔器 || !魔器.GetName().includes('魔器')) {
        Player.MessageBox('请先放入魔器！');
        return;
    }

    let 属性ID = 魔器.GetOutWay1(12);
    let 属性值 = 魔器.GetOutWay2(12);

  // 从特戒名称中提取等级
  const displayName = 魔器.DisplayName;
  const match = displayName.match(/『(\d+)级』/) || ['0', '0'];

  if (!match) {
      Player.MessageBox('您放入的不是有效的魔器！');
      return;
  }

  // 获取当前等级
  当前等级 = parseInt(match[1]);

  // 计算所需元宝
  const 下一级 = 当前等级 + 1;
  if (下一级 > 10) {
      Player.MessageBox(`你的魔器已经达到10级,无法继续升级！`);
      return;
  }

  let 所需礼卷 = 下一级 * 1000;

  // 检查元宝是否足够
  if (Player.GetGamePoint() < 所需礼卷) {
      Player.MessageBox(`提升魔器等级需要${所需礼卷}礼卷，你的礼卷不足！`);
      return;
  }

  if (Player.GetItemCount(材料) < 20) {
    Player.MessageBox(`${材料}数量不足20个,无法升级!`);
    return;
  }

  // 扣除礼卷
  Player.SetGamePoint(Player.GetGamePoint() - 所需礼卷);
  Npc.Take(Player, 材料, 20);
  Player.GoldChanged();

  const newMedalName = `『${下一级}级』${魔器名}`;
  魔器.Rename(newMedalName);
  魔器.SetBind(true);
  魔器.SetNeverDrop(true);
  魔器.State.SetNoDrop(true);

  if(魔器名 == '魔器弑皇') {  属性值 = 属性值 + 40; }
  else if(魔器名 == '魔器鸣鸿') {  属性值 = 属性值 + 100; }
  else if(魔器名 == '魔器碎寂' && 下一级 === 10) {  属性值 = 属性值 + 1; }
  else if(魔器名 == '魔器浮犀') {  属性值 = 属性值 + 10; }
  else if(魔器名 == '魔器九霄') {  属性值 = 属性值 + 10; }
  else if(魔器名 == '魔器离钩') {  属性值 = 属性值 + 10; }
  else if(魔器名 == '魔器醍醐') {  属性值 = 属性值 + 10; }
  else if(魔器名 == '魔器霜陨') {  属性值 = 属性值 + 50; }
  else if(魔器名 == '魔器朝夕') {  属性值 = 属性值 + 100; }
  else{属性值 = 属性值 + 20;}

  设置装备属性值(魔器, 属性ID ,String(属性值), true);
  Player.UpdateItem(魔器);
  Player.MessageBox(`${魔器名}升级成功! 当前等级: ${下一级}`);

  if (魔器名 == '魔器离钩' || 魔器名 == '魔器醍醐' || 魔器名 == '魔器霜陨' || 魔器名 == '魔器朝夕') {
    Main七大陆(Npc, Player, Args);
  } else if (魔器名 ==  '魔器鸣鸿' || 魔器名 == '魔器碎寂' || 魔器名 == '魔器浮犀' || 魔器名 == '魔器九霄') {
    Main六大陆(Npc, Player, Args);
  } else {
    Main(Npc, Player, Args);
  }

}



export function 材料抽奖(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 大陆类型 = Args.Str[0];
    
    // 检查礼卷是否足够
    if (Player.GetGamePoint() < 10000) {
        Player.MessageBox('材料抽奖需要10000礼卷，你的礼卷不足！');
        return;
    }

    // 扣除礼卷
    Player.SetGamePoint(Player.GetGamePoint() - 10000);
    Player.GoldChanged();

    // 定义各大陆的材料池
    let 材料池: string[] = [];
    
    if (大陆类型 === '五大陆') {
        材料池 = [
            '弑皇剑首', '弑皇剑脊', '弑皇剑锷', '弑皇剑茎', '弑皇剑鞘',
            '裂天剑首', '裂天剑脊', '裂天剑锷', '裂天剑茎', '裂天剑鞘',
            '擒龙剑首', '擒龙剑脊', '擒龙剑锷', '擒龙剑茎', '擒龙剑鞘',
            '星瀚剑首', '星瀚剑脊', '星瀚剑锷', '星瀚剑茎', '星瀚剑鞘'
        ];
    } else if (大陆类型 === '六大陆' ) {
        材料池 = [
            '鸣鸿剑首', '鸣鸿剑脊', '鸣鸿剑锷', '鸣鸿剑茎', '鸣鸿剑鞘',
            '碎寂剑首', '碎寂剑脊', '碎寂剑锷', '碎寂剑茎', '碎寂剑鞘',
            '浮犀剑首', '浮犀剑脊', '浮犀剑锷', '浮犀剑茎', '浮犀剑鞘',
            '九霄剑首', '九霄剑脊', '九霄剑锷', '九霄剑茎', '九霄剑鞘'
        ];
    } else if (大陆类型 === '七大陆') {
        材料池 = [
            '离钩剑首', '离钩剑脊', '离钩剑锷', '离钩剑茎', '离钩剑鞘',
            '醍醐剑首', '醍醐剑脊', '醍醐剑锷', '醍醐剑茎', '醍醐剑鞘',
            '霜陨剑首', '霜陨剑脊', '霜陨剑锷', '霜陨剑茎', '霜陨剑鞘',
            '朝夕剑首', '朝夕剑脊', '朝夕剑锷', '朝夕剑茎', '朝夕剑鞘'
        ];
    }

    // 判断是否中奖（1/5几率 = 20%）
    Randomize();
    const 是否中奖 = Math.random() < 0.2;

    if (是否中奖) {
        // 随机选择一个材料
        const 随机索引 = Math.floor(Math.random() * 材料池.length);
        const 获得材料 = 材料池[随机索引];
        
        // 给予材料
        Player.Give(获得材料, 1);
        Player.MessageBox(`恭喜你！抽奖成功，获得了 ${获得材料} x1！`);
    } else {
        Player.MessageBox('很遗憾，本次抽奖未中奖，请再接再厉！');
    }

    // 返回对应的界面
    if (大陆类型 === '五大陆') {
        Main(Npc, Player, Args);
    } else if (大陆类型 === '六大陆') {
        Main六大陆(Npc, Player, Args);
    } else if (大陆类型 === '七大陆') {
        Main七大陆(Npc, Player, Args);
    }
}

export function 回收(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {

    // 通过GetCustomItem(0)获取特戒
    const 魔器 = Player.GetCustomItem(0);
    if (!魔器 || !魔器.GetName().includes('魔器')) {
        Player.MessageBox('未找到想要回收的魔器');
        return;
    }
    const 魔器名 = 魔器.GetName();   

    if (魔器名 == '魔器弑皇') {
        if (Player.V.魔器1回收次数 < 10) {
            Player.V.魔器1回收次数 += 1;
            Player.DeleteItem(魔器, 1);
            Player.V.人物技能倍攻 = js_number(Player.V.人物技能倍攻, '40', 1);
            Player.MessageBox(`${魔器名}回收成功! 当前回收次数: ${Player.V.魔器1回收次数} ,回收次数上限: 10`);
        } else {
            Player.MessageBox(`${魔器名}回收次数已达上限!`);
            return;
        }
    } else if (魔器名 == '魔器裂天') {
        if (Player.V.魔器2回收次数 < 10) {
            Player.V.魔器2回收次数 += 1;
            Player.DeleteItem(魔器, 1);
            Player.V.所有宝宝倍攻 = js_number(Player.V.所有宝宝倍攻, '20', 1);
            Player.MessageBox(`${魔器名}回收成功! 当前回收次数: ${Player.V.魔器2回收次数} ,回收次数上限: 10`);
        } else {
            Player.MessageBox(`${魔器名}回收次数已达上限!`);
            return;
        }
    } else if (魔器名 == '魔器擒龙') {
        if (Player.V.魔器3回收次数 < 10) {
            Player.V.魔器3回收次数 += 1;
            Player.DeleteItem(魔器, 1);
            Player.V.攻击属性倍率 = js_number(Player.V.攻击属性倍率, '20', 1);
            Player.MessageBox(`${魔器名}回收成功! 当前回收次数: ${Player.V.魔器3回收次数} ,回收次数上限: 10`);
        } else {
            Player.MessageBox(`${魔器名}回收次数已达上限!`);
            return;
        }
    } else if (魔器名 == '魔器星瀚') {
        if (Player.V.魔器4回收次数 < 10) {
            Player.V.魔器4回收次数 += 1;
            Player.DeleteItem(魔器, 1);
            Player.V.技能伤害倍率 = js_number(Player.V.技能伤害倍率, '20', 1);
            Player.MessageBox(`${魔器名}回收成功! 当前回收次数: ${Player.V.魔器4回收次数} ,回收次数上限: 10`);
        } else {
            Player.MessageBox(`${魔器名}回收次数已达上限!`);
            return;
        }
    } else if (魔器名 == '魔器鸣鸿') {
        if (Player.V.魔器5回收次数 < 10) {
            Player.V.魔器5回收次数 += 1;
            Player.DeleteItem(魔器, 1);
            Player.V.暴怒的加成 = js_number(Player.V.暴怒的加成, '20', 1);
            Player.MessageBox(`${魔器名}回收成功! 当前回收次数: ${Player.V.魔器5回收次数} ,回收次数上限: 10`);
        } else {
            Player.MessageBox(`${魔器名}回收次数已达上限!`);
            return;
        }
    } else if (魔器名 == '魔器碎寂') {
        if (Player.V.魔器6回收次数 < 10) {
            Player.V.魔器6回收次数 += 1;
            Player.DeleteItem(魔器, 1);
            if (Player.V.魔器6回收次数 === 10 || Player.V.魔器6回收次数 === 1) {
                Player.V.攻击范围 = js_number(Player.V.攻击范围, '1', 1);
            }
            Player.MessageBox(`${魔器名}回收成功! 当前回收次数: ${Player.V.魔器6回收次数} ,当前回收加成范围为${Player.V.攻击范围}格,回收次数上限: 10`);
        } else {
            Player.MessageBox(`${魔器名}回收次数已达上限!`);
            return;
        }
    } else if (魔器名 == '魔器浮犀') {
        if (Player.V.魔器7回收次数 < 10) {
            Player.V.魔器7回收次数 += 1;
            Player.DeleteItem(魔器, 1);
            Player.V.烈焰一击所需货币缩减 = js_number(Player.V.烈焰一击所需货币缩减, '10', 1);
            Player.MessageBox(`${魔器名}回收成功! 当前回收次数: ${Player.V.魔器7回收次数} ,回收次数上限: 10`);
        } else {
            Player.MessageBox(`${魔器名}回收次数已达上限!`);
            return;
        }
    } else if (魔器名 == '魔器九霄') {
        if (Player.V.魔器8回收次数 < 10) {
            Player.V.魔器8回收次数 += 1;
            Player.DeleteItem(魔器, 1);
            Player.V.魔器葫芦 = js_number(Player.V.魔器葫芦, '10', 1);
            Player.MessageBox(`${魔器名}回收成功! 当前回收次数: ${Player.V.魔器8回收次数} ,回收次数上限: 10`);
        } else {
            Player.MessageBox(`${魔器名}回收次数已达上限!`);
            return;
        }
    } else if (魔器名 == '魔器离钩') {
        if (Player.V.魔器9回收次数 < 10) {
            Player.V.魔器9回收次数 += 1;
            Player.DeleteItem(魔器, 1);
            Player.V.魔器离钩加成 = js_number(Player.V.魔器离钩加成, '10', 1);
            Player.MessageBox(`${魔器名}回收成功! 当前回收次数: ${Player.V.魔器9回收次数} ,回收次数上限: 10`);
        } else {
            Player.MessageBox(`${魔器名}回收次数已达上限!`);
            return;
        }
    } else if (魔器名 == '魔器醍醐') {
        if (Player.V.魔器10回收次数 < 10) {
            Player.V.魔器10回收次数 += 1;
            Player.DeleteItem(魔器, 1);
            Player.V.魔器醍醐加成 = js_number(Player.V.魔器醍醐加成, '10', 1);
            Player.MessageBox(`${魔器名}回收成功! 当前回收次数: ${Player.V.魔器10回收次数} ,回收次数上限: 10`);
        } else {
            Player.MessageBox(`${魔器名}回收次数已达上限!`);
            return;
        }
    } else if (魔器名 == '魔器霜陨') {
        if (Player.V.魔器11回收次数 < 10) {
            Player.V.魔器11回收次数 += 1;
            Player.DeleteItem(魔器, 1);
            Player.V.魔器霜陨加成 = js_number(Player.V.魔器霜陨加成, '50', 1);
            Player.MessageBox(`${魔器名}回收成功! 当前回收次数: ${Player.V.魔器11回收次数} ,回收次数上限: 10`);
        } else {
            Player.MessageBox(`${魔器名}回收次数已达上限!`);
            return;
        }
    } else if (魔器名 == '魔器朝夕') {
        if (Player.V.魔器12回收次数 < 10) {
            Player.V.魔器12回收次数 += 1;
            Player.DeleteItem(魔器, 1);
            Player.V.魔器朝夕加成 = js_number(Player.V.魔器朝夕加成, '100', 1);
            Player.MessageBox(`${魔器名}回收成功! 当前回收次数: ${Player.V.魔器12回收次数} ,回收次数上限: 10`);
        } else {
            Player.MessageBox(`${魔器名}回收次数已达上限!`);
            return;
        }
    } else {
        Player.MessageBox(`未知的魔器类型: ${魔器名}`);
        return;
    }

    // Npc.Take(Player, 魔器名, 1);
    // Player.DeleteItem(魔器, 1);
    装备属性统计(Player, undefined, undefined, undefined);
    // console.log(`${魔器名}回收成功!攻击属性倍率: ${Player.V.攻击属性倍率}`);
    // Player.MessageBox(`${魔器名}回收成功! 当前回收次数: ${Player.V.魔器1回收次数}`);
    if (魔器名 == '魔器离钩' || 魔器名 == '魔器醍醐' || 魔器名 == '魔器霜陨' || 魔器名 == '魔器朝夕') {
        Main七大陆(Npc, Player, Args);
      } else if (魔器名 ==  '魔器鸣鸿' || 魔器名 == '魔器碎寂' || 魔器名 == '魔器浮犀' || 魔器名 == '魔器九霄') {
        Main六大陆(Npc, Player, Args);
      } else {
        Main(Npc, Player, Args);
      }
}


// =================================== 类型定义 ===================================
interface 装备属性记录 {
    职业属性_职业: number[]
    职业属性_属性: string[]
    职业属性_生肖: string[]
}

// =================================== 装备记录功能 ===================================

/**
 * 初始化装备属性记录
 * @param UserItem 装备对象
 * @returns 装备属性记录对象
 */
function 初始化装备属性记录(UserItem: TUserItem): 装备属性记录 {
    const 现有描述 = UserItem.GetCustomDesc()

    if (现有描述 && 现有描述.length > 0) {
        try {
            const 装备属性记录 = JSON.parse(现有描述) as 装备属性记录
            return 装备属性记录
        } catch (e) {
            // 解析失败，重新初始化
        }
    }

    // 返回新的记录对象
    return { 职业属性_职业: [], 职业属性_属性: [], 职业属性_生肖: [] }
}


/**
 * 设置装备属性值
 * @param UserItem 装备对象
 * @param 属性ID 属性ID number
 * @param 属性值 属性值字符串
 * @param 是否清空记录 是否清空之前的记录，默认false
 */
function 设置装备属性值(UserItem: TUserItem, 属性ID:number, 属性值: string, 是否清空记录: boolean = false): void {
    let 装备属性记录 = 初始化装备属性记录(UserItem)

    if (是否清空记录) {
        // 清空之前的属性记录
        装备属性记录 = { 职业属性_职业: [], 职业属性_属性: [], 职业属性_生肖: [] }
    }

    // 使用新的格式设置属性值
    const 索引 = 12
    const 前端数字 = 数字转单位2(属性值)
    const 后端单位 = 数字转单位3(属性值)

    UserItem.SetOutWay1(索引, 属性ID)
    UserItem.SetOutWay2(索引, Number(前端数字))
    UserItem.SetOutWay3(索引, Number(后端单位))

    // 记录属性
    装备属性记录.职业属性_职业.push(属性ID)
    装备属性记录.职业属性_属性.push(属性值)

    // 更新装备描述
    UserItem.SetCustomDesc(JSON.stringify(装备属性记录))
}
