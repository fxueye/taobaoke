<template>
	<view>
		<block v-for="(g, idx) in goods" :key="idx">
			<view class="uni-index-list-cell">
				<view class="uni-good-list" @click="goodClick(g)">
					<image class="uni-good-list-logo" lazy-load :src="g.main_pic"></image>
					<view class="uni-good-list-body">
						<view class="uni-good-list-text-top">{{ g.dtitle }}</view>
						<view class="uni-good-list-text-bottom">
							<text v-if="g.istmall" class="good-price-favour">天猫价￥{{ g.original_price }}</text>
							<text v-else class="good-price-favour">淘宝价￥{{ g.original_price }}</text>
							<text class="good-sell-number">已售{{ g.sales_num }}件</text>
						</view>
						<view class="uni-good-list-text-bottom">
							<text class="good-price">券后￥{{ g.price }}</text>
							<text class="good-quan">￥{{ g.coupon_price }}元券</text>
						</view>
					</view>
				</view>
			</view>
		</block>
		<view class="clear-invalid-good" v-if="invalidGoods.length > 0"><text @click="clearInvalidGood">清空失效商品</text></view>
		<block v-for="(g, idx) in invalidGoods" :key="idx">
			<view class="uni-index-list-cell">
				<view class="uni-good-list" @click="goodClick(g)">
					<image class="uni-good-list-logo" lazy-load :src="g.main_pic"></image>
					<view class="uni-good-list-body">
						<view class="uni-good-list-text-top">{{ g.dtitle }}</view>
						<view class="uni-good-list-text-bottom">
							<text v-if="g.istmall" class="good-price-favour">天猫价￥{{ g.original_price }}</text>
							<text v-else class="good-price-favour">淘宝价￥{{ g.original_price }}</text>
							<text class="good-sell-number">已售{{ g.sales_num }}件</text>
						</view>
						<view class="uni-good-list-text-bottom">
							<text class="good-price">券后￥{{ g.price }}</text>
							<text class="good-quan">￥{{ g.coupon_price }}元券</text>
						</view>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	components: {},
	computed: {
		...mapGetters('footprint', {
			goods: 'goods'
		}),
		...mapGetters('footprint',{
			invalidGoods:'invalidGoods'
		})
	},
	data() {
		return{}
	},
	onLoad: function(options) {
		this.getData();
	},
	methods: {
		async getData() {
			uni.showLoading({
				title: '数据加载中...'
			});
			await this.$store.dispatch('footprint/GetGoods');
			uni.hideLoading();
		},
		goodClick(g){
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
		clearInvalidGood(){
			
		}
	},
	onNavigationBarButtonTap() {
		uni.showModal({
			title: '提示',
			content: '确定删除浏览记录吗?删除无法恢复！',
			success: res => {
				if (res.confirm) {
					this.$store.dispatch('footprint/CleanGoods');
				}
			}
		});
	}
};
</script>

<style>
.clear-invalid-good{
	background: #FFFFFF;
	display: flex;
	height: 100upx;
	align-items: center;
	justify-content: center;
	margin: 10upx 0 10upx 0;
}
.clear-invalid-good text{
	color: #e80080;
	height: 50upx;
	border: 1px solid #e80080;
	padding: 0 5px 0 5px;
	border-radius: 5px;
}
.good-quan {
	position: absolute;
	right: 4px;

	/* background-color: #ff3333; */
	color: #e80080;
	padding: 0 4px;
	border: 1px solid #e80080;
	/* border-radius: 2px; */
}

.good-price {
	color: #e80080;
	margin-left: 4px;
}
.good-sell-number {
	right: 4px;
	padding: 0 4px;
}
.good-price-favour {
	color: #888888;
	text-decoration: line-through;
	margin-left: 4px;
}

.uni-good-list-text-bottom {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
</style>
