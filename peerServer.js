const { ExpressPeerServer } = require('peer');
const express = require('express');

const app = express();
const server = app.listen(3060, () => {
    console.log('Peer server is running on port 3060');
});

app.use('/peerjs', ExpressPeerServer(server, {
    debug: true
}));