(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'three', '../core/events/Event', '../core/events/EventTarget', '../core/logger/LoggerFactory', '../component/ComponentFactory', '../component/Component'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('three'), require('../core/events/Event'), require('../core/events/EventTarget'), require('../core/logger/LoggerFactory'), require('../component/ComponentFactory'), require('../component/Component'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.three, global.Event, global.EventTarget, global.LoggerFactory, global.ComponentFactory, global.Component);
        global.RenderingEngine = mod.exports;
    }
})(this, function (exports, _three, _Event, _EventTarget2, _LoggerFactory, _ComponentFactory, _Component) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _three2 = _interopRequireDefault(_three);

    var _Event2 = _interopRequireDefault(_Event);

    var _EventTarget3 = _interopRequireDefault(_EventTarget2);

    var _LoggerFactory2 = _interopRequireDefault(_LoggerFactory);

    var _ComponentFactory2 = _interopRequireDefault(_ComponentFactory);

    var _Component2 = _interopRequireDefault(_Component);

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

    // get logger.
    var logger = _LoggerFactory2.default.getLogger('RenderingEngine');

    /**
     * Default renderer options.
     *
     * @type {object}
     * @property {string}   precision   - The shader precision. Should be "highp", "mediump" or "lowp".
     * @property {boolean}  alpha
     * @property {boolean}  premultipliedAlpha - Enable premultiplied alpha. Default is false.
     * @property {boolean}  stencil     - Enable stencil buffer. Default is false.
     * @property {boolean}  antialias   - Enable antialias. Default is true.
     * @property {boolean}  preserveDrawingBuffer - Preserve the drawing buffer. Default is true.
     * @property {boolean}  depth       - Enable depth buffer. Default is true.
     * @property {boolean}  logarithmicDepthBuffer - Enable logarithmic depth buffer. Default is true.
     * @property {number}   clearColor  - Renderer clear color. Default is black.
     */
    var DEFAULT_RENDERER_OPTIONS = {
        precision: 'mediump',
        alpha: false,
        premultipliedAlpha: false,
        antialias: true,
        stencil: false,
        preserveDrawingBuffer: true,
        depth: true,
        logarithmicDepthBuffer: true,
        clearColor: 0x000000
    };

    /**
     * Default perspective camera options.
     *
     * @type {object}
     * @property {string}   type    - Camera type. Should be "PerspectiveCamera" or
     *                                "OrthographicCamera"(Unsupported).
     * @property {number}   fov     - Perspective camera frustum vertical field of view.
     * @property {number}   aspect  - Perspective camera frustum aspect ratio.
     * @property {number}   near    - Perspective camera near plane.
     * @property {number}   far     - Perspective camera far plane.
     * @property {object}   position    - Camera position.
     * @property {number}   position.x  - X component.
     * @property {number}   position.y  - Y component.
     * @property {number}   position.z  - Z component.
     * @property {object}   rotation    - Camera rotation.
     * @property {number}   rotation.x  - X component.
     * @property {number}   rotation.y  - Y component.
     * @property {number}   rotation.z  - Z component.
     */
    var DEFAULT_CAMERA_OPTIONS = {
        type: 'PerspectiveCamera',
        fov: 45,
        aspect: 16 / 9,
        near: 1,
        far: 1000000,
        position: {
            x: 0,
            y: 0,
            z: 0
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        }
    };

    /**
     * Default scene options.
     * @type {object}
     */
    var DEFAULT_SCENE_OPTIONS = {};

    /**
     * Default rendering engine options.
     *
     * @type {object}
     * @property {object}   renderer
     */
    var DEFAULT_OPTIONS = {
        renderer: DEFAULT_RENDERER_OPTIONS,
        camera: DEFAULT_CAMERA_OPTIONS,
        scene: DEFAULT_SCENE_OPTIONS
    };

    // Define the singleton and the enforcer.
    var singleton = Symbol();
    var singletonEnforcer = Symbol();

    /**
     *
     * @author hermit
     * @version 1.0.0
     */

    var RenderingEngine = function (_EventTarget) {
        _inherits(RenderingEngine, _EventTarget);

        /**
         * Private constructor for create singleton.
         * Use 'RenderingEngine.instance' to get the singleton instance.
         */

        function RenderingEngine(enforcer) {
            _classCallCheck(this, RenderingEngine);

            if (enforcer != singletonEnforcer) {
                var msg = '[constructor] Cannot instantiate singleton with constructor.';
                throw new Error(msg);
            }

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RenderingEngine).call(this));

            // Declare attributes.
            _this._container = null;
            _this._renderer = null;
            _this._camera = null;
            _this._scene = null;
            _this._components = new Map();
            return _this;
        }

        /**
         * Get the singleton.
         * @returns { RenderingEngine } the singleton.
         */


        _createClass(RenderingEngine, [{
            key: 'initialize',
            value: function initialize(container) {
                var options = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_OPTIONS : arguments[1];


                // Validate container.
                if (!container) {
                    var msg = '[initialize] Please specify the container.';
                    logger.error(msg, container);
                    throw new Error(msg);
                }

                // keep container.
                this._container = container;

                // Create renderer, camera and scene.
                this._createRenderer(options.renderer);
                this._createCamera(options.camera);
                this._createScene(options.scene);
            }
        }, {
            key: 'addComponent',
            value: function addComponent(data) {

                if (data instanceof Array) {
                    data.forEach(this.addComponent, this);
                    return;
                }

                // Get component object.
                var component = data instanceof _Component2.default ? data : _ComponentFactory2.default.create(data);

                // Add component to map and graphics to the scene.
                this._components.set(component.name, component);
                this._scene.add(component);

                // Dispatch events.
                this.dispatchEvent(new _Event2.default({
                    type: 'ComponentAdded',
                    target: this,
                    arguments: [component]
                }));
            }
        }, {
            key: 'get',
            value: function get(id) {
                if (id === 'camera') {
                    return this._camera;
                }
                if (id === 'scene') {
                    return this._scene;
                }
                return this._components.get(id);
            }
        }, {
            key: 'render',
            value: function render() {
                this._renderer.render(this._scene, this._camera);
            }
        }, {
            key: 'resize',
            value: function resize(width, height) {
                this._renderer.setSize(width, height);
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this._camera = null;
                this._scene = null;
            }
        }, {
            key: 'snapshot',
            value: function snapshot() {
                var image = new Image();
                image.src = this.domElement.toDataURL();
                return image;
            }
        }, {
            key: 'snapshotUrl',
            value: function snapshotUrl() {
                return this.domElement.toDataURL();
            }
        }, {
            key: '_createRenderer',
            value: function _createRenderer(options) {

                // Merge renderer options.
                options = Object.assign({}, DEFAULT_RENDERER_OPTIONS, options);

                // Create renderer.
                if (!this._renderer) {
                    this._renderer = new _three2.default.WebGLRenderer({
                        precision: options.precision,
                        alpha: options.alpha,
                        premultipliedAlpha: options.premultipliedAlpha,
                        antialias: options.antialias,
                        stencil: options.stencil,
                        preserveDrawingBuffer: options.preserveDrawingBuffer,
                        depth: options.depth,
                        logarithmicDepthBuffer: options.logarithmicDepthBuffer
                    });
                }
                this._renderer.setClearColor(parseInt(options.clearColor));
                this._container.appendChild(this._renderer.domElement);
                this._renderer.setSize(this._container.offsetWidth, this._container.offsetHeight);

                // Dispatch events.
                this.dispatchEvent(new _Event2.default({
                    type: 'RendererCreated',
                    target: this,
                    arguments: [this._renderer]
                }));
            }
        }, {
            key: '_createCamera',
            value: function _createCamera(options) {

                // Merge camera options.
                options = Object.assign({}, DEFAULT_CAMERA_OPTIONS, options);

                // Create camera.
                this._camera = new _three2.default.PerspectiveCamera(options.fov, options.aspect, options.near, options.far);

                this._camera.position.x = options.position.x || 0;
                this._camera.position.y = options.position.y || 0;
                this._camera.position.z = options.position.z || 0;
                this._camera.rotation.x = options.rotation.x || 0;
                this._camera.rotation.y = options.rotation.y || 0;
                this._camera.rotation.z = options.rotation.z || 0;

                // Dispatch events.
                this.dispatchEvent(new _Event2.default({
                    type: 'CameraCreated',
                    target: this,
                    arguments: [this._camera]
                }));
            }
        }, {
            key: '_createScene',
            value: function _createScene(options) {

                // Merge scene options.
                options = Object.assign({}, DEFAULT_SCENE_OPTIONS, options);

                // Create scene.
                this._scene = new _three2.default.Scene();

                // Dispatch events.
                this.dispatchEvent(new _Event2.default({
                    type: 'SceneCreated',
                    target: this,
                    arguments: [this._scene]
                }));
            }
        }, {
            key: 'domElement',
            get: function get() {
                return this._renderer.domElement;
            }
        }], [{
            key: 'instance',
            get: function get() {
                if (!this[singleton]) {
                    this[singleton] = new RenderingEngine(singletonEnforcer);
                }
                return this[singleton];
            }
        }]);

        return RenderingEngine;
    }(_EventTarget3.default);

    exports.default = RenderingEngine;
});