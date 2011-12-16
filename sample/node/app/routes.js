var fs = require('fs');

exports.actions = function(app, options) {

    var jsFiles = require('./assets/jsFileList').init(options);
    
    app.get('/', function(req, res) {
        res.render('index', { title: 'set title', jsFiles: jsFiles.client });
    });
    
    if (options.debug) {
    
        app.get('/test', function(req, res){
            res.render('test/runner', { layout: false, jsFiles: jsFiles.testclient, jsTests: jsFiles.tests  });
        });    
    
        app.get('/src/*', function(req, res) {
            fs.readFile('../../src/' + req.params, function(err, data) { 
                if (err) console.log(req.params + ' err:'  + err);
                
                res.writeHead(200, {
                        'Content-Type': 'text/javascript',
                        'Content-Length': data.length,
                        'Last-Modified': new Date(),
                        'Date': new Date().toUTCString(),
                        'Cache-Control': 'public max-age=' + 31536000,
                        'Expires': (new Date(new Date().getTime()+63113852000)).toUTCString()
                });
                res.end(data);
            });
        });

        // server development clientside javascripts
        app.get('/app/assets/*', function(req, res) {
            fs.readFile('./app/assets/' + req.params, function(err, data) { 
                if (err) console.log(req.params + ' err:'  + err);
                
                res.writeHead(200, {
                        'Content-Type': 'text/javascript',
                        'Content-Length': data.length,
                        'Last-Modified': new Date(),
                        'Date': new Date().toUTCString(),
                        'Cache-Control': 'public max-age=' + 31536000,
                        'Expires': (new Date(new Date().getTime()+63113852000)).toUTCString()
                });
                res.end(data);
            });
        });
        
        app.get('/test/app/assets/*', function(req, res) {
            fs.readFile('./app/assets/' + req.params, function(err, data) { 
                if (err) console.log(req.params + ' err:'  + err);
                                
                res.writeHead(200, {
                        'Content-Type': 'text/javascript',
                        'Content-Length': data.length,
                        'Last-Modified': new Date(),
                        'Date': new Date().toUTCString(),
                        'Cache-Control': 'public max-age=' + 31536000,
                        'Expires': (new Date(new Date().getTime()+63113852000)).toUTCString()
                });
                res.end(data);
            });
        });
    }
    
    // data routes

    var resources = {
        'de-DE': {
            'ns.special': {
                app: {
                    name: 'i18n'
                }
            }
        },
        'de': {
            'ns.special': {
                app: {
                    area: 'Personen'
                }
            }
        }
    };

    app.get('/locales/resource.json', function(req, res) {
        res.contentType('json');

        languages = req.query.lng.split(' ');
        namespaces = req.query.ns.split(' ');

        languages.forEach(function(lng) {
            if (!resources[lng])resources[lng] = {};


            namespaces.forEach(function(ns) {
                if (!resources[lng][ns]) resources[lng][ns] = {};
            });
        });

        console.log(JSON.stringify(resources, null, 2));
        res.send(resources);
    });

    app.post('/locales/add/:lng/:ns', function(req, res){

        var lng = req.params.lng;
        var ns = req.params.ns;
 
        if (!resources[lng])resources[lng] = {};
        if (!resources[lng][ns]) resources[lng][ns] = {};

        for (var m in req.body) {

            var keys = m.split('.');
            var x = 0;
            var value = resources[lng][ns];
            while (keys[x]) {
                if (x === keys.length - 1) {
                    value = value[keys[x]] = req.body[m];
                } else {
                    value = value[keys[x]] = value[keys[x]] || {};
                }
                x++;
            }
        }

        console.log(JSON.stringify(resources, null, 2));

        res.send();
    });
    
    var repository = {
        nextId: 20,
        persons: [
            {id: 1, firstname: 'Hans', lastname: 'Muster', 
                persons: [
                    {id: 10, firstname: 'Karl', lastname: 'Puster'},
                    {id: 11, firstname: 'Kurt', lastname: 'Huster'}
                ]
            }, 
            {id: 2, firstname: 'Herbert', lastname: 'Kuster', 
                persons: [
                    {id: 12, firstname: 'Kevin', lastname: 'Wuster'}
                ]
            },
            {id: 3, firstname: 'Hannes', lastname: 'Schuster',
                persons: [
                    {id: 13, firstname: 'Killi', lastname: 'Xuster'}
                ]
            },
            {id: 4, firstname: 'Henning', lastname: 'Oster'},
            {id: 5, firstname: 'Hubert', lastname: 'Auster'}
        ]
    };
    
    app.get('/data/persons', function(req, res) {
        res.contentType('json');
        
        //console.log(repository.persons);
        res.send(toResponse({'persons': repository.persons}));
    });
    
    // add
    app.post('/data/addPerson', function(req, res){
        var person = req.body;
        person.id = repository.nextId++;
        
        repository.persons.push(person);
        
        //console.log(repository.persons);
        res.send(person);
    });
    
    // update
    app.put('/data/persons/:id', function(req, res){
        var found;
        
        for (i = 0, len = repository.persons.length; i < len; i++) {
            if (repository.persons[i].id == req.params.id) {
                found = repository.persons[i] = req.body;
                break;
            }
        }
        
        //console.log(repository.persons);
        res.send(found);
    });
    
    // update
    app.del('/data/persons/:id', function(req, res){
        var found, foundAt = -1, foundChildAt = -1;
        
        for (i = 0, len = repository.persons.length; i < len; i++) {
            if (found) break;
        
            if (repository.persons[i].id == req.params.id) {
                found = repository.persons[i];
                foundAt = i;
                break;
            }
            
            // childs
            if (repository.persons[i].persons) {
                for (y = 0, len2 = repository.persons[i].persons.length; y < len2; y++) {
                    if (repository.persons[i].persons[y].id == req.params.id) {
                        found = repository.persons[i].persons[y];
                        foundAt = i;
                        foundChildAt = y;
                        break;
                    }
                }
            }
        }
        
        if (foundAt > -1 && foundChildAt === -1) {
            repository.persons.splice(foundAt, 1);
        }
        
        if (foundChildAt > -1) {
            console.log(repository.persons[foundAt].persons.splice(foundChildAt, 1));
        }
        
        //console.log(repository.persons);
        res.send(found);
    });
       
    function toResponse(payload) {
        var res = {
            'status': 'OK',
            'version': '1.0',
            'response': payload
        };
        return res;   
    }
};

