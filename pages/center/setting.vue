<template>
	<uni-list class="center-list"><uni-list-item @click="click(0)" :show-extra-icon="true" :extraIcon="clean" title="清除缓存" showArrow="true" rightNote="点击清除" /></uni-list>
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
			clean: {
				fontclass: 'text-icons',
				color: '#ff80ab',
				size: '22',
				type: 'clean'
			}
		};
	},
	methods: {
		click(index) {
			console.log(index);
			switch (index) {
				case 0:
					uni.showModal({
						title: '提示',
						content: '是否清除缓存？',
						success: res => {
							if (res.confirm) {
								try{
									uni.clearStorageSync()
									uni.showToast({
										title:"清除成功",
										duration:1000
									})
								}catch(e){
									//TODO handle the exception
										uni.showToast({
										title:"清除失败请稍后重试",
										duration:1000
									})
								}
							}
						}
					});
					break;
				default:
					break;
			}
		}
	}
};
</script>

<style>
.center-list {
	background-color: #ffffff;
	flex-direction: column;
}
</style>
