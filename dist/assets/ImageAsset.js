(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './Asset', './AssetStatus', '../core/utils/ContextHelper'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./Asset'), require('./AssetStatus'), require('../core/utils/ContextHelper'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Asset, global.AssetStatus, global.ContextHelper);
        global.ImageAsset = mod.exports;
    }
})(this, function (exports, _Asset2, _AssetStatus, _ContextHelper) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Asset3 = _interopRequireDefault(_Asset2);

    var _AssetStatus2 = _interopRequireDefault(_AssetStatus);

    var _ContextHelper2 = _interopRequireDefault(_ContextHelper);

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

    var DEFAULT_OPTIONS = {
        id: null,
        src: null
    };

    /**
     *
     * @author hermit
     * @version 1.0.0
     */

    var ImageAsset = function (_Asset) {
        _inherits(ImageAsset, _Asset);

        function ImageAsset() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_OPTIONS : arguments[0];

            _classCallCheck(this, ImageAsset);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ImageAsset).call(this, options.id));

            // Define image and src.
            _this._src = options.src;
            _this._image = new Image();

            // Bind events.
            _this._bindEvents();
            return _this;
        }

        _createClass(ImageAsset, [{
            key: 'load',
            value: function load() {
                this._image.crossOrigin = 'anonymous';
                this._image.src = this._src;
                this.status = _AssetStatus2.default.PROCESSING;
            }
        }, {
            key: '_bindEvents',
            value: function _bindEvents() {
                this._image.addEventListener('load', _ContextHelper2.default.delegate(this._imageLoadHandler, this));
                this._image.addEventListener('error', _ContextHelper2.default.delegate(this._imageErrorHandler, this));
            }
        }, {
            key: '_imageLoadHandler',
            value: function _imageLoadHandler() {
                this.status = _AssetStatus2.default.LOADED;
            }
        }, {
            key: '_imageErrorHandler',
            value: function _imageErrorHandler() {
                this.status = _AssetStatus2.default.FAILURE;
            }
        }, {
            key: 'src',
            get: function get() {
                return this._src;
            },
            set: function set(value) {
                this._src = value;
            }
        }, {
            key: 'image',
            get: function get() {
                return this._image;
            }
        }]);

        return ImageAsset;
    }(_Asset3.default);

    exports.default = ImageAsset;
});