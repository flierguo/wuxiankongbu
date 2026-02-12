import { NUMBER_UNIT } from "./大数值单位";

const MaxAccuracy = 13
//浮点数最大位数 
const MaxFloatLen = 300

export class Decimal {
    l: number

    static fromValue(v) {
        return new Decimal(v);
    }
    constructor(v: any) {
        if (v == null) {
            this.l = Number.NEGATIVE_INFINITY;
        } else if (v instanceof Decimal) {
            this.l = v.l;
        } else {
            let type = typeof v
            if (type == "string") {
                var findE = v.indexOf("e");
                if (findE == -1) {
                    let str = v
                    let len = 0
                    if (v.length > MaxFloatLen) {
                        str = v.substr(0, MaxFloatLen)
                        len = v.length - MaxFloatLen
                    }
                    this.l = Math.log10(str) + len;
                } else if (findE == 0) {
                    this.l = Number(v.slice(1, v.length));
                } else {
                    var split = [v.slice(0, findE), v.slice(findE + 1, v.length)];
                    if (split[0] == 1) this.l = Number(split[1]);
                    else this.l = Number(split[1]) + Math.log10(split[0]);
                }
            } else if (type == "number") {
                this.l = Math.log10(v);
            } else {
                this.l = Number.NEGATIVE_INFINITY;
            }
        }
    }

    static fromNumber(v): Decimal {
        var tmp = new Decimal(null);
        tmp.l = Math.log10(v);
        return tmp;
    }

    static fromString(v) {
        var tmp = new Decimal(null);
        var findE = v.indexOf("e");
        if (findE == -1) {
            tmp.l = Math.log10(v);
        } else if (findE == 0) {
            tmp.l = Number(v.slice(1, v.length));
        } else {
            var split = [v.slice(0, findE), v.slice(findE + 1, v.length)];
            if (split[0] == 1) tmp.l = Number(split[1]);
            else tmp.l = Math.log10(split[0]) + split[1];
        }
        return tmp;
    }

    //由log10的底数直接初始化 方便引擎储存
    static fromLog10(v: number): Decimal {
        var tmp = new Decimal(null);
        tmp.l = v
        return tmp;
    }

    /**
     * 由数值+单位初始化
     * @param v 数值
     * @param dw 单位
     */
    static fromNumberAndDw(v: number, dw: number): Decimal {
        var tmp: Decimal = Decimal.fromNumber(v)
        tmp.l += dw
        return tmp
    }

    toNumberAndDw(): number[] {
        if (this.l < -10) {
            return [0, 0]
        }
        else if (this.l < 1) {
            let num = this.toNumber()
            return [num, 0]
        }
        else {
            let dw = Math.floor(this.l)
            let sy = this.l - dw
            let num = Math.pow(10, sy)
            return [num, dw]
        }
    }

    static fromMantissaExponent(m, e) {
        var v = new Decimal(null);
        v.l = e + Math.log10(m);
        return v;
    }

    static fromMantissaExponent_noNormalize(m, e) {
        return Decimal.fromMantissaExponent(m, e);
    }

    static toString(v) {
        v = new Decimal(v);
        if (v.l == Number.NEGATIVE_INFINITY) return "0";
        if (v.l == Number.POSITIVE_INFINITY) {
            return "Infinity";
        }
        if (v.l >= 1e21 || v.l <= -1e21) {
            return "e" + v.l;
        }
        if (v.l >= 21 || v.l < -6) {
            var logInt = Math.floor(v.l);
            return Math.pow(10, v.l - logInt) + "e" + logInt;
        }
        return Math.pow(10, v.l).toString();
    }

