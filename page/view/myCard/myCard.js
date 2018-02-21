// page/view/myCard/myCard.js
var app = getApp();
const req = require('../../../util/request.js');
const config = require('../../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    toastContent: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene);
    console.log(scene);
    var self = this;
    var host = config.host;
    var salesId = app.globalData.salesId;
    var openid = app.globalData.openid;
    
    var requestData = {};
    requestData.salesId = salesId;
    requestData.openid = openid;
    req.getRequest(host + "/api/salesInfo/getSalesInfoBySalesId", requestData, "GET", "application/json", function (res) {
      console.log(res);
      if (res && res.data.code == '200') {
        var data = res.data.data;
        console.log(data);
        var salesOpenid = data.openid;
        app.globalData.salesOpenid = salesOpenid;
        if(data != null && data != "") {
          var photos = data.photos;
          if(photos && photos.indexOf(",") != -1) {
            // 说明有,
            var imgList = photos.split(",");
            console.log(imgList);
            data.imgList = imgList;
          }
          self.setData({
            info: data
          })
        }

        // 阅读量+1
        var redisData = {};
        redisData.key = salesOpenid
        redisData.key = salesOpenid + "_read";
        redisData.value = openid;
        req.getRequest(host + "/api/redis/saveToRedis", redisData, "GET", "application/json", function (res) {
            console.log(res);
          });
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
    return {
      title: '自定义标题',
      path: '/page/view/myCard/myCard',
      success: function() {
        console.log("转发成功");
      },
      fail: function(err) {
        console.log("转发失败： " + err);
      }
    }
  },

  /**
   * 预览图片
   */
  previewImage: function(e) {
    var self = this;
    var imageUrl = e.target.dataset.src;
    wx.previewImage({
      current: imageUrl,
      urls: self.data.info.imgList,
    })
  },
  /**
   * 触发打电话
   */
  phoneCall: function(e) {
    // console.log(e);
    var tel = e.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  /**
   * 复制到剪切板
   */
  copy: function(e) {
    var self = this;
    var wechat = e.target.dataset.wechat;
    wx.setClipboardData({
      data: wechat,
      success: function(res) {
        console.log(res);
        self.setData({
          toastContent: '已复制到剪切板',
        });
        self.toast.showToast();
      }
    })
  },
  /**
   * 同步到通讯录
   */
  addContact: function(e) {
    var self = this;
    var tel = this.data.info.tel;
    console.log(tel);
    wx.addPhoneContact({
      firstName: self.data.info.name,
      mobilePhoneNumber: self.data.info.tel,
      weChatNumber: self.data.info.wechat,
      organization: self.data.info.store,
      title: self.data.info.job,
      success: function(res) {
        console.log(res);
      }
    })
  },
  /**
   * 转发
   */
  relayBtn: function(e) {
    this.onShareAppMessage();
  }
})