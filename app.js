const openIdUrl = require('./config').openIdUrl;
const req = require('./util/request.js');
const config = require('./config.js');
require('./util/webIM/strophe.js')
var WebIM = require('./util/webIM/WebIM.js').default

App({
  getRoomPage: function () {
    return this.getPage("page/view/chatRoom/chatRoom")
  },
  getPage: function (pageName) {
    var pages = getCurrentPages()
    return pages.find(function (page) {
      return page.__route__ == pageName
    })
  },
  onLaunch: function () {
    this.getUserInfo(function (e) {

    }); 
    var host = config.host;
    var data = {};
    data.pf = 4;
    req.getRequest('https://uplus.xspace.gd.cn/jmsw-uplus/start/init', data, "GET", "application/json", function (res) {
      console.log(res);
      var data = res.data.data.upyun;
      var bucketName = data.bucketName;
      var imgDomain = data.domain;
      self.globalData.bucketName = bucketName;
      self.globalData.imgDomain = imgDomain + "/";
      console.log(imgDomain);
      // self.globalData.openid = openid;
    });
    console.log('App Launch')

    var self = this;
    WebIM.conn.listen({
      // 连接成功回调
      onOpened: function(message) {
        console.log("连接成功回调");
        WebIM.conn.setPresence();
      },
      // 处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
      onPresence: function(message) {
        
      },
      // 处理好友申请
      onRoster: function(message) {
        
      },
      // 收到文本消息
      onTextMessage: function(message) {
        var host = config.host;
        var page = self.getRoomPage();
        console.log("消息： " + message);

        if(message) {
          if(page) {
            page.receiveMsg(message, "txt");
          } else {
            var chatMsg = self.globalData.chatMsg || [];
            var value = WebIM.parseEmoji(message.data.replace(/\n/mg, ''));
            console.log(message.id);
            var time = WebIM.time();
            var msgData = {
                from: message.from,
                to: message.to,
                data: value[0].data,
              // msg: {
              //   type: "txt",
              //   data: value
              // },
              time: time,
              mid: "WEBIM_" + message.id
            }
            req.getRequest(host + "/api/chat/saveChatInfo", msgData, "GET", "application/json", function (res) {
              console.log(res);
            });
            // chatMsg = wx.getStorageSync(msgData.yourname + message.to) || [];
            // chatMsg.push(msgData);
          }
        }
      },
      // 各种异常
      onError: function (error) {
        // 16: server-side close the websocket connection
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
          if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
            return;
          }

          wx.showToast({
            title: 'server-side close the websocket connection',
            duration: 1000
          });
          wx.redirectTo({
            url: '../login/login'
          });
          return;
        }
      }
    })
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  // 全局变量
  globalData: {
    hasLogin: false,
    openid: null,
    userInfo: {},
    chatMsg: []
  },
  // 获取用户位置
  getLocationInfo: function () {
    var self = this;
    wx.getLocation({
      success: function (res) {
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
      },
      fail: function (e) {
        console.log(e);
      }
    })
  },
  getOpenid: function(callback) {
    var self = this;
    var host = config.host;
    wx.login({
      success: function(data) {
        var code = data.code;
        var requestData = {};
        requestData.code = code;
        requestData.type = "C";
        req.getRequest(host + "/api/wechat/getOpenidByCode", requestData, "GET", "application/json", function (res) {
          // console.log(res);
          var data = res.data;
          var openid = data.openid;
          // console.log(openid);
          typeof callback == "function" && callback(openid, res);
        });
      }
    })
  },
  // lazy loading openid
  getUserInfo: function (callback) {
    var self = this;
    var host = config.host;
    
    wx.login({
      success: function (data) {
        var code = data.code;
        var requestData = {};
        requestData.code = code;
        requestData.type = "C";
        req.getRequest(host + "/api/wechat/getOpenidByCode", requestData, "GET", "application/json", function (res) {
          // console.log(res);
          var data = res.data;
          var openid = data.openid;
          // console.log(openid);
          var session_key = data.session_key;
          console.log(session_key);

          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              var userInfo = res.rawData;
              var encryptedData = res.encryptedData;
              var iv = res.iv;
              // console.log(userInfo);
              self.globalData.userInfo = userInfo;

              // 插入用户数据
              userInfo = JSON.parse(userInfo);

              userInfo.openid = openid;
              var infoData = {};
              infoData.userInfo = JSON.stringify(userInfo);
              infoData.code = code;
              infoData.type = "C";
              req.getRequest(host + "/api/wechat/saveUserInfo", infoData, "GET", "application/json", function (res) {
                console.log(res);
              }, function (err) {
                console.log(err);
              });

              self.globalData.userInfo = JSON.stringify(userInfo)
              self.globalData.openid = openid;
              self.loginToWebIM();
              typeof callback == "function" && callback(self.globalData.userInfo, res);

            },
            fail: function (err) {
              console.log('wx.getUserInfo 接口调用失败');
            }
          })
        });
      },
      fail: function (err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
        callback(err)
      }
    })
  },
  // 自动登录到环信
  loginToWebIM: function () {
    var self = this;
    var options = {};
    var res = wx.getStorageInfoSync();
    var token = res.webIMToken;
    var userName = res.webIMUserName;
    // 如果账号和token都有缓存的话，使用token登录。
    if (token != null && token != "" && userName != null && userName != "") {
      console.log("使用token登录");
      options = {
        apiUrl: WebIM.config.apiURL,
        user: userName,
        accessToken: token,
        grant_type: self.data.grant_type,
        appKey: WebIM.config.appKey
      };
    } else {
      console.log("使用账号密码登录");
      // console.log(self.globalData.openid);
      // 否则，使用账号密码登录，并缓存userName和token
      options = {
        apiUrl: WebIM.config.apiURL,
        user: self.globalData.openid,
        pwd: self.globalData.openid,
        grant_type: "password",
        appKey: WebIM.config.appkey
      };
      wx.setStorageSync('webIMUserName', self.globalData.openid);
    }
    WebIM.conn.open(options);
  }
})
