// pages/app-auth/index.js
import { showErrorToast, redirect } from '../../utils/util.js';
import { loginByWeixin, loginByAccount} from '../../services/user.js';

const app = getApp()

Page({

  data: {
    show: false,
    username: '',
    password: '',
    status: 0
  },
  onLoad: function () {
  },
  onReady: function () {

  },
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
showLoginDialog: function () {
   this.setData({
     show: true
   })
},
onClose() {
  this.setData({ show: false });
},
userNameChange: function (event) {
  let userName = event.detail;
  let password = this.data.password;
  if (userName == '') {
    this.setData({
      status: 0
    })
  } else if (userName != '' && password == '') {
    this.setData({
      username: userName,
      status: 0
    })
  } else {
  this.setData({
    username: userName,
    status: 1
  })
}
},
passwordChange: function (event) {
  let password = event.detail;
  let userName = this.data.username;

  if(password == '') {
    this.setData({
      status: 0
    })
  } else if(password != '' && userName == '') {
    this.setData({
      password: password,
      status: 0
    })
  } else {
    this.setData({
      password: password,
      status: 1
    })
  }
},
loginByAccount: function () {
  let userName = this.data.username;
  let password = this.data.password;

  if(this.data.status != 0) {
    loginByAccount(userName,password).then((res)=>{
     if(res.success) {
       console.log('login success!')
       wx.navigateBack()
     } else {
       showErrorToast(res.message)
     }
    }).catch(() => {});
  } else {
    showErrorToast('用户名密码不能为空');
  }
},
goBack:function(){
    wx.navigateBack();
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