    toString() {
        return Decimal.toString(this);
    }
    //转成补单位的string
    static format(v, fixed = 2) {
        v = new Decimal(v);
        if (v.l == Number.NEGATIVE_INFINITY) return "0";
        if (v.l == Number.POSITIVE_INFINITY) return "Infinity";
        if (v.e <= 4) return v.toFixed(0);
        if (v.e <= 16) {
            let unit = Math.floor(v.e / 4);
            const nums = (
                v.m * Math.pow(10, v.e - Math.floor(v.e / 4) * 4)
            ).toFixed(fixed);
            return (
                nums + (unit <= 4 ? `${NUMBER_UNIT[unit]}` : ` [${unit}W]`)
            );
        }
        // var e = Math.floor(v.e/4)
        // //return (v.m * Math.pow(10,(v.e - e * 4))).toFixed(fixed) + (e<=4?`${const_1.NUMBER_UNIT[e]}`:` [${e*4}W]`)
        // return  (v.m * Math.pow(10, (v.e - Math.floor(v.e / 4) * 4))).toFixed(fixed) + (e<=4?`${const_1.NUMBER_UNIT[e]}`:` [${v.e}W]`)
        // if (v.l>=1e21||v.l<=-1e21) {
        // 	return 'e'+v.l
        // }
        //if (v.l>=21||v.l<-6) {
        var logInt = Math.floor(v.l);
        return Math.pow(10, v.l - logInt).toFixed(fixed) + " [" + logInt + "w]";
        // }
        // return Math.pow(10,v.l).toString()
    }
    //转成补单位的string
    format(fixed) {
        return Decimal.format(this, fixed);
    }

    //转成补0的string
    static toFixedString(v: Decimal, fixed: number = 2, accuracy: number = MaxAccuracy): string {
        if (accuracy > MaxAccuracy) {
            accuracy = MaxAccuracy
        }
        if (v.l < -10) {
            return '0'
        }
        else if (v.l > accuracy) {
            let exp = Math.floor(v.l) - accuracy
            let num = v.l - exp
            let str: string = Math.round(Math.pow(10, num)).toFixed(0)
            let end = ''
            for (let i = 0; i < exp; i++) {
                end += '0'
            }
            return `${str}${end}`
        }
        else {
            return Math.pow(10, v.l).toFixed(fixed)
        }
    }
    //转成补0的string
    toFixedString(fixed: number = 2, accuracy: number = MaxAccuracy): string {
        return Decimal.toFixedString(this, fixed, accuracy)
    }

    //随机
    static random(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        v2.l = Math.random() * (v2.l - v1.l) + v1.l;
        return v2;
    }
    //随机
    random(v) {
        return Decimal.random(this, v);
    }

    //转数字
    static toNumber(v) {
        v = new Decimal(v);
        if (v.l >= 309) return Number.POSITIVE_INFINITY;
        if (v.l <= -309) return 0;
        return Math.pow(10, v.l);
    }
    //转数字
    toNumber() {
        return Decimal.toNumber(this);
    }
    //转科学计数法
    static toPrecision(v, dp) {
        v = new Decimal(v);
        if (v.l == Number.NEGATIVE_INFINITY) return (0).toPrecision(dp);
        if (v.l == Number.POSITIVE_INFINITY) {
            return "Infinity";
        }
        if (v.l >= 1e21 || v.l <= -1e21) {
            return "e" + v.l;
        }
        if (v.l >= dp || v.l < 6) {
            var logInt = Math.floor(v.l);
            return Math.pow(10, v.l - logInt).toPrecision(dp) + "e" + logInt;
        }
        return Math.pow(10, v.l).toPrecision(dp);
    }
    //转科学计数法
    toPrecision(dp) {
        return Decimal.toPrecision(this, dp);
    }

    static toFixed(v, dp) {
        v = new Decimal(v);
        if (v.l < -dp - 1) return (0).toFixed(dp);
        if (v.l == Number.POSITIVE_INFINITY) {
            return "Infinity";
        }
        if (v.l >= 1e21) {
            return "e" + v.l;
        }
        if (v.l >= 21) {
            var logInt = Math.floor(v.l);
            return Math.pow(10, v.l - logInt).toFixed(dp) + "e" + Math.floor(v.l);
        }
        return Math.pow(10, v.l).toFixed(dp);
    }

    toFixed(dp) {
        return Decimal.toFixed(this, dp);
    }

