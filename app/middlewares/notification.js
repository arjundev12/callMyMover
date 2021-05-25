const { json } = require("body-parser");
var firebaseAdmin = require("firebase-admin");

var serviceAccount = require("../authConfig/callmymoover-firebase-adminsdk-lcyd7-aae774fdab.json");
const fcmToken = require('../models/fcmToken')

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

let NotificationModel = require("../models/notification")
// let firebase = firebaseAdmin.initializeApp({
//     credential: firebaseAdmin.credential.cert(),
//     databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
// });
// var registrationToken = 'YOUR_REGISTRATION_TOKEN';


// class Notification {
//   constructor() {
//     return {
//       _sendPushNotification: this._sendPushNotification.bind(this),

//     }
//   }
//   // data: {
//   //     score: '850',
//   //     time: '2:45'
//   //   }
//   _sendPushNotification = async (message, fcmtoken) => {
//     try {
//       var payload = {
//         data: message,
//         token: fcmtoken
//       };
//       // let token = ['fcmtoken']
//       //   let payload = { Notification: {title: "this is a notification" , body: "this is the body of the notification"}}
//       // let options ={ priority : "high", timeToLive: 60*60*24}
//       // sendToDevice(token, payload, option)
//       let response = await firebaseAdmin.messaging().send(payload)
//       console.log("response of notification", response)
//       return true
//     } catch (error) {
//       console.log("error in notification", error)
//     }
//   }
// }

_sendPushNotification = async (message, fcmtoken =null, data = null) => {
  try {
    // message.data = JSON.stringify(data)
    console.log("hiiiii",  typeof   data, data)

    var payload = {
      // notification: message,
      data : {
        title: message.title,
        time : message.time,
        otp : message.otp? message.otp : "",
        _id: data._id.toString(),
        status: data.status,
        estimateTime: `${data.vehicle_details.estimateTime}`,
        estimateDistance: `${data.vehicle_details.estimateDistance}`,
        pickupLocation:  data.pickupLocation[0].address,
        dropLocation:  data.dropLocation[0].address,
        job_cost:  `${data.vehicle_details.estimatePrice}`,
        driverId: data.driverId ? data.driverId +"": ""

      }
    };
    let token 
    // console.log("hiiiii",  data.owner)
    if(fcmtoken == '' || fcmtoken == null || fcmtoken == undefined){
      // let getToken = await fcmToken.findOne({status : 'active'})
      let getToken = await fcmToken.findOne({userId : data.owner})
      // console.log("hiiiiigetTokengetToken", getToken)
      token = [getToken.fcmToken]
    }else{
      token = [fcmtoken]
    }
    if (data != null) {
      let saveNotification = new NotificationModel({
        title: message.title,
        orderId: data._id,
        orderInfo: data.orderInfo,
        toId: data.owner,
        fromId: data.driverId
      })
      saveNotification.save()
    }
    console.log(",payload,token,payload,token",payload,token)
    var option = {
      priority: "high",
      timeToLive: 60 * 60 * 24
    }
    let response = await firebaseAdmin.messaging().sendToDevice(token, payload, option)
    console.log("response of notification", response)
  } catch (error) {
    console.log("error in notification", error)
  }
  return true
}
_sendPushNotificationToDriver = async (message, fcmtoken =null, data = null) => {
  try {
    // message.data = JSON.stringify(data)
    console.log("hiiiii",  typeof   data, data)

    var payload = {
      // notification: message,
      data : {
        title: message.title,
        time : message.time,
        otp : message.otp? message.otp : "",
        _id: data._id.toString(),
        status:data.status,
        estimateTime:`${data.vehicle_details.estimateTime}`,
        estimateDistance:  `${data.vehicle_details.estimateDistance}`,
        pickupLocation: data.pickupLocation[0].address,
        dropLocation: data.dropLocation[0].address,
        job_cost: `${data.vehicle_details.estimatePrice}`,
      }
    };
    let token 
    if(fcmtoken == '' || fcmtoken == null || fcmtoken == undefined){
      let getToken = await fcmToken.findOne({status : 'active'})
      console.log("gettoker", getToken)
      token = [getToken.fcmToken]
    }else{
      token = [fcmtoken]
    }
  
    console.log(payload, fcmtoken, data)
    var option = {
      priority: "high",
      timeToLive: 60 * 60 * 24
    }
    let response = await firebaseAdmin.messaging().sendToDevice(token, payload, option)
    console.log("response of notification", response)
  } catch (error) {
    console.log("error in notification", error)
  }
  return true
}
module.exports = { _sendPushNotification,
  _sendPushNotificationToDriver,
}



// sendPushNotification(message)





   
    //   let payload = { Notification: {title: "this is a notification" , body: "this is the body of the notification"}}
    // let options ={ priority : "high", timeToLive: 60*60*24}
    // sendToDevice(token, payload, option)
    // if (data != null) {
    //   let saveNotification = new NotificationModel({
    //     title: message.title,
    //     orderId: data._id,
    //     orderInfo: data.orderInfo,
    //     toId: data.owner,
    //     fromId: data.driverId
    //   })
    //   await saveNotification.save()
    // }