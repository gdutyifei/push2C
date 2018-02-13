var strophe = require('../../../util/webIM/strophe.js');
var WebIM = require('../../../util/webIM/WebIM.js');
var WebIM = WebIM.default;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      name: 'gdutyifei1',
      psd: '111111',
      grant_type: 'password'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loginToWebIM();
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

  // 自动登录到环信
  loginToWebIM: function() {
    var self = this;
    var options = {};
    var res = wx.getStorageInfoSync();
    var token = res.webIMToken;
    var userName = res.webIMUserName;
    // 如果账号和token都有缓存的话，使用token登录。
    if(token != null && token != "" && userName != null && userName != "") {
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
      console.log(self.data.name);
      // 否则，使用账号密码登录，并缓存userName和token
      options = {
        apiUrl: WebIM.config.apiURL,
        user: self.data.name,
        pwd: self.data.psd,
        grant_type: self.data.grant_type,
        appKey: WebIM.config.appkey
      };
      wx.setStorageSync('webIMUserName', self.data.name);
    }
    WebIM.conn.open(options);
  }
})