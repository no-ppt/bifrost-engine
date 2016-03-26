import Component    from './Component';
import Container    from './container/Container';
import GenericImage from './image/GenericImage';
import PlaneText    from './text/PlaneText';

/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class ComponentFactory {

    static create( params ) {

        if ( params instanceof Array ) {
            return params.map( ComponentFactory.create );
        }

        if ( params instanceof Component ) {
            return params;
        }

        switch ( params.class ) {
            case 'Container':
                return new Container( params );
            case 'GenericImage':
                return new GenericImage( params );
            case 'PlaneText':
                return new PlaneText( params );
            default:
            // TODO: Logger
        }

        return null;
    }

}