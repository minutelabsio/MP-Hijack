require.config({
    shim: {

        'popcorn': {
            exports: 'Popcorn'
        }
    },

    paths: {
        jquery: 'vendor/jquery.min',
        popcorn: 'vendor/popcorn'
    }
});
 
require(['app']);