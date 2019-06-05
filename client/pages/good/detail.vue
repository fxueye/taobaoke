<template>
	<view class="detail">
		<scroll-view class="detail-info" :scroll-top="scrollTop" @scroll="scroll" scroll-y>
			<uni-swiper-dot>
				<swiper class="detail-swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
					<swiper-item>
						<view class="detail-swiper-item" ><image :src="good.main_pic" lazy-load mode="aspectFill" /></view>
					</swiper-item>
					<swiper-item v-for="(img, index) in good.small_images" :key="index">
						<view class="detail-swiper-item"><image :src="img" lazy-load mode="aspectFill" /></view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
			<view class="detail-good-info">
				<view class="detail-good-title">
					<text class="detail-shop-type" v-if="good.shop_type == 1">天猫</text>
					<text class="detail-shop-type" v-if="good.shop_type == 0">淘宝</text>
					<text class="detail-good-title-text">{{good.title}}</text>
				</view>
				<view class="detail-good-price">
					<view><text class="color-red">券后价<text class="detail-good-price-size">￥{{good.actual_price}}</text></text></view>
					<view><text>已售{{good.month_sales}}件</text></view>
				</view>
				<view class="detail-good-org-price">
					<view>	
						<text v-if="good.shop_type == 1">天猫价</text>
						<text v-if="good.shop_type == 0">淘宝价</text>
						<text class="detail-good-price-size">￥{{good.original_price}}</text></text></view>
					<view>
						<!-- <text class="detail-text">包邮</text><text class="detail-text">运费险</text> -->
					</view>
				</view>
				<view class="detail-good-quan" @click="onClickBuy">
					<view class="detail-good-quan-left">
						<text>￥{{good.coupon_price}}元优惠券</text>
						<text class="detail-good-quan-time">使用期限:{{good.coupon_end_time}}</text>
					</view>
					<view class="detail-good-quan-right">立即领取</view>
				</view>
				<view class="detail-good-introduce">
					{{good.desc}}
				</view>
			</view>
			
			<view class="detail-good-detail-info">
				<view class="detail-good-detail-info-title">宝贝详情</view>
				<view class="detail-good-images" v-if="good.detail_pics.length > 1">
					<block v-for="(pic,index) in good.detail_pics" :key="index">
						<image :src="pic" lazy-load mode="widthFix" ></image>
					</block>
				</view>
				<view  class="detail-good-images" v-else>
					<block v-for="(pic,index) in good.small_images" :key="index">
						<image :src="pic" lazy-load mode="widthFix" ></image>
					</block>
				</view>
			</view>
			<uni-floating-button :visible="showFloatButton" @click="gotTop()"></uni-floating-button>
		</scroll-view>
		<view class="detail-foot-bar">
			<view class="detail-tab-bar">
				<view class="detail-tab-bar-tpwd" @click="showTpwd(0)"><view>口令购买</view></view>
				<view class="detail-tab-bar-coupon" @click="onClickBuy"><view>领券购买</view></view>
			</view>
		</view>
		<uni-popup :show="popupPwd" position="middle" mode="fixed" @hidePopup="hideTpwd()">
			<view class="popup-center-box">
				<view class="popup-center-title">{{popupTitle}}</view>
				<view class="popup-center-txt">
					<scroll-view scroll-y class="popup-center-txt-scroll">
						<text selectable="true">{{popopContent}}</text>	
					</scroll-view>
				</view>
				<view class="popup-center-button"><view class="copy-button" @click="clipboard">一键复制</view></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import uniFloatingButton from "@/components/uni-floating-button/uni-floating-button.vue"
import uniSwiperDot from '@/components/uni-swiper-dot/uni-swiper-dot.vue'
import uniPopup from "@/components/uni-popup/uni-popup.vue"
import {format} from "@/common/util"
import { mapGetters } from 'vuex';
export default {
	components: {
		uniSwiperDot,
		uniFloatingButton,
		uniPopup
	},
	computed: {
		...mapGetters('good', {
			good: 'good'
		})
	},
	onLoad: function(options) {
		this.goodId = options.id;
		this.nummId = options.nummId;
		
		// console.log(this.good)
		// this.getData();
	},

	data() {
		return {
			popupTitle:'复制淘口令购买',
			popopContent:'复制框内整段文字，打开【手淘APP】即可领券购买。',
			tpwd:'',
			popupPwd:false,
			showFloatButton:false,
			scrollTop:0,
			oldScrollTop:0,
			goodId: 0,
			nummId: 0,
			indicatorDots: false,
			autoplay: false,
			interval: 2000,
			duration: 500,
			webviewStyles: {
                progress: {
                    color: '#FF3333'
                }
            }
		};
	},
	methods: {
		async getData() {
			uni.showLoading({
				title: '数据加载中...'
			});
			let params = {
				id: this.goodId,
				numm_id: this.nummId
			};
			await this.$store.dispatch('good/GetGoodDetail', params);
			
			uni.hideLoading();
		},
		scroll(e){
			
			if(e.detail.scrollTop > 1000){
				this.showFloatButton = true;
			}else{
				this.showFloatButton = false;
			}
			this.oldScrollTop = e.detail.scrollTop;
		},
		gotTop(){
			this.scrollTop = this.oldScrollTop;
			this.$nextTick(function() {
		        this.scrollTop = 0
		    });
			// this.scrollTop = 0;
		},
		onClickBuy(){
			console.log(this.good)
			// #ifdef APP-PLUS
			let link = this.good.coupon_click_url;
			link = link.replace('https','taobao');
			const _this = this
			plus.runtime.openURL(link,function(res){
				uni.navigateTo({
					url:'/pages/web/index?url='+ escape(_this.good.coupon_click_url)
				})
			});
			
			// #endif
			// #ifdef H5
				uni.navigateTo({
					url:'/pages/web/index?url='+ escape(this.good.coupon_click_url)
				})
			// #endif
			
		},
		hideTpwd(){
			this.popupPwd = false;
		},
		showTpwd(type){
			if(type == 0){
				this.popupTitle = "复制淘口令购买";
				this.popopContent = format('复制框内整段文字，打开【手淘APP】即可领券购买。{0}',this.good.tpwd);
				
			}else{
				this.popupTitle = "复制淘口令分享";
				this.popopContent = format("{0}\n【原价】: {1}元\n【优惠券】: {2}元\n【券后价】: {3}元\n【淘口令下单】: 复制这条信息，打开→手机淘宝领取优惠券{4} \n推荐理由:{5}",this.good.dtitle,this.good.original_price,this.good.coupon_price,this.good.actual_price,this.good.tpwd,this.good.desc);
			}
			this.popupPwd = true;
		},
		clipboard(){
			// #ifdef APP-PLUS||MP
			uni.setClipboardData({
				data:this.popopContent,
				success:function(){
					uni.showToast({
						title:'复制成功',
						duration:1000,
					})
				}
			})
			// #endif
			
		}
	},
	onNavigationBarButtonTap() {
		this.showTpwd(1);
	}
};
</script>

