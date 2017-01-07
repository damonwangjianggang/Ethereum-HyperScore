//处理银行发行积分的路由
var Web3 = require('web3');
var express = require('express');
var fs = require('fs');

//web3初始化
var web3;
if(typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
}
else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

/**
 * 返回码说明：
 * 0：成功；
 * 1：失败；
 *
 *
 *
 * @param req
 * phone：用户手机
 * score: 发行的积分数量
 *
 * @param res
 * code:状态码
 * message:消息
 * txInfo:区块链交易信息
 */
module.exports.issue = function (req, res) {
    console.log("请求参数：" + req.query.phone + "    " + req.query.score);

    global.contractInstance.issueScore(req.query.phone, req.query.score, {from: web3.eth.accounts[0]}, function (error, result) {
        if (!error) {
            var eventIssueScore = global.contractInstance.IssueScore();
            eventIssueScore.watch(function (error, result) {
                console.log("状态码：" + result.args.statusCode + "消息：" + result.args.message);
                var response = {
                    code: result.args.statusCode,
                    message: result.args.message,
                    txInfo: result
                };
                eventIssueScore.stopWatching();
                res.send(JSON.stringify(response));
                res.end();
            });
        }
        else {
            console.log("发生错误：" + error);
            var response = {
                code: 1,
                message: error.toString(),
                txInfo: ""
            };
            res.send(JSON.stringify(response));
            res.end();
        }
    });
};