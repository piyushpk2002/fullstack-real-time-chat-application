import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express();

//app.listen is an abstraction for creating the server manually 
const server = http.createServer(app); //creating http server manually 

//CORS

//combining http server with socket io http server for real time communication
//http server normally are stateless i.e on sending the req to server from client the connection 
//is established first and then upon sending the response after the req passes through all the 
//middlewares and controllers, the connection is broken, i.e client server connection is being 
//established and broken for each request seprately,
//But for real time chat, connection needs to be present all the time, so combining 
//normal http server with socket io server ensure connection is stateful. 
const io = new Server(server, {
    cors:{
        origin: ['http://localhost:5173'],
    },
});

//stores online users
//returns recivers socket id form socketmap to check if the user is online or not
export function getReceiverSocketId (userId) =>{
    return userSocketMap[userId];
}
const userSocketMap = {}; // {userId: socketId}


io.on('connection', (socket) =>{
    console.log('A user connected', socket.id);
    
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', ()=>{
        console.log('A user disconnected');
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", userSocketMap);
    })
})

export {io, app, server}