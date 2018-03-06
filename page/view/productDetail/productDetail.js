// page/view/productDetail/productDetail.js
var app = getApp();
const util = require('../../../util/util.js');
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
    var imgDomain = app.globalData.imgDomain;
    if(imgDomain == null) {
      imgDomain = "https://file.xspace.gd.cn/";
    }
    console.log(imgDomain);
    console.log(222);
    var productId = options.id;
    console.log(productId);
    var host = config.host;
    var requestData = {};
    requestData.id = productId;
    req.getRequest(host + "/api/productInfo/getProductInfoById", requestData, "GET", "application/json", function (res) {
      console.log(res);
      if (res && res.data.code == '200') {
        var data = res.data.data;
        data.cover_url = imgDomain + "card/product/" + data.cover_url;
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
  onShareAppMessage: function (e) {
    var self = this;
    console.log(self.data.productInfo.cover_url);
    console.log("转发");
    return {
      title: self.data.productInfo.product_name,
      imageUrl: self.data.productInfo.cover_url,
      path: '/page/view/productDetail/productDetail?id=' + self.data.productInfo.id,
      success: function () {
        console.log("转发成功");
      },
      fail: function (err) {
        console.log("转发失败： " + err);
      }
    }
  },
  // 显示咨询页面
  consultShow: function(e) {
    this.setData({
      isShowConsult: true
    });
    console.log(e);
  },
  formSubmit: function(e) {
    console.log(e);
    var self = this;
    var data = e.detail.value;
    if (data.name == null || data.name == "") {
      self.setData({
        toastContent: '请输入您的姓名'
      })
      self.toast.showToast();
      return;
    }
    if (data.tel == null || data.tel == "") {
      self.setData({
        toastContent: '请输入您的手机号码'
      })
      self.toast.showToast();
      return;
    }
    var reg = /^1[34578]\d{9}$/;
    if (reg.test(data.tel) == false) {
      self.setData({
        toastContent: '手机号码格式不对'
      })
      self.toast.showToast();
      return;
    }
    if (data.content == null) {
      self.setData({
        toastContent: '请输入咨询内容'
      })
      self.toast.showToast();
      return;
    }
    this.setData({
      isShowConsult: false
    });
    
    
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
  },
  share: function() {
    var productId = this.data.productInfo.id;
    console.log(productId);
  },
  hideConsult: function(e) {
    console.log(e);
    this.setData({
      isShowConsult: false
    });
  }
})