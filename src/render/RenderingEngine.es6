import THREE            from 'three';
import Event            from '../core/events/Event';
import EventTarget      from '../core/events/EventTarget';
import LoggerFactory    from '../core/logger/LoggerFactory';
import ContextHelper    from '../core/utils/ContextHelper';
import ComponentFactory from '../component/ComponentFactory';
import Component        from '../component/Component';

// get logger.
const logger = LoggerFactory.getLogger( 'RenderingEngine' );

/**
 * Default renderer options.
 *
 * @type {object}
 * @property {string}   precision   - The shader precision. Should be "highp", "mediump" or "lowp".
 * @property {boolean}  alpha
 * @property {boolean}  premultipliedAlpha - Enable premultiplied alpha. Default is false.
 * @property {boolean}  stencil     - Enable stencil buffer. Default is false.
 * @property {boolean}  preserveDrawingBuffer - Preserve the drawing buffer. Default is true.
 * @property {boolean}  antialias   - Enable antialias. Default is true.
 * @property {number}   clearColor  - Renderer clear color. Default is black.
 */
const DEFAULT_RENDERER_OPTIONS = {
    precision            : 'mediump',
    alpha                : false,
    premultipliedAlpha   : false,
    stencil              : false,
    preserveDrawingBuffer: false,
    antialias            : true,
    clearColor           : 0x000000
};

/**
 * Default perspective camera options.
 *
 * @type {object}
 * @property {string}   type    - Camera type. Should be "PerspectiveCamera" or
 *                                "OrthographicCamera"(Unsupported).
 * @property {number}   fov     - Perspective camera frustum vertical field of view.
 * @property {number}   aspect  - Perspective camera frustum aspect ratio.
 * @property {number}   near    - Perspective camera near plane.
 * @property {number}   far     - Perspective camera far plane.
 * @property {object}   position    - Camera position.
 * @property {number}   position.x  - X component.
 * @property {number}   position.y  - Y component.
 * @property {number}   position.z  - Z component.
 * @property {object}   rotation    - Camera rotation.
 * @property {number}   rotation.x  - X component.
 * @property {number}   rotation.y  - Y component.
 * @property {number}   rotation.z  - Z component.
 */
const DEFAULT_CAMERA_OPTIONS = {
    type    : 'PerspectiveCamera',
    fov     : 45,
    aspect  : 16 / 9,
    near    : 1,
    far     : 1000000,
    position: {
        x: 0,
        y: 0,
        z: 0
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0
    }
};

/**
 * Default scene options.
 * @type {object}
 */
const DEFAULT_SCENE_OPTIONS = {};

/**
 * Default rendering engine options.
 *
 * @type {object}
 * @property {object}   renderer
 */
const DEFAULT_OPTIONS = {
    renderer: DEFAULT_RENDERER_OPTIONS,
    camera  : DEFAULT_CAMERA_OPTIONS,
    scene   : DEFAULT_SCENE_OPTIONS
};

// Define the singleton and the enforcer.
let singleton         = Symbol();
let singletonEnforcer = Symbol();

