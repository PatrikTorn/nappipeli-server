
import connect from '../connect';
import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        unique: true
    },
    money: {
        required: false,
        default: 0,
        type: Number
    },
    duckType: {
        required: false,
        default: 'mallard',
        type: String
    },
    gamesPlayed: {
        required: false,
        default: 0,
        type: Number
    }
});

export default mongoose.model('Player', playerSchema);
