// pages/manager/manager.ts
var app1 = getApp()
Page({
  data: {
    Name:'',
    Pas:'',
    number:'',
    mouth:0,
    cost:0,
    id:'',
    ifscan:false,
    iflogin:true,
  },

  getmouth(){
    var myDate = new Date();
    var tM = myDate.getMonth() + 1;

    this.setData({
      mouth:tM
    })
  },

  getNum(res: { detail: { value: number } }){
    var a = res.detail.value
    if(!a){}else{
      this.setData({
        cost: a
      })        
    }
  },

    //读取储存信息
  onLoad(){
      this.getmouth()
      let Info = wx.getStorageSync('mangInfo')
      if(Info && Info.Name && Info.passwod){
        this.loginData(Info.Name,Info.passwod)
      }
  },
  
  getName(res: { detail: { value: any } }){
    this.setData({
      Name: res.detail.value
    })
  },

  getPas(res: { detail: { value: any } }){
    this.setData({
      Pas: res.detail.value
    })
  },

    
  getcusNumb(res: { detail: { value: any } }){
    this.setData({
      Name: res.detail.value
    })
  },

    
  getcusName(res: { detail: { value: any } }){
    this.setData({
      Name: res.detail.value
    })
  },

  //登陆按钮
  btnPes(){
    let Name = this.data.Name
    let Pas = this.data.Pas
    if(!this.data.Name){
      wx.showToast({
        icon: 'error',
        title: '请输入账号',
      })
      return
    }

    if(!this.data.Pas){
      wx.showToast({
        icon: 'error',
        title: '请输入密码',
      })
      return
    }

    this.loginData(Name,Pas)

  },

  //登陆
  loginData(Name: string,Pas: string){
    app1.database.database().collection("mangInfo")
    .where({
      user: Name,
      passwod: Pas
    }).get().then(res =>{
    
    if(res.data && res.data.length>0){
      this.setData({
        iflogin: false
      })
      let iflogin = this.data.iflogin
      let mangInfo = {iflogin:true,Name:'',passwod:''}
        mangInfo.iflogin =  iflogin
        mangInfo.Name = Name
        mangInfo.passwod = Pas

      wx.setStorageSync('mangInfo', mangInfo)
    }else{
      wx.showToast({
        icon: 'error',
        title: '账号或密码错误',
      })

      wx.setStorageSync('mangInfo', null)

    }
  }).catch(res =>{
    console.log('失败',res)
  })
  },

  //扫码
  scan(){
    var that = this
    wx.scanCode({
      onlyFromCamera:true,
      success(res){
        that.setData({
          ifscan:true,
          id:res.result
        })
    }
    })
  },

  number(){
    wx.navigateTo({
      url:'../ser/ser'
    })
  },

  async btnchong(){
    var cost = this.data.cost    
    var id = this.data.id
    var mouth = this.data.mouth
    if(cost==0){
            wx.showToast({
        icon:'error',
        title:'请输入金额'
      })
      return
    }

    const res = await app1.database.database().collection('userInfo').where({_openid:id}).get()
    var count = parseFloat(res.data[0].money) 
    var number =  res.data[0].number
    var num =  parseFloat(cost) + count
    var treat = " " + "+" + " " + cost

    wx.showToast({
      icon:'loading',
      title:'加载中...'
    })

    setTimeout(async ()=>{
      app1.database.callFunction({
        name:'rechange',
        data:{
          id:id,
          money:num
        },
        async success(){
          wx.showToast({
            icon:'success',
            title:'操作成功'
          })
        }
      })   

      app1.database.callFunction({
        name:'tist',
        data:{
          number:number,
          treat:treat,
          mouth:mouth
        },
        success(){
          wx.navigateBack(1)
        }
      })
    },1000)
  },

  tist(){
    wx.navigateTo({
      url:'../tist/tist'
    })
  },

  async btnxiao(){
    var cost = this.data.cost
    var id = this.data.id
    var mouth = this.data.mouth
    if(cost==0){
      wx.showToast({
        icon:'error',
        title:'请输入金额'
      })
      return
    }

    const res = await app1.database.database().collection('userInfo').where({_openid:id}).get()
    var count = parseFloat(res.data[0].money) 
    var number =  res.data[0].number
    if(count>=parseFloat(cost)){
      var num = count - parseFloat(cost)
      var treat = " " + "-" + " " + cost

      wx.showToast({
        icon:'loading',
        title:'加载中...'
      })

        setTimeout(()=>{
          app1.database.callFunction({
            name:'rechange',
            data:{
              id:this.data.id,
              money:num
            },
            success(){
              wx.showToast({
                icon:'success',
                title:'操作成功'
              })
            }
        })  
        
        app1.database.callFunction({
          name:'tist',
          data:{
            number:number,
            treat:treat,
            mouth:mouth
          },
          success(){
            wx.navigateBack(1)
          }
        })
      },1000)
    }else{
      wx.showToast({
        icon:'error',
        title:'余额不足'
      })
      return
    }
  }
})