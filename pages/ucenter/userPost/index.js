// pages/ucenter/userPost/index.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    posts: [],
    loading: 0,
  },
  getUserPost: function() {
    let that = this;
    util.request(api.getUserPost).then(function(res){
      if (res.success) {
        console.log(res)
        that.setData({
          posts: res.data,
          loading: 1
        })
      }
    })
  },
  onShow: function () {
    this.getUserPost();
    let userInfo = wx.getStorageSync('userInfo');
    let that = this;
    that.setData({
      userInfo: userInfo
    })
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