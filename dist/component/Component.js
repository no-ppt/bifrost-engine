(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'three', '../core/utils/UUID'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('three'), require('../core/utils/UUID'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.three, global.UUID);
        global.Component = mod.exports;
    }
})(this, function (exports, _three, _UUID) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _three2 = _interopRequireDefault(_three);

    var _UUID2 = _interopRequireDefault(_UUID);

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

    var _get = function get(object, property, receiver) {
        if (object === null) object = Function.prototype;
        var desc = Object.getOwnPropertyDescriptor(object, property);

        if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);

            if (parent === null) {
                return undefined;
            } else {
                return get(parent, property, receiver);
            }
        } else if ("value" in desc) {
            return desc.value;
        } else {
            var getter = desc.get;

            if (getter === undefined) {
                return undefined;
            }

            return getter.call(receiver);
        }
    };

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
        id: _UUID2.default.generate(),
        opacity: 1,
        position: {
            x: 0,
            y: 0,
            z: 0
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: {
            x: 1,
            y: 1,
            z: 1
        }
    };

    /**
     *
     * @author hermit
     * @version 1.0.0
     */

    var Component = function (_THREE$Object3D) {
        _inherits(Component, _THREE$Object3D);

        function Component(params) {
            _classCallCheck(this, Component);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Component).call(this));

            // Merge options.
            _this._options = Object.assign({}, DEFAULT_OPTIONS, params);
            _this._options.position = Object.assign({}, DEFAULT_OPTIONS.position, params.position);
            _this._options.rotation = Object.assign({}, DEFAULT_OPTIONS.rotation, params.rotation);
            _this._options.scale = Object.assign({}, DEFAULT_OPTIONS.scale, params.scale);

            // Save the component id. NOTICE: Three.js id field is readonly.
            _this.name = _this._options.id;

            // Set opacity.
            _this._opacity = _this._options.opacity;

            // Set position and rotation.
            _this.position.x = _this._options.position.x;
            _this.position.y = _this._options.position.y;
            _this.position.z = _this._options.position.z;
            _this.rotation.x = _this._options.rotation.x * Math.PI / 180;
            _this.rotation.y = _this._options.rotation.y * Math.PI / 180;
            _this.rotation.z = _this._options.rotation.z * Math.PI / 180;

            // Set scale.
            _this.scale.x = _this._options.scale.x;
            _this.scale.y = _this._options.scale.y;
            _this.scale.z = _this._options.scale.z;
            return _this;
        }

        _createClass(Component, [{
            key: 'updateOpacity',
            value: function updateOpacity() {
                if (this.children) {
                    this.children.forEach(function (child) {
                        if (child instanceof Component) {
                            child.updateOpacity();
                        }
                    });
                }
            }
        }, {
            key: 'add',
            value: function add(child) {
                _get(Object.getPrototypeOf(Component.prototype), 'add', this).call(this, child);

                // Update opacity if instanceof component.
                if (child instanceof Component) {
                    child.updateOpacity();
                }
            }
        }, {
            key: 'opacity',
            get: function get() {
                if (this.parent && this.parent instanceof Component) {
                    return this._opacity * this.parent.opacity;
                }
                return this._opacity;
            },
            set: function set(value) {
                this._opacity = value;

                // Update opacity if has children.
                this.updateOpacity();
            }
        }]);

        return Component;
    }(_three2.default.Object3D);

    exports.default = Component;
});