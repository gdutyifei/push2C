// page/view/camera/camera.js
var req = require('../../../util/request.js');
var config = require('../../../config.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.takePhoto(options);
  },

  takePhoto: function (options) {
    var host = config.host;
    var self = this;
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res.tempImagePath);
        this.setData({
          src: res.tempImagePath
        })
        var imgPath = res.tempImagePath;
        wx.uploadFile({
          url: host + '/api/wechat/uploadImage',
          header: {},
          filePath: imgPath,
          formData: {
            'openid': options.openid
          },
          name: 'file',
          success: function (uploadRes) {
            console.log(uploadRes);
            if (uploadRes.data) {
              var img = uploadRes.data;
              if(options.flag == "add") {
                var detectData = {
                  imgUrl: img,
                  userInfo: options.userInfo,
                  openid: options.openid
                }
                req.getRequest(host + "/api/baiduAI/facesetAdd", detectData, "POST", "application/x-www-form-urlencoded", function (detectRes) {
                  console.log(detectRes);
                  if (detectRes) {
                    if (detectRes.data.code == "000") {
                      // 没有检测到人脸，继续循环调用
                      console.log("没有检测到人脸");
                      self.takePhoto(options);
                    } else if (detectRes.data.code == "200") {
                      var data = detectRes.data.data;
                      console.log(data);
                      wx.showToast({
                        title: '上传人脸库成功',
                        duration: 2000
                      })

                      // wx.navigateBack({
                      //   delta: 1
                      // });
                    }
                  }

                }, function(addErr) {
                  console.log(addErr);
                })
              } else {
                var identifyData = {
                  imgUrl: img
                }
                req.getRequest(host + "/api/baiduAI/facesetIdentify", identifyData, "POST", "application/x-www-form-urlencoded", function (identifyRes) {
                  console.log(identifyRes);
                  if (identifyRes) {
                    if (identifyRes.data.code == "000") {
                      // 没有检测到人脸，继续循环调用
                      console.log("没有检测到人脸");
                      self.takePhoto(options);
                    } else if (identifyRes.data.code == "200") {
                      var data = identifyRes.data.data;
                      console.log(data[0].user_info);
                      wx.showToast({
                        title: '人脸识别成功',
                      })

                      // wx.navigateBack({
                      //   delta: 1
                      // });
                    }
                  }

                }, function(err) {
                  console.log(err);
                })
              }
              
            }
          }
        })

      }
    })
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
  
  }
})