import TWEEN    from 'tween';
import Action   from './Action';

const DEFAULT_DURATION = 1000;
const DEFAULT_EASING   = 'Sinusoidal.InOut';

/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class KeyframeAction extends Action {

    constructor( params ) {
        super( params );

        this._target   = params.target;
        this._from     = params.from || {};
        this._to       = params.to || {};
        this._duration = params.duration || DEFAULT_DURATION;
        this._easing   = params.easing || DEFAULT_EASING;
        this._createEasing();
    }

    forward( engine ) {
        this._animate( engine, this._to );
    }

    backward( engine ) {
        this._animate( engine, this._from );
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
            // TODO> LOG.
            return;
        }

        // Define tween list.
        let tweens = [];

        if ( object.position ) {
            tweens.push(
                new TWEEN.Tween( component.position )
                    .to( object.position, this._duration )
                    .easing( object.easing )
            );
        }
        if ( object.rotation ) {
            let rotation = {
                x: object.rotation.x != null ? object.rotation.x * Math.PI / 180
                    : component.rotation.x,
                y: object.rotation.y != null ? object.rotation.y * Math.PI / 180
                    : component.rotation.y,
                z: object.rotation.z != null ? object.rotation.z * Math.PI / 180
                    : component.rotation.z
            };
            tweens.push(
                new TWEEN.Tween( component.rotation )
                    .to( rotation, this._duration )
                    .easing( object.easing )
            );
        }
        if ( object.opacity != null ) {
            tweens.push(
                new TWEEN.Tween( { opacity: component._opacity } )
                    .to( { opacity: object.opacity }, this._duration )
                    .onUpdate( function () {
                        component.opacity = this.opacity;
                    } )
                    .easing( object.easing )
            );
        }

        // Execute tween.
        tweens.forEach( t => t.start() );
    }

}