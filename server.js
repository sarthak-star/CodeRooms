const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const ACTIONS = require('./src/actions');

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};

function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            userName: userSocketMap[socketId]
        }
    });
}

io.on('connection' , (socket) =>{
    console.log('Socket connected' , socket.id);

    socket.on(ACTIONS.JOIN, ({roomId,userName}) => {
        userSocketMap[socket.id] = userName;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED , {
                clients,
                userName,
                socketId:socket.id
            })
        })
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, language }) => {
        socket.in(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
    });

    socket.on(ACTIONS.OUTPUT_CHANGE, ({ roomId, output }) => {
        socket.in(roomId).emit(ACTIONS.OUTPUT_CHANGE, { output });
    });

    socket.on('disconnecting', () =>{
        const rooms = [...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED , {
                socketId : socket.id,
                userName : userSocketMap[socket.id],

            })
        })
        delete userSocketMap[socket.id];
        socket.leave()
    })

})


const PORT = 5000;
server.listen(PORT,()=>console.log(`Server is active on ${PORT}`));
