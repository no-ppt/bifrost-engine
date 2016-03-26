import Logger from './Logger';

/**
 * The ConsoleLogger provides web applications with methods for writing log to the console.
 *
 * @author hermit
 * @version 1.0.0
 * @since 1.0.0
 */
export default class ConsoleLogger extends Logger {

    /**
     * @inheritDoc
     * @override
     */
    printTrace() {
        if ( console.trace ) {
            console.trace();
        } else {
            console.log( new Error() );
        }
    }

    /**
     * @inheritDoc
     * @override
     */
    printDebug( msg, ...params ) {
        if ( console.debug ) {
            console.debug( `[DEBUG]\t[${ this._targetClass }]\t${msg}`, ...params );
        } else {
            console.log( `[DEBUG]\t[${ this._targetClass }]\t${msg}`, ...params );
        }
    }

    /**
     * @inheritDoc
     * @override
     */
    printInfo( msg, ...params ) {
        if ( console.info ) {
            console.info( `[INFO]\t[${ this._targetClass }]\t${msg}`, ...params );
        } else {
            console.log( `[INFO]\t[${ this._targetClass }]\t${msg}`, ...params );
        }
    }

    /**
     * @inheritDoc
     * @override
     */
    printWarn( msg, ...params ) {
        if ( console.warn ) {
            console.warn( `[WARN]\t[${ this._targetClass }]\t${msg}`, ...params );
        } else {
            console.log( `[WARN]\t[${ this._targetClass }]\t${msg}`, ...params );
        }
    }

    /**
     * @inheritDoc
     * @override
     */
    printError( msg, ...params ) {
        if ( console.error ) {
            console.error( new Error( `[ERROR]\t[${ this._targetClass }]\t${msg}` ), ...params );
        } else {
            console.log( new Error( `[ERROR]\t[${ this._targetClass }]\t${msg}` ), ...params );
        }
    }
}