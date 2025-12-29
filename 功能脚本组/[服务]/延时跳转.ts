
import { 原始名字, 怪物星数, 怪物超星数, 怪物颜色 } from "../[怪物]/_M_Base"
import { 分钟检测无人60分清理怪物, 按分钟检测, 秒钟第一次进入刷怪 } from "../[怪物]/_M_Robot";
import { 种族第二, 种族第三, 种族第一, 基础属性分割, 备用三 } from "../[装备]/_ITEM_Base";

import { 装备属性统计 } from '../../性能优化/index_智能优化';
import { 实时回血, 实时扣血, 数字转单位2, 数字转单位3, 血量显示 } from "../../核心功能/字符计算";
import { js_number } from "../../全局脚本[公共单元]/utils/计算方法";
import { 转大数值  , 智能计算} from "../../大数值/核心计算方法";
import * as 地图2 from '../../_核心部分/_地图/地图';
import { 快速清理, 安全清理, 深度清理, 执行完整清理 } from '../../核心功能/清理冗余数据';
import { 增加 } from "../[功能]/_功能";

export function 清理啊(Npc: TNormNpc, Player: TPlayObject): void {
    GameLib.ClearMapMon(Player.GetMapName());
    GameLib.R[Player.GetMapName()] = false
}

export function 交易市场(Npc: TNormNpc, Player: TPlayObject): void {
    // Player.RemoveExtendButton('交易市场')
    // Player.AddExtendButton('交易市场', `\\{S=点击查看交易中心;C=251}`, '交易市场啊', 172, 450, 分辨率(Player))
}


export function 会员(Npc: TNormNpc, Player: TPlayObject): void {
    // Player.RemoveExtendButton('会员')
    // Player.AddExtendButton('会员', `{S=点击查看会员;C=251}`, '会员啊', 189, 1, 分辨率(Player))
    Player.AddSidebarButton("", "特殊")
}


export function 人物死亡(Npc: TNormNpc, Player: TPlayObject): void {
    const S = `\\\\
                {S=--------------------------;C=249}\\
                        {S=人物死亡;C=249}\\
                {S=--------------------------;C=249}\\\\
                    <免费复活/@延时跳转.免费复活> {S=返回安全区;C=224}\\\\
                    <原地复活/@延时跳转.收费复活> {S=消耗300元宝;C=243}\\\\
    `
    Player.SayEx('人物死亡', S)
}

export function 多开踢出(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.Kick();
}

export function 免费复活(Npc: TNormNpc, Player: TPlayObject): void {
    Player.SetSVar(91, Player.V.自定属性[1051])  //当前血量
    Player.SetSVar(92, Player.V.自定属性[1052])    //当前最大血量
    // 血量显示(Player)
    装备属性统计(Player, undefined, undefined, undefined)

    Player.ReAlive()
    Player.GoHome()
    // activation(Player);/*重新计算玩家身上的装备*/
    Player.RecalcAbilitys;/*重新计算能力值*/
}

export function 收费复活(Npc: TNormNpc, Player: TPlayObject): void {
    if (Player.GetGameGold() < 300) { Player.MessageBox(`元宝不足300,无法原地复活`); return }
    Player.SetGameGold(Player.GetGameGold() - 300)
    Player.GoldChanged()
    Player.SetSVar(91, Player.V.自定属性[1051])  //当前血量
    Player.SetSVar(92, Player.V.自定属性[1052])    //当前最大血量
    // 血量显示(Player)
    装备属性统计(Player, undefined, undefined, undefined)
    Player.ReAlive()
    // Player.GoHome()
    // activation(Player);/*重新计算玩家身上的装备*/
    Player.RecalcAbilitys;/*重新计算能力值*/
}

export function 玩家复活(Npc: TNormNpc, Player: TPlayObject): void {
    Player.SetSVar(91, Player.V.自定属性[1051])  //当前血量
    Player.SetSVar(92, Player.V.自定属性[1052])    //当前最大血量


    Player.ReAlive()
    Player.GoHome()

    // 血量显示(Player)
    装备属性统计(Player, undefined, undefined, undefined)
    // activation(Player);/*重新计算玩家身上的装备*/
    Player.RecalcAbilitys;/*重新计算能力值*/
}
export function 从新登录(Npc: TNormNpc, Player: TPlayObject): void {
    Player.Kick()
}


