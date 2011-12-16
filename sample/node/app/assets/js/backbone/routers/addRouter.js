(function(myApp) {
    var ns = myApp.routers || extend(myApp, 'myApp.routers')
      , state = myApp.state
      , AddView = myApp.views.AddView
      , AddRouter;
    
    AddRouter = myApp.Router.extend({

        routes: {
            "add": "add"
        },
        
        add: function() {
            state.set({ topview: AddView });
        },
        
        getRoute: function() {
            return 'add';
        }

    });
    
    ns.AppRouter.register(AddRouter, AddView);
    
}(myApp));