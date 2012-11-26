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

    var video = bonzo(document.getElementById('movie_player'))
        ,root = req.toUrl('.')
        ,glassSound
        ;

    if (!video.length) return;

    function loadResources(){

        var waitMsg = loadingOverlay()
            ;

        return when.all([

            loadYTApi(), 
            loadSound(), 
            loadImages()

        ]).then(function(){

            setTimeout(function(){

                waitMsg.hide();

            }, 1000);

        });
    }

    function loadSound(){

        var dfd = when.defer();

        glassSound = new buzz.sound(root + '/../sounds/glass', {
            formats: [ 'mp3', 'ogg', 'aac' ]
        }).bind('canplaythrough error', function(){
            dfd.resolve();
        }).load();

        return dfd;
    }

    function loadImages(){

        var list = [
                '/../images/shatter.png',
                '/../images/sheep-fly.png'
            ]
            ,next
            ,img
            ,dfds = []
            ;

        function preload(url){
            var img = new Image()
                ,dfd = when.defer()
                ;

            img.onload = function(){
                dfd.resolve();
            };
            img.src = url;

            return dfd;
        }

        while (next = list.pop()){

            dfds.push(preload(root+next));
        }

        return when.all(dfds);
    }

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

        var dfd = when.defer()
            ,tag = document.createElement('script')
            ,firstScriptTag = document.getElementsByTagName('script')[0];
            ;

        if (window.YT) return dfd.resolve();

        window.onYouTubeIframeAPIReady = function(){
            dfd.resolve();
        };

        tag.src = "//www.youtube.com/iframe_api";
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        return dfd;
    }

    function fallOver( el ){

        var dfd = when.defer()
            ,tweenable = new Tween()
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
            callback: function(){
                dfd.resolve();
            }
        });

        return dfd;
    }
    
    function breakIt(target){

        if (!target.length) return;

        var dfd = when.defer()
            ,dims = bonzo.viewport()
            ,offset = target.offset()
            ,w = 250
            ,h = 90
            ,dest = {
                top: offset.top + offset.height/2 - h/2,
                left: offset.left + offset.width/2 - w/4
            }
            ,endH = 200
            ,projectile = bonzo(bonzo.create('<div>')).css({
                'width': w,
                'height': h,
                'background': 'url('+ root +'/../images/sheep-fly.png) no-repeat 0 0',
                'background-size': '100%',
                'position': 'absolute',
                'top': dest.top+endH,
                'left': dest.left,
                'zIndex': 10
            })
            ,layer = bonzo(bonzo.create('<div>')).css({
                overflow: 'hidden',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: bonzo(document.body).dim().height + bonzo(document.body).scrollTop(),
                'zIndex': 10
            })
            ,tweenable = new Tween()
            ;
        
        projectile.appendTo(layer.appendTo(document.body));

        tweenable.tween({
            from: {
                ang: 90,
                r: dims.width - dest.left
            },
            to: {
                ang: -360,
                r: -500
            },
            easing: 'easeInCubic',
            duration: 5000,
            step: function(state){

                var r = Math.max(endH, state.r);

                projectile.css({
                    transform: 'rotate('+state.ang+'deg) translate(0px,-'+r+'px)'
                });
            },
            callback: function(){

                layer.hide();
                var img = shatterImg( target.parent() );
                glassSound.play();

                dfd.resolve(bonzo([target[0], img[0]]));
            }
        });

        return dfd;
    }

    function injectVideo( parent, ytid, callback ){

        var dfd = when.defer()
            ,injected = bonzo(bonzo.create('<div><div id="mp-player"></div></div>'))
            ;
        
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
                    dfd.resolve([injected, evt.target]);
                }
            } 
        });

        return dfd;
    }

    function swingIn( el ){

        el.css('zIndex', 5);

        var dfd = when.defer()
            ,tweenable = new Tween()
            ;

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
            },
            callback: function(){
                dfd.resolve();
            }
        });

        return dfd;
    }

    function shatterImg( par ){

        var img = bonzo(bonzo.create('<div>'));
        
        img.css({
            background: 'url('+ root +'/../images/shatter.png) no-repeat center center',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 4
        }).appendTo(par);

        return img;
    }

    loadResources().then(function(){

        /*
        start
         */
        var ytid = 'dmX1W5umC1c'
            ,parent = video.parent() //document.getElementById('watch7-video')
            ;

        bonzo(parent).css({
            position: 'relative',
            overflow: 'hidden'
        });

        video.css('zIndex', 2);

        injectVideo( parent, ytid ).then(function( args ){

            var mp = args[0]
                ,player = args[1]
                ;

            // start loading
            player.playVideo();
            player.pauseVideo();

            // break video
            breakIt(video).then(function( els ){

                // wait two seconds
                setTimeout(function(){

                    // fall over
                    fallOver( els ).then(function(){

                        // play new video
                        player.playVideo();

                        // swing it in
                        swingIn( mp );

                        var api = window.yt && window.yt.config_['PLAYER_REFERENCE'];
                        api && api.stopVideo();
                        video.css('display', 'none');
                    });
                }, 2000);
            });
        });
    });
	
});