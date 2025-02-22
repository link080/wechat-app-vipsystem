// pages/ser/ser.ts
var app1 = getApp()
Page({
  data: {
    custdata:{},
    mouth:0,
    Name:'',
    number:'',
    Call:'',
    id:'',
    cost:0,
    ifser:true
  },

  //获取月份
  getmouth(){
    var myDate = new Date();
    var tM = myDate.getMonth() + 1;

    this.setData({
      mouth:tM
    })
  },

  //获取姓名输入
  getcusName(res: { detail: { value: string } }){
    this.setData({
      Name: res.detail.value
    })
  },

  //获取卡号输入
  getcusNumb(res: { detail: { value: any } }){
    this.setData({
      number: res.detail.value
    })
  },

  //获取号码输入
  getcusCall(res: { detail: { value: any } }){
    this.setData({
      Call: res.detail.value
    })
  },
  
  //获取金额输入
  getCost(res: { detail: { value: number } }){
    this.setData({
      cost: res.detail.value
    })
  },
  
  //查询老用户功能
  async btnOld(){
    var name = this.data.Name
    var num = this.data.number
    if(name==num){
      wx.showToast({
        icon:'error',
        title:'请输入查询信息'
      })
      return
    }

    wx.showToast({
      icon:'loading',
      title:'加载中...'
    })

    const res = await app1.database.callFunction({
      name:'serOld',
      data:{
        Name:name,
        number:num
      },
      success(res){
        if(res.result.length>0){
          wx.showToast({
            icon:'success',
            title:'查询成功'
          })
    
          this.setData({
            custdata:res.result[0],
            id:res.result[0]._openid,
            ifser:false
          })     
          }else{
            wx.showToast({
              icon:'error',
              title:'查询失败！'
            })
            return
          }
      }
    })
  },

  //查询型用户功能
  async btnser(){
    var that = this
    var name = this.data.Name
    var num = this.data.number
    var call = this.data.Call
    if(name=='' && call=='' && num==''){
      wx.showToast({
        icon:'error',
        title:'请输入查询信息'
      })
      return
    }

    wx.showToast({
      icon:'loading',
      title:'加载中...'
    })

    const res = await app1.database.callFunction({
      name:'setup',
      data:{
        Name:name,
        number:num,
        call:call
      },
      success(res){
        if(res.result == null){
          wx.showToast({
            icon:'error',
            title:'用户不存在'
          })
          return
        }else if(res.result.length>1){
          wx.showToast({
            icon:'error',
            title:'存在重名！'
          })
          return
        }else{
        wx.showToast({
          icon:'success',
          title:'查询成功'
        })
  
        that.setData({
          custdata:res.result[0],
          id:res.result[0]._openid,
          ifser:false
        })        
        }
      }
    })
  },

  //充值功能
  async btnchong(){
    var cost = this.data.cost
    var mouth = this.data.mouth
    if(cost==0){
      wx.showToast({
        icon:'error',
        title:'请输入金额'
      })
      return
    }

    //读取用户账户原余额，并修改余额
    const res = await app1.database.database().collection('userInfo').where({_openid:this.data.id}).get()
    var count = parseFloat(res.data[0].money) 
    var num =  parseFloat(cost) + count
    var treat = " " + "+" + " " + cost

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
          number:this.data.custdata.number,
          treat:treat,
          mouth:mouth
        },
        success(){
          wx.navigateBack(1)
        }
      })
    },1000)
  },

  //消费功能
  async btnxiao(){
    var cost = this.data.cost
    var mouth = this.data.mouth
    if(cost==0){
      wx.showToast({
        icon:'error',
        title:'请输入金额'
      })
      return
    }

    const res = await app1.database.database().collection('userInfo').where({_openid:this.data.id}).get()
    var count = parseFloat(res.data[0].money) 
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
            number:this.data.custdata.number,
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
  },

  onLoad() {
    this.getmouth()
  },
})