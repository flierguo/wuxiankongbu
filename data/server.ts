export function 加载服务器配置文件(player: TPlayObject) {
	player.R.每天最大充值兑换 = 5
	const 通区配置路径 = GameLib.R.通区配置路径
	const path = `${通区配置路径}\\数据核心.ini`;
	const IniFile = GameLib.CreateFastIniFile(path)
	if (!player.R.登陆器全局标识) player.R.登陆器全局标识 = player.GetServerEntryFlag()
	if (!player.R.登陆器全局标识) player.R.登陆器全局标识 = 1
	const 登陆器标识 = player.R.登陆器全局标识 + ""
	player.R.联运渠道 = IniFile.ReadString(登陆器标识, '联运渠道', '')
	player.R.公司名称 = IniFile.ReadString(登陆器标识, '公司名称', '')
	player.R.游戏名称 = IniFile.ReadString(登陆器标识, '游戏名称', '')
	player.R.游戏网址 = IniFile.ReadString(登陆器标识, '游戏网址', '')
	player.R.QQ群号 = IniFile.ReadString(登陆器标识, 'QQ群号', '')
	player.R.QQ群地址 = IniFile.ReadString(登陆器标识, 'QQ群地址', '')
	player.R.微信目录 = IniFile.ReadString(登陆器标识, '微信目录', '')
	player.R.微信礼包码 = IniFile.ReadString(登陆器标识, '微信礼包码', '')
	player.R.微信二维码 = IniFile.ReadString(登陆器标识, '微信二维码', '24')
	const 充值通道 = IniFile.ReadString(`${player.R.登陆器全局标识}`, `充值通道类型`, '')
	const 充值通道货币 = IniFile.ReadString(`${player.R.登陆器全局标识}`, '充值通道货币', '')
	const 充值登陆器编号SDK = IniFile.ReadInteger(`全区充值平台`, `登录器编号${登陆器标识}`, 1)

	player.R.充值目录 = IniFile.ReadString(`${充值登陆器编号SDK}`, `版本充值目录货币`, "")
	player.R.充值通道1 = IniFile.ReadString(充值通道, '充值通道1', '') + 充值通道货币
	player.R.充值通道2 = IniFile.ReadString(充值通道, '充值通道2', '') + 充值通道货币
	player.R.充值通道3 = IniFile.ReadString(充值通道, '充值通道3', '') + 充值通道货币
	player.R.充值通道4 = IniFile.ReadString(充值通道, '充值通道4', '') + 充值通道货币
	player.R.充值通道5 = IniFile.ReadString(充值通道, '充值通道5', '') + 充值通道货币
	player.R.充值通道6 = IniFile.ReadString(充值通道, '充值通道6', '') + 充值通道货币
	IniFile.Free()
}


export function 专区限制(player: TPlayObject) {
	let stringList: TStringList
	const path = `${GameLib.R.通区配置路径}\\包区名单设置\\${GameLib.ServerName}.txt`
	if (GameLib.FileExists(path)) {
		if (GameLib.R.刷怪倍数 > 1) {
			GameLib.Broadcast(`{s=你当前进入的是 2000特权专区 刷怪倍数 x${GameLib.R.刷怪倍数} 爆率倍数 x${GameLib.R.爆率倍数} ;c=#c5a790}`)
		}
		stringList = GameLib.CreateStringList()
		try {
			stringList.LoadFromFile(path)
			if (stringList.IndexOf(player.Account) == -1) {
				player.MessageBox('请您登录正常服务器进行游戏!\\您不能登录本专区!谢谢配合!')
				player.Kick()
			}
		} finally {
			stringList.Free()
		}
	}
}


export function 专区定制() {
	let 刷怪倍数 = 1
	let 爆率倍数 = 1
	const 通区配置路径 = GameLib.R.通区配置路径

	const path0 = `${通区配置路径}\\包区名单设置\\2000特权专区名字.txt`
	const path1 = `${通区配置路径}\\包区名单设置\\5000特权专区名字.txt`
	let stringList: TStringList
	if (GameLib.FileExists(path0)) {
		stringList = GameLib.CreateStringList()
		try {
			stringList.LoadFromFile(path0)
			if (stringList.IndexOf(GameLib.ServerName) == -1) {
				刷怪倍数 = 2
				爆率倍数 = 3
			}
		} finally {
			stringList.Free()
		}
	}

	if (GameLib.FileExists(path1)) {
		stringList = GameLib.CreateStringList()
		try {
			stringList.LoadFromFile(path1)
			if (stringList.IndexOf(GameLib.ServerName) == -1) {
				刷怪倍数 = 2
				爆率倍数 = 3
			}
		} finally {
			stringList.Free()
		}
	}

	GameLib.R.刷怪倍数 = 刷怪倍数
	GameLib.R.爆率倍数 = 爆率倍数
}
// /**
//  * 登录限制
//  */
// export function loginLimit(player: TPlayObject) {
// 	let stringlist: TStringList
// 	let idx: number
// 	const path = `${通区配置路径}\\专区配置\\${GameLib.ServerName}.txt`
// 	if (GameLib.FileExists(path)) {
// 		stringlist = GameLib.CreateStringList()
// 		try {
// 			stringlist.LoadFromFile(path)
// 			idx = stringlist.IndexOf(player.Account)
// 			if (idx == -1) {
// 				player.Kick()
// 			}
// 		} finally {
// 			stringlist.Free()
// 		}
// 	}
// }

export function 窜服限制(player: TPlayObject) {
	// if (player.IsAdmin) return

	// //限制窜服
	// if (!player.V.服务器标记 || player.V.服务器标记 == '') {
	// 	player.V.服务器标记 = player.GetServerEntryFlag()
	// 	return
	// }

	// if (player.V.服务器标记 == '98lm' && player.GetServerEntryFlag() == 'jianxin') {
	// 	return
	// }

	// if (player.V.服务器标记 == 'jianxin' && player.GetServerEntryFlag() == '98lm') {
	// 	return
	// }

	// if (player.V.服务器标记 != player.GetServerEntryFlag()) {
	// 	player.R.错误服务器 = true
	// 	player.SendCountDownMessage('当前登陆器错误,请前往 QQ:' + player.R.交流群 + ',下载您的登陆器', 0)
	// 	let s = `{s=错误:当前登陆器错误,请前往 QQ群:${player.R.交流群},下载您的登陆器;x=20;y=20;c=58;fs=12}
	//     <{s=点击加入QQ群:${player.R.交流群};x=20;y=50;c=246;fs=10;hint=点击加入QQ群}/@shoppingMall.QQ()>`
	// 	player.AddStatusBuff(buff_enum.晕迷, TBuffStatusType.stStone, 0, buff_enum.晕迷, 2)
	// 	functionNpc.SayEx(player, '大对话框', trim(s))
	// }
}


export const DBNAME = '12_1'

export function 数据库配置() {

	let host = '127.0.0.1'
	let port = 3306
	let user = 'root'
	let pass = 'root'
	let db = '12_1'
	//if (GameLib.IPLocal)
	// if (GameLib.ServerName != "本地测试") {
	// 	pass = "perpetuity521"
	// 	db = 'fengshen'
	// }
	const flag = GameLib.DBEngine.AddConection(DBNAME, host, port, user, pass, db)
	if (flag) {
		console.log("数据库链接成功")
	} else {
		console.error("数据库链接失败")
	}

}