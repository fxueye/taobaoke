<template>
	<!-- <view class="container"> -->
		<view class="page-body">
			<scroll-view id="tab-bar" class="nav-left" scroll-y :scroll-top="scrollTop">
				<block :key="index"  v-for="(cate, index) in categorys">
					<view :class="{'active':index==tabIndex}" :id="'tab_'+cate.id" :data-current="index"  class="nav-left-item" @click="tapTab(cate,index)" >
						{{cate.name}}
					</view>	
				</block>
			</scroll-view>
			<view class="nav-right">
				<swiper :current="tabIndex" vertical="false" class="swiper-box" skip-hidden-item-layout="true"  @change="changeTab">
					<block v-for="(cate,idx) in categorys" :key="idx">
						<swiper-item v-if="cate">
							<!-- 无法滑动 优化点 -->
							<scroll-view  scroll-y >
									<view class="nav-right-item" v-for="(scate,index) in cate.sub_categorys" :key="index" @click="tagClick(cate,scate)">
										<image lazy-load :src="scate.icon" />
										<view>{{scate.name}}</view>
									</view>
							</scroll-view>
						</swiper-item>						
					</block>
				</swiper>
			</view>
		</view>
	<!-- </view> -->
</template>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	components: {
		
	},
	computed:{
		...mapGetters('category',{
			categorys:'tcategorys'
		})
	},
	onLoad:function(options){
		this.getData()
	},
	data() {
		return {
			isClickChange:false,
			height: 0,
			tabIndex: 0,
			scrollTop: 0,
		}
	},
	methods: {
		getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
		},
		tagClick(cate,scate){
			// uni.navigateTo({
			// 	url: '/pages/activity/index?id=0&name='+scate.name+'&scid=' + scate.id
			// });
			
			uni.showLoading({
				title:"数据加载中..."
			})
			this.params = {
				cid:cate.id,
				scid:scate.id,
				score:1,
				page:1,
				id:0
			}
			this.$store.dispatch('good/GetActGoods',this.params).then(()=>{
				uni.hideLoading();		
				uni.navigateTo({
					url: '/pages/activity/index?id=0&name='+scate.name+'&scid=' + scate.id+'&cid='+cate.id
				});
			}).catch(()=>{
				uni.hideLoading();
			});

			
		},
		async tapTab(tab, index) {
			
			if(this.tabIndex == index){
				return false;
			}else{
				let tabBar = await this.getElSize("tab-bar"),tabBarScrollTop = tabBar.scrollTop;
				this.scrollTop = tabBarScrollTop;
				this.isClickChange = true;
				this.tabIndex = index;
			}
			
		},
		async getData(){
			if(this.categorys.length == 0){
				uni.showLoading({
					title:"数据加载中..."
				})
				await this.$store.dispatch('category/GetCategory')
				uni.hideLoading();
			}
			// console.log(this.categorys)
		},
		async changeTab(e){
			// console.log("changeTab:" + index)
			let index = e.target.current
	
			if(this.isClickChange){
				this.tabIndex = index;
				this.isClickChange = false;
				return;
			}
			let tabBar = await this.getElSize("tab-bar"),tabBarScrollTop = tabBar.scrollTop;
			let height = 0;
			for(let i =0 ; i < index; i++){
				let result = await this.getElSize('tab_'+ this.categorys[i].id);
				height += result.height;
			}
			let winHeight = uni.getSystemInfoSync().windowHeight,nowElement = await this.getElSize('tab_' + this.categorys[index].id),nowHeight = nowElement.height;
			if(height + nowHeight - tabBarScrollTop > winHeight){
				this.scrollTop  = height + nowHeight -winHeight;
			}
			if(height < tabBarScrollTop){
				this.scrollTop = height;
			}
			this.isClickChange = false;
			this.tabIndex = index;

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
		// console.log(e)
		if(e.index == 2){
			this.getData()
		}
	}
};
</script>

<style>
	.swiper-box {
		flex: 1;
		width: 100%;
		height: 100%;
		
	}
	
	.page-body {
		display: flex;
		height: 100%;
	}

	.nav {
		display: flex;
		width: 100%;
	}

	.nav-left {
		width: 20%;
		background:#E7E7E7;
	}

	.nav-left-item {
		height: 100upx;
		font-size: 28upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-right {
		width: 80%;
		background:#FFFFFF;
	}

	.nav-right-item {
		width: 28%;
		height: 200upx;
		float: left;
		text-align: center;
		padding: 16upx;
		font-size: 26upx;
	}

	.nav-right-item image {
		width: 100upx;
		height: 100upx;
	}

	.active {
		border-left: solid 4px #FF80AB;
		background: #FFFFFF;
		color: #FF80AB;
	}
</style>
