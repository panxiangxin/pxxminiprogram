// pages/app-auth/index.js
import { showErrorToast, redirect } from '../../utils/util.js';
import { loginByWeixin } from '../../services/user.js';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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
    let userInfo = wx.getStorageSync('userInfo');
  //   if(userInfo != '') {
  //     wx.navigateBack()
  // };
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    loginByWeixin().then(res => {
        app.globalData.userInfo = res.data.userInfo;
        app.globalData.token = res.data.token;
        wx.navigateBack()
    }).catch(() => {});
},
goBack:function(){
    wx.navigateBack();
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
  onShareAppMessage: function () {

  }
})