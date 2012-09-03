function preload(lngs, cb) {
    if (typeof lngs === 'string') lngs = [lngs];
    for (var i = 0, l = lngs.length; i < l; i++) {
        if (o.preload.indexOf(lngs[i]) < 0) {
            o.preload.push(lngs[i]);
        }
    }
    return init(cb);
}

function setLng(lng, cb) {
    return init({lng: lng}, cb);
}

function lng() {
    return currentLng;
}