(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './Logger'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./Logger'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Logger);
        global.ConsoleLogger = mod.exports;
    }
})(this, function (exports, _Logger2) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Logger3 = _interopRequireDefault(_Logger2);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
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

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var ConsoleLogger = function (_Logger) {
        _inherits(ConsoleLogger, _Logger);

        function ConsoleLogger() {
            _classCallCheck(this, ConsoleLogger);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(ConsoleLogger).apply(this, arguments));
        }

        _createClass(ConsoleLogger, [{
            key: 'printTrace',
            value: function printTrace() {
                if (console.trace) {
                    console.trace();
                } else {
                    console.log(new Error());
                }
            }
        }, {
            key: 'printDebug',
            value: function printDebug(msg) {
                for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    params[_key - 1] = arguments[_key];
                }

                if (console.debug) {
                    var _console;

                    (_console = console).debug.apply(_console, ['[DEBUG]\t[' + this._targetClass + ']\t' + msg].concat(params));
                } else {
                    var _console2;

                    (_console2 = console).log.apply(_console2, ['[DEBUG]\t[' + this._targetClass + ']\t' + msg].concat(params));
                }
            }
        }, {
            key: 'printInfo',
            value: function printInfo(msg) {
                for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    params[_key2 - 1] = arguments[_key2];
                }

                if (console.info) {
                    var _console3;

                    (_console3 = console).info.apply(_console3, ['[INFO]\t[' + this._targetClass + ']\t' + msg].concat(params));
                } else {
                    var _console4;

                    (_console4 = console).log.apply(_console4, ['[INFO]\t[' + this._targetClass + ']\t' + msg].concat(params));
                }
            }
        }, {
            key: 'printWarn',
            value: function printWarn(msg) {
                for (var _len3 = arguments.length, params = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                    params[_key3 - 1] = arguments[_key3];
                }

                if (console.warn) {
                    var _console5;

                    (_console5 = console).warn.apply(_console5, ['[WARN]\t[' + this._targetClass + ']\t' + msg].concat(params));
                } else {
                    var _console6;

                    (_console6 = console).log.apply(_console6, ['[WARN]\t[' + this._targetClass + ']\t' + msg].concat(params));
                }
            }
        }, {
            key: 'printError',
            value: function printError(msg) {
                for (var _len4 = arguments.length, params = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                    params[_key4 - 1] = arguments[_key4];
                }

                if (console.error) {
                    var _console7;

                    (_console7 = console).error.apply(_console7, [new Error('[ERROR]\t[' + this._targetClass + ']\t' + msg)].concat(params));
                } else {
                    var _console8;

                    (_console8 = console).log.apply(_console8, [new Error('[ERROR]\t[' + this._targetClass + ']\t' + msg)].concat(params));
                }
            }
        }]);

        return ConsoleLogger;
    }(_Logger3.default);

    exports.default = ConsoleLogger;
});