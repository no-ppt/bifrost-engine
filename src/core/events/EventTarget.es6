import Event            from '../events/Event';
import EventListener    from '../events/EventListener';
import LoggerFactory    from '../logger/LoggerFactory';
import ContextHelper    from '../utils/ContextHelper';

/**
 * Wildcard event type.
 *
 * @constant
 * @type {string}
 */
const EVENT_WILDCARD = '*';

// Define logger.
const logger = LoggerFactory.getLogger( 'EventTarget' );

/**
 * EventTarget is an interface implemented by objects that can receive events
 * and may have listeners for them.
 *
 * @author hermit
 * @version 1.0.2
 * @since 1.0.0
 */
export default class EventTarget {

    /**
     * Construct event target instance.
     * @constructor
     */
    constructor() {

        // Create empty events map.
        this._events = new Map();
    }

    /**
     * The EventTarget.addEventListener() method registers the specified listener on the EventTarget
     * it's called on. The event target may be an instance of EventTarget.
     *
     * @param type      A string representing the event type to listen for.
     * @param listener  The object that receives a notification when an event of the specified type
     *                  occurs. This must be an object implementing the EventListener interface, or
     *                  simply a JavaScript function.
     * @returns {EventTarget} Current context object.
     */
    addEventListener( type, listener ) {

        // Check parameter legality.
        this._checkEventType( type );
        this._checkEventListener( listener );

        // Emit 'ListenerRegistered' event before registers the specified listener.
        this.dispatchEvent( new Event( {
            type     : 'ListenerRegistered',
            target   : this,
            arguments: [
                listener
            ]
        } ) );

        // Registers the specified listener.
        if ( !this._events.has( type ) ) {
            this._events.set( type, [] );
        }
        this._events.get( type ).push( listener );

        logger.debug( `[addEventListener] New listener of '${ type }' registered.`, this );

        return this;
    }

    /**
     * Alias to EventTarget.addEventListener().
     *
     * @see EventTarget.addEventListener()
     */
    on( type, listener ) {
        return this.addEventListener( type, listener );
    }

    /**
     * Alias to EventTarget.addEventListener().
     *
     * @see EventTarget.addEventListener()
     */
    addListener( type, listener ) {
        return this.addEventListener( type, listener );
    }

    /**
     * Alias to EventTarget.addEventListener().
     *
     * @see EventTarget.addEventListener()
     */
    detachEvent( type, listener ) {
        return this.addEventListener( type, listener );
    }

    /**
     * Removes the event listener previously registered with EventTarget.addEventListener().
     *
     * @param type A string representing the event type to remove.
     * @param listener The function to remove from the event target.
     * @returns {EventTarget} Current context object.
     */
    removeListener( type, listener ) {

        // Check parameter legality.
        this._checkEventType( type );
        this._checkEventListener( listener );

        let list     = this._events.get( type );
        let position = list.indexOf( listener );

        if ( position < 0 ) {
            return this;
        }

        if ( list.length === 1 ) {
            this._events.delete( type );
        } else {
            list.splice( position, 1 );
        }

        // Emit 'ListenerRemoved' event after remove the listener.
        this.dispatchEvent( new Event( {
            type     : 'ListenerRemoved',
            target   : this,
            arguments: [
                listener
            ]
        } ) );

        logger.debug( `[removeListener] A listener of '${ type }' has been unregistered.`, this );

        return this;
    }


    /**
     * Clear all listener(s) of the specified event type.
     *
     * @param type Event type to be clear.
     * @returns {EventTarget} Current context object.
     */
    removeAllListener( type ) {

        // Check parameter legality.
        this._checkEventType( type );

        if ( !this._events.has( type ) ) {
            return this;
        }

        // Emit 'ListenerRemoved'.
        this.dispatchEvent( new Event( {
            type     : 'ListenerRemoved',
            target   : this,
            arguments: [
                this._events.get( type )
            ]
        } ) );

        // Remove all listener(s) listen to specified event type.
        this._events.delete( type );

        logger.debug( `[removeAllListener] All listener(s) of '${ type }' has been unregistered.`,
            this );

        return this;
    }

    /**
     * Clear all event listener(s) in the event target.
     */
    clearEventListener() {

        // Emit 'ListenerRemoved'.
        this.dispatchEvent( new Event( {
            type     : 'ListenerRemoved',
            target   : this,
            arguments: [
                [ ...this._events.values() ]
            ]
        } ) );

        // Clear all listener(s) in this object.
        this._events.clear();

        logger.debug( `[clearEventListener] All listener(s) has been unregistered.` );
    }

    /**
     * <p>
     * Dispatches an Event at the specified EventTarget, invoking the affected EventListeners
     * in the appropriate order.
     * </p>
     * <p>
     *   <em>The wildcard listener will dispatched later than the concrete listener.</em>
     * </p>
     *
     * @param event is the Event object to be dispatched.
     * @returns {EventTarget} Current context object.
     */
    dispatchEvent( event ) {

        // Check parameter legality.
        this._checkEvent( event );

        // Dispatch event to all listeners which listening on the specified event type.
        if ( this._events.has( event.type ) ) {
            this._events.get( event.type ).forEach( function ( listener ) {
                this._dispatch( event, listener );
            }, this );
        }

        // Dispatch event to all listeners which listening on the wildcard event type.
        if ( this._events.has( EVENT_WILDCARD ) ) {
            this._events.get( EVENT_WILDCARD ).forEach( function ( listener ) {
                this._dispatch( event, listener );
            }, this );
        }

        logger.debug( `[dispatchEvent] Event '${ event.type }' dispatched.`, event );

        return this;
    }

    propagateEvent( type, target ) {
        target.addEventListener( type, ContextHelper.delegate( function ( event ) {
            this.dispatchEvent( event );
        }, this ) );
    }

    delegateEvent( type, target ) {
        target.addEventListener( type, ContextHelper.delegate( function ( event ) {
            this.dispatchEvent( new Event( {
                type     : event.type,
                target   : this,
                arguments: [ event ].concat( event.arguments )
            } ) );
        }, this ) );
    }

    /**
     * Alias to EventTarget.dispatchEvent().
     *
     * @see EventTarget.dispatchEvent()
     */
    emit( event ) {
        return this.dispatchEvent( event );
    }

    /**
     * Alias to EventTarget.dispatchEvent().
     *
     * @see EventTarget.dispatchEvent()
     */
    fireEvent( event ) {
        return this.dispatchEvent( event );
    }

    _dispatch( event, listener ) {
        if ( listener instanceof EventListener ) {
            listener.handleEvent( event, ...event.arguments );
        } else {
            listener.call( this, event, ...event.arguments );
        }
    }

    _checkEvent( event ) {
        if ( !event || !( event instanceof Event ) ) {
            const msg = '[_checkEvent] Event must be an instance of "event/Event".';
            logger.error( msg, event );
            throw new Error( msg, event );
        }
    }

    _checkEventType( type ) {
        if ( !type || typeof type !== 'string' || type.length === 0 ) {
            const msg = '[_checkEventType] Event type must be a string.';
            logger.error( msg, type );
            throw new Error( msg, type );
        }
    }

    _checkEventListener( listener ) {
        if ( !listener || !(typeof listener === 'function' || listener instanceof EventListener ) ) {
            const msg = '[_checkEventListener] Listener must be an object implementing the ' +
                        'EventListener interface, or simply a JavaScript function.';
            logger.error( msg, listener );
            throw new Error( msg, listener );
        }
    }
}