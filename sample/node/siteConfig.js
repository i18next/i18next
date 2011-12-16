var settings = {
      port: 3000
    , uri: 'http://localhost:3000' // Without trailing /
    , debug: (process.env.NODE_ENV !== 'production' || process.env.DEBUG) ? true : false
};

if (process.env.NODE_ENV == 'production') {
    settings.uri = 'http://yourname.no.de';
    settings.port = process.env.PORT || 80; // Joyent SmartMachine uses process.env.PORT	
}

module.exports = settings;