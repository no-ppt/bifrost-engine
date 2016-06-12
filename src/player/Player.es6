import TWEEN            from 'tween';
import AssetManager     from '../assets/AssetManager';
import Event            from '../core/events/Event';
import EventTarget      from '../core/events/EventTarget';
import ContextHelper    from '../core/utils/ContextHelper';
import RenderingEngine  from '../render/RenderingEngine';
import SlideControl     from '../control/slide/SlideControl';
import ComponentFactory from '../component/ComponentFactory';

/**
 * Define the default player options.
 *
 * @type {object}
 * @property {boolean}  ignore - Ignore errors. Default is false.
 */
const DEFAULT_OPTIONS = {
    ignore: false
};

const Status = {
    WAIT   : 'WAIT',
    LOADING: 'LOADING',
    OPENED : 'OPENED',
    PLAYING: 'PLAYING',
    PAUSE  : 'PAUSE',
    ERROR  : 'ERROR'
};

/**
 *
 * @author hermit
 * @version 2.0.0
 * @since 1.0.0
 */
export default class Player extends EventTarget {

    /**
     * Construct player with specified container and options.
     *
     * @param container Container to append player.
     * @param options   Options for player.
     */
    constructor( container, options ) {
        super();

        // Merge player options.
        this._options = Object.assign( {}, DEFAULT_OPTIONS, options );

        // Declare attributes.
        this._requestId = 0;
        this._bpd       = null;             // Bifrost playable document.
        this._status    = Status.WAIT;

        this._container       = container;
        this._renderingEngine = RenderingEngine.instance;
        this._assetManager    = AssetManager.instance;

        this._controls = new Map();

        // Propagate events.
        this.propagateEvent( 'RendererCreated', this._renderingEngine );
        this.propagateEvent( 'CameraCreated', this._renderingEngine );
        this.propagateEvent( 'SceneCreated', this._renderingEngine );
        this.propagateEvent( 'ComponentAdded', this._renderingEngine );
    }

    /**
     * Open the specified bifrost playable document.
     *
     * @param bpd   Bifrost playable document for play.
     */
    open( bpd ) {

        // Stop first if player is running.
        if ( this._status != Status.WAIT ) {
            this.stop();
        }

        // Keep the bpd.
        this._bpd = bpd;

        // Update player status.
        this._status = Status.LOADING;

        // Open document.
        this._loadAssets( bpd.assets )
            .then( ContextHelper.delegate( this._initRenderingEngine, this ) )
            .then( ContextHelper.delegate( this._loadComponents, this ) )
            .then( ContextHelper.delegate( this._loadControl, this ) )
            .then( ContextHelper.delegate( function () {
                this._status = Status.OPENED;
                this.dispatchEvent( new Event( {
                    type     : 'BPDOpenSuccess',
                    target   : this,
                    arguments: []
                }, this ) );
            }, this ) )
            .catch( ContextHelper.delegate( function ( e ) {

                // Update player status.
                this._status = Status.ERROR;

                // Dispatch events.
                this.dispatchEvent( new Event( {
                    type     : 'BPDOpenFailure',
                    target   : this,
                    arguments: [ e ]
                }, this ) );
            }, this ) );
    }

    /**
     * Play.
     */
    play() {

        function render( delta ) {
            TWEEN.update( delta );
            this._renderingEngine.render();
            this._requestId = requestAnimationFrame( ContextHelper.delegate( render, this ) );
        }

        if ( this._status === Status.OPENED || this._status === Status.PAUSE ) {

            // Update player status.
            this._status = Status.PLAYING;

            // Enable controls.
            this._controls.forEach( control => control.enable() );

            // Render
            this._requestId = requestAnimationFrame( ContextHelper.delegate( render, this ) );
        }
    }

    /**
     * Pause.
     */
    pause() {

        if ( this._status === Status.PLAYING ) {

            // Update player status.
            this._status = Status.PAUSE;

            // Disable controls.
            this._controls.forEach( control => control.disable() );

            // Stop render.
            cancelAnimationFrame( this._requestId );
        }
    }

