import ObjectUtils from './ObjectUtils';

/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class ClassUtils {

    static mixin( target, ...sources ) {
        sources.forEach( function ( source ) {
            ObjectUtils.copyProperties( target, source );
            ObjectUtils.copyProperties( target.prototype, source.prototype );
        } );
    }
}