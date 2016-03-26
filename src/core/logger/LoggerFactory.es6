import ConsoleLogger from './ConsoleLogger';

/**
 * Default logger configure.
 *
 * @type {{level}}
 */
const DEFAULT_CONFIG = {
    level: (function () {
        let level;
        if ( typeof window !== 'undefined' && window.location && window.location.hash ) {
            let arr = window.location.hash.substring( 1 ).split( ',' );
            arr.forEach( function ( param ) {
                let pair = param.split( '=' );
                if ( pair[ 0 ] === 'logger.level' ) {
                    level = pair[ 1 ] || null;
                }
            } );
        }
        return level;
    })()
};

/**
 * @author hermit
 * @version 1.0.0
 * @since 1.0.0
 */
export default class LoggerFactory {

    /**
     * Get a logger instance with specified class name.
     *
     * @returns {*}
     */
    static getLogger( clazz, options = DEFAULT_CONFIG ) {
        return new ConsoleLogger( {
            targetClass: clazz,
            level      : options.level
        } );
    }
}