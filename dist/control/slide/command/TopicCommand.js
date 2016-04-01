(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './Command'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./Command'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Command);
    global.TopicCommand = mod.exports;
  }
})(this, function (exports, _Command2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Command3 = _interopRequireDefault(_Command2);

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

  var TopicCommand = function (_Command) {
    _inherits(TopicCommand, _Command);

    function TopicCommand() {
      _classCallCheck(this, TopicCommand);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(TopicCommand).apply(this, arguments));
    }

    return TopicCommand;
  }(_Command3.default);

  exports.default = TopicCommand;
});