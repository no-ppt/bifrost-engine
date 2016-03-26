/**
 * @author hermit
 * @version 1.0.0
 * @since 1.0.0
 */
export default class ContextHelper {

    /**
     * Takes a function and returns a new one that will always have a particular context.
     *
     * @param func          The function whose context will be changed.
     * @param context       The object to which the context (this) of the function should be set.
     * @returns {Function}  New function with specified context.
     */
    static delegate( func, context ) {
        return function ( ...params ) {
            func.apply( context, params );
        }
    }
}