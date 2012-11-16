require.config({
    baseUrl: 'http://minutephysics.com/hijack/scripts',
    shim: {
        'buzz': {
            exports: 'buzz'
        }
    },
    paths: {
        'buzz': 'vendor/buzz'
    }
});

require([
    'require',
	'modules/bonzo',
    'modules/shifty',
    'modules/when',
    'buzz'
],
function(
    req,
	bonzo,
    Tween,
    when,
    buzz
){

    var root = req.toUrl('.')
        ,waitMsg = loadingOverlay()
        ,ytLoaded = when.defer()
        ,soundLoaded = when.defer()
        ,glassSound = new buzz.sound(root + '/../sounds/glass', {
                formats: [ "mp3" ]
            }).bind('canplaythrough error', function(){
                soundLoaded.resolve();
            }).load()
        ;

    function loadingOverlay(){

        var overlay = bonzo(bonzo.create('<div>Loading sheep...</div>'));

        overlay.css({
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: 200,
            'font-size': 25,
            margin: -100,
            'text-align': 'center',
            background: '#fff',
            padding: 35,
            'box-shadow': '1px 1px 7px #666',
            'border-radius': 5,
            color: '#666',
            zIndex: 100
        }).appendTo(document.body);

        return overlay;

    }

    function loadYTApi(){
        var tag = document.createElement('script');
        tag.src = "//www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    function fallOver( el, callback ){

        var tweenable = new Tween()
            ;

        el = bonzo(el);

        bonzo(el.parent()).css({
            'background': 'black',
            '-webkit-perspective': 400,
            '-moz-perspective': 400,
            '-ms-perspective': 400,
            'perspective': 400
        });

        el.css({
            'zIndex': 1,
            'transform-origin': 'bottom center'
        });

        tweenable.tween({
            from: {
                angle: 0
            },
            to: {
                angle: 90
            },
            easing: 'bounce',
            duration: 1000,
            step: function(state){

                el.css({
                    transform: 'rotateX('+state.angle+'deg)'
                });
            },
            callback: callback
        });
    }
    
    function breakIt(target, cb){

        if (!target.length) return;

        var dims = bonzo.viewport()
            ,offset = target.offset()
            ,w = 250
            ,h = 90
            ,projectile = bonzo(bonzo.create('<div>')).css({
                'width': w,
                'height': h,
                'background': 'url('+ req.toUrl('.') +'/../images/sheep-fly.png) no-repeat 0 0',
                'background-size': '100%',
                'position': 'absolute',
                'top': dims.height,
                'left': dims.width,
                'zIndex': 10
            })
            ,tweenable = new Tween()
            ;
        
        projectile.appendTo(document.body);

        tweenable.tween({
            from: {
                top: dims.height,
                left: dims.width
            },
            to: {
                top: offset.top + offset.height/2 - h/2,
                left: offset.left + offset.width/2 - w/4
            },
            duration: 1000,
            step: function(state){
                projectile.css({
                    top: state.top,
                    left: state.left
                })
            },
            callback: function(){

                projectile.hide();
                var img = shatterImg( target.parent() );
                glassSound.play()
                
                setTimeout(function(){
                    fallOver( bonzo([target[0], img[0]]), cb );
                }, 2000);
            }
        });
    }

    function injectVideo( parent, ytid, callback ){

        var injected = bonzo(bonzo.create('<div><div id="mp-player"></div></div>'));
        
        injected.css({
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            'transform-origin': 'top center',
            transform: 'rotateX(-180deg)',
            zIndex: 0
        }).appendTo(parent);

        var player = new YT.Player('mp-player', {
            height: '100%',
            width: '100%',
            videoId: ytid,
            events: {
                'onReady': function(evt){
                    callback(injected, evt.target);
                }
            } 
        });
    }

    function swingIn( el ){

        el.css('zIndex', 5);

        var tweenable = new Tween();
        tweenable.tween({
            from: {
                angle: -180
            },
            to: {
                angle: 0
            },
            easing: 'swingTo',
            duration: 800,
            step: function(state){

                el.css('transform', 'rotateX('+state.angle+'deg)');
            }
        });
    }

    function shatterImg( par ){

        var img = bonzo(bonzo.create('<div>'));
        
        img.css({
            background: 'url('+ req.toUrl('.') +'/../images/shatter.png) no-repeat center center',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 4
        }).appendTo(par);

        return img;
    }

    window.onYouTubeIframeAPIReady = function(){
        ytLoaded.resolve();
    };

    when.all([ytLoaded, soundLoaded]).then(function(){

        waitMsg.hide();

        /*
        start
         */
        var ytid = 'dmX1W5umC1c'
            ,video = bonzo(document.getElementById('movie_player'))
            ,parent = video.parent() //document.getElementById('watch7-video')
            ;

        bonzo(parent).css({
            position: 'relative',
            overflow: 'hidden'
        });

        video.css('zIndex', 2);

        injectVideo( parent, ytid, function( mp, player ){

            setTimeout(function(){
                player.playVideo();
            }, 2000);

            breakIt(video, function(){

                swingIn( mp );

                var api = window.yt && window.yt.config_['PLAYER_REFERENCE'];
                api && api.stopVideo();
                video.css('display', 'none');
            });
        });
    });

    loadYTApi();
	
});