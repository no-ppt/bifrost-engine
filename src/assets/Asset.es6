import AssetStatus  from './AssetStatus';
import Event        from '../core/events/Event';
import EventTarget  from '../core/events/EventTarget';
import ClassUtils   from '../core/utils/ClassUtils';
import UUID         from '../core/utils/UUID';

/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class Asset extends EventTarget {

    constructor( id = UUID.generate() ) {
        super();

        // Define attributes.
        this._id     = id;
        this._status = AssetStatus.PENDING;
    }

    get id() {
        return this._id;
    }

    set status( value ) {
        let before   = this._status;
        this._status = value;
        this.dispatchEvent( new Event( {
            type     : 'StatusChange',
            target   : this,
            arguments: [
                {
                    before: before,
                    after : this._status
                }
            ]
        } ) );
    }

    get status() {
        return this._status;
    }
}