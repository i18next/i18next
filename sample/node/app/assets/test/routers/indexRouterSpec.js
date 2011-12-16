describe('Index Router', function() {
    
    var myApp = window.myApp 
      , views = myApp.views
      , state = myApp.state
      , app = myApp.app;
      
    beforeEach(function() {
        app.router = new myApp.routers.AppRouter();
        try {
            Backbone.history.start({
                silent: true,
                pushState: false
            });
        }
        catch (e) {}
        
        state.set({ topview: views.IndexView });
    });
    
    afterEach(function() {
        delete app.router;
    });
           
    it('should update hashtag to \'#index\'', function() {
        expect(window.location.href.indexOf('#index')).toBeGreaterThan(-1);
    });
    
});