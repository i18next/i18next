describe('App Router', function() {
    
    var myApp = window.myApp 
      , views = myApp.views
      , routers = myApp.routers
      , state = myApp.state
      , app = myApp.app;
      
    beforeEach(function() {
    
        this.routerView1 = myApp.View.extend({});
        this.router1 = myApp.Router.extend({
            routes: {
                "route1": "route1"
            },
            
            route1: function() {},
            
            getRoute: function() {
                return 'route1';
            }
        });
        routers.AppRouter.register(this.router1, this.routerView1);
    
        this.router = new routers.AppRouter();
        try {
            Backbone.history.start({
                silent: true,
                pushState: false
            });
        }
        catch (e) {}
        
        state.set({ topview: this.routerView1 });
    });
    
    afterEach(function() {
        delete app.router;
    });
           
    it('should return route', function() {
        expect(this.router.getRoute()).toEqual('route1');
    });
    
});