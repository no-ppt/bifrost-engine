import Asset            from './Asset';
import AssetStatus      from './AssetStatus';
import Event            from '../core/events/Event';
import ContextHelper    from '../core/utils/ContextHelper';

const DEFAULT_OPTIONS = {
    id : null,
    src: null
};

/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class ImageAsset extends Asset {

    constructor( options = DEFAULT_OPTIONS ) {
        super( options.id );

        // Define image and src.
        this._src   = options.src;
        this._image = new Image();

        // Bind events.
        this._bindEvents();
    }

    load() {
        this._image.src = this._src;
        this.status     = AssetStatus.PROCESSING;
    }

    _bindEvents() {
        this._image.addEventListener( 'load',
            ContextHelper.delegate( this._imageLoadHandler, this ) );
        this._image.addEventListener( 'error',
            ContextHelper.delegate( this._imageErrorHandler, this ) );
    }

    _imageLoadHandler() {
        this.status = AssetStatus.LOADED;
    }

    _imageErrorHandler() {
        this.status = AssetStatus.FAILURE;
    }

    get src() {
        return this._src;
    }

    set src( value ) {
        this._src = value;
    }

    get image() {
        return this._image;
    }
}