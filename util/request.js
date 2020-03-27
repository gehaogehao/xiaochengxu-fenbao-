import config from './config'
export default (url,data={},method='GET')=>{
    return new Promise((resolve,reject)=>{
        wx.request({
            url: config.host + url,
            data,
            method,
            header:{
              cookie:JSON.parse(wx.getStorageSync('cookie') || '[]').toString()
              // cookie:wx.getStorageSync('cookie').toString()
            },
            success: (res) => {
              if(data.isLogin){
                wx.setStorageSync('cookie', JSON.stringify(res.cookies));
                // wx.setStorageSync('cookie',res.cookies)
              }
              resolve(res.data)
            },
            fail: () => {
                console.log('获取数据失败!');
            },
          });
    })
}