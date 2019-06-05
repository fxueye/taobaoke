<template>
	<view v-if="visible">
		<view class="fab-box fab rightBottom"><view class="fab-circle right" @click="onClick"><uni-icon class="fab-arrowup-color" type="arrowup" size="30"></uni-icon></view></view>
	</view>
</template>

<script>
import uniIcon from '@/components/uni-icon/uni-icon.vue';
export default {
	name: 'uni-floating-button',
	components: {
		uniIcon
	},
	props: {
		visible: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		
	},
	created() {},
	computed: {},
	methods: {
		onClick() {
			this.$emit('click');
		}
	}
};
</script>

<style>
.fab-box {
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2;
}

.fab-box.fab {
	z-index: 10;
}

.fab-box.fab.rightBottom {
	right: 30upx;
	bottom: 260upx;
}

.fab-circle {
	opacity: 0.5;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	width: 80upx;
	height: 80upx;
	background: #3c3e49;
	/* background: #5989b9; */
	border-radius: 50%;
	box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);
	z-index: 11;
}
.fab-circle.right {
	right: 0;
}
.fab-arrowup-color{
	color: #FFFFFF;
}
</style>
