// The _appView_ will listen on changes of topview, sidebarview and load the 
// matching view on change.

(function(myApp) {
    var ns = myApp.views || extend(myApp, 'myApp.views')
      , state = myApp.state
      , topviewOrder = [
            ns.IndexView,
            ns.AddVisitView,
            ns.ConfigurationView
        ]
      , viewCache = [];
    
    ns.AppView = myApp.View.extend({
    
        initialize: function() {
            // listen for state changes
            state.bind('change:topview', this.updateTopView, this);
            state.bind('change:sidebarview', this.updateSidebarView, this);
        },
        
        // this will cache all 'mainviews' views so they only have to be loaded once
        cached: function(cls) {
            var cached = _(viewCache).detect(function(c) {
                return c.view == cls;
            });
            // if no key has been set, this has not been cached
            if (!cached) {
                // instantiate and cache
                cached = {
                    view: cls,
                    instance: new cls({ parent: this })
                };
                viewCache.push(cached);
            } 
            return cached.instance;
        },
        
        // update the top-level view
        updateTopView: function() {
            var cls = state.get('topview'),
                view = this.cached(cls);
            this.openTopView(view, cls);
        },
        
        // close the current view and open a new one
        openTopView: function(view, cls) {
            if (view) {
                var oldview = this.currentTopView,
                    fromRight = true;
                if (oldview && oldview != view) {
                    // get the old view class
                    oldCls = _(viewCache).detect(function(c) {
                        return c.instance == oldview;
                    }).view;
                    // work out left/right
                    fromRight = topviewOrder.indexOf(oldCls) < topviewOrder.indexOf(cls);
                    oldview.close(fromRight);
                }
                this.currentTopView = view;
                view.open(fromRight);
            }
        },
        
        // update the sidebar view
        updateSidebarView: function() {
            var cls = state.get('sidebarview'),
                view = this.cached(cls);
            this.openSidebarView(view, cls);
        },
        
        // close the current view and open a new one
        openSidebarView: function(view, cls) {
            if (view) {
                var oldview = this.currentSidebarView;
                if (oldview && oldview != view) {
                    // get the old view class
                    oldCls = _(viewCache).detect(function(c) {
                        return c.instance == oldview;
                    }).view;
                    
                    oldview.close(true);
                }
                this.currentSidebarView = view;
                view.open(true);
            }
        }
    
    });
    
}(myApp));