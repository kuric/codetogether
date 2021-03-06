'use strict'

var socketIO = require('socket.io');
var ot = require('ot');
var roomList = {};

module.exports = function(server) {
    var str = "Put you text here" ;
    var io = socketIO(server);
    io.on('connection', function (socket) {
        socket.on('joinRoom', function(data) {
            if(!roomList[data.room]) {
                var socketIOServer = new ot.EditorSocketIOServer(str, [], data.room, function(socket, cb){
                   var self = this;
                   Task.findByIdAndUpdate(data.room, {content: self.document}, function(err){
                       if(err) {
                           return cb(false);
                       } else {
                           cb(true);
                       }
                   });
                });
                roomList[data.room] = socketIOServer;
            }
            roomList[data.room].addClient(socket);
            roomList[data.room].setName(socket, data.username);

            socket.room = data.room;
            socket.join(data.room);
        });

        socket.on('chatMessage', function(data){
            io.to(socket.room).emit('chatMessage', data);
        });

        socket.on('deleteTask', function(data){
            Task.deleteOne({ _id: data.taskId }, function (err) {
                var taskId = data.taskId;
                if(err){
                    io.emit('deleteTask', err);
                }
                else {
                    io.emit('deleteTask', {"acknowledged":"true", "taskId": taskId});
                }
            });
        });

        socket.on('giveAccess', function(data){
            io.to(socket.room).emit('giveAccess', data);
        });
        socket.on('deleteAccess', function(data){
            io.to(socket.room).emit('deleteAccess', data);
        });

        socket.on('disconnect', function(data){
            socket.leave(socket.room);
        });
    })
}