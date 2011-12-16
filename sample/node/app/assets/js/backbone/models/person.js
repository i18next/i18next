(function(myApp) {
    var ns = myApp.models || extend(myApp, 'myApp.models')
      , collections = myApp.collections || extend(myApp, 'myApp.collections')
      , Person;
       
    // ### Visit
    // the main model representing a visit
    Person = ns.Person = myApp.Model.extend({
    
        url: function(){
            if (this.isNew()){
              return "/data/addPerson";
            } else {
              return "/data/persons/" + this.id;
            }
        },
        
        defaults: {
        },
        
        addPerson: function(person) {
            var list = this.get('persons');
            
            if (!list) {
                list = new collections.Persons();
                this.set({persons: list});
            }
            
            list.add(person);
            this.trigger('change:persons', list);
        },
                                        
        onReady: function() {
        },
        
        isFullyLoaded: function() {
            return true;
        },
                
        validate: function(attrs) {
            if (attrs.firstname === '') {
                return 'cannot have an empty firstname';
            }
            if (attrs.lastname === '') {
                return 'cannot have an empty lastname';
            }
        }
    });
}(myApp));