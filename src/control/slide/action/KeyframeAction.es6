import TWEEN            from 'tween';
import Action           from './Action';
import TweenConfig      from '../../../config/TweenConfig';
import LoggerFactory    from '../../../core/logger/LoggerFactory';

// Get logger.
const logger = LoggerFactory.getLogger( 'KeyframeAction' );

/**
 * Default animation delay.
 * @type {number}
 */
const DEFAULT_DELAY = 0;

/**
 * Default animation duration.
 * @type {number}
 */
const DEFAULT_DURATION = 1000;

/**
 * Default tween easing function.
 * @type {string}
 */
const DEFAULT_EASING = 'Sinusoidal.InOut';

/**
 * Keyframe action.
 *
 * @author hermit
 * @version 2.0.0
 * @since 1.0.0
 */
export default class KeyframeAction extends Action {

    /**
     * Construct keyframe action.
     *
     * @param params Parameters for create the keyframe action.
     */
    constructor( params ) {
        super( params );

        this._target   = params.target;
        this._from     = params.from || {};
        this._to       = params.to || {};
        this._delay    = params.delay || DEFAULT_DELAY;
        this._duration = params.duration || DEFAULT_DURATION;
        this._easing   = params.easing || DEFAULT_EASING;
        this._createEasing();
    }

    /**
     * Execute keyframe forward.
     *
     * @param engine Rendering engine.
     */
    forward( engine ) {
        this._animate( engine, this._to );
    }

    /**
     * Execute keyframe backward.
     *
     * @param engine Rendering engine.
     */
    backward( engine ) {
        this._animate( engine, this._from );
    }

    /**
     * Get the animation timeout.
     *
     * @returns {number} delay + duration.
     */
    getTimeout() {
        return this._delay + this._duration;
    }

    _createEasing() {
        let pair     = this._easing.split( '\.' );
        let equation = pair[ 0 ];
        let easing   = pair[ 1 ];
        this._toEasing( equation, easing );
        this._fromEasing( equation, easing );
    }

    _toEasing( equation, easing ) {
        this._to.easing = TWEEN.Easing[ equation ][ easing ] || TWEEN.Easing.Sinusoidal.InOut;
    }

    _fromEasing( equation, easing ) {
        let reverse;
        switch ( easing ) {
            case 'In':
                reverse = 'Out';
                break;
            case 'Out':
                reverse = 'In';
                break;
            case 'InOut':
                reverse = 'InOut';
                break;
            default:
                reverse = 'InOut';
        }
        this._from.easing = TWEEN.Easing[ equation ][ reverse ] || TWEEN.Easing.Sinusoidal.InOut;
    }

    _animate( engine, object ) {

        // Get component.
        let component = engine.get( this._target );

        // Check component.
        if ( !component ) {
            logger.warn( `[_animate] No such component: [${ this._target }].` );
            return;
        }

        if ( TweenConfig.enable ) {

            // Define tween list.
            let tweens = [];

            // Position tween.
            if ( object.position ) {
                tweens.push(
                    new TWEEN.Tween( component.position )
                        .to( object.position, this._duration )
                        .easing( object.easing )
                        .delay( this._delay )
                );
            }

            // Rotation tween.
            if ( object.rotation ) {
                let rotation = {
                    x: object.rotation.x != null ?
                    object.rotation.x * Math.PI / 180 : component.rotation.x,
                    y: object.rotation.y != null ?
                    object.rotation.y * Math.PI / 180 : component.rotation.y,
                    z: object.rotation.z != null ?
                    object.rotation.z * Math.PI / 180 : component.rotation.z
                };
                tweens.push(
                    new TWEEN.Tween( component.rotation )
                        .to( rotation, this._duration )
                        .easing( object.easing )
                        .delay( this._delay )
                );
            }

            // Opacity tween.
            if ( object.opacity != null ) {
                tweens.push(
                    new TWEEN.Tween( { opacity: component._opacity } )
                        .to( { opacity: object.opacity }, this._duration )
                        .onUpdate( function () {
                            component.opacity = this.opacity;
                        } )
                        .easing( object.easing )
                        .delay( this._delay )
                );
            }

            // Execute tween.
            tweens.forEach( t => t.start() );
        } else {

            if ( object.position ) {
                component.position.x = object.position.x != null ?
                    object.position.x : component.position.x;
                component.position.y = object.position.y != null ?
                    object.position.y : component.position.y;
                component.position.z = object.position.z != null ?
                    object.position.z : component.position.z;
            }

            if ( object.rotation ) {
                component.rotation.x = object.rotation.x != null ?
                object.rotation.x * Math.PI / 180 : component.rotation.x;
                component.rotation.y = object.rotation.y != null ?
                object.rotation.y * Math.PI / 180 : component.rotation.y;
                component.rotation.z = object.rotation.z != null ?
                object.rotation.z * Math.PI / 180 : component.rotation.z;
            }

            if ( object.opacity != null ) {
                component.opacity = object.opacity != null ? object.opacity : component.opacity;
            }
        }
    }
}