(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../Controls', './command/CommandFactory', './command/HelperCommand', './command/TopicCommand'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../Controls'), require('./command/CommandFactory'), require('./command/HelperCommand'), require('./command/TopicCommand'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Controls, global.CommandFactory, global.HelperCommand, global.TopicCommand);
        global.SlideControl = mod.exports;
    }
})(this, function (exports, _Controls2, _CommandFactory, _HelperCommand, _TopicCommand) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Controls3 = _interopRequireDefault(_Controls2);

    var _CommandFactory2 = _interopRequireDefault(_CommandFactory);

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

    var SlideControl = function (_Controls) {
        _inherits(SlideControl, _Controls);

        function SlideControl() {
            _classCallCheck(this, SlideControl);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SlideControl).call(this));

            // Define attributes.
            _this._index = -1;
            _this._commandTree = null;
            _this._commands = [];
            return _this;
        }

        _createClass(SlideControl, [{
            key: 'load',
            value: function load(data) {
                this._commandTree = this._buildCommandTree(data);
                this._commands = this._buildCommandQueue();
            }
        }, {
            key: 'execCommand',
            value: function execCommand(index) {

                if (!this._enable) {
                    return;
                }

                // Forward.
                if (index > this._index) {

                    var commands = this._commands.slice(this._index + 1, index + 1);
                    commands.forEach(function (array) {
                        var _this2 = this;

                        array.forEach(function (command) {
                            return command.forward(_this2._player.renderingEngine);
                        });
                    }, this);
                }

                // Backward.
                if (index < this._index) {

                    var _commands = this._commands.slice(index + 1, this._index + 1);
                    _commands.reverse();
                    _commands.forEach(function (array) {

                        // Topic commands || helper commands.
                        if (array.length === 1) {
                            array[0].backward(this._player.renderingEngine);
                        }

                        // Topic commands && content commands.
                        if (array.length > 1) {
                            var topic = array[0];
                            var content = array[1];
                            var contentIndex = topic.children.indexOf(content);

                            if (contentIndex === 0) {
                                topic.backward(this._player.renderingEngine);
                                content.backward(this._player.renderingEngine);
                            } else {
                                topic.forward(this._player.renderingEngine);
                                content.backward(this._player.renderingEngine);
                            }
                        }
                    }, this);
                }

                // Update current command index.
                this._index = index;
            }
        }, {
            key: 'prevCommand',
            value: function prevCommand() {
                if (this._index > 0) {
                    this.execCommand(this._index - 1);
                }
            }
        }, {
            key: 'nextCommand',
            value: function nextCommand() {
                if (this._index + 1 < this._commands.length) {
                    this.execCommand(this._index + 1);
                }
            }
        }, {
            key: 'getTopicCommandIndices',
            value: function getTopicCommandIndices() {
                var indices = [];
                this._commandTree.forEach(function (command, index) {
                    if (command instanceof _TopicCommand2.default) {
                        indices.push(index);
                    }
                });
                return indices;
            }
        }, {
            key: 'getHelperCommandIndices',
            value: function getHelperCommandIndices() {
                var indices = [];
                this._commandTree.forEach(function (command, index) {
                    if (command instanceof _HelperCommand2.default) {
                        indices.push(index);
                    }
                });
                return indices;
            }
        }, {
            key: '_buildCommandTree',
            value: function _buildCommandTree(data) {

                function create(params) {
                    var command = _CommandFactory2.default.create(params);
                    if (params.children) {
                        var children = params.children.map(create, this);
                        command.add(children);
                    }
                    return command;
                }

                return data.commands.map(create, this);
            }
        }, {
            key: '_buildCommandQueue',
            value: function _buildCommandQueue() {
                var queue = [];
                this._commandTree.forEach(function (command) {

                    if (command instanceof _HelperCommand2.default) {
                        queue.push([command]);
                    }

                    if (command instanceof _TopicCommand2.default) {

                        if (command.children && command.children.length > 0) {
                            command.children.forEach(function (child) {
                                queue.push([command, child]);
                            });
                        } else {
                            queue.push([command]);
                        }
                    }
                });
                return queue;
            }
        }]);

        return SlideControl;
    }(_Controls3.default);

    exports.default = SlideControl;
});