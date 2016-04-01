(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../events/Event', '../events/EventListener', '../logger/LoggerFactory', '../utils/ContextHelper'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../events/Event'), require('../events/EventListener'), require('../logger/LoggerFactory'), require('../utils/ContextHelper'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Event, global.EventListener, global.LoggerFactory, global.ContextHelper);
        global.EventTarget = mod.exports;
    }
})(this, function (exports, _Event, _EventListener, _LoggerFactory, _ContextHelper) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Event2 = _interopRequireDefault(_Event);

    var _EventListener2 = _interopRequireDefault(_EventListener);

    var _LoggerFactory2 = _interopRequireDefault(_LoggerFactory);

    var _ContextHelper2 = _interopRequireDefault(_ContextHelper);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    /**
     * Wildcard event type.
     *
     * @constant
     * @type {string}
     */
    var EVENT_WILDCARD = '*';

    // Define logger.
    var logger = _LoggerFactory2.default.getLogger('EventTarget');

    /**
     * EventTarget is an interface implemented by objects that can receive events
     * and may have listeners for them.
     *
     * @author hermit
     * @version 1.0.2
     * @since 1.0.0
     */

    var EventTarget = function () {

        /**
         * Construct event target instance.
         * @constructor
         */

        function EventTarget() {
            _classCallCheck(this, EventTarget);

            // Create empty events map.
            this._events = new Map();
        }

        /**
         * The EventTarget.addEventListener() method registers the specified listener on the EventTarget
         * it's called on. The event target may be an instance of EventTarget.
         *
         * @param type      A string representing the event type to listen for.
         * @param listener  The object that receives a notification when an event of the specified type
         *                  occurs. This must be an object implementing the EventListener interface, or
         *                  simply a JavaScript function.
         * @returns {EventTarget} Current context object.
         */


        _createClass(EventTarget, [{
            key: 'addEventListener',
            value: function addEventListener(type, listener) {

                // Check parameter legality.
                this._checkEventType(type);
                this._checkEventListener(listener);

                // Emit 'ListenerRegistered' event before registers the specified listener.
                this.dispatchEvent(new _Event2.default({
                    type: 'ListenerRegistered',
                    target: this,
                    arguments: [listener]
                }));

                // Registers the specified listener.
                if (!this._events.has(type)) {
                    this._events.set(type, []);
                }
                this._events.get(type).push(listener);

                logger.debug('[addEventListener] New listener of \'' + type + '\' registered.', this);

                return this;
            }
        }, {
            key: 'on',
            value: function on(type, listener) {
                return this.addEventListener(type, listener);
            }
        }, {
            key: 'addListener',
            value: function addListener(type, listener) {
                return this.addEventListener(type, listener);
            }
        }, {
            key: 'detachEvent',
            value: function detachEvent(type, listener) {
                return this.addEventListener(type, listener);
            }
        }, {
            key: 'removeListener',
            value: function removeListener(type, listener) {

                // Check parameter legality.
                this._checkEventType(type);
                this._checkEventListener(listener);

                var list = this._events.get(type);
                var position = list.indexOf(listener);

                if (position < 0) {
                    return this;
                }

                if (list.length === 1) {
                    this._events.delete(type);
                } else {
                    list.splice(position, 1);
                }

                // Emit 'ListenerRemoved' event after remove the listener.
                this.dispatchEvent(new _Event2.default({
                    type: 'ListenerRemoved',
                    target: this,
                    arguments: [listener]
                }));

                logger.debug('[removeListener] A listener of \'' + type + '\' has been unregistered.', this);

                return this;
            }
        }, {
            key: 'removeAllListener',
            value: function removeAllListener(type) {

                // Check parameter legality.
                this._checkEventType(type);

                if (!this._events.has(type)) {
                    return this;
                }

                // Emit 'ListenerRemoved'.
                this.dispatchEvent(new _Event2.default({
                    type: 'ListenerRemoved',
                    target: this,
                    arguments: [this._events.get(type)]
                }));

                // Remove all listener(s) listen to specified event type.
                this._events.delete(type);

                logger.debug('[removeAllListener] All listener(s) of \'' + type + '\' has been unregistered.', this);

                return this;
            }
        }, {
            key: 'clearEventListener',
            value: function clearEventListener() {

                // Emit 'ListenerRemoved'.
                this.dispatchEvent(new _Event2.default({
                    type: 'ListenerRemoved',
                    target: this,
                    arguments: [[].concat(_toConsumableArray(this._events.values()))]
                }));

                // Clear all listener(s) in this object.
                this._events.clear();

                logger.debug('[clearEventListener] All listener(s) has been unregistered.');
            }
        }, {
            key: 'dispatchEvent',
            value: function dispatchEvent(event) {

                // Check parameter legality.
                this._checkEvent(event);

                // Dispatch event to all listeners which listening on the specified event type.
                if (this._events.has(event.type)) {
                    this._events.get(event.type).forEach(function (listener) {
                        this._dispatch(event, listener);
                    }, this);
                }

                // Dispatch event to all listeners which listening on the wildcard event type.
                if (this._events.has(EVENT_WILDCARD)) {
                    this._events.get(EVENT_WILDCARD).forEach(function (listener) {
                        this._dispatch(event, listener);
                    }, this);
                }

                logger.debug('[dispatchEvent] Event \'' + event.type + '\' dispatched.', event);

                return this;
            }
        }, {
            key: 'propagateEvent',
            value: function propagateEvent(type, target) {
                target.addEventListener(type, _ContextHelper2.default.delegate(function (event) {
                    this.dispatchEvent(event);
                }, this));
            }
        }, {
            key: 'delegateEvent',
            value: function delegateEvent(type, target) {
                target.addEventListener(type, _ContextHelper2.default.delegate(function (event) {
                    this.dispatchEvent(new _Event2.default({
                        type: event.type,
                        target: this,
                        arguments: [event].concat(event.arguments)
                    }));
                }, this));
            }
        }, {
            key: 'emit',
            value: function emit(event) {
                return this.dispatchEvent(event);
            }
        }, {
            key: 'fireEvent',
            value: function fireEvent(event) {
                return this.dispatchEvent(event);
            }
        }, {
            key: '_dispatch',
            value: function _dispatch(event, listener) {
                if (listener instanceof _EventListener2.default) {
                    listener.handleEvent.apply(listener, [event].concat(_toConsumableArray(event.arguments)));
                } else {
                    listener.call.apply(listener, [this, event].concat(_toConsumableArray(event.arguments)));
                }
            }
        }, {
            key: '_checkEvent',
            value: function _checkEvent(event) {
                if (!event || !(event instanceof _Event2.default)) {
                    var msg = '[_checkEvent] Event must be an instance of "event/Event".';
                    logger.error(msg, event);
                    throw new Error(msg, event);
                }
            }
        }, {
            key: '_checkEventType',
            value: function _checkEventType(type) {
                if (!type || typeof type !== 'string' || type.length === 0) {
                    var msg = '[_checkEventType] Event type must be a string.';
                    logger.error(msg, type);
                    throw new Error(msg, type);
                }
            }
        }, {
            key: '_checkEventListener',
            value: function _checkEventListener(listener) {
                if (!listener || !(typeof listener === 'function' || listener instanceof _EventListener2.default)) {
                    var msg = '[_checkEventListener] Listener must be an object implementing the ' + 'EventListener interface, or simply a JavaScript function.';
                    logger.error(msg, listener);
                    throw new Error(msg, listener);
                }
            }
        }]);

        return EventTarget;
    }();

    exports.default = EventTarget;
});