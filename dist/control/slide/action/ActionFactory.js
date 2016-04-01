(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './KeyframeAction'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./KeyframeAction'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.KeyframeAction);
        global.ActionFactory = mod.exports;
    }
})(this, function (exports, _KeyframeAction) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _KeyframeAction2 = _interopRequireDefault(_KeyframeAction);

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

    var ActionFactory = function () {
        function ActionFactory() {
            _classCallCheck(this, ActionFactory);
        }

        _createClass(ActionFactory, null, [{
            key: 'create',
            value: function create(options) {
                switch (options.class) {
                    case 'KeyframeAction':
                        return new _KeyframeAction2.default(options);
                    default:
                    // TODO:
                }
            }
        }]);

        return ActionFactory;
    }();

    exports.default = ActionFactory;
});