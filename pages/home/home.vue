<template>
	<view class="content">		
		<view v-if="flag.showServer">
		  <view class="list-cell">
		      <view class="uni-list-cell-left">
		          服务器：
		      </view>
		      <view class="uni-list-cell-db">
		          <picker @change="changeLastServer" :value="lastServerIndex" class="bg-picker-douji" range-key="text" :range="serverInfo.last_server_list">
		              <view class="uni-input">{{serverName}}</view>
		          </picker>
		      </view>
		  </view>
			<view class="list-cell">
		      <view class="uni-list-cell-left">
		          收藏的角色：
		      </view>
		      <view class="uni-list-cell-db">
		          <picker @change="changeSavedRoleList" :value="roleIndex" class="bg-picker-douji" range-key="roleName" :range="roleList">
		              <view class="uni-input">{{selectRoleName}}</view>
		          </picker>
		      </view>
		  </view>
		</view>

		<view v-if="!flag.showServer" class="btn-row">
		  <button type="primary" @tap="handleLogin">登录</button>
		</view>
		<view v-else>
			<view class="btn-center btn-center-margin">
				<view>
					<button type="primary" plain="true" size="mini" @tap="transferTime">转移辅助</button>
					<text style="width: 10upx; display: inline-block;"></text>
					<button type="primary" plain="true" size="mini" @tap="loginSwitch">切换账号</button>
					<text style="width: 10upx; display: inline-block;"></text>
					<button type="primary" plain="true" size="mini" @tap="handleGerServer">更新服务器</button>
				</view>
			</view>
			<view  class="btn-center">
				<view>
					<button type="primary" plain="true" size="mini" @tap="handleSaveRole">收藏角色</button>
					<text style="width: 10upx; display: inline-block;"></text>
					<button type="primary" plain="true" size="mini" @tap="handleRemoveRole">移除收藏</button>
					<text style="width: 10upx; display: inline-block;"></text>
					<button type="primary" plain="true" size="mini" @tap="handleClearSaveRole">清空收藏</button>
				</view>
			</view>
		</view>

		<text v-if="utils.showCommon" class="waring-wrap">{{ utils.common }}</text>
		<text v-if="utils.showContact&&wdszSaleChannel==='test'" class="waring-wrap">{{ utils.contact }}</text>
		<text v-if="utils.showContact1&&wdszSaleChannel==='1'" class="waring-wrap">{{ utils.contact1 }}</text>
		<text v-if="utils.showContact2&&wdszSaleChannel==='2'" class="waring-wrap">{{ utils.contact2 }}</text>
		<text v-if="utils.showContact3&&wdszSaleChannel==='3'" class="waring-wrap">{{ utils.contact3 }}</text>
		<text v-if="utils.showContact4&&wdszSaleChannel==='4'" class="waring-wrap">{{ utils.contact4 }}</text>
		<text v-if="utils.showContact5&&wdszSaleChannel==='5'" class="waring-wrap">{{ utils.contact5 }}</text>
		<text v-if="utils.showContact7&&wdszSaleChannel==='7'" class="waring-wrap">{{ utils.contact7 }}</text>
		<text v-if="utils.showContact8&&wdszSaleChannel==='8'" class="waring-wrap">{{ utils.contact8 }}</text>
		<text v-if="utils.showContact31&&wdszSaleChannel==='31'" class="waring-wrap">{{ utils.contact31 }}</text>
		
		
		<view class="uni-divider">
			<view class="uni-divider__content">云挂机</view>
			<view class="uni-divider__line"></view>
		</view>
		
		<view>
			<text>平台：</text>
			<text>{{ this.platformName }}</text>
		</view>
		<view>
			<text>区服：</text>
			<text>{{ serverName }}</text>
		</view>
		<view>
			<text>角色名：</text>
			<text>{{ roleInfo.role_name }}</text>
		</view>
		<view>
			<text>辅助版本类型：</text>
			<text>{{ fuzuStatus.fuzhu_vip | vipStatus }}</text>
		</view>
		<view>
			<text>辅助到期时间：</text>
			<text :class="{danger: fuzuStatus.isExpired}">{{ fuzuStatus.end_time }}</text>
		</view>
		<view v-if="bayeSpecial === 1">
			<text>增强霸业到期时间：</text>
			<text>{{ fuzuStatus.special_baye_endtime }}</text>
		</view>
		<view>
			<text>数据更新时间：</text>
			<text :class="{danger: isPassedTwoHours}">{{ roleInfo.update_time }}</text>
		</view>
		<view class="fuzhu-info">
			<text>续费请提供此ID：</text>
			<text class="content-wrap">{{ loginInfo.userId }}</text>
			<button class="copy-button" type="primary" plain="true" size="mini" @tap="doCopy">复制</button>
		</view>
		<view>
			<text>云挂机状态：</text>
			<text>{{ fuzuStatus.on_off | statusFilter }}</text>
		</view>
		
		<view class="btn-center">
			<view>
				<button v-if="fuzuStatus.on_off" type="warn" size="mini" @tap="handleStopguaji">停止云挂机</button>
				<button v-else type="primary" size="mini" @tap="handleStartguaji">开启云挂机</button>
				<text style="width: 10upx; display: inline-block;"></text>
				<button :loading="statusLoading" :disabled="statusLoading" type="primary" size="mini" @tap="handleGuajiStatus">获取最新数据</button>
			</view>
		</view>

		<view v-for="(displayInfo, displayIndex) in viewConfig.gameInfoConfig" :key="displayIndex">
			<view class="uni-divider">
				<view class="uni-divider__content">{{displayInfo.label}}</view>
				<view class="uni-divider__line"></view>
			</view>
			<view class="attr-flex">
				<view v-for="(item) in viewConfig[displayInfo.key]" :key="item.key" :class="getAttrClass(item.columnSize)">
					<text>{{ item.label }}</text>
					<text>{{ roleInfo[item.key] | valueFormatFilter}}</text>
				</view>
			</view>
		</view>
		
		<view class="uni-divider">
			<view class="uni-divider__content">挂机设置</view>
			<view class="uni-divider__line"></view>
		</view>
		
		<view class="uni-list-no-border">
				<view class="uni-list-cell uni-list-cell-pd-mini">
		      <view class="uni-list-cell-db">领取离线倍数</view>
		      <radio-group @change="radioChangeLixian" class="flex-lixian-item radio-flex">
			      <label class="radio-flex-item" v-for="(item, index) in lixianbeishuList" :key="item.value">
			        <radio :value="item.value" :checked="index === currentLilianBeishu" />{{item.name}}
			      </label>
			    </radio-group>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		      <view class="uni-list-cell-db">领取游历倍数</view>
		      <radio-group @change="radioChangeYouli" class="flex-lixian-item radio-flex">
			      <label class="radio-flex-item" v-for="(item, index) in youlibeishuList" :key="item.value">
			        <radio :value="item.value" :checked="index === currentYouliBeishu" />{{item.name}}
			      </label>
			    </radio-group>
		    </view>

				<view v-for="(item) in viewConfig.switchConfig" :key="item.key" class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">{{item.label}}</view>
		        <switch :checked="!!configInfo[item.key]" @change="changeSwitchBoolean(item.key)"/>
		    </view>

				<view v-for="(item) in viewConfig.pickerSwitchConfig" :key="item.key" class="uni-list-cell-no-border uni-list-cell-pd-mini">
					<view v-if="checkShow(item.special)" class="flex-item-two">
							<view class="uni-list-cell-db">
									<picker @change="changePickerConfig($event, item.key)" :value="configInfo[item.key]" class="background-picker" range-key="text" :range="options[item.key]">
											<view class="uni-input">{{options[item.key][configInfo[item.key]].text}}</view>
									</picker>
							</view>
					</view>
					<view v-if="checkShow(item.special)" class="flex-item-two">
						<view class="uni-list-cell-db">{{item.label}}</view>
		        <switch :checked="!!configInfo[item.key]" @change="changePickerSwith($event,item.key)"/>
					</view>
		    </view>
		</view>
		
		<view class="uni-divider">
			<view class="uni-divider__content">武技设置</view>
			<view class="uni-divider__line"></view>
		</view>

		<view class="douji-wrap">
			<view v-for="(item) in viewConfig.gongfaConfig" :key="item.key" class="list-cell flex-item-two">
		    <view class="douji-list-left">{{ item.label }}</view>
		    <view class="uni-list-cell-db">
		      <picker @change="changeGongfa($event, item.key)" :value="gongfaIndex[item.key]" class="bg-picker-douji"  range-key="text" :range="options.douji">
		          <view :class="{ active: gongfaIndex[item.key] !== 0 }" class="uni-input">{{options.douji[gongfaIndex[item.key]].text}}</view>
		      </picker>
		    </view>
			</view>
		</view>

		<view class="save-btn">
			<button type="primary" size="mini" @tap="handleChangeConfigInfo">保存设置</button>
		</view>
	</view>
