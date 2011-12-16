// All routers need to register itself to this _approuter_ which will handling all state 
// changes by calling updateRoute on the right router.

(function(myApp) {
    var ns = myApp.routers || extend(myApp, 'myApp.routers')
      , state = myApp.state
      , AppRouter
        // array to hold registered routers
      , routers = [];
    
    AppRouter = ns.AppRouter = myApp.Router.extend({
    
        initialize: function() {
        
            // instantiate registered routers
            routers.forEach(function(r) {
                r.router = new r.cls();
            });
                       
            // listen for state changes - if topview value changes the corresponding route 
            // will be updated
            state.bind('change:topview', this.updateRoute, this);
        },
        
        // get the router for the current top view
        getRouter: function() {
            var topview = state.get('topview');
            try {
                return _(routers).detect(function(r) {
                    return r.view == topview;
                }).router;
            } catch (e) {
                console.error('top view not found');
            }
        },
        
        getRoute: function() {
            // delegate
            return this.getRouter().getRoute();
        },
        
        navigate: function(route, trigger) {
            // delegate
            return this.getRouter().navigate(route, trigger);
        }

    });
    
    // register a router class to deal with a top-level view
    AppRouter.register = function(router, view) {
        routers.push({
            view: view,
            cls: router
        })
    };
    
}(myApp));