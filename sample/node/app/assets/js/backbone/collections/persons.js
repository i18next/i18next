(function(myApp) {
    var ns = myApp.collections || extend(myApp, 'myApp.collections')
      , models = myApp.models
      , Persons;
       
    // the main collection holding our person models
    Persons = ns.Persons = myApp.Collection.extend({
        
        url: "/data/persons",
        
        model: models.Person,
        
        // will return the response part from json fetch 
        // to autofill the models
        parse: function(res) {
            var persons = res.response.persons;
            
            for (i = 0, len = persons.length; i < len; i++) {
                var person = persons[i];
                if (person.persons) {
                    var list = new ns.Persons(person.persons);
                    person.persons = list;
                }
            }
        
            return persons;
        }
    });
    
}(myApp));