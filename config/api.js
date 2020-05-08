const ApiRootUrl = 'http://localhost:8081/';

module.exports = {
  //登录
  AuthLoginByWeiXin: ApiRootUrl + 'user/loginByWeiXin',
  AuthLoginByAccount: ApiRootUrl + 'user/login',
  SaveSettings: ApiRootUrl + 'user/update',
  getHotBook: ApiRootUrl + 'book/hotBook',
  getHotPost: ApiRootUrl + 'post/hotPost',
  getHotPostTag: ApiRootUrl + 'post/hotTag',
  getHotBookTag: ApiRootUrl + 'book/hotBookTag',
  searchBook: ApiRootUrl + 'book/book',
  getAnnounce: ApiRootUrl + 'announce/list',
  GetCurrentList: ApiRootUrl + 'book/bookPage',
  BookCount: ApiRootUrl + 'book/counts',
  BooksDetail: ApiRootUrl + 'book/getBook',
  BookChaters: ApiRootUrl + 'book/getChapters',
  Comment: ApiRootUrl + 'comment/commentPage',
  PostComment: ApiRootUrl + 'comment/post',
  BuyBook: ApiRootUrl + 'book/buy',
  downLoadFile: ApiRootUrl + 'book/download',
  PostCount: ApiRootUrl + 'post/postCount',
  GetPostList: ApiRootUrl + 'post/postPage',
  getPostDetail: ApiRootUrl + 'post',
  getAllTags: ApiRootUrl + 'post/tag',
  publisPost: ApiRootUrl + 'post/publish',
  getUserBook: ApiRootUrl + 'user/getUserBook',
  getUserComment: ApiRootUrl + 'comment/user/',
  getUserPost: ApiRootUrl + 'post/getUserPost',
  updateUser: ApiRootUrl + 'user/refresh',
  getUserNotice: ApiRootUrl + 'notify/get',
  clickNotice: ApiRootUrl + 'notify/'
};