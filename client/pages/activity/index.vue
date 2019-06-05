<template>
	<view class="activity-good-view">
		<view class="activity-good-condition-view">
			<block v-for="(condition, index) in conditions" :key="index">
				<view class="activity-good-condition-item" :class="{ 'activity-good-condition-color': selectIndex == index }" v-on:click="conditionClick(index)">
					{{ condition.name }}
				</view>
			</block>
		</view>
		<scroll-view class="activity-good-scroll-list" :scroll-top="scrollTop" @scroll="scroll" scroll-y="true" @scrolltolower="loadMore()">
			<view class="activity-good-list">
				<block v-for="(g, idx) in actGoods.data" :key="idx">
					<view class="activity-good" @click="goodClick(g)">
						<view class="activity-good-image-view"><image class="activity-good-image" lazy-load :src="g.main_pic"></image></view>
						<view class="activity-good-title-view">
							<view class="activity-good-title">{{ g.dtitle }}</view>
						</view>
						<view class="activity-good-price">
							<text v-if="g.istmall" class="activity-good-price-favour">天猫价￥{{ g.original_price }}</text>
							<text v-else class="activity-good-price-favour">淘宝价￥{{ g.original_price }}</text>
							<text class="activity-sell-number">已售{{ g.sales_num }}件</text>
						</view>
						<view class="activity-good-price">
							<text class="activity-good-price-original" v-if="g.coupon_price > 0">券后价￥{{ g.price }}</text>
							<text class="activity-good-price-original" v-else>￥{{ g.price }}</text>
							<text class="activity-good-tip" v-if="g.coupon_price > 0">{{ g.coupon_price }}元券</text>
						</view>
					</view>
				</block>
			</view>
			<uni-load-more :status="loadmoreStatue" :contentText="loadingText"></uni-load-more>
		</scroll-view>
		<uni-floating-button :visible="showFloatButton" @click="gotTop()"></uni-floating-button>
		<view>
			<uni-drawer :visible="showDrawer" mode="right" @close="closeDrawer()">
				<view class="drawer-condition-box">
					<view class="drawer-title">价格区间(元):</view>
					<view class="drawer-condition">
						<input
							id="start"
							:class="{ 'color-red': !canFix }"
							class="drawer-conditon-text"
							maxlength="6"
							type="number"
							placeholder="最低价"
							@input="onKeyInput"
							v-model="startPrice"
						/>
						-
						<input
							id="end"
							:class="{ 'color-red': !canFix }"
							class="drawer-conditon-text"
							maxlength="6"
							type="number"
							placeholder="最高价"
							@input="onKeyInput"
							v-model="endPrice"
						/>
					</view>
				</view>
				<view class="drawer-condition-font">
					<button class="drawer-condition-button-reset" size="mini" type="primary" @click="reset()">重置</button>
					<button class="drawer-condition-button-fix" size="mini" type="primary" @click="fix()">确定</button>
				</view>
			</uni-drawer>
		</view>
	</view>
</template>

