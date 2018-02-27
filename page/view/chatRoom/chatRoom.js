var strophe = require('../../../util/webIM/strophe.js');
var WebIM = require('../../../util/webIM/WebIM.js');
var WebIM = WebIM.default;
const req = require('../../../util/request.js');
const config = require('../../../config.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chatMsg: [],
    yourname: '',
    myname: '',
    sendInfo: '',
    userMessage: '',
    inputMessage: '',
    toView: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var host = config.host;
    var salesOpenid = options.salesOpenid;
    this.setData({
      myname: app.globalData.openid.toLowerCase(),
      yourname: salesOpenid.toLowerCase()
    });
    var requestData = {};
    requestData.from = app.globalData.openid;
    requestData.to = salesOpenid;
    req.getRequest(host + "/api/chat/getChatListByOpenid", requestData, "GET", "application/json", function (res) {
      console.log(res);
      var data = res.data.data;
      self.setData({
        chatMsg: data,
        inputMessage: '',
        toView: data[data.length - 1].mid
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  cleanInput: function () {
    var that = this
    var setUserMessage = {
      sendInfo: that.data.userMessage
    }
    that.setData(setUserMessage)
  },
  bindMessage: function (e) {
    this.setData({
      userMessage: e.detail.value
    })
  },
  focus: function () {
    
  },

  /**
   * 发送文本消息
   */
  sendMessage: function () {
    var host = config.host;
    console.log('发送消息');
    if(! this.data.userMessage.trim()) return;

    var self = this;

    // 本人用户名
    var fromName = self.data.myname;
    console.log('本人用户名： ' + fromName);
    var id = WebIM.conn.getUniqueId();
    console.log('uuid: ' + id);
    console.log('文本内容: ' + self.data.sendInfo);
    console.log('发送给： ' + self.data.yourname);
    var msg = new WebIM.message('txt', id);
    msg.set({
      msg: self.data.sendInfo,
      to: self.data.yourname,
      roomType: false,
      success: function(id, serverMsgId) {
        console.log(id);
        console.log(serverMsgId);
        console.log('send text messge success');
      },
      fail: function(e) {
        console.log('send private text err: ' + e);
      }
    });
    console.log('sending textmessge');
    msg.body.chatType = 'singleChat';
    WebIM.conn.send(msg.body);
    console.log(msg);
    if(msg) {
      // 说明发送成功，保存到表中。
      var value = WebIM.parseEmoji(msg.value.replace(/\n/mg, ''));
      console.log("值为： " + JSON.stringify(value));
      var time = WebIM.time();
      var msgData = {
          from: fromName,
          to: msg.body.to,
        // msg: value[0],
        data: value[0].data,
        // style: 'self',
        time: time,
        mid: "WEBIM_" + msg.id
      };
      self.data.chatMsg.push(msgData);
      req.getRequest(host + "/api/chat/saveChatInfo", msgData, "GET", "application/json", function (res) {
        console.log(res);
        self.setData({
          chatMsg: self.data.chatMsg,
          inputMessage: '',
          userMessage: ''
        })
        setTimeout(function () {
          self.setData({
            toView: self.data.chatMsg[self.data.chatMsg.length - 1].mid
          })
        }, 100)
      });
      // self.data.chatMsg.push(msgData);
      // console.log(self.data.yourname);
      // console.log(self.data.myname);
    }
  },

  receiveMsg: function (msg, type) {
    var host = config.host;
    console.log(JSON.stringify(msg));
    var that = this
    var myName = app.globalData.openid;
    console.log(that.data.yourname);
    if (msg.from == (that.data.yourname).toLowerCase() || msg.to == (that.data.yourname).toLowerCase()) {
      console.log("type: " + type);
      if (type == 'txt') {
        var value = WebIM.parseEmoji(msg.data.replace(/\n/mg, ''))

      } 
      //console.log(msg)
      console.log(value)
      var time = WebIM.time()
      var msgData = {
          from: msg.from,
          to: msg.to,
        // msg: value[0],
        data: value[0].data,
        // style: '',
        time: time,
        mid: "WEBIM_" + msg.id
      }
      // if (msg.from == that.data.yourname) {
      //   msgData.style = ''
      // } else {
      //   msgData.style = 'self'
      // }
      req.getRequest(host + "/api/chat/saveChatInfo", msgData, "GET", "application/json", function (res) {
        console.log(res);
        that.setData({
          chatMsg: that.data.chatMsg,
        })
        setTimeout(function () {
          that.setData({
            toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
          })
        }, 100)
      });
      console.log(msgData);
      that.data.chatMsg.push(msgData)
      wx.setStorage({
        key: that.data.yourname + that.data.myname,
        data: that.data.chatMsg,
        success: function () {
          //console.log('success', that.data)
          
        }
      })
    }
  }
})