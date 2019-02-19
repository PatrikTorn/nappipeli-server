import * as gameService from '../services/gameService';

export default class Game {
    constructor() {
        this._id = "5c6c2a00bc1f757aa863434c";
        this.counter = 0;
        this.games = [];
        this.wins = [
            {
                at: 100,
                amount: 100,
                step: 100
            },
            {
                at: 200,
                amount: 200,
                step: 200
            },
            {
                at: 500,
                amount: 500,
                step: 500
            },
        ];
        this.initializeGame();
    }

    getSelf() {
        return {
            counter: this.counter,
            wins: this.wins,
            games:this.games
        }
    }

    async initializeGame() {
        try {
            const game = await gameService.findGame({_id:this._id});
            this._counter = game.counter;
            this.games = game.games;
            this.wins = game.wins;
        }catch(e) {
            console.log(e);
        }
    }

    async persistGame() {
        return await gameService.updateGame(this._id, this.getSelf());
    }

    play(socket) {
        const win = this.getWin();
        this.games.push({
            name:socket.name, 
            win,
            counter:this.counter
        });
        return win;
    }

    getWin() {
        const wins = this.wins.sort((a, b) => b.amount - a.amount) // Biggest win first
        for(let win of wins) {
            if(win.at === this.counter){
                return win.amount
            }            
        }    
        return 0; // Else win is 0 if counter is not pointed to any of couts
    }

    getNextWin() {
        return this.wins.sort((a, b) => a.at - b.at)[0]
    }

    updateWins() {
        this.wins.forEach((win, i) => {
            if (this.counter >= win.at) {
                this.wins[i] = { ...win, at: win.at + win.step };
            }
        })
    }

    increaseCounter() {
        this.counter += 1;
    }
}