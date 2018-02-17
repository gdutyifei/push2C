var strophe = require('../../../util/webIM/strophe.js');
var WebIM = require('../../../util/webIM/WebIM.js');
var WebIM = WebIM.default;

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
    toName: 'gdutyifei3',
    myName: '',
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
      sendInfo: "测试发送"
    });
    this.sendMessage();

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

  /**
   * 发送文本消息
   */
  sendMessage: function () {
    console.log('发送消息');
    // if(! this.data.userMessage.trim()) return;

    var self = this;

    // 本人用户名
    var fromName = wx.getStorageSync("webIMUserName");
    console.log('本人用户名： ' + fromName);
    var id = WebIM.conn.getUniqueId();
    console.log('uuid: ' + id);
    console.log('文本内容: ' + self.data.sendInfo);
    console.log('发送给： ' + self.data.toName);
    var msg = new WebIM.message('txt', id);
    msg.set({
      msg: self.data.sendInfo,
      to: self.data.toName,
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
      var time = WebIM.time();
      var msgData = {
        info: {
          to: msg.body.to
        },
        username: fromName,
        youname: msg.body.to,
        msg: {
          type: msg.type,
          data: value
        },
        style: 'self',
        time: time,
        mid: msg.id
      };
      self.data.chatMsg.push(msgData);
    }
    


  }
})