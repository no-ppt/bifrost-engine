const DEFAULT_OPTIONS = {};

/**
 * Controls provide the abilities to update objects in the 3D scene.
 *
 * @abstract
 * @author hermit
 * @version 2.0.0
 * @since 1.0.0
 */
export default class Controls {

    /**
     * Create controls.
     *
     * @constructor
     * @param params    Parameters for create controls.
     */
    constructor( params ) {

        // Merge options.
        this._options = Object.assign( {}, DEFAULT_OPTIONS, params );

        // Define the player.
        this._player = null;
        this._enable = false;
    }

    /**
     * Register controls to the player.
     *
     * @param player Player to be used in.
     */
    register( player ) {
        this._player = player;
        this._enable = true;
    }

    /**
     * Unregister the controls.
     */
    unregister() {
        this._enable = false;
        this._player = null;
        this.destroy();
    }

    /**
     * Enable controls.
     */
    enable() {
        this._enable = true;
    }

    /**
     * Disable controls.
     */
    disable() {
        this._enable = false;
    }
}