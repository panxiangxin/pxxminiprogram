// components/comments.js
var util = require('../utils/util.js');
var api = require('../config/api');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    types: Number,
    topid: Number,
    userInfo: Object
},
  /**
   * 组件的初始数据
   */
  data: {
    show: 0,
    parentId: null,
    recevierId: null,
    inputComment: '',
    inputCommentTopic: '',
    showItemId: '',
    loadingComments: 0,
    comments: [],
    show: false,
    showNoMore: 0,
    allPage: 1,
    allCount: 0,
    size: 5,
  },
attached: function(){
  this.loadComments()
},
  methods: {
    inputEdit(event){
      let comment = event.detail;
      this.setData({
        inputComment: comment
      })
    },
    inputTopicEdit(event) {
      let comment = event.detail;
      this.setData({
        inputCommentTopic: comment
      })
    },
    showCommentInput (e) {
      let item = e.currentTarget.dataset.item;
      let reply =  e.currentTarget.dataset.reply;
      if (reply) {
        this.setData({
          inputComment: '@' + reply.commentUser.userName + ' ',
          recevierId: reply.commentUser.id,
          showItemId: item.id,
          show: true
        })
      } else {
        this.setData({
          inputComment: '@' + item.commentUser.userName + ' ',
          recevierId: item.commentUser.id,
          showItemId: item.id,
          show: true
        })
      }
    },
    commitCommentOne(){
      let that = this;
      let content = this.data.inputCommentTopic
      if (content === null || content == '') {
        util.showErrorToast("评论不能为空")
        return
      }
      util.request(api.PostComment,{
        commentTopic: that.properties.topid,
        parentId: that.properties.topid,
        commentator: that.properties.userInfo.id,
        type: that.properties.types,
        recevierId: that.properties.topid,
        content: content
      },'POST').then(function(res){
        if (res.success) {
         util.showErrorToast(res.message)
         that.setData({
           inputCommentTopic: '',
           loadingComments: 0,
           allPage: 1,
           show: false
         },()=>{
           that.setData({
            comments: []
           },()=>{
            that.loadComments()
           })
         })
        } else {
          util.showErrorToast(res.message)
        }
      })
    },
    commitComment() {
      let that = this;
      let content = this.data.inputComment.split('@')[1].split(' ')[1]
      if (content === null || content == '') {
        util.showErrorToast("评论不能为空")
        return
      }
      util.request(api.PostComment,{
        commentTopic: that.properties.topid,
        parentId: that.data.showItemId,
        commentator: that.properties.userInfo.id,
        recevierId: that.data.recevierId,
        type: that.properties.types + 1,
        content: content
      },'POST').then(function(res){
        if (res.success) {
         util.showErrorToast(res.message)
         that.setData({
           inputComment: '',
           showItemId: '',
           loadingComments: 0,
           allPage: 1,
           show: false
         },()=>{
          that.setData({
            comments: []
           },()=>{
            that.loadComments()
           })
         })
        } else {
          util.showErrorToast(res.message)
          that.setData({
            showItemId: ''
          })
        }
      })
    },
   loadComments () {
    let that = this;
    util.request(api.Comment, {
      type: this.properties.types,
      id: this.properties.topid,
      page: this.data.allPage,
      size: this.data.size
    },'POST','application/x-www-form-urlencoded').then(function(res){
      let count = res.data.total;
      that.setData({
          allCount: count,
          allPage: res.data.pageNum,
          comments: that.data.comments.concat(res.data.list),
          showNoMore: 1,
          loadingComments: 1,
      });
      if (count == 0 || count == that.data.comments.length) {
          that.setData({
              showNoMore: 0
          });
      }
    })
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
        that.loadComments();
   },
    handleTap: function(event) { //阻止冒泡 
   },
   onClose () {
    this.setData({
        show: false,
        inputComment: '',
        showItemId: ''
    });
},
  }, 
})
