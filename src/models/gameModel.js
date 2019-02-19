
import '../connect';
import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    wins: {
        type: Array,
    },
    counter: {
        required: false,
        default: 0,
        type: Number
    },
    games: {
        type: Array
    }
});

export default mongoose.model('Game', gameSchema);
