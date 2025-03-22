const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
const cors = require('cors');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);
app.use(cors());

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
});

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        if (roomId) { // Check if roomId is defined
            socket.join(roomId);
            try{
                socket.to(roomId).emit('user-connected', userId);
            } catch (error) {
                console.error("error during user-connected emit", error);
            }

            socket.on('message', message => {
                io.to(roomId).emit('createMessage', message);
            });
        } else {
            console.error("roomId is undefined in join-room event");
        }
    });
});

server.listen(3050, () => {
    console.log('Server is running on port 3050');
});