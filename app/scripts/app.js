define([
    
    'jquery'

], function(

    $
){

    function loadYTApi(){

        var dfd = $.Deferred()
            ,tag = document.createElement('script')
            ,firstScriptTag = document.getElementsByTagName('script')[0];
            ;

        window.onYouTubeIframeAPIReady = function(){
            dfd.resolve();
        };

        tag.src = "//www.youtube.com/iframe_api";
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        return dfd;
    }

    var ytready = loadYTApi();

    $(function(){

        var $vid = $('#movie_player')
            ;

        window.yt = {
            config_: {
                PLAYER_REFERENCE: false
            }
        };

        $.when(ytready).then(function(){

            var player = new YT.Player('movie_player', {
                height: '100%',
                width: '100%',
                videoId: $vid.data('ytid'),
                events: {
                    'onReady': function(evt){
                        // fake youtube page data
                        window.yt.config_['PLAYER_REFERENCE'] = evt.target;

                        // debug
                        // require(['hijack']);
                    }
                } 
            });
        });
        
    });

});