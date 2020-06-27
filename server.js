require('rootpath')();
const express = require('express');
var history = require('connect-history-api-fallback');
const app = express(),
  bodyParser = require("body-parser");
port = 3080; // Server running port.
const config = { pingTimeout: 60000 };
const socketIO = require('socket.io');

const jwt = require('_helpers/jwt'); // Middleware for Auth check.
const socketjwt = require('jsonwebtoken');
const errorHandler = require('_helpers/error-handler');
// Controllers
const authController = require('_authApi/auth.controller');
const bookController = require('_bookApi/book.controller');
const issueController = require('_issueApi/issue.controller');

let cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(process.cwd() + "/html/dist/"));
app.use(history());
app.use(express.static(process.cwd() + "/html/dist/"));
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + "/html/dist/index.html")
});

app.use(jwt()); // Middlware applies to below routes.
app.use('/authentication', authController);
app.use('/book', bookController);
app.use('/issue', issueController);

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

const io = socketIO(server, config);
const issueService = require('./_issueApi/issue.service');

io.use(function (socket, next) {
  // Socket connection on authorized user (Middleware).
  if (socket.handshake.query && socket.handshake.query.token) {
    socketjwt.verify(socket.handshake.query.token, 'This application is for library management', function (err, decoded) {
      if (err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
})
  .on('connection', (socket) => {

    // Each user will join a socket room.
    socket.on('join-room', data => {
      let roomName = data.id
      if (data.isadmin) roomName = 'admin';
      socket.join(roomName);
    })

    // Socket listen on user request for issue of the book.
    socket.on('request-issue', async data => {
      let insertReq = await issueService.newReqIssue(data);
      socket.broadcast.to('admin').emit("updated-req-list", { result: insertReq.toAdmin, type: 'new' });// Send admin updated request list.
      io.in(data.userId).emit("user-updated-req-list", { result: insertReq.toUser, type: 'new' }); // Send to user with updated his req list.
      io.emit('all-user-update-library', { success: true });
    });

    // Socket listen on admin approval of user issue or return request.
    socket.on('approval-issue', async data => {
      let approvalReq = await issueService.approvalRequest(data);
      io.in('admin').emit("updated-req-list", { result: approvalReq.toAdmin, type: 'approval' });// Send admin updated request List.
      socket.broadcast.to(data.issueDets.userId).emit("approval-to-user", { toUserReqList: approvalReq.toUserReqList, toUserIssuedList: approvalReq.toUserIssuedList, approval: data.approval, return: data.returnreq });
      io.emit('all-user-update-library', { success: true });
    })

    // Socket listen on user delete book issue request.
    socket.on('delete-issue', async data => {
      let deleteRes = await issueService.deleteRequest(data);
      socket.broadcast.to('admin').emit("updated-req-list", { result: deleteRes.toAdmin, type: 'delete' });// Send admin updated request List.
      io.in(data.issueDets.userId).emit("user-updated-req-list", { result: deleteRes.toUser, type: 'delete' }); // Send to user with updated his req list.
      io.emit('all-user-update-library', { success: true });
    })

    // Socket listen on user request for returning book.
    socket.on('return-req-book', async data => {
      let returnReq = await issueService.userReturnBook(data);
      socket.broadcast.to('admin').emit("updated-req-list", { result: returnReq.toAdmin, type: 'return' });// Send admin updated request List.
      io.in(data.userId).emit("user-updated-req-list", { result: returnReq.toUser, type: 'return' }); // Send to user with updated his req list.
      io.emit('all-user-update-library', { success: true });
    });

    // Socket listen on user disconnect.
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

  });