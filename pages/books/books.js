// pages/books/books.js
var app = getApp()
var util = require('../../utils/util.js');
var WxParse = require('../../lib/wxParse/wxParse.js');
var api = require('../../config/api.js');
const user = require('../../services/user.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    goods: {},
    goodsChapters: [],
    loadingChapters: 0,
    specificationList: [],
    productList: [],
    cartGoodsCount: 0,
    checkedSpecPrice: 0,
    number: 1,
    checkedSpecText: '',
    tmpSpecText: '请选择规格和数量',
    openAttr: false,
    soldout: false,
    disabled: '',
    is_show: 0,
    endLoad: true,
    alone_text: '单独购买',
    userId: 0,
    priceChecked: false,
    goodsNumber: 0,
    loading: 0,
    current: 0,
    showShareDialog:0,
    boughtDialog: 0,
    userInfo:{},
    autoplay:true
  },
hideDialog: function (e) {
    let that = this;
    that.setData({
        showShareDialog: false,
    });
},
hideDialog1: function (e) {
  let that = this;
  that.setData({
    boughtDialog: false,
  });
},
getDetailInfo: function() {
  let that = this;
  let goods = that.data.goods;
  WxParse.wxParse('bio', 'html', goods.bio, that);
  that.setData({
      is_show: 1
  });
  that.setData({
      endLoad: false
  });
},
previewImage: function (e) {
  let current = e.currentTarget.dataset.src;
  let arr = [];
  arr.push(current);
  wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: arr
  })
},
shareTo:function(){
  let userInfo = wx.getStorageSync('userInfo');
  if (userInfo == '') {
      util.loginNow();
      return false;
  } else {
      this.setData({
          showShareDialog: !this.data.showShareDialog,
      });
  }
},
createShareImage: function () {
  let id = this.data.id;
  wx.navigateTo({
      url: '/pages/share/index?goodsid=' + id
  })
},
bindchange: function(e) {
  let current = e.detail.current;
  this.setData({
      current: current
  })
},
goIndex: function() {
  wx.switchTab({
      url: '/pages/index/index',
  })
},
onShareAppMessage: function(res) {
  let id = this.data.id;
  let name = this.data.goods.name;
  let image = this.data.goods.list_pic_url;
  let userId = this.data.userId;
  return {
      title: name,
      path: '/pages/goods/goods?id=' + id + '&&userId=' + userId,
      imageUrl: image
  }
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
        id: id, // 这个是商品id
        valueId: id,
    });
  },
handleTap: function(event) { //阻止冒泡 
  },
getGoodsInfo: function() {
    let that = this;
    util.request(api.BooksDetail, {
        bookId: that.data.id
    }).then(function(res) {
     
        if (res.success) {
            that.setData({
                goods: res.data,
                loading:1
            });
        }
        else{
            util.showErrorToast(res.message)
        }
    });
},
getGoodsChapters: function(){
  let that = this;
  util.request(api.BookChaters, {
    bookId: that.data.id
  }).then(function(res){
    if (res.success) {
      that.setData({
        goodsChapters: res.data,
        loadingChapters: 1
      })
    } else {
      util.showErrorToast(res.message)
    }
  })
},
onShow: function () {
    let userInfo = wx.getStorageSync('userInfo');
    let info = wx.getSystemInfoSync();
    let sysHeight = info.windowHeight - 100;
    let userId = userInfo.id;
    if (userId > 0) {
        this.setData({
            userId: userId,
            userInfo: userInfo,
        });
    }
    this.setData({
        sysHeight: sysHeight
    })
    this.getGoodsInfo();
    this.getGoodsChapters();
  },
onHide:function(){
    this.setData({
        autoplay:false
    })
},
onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.getGoodsInfo();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
goIndexPage: function() {
    wx.switchTab({
        url: '/pages/index/index',
    });
},
switchAttrPop: function() {
  if (this.data.openAttr == false) {
      this.setData({
          openAttr: !this.data.openAttr
      });
  }
},
closeAttr: function() {
  this.setData({
      openAttr: false,
      alone_text: '单独购买'
  });
},
onReachBottom: function () {

  },
buyBook: function(){
  let userInfo = wx.getStorageSync('userInfo');
  if (userInfo == '') {
      util.loginNow();
      return false;
  } else {
      this.setData({
          boughtDialog: !this.data.boughtDialog,
      });
  }
},
buy: function() {
  let userInfo = this.data.userInfo;
  let goods = this.data.goods;
  let hasBought = 'goods.hasBought';
  let that = this;
  console.log(userInfo)
  if (goods.bookStamps > userInfo.stamps) {
    util.showErrorToast('积分不足！');
    that.setData({
      boughtDialog: false
    })
    return
  }
  util.request(api.BuyBook,{
    bookId: goods.id,
    userId: userInfo.id
  },'POST','application/x-www-form-urlencoded').then(function(res){
      if (res.success) {
        that.setData({
          loading: 0,
          [hasBought]: true
        },()=>{
          that.setData({
            loading: 1,
            boughtDialog: false
          })
        })
        userInfo.stamps = userInfo.stamps - goods.bookStamps
        wx.setStorageSync('userInfo', userInfo)
        util.showErrorToast('购买成功!')
      }
  })
},
download: function() {
  let bookName = this.data.goods.bookName
  let url = api.downLoadFile + '?userId=' + this.data.userInfo.id + '&bookId='+this.data.goods.id;
  let savePath = wx.env.USER_DATA_PATH +'/' + bookName + '.txt'
  const downloadTask=wx.downloadFile({
    url: url, //仅为示例，并非真实的资源
    header: {
      'token': wx.getStorageSync('token')
      },
    success: function (res) {
      // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
     wx.getFileSystemManager().saveFile({
       tempFilePath: res.tempFilePath,
       filePath: savePath,
       success(res2) {
         util.showErrorToast('下载完成!')
       },
       fail: function(res) {
        console.log(res)
       }
     })
    }
  })
  downloadTask.onProgressUpdate((res) => {
    console.log('下载进度', res.progress)
    console.log('已经下载的数据长度', res.totalBytesWritten)
    console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
  })
}
})