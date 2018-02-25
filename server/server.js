require('../config/config');
const express = require('express');
const path = require('path');

const publicPath = path.join(__dirname, '../public');

console.log(publicPath);

var app = express();
app.use(express.static(publicPath));
var port = process.env.PORT;

app.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
});
