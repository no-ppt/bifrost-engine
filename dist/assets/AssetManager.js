(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './Asset', './AssetStatus', './AssetFactory', '../core/events/Event', '../core/events/EventTarget', '../core/utils/ContextHelper'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./Asset'), require('./AssetStatus'), require('./AssetFactory'), require('../core/events/Event'), require('../core/events/EventTarget'), require('../core/utils/ContextHelper'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Asset, global.AssetStatus, global.AssetFactory, global.Event, global.EventTarget, global.ContextHelper);
        global.AssetManager = mod.exports;
    }
})(this, function (exports, _Asset, _AssetStatus, _AssetFactory, _Event, _EventTarget2, _ContextHelper) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Asset2 = _interopRequireDefault(_Asset);

    var _AssetStatus2 = _interopRequireDefault(_AssetStatus);

    var _AssetFactory2 = _interopRequireDefault(_AssetFactory);

    var _Event2 = _interopRequireDefault(_Event);

    var _EventTarget3 = _interopRequireDefault(_EventTarget2);

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

    // Define the singleton and the enforcer.
    var singleton = Symbol();
    var singletonEnforcer = Symbol();

    /**
     *
     * @author hermit
     * @version 1.0.0
     */

    var AssetManager = function (_EventTarget) {
        _inherits(AssetManager, _EventTarget);

        /**
         * Private constructor for create singleton.
         * Use 'AssetManager.instance' to get the singleton instance.
         */

        function AssetManager(enforcer) {
            _classCallCheck(this, AssetManager);

            if (enforcer != singletonEnforcer) {
                var msg = '[constructor] Cannot instantiate singleton with constructor.';
                throw new Error(msg);
            }

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AssetManager).call(this));

            // Define the asset map.
            _this._assets = new Map();
            return _this;
        }

        /**
         * Get the singleton.
         * @returns { AssetManager } the singleton.
         */


        _createClass(AssetManager, [{
            key: 'add',
            value: function add(asset) {
                if (asset instanceof _Asset2.default) {
                    this._assets.set(asset.id, asset);
                } else if (asset instanceof Array) {
                    asset.forEach(this.add, this);
                } else {
                    this.add(this.load(asset));
                }
            }
        }, {
            key: 'load',
            value: function load(data) {

                // Return directly.
                if (data instanceof _Asset2.default) {
                    return data;
                }

                // Return mapped array.
                if (data instanceof Array) {
                    return data.map(this.load, this);
                }

                // TODO: Refactor 'type' to 'class'
                var asset = _AssetFactory2.default.create(data);
                asset.addEventListener('StatusChange', _ContextHelper2.default.delegate(this._assetStatusChangeHandler, this));
                asset.load();
                return asset;
            }
        }, {
            key: 'get',
            value: function get(id) {
                return this._assets.get(id);
            }
        }, {
            key: 'remove',
            value: function remove(asset) {

                // Get asset by id.
                if (typeof asset === 'string') {
                    asset = this._assets.get(asset);
                }

                // Remove event listener.
                asset.removeEventListener(this._assetStatusChangeHandler);
            }
        }, {
            key: 'clear',
            value: function clear() {

                // Release assets.
                this._assets.clear();
            }
        }, {
            key: '_assetStatusChangeHandler',
            value: function _assetStatusChangeHandler(event, change) {

                // Asset has been loaded successfully.
                if (change.after === _AssetStatus2.default.LOADED) {
                    this.dispatchEvent(new _Event2.default({
                        type: 'AssetLoadSuccess',
                        target: this,
                        arguments: [event.target]
                    }));
                }

                // Asset cannot be loaded.
                if (change.after === _AssetStatus2.default.FAILURE) {
                    this.dispatchEvent(new _Event2.default({
                        type: 'AssetLoadFailure',
                        target: this,
                        arguments: [event.target]
                    }));
                }
            }
        }], [{
            key: 'instance',
            get: function get() {
                if (!this[singleton]) {
                    this[singleton] = new AssetManager(singletonEnforcer);
                }
                return this[singleton];
            }
        }]);

        return AssetManager;
    }(_EventTarget3.default);

    exports.default = AssetManager;
});