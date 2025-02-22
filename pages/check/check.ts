// pages/check/check.ts
var app1 = getApp()
Page({
  data: {
    tistdata:{},
  },

  onLoad:async function(options) {
    const userInfo = JSON.parse(options.data);
    var num = userInfo.number

    const {result: {data}} = await app1.database.callFunction({
      name:'getsear',
      data:{
        number:num
      },
    })        
    
    this.setData({
      tistdata:data
    })
  },
})