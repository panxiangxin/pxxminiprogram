// pages/ucenter/myBook/index.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
      userInfo: {},
      userBooks: [],
      loading: 0
  },
  getUserBook: function() {
    let that = this;
    util.request(api.getUserBook + '/' + that.data.userInfo.id).then(function(res){
      if(res.success){
        console.log(res.data)
        that.setData({
          userBooks: res.data,
          loading: 1
        })
      }
    })
  },
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo');
    let that = this;
    that.setData({
      userInfo: userInfo
    },()=>{
      that.getUserBook()
    })
  },
  onBottom: function () {

  }
})