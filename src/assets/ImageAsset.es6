import Asset            from './Asset';
import AssetStatus      from './AssetStatus';
import ContextHelper    from '../core/utils/ContextHelper';

const DEFAULT_OPTIONS = {
    id : null,
    src: null
};

// Default image.
const DEFAULT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAACAAAAAgAAw4TGaAAABYUlEQVR42u3bsQkAMQwEQflx/y37y1AwOw2Yg0WZz5v3ZtdZfp/e/y2Pz7ICwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4O70P5/e3wXAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgB3p//59P4uAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuDv9z6f3dwFwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsD9DYQLBFEjzLgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMTAtMjVUMTE6NDE6NDkrMDg6MDAIbjBRAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTEwLTI1VDExOjQxOjQ5KzA4OjAweTOI7QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAASUVORK5CYII=';

let isError = false;

/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class ImageAsset extends Asset {

    constructor(options = DEFAULT_OPTIONS) {
        super(options.id);

        // Define image and src.
        this._src   = options.src;
        this._image = new Image();

        // Bind events.
        this._bindEvents();
    }

    load() {
        this._image.crossOrigin = 'anonymous';
        this._image.src         = this._src;
        this.status             = AssetStatus.PROCESSING;
    }

    _bindEvents() {
        this._image.addEventListener('load',
            ContextHelper.delegate(this._imageLoadHandler, this));
        this._image.addEventListener('error',
            ContextHelper.delegate(this._imageErrorHandler, this));
    }

    _imageLoadHandler() {
        this.status = AssetStatus.LOADED;
    }

    _imageErrorHandler() {

        if (!isError) {

            // Using customize default image in the first time.
            isError         = true;
            this._image.src = window.BIFROST_DEFAULT_IMAGE_ASSET || DEFAULT_IMAGE;
        } else {

            // Using default image when customize default image cannot visited.
            this._image.src = DEFAULT_IMAGE;
        }

        this.status = AssetStatus.FAILURE;
    }

    get src() {
        return this._src;
    }

    set src(value) {
        this._src = value;
    }

    get image() {
        return this._image;
    }
}