    //转科学计数法
    static toExponential(v, dp) {
        v = new Decimal(v);
        if (v.l == Number.NEGATIVE_INFINITY) return (0).toExponential(dp);
        if (v.l == Number.POSITIVE_INFINITY) {
            return "Infinity";
        }
        if (v.l >= 1e21 || v.l <= -1e21) {
            return "e" + v.l;
        }
        var logInt = Math.floor(v.l);
        return Math.pow(10, v.l - logInt).toFixed(dp) + "e" + logInt;
    }

    toExponential(dp: number = 0) {
        return Decimal.toExponential(this, dp);
    }

    //加法
    static add(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        var expdiff = v1.l - v2.l;
        if (expdiff >= 15 || v2.l == Number.NEGATIVE_INFINITY) return v1;
        if (expdiff <= -15 || v1.l == Number.NEGATIVE_INFINITY) return v2;
        v2.l = v2.l + Math.log10(1 + Math.pow(10, expdiff));
        return v2;
    }

    add(v) {
        return Decimal.add(this, v);
    }

    //加法
    static plus(v1, v2) {
        return Decimal.add(v1, v2);
    }

    //加法
    plus(v) {
        return Decimal.add(this, v);
    }

    //减法
    static sub(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        var expdiff = v1.l - v2.l;
        if (expdiff < 0) {
            v1.l = Number.NEGATIVE_INFINITY;
            return v1;
        }
        if (expdiff >= 15 || v2.l == Number.NEGATIVE_INFINITY) return v1;
        v1.l = v1.l + Math.log10(1 - Math.pow(10, -expdiff));
        return v1;
    }

    //减法
    sub(v) {
        return Decimal.sub(this, v);
    }
    //减法
    static subtract(v1, v2) {
        return Decimal.sub(v1, v2);
    }
    //减法
    subtract(v) {
        return Decimal.sub(this, v);
    }
    //减法
    static minus(v1, v2) {
        return Decimal.sub(v1, v2);
    }
    //减法
    minus(v) {
        return Decimal.sub(this, v);
    }

    //乘法
    static mul(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        v1.l = v1.l + v2.l;
        return v1;
    }
    //乘法
    mul(v) {
        return Decimal.mul(this, v);
    }
    //乘法
    static multiply(v1, v2) {
        return Decimal.mul(v1, v2);
    }
    //乘法
    multiply(v) {
        return Decimal.mul(this, v);
    }
    //乘法
    static times(v1, v2) {
        return Decimal.mul(v1, v2);
    }
    //乘法
    times(v) {
        return Decimal.mul(this, v);
    }
    //除法
    static div(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        if (
            (v1.l == Number.POSITIVE_INFINITY ||
                v1.l == Number.NEGATIVE_INFINITY) &&
            v2.l == v1.l
        ) {
            v1.l = Number.NEGATIVE_INFINITY;
            return v1;
        }
        v1.l = v1.l - v2.l;
        return v1;
    }
    //除法
    div(v) {
        return Decimal.div(this, v);
    }
    //除法
    static divide(v1, v2) {
        return Decimal.div(v1, v2);
    }
    //除法
    divide(v) {
        return Decimal.div(this, v);
    }
    //除法
    static divideBy(v1, v2) {
        return Decimal.div(v1, v2);
    }
    //除法
    divideBy(v) {
        return Decimal.div(this, v);
    }
    //除法
    static dividedBy(v1, v2) {
        return Decimal.div(v1, v2);
    }
    //除法
    dividedBy(v) {
        return Decimal.div(this, v);
    }

    //倒数
    static recip(v) {
        v = new Decimal(v);
        v.l = -v.l;
        return v;
    }
    //倒数
    recip() {
        return Decimal.recip(this);
    }
    //倒数
    static reciprocal(v) {
        return Decimal.recip(v);
    }
    //倒数
    reciprocal() {
        return Decimal.recip(this);
    }
    //倒数
    static reciprocate(v) {
        return Decimal.recip(v);
    }
    //倒数
    reciprocate() {
        return Decimal.recip(this);
    }

