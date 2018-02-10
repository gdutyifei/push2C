// camera.js
var req = require('../../../util/request.js');
var app = getApp();
Page({
  data: {
    date: "",
    userInfo: {},
    openid: ""
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var data = e.detail.value; 
    wx.showToast({
      title: '提交成功',
    })
    this.setData({
      userInfo: JSON.stringify(data)
    })
    console.log(this.data.userInfo);
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  jumpToPhoto() {
    var userInfo = this.data.userInfo;
    var openid = this.data.openid;
    console.log(userInfo);
    var flag = "add";
    wx.navigateTo({
      url: '/page/view/camera/camera?userInfo=' + userInfo + "&openid=" + openid + "&flag=" + flag,
    })
    
  },
  jumpToIdentify() {
    var openid = this.data.openid;
    var flag = "identify";
    wx.navigateTo({
      url: '/page/view/camera/camera?openid=' + openid + "&flag=" + flag,
    })
  },
  // 识别人脸并上传人脸库
  detectPhoto() {
    var self = this;
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res.tempImagePath);
        this.setData({
          src: res.tempImagePath
        })
        var img = res.tempImagePath;
        var detectData = {
          imgUrl: img,
          userInfo: self.userInfo
        }
        req.getRequest("http://localhost:8080/api/baiduAI/facesetAdd", detectData, "POST", "application/x-www-form-urlencoded", function(detectRes) {
            console.log(detectRes);
         })
      }
    })
  },

  onLoad: function() {
    var self = this;
    // setInterval(function () {
    //   //循环执行代码  
    //   self.detectPhoto();
    // }, 3000) //循环时间 这里是1秒 
    app.getUserInfo(function (e) {
      console.log(e);
      var userInfo = self.data.userInfo;
      console.log(app.globalData);
      // userInfo.openid = app.globalData.openid;
      self.setData({
        userInfo: userInfo,
        openid: app.globalData.openid
      }, function(err) {
        console.log(err);
      })
    });
    
    
    
  },
  error(e) {
    console.log(e.detail)
  }
})