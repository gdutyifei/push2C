var strophe = require('../../../util/webIM/strophe.js');
var WebIM = require('../../../util/webIM/WebIM.js');
var WebIM = WebIM.default;
const util = require('../../../util/util.js');
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
    toView: '',
    bUrl: "",
    cUrl: "",
    salesOpenid: "",
    salesId: "",
    page: 1,
    scrollTop: 0,
    scrollHeight: 0,
    end: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var userInfo = JSON.parse(app.globalData.userInfo);
    console.log(userInfo);
    var cUrl = userInfo.avatarUrl;
    self.setData({
      cUrl: cUrl
    })
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollHeight: res.windowHeight - 49
        });
      },
    });
    this.setData({
      salesOpenid: options.salesOpenid,
      salesId: options.salesId
    })
    var page = this.data.page;
    this.getData(page);
  },
  getData: function(page) {
    var imgDomain = app.globalData.imgDomain;
    var self = this;
    var host = config.host;
    var salesOpenid = this.data.salesOpenid;
    var salesId = this.data.salesId;
    this.setData({
      myname: app.globalData.openid.toLowerCase(),
      yourname: salesOpenid.toLowerCase()
    });
    var requestData = {};
    requestData.from = app.globalData.openid;
    requestData.to = salesOpenid;
    requestData.page = page;
    requestData.type = "C";
    requestData.salesId = salesId;
    req.getRequest(host + "/api/chat/getChatListByOpenid", requestData, "GET", "application/json", function (res) {
      console.log(res);
     
      var data = res.data.data;
      var bUrl = res.data.bUrl;
      // var cUrl = res.data.cUrl;
      
      // console.log(cUrl)
      var newData = [];
      if (data.length != 0) {
        
        console.log(data);
        for(var i = data.length - 1; i >= 0; i--) {
          newData.push(data[i]);
        }
        for (var i in newData) {
          if(i != 0) {
            var difference = util.timeDifference(newData[i - 1].time, newData[i].time);
            console.log(difference);
            if(difference < 10) {
              newData[i].time2 = "";
            } else {
              newData[i].time2 = newData[i].time;
            }
          } else {
            newData[i].time2 = newData[i].time;
          }
        }
        for (var i in newData) { 
          if (newData[i].time2 != "") {
            newData[i].time2 = util.timetrans(newData[i].time);
          }
        }
        console.log("新数据： " + JSON.stringify(newData));
        // var chatMsg = self.data.chatMsg;
        // if (chatMsg != "" || chatMsg != null && chatMsg.length != 0) {
        //   // for(var i in data) {
        //   //   chatMsg.push(data[i]);
        //   // }
        //   for(var i in chatMsg) {
        //     newData.push(chatMsg[i]);
        //   }
          
        // } else {
        //   chatMsg = newData;
        // }
        // console.log(chatMsg[chatMsg.length - 1].mid);
        self.setData({
          chatMsg: newData,
          inputMessage: '',
          toView: newData[newData.length - 1].mid ,
          bUrl: imgDomain + "card/sales/" + bUrl
          
        });

      } else {
        self.setData({
          bUrl: imgDomain + "card/sales/" + bUrl
        })
        if (self.data.chatMsg.length != 0) {
          self.setData({
            end: true,
            toView: self.data.chatMsg[self.data.chatMsg.length - 1].mid
          })
        }
       
      }
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
      // var time = WebIM.time();
      var time = new Date().getTime()
      var msgData = {
          from: fromName,
          to: msg.body.to,
        // msg: value[0],
        data: value[0].data,
        // style: 'self',
        time: time,
        mid: "WEBIM_" + msg.id
      };
      console.log("全局数据： " + JSON.stringify(self.data.chatMsg));
      //console.log(self.data.chatMsg[self.data.chatMsg.length - 1].time);
      if (self.data.chatMsg != "" && self.data.chatMsg != null && self.data.chatMsg.length != 0) {
        var dif = util.timeDifference(self.data.chatMsg[self.data.chatMsg.length - 1].time, new Date().getTime());
        console.log("相差： " + dif);
        if(dif < 10) {
          msgData.time2 = "";
        } else {
          msgData.time2 = util.timetrans(time);
        }
      } else {
        msgData.time2 = util.timetrans(time);
      }
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
    if (msg.from == (that.data.yourname).toLowerCase() && msg.to == (that.data.myname).toLowerCase()) {
      console.log("type: " + type);
      if (type == 'txt') {
        var value = WebIM.parseEmoji(msg.data.replace(/\n/mg, ''))

      } 
      //console.log(msg)
      console.log(value)
      // var time = WebIM.time()
      var time = new Date().getTime()
      var msgData = {
          from: msg.from,
          to: msg.to,
        // msg: value[0],
        data: value[0].data,
        // style: '',
        time: time,
        mid: "WEBIM_" + msg.id
      }

      if (that.data.chatMsg != "" && that.data.chatMsg != null && that.data.chatMsg.length != 0) {
        var dif = util.timeDifference(that.data.chatMsg[that.data.chatMsg.length - 1].time, new Date().getTime());
        console.log("相差： " + dif);
        if(dif < 10) {
          msgData.time2 = "";
        } else {
          msgData.time2 = time;
        }
      } else {
        msgData.time2 = time;
      }
      that.data.chatMsg.push(msgData);
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
    }
  },

  // 页面滑动到底部
  bindDownLoad: function () {
    var self = this;
    console.log('下拉刷新');
  },
  // 该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  // 该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
  topLoad: function () {
    console.log('上拉刷新');
    var self = this;
    console.log('下拉刷新');
    var page = parseInt(self.data.page) + 1;
    self.setData({
      page: page
    })
    var end = this.data.end;
    if(end) {
      return;
    }
    self.getData(page);
  },
})