require('rootpath')();
const express = require('express');
var history = require('connect-history-api-fallback');
const app = express(),
bodyParser = require("body-parser");
port = 3080;
const config = { pingTimeout: 60000 };
const socketIO = require('socket.io');

const jwt = require('_helpers/jwt');
const socketjwt = require('jsonwebtoken');
const errorHandler = require('_helpers/error-handler');
const users = [];
let cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(process.cwd()+"/html/dist/"));
app.use(history());
app.use(express.static(process.cwd()+"/html/dist/"));
app.get('/', (req,res) => {
  res.sendFile(process.cwd()+"/html/dist/index.html")
});
app.use(jwt());
app.use('/authentication', require('_authApi/auth.controller'));
app.use('/book', require('_bookApi/book.controller'));
app.use('/issue', require('_issueApi/issue.controller'));
app.use(errorHandler);



const server = app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

const io = socketIO(server, config);
const issueService = require('./_issueApi/issue.service');
io.use(function(socket, next){
  if (socket.handshake.query && socket.handshake.query.token){
      socketjwt.verify(socket.handshake.query.token, 'This application is for library management', function(err, decoded) {
      if(err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      next();
    });
  } else {
      next(new Error('Authentication error'));
  }    
})
.on('connection', (socket) => {
  // console.log('a user connected');

  socket.on('join-room', data => {
    let roomName = data.username
    if(data.isadmin) roomName = 'admin';
    socket.join(roomName);
  })

  socket.on('request-issue',async data => {
    let insertReq = await issueService.newReqIssue(data);
    socket.broadcast.to('admin').emit("new-request",insertReq.toAdmin);// send admin updated request List
    io.in(insertReq.toAdmin.user.username).emit("user-updated-req-list",{result:insertReq, type:'new'}); // send to user with updated his req list
  });

  socket.on('approval-issue', async data => {
    let approvalReq = await issueService.approvalRequest(data);
    io.in('admin').emit("updated-req-list",approvalReq.toAdmin);// send admin updated request List
    socket.broadcast.to(data.issueDets.user.username).emit("approval-to-user",{toUserReqList: approvalReq.toUserReqList , toUserIssuedList: approvalReq.toUserIssuedList, approval: data.approval});
  })

  socket.on('delete-issue', async data => {
    let deleteRes = await issueService.deleteRequest(data);
    socket.broadcast.to('admin').emit("updated-req-list",deleteRes.toAdmin);// send admin updated request List
    io.in(data.user.username).emit("user-updated-req-list",{result:deleteRes, type:'delete'}); // send to user with updated his req list
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});