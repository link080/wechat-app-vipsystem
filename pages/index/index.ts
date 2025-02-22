// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
var app1 = getApp()
Page({
  data:{
  },

  onLoad: async function(){
    const c1 = new wx.cloud.Cloud({
      resourceAppid: 'wx5a69b15e1a99a805',
      resourceEnv: 'database-3gabq1we9820fb78',
    })
    await c1.init()
    
    setTimeout(async ()=>{
      app1.database = c1
    },500)
},
})
