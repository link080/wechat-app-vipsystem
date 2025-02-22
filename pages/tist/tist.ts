// pages/tist/tist.ts
var app1 = getApp()
Page({
  data: {
    tistdata:{},
    mouthlist: [1,2,3,4,5,6,7,8,9,10,11,12],
    mouth:9
  },

  bindPickerChange1: function (e) {
      this.setData({
        mouth: this.data.mouthlist[e.detail.value]
    })
  },

  async logiEarnData(){
    var mou = this.data.mouth
    const {result: {data}} = await app1.database.callFunction({
      name:'getchong',
      data:{
        mouth:mou
      },
    })        
    
    this.setData({
      tistdata:data
    })
  },

  search(){
    wx.showToast({
      icon:'loading',
      title:'加载中...'
    })
    this.logiEarnData()
  },

  delete(){
    var mou = this.data.mouth
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success (res) {
        if (res.confirm) {
          app1.database.callFunction({
            name:'delete',
            data:{
              mouth:mou
            },
            success(){
              wx.showToast({
                icon:'success',
                title:'删除成功！'
              })
            }
          })    
        } else if (res.cancel) {
          return
        }
      }
    })
  }
})