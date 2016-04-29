// RequireJS Configuration.
requirejs.config( {
    baseUrl: '../dist',
    paths  : {
        jquery          : '../node_modules/jquery/dist/jquery',
        bifrost         : './bifrost-engine.min',
        'babel-polyfill': '../node_modules/babel-polyfill/dist/polyfill'
    },
    shim   : {
        // 'bifrost': [ 'babel-polyfill' ]
    }
} );

require( [ 'jquery', 'bifrost' ], function ( $, bifrost ) {

    // ES 6 polyfill.
    var Bifrost = bifrost.default;

    var Player         = Bifrost.player.Player;
    var TweenConfig    = Bifrost.config.TweenConfig;
    TweenConfig.enable = true;

    // Create player.
    var container = document.querySelector( '#container' );
    var player    = new Player( container, { ignore: true } );
    events();

    // Load data from json.
    var name = location.search.substr( 1 );
    $.get( 'scene/' + name + '/output.json', function ( data ) {
        data.assets.forEach( function ( asset ) {
            asset.src = 'scene/' + name + '/data/' + asset.src.substr( 22 );
        } );
        player.open( data );
    } );

    function events() {
        player.addEventListener( 'AssetLoadSuccess', function ( event, asset, progress ) {
            console.info( '[Assets] (' + progress.success + '/' + progress.total + ')Asset '
                          + asset.src + ' has been loaded.' );
        } );
        player.addEventListener( 'RendererCreated', function () {
            console.info( '[Engine] Renderer created.' )
        } );
        player.addEventListener( 'CameraCreated', function () {
            console.info( '[Engine] Camera created.' )
        } );
        player.addEventListener( 'SceneCreated', function () {
            console.info( '[Engine] Scene created.' )
        } );
        player.addEventListener( 'RenderingEngineLoaded', function () {
            console.info( '[Engine] Rendering engine has been loaded.' )
        } );
        player.addEventListener( 'ComponentAdded', function ( event, component ) {
            console.info( '[Component] Component ' + component.name + ' has been loaded.' )
        } );
        player.addEventListener( 'ComponentLoaded', function () {
            console.info( '[Component] All components has been loaded.' );
        } );
        player.addEventListener( 'BPDOpenSuccess', BPDOpenSuccessHandler );
        player.addEventListener( 'BPDOpenFailure', function ( e ) {
            console.error( e );
        } );
        window.addEventListener( 'resize', function () {
            resizeViewport();
            player.resize( container.offsetWidth, container.offsetHeight );
        } );
    }

    function BPDOpenSuccessHandler() {

        // Play!!
        player.play();
        window.player = player;

        // Bind control events.
        document.addEventListener( 'keydown', keydownHandler );
    }

    function keydownHandler( event ) {
        var control = player.getControl( 'SlideControl' );
        switch ( event.keyCode ) {
            case 33:    // Page up
            case 37:    // Left arrow
            case 38:    // Down arrow
                control.prevCommand();
                break;
            case 34:    // Page down
            case 39:    // Right arrow
            case 40:    // Down arrow
                control.nextCommand();
                break;
            case 27:    // Exit fullscreen.
                break;
        }
    }

    function resizeViewport() {
        var aspect = 16 / 9;
        if ( window.innerWidth / window.innerHeight < aspect ) {
            container.style.width  = window.innerWidth + 'px';
            container.style.height = (window.innerWidth / aspect) + 'px';
        } else {
            container.style.width  = (aspect * window.innerHeight) + 'px';
            container.style.height = window.innerHeight + 'px';
        }
    }
} );