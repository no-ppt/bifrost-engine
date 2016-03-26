import Player   from './player/Player';
import ContextHelper    from './core/utils/ContextHelper';
import GenericImage     from './component/image/GenericImage';

/**
 * Define the Bifrost library.
 *
 * @type {{version: string, dependencies: {}}}
 */
let Bifrost = {
    version     : '2.0.0',
    dependencies: {}
};

/**
 * Export player.
 *
 * @type {Player}
 */
Bifrost.Player = Player;
Bifrost.test = function () {
    let map = new Map();
    map.set( 1, '1' );
    map.set( 2, '2' );
    return [...map.values()];
};

export default Bifrost;