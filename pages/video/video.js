// pages/video/video.js
import request from '../../util/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],
    navId : 0,
    videoList:[],
    isTriggered:false
  },
  chooseVideo(){
    wx.chooseVideo({
      maxDuration:30
    })
  },
  async changeNavId(e){
    this.setData({
      navId : e.currentTarget.dataset.navid
    })
    wx.showLoading({
      title: "加载中",
      success:()=>{
        this.setData({
          videoList:[]
        })
      }
    })
    this.getVideoList(this.data.navId)
  },
  /* 封装获取video方法 */
  async getVideoList(navId){
    let videoListData = await request('/video/group', { id:navId })
    wx.hideLoading()
    this.setData({
      videoList: videoListData.datas
    })
  },
  /* 下拉刷新 */
  handleRefresh(){
    this.getVideoList(this.data.navId)
    this.setData({
      isTriggered: false
    })
  },
  /* 多视频播放 */
  handlePlay(e){
    e.currentTarget.dataset.vid !== this.vid && this.VideoContext && this.VideoContext.stop()
    this.vid = e.currentTarget.dataset.vid
    this.VideoContext = wx.createVideoContext(this.vid)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let userInfo = wx.getStorageSync('userInfo') 
    if (!userInfo){
      wx.showLoading({
        title: "请先登录",
        success:()=>{
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      })
    }
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList:videoGroupListData.data.slice(0,14),
      navId:videoGroupListData.data[0].id
    })
    wx.showLoading({
      title:"加载中"
    })
    this.getVideoList(this.data.navId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title:'这是为你精心挑选',
      page:'/pages/video/video',
      imageUrl:'/static/images/nvsheng.jpg'
    }
  }
})