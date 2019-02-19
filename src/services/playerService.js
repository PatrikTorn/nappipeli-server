import Player from '../models/playerModel';

function createPlayer(props) {
    return Player.create(props);
}

function getPlayers() {
    return Player.find()
}

function findPlayer(params) {
    return Player.findOne(params);
}

function updatePlayer(id, player) {
    return Player.findByIdAndUpdate(
        id,
        {
            money: player.money
        },
        { new: false },
    );
}

async function getOrCreatePlayer({name, duckType}) {
    const foundUser = await findPlayer({ name });
    if (foundUser) {
        return foundUser;
    } else {
        return await createPlayer({ name, duckType });
    }
}

function removeAll() {
    return Player.remove();
}

export {
    getOrCreatePlayer,
    createPlayer,
    findPlayer,
    updatePlayer,
    getPlayers,
    removeAll
}