<script>
import uniFloatingButton from '@/components/uni-floating-button/uni-floating-button.vue';
import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import { mapGetters } from 'vuex';
export default {
	components: {
		uniLoadMore,
		uniDrawer,
		uniFloatingButton
	},
	computed: {
		...mapGetters('good', {
			actGoods: 'actGoods'
		})
	},
	onLoad: function(options) {
		uni.setNavigationBarTitle({
			title: options.name
		});
		this.activityId = options.id;
		this.scid = options.scid;
		this.cid = options.cid;

		let params = {
			cid: this.cid,
			scid: this.scid,
			score: 1,
			page: 1,
			id: this.activityId
		};
		this.params = params;
		// this.getData();
	},
	data() {
		return {
			pullDownRefresh:true,
			showFloatButton: false,
			scrollTop: 0,
			oldScrollTop: 0,
			cid: 0,
			scid: 0,
			canFix: true,
			startPrice: '',
			endPrice: '',
			showDrawer: false,
			activityId: 1,
			params: {},
			selectIndex: 0,
			loadmoreStatue: 'more',
			loadingText: {
				contentdown: '下拉加载更多',
				contentrefresh: '正在加载...',
				contentnomore: '没有更多数据了'
			},
			conditions: [
				{
					param: 'score',
					name: '人气'
				},
				{
					param: 'time',
					name: '最新'
				},
				{
					param: 'sales_num',
					name: '销量'
				},
				{
					param: 'price',
					name: '价格'
				},
				{
					param: '',
					name: '筛选'
				}
			]
		};
	},
	methods: {
		goodClick(g) {
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
			this.$store
				.dispatch('good/GetGoodDetail', params)
				.then(() => {
					uni.hideLoading();
					uni.navigateTo({
						url: '/pages/good/detail?id=' + g.id + '&nummId=' + g.goods_id
					});
				})
				.catch(() => {
					//TODO
					uni.hideLoading();
				});
		},
		closeDrawer(e) {
			this.showDrawer = false;
		},
		async conditionClick(index) {
			if (index == this.conditions.length - 1) {
				this.showDrawer = true;
				return;
			}
			this.selectIndex = index;
			let condition = this.conditions[index];
			let params = {};
			params['scid'] = this.cid;
			params['id'] = this.activityId;
			params['page'] = 1;
			params[condition.param] = this.params[condition.param] == 1 ? 2 : 1;

			this.params = params;

			uni.showLoading({
				title: '数据加载中...'
			});
			await this.$store.dispatch('good/GetActGoods', this.params);
			uni.hideLoading();
			this.gotTop();
		},
		async getData() {
			uni.showLoading({
				title: '数据加载中...'
			});
			this.params = {
				scid: this.cid,
				score: 1,
				page: 1,
				id: this.activityId
			};
			await this.$store.dispatch('good/GetActGoods', this.params);

			uni.hideLoading();
		},
		async loadMore() {
			this.params.page = this.actGoods.page + 1;
			this.loadmoreStatue = 'loading';
			this.params['push'] = true;
			this.$store
				.dispatch('good/GetActGoods', this.params)
				.then(() => {
					this.loadmoreStatue = 'more';
				})
				.catch(() => {
					this.loadmoreStatue = 'noMore';
				});
		},
		onKeyInput(e) {},
		reset() {
			this.startPrice = '';
			this.endPrice = '';
		},
		fix() {
			if (this.endPrice < this.startPrice) {
				this.canFix = false;
				return;
			}
			this.canFix = true;
			let params = {};
			params['page'] = 1;
			params['id'] = this.activityId;
			params['start_price'] = this.startPrice;
			params['end_price'] = this.endPrice;
			params['scid'] = this.cid;
			params['push'] = true;
			this.params = params;
			uni.showLoading({
				title: '数据加载中...'
			});
			this.$store
				.dispatch('good/GetActGoods', this.params)
				.then(() => {
					uni.hideLoading();
					this.showDrawer = false;
				})
				.catch(() => {
					uni.hideLoading();
					this.showDrawer = true;
				});
		},

		scroll(e) {
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
			
			if (e.detail.scrollTop > 1000) {
				this.showFloatButton = true;
			} else {
				this.showFloatButton = false;
			}
			this.oldScrollTop = e.detail.scrollTop;
		},
		gotTop() {
			this.scrollTop = this.oldScrollTop;
			this.$nextTick(function() {
				this.scrollTop = 0;
			});
			// this.scrollTop = 0;
		}
	},

	/**
	 *  点击导航栏 buttons 时触发
	 */
	onNavigationBarButtonTap() {
		uni.navigateTo({
			url: '/pages/center/footprint'
		});
	},
	onPullDownRefresh() {
		this.params.page = this.actGoods.page + 1;
		this.params['push'] = false;
		this.$store
			.dispatch('good/GetActGoods', this.params)
			.then(() => {
				uni.stopPullDownRefresh();
			})
			.catch(() => {
				uni.stopPullDownRefresh();
			});
	}
};
</script>

<style>
.activity-good-view {
	width: 100%;
	height: 100%;
}
.activity-good-scroll-list {
	width: 750upx;
	background: #e7e7e7;
	height: calc(100% - 34px);
}
.activity-good-list {
	display: flex;
	width: 100%;
	flex-wrap: wrap;
	flex-direction: row;
}

.activity-good {
	background: #ffffff;
	width: 365upx;
	margin: 5upx;
	display: flex;
	border-radius: 15upx;
	flex-direction: column;
}
.activity-good-title-view {
	width: 100%;
	display: flex;
	justify-content: center;
}
.activity-good-image-view {
	margin: 20upx 0 20upx 0;
	width: 100%;
	display: flex;
	justify-content: center;
}
.activity-good-condition-view {
	background: #ffffff;
	height: 80upx;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.activity-good-condition-item {
	width: 150upx;
	text-align: center;
}
.activity-good-condition-color {
	color: #ff80ab;
}

.activity-good-image {
	height: 330upx;
	width: 330upx;
}

.activity-good-title {
	margin: 20upx 0 20upx 0;
	width: 330upx;
	word-break: break-all;
	display: -webkit-box;
	overflow: hidden;
	line-height: 1.5;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.activity-good-price {
	margin: 10upx;
	font-size: 28upx;
	line-height: 1.5;
	position: relative;
	padding-bottom: 20upx;
}

.activity-good-price-original {
	color: #e80080;
}

.activity-good-price-favour {
	font-size: 12px;
	color: #cccccc;
	text-decoration: line-through;
	margin-left: 10upx;
}

.activity-good-tip {
	position: absolute;
	right: 10upx;
	background-color: #ff3333;
	color: #ffffff;
	padding: 0 10upx;
	border-radius: 5upx;
}

.activity-sell-number {
	font-size: 12px;
	position: absolute;
	right: 10upx;
	color: #cccccc;
	padding: 0 10upx;
}

.drawer-title {
	font-size: 32upx;
	line-height: 32upx;
	color: #777;
	position: relative;
}
.drawer-condition-box {
	padding: 70upx;
}
.drawer-condition {
	margin-top: 40upx;
	display: flex;
	justify-content: space-between;
}
.drawer-conditon-text {
	margin: 0 10upx 0 10upx;
	background: #dcdcdc;
	text-align: center;
}
.drawer-condition-font {
	display: flex;
	justify-content: flex-end;
}
.drawer-condition-button-reset {
	color: #888888;
	background: #c8c7cc;
	border-radius: 0px;
}
.drawer-condition-button-fix {
	background: #ff3333;
	border-radius: 0px;
}
.color-red {
	color: #ff3333;
}
</style>
