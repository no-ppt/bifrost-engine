(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.Event = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  /**
   * Event construct template.
   *
   * @type {{_type: String, _target: Object, _timestamp: number, _arguments: Array}}
   */
  var EVENT_TEMPLATE = {
    type: null,
    target: null,
    arguments: []
  };

  /**
   * The Event interface prevents any event of the EventTarget. It contains common properties and
   * methods to any event.
   *
   * @author hermit
   * @version 1.0.2
   * @since 1.0.0
   */

  var Event = function () {

    /**
     * @param params
     */

    function Event(params) {
      _classCallCheck(this, Event);

      // Construct event object by merging parameter.
      this._type = params.type || EVENT_TEMPLATE.type;
      this._target = params.target || EVENT_TEMPLATE.target;
      this._arguments = params.arguments || EVENT_TEMPLATE.arguments;
      this._timestamp = new Date().getTime();
    }

    /**
     * Get the event create timestamp.
     *
     * @returns {number} Event create time in milliseconds.
     */


    _createClass(Event, [{
      key: "timestamp",
      get: function get() {
        return this._timestamp;
      }
    }, {
      key: "type",
      get: function get() {
        return this._type;
      }
    }, {
      key: "target",
      get: function get() {
        return this._target;
      }
    }, {
      key: "arguments",
      get: function get() {
        return this._arguments;
      }
    }, {
      key: "args",
      get: function get() {
        return this.arguments;
      }
    }]);

    return Event;
  }();

  exports.default = Event;
});