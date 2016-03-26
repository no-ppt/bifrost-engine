/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class ObjectUtils {

    /**
     * Copy properties to the target.
     *
     * @param target    Object to copy to.
     * @param sources   Objects to copy from.
     */
    static copyProperties( target, ...sources ) {
        sources.forEach( function ( source ) {
            for ( let key of Reflect.ownKeys( source ) ) {
                if ( key !== "constructor" && key !== "prototype" && key !== "name" ) {
                    let desc = Object.getOwnPropertyDescriptor( source, key );
                    Object.defineProperty( target, key, desc );
                }
            }
        } );
    }
}