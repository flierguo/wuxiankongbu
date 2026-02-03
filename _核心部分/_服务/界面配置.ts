
// ==================== 自动施法设置 ====================
const 本职业技能施法配置: { [job: number]: string[] } = {
    // 1: ['雷电术', '暴风雪'],
    // 2: ['灵魂火符', '飓风破'],
    // 4: ['精准箭术', '万箭齐发'],
}

const 新职业技能施法配置: { [职业: string]: string[] } = {
    '天枢': ['怒斩'],
    '血神': ['血气献祭', '血气燃烧', '血魔临身'],
    '暗影': ['暗影袭杀', '暗影剔骨', '暗影风暴', '暗影附体'],
    '烈焰': ['火焰追踪', '烈焰护甲'],
    '正义': ['圣光'],
    '不动': ['如山', '人王盾', '金刚掌'],
}

export function 自动设置(Npc: TNormNpc, Player: TPlayObject): void {
    const 基础技能 = 本职业技能施法配置[Player.Job] || []
    const 新职业技能 = 新职业技能施法配置[Player.V.职业] || []
    const 全部技能 = [...基础技能, ...新职业技能]

    let str = `{S=自动施法设置;C=251;X=150;Y=5}\n{S=勾选后技能将自动释放,光环类技能需手动开启;C=154;X=15;Y=30}\n\n`
    let y = 50

    for (let i = 0; i < 全部技能.length; i++) {
        const 技能名 = 全部技能[i]
        const x = 15 + (i % 5) * 100
        const 当前Y = y + Math.floor(i / 5) * 35
        const 变量名 = `自动_${技能名}`
        const 图标 = Player.V[变量名] ? '31' : '30'
        str += `<{I=${图标};F=装备图标.DATA;X=${x};Y=${当前Y}}/@界面配置.勾选技能(${变量名})>{S=${技能名};C=9;OX=3;Y=${当前Y}}\n`
    }

    Npc.SayEx(Player, 'NPC保护', str)
}

export function 勾选技能(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 变量名 = Args.Str[0]
    Player.V[变量名] = !Player.V[变量名]
    const 技能名 = 变量名.replace('自动_', '')
    Player.SendMessage(`${技能名}自动施法已${Player.V[变量名] ? '开启' : '关闭'}`, 1)
    自动设置(Npc, Player)
}

export function 提示设置(Npc: TNormNpc, Player: TPlayObject): void {
    const 提示列表 = ['伤害提示', '护盾提示', '掉落提示', '鞭尸提示', '回收屏蔽']
    let str = `{S=提示设置;C=251;X=175;Y=5}\n{S=取消勾选后将不再提示;C=154;X=15;Y=30}\n\n`
    let y = 70

    for (let i = 0; i < 提示列表.length; i++) {
        const 提示名 = 提示列表[i]
        const x = 15 + (i % 4) * 100
        const 当前Y = y + Math.floor(i / 4) * 35
        const 图标 = Player.V[提示名] ? '31' : '30'
        str += `<{I=${图标};F=装备图标.DATA;X=${x};Y=${当前Y}}/@界面配置.勾选提示(${提示名})>{S=${提示名};C=9;OX=3;Y=${当前Y}}\n`
    }

    Npc.SayEx(Player, 'NPC小窗口', str)
}

export function 勾选提示(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    const 变量名 = Args.Str[0]
    Player.V[变量名] = !Player.V[变量名]
    Player.SendMessage(`${变量名}已${Player.V[变量名] ? '开启' : '关闭'}`, 1)
    提示设置(Npc, Player)
}