export const UnitList = [
    { len: 0, name: "", 图片位置: 999999 },
    { len: 4, name: "万", 图片位置: 12 },
    { len: 8, name: "亿", 图片位置: 13 },
    { len: 12, name: "兆", 图片位置: 14 },
    { len: 16, name: "京", 图片位置: 15 },
    { len: 20, name: "秭", 图片位置: 16 },
    { len: 24, name: "穰", 图片位置: 17 },
    { len: 28, name: "沟", 图片位置: 18 },
    { len: 32, name: "涧", 图片位置: 19 },
    { len: 36, name: "正", 图片位置: 20 },
    { len: 40, name: "载", 图片位置: 21 },
    { len: 44, name: "极", 图片位置: 22 },
    { len: 48, name: "万极", 图片位置: 23 },
    { len: 52, name: "亿极", 图片位置: 24 },
    { len: 56, name: "兆极", 图片位置: 25 },
    { len: 60, name: "京极", 图片位置: 26 },
    { len: 64, name: "秭极", 图片位置: 27 },
    { len: 68, name: "穰极", 图片位置: 28 },
    { len: 72, name: "沟极", 图片位置: 29 },
    { len: 76, name: "涧极", 图片位置: 30 },
    { len: 80, name: "正极", 图片位置: 31 },
    { len: 84, name: "载极", 图片位置: 32 },
    { len: 88, name: "极极", 图片位置: 33 },
    { len: 92, name: "帕", 图片位置: 34 },
    { len: 96, name: "万帕", 图片位置: 35 },
    { len: 100, name: "亿帕", 图片位置: 36 },
    { len: 104, name: "兆帕", 图片位置: 37 },
    { len: 108, name: "京帕", 图片位置: 38 },
    { len: 112, name: "秭帕", 图片位置: 39 },
    { len: 116, name: "穰帕", 图片位置: 40 },
    { len: 120, name: "沟帕", 图片位置: 41 },
    { len: 124, name: "涧帕", 图片位置: 42 },
    { len: 128, name: "正帕", 图片位置: 43 },
    { len: 132, name: "载帕", 图片位置: 44 },
    { len: 136, name: "极帕", 图片位置: 45 },
    { len: 140, name: "帕帕", 图片位置: 46 },
    { len: 144, name: "古", 图片位置: 47 },
    { len: 148, name: "万古", 图片位置: 48 },
    { len: 152, name: "亿古", 图片位置: 49 },
    { len: 156, name: "兆古", 图片位置: 50 },
    { len: 160, name: "京古", 图片位置: 51 },
    { len: 164, name: "垓古", 图片位置: 52 },
    { len: 168, name: "秭古", 图片位置: 53 },
    { len: 172, name: "穰古", 图片位置: 54 },
    { len: 176, name: "沟古", 图片位置: 55 },
    { len: 180, name: "涧古", 图片位置: 56 },
    { len: 184, name: "正古", 图片位置: 57 },
    { len: 188, name: "载古", 图片位置: 58 },
    { len: 192, name: "极古", 图片位置: 59 },
    { len: 196, name: "帕古", 图片位置: 60 },
    { len: 200, name: "古古", 图片位置: 61 },
    { len: 204, name: "希", 图片位置: 62 },
    { len: 208, name: "万希", 图片位置: 63 },
    { len: 212, name: "亿希", 图片位置: 64 },
    { len: 216, name: "兆希", 图片位置: 65 },
    { len: 220, name: "京希", 图片位置: 66 },
    { len: 224, name: "垓希", 图片位置: 67 },
    { len: 228, name: "秭希", 图片位置: 68 },
    { len: 232, name: "穰希", 图片位置: 69 },
    { len: 236, name: "沟希", 图片位置: 70 },
    { len: 240, name: "涧希", 图片位置: 71 },
    { len: 244, name: "正希", 图片位置: 72 },
    { len: 248, name: "载希", 图片位置: 73 },
    { len: 252, name: "极希", 图片位置: 74 },
    { len: 256, name: "帕希", 图片位置: 75 },
    { len: 260, name: "古希", 图片位置: 76 },
    { len: 264, name: "希希", 图片位置: 77 },
    { len: 268, name: "霾", 图片位置: 78 },
    { len: 272, name: "万霾", 图片位置: 79 },
    { len: 276, name: "亿霾", 图片位置: 80 },
    { len: 280, name: "兆霾", 图片位置: 81 },
    { len: 284, name: "京霾", 图片位置: 82 },
    { len: 288, name: "垓霾", 图片位置: 83 },
    { len: 292, name: "秭霾", 图片位置: 84 },
    { len: 296, name: "穰霾", 图片位置: 85 },
    { len: 300, name: "沟霾", 图片位置: 86 },
    { len: 304, name: "涧霾", 图片位置: 87 },
    { len: 308, name: "正霾", 图片位置: 88 },
    { len: 312, name: "载霾", 图片位置: 89 },
    { len: 316, name: "极霾", 图片位置: 90 },
    { len: 320, name: "帕霾", 图片位置: 91 },
    { len: 324, name: "古霾", 图片位置: 92 },
    { len: 328, name: "希霾", 图片位置: 93 },
    { len: 332, name: "霾霾", 图片位置: 94 },
    { len: 336, name: "道", 图片位置: 95 },
    { len: 340, name: "万道", 图片位置: 96 },
    { len: 344, name: "亿道", 图片位置: 97 },
    { len: 348, name: "兆道", 图片位置: 98 },
    { len: 352, name: "京道", 图片位置: 99 },
    { len: 356, name: "垓道", 图片位置: 100 },
    { len: 360, name: "秭道", 图片位置: 101 },
    { len: 364, name: "穰道", 图片位置: 102 },
    { len: 368, name: "沟道", 图片位置: 103 },
    { len: 372, name: "涧道", 图片位置: 104 },
    { len: 376, name: "正道", 图片位置: 105 },
    { len: 380, name: "载道", 图片位置: 106 },
    { len: 384, name: "极道", 图片位置: 107 },
    { len: 388, name: "帕道", 图片位置: 108 },
    { len: 392, name: "古道", 图片位置: 109 },
    { len: 396, name: "希道", 图片位置: 110 },
    { len: 400, name: "霾道", 图片位置: 111 },
    { len: 404, name: "道道", 图片位置: 112 },
    { len: 408, name: "尼", 图片位置: 113 },
    { len: 412, name: "万尼", 图片位置: 114 },
    { len: 416, name: "亿尼", 图片位置: 115 },
    { len: 420, name: "兆尼", 图片位置: 116 },
    { len: 424, name: "京尼", 图片位置: 117 },
    { len: 428, name: "垓尼", 图片位置: 118 },
    { len: 432, name: "秭尼", 图片位置: 119 },
    { len: 436, name: "穰尼", 图片位置: 120 },
    { len: 440, name: "沟尼", 图片位置: 121 },
    { len: 444, name: "涧尼", 图片位置: 122 },
    { len: 448, name: "正尼", 图片位置: 123 },
    { len: 452, name: "载尼", 图片位置: 124 },
    { len: 456, name: "极尼", 图片位置: 125 },
    { len: 460, name: "帕尼", 图片位置: 126 },
    { len: 464, name: "古尼", 图片位置: 127 },
    { len: 468, name: "希尼", 图片位置: 128 },
    { len: 472, name: "霾尼", 图片位置: 129 },
    { len: 476, name: "道尼", 图片位置: 130 },
    { len: 480, name: "尼尼", 图片位置: 131 },
    { len: 484, name: "临", 图片位置: 132 },
    { len: 488, name: "万临", 图片位置: 133 },
    { len: 492, name: "亿临", 图片位置: 134 },
    { len: 496, name: "兆临", 图片位置: 135 },
    { len: 500, name: "京临", 图片位置: 136 },
    { len: 504, name: "垓临", 图片位置: 137 },
    { len: 508, name: "秭临", 图片位置: 138 },
    { len: 512, name: "穰临", 图片位置: 139 },
    { len: 516, name: "沟临", 图片位置: 140 },
    { len: 520, name: "涧临", 图片位置: 141 },
    { len: 524, name: "正临", 图片位置: 142 },
    { len: 528, name: "载临", 图片位置: 143 },
    { len: 532, name: "极临", 图片位置: 144 },
    { len: 536, name: "帕临", 图片位置: 145 },
    { len: 540, name: "古临", 图片位置: 146 },
    { len: 544, name: "希临", 图片位置: 147 },
    { len: 548, name: "霾临", 图片位置: 148 },
    { len: 552, name: "道临", 图片位置: 149 },
    { len: 556, name: "尼临", 图片位置: 150 },
    { len: 560, name: "临临", 图片位置: 151 },
    { len: 564, name: "兵", 图片位置: 152 },
    { len: 568, name: "万兵", 图片位置: 153 },
    { len: 572, name: "亿兵", 图片位置: 154 },
    { len: 576, name: "兆兵", 图片位置: 155 },
    { len: 580, name: "京兵", 图片位置: 156 },
    { len: 584, name: "垓兵", 图片位置: 157 },
    { len: 588, name: "秭兵", 图片位置: 158 },
    { len: 592, name: "穰兵", 图片位置: 159 },
    { len: 596, name: "沟兵", 图片位置: 160 },
    { len: 600, name: "涧兵", 图片位置: 161 },
    { len: 604, name: "正兵", 图片位置: 162 },
    { len: 608, name: "载兵", 图片位置: 163 },
    { len: 612, name: "极兵", 图片位置: 164 },
    { len: 616, name: "帕兵", 图片位置: 165 },
    { len: 620, name: "古兵", 图片位置: 166 },
    { len: 624, name: "希兵", 图片位置: 167 },
    { len: 628, name: "霾兵", 图片位置: 168 },
    { len: 632, name: "道兵", 图片位置: 169 },
    { len: 636, name: "尼兵", 图片位置: 170 },
    { len: 640, name: "临兵", 图片位置: 171 },
    { len: 644, name: "兵兵", 图片位置: 172 },
    { len: 648, name: "斗", 图片位置: 173 },
    { len: 652, name: "万斗", 图片位置: 174 },
    { len: 656, name: "亿斗", 图片位置: 175 },
    { len: 660, name: "兆斗", 图片位置: 176 },
    { len: 664, name: "京斗", 图片位置: 177 },
    { len: 668, name: "垓斗", 图片位置: 178 },
    { len: 672, name: "秭斗", 图片位置: 179 },
    { len: 676, name: "穰斗", 图片位置: 180 },
    { len: 680, name: "沟斗", 图片位置: 181 },
    { len: 684, name: "涧斗", 图片位置: 182 },
    { len: 688, name: "正斗", 图片位置: 183 },
    { len: 672, name: "载斗", 图片位置: 184 },
    { len: 676, name: "极斗", 图片位置: 185 },
    { len: 680, name: "帕斗", 图片位置: 186 },
    { len: 684, name: "古斗", 图片位置: 187 },
    { len: 688, name: "希斗", 图片位置: 188 },
    { len: 692, name: "霾斗", 图片位置: 189 },
    { len: 696, name: "道斗", 图片位置: 190 },
    { len: 700, name: "尼斗", 图片位置: 191 },
    { len: 704, name: "临斗", 图片位置: 192 },
    { len: 708, name: "兵斗", 图片位置: 193 },
    { len: 712, name: "斗斗", 图片位置: 194 },
    { len: 716, name: "者", 图片位置: 195 },
    { len: 720, name: "万者", 图片位置: 196 },
    { len: 724, name: "亿者", 图片位置: 197 },
    { len: 728, name: "兆者", 图片位置: 198 },
    { len: 732, name: "京者", 图片位置: 199 },
    { len: 736, name: "垓者", 图片位置: 200 },
    { len: 740, name: "秭者", 图片位置: 201 },
    { len: 744, name: "穰者", 图片位置: 202 },
    { len: 748, name: "沟者", 图片位置: 203 },
    { len: 752, name: "涧者", 图片位置: 204 },
    { len: 756, name: "正者", 图片位置: 205 },
    { len: 760, name: "载者", 图片位置: 206 },
    { len: 766, name: "极者", 图片位置: 207 },
    { len: 772, name: "帕者", 图片位置: 208 },
    { len: 776, name: "古者", 图片位置: 209 },
    { len: 780, name: "希者", 图片位置: 210 },
    { len: 784, name: "霾者", 图片位置: 211 },
    { len: 788, name: "道者", 图片位置: 212 },
    { len: 792, name: "尼者", 图片位置: 213 },
    { len: 796, name: "临者", 图片位置: 214 },
    { len: 800, name: "兵者", 图片位置: 215 },
    { len: 804, name: "斗者", 图片位置: 216 },
    { len: 808, name: "者者", 图片位置: 217 },
    { len: 812, name: "皆", 图片位置: 218 },
    { len: 816, name: "万皆", 图片位置: 219 },
    { len: 820, name: "亿皆", 图片位置: 220 },
    { len: 824, name: "兆皆", 图片位置: 221 },
    { len: 828, name: "京皆", 图片位置: 222 },
    { len: 832, name: "垓皆", 图片位置: 223 },
    { len: 836, name: "秭皆", 图片位置: 224 },
    { len: 840, name: "穰皆", 图片位置: 225 },
    { len: 844, name: "沟皆", 图片位置: 226 },
    { len: 848, name: "涧皆", 图片位置: 227 },
    { len: 852, name: "正皆", 图片位置: 228 },
    { len: 856, name: "载皆", 图片位置: 229 },
    { len: 860, name: "极皆", 图片位置: 230 },
    { len: 864, name: "帕皆", 图片位置: 231 },
    { len: 868, name: "古皆", 图片位置: 232 },
    { len: 872, name: "希皆", 图片位置: 233 },
    { len: 876, name: "霾皆", 图片位置: 234 },
    { len: 880, name: "道皆", 图片位置: 235 },
    { len: 884, name: "尼皆", 图片位置: 236 },
    { len: 888, name: "临皆", 图片位置: 237 },
    { len: 892, name: "兵皆", 图片位置: 238 },
    { len: 896, name: "斗皆", 图片位置: 239 },
    { len: 900, name: "者皆", 图片位置: 240 },
    { len: 904, name: "皆皆", 图片位置: 241 },
    { len: 908, name: "阵", 图片位置: 242 },
    { len: 912, name: "万阵", 图片位置: 243 },
    { len: 916, name: "亿阵", 图片位置: 244 },
    { len: 920, name: "兆阵", 图片位置: 245 },
    { len: 924, name: "京阵", 图片位置: 246 },
    { len: 928, name: "垓阵", 图片位置: 247 },
    { len: 932, name: "秭阵", 图片位置: 248 },
    { len: 936, name: "穰阵", 图片位置: 249 },
    { len: 940, name: "沟阵", 图片位置: 250 },
    { len: 944, name: "涧阵", 图片位置: 251 },
    { len: 948, name: "正阵", 图片位置: 252 },
    { len: 952, name: "载阵", 图片位置: 253 },
    { len: 956, name: "极阵", 图片位置: 254 },
    { len: 960, name: "帕阵", 图片位置: 255 },
    { len: 964, name: "古阵", 图片位置: 256 },
    { len: 968, name: "希阵", 图片位置: 257 },
    { len: 972, name: "霾阵", 图片位置: 258 },
    { len: 976, name: "道阵", 图片位置: 259 },
    { len: 980, name: "尼阵", 图片位置: 260 },
    { len: 988, name: "临阵", 图片位置: 261 },
    { len: 992, name: "兵阵", 图片位置: 262 },
    { len: 996, name: "斗阵", 图片位置: 263 },
    { len: 1000, name: "者阵", 图片位置: 264 },
    { len: 1004, name: "皆阵", 图片位置: 265 },
    { len: 1008, name: "阵阵", 图片位置: 266 },
    { len: 1012, name: "列", 图片位置: 267 },
    { len: 1016, name: "万列", 图片位置: 268 },
    { len: 1020, name: "亿列", 图片位置: 269 },
    { len: 1024, name: "兆列", 图片位置: 270 },
    { len: 1028, name: "京列", 图片位置: 271 },
    { len: 1032, name: "垓列", 图片位置: 272 },
    { len: 1036, name: "秭列", 图片位置: 273 },
    { len: 1040, name: "穰列", 图片位置: 274 },
    { len: 1044, name: "沟列", 图片位置: 275 },
    { len: 1048, name: "涧列", 图片位置: 276 },
    { len: 1052, name: "正列", 图片位置: 277 },
    { len: 1056, name: "载列", 图片位置: 278 },
    { len: 1060, name: "极列", 图片位置: 279 },
    { len: 1064, name: "帕列", 图片位置: 280 },
    { len: 1068, name: "古列", 图片位置: 281 },
    { len: 1072, name: "希列", 图片位置: 282 },
    { len: 1076, name: "霾列", 图片位置: 283 },
    { len: 1080, name: "道列", 图片位置: 284 },
    { len: 1084, name: "尼列", 图片位置: 285 },
    { len: 1088, name: "临列", 图片位置: 286 },
    { len: 1092, name: "兵列", 图片位置: 287 },
    { len: 1096, name: "斗列", 图片位置: 288 },
    { len: 1100, name: "者列", 图片位置: 289 },
    { len: 1104, name: "皆列", 图片位置: 290 },
    { len: 1108, name: "阵列", 图片位置: 291 },
    { len: 1112, name: "列列", 图片位置: 292 },
    { len: 1116, name: "在", 图片位置: 293 },
    { len: 1120, name: "万在", 图片位置: 294 },
    { len: 1124, name: "亿在", 图片位置: 295 },
    { len: 1128, name: "兆在", 图片位置: 296 },
    { len: 1132, name: "京在", 图片位置: 297 },
    { len: 1136, name: "垓在", 图片位置: 298 },
    { len: 1140, name: "秭在", 图片位置: 299 },
    { len: 1144, name: "穰在", 图片位置: 300 },
    { len: 1148, name: "沟在", 图片位置: 301 },
    { len: 1152, name: "涧在", 图片位置: 302 },
    { len: 1156, name: "正在", 图片位置: 303 },
    { len: 1160, name: "载在", 图片位置: 304 },
    { len: 1164, name: "极在", 图片位置: 305 },
    { len: 1168, name: "帕在", 图片位置: 306 },
    { len: 1172, name: "古在", 图片位置: 307 },
    { len: 1176, name: "希在", 图片位置: 308 },
    { len: 1180, name: "霾在", 图片位置: 309 },
    { len: 1184, name: "道在", 图片位置: 310 },
    { len: 1188, name: "尼在", 图片位置: 311 },
    { len: 1192, name: "临在", 图片位置: 312 },
    { len: 1196, name: "兵在", 图片位置: 313 },
    { len: 1200, name: "斗在", 图片位置: 314 },
    { len: 1204, name: "者在", 图片位置: 315 },
    { len: 1208, name: "皆在", 图片位置: 316 },
    { len: 1212, name: "阵在", 图片位置: 317 },
    { len: 1216, name: "列在", 图片位置: 318 },
    { len: 1220, name: "在在", 图片位置: 319 },
    { len: 1224, name: "前", 图片位置: 320 },
    { len: 1228, name: "万前", 图片位置: 321 },
    { len: 1232, name: "亿前", 图片位置: 322 },
    { len: 1236, name: "兆前", 图片位置: 323 },
    { len: 1240, name: "京前", 图片位置: 324 },
    { len: 1244, name: "垓前", 图片位置: 325 },
    { len: 1248, name: "秭前", 图片位置: 326 },
    { len: 1252, name: "穰前", 图片位置: 327 },
    { len: 1256, name: "沟前", 图片位置: 328 },
    { len: 1260, name: "涧前", 图片位置: 329 },
    { len: 1264, name: "正前", 图片位置: 330 },
    { len: 1268, name: "载前", 图片位置: 331 },
    { len: 1272, name: "极前", 图片位置: 332 },
    { len: 1276, name: "帕前", 图片位置: 333 },
    { len: 1280, name: "古前", 图片位置: 334 },
    { len: 1284, name: "希前", 图片位置: 335 },
    { len: 1288, name: "霾前", 图片位置: 336 },
    { len: 1292, name: "道前", 图片位置: 337 },
    { len: 1296, name: "尼前", 图片位置: 338 },
    { len: 1300, name: "临前", 图片位置: 339 },
    { len: 1304, name: "兵前", 图片位置: 340 },
    { len: 1308, name: "斗前", 图片位置: 341 },
    { len: 1312, name: "者前", 图片位置: 342 },
    { len: 1316, name: "皆前", 图片位置: 343 },
    { len: 1320, name: "阵前", 图片位置: 344 },
    { len: 1324, name: "列前", 图片位置: 345 },
    { len: 1328, name: "在前", 图片位置: 346 },
    { len: 1332, name: "前前", 图片位置: 347 },
    { len: 1336, name: "诛", 图片位置: 348 },
    { len: 1340, name: "万诛", 图片位置: 349 },
    { len: 1344, name: "亿诛", 图片位置: 350 },
    { len: 1348, name: "兆诛", 图片位置: 351 },
    { len: 1352, name: "京诛", 图片位置: 352 },
    { len: 1356, name: "垓诛", 图片位置: 353 },
    { len: 1360, name: "秭诛", 图片位置: 354 },
    { len: 1364, name: "穰诛", 图片位置: 355 },
    { len: 1368, name: "沟诛", 图片位置: 356 },
    { len: 1372, name: "涧诛", 图片位置: 357 },
    { len: 1376, name: "正诛", 图片位置: 358 },
    { len: 1380, name: "载诛", 图片位置: 359 },
    { len: 1384, name: "极诛", 图片位置: 360 },
    { len: 1388, name: "帕诛", 图片位置: 361 },
    { len: 1392, name: "古诛", 图片位置: 362 },
    { len: 1396, name: "希诛", 图片位置: 363 },
    { len: 1400, name: "霾诛", 图片位置: 364 },
    { len: 1404, name: "道诛", 图片位置: 365 },
    { len: 1408, name: "尼诛", 图片位置: 366 },
    { len: 1412, name: "临诛", 图片位置: 367 },
    { len: 1416, name: "兵诛", 图片位置: 368 },
    { len: 1420, name: "斗诛", 图片位置: 369 },
    { len: 1424, name: "者诛", 图片位置: 370 },
    { len: 1428, name: "皆诛", 图片位置: 371 },
    { len: 1432, name: "阵诛", 图片位置: 372 },
    { len: 1436, name: "列诛", 图片位置: 373 },
    { len: 1440, name: "在诛", 图片位置: 374 },
    { len: 1444, name: "前诛", 图片位置: 375 },
    { len: 1448, name: "诛诛", 图片位置: 376 },
]
const MaxShowLen = 4 //最大显示长度超过就转显示单位
export function formatNumber(value: string): number {
    let num = Number(value)
    if (isNaN(num)) {
        return 0
    }
    return num
}

