/*
 * Copyright © 2016 by Beijing Brilliant Demonstration Technology Co., Ltd. All right reserved.
 */

({
    baseUrl    : '../dist',
    optimize   : 'none',
    name       : 'Bifrost',
    paths      : {
        'three': '../node_modules/three/three',
        'tween': '../node_modules/tween.js/src/Tween'
    },
    stubModules: [ 'three', 'tween' ],
    out        : '../dist/bifrost-engine.js'
})