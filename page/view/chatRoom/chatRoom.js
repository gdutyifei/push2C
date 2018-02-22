var strophe = require('../../../util/webIM/strophe.js');
var WebIM = require('../../../util/webIM/WebIM.js');
var WebIM = WebIM.default;
var app = getApp();

var RecordStatus = {
  SHOW: 0,
  HIDE: 1,
  HOLD: 2,
  SWIPE: 3,
  RELEASE: 4
}

var RecordDesc = {
  0: '长按开始录音',
  2: '向上滑动取消',
  3: '松开手取消',
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chatMsg: [],
    emojiStr: '',
    yourname: 'gdutyifei1',
    myname: '',
    sendInfo: '',
    userMessage: '',
    inputMessage: '',
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    show: 'emoji_list',
    view: 'scroll_view',
    toView: '',
    emoji: WebIM.Emoji,
    emojiObj: WebIM.EmojiObj,
    msgView: {},
    RecordStatus: RecordStatus,
    RecordDesc: RecordDesc,
    recordStatus: RecordStatus.HIDE,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      myname: app.globalData.openid
    });
    // this.setData({
    //   sendInfo: "测试发送"
    // });
    // this.sendMessage();

    // // 加为好友
    // WebIM.conn.subscribe({
    //   to: "gdutyifei2"
    // });
    // var self = this;
    // // 获取好友列表
    // var rosters = {
    //   success: function (roster) {
    //     var member = [];
    //     console.log(roster);
    //   }
    // };
    // WebIM.conn.getRoster(rosters);

    // 获取聊天列表
    // var token = wx.getStorageSync("webIMToken");
    // var option = {
    //   apiUrl: WebIM.config.apiURL,
    //   pagenum: 1,
    //   pagesize: 20,
    //   accessToken: token,
    //   success: function (resp) {
    //     console.log("返回");
    //     console.log(resp);
    //   },
    //   error: function (e) {
    //     console.log(e);
    //   }
    // };
    // WebIM.conn.getChatRooms(option);
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

  cleanInput: function () {
    var that = this
    var setUserMessage = {
      sendInfo: that.data.userMessage
    }
    that.setData(setUserMessage)
  },
  bindMessage: function (e) {
    this.setData({
      userMessage: e.detail.value
    })
  },
  focus: function () {
    this.setData({
      show: 'emoji_list',
      view: 'scroll_view'
    })
  },

  /**
   * 发送文本消息
   */
  sendMessage: function () {
    console.log('发送消息');
    // if(! this.data.userMessage.trim()) return;

    var self = this;

    // 本人用户名
    var fromName = self.data.myname;
    console.log('本人用户名： ' + fromName);
    var id = WebIM.conn.getUniqueId();
    console.log('uuid: ' + id);
    console.log('文本内容: ' + self.data.sendInfo);
    console.log('发送给： ' + self.data.yourname);
    var msg = new WebIM.message('txt', id);
    msg.set({
      msg: self.data.sendInfo,
      to: self.data.yourname,
      roomType: false,
      success: function(id, serverMsgId) {
        console.log(id);
        console.log(serverMsgId);
        console.log('send text messge success');
      },
      fail: function(e) {
        console.log('send private text err: ' + e);
      }
    });
    console.log('sending textmessge');
    msg.body.chatType = 'singleChat';
    WebIM.conn.send(msg.body);
    console.log(msg);
    if(msg) {
      // 说明发送成功，保存到表中。
      var value = WebIM.parseEmoji(msg.value.replace(/\n/mg, ''));
      console.log("值为： " + JSON.stringify(value));
      var time = WebIM.time();
      var msgData = {
        info: {
          to: msg.body.to
        },
        username: fromName,
        youname: msg.body.to,
        msg: value[0],
        style: 'self',
        time: time,
        mid: msg.id
      };
      self.data.chatMsg.push(msgData);
      console.log(self.data.yourname);
      console.log(self.data.myname);

      wx.setStorage({
        key: self.data.yourname + self.data.myname,
        data: self.data.chatMsg,
        success: function () {
          //console.log('success', that.data)
          self.setData({
            chatMsg: self.data.chatMsg,
            inputMessage: ''
          })
          setTimeout(function () {
            self.setData({
              toView: self.data.chatMsg[self.data.chatMsg.length - 1].mid
            })
          }, 100)
        }
      })
      self.setData({
        userMessage: ''
      })
    }
  },

  receiveMsg: function (msg, type) {
    console.log(JSON.stringify(msg));
    var that = this
    var myName = app.globalData.openid;
    console.log(that.data.yourname);
    if (msg.from == (that.data.yourname).toLowerCase() || msg.to == (that.data.yourname).toLowerCase()) {
      console.log("type: " + type);
      if (type == 'txt') {
        var value = WebIM.parseEmoji(msg.data.replace(/\n/mg, ''))

      } 
      //console.log(msg)
      console.log(value)
      var time = WebIM.time()
      var msgData = {
        info: {
          from: msg.from,
          to: msg.to
        },
        username: '',
        yourname: (that.data.yourname).toLowerCase(),
        msg: value[0],
        style: '',
        time: time,
        mid: msg.type + msg.id
      }
      if (msg.from == that.data.yourname) {
        msgData.style = ''
        msgData.username = msg.from
      } else {
        msgData.style = 'self'
        msgData.username = msg.to
      }
      //console.log(msgData, that.data.chatMsg, that.data)
      console.log(msgData);
      that.data.chatMsg.push(msgData)
      wx.setStorage({
        key: that.data.yourname + myName,
        data: that.data.chatMsg,
        success: function () {
          //console.log('success', that.data)
          that.setData({
            chatMsg: that.data.chatMsg,
          })
          setTimeout(function () {
            that.setData({
              toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
            })
          }, 100)
        }
      })
    }
  },
  test: function() {
    var that = this;
    var value = "xxxxxx"
    var time = WebIM.time()
    var msgData = {
      info: {
        to: "xxx"
      },
      username: "111",
      yourname: "xxx",
      msg: {
        type: "txt",
        data: value
      },
      style: 'self',
      time: time,
      mid: 1
    }
    console.log(msgData);
    this.data.chatMsg.push(msgData)
    // console.log(that.data.chatMsg)

    wx.setStorage({
      key: "luoyifei" + "xxx",
      data: that.data.chatMsg,
      success: function () {
        //console.log('success', that.data)
        that.setData({
          chatMsg: that.data.chatMsg,
          emojiList: [],
          inputMessage: ''
        })
        setTimeout(function () {
          that.setData({
            toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
          })
        }, 100)
      }
    })
    that.setData({
      userMessage: ''
    })
  }
})