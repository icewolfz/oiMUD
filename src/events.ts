/**
 * A custom event emitter that will work in browsers or nodejs
 * Contains naming conventions from all standard formats
 */
export class EventEmitter {
    #events = {};

    public bind(type: string, listener: Function, caller?, once?) {
        if (!Array.isArray(this.#events[type]) || typeof this.#events[type] === 'undefined')
            this.#events[type] = [];
        this.#events[type].push({ listener: listener, caller: caller, once: once || false });
    }

    public on(type: string, listener: Function, caller?) {
        this.bind(type, listener, caller);
    }

    public once(type: string, listener: Function, caller?) {
        this.bind(type, listener, caller, true);
    }

    public addEventListener(type: string, listener: Function, caller?) {
        this.bind(type, listener, caller);
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
        let events = this.#events[type];
        const once = []
        for (let i = 0, len = events.length; i < len; i++) {
            events[i].listener.apply(events[i].caller || caller, args);
            //store the index if once for easy removable
            if (events[i].once)
                once.push(i);
        }
        //Clean up once events after fired so events are fired in correct order, working last to first due to index manipulations
        for (let i = once.length - 1; i >= 0; i--) {
            events.splice(once[i], 1);
        }
    }

    public emit(type, ...args) {
        this.fire(type, args);
    }

    public dispatchEvent(type: string, args?, caller?) {
        this.fire(type, args, caller);
    }

    public unbind(type, listener) {
        if (!type || !listener) return;
        if (!Array.isArray(this.#events[type])) return;
        const events = this.#events[type];
        for (let i = events.length - 1; i >= 0; i--) {
            if (events[i].listener === listener) {
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
        if (!type) {
            this.#events = [];
            return;
        }
        if (!Array.isArray(this.#events[type])) return;
        delete this.#events[type];
    }

    public removeListenersFromCaller(caller, type?) {
        if (!type) {
            Object.keys(this.#events).forEach(key => {
                const events = this.#events[key];
                for (let i = events.length - 1; i >= 0; i--) {
                    if (events[i].caller === caller) {
                        events.splice(i, 1);
                        break;
                    }
                }
            });
            return;
        }
        if (!Array.isArray(this.#events[type])) return;
        const events = this.#events[type];
        for (let i = 0, len = events.length; i < len; i++) {
            if (events[i].caller === caller) {
                events.splice(i, 1);
                break;
            }
        }
    }

    public listeners(type?) {
        if (!type) return this.#events;
        return this.#events[type] || [];
    }
}