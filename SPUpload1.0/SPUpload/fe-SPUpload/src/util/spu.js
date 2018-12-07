/*
* @Author: sznews
* @Date:   2018-10-26 15:55:49
* @Last Modified by:   sznews
* @Last Modified time: 2018-11-23 17:29:51
*/
var _spu={
	//网络请求到后台
	request:function(param){
		var _this=this;
		$.ajax({
			type:param.method||'get',
			url:param.url||'',
			datatype:param.type||'json',
			data:param.data||'',
			success:function(res){
				console.log('响应成功'+res.msg);
				//请求成功
				if(0===res.state){
					typeof param.success==='function'&&param.success(res.scode,res.msg);
				}
				//如果没有登录状态，需要强制登录
				else if(10===res.state){
					_this.doLogin;
				}
				//请求数据错误
				else if(1===res.state){
					console.log('status等于1');
					typeof param.error==='function'&&param.error(res.msg);
				}
			},
			error:function(err){
				console.log('响应错误');
				typeof param.error==='function'&&param.error(err.statusText);
			}
		});
	},
	//获取url的参数,1
	getUrlParam:function(name){
		var reg=new RegExp('(^|&)'+name+'=([^&]*)(&|$)');
		var result=window.location.search.substr(1).match(reg);
		return result?decodeURIComponent(result[2]):null;
	},
	//统一登录处理
	doLogin:function(){
		window.location.href='./user-login.html?redirect'+encodeURIComponent(window.location.href);
	},
	// 登录字段验证
	validate:function(value,type){
        var value=$.trim(value);
		//非空验证
		if('require'===type){
			return !!value;
			console.log(!!value);
		}
    }
};
module.exports=_spu;