<style>
.detail{
	width: 100%;
	height: 100%;
}
.detail-swiper {
	height: 750upx;
}
.detail-swiper-item {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background: #eee;
	color: #fff;
}

.detail-swiper-item image {
	width: 100%;
	height: 100%;
}
.detail-good-info{
	height: 560upx;
	background: #FFFFFF;
}

.detail-good-detail-info{
	margin-top: 20upx;
	margin-bottom: 100upx;
	/* height: 280upx; */
	background: #FFFFFF;
}
.detail-good-detail-info-title{
	text-align: center;
	color: #999999;
}
.detail-good-images{
	width: 100%;
	display: flex;
	flex-direction: column;
}
.detail-good-images image{
	width: 100%;
}

.detail-info{
	/* background: #ffffff; */
	height: calc(100% - 90upx);
}
.detail-good-title{
	padding: 20upx 40upx 20upx 40upx;
}
.detail-good-price{
	font-size: 28upx;
	padding: 0upx 40upx 0upx 40upx;
	display: flex;
	justify-content: space-between;
}
.detail-good-org-price{
	color: #999999;
	font-size: 20upx;
	padding: 0upx 40upx 0upx 40upx;
	display: flex;
	justify-content: space-between;
}
.detail-good-price-size{
	margin-left: 20upx;
}
.detail-good-quan{
	display: flex;
	height: 172upx;
	background: url(../../static/goods_quan.png) no-repeat;
	background-size: 100% 100%;
}
.detail-good-quan-left{
	color: #FFFFFF;
	text-align: center;
	justify-content: center;
	display: flex;
	flex-direction: column;
	width: 60%;
	height: 100%;
	border-right:2px dashed #FFFFFF; 
	
}
.detail-good-quan-time{
	color: #F1F1F1;
	font-size: 18upx;
}
.detail-good-quan-right{
	width: 40%;
	height: 100%;
	color: #FFFFFF;
	text-align: center;
	justify-content: center;
	display: flex;
	flex-direction: column;
}
.detail-good-introduce{
	padding: 0upx 40upx 0upx 40upx;
	font-size: 12px;
	color: #999999;
	word-break: break-all;
	display: -webkit-box;
	overflow: hidden;
	line-height:1.5;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
}
.detail-shop-type{
	border: 1px solid #FF3333;
	padding:0 4px 0 4px;
	font-size: 10upx;
	color: #FF3333;
}
.detail-good-title-text{
	margin-left: 20upx;
}
.detail-foot-bar{
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 10;
	bottom: 0upx;
	box-shadow:0px -2px 2px #CCCCCC;
	height: 100upx;
	width:100%;
	background: #FFFFFF;
}


.detail-tab-bar{
	padding: 0 10upx 0 10upx;
	
	height: 80upx;
	width: 100%;
	display: flex;
	justify-content: center;
	
}

.detail-tab-bar-tpwd{
	align-items: center;
	color: #FF3333;
	border: 1px solid #FF3333;
	border-right: none;
	border-radius:2px;
	border-top-right-radius: 0px;
	border-bottom-right-radius: 0px;
	width: 50%;
	display: flex;
	justify-content: center;
	
}
.detail-tab-bar-coupon{
	align-items: center;
	color: #FFFFFF;
	width: 50%;
	display: flex;
	justify-content: center;
	background: linear-gradient(to left,#FA4DBF 0,#FBAA59 100%);
}
.popup-center-box{
	width: 580upx;
	height: 480upx;
	display: flex;
	flex-direction: column;
}
.popup-center-title{
	text-align: center;
	font-size: 16px;
	color:#666666 ;
	line-height: 40upx;
	margin-bottom: 40upx;
}
.popup-center-txt{
	width: 540upx;
	height: 200upx;
	font-size: 12px;
	background: #F1F1F1;
	color: #333333;
	padding: 20upx;
	border-radius:6px;
	flex: 1;
}
.popup-center-txt-scroll{
	height: 100%;
}
.popup-center-button{
	margin-top: 40upx;
	display: flex;
	justify-content: center;
	line-height: 70upx;
}
.copy-button{
	color: #FFFFFF;
	text-align: center;
	width: 280upx;
	border-radius:6px;
	background: linear-gradient(to left,#FA4DBF 0,#FBAA59 100%);
}

</style>