export function 大数值整数简写(num: string): string {
    let index1 = num.indexOf(".")
    if (index1 >= 0) {
        num = num.substring(0, index1)
    }

    let index = UnitList.length - 1
    let tmp = num.length - MaxShowLen
    for (let i = 0; i < UnitList.length; i++) {
        let item = UnitList[i]
        if (tmp <= item.len) {
            index = i
            break
        }
    }
    if (index == 0) {
        return num
    }
    else {
        let item = UnitList[index]
        // 修改部分开始
        let cutPos = num.length - item.len
        if (cutPos <= 0) cutPos = 1

        // 先提取整数部分
        let mainPart = num.substring(0, cutPos)
        // 直接用Number处理，确保没有前导零
        let mainNum = Number(mainPart)
        // 如果转换结果无效，默认为1
        if (isNaN(mainNum) || mainNum === 0) mainNum = 1

        // 提取小数部分
        let decimalPart = ""
        if (cutPos < num.length) {
            decimalPart = num.substring(cutPos, cutPos + 2).padEnd(2, '0')
        } else {
            decimalPart = "00"
        }

        return `${mainNum}.${decimalPart}${item.name}`
        // 修改部分结束
    }
}

export function 装备数值简写(num: string): string {
    let index1 = num.indexOf(".")
    if (index1 >= 0) {
        num = num.substring(0, index1)
    }

    let index = UnitList.length - 1
    let tmp = num.length - MaxShowLen
    for (let i = 0; i < UnitList.length; i++) {
        let item = UnitList[i]
        if (tmp <= item.len) {
            index = i
            break
        }
    }
    if (index == 0) {
        return num
    }
    else {
        let item = UnitList[index]
        // 修改部分开始
        let cutPos = num.length - item.len
        if (cutPos <= 0) cutPos = 1

        // 先提取整数部分
        let mainPart = num.substring(0, cutPos)
        // 直接用Number处理，确保没有前导零
        let mainNum = Number(mainPart)
        // 如果转换结果无效，默认为1
        if (isNaN(mainNum) || mainNum === 0) mainNum = 1

        // 提取小数部分
        let decimalPart = ""
        if (cutPos < num.length) {
            decimalPart = num.substring(cutPos, cutPos + 2).padEnd(2, '0')
        } else {
            decimalPart = "00"
        }

        return `${mainNum}.${decimalPart} {S=${item.name};C=251}`
        // 修改部分结束
    }
}

