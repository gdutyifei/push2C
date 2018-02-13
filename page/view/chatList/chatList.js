var strophe = require('../../../util/webIM/strophe.js');
var WebIM = require('../../../util/webIM/WebIM.js');
var WebIM = WebIM.default;
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
    // 加为好友
    WebIM.conn.subscribe({
      to: "gdutyifei2"
    });
    var self = this;
    // 获取好友列表
    var rosters = {
      success: function(roster) {
        var member = [];
        console.log(roster);
      }
    };
    WebIM.conn.getRoster(rosters);

    var token = wx.getStorageSync("webIMToken");
    
    // 获取聊天列表
    var option = {
        apiUrl: WebIM.config.apiURL,
        pagenum: 1,
        pagesize: 20,
        accessToken: token,
        success: function(resp){
          console.log("返回");
            console.log(resp);
        },
        error: function(e){
            console.log(e);
        }
    };
    console.log(WebIM.conn);
    WebIM.conn.getChatRooms(option);
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