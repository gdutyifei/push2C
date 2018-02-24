// page/view/myProduct/myProduct.js
var app = getApp();
const req = require('../../../util/request.js');
const config = require('../../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [{
      productId: 1,
      productImg: '/image/header.png',
      productName: '新品沙发001',
      productPrice: '6666'
    }, {
      productId: 2,
      productImg: '/image/header.png',
      productName: '新品沙发001',
      productPrice: '6666'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var salesOpenid = app.globalData.salesOpenid;
    console.log("openid: " + salesOpenid);
    var host = config.host;
    var requestData = {};
    requestData.openid = salesOpenid;
    req.getRequest(host + "/api/productInfo/getProductListByOpenid", requestData, "GET", "application/json", function (res) {
      console.log(res);
      if (res && res.data.code == '200') {
        var data = res.data.data;
        console.log(data);
        self.setData({
          productList: data
        })
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
  // 点击进入详情
  goToDetail: function(e) {
    var productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/page/view/productDetail/productDetail?id=' + productId,
    })
  },
  goToChat: function(e) {
    wx.navigateTo({
      url: '/page/view/chatRoom/chatRoom?salesOpenid=' + app.globalData.salesOpenid,
    })
  }
})