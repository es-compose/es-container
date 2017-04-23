
var EventEmitter = require('events').EventEmitter;

/**
 * Simple state management
 * 
 * Instead of having multiple mutators for states,
 * a single set(key, val) method 
 */
class Container extends EventEmitter 
{
    constructor(data = null) {
        super();
        this.__data__ = {}

        // proxy for allowing property access to internal state __data__
        let proxy = new Proxy(this, {
            get(target, name) {
                if(name in target) return target[name];

                return target.get(name);
            },

            set(target, name, value) {
                if(name in target) return target[name] = value;

                target.set(name, value);
            }
        })

        if(data) this.setMany(data);

        return proxy;
    }
    
    /**
     * Event name emitted in Set operation
     */
    get eventSet() { return 'set'; }

    /**
     * Event name emitted in get ooperation
     */
    get eventGet() { return 'get'; }

    /**
     * access state information
     * @note currently not performing access validation
     * @param {String} key
     * @param {any} defaultValue if key is not found, it will return back this value
     */
    get(key, defaultValue) {
        this.emit(this.eventGet, this, key);

        if(key in this.__data__) return this.__data__[key];
        else return defaultValue;
    }

    /**
     * Get multiple values for give keys
     * @param {array} keys 
     */
    getMany(keys) {
        let values = [];
        for(let key in keys) {
            values.push(this.get(key))
        }

        return values;
    }

    /**
     * store information in the state
     * @note currently not performing any validation
     * @param {String} key
     * @param {any} value
     * @throws
     */
    set(key, value) {
        this.emit(this.eventSet, this, key, value);
        this.__data__[key] = value;
    }

    /**
     * Add multiple key/vaues
     * @param {object} obj 
     */
    setMany(obj) {
        for(let key in obj) {
            this.set(key, obj[key]);
        }
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
