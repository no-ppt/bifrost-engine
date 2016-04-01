(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'tween', '../assets/AssetManager', '../core/events/Event', '../core/events/EventTarget', '../core/utils/ContextHelper', '../render/RenderingEngine', '../control/slide/SlideControl', '../component/ComponentFactory'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('tween'), require('../assets/AssetManager'), require('../core/events/Event'), require('../core/events/EventTarget'), require('../core/utils/ContextHelper'), require('../render/RenderingEngine'), require('../control/slide/SlideControl'), require('../component/ComponentFactory'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.tween, global.AssetManager, global.Event, global.EventTarget, global.ContextHelper, global.RenderingEngine, global.SlideControl, global.ComponentFactory);
        global.Player = mod.exports;
    }
})(this, function (exports, _tween, _AssetManager, _Event, _EventTarget2, _ContextHelper, _RenderingEngine, _SlideControl, _ComponentFactory) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _tween2 = _interopRequireDefault(_tween);

    var _AssetManager2 = _interopRequireDefault(_AssetManager);

    var _Event2 = _interopRequireDefault(_Event);

    var _EventTarget3 = _interopRequireDefault(_EventTarget2);

    var _ContextHelper2 = _interopRequireDefault(_ContextHelper);

    var _RenderingEngine2 = _interopRequireDefault(_RenderingEngine);

    var _SlideControl2 = _interopRequireDefault(_SlideControl);

    var _ComponentFactory2 = _interopRequireDefault(_ComponentFactory);

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
     * Define the default player options.
     *
     * @type {object}
     * @property {boolean}  ignore - Ignore errors. Default is false.
     */
    var DEFAULT_OPTIONS = {
        ignore: false
    };

    var Status = {
        WAIT: 'WAIT',
        LOADING: 'LOADING',
        OPENED: 'OPENED',
        PLAYING: 'PLAYING',
        PAUSE: 'PAUSE',
        ERROR: 'ERROR'
    };

    /**
     *
     * @author hermit
     * @version 2.0.0
     * @since 1.0.0
     */

    var Player = function (_EventTarget) {
        _inherits(Player, _EventTarget);

        /**
         * Construct player with specified container and options.
         *
         * @param container Container to append player.
         * @param options   Options for player.
         */

        function Player(container, options) {
            _classCallCheck(this, Player);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Player).call(this));

            // Merge player options.
            _this._options = Object.assign({}, DEFAULT_OPTIONS, options);

            // Declare attributes.
            _this._requestId = 0;
            _this._bpd = null; // Bifrost playable document.
            _this._status = Status.WAIT;

            _this._container = container;
            _this._renderingEngine = _RenderingEngine2.default.instance;
            _this._assetManager = _AssetManager2.default.instance;

            _this._controls = new Map();

            // Propagate events.
            _this.propagateEvent('RendererCreated', _this._renderingEngine);
            _this.propagateEvent('CameraCreated', _this._renderingEngine);
            _this.propagateEvent('SceneCreated', _this._renderingEngine);
            _this.propagateEvent('ComponentAdded', _this._renderingEngine);
            return _this;
        }

        /**
         * Open the specified bifrost playable document.
         *
         * @param bpd   Bifrost playable document for play.
         */


        _createClass(Player, [{
            key: 'open',
            value: function open(bpd) {

                // Stop first if player is running.
                if (this._status != Status.WAIT) {
                    this.stop();
                }

                // Keep the bpd.
                this._bpd = bpd;

                // Update player status.
                this._status = Status.LOADING;

                // Open document.
                this._loadAssets(bpd.assets).then(_ContextHelper2.default.delegate(this._initRenderingEngine, this)).then(_ContextHelper2.default.delegate(this._loadComponents, this)).then(_ContextHelper2.default.delegate(this._loadControl, this)).then(_ContextHelper2.default.delegate(function () {
                    this._status = Status.OPENED;
                    this.dispatchEvent(new _Event2.default({
                        type: 'BPDOpenSuccess',
                        target: this,
                        arguments: []
                    }, this));
                }, this)).catch(_ContextHelper2.default.delegate(function (e) {

                    // Update player status.
                    this._status = Status.ERROR;

                    // Dispatch events.
                    this.dispatchEvent(new _Event2.default({
                        type: 'BPDOpenFailure',
                        target: this,
                        arguments: [e]
                    }, this));
                }, this));
            }
        }, {
            key: 'play',
            value: function play() {

                function render(delta) {
                    _tween2.default.update(delta);
                    this._renderingEngine.render();
                    this._requestId = requestAnimationFrame(_ContextHelper2.default.delegate(render, this));
                }

                if (this._status === Status.OPENED || this._status === Status.PAUSE) {

                    // Update player status.
                    this._status = Status.PLAYING;

                    // Enable controls.
                    this._controls.forEach(function (control) {
                        return control.enable();
                    });

                    // Render
                    this._requestId = requestAnimationFrame(_ContextHelper2.default.delegate(render, this));
                }
            }
        }, {
            key: 'pause',
            value: function pause() {

                if (this._status === Status.PLAYING) {

                    // Update player status.
                    this._status = Status.PAUSE;

                    // Disable controls.
                    this._controls.forEach(function (control) {
                        return control.disable();
                    });

                    // Stop render.
                    cancelAnimationFrame(this._requestId);
                }
            }
        }, {
            key: 'stop',
            value: function stop() {

                if (this._status === Status.PLAYING || this._status === Status.PAUSE || this._status === Status.ERROR) {

                    // Update status.
                    this._status = Status.WAIT;

                    // Stop rendering loop.
                    cancelAnimationFrame(this._requestId);

                    // Unregister controls.
                    this._controls.clear();

                    // Reset asset manager.
                    this._assetManager.clear();

                    // Destroy rendering engine.
                    this._renderingEngine.destroy();
                }
            }
        }, {
            key: 'registerControl',
            value: function registerControl(control) {
                control.register(this);
                this._controls.set(control.constructor.name, control);
            }
        }, {
            key: 'getControl',
            value: function getControl(type) {
                return this._controls.get(type);
            }
        }, {
            key: 'resize',
            value: function resize(width, height) {
                this._renderingEngine.resize(width, height);
            }
        }, {
            key: 'snapshot',
            value: function snapshot() {
                return this._renderingEngine.snapshot();
            }
        }, {
            key: 'snapshotUrl',
            value: function snapshotUrl() {
                return this._renderingEngine.snapshotUrl();
            }
        }, {
            key: '_loadAssets',
            value: function _loadAssets(assets) {
                return new Promise(_ContextHelper2.default.delegate(function (resolve, reject) {

                    var totalCount = assets.length;
                    var successCount = 0;
                    var failureCount = 0;

                    // Bind asset load events.
                    this._assetManager.addEventListener('AssetLoadSuccess', _ContextHelper2.default.delegate(function (event, asset) {

                        // Increase loaded assets count.
                        ++successCount;

                        // Dispatch progressing event.
                        this.dispatchEvent(new _Event2.default({
                            type: 'AssetLoadSuccess',
                            target: this,
                            arguments: [asset, {
                                total: totalCount,
                                success: successCount,
                                failure: failureCount
                            }]
                        }));

                        // Resolve promise when all assets are loaded.
                        if (successCount + failureCount >= totalCount) {
                            if (this._options.ignore) {
                                resolve();
                            } else {
                                reject('Asset Load Failure.');
                            }
                        }
                    }, this));
                    this._assetManager.addEventListener('AssetLoadFailure', _ContextHelper2.default.delegate(function (event, asset) {

                        // Increase failure assets count.
                        ++failureCount;

                        // Dispatch failure event.
                        this.dispatchEvent(new _Event2.default({
                            type: 'AssetLoadFailure',
                            target: this,
                            arguments: [asset, {
                                total: totalCount,
                                success: successCount,
                                failure: failureCount
                            }]
                        }));

                        // Resolve promise when all assets are loaded.
                        if (successCount + failureCount >= totalCount) {
                            if (this._options.ignore) {
                                resolve();
                            } else {
                                reject('Asset Load Failure.');
                            }
                        }
                    }, this));

                    // Add assets.
                    this._assetManager.add(assets);
                }, this));
            }
        }, {
            key: '_initRenderingEngine',
            value: function _initRenderingEngine() {

                // Initialize rendering engine.
                this._renderingEngine.initialize(this._container, {
                    renderer: {
                        clearColor: this._bpd.clearColor
                    },
                    camera: this._bpd.camera
                });

                // Dispatch event.
                this.dispatchEvent(new _Event2.default({
                    type: 'RenderingEngineLoaded',
                    target: this,
                    arguments: []
                }));
            }
        }, {
            key: '_loadComponents',
            value: function _loadComponents() {

                function create(params) {

                    // Construct component.
                    var component = _ComponentFactory2.default.create(params);

                    // Append children.
                    if (params.children) {
                        var children = params.children.map(create, this);
                        children.forEach(function (child) {
                            return component.add(child);
                        });
                    }

                    // Add component to rendering engine.
                    this._renderingEngine.addComponent(component);

                    return component;
                }

                // Create component.
                this._bpd.scene.children.forEach(create, this);

                // Dispatch event.
                this.dispatchEvent(new _Event2.default({
                    type: 'ComponentLoaded',
                    target: this,
                    arguments: []
                }));
            }
        }, {
            key: '_loadControl',
            value: function _loadControl() {

                this._bpd.controls.forEach(function (data) {

                    if (data.class === 'SlideControl') {

                        // Create slide control.
                        var control = new _SlideControl2.default(data.options);
                        control.load(data);
                        this.registerControl(control);
                        control.execCommand(0);
                    } else {
                        console.log('Not supported yet.');
                    }
                }, this);
            }
        }, {
            key: 'renderingEngine',
            get: function get() {
                return this._renderingEngine;
            }
        }]);

        return Player;
    }(_EventTarget3.default);

    exports.default = Player;
});