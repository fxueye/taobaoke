<template>
	<view class="recommend-good-view">
		<view class="recommend-good-condition-view">
				<block v-for="(condition,index) in conditions" :key="index">
					<view class="recommend-good-condition-item" :class="{'recommend-good-condition-color':selectIndex == index}" v-on:click="conditionClick(index)">{{condition.name}}</view>		
				</block>
		</view>
		<scroll-view class="recommend-good-scroll-list" :scroll-top="scrollTop" @scroll="scroll" scroll-y @scrolltolower="loadMore()">
			<view class="recommend-good-list" >
				<block v-for="(g,idx) in recommend.data" :key="idx">
						<view class="recommend-good" @click="goodClick(g)">
							<view class="recommend-good-image-view">
								<image  class="recommend-good-image" lazy-load :src="g.main_pic"></image>
							</view>
							<view class="recommend-good-title-view"><view class="recommend-good-title">{{g.dtitle}}</view></view>
							<view class="recommend-good-price">
								<text class="recommend-good-price-favour">￥{{g.original_price}}</text>
								<text class="recommend-good-price-original">￥{{g.price}}</text>
								<text class="recommend-good-tip" v-if="g.coupon_price > 0">{{g.coupon_price}}元券</text>
							</view>
						</view>
				</block>
			</view>
			<uni-load-more :status="loadmoreStatue" :contentText="loadingText"></uni-load-more>
		</scroll-view>
		<view>
				<uni-drawer :visible="showDrawer" mode="right" @close="closeDrawer()">
					<view class="drawer-condition-box">
						<view class="drawer-title">价格区间(元):</view>
						<view class="drawer-condition">
							<input id="start" :class="{'color-red':!canFix}" class="drawer-conditon-text" maxlength="6" type="number"  placeholder="最低价" @input="onKeyInput" v-model="startPrice" />-<input id="end" :class="{'color-red':!canFix}" class="drawer-conditon-text" maxlength="6" type="number" placeholder="最高价" @input="onKeyInput" v-model="endPrice"/>
						</view>
					</view>
					<view class="drawer-condition-font">
						<button class="drawer-condition-button-reset" size="mini" type="primary" @click="reset()">重置</button>
						<button class="drawer-condition-button-fix" size="mini" type="primary" @click="fix()">确定</button>
					</view>
				</uni-drawer>
		</view>
		<uni-floating-button :visible="showFloatButton" @click="gotTop()"></uni-floating-button>
	</view>
</template>

<script>
import uniFloatingButton from "@/components/uni-floating-button/uni-floating-button.vue"
import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
import { mapGetters } from 'vuex';
export default {
	components: {
		uniLoadMore,
		uniDrawer,
		uniFloatingButton
	},
	computed:{
		
		...mapGetters('good',{
			recommend:'recommend'
		})
	},
	onLoad:function(options){
		this.getData()
	},
	data() {
		return {
			pullDownRefresh:true,
			showFloatButton:false,
			scrollTop:0,
			oldScrollTop:0,
			canFix:true,
			startPrice:'',
			endPrice:'',
			showDrawer: false,
			params:{},
			selectIndex:0,
			loadmoreStatue:'more',
			loadingText: {
				contentdown: '下拉加载更多',
				contentrefresh: '正在加载...',
				contentnomore: '没有更多数据了'
			},
			conditions:[
				{
					param:'score',
					name:'人气'
				},
				{
					param:'time',
					name:'最新'
				},
				{
					param:'sales_num',
					name:'销量'
				},
				{
					param:'price',
					name:'价格'
				},
				{
					param:'',
					name:'筛选'
				}
			]
		}
	},
	methods: {
		closeDrawer(e) {
			this.showDrawer = false;
		},
		async conditionClick(index){
			if(index == this.conditions.length - 1){
				this.showDrawer = true;
				return;
			}
	
			this.selectIndex = index;
			let condition = this.conditions[index];
			let params = {}
			params['page'] = 1;
			params[condition.param] = this.params[condition.param] == 1 ? 2 : 1;
		
			this.params = params;
			
			uni.showLoading({
				title: '数据加载中...'
			});
			await this.$store.dispatch('good/GetRecommend',this.params)
			uni.hideLoading();
			this.gotTop();
		},
		async getData(){
			uni.showLoading({
				title:"数据加载中..."
			})
			this.params = {
				page:1,
				push:true
			}
			await this.$store.dispatch('good/GetRecommend',this.params)
			this.gotTop()
			uni.hideLoading();
		},
		async loadMore() {
			this.params.push = true;
			this.params.page = this.recommend.page + 1;
			this.loadmoreStatue = 'loading';
			this.$store.dispatch('good/GetRecommend',this.params).then(()=>{
				this.loadmoreStatue = 'more';	
			}).catch(()=>{
				this.loadmoreStatue = 'noMore';	
			})
		},
		onKeyInput(e){
			
		},
		
		reset(){
			console.log(this.startPrice)
			console.log(this.endPrice)
			this.startPrice='';
			this.endPrice ='';
		},
		goodClick(g){
			// uni.navigateTo({
			// 	url: '/pages/good/detail?id='+g.id+"&nummId="+g.goods_id
			// })
			
			let params = {
				id: g.id,
				numm_id: g.goods_id
			};
			uni.showLoading({
				title: '数据加载中...'
			});
			this.$store.dispatch('good/GetGoodDetail', params).then(()=>{
				uni.hideLoading();
				uni.navigateTo({
					url: '/pages/good/detail?id='+g.id+"&nummId="+g.goods_id
				})
				
			}).catch(()=>{
				//TODO
				uni.hideLoading();
			});
		},
		fix(){
			if(this.endPrice < this.startPrice){
				this.canFix = false;
				return;
			}
			this.canFix = true;
			let params = {}
			params['page'] = 1;
			params['start_price'] = this.startPrice;
			params['end_price'] = this.endPrice;
			this.params = params;
			uni.showLoading({
				title: '数据加载中...'
			});
			this.$store.dispatch('good/GetRecommend',this.params).then(()=>{
				uni.hideLoading();
				this.showDrawer = false;
			}).catch(()=>{
				uni.hideLoading();
				this.showDrawer = true;
			});
		},
		scroll(e){
			// this.disabledPullRefresh(e.detail.scrollTop == 0);
			if(e.detail.scrollTop == 0){
				this.pullDownRefresh = true;
				this.disabledPullRefresh(true);
			}else{
				//保证只设置一次
				if(!this.pullDownRefresh){
					this.disabledPullRefresh(false);
				}
				this.pullDownRefresh = false;
			}
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
		}
	},
	
	/**
	 * 当 searchInput 配置 disabled 为 true 时触发
	 */
	onNavigationBarSearchInputClicked(e) {
		console.log('事件执行了')
		uni.navigateTo({
			url: '/pages/search/index'
		});
	},
	/**
	 *  点击导航栏 buttons 时触发
	 */
	onNavigationBarButtonTap() {
		uni.navigateTo({
			url: '/pages/center/footprint'
		});
	},
	onTabItemTap(e){
		console.log(e)
		if(e.index == 1){
			this.getData()
		}
	},
	onPullDownRefresh() {
			this.params.page = this.recommend.page + 1;
			this.params.push = false;
			this.$store.dispatch('good/GetRecommend',this.params).then(()=>{
				uni.stopPullDownRefresh();
			}).catch(()=>{
				uni.stopPullDownRefresh();
			})
	}
};
</script>

