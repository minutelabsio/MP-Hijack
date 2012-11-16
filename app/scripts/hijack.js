require([
    'require',
	'modules/bonzo',
    'modules/shifty'
],
function(
    req,
	bonzo,
    Tween
){
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
            ,w = 100
            ,h = 100
            ,projectile = bonzo(bonzo.create('<div>')).css({
                'width': w,
                'height': h,
                'background': 'red',
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
                top: offset.top + offset.height/2 - w/2,
                left: offset.left + offset.width/2 - h/2
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
    };

    loadYTApi();
	
});