/*
 * @Author: sznews
 * @Date:   2018-10-26 15:47:12
 * @Last Modified by:   sznews
 * @Last Modified time: 2018-11-23 17:29:54
 */
var _spu = require('../util/spu.js');
var _user = {
    login: function(userInfo, resolve, reject) {
        _spu.request({
            url: 'http://localhost:8080/appupload/user/LoginHandle',
            method: 'POST',
            dataType: 'text',
            data: userInfo,
            success: resolve,
            error: reject
        });
    },
    getScode:function(resolve,reject){
        _spu.request({
            url:'http://localhost:8080/appupload/user/sCodeProducer',
            method:'GET',
            success:resolve,
            error:reject
        });
    },
    
};
module.exports=_user;