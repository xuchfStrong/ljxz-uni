<template>
	<view class="content-login">
		<!-- <view class="uni-title uni-common-pl"></view> -->
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					选择平台：
				</view>
				<view class="uni-list-cell-db">
					<picker @change="changePlatform" :disabled="false" range-key="text" :value="platformIndex" :range="remoteOptions.platform">
						<view class="uni-input">{{platformName}}</view>
					</picker>
				</view>
			</view>
		</view>
		
		<view class="input-group">
		    <view class="input-row border">
		        <text class="title">账号：</text>
		        <m-input class="m-input" type="text" :disabled="false"  clearable focus v-model="userInfo.usernamePlatForm" placeholder="请输入账号"></m-input>
		    </view>
				<view v-if="isVerifycode" class="input-row border">
		        <text class="title">验证码：</text>
		        <m-input class="m-input" type="text" :disabled="false"  clearable focus v-model="userInfo.verifycode" placeholder="请输入验证码"></m-input>
		    </view>
		    <view v-else class="input-row">
		        <text class="title">密码：</text>
		        <m-input type="password" displayable v-model="userInfo.passwordPlatForm" placeholder="请输入密码"></m-input>
		    </view>
		</view>

		<view v-show="showVerifycode" style="margin-top: 10rpx;">
        <checkbox-group @change="changeVerifycodeLogin">
            <label>
                <checkbox value="useVerifycode"/>验证码登录
            </label>
        </checkbox-group>
    </view>

		<view class="btn-row">
		    <button type="primary" class="primary" @tap="handleLogin">登录</button>
		</view>

		<view style="margin-top:10px; color:#1989fa; text-align: center;">
      <a :href="utils.zhushouUrl">
        <text>点击下载登录助手</text>
      </a>
    </view>

		<view>
			<view class="content">
				<view class="sub-title">登录说明:</view>
				<view v-for="(item,index) in loginDescription.description" :key="index" class="item-wrap">{{ item }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import moment from 'moment'
import CryptoJS from 'crypto-js'
import save from '@/utils/save'
import loginDescription from './loginDescription.json'
import { getUtils } from '@/api/game'
import { acclogin, othersdkloginvalid, regbyphone, addUser, checkUserStatus, getRemoteOptions, douyinUserLogin } from '@/api/login'
import { genRandomNumber, getRamNumberHex, genUUID, genMac, getValueByIndex, getIndexByValue } from '@/utils/index'
import {mapState,mapMutations} from 'vuex'
import pako from 'pako'
import mInput from '../../components/m-input.vue'

export default {
	components:{
		mInput
	},
	data() {
		return {
			socketTask: null,
			showVerifycode: false,
			isVerifycode: false,
			loginDescription: loginDescription,
			platformIndex: 0,
			platformName: '',
			account: '',
			password: '',
			current: 0,
			remoteOptions: {},
			configInfo: '',
			utils: '',
			flag: {
			    loginFlag: false,
			    logoutFlag: false,
			    newUserFlag: false,
					showServer: false
			},
			userInfo: {
			  usernamePlatForm: '', // 平台的用户名
				passwordPlatForm: '', // 平台的密码
				verifycode: '', // 验证码
			  platform: 1, // 这个platform用在向辅助添加用户的时候
			  server: '',
			  endTime: '', // 辅助到期时间
			  deviceType: 'vivo+x5s+l',
			  site: 'jqcm_android',
				mac: '',
				auth: '752693a5ebeef1427199985e6c605b51',
				imei: '',
				imsi: '',
			  sessionid: '',
			  loginType: '' // 官方平台：1，taptap：2
			},
			loginInfo: { // 登录过程中需要的数据
				sessionid: '',
				userId: '',
				token: '',
				channelId: '',
				pfId: '',
				time: ''
			},
			serverInfo: { // 服务器列表
        client_ip: '',
        server_list: [],
        last_server_list: []
      }		
		}
	},
	onLoad() {
		this.handleGetRemoteOptions()
		this.handleGetUtils()
	},
	methods: {
		// 获取远程选项
		handleGetRemoteOptions() {
			getRemoteOptions()
			.then(res => {
				this.remoteOptions = res
				this.loadLoginInfo()
			})
			.catch(err => {
				console.log(err)
			})
		},

		// 获取Utils
		handleGetUtils() {
      getUtils().then(res => {
        this.utils = res
      }).catch(err => {
        console.log(err)
      })
		},
		
		// 切换是否验证码登录
		changeVerifycodeLogin(e) {
			console.log(e.detail.value)
			const length = e.detail.value.length
			this.isVerifycode = !!length
		},

		// 登录按钮
		handleLogin() {
			if (!this.userInfo.loginType) {
				this.$toast("请选择平台")
				return
			}
			if (this.isVerifycode) {
				this.loginByVerifycode()
			} else {
				this.handleCheckUserStatus()
			}
		},
		
		// 在辅助服务端检查用户状态
		handleCheckUserStatus() {
			// let login_type = 1
			// if (this.userInfo.loginType !== 1) {
			// 	login_type = 2
			// }
			const param = {
				uname_md5: CryptoJS.MD5(this.userInfo.usernamePlatForm).toString(), // 用户名
				pwd_md5: CryptoJS.MD5(this.userInfo.passwordPlatForm).toString(), // 密码
				login_type: this.userInfo.loginType
			}
			checkUserStatus(param).then(res => {
				const guanfuServerLoginTypeList = [1,2,3,4,12]
				if (res.code === 200) {
					// 获取用户信息
					this.loginInfo.userId = res.userid
					this.flag.showServer = true
					this.saveLoginInfo()
					this.toMain()
					uni.showToast({
						title: '登录成功，请选择服务器后，点击开始挂机。',
						duration: 2000,
						icon: 'none'
					})
					// if (guanfuServerLoginTypeList.includes(this.userInfo.loginType)) {
					// 	this.saveLoginInfo()
					// 	this.toMain()
					// 	uni.showToast({
					// 		title: '登录成功，请选择服务器后，点击开始挂机。',
					// 		duration: 2000,
					// 		icon: 'none'
					// 	})
					// } else {
					// 	this.handleGerServer()
					// }
				} else {
					this.flag.newUserFlag = true
					const guanfangPlatform = [1, 2, 4]
					const douyinPlatform = [3, 12]
					if (guanfangPlatform.includes(this.userInfo.loginType)) { // 官方，苹果，斗破乾坤
						this.handleLoginFirstStep()
					} else if (douyinPlatform.includes(this.userInfo.loginType)) { // 抖音, 大仙宗
						this.handleLoginFirstStepDouyin()
					} else { // 渠道服
						uni.showToast({
							title: '登录失败，请使用登陆助手提取账号密码后再登录。',
							duration: 2000,
							icon: 'none'
						})
					}
				}
			})
		},

		// 获取服务器
		handleGerServer() {
			let wsUrl = ''
			if (this.userInfo.loginType === 1) {
				wsUrl = 'ws://121.37.203.19:36001/'
			} else {
				wsUrl = 'ws://121.37.253.198:36001/'
			}
			this.socketTask = uni.connectSocket({
				url: wsUrl,
				success: ()=> {
					console.log('WebSocket连接成功！')
				}
			})
			this.socketTask.onOpen(() => {
				this.websocketOnOpen()
			})
			this.socketTask.onMessage((res) => {
				this.websocketonmessage(res.data)
			})
			this.socketTask.onClose(() => {
				console.log('WebSocket被关闭！')
			})
			this.socketTask.onError(() => {
				console.log('WebSocket连接错误！')
			})
		},

		/**
		 * 
		 */
		websocketSend(optCode, contentObj) {
			// console.log('发送消息',this.userInfo.Uin, optCode, JSON.stringify(contentObj))
			const contentArrayBuffer = pako.deflate(JSON.stringify(contentObj))
			const contentLength = contentArrayBuffer.byteLength
			const len = 16 + contentLength
			let buffer = new ArrayBuffer(len)
			let view = new DataView(buffer)
			view.setUint32(0, len);
			view.setUint32(4, 0);
			view.setUint16(8, 0);
			view.setUint32(10, optCode);
			view.setUint16(14, 2);
			let v2 = new Uint8Array(buffer, 16);
			v2.set(contentArrayBuffer)
			this.socketTask.send({
				data: buffer,
				success:()=> {
					console.log('消息发送成功')
				},
				fail:()=> {
					console.log('消息发送失败')
				}
			})
		},

		websocketOnOpen() {
			let Agent = 'agame'
			if (this.userInfo.loginType !== 1) {
				Agent = 'agame_channels'
			}
			const getMyServerPackage = {
				Agent: Agent,
				UserName: this.userInfo.usernamePlatForm,
				sessionid: '',
				Page: 0
			}
			this.websocketSend(16001,getMyServerPackage)
		},

		websocketonmessage(resArrayBuffer) {
			const content = resArrayBuffer.slice(16)
			let dv = new DataView(resArrayBuffer)
			const optCode = dv.getUint32(10)
			// console.log('optCode', optCode)
			// console.log('dv.getUint32(4)', dv.getUint32(4))
			const contentObj = JSON.parse(pako.inflate(content, { to: 'string' }))
			console.log(contentObj)
			if (optCode === 16002) {
				this.serverInfo.last_server_list = this.formatServerList(contentObj.SvrList)
				this.saveLoginInfo()
				this.toMain()
				uni.showToast({
					title: '登录成功，请选择服务器后，点击开始挂机。',
					duration: 2000,
					icon: 'none'
				})
				this.socketTask.close()
			}
		},

		formatServerList(SvrList) {
			let formatSrvList = []
			SvrList.forEach(item => {
				const oneServer = {
					url: 'ws://' + item.LoginIp + ':' + item.LoginPort + '/',
					text: item.SvrName,
					server_id: item.SvrId
				}
				formatSrvList.push(oneServer)
			})
			return formatSrvList
		},

		// 验证码登录
		loginByVerifycode() {
			const params = {
				phone: this.userInfo.usernamePlatForm,
				verifycode: this.userInfo.verifycode
			}
			let header = {
				//moby_auth: this.userInfo.auth || getRamNumberHex(32),
				moby_auth: '5a6eb45eb7b2a630617fa86fbf88bce7',
				moby_imei: 'DC7EADC1-82FA-4708-8A2A-53D853B4F8E0',
				moby_sdk: 'iphone',
				moby_op: '2',
				moby_ua: 'iPhone|14.0',
				moby_pn: '(0, 0)',
				moby_gameid: '100079100925',
				moby_bv: '20200513',
				moby_sv: '400003',
				moby_pb: 'appstore_ljxz_101',
				moby_accid: this.loginInfo.userId || '',
				moby_sessid: this.loginInfo.sessionid || ''
			}
			const secretKey = '23aa164ad29bba78'
			const encryptParams = this.encryptData(params, secretKey)
			regbyphone(encryptParams, header).then(resEncrypt => {
				const res = this.decryptData(resEncrypt, secretKey)
				if (res.code == 0) {
					this.loginInfo.userId = res.data.account.accountid,
					this.loginInfo.sessionid = res.data.account.sessionid
					this.userInfo.passwordPlatForm = res.data.account.password
					this.handleAddUser()
				} else {
					uni.showToast({
						title: res.msg,
						duration: 2000,
						icon: 'none'
					})
				}
			})
		},

		// 登录第一步
		handleLoginFirstStep() {
			const params = {
				username: this.userInfo.usernamePlatForm,
				userpassword: this.userInfo.passwordPlatForm
			}
			let header = {}
			const arrGuanfangLogin = [1, 4] // 官方,斗破乾坤
			if (arrGuanfangLogin.includes(this.userInfo.loginType)) {
				header= {
					//moby_auth: this.userInfo.auth || getRamNumberHex(32),
					moby_auth: '752693a5ebeef1427199985e6c605b51',
					moby_imei: '865166022590965',
					moby_sdk: 'android',
					moby_op: '0',
					moby_ua: 'm2|meizu',
					moby_pn: '0',
					moby_imsi: '460006922036790',
					moby_mac: this.userInfo.mac || genMac(),
					moby_gameid: '100079100925',
					moby_bv: '20200602',
					moby_sv: '12007',
					moby_pb: 'asdk_ljxz_lwjqq_001',
					moby_accid: this.loginInfo.userId || '',
					moby_sessid: this.loginInfo.sessionid || ''
				}
			}
			if (this.userInfo.loginType === 2) { // 苹果用户
				header= {
					//moby_auth: this.userInfo.auth || getRamNumberHex(32),
					moby_auth: '22986535d04058b002e6888e6210baab',
					moby_imei: 'A860DEB0-CC45-8A7F-9AC7-AFE2F0E2CAFD',
					moby_sdk: 'iphone',
					moby_op: '0',
					moby_ua: 'iPhone|14.0',
					moby_pn: '(0, 0)',
					moby_gameid: '100079100925',
					moby_bv: '20200513',
					moby_sv: '400003',
					moby_pb: 'appstore_ljxz_101',
					moby_accid: this.loginInfo.userId || '',
					moby_sessid: this.loginInfo.sessionid || ''
				}
			}
			const secretKey = '23aa164ad29bba78'
			const encryptParams = this.encryptData(params, secretKey)
			acclogin(encryptParams, header).then(resEncrypt => {
				const res = this.decryptData(resEncrypt, secretKey)
				// console.log(res)
				if (res.code == 0) {
					this.loginInfo.userId = res.data.account.accountid,
					this.loginInfo.sessionid = res.data.account.sessionid
					this.handleAddUser()
				} else {
					uni.showToast({
						title: res.msg,
						duration: 2000,
						icon: 'none'
					})
				}
			})
		},

		// 加密
		encryptData(reqObj, secretKey) {
			const JsonData = JSON.stringify(reqObj)
			const encryptData = CryptoJS.AES.encrypt(JsonData, CryptoJS.enc.Utf8.parse(secretKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
			}).toString()
			// const Base64Data = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptData))
			return encryptData
		},

		// 解密
		decryptData(resEncrypt, secretKey) {
			// const encryptData = CryptoJS.enc.Base64.parse(resEncrypt).toString(CryptoJS.enc.Utf8)
			const decryptData = CryptoJS.AES.decrypt(resEncrypt, CryptoJS.enc.Utf8.parse(secretKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
			}).toString(CryptoJS.enc.Utf8)
			const resObj = JSON.parse(decryptData)
			return resObj
		},

		// 大仙宗登录第二步
		handleLoginSecondStepDXZ(username, sessionid) {
			if (!username || !sessionid) {
				this.$toast("大仙宗登录失败，没获取到id和token")
				return
			}
			const params = {
				username: username,
				sessionid: sessionid,
				extend: ''
			}
			let header = {}
			header= {
				//moby_auth: this.userInfo.auth || getRamNumberHex(32),
				moby_auth: '752693a5ebeef1427199985e6c605b51',
				moby_imei: '865166022590965',
				moby_sdk: 'android',
				moby_op: '0',
				moby_ua: 'm2|meizu',
				moby_pn: '0',
				moby_imsi: '460007861618166',
				moby_mac: this.userInfo.mac || genMac(),
				moby_gameid: '100079100925',
				moby_bv: '20200602',
				moby_sv: '12007',
				moby_pb: 'chaotusdk2_ljxz_001',
				moby_accid: '',
				moby_sessid: ''
			}
			const secretKey = '23aa164ad29bba78'
			const encryptParams = this.encryptData(params, secretKey)
			othersdkloginvalid(encryptParams, header).then(resEncrypt => {
				const res = this.decryptData(resEncrypt, secretKey)
				// console.log(res)
				if (res.code == 0) {
					this.loginInfo.userId = res.data.account.accountid,
					this.loginInfo.sessionid = res.data.account.sessionid
					this.handleAddUser()
				} else {
					uni.showToast({
						title: res.msg,
						duration: 2000,
						icon: 'none'
					})
				}
			})
		},

		// 抖音登录第一步,大仙宗登录第一步。实际上大仙宗登录第一步和这个不一样，但是用这个也能获取到userid和token
		handleLoginFirstStepDouyin() {
			const params = {
				account: this.userInfo.usernamePlatForm,
				cat1: "136",
				cat2: "1680",
				ct_version: "6.2.0",
				device_id: "3783354ea4f5ed0ad96a1d31a7b8b026",
				extend1: "",
				extend2: "",
				game_appid: "5D2E20708BE1E3EC0",
				game_id: "107",
				game_name: "武道神尊(安卓版)",
				password: this.userInfo.passwordPlatForm,
				phoneType: "vivo v3max a",
				sdk_version: "1",
				system_version: "5.1.1",
			}
			const md5Sign = this.getDouyinLoginMd5(params)
			params.md5_sign = md5Sign
			const paramsStr = JSON.stringify(params)
			const paramsBase64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(paramsStr))
			douyinUserLogin(paramsBase64).then(res => {
				const resPlain = CryptoJS.enc.Base64.parse(res).toString(CryptoJS.enc.Utf8)
				const resObj = JSON.parse(resPlain)
				if (resObj.status === 200) {
					if (this.userInfo.loginType === 12) {
						this.handleLoginSecondStepDXZ(resObj.user_id, resObj.token)
					} else {
						this.loginInfo.userId = resObj.user_id,
						this.loginInfo.sessionid = resObj.token
						this.handleAddUser()
					}
				} else {
					uni.showToast({
						title: resObj.return_msg,
						duration: 2000,
						icon: 'none'
					})
				}
			})
		},

		// 计算抖音登录的md5
		getDouyinLoginMd5(params) {
			let str = ''
			for (let i in params) {
				str = str + params[i]
			}
			const md5Key = 'C006BBDD939C99C78209'
			const plainStr = str + md5Key
			const md5Sign = CryptoJS.MD5(plainStr).toString()
			return md5Sign
		},

		// 登录游戏辅助，添加新用户
    handleAddUser() {
      const param = {
        userid: this.loginInfo.userId,
        last_server_id: 0,
        login_type: this.userInfo.loginType,
        username: this.userInfo.usernamePlatForm,
        password: this.userInfo.passwordPlatForm,
        uname_md5: CryptoJS.MD5(this.userInfo.usernamePlatForm).toString(),
        pwd_md5: CryptoJS.MD5(this.userInfo.passwordPlatForm).toString()
      }
      addUser(param).then(res => {
        if (res.code === 200) {
					this.flag.showServer = true
          this.saveLoginInfo()
          uni.showToast({
						title: '登录成功，请选择服务器，然后开始挂机',
						duration: 2000,
						icon: 'none'
					})
					if (this.isVerifycode) this.$store.commit("setVerifyCodePassword", this.userInfo.passwordPlatForm)
					this.toMain()
        }
      }).catch(err => {
        console.log(err)
      })
		},
		
		// 读取记住的登录信息
    loadLoginInfo() {
      const gameLoginInfo = save.getGameLoginInfo()
      if (gameLoginInfo) {
        this.userInfo.platform = gameLoginInfo.platform
        this.userInfo.server = gameLoginInfo.server
        this.userInfo.usernamePlatForm = gameLoginInfo.usernamePlatForm
        this.userInfo.passwordPlatForm = gameLoginInfo.passwordPlatForm
        this.userInfo.sessionid = gameLoginInfo.sessionid
				this.userInfo.loginType = gameLoginInfo.loginType
				this.userInfo.mac = gameLoginInfo.mac
				this.userInfo.auth = gameLoginInfo.auth
				this.userInfo.imei = gameLoginInfo.imei
				this.userInfo.imsi = gameLoginInfo.imsi
        this.loginInfo.userId = gameLoginInfo.userId
				this.flag.showServer = gameLoginInfo.showServer
				this.platformName = gameLoginInfo.platformName
				// this.serverInfo = gameLoginInfo.serverInfo
				this.initSaveData()
        // this.serverInfo = JSON.parse(gameLoginInfo.serverInfo)
        // this.handleGuajiStatus()
      }
    },

    // 存储登录信息到LocalStorage
    saveLoginInfo() {
      const gameLoginInfo = {
        platform: this.userInfo.platform,
        server: '',
        usernamePlatForm: this.userInfo.usernamePlatForm,
        passwordPlatForm: this.userInfo.passwordPlatForm,
        sessionid: this.userInfo.sessionid,
				loginType: this.userInfo.loginType,
				mac: this.userInfo.mac,
				auth: this.userInfo.auth,
				imei: this.userInfo.imei,
				imsi: this.userInfo.imsi,
        userId: this.loginInfo.userId,
				showServer: this.flag.showServer,
				platformName: this.platformName,
				serverInfo: this.serverInfo
        // serverInfo: JSON.stringify(this.serverInfo)
			}
      save.setGameLoginInfo(gameLoginInfo)
    },

		// 跳转到主页
		toMain() {
			uni.reLaunch({
        url: '../home/home',
      })
		},
		
		// 选择平台
		changePlatform: function(e) {
			if (e.target.value !== -1) {
				this.platformIndex = e.target.value
			} else {
				this.platformIndex = 0
			}
			this.platformName = this.remoteOptions.platform[this.platformIndex].text
			this.userInfo.loginType = getValueByIndex(this.remoteOptions.platform, this.platformIndex)
			this.showVerifycode = this.userInfo.loginType === 2
		},

		// 加载后将存储的数据显示出来
		initSaveData() {
			this.platformIndex = getIndexByValue(this.remoteOptions.platform, this.userInfo.loginType)
			console.log( this.platformIndex)
			if (this.platformIndex !== -1) {
				this.platformName = this.remoteOptions.platform[this.platformIndex].text
			}
		}
	}
}
</script>

<style lang="css" scoped>
.flex-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.left {
	width: 70%;
}
.server-wrap {
	margin-top: 20upx;
}
.btn-center {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20upx;
}
.attr-flex {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.attr-flex-item {
	flex: 1;
	width: 33.3%;
	min-width: 33.3%;
	max-width: 33.3%;
}
.radio-flex {
	/* width: 100%; */
	display: flex;
}
.radio-flex-item {
	flex: 1;
	width: 32%;
	min-width: 32%;
	max-width: 32%;
}
.content {
  padding: 10rpx 30rpx;
	user-select: text;
}
.sub-title {
	font-weight: 600;
}
.item-wrap {
  color: #969799;
  padding-bottom: 20rpx;
}
</style>
