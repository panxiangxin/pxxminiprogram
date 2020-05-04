// pages/publish/publish.js
var util = require('../../utils/util');
var api = require('../../config/api.js');
Page({

  data: {
      loading: 0,
      userInfo: {},
      title: '',
      desc: '',
      tags: '',
      allTags: [],
      active: '',
      sysHeight: 0,
      status: 0
  },
  bindinputTitle: function(e) {
    let title = e.detail.value;
    if(title == '') {
      util.showErrorToast('标题不能为空');
      return
    }
    this.setData({
      title: title,
      status: 1
    })
  },
  bindinputTag: function(e) {
    let tags = e.detail.value;
    this.setData({
      tags: tags
    })
  },
  bindinputDesc: function(e) {
    let desc = e.detail.value;
    if(desc == '') {
      util.showErrorToast('内容不能为空');
      return
    }
    this.setData({
      desc: desc,
      status: 1
    })
  },
  getAllTags: function() {
    let that = this;
    util.request(api.getAllTags).then(function(res){
      if (res.success) {
        console.log(res)
        that.setData({
          allTags: res.data,
          loading: 1
        })
      } else {
        util.showErrorToast(res.message)
      }
    })
  },
  selectTag: function(e) {
    let tag = e.currentTarget.dataset.name;
    let tags = this.data.tags;
    if (tags.indexOf(tag) === -1) {
      if (tags) {
          this.setData({
            tags: tags + ',' + tag
          })
      } else {
        this.setData({
          tags: tag
        })
      }
  }
  },
  saveInfo: function() {
    let title = this.data.title;
    let desc = this.data.desc;
    let tags = this.data.tags;
    util.request(api.publisPost, {
      title: title,
      description: desc,
      tag: tags
    },'POST').then(function(res){
      if(res.success) {
        util.showErrorToast('发表成功!')
        wx.navigateBack()
      } else {
        util.showErrorToast(res.message)
      }
    })
  },
  onLoad: function (options) {

  },

  onReady: function () {

  },
  onShow: function () {
    this.getAllTags();
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
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