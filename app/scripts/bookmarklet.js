!function(d,s,id,dm){
    var js,bjs=d.getElementsByTagName(s);
    if(!d.getElementById(id)){
        js=d.createElement(s);
        js.id=id;
        js.src=dm+'/scripts/mphj.js';
        bjs[0].parentNode.insertBefore(js,bjs);
    }
}(document,'script','mp_hijack', 'http://minutephysics.com/hijack');