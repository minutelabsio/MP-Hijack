!function(d,s,id,dm){
    var js,bjs=d.getElementsByTagName(s);
    if(!d.getElementById(id)){
        window.requirejs = {baseUrl: dm+'/scripts/'};
        js=d.createElement(s);
        js.id=id;
        js.src=dm+'/require.js';
        js.setAttribute('data-main', 'hijack.js');
        bjs[0].parentNode.insertBefore(js,bjs);
    }
}(document,'script','mp_hijack', 'http://minutephysics.com/hijack');