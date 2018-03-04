// page/view/identifyView/identifyView.js
var app = getApp();
const Upyun = require('../../../util/upyun-wxapp-sdk.js');
const req = require('../../../util/request.js');
const config = require('../../../config.js');

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
        
        console.log(imgPath);
        var signature = "";
        var policy = "";
        var requestData = {};
        requestData.pic = imgPath.split("tmp/")[1];
        req.getRequest("https://uplus.xspace.gd.cn/jmsw-uplus/upyun/cardBaoDuAIPic", requestData, "GET", "application/json", function (res) {
          console.log(res);
          signature = res.data.data.sign;
          policy = res.data.data.policy;
          console.log(signature);
          const upyun = new Upyun({
            bucket: app.globalData.bucketName,
            operator: 'uadmin',
            getSignatureUrl: 'https://uplus.xspace.gd.cn/jmsw-uplus/upyun/cardBaoDuAIPic',
            signature: signature,
            policy: policy
          })
          upyun.upload({
            localPath: imgPath,
            remotePath: '/card/baiduAI',
            success: function (res) {
              console.log('uploadImage success, res is:', res)

              self.setData({
                imgPath
              })
            },
            fail: function ({ errMsg }) {
              console.log('uploadImage fail, errMsg is', errMsg)
            }
          })
        });
        
        // wx.uploadFile({
        //   url: host + '/api/wechat/uploadImage',
        //   header: {},
        //   filePath: imgPath,
        //   formData: {
        //     'openid': options.openid
        //   },
        //   name: 'file',
        //   success: function (uploadRes) {
        //     console.log(uploadRes);
        //     if (uploadRes.data) {
        //       var img = uploadRes.data;
        //       if (options.flag == "add") {
        //         var detectData = {
        //           imgUrl: img,
        //           userInfo: options.userInfo,
        //           openid: options.openid
        //         }
        //         req.getRequest(host + "/api/baiduAI/facesetAdd", detectData, "POST", "application/x-www-form-urlencoded", function (detectRes) {
        //           console.log(detectRes);
        //           if (detectRes) {
        //             if (detectRes.data.code == "000") {
        //               // 没有检测到人脸，继续循环调用
        //               console.log("没有检测到人脸");
        //               self.takePhoto(options);
        //             } else if (detectRes.data.code == "200") {
        //               var data = detectRes.data.data;
        //               console.log(data);
        //               wx.showToast({
        //                 title: '上传人脸库成功',
        //                 duration: 2000
        //               })

        //               // wx.navigateBack({
        //               //   delta: 1
        //               // });
        //             }
        //           }

        //         }, function (addErr) {
        //           console.log(addErr);
        //         })
        //       } else {
        //         var identifyData = {
        //           imgUrl: img
        //         }
        //         req.getRequest(host + "/api/baiduAI/facesetIdentify", identifyData, "POST", "application/x-www-form-urlencoded", function (identifyRes) {
        //           console.log(identifyRes);
        //           if (identifyRes) {
        //             if (identifyRes.data.code == "000") {
        //               // 没有检测到人脸，继续循环调用
        //               console.log("没有检测到人脸");
        //               self.takePhoto(options);
        //             } else if (identifyRes.data.code == "200") {
        //               var data = identifyRes.data.data;
        //               console.log(data[0].user_info);
        //               wx.showToast({
        //                 title: '人脸识别成功',
        //               })

        //               // wx.navigateBack({
        //               //   delta: 1
        //               // });
        //             }
        //           }

        //         }, function (err) {
        //           console.log(err);
        //         })
        //       }

        //     }
        //   }, fail: function() {

        //   }
        // })

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
  onShow: function (options) {
    console.log(options);
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
  /**
   * 扫描二维码
   */
  scanCode: function() {
    wx.scanCode({
      scanType: ['qrCode'],
      success: function(res) {
        console.log(res);
      }
    })
  }
})