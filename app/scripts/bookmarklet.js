!function(d,s,id,dm){
    var js,bjs=d.getElementsByTagName(s),cfg,main = 'hijack';
    if(!d.getElementById(id)){
        cfg = {baseUrl: dm+'/scripts/'};
        if (window.requirejs&&window.require){
            require.config(cfg);
            require([main]);
            return;
        }
        window.requirejs = cfg;
        js=d.createElement(s);
        js.id=id;
        js.src=dm+'/require.js';
        js.setAttribute('data-main', main);
        bjs[0].parentNode.insertBefore(js,bjs);
    }
}(document,'script','mp_hijack', 'http://minutephysics.com/hijack');