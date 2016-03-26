/**
 * Event construct template.
 *
 * @type {{_type: String, _target: Object, _timestamp: number, _arguments: Array}}
 */
const EVENT_TEMPLATE = {
    type     : null,
    target   : null,
    arguments: []
};

/**
 * The Event interface prevents any event of the EventTarget. It contains common properties and
 * methods to any event.
 *
 * @author hermit
 * @version 1.0.2
 * @since 1.0.0
 */
export default class Event {

    /**
     * @param params
     */
    constructor( params ) {

        // Construct event object by merging parameter.
        this._type      = params.type || EVENT_TEMPLATE.type;
        this._target    = params.target || EVENT_TEMPLATE.target;
        this._arguments = params.arguments || EVENT_TEMPLATE.arguments;
        this._timestamp = new Date().getTime();
    }

    /**
     * Get the event create timestamp.
     *
     * @returns {number} Event create time in milliseconds.
     */
    get timestamp() {
        return this._timestamp;
    }

    /**
     * Get the event type.
     *
     * @returns {String} Event type string.
     */
    get type() {
        return this._type;
    }

    /**
     * Get the event target.
     *
     * @returns {Object} Event target.
     */
    get target() {
        return this._target;
    }

    /**
     * Get the event emit arguments.
     *
     * @returns {Array} Arguments array.
     */
    get arguments() {
        return this._arguments;
    }

    /**
     * @see Event.arguments()
     */
    get args() {
        return this.arguments;
    }
}