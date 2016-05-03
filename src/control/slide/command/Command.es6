import UUID             from '../../../core/utils/UUID';
import ActionFactory    from '../action/ActionFactory';

/**
 * Default command options.
 *
 * @type {object}
 * @property {string}   id      - UUID.
 * @property {array}    actions - Array contains actions.
 */
const DEFAULT_OPTIONS = {
    id     : UUID.generate(),
    actions: []
};

/**
 * @author hermit
 * @version 1.0.0
 * @since 1.0.0
 */
export default class Command {

    /**
     * Create a command.
     *
     * @param params Command construct options.
     */
    constructor( params ) {

        // Merge options.
        this._options = Object.assign( {}, DEFAULT_OPTIONS, params );

        // Define attributes.
        this._id       = this._options.id;
        this._parent   = null;
        this._children = [];
        this._actions  = [];

        // Create actions.
        this._options.actions.forEach( function ( args ) {
            this._actions.push( ActionFactory.create( args ) );
        }, this );
    }

    /**
     * Add actions to current command.
     *
     * @param actions actions to be added.
     */
    add( actions ) {
        if ( actions instanceof Array ) {
            actions.forEach( this.add, this );
        } else {
            this._children.push( actions );
        }
    }

    /**
     * Execute forward command.
     *
     * @param engine Rendering engine.
     */
    forward( engine ) {
        this._actions.forEach( action => action.forward( engine ) );
    }

    /**
     * Execute backward command.
     *
     * @param engine Rendering engine.
     */
    backward( engine ) {
        this._actions.forEach( action => action.backward( engine ) );
    }

    /**
     * Get the max timeout of the command animation.
     *
     * @returns {number}    timeout.
     */
    getMaxTimeout() {
        let max = 0;
        this._actions.forEach( function ( action ) {
            max = Math.max( max, action.getTimeout() );
        }, this );
        return max;
    }

    get id() {
        return this._id;
    }

    get parent() {
        return this._parent;
    }

    get children() {
        return this._children;
    }
}