// pages/search/search.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    searchStatus: false,
    bookList: []
  },
//事件处理函数
closeSearch: function () {
  wx.navigateBack()
},
clearKeyword: function () {
  this.setData({
      keyword: '',
      searchStatus: false
  });
},
inputChange: function (e) {
  this.setData({
      keyword: e.detail.value,
      searchStatus: false
  });
},
inputFocus: function () {
  this.setData({
      searchStatus: false,
      bookList: []
  });
},
getGoodsList: function () {
  let that = this;
  util.request(api.searchBook, { search: this.data.keyword}).then(function (res) {
      if (res.success) {
        console.log(res)
          that.setData({
              bookList: res.data,
              searchStatus: true
          });
      }
  });
},
onKeywordTap: function (event) {
  this.getSearchResult(event.target.dataset.keyword);
},
getSearchResult(keyword) {
  this.setData({
      keyword: keyword,
      page: 1,
      categoryId: 0,
      goodsList: []
  });

  this.getGoodsList();
},
onKeywordConfirm(event) {
  this.getSearchResult(event.detail.value);
},
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
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