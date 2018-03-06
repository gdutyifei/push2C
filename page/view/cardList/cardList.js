// page/view/cardList/cardList.js
var app = getApp();
const util = require('../../../util/util.js');
const req = require('../../../util/request.js');
const config = require('../../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [],
    scrollTop: 0,
    scrollHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //   这里要注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    var self = this;
    var scene = decodeURIComponent(options.scene);
    console.log(scene);
    console.log("onload" + JSON.stringify(this));
    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          scrollHeight: res.windowHeight
        });
      },
    });
    // app.getUserInfo(function (e) {

    // });    
    app.getOpenid(function(e) {
      var imgDomain = app.globalData.imgDomain;
      if (imgDomain == null) {
        imgDomain = "https://file.xspace.gd.cn/";
      }
      var openid = e;
      var self = getCurrentPages()[0];
      console.log("getOpenid" + JSON.stringify(self));
      var host = config.host;
      var requestData = {};
      requestData.openid = openid;
      console.log("salesId: " + options.salesId);
      if (options.salesId != "" && options.salesId != null) {
        console.log("来自转发");
        // 来自转发
        var rData = {};
        rData.openid = openid;
        console.log(parseInt(options.salesId));
        rData.salesId =  options.salesId;
        app.globalData.salesId = options.salesId;
        app.globalData.openid = openid;
        rData.way = "1";
        rData.relay_name = options.name;
        console.log(openid);
        console.log(33333);
        req.getRequest(host + "/api/cardList/saveCardToList", rData, "GET", "application/json", function (res) {
          console.log(res);
          app.globalData.salesId = options.salesId;
          app.globalData.salesOpenid = openid;
          wx.switchTab({
            url: '/page/view/myCard/myCard',
          })
        });
      
      
      } else if (scene != "" && scene != null && scene != 'undefined') {
        console.log(scene);
        console.log("来自扫码");
        // 来自扫码
        var rData = {};
        rData.openid = openid;
        rData.salesId = scene;
        rData.way = "0";
        rData.relay_name = "";
        req.getRequest(host + "/api/cardList/saveCardToList", requestData, "GET", "application/json", function (res) {
          console.log(res);
          app.globalData.salesId = options.salesId;
          app.globalData.salesOpenid = openid;
          wx.switchTab({
            url: '/page/view/myCard/myCard',
          })
        });
        
      } else {
        var insertData = {};
        insertData.openid = openid;
        req.getRequest(host + "/api/cardList/saveCardToListTemp", insertData, "GET", "application/json", function (res) {
          console.log(res);
          req.getRequest(host + "/api/cardList/getCardListByOpenid", requestData, "GET", "application/json", function (res) {
            console.log(res);
            if (res && res.data.code == '200') {
              var data = res.data.data;
              if (data != null && data != "") {
                for (var i in data) {
                  data[i].date = util.timetrans(data[i].date);
                  data[i].imageUrl = imgDomain + "card/sales/" + data[i].imageUrl;
                  console.log(data[i]);
                  if (data[i].way == "0") {
                    data[i].way = "扫码";
                  } else if (data[i].way == "1") {
                    data[i].way = "转发";
                  }
                }
                self.setData({
                  cardList: data
                })

              }

            }
          });
        }, function (err) {
          console.log(err);
        });
        
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
    this.goToScan();
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
  // 页面滑动到底部
  bindDownLoad: function() {
    var self = this;
    console.log('下拉刷新');
  },
  // 该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
  scroll: function(event) {
    console.log("scroll");
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  // 该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
  topLoad: function() {
    console.log('上拉刷新');
  },
  // 点击进入名片详情
  enterTheCard: function(e) {
    var salesId = e.currentTarget.dataset.id;
    //var salesId = 1;
    console.log(e.currentTarget.dataset);
    var openid = e.currentTarget.dataset.openid;
    app.globalData.salesId = salesId;
    app.globalData.salesOpenid = openid;
    wx.switchTab({
      url: '/page/view/myCard/myCard',
    })
  },
  goToScan: function() {
    // wx.navigateTo({
    //   url: '/page/view/identifyView/identifyView?openid=' + app.globalData.openid + '&flag=identify' 
    // })
    wx.scanCode({
      scanType: ['qrCode'],
      success: function (res) {
        console.log(res);
      }
    })
  }
})