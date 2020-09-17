const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
// routes 
const chatRoutes = require("./routes/chatRoutes");
// users
const { addUser, removeUser, getUser } = require('./services/users');

// init app
const app = express();
const PORT = process.env.PORT || 5000;

// routes and middlewares
app.use(cors());
app.use(chatRoutes); 

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

 // Add this
 if (req.method === 'OPTIONS') {

      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Max-Age', 120);
      return res.status(200).json({});
  }

  next();

});

const server = app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
 
// socket.io
const io = socketio(server);

io.on('connection', (socket) => {

    // join to chat
    socket.on('join-chat', ({name, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room});
        if(error){
            return callback({ error });
        }
        // join user to a room
        socket.join(user.room);
        // say welcome to user from admin
        socket.emit('message', {user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});
        // say welcome from all the users in the room exept logued user
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name}, has joined!`})
        // frontend callback, all ok
        callback()
    }) 
  
    // user send message
    socket.on('send-message', (message, callback) => {
        // console.log("SOCKET ID", socket.id);
        const user = getUser(socket.id);
        io.to(user.room).emit('message', {user: user.name, text: message});
        callback();
    })
  
    io.on('disconnect', () => {
        console.log("user had left the chat!");
        removeUser(socket.id);
    })
}) 



 
