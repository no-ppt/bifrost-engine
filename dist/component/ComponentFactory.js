(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './Component', './container/Container', './image/GenericImage', './text/PlaneText'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./Component'), require('./container/Container'), require('./image/GenericImage'), require('./text/PlaneText'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Component, global.Container, global.GenericImage, global.PlaneText);
        global.ComponentFactory = mod.exports;
    }
})(this, function (exports, _Component, _Container, _GenericImage, _PlaneText) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Component2 = _interopRequireDefault(_Component);

    var _Container2 = _interopRequireDefault(_Container);

    var _GenericImage2 = _interopRequireDefault(_GenericImage);

    var _PlaneText2 = _interopRequireDefault(_PlaneText);

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

    var ComponentFactory = function () {
        function ComponentFactory() {
            _classCallCheck(this, ComponentFactory);
        }

        _createClass(ComponentFactory, null, [{
            key: 'create',
            value: function create(params) {

                if (params instanceof Array) {
                    return params.map(ComponentFactory.create);
                }

                if (params instanceof _Component2.default) {
                    return params;
                }

                switch (params.class) {
                    case 'Container':
                        return new _Container2.default(params);
                    case 'GenericImage':
                        return new _GenericImage2.default(params);
                    case 'PlaneText':
                        return new _PlaneText2.default(params);
                    default:
                    // TODO: Logger
                }

                return null;
            }
        }]);

        return ComponentFactory;
    }();

    exports.default = ComponentFactory;
});