
console.log("地图事件绑定开始")
GameLib.onCheckEnterMap = (Player: TPlayObject, SourceEnvir: TEnvirnoment, DestEnvir: TEnvirnoment, SourceX: number, SourceY: number, DestX: number, DestY: number, Accept: boolean): boolean => {

    return Accept
}
GameLib.onPlayerEnterMap = (Player: TPlayObject, SourceEnvir: TEnvirnoment, DestEnvir: TEnvirnoment, SourceX: number, SourceY: number, DestX: number, DestY: number): void=> {

}

GameLib.onDeleteRoute = (RouteName: string) :void => {

}

console.log("地图事件绑定完成")