    //余数
    static mod(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        if (
            (v1.l == Number.POSITIVE_INFINITY ||
                v1.l == Number.NEGATIVE_INFINITY) &&
            v2.l == v1.l
        ) {
            v1.l = Number.NEGATIVE_INFINITY;
            return v1;
        }
        var expdiff = v1.l - v2.l;
        if (expdiff < 0) return v1;
        if (expdiff >= 15 || expdiff == 0) v2.l = Number.NEGATIVE_INFINITY;
        else {
            var mod = Math.pow(10, expdiff);
            var modInt = Math.floor(mod);
            if (mod == modInt) v2.l = Number.NEGATIVE_INFINITY;
            else v2.l = v2.l + Math.log10(mod - modInt);
        }
        return v2;
    }
    //余数
    mod(v) {
        return Decimal.mod(this, v);
    }
    //余数
    static remainder(v1, v2) {
        return Decimal.mod(v1, v2);
    }
    //余数
    remainder(v) {
        return Decimal.mod(this, v);
    }

    //指数
    static pow(v, power) {
        v = new Decimal(v);
        v.l = v.l * power;
        return v;
    }
    //指数
    pow(v) {
        return Decimal.pow(this, v);
    }
    //指数
    static power(v, power) {
        return Decimal.pow(v, power);
    }
    //指数
    power(v) {
        return Decimal.pow(this, v);
    }
    //指数
    pow_b(v) {
        return Decimal.pow(v, this);
    }
    //平方
    static sqr(v) {
        v = new Decimal(v);
        v.l = v.l * 2;
        return v;
    }
    //平方
    sqr() {
        return Decimal.square(this);
    }
    //平方
    static square(v) {
        return Decimal.sqr(v);
    }
    //平方
    square() {
        return Decimal.sqr(this);
    }
    //立方
    static cub(v) {
        v = new Decimal(v);
        v.l = v.l * 3;
        return v;
    }
    //立方
    cub() {
        return Decimal.cube(this);
    }

    //立方
    static cube(v) {
        return Decimal.cub(v);
    }
    //立方
    cube() {
        return Decimal.cub(this);
    }

    static exp(v) {
        v = new Decimal(v);
        v.l = v.l * Math.log10(Math.E);
        return v;
    }

    exp() {
        return Decimal.exp(this);
    }

    static root(v, power) {
        v = new Decimal(v);
        v.l = v.l / power;
        return v;
    }

    root(v) {
        return Decimal.root(this, v);
    }

    static sqrt(v) {
        v = new Decimal(v);
        v.l = v.l / 2;
        return v;
    }

    sqrt() {
        return Decimal.sqrt(this);
    }

    static cbrt(v) {
        v = new Decimal(v);
        v.l = v.l / 3;
        return v;
    }

    cbrt() {
        return Decimal.cbrt(this);
    }

    static log10(v) {
        v = new Decimal(v);
        return v.l;
    }

    log10() {
        return this.l;
    }

    static log10integer(v) {
        v = new Decimal(v);
        return Math.floor(v.l);
    }

    log10integer() {
        return Decimal.log10integer(this);
    }

    static log10remainder(v) {
        v = new Decimal(v);
        return v.l - Math.floor(v.l);
    }

    log10remainder() {
        return Decimal.log10remainder(this);
    }

    static log2(v) {
        v = new Decimal(v);
        if (v.l >= 5.411595565927716e307) {
            v.l = Math.log10(v.l) + Math.log10(3.32192809488736234787);
            return v;
        }
        return v.l * 3.32192809488736234787;
    }

    log2() {
        return Decimal.log2(this);
    }

    static log(v, b) {
        v = new Decimal(v);
        b = new Decimal(b);
        return v.l / b.l;
    }

    log(b) {
        return Decimal.log(this, b);
    }

    static l(v, b) {
        return Decimal.log(v, b);
    }

    static ln(v) {
        v = new Decimal(v);
        return v.l * 2.30258509299404568402;
    }

    ln() {
        return this.l * 2.30258509299404568402;
    }

