// pages/user/users.ts
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
var app1 = getApp()

Page({
  data: {
    userInfoTo:'',
    userInfo:null,
    number:0,
    ifcard:true,
    iflogin:false,
    openid:'',
    ifshow:true,
    ifloading:true
  },

  //获取用户信息
    userSignIn:async function(){
          var that = this
          
          app1.database.callFunction({
            name:'findId',
            success:function(res: any){
                that.setData({
                  openid:res.result.event.userInfo.openId
                })
            }
          })      

          wx.showToast({
            icon:'loading',
            title:'加载中...'
          })
          
          this.setData({
            ifloading:false
          })
          
          setTimeout(async ()=>{
            if(this.data.openid!=''){
                const{ result } = await app1.database.callFunction({
                name:'login',
                data:{
                  id:this.data.openid,
                  number:this.data.number
                }
              })

              let data = result.data

              wx.setStorageSync('userInfo',data) 

              this.setData({
                userInfo:data,
                userInfoTo:JSON.stringify(data),
                ifcard:data.ifcard,
                iflogin:true,
                openid:data._openid
              })
            }else{
              wx.showToast({
                icon:'error',
                title:'登陆失败！'
              })
            }
          },1500)
  },

  pressunlogin(){
    wx.showToast({
      icon:"error",
      title:"请登陆！"
    })
  },

    //用户永久登陆
    async getUserInfo(){
      const data = wx.getStorageSync('userInfo')
      //检测是否登陆
      if(data){
        const userimf = await app1.database.database().collection('userInfo').where({_openid:data._openid}).get()
        if(userimf){
          let data1 = userimf.data[0]
            this.setData({
              userInfoTo:JSON.stringify(data1),
              userInfo: data1,
              openid: data1._openid,
              ifcard: data1.ifcard,
              iflogin:true
            })          
        }else{
          wx.setStorageSync('userInfo',null) 
        }
      }
  },

  code(){
    this.setData({
      ifshow:false
    })

    const query = wx.createSelectorQuery()
    query.select('#myQrcode').fields({
        node: true,
        size: true
    }).exec((res) => {
        var canvas = res[0].node
        // 调用方法drawQrcode生成二维码
        drawQrcode({
          canvas: canvas,
          canvasId: 'myQrcode',
          width: 120,
          padding: 30,
          background: '#ffffff',
          foreground: '#000000',
          text: this.data.openid,
      })
    })
  },

  onShow() {
     this.getUserInfo()
  },
})