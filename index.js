const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
// routes 
const chatRoutes = require("./routes/chatRoutes");
// socket events
const socketEvents = require("./services/socketEvents");

// init app
const app = express();
const PORT = process.env.PORT || 7000;

// routes and middlewares
app.use(cors());
app.use(chatRoutes);
app.use(express.static(path.join(__dirname, 'static')));

const server = app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
  
// ===== socket.io =====
const io = socketio(server);
 
io.on('connection', (socket) => {
    socketEvents(io, socket);
}) 



 
