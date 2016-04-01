(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './ImageAsset', './FontAsset', '../core/logger/LoggerFactory'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./ImageAsset'), require('./FontAsset'), require('../core/logger/LoggerFactory'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.ImageAsset, global.FontAsset, global.LoggerFactory);
        global.AssetFactory = mod.exports;
    }
})(this, function (exports, _ImageAsset, _FontAsset, _LoggerFactory) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _ImageAsset2 = _interopRequireDefault(_ImageAsset);

    var _FontAsset2 = _interopRequireDefault(_FontAsset);

    var _LoggerFactory2 = _interopRequireDefault(_LoggerFactory);

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

    var logger = _LoggerFactory2.default.getLogger('AssetFactory');

    /**
     *
     * @author hermit
     * @version 1.0.0
     */

    var AssetFactory = function () {
        function AssetFactory() {
            _classCallCheck(this, AssetFactory);
        }

        _createClass(AssetFactory, null, [{
            key: 'create',
            value: function create(data) {
                switch (data.type) {
                    case 'ImageAsset':
                        return new _ImageAsset2.default(data);
                    case 'FontAsset':
                        return new _FontAsset2.default(data);
                    default:
                        logger.error('[create] Unsupported asset type [' + data.type + ']');
                }
            }
        }]);

        return AssetFactory;
    }();

    exports.default = AssetFactory;
});