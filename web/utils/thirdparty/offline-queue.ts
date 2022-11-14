import {v4} from "uuid";

class Wrapper {
    value: any;
    index: number;
    listeners: Array<((change: any, index: number) => any)>;

    constructor(value, index = 0) {
        this.index = index ?? 0;
        this.value = value
    }

    async addListener(cb) {
        this.listeners.push(cb);
    }

    set update(newValue: any) {
        for (const listener of this.listeners) listener(newValue, this.index);
    }

    get get() {
        return this.value
    }
}

export class OfflineQueue {
    storage = "localStorage";
    _this = this;
    items = new (class e extends Array {
        private readonly updater;
        private readonly _this;
        constructor(_this, updater, ...args) {
            super(...args);
            this.updater = updater;
            this._this = _this;
            console.log("queue created")
        }
        push(...args) {
            const r = [].push.call(this._this.items, ...args)
            this.updater(this._this.items);
            return r;
        }
    })(this, this._updater);
    id;
    constructor({storage, id}: { storage: "localstorage", id?: string }) {
        if (storage) this.storage = storage;
        this.id = Math.random() ?? (id || v4());
        // needs little more tweaking
        // if (localStorage.getItem("kn.chats.offlinequeue." + this.id)) this.items = JSON.parse(localStorage.getItem("kn.chats.offlinequeue." + this.id))
    }

    private async _updater(newArray) {
        // console.log(newArray, this.items)
        localStorage.setItem("kn.chats.offlinequeue." + this.id, JSON.stringify(newArray));
    }

    item(index: number) {
        return this.items[index]
    }
    public async push(item) {
        // const updateAble = this.makeItem(item, this.items.length);
        // await updateAble.addListener(this._updater)
        this.items.push(item);
        // const _updateAble = this.makeItem(item);
        // _updateAble.registerListener((change) => {
        //     this._updater(change, this.items.length);
        // })
        // this.items.push(_updateAble);
    }
}