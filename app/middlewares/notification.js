const { json } = require("body-parser");
var firebaseAdmin = require("firebase-admin");

var serviceAccount = require("../authConfig/callmymoover-firebase-adminsdk-lcyd7-aae774fdab.json");

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

_sendPushNotification = async (message, fcmtoken, data = null) => {
  try {
    // message.data = JSON.stringify(data)
    console.log("hiiiii",  typeof   data, data)

    var payload = {
      notification: message,
      data : {
        _id: data._id.toString(),
        status: data.status,
        estimateTime: JSON.stringify(data.estimateTime),
        pickupLocation:  JSON.stringify( data.pickupLocation),
        stoppage:  JSON.stringify(data.stoppage),
        dropLocation:  JSON.stringify(data.dropLocation),
        orderInfo:  JSON.stringify(data.orderInfo),

      }
    };
    // console.log("hiiiii",  typeof   payload.data.pickupLocation, payload.data.pickupLocation)
    let token = [fcmtoken]
    //   let payload = { Notification: {title: "this is a notification" , body: "this is the body of the notification"}}
    // let options ={ priority : "high", timeToLive: 60*60*24}
    // sendToDevice(token, payload, option)
    if (data != null) {
      let saveNotification = new NotificationModel({
        title: message.title,
        orderId: data._id,
        orderInfo: data.orderInfo,
        toId: data.owner,
        fromId: data.driverId
      })
      await saveNotification.save()
    }
    // console.log(payload)
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
module.exports = { _sendPushNotification }



// sendPushNotification(message)




