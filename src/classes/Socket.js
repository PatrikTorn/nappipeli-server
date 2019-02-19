import { updatePlayer } from "../services/playerService";

export default class Socket {
    constructor(socket) {
        this._id = null;
        this.socket = socket;
        this.money = 0;
        this.name = null;
        this.duckType = null;
    }

    getSelf() {
        return {
            _id: this._id,
            money: this.money,
            name: this.name,
            duckType: this.duckType
        }
    }

    setProfile(profile) {
        this.name = profile.name;
        this.duckType = profile.duckType;
        this.money = profile.money;
        this._id = profile._id;
    }

    async earnMoney(money) {
        this.money += money;
        await updatePlayer(this._id, { money: this.money });
    }
}