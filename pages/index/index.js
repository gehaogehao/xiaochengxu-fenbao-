// pages/index/index.js
import request from '../../util/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannersList:[],
    recommendList:[],
    topList:[]
  },

  toRecommendSong(){
    wx.navigateTo({
      url: '/songs/pages/recommendSong/recommendSong',
    });
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
      // 轮播图数据
      let bannersData = await request('/banner',{type:2})
      this.setData({
        bannersList:bannersData.banners
      })
      // 推荐歌单数据
      let recommendData = await request('/personalized')
      this.setData({
        recommendList:recommendData.result
      })
      //排行榜数据
      let arr = [0,1,2,3,4]
      let index = 0
      let topArr = []
      let topData
      while (index < arr.length) {
        topData= await request(`/top/list?idx=${index++}`)
        let obj = {name:topData.playlist.name,tracks:[...topData.playlist.tracks].slice(0,3)}
        topArr.push(obj)
        this.setData({
          topList:topArr
        })
      }
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

  }
})