<style>

.recommend-good-view{
	
	width: 100%;
	height: 100%;
}
.recommend-good-scroll-list{
	width: 750upx;
	background: #E7E7E7;
	height: calc(100% - 34px);
}
.recommend-good-list {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    flex-direction: row;
}

.recommend-good {
	background: #FFFFFF;
    width: 365upx;
	margin: 5upx;
    display: flex;
	border-radius: 15upx;
    flex-direction: column;
}
.recommend-good-title-view{
	width: 100%;
	display: flex;
	justify-content:center;
}
.recommend-good-image-view{
	margin:20upx 0 20upx 0;
	width: 100%;
	display: flex;
	justify-content:center;
}
.recommend-good-condition-view{
	background: #FFFFFF;
	height: 80upx;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.recommend-good-condition-item{
	width: 150upx;
	text-align: center;
}
.recommend-good-condition-color{
	color:#FF80AB;
}

.recommend-good-image {
	
    height: 330upx;
    width: 330upx;
}

.recommend-good-title {
	margin:20upx 0 20upx 0;
    width: 330upx;
    word-break: break-all;
    display: -webkit-box;
    overflow: hidden;
	line-height:1.5;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.recommend-good-price {
	margin:20upx 0 20upx 0;
	
    font-size: 28upx;
	line-height:1.5;
    position: relative;
	padding-bottom: 20upx;
}

.recommend-good-price-original {
    color: #e80080;
}

.recommend-good-price-favour {
    color: #888888;
    text-decoration: line-through;
    margin-left: 10upx;
}

.recommend-good-tip {
    position: absolute;
    right: 10upx;
    background-color: #ff3333;
    color: #ffffff;
    padding: 0 10upx;
    border-radius: 5upx;
}

.drawer-title {
	font-size: 32upx;
	line-height: 32upx;
	color: #777;
	position: relative;
}
.drawer-condition-box{
	padding: 70upx;
}
.drawer-condition{
	margin-top: 40upx;
	display: flex;
	justify-content: space-between;
}
.drawer-conditon-text{
	margin: 0 10upx 0 10upx;
	background: #DCDCDC;
	text-align: center;
}
.drawer-condition-font{
	display: flex;
	justify-content:flex-end;
}
.drawer-condition-button-reset{
	color: #888888;
	background: #C8C7CC;
	border-radius:0px;
}
.drawer-condition-button-fix{
	background: #FF3333;
	border-radius:0px;
}
.color-red{
	color: #FF3333;
}
</style>
