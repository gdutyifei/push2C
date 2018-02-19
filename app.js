const openIdUrl = require('./config').openIdUrl;
const req = require('./util/request.js');
const config = require('./config.js');

App({
  onLaunch: function () {
    console.log('App Launch')
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
    userInfo: {}
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
  // lazy loading openid
  getUserInfo: function (callback) {
    var self = this;
    var host = config.host;
    console.log(self.globalData.userInfo);
    wx.login({
      success: function (data) {
        var code = data.code;
        var requestData = {};
        requestData.code = code;
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
              req.getRequest(host + "/api/wechat/saveUserInfo", infoData, "GET", "application/json", function (res) {
                console.log(res);
              }, function (err) {
                console.log(err);
              });

              self.globalData.userInfo = JSON.stringify(userInfo)
              self.globalData.openid = openid;
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
  }
})
