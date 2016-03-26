/**
 * Define the trace level code.
 * @constant
 * @type {number}
 */
const TRACE_LEVEL = 0b00001;

/**
 * Define the debug level code.
 * @type {number}
 */
const DEBUG_LEVEL = 0b00010;

/**
 * Define the info level code.
 * @type {number}
 */
const INFO_LEVEL = 0b00100;

/**
 * Define the warn level code.
 * @type {number}
 */
const WARN_LEVEL = 0b01000;

/**
 * Define the error level code.
 * @type {number}
 */
const ERROR_LEVEL = 0b10000;

/**
 * Define the default log level.(Warn & error in defaults).
 *
 *
 * @constant
 * @type {number}
 */
const DEFAULT_LOG_LEVEL = WARN_LEVEL | ERROR_LEVEL;

const DEFAULT_LOG_OPTIONS = {
    targetClass: 'Logger',
    level      : DEFAULT_LOG_LEVEL
};

/**
 * A logger object is used to log message.
 *
 * <h3>Typical usage pattern:</h3>
 * <pre>
 * import { LoggerFactory } from 'logger/LoggerFactory';
 *
 * export class A {
 *     constructor() {
 *         this.logger = LoggerFactory.getLogger();
 *     }
 * }
 * </pre>
 * @author hermit
 * @version 1.0.2
 * @since 1.0.0
 */
export default class Logger {

    /**
     * Construct a logger with specified log level.
     *
     * @params options The logger construct options.
     */
    constructor( options ) {
        this._level       = options.level || DEFAULT_LOG_OPTIONS.level;
        this._targetClass = options.targetClass || DEFAULT_LOG_OPTIONS.targetClass;
    }

    /**
     * Prints a stack trace from the point where the method was called.
     */
    trace() {
        if ( this._isEnabled( TRACE_LEVEL ) ) {
            this.printTrace();
        }
    }

    /**
     * Log a message at the DEBUG level.
     *
     * @param msg the message string to be logged.
     * @param params the message parameters.
     */
    debug( msg, ...params ) {
        if ( this._isEnabled( DEBUG_LEVEL ) ) {
            this.printDebug( msg, ...params );
        }
    }

    /**
     * Log a message at the INFO level.
     *
     * @param msg the message string to be logged.
     * @param params the message parameters.
     */
    info( msg, ...params ) {
        if ( this._isEnabled( INFO_LEVEL ) ) {
            this.printInfo( msg, ...params );
        }
    }

    /**
     * Log a message at the WARN level.
     *
     * @param msg the message string to be logged.
     * @param params the message parameters.
     */
    warn( msg, ...params ) {
        if ( this._isEnabled( WARN_LEVEL ) ) {
            this.printWarn( msg, ...params );
        }
    }

    /**
     * Log a message at the ERROR level.
     *
     * @param msg the message string to be logged.
     * @param params the message parameters.
     */
    error( msg, ...params ) {
        if ( this._isEnabled( ERROR_LEVEL ) ) {
            this.printError( msg, ...params );
        }
    }

    /**
     * Check the log level.
     *
     * @param level Level to be checked.
     * @returns {boolean} true if the specified level is enabled.
     * @private
     */
    _isEnabled( level ) {
        return (this._level & level) > 0;
    }

    /**
     * Override this method to realize TRACE level log.
     *
     * @abstract
     */
    printTrace() {
    }

    /**
     * Override this method to realize DEBUG level log.
     *
     * @abstract
     */
    printDebug( msg, ...params ) {
    }

    /**
     * Override this method to realize INFO level log.
     *
     * @abstract
     */
    printInfo( msg, ...params ) {
    }

    /**
     * Override this method to realize WARN level log.
     *
     * @abstract
     */
    printWarn( msg, ...params ) {
    }

    /**
     * Override this method to realize ERROR level log.
     *
     * @abstract
     */
    printError( msg, ...params ) {
    }
}