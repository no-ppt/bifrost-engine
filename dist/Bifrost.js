(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './player/Player', './config/TweenConfig'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./player/Player'), require('./config/TweenConfig'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Player, global.TweenConfig);
        global.Bifrost = mod.exports;
    }
})(this, function (exports, _Player, _TweenConfig) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _Player2 = _interopRequireDefault(_Player);

    var _TweenConfig2 = _interopRequireDefault(_TweenConfig);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };

    /**
     * Register the class to Bifrost.
     * @param name  Class signature.
     * @param clazz The class to be registered.
     */
    function register(name, clazz) {

        // Check name for validity.
        // It must exist, and must not begin or end with a period or contain two periods in a row.
        if (!name) {
            throw new Error();
        }
        if (name.charAt(0) === '.' || name.charAt(name.length - 1) === '.' || name.indexOf("..") != -1) {
            throw new Error();
        }

        // Break the name at periods and create the object hierarchy we need.
        var parts = name.split('.');

        // For each namespace component, either create an object
        // or ensure that an object by that name already exists.
        var container = Bifrost;
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];

            // If there is no property of container with this name, create an empty object.
            if (!container[part]) {

                if (i === parts.length - 1) {
                    container[part] = clazz;
                } else {
                    container[part] = {};
                }
            } else if (_typeof(container[part]) !== 'object') {
                // If there is already a property, make sure it is an object.
                var n = parts.slice(0, i).join('.');
                throw new Error(n);
            }
            container = container[part];
        }
    }

    /**
     * Define the Bifrost library.
     *
     * @type {object}
     */
    var Bifrost = {
        version: '2.0.2'
    };

    // Register modules.
    register('player.Player', _Player2.default);
    register('config.TweenConfig', _TweenConfig2.default);

    // Export Bifrost framework.
    exports.default = Bifrost;
});