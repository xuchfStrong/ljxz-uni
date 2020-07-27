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
		    <view class="input-row">
		        <text class="title">密码：</text>
		        <m-input type="password" displayable v-model="userInfo.passwordPlatForm" placeholder="请输入密码"></m-input>
		    </view>
		</view>

		<view class="btn-row">
		    <button type="primary" class="primary" @tap="handleCheckUserStatus">登录</button>
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
import { acclogin, addUser, checkUserStatus, getRemoteOptions } from '@/api/login'
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
		
		// 在辅助服务端检查用户状态
		handleCheckUserStatus() {
			if (!this.userInfo.loginType) {
				this.$toast("请选择平台")
				return
			}
			let login_type = 1
			if (this.userInfo.loginType !== 1) {
				login_type = 2
			}
			const param = {
				uname_md5: CryptoJS.MD5(this.userInfo.usernamePlatForm).toString(), // 用户名
				pwd_md5: CryptoJS.MD5(this.userInfo.passwordPlatForm).toString(), // 密码
				login_type: login_type
			}
			checkUserStatus(param).then(res => {
				if (res.code === 200) {
					// 获取用户信息
					this.loginInfo.userId = this.userInfo.usernamePlatForm
					this.flag.showServer = true
					if (this.userInfo.loginType === 1) {
						this.saveLoginInfo()
						this.toMain()
						uni.showToast({
							title: '登录成功，请选择服务器后，点击开始挂机。',
							duration: 2000,
							icon: 'none'
						})
					} else {
						this.handleGerServer()
					}
				} else {
					this.flag.newUserFlag = true
					uni.showToast({
						title: '登录失败，请使用登陆助手提取账号密码后再登录。',
						duration: 2000,
						icon: 'none'
					})
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
				sessionid: '88ffe736-0759-8c15-ab26-2d72e0f00c9d',
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
			// console.log(contentObj)
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

		// 登录第一步
		handleLoginFirstStep() {
			const params = {
				username: this.userInfo.usernamePlatForm,
				userpassword: this.userInfo.passwordPlatForm
			}
			const header= {
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
			const secretKey = '23aa164ad29bba78'
			const encryptParams = this.encryptData(params, secretKey)
			acclogin(encryptParams, header).then(resEncrypt => {
				const res = this.decryptData(resEncrypt, secretKey)
				console.log(res)
				if (res.code == 0) {
					this.loginInfo.userId = res.data.account.accountid,
					this.loginInfo.sessionid = res.data.account.sessionid
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
