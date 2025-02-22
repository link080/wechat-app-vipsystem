var app1 = getApp()
Page({
  data: {
    userInfo:{},
    id:'1',
    name:'',
    number:0,
    Phone:0,
    ifOld:false,
    ifPerss:false
  },

  btnNew(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '注册账户需要填写手机号，请授权并进行下一步操作！',
      success(res){
        if (res.confirm) {
          that.setData({
            ifPerss:true
          })
        }else if (res.cancel){
          return
        }
      }
  })
  },

  btnOld(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '注册账户需要填写手机号，请授权并进行下一步操作！',
      success(res){
        if (res.confirm) {
          that.setData({
          ifPerss:true,
          ifOld:true
          })
        }else if (res.cancel){
          return
        }
      }
  })
  },

  getNum(res: { detail: { value: number } }){
    var a = res.detail.value
    if(!a){}else{
      this.setData({
        number: a
      })        
    }
  },

  getPhone(res: { detail: { value: number } }){
    var a = res.detail.value
    if(!a){}else{
      this.setData({
        Phone: a
      })        
    }
  },

  getName(res: { detail: { value: string } }){
    var a = res.detail.value
    if(!a){}else{
      this.setData({
        name: a
      })        
    }
  },

  async btncomp(){
    var name=this.data.name
    var Phone=this.data.Phone
    var num=this.data.number
    if(name==''){
      wx.showToast({
        icon:'error',
        title:'请填写姓名'
      })
      return
    }

    if(Phone==0){
      wx.showToast({
        icon:'error',
        title:'请填写号码'
      })
      return
    }

    if(num==0){
      wx.showToast({
        icon:'error',
        title:'请填写卡号'
      })
      return
    }

    wx.showToast({
      icon:'loading',
      title:'加载中...'
    })

    const res = await app1.database.callFunction({
      name:'findOld',
      data:{
        Name:name,
        number:num
      }
    })

    setTimeout(async () =>{
      if(res.result==null){
        wx.showToast({
          icon:'error',
          title:'信息错误，请入店与店员交流'
        })
      }else{
        console.log(res.result)
        let data1 = res.result
        app1.database.callFunction({
          name:'pay',
          data:{
            id:this.data.id,
            ifcard:false,
            name:name,
            phone:Phone,
            jifen:data1[0].jifen,
            money:data1[0].money,
            number:num,
            ticket:data1[0].ticket
          },
          success:function(){
            wx.showToast({
              icon:'success',
              title:'申请成功'
            })

            setTimeout(function () {
              wx.navigateBack(1)
            }
            ,1000);
          }
        })
      }
    },1000);
  },

  async btncompn(){
    var id=this.data.id
    var name=this.data.name
    var Phone=this.data.Phone
      if(id==''){
        wx.showToast({
          icon:'error',
          title:'请先登陆'
        })
        return
      }

      if(name==''){
        wx.showToast({
          icon:'error',
          title:'请填写姓名'
        })
        return
      }

      if(Phone==0){
        wx.showToast({
          icon:'error',
          title:'请填写号码'
        })
        return
      }

      wx.showToast({
        icon:'loading',
        title:'加载中...'
      })

      const userimf = await app1.database.database().collection('userInfo')
      .where({
        type:"New",
        ifcard:false
      }).count()
      //var num = userimf.total + 301
      //var number = JSON.stringify(num)
      var number = '330'
      app1.database.callFunction({
        name:'charge',
        data:{
          id:this.data.id,
          name:this.data.name,
          number:number,
          Phone:this.data.Phone,
        },
      })

      setTimeout(()=>{
        wx.showToast({
          icon:'success',
          title:'申请成功'
       })

       wx.navigateBack(2)
      },1000)
  },

    onLoad:function(options) {
      const userInfo = JSON.parse(options.data);
       this.setData({
        userInfo:userInfo,
        id:userInfo._openid
       })

      if(this.data.id=='1'){
        wx.showToast({
          icon:'error',
          title:'请先登陆'
        })

        setTimeout(function () {
          wx.navigateBack(1)
        }
        ,700);
      }else if(!userInfo.ifcard){
        wx.showToast({
          icon:'error',
          title:'已有会员卡'
        })

        setTimeout(function () {
          wx.navigateBack(1)
        }
        ,700);
      }
    }
})