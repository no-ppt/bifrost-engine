import UUID             from '../../../core/utils/UUID';
import ActionFactory    from '../action/ActionFactory';

const DEFAULT_OPTIONS = {
    id     : UUID.generate(),
    actions: []
};

/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class Command {

    constructor( params ) {

        // Merge options.
        this._options = Object.assign( {}, DEFAULT_OPTIONS, params );

        // Define attributes.
        this._parent   = null;
        this._children = [];
        this._actions  = [];

        // Create actions.
        this._options.actions.forEach( function ( args ) {
            this._actions.push( ActionFactory.create( args ) );
        }, this );
    }

    add( command ) {
        if ( command instanceof Array ) {
            command.forEach( this.add, this );
        } else {
            this._children.push( command );
        }
    }

    forward( engine ) {
        this._actions.forEach( action => action.forward( engine ) );
    }

    backward( engine ) {
        this._actions.forEach( action => action.backward( engine ) );
    }

    get parent() {
        return this._parent;
    }

    get children() {
        return this._children;
    }
}