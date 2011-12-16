// This is the base view for our app. All our views should inherit (by extending) 
// from this baseView.   
// __Example:__
//
//      var view = myApp.View.extend({});

(function(myApp, window) {
    var state = myApp.state;

    // set _calix.View_ to our baseView
    myApp.View = Backbone.View.extend({
    
        // basic open/close/remove support you can override this in specific view
        open: function() {
            $(this.el).show();
        },
        
        close: function() {
            $(this.el).hide();
        },
        
        remove: function() {
            $(this.el).slideUp(500, _.bind(function() {
                $(this.el).remove();
            }, this));
        },
        
        // bind/unbind state listeners. you can use this in your view to bind 
        // listeners to changes.    
        // __Example:__
        //
        //     initialize: function() {
        //         this.bindState('change:myAttribute', this.myFunction, this);
        //     },
        bindState: function(event, handler, context) {
            if (!this._stateHandlers) {
                this._stateHandlers = [];
            }
            state.bind(event, handler, context);
            this._stateHandlers.push({ event: event, handler: handler });
        },
        
        unbindState: function() {
            (this._stateHandlers || []).forEach(function(h) {
                state.unbind(h.event, h.handler);
            });
        },
        
        // unbind UI event handlers
        unbindEvents: function() {
            var view = this,
                eventSplitter = /^(\S+)\s*(.*)$/,
                events = view.events || [];
            _(events).each(function(e, key) {
                var match = key.match(eventSplitter),
                    eventName = match[1], 
                    selector = match[2];
                $(view.el).undelegate(selector, eventName);
            });
        },
        
        // basic clear support
        clear: function() {
            $(this.el).empty();
            this.unbindState();
            this.unbindEvents();
        }
                 
    });
    
}(myApp, this));