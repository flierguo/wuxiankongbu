//数字转中文数字
function s1Chinesefunc(Number: string): string {
	let result: string;
	switch (Number) {
		case "0": result = "〇"; break
		case "1": result = "一"; break
		case "2": result = "二"; break
		case "3": result = "三"; break
		case "4": result = "四"; break
		case "5": result = "五"; break
		case "6": result = "六"; break
		case "7": result = "七"; break
		case "8": result = "八"; break
		case "9": result = "九"; break
	}
	return result
}
export function main(uNumber: number): string {

	let s1Chine: string;
	let s2Chine: string;
	let s3Chine: string;
	let len: number;
	let result: string;

	s1Chine = uNumber.toString();
	len = s1Chine.length;

	//charAt() 返回在指定位置的字符。
	switch (len) {
		case 1:
			s2Chine = s1Chinesefunc(s1Chine)
			result = s2Chine;
		break
		case 2:
			// 第 1 个字节
			s3Chine = s1Chine.charAt(0);//返回第 1 个字符
			s2Chine = s1Chinesefunc(s3Chine);
			if (s3Chine === "1")
				result = "十";//10
			else
				result = s2Chine + "十";//20..90
			// 第 2 个字节
			s3Chine = s1Chine.charAt(1);//返回第 2 个字符
			s2Chine = s1Chinesefunc(s3Chine);
			if (s3Chine === "0"){
				break
			} else {
				s2Chine = s1Chinesefunc(s3Chine);
				result = result + s2Chine;
			}
		break
		case 3:
			// 第 1 个字节
			s3Chine = s1Chine.charAt(0);
			s2Chine = s1Chinesefunc(s3Chine);
			result = s2Chine + "百";
			if (s1Chine.indexOf("00") != -1) break // 100
			// 第 2 个字节
			s3Chine = s1Chine.charAt(1);
			if (s3Chine === "0") { //101
				s2Chine = s1Chinesefunc(s3Chine);
				result = result + s2Chine;
			} else { //110
				s2Chine = s1Chinesefunc(s3Chine);
				result = result + s2Chine + "十";
			}
			// 第 3 个字节
			s3Chine = s1Chine.charAt(2);
			if (s3Chine === "0"){//110
				break
			} else {//111
				s2Chine = s1Chinesefunc(s3Chine);
				result = result + s2Chine;
			}
		break
		case 4:
			// 第 1 个字节
			s3Chine = s1Chine.charAt(0);
			s2Chine = s1Chinesefunc(s3Chine);
			result = s2Chine + "千";
			if (s1Chine.charAt(1) === "0" && s1Chine.charAt(2) === "0" && s1Chine.charAt(3) === "0") break //1000
			// 第 2 个字节
			s3Chine = s1Chine.charAt(1);
			s2Chine = s1Chinesefunc(s3Chine);
			if (s3Chine === "0") {//1011
				result = result + s2Chine;
			} else {
				result = result + s2Chine + "百";
			}
			if (s1Chine.charAt(2) === "0" && s1Chine.charAt(3) === "0") break //1100
			// 第 3 个字节
			if (s1Chine.charAt(1) === "0" && s1Chine.charAt(2) === "0") {//1001

			} else { // 1111
				s3Chine = s1Chine.charAt(2);
				s2Chine = s1Chinesefunc(s3Chine);
				result = result + s2Chine + "十";
			}
			// 第 4 个字节
			if (s1Chine.charAt(3) === "0") break//1110
			s3Chine = s1Chine.charAt(3);
			s2Chine = s1Chinesefunc(s3Chine);
			result = result + s2Chine;
		break
	}
	return result

}