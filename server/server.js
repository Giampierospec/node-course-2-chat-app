require('../config/config');
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

console.log(publicPath);

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
const {generateMessage,generateLocationMessage} = require('./utils/message');
io.on('connection',(socket)=>{
    console.log('New User Connected');
    socket.on('disconnect',()=>{
        console.log('Client disconnected');
    });
    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User joined'));
    socket.on('createMessage',(msg,callback)=>{
        
        io.emit('newMessage',generateMessage(msg.from, msg.text));
        callback('This is from the server');
    });
    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
    });
});
app.use(express.static(publicPath));
var port = process.env.PORT;

server.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
});
