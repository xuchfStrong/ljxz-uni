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
			<!-- <view class="list-cell">
			    <view class="uni-list-cell-left">
			        所有服务器：
			    </view>
			    <view class="uni-list-cell-db">
		          <picker @change="changeLastServer" :value="lastServerIndex" class="bg-picker-douji" range-key="text" :range="serverInfo.last_server_list">
		              <view class="uni-input">{{serverName}}</view>
		          </picker>
		      </view>
			</view> -->
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
		
		<view class="uni-divider">
			<view class="uni-divider__content">角色信息</view>
			<view class="uni-divider__line"></view>
		</view>
		
		<view class="attr-flex">
			<view class="attr-flex-item">
				<text>境界：</text>
				<text>{{ roleInfo.role_level | jingjieFilter }}</text>
			</view>
			<view class="attr-flex-item">
				<text>关卡：</text>
				<text>{{ roleInfo.guanqia }}</text>
			</view>
			<view class="attr-flex-item">
				<text>钻石：</text>
				<text>{{ roleInfo.jingzuan }}</text>
			</view>
			<view class="attr-flex-item">
				<text>灵气：</text>
				<text>{{ roleInfo.douqi | valueFormatFilter }}</text>
			</view>
			<view class="attr-flex-item">
				<text>金币：</text>
				<text>{{ roleInfo.jinbi | valueFormatFilter }}</text>
			</view>
			<view class="attr-flex-item">
				<text>仙液：</text>
				<text>{{ roleInfo.huoneng | valueFormatFilter }}</text>
			</view>
			<view class="attr-flex-item">
				<text>炎帝征途：</text>
				<text>{{ roleInfo.zhuzai_level }}</text>
			</view>
			<view class="attr-flex-item">
				<text>主宰层数：</text>
				<text>{{ roleInfo.bazhu_cengshu }}</text>
			</view>
			<view class="attr-flex-item">
			</view>
			<!-- <view>
				<text>VIP经验：</text>
				<text>{{ notGetChargeValue ? '未获取到':roleInfo.charge_value }}，</text>
        <text v-if="!notGetChargeValue">还差{{ vipUpValue }}升级到VIP{{ roleInfo.vip_level + 1 }}</text>
			</view> -->
		</view>
		
		<view class="uni-divider">
			<view class="uni-divider__content">活动次数</view>
			<view class="uni-divider__line"></view>
		</view>
		
		<view class="attr-flex">
			<view class="attr-flex-item">
				<text>冥殿来袭：</text>
				<text>{{ roleInfo.hundianlaixi_times }}</text>
			</view>
			<view class="attr-flex-item">
				<text>遗迹开采：</text>
				<text>{{ roleInfo.yijikaicai_times }}</text>
			</view>
			<view class="attr-flex-item">
				<text>遗迹进攻：</text>
				<text>{{ roleInfo.yijijingong_times }}</text>
			</view>
			<view class="attr-flex-item">
				<text>竞技排行：</text>
				<text>{{ roleInfo.doupoqiangbang_times }}</text>
			</view>
			<view class="attr-flex-item">
				<text>联盟捐献：</text>
				<text>{{ roleInfo.lianmengjuanxian_times }}</text>
			</view>
			<view class="attr-flex-item">
				<text>联盟秘境：</text>
				<text>{{ roleInfo.lianmengmijing_times }}</text>
			</view>
			<view class="attr-flex-item">
				<text>燚火剩余：</text>
				<text>{{ roleInfo.yihuo_times }}</text>
			</view>
			<view class="attr-flex-item">
				<text>燚火购买：</text>
				<text>{{ roleInfo.yihuo_buy_times }}</text>
			</view>
			<view class="attr-flex-item">
				<text>霸业军令：</text>
				<text>{{ roleInfo.baye_order }}</text>
			</view>
		</view>

		<view class="uni-divider">
			<view class="uni-divider__content">势力信息</view>
			<view class="uni-divider__line"></view>
		</view>

		<view class="attr-flex">
			<view class="attr-flex-item">
				<text>体力：</text>
				<text>{{ roleInfo.shili_tili }}</text>
			</view>
			<view class="attr-flex-item">
				<text>倍数：</text>
				<text>{{ roleInfo.shili_beishu }}</text>
			</view>
			<view class="attr-flex-item">
				<text>钻石每天：</text>
				<text>{{ roleInfo.shili_zuanshi }}</text>
			</view>
		</view>
		<view>
			<text>位置：</text>
			<text :class="{danger: isNoShili}">{{ roleInfo.shili_weizhi | shiliFilter }}</text>
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
		    <view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">升仙灵池</view>
		        <switch :checked="!!configInfo.is_shenghuojing" @change="changeSwitchBoolean('is_shenghuojing')"/>
		    </view>
		    <view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">自动冥帝(普通版是遇到了才会打一下)</view>
		        <switch :checked="!!configInfo.is_hundi" @change="changeSwitchBoolean('is_hundi')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">自动关卡(关闭则增加炎帝次数)</view>
		        <switch :checked="!!configInfo.is_guanqia" @change="changeSwitchBoolean('is_guanqia')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">自动炎帝(关闭则增加关卡次数)</view>
		        <switch :checked="!!configInfo.is_yandi" @change="changeSwitchBoolean('is_yandi')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">自动试炼副本(关闭炎帝和关卡才增加次数)</view>
		        <switch :checked="!!configInfo.is_tianmu" @change="changeSwitchBoolean('is_tianmu')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">自动领邮件</view>
		        <switch :checked="!!configInfo.is_mail" @change="changeSwitchBoolean('is_mail')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">试炼副本购买-金币</view>
		        <switch :checked="!!configInfo.is_buy_tianmu_jinbi" @change="changeSwitchBoolean('is_buy_tianmu_jinbi')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">试炼副本购买-陨铁</view>
		        <switch :checked="!!configInfo.is_buy_tianmu_xuantie" @change="changeSwitchBoolean('is_buy_tianmu_xuantie')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">试炼副本购买-进阶丹</view>
		        <switch :checked="!!configInfo.is_buy_tianmu_jinjiedan" @change="changeSwitchBoolean('is_buy_tianmu_jinjiedan')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">试炼副本购买-转生丹</view>
		        <switch :checked="!!configInfo.is_buy_tianmu_zhuanshengdan" @change="changeSwitchBoolean('is_buy_tianmu_zhuanshengdan')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">试炼副本购买-玄晶</view>
		        <switch :checked="!!configInfo.is_buy_tianmu_xuanjing" @change="changeSwitchBoolean('is_buy_tianmu_xuanjing')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">自动冥殿来袭</view>
		        <switch :checked="!!configInfo.is_hundianlaixi" @change="changeSwitchBoolean('is_hundianlaixi')"/>
		    </view>
        <view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">自动一次一次买燚火次数</view>
		        <switch :checked="!!configInfo.is_buy_yihuo" @change="changeSwitchBoolean('is_buy_yihuo')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">自动换高收入势力(VIP有效)</view>
		        <switch :checked="!!configInfo.is_change_shili" @change="changeSwitchBoolean('is_change_shili')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">自动清理势力外盟人员(VIP有效)</view>
		        <switch :checked="!!configInfo.is_beat_shili" @change="changeSwitchBoolean('is_beat_shili')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">自动炼丹</view>
		        <switch :checked="!!configInfo.is_liandan" @change="changeSwitchBoolean('is_liandan')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">自动联盟秘境</view>
		        <switch :checked="!!configInfo.is_lianmengmijing" @change="changeSwitchBoolean('is_lianmengmijing')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">21:30之后自动竞技排行剩余次数</view>
		        <switch :checked="!!configInfo.is_doupoqiangbang" @change="changeSwitchBoolean('is_doupoqiangbang')"/>
		    </view>
				<view class="uni-list-cell uni-list-cell-pd-mini">
		        <view class="uni-list-cell-db">21:00后自动刷新使用完燚火次数</view>
		        <switch :checked="!!configInfo.is_refresh_yihuo" @change="changeSwitchBoolean('is_refresh_yihuo')"/>
		    </view>


				<view class="uni-list-cell-no-border uni-list-cell-pd-mini">
					<view class="flex-item-two">
							<view class="uni-list-cell-db">
									<picker @change="changePickerYouli" :value="configInfo.youlisifang_id" class="background-picker" range-key="text" :range="options.youlisifang">
											<view class="uni-input">{{options.youlisifang[configInfo.youlisifang_id].text}}</view>
									</picker>
							</view>
					</view>
					<view class="flex-item-two">
						<view class="uni-list-cell-db">自动游历四方</view>
		        <switch :checked="!!configInfo.youlisifang_id" @change="changeSwitchYouli"/>
					</view>
		    </view>

				<view class="uni-list-cell-no-border uni-list-cell-pd-mini">
					<view class="flex-item-two">
							<view class="uni-list-cell-db">
									<picker @change="changePickerLMJS" :value="configInfo.lianmengjianshe_type" class="background-picker" range-key="text" :range="options.lianmengjianshe_type">
											<view class="uni-input">{{options.lianmengjianshe_type[configInfo.lianmengjianshe_type].text}}</view>
									</picker>
							</view>
					</view>
					<view class="flex-item-two">
						<view class="uni-list-cell-db">自动联盟建设</view>
		        <switch :checked="!!configInfo.lianmengjianshe_type" @change="changeSwitchXMJS"/>
					</view>
		    </view>

				<view class="uni-list-cell-no-border uni-list-cell-pd-mini">
					<view class="flex-item-two">
							<view class="uni-list-cell-db">
									<picker @change="changePickerYJKC" :value="configInfo.yiji_kaicai_type" class="background-picker" range-key="text" :range="options.yiji_kaicai_type">
											<view class="uni-input">{{options.yiji_kaicai_type[configInfo.yiji_kaicai_type].text}}</view>
									</picker>
							</view>
					</view>
					<view class="flex-item-two">
						<view class="uni-list-cell-db">自动开采遗迹</view>
		        <switch :checked="!!configInfo.yiji_kaicai_type" @change="changeSwitchYJKC"/>
					</view>
		    </view>

				<view class="uni-list-cell-no-border uni-list-cell-pd-mini">
					<view class="flex-item-two">
							<view class="uni-list-cell-db">
									<picker @change="changePickerYJQD" :value="configInfo.yiji_jingong_type" class="background-picker" range-key="text" :range="options.yiji_jingong_type">
											<view class="uni-input">{{yijiJingongText}}</view>
									</picker>
							</view>
					</view>
					<view class="flex-item-two">
						<view class="uni-list-cell-db">自动抢夺遗迹</view>
		        <switch :checked="!!configInfo.yiji_jingong_type" @change="changeSwitchYJQD"/>
					</view>
		    </view>

        <view class="uni-list-cell-no-border uni-list-cell-pd-mini">
					<view class="flex-item-two">
							<view class="uni-list-cell-db">
									<picker @change="changePickerYihuo" :value="configInfo.yihuo_type" class="background-picker" range-key="text" :range="options.yihuo">
											<view class="uni-input">{{options.yihuo[configInfo.yihuo_type].text}}</view>
									</picker>
							</view>
					</view>
					<view class="flex-item-two">
						<view class="uni-list-cell-db">自动挑战燚火</view>
		        <switch :checked="!!configInfo.yihuo_type" @change="changeSwitchYihuo"/>
					</view>
		    </view>

				<view class="uni-list-cell-no-border uni-list-cell-pd-mini">
					<view class="flex-item-two">
							<view class="uni-list-cell-db">
									<picker @change="changePickerGongxun" :value="configInfo.buy_gongxun_id" class="background-picker" range-key="text" :range="options.buy_gongxun_id">
											<view class="uni-input">{{options.buy_gongxun_id[configInfo.buy_gongxun_id].text}}</view>
									</picker>
							</view>
					</view>
					<view class="flex-item-two">
						<view class="uni-list-cell-db">功勋商店购买</view>
		        <switch :checked="!!configInfo.buy_gongxun_id" @change="changeSwitchGongxun"/>
					</view>
		    </view>

				<view class="uni-list-cell-no-border uni-list-cell-pd-mini">
					<view class="flex-item-two">
							<view class="uni-list-cell-db">
									<picker @change="changeBuyYuntie" :value="configInfo.buy_yuntie" class="background-picker" range-key="text" :range="options.buy_yuntie">
											<view class="uni-input">{{options.buy_yuntie[configInfo.buy_yuntie].text}}</view>
									</picker>
							</view>
					</view>
					<view class="flex-item-two">
						<view class="uni-list-cell-db">自动购买陨铁</view>
		        <switch :checked="!!configInfo.buy_yuntie" @change="changeSwitchYuntie"/>
					</view>
		    </view>

				<view class="uni-list-cell-no-border uni-list-cell-pd-mini">
					<view class="flex-item-two">
							<view class="uni-list-cell-db">
									<picker @change="changeBuyBaye" :value="configInfo.is_baye" class="background-picker" range-key="text" :range="options.is_baye">
											<view class="uni-input">{{options.is_baye[configInfo.is_baye].text}}</view>
									</picker>
							</view>
					</view>
					<view class="flex-item-two">
						<view class="uni-list-cell-db">自动霸业(VIP有效)</view>
		        <switch :checked="!!configInfo.is_baye" @change="changeSwitchBaye"/>
					</view>
		    </view>

				<view class="uni-list-cell-no-border uni-list-cell-pd-mini">
					<view class="flex-item-two">
							<view class="uni-list-cell-db">
									<picker @change="changeWushenshilian" :value="configInfo.wushenshilian_id" class="background-picker" range-key="text" :range="options.wushenshilian_id">
											<view class="uni-input">{{options.wushenshilian_id[configInfo.wushenshilian_id].text}}</view>
									</picker>
							</view>
					</view>
					<view class="flex-item-two">
						<view class="uni-list-cell-db">武神试炼</view>
		        <switch :checked="!!configInfo.wushenshilian_id" @change="changeSwitchWushenshilian"/>
					</view>
		    </view>


				<!-- <view class="uni-list-cell-no-border uni-list-cell-pd-mini">
					<view class="flex-item-two">
							<view class="uni-list-cell-db">
									<picker @change="changePickerDouji" :value="configInfo.douji_goumai" class="background-picker" range-key="text" :range="options.douji">
											<view class="uni-input">{{options.douji[configInfo.douji_goumai].text}}</view>
									</picker>
							</view>
					</view>
					<view class="flex-item-two">
						<view class="uni-list-cell-db">武技购买</view>
		        <switch :checked="!!configInfo.douji_goumai" @change="changeSwitchDouji"/>
					</view>
		    </view> -->
		</view>

		
		<view class="uni-divider">
			<view class="uni-divider__content">武技设置</view>
			<view class="uni-divider__line"></view>
		</view>

		<view class="douji-wrap">
			<view class="list-cell flex-item-two">
		    <view class="douji-list-left">
		      攻击:
		    </view>
		    <view class="uni-list-cell-db">
		      <picker @change="changeGongji" :value="doujiIndex.gongji" class="bg-picker-douji"  range-key="text" :range="options.douji">
		          <view :class="{ active: doujiObj.gongji !== '10' }" class="uni-input">{{options.douji[doujiIndex.gongji].text}}</view>
		      </picker>
		    </view>
		  </view>
			<view class="list-cell flex-item-two">
		    <view class="douji-list-left">
		      生命:
		    </view>
		    <view class="uni-list-cell-db">
		      <picker @change="changeShengming" :value="doujiIndex.shengming" class="bg-picker-douji"  range-key="text" :range="options.douji">
		          <view :class="{ active: doujiObj.shengming !== '10' }" class="uni-input">{{options.douji[doujiIndex.shengming].text}}</view>
		      </picker>
		    </view>
		  </view>
			<view class="list-cell flex-item-two">
		    <view class="douji-list-left">
		      物防:
		    </view>
		    <view class="uni-list-cell-db">
		      <picker @change="changeWufang" :value="doujiIndex.wufang" class="bg-picker-douji"  range-key="text" :range="options.douji">
		          <view :class="{ active: doujiObj.wufang !== '10' }" class="uni-input">{{options.douji[doujiIndex.wufang].text}}</view>
		      </picker>
		    </view>
		  </view>
			<view class="list-cell flex-item-two">
		    <view class="douji-list-left">
		      法防:
		    </view>
		    <view class="uni-list-cell-db">
		      <picker @change="changeFafang" :value="doujiIndex.fafang" class="bg-picker-douji"  range-key="text" :range="options.douji">
		          <view :class="{ active: doujiObj.fafang !== '10' }" class="uni-input">{{options.douji[doujiIndex.fafang].text}}</view>
		      </picker>
		    </view>
		  </view>
			<view class="list-cell flex-item-two">
		    <view class="douji-list-left">
		      稀有:
		    </view>
		    <view class="uni-list-cell-db">
		      <picker @change="changeXiyou" :value="doujiIndex.xiyou" class="bg-picker-douji"  range-key="text" :range="options.douji">
		          <view :class="{ active: doujiObj.xiyou !== '10' }" class="uni-input">{{options.douji[doujiIndex.xiyou].text}}</view>
		      </picker>
		    </view>
		  </view>
			<view class="list-cell flex-item-two">
		    <view class="douji-list-left">
		      特殊:
		    </view>
		    <view class="uni-list-cell-db">
		      <picker @change="changeTeshu" :value="doujiIndex.teshu" class="bg-picker-douji"  range-key="text" :range="options.douji">
		          <view :class="{ active: doujiObj.teshu !== '10' }" class="uni-input">{{options.douji[doujiIndex.teshu].text}}</view>
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
import {mapState,mapMutations} from 'vuex'
import { getValueByIndex, getIndexByValue, getChannel, toast } from '@/utils/index'
import { startGuaji, stopGuaji, getServerInfo, getServerInfoChannel } from '@/api/game'
import { getRoleInfo, getConfigInfo, changeConfigInfo, getUtils, getRemoteOptions } from '@/api/game'
import { handleGetServerConfig, handleGetServerConfigTapTap, handleGetServerConfigOther, handleGetServerConfigWJXL, handleGetServerConfigWJXL2 } from '@/utils/server'
import options from '@/utils/options.json'
import { jingjieMap, shiliMap, vipMap } from './mapData.js'
import mInput from '../../components/m-input.vue'
import pako from 'pako'

