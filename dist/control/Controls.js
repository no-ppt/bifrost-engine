(function(global,factory){if(typeof define==="function"&&define.amd){define(["exports"],factory)}else if(typeof exports!=="undefined"){factory(exports)}else {var mod={exports:{}};factory(mod.exports);global.Controls=mod.exports}})(this,function(exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var DEFAULT_OPTIONS={}; /**
 *
 * @author hermit
 * @version 2.0.0
 * @since 1.0.0
 */var Controls=function(){ /**
     * Create controls.
     *
     * @constructor
     * @param params    Parameters for create controls.
     */function Controls(params){_classCallCheck(this,Controls); // Merge options.
this._options=Object.assign({},DEFAULT_OPTIONS,params); // Define the player.
this._player=null;this._enable=false} /**
     * Register controls to the player.
     *
     * @param player Player to be used in.
     */_createClass(Controls,[{key:"register",value:function register(player){this._player=player;this._enable=true}},{key:"unregister",value:function unregister(){this._enable=false;this._player=null;this.destroy()}},{key:"enable",value:function enable(){this._enable=true}},{key:"disable",value:function disable(){this._enable=false}}]);return Controls}();exports.default=Controls});