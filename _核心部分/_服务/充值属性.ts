import { 装备属性统计 } from "../../_核心部分/_装备/属性统计";
import { 插入, 创建表, 获取当前时间 } from "./_数据库";
import { 职业第一条, 职业魔次分割 } from "../基础常量";

// 安全初始化通区路径
if (typeof GameLib !== 'undefined') {
    GameLib.R = GameLib.R || {};
    GameLib.R.通区路径 = 'D:\\\\无限恐怖\\\\充值\\\\';
}

// 充值表建表SQL
const 充值表SQL = `
CREATE TABLE IF NOT EXISTS 无限恐怖充值 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    日期 DATETIME NOT NULL,
    服务器 VARCHAR(100) NOT NULL,
    账号 VARCHAR(100) NOT NULL,
    角色 VARCHAR(100) NOT NULL,
    真实充值 DECIMAL(10,2) NOT NULL DEFAULT 0,
    总金额 DECIMAL(10,2) NOT NULL DEFAULT 0,
    累计领取次数 INT NOT NULL DEFAULT 0,
    创建时间 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_账号 (账号),
    INDEX idx_角色 (角色)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

// 初始化标记
let 表已初始化 = false;

/**
 * 礼包配置表
 * 额度 | 爆率% | 回收% | 极品掉落% | 主神点(额度*10) | 鞭尸次数 | 特殊功能
 */
const 礼包配置 = [
    { 额度: 10, 爆率: 0, 回收: 0, 极品: 0, 鞭尸: 0, 特殊: '自动回收 + 材料存仓 + 强力戒指' },
    { 额度: 50, 爆率: 30, 回收: 30, 极品: 10, 鞭尸: 0, 特殊: '' },
    { 额度: 100, 爆率: 50, 回收: 50, 极品: 20, 鞭尸: 0, 特殊: '' },
    { 额度: 200, 爆率: 100, 回收: 80, 极品: 40, 鞭尸: 0, 特殊: '' },
    { 额度: 300, 爆率: 150, 回收: 100, 极品: 70, 鞭尸: 0, 特殊: '' },
    { 额度: 400, 爆率: 200, 回收: 150, 极品: 100, 鞭尸: 0, 特殊: '' },
    { 额度: 500, 爆率: 250, 回收: 250, 极品: 120, 鞭尸: 0, 特殊: '' },
    { 额度: 600, 爆率: 300, 回收: 300, 极品: 140, 鞭尸: 1, 特殊: '' },
    { 额度: 700, 爆率: 350, 回收: 350, 极品: 160, 鞭尸: 1, 特殊: '' },
    { 额度: 800, 爆率: 400, 回收: 400, 极品: 180, 鞭尸: 2, 特殊: '' },
    { 额度: 900, 爆率: 450, 回收: 450, 极品: 180, 鞭尸: 2, 特殊: '' },
    { 额度: 1000, 爆率: 500, 回收: 500, 极品: 180, 鞭尸: 3, 特殊: '' },
];

/**
 * 记录充值数据（文件日志 + 数据库）
 */
export function 记录充值数据(Player: TPlayObject, 主神点: number, 真实充值: number): void {
    const 当前时间 = 获取当前时间();

    // 文件日志
    const 日志内容 = `服务器：${GameLib.GetServerName()}, 主神点:${主神点},  充值:${真实充值} 时间:${当前时间} 账号：${Player.GetAccount()} 角色: ${Player.GetName()} 总金额: ${Player.V.真实充值}`;
    Player.AddTextList(GameLib.R.通区路径 + '已领充值.txt', 日志内容);

    // 数据库记录
    if (!表已初始化) {
        创建表(充值表SQL, () => { 表已初始化 = true; });
    }

    插入('无限恐怖充值', {
        日期: 当前时间,
        服务器: GameLib.GetServerName(),
        账号: Player.GetAccount(),
        角色: Player.GetName(),
        真实充值: 真实充值,
        总金额: Player.V.真实充值,
        累计领取次数: Player.V.累计领取次数
    });
}

export let G_GoldLocked: boolean = false;
export function setG_GoldLocked(val: boolean) {
    G_GoldLocked = val;
}

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    Player.V.真实充值 = 10
    // 初始化领取状态
    for (const 配置 of 礼包配置) {
        Player.V[`领取${配置.额度}`] ??= false;
    }

    // 498*414 窗口下的栅格化布局，保证各列对齐
    const 列X_额度 = 32;
    const 列X_福利 = 120;
    const 列X_主神点 = 350;
    const 列X_按钮 = 430;
    const 起始Y = 40;
    const 行高 = 24;

    let Str = ``;
    Str += `{S=当前充值金额:${Player.V.真实充值 || 0}R;C=150;X=${列X_额度};Y=10}\\\\`;

    for (let i = 0; i < 礼包配置.length; i++) {
        const 配置 = 礼包配置[i];
        const 主神点 = 配置.额度 * 5;
        const 已领取 = Player.V[`领取${配置.额度}`] === true;
        const 行Y = 起始Y + i * 行高;

        const 状态文字 = 已领取
            ? `{S=已领取;C=249;X=${列X_按钮};Y=${行Y}}`
            : `<{S=领取;C=250;X=${列X_按钮};Y=${行Y}}/@领取礼包(${i})>`;

        let 福利描述 = '';
        if (配置.特殊) {
            福利描述 = `${配置.特殊}`;
        } else {
            福利描述 = `爆率+${配置.爆率}% 回收+${配置.回收}% 极品+${配置.极品}%`;
            if (配置.鞭尸 > 0) {
                福利描述 += ` 鞭尸+${配置.鞭尸}`;
            }
        }

        Str += `{S=充值满${配置.额度}R;C=150;X=${列X_额度};Y=${行Y}}`;
        Str += `{S=${福利描述};C=146;X=${列X_福利};Y=${行Y}}`;
        Str += `{S=+${主神点}主神点;C=161;X=${列X_主神点};Y=${行Y}}`;
        Str += `${状态文字}\\\\`;
    }

    const 标识Y = 起始Y + 礼包配置.length * 行高 + 12;
    Str += `\\\\{S=充值比例: 1R = 1充值金额;C=224;X=${列X_额度};Y=${标识Y}}`;
    Npc.SayEx(Player, '赞助礼包', Str);
}

export function 领取礼包(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 索引 = Args.Int[0];
    if (索引 < 0 || 索引 >= 礼包配置.length) {
        Player.MessageBox('无效的礼包！');
        return;
    }

    const 配置 = 礼包配置[索引];
    const 额度 = 配置.额度;
    const 领取标记 = `领取${额度}`;

    // 检查是否已领取
    if (Player.V[领取标记] === true) {
        Player.MessageBox('你已经领取过此礼包了！');
        return;
    }

    // 检查充值金额
    if ((Player.V.真实充值 || 0) < 额度) {
        Player.MessageBox(`你的真实充值未达到${额度}R，不能领取！`);
        return;
    }

    // 标记已领取
    Player.V[领取标记] = true;

    // 发放主神点（额度 * 10）
    const 主神点 = 额度 * 10;
    Player.SetGamePoint(Player.GetGamePoint() + 主神点);

    // 发放属性加成
    if (配置.特殊) {

        // 发放福利戒指（牛角戒指改名，限时3天，全体魔次+100）
        const 福利戒指 = Player.GiveItem('牛角戒指', false);
        if (福利戒指) {
            福利戒指.Rename('[福利]戒指');
            福利戒指.SetBind(true);
            福利戒指.SetNeverDrop(true)
            福利戒指.State.SetNoDrop(true)
            福利戒指.MaxDate = DateUtils.IncDay(DateUtils.Now(), 3); // 限时3天

            // 设置全体魔次属性 - 使用outway让客户端显示
            const 属性ID = 10020; // 全体魔次ID
            const 属性值 = '20';
            福利戒指.SetOutWay1(职业魔次分割, 2);  // 索引10，属性ID
            福利戒指.SetOutWay2(职业魔次分割, 1);     // 前端显示数值


            福利戒指.SetOutWay1(职业第一条, 属性ID);  // 索引10，属性ID
            福利戒指.SetOutWay2(职业第一条, 20);     // 前端显示数值

            福利戒指.SetNeedLevel(1)
            // 保存属性记录到CustomDesc
            const 装备属性记录 = {
                职业属性_职业: [属性ID],
                职业属性_属性: [属性值]
            };
            福利戒指.SetCustomDesc(JSON.stringify(装备属性记录));
            Player.UpdateItem(福利戒指);
        }

        Player.MessageBox(`恭喜领取${额度}R礼包！获得：自动回收、材料存仓功能 + [福利]戒指(3天) + ${主神点}主神点`);
    } else {
        // 赞助属性（当前档位的值）
        Player.V.赞助爆率 = 配置.爆率;
        Player.V.赞助回收 = 配置.回收;
        Player.V.赞助极品 = 配置.极品;
        Player.V.赞助鞭尸 = 配置.鞭尸;

        let 提示 = `恭喜领取${额度}R礼包！获得：爆率+${配置.爆率}% 回收+${配置.回收}% 极品+${配置.极品}%`;
        if (配置.鞭尸 > 0) {
            提示 += ` 鞭尸+${配置.鞭尸}`;
        }
        提示 += ` + ${主神点}主神点`;
        Player.MessageBox(提示);
    }

    // 刷新属性
    装备属性统计(Player);

    // 全服广播
    GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了'{S=${额度}R礼包;C=250}'！`);
    GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了'{S=${额度}R礼包;C=250}'！`);
    GameLib.BroadcastCenterMessage(`恭喜玩家{S=${Player.GetName()};C=250}领取了'{S=${额度}R礼包;C=250}'！`);
    // 刷新界面
    Main(Npc, Player, Args);
}

export function CheckAccount(TxtFile: string, Account: string, Rate: number): number {
    let LS: TStringList;
    let ASum = 0;
    let TAccountList: TStringList;
    let Result: number = 0;

    if (GameLib.FileExists(TxtFile)) {
        LS = GameLib.CreateStringList();
        TAccountList = GameLib.CreateStringList();
        ASum = 0;
        try {
            LS.LoadFromFile(TxtFile);
            for (let I = 0; I <= LS.Count - 1; I++) {
                if ((LS.GetStrings(I).length > 0) && (LS.GetStrings(I) == Account)) {
                    ASum++;
                } else if (LS.GetStrings(I).length > 0) {
                    TAccountList.Add(LS.GetStrings(I));
                }
            }
            if (ASum > 0) {
                TAccountList.SaveToFile(TxtFile);
            }
            Result = ASum * Rate;
        } finally {
        }
    }
    return Result;
}

export function DoObtainGold(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 路径 = GameLib.R.通区路径 + GameLib.GetServerName() + '\\%d.txt';
    let 主神点 = 0;
    let 数量 = 0;
    let 真实充值 = 0;
    const FList = [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 20, 30, 40, 50, 60, 70, 80, 90,
        100, 200, 300, 400, 500, 600, 700, 800, 900,
        1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000,
        10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000,
        100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000,
        1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000,
    ];

    if (G_GoldLocked) {
        Player.SendCenterMessage('我正在为其他玩家发放赞助回馈，请稍后。', 0);
        return;
    }

    setG_GoldLocked(true);
    try {
        for (let I = 0; I <= FList.length - 1; I++) {
            数量 = 数量 + CheckAccount(format(路径, [FList[I]]), Player.Account, FList[I]);
        }
        if (数量 > 0) {
            Player.V.累计领取次数 ??= 0;
            主神点 = Math.floor(数量 * 5); // 额度 * 10 的主神点
            真实充值 = Math.floor(数量 * 1);
            Player.V.真实充值 = (Player.V.真实充值 || 0) + 真实充值;
            Player.SetGamePoint(Player.GetGamePoint() + 主神点); // 发放主神点
            Player.V.累计充值 = (Player.V.累计充值 || 0) + 真实充值;
            Player.GoldChanged();
            Player.SendCenterMessage(`领取成功，一共领取:${主神点}主神点,${真实充值}点真实充值...`, 0);
            Player.V.累计领取次数 = Player.V.累计领取次数 + 1;

            // 记录充值数据
            记录充值数据(Player, 主神点,  真实充值);

            GameLib.BroadcastSay(`【系统】:玩家${Player.GetName()}领取了${主神点}主神点,${真实充值}点真实充值`, 249, 255);
            Npc.CloseDialog(Player);
        } else {
            Player.SendCenterMessage('领取失败，暂时没有你的充值信息。', 0);
        }
    } finally {
        setG_GoldLocked(false);
    }
    Main(Npc, Player, null);
}
