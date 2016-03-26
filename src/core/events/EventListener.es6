import LoggerFactory from '../logger/LoggerFactory';

/**
 * @interface
 * @author hermit
 * @version 1.0.0
 * @since 1.0.0
 */
export default class EventListener {

    /**
     * @abstract
     * @param event
     * @param params
     */
    handleEvent( event, ...params ) {
    }
}