export function 鞭尸装备(Player: TPlayObject, Monster: string, Item: TUserItem): void {
    Randomize()
    if ([5, 6, 10, 11, 15, 16, 19, 20, 21, 22, 23, 24, 26, 27, 28, 68].indexOf(Item.StdMode) != -1) {
        let 神器几率 = random(2000 - Player.R.极品率), 品阶 = '', 职业技能条数 = 0, 随机额外属性 = 0, 额外属性的值 = 0, 职业 = '', 末尾 = '', 翻倍几率 = random(2000), 翻倍 = 2, 颜色 = 0, 种族属性加成, 星星数量 = 0
        let 末尾几率 = random(2000 - Player.R.极品率)
        let 白色条数 = 0
        switch (true) {
            case 神器几率 < 10: 品阶 = '神器'; 职业技能条数 = 5; break
            case 神器几率 >= 10 && 神器几率 <= 25: 品阶 = '旷世'; 职业技能条数 = 4; break
            case 神器几率 > 25 && 神器几率 <= 45: 品阶 = '精华'; 职业技能条数 = 3; break
            case 神器几率 > 45 && 神器几率 <= 75: 品阶 = '扩展'; 职业技能条数 = 2; break
            default: 品阶 = '粗糙'; 职业技能条数 = 1; break
        }
    }

}







