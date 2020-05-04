//index.js
import { request } from '../../utils/util';
import { getHotBook, getHotPost,getHotBookTag,getHotPostTag,getAnnounce } from '../../config/api';
var WxParse = require('../../lib/wxParse/wxParse.js');
//获取应用实例
const app = getApp()
Page({
  data: {
    activeName: '1',
    userInfo: {},
    banner: [],
    hotPost: [],
    hotBookTag: [],
    hotPostTag: [],
    announces: [],
    sysHeight: 0,
    loading: 0,
    bookTagLoading: 0,
    postTagLoading: 0,
    announceLoading: 0,
    postLoading: true,
    autoplay:true
  },
  getAnnounce: function() {
    let that = this;
    request(getAnnounce).then(function(res){
      if(res) {
        that.setData({
          announces: res.data,
          announceLoading: 1
        },()=> {
          var _data = that.data.announces
          var _len = _data.length
          for (var i = 0; i < _len; i++) {
            WxParse.wxParse('content' + i, 'md', _data[i].content, that);
            if (i === _len - 1) {
              WxParse.wxParseTemArray("askItemsArr", 'content', _data.length, that)
            }
          }
        })
      }
    })
  },
  getHotBookTag: function(){
    let that = this;
    request(getHotBookTag).then(function (res) {
      if(res.success) {
        that.setData({
          hotBookTag: res.data,
          bookTagLoading: 1
        })
      }
    })
  },
  getHotPostTag: function(){
    let that = this;
    request(getHotPostTag).then(function (res) {
      if(res.success) {
        that.setData({
          hotPostTag: res.data,
          postTagLoading: 1
        })
      }
    })
  },
  getHotPost: function() {
    let that = this;
    request(getHotPost).then(function (res) {
      if(res.success) {
        that.setData({
          hotPost: res.data,
          postLoading: false
        })
      }
    })
  },
  onChange(event) {
    this.setData({
      activeName: event.detail
    });
  },
  getHotBook: function() {
    let that = this;
    request(getHotBook).then(function (res) {
      if(res.success) {
        that.setData({
          banner: res.data,
          loading: 1,
        })
       }
    });
  },
  onLoad: function (options) {
    let systemInfo = wx.getStorageSync('systemInfo');
    var scene = decodeURIComponent(options.scene);
  },
  onHide: function(){
    this.setData({
        autoplay:false
    })
},
  onShow: function () {
   this.getHotBook();
   this.getHotPost();
   this.getHotPostTag();
   this.getHotBookTag();
   this.getAnnounce();
    var that = this;
        let userInfo = wx.getStorageSync('userInfo');
        if (userInfo != '') {
            that.setData({
                userInfo: userInfo,
            });
        };
        let info = wx.getSystemInfoSync();
        let sysHeight = info.windowHeight - 100;
        this.setData({
            sysHeight: sysHeight,
            autoplay:true
        });
  },
  goSearch: function () {
    wx.navigateTo({
        url: '/pages/search/search',
    })
}
})
