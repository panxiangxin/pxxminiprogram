// pages/ucenter/userNotice/index.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({

  data: {
      userInfo: {},
      loading: 0,
      notice: []
     
  },
  getUserNotice: function () {
    let that = this;
    util.request(api.getUserNotice).then(function(res){
      if (res.success) {
        console.log(res)
        that.setData({
          notice: res.data,
          loading: 1
        })
      }
    })
  },
  onShow: function () {
    this.getUserNotice();
    let userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo
    })
  },
  read(e) {
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    let that = this;
    if(status == 1) {
      return
    }
     util.request(api.clickNotice + id).then(function (res) {
        if(res.success) {
          that.getUserNotice()
        }
        else {
          util.showErrorToast(res.message)
        }
     })
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
  }
})