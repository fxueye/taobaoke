<template>
	<view class="about">
		<view class="titile">桔子精选</view>
		<text class="content">桔子精选所有商品和优惠均来自互联网，由于商品信息未及时更新等不可抗原因，可能到时商品和优惠信息与实际有所不同，所有商品信息请以对应店铺内显示的信息为准。</text>
		<text class="content">桔子精选提醒用户，购买商品前请注意谨慎核实商品相关信息。如对商品/服务的标题、价格、详情等任何信息有任何疑问，请在购买前与商品所在店铺经营者沟通确认。</text>
		<text class="content">桔子精选存在海量的商品信息，如您返现商品中有任何违法/违规信息，请联系客户进行反馈帮助我们变得更好！</text>
		<view class="foot">Copyright © 桔子精选版权所有</view>
	</view>
</template>

<script>
export default {
	components: {},
	computed: {},
	data() {
		return {};
	},
	onLoad: function(options) {
		this.getData();
	},
	methods: {
		async getData() {}
	}
};
</script>

<style>
.titile {
	color: #333333;
	font-size: 30px;
	text-align: center;
}
.content{
	padding: 0 40upx 0 40upx;
	color: #8F8F94;
	margin-top: 40upx;
}

.about {
	display: flex;
	justify-content: center;
	flex-direction: column;
}
.foot{
	margin-top: 100upx;
	color: #8F8F94;
	text-align: center;
}
</style>
