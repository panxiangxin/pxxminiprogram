// pages/ucenter/settings/index.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    age: '',
    qq: '',
    bio: '',
    stamps: '',
    mail: '',
    status: 1,
  },
bindinputAge(event) {
let age = event.detail.value;
this.setData({
  age: age,
})
},
bindinputBio(event) {
  let bio = event.detail.value;
  this.setData({
    bio: bio,
  })
},
bindinputQQ(event) {
  let qq = event.detail.value;
  if(util.testQQ(qq)) {
    this.setData({
      qq: qq,
      status: 1
    })
  } else {
    this.setData({
      status: 0,
    })
  }
},
bindinputMail(event) {
  let mail = event.detail.value;
  if (util.testMail(mail)) {
    this.setData({
      mail: mail,
      status: 1
    })
  } else{
    this.setData({
      status: 0
    })
  }
},
getSettingsDetail() {
  let that = this;
  util.request(api.SettingsDetail).then(function(res) {
      if (res.errno === 0) {
          that.setData({
              name: res.data.name,
              mobile: res.data.mobile,
          });
          if (res.data.name == '' || res.data.mobile == ''){
              util.showErrorToast('请填写姓名和手机');
          }
      }
  });
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },
  saveInfo() {
    let user = {
      id: this.data.id,
      age: this.data.age,
      bio: this.data.bio,
      qq: this.data.qq,
      stamps: this.data.stamps,
      mail: this.data.mail
    }
    var str = JSON.stringify(user);
    let that = this;
    util.request(api.SaveSettings, {
      user: str
    }, 'POST','application/x-www-form-urlencoded').then(function(res) {
        if (res.success) {
          wx.setStorageSync('userInfo', res.data.user);
          wx.setStorageSync('token', res.data.token);
          util.showErrorToast('保存成功');
          wx.navigateBack()
        }
    });
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
    this.setData({
      id: userInfo.id,
      age: userInfo.age,
      qq: userInfo.qq,
      stamps: userInfo.stamps,
      mail: userInfo.mail,
      bio: userInfo.bio
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