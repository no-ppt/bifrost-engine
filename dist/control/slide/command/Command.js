(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../../../core/utils/UUID', '../action/ActionFactory'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../../../core/utils/UUID'), require('../action/ActionFactory'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.UUID, global.ActionFactory);
        global.Command = mod.exports;
    }
})(this, function (exports, _UUID, _ActionFactory) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _UUID2 = _interopRequireDefault(_UUID);

    var _ActionFactory2 = _interopRequireDefault(_ActionFactory);

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

    var DEFAULT_OPTIONS = {
        id: _UUID2.default.generate(),
        actions: []
    };

    /**
     *
     * @author hermit
     * @version 1.0.0
     */

    var Command = function () {
        function Command(params) {
            _classCallCheck(this, Command);

            // Merge options.
            this._options = Object.assign({}, DEFAULT_OPTIONS, params);

            // Define attributes.
            this._id = this._options.id;
            this._parent = null;
            this._children = [];
            this._actions = [];

            // Create actions.
            this._options.actions.forEach(function (args) {
                this._actions.push(_ActionFactory2.default.create(args));
            }, this);
        }

        _createClass(Command, [{
            key: 'add',
            value: function add(command) {
                if (command instanceof Array) {
                    command.forEach(this.add, this);
                } else {
                    this._children.push(command);
                }
            }
        }, {
            key: 'forward',
            value: function forward(engine) {
                this._actions.forEach(function (action) {
                    return action.forward(engine);
                });
            }
        }, {
            key: 'backward',
            value: function backward(engine) {
                this._actions.forEach(function (action) {
                    return action.backward(engine);
                });
            }
        }, {
            key: 'id',
            get: function get() {
                return this._id;
            }
        }, {
            key: 'parent',
            get: function get() {
                return this._parent;
            }
        }, {
            key: 'children',
            get: function get() {
                return this._children;
            }
        }]);

        return Command;
    }();

    exports.default = Command;
});