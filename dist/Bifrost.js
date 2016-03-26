(function(global,factory){if(typeof define==='function'&&define.amd){define(['exports','./player/Player','./core/utils/ContextHelper','./component/image/GenericImage'],factory)}else if(typeof exports!=='undefined'){factory(exports,require('./player/Player'),require('./core/utils/ContextHelper'),require('./component/image/GenericImage'))}else {var mod={exports:{}};factory(mod.exports,global.Player,global.ContextHelper,global.GenericImage);global.Bifrost=mod.exports}})(this,function(exports,_Player,_ContextHelper,_GenericImage){'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _Player2=_interopRequireDefault(_Player);var _ContextHelper2=_interopRequireDefault(_ContextHelper);var _GenericImage2=_interopRequireDefault(_GenericImage);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i]}return arr2}else {return Array.from(arr)}} /**
 * Define the Bifrost library.
 *
 * @type {{version: string, dependencies: {}}}
 */var Bifrost={version:'2.0.0',dependencies:{}}; /**
 * Export player.
 *
 * @type {Player}
 */Bifrost.Player=_Player2.default;Bifrost.test=function(){var map=new Map;map.set(1,'1');map.set(2,'2');return [].concat(_toConsumableArray(map.values()))};exports.default=Bifrost});