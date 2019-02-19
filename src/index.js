import express from 'express'
import socketIO from 'socket.io'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'

import Game from './classes/Game'
import Socket from './classes/Socket'
import * as playerService from './services/playerService';
import * as gameService from './services/gameService';

// Configure port, dev 5000
const PORT = process.env.PORT || 5000;

// Configure express app, server and socketIO
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Enable cors
app.use(cors());

// Enable body parser
app.use(bodyParser.json())

// Initialize sockets and game
let sockets = {};
const game = new Game();

// Emit sockets
function emitSockets() {
    const loggedSockets = Object.values(sockets)
        .filter(s => s.name)
        .map(s => s.getSelf());

    io.sockets.emit('get sockets', loggedSockets);
}

// Emit game
function emitGame() {
    io.sockets.emit('get game', game.getSelf());
}

// Emit players
async function emitPlayers() {
    try {
        const players = await playerService.getPlayers();
        io.sockets.emit('get players', players);
    }catch (e) {
        console.log(e);
    }
}

// HTTP POST Login
app.post('/login', async (req, res) => {
    const { socketId, name, duckType } = req.body;
    try {
        const socket = sockets[socketId];

        // Create or get player by name
        const profile = await playerService.getOrCreatePlayer({name, duckType});
        socket.setProfile(profile);

        // Emit new sockets to ui
        emitSockets();

        // Send socket data
        res.json(socket.getSelf());

    } catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
});

// HTTP POST Play
app.post('/play', async (req, res) => {
    try {
        const { socketId } = req.body;

        // Throw exception if socket is not in sockets
        if(!sockets[socketId])
            throw new Error("Socket not found");

        const socket = sockets[socketId];

        // Get money and persist it to db
        const money = game.play(socket);
        await socket.earnMoney(money);

        // Make changes to game and get next win
        game.updateWins();
        const nextWin = game.getNextWin().at - game.counter;
        // Persist game to db
        await game.persistGame();

        // Emit game data to other sockets
        emitGame();

        // Emit players if player's money is changed 
        if(money > 0) { 
            await emitPlayers();
        }

        // Send money and next win
        res.json({ money, nextWin });

        // Increase counter
        game.increaseCounter();

    } catch (e) {
        console.log(e);
        res.sendStatus(404);
    }
});

// HTTP GET players
app.get('/players', async (req, res) => {
    try {
        const players = await playerService.getPlayers();
        res.json(players);
    } catch (e) {
        res.status(404).send(e);
    }
})

// HTTP GET games
app.get('/game', async (req, res) => {
    try {
        const data = await gameService.findGame({_id:game._id});
        res.json(data);
    } catch (e) {
        res.status(404).send(e);
    }
})

io.on('connection', (socket) => {

    // Create new socket
    sockets[socket.id] = new Socket(socket);

    // When socket disconnects, 
    // delete socket from dict and send it to other sockets
    socket.on('disconnect', () => {
        if(sockets[socket.id]) {
            delete sockets[socket.id];
            emitSockets();
        }
    });

});

server.listen(PORT, () => {
    console.log("Server listening on", PORT);
});