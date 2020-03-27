// pages/song/song.js
import request from '../../../util/request'
import PubSub from 'pubsub-js'
import moment from 'moment'
let appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    id:0,
    songMessage:{},
    momentDurationTime:'00:00',//总时长
    momentCurrentTime:'00:00',//当前播放时长
    currentWidth:0
  },
  playControl(){
    let {isPlay,id} = this.data
    this.getPlay(!isPlay,id)
  },
  /* 封装播放音乐函数 */
  async getPlay(isPlay,id){
    if(isPlay){
      let soogUrlData = await request('/song/url',{id})
      let url = soogUrlData.data[0].url
      /* 声明音乐是否播放 */
      this.isSwitch = false
      this.backgroundAudioManager.src = url
      this.backgroundAudioManager.title = this.data.songMessage.name
      appInstance.globalData.isMusicId = id
      appInstance.globalData.isMusicPlay = isPlay
    }else{
      this.backgroundAudioManager.pause()
      /* 解决真机暂停重新播放问题 */
      this.time = this.backgroundAudioManager.currentTime
      appInstance.globalData.isMusicPlay = isPlay
    }
    this.setData({
      isPlay
    })
  },

  /* 切歌 */
  changeMusic(e){
    if(this.isSwitch){
      return
    }
    this.isSwitch = true
    let type = e.currentTarget.dataset.type
    this.setData({
      isPlay:false
    })
    this.backgroundAudioManager.stop();
    this.switchSong(type)
  },
  /* 封装切歌函数 */
  switchSong(type){
    PubSub.publish('switchType',type)
    PubSub.subscribe('musicId',async(msg,data)=>{
      let songMessageData = await request('/song/detail',{ids:data})
      this.setData({
        songMessage:songMessageData.songs[0],
        id:data
      })
      wx.setNavigationBarTitle({
        title:this.data.songMessage.name
      })
      this.getPlay(true,data)
      PubSub.unsubscribe('musicId')
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    /* 监听音乐播放进度 */
    this.backgroundAudioManager.onTimeUpdate(()=>{
      let momentCurrentTime = moment(this.backgroundAudioManager.currentTime  * 1000).format('mm:ss');
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 410;
      this.setData({
        momentCurrentTime,currentWidth
      })
    })
    // 监听音乐的播放/暂停/停止
    this.backgroundAudioManager.play(()=>{
      this.setData({
        isPlay:true
      })
      appInstance.globalData.isMusicPlay = true
    })
    this.backgroundAudioManager.onPause(() => {
      /* 解决真机暂停重新播放问题 */
      // this.backgroundAudioManager.seek(this.time)
      this.setData({
        isPlay: false
      })
      appInstance.globalData.isMusicPlay = false
    })
    this.backgroundAudioManager.stop(()=>{
      this.setData({
        isPlay: false
      })
      appInstance.globalData.isMusicPlay = false
    })
    let ids = options.ids
    /* 解决换页面 页面状态不对问题 */
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.isMusicId === ids){
      this.setData({
        isPlay:true
      })
    }
    //获取音乐信息
    let songMessageData = await request('/song/detail',{ids})
    let durationTime = songMessageData.songs[0].dt
    let momentDurationTime = moment(durationTime).format('mm:ss')
    this.setData({
      songMessage:songMessageData.songs[0],
      id:ids,
      momentDurationTime
    })
    wx.setNavigationBarTitle({
      title:this.data.songMessage.name
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