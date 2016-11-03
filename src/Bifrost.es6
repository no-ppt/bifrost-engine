import Player       from './player/Player';
import TweenConfig  from './config/TweenConfig';

/**
 * Register the class to Bifrost.
 * @param name  Class signature.
 * @param clazz The class to be registered.
 */
function register( name, clazz ) {

    // Check name for validity.
    // It must exist, and must not begin or end with a period or contain two periods in a row.
    if ( !name ) {
        throw new Error();
    }
    if ( name.charAt( 0 ) === '.'
         || name.charAt( name.length - 1 ) === '.'
         || name.indexOf( ".." ) != -1 ) {
        throw new Error();
    }

    // Break the name at periods and create the object hierarchy we need.
    let parts = name.split( '.' );

    // For each namespace component, either create an object
    // or ensure that an object by that name already exists.
    let container = Bifrost;
    for ( let i = 0; i < parts.length; i++ ) {
        let part = parts[ i ];

        // If there is no property of container with this name, create an empty object.
        if ( !container[ part ] ) {

            if ( i === parts.length - 1 ) {
                container[ part ] = clazz;
            } else {
                container[ part ] = {};
            }
        } else if ( typeof container[ part ] !== 'object' ) {
            // If there is already a property, make sure it is an object.
            var n = parts.slice( 0, i ).join( '.' );
            throw new Error( n );
        }
        container = container[ part ];
    }
}

/**
 * Define the Bifrost library.
 *
 * @type {object}
 */
let Bifrost = {
    version     : '2.0.8'
};

// Register modules.
register( 'player.Player', Player );
register( 'config.TweenConfig', TweenConfig );

// Export Bifrost framework.
export default Bifrost;
