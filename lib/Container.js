
var EventEmitter = require('events').EventEmitter;

/**
 * Simple state management
 * 
 * Instead of having multiple mutators for states,
 * a single set(key, val) method 
 */
class Container extends EventEmitter 
{
    constructor() {
        super();
        this.__data__ = {}

        // proxy for allowing property access to internal state __data__
        return new Proxy(this, {
            get(target, name) {
                if(name in target) return target[name];

                return target.get(name);
            },

            set(target, name, value) {
                if(name in target) return target[name] = value;

                throw new Error("Direct property setter is disabled.  Please use set() or other method provided by API.");
            }
        })
    }
    
    /**
     * Event name emitted in Set operation
     */
    get eventSet() { return 'eventSet'; }

    /**
     * Event name emitted in get ooperation
     */
    get eventGet() { return 'eventGet'; }

    /**
     * access state information
     * @note currently not performing access validation
     * @param {String} key
     * @param {any} defaultValue if key is not found, it will return back this value
     */
    get(key, defaultValue) {
        this.emit(this.eventGet, key, this);
        if(key in this.__data__) return this.__data__[key];
        else return defaultValue;
    }

    /**
     * store information in the state
     * @note currently not performing any validation
     * @param {String} key
     * @param {any} value
     * @throws
     */
    set(key, value) {
        this.emit(this.eventSet, key, value, this);
        this.__data__[key] = value;
    }

    /**
     * Check to see if state variable exists
     * @param {string} key 
     */
    has(key) {
        return this.__data__.hasOwnProperty(key);
    }
}

module.exports = Container;
