/* 
 * build profile
 * All config options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
 * node r.js -o ./config.build.js 
 */
({

	baseUrl: './',
    optimize: 'uglify',
    optimizeCss: 'none', // https://github.com/jrburke/r.js/issues/167
    name: 'hijack',
    out: 'mphj.js',
    wrap: false,
    mainConfigFile: 'hijack.js',
    include: 'vendor/require.js'

})
