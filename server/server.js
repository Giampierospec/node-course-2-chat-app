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
const {generateMessage} = require('./utils/message');
io.on('connection',(socket)=>{
    console.log('New User Connected');
    socket.on('disconnect',()=>{
        console.log('Client disconnected');
    });
    socket.emit('welcome', generateMessage('Admin','Welcome to the chat app'));
    socket.broadcast.emit('otherUsers', generateMessage('Admin', 'New User joined'));
    socket.on('createMessage',(msg)=>{
        
        io.emit('newMessage',generateMessage(msg.from, msg.text));
        // socket.broadcast.emit('newMessage',{
        //     from: msg.from,
        //     text: msg.text,
        //     createdAt: new Date().getTime()
        // });
    });
});
app.use(express.static(publicPath));
var port = process.env.PORT;

server.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
});
