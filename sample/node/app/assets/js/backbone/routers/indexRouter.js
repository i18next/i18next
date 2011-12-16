// All routers work the same way - so we will only document this one. 
// A router registers itself to the _approuter_ which will handling all state 
// changes by calling updateRoute on the right router.

(function(myApp) {
    var ns = myApp.routers || extend(myApp, 'myApp.routers')
      , state = myApp.state
      , IndexView = myApp.views.IndexView
      , DetailView = myApp.views.PersonDetailView
      , IndexRouter;
    
    ns.IndexRouter = IndexRouter = myApp.Router.extend({

        routes: {
            "": "index",
            "index": "index"
        },
        
        index: function() {
            // when the route match set the needed values in state 
            // this will invoke changes in _approuter_ and _appview_.
            state.set({ topview: IndexView });
            state.set({ sidebarview: DetailView });
        },
        
        getRoute: function() {
            return 'index';
        }

    });
    
    // register the router at the _approuter_ with the matching (top)view
    ns.AppRouter.register(IndexRouter, IndexView);
    
}(myApp));