export function tranNumber2(num: string): any {
    let index1 = num.indexOf(".")
    if (index1 >= 0) {
        num = num.substring(0, index1)
    }

    let index = UnitList.length - 1
    let tmp = num.length - MaxShowLen
    for (let i = 0; i < UnitList.length; i++) {
        let item = UnitList[i]
        if (tmp <= item.len) {
            index = i
            break
        }
    }
    if (index == 0) {
        return {
            num: formatNumber(num),
            index: 0
        }
    }
    else {
        let item = UnitList[index]
        let newNum = num.substring(0, num.length - item.len)

        // return {
        //     num: formatNumber(newNum),
        //     index: index
        // }
        return formatNumber(newNum) + index

    }

}
export function 随机小数(min: number, max: number): number {
    if (min > max) {
        [min, max] = [max, min]; // 交换参数，确保 min <= max
    }
    return Math.random() * (max - min) + min;
}

export function 测试用的(Npc: TNormNpc, Player: TPlayObject): void {
    Randomize()
    if (Player.IsAdmin) {
        // Player.SetMP(Player.GetMaxMP())
        //   Player.V.真实充值 = 1000
        //    Player.V.真实充值=10000
        let 基本属性_职业 = []
        let 基本属性_数值 = []
        let 装备属性记录 = {
            职业属性_职业: 基本属性_职业,
            职业属性_属性: 基本属性_数值,
        }
        // Player.V.轮回次数=50
        // let a = '100'
        // let b = '99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999'

        // let item:TUserItem


        装备属性统计(Player, undefined, undefined, undefined)

        const S = `\\\\\\\\
    人物爆率:${Player.R.爆率加成}    人物极品倍率:${Player.R.极品率} \\
    <转职/@延时跳转.转职> <来个装备/@延时跳转.来个装备>  <清空背包/@延时跳转.清空背包>  <修改技能等级/@@延时跳转.InPutString(输入技能名字)> <刷个怪/@延时跳转.刷怪>  <加满血蓝/@延时跳转.加满>  <清空血蓝/@延时跳转.清空>  \\
    <地图传送(下标)/@@延时跳转.InPutString23(输入下标)>   <地图传送(名称)/@@延时跳转.InPutString24(输入名字)>   <清理当前地图怪物/@延时跳转.地图(1)>  <执行当前地图刷怪/@延时跳转.地图(2)> \\
    <召唤宝宝/@延时跳转.召唤>     <刷稻草人/@延时跳转.刷稻草人>    <来个生肖/@延时跳转.来个生肖>     <清理地图/@延时跳转.清理地图>    <技能范围/@延时跳转.技能范围>\\
    <我要秒怪/@延时跳转.我要秒怪>  <领取货币/@延时跳转.领取货币>  <刷练功师/@延时跳转.刷练功师>   <清理冗余/@延时跳转.清理冗余数据>  \\
    <给玩家刷物品/@@延时跳转.InPutString20(格式：玩家名字-物品名字-数量)>   <给玩家刷属性/@@延时跳转.InPutString21(玩家-属性-类型1（积分）、2（元宝）、3（回收比例）、4（爆率）、5（等级）、6（挑战倍数）)>  <给玩家转职/@@延时跳转.InPutString22(格式:玩家名字-职业)>\\
    <给玩家刷特殊物品/@@延时跳转.InPutString25(格式：玩家名字-物品名字-数量)> <刷魔器/@延时跳转.刷魔器>  <学习技能/@@延时跳转.InPutString26(输入技能名字)>
    
    `

        Npc.SayEx(Player, 'NPC大窗口', S)
    }
}
export function 刷魔器(Npc: TNormNpc, Player: TPlayObject): void {
   Npc.Give(Player, '霜陨剑首', 30);
   Npc.Give(Player, '霜陨剑脊', 30);
   Npc.Give(Player, '霜陨剑锷', 30);
   Npc.Give(Player, '霜陨剑茎', 30);
   Npc.Give(Player, '霜陨剑鞘', 30);
}

