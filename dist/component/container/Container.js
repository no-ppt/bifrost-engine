(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../Component'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../Component'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Component);
    global.Container = mod.exports;
  }
})(this, function (exports, _Component2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Component3 = _interopRequireDefault(_Component2);

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

  var Container = function (_Component) {
    _inherits(Container, _Component);

    function Container() {
      _classCallCheck(this, Container);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(Container).apply(this, arguments));
    }

    return Container;
  }(_Component3.default);

  exports.default = Container;
});