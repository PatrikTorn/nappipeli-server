import Game from '../models/gameModel';

function createGame(props) {
    return Game.create(props);
}

function getGames() {
    return Game.find()
}

function findGame(params) {
    return Game.findOne(params);
}

function updateGame(id, game) {
    return Game.findByIdAndUpdate(
        id,
        {
            games: game.games,
            counter: game.counter,
            wins: game.wins
        },
        { new: false },
    );
}

function removeAll() {
    return Game.remove();
}

export {
    createGame,
    findGame,
    updateGame,
    getGames,
    removeAll
}