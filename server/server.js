require('../config/config');
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
console.log(publicPath);

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
const {generateMessage,generateLocationMessage} = require('./utils/message');
io.on('connection',(socket)=>{
    socket.on('join',(params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room))
            return callback('Name and roomname are required');
        else{
            socket.join(params.room);
            users.removeUser(socket.id);
            users.addUser(socket.id, params.name,params.room);
            io.to(params.room).emit('updateUserList',users.getUserList(params.room));
            socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
            socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined`));
            callback();
        }
           
    });
    console.log('New User Connected');
    socket.on('disconnect',()=>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
        }

    });
    socket.on('createMessage',(msg,callback)=>{
        var user = users.getUser(socket.id);
        if(user && isRealString(msg.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
            callback('This is from the server');
        }
    });
    socket.on('createLocationMessage',(coords)=>{
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });
});
app.use(express.static(publicPath));
var port = process.env.PORT;

server.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
});
