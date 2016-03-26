(function(global,factory){if(typeof define==='function'&&define.amd){define(['exports'],factory)}else if(typeof exports!=='undefined'){factory(exports)}else {var mod={exports:{}};factory(mod.exports);global.Logger=mod.exports}})(this,function(exports){'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value' in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}(); /**
 * Define the trace level code.
 * @constant
 * @type {number}
 */var TRACE_LEVEL=1; /**
 * Define the debug level code.
 * @type {number}
 */var DEBUG_LEVEL=2; /**
 * Define the info level code.
 * @type {number}
 */var INFO_LEVEL=4; /**
 * Define the warn level code.
 * @type {number}
 */var WARN_LEVEL=8; /**
 * Define the error level code.
 * @type {number}
 */var ERROR_LEVEL=16; /**
 * Define the default log level.(Warn & error in defaults).
 *
 *
 * @constant
 * @type {number}
 */var DEFAULT_LOG_LEVEL=WARN_LEVEL|ERROR_LEVEL;var DEFAULT_LOG_OPTIONS={targetClass:'Logger',level:DEFAULT_LOG_LEVEL}; /**
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
 */var Logger=function(){ /**
     * Construct a logger with specified log level.
     *
     * @params options The logger construct options.
     */function Logger(options){_classCallCheck(this,Logger);this._level=options.level||DEFAULT_LOG_OPTIONS.level;this._targetClass=options.targetClass||DEFAULT_LOG_OPTIONS.targetClass} /**
     * Prints a stack trace from the point where the method was called.
     */_createClass(Logger,[{key:'trace',value:function trace(){if(this._isEnabled(TRACE_LEVEL)){this.printTrace()}}},{key:'debug',value:function debug(msg){if(this._isEnabled(DEBUG_LEVEL)){for(var _len=arguments.length,params=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){params[_key-1]=arguments[_key]}this.printDebug.apply(this,[msg].concat(params))}}},{key:'info',value:function info(msg){if(this._isEnabled(INFO_LEVEL)){for(var _len2=arguments.length,params=Array(_len2>1?_len2-1:0),_key2=1;_key2<_len2;_key2++){params[_key2-1]=arguments[_key2]}this.printInfo.apply(this,[msg].concat(params))}}},{key:'warn',value:function warn(msg){if(this._isEnabled(WARN_LEVEL)){for(var _len3=arguments.length,params=Array(_len3>1?_len3-1:0),_key3=1;_key3<_len3;_key3++){params[_key3-1]=arguments[_key3]}this.printWarn.apply(this,[msg].concat(params))}}},{key:'error',value:function error(msg){if(this._isEnabled(ERROR_LEVEL)){for(var _len4=arguments.length,params=Array(_len4>1?_len4-1:0),_key4=1;_key4<_len4;_key4++){params[_key4-1]=arguments[_key4]}this.printError.apply(this,[msg].concat(params))}}},{key:'_isEnabled',value:function _isEnabled(level){return (this._level&level)>0}},{key:'printTrace',value:function printTrace(){}},{key:'printDebug',value:function printDebug(msg){}},{key:'printInfo',value:function printInfo(msg){}},{key:'printWarn',value:function printWarn(msg){}},{key:'printError',value:function printError(msg){}}]);return Logger}();exports.default=Logger});