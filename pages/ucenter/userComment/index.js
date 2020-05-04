// pages/ucenter/userComment/index.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({

  data: {
      userInfo: {},
      comments: [],
      filterComments: [],
      loading: 0,
      nowId: 1
  },
  switchCate(e) {
    let id = e.currentTarget.dataset.id;
    let nowId = this.data.nowId;
    if(nowId == id){
      return false;
    } else {
      this.setData({
        nowId :id
      },()=>{
        this.commentFilter()
      })
    }
  },
  commentFilter: function () {
    let type = this.data.nowId;
    let comments = this.data.comments;
    let filters = [];
    comments.forEach(comment => {
      if(comment.type == type) {
        filters.push(comment);
      }
    })
    this.setData({
      filterComments: filters
    })
  },
  getUserComment: function() {
    let userInfo = this.data.userInfo;
    let that = this;
    util.request(api.getUserComment + userInfo.id).then(function(res){
      if (res.success) {
        console.log(res)
        that.setData({
          comments: res.data,
          filterComments: res.data,
          loading: 1
        })
      }
    })
  },
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo');
    let that = this;
    that.setData({
      userInfo: userInfo
    },()=>{
      this.getUserComment()
    })
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})