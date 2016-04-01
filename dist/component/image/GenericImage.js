(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'three', '../Component', '../../assets/AssetManager', '../../assets/AssetStatus', '../../core/utils/ContextHelper'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('three'), require('../Component'), require('../../assets/AssetManager'), require('../../assets/AssetStatus'), require('../../core/utils/ContextHelper'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.three, global.Component, global.AssetManager, global.AssetStatus, global.ContextHelper);
        global.GenericImage = mod.exports;
    }
})(this, function (exports, _three, _Component2, _AssetManager, _AssetStatus, _ContextHelper) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _three2 = _interopRequireDefault(_three);

    var _Component3 = _interopRequireDefault(_Component2);

    var _AssetManager2 = _interopRequireDefault(_AssetManager);

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

    /**
     * Default image offset.
     *
     * @type {{x: number, y: number}}
     */
    var DEFAULT_OFFSET = {
        x: 0,
        y: 0
    };

    var DEFAULT_TEXTURE_SCALE = {
        x: 1,
        y: 1
    };

    /**
     * Generic image for display pixel image.
     *
     * @author hermit
     * @version 2.0.0
     * @since 1.0.0
     */

    var GenericImage = function (_Component) {
        _inherits(GenericImage, _Component);

        /**
         * Create image component with specified parameters.
         *
         * @param params image component info.
         */

        function GenericImage(params) {
            _classCallCheck(this, GenericImage);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GenericImage).call(this, params));

            // Merge options.
            _this._options.offset = Object.assign({}, DEFAULT_OFFSET, params.offset);
            _this._options.textureScale = Object.assign({}, DEFAULT_TEXTURE_SCALE, params.imageScale);

            // Create mesh.
            _this._imageMesh = _this._createMesh();
            _this.add(_this._imageMesh);
            return _this;
        }

        _createClass(GenericImage, [{
            key: 'updateOpacity',
            value: function updateOpacity() {
                this._imageMesh.material.opacity = this.opacity;
            }
        }, {
            key: '_createMesh',
            value: function _createMesh() {
                return new _three2.default.Mesh(this._createGeometry(), this._createMaterial());
            }
        }, {
            key: '_createGeometry',
            value: function _createGeometry() {
                return new _three2.default.PlaneBufferGeometry(this._options.width, this._options.height);
            }
        }, {
            key: '_createMaterial',
            value: function _createMaterial() {

                var texture = this._createTexture();

                // Create material.
                var material = new _three2.default.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    alphaTest: 0.01,
                    depthTest: false,
                    side: _three2.default.DoubleSide
                });

                // Set opacity.
                material.opacity = this.opacity;

                return material;
            }
        }, {
            key: '_createTexture',
            value: function _createTexture() {

                // Get asset from asset manager.
                var asset = this._getAsset();

                // Create texture.
                var texture = new _three2.default.Texture(asset.image, _three2.default.UVMapping, _three2.default.ClampToEdgeWrapping, _three2.default.ClampToEdgeWrapping, _three2.default.LinearFilter, _three2.default.LinearFilter, _three2.default.RGBAFormat, _three2.default.UnsignedByteType, 16);

                // Set texture UV mapping.
                texture.repeat.x = 1 / this._options.textureScale.x;
                texture.repeat.y = 1 / this._options.textureScale.y;
                texture.offset.x = -this._options.offset.x;
                texture.offset.y = 1 - texture.repeat.y + this._options.offset.y;

                texture.polygonOffset = this._options.polygonOffset;
                texture.polygonOffsetFactor = this._options.polygonOffsetFactor;
                texture.polygonOffsetUnits = this._options.polygonOffsetUnits;

                // Bind asset event.
                asset.addEventListener('StatusChange', _ContextHelper2.default.delegate(function (event, change) {
                    if (change.after === _AssetStatus2.default.LOADED) {

                        // Update texture min filter.
                        if (this._isMipMap(asset.image)) {
                            texture.minFilter = _three2.default.LinearMipMapLinearFilter;
                        }
                        texture.needsUpdate = true;
                    }
                }, this));

                // Update texture min filter.
                if (this._isMipMap(asset.image)) {
                    texture.minFilter = _three2.default.LinearMipMapLinearFilter;
                }
                texture.needsUpdate = true;

                return texture;
            }
        }, {
            key: '_isMipMap',
            value: function _isMipMap(image) {
                //noinspection JSBitwiseOperatorUsage
                return !(image.width & image.width - 1) && !(image.height & image.height - 1);
            }
        }, {
            key: '_getAsset',
            value: function _getAsset() {

                var asset = void 0;
                if (this._options.src.substr(0, 4) === 'ref:') {

                    // Get image asset from asset manager.
                    var id = this._options.src.substr(4);
                    asset = _AssetManager2.default.instance.get(id);
                } else {

                    // TODO: Test
                    asset = _AssetManager2.default.load({
                        type: 'ImageAsset',
                        src: this._options.src
                    });
                    _AssetManager2.default.add(asset);
                }
                return asset;
            }
        }]);

        return GenericImage;
    }(_Component3.default);

    exports.default = GenericImage;
});