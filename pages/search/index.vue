<template>
	<view v-if="isHistory" class="search">
		<view class="search-hot-box" v-if="hotSearchList.length > 0">
			<view class="search-title">热门搜索</view>
			<block v-for="(item, index) in hotSearchList" :key="index">
				<view class="search-tag-view"><uni-tag :circle="true" :text="item.world" @click="hotTagClick(index)" /></view>
			</block>
		</view>
		<view v-if="historyList.length > 0" class="search-history-box">
			<view class="search-title">历史搜索</view>
			<block v-for="(world, index) in historyList" :key="index">
				<view class="search-tag-view"><uni-tag :circle="true" :text="world" @click="historyTagClick(index)" /></view>
			</block>
			<view class="serach-clear-history" v-on:click="clearSearch()">
				<text class="text-icons text-icons-delete search-delete-icon"></text>
				<text class="search-delete-text">清除历史记录</text>
			</view>
		</view>
	</view>
	<view v-else class="search-good-view">
		<view class="search-good-condition-view">
			<block v-for="(condition, index) in conditions" :key="index">
				<view class="search-good-condition-item" :class="{ 'search-good-condition-color': selectIndex == index }" v-on:click="conditionClick(index)">
					{{ condition.name }}
				</view>
			</block>
		</view>
		<scroll-view class="search-good-scroll-list" :scroll-top="scrollTop" scroll-y="true" @scroll="scroll" @scrolltolower="loadMore()">
			<view class="search-good-list">
				<block v-for="(g, idx) in goods.data" :key="idx">
					<view class="search-good" @click="goodClick(g)">
						<view class="search-good-image-view"><image class="search-good-image" lazy-load :src="g.main_pic"></image></view>
						<view class="search-good-title-view">
							<view class="search-good-title">{{ g.dtitle }}</view>
						</view>
						<view class="search-good-price">
							<text v-if="g.istmall" class="search-good-price-favour">天猫价￥{{ g.original_price }}</text>
							<text v-else class="search-good-price-favour">淘宝价￥{{ g.original_price }}</text>
							<text class="search-sell-number">已售{{ g.sales_num }}件</text>
						</view>
						<view class="search-good-price">
							<text class="search-good-price-original" v-if="g.coupon_price > 0">券后价￥{{ g.price }}</text>
							<text class="search-good-price-original" v-else>￥{{ g.price }}</text>
							<text class="search-good-tip" v-if="g.coupon_price > 0">{{ g.coupon_price }}元券</text>
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
import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
import uniFloatingButton from '@/components/uni-floating-button/uni-floating-button.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import uniTag from '@/components/uni-tag/uni-tag.vue';
import { mapGetters } from 'vuex';
export default {
	computed: {
		...mapGetters('search', {
			goods: 'goods'
		}),
		...mapGetters('search', {
			hotSearchList: 'searchs'
		})
	},
	components: {
		uniTag,
		uniLoadMore,
		uniDrawer,
		uniFloatingButton
	},
	data() {
		return {
			pullDownRefresh:true,
			showFloatButton: false,
			scrollTop: 0,
			oldScrollTop: 0,
			canFix: true,
			startPrice: '',
			endPrice: '',
			showDrawer: false,
			params: {},
			selectIndex: 0,
			historyList: [],
			isHistory: true,
			world: '',
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
	onLoad() {
		this.getData();
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
		loadMore() {
			console.log('loadMore');
			this.params.page = this.goods.page + 1;
			this.params.push = true;
			this.loadmoreStatue = 'loading';
			const _this = this;
			this.$store
				.dispatch('search/SearchGoods', this.params)
				.then(() => {
					_this.loadmoreStatue = 'more';
				})
				.catch(() => {
					_this.loadmoreStatue = 'noMore';
				});
		},
		async getData() {
			uni.showLoading({
				title: '数据加载中...'
			});
			await this.$store.dispatch('search/GetSearch');
			this.getLocalHistory();
			uni.hideLoading();
		},

		/**
		 * 清理历史搜索数据
		 */
		clearSearch() {
			uni.showModal({
				title: '提示',
				content: '是否清理全部搜索历史？该操作不可逆。',
				success: res => {
					if (res.confirm) {
						this.clearLocalHistory();
					}
				}
			});
		},
		async search(world) {
			this.selectIndex = 0;
			if (this.isHistory === false && this.params.world == world) {
				return;
			}
			uni.showLoading({
				title: '数据加载中...'
			});
			this.params['world'] = world;
			this.params['page'] = 1;
			this.params['score'] = 1;
			this.params['push'] = true;
			const _this = this;
			this.$store
				.dispatch('search/SearchGoods', this.params)
				.then(() => {
					uni.hideLoading();
					_this.isHistory = false;
					_this.addLocalHistory(world);
					_this.world = world;
					_this.setSearchInputText(world);
				})
				.catch(() => {
					_this.isHistory = false;
					uni.hideLoading();
				});
		},
		conditionClick(index) {
			if (index == this.conditions.length - 1) {
				this.showDrawer = true;
				return;
			}
			this.selectIndex = index;
			let condition = this.conditions[index];
			let params = {};
			params['world'] = this.world;
			params['page'] = 1;
			params[condition.param] = this.params[condition.param] == 1 ? 2 : 1;
			params['push'] = true;
			this.params = params;

			console.log(this.params);
			uni.showLoading({
				title: '数据加载中...'
			});
			this.$store
				.dispatch('search/SearchGoods', this.params)
				.then(() => {
					uni.hideLoading();
				})
				.catch(() => {
					uni.hideLoading();
				});
			this.gotTop();
		},
		getLocalHistory() {
			try {
				this.historyList = uni.getStorageSync('search-history-list');
				console.log(this.historyList);
			} catch (e) {
				this.historyList = [];
			}
		},
		addLocalHistory(world) {
			if (this.historyList.length >= 20) {
				this.historyList = this.historyList.slice(1);
			}
			let temp = [];
			for (let i = 0, length = this.historyList.length; i < length; i++) {
				let w = this.historyList[i];
				if (w != world) {
					temp.push(w);
				}
			}
			temp.push(world);
			this.historyList = temp;
			uni.setStorageSync('search-history-list', this.historyList);
		},
		clearLocalHistory() {
			uni.removeStorageSync('search-history-list');
			this.historyList = [];
		},
		historyTagClick(index) {
			let world = this.historyList[index];
			this.search(world);
			console.log(this.historyList[index]);
		},
		hotTagClick(index) {
			let world = this.hotSearchList[index].world;
			this.search(world);
			console.log(this.hotSearchList[index]);
		},
		setSearchInputText(world) {
			const currentWebview = this.$mp.page.$getAppWebview();
			currentWebview.setTitleNViewSearchInputText(world);
			// currentWebview.setTitleNViewSearchInputFocus(true);
		},
		setSearchInputPlaceholder(placeholder) {},
		onKeyInput(e) {},

		reset() {
			console.log(this.startPrice);
			console.log(this.endPrice);
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
			params['world'] = this.world;
			params['page'] = 1;
			params['start_price'] = this.startPrice;
			params['end_price'] = this.endPrice;
			params['push'] = true;
			this.params = params;
			uni.showLoading({
				title: '数据加载中...'
			});
			this.$store
				.dispatch('search/SearchGoods', this.params)
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
	onBackPress(options) {
		if (this.showDrawer) {
			this.showDrawer = false;
			return true;
		}
		if (!this.isHistory) {
			this.isHistory = true;
			return true;
		}
		return false;
	},

	/**
	 * 当 searchInput 输入时触发
	 */
	onNavigationBarSearchInputChanged(e) {
		this.world = e.text;
	},
	/**
	 * 点击软键盘搜索按键触发
	 */
	onNavigationBarSearchInputConfirmed(e) {
		this.search(e.text);
	},
	/**
	 *  点击导航栏 buttons 时触发
	 */
	onNavigationBarButtonTap() {
		this.search(this.world);
	},
	onPullDownRefresh() {
		this.params.page = this.goods.page + 1;
		this.params.push = false;
		const _this = this;
		this.$store
			.dispatch('search/SearchGoods', this.params)
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
page {
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	background-color: #fff;
}

view {
	font-size: 28upx;
	line-height: inherit;
}
.search {
	padding: 0 30upx 30upx;
}
.search-title {
	font-size: 32upx;
	line-height: 32upx;
	color: #777;
	margin: 40upx 25upx;
	position: relative;
}
.search .search-title {
	margin: 40upx 0;
}
.search-tag-view {
	margin: 10upx 20upx;
	display: inline-block;
}
.search-hot-box {
}
.search-history-box {
}
.serach-clear-history {
	font-size: 12px;
	margin-top: 20upx;
	width: 100%;
	display: flex;
	justify-content: center;
}
.search-delete-icon {
	margin: 0 10upx 0 10upx;
	color: #f76260;
}
.search-delete-text {
	margin: 0 10upx 0 10upx;
	color: #cccccc;
	padding-top: 8upx;
}

.search-good-view {
	flex: 1;
	width: 100%;
	height: 100%;
}
.search-good-condition-view {
	height: 80upx;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.search-good-condition-item {
	width: 150upx;
	text-align: center;
}
.search-good-condition-color {
	color: #ff80ab;
}
.search-good-scroll-list {
	width: 750upx;
	background: #e7e7e7;
	height: calc(100% - 34px);
}

.search-good-list {
	display: flex;
	width: 100%;
	flex-wrap: wrap;
	flex-direction: row;
}

.search-good {
	background: #ffffff;
	width: 365upx;
	margin: 5upx;
	display: flex;
	border-radius: 15upx;
	flex-direction: column;
}
.search-good-title-view {
	margin: 10upx 0 10upx 0;
	width: 100%;
	display: flex;
	justify-content: center;
}
.search-good-image-view {
	margin-top: 20upx;
	width: 100%;
	display: flex;
	justify-content: center;
}

.search-good-image {
	height: 330upx;
	width: 330upx;
}

.search-good-title {
	width: 330upx;
	word-break: break-all;
	display: -webkit-box;
	overflow: hidden;
	line-height: 1.5;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.search-good-price {
	margin: 10upx;
	font-size: 28upx;
	line-height: 1.5;
	position: relative;
	padding-bottom: 20upx;
}

.search-good-price-original {
	color: #e80080;
}

.search-good-price-favour {
	font-size: 12px;
	color: #cccccc;
	text-decoration: line-through;
	margin-left: 10upx;
}

.search-good-tip {
	position: absolute;
	right: 10upx;
	background-color: #ff3333;
	color: #ffffff;
	padding: 0 10upx;
	border-radius: 5upx;
}
.search-sell-number {
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
