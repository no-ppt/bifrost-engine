(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../command/ContentCommand', '../command/ElementCommand', '../command/HelperCommand', '../command/TopicCommand'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../command/ContentCommand'), require('../command/ElementCommand'), require('../command/HelperCommand'), require('../command/TopicCommand'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.ContentCommand, global.ElementCommand, global.HelperCommand, global.TopicCommand);
        global.CommandFactory = mod.exports;
    }
})(this, function (exports, _ContentCommand, _ElementCommand, _HelperCommand, _TopicCommand) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _ContentCommand2 = _interopRequireDefault(_ContentCommand);

    var _ElementCommand2 = _interopRequireDefault(_ElementCommand);

    var _HelperCommand2 = _interopRequireDefault(_HelperCommand);

    var _TopicCommand2 = _interopRequireDefault(_TopicCommand);

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

    var CommandFactory = function () {
        function CommandFactory() {
            _classCallCheck(this, CommandFactory);
        }

        _createClass(CommandFactory, null, [{
            key: 'create',
            value: function create(params) {
                switch (params.class) {
                    case 'TopicCommand':
                        return new _TopicCommand2.default(params);
                    case 'ContentCommand':
                        return new _ContentCommand2.default(params);
                    case 'ElementCommand':
                        return new _ElementCommand2.default(params);
                    case 'HelperCommand':
                        return new _HelperCommand2.default(params);
                    default:
                    // TODO:
                }
                return null;
            }
        }]);

        return CommandFactory;
    }();

    exports.default = CommandFactory;
});