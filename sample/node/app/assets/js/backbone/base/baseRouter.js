// This is the base router for our app. All our routers should inherit (by extending) 
// from this baseRouter.   
// __Example:__
//
//      var router = myApp.Router.extend({});

(function(myApp) {

    // set _calix.Router to our baseRouter
    myApp.Router = Backbone.Router.extend({
    
        // navigate to the current route (you must override this in subclasses)
        getRoute: function() {
            return '';
        },
        
        // update the url based on the current state
        updateRoute: function() {
            this.navigate(this.getRoute());
        },
        
        // update the url if this router's view is the top view
        updateViewRoute: function() {
            if (this.topview && this.topview == calix.state.get('topview')) {
                this.updateRoute();
            }
        }
        
    });
    
}(myApp));