import KeyframeAction   from './KeyframeAction';

/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class ActionFactory {

    static create( options ) {
        switch ( options.class ) {
            case 'KeyframeAction':
                return new KeyframeAction( options );
            default:
                // TODO:
        }
    }
}