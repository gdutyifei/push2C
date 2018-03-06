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
    var self = this;
    var host = config.host;
    var salesId = app.globalData.salesId;
    var openid = app.globalData.openid;
    
    var imgDomain = app.globalData.imgDomain;
    if (imgDomain == null) {
      imgDomain = "https://file.xspace.gd.cn/";
    }
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
          console.log(data.cover_url);
          data.cover_url = imgDomain + "card/sales/" + data.cover_url;
          var photos = data.photos;
          if(photos && photos.indexOf(",") != -1) {
            // 说明有,
            var imgList = photos.split(",");
            var newImgList = [];
            for(var i in imgList) {
              if(imgList[i] != "") {
                imgList[i] = imgDomain + "card/sales/" + imgList[i];
                newImgList.push(imgList[i]);
              }
              
            }
            console.log(newImgList);
            data.imgList = newImgList;
          } else {
            var imgList = [];
            var photo = imgDomain + "card/sales/" + photos;
            imgList.push(photo);
            data.imgList = imgList;
          }
          self.setData({
            info: data
          })
        }
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
    console.log("执行转发");
    var host = config.host;
    var self = this;
    var info = self.data.info;
    var userInfo = JSON.parse(app.globalData.userInfo);
    var name = userInfo.nickName;
    console.log(info);
    return {
      title: info.name,
      imageUrl: info.cover_url,
      path: '/page/view/cardList/cardList?salesId=' + info.id + '&name=' + name,
      success: function() {
        console.log("转发成功");
        info.relay = parseInt(info.relay) + 1;
        self.setData({
          info: info
        });
        var requestData = {};
        requestData.openid = app.globalData.openid;
        requestData.sales_id = self.data.info.id;
        req.getRequest(host + "/api/salesInfo/saveRankTranspondDetail", requestData, "GET", "application/json", function (res) {
          console.log(res);
        });
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
    var host = config.host;
    var info = this.data.info;
    var salesId = info.id;
    console.log(salesId);
    var tel = this.data.info.tel;
    var requestData = {};
    requestData.openid = app.globalData.openid;
    requestData.sales_id = salesId;
    requestData.phone = tel;
    req.getRequest(host + "/api/salesInfo/saveRankCallDetail", requestData, "GET", "application/json", function (res) {
      console.log(res);
    });
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  /**
   * 复制到剪切板
   */
  copy: function(e) {
    var self = this;
    var wechat = this.data.info.wechat;
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
      lastName: self.data.info.name,
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
  },
  /**
   * 点赞
   */
  thumbBtn: function(e) {
    
    var host = config.host;
    var info = this.data.info;
    info.thumb = parseInt(info.thumb) + 1;
    this.setData({
      info: info
    })
    var salesId = info.id;
    console.log(salesId);
    var requestData = {};
    requestData.openid = app.globalData.openid;
    requestData.sales_id = salesId;
    req.getRequest(host + "/api/salesInfo/saveRankClickPraiseDetail", requestData, "GET", "application/json", function (res) {
      console.log(res);
    });
  },
  goToChat: function (e) {
    wx.navigateTo({
      url: '/page/view/chatRoom/chatRoom?salesOpenid=' + app.globalData.salesOpenid + '&salesId=' + app.globalData.salesId,
    })
  },
  goToStore: function(e) {
    wx.switchTab({
      url: '/page/view/myStore/myStore',
    })
  },
  formSubmit: function(e) {
    var host = config.host;
    var formId = e.detail.formId;
    console.log(formId);
    var requestData = {};
    requestData.openid = app.globalData.openid;
    requestData.formId = formId;
    req.getRequest(host + "/api/formIdInfo/saveFormInfo", requestData, "GET", "application/json", function (res) {
      console.log(res);
    });
  }
})