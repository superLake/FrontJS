/*
 * @Author: sznews
 * @Date:   2018-10-26 15:08:28
 * @Last Modified by:   sznews
 * @Last Modified time: 2018-11-23 17:31:00
 */
require('./index.css');
require('page/communal/nav-simple/index.js');
var mdf = require('md5');
var _user = require('service/user-service.js');
var _spu=require('util/spu.js');
var page = {
    init: function() {
        this.bindEvent();
    },
    bindEvent: function() {
        var _this = this;
        // 获取后台验证码
        _this.getScode();
        // 点击图片刷新验证码
        $('.scode-pic').on('click', function() {
          	_this.getScode();    
        });
        //登录按钮的点击
        $('#submit').click(function() {
            _this.submit();
        });
        //按回车按钮也能提交
        $('.user-content').keyup(function(e) {
            if (e.keyCode === 13) {
                _this.submit();
            }
        });
    },
    // 获取验证码
    getScode: function() {
        var _this = this;
        _user.getScode(function(scode, msg) {
            console.log('验证码为：' + scode + ',返回信息为：' + msg);
            _this.produceScode(scode);
            return scode;
        }, function(errMsg) {
            alert('验证码获取异常，异常代码：' + errMsg);
            return false;
        });
    },
    // 验证验证码
    checkScode: function(scode) {
        var _this = this;
        var serverScode = _this.getScode();
        var result = {
            status: false,
            msg: ''
        };
        if (scode !== serverScode) {
            result.msg = '验证码错误请重新输入';
            _this.getScode();
            return result;
        }
        //通过验证
        result.status = true;
        result.msg = '验证通过';
        return result;
    },
    //提交方法
    submit: function() {
        // var scode=_this.getScode();
        //appid
        var kAppKey = 'd2a57dc1d883fd21fb9951699df71cc7';
        //appscret
        var kAppSecret = 'dbaeee203864aada45af1afb181ceb26';
        //时间戳
        var timestamp = Date.parse(new Date());
        //8位随机数
        var randomnum = parseInt(Math.random() * (99999999 - 10000000 + 1) + 10000000, 10);
        //数字签名
        var params = "username=" + username + "&password=" + password;
        var sign = this.getSign(params, kAppKey, kAppSecret);
        //需要提交给服务器的数据:用户名，密码，appid，8位随机数，数字签名，时间戳
        var JsonData = {
            username: $.trim($('#username').val()),
            userpass: $.trim($('#password').val()),
            appid: kAppKey,
            nonce: randomnum,
            signature: sign,
            timestamp: timestamp
        };
        var scode = $.trim($('#scode').val());
        var scodeResult = this.checkScode(scode);
        var validateResult = this.validateData(JsonData);
        if (scodeResult.status && validateResult) {
            _user.login(JSON.stringify(JsonData), function(res) {
                window.location.href = _spu.getUrlParam('redirect') || './pic-upload.html';
            }, function(errMsg) {
                alert('登录失败，错误代码' + errMsg);
            });
        }
        //验证失败
        else{
        	if(!scodeResult.status){
        		alert(scodeResult.msg);
        	}else{
        		alert(validateResult.msg);
        	}
        }
        //验证验证码是否正确
        // _user.checkScode(scode,function(res){
        // 	console.log('验证码正确');
        // });
        //将JsonData提交到后台

    },

    //生成数字签名
    getSign: function(params, kAppKey, kAppSecret) {
        if (typeof params == "string") {
            return this.paramsStrSort(params, kAppKey, kAppSecret);
        } else if (typeof params == "object") {
            var arr = [];
            for (var i in params) {
                arr.push(i + "=" + params[i]);
            }
            return this.paramsStrSort(arr.join("&"), kAppKey, kAppSecret);
        }
    },
    paramsStrSort: function(paramsStr, kAppKey, kAppSecret) {
        var url = paramsStr + "&appkey=" + kAppKey;
        var urlStr = url.split("&").sort().join("&");
        var newUrl = urlStr + '&key=' + kAppSecret;
        return mdf(newUrl);
    },
    // 生成验证码
    produceScode: function(scode) {
        var canvas_width = $('.scode-pic').width();
        var canvas_height = $('.scode-pic').height();
        var canvas = document.querySelector('.scode-pic');
        // var scodeLenght=scode.split('').length;
        // 产生0~30的随机弧度
        var deg = Math.random() * Math.PI / 180;

        var context = canvas.getContext('2d');
        canvas.width = canvas_width;
        canvas.height = canvas_height;
        var x = 5
        var y = 20 + Math.random() * 8;
        context.font = "bold 23px 微软雅黑";
        context.translate(x, y);
        context.rotate(deg);
        context.fillStyle = this.randomColor();
        context.fillText(scode, 0, 0);
        context.rotate(-deg);
        context.translate(-x, -y);
        // for(var i=0;i<length;i++){
        // 	// show_num[i]=scode.toLowerCase();
        // 	var x=10+i*20;
        // 	var y=20+Math.random()*8;
        // 	context.font="bold 23px 微软雅黑";

        // 	context.translate(x,y);
        // 	context.rotate(deg);

        // 	context.fillStyle=randomColor();
        // 	context.fillText(scode,0,0);

        // 	context.rotate(-deg);
        // 	context.translate(-x,-y);
        // }
        // 产生干扰线
        for (var i = 0; i <= 5; i++) {
            context.strokeStyle = this.randomColor();
            context.beginPath();
            context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
            context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
            context.stroke();
        }
        for (var i = 0; i <= 30; i++) {
            context.strokeStyle = this.randomColor();
            context.beginPath();
            var x = Math.random() * canvas_width;
            var y = Math.random() * canvas_height;
            context.moveTo(x, y);
            context.lineTo(x + 1, y + 1);
            context.stroke();
        }

    },
    // 产生随机颜色
    randomColor: function() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
    },
    //验证表单信息
    validateData: function(formData, scode) {
        var result = {
            status: false,
            msg: '',
        };
        if (!_spu.validate(formData.username, 'require')) {
            result.msg = '用户名不能为空';
            return result;
        }
        if (!_spu.validate(formData.password, 'require')) {
            result.msg = '密码不能为空';
            return result;
        }
        if (!($('#scode').val())) {
            result.msg = '验证码不能为空';
            return result;
        }

    },

};
$(function() {
    page.init();
});