import { 仓库第一页, 关闭仓库 } from "../[玩家]/_P_Base";

//每页多少个物品
const ITEM_PAGE_MAX: number = 49;
//每行多少个格子
const MAX_COLUM: number= 7;
//每页多少行
const MAX_LINE: number = 7;
//格子大小
const BOX_SIZE_X: number = 38;
const BOX_SIZE_Y: number = 37;
//起始坐标
const STAR_X: number = 45;
const STAR_Y: number = 75;
//页数 0,1,2,3
let MAX_PAGE: number = 0;
//仓库总格子数  470
let TotalSzie:number = 0;

export function ViewItems(Npc: TNormNpc, Player: TPlayObject, Args: TArgs) {
//显示物品的字符串
let ItemsString = '';
//当前页显示的物品个数
let tempStar:number = 0;
let tempMax:number = 0;
//当前显示物品的坐标
let trueX:number = 0;
let trueY:number = 0;
//当前显示总数,第几个物品
let thisPageIndex:number=0;
let trueIndex:number=0;
//多少行余一个
let yushu:number=0;
let zhengshu:number=0;
//当前页
let tempP:number = Player.GetPVar(仓库第一页);

    Player.SetPVar(关闭仓库,1);//打开仓库
    
    //计算物品总页数
    MAX_PAGE = Math.ceil(Player.GetBigStorageItemsCount() / ITEM_PAGE_MAX);
    // console.log('MAX_PAGE= '+MAX_PAGE+" ,Player.GetBigStorageItemsCount() = "+Player.GetBigStorageItemsCount());
    //计算当前页开始位置   无限仓库 从 0 开始
    tempStar = ITEM_PAGE_MAX * (tempP - 1);
    
    //计算当前页最后一个物品位置
    //  49 X (1-1) = 0 第一页 -> 48
    //  49 X (2-1) = 49 第二页 -> 97
    //  49 X (3-1) = 98 第三页 -> 146   .....
    //    100 - 0 = 100   100-97 = 3
    if (Player.GetBigStorageItemsCount() - tempStar >= ITEM_PAGE_MAX) {
        // tempMax = tempStar + ITEM_PAGE_MAX;
        tempMax = ITEM_PAGE_MAX;
    }else{
        //  47 X (1-1) = 0 第一页
        //  tempMax = 31 -0 
        // tempMax = Player.GetBigStorageItemsCount();
        tempMax = Player.GetBigStorageItemsCount() - tempStar;
    }
    // console.log("tempStar:"+tempStar+", tempMax = "+tempMax);

    for(thisPageIndex = 0;thisPageIndex<tempMax;thisPageIndex++){
        
        trueIndex = tempStar + thisPageIndex
        
        let item = Player.GetBigStorageItem(trueIndex)
        
        yushu = thisPageIndex % MAX_COLUM
        zhengshu = Math.floor(thisPageIndex/MAX_COLUM) 

        trueX = STAR_X + yushu * BOX_SIZE_X
        trueY = STAR_Y + zhengshu * BOX_SIZE_Y
        // console.log("trueIndex="+trueIndex+",yushu="+yushu+",zhengshu="+zhengshu+",trueX="+trueX+",trueY="+trueY);

        ItemsString += `\\<{u=${item.MakeString()};x=${trueX};y=${trueY}}/@可视仓库.TakebacItem(${trueIndex})>`

    }
     ItemsString +=`\\{S=${Player.GetPVar(仓库第一页)}`+` / `+`${MAX_PAGE}`+` 页`+`;C=251;X=152;Y=370}`;
     
     Npc.SayEx(Player, "分页仓库", ItemsString);
     Player.OpenBag();

}

//取出
export function TakebacItem(Npc: TNormNpc, Player: TPlayObject, Args: TArgs): void {
    let ID = Args.Int[0]
    // console.log("Player.MaxBagSize="+Player.MaxBagSize+", Player.ItemSize="+Player.ItemSize)
    if(Player.GetMaxBagSize() < Player.GetItemSize()){
        Player.SendMessage('物品取出失败，背包满了',1)
    }else if(Player.TakebackBigStorageItem(ID)){
        ViewItems(Npc, Player, Args)
    }else{
        Player.SendMessage('物品取出失败，看看你背包、负重',1)
    }
    
}


//上一页
export function BeforePage(Npc: TNormNpc, Player: TPlayObject, Args: TArgs) {

    if(Player.GetPVar(仓库第一页)<=1){
        Player.SendMessage('当前已经是第一页了',1)
    }else{
        Player.SetPVar(仓库第一页,Player.GetPVar(仓库第一页)-1)
        ViewItems(Npc,Player,Args)
    }
}

//下一页
export function NextPage(Npc: TNormNpc, Player: TPlayObject, Args: TArgs) {

    if(Player.GetPVar(仓库第一页) >= MAX_PAGE){
        Player.SendMessage('当前已经是最后一页了',1)
    }else{
        
        Player.SetPVar(仓库第一页,Player.GetPVar(仓库第一页)+1)
        ViewItems(Npc,Player,Args)
    }
}

//关闭窗口
export function CloseViewItems(Npc: TNormNpc, Player: TPlayObject, Args: TArgs) {
    Player.CloseWindow("分页仓库")
    Player.SetPVar(关闭仓库,0);//关闭仓库
    Player.SetPVar(仓库第一页,1);//仓库第一页
    // console.log("关闭分页仓库- 298 = "+Player.GetPVar(关闭仓库)+", 297 = "+Player.GetPVar(仓库第一页));
}


export function Main(Npc: TNormNpc, Player: TPlayObject, Args: TArgs) {
    Player.SetPVar(关闭仓库,1);//打开仓库
    Player.SetPVar(仓库第一页,1);//仓库第一页
    ViewItems(Npc,Player,Args)
    // console.log("打开分页仓库- 298 = "+Player.GetPVar(关闭仓库)+", 297 = "+Player.GetPVar(仓库第一页));
}