export function 技能范围(Npc: TNormNpc, Player: TPlayObject): void {
    Player.AddSkill('万箭齐发啊', 10)
    let Magic = Player.FindSkill('万箭齐发啊')
    if (Magic) {
        Magic.SetLevel(10)
        Player.UpdateMagic(Magic);
    }

}
export function 清理冗余数据(Npc: TNormNpc, Player: TPlayObject): void {
    执行完整清理();
    console.log(`怪物数量 : ${Player.Map.MonCount}`)

}

export function InPutString26(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 技能名字 = Args.Str[0]
    Player.AddSkill(技能名字, 10)
    let Magic = Player.FindSkill(技能名字)
    if (Magic) {
        Magic.SetLevel(10)
        Player.UpdateMagic(Magic);
    }
}
export function InPutString25(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const str: string = Args.Str[0]
    const list: string[] = str.split('-')   //字符串转数字 以,分割  也就是说[数组1,数组2,,数组3,.......]
    let Item: TUserItem
    let PlayerName = list[0] //数组1 也就是从0开始
    let 物品名字 = list[1] //数组1 也就是从0开始
    let 物品等级 = Number(list[2])
    let a: TPlayObject = GameLib.FindPlayer(PlayerName);
    // console.log(物品数量)
    if (a == null) { Player.MessageBox('玩家名字不正确!'); return }

    let out = 12
    let 属性 = 1
    let 特殊物品 = Player.GiveItem(物品名字);

    if (物品名字 == '聚宝葫芦') {out = 5; 属性 = Math.floor(物品等级/10) + 1 }
    if (物品名字 == '玉帝之玺') {out = 851; 属性 = 物品等级 * 3 }
    if (物品名字 == '老君灵宝') {out = 852; 属性 = 物品等级}
    if (物品名字 == '女娲之泪') {out = 853; 属性 = 物品等级}

   特殊物品.SetOutWay1(12, out)
   特殊物品.SetOutWay2(12, 属性)
   特殊物品.Rename(`『${物品等级}级』${物品名字}`);
   特殊物品.SetBind(true);
   特殊物品.SetNeverDrop(true);
   特殊物品.State.SetNoDrop(true);
    a.UpdateItem(特殊物品);


    Player.MessageBox(`成功给{S=${PlayerName};C=224}刷新了{S=${物品名字};C=251}!`)

}
export function InPutString24(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {   //
    let 下标 = Args.Str[0];
    if (下标 != null) {
        Player.RandomMove(下标)
    } else { Player.MessageBox('玩家名字不正确,或者不在线'); }

}
export function InPutString23(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //地图传送

    let 下标 = Args.Int[0];
    if (下标 != null) {
        Player.Move(地图2.取地图ID(下标), 1, 1)
    } else { Player.MessageBox('玩家名字不正确,或者不在线'); }

}
export function InPutString22(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //格式：玩家名字-职业  转职
    const str: string = Args.Str[0]
    const list: string[] = str.split('-')   //字符串转数字 以,分割  也就是说[数组1,数组2,,数组3,.......]
    let PlayerName = list[0] //数组1 也就是从0开始
    let 职业 = list[1]
    let a: TPlayObject = GameLib.FindPlayer(PlayerName);
}

export function InPutString21(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //格式: 玩家名字-属性-数量  刷属性
    const str: string = Args.Str[0];
    const list: string[] = str.split('-');   // 格式：玩家名字-数量-类型

    // 参数校验
    if (list.length < 3) {
        Player.MessageBox('输入格式错误，请使用：玩家名字-数量-类型\\（1=积分，2=元宝，3=回收比例，4=爆率，5=等级，6=挑战倍数）');
        return;
    }

    const PlayerName = list[0].trim();
    const 数量 = Number(list[1]);
    const 类型 = list[2].trim();

    // 数值校验
    if (isNaN(数量) || 数量 < 0) {
        Player.MessageBox('数量必须大于0');
        return;
    }

    const a: TPlayObject = GameLib.FindPlayer(PlayerName);
    if (!a) {
        Player.MessageBox(`玩家【${PlayerName}】不存在或不在线`);
        return;
    }

    switch (类型) {
        case '1': // 真实充值
            a.V.真实充值 = a.V.真实充值 + 数量;
            Player.MessageBox(`成功给玩家【${PlayerName}】增加真实充值 ${数量}`);
            a.MessageBox(`管理员 ${Player.Name} 给你增加了 ${数量} 真实充值`);
            break;

        case '2': // 元宝
            增加.元宝(a, 数量, `成功给玩家【${PlayerName}】增加元宝 ${数量}`);
            a.MessageBox(`管理员 ${Player.Name} 给你增加了 ${数量} 元宝`);
            break;

        case '3': // 回收比例
            a.V.赞助回收 = 数量
            Player.MessageBox(`成功为玩家【${PlayerName}】设置回收比例为 ${数量}`);
            a.MessageBox(`管理员 ${Player.Name} 给你设置了回收比例为 ${数量}`);
            break;

        case '4': // 爆率
            a.V.赞助爆率 = 数量
            Player.MessageBox(`成功为玩家【${PlayerName}】设置爆率为 ${数量}`);
            a.MessageBox(`管理员 ${Player.Name} 给你设置了爆率为 ${数量}`);
            break;

        case '5': // 等级
            a.SetLevel(数量);
            Player.MessageBox(`成功为玩家【${PlayerName}】设置等级为 ${数量}`);
            a.MessageBox(`管理员 ${Player.Name} 给你设置了等级为 ${数量}`);
            break;
        case '6': // 挑战
            a.V.最高挑战倍数 = 数量
            Player.MessageBox(`成功为玩家【${PlayerName}】设置挑战倍数为 ${数量}`);
            a.MessageBox(`管理员 ${Player.Name} 给你设置了挑战倍数为 ${数量}`);
            break;
        default:
            Player.MessageBox('类型错误，请输入1（积分）、2（元宝）、3（回收比例）、4（爆率）、5（等级）、6（挑战倍数）');
            return;
    }
}
export function InPutString20(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {  //格式：玩家名字-物品名字-数量   刷物品
    const str: string = Args.Str[0]
    const list: string[] = str.split('-')   //字符串转数字 以,分割  也就是说[数组1,数组2,,数组3,.......]
    let item: TUserItem
    let PlayerName = list[0] //数组1 也就是从0开始
    let 物品名字 = list[1]
    let 物品数量 = Number(list[2])
    let a: TPlayObject = GameLib.FindPlayer(PlayerName);
    if (a == null) { Player.MessageBox('玩家名字不正确!'); return }
    Npc.Give(a, 物品名字, 物品数量)
    if (item) {
        item.SetOutWay1(种族第一, 种族属性[random(种族属性.length)])
        item.SetOutWay2(种族第一, randomRange(1 + random(10), 1 + random(10)))
        Player.UpdateItem(item)
    }
    Player.MessageBox(`给玩家'${a.GetName()}'${物品数量}个${物品名字}`)
}
export function InPutString(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const str: string = Args.Str[0]
    const list: string[] = str.split('-')   //字符串转数字 以,分割  也就是说[数组1,数组2,,数组3,.......]
    let Magic: TUserMagic;
    let 技能名字 = list[0] //数组1 也就是从0开始
    let 技能等级 = Number(list[1])
    Magic = Player.FindSkill(技能名字);
    if (Magic) {
        Magic.Level = 技能等级;
        Player.UpdateMagic(Magic);
    } else { Player.MessageBox(`${技能名字}不正确!`) }

}
export function 我要秒怪(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Player.V.我要秒怪 == false) {
        Player.V.我要秒怪 = true
        Player.MessageBox('秒怪已经开启,打怪就是秒')
    } else {
        Player.V.我要秒怪 = false
        Player.MessageBox('秒怪已经恢复')
    }
}
export function 从新刷怪(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    GameLib.R[Player.GetMapName()] = false
    Player.MessageBox('从新刷怪完毕')
    // Player.AddSkill('嘲讽吸怪')
}
export function 刷练功师(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 喽啰: TActorList
    let Actor: TActor
    喽啰 = GameLib.MonGen(Player.GetMapName(), '弓箭护卫', 1, Player.GetMapX(), Player.GetMapY(), 0, 0, 0, 1, true, true, true, true)
    Actor = 喽啰.Actor(0)
    Actor.SetMaxHP(9999999999999)
    Actor.SetHP(Actor.GetMaxHP())
    Actor.SetDCMin(1)
    Actor.SetDCMax(1)
    Actor.SetACMin(1)
    Actor.SetACMax(1)
    Actor.SetTriggerSelectMagicBeforeAttack(true)
    // let 宝宝血量 = '200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000200020002000'
    let 宝宝血量原始 = '5e200'
    let 宝宝血量 = 转大数值(宝宝血量原始)  // 将 '5e200' 转换为 '5' + '0'.repeat(200)
    let 宝宝攻击小 = '1000'
    let 宝宝攻击大 = '1000'
    let 宝宝防御小 = '1'
    let 宝宝防御大 = '10'
    Actor.SetSVar(原始名字, '弓箭护卫')
    Actor.SetSVar(92, String(宝宝血量))
    // Actor.SetSVar(91, Actor.GetSVar(92))
    Actor.SetSVar(91, 宝宝血量)
    // let 攻击计算 = 整数相乘(整数相乘(整数相乘(怪怪星星.toString(), 攻击大), 乘以倍数.toString()), 循环.翻倍.toString())
    Actor.SetSVar(93, String(宝宝攻击小))
    Actor.SetSVar(94, String(宝宝攻击大))
    // let 物理防御 = 整数相乘(整数相乘(整数相乘(怪怪星星.toString(), 怪物防御), 乘以倍数.toString()), 循环.翻倍.toString())
    Actor.SetSVar(95, String(宝宝防御小))
    Actor.SetSVar(96, String(宝宝防御大))
    let 新字符 = { 怪物名字: Actor.Name, 怪物等级: String(Actor.Level), 血量: 宝宝血量, 攻击: 宝宝攻击大, 防御: 宝宝防御大, 怪物颜色: '', 怪物标志: 1, }
    GameLib.R.怪物信息 = GameLib.R.怪物信息 || {};
    GameLib.R.怪物信息[`${Actor.Handle}`] = JSON.stringify(新字符)
    Actor.SetSVar(98, JSON.stringify(新字符))
    血量显示(Actor)

}
export function 领取货币(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Npc.Give(Player, '书页', 10)
    Player.SetGameGold(Player.GetGameGold() + 6000)
    Player.SetGamePoint(Player.GetGamePoint() + 60000)
    Player.GoldChanged()
    // Player.SetClientSpeed(5)
    weaponCaption(Npc, Player, Args)

}

export function weaponCaption(Npc: TNormNpc, Player: TPlayObject, Args: TArgs) {
    if (Player.Weapon) {
        Player.Weapon.SetCustomCaption(0, "标题零")
        Player.Weapon.SetCustomCaption(1, "标题壹")
        Player.Weapon.SetCustomCaption(2, "标题贰")

        Player.Weapon.SetCustomText(0, "内容零")
        Player.Weapon.SetCustomText(1, "内容壹")
        Player.Weapon.SetCustomText(2, "内容贰")

        Player.Weapon.SetOutWay1(0, 888)

        Player.UpdateItem(Player.Weapon)
    } else {
        Player.MessageBox("你当前没有穿戴武器")
    }
}
export function 来个生肖(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 基本属性_职业 = []
    let 基本属性_数值 = []
    let 生肖基础属性 = []
    let 装备属性记录 = {
        职业属性_职业: 基本属性_职业,
        职业属性_属性: 基本属性_数值,
        职业属性_生肖: 生肖基础属性,
    }
    let item: TUserItem
    item = Player.GiveItem('新手龙')

    // let 数值 = '99999999999999999999999999999999999999999999999999999999999999'
    let 数值 = '1000'
    let OUT = 30 // 万箭齐发倍功 228   伤害 432   

    let 前端数字 = 数字转单位2((数值))
    let 后端单位 = 数字转单位3((数值))
    // let 位数 = 数值.length
    // let 位数2 = 数值2.length
    // let 新数值 = 装备数值简写(数值) + ' {S=251;C=251;T=' + 位数 + '}'
    // let 新数值2 = 装备数值简写(数值2) + ' {S=' + 位数2 + ';C=251}'

    // item.SetCustomText(0, 前端数字)
    // item.SetCustomText(1, 后端单位)

    item.SetOutWay1(40, OUT)
    item.SetOutWay2(40, Number(前端数字))
    item.SetOutWay3(40, Number(后端单位))
    item.SetOutWay1(39, 31)
    item.SetOutWay2(39, Number(前端数字))
    item.SetOutWay3(39, Number(后端单位))
    // item.SetOutWay4(40, Number(位数))
    // item.SetCustomText(1, 新数值)
    // // item.SetCustomText(1, 位数.toString())
    // item.SetOutWay1(39, OUT + 1)
    // item.SetCustomText(0, 新数值2)

    基本属性_职业.push(OUT)
    基本属性_数值.push(数值)

    item.SetCustomDesc(JSON.stringify(装备属性记录))
    Player.UpdateItem(item)

    // let item1 = Player.GiveItem('经验勋章')
// item1.SetOutWay1(0,1)
// item1.SetOutWay2(0,0)
// item1.SetOutWay3(0,100)
// 
// Player.UpdateItem(item1)
// 
    console.log(`Player.R.万箭齐发伤害:${Player.R.万箭齐发伤害}`)
}
export function 地图(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    switch (Args.Int[0]) {
        case 1: GameLib.ClearMapMon(Player.GetMapName()); break
        case 2: 按分钟检测(Player); break
    }
}
export function 刷稻草人(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    GameLib.MonGen(Player.Map.MapName, '稻草人', 1, 106, 97,  0, 0, 0, 1, true, true, true, true)
}
export function 传送(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Args.Str[0] == '边界村') {
        Player.MapMove('边界村', 69, 119)
    } else {
        Player.RandomMove(Args.Str[0])
    }

}