export function 保护设置(Npc: TNormNpc, Player: TPlayObject): void {
    let S = `\\\\\\
    <{I=$血量保护$;F=装备图标.DATA;X=15;Y=80}/@界面配置.勾选(血量保护)> {S=设置血量保护:;X=45;Y=80;HINT=血量保护会恢复1%的生命值} {S=HP保护值: ${Player.V.血量保护百分比}%;C=224;X=150;Y=80}\\
     {S=保护间隔: ${Player.V.血量保护间隔}秒;C=149;X=150;Y=115}\\
     <{I=$随机保护$;F=装备图标.DATA;X=15;Y=160}/@界面配置.勾选(随机保护)> {S=设置随机保护:;X=45;Y=160;HINT=周围有玩家时无效!} {S=HP保护值: ${Player.V.随机保护百分比}%;C=224;X=150;Y=160}\\
     {S=保护间隔: ${Player.V.随机保护间隔}秒;C=149;X=150;Y=195}\\
     <{I=$自动随机$;F=装备图标.DATA;X=15;Y=238}/@界面配置.勾选(自动随机)> {S=自动间隔随机:;X=45;Y=238;HINT=开启挂机后生效} {S=间隔时间: ${Player.V.随机读秒}秒;C=191;X=150;Y=238}\\

     {S=勾选后技能将自动释放,光环类技能需手动开启;C=154;X=15;Y=25}
    `
    const 基础技能 = 本职业技能施法配置[Player.Job] || []
    const 新职业技能 = 新职业技能施法配置[Player.V.职业] || []
    const 全部技能 = [...基础技能, ...新职业技能]

    // let str = `{S=自动施法设置;C=251;X=150;Y=5}\n\n\n`
    let y = 50

    for (let i = 0; i < 全部技能.length; i++) {
        const 技能名 = 全部技能[i]
        const x = 15 + (i % 5) * 100
        const 当前Y = y + Math.floor(i / 5) * 35
        const 变量名 = `自动_${技能名}`
        const 图标 = Player.V[变量名] ? '31' : '30'
        S += `<{I=${图标};F=装备图标.DATA;X=${x};Y=${当前Y}}/@界面配置.勾选技能(${变量名})>{S=${技能名};C=9;OX=3;Y=${当前Y}}\n`
    }

    let M = '';
    M = S;
    Player.V.血量保护 ? M = ReplaceStr(M, '$血量保护$', '31') : M = ReplaceStr(M, '$血量保护$', '30')
    Player.V.随机保护 ? M = ReplaceStr(M, '$随机保护$', '31') : M = ReplaceStr(M, '$随机保护$', '30')
    Player.V.自动随机 ? M = ReplaceStr(M, '$自动随机$', '31') : M = ReplaceStr(M, '$自动随机$', '30')
    Npc.SayEx(Player, 'NPC保护', M)
}

export function 勾选(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 种类 = Args.Str[0]
    Player.V[种类] ? Player.V[种类] = false : Player.V[种类] = true
    保护设置(Npc, Player)
}


export function 保护1(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 血量保护百分比 = Args.Int[0]
    if (血量保护百分比 < 1 || 血量保护百分比 > 99) { Player.MessageBox('请输入1-99的数值'); return }
    Player.V.血量保护百分比 = 血量保护百分比
    保护设置(Npc, Player)
}

export function 保护2(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 血量保护间隔 = Args.Int[1]
    if (血量保护间隔 < 5 || 血量保护间隔 > 600) { Player.MessageBox('请输入5-600的数值'); return }
    Player.V.血量保护间隔 = 血量保护间隔
    保护设置(Npc, Player)
}

export function 保护3(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 随机保护百分比 = Args.Int[2]
    if (随机保护百分比 < 1 || 随机保护百分比 > 99) { Player.MessageBox('请输入1-99的数值'); return }
    Player.V.随机保护百分比 = 随机保护百分比
    保护设置(Npc, Player)
}

export function 保护4(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 随机保护间隔 = Args.Int[3]
    if (随机保护间隔 < 1 || 随机保护间隔 > 6000) { Player.MessageBox('请输入1-5999的数值'); return }
    Player.V.随机保护间隔 = 随机保护间隔
    保护设置(Npc, Player)
}

export function 保护5(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let 自动间隔时间 = Args.Int[4]
    if (自动间隔时间 < 1 || 自动间隔时间 > 6000) { Player.MessageBox('请输入1-5999的数值'); return }
    Player.V.随机读秒 = 自动间隔时间
    保护设置(Npc, Player)
}