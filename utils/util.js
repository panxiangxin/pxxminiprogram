import api from '../config/api.js';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function formatTimeNum(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
function testMobile(num) {
  console.log
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(16[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
  if (num.length == 0) {
      wx.showToast({
          title: '手机号为空',
          image: '/images/icon/icon_error.png',
      })
      return false;
  } else if (num.length < 11) {
      wx.showToast({
          title: '手机号长度有误！',
          image: '/images/icon/icon_error.png',
      })
      return false;
  } else if (!myreg.test(num)) {
      wx.showToast({
          title: '手机号有误！',
          image: '/images/icon/icon_error.png',
      })
      return false;
  } else {
      return true;
  }
}
function request(url, data = {}, method = "GET") {
    console.log(url)
  return new Promise(function(resolve, reject) {
      wx.request({
          url: url,
          data: data,
          method: method,
          header: {
              'Content-Type': 'application/json',
              'token': wx.getStorageSync('token')
          },
          success: function(res) {
              if (res.statusCode == 200) {
                  if (res.data.errno == 401) {
                      //需要登录后才可以操作
                      let code = null;
                      return login().then((res) => {
                          code = res.code;
                          return getUserInfo();
                      }).then((userInfo) => {
                          //登录远程服务器
                          request(api.AuthLoginByWeixin, {
                              code: code,
                              userInfo: userInfo
                          }, 'POST').then(res => {
                              if (res.errno === 0) {
                                  //存储用户信息
                                  wx.setStorageSync('userInfo', res.data.userInfo);
                                  wx.setStorageSync('token', res.data.token);
                                  resolve(res);
                              } else {
                                  reject(res);
                              }
                          }).catch((err) => {
                              reject(err);
                          });
                      }).catch((err) => {
                          reject(err);
                      })
                  } else {
                      resolve(res.data);
                  }
              } else {
                  reject(res.errMsg);
              }

          },
          fail: function(err) {
              reject(err)
          }
      })
  });
}
/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function(resolve, reject) {
      wx.checkSession({
          success: function() {
              resolve(true);
          },
          fail: function() {
              reject(false);
          }
      })
  });
}
/**
 * 调用微信登录
 */
function login() {
  return new Promise(function(resolve, reject) {
      wx.login({
          success: function(res) {
              if (res.code) {
                  //登录远程服务器
                  resolve(res);
              } else {
                  reject(res);
              }
          },
          fail: function(err) {
              reject(err);
          }
      });
  });
}
function getUserInfo() {
  return new Promise(function(resolve, reject) {
      wx.getUserInfo({
          withCredentials: true,
          success: function(res) {
              resolve(res);
          },
          fail: function(err) {
              reject(err);
          }
      })
  });
}
function redirect(url) {
  //判断页面是否需要登录
  if (false) {
      wx.redirectTo({
          url: '/pages/auth/login/login'
      });
      return false;
  } else {
      wx.redirectTo({
          url: url
      });
  }
}
function loginNow() {
  let userInfo = wx.getStorageSync('userInfo');
  if (userInfo == '') {
      wx.navigateTo({
          url: '/pages/app-auth/index',
      });
      return false;
  } else {
      return true;
  }
}
function showErrorToast(msg) {
    wx.showToast({
        title: msg,
        icon: 'none',
    })
}

function showSuccessToast(msg) {
    wx.showToast({
        title: msg,
        icon: 'success',
    })
}
module.exports = {
    formatTime: formatTime,
    formatTimeNum: formatTimeNum,
    request,
    redirect,
    checkSession,
    login,
    getUserInfo,
    loginNow,
    showErrorToast,
    showSuccessToast
}
