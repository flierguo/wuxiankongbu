/*高级\无限 - 仓库*/
const TKEY_OPEN = 'T_OPEN_PAGE_INDEX'
const TakeItemPeriodKey = 'TakeItemPeriodKey'
let RowSize: number, PageSize: number;

export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    if (Args.Count == 0) {
        Show(Npc, Player, 1, 0)
    } else {
        Show(Npc, Player, Math.ceil(Player.BigStorageItemsCount / PageSize), 1)
    }
}
export function UISave(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
}
export function UIGet(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
}
/*保存装备到仓库*/
export function SaveItem(Npc: TNormNpc, Player: TPlayObject, Item: TUserItem): boolean {
    let StorageCount = 0
    let Result: boolean
    Result = false
    if (Item.State.NoStore) {
        Player.SendCenterMessage('物品不可存仓。', 0)
        return Result
    }
    StorageCount = Math.min(660, 60 + Player.Level * 3)
    if ((Player.BigStorageItemsCount < StorageCount)) {
        Player.AddItemToBigStorage(Item)
        Show(Npc, Player, Math.ceil(Player.BigStorageItemsCount / PageSize), 1)
        //Math.ceil(Math.floor(Player.BigStorageItemsCount / PageSize))
        Result = true
    } else {
        Player.SendCenterMessage('高级仓库已经存放满了。', 0)
    }
    return Result
}
/*显示*/
export function Show(Npc: TNormNpc, Player: TPlayObject, PageIndex: number, IsUpdate: number): void {
    let RowIndex = 0
    let Item: TUserItem
    let Msg = ""
    let StorageCount = 0
    Msg = ' {S=保存物品：;X=140;Y=340;C=250;}{S=ALT按住，点击物品存储;X=196;Y=340;} '
        + ' {S=取出物品：;X=140;Y=360;C=250;}{S=右边方格，点击物品取出;X=196;Y=360;} '
        + ' {S=扩充仓库：;X=140;Y=380;C=250;}{S=等级越高仓库容量越大;X=196;Y=380;} '
        + ' {S=当前仓库容量：$Count$;X=140;Y=400;}\\'
    RowIndex = 0
    for (let I = Math.floor((PageIndex - 1) * PageSize); I <= Player.BigStorageItemsCount; I++) {
        Item = Player.GetBigStorageItem(I)
        if (Item != null) {
            Msg = Msg + format('<{U=%s;X=%d;Y=%d;}/@_P_CanSeeStorage.Take(%d)>', [Item.MakeString(), 45 + ((RowIndex % 7) * 37), 75 + 37 * (Math.floor(RowIndex / RowSize)), I])
        }
        RowIndex = RowIndex + 1
        if (RowIndex == PageSize) { break }
    }
    StorageCount = Math.min(660, 60 + Player.Level * 3)
    Msg = Msg.replace('$Count$', StorageCount.toString())
    Npc.SayEx(Player, '仓库对话框', Msg)
    Player.VarInteger(TKEY_OPEN).AsInteger = PageIndex
}
/*下一页*/
export function Next(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let PageCount = 0
    PageCount = Math.ceil(Player.BigStorageItemsCount / PageSize)
    if ((PageCount > 1) && (Player.VarInteger(TKEY_OPEN).AsInteger < PageCount)) {
        Show(Npc, Player, Player.VarInteger(TKEY_OPEN).AsInteger + 1, 1)
    }
}
/*上一页*/
export function Prev(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let PageCount = 0
    PageCount = Math.ceil(Player.BigStorageItemsCount / PageSize)
    if ((PageCount > 1) && (Player.VarInteger(TKEY_OPEN).AsInteger > 1)) {
        Show(Npc, Player, Player.VarInteger(TKEY_OPEN).AsInteger - 1, 1)
    }
}
/*拿回背包*/
export function Take(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let TakeSuccess = false
    let PageCount = 0
    let Item: TUserItem
    let CopyItem: TUserItem
    if (Player.VarString(TakeItemPeriodKey).AsString == '') {
        Player.VarDateTime(TakeItemPeriodKey).AsDateTime = DateUtils.Now()
    } else {
        if ((DateUtils.SecondSpan(DateUtils.Now(), Player.VarDateTime(TakeItemPeriodKey).AsDateTime) <= 1)) {
            Player.SendCenterMessage('你点击的太快了', 0)
            return
        }
    }
    Player.VarDateTime(TakeItemPeriodKey).AsDateTime = DateUtils.Now()
    if ((Player.MaxBagSize - 6) >= Player.ItemSize) {
        TakeSuccess = Player.TakebackBigStorageItem(Args.Int[0])
        if (TakeSuccess) {
            PageCount = Math.ceil(Player.BigStorageItemsCount / PageSize)
            if (Player.VarInteger(TKEY_OPEN).AsInteger > PageCount) {
                Show(Npc, Player, PageCount, 1)
            } else {
                Show(Npc, Player, Player.VarInteger(TKEY_OPEN).AsInteger, 1)
            }
        } else {
            Item = Player.GetBigStorageItem(Args.Int[0])
            if (Item != null) {
                CopyItem = Npc.GiveItem(Player, Item.Name)
                CopyItem.CopyFrom(Item)
                CopyItem.Rename(Item.DisplayName)
                if (Player.DeleteBigStorageItem1(Args.Int[0])) {
                    Player.UpdateItem(CopyItem)
                    PageCount = Math.ceil(Player.BigStorageItemsCount / PageSize)
                    if (Player.VarInteger(TKEY_OPEN).AsInteger > PageCount) {
                        Show(Npc, Player, PageCount, 1)
                    } else {
                        Show(Npc, Player, Player.VarInteger(TKEY_OPEN).AsInteger, 1)
                    }
                } else {
                    Npc.TakeItem(Player, CopyItem)
                }
            } else {
                Player.SendCenterMessage('物品不存在。', 0)
            }
        }
    } else {
        Player.SendCenterMessage('背包没有空位。', 0)
    }
}
function initialization() {
    RowSize = 7
    PageSize = 49
}
initialization()