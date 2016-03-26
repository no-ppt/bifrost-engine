/**
 * @author hermit
 * @version 1.0.0
 */
export default class UUID {

    // TODO: Re-realize with UUID algorithm.
    static generate() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
            .replace( /[xy]/g, function ( c ) {
                let r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 3 | 8);
                return v.toString( 16 );
            } )
            .toUpperCase();
    }
}