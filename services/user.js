/**
 * 用户相关服务
 */
import { login, getUserInfo, request, checkSession } from '../utils/util.js';
import { AuthLoginByWeiXin } from '../config/api.js';
/**
 * 调用微信登录
 */
function loginByWeixin() {
  let code = null;
  return new Promise(function(resolve, reject) {
      return login().then((res) => {
          code = res.code;
          return getUserInfo();
      }).then((userInfo) => {
          //登录远程服务器
          request(AuthLoginByWeiXin, {
              code: code,
              userInfo: userInfo
          }, 'POST').then(res => {
              if (res.success) {
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
  });
}
/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function(resolve, reject) {
      if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
          checkSession().then(() => {
              resolve(true);
          }).catch(() => {
              reject(false);
          });

      } else {
          reject(false);
      }
  });
}

function authorizeInfo() {
  return new Promise(function(resolve, reject) {
      wx.getUserInfo({
          withCredentials: true,
          success: function(res) {
              resolve({
                  authorizeInfo: true
              });
          },
          fail: function(err) {
              reject(err);
              return 2;
          }
      })
  })
}

module.exports = {
  loginByWeixin,
  checkLogin,
  authorizeInfo
};