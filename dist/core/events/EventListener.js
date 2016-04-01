(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../logger/LoggerFactory'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../logger/LoggerFactory'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.LoggerFactory);
    global.EventListener = mod.exports;
  }
})(this, function (exports, _LoggerFactory) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _LoggerFactory2 = _interopRequireDefault(_LoggerFactory);

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

  var EventListener = function () {
    function EventListener() {
      _classCallCheck(this, EventListener);
    }

    _createClass(EventListener, [{
      key: 'handleEvent',
      value: function handleEvent(event) {}
    }]);

    return EventListener;
  }();

  exports.default = EventListener;
});