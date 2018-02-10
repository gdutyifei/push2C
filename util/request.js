function getRequest(URL, DATA, METHOD, CONTENTTYPE, FUC, ERR) {
  var that = this;
  if (DATA != null) {
    wx.request({
      url: URL,
      method: METHOD,
      header: {
        'content-type': CONTENTTYPE
      },
      data: DATA,
      success: function (resp) {
        console.log(resp);
        FUC(resp);
        return;
      },
      fail: function (resp) {
        ERR(resp);
      }
    })
  }
}

module.exports = {
  getRequest: getRequest
}
