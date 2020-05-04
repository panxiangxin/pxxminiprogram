var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
    data: {
        categoryList: [],
        goodsCount: 0,
        nowIndex: 0,
        nowId: 0,
        nowText: '',
        list: [],
        allPage: 1,
        allCount: 0,
        size: 8,
        hasInfo: 0,
        showNoMore: 0,
        loading:0,
        index_banner_img:0,
    },
    onLoad: function(options) {
    },
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading()
        this.getCatalog();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },
    getCatalog: function() {
      let that = this;
        util.request(api.BookCount).then(function(res) {
            that.setData({
                goodsCount: res.data
            });
        });
    },
    getCurrentList: function(name) {
        let that = this;
        util.request(api.GetCurrentList, {
            size: that.data.size,
            page: that.data.allPage,
            tags: name
        },'POST','application/x-www-form-urlencoded').then(function(res) {
            if (res.success) {
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
    onShow: function() {
        let id = this.data.nowId;
        let nowId = wx.getStorageSync('categoryId');
        let nowText = wx.getStorageSync('categoryName');
       
         if (nowId == 0 && id === 0) {
            this.setData({
                list: [],
                allPage: 1,
                allCount: 0,
                size: 8,
                loading: 1
            })
            this.getCurrentList('全部');
            this.setData({
                nowId: 0,
                nowText: '全部'
            })
            wx.setStorageSync('categoryId', 0)
            wx.setStorageSync('categoryName', '全部')
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
            wx.setStorageSync('categoryId', nowId)
            wx.setStorageSync('categoryName', nowText)
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
                this.getCurrentList('全部');
            } else {
                wx.setStorageSync('categoryId', id)
                wx.setStorageSync('categoryName', text)
                this.getCurrentList(text);
            }
            wx.setStorageSync('categoryId', id)
            wx.setStorageSync('categoryName', text)
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
            that.getCurrentList('全部');
        } else {
            that.getCurrentList(nowText);
        }
    }
})