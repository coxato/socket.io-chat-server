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



 
