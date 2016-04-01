(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './ConsoleLogger'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./ConsoleLogger'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.ConsoleLogger);
        global.LoggerFactory = mod.exports;
    }
})(this, function (exports, _ConsoleLogger) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _ConsoleLogger2 = _interopRequireDefault(_ConsoleLogger);

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

    /**
     * Default logger configure.
     *
     * @type {{level}}
     */
    var DEFAULT_CONFIG = {
        level: function () {
            var level = void 0;
            if (typeof window !== 'undefined' && window.location && window.location.hash) {
                var arr = window.location.hash.substring(1).split(',');
                arr.forEach(function (param) {
                    var pair = param.split('=');
                    if (pair[0] === 'logger.level') {
                        level = pair[1] || null;
                    }
                });
            }
            return level;
        }()
    };

    /**
     * @author hermit
     * @version 1.0.0
     * @since 1.0.0
     */

    var LoggerFactory = function () {
        function LoggerFactory() {
            _classCallCheck(this, LoggerFactory);
        }

        _createClass(LoggerFactory, null, [{
            key: 'getLogger',
            value: function getLogger(clazz) {
                var options = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_CONFIG : arguments[1];

                return new _ConsoleLogger2.default({
                    targetClass: clazz,
                    level: options.level
                });
            }
        }]);

        return LoggerFactory;
    }();

    exports.default = LoggerFactory;
});