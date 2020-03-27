// pages/personal/personal.js
import request from '../../util/request'
let startY = 0;  // 手指起始Y的坐标点
let moveY = 0;  // 手指一动的Y的坐标点
let moveDistance = 0;   // 手指一动的距离


Page({
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '0s',
    userInfo:{},
    recentPlayList:[]
  },

  goLogin(){
    if(this.data.userInfo.profile){
      return
    }
    wx.redirectTo({
      url: '/pages/login/login',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let userInfo = wx.getStorageSync("userInfo");
    if(userInfo){
      userInfo = JSON.parse(userInfo)
      this.setData({
        userInfo
      })  
      let recentPlayListData = await request('/user/record',{uid:userInfo.profile.userId,type:0})
      this.setData({
        recentPlayList:recentPlayListData.allData
      })
    }
  },
  
  handleTouchstart(event){
    startY = event.touches[0].clientY;
  },
  handleTouchmove(event){
    moveY = event.touches[0].clientY;
    
    
    // 计算手指移动的距离
    moveDistance = moveY - startY;
    // 1. 向上不能拖
    if(moveDistance < 0){
      return;
    }
    // 2. 向下滑动到一定的距离后不再向下走， 距离： 80
    
    if(moveDistance >= 80){
      moveDistance = 80;
    }
    
    // 更新cover移动的距离
    this.setData({
      coverTransform: `translateY(${moveDistance}px)`
    })
    
  },
  handleTouchend(){
    // 更新cover移动的距离 为0
    this.setData({
      coverTransform: `translateY(0px)`,
      coverTransition: 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)'
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
