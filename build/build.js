({
    baseUrl : '../dist',
    optimize: 'none',
    name    : 'Bifrost',
    paths   : {
        'three'         : '../node_modules/three/three',
        'tween'         : '../node_modules/tween.js/src/Tween',
        'babel-polyfill': '../node_modules/babel-polyfill/dist/polyfill'
    },
    shim    : {
        'Bifrost': [ 'babel-polyfill', 'three', 'tween' ]
    },
    wrapShim: true,
    out     : '../dist/bifrost-engine.js'
})