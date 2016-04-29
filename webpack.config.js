module.exports = {
    context: __dirname + '/.tmp',
    entry  : [
        'babel-polyfill',
        './Bifrost'
    ],
    output : {
        libraryTarget: 'umd',
        filename     : __dirname + '/dist/bifrost-engine.js'
    }
};