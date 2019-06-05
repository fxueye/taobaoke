<template>
	<view>
        <web-view :webview-styles="webviewStyles" :src="url"></web-view>
    </view>
</template>

<script>
	  export default {
		onLoad:function(options){
			this.url = options.url;
			console.log(this.url);
		},
        data() {
            return {
				url:'',
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                }
            }
        }
    }
</script>

<style>
</style>
