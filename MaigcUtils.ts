
const GMagicIDCache = {} //脚本做一层 减少引擎调用
export function getMagicIDByName(magicName: string): number {

    let result = GMagicIDCache[magicName]

    if (isNaN(result)) {
        let id = GameLib.GetMagicIdByName(magicName)
        GMagicIDCache[magicName] = id;
        return id
    } else {
        return result
    }

}