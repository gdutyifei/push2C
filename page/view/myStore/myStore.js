// page/view/myStore/myStore.js
var app = getApp();
const req = require('../../../util/request.js');
const config = require('../../../config.js');
const QQMapWX = require('../../../util/qqmap-wx-jssdk.js');
var wxMarkerData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    markers: []
    // latitude: '39.915',
    // longitude: '116.404'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 实例化API核心类
    var tMap = new QQMapWX({
      key: 'Q45BZ-2L4WF-RLHJN-NOET2-T47TH-QAFCX' // 必填
    });
    


    var self = this;
    var imgDomain = app.globalData.imgDomain;
    var salesId = app.globalData.salesId;
    var openid = app.globalData.openid;
    console.log(salesId);
    var host = config.host;
    var requestData = {};
    requestData.salesId = salesId;
    requestData.openid = openid;
    req.getRequest(host + "/api/store/getStoreInfoBySalesId", requestData, "GET", "application/json", function (res) {
      console.log(res);
      if (res && res.data.code == '200') {
        var data = res.data.data;
        console.log(data);
        data.main_pic = imgDomain + "card/company/" + data.main_pic;
        if (data.companyUsers.length != 0) {
          for (var i in data.companyUsers) {
            data.companyUsers[i].pic = imgDomain + "card/company/head/" + data.companyUsers[i].pic;
          }
        }
        console.log(data.lng);
        self.setData({
          info: data,
          longitude: data.lng,
          latitude: data.lat
        })

        // tMap.reverseGeocoder({
        //   location: {
        //     latitude: data.lat,
        //     longitude: data.lng
        //   },
        //   success: function (res) {
        //     console.log(res);
        //   },
        //   fail: function (res) {
        //     console.log(res);
        //   },
        //   complete: function (res) {
        //     console.log(res);
        //   }
        // });
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
  goToChat: function (e) {
    wx.navigateTo({
      url: '/page/view/chatRoom/chatRoom?salesOpenid=' + app.globalData.salesOpenid,
    })
  },
  /**
   * 触发打电话
   */
  phoneCall: function (e) {
    console.log(e);
    var tel = e.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
})