const configInfoDefault = {
	youlisifang_id: 0,
	is_youlisifang_tiaozan: 0,
	douji_goumai: 10,
	is_tianmu: 0,
	is_yandi: 1,
  is_shenghuojing: 0,
	is_hundi: 1,
	is_guanqia: 1,
	is_mail: 0,
	is_liandan: 0,
	is_baye: 0,
	is_hundianlaixi: 1,
	is_change_shili: 0,
	is_beat_shili: 0,
  is_lianmengmijing: 1,
	is_doupoqiangbang: 0,
	lixianbeishu: 0,
	youlisifang_beishu: 0,
  youlisifang_id: 0,
  lianmengjianshe_type: 0,
  yiji_kaicai_type: 0,
  yiji_jingong_type: 0,
  moyuleixing: 0,
	is_buy_tianmu_jinbi: 0,
	is_buy_tianmu_xuantie: 0,
  is_buy_tianmu_jinjiedan: 0,
  is_buy_tianmu_zhuanshengdan: 0,
  is_buy_tianmu_xuanjing: 0,
	is_buy_yihuo: 0,
	is_refresh_yihuo: 0, // 是否自动刷新燚火
  yihuo_type: 0,
	buy_gongxun_id: 0,
	buy_yuntie: 0,
	wushenshilian_id: 0 // 武神试炼ID
}

