# bifrost-engine

Bifrost is the core rendering engine of No-PPT based on WebGL.

[![Dependency Status](https://david-dm.org/no-ppt/bifrost-engine.svg)](https://david-dm.org/no-ppt/bifrost-engine)
[![devDependency Status](https://david-dm.org/no-ppt/bifrost-engine/dev-status.svg)](https://david-dm.org/no-ppt/bifrost-engine#info=devDependencies)

## Installation

install with npm:

```Shell
$ npm install --save noppt/bifrost-engine
```

## Getting Started

```JavaScript
define(['bifrost'], function(bifrost) {

    var Bifrost = bifrost.default;
    var Player  = Bifrost.player.Player;

    var container = document.querySelector( '#container' );
    var player    = new Player( container, { ignore: true } );

    // Business codes below...
});
```

## License

Copyright © 2014-2016 by No-PPT.com. All rights reserved.