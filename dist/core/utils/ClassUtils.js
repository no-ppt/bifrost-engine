(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './ObjectUtils'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./ObjectUtils'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.ObjectUtils);
        global.ClassUtils = mod.exports;
    }
})(this, function (exports, _ObjectUtils) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _ObjectUtils2 = _interopRequireDefault(_ObjectUtils);

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

    var ClassUtils = function () {
        function ClassUtils() {
            _classCallCheck(this, ClassUtils);
        }

        _createClass(ClassUtils, null, [{
            key: 'mixin',
            value: function mixin(target) {
                for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    sources[_key - 1] = arguments[_key];
                }

                sources.forEach(function (source) {
                    _ObjectUtils2.default.copyProperties(target, source);
                    _ObjectUtils2.default.copyProperties(target.prototype, source.prototype);
                });
            }
        }]);

        return ClassUtils;
    }();

    exports.default = ClassUtils;
});