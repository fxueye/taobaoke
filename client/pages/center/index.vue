<template>
	<view class="center">
		<view class="center-top">
			<view class="center-logo">
				<image class="center-logo-img" src="../../static/logo.png"></image>
				<view class="center-logo-title">
					<view class="center-uer-name">
						<!-- <text v-on:click="goLogin()">登录</text>/<text v-on:click="goRegister()">注册</text> -->
						<text>桔子精选</text>
					</view>
				</view>
			</view>
		</view>

		<uni-list class="center-list">
			<uni-list-item @click="click(0)" :show-extra-icon="true" :extraIcon="zuji" title="我的足迹"/>
			<uni-list-item @click="click(1)" :show-extra-icon="true" :extraIcon="chat" title="联系客服" />
			<uni-list-item @click="click(2)" :show-extra-icon="true" :extraIcon="help" title="领券帮助" />
			<!-- <uni-list-item @click="click(3)" :show-extra-icon="true" :extraIcon="share" title="分享APP" /> -->
			<uni-list-item @click="click(4)" :show-extra-icon="true" :extraIcon="download" title="版本更新"  showArrow="false" :rightNote="versionName" />
			<uni-list-item @click="click(5)" :show-extra-icon="true" :extra-icon="infofilled"  title="关于" />
			
		</uni-list>
	</view>
</template>

<script>
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
export default {
	components: {
		uniList,
		uniListItem
	},
	data() {
		return {
			versionName:'v1.0.0',
			infofilled: {
					fontclass:'text-icons',
					color: '#ff80ab',
					size: '22',
					type: 'guanyu'
				},
			download:{
				fontclass:'text-icons',
				color: '#ff80ab',
				size: '22',
				type: 'gengxin'
			},
			share:{
				fontclass:'text-icons',
				color: '#ff80ab',
				size: '22',
				type: 'fenxiang'
			},
			help:{
				fontclass:'text-icons',
				color: '#ff80ab',
				size: '22',
				type: 'bangzhu'
			},
			chat:{
				fontclass:'text-icons',
				color: '#ff80ab',
				size: '22',
				type: 'lianxikefu'
			},
			zuji:{
				fontclass:'text-icons',
				color: '#ff80ab',
				size: '22',
				type: 'zuji'
			},
			setting:{
				fontclass:'text-icons',
				color: '#ff80ab',
				size: '22',
				type: 'shezhi'
			}
		};
	},
	onLoad() {
		this.versionName = '版本:'+this.$config.versionName
		
	},
	methods: {
		goLogin() {
			uni.navigateTo({
				url: '/pages/center/login'
			});
		},
		goRegister() {
			uni.navigateTo({
				url: '/pages/center/register'
			});
		},
		goAbout() {
			uni.navigateTo({
				url: '/pages/about/about'
			});
		},
		click(index){
			console.log(index);
			switch (index){
				case 0:
					uni.navigateTo({
						url: '/pages/center/footprint'
					});
					break;
				case 1:
					uni.showModal({
						title:"联系客服",
						content:"QQ群:200910943"
					})
					break;
				case 4:
					this.checkVersion().catch(()=>{
						uni.showToast({
							title: '已经是最新',
							duration:1000
						});
					})
					break;
				case 5:
					uni.navigateTo({
						url:'/pages/center/about'
					})
					break
				default:
					break;
			}
		}
	},

	/**
	 *  点击导航栏 buttons 时触发
	 */
	onNavigationBarButtonTap() {
		uni.navigateTo({
			url:'/pages/center/setting'
		})
		
	}
};
</script>

<style>
.center {
	height: 100%;
	flex-direction: column;
}
.center-title {
	font-size: 32upx;
	line-height: 32upx;
	color: #777;
	margin: 40upx 25upx;
	position: relative;
}

.center-list {
	background-color: #ffffff;
	margin-top: 20upx;
	flex-direction: column;
}
.center-top {
	width: 100%;
	height: 380upx;
}
.center-logo {
	width: 750upx;
	height: 380upx;
	padding: 104upx 20upx 20upx 20upx;
	box-sizing: border-box;
	background-color: #ff80ab;
	flex-direction: row;
	align-items: center;
	display: flex;
}
.center-logo-img {
	width: 150upx;
	height: 150upx;
	border-radius: 150upx;
}
.center-logo-title {
	height: 150upx;
	flex: 1;
	align-items: center;
	flex-direction: row;
	margin-left: 20upx;
	display: flex;
}
.center-uer-name {
	height: 60upx;
	line-height: 60upx;
	font-size: 38upx;
	color: #ffffff;
}
</style>
