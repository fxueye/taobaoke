function format(str, ... args){
		for(var i= 0; i <  args.length; i++)
			str = str.replace(new RegExp("\\{" + i + "\\}", "g"),args[i]);
		return str;
}
function paseNum(num,fixed = 0){
		var str;
		if(num > 99999999){
			var b = Math.floor(num / 100000000);
			var t =  (num - b * 100000000)/10000;
			str = format("{0}亿{1}万",b.toFixed(fixed),t.toFixed(fixed));
		}else if( num >= 10000){
			var v =num / 10000;
			str = format("{0}万",v.toFixed(fixed));
		}else {
			str = num;
		}
		return str;
}
//解决手机端无法使用解析yyyy-MM-dd hh:mm:ss直接格式 new Date(dateString)  
function string2Date(dateString){
	if(dateString){
		try{
			var arr = dateString.split(' ');
			var ymd = arr[0].split('-');
			var him = arr[1].split(':');
			return new Date(ymd[0],ymd[1],ymd[2],him[0],him[1],him[2]);
		}catch(e){
			//TODO handle the exception
		}
	}
	return new Date(dateString);
}
export {
	format,
	paseNum,
	string2Date
}