const doujiObjDefault = {
  options: '10', // 10表示关闭
  gongji: '10', // 购买攻击
  shengming: '10', // 购买生命
  wufang: '10', // 购买物防
  fafang: '10', // 购买法防
  xiyou: '10', // 购买稀有
  teshu: '10' // 购买特殊
}

const roleInfoDefault = {
  userid: '',
  server_id: '',
  role_name: '',
  update_time: '',
  role_level: '',
  vip_level: '',
  zhanli: '',
  jingzuan: '',
  guanqia: '',
  zhuzai_level: '',
  bazhu_cengshu: '',
  hundianlaixi_times: '',
  lilianshiwu: '',
  yijikaicai_times: '',
  yijijingong_times: '',
  doupoqiangbang_times: '',
  xiandou_times: '',
  lianmengjuanxian_times: '',
  lianmengmijing_times: '',
  moyu_times: '',
	charge_value: '',
	douqi: '',
	huoneng: '',
	jinbi: '',
	shili_tili: '',
	shili_beishu: '',
	shili_zuanshi: '',
	shili_tili: '',
	yihuo_times: '',
	yihuo_buy_times: '',
	baye_order: ''
}

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
    jingjieFilter(jingjie) {
      return jingjieMap[jingjie]
    },
    shiliFilter(shili_weizhi) {
      return shiliMap[shili_weizhi] || '未获取到位面信息'
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
      const numVal = Number(str)
			if (isNaN(numVal)) return ''
			if (numVal < 0) return '未获取到'
      if (numVal > 100000000) {
        return (numVal / 100000000).toFixed(1) + '亿'
      } else {
        return (numVal / 10000).toFixed(1) + '万'
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
			remoteOptions: {},
			index: 0,
			current: 0,
			statusLoading: false,
			yunguaji: false,
			options:options,
			configInfo: Object.assign({}, configInfoDefault),
			doujiObj: Object.assign({}, doujiObjDefault), // 斗技购买相关的配置
			roleInfo: Object.assign({}, roleInfoDefault),
			doujiIndex: {
				gongji: 0,
				shengming: 0,
				wufang: 0,
				fafang: 0,
				xiyou: 0,
				teshu: 0
			},
			flag: {
			    loginFlag: false,
			    logoutFlag: false,
			    newUserFlag: false,
					showServer: false,
					saveRoleFlag: false
			},
			fuzuStatus: {
        end_time: '',
				on_off: 0,
				fuzhu_vip: 0,
        isExpired: false
			},
			switchInfo: {
        youlisifang_id: false,
        lianmengjianshe_type: false,
        yiji_kaicai_type: false,
        yiji_jingong_type: false,
        moyuleixing: false,
        boss_id1: false,
        boss_id2: false,
        douji_goumai: false
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
		// serverName() {
		// 	let res = ''
		// 	if (this.serverInfo.last_server_list) {
		// 		res = this.serverInfo.last_server_list[this.lastServerIndex].text
		// 	}
		// 	return res
		// },
		// 更新时间是否超过2小时
    isPassedTwoHours() {
      const a = moment(new Date())
      const b = moment(this.roleInfo.update_time)
      const duration = a.diff(b)
      return duration > 2 * 3600 * 1000
    },
    // 计算位面位置是否未占有
    isNoShili() {
      return this.roleInfo.shili_weizhi === 0
    },

    // 是否获取到充值额度
    notGetChargeValue() {
      return this.roleInfo.charge_value === -1
    },

    // 计算差多少金额升级到下级VIP
    vipUpValue() {
      const netxtVipLevel = this.roleInfo.vip_level + 1
      const netxtVipValue = vipMap[netxtVipLevel]
      return netxtVipValue - this.roleInfo.charge_value
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
		},

		yijiJingongText() {
			return options.yiji_jingong_type[this.configInfo.yiji_jingong_type].text
		}
	},
	onLoad() {
		this.wdszSaleChannel = getChannel()
		this.loadLoginInfo()
		this.handleGetServerList()
		this.handleGetUtils()
		this.handleGetRemoteOptions()
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
		
		// 获取远程选项
		handleGetRemoteOptions() {
			getRemoteOptions()
			.then(res => {
				this.remoteOptions = res
			})
			.catch(err => {
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
			let wsUrl = ''
			if (this.userInfo.loginType === 1) {
				// wsUrl = 'ws://121.37.203.19:36001/'
				this.handleGetServerList()
				return
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
			const guanfuServerLoginTypeList = [1,2,3,4,12,13]
			if (guanfuServerLoginTypeList.includes(this.userInfo.loginType)) {
				getServerInfo().then(res => {
					this.serverInfo.last_server_list = res.server.guanfu
				}).catch(err => {
					console.log(err)
				})
			} else {
				getServerInfoChannel().then(res => {
					this.serverInfo.last_server_list = res.server.guanfu
				}).catch(err => {
					console.log(err)
				})
			}
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
						this.calsIsExpired(res.data.end_time)
						this.calcdouji_goumai(String(res.data.setting_content.douji_goumai))
						this.calcdoujiIndex()
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
    
    // 修正获取到的配置信息，如果后台未返回的参数则取默认值
    correctConfig(configInfoBackend) {
      const configInfo = Object.assign({}, configInfoDefault)
      for (let key in configInfo) {
        if (configInfoBackend.hasOwnProperty(key)) {
          configInfo[key] = configInfoBackend[key]
        }
      }
      return configInfo
    },

		// 根据后台返回的斗技数据计算斗技index
		calcdoujiIndex() {
			for (let item in this.doujiIndex) {
				this.doujiIndex[item] = getIndexByValue(this.options.douji, this.doujiObj[item])
			}
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
		changePickerYouli(e) {
			const index = e.target.value
			this.configInfo.youlisifang_id = index
		},
		changePickerLMJS(e) {
			const index = e.target.value
			this.configInfo.lianmengjianshe_type = index
		},
		changePickerYJKC(e) {
			const index = e.target.value
			this.configInfo.yiji_kaicai_type = index
		},
		changePickerYJQD(e) {
			const index = e.target.value
			this.configInfo.yiji_jingong_type = index
    },
    changePickerYihuo(e) {
			const index = e.target.value
			this.configInfo.yihuo_type = index
		},
		changePickerDouji(e) {
			const index = e.target.value
			this.configInfo.douji_goumai = index
		},
		changePickerGongxun(e) {
			const index = e.target.value
			this.configInfo.buy_gongxun_id = index
		},
		changeBuyYuntie(e) {
			const index = e.target.value
			this.configInfo.buy_yuntie = index
		},
		changeBuyBaye(e) {
			const index = e.target.value
			this.configInfo.is_baye = index
		},
		changeWushenshilian(e) {
			const index = e.target.value
			this.configInfo.wushenshilian_id = index
		},

		// 修改下拉选项后面的开关
		changeSwitchYouli(e) {
			const checked = e.target.value
			if (!checked) {
				this.configInfo.youlisifang_id = 0
			} else {
				this.$toast('请选择左侧列表中选项')
			}
		},
		changeSwitchXMJS(e) {
			const checked = e.target.value
			if (!checked) {
				this.configInfo.lianmengjianshe_type = 0
			} else {
				this.$toast('请选择左侧列表中选项')
			}
		},
		changeSwitchYJKC(e) {
			const checked = e.target.value
			if (!checked) {
				this.configInfo.yiji_kaicai_type = 0
			} else {
				this.$toast('请选择左侧列表中选项')
			}
		},
		changeSwitchYJQD(e) {
			const checked = e.target.value
			if (!checked) {
				this.configInfo.yiji_jingong_type = 0
			} else {
				this.$toast('请选择左侧列表中选项')
			}
    },
    changeSwitchYihuo(e) {
			const checked = e.target.value
			if (!checked) {
				this.configInfo.yihuo_type = 0
			} else {
				this.$toast('请选择左侧列表中选项')
			}
		},
		changeSwitchDouji(e) {
			const checked = e.target.value
			if (!checked) {
				this.configInfo.douji_goumai = 0
			} else {
				this.$toast('请选择左侧列表中选项')
			}
		},
		changeSwitchGongxun(e) {
			const checked = e.target.value
			if (!checked) {
				this.configInfo.buy_gongxun_id = 0
			} else {
				this.$toast('请选择左侧列表中选项')
			}
		},
		changeSwitchYuntie(e) {
			const checked = e.target.value
			if (!checked) {
				this.configInfo.buy_yuntie = 0
			} else {
				this.$toast('请选择左侧列表中选项')
			}
		},
		changeSwitchBaye(e) {
			const checked = e.target.value
			if (!checked) {
				this.configInfo.is_baye = 0
			} else {
				this.$toast('请选择左侧列表中选项')
			}
		},
		changeSwitchWushenshilian(e) {
			const checked = e.target.value
			if (!checked) {
				this.configInfo.wushenshilian_id = 0
			} else {
				this.$toast('请选择左侧列表中选项')
			}
		},

		// 改变斗技相关的picker
		changeGongji(e) {
			const index = e.target.value
			this.doujiIndex.gongji = index
			this.doujiObj.gongji = getValueByIndex(options.douji, index)
		},
		changeShengming(e) {
			const index = e.target.value
			this.doujiIndex.shengming = index
			this.doujiObj.shengming = getValueByIndex(options.douji, index)
		},
		changeWufang(e) {
			const index = e.target.value
			this.doujiIndex.wufang = index
			this.doujiObj.wufang = getValueByIndex(options.douji, index)
		},
		changeFafang(e) {
			const index = e.target.value
			this.doujiIndex.fafang = index
			this.doujiObj.fafang = getValueByIndex(options.douji, index)
		},
		changeXiyou(e) {
			const index = e.target.value
			this.doujiIndex.xiyou = index
			this.doujiObj.xiyou = getValueByIndex(options.douji, index)
		},
		changeTeshu(e) {
			const index = e.target.value
			this.doujiIndex.teshu = index
			this.doujiObj.teshu = getValueByIndex(options.douji, index)
		},

    /**
     * 计算斗技购买的各种属性
     * 总共12为数字每两位表示一个属性，从前到后是攻击，生命，物防，法防，残页，绝学
     * 两位数字是10-22之间，表示购买不同价格的斗技
     */
    calcdouji_goumai(cfgStr) {
      this.doujiObj.gongji = cfgStr.slice(0, 2)
      this.doujiObj.shengming = cfgStr.slice(2, 4)
      this.doujiObj.wufang = cfgStr.slice(4, 6)
      this.doujiObj.fafang = cfgStr.slice(6, 8)
      this.doujiObj.xiyou = cfgStr.slice(8, 10)
      this.doujiObj.teshu = cfgStr.slice(10, 12)
    },

    // 从购买斗技的对象中生成购买斗技的配置数据发到后端
    gendouji_goumaiCfg() {
      const gongji = this.doujiObj.gongji
      const shengming = this.doujiObj.shengming
      const wufang = this.doujiObj.wufang
      const fafang = this.doujiObj.fafang
      const xiyou = this.doujiObj.xiyou
      const teshu = this.doujiObj.teshu
      return gongji + shengming + wufang + fafang + xiyou + teshu
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
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.attr-flex-item {
	flex: 1;
	flex-basis: auto;
	width: 33.3%;
	/* 加入这两个后每个item的宽度就生效了 */
	min-width: 33.3%;
	max-width: 33.3%;
}
.flex-lixian-item {
	flex: 1;
	flex-basis: auto;
	width: 65%;
	min-width: 65%;
	max-width: 65%;
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
	width: 25%;
	text-align: right;
}
.flex-item-two {
	display: flex;
	width: 48%;
	min-width: 48%;
	max-width: 48%;
}
.radio-flex {
	display: flex;
}
.radio-flex-item {
	flex: 1;
	flex-basis: auto;
	width: 32%;
	/* 加入这两个后每个item的宽度就生效了 */
	min-width: 32%;
	max-width: 32%;
}
.uni-list-no-border {
	background-color: #FFFFFF;
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: column;
}
.uni-list-cell-no-border {
	position: relative;
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
