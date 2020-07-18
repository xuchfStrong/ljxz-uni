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
import { addUser, checkUserStatus, getRemoteOptions } from '@/api/login'
import { genRandomNumber, genUUID, genMac, getValueByIndex, getIndexByValue } from '@/utils/index'
import {mapState,mapMutations} from 'vuex'
import mInput from '../../components/m-input.vue'

export default {
	components:{
		mInput
	},
	data() {
		return {
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
			  platform: 1, // 这个platform用在像辅助添加用户的时候
			  server: '',
			  endTime: '', // 辅助到期时间
			  deviceType: 'vivo+x5s+l',
			  site: 'jqcm_android',
			  mac: '',
			  uid: '',
			  sessionid: '',
			  adid: '',
			  udid: '',
			  aid: '',
			  openuidi: '',
			  nickname: '',
			  loginType: 1 // 官方平台：1，taptap：2
			},
			loginInfo: { // 登录过程中需要的数据
				sessionid: '',
				userId: '',
				uid: '', // 渠道登录的时候uid和userId不同
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
			const param = {
				uname_md5: CryptoJS.MD5(this.userInfo.usernamePlatForm).toString(), // 用户名
				pwd_md5: CryptoJS.MD5(this.userInfo.passwordPlatForm).toString(), // 密码
				login_type: this.userInfo.loginType
			}
			checkUserStatus(param).then(res => {
				if (res.code === 200) {
					// 获取用户信息
					// this.loginInfo.userId = res.userid
					this.loginInfo.userId = this.userInfo.usernamePlatForm
					this.flag.showServer = true
					this.saveLoginInfo()
					this.toMain()
					uni.showToast({
						title: '登录成功，请选择服务器后，点击开始挂机。',
						duration: 2000,
						icon: 'none'
					})
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
        this.loginInfo.userId = gameLoginInfo.userId
				this.flag.showServer = gameLoginInfo.showServer
				this.platformName = gameLoginInfo.platformName
				this.serverInfo = gameLoginInfo.serverInfo
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
