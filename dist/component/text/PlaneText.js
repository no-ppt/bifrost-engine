(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'three', '../Component', '../../core/utils/ContextHelper'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('three'), require('../Component'), require('../../core/utils/ContextHelper'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.three, global.Component, global.ContextHelper);
        global.PlaneText = mod.exports;
    }
})(this, function (exports, _three, _Component2, _ContextHelper) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _three2 = _interopRequireDefault(_three);

    var _Component3 = _interopRequireDefault(_Component2);

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

    var FLEX_VERTICAL_ALIGN_MAPPING = {
        top: 'flex-start',
        center: 'center',
        bottom: 'flex-end'
    };

    var DEFAULT_ALIGN = {
        vertical: 'top'
    };

    /**
     * Default texture offset.
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
     *
     * @author hermit
     * @version 1.0.0
     */

    var PlaneText = function (_Component) {
        _inherits(PlaneText, _Component);

        function PlaneText(params) {
            _classCallCheck(this, PlaneText);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PlaneText).call(this, params));

            // Merge options.
            _this._options.offset = Object.assign({}, DEFAULT_OFFSET, params.offset);
            _this._options.padding = params.padding || 0;
            _this._options.align = Object.assign({}, DEFAULT_ALIGN, params.align);
            _this._options.textureScale = Object.assign({}, DEFAULT_TEXTURE_SCALE);

            // Create mesh.
            _this._textMesh = _this._createMesh();
            _this.add(_this._textMesh);
            return _this;
        }

        _createClass(PlaneText, [{
            key: 'updateOpacity',
            value: function updateOpacity() {
                this._textMesh.material.opacity = this.opacity;
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
                    depthTest: true,
                    side: _three2.default.DoubleSide
                });

                // Set opacity.
                material.opacity = this.opacity;

                return material;
            }
        }, {
            key: '_createTexture',
            value: function _createTexture() {

                // Calculate the MipMap size.
                this._mipmapWidth = this._nearestPowValue(this._options.width);
                this._mipmapHeight = this._nearestPowValue(this._options.height);
                this._options.textureScale.x = this._mipmapWidth / this._options.width;
                this._options.textureScale.y = this._mipmapHeight / this._options.height;

                // Create SVG image.
                var canvas = this._createCanvas();
                var svg = this._createSVG();

                // Create texture.
                var texture = new _three2.default.Texture(canvas, _three2.default.UVMapping, _three2.default.ClampToEdgeWrapping, _three2.default.ClampToEdgeWrapping, _three2.default.LinearFilter, _three2.default.LinearFilter, _three2.default.RGBAFormat, _three2.default.UnsignedByteType, 16);

                // Set texture UV mapping.
                texture.repeat.x = 1 / this._options.textureScale.x;
                texture.repeat.y = 1 / this._options.textureScale.y;
                texture.offset.x = -this._options.offset.x;
                texture.offset.y = 1 - texture.repeat.y + this._options.offset.y;

                // Set polygon offset to ensure z-index.
                texture.polygonOffset = this._options.polygonOffset;
                texture.polygonOffsetFactor = this._options.polygonOffsetFactor;
                texture.polygonOffsetUnits = this._options.polygonOffsetUnits;

                // Draw SVG to canvas.
                this._draw(canvas, svg).then(_ContextHelper2.default.delegate(function (image) {

                    // Update texture min filter.
                    if (this._isMipMap(image)) {
                        texture.minFilter = _three2.default.LinearMipMapLinearFilter;
                    }
                    texture.needsUpdate = true;
                }, this)).catch(function (e) {
                    throw e;
                });

                return texture;
            }
        }, {
            key: '_draw',
            value: function _draw(canvas, svg) {
                return new Promise(_ContextHelper2.default.delegate(function (resolve, reject) {
                    var image = new Image();
                    image.addEventListener('load', function () {

                        // Get context 2d.
                        var context = canvas.getContext('2d');
                        context.drawImage(image, 0, 0);

                        // Resolve promise.
                        resolve(image);
                    });
                    image.addEventListener('error', function (e) {
                        reject(e);
                    });
                    image.src = 'data:image/svg+xml;charset=utf-8,' + svg;
                }, this));
            }
        }, {
            key: '_createCanvas',
            value: function _createCanvas() {
                var canvas = document.createElement('canvas');
                canvas.width = this._mipmapWidth;
                canvas.height = this._mipmapHeight;
                return canvas;
            }
        }, {
            key: '_createSVG',
            value: function _createSVG() {

                // Create DIV & fix '&nbsp;' problem.
                var div = this._createElementDiv();
                var html = div.outerHTML.replace(/&nbsp;/g, '<span style="color: transparent;">,</span>');

                return '<svg xmlns="http://www.w3.org/2000/svg" ' + (' width="' + this._mipmapWidth * window.devicePixelRatio + '" ') + (' height="' + this._mipmapHeight * window.devicePixelRatio + '">') + '<foreignObject width="100%" height="100%">' + ('<div id="foreignObject" xmlns="http://www.w3.org/1999/xhtml">' + html + '</div>') + '</foreignObject>' + '</svg>';
            }
        }, {
            key: '_createElementDiv',
            value: function _createElementDiv() {
                var div = document.createElement('div');
                div.style.display = 'flex';
                div.style.flexFlow = 'wrap';
                div.style.alignContent = FLEX_VERTICAL_ALIGN_MAPPING[this._options.align.vertical];
                div.style.alignItems = FLEX_VERTICAL_ALIGN_MAPPING[this._options.align.vertical];
                div.style.width = this._options.width + 'px';
                div.style.height = this._options.height + 'px';
                div.style.padding = this._options.padding + 'px';
                this._appendText(div);
                return div;
            }
        }, {
            key: '_appendText',
            value: function _appendText(div) {
                this._options.paragraphs.forEach(function (paragraph) {

                    var p = document.createElement('p');
                    p.style.width = '100%';
                    this._fillStyles(p, paragraph);

                    if (!paragraph.characters || paragraph.characters.length === 0) {
                        p.innerHTML = '<span style="color: transparent;">,</span>';
                    }

                    paragraph.characters.forEach(function (character) {
                        var c = document.createElement('span');
                        c.innerHTML = character.content;
                        this._fillStyles(c, character);
                        p.appendChild(c);
                    }, this);

                    div.appendChild(p);
                }, this);
            }
        }, {
            key: '_fillStyles',
            value: function _fillStyles(target, model) {

                target.style.margin = 0;

                if (model.align && model.align.horizontal) {
                    target.style.textAlign = model.align.horizontal;
                }
                if (model.padding) {
                    target.style.padding = model.padding + 'px';
                }
                if (model.color) {
                    target.style.color = model.color;
                }
                if (model.background) {
                    target.style.background = model.background;
                }
                if (model.font) {
                    if (model.font.family) {
                        target.style.fontFamily = model.font.family;
                    }
                    if (model.font.size) {
                        target.style.fontSize = model.font.size + 'px';
                    }
                }
                if (model.bold != null) {
                    target.style.fontWeight = model.bold ? 'bold' : 'normal';
                }
                if (model.italic != null) {
                    target.style.fontStyle = model.italic ? 'italic' : 'normal';
                }
                if (model.underline && model.strikethrough) {
                    target.style.textDecoration = 'underline line-through';
                } else if (model.underline) {
                    target.style.textDecoration = 'underline';
                } else if (model.strikethrough) {
                    target.style.textDecoration = 'line-through';
                }
                if (model.lineHeight != null) {
                    target.style.lineHeight = model.lineHeight + 'em';
                }
                if (model.letterSpacing != null) {
                    target.style.letterSpacing = model.letterSpacing + 'em';
                }
            }
        }, {
            key: '_isMipMap',
            value: function _isMipMap(image) {
                //noinspection JSBitwiseOperatorUsage
                return !(image.width & image.width - 1) && !(image.height & image.height - 1);
            }
        }, {
            key: '_nearestPowValue',
            value: function _nearestPowValue(value) {

                var temp = value;
                var count = 0;
                while (temp > 1) {
                    count++;
                    temp /= 2;
                }
                return Math.pow(2, count);
            }
        }]);

        return PlaneText;
    }(_Component3.default);

    exports.default = PlaneText;
});