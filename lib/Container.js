var EventEmitter = require('events').EventEmitter;

const dataKey = Symbol();

/**
 * Simple state management
 * 
 * Instead of having multiple mutators for states,
 * a single set(key, val) method 
 */
class Container extends EventEmitter 
{
    /**
     * Creates an instance of Container.
     * 
     * @param {any} [data=null] 
     * 
     * @memberof Container
     */
    constructor(data = null) {
        super();
        this[dataKey] = {}
        if(data) this.setMany(data);

        // proxy for allowing property access to internal state __data__
        let proxy = new Proxy(this, {
            get(target, name) {
                if(name in target) return target[name];
                return target.get(name.toString());
            },

            set(target, name, value) {
                if(name in target) return target[name] = value;
                target.set(name.toString(), value);
                return true;
            },

            has(target, name) {
                return name in target || target.has(name.toString());
            },

            deleteProperty(target, name) {
                if(name in target) return false; // cannot remove properties
                target.remove(name.toString());
                return true;
            }
        })

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
    get(key, defaultValue = undefined) {
        this.emit(this.eventGet, this, key);

        if(key in this[dataKey]) return this[dataKey][key];
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
        this[dataKey][key] = value;
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
        return this[dataKey].hasOwnProperty(key);
    }

    /**
     * Remove the key from the container
     * 
     * @param {String} key 
     * 
     * @memberof Container
     */
    remove(key) {
        delete this[dataKey][key];
    }

    /**
     * Get raw data
     */
    export() {
        return this[dataKey];
    }

    /**
     * 
     * 
     * @param {Array} array 
     * 
     * @memberof Container
     */
    import(array) {
        this[dataKey] = array;
    }
}

module.exports = Container;