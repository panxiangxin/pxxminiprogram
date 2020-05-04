// pages/post/post.js
var app = getApp()
var util = require('../../utils/util.js');
var WxParse = require('../../lib/wxParse/wxParse.js');
var api = require('../../config/api.js');
Page({

  data: {
    id: '',
    activeName: '1',
    post: {},
    tags: [],
    related: [],
    userInfo: {},
    sysHeight: 0,
    loading: 0
  },
  onChange(event) {
    this.setData({
      activeName: event.detail
    });
  },
  getPostDetail: function() {
    let that = this;
    util.request(api.getPostDetail + '/' + that.data.id).then(function(res){
      if (res.success) {
        that.setData({
          post:res.data.post,
          related: res.data.related,
          tags: res.data.post.tag == null?[]:res.data.post.tag.split(','),
          loading: 1
        },()=>{
          let post = that.data.post;
          WxParse.wxParse('postDesc', 'md', post.description, that);
        })
      } else {
        util.showErrorToast(res.message)
      }
    })
  },
  onLoad: function (options) {
    let id = 0;
    var scene = decodeURIComponent(options.scene);
    if (scene != 'undefined') {
        id = scene;
    } else {
        id = options.id;
    }
    this.setData({
        id: id //帖子id
    });
  },
  onReady: function () {

  },
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo');
    let info = wx.getSystemInfoSync();
    let sysHeight = info.windowHeight - 100;
    let userId = userInfo.id;
    if (userId > 0) {
        this.setData({
            userInfo: userInfo,
        });
    }
    this.setData({
        sysHeight: sysHeight
    })
    this.getPostDetail();
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