(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './AssetStatus', '../core/events/Event', '../core/events/EventTarget', '../core/utils/ClassUtils', '../core/utils/UUID'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./AssetStatus'), require('../core/events/Event'), require('../core/events/EventTarget'), require('../core/utils/ClassUtils'), require('../core/utils/UUID'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.AssetStatus, global.Event, global.EventTarget, global.ClassUtils, global.UUID);
        global.Asset = mod.exports;
    }
})(this, function (exports, _AssetStatus, _Event, _EventTarget2, _ClassUtils, _UUID) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _AssetStatus2 = _interopRequireDefault(_AssetStatus);

    var _Event2 = _interopRequireDefault(_Event);

    var _EventTarget3 = _interopRequireDefault(_EventTarget2);

    var _ClassUtils2 = _interopRequireDefault(_ClassUtils);

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

    var Asset = function (_EventTarget) {
        _inherits(Asset, _EventTarget);

        function Asset() {
            var id = arguments.length <= 0 || arguments[0] === undefined ? _UUID2.default.generate() : arguments[0];

            _classCallCheck(this, Asset);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Asset).call(this));

            // Define attributes.
            _this._id = id;
            _this._status = _AssetStatus2.default.PENDING;
            return _this;
        }

        _createClass(Asset, [{
            key: 'id',
            get: function get() {
                return this._id;
            }
        }, {
            key: 'status',
            set: function set(value) {
                var before = this._status;
                this._status = value;
                this.dispatchEvent(new _Event2.default({
                    type: 'StatusChange',
                    target: this,
                    arguments: [{
                        before: before,
                        after: this._status
                    }]
                }));
            },
            get: function get() {
                return this._status;
            }
        }]);

        return Asset;
    }(_EventTarget3.default);

    exports.default = Asset;
});