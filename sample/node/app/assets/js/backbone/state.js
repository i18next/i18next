// The state backbone model holds the current state of the application.    
// It will hold:
//
// - shared collections and models
// - current views (topview, sidebarview,...)
//
// Because this is a regular backbone model we can use all functionality 
// described under the [backbone documentation](http://documentcloud.github.com/backbone/#Model). 
// Mostly we will get / set attributes and watch if they changed.

// This will self-execute the function with the _calix_ namespace as this.
(function(myApp) {
    var State, state;
    
    // model to hold current state
    State = Backbone.Model.extend({
            
        // (de)serialization functions
        deserialize: function(key, value) {
            var params = this.params,
                f = params[key] && params[key].deserialize || _.identity;
            return f(value);
        },
        
        // serialization functions
        serialize: function(key, value) {
            var params = this.params,
                f = params[key] && params[key].serialize || _.identity;
            return f(value);
        },
        
        // convenience function to set a serialized value
        setSerialized: function(key, value) {
            o = {};
            o[key] = this.deserialize(key, value);
            this.set(o);
        },
                
    });
    
    // initialize the singleton
    state = myApp.state = new State();
    
    // factory for de/serializable state parameters
    function param(deserialize, serialize) {
        return {
            deserialize: deserialize || _.identity,
            serialize: serialize || _.identity
        };
    };
    
}(myApp));