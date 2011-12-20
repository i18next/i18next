var smoosh = require('smoosh');


// ## BUILD
// run `jake build`   
// will build the projects clientsources.
desc('Builds the clientside scripts');
task('build', [], function(debug) {
    
    // a basic smoosh configuration object
    smoosh.config({
      "VERSION": "0.9",
      "JAVASCRIPT": {
        "DIST_DIR": "./",
        "i18next": [
          "src/i18next.js"
        ]
      }
    });

    // run smoosh to get minified version of the js file
    smoosh.build().analyze();
    
    console.log('+ written public/js/client.js successfully'.green);

});