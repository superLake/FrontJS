/*
 * @Author: sznews
 * @Date:   2018-12-04 11:18:11
 * @Last Modified by:   sznews
 * @Last Modified time: 2018-12-07 14:41:55
 */

function SearchResult(articleurl, articletitle) {
    this.articleurl = articleurl;
    this.articletitle = articletitle;
}
// 搜索列表模板
function Template(articleurl, articletitle) {
    this.htmlTemplate = '<div class="imgTxtNews"> <a href="#" target="_blank" class="img"><img src=""  /></a>' +
        '<div class="txtNews"> <a href="' + articleurl + '" class="tit">' + articletitle + '</a>' +
        '<p class="txt">摘要<a href="' + articleurl + '" class="more">[详细]</a></p>' +
        '</div>' +
        '</div>';
}
// 获取url地址参数
function getUrlParmName(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var result = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}
// Ajax异步请求
function request(param) {
    $.ajax({
        type: param.method || 'get',
        url: param.url || '',
        datatype: param.type || 'jsonp',
        data: param.data || '',
        success: function(res) {
            console.log('响应成功' + res.msg);
            //请求成功
            if (0 === res.status) {
                typeof param.success === 'function' && param.success(res.data, res.msg);
            }
            //请求数据错误
            else if (1 === res.status) {
                console.log('status等于1');
                typeof param.error === 'function' && param.error(res.msg);
            }
        },
        error: function(err) {
            console.log('响应错误');
            typeof param.error === 'function' && param.error(err.statusText);
        }
    });
}
// 搜索接口
function search(userInfo, resolve, reject) {
    request({
        //todo 输入后台请求接口
        url:'http://172.16.140.123:10001/xysearchback/search/searchCompanyByNameAndContent',
        // url: 'http://localhost:30623/search/searchCompanyByNameAndContent',
        // url:'http://v1.lzy.com/xysearchback/search/searchCompanyByNameAndContent',
        dataType: 'jsonp',
        data: userInfo,
        success: resolve,
        error: reject
    });
}
// 搜索操作
function searchActive() {
   
        var JsonData = {
            searchName: $.trim($('#Unit').find('option:selected').text()),
            searchContent: $.trim($('#name').val()),
        };
        console.log(JsonData);
        search(JsonData, function(data, res) {
            // todo 输入响应成功后的跳转地址
            // window.location.href='';
            console.log('发送成功:' + res + ',获得数据为：' + data);
            for (item in data) {
                template = new Template(data[item].Articleurl, data[item].Articletitle);
                $('.bd').append(template.htmlTemplate);
            }
            return JsonData;
        }, function(errMsg) {
            console.log('请求失败，失败原因：' + errMsg);
            return null;
        });
   
}
//修改url参数
function changeURLParams(url,param,param_val){
    var pattern=param+'=([^&]*)';
    var replaceText=param+'='+param_val; 
    if(url.match(pattern)){
        var tmp='/('+ param+'=)([^&]*)/gi';
        tmp=url.replace(eval(tmp),replaceText);
        return tmp;
    }else{ 
        if(url.match('[\?]')){ 
            return url+'&'+replaceText; 
        }else{ 
            return url+'?'+replaceText; 
        } 
    }
}
// 页面事件处理
$(function() {
	

		var searchResult = null;
    	var template = null;
    	var searchName = getUrlParmName('searchname');
    	var searchContent = getUrlParmName('searchcontent');
    	console.log("searchname:" + searchName + "&searchcontent:" + searchContent);
    	$('#Unit').find('option:contains("' + searchName + '")').attr('selected', true);
    	$('#name').attr('value', searchContent);

    	searchActive();

    

    $('#search').click(function(){
    	$('.imgTxtNews').remove();
    	var JsonData = {
            searchName: $.trim($('#Unit').find('option:selected').text()),
            searchContent: $.trim($('#name').val()),
        };
    	// searchActive();
    	// window.location.href='http://v1.lzy.com/xysearchfront/index.htm';
    	if(JsonData){
    		// 1、先获取url地址
        	var url=window.location.href;
        	console.log(url);
      	// 2、调用替换函数
    		url=changeURLParams(url,'searchname',JsonData.searchName);
    		url=changeURLParams(url,'searchcontent',JsonData.searchContent);
    		window.location.href=url;
    	}else{
    		alert('输入有误');
    	}
    	
    });
    // var JsonData = {
    //     searchName: $.trim($('#Unit').find('option:selected').text()),
    //     searchContent: $.trim($('#name').val()),
    // };
    // console.log(JsonData);
    // search(JsonData, function(data, res) {
    //     // todo 输入响应成功后的跳转地址
    //     // window.location.href='';
    //     console.log('发送成功:' + res + ',获得数据为：' + data);
    //     for (item in data) {
    //         template = new Template(data[item].Articleurl, data[item].Articletitle);
    //         $('.bd').append(template.htmlTemplate);

    //     }
    // }, function(errMsg) {
    //     console.log('请求失败，失败原因：' + errMsg);
    // });
});