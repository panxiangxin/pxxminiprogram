// pages/posts/index.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    categoryList: [],
    postCount: 0,
    nowIndex: 0,
    nowId: 0,
    nowText: '',
    list: [],
    allPage: 1,
    allCount: 0,
    size: 8,
    tag: '',
    hasInfo: 0,
    showNoMore: 0,
    loading:0,
    userInfo: {},
    index_banner_img:0, 
  },
  getCatalog: function() {
    let that = this;
      util.request(api.PostCount).then(function(res) {
          that.setData({
            postCount: res.data
          });
      });
  },
  getCurrentList: function(name) {
    let that = this;
    util.request(api.GetPostList, {
        size: that.data.size,
        page: that.data.allPage,
        sort: name,
        tag: that.data.tag,
        search: that.data.value
    },'POST','application/x-www-form-urlencoded').then(function(res) {
        if (res.success) {
          console.log(res)
            let count = res.data.total;
            that.setData({
                allCount: count,
                allPage: res.data.pageNum,
                list: that.data.list.concat(res.data.list),
                showNoMore: 1,
                loading: 0,
            });
            if (count == 0 || count == that.data.list.length) {
                that.setData({
                    hasInfo: 0,
                    showNoMore: 0
                });
            }
        }
    });
},
  onChange(e) {
    this.setData({
      value: e.detail
    });
  },
  onSearch() {
  },
  onClick() {
  },
  onLoad: function (options) {

  },
  onShow: function () {
    let id = this.data.nowId;
    let nowId = wx.getStorageSync('postTagId');
    let nowText = wx.getStorageSync('postTagName');
   
     if (nowId == 0 && id === 0) {
        this.setData({
            list: [],
            allPage: 1,
            allCount: 0,
            size: 8,
            loading: 1
        })
        this.getCurrentList('new');
        this.setData({
            nowId: 0,
            nowText: 'new'
        })
        wx.setStorageSync('postTagId', 0)
        wx.setStorageSync('postTagName', 'new')
    } else if(id != nowId) {
        this.setData({
            list: [],
            allPage: 1,
            allCount: 0,
            size: 8,
            loading: 1
        })
        this.getCurrentList(nowText);
        this.setData({
            nowId: nowId,
            nowText: nowText
        })
        wx.setStorageSync('postTagId', nowId)
        wx.setStorageSync('postTagName', nowText)
    }
    this.getCatalog();
  },
  switchCate: function(e) {
    let id = e.currentTarget.dataset.id;
    let nowId = this.data.nowId;
    let text = e.currentTarget.dataset.name;
    if (id == nowId) {
        return false;
    } else {
        this.setData({
            list: [],
            allPage: 1,
            allCount: 0,
            size: 8,
            loading: 1
        })
        if (id == 0) {
            this.getCurrentList('new');
        } else {
            wx.setStorageSync('postTagId', id)
            wx.setStorageSync('postTagName', text)
            this.getCurrentList(text);
        }
        wx.setStorageSync('postTagId', id)
        wx.setStorageSync('postTagName', text)
        this.setData({
            nowId: id,
            nowText: text
        })
    }
},
onBottom: function() {
  let that = this;
  if (that.data.allCount / that.data.size < that.data.allPage) {
      that.setData({
          showNoMore: 0
      });
      return false;
  }
  that.setData({
      allPage: that.data.allPage + 1
  });
  let nowId = that.data.nowId;
  let nowText = that.data.nowText;
  if (nowId == 0 || nowId == undefined) {
      that.getCurrentList('new');
  } else {
      that.getCurrentList(nowText);
  }
},
publish: function() {
   let userInfo = wx.getStorageSync('userInfo');
   if (userInfo = '' || userInfo == undefined) {
       util.showErrorToast('用户未登录')
       wx.navigateTo({
        url: '/pages/app-auth/index',
    });
    return false;
   } else {
       wx.navigateTo({
         url: '/pages/publish/publish',
       })
   }
},
  onPullDownRefresh: function () {
        wx.showNavigationBarLoading()
        this.getCatalog();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
  }
})