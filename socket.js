
// let Notificationmodel = require('./app/models/notifications');

// const models = require('./app/models');
const socketio = require('socket.io');
// const follow = models.follow;
// const likeModel = models.like;
// const bookmarkModel = models.bookmarks;

module.exports.listen = function (server){

 io = require('socket.io')(server);
 console.log('socket connected  ')
  io.on('connection' ,(socket) => {
    console.log('socket connected  ',socket.id);
    socket.on('getNotifications', async (userData) => {
      console.log(userData);
      try{
        socket.emit('newnotifications', userData);
      }catch(err){
        console.log('Error is : ', err);
      }

    });
  });
  return io;
}