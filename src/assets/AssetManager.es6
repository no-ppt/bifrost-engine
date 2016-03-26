import Asset            from './Asset';
import AssetStatus      from './AssetStatus';
import AssetFactory     from './AssetFactory';
import Event            from '../core/events/Event';
import EventTarget      from '../core/events/EventTarget';
import ContextHelper    from '../core/utils/ContextHelper';

// Define the singleton and the enforcer.
let singleton         = Symbol();
let singletonEnforcer = Symbol();

/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class AssetManager extends EventTarget {

    /**
     * Private constructor for create singleton.
     * Use 'AssetManager.instance' to get the singleton instance.
     */
    constructor( enforcer ) {
        if ( enforcer != singletonEnforcer ) {
            let msg = '[constructor] Cannot instantiate singleton with constructor.';
            throw new Error( msg );
        }
        super();

        // Define the asset map.
        this._assets = new Map();
    }

    /**
     * Get the singleton.
     * @returns { AssetManager } the singleton.
     */
    static get instance() {
        if ( !this[ singleton ] ) {
            this[ singleton ] = new AssetManager( singletonEnforcer );
        }
        return this[ singleton ];
    }

    /**
     * Add asset to the manager.
     *
     * @param asset Asset to be added.
     */
    add( asset ) {
        if ( asset instanceof Asset ) {
            this._assets.set( asset.id, asset );
        } else if ( asset instanceof Array ) {
            asset.forEach( this.add, this );
        } else {
            this.add( this.load( asset ) );
        }
    }

    /**
     * Load asset to the manager.
     *
     * @param data Asset data to be loaded.
     * @returns {*}
     */
    load( data ) {

        // Return directly.
        if ( data instanceof Asset ) {
            return data;
        }

        // Return mapped array.
        if ( data instanceof Array ) {
            return data.map( this.load, this );
        }

        // TODO: Refactor 'type' to 'class'
        let asset = AssetFactory.create( data );
        asset.addEventListener( 'StatusChange',
            ContextHelper.delegate( this._assetStatusChangeHandler, this ) );
        asset.load();
        return asset;
    }

    get( id ) {
        return this._assets.get( id );
    }

    remove( asset ) {

        // Get asset by id.
        if ( typeof asset === 'string' ) {
            asset = this._assets.get( asset );
        }

        // Remove event listener.
        asset.removeEventListener( this._assetStatusChangeHandler );
    }

    clear() {

        // Release assets.
        this._assets.clear();
    }

    _assetStatusChangeHandler( event, change ) {

        // Asset has been loaded successfully.
        if ( change.after === AssetStatus.LOADED ) {
            this.dispatchEvent( new Event( {
                type     : 'AssetLoadSuccess',
                target   : this,
                arguments: [
                    event.target
                ]
            } ) );
        }

        // Asset cannot be loaded.
        if ( change.after === AssetStatus.FAILURE ) {
            this.dispatchEvent( new Event( {
                type     : 'AssetLoadFailure',
                target   : this,
                arguments: [
                    event.target
                ]
            } ) );
        }
    }
}