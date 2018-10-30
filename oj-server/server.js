// Routing to pages
const express = require('express');
const app = express();
const path = require('path');
var http = require('http');

var socketIO = require('socket.io');
var io = socketIO();
var editorSocketService = require('./services/editorSocketService')(io);

//connect to Mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://darkrubber:pass123@ds051838.mlab.com:51838/project-oj-db');

// run restful API through http
const restRouter = require('./routes/rest');
// run static file through http
const indexRouter = require('./routes/index');


app.use('/api/v1',restRouter);
app.use(express.static(path.join(__dirname, '../public')));
// tell express we have a static page


// start socket connection based on the http server

// app.listen(3000, ()=> {
// 	console.log('App is listening to port 3000!');
// });
const server = http.createServer(app);
io.attach(server); //comment out this => the whole section = above
server.listen(3000);
server.on('listening', () => {
	console.log('App is listening to port 3000!');
});


app.use((req, res) => {
	res.sendFile('index.html',{root: path.join(__dirname,'../public')});
})