    /**
     * Stop the player.
     * Stop the render and clear the rendering context.
     */
    stop() {

        if ( this._status === Status.PLAYING
             || this._status === Status.PAUSE
             || this._status === Status.ERROR ) {

            // Update status.
            this._status = Status.WAIT;

            // Stop rendering loop.
            cancelAnimationFrame( this._requestId );

            // Unregister controls.
            this._controls.clear();

            // Reset asset manager.
            this._assetManager.clear();

            // Destroy rendering engine.
            this._renderingEngine.destroy();
        }
    }

    /**
     * Register controls.
     * @param control   Controls to be registered.
     */
    registerControl( control ) {
        control.register( this );
        this._controls.set( control.constructor.name, control );
    }

    /**
     * Get control by type.
     *
     * @param type Control type.
     * @returns {object} controls.
     */
    getControl( type ) {
        return this._controls.get( type );
    }

    /**
     * Resize the rendering viewport.
     *
     * @param width     Viewport width.
     * @param height    Viewport height.
     */
    resize( width, height ) {
        this._renderingEngine.resize( width, height );
    }

    snapshot() {
        return this._renderingEngine.snapshot();
    }

    snapshotUrl() {
        return this._renderingEngine.snapshotUrl();
    }

    _loadAssets( assets ) {
        return new Promise( ContextHelper.delegate( function ( resolve, reject ) {

            let totalCount   = assets.length;
            let successCount = 0;
            let failureCount = 0;

            // Bind asset load events.
            this._assetManager.addEventListener( 'AssetLoadSuccess',
                ContextHelper.delegate( function ( event, asset ) {

                    // Increase loaded assets count.
                    ++successCount;

                    // Dispatch progressing event.
                    this.dispatchEvent( new Event( {
                        type     : 'AssetLoadSuccess',
                        target   : this,
                        arguments: [
                            asset, {
                                total  : totalCount,
                                success: successCount,
                                failure: failureCount
                            }
                        ]
                    } ) );

                    // Resolve promise when all assets are loaded.
                    if ( successCount + failureCount >= totalCount ) {
                        if ( this._options.ignore ) {
                            resolve();
                        } else {
                            reject( 'Asset Load Failure.' );
                        }
                    }
                }, this ) );
            this._assetManager.addEventListener( 'AssetLoadFailure',
                ContextHelper.delegate( function ( event, asset ) {

                    // Increase failure assets count.
                    ++failureCount;

                    // Dispatch failure event.
                    this.dispatchEvent( new Event( {
                        type     : 'AssetLoadFailure',
                        target   : this,
                        arguments: [
                            asset, {
                                total  : totalCount,
                                success: successCount,
                                failure: failureCount
                            }
                        ]
                    } ) );

                    // Resolve promise when all assets are loaded.
                    if ( successCount + failureCount >= totalCount ) {
                        if ( this._options.ignore ) {
                            resolve();
                        } else {
                            reject( 'Asset Load Failure.' );
                        }
                    }
                }, this ) );

            // Add assets.
            this._assetManager.add( assets );
        }, this ) );
    }

    _initRenderingEngine() {

        // Initialize rendering engine.
        this._renderingEngine.initialize( this._container, {
            renderer: {
                clearColor: this._bpd.clearColor
            },
            camera  : this._bpd.camera
        } );

        // Dispatch event.
        this.dispatchEvent( new Event( {
            type     : 'RenderingEngineLoaded',
            target   : this,
            arguments: []
        } ) );
    }

    _loadComponents() {

        function create( params ) {

            // Construct component.
            let component = ComponentFactory.create( params );

            // Append children.
            if ( params.children ) {
                let children = params.children.map( create, this );
                children.forEach( child => component.add( child ) );
            }

            // Add component to rendering engine.
            this._renderingEngine.addComponent( component );

            return component;
        }

        // Create component.
        this._bpd.scene.children.forEach( create, this );

        // Dispatch event.
        this.dispatchEvent( new Event( {
            type     : 'ComponentLoaded',
            target   : this,
            arguments: []
        } ) );
    }

    _loadControl() {

        this._bpd.controls.forEach( function ( data ) {

            if ( data.class === 'SlideControl' ) {

                // Create slide control.
                let control = new SlideControl( data.options );
                control.load( data );
                this.registerControl( control );
                control.execCommand( 0 );

            } else {
                console.log( 'Not supported yet.' )
            }
        }, this );
    }

    get renderingEngine() {
        return this._renderingEngine;
    }

    get width() {
        return this._renderingEngine.width;
    }

    get height() {
        return this._renderingEngine.height;
    }
}