import ContentCommand   from '../command/ContentCommand';
import ElementCommand   from '../command/ElementCommand';
import HelperCommand    from '../command/HelperCommand';
import TopicCommand     from '../command/TopicCommand';

/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class CommandFactory {

    static create( params ) {
        switch ( params.class ) {
            case 'TopicCommand':
                return new TopicCommand( params );
            case 'ContentCommand':
                return new ContentCommand( params );
            case 'ElementCommand':
                return new ElementCommand( params );
            case 'HelperCommand':
                return new HelperCommand( params );
            default:
                // TODO:
        }
        return null;
    }
}