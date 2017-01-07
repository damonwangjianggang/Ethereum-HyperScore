//处理客户查询详情的路由
var Web3 = require('web3');
var express = require('express');
var fs = require('fs');
var commonUtils = require('../../public/javascripts/utils/commonUtils');

//web3初始化
var web3;
if(typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
}
else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

/**
 * 注意交易方法和Constant方法的调用，目前指定以下规范：
 * （1）Constant方法不发送from,gas参数；
 * （2）返回给前端的JSON中不包含txInfo（区块的交易信息）；
 *
 * （3）交易方法一定要发送from参数，如果发生OOG，才发送gas参数；
 * （4）返回给前端的JSON中一定要包含txInfo;
 */

/**
 * 状态码：
 * 0：成功
 * 1：失败
 *
 * @param req
 * phone:手机号
 *
 * @param res
 * code:状态码
 * message:消息
 * info:用户的详情
 */
module.exports.query = function (req, res) {

    console.log("请求参数：" + req.query.phone);
    global.contractInstance.getCustomerInfo(req.query.phone, function (error, result) {
        if (!error) {
            console.log("客户address： " + result[0] + "客户手机：" + commonUtils.hexCharCodeToStr(result[1]) + "积分余额：" + result[2]);

            var obj = {
                address: result[0],
                phone: commonUtils.hexCharCodeToStr(result[1]),
                score: result[2]
            };

            var response = {
                code: 0,
                message: "查询信息成功",
                info: obj
            };

            res.send(JSON.stringify(response));
            res.end();
        }
        else {
            console.log("发生错误：" + error);
            var response = {
                code: 1,
                message: error.toString(),
                info: ""
            };
            res.send(JSON.stringify(response));
            res.end();
        }
    });
};