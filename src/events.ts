/**
 * A custom event emitter that will work in browsers or nodejs
 * Contains naming conventions from all standard formats
 */
export class EventEmitter {
    #events = {};

    public bind(type: string, listener: Function) {
        if (!Array.isArray(this.#events[type]) || typeof this.#events[type] === 'undefined')
            this.#events[type] = [];
        this.#events[type].push(listener);
    }

    public on(type: string, listener: Function) {
        this.bind(type, listener);
    }

    public addEventListener(type: string, listener: Function) {
        this.bind(type, listener);
    }

    public fire(type, args?, caller?) {
        if (!type || typeof type !== 'string')
            throw new Error('Event missing.');
        if (!Array.isArray(this.#events[type])) return;
        if (!args || args === null || typeof args === 'undefined')
            args = [];
        else if (!Array.isArray(args))
            args = [args];

        caller = caller || this;
        var events = this.#events[type];
        for (var i = 0, len = events.length; i < len; i++)
            events[i].apply(caller, args);
    }

    public emit(type, ...args) {
        this.fire(type, args);
    }

    public dispatchEvent(type:string, args?, caller?) {
        this.fire(type, args, caller);
    }

    public unbind(type, listener) {
        if (!type || !listener) return;
        if (!Array.isArray(this.#events[type])) return;
        const events = this.#events[type];
        for (let i = 0, len = events.length; i < len; i++) {
            if (events[i] === listener) {
                events.splice(i, 1);
                break;
            }
        }
    }

    public remove(type, listener) {
        this.unbind(type, listener);
    }

    public off(type, listener) {
        this.unbind(type, listener);
    }

    public removeListener(type, listener) {
        this.unbind(type, listener);
    }

    public removeAllListeners(type?) {
        if(!type) {
            this.#events = [];
            return;
        }
        if (!Array.isArray(this.#events[type])) return;
        delete this.#events[type];
    }

    public listeners(type?) {
        if(!type) return this.#events;
        return this.#events[type] || [];
    }
}