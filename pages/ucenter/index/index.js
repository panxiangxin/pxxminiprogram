// pages/ucenter/index/index.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    status: {},
  },
  goProfile: function (e) {
    let res = util.loginNow();
    if (res == true) {
        wx.navigateTo({
            url: '/pages/ucenter/settings/index',
        });
    }
},
toOrderListTap: function(event) {
  let res = util.loginNow();
  if (res == true) {
      wx.navigateTo({
          url: '/pages/ucenter/myBook/index',
      });
  }
},
toUserComment: function(event) {
    let res = util.loginNow();
    if (res == true) {
        wx.navigateTo({
            url: '/pages/ucenter/userComment/index',
        });
    }
  },
  toUserPost: function(event) {
    let res = util.loginNow();
    if (res == true) {
        wx.navigateTo({
            url: '/pages/ucenter/userPost/index',
        });
    }
  },
  toUserNotice: function(event) {
    let res = util.loginNow();
    if (res == true) {
        wx.navigateTo({
            url: '/pages/ucenter/userNotice/index',
        });
    }
  },
  goAuth: function(e) {
  wx.navigateTo({
      url: '/pages/app-auth/index',
  });
  },
  getUserInfo: function() {
      let that = this;
      util.request(api.updateUser).then(function(res) {
          if (res.success) {
              console.log(res)
              that.setData({
                  userInfo: res.data.user
              },()=>{
                  wx.setStorageSync('userInfo', res.data.user)
                  wx.setStorageSync('token', res.data.token)
              })
          }
      })
  },
  getOrderInfo: function(e) {
  let that = this;
  util.request(api.OrderCountInfo).then(function(res) {
      if (res.errno === 0) {
          let status = res.data;
          that.setData({
              status: status
          });
      }
  });
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo == ''){
        this.setData({
            hasUserInfo: 0,
        });
    }
    else{
        this.setData({
            hasUserInfo: 1,
        });
    }
    this.setData({
        userInfo: userInfo,
    },()=>{
        this.getUserInfo()
    });
    wx.removeStorageSync('categoryId');
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
  onPullDownRefresh: function () {
    let that = this;
    util.request(api.OrderCountInfo).then(function(res) {
        if (res.errno === 0) {
            let status = res.data;
            that.setData({
                status: status
            });
        }
    });
  },
})