</template>

<script>
import CryptoJS from 'crypto-js'
import save from '@/utils/save'
import moment from 'moment'
import { getValueByIndex, getIndexByValue, getChannel, toast } from '@/utils/index'
import { startGuaji, stopGuaji, getServerInfo } from '@/api/game'
import { getRoleInfo, getConfigInfo, changeConfigInfo, getUtils } from '@/api/game'
import mInput from '../../components/m-input.vue'
import pako from 'pako'

export default {
	components:{
		mInput
	},
	filters: {
    statusFilter(status) {
      const statusMap = {
        0: '关闭',
        1: '开启'
      }
      return statusMap[status]
    },
    vipStatus(isVip) {
      const map = {
        0: '普通版',
        1: 'VIP版'
      }
      return map[isVip]
    },
    // 单位换算
    valueFormatFilter(str) {
			if (isNaN(str)) return str
      const numVal = Number(str)
			if (isNaN(numVal)) return ''
			if (numVal < 0) return '未获取到'
      if (numVal > 100000000) {
        return (numVal / 100000000).toFixed(1) + '亿'
      } else if (numVal > 1000000) {
        return (numVal / 10000).toFixed(1) + '万'
      } else {
				return str
			}
    }
  },
	data() {
		return {
			wdszSaleChannel: '',
			socketTask: null,
			platformName: '',
			serverName: '',
			lastServerIndex: 0,
			allServerindex: 0,
			utils: {},
			index: 0,
			current: 0,
			statusLoading: false,
			yunguaji: false,
			bayeSpecial: 0,
			viewConfig: {},
			configInfo: {},
			options: {},
			gongfaObj: {}, // 功法购买相关的配置
			roleInfo: {},
			gongfaIndex: {},
			gongfaKey: [],
			flag: {
			    loginFlag: false,
			    logoutFlag: false,
			    newUserFlag: false,
					showServer: false,
					saveRoleFlag: false
			},
			fuzuStatus: {
        end_time: '',
				special_baye_endtime: '',
				on_off: 0,
				fuzhu_vip: 0,
        isExpired: false
			},
			userInfo: {
			  usernamePlatForm: '', // 平台的用户名
			  passwordPlatForm: '', // 平台的密码
			  platform: 1, // 这个platform用在像辅助添加用户的时候
			  server_id: '',
			  endTime: '', // 辅助到期时间
			  loginType: 1 // 官服：1
			},
			loginInfo: { // 登录过程中需要的数据
				userId: ''
			},
			serverInfo: { // 服务器列表
				client_ip: '',
				server_list: [],
				last_server_list: []
			},
			lixianbeishuList: [
				{value: '0', name: '一倍'},
				{value: '1', name: '两倍'},
				{value: '2', name: '五倍'}
			],
			youlibeishuList: [
				{value: '0', name: '一倍'},
				{value: '1', name: '两倍'}
			],
			roleList: [
				// { roleName: "可爱柳玉龙",userId: 35635086, platformName: '官方平台-安卓', loginType: 1, serverId: 1, serverName: "斗气1服"},
				// { roleName: "怯懦宰晓霜",userId: 35635086, platformName: '官方平台-安卓', loginType: 1, serverId: 4, serverName: "斗气4服"}
			],
			roleIndex: 0,
			selectRoleName: '',
			autocompleteStringList: []
		}
	},
	computed: {
		// 更新时间是否超过2小时
    isPassedTwoHours() {
      const a = moment(new Date())
      const b = moment(this.roleInfo.update_time)
      const duration = a.diff(b)
      return duration > 2 * 3600 * 1000
    },

		showSpecial() {
			return this.bayeSpecial
		},
		
		// 当前选中的离线倍数index
		currentLilianBeishu() {
			return this.lixianbeishuList.findIndex(item => {
				return Number(item.value) === this.configInfo.lixianbeishu
			})
		},

		// 当前选中的游历倍数index
		currentYouliBeishu() {
			return this.youlibeishuList.findIndex(item => {
				return Number(item.value) === this.configInfo.youlisifang_beishu
			})
		}
	},
	onLoad() {
		this.viewConfig = getApp().globalData.viewConfig
		this.configInfo = Object.assign({}, getApp().globalData.viewConfig.configInfoDefault)
		this.roleInfo = Object.assign({}, getApp().globalData.viewConfig.roleInfoDefault)
		this.gongfaIndex = Object.assign({}, getApp().globalData.viewConfig.gongfaIndex)
		this.options = getApp().globalData.viewConfig.options
		this.initGongfaConfig()
		this.wdszSaleChannel = getChannel()
		this.loadLoginInfo()
		this.handleGetServerList()
		this.handleGetUtils()
	},
	methods: {
		handleLogin() {
			uni.reLaunch({
			    url: '../login/login'
			})
		},
		loginSwitch() {
			uni.navigateTo({
			    url: '../login/login'
			})
		},

		transferTime() {
			uni.navigateTo({
			    url: '../transfer/transfer'
			})
		},

		handleGetUtils() {
      getUtils().then(res => {
				this.utils = res
				if (this.$global.ljxzVersion < res.version) {
					uni.showTabBarRedDot({
						index: 3
					})
				}
      }).catch(err => {
        console.log(err)
      })
		},

		// 收藏角色到本地
		handleSaveRole() {
			if (!this.flag.saveRoleFlag) {
				toast('角色信息错误，收藏失败！')
				return
			}
			const saveRoleObj = {
				roleName: this.roleInfo.role_name + '-' + this.serverName,
				userId: this.loginInfo.userId,
				platformName: this.platformName,
				loginType: this.userInfo.loginType,
				serverId: this.userInfo.server_id,
				serverName: this.serverName
			}
			const indexRole = this.roleList.findIndex((item) => {
				return item.roleName === saveRoleObj.roleName
			})
			if (indexRole === -1) {
				this.roleList.unshift(saveRoleObj)
			} else {
				this.roleList[indexRole] = saveRoleObj
			}
			this.saveRoleInfo()
			uni.showToast({
				title: '收藏成功',
				duration: 2000,
				icon: 'none'
			})
		},

		// 删除收藏的角色
		handleRemoveRole() {
			const roleName = this.roleInfo.role_name + '-' + this.serverName
			const indexRole = this.roleList.findIndex((item) => {
				return item.roleName === roleName
			})
			if (indexRole === -1) {
				uni.showToast({
					title: '收藏列表无该角色',
					duration: 2000,
					icon: 'none'
				})
			} else {
				this.roleList.splice(indexRole, 1)
				this.saveRoleInfo()
				uni.showToast({
					title: '移除成功',
					duration: 2000,
					icon: 'none'
				})
			}
		},

		// 清空收藏角色
		handleClearSaveRole() {
			this.roleList = []
			this.saveRoleInfo()
			uni.showToast({
				title: '清空成功',
				duration: 2000,
				icon: 'none'
			})
		},

		// 初始化功法配置
		initGongfaConfig() {
			const gongfaConfig = getApp().globalData.viewConfig.gongfaConfig
			if (gongfaConfig.length > 0) {
				gongfaConfig.forEach(item => {
					this.gongfaKey.push(item.key)
				})
			}
		},

		// 读取记住的登录信息
		loadLoginInfo() {
			uni.setNavigationBarTitle({
					title: '武道神尊火箭辅助V' + this.$global.wdszVersionName
			});
			console.log('加载登录信息')
			this.roleList = save.getRoleList()
			const gameLoginInfo = save.getGameLoginInfo()
			if (gameLoginInfo.serverInfo) {
				this.serverInfo = gameLoginInfo.serverInfo
			}
			this.userInfo.platform = gameLoginInfo.platform
			this.userInfo.server_id = gameLoginInfo.server_id
			this.userInfo.usernamePlatForm = gameLoginInfo.usernamePlatForm
			this.userInfo.passwordPlatForm = gameLoginInfo.passwordPlatForm
			this.userInfo.loginType = gameLoginInfo.loginType
			this.loginInfo.userId = gameLoginInfo.userId
			this.platformName = gameLoginInfo.platformName
			this.flag.showServer = gameLoginInfo.showServer
			if (Array.isArray(gameLoginInfo.autocompleteStringList)) this.autocompleteStringList = gameLoginInfo.autocompleteStringList
			this.initSaveData()
			this.handleGuajiStatus()
		},
		// 存储登录信息到LocalStorage
		saveLoginInfo() {
			const gameLoginInfo = {
				platform: this.userInfo.platform,
				server_id: this.userInfo.server_id,
				usernamePlatForm: this.userInfo.usernamePlatForm,
				passwordPlatForm: this.userInfo.passwordPlatForm,
				loginType: this.userInfo.loginType,
				userId: this.loginInfo.userId,
				showServer: this.flag.showServer,
				platformName: this.platformName,
				serverInfo: this.serverInfo,
				autocompleteStringList: this.autocompleteStringList
			}
			save.setGameLoginInfo(gameLoginInfo)
		},
		
		// 存储收藏的角色
		saveRoleInfo() {
			save.setRoleList(this.roleList)
		},

		// 加载后将存储的数据显示出来
		initSaveData() {
			const lastServerIndex = this.getIndexByServerId(this.serverInfo.last_server_list, this.userInfo.server_id)
			if (lastServerIndex !== -1) {
				this.lastServerIndex = lastServerIndex
				this.serverName = this.serverInfo.last_server_list[this.lastServerIndex].text
			}
		},

		getIndexByServerId(option, server_id) {
			if (option) {
				const index = option.findIndex(item => {
					return item.server_id === server_id
				})
				// console.log('lastServerIndex', index, 'server_id', server_id)
				return index
			}
		},

		getServerIdByIndex(options,index) {
			if (options) {
				const server_id =  options[index]['server_id']
				// console.log('server_id', server_id, 'index', index)
				return server_id
			}
		},

		// 选择保存的角色
		changeSavedRoleList(e) {
			this.selectRoleName = this.roleList[e.target.value]['roleName']
			this.loginInfo.userId = this.roleList[e.target.value]['userId']
			this.userInfo.server_id = this.roleList[e.target.value]['serverId']
			this.userInfo.loginType = this.roleList[e.target.value]['loginType']
			this.platformName = this.roleList[e.target.value]['platformName']
			this.handleGetServerList()
			this.initSaveData()
			this.handleGuajiStatus()
			this.saveLoginInfo()
		},

		// 选择最后登录服务器
		changeLastServer: function(e) {
			// console.log('this.lastServerIndex', this.lastServerIndex)
			// console.log('e', e)
			// console.log('e.target.value', e.target.value)
			// console.log('seerverName', this.serverName)
			this.userInfo.server_id = this.getServerIdByIndex(this.serverInfo.last_server_list, e.target.value)
			this.lastServerIndex = e.target.value
			this.serverName = this.serverInfo.last_server_list[this.lastServerIndex].text
			this.saveLoginInfo()
			this.handleGuajiStatus()
		},
		// 选择所以登录服务器
		changeAllServer: function(e) {
			this.userInfo.server_id = getValueByIndex(this.serverInfo.server_list, e.target.value)
			this.allServerindex = e.target.value
			this.lastServerIndex = getIndexByValue(this.serverInfo.last_server_list, this.userInfo.server_id)
			this.saveLoginInfo()
		},


		// 获取服务器
		handleGerServer() {
			this.handleGetServerList()
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
			const contentObj = JSON.parse(pako.inflate(content, { to: 'string' }))
			// console.log(contentObj)
			if (optCode === 16002) {
				this.serverInfo.last_server_list = this.formatServerList(contentObj.SvrList)
				this.saveLoginInfo()
				uni.showToast({
					title: '更新服务器成功。',
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

		// 更新服务器列表
    handleGetServerList() {
			const params = {
				login_type: this.userInfo.loginType
			}
			getServerInfo(params).then(res => {
				this.serverInfo.last_server_list = res.server.guanfu
			}).catch(err => {
				console.log(err)
			})
		},
		
		// 获取挂机状态
    handleGuajiStatus() {
      if (!this.loginInfo.userId) {
				uni.showToast({
					title: '没有获取到登录的用户信息，请重新登录。',
					duration: 2000,
					icon: 'none'
				})
        return
			}
			if (!this.userInfo.server_id) {
				const verifyCodePassowrd = this.$store.state.verifyCodePassowrd
				let content = '请选择服务器'
				if (verifyCodePassowrd) {
					content = `请选择服务器,请妥善保管您的辅助密码：${verifyCodePassowrd}，后面可以用该密码登录辅助，转移辅助。`
				}
				uni.showModal({
					title: '提示',
					content: content,
					showCancel: false,
					confirmText: '好的',
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
        return
			}
      const param = {
        userid: this.loginInfo.userId,
				server_id: this.userInfo.server_id,
				t: new Date().getTime()
			}
			this.statusLoading = true
      getRoleInfo(param).then(res => { // 查询角色信息
				const code = res.code
				this.statusLoading = false
        switch (code) {
          case 200:
            this.roleInfo = res.data
						this.yunguaji = true
						this.flag.saveRoleFlag = true
						uni.showToast({
							title: '查询挂机状态成功',
							duration: 2000,
							icon: 'none'
						})
            break
          case 403:
						this.flag.saveRoleFlag = false
						uni.showToast({
							title: '参数错误',
							duration: 2000,
							icon: 'none'
						})
            break
          case 404:
						this.yunguaji = false
						console.log('404')
						this.flag.saveRoleFlag = false
						this.roleInfo = Object.assign({}, roleInfoDefault)
						uni.showToast({
							title: '未查询到挂机信息，请开启云挂机111',
							duration: 2000,
							icon: 'none'
						})
            break
        }
      }).catch(err => {
				this.flag.saveRoleFlag = false
        console.log(err)
      })
      this.handleGetConfigInfo()
    },

    // 查询配置信息
    handleGetConfigInfo() {
      if (!this.loginInfo.userId || !this.userInfo.server_id) {
				uni.showToast({
					title: '没有获取到登录的用户信息，请重新登录',
					duration: 2000,
					icon: 'none'
				})
        return
      }
      const param = {
        userid: this.loginInfo.userId,
				server_id: this.userInfo.server_id,
				t: new Date().getTime()
			}
      getConfigInfo(param).then(res => {
        const code = res.code
        switch (code) {
          case 200:
						this.configInfo = this.correctConfig(res.data.setting_content)
						this.fuzuStatus.fuzhu_vip = res.data.fuzhu_vip
						this.fuzuStatus.on_off = res.data.on_off
						this.fuzuStatus.special_baye_endtime = res.data.special_baye_endtime
						this.bayeSpecial = res.data.special_baye
						this.calsIsExpired(res.data.end_time)
						this.calcdouji_goumai(String(res.data.setting_content.douji_goumai))
						this.changeSpecialBayeOptioon(this.bayeSpecial)
            // this.calcdouji_goumai(String(111210101013))
            break
          case 403:
						uni.showToast({
							title: '参数错误',
							duration: 2000,
							icon: 'none'
						})
            break
          case 404:
            this.yunguaji = false
						uni.showToast({
							title: '未查询到挂机信息，请开启云挂机',
							duration: 2000,
							icon: 'none'
						})
						this.fuzuStatus.on_off = 0
            this.configInfo = Object.assign({}, configInfoDefault)
            break
        }
      }).catch(err => {
        console.log(err)
      })
    },

		// 将后台没返回的设置想设置默认值
		correctConfig(configInfoBackend) {
			const configInfo = Object.assign({}, this.viewConfig.configInfoDefault)
      for (const key in configInfo) {
        if (configInfoBackend.hasOwnProperty(key)) {
          configInfo[key] = configInfoBackend[key]
        }
      }
      return configInfo
		},

		// 修改配置项是0和1的情况
		changeSwitchBoolean(item) {
			if (this.configInfo[item]) {
				this.configInfo[item] = 0
			} else {
				this.configInfo[item] = 1
			}
		},

		// 改变picker选项
		changePickerConfig(e, configKey) {
			const index = e.target.value
			this.configInfo[configKey] = index
		},

		// 修改下拉选项后面的开关
		changePickerSwith(e, configKey) {
			const checked = e.target.value
			if (!checked) {
				this.configInfo[configKey] = 0
			} else {
				this.$toast('请选择左侧列表中选项')
			}
		},

		// 改变功法相关的picker
		changeGongfa(e, gongfaKey) {
			const index = e.target.value
			this.gongfaIndex[gongfaKey] = index
		},

    /**
     * 计算斗技购买的各种属性
     * 总共12为数字每两位表示一个属性，从前到后是攻击，生命，物防，法防，残页，绝学
     * 两位数字是10-22之间，表示购买不同价格的斗技
     */
    calcdouji_goumai(cfgStr) {
      if (isNaN(cfgStr)) cfgStr = "101010101010"
			this.gongfaKey.forEach((item, index) => {
				const gf = cfgStr.slice(index * 2, 2 + index * 2)
				this.gongfaIndex[item] = parseInt(gf) - 10
			})
    },

    // 从购买斗技的对象中生成购买斗技的配置数据发到后端
    gendouji_goumaiCfg() {
      let gongfaCalc = ''
			this.gongfaKey.forEach(item => {
				const gfstr = String(this.gongfaIndex[item] + 10)
				gongfaCalc = gongfaCalc + gfstr
			})
			return gongfaCalc
    },

    // 计算辅助到期时间
    calsIsExpired(endTime) {
      const isExpired = moment(endTime).isBefore(new Date())
      if (isExpired) {
        this.fuzuStatus.isExpired = true
        this.fuzuStatus.end_time = '已经过期，请购买！'
      } else {
        this.fuzuStatus.isExpired = false
        this.fuzuStatus.end_time = endTime
      }
    },

    // 修改配置信息
    handleChangeConfigInfo() {
      this.configInfo.douji_goumai = this.gendouji_goumaiCfg()
      const param = {
        userid: this.loginInfo.userId,
        server_id: this.userInfo.server_id,
				pwd_md5: CryptoJS.MD5(this.userInfo.passwordPlatForm).toString(),
				on_off: this.fuzuStatus.on_off,
        setting_content: this.configInfo
      }
      changeConfigInfo(param).then(res => {
        const code = res.code
        switch (code) {
          case 200:
            this.handleGetConfigInfo()
						uni.showToast({
							title: '修改成功',
							duration: 2000,
							icon: 'none'
						})
            break
          case 403:
						uni.showToast({
							title: '参数错误',
							duration: 2000,
							icon: 'none'
						})
            break
          case 404:
            this.yunguaji = false
						uni.showToast({
							title: '未查询到挂机信息，请开启云挂机',
							duration: 2000,
							icon: 'none'
						})
            break
        }
      }).catch(err => {
        console.log(err)
      })
    },

    // 开始云挂机
    handleStartguaji() {
      if (!this.loginInfo.userId || !this.userInfo.server_id) {
				uni.showToast({
					title: '没有获取到登录的用户信息，请重新登录',
					duration: 2000,
					icon: 'none'
				})
        return
      }
      const param = {
        userid: this.loginInfo.userId,
        server_id: this.userInfo.server_id,
        pwd_md5: CryptoJS.MD5(this.userInfo.passwordPlatForm).toString()
      }
      startGuaji(param).then(res => {
        const code = res.code
        switch (code) {
          case 200:
						uni.showToast({
							title: '挂机成功，请15秒后查询挂机状态',
							duration: 2000,
							icon: 'none'
						})
            this.handleGuajiStatus()
            break
          case 300:
						uni.showToast({
							title: '新用户挂机成功，请15秒后查询挂机状态',
							duration: 2000,
							icon: 'none'
						})
            break
          case 403:
						uni.showToast({
							title: '挂机失败，请重新登录后重试',
							duration: 2000,
							icon: 'none'
						})
            break
        }
        const self = this
        setTimeout(function() {
          self.handleGuajiStatus()
        }, 15000)
      })
    },

    // 停止云挂机
    handleStopguaji() {
      const param = {
        userid: this.loginInfo.userId,
        server_id: this.userInfo.server_id,
        pwd_md5: CryptoJS.MD5(this.userInfo.passwordPlatForm).toString()
      }
      stopGuaji(param).then(res => {
        const code = res.code
        switch (code) {
          case 200:
            this.handleGuajiStatus()
						uni.showToast({
							title: '停止挂机成功',
							duration: 2000,
							icon: 'none'
						})
            break
          case 403:
						uni.showToast({
							title: '操作失败',
							duration: 2000,
							icon: 'none'
						})
            break
          case 404:
						uni.showToast({
							title: '操作失败',
							duration: 2000,
							icon: 'none'
						})
            break
        }
      })
		},
		
		doCopy() {
			if (!this.userInfo.server_id || !this.loginInfo.userId) {
				toast("复制失败,没有选择服务器或者没有登录")
				return
			}
			const cpText = `服务器:${this.userInfo.server_id},续费ID:${this.loginInfo.userId},游戏:wdsz`
			// #ifdef APP-PLUS
			uni.setClipboardData({
				data: String(cpText),
				success: function () {
					toast("复制成功,可用于辅助续费充值")
				}
			})
			// #endif
			// #ifdef H5
			this.$copyText(cpText).then(
        res => {
          toast("复制成功,可用于辅助续费充值")
        },
        err => {
          toast("复制失败")
        }
			)
			// #endif
		},

		radioChangeLixian(evt) {
			this.configInfo.lixianbeishu = Number(evt.target.value)
			switch (Number(evt.target.value)) {
				case 0:
					uni.showToast({
						title: '选择一倍，免费',
						duration: 2000,
						icon: 'none'
					})
					break
				case 1:
					uni.showToast({
						title: '选择两倍，要钻石',
						duration: 2000,
						icon: 'none'
					})
					break
				case 2:
					uni.showToast({
						title: '选择五倍，要钻石',
						duration: 2000,
						icon: 'none'
					})
          break
			}
		},

		radioChangeYouli(evt) {
			this.configInfo.youlisifang_beishu = Number(evt.target.value)
			switch (Number(evt.target.value)) {
				case 0:
					uni.showToast({
						title: '选择一倍，免费',
						duration: 2000,
						icon: 'none'
					})
					break
				case 1:
					uni.showToast({
						title: '选择两倍，要钻石',
						duration: 2000,
						icon: 'none'
					})
					break
			}
		},

		getAttrClass(columnSize) {
			if (columnSize === 1) {
				return 'attr-flex-item-1'
			} else if (columnSize === 2) {
				return 'attr-flex-item-2'
			} else {
				return 'attr-flex-item-3'
			}
		},

		checkShow(special) {
			if (!special) {
				return true
			} else {
				return this.bayeSpecial
			}
		},

		changeSpecialBayeOptioon(bayeSpecial) {
			if (bayeSpecial === 2 && this.options.is_special_baye.length === 3) {
				this.options.is_special_baye.push({"value": 3,"text": "跟随二生三"})
				this.options.is_special_baye.push({"value": 4,"text": "跟随专一"})
				this.options.is_special_baye.push({"value": 5,"text": "跟随午一"})
				this.options.special_baye_option.push({"value": 5,"text": "跟随二生三"})
				this.options.special_baye_option.push({"value": 6,"text": "跟随专一"})
				this.options.special_baye_option.push({"value": 7,"text": "跟随午一"})
			}
		}
	}
}
</script>

<style lang="css">
	.background-picker .uni-input{
		background: #ebedf0 !important;
		padding: 5upx 25upx;
		overflow: hidden;
	}
	.bg-picker-douji .uni-input{
		background: #ebedf0 !important;
		padding: 5upx 10upx;
		margin: 10upx;
		overflow: hidden;
	}
</style>
<style lang="css" scoped>
.douji-wrap {
	background: #ffffff;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
}
.douji-list-left {
	font-size:28upx;
}
.active {
	color: #1989fa;
}
.btn-center {
	display: flex;
	align-items: center;
	justify-content: center;
}
.btn-center-margin {
	margin-top: 20upx;
}
.attr-flex {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.attr-flex-item-3 {
	flex: 0 0 33%;
}
.attr-flex-item-2 {
	flex: 0 0 48%;
}
.attr-flex-item-1 {
	flex: 1;
}
.flex-lixian-item {
	flex: 0 0 65%;
}
.list-cell {
	display: flex;
	flex: 1;
	flex-basis: auto;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.content .uni-list-cell-left {
	flex: 0 0 25%;
	text-align: right;
}
.flex-item-two {
	display: flex;
	flex: 0 0 48%;
}
.radio-flex {
	display: flex;
}
.radio-flex-item {
	flex: 0 0 32%;
}
.uni-list-no-border {
	background-color: #FFFFFF;
	position: relative;
/* 	width: 100%; */
	display: flex;
	flex-direction: column;
}
.uni-list-cell-no-border {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.uni-list-cell-pd-mini {
	padding: 5upx 30upx 5upx 10upx;
}
.danger {
  color: red;
}
.save-btn{
	margin: 50upx;
	text-align: center;
}
.waring-wrap {
  color: red;
  margin-top: 10upx;
  white-space: pre-line;
}
.content-wrap {
	user-select: text;
}
.fuzhu-info {
	display: flex;
	align-items: center;
}
.copy-button {
	margin-left:40upx;
}
</style>
