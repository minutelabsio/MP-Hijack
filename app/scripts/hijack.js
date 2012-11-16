require([
	'modules/bonzo',
    'modules/shifty'
],
function(
	bonzo,
    Tween
){

    function fallOver( el, callback ){

        var tweenable = new Tween();

        bonzo(el.parent()).css({
            '-webkit-perspective': 400,
            '-moz-perspective': 400,
            '-ms-perspective': 400,
            'perspective': 400
        });

        el.css({

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
                
                fallOver( target, cb );                
            }
        });
    }

    function injectVideo( parent, ytid, callback ){

        var injected = bonzo(bonzo.create('<div><iframe id="mp-frame" width="100%" height="100%" src="http://www.youtube.com/embed/'+ytid+'?autoplay=1" frameborder="0" allowfullscreen></iframe></div>'));

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

        document.getElementById('mp-frame').onload = function(){
            callback(injected);
        };
    }

    function swingIn( el ){

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

    /*
    start
     */
    var ytid = 'dmX1W5umC1c'
        ,video = bonzo(document.getElementById('movie_player'))
        ;

    bonzo(video.parent()).css({
        position: 'relative'
    });

    video.css('zIndex', 2);

    injectVideo( video.parent(), ytid, function( mp ){

        breakIt(video, function(){

            swingIn( mp );

            var api = window.yt && window.yt.config_['PLAYER_REFERENCE'];
            api && api.stopVideo();
            video.css('display', 'none');
        });
    });
	
});