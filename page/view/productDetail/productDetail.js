// page/view/productDetail/productDetail.js
var app = getApp();
const req = require('../../../util/request.js');
const config = require('../../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productInfo: {},
    isShowConsult: false,
    toastContent: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var productId = options.id;
    var host = config.host;
    var requestData = {};
    requestData.id = productId;
    req.getRequest(host + "/api/productInfo/getProductInfoById", requestData, "GET", "application/json", function (res) {
      console.log(res);
      if (res && res.data.code == '200') {
        var data = res.data.data;
        console.log(data);
        self.setData({
          productInfo: data
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.toast = this.selectComponent("#toast");
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
  // 显示咨询页面
  consultShow: function(e) {
    this.setData({
      isShowConsult: true
    });
    console.log(e);
  },
  formSubmit: function(e) {
    var self = this;
    this.setData({
      isShowConsult: false
    });
    var data = e.detail.value;
    data.salesOpenid = e.detail.target.dataset.openid;
    // data.salesOpenid = app.globalData.openid;
    data.productId = e.detail.target.dataset.id;
    data.title = e.detail.target.dataset.title;
    data.openid = app.globalData.openid;
    console.log(data);

    var host = config.host;
    req.getRequest(host + "/api/consult/saveConsultInfo", data, "GET", "application/json", function (res) {
      console.log(res);
      self.setData({
        toastContent: '提交成功'
      })
      console.log(self.toast);
      self.toast.showToast();
    });
  }
})