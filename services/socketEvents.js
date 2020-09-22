const { addUser, removeUser, getUser, getUserByUsername } = require('./users');


function socketEvents(io, socket) {
    // join to chat
    socket.on('join-chat', ({name, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room});
        if(error){
            return callback({ error });
        }
        console.log("attemp to connect user " + user.name);
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
        const user = getUser(socket.id);
        io.to(user.room).emit('message', {user: user.name, text: message});
        callback();
    })

    // user is typing
    socket.on('typing', username => {
        const user = getUserByUsername(username);
        if(user){
            socket.broadcast.to(user.room).emit('typing', username);
        }
    });

    // user is NOT typing
    socket.on('stop-typing', username => {
        const user = getUserByUsername(username);
        if(user){
            socket.broadcast.to(user.room).emit('stop-typing', username);
        }
    });
  
    socket.on('disconnect', () => {
        console.log(`user had left the chat!`);
        removeUser(socket.id);
    })
}

module.exports = socketEvents;