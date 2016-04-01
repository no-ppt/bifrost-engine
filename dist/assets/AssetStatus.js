(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.AssetStatus = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   *
   * @author hermit
   * @version 1.0.0
   * @since 1.0.0
   */
  var AssetStatus = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    LOADED: 'LOADED',
    FAILURE: 'FAILURE'
  };
  exports.default = AssetStatus;
});