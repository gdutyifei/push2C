// page/view/cardList/cardList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [{
      date: '2018-1-15 10:43',
      way: '扫码',
      store: '林氏木业广州总店',
      name: '张经理',
      job: '店长',
      tel: '13800008978',
      email: '13800008978@163.com',
      imageUrl: '/image/default_image.png'
    }, {
      date: '2018-1-15 10:43',
      way: '扫码',
      store: '林氏木业广州总店',
      name: '张经理',
      job: '店长',
      tel: '13800008978',
      email: '13800008978@163.com',
      imageUrl: '/image/default_image.png'
      }, {
        date: '2018-1-15 10:43',
        way: '扫码',
        store: '林氏木业广州总店',
        name: '张经理',
        job: '店长',
        tel: '13800008978',
        email: '13800008978@163.com',
        imageUrl: '/image/default_image.png'
      }],


    scrollTop: 0,
    scrollHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //   这里要注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    var self = this;
    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          scrollHeight: res.windowHeight
        });
      },
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
  
  },
  // 页面滑动到底部
  bindDownLoad: function() {
    var self = this;
    console.log('下拉刷新');
  },
  // 该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
  scroll: function(event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  // 该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
  topLoad: function() {
    console.log('上拉刷新');
  }
})