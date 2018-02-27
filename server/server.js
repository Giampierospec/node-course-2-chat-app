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
io.on('connection',(socket)=>{
    console.log('New User Connected');
    socket.on('disconnect',()=>{
        console.log('Client disconnected');
    });
});
app.use(express.static(publicPath));
var port = process.env.PORT;

server.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
});