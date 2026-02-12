
export const Gender_Man = 0;
export const Web_PayPageURL = "http://asdfasd.jiujiangqingyin.com/game/group/613DA5F62D017B79"
export const Web_PayPageURL1 = "http://asdfasd.jiujiangqingyin.com/game/group/613DA5F62D017B79"
export const 攻略 = "www.52zycq.com/gl.txt"

export interface KeyData {[Key: string]: number}
export interface NumData {[Num: number]: number}


export function IIF(Condition: boolean , ValueT: string, ValueF: string) {
    if (Condition) {
        return ValueT;
    } else {
        return ValueF;
    }
}