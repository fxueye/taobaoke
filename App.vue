<script>

	export default {
		onLaunch: function() {
			this.checkVersion().catch(()=>{
				
			})
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/common.css';

	page{
		background:#E7E7E7;
		height: 100%;
		font-size: 28upx;
		line-height: 1.8;
	}
		
	
</style>