/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class RenderingEngine extends EventTarget {

    /**
     * Private constructor for create singleton.
     * Use 'RenderingEngine.instance' to get the singleton instance.
     */
    constructor( enforcer ) {
        if ( enforcer != singletonEnforcer ) {
            let msg = '[constructor] Cannot instantiate singleton with constructor.';
            throw new Error( msg );
        }
        super();

        // Declare attributes.
        this._container  = null;
        this._renderer   = null;
        this._camera     = null;
        this._scene      = null;
        this._components = new Map();
    }

    /**
     * Get the singleton.
     * @returns { RenderingEngine } the singleton.
     */
    static get instance() {
        if ( !this[ singleton ] ) {
            this[ singleton ] = new RenderingEngine( singletonEnforcer );
        }
        return this[ singleton ];
    }

    /**
     * Initialize the rendering engine.
     * Create renderer, camera and scene.
     *
     * @param container Container to append canvas.
     * @param options   Rendering engine initialize options.
     */
    initialize( container, options = DEFAULT_OPTIONS ) {

        // Validate container.
        if ( !container ) {
            const msg = '[initialize] Please specify the container.';
            logger.error( msg, container );
            throw new Error( msg );
        }

        // keep container.
        this._container = container;

        // Create renderer, camera and scene.
        this._createRenderer( options.renderer );
        this._createCamera( options.camera );
        this._createScene( options.scene );
    }

    /**
     * Add component to the scene.
     *
     * @param data component data to be added.
     */
    addComponent( data ) {

        if ( data instanceof Array ) {
            data.forEach( this.addComponent, this );
            return;
        }

        // Get component object.
        let component = data instanceof Component ? data : ComponentFactory.create( data );

        // Add component to map and graphics to the scene.
        this._components.set( component.name, component );
        this._scene.add( component );

        // Dispatch events.
        this.dispatchEvent( new Event( {
            type     : 'ComponentAdded',
            target   : this,
            arguments: [ component ]
        } ) );
    }

    /**
     * Get camera, scene and component.
     *
     * @param id Component id.
     * @returns {object} Camera, scene or component object.
     */
    get( id ) {
        if ( id === 'camera' ) {
            return this._camera;
        }
        if ( id === 'scene' ) {
            return this._scene;
        }
        return this._components.get( id );
    }

    /**
     * Render the scene with camera.
     */
    render() {
        this._renderer.render( this._scene, this._camera );
    }


    /**
     * Resize the renderer.
     *
     * @param width
     * @param height
     */
    resize( width, height ) {
        this._renderer.setSize( width, height );
    }

    /**
     * Destroy the rendering engine context.
     */
    destroy() {
        this._camera = null;
        this._scene  = null;
    }

    /**
     * Take a snapshot of the canvas.
     */
    snapshot() {
        let image = new Image();
        image.src = this.domElement.toDataURL();
        return image;
    }

    /**
     * Return the canvas snapshot in data:url.
     *
     * @returns {string}
     */
    snapshotUrl() {
        return this.domElement.toDataURL();
    }

    _createRenderer( options ) {

        // Merge renderer options.
        options = Object.assign( {}, DEFAULT_RENDERER_OPTIONS, options );

        // Create renderer.
        if ( !this._renderer ) {
            this._renderer = new THREE.WebGLRenderer( {
                precision            : options.precision,
                alpha                : options.alpha,
                premultipliedAlpha   : options.premultipliedAlpha,
                stencil              : options.stencil,
                preserveDrawingBuffer: options.preserveDrawingBuffer,
                antialias            : options.antialias
            } );
        }
        this._renderer.setClearColor( parseInt( options.clearColor ) );
        this._container.appendChild( this._renderer.domElement );
        this._renderer.setSize( this._container.offsetWidth, this._container.offsetHeight );

        // Dispatch events.
        this.dispatchEvent( new Event( {
            type     : 'RendererCreated',
            target   : this,
            arguments: [ this._renderer ]
        } ) );
    }

    _createCamera( options ) {

        // Merge camera options.
        options = Object.assign( {}, DEFAULT_CAMERA_OPTIONS, options );

        // Create camera.
        this._camera = new THREE.PerspectiveCamera(
            options.fov, options.aspect, options.near, options.far );

        this._camera.position.x = options.position.x || 0;
        this._camera.position.y = options.position.y || 0;
        this._camera.position.z = options.position.z || 0;
        this._camera.rotation.x = options.rotation.x || 0;
        this._camera.rotation.y = options.rotation.y || 0;
        this._camera.rotation.z = options.rotation.z || 0;

        // Dispatch events.
        this.dispatchEvent( new Event( {
            type     : 'CameraCreated',
            target   : this,
            arguments: [ this._camera ]
        } ) )
    }

    _createScene( options ) {

        // Merge scene options.
        options = Object.assign( {}, DEFAULT_SCENE_OPTIONS, options );

        // Create scene.
        this._scene = new THREE.Scene();

        // Dispatch events.
        this.dispatchEvent( new Event( {
            type     : 'SceneCreated',
            target   : this,
            arguments: [ this._scene ]
        } ) )
    }

    get domElement() {
        return this._renderer.domElement;
    }
}