    static floor(v) {
        v = new Decimal(v);
        if (v.l < 0) v.l = Number.NEGATIVE_INFINITY;
        else if (v.l < 15)
            v.l = Math.log10(
                Math.floor(Math.pow(10, v.l) + Math.pow(10, v.l - 14))
            );
        return v;
    }

    floor() {
        return Decimal.floor(this);
    }

    static ceil(v) {
        v = new Decimal(v);
        if (v.l == Number.NEGATIVE_INFINITY) return v;
        else if (v.l < 0) v.l = 0;
        else if (v.l < 15)
            v.l = Math.log10(Math.ceil(Math.pow(10, v.l) - Math.pow(10, v.l - 14)));
        return v;
    }

    ceil() {
        return Decimal.ceil(this);
    }

    static round(v) {
        v = new Decimal(v);
        if (v.l <= -1) v.l = Number.NEGATIVE_INFINITY;
        else if (v.l < 15) v.l = Math.log10(Math.round(Math.pow(10, v.l)));
        return v;
    }

    round() {
        return Decimal.round(this);
    }

    //最小值
    static min(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        if (v1.l > v2.l) return v2;
        return v1;
    }
    //最小值
    min(v) {
        return Decimal.min(this, v);
    }
    //最大值
    static max(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        if (v1.l > v2.l) return v1;
        return v2;
    }
    //最大值
    max(v) {
        return Decimal.max(this, v);
    }
    //比大小
    static cmp(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        if (v1.l > v2.l) return 1;
        if (v1.l < v2.l) return -1;
        return 0;
    }
    //比大小
    compareTo(v) {
        return Decimal.cmp(this, v);
    }
    //比大小
    static compare(v1, v2) {
        return Decimal.cmp(v1, v2);
    }
    //比大小
    compare(v) {
        return Decimal.cmp(this, v);
    }
    //比大小
    static compareTo(v1, v2) {
        return Decimal.cmp(v1, v2);
    }

    static lt(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        return v1.l < v2.l;
    }

    lt(v) {
        return Decimal.lt(this, v);
    }

    static lte(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        return v1.l <= v2.l;
    }

    lte(v) {
        return Decimal.lte(this, v);
    }
    //相等
    static eq(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        return v1.l == v2.l;
    }
    //相等
    eq(v) {
        return Decimal.eq(this, v);
    }
    //相等
    static equals(v1, v2) {
        return Decimal.eq(v1, v2);
    }
    //相等
    equals(v) {
        return Decimal.eq(this, v);
    }
    //不相等
    static neq(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        return v1.l != v2.l;
    }
    //不相等
    neq(v) {
        return Decimal.neq(this, v);
    }
    //不相等
    static notEquals(v1, v2) {
        return Decimal.neq(v1, v2);
    }
    //不相等
    notEquals(v) {
        return Decimal.neq(this, v);
    }

    static gte(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        return v1.l >= v2.l;
    }

    gte(v) {
        return Decimal.gte(this, v);
    }

    static gt(v1, v2) {
        v1 = new Decimal(v1);
        v2 = new Decimal(v2);
        return v1.l > v2.l;
    }

    gt(v) {
        return Decimal.gt(this, v);
    }

    static isFinite(v) {
        v = new Decimal(v);
        return v.l < Number.POSITIVE_INFINITY;
    }

    isFinite() {
        return Decimal.isFinite(this);
    }

    get mantissaAndExponent() {
        if (this.l == Number.NEGATIVE_INFINITY) return { m: 0, e: 0 };
        var logInt = Math.floor(this.l);
        return { m: Math.pow(10, this.l - logInt), e: logInt };
    }
    get e() {
        if (this.l == Number.NEGATIVE_INFINITY) return 0;
        return Math.floor(this.l);
    }
    get exponent() {
        return this.e;
    }
    get m() {
        if (this.l == Number.NEGATIVE_INFINITY) return 0;
        var logInt = Math.floor(this.l);
        return Math.pow(10, this.l - logInt);
    }
    get mantissa() {
        return this.m;
    }
    get logarithm() {
        return this.l;
    }

    vOf() {
        return this.toString();
    }
    toJSON() {
        return this.toString();
    }
}