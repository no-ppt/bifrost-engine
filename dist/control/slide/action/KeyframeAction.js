(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'tween', './Action', '../../../config/TweenConfig', '../../../core/logger/LoggerFactory'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('tween'), require('./Action'), require('../../../config/TweenConfig'), require('../../../core/logger/LoggerFactory'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.tween, global.Action, global.TweenConfig, global.LoggerFactory);
        global.KeyframeAction = mod.exports;
    }
})(this, function (exports, _tween, _Action2, _TweenConfig, _LoggerFactory) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _tween2 = _interopRequireDefault(_tween);

    var _Action3 = _interopRequireDefault(_Action2);

    var _TweenConfig2 = _interopRequireDefault(_TweenConfig);

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

    // Get logger.
    var logger = _LoggerFactory2.default.getLogger('KeyframeAction');

    /**
     * Default animation delay.
     * @type {number}
     */
    var DEFAULT_DELAY = 0;

    /**
     * Default animation duration.
     * @type {number}
     */
    var DEFAULT_DURATION = 1000;

    /**
     * Default tween easing function.
     * @type {string}
     */
    var DEFAULT_EASING = 'Sinusoidal.InOut';

    /**
     *
     * @author hermit
     * @version 1.0.0
     */

    var KeyframeAction = function (_Action) {
        _inherits(KeyframeAction, _Action);

        /**
         * Construct keyframe action.
         *
         * @param params Parameters for create the keyframe action.
         */

        function KeyframeAction(params) {
            _classCallCheck(this, KeyframeAction);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(KeyframeAction).call(this, params));

            _this._target = params.target;
            _this._from = params.from || {};
            _this._to = params.to || {};
            _this._delay = params.delay || DEFAULT_DELAY;
            _this._duration = params.duration || DEFAULT_DURATION;
            _this._easing = params.easing || DEFAULT_EASING;
            _this._createEasing();
            return _this;
        }

        /**
         * Execute keyframe forward.
         *
         * @param engine Rendering engine.
         */


        _createClass(KeyframeAction, [{
            key: 'forward',
            value: function forward(engine) {
                this._animate(engine, this._to);
            }
        }, {
            key: 'backward',
            value: function backward(engine) {
                this._animate(engine, this._from);
            }
        }, {
            key: '_createEasing',
            value: function _createEasing() {
                var pair = this._easing.split('\.');
                var equation = pair[0];
                var easing = pair[1];
                this._toEasing(equation, easing);
                this._fromEasing(equation, easing);
            }
        }, {
            key: '_toEasing',
            value: function _toEasing(equation, easing) {
                this._to.easing = _tween2.default.Easing[equation][easing] || _tween2.default.Easing.Sinusoidal.InOut;
            }
        }, {
            key: '_fromEasing',
            value: function _fromEasing(equation, easing) {
                var reverse = void 0;
                switch (easing) {
                    case 'In':
                        reverse = 'Out';
                        break;
                    case 'Out':
                        reverse = 'In';
                        break;
                    case 'InOut':
                        reverse = 'InOut';
                        break;
                    default:
                        reverse = 'InOut';
                }
                this._from.easing = _tween2.default.Easing[equation][reverse] || _tween2.default.Easing.Sinusoidal.InOut;
            }
        }, {
            key: '_animate',
            value: function _animate(engine, object) {

                // Get component.
                var component = engine.get(this._target);

                // Check component.
                if (!component) {
                    logger.warn('[_animate] No such component: [' + this._target + '].');
                    return;
                }

                if (_TweenConfig2.default.enable) {

                    // Define tween list.
                    var tweens = [];

                    // Position tween.
                    if (object.position) {
                        tweens.push(new _tween2.default.Tween(component.position).to(object.position, this._duration).easing(object.easing).delay(this._delay));
                    }

                    // Rotation tween.
                    if (object.rotation) {
                        var rotation = {
                            x: object.rotation.x != null ? object.rotation.x * Math.PI / 180 : component.rotation.x,
                            y: object.rotation.y != null ? object.rotation.y * Math.PI / 180 : component.rotation.y,
                            z: object.rotation.z != null ? object.rotation.z * Math.PI / 180 : component.rotation.z
                        };
                        tweens.push(new _tween2.default.Tween(component.rotation).to(rotation, this._duration).easing(object.easing).delay(this._delay));
                    }

                    // Opacity tween.
                    if (object.opacity != null) {
                        tweens.push(new _tween2.default.Tween({ opacity: component._opacity }).to({ opacity: object.opacity }, this._duration).onUpdate(function () {
                            component.opacity = this.opacity;
                        }).easing(object.easing).delay(this._delay));
                    }

                    // Execute tween.
                    tweens.forEach(function (t) {
                        return t.start();
                    });
                } else {

                    if (object.position) {
                        component.position.x = object.position.x != null ? object.position.x : component.position.x;
                        component.position.y = object.position.y != null ? object.position.y : component.position.y;
                        component.position.z = object.position.z != null ? object.position.z : component.position.z;
                    }

                    if (object.rotation) {
                        component.rotation.x = object.rotation.x != null ? object.rotation.x * Math.PI / 180 : component.rotation.x;
                        component.rotation.y = object.rotation.y != null ? object.rotation.y * Math.PI / 180 : component.rotation.y;
                        component.rotation.z = object.rotation.z != null ? object.rotation.z * Math.PI / 180 : component.rotation.z;
                    }

                    if (object.opacity != null) {
                        component.opacity = object.opacity != null ? object.opacity : component.opacity;
                    }
                }
            }
        }]);

        return KeyframeAction;
    }(_Action3.default);

    exports.default = KeyframeAction;
});