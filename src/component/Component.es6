import THREE            from 'three';
import UUID             from '../core/utils/UUID';

const DEFAULT_OPTIONS = {
    id      : UUID.generate(),
    opacity : 1,
    position: {
        x: 0,
        y: 0,
        z: 0
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0
    },
    scale   : {
        x: 1,
        y: 1,
        z: 1
    }
};

/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class Component extends THREE.Object3D {

    constructor( params ) {

        super();

        // Merge options.
        this._options          = Object.assign( {}, DEFAULT_OPTIONS, params );
        this._options.position = Object.assign( {}, DEFAULT_OPTIONS.position, params.position );
        this._options.rotation = Object.assign( {}, DEFAULT_OPTIONS.rotation, params.rotation );
        this._options.scale    = Object.assign( {}, DEFAULT_OPTIONS.scale, params.scale );

        // Save the component id. NOTICE: Three.js id field is readonly.
        this.name = this._options.id;

        // Set opacity.
        this._opacity = this._options.opacity;

        // Set position and rotation.
        this.position.x = this._options.position.x;
        this.position.y = this._options.position.y;
        this.position.z = this._options.position.z;
        this.rotation.x = this._options.rotation.x * Math.PI / 180;
        this.rotation.y = this._options.rotation.y * Math.PI / 180;
        this.rotation.z = this._options.rotation.z * Math.PI / 180;

        // Set scale.
        this.scale.x = this._options.scale.x;
        this.scale.y = this._options.scale.y;
        this.scale.z = this._options.scale.z;
    }

    updateOpacity() {
        if ( this.children ) {
            this.children.forEach( child => {
                if ( child instanceof Component ) {
                    child.updateOpacity();
                }
            } );
        }
    }

    add( child ) {
        super.add( child );

        // Update opacity if instanceof component.
        if ( child instanceof Component ) {
            child.updateOpacity();
        }
    }

    get opacity() {
        if ( this.parent && this.parent instanceof Component ) {
            return this._opacity * this.parent.opacity;
        }
        return this._opacity;
    }

    set opacity( value ) {
        this._opacity = value;

        // Update opacity if has children.
        this.updateOpacity();
    }
}