export function 召唤(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let Actor: TActor
    Player.KillSlave('')
    let List = GameLib.MonGen(Player.Map.MapName, '沃玛战士', 1, Player.MapX, Player.MapY, 0, 0)
    Actor = List.Actor(0)
    Actor.SetMaxHP(100)
    Actor.SetHP(Actor.GetMaxHP())
    Actor.SetViewRange(15)
    Actor.SetMaster(Player)
    Actor.SetMasterRoyaltyTick(108000000)
    Actor.SetThroughHuman(true)
    Actor.SetThroughMonster(true)
    Actor.SetDCMin(10)
    Actor.SetDCMax(10)
    Actor.SetAttackSpeed(300)
    Actor.SetWalkSpeed(300)
}
export function 刷怪(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    实时扣血(Player, Player, js_number(Player.GetSVar(91), `0.3`, 3))
}
const 种族属性 = [350, 351, 352]
const 拆分值 = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
export function 来个装备(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let item: TUserItem
    item = Player.GiveItem('青铜戒指')
    if (item) {
        item.Rename(item.GetName() + '[传承]')
        item.SetOutWay1(种族第一, 种族属性[random(种族属性.length)])
        item.SetOutWay2(种族第一, randomRange(1 + random(10), 1 + random(10)))
        // item.SetOutWay1(种族第一,350)
        // item.SetOutWay2(种族第一,78)

        // item.SetOutWay1(种族第二,351)
        // item.SetOutWay2(种族第二,45)

        // item.SetOutWay1(种族第三,352)
        // item.SetOutWay2(种族第三,209)
        // item.SetOutWay1(2, 37)
        // item.SetOutWay2(2, 1000)
        // item.SetOutWay1(3,51)
        // item.SetOutWay2(3,5)
        // item.Rename('猎人·' + item.GetName() + '[底材]')
        // item.Rename('猎人·' + '粗糙' + item.GetName() + '·[劣质]')
        Player.UpdateItem(item)
    }
}
export function 清空背包(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let item: TUserItem
    for (let I = Player.GetItemSize() - 1; I >= 0; I--) {
        item = Player.GetBagItem(I);
        if (item.GetName() != '回城石' && item.GetName() != '随机传送石') {
            // Npc.Take(Player, item.GetName())
            Player.DeleteItem(item)
        }
    }
    // Npc.Give(Player, '回城石', 1)
    // Npc.Give(Player, '随机传送石', 1)
}
export function 加满(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    实时回血(Player, Player.GetSVar(92))
}
export function 清空(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.SetSVar(91, '1')
    // 实时扣血(Player,Player,Decimal.mul(Player.GetSVar(92),1))
    血量显示(Player)
    // console.log(Decimal.mul(Player.GetSVar(91), 99).div(100))
    // 实时扣血(Player, Player, Decimal.mul(Player.GetSVar(91), 99).div(100))
    // console.log(Player.GetSVar(91).toString())
    // console.log(Decimal.mul(Player.GetSVar(91), 99).div(100).toString())
    // console.log(Decimal.div(Player.GetSVar(91), 100).toString())
}
export function 宝宝群雷关闭(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.R.宝宝释放群雷 = false
}
export function 猎人宝宝群攻关闭(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.R.猎人宝宝释放群攻 = false
    Player.KillSlave('')
}
export function 罗汉金刚护体关闭(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.R.罗汉技能伤害 = false
}
export function 罗汉无敌关闭(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.SetSuperManMode(false)
}

const 怪物颜色A = [
    { 怪物颜色: 怪物颜色.人形红色, 怪物名字: '人形红色' },
    { 怪物颜色: 怪物颜色.头领BOSS蓝, 怪物名字: '头领BOSS蓝' },
    { 怪物颜色: 怪物颜色.弱小小怪白, 怪物名字: '弱小小怪白' },
    { 怪物颜色: 怪物颜色.洪荒BOSS黄, 怪物名字: '洪荒BOSS黄' },
    { 怪物颜色: 怪物颜色.深渊BOSS浅绿, 怪物名字: '深渊BOSS浅绿' },
    { 怪物颜色: 怪物颜色.灭世BOSS橙, 怪物名字: '灭世BOSS橙' },
    { 怪物颜色: 怪物颜色.精英小怪绿, 怪物名字: '精英小怪绿' },
    { 怪物颜色: 怪物颜色.苍穹BOSS紫, 怪物名字: '苍穹BOSS紫' },
    { 怪物颜色: 怪物颜色.远古BOSS粉, 怪物名字: '远古BOSS粉' },
]
