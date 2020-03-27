// pages/recommendSong/recommendSong.js
import request from '../../../util/request'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendList:[],
    index : 0
  },

  toSoog(e){
    let {ids,index} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/songs/pages/song/song?ids=${ids}`,
      index
    });
      
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

    let day = new Date().getDate()
    let month = new Date().getMonth() + 1
    this.setData({
      day,month
    })

    let recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList:recommendListData.recommend
    })
    /* 切歌 */
    PubSub.subscribe('switchType',(msg,data)=>{
      let {index,recommendList} = this.data
      if(data === 'pre'){
        (index === 0) && (index = recommendList.length)
        index -= 1
      }else{
        (index === recommendList.length) && (index = -1)
        index += 1
      }
      let musicId = this.data.recommendList[index].id
      PubSub.publish('musicId',musicId)
      this.setData({
        index
      })
    })
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