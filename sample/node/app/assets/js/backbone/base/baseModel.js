// This is the base model for our app. All our models should inherit (by extending) 
// from this baseModel.   
// __Example:__
//
//      var model = myApp.Model.extend({});

(function(myApp) {

    // set _calix.Model_ to our baseModel
    myApp.Model = Backbone.Model.extend({
        
        // this will set the passed values to the model and validate it by calling 
        // the underlaying model.save function (which will not be executed thanks to 
        // our backbone.sync).   
        // __Example:__
        //
        //     changeValues: function(e) {
        //         this.model.setAndValidate({myAttr: 'newValue'}, {
        //             error: _.bind(function(model, error) {
        //                 // give feedback in ui
        //             }, this),
        //             success: _.bind(function(model, res) {
        //                 model.emitChange();
        //                 this.render(); 
        //             }, this)
        //         });
        //     },
        setAndValidate: function(changes, options) {
            this.save(changes, { 
                error: function(model, error) {
                    if (options && options.error) options.error(model, error)
                },
                success: function(model) {
                    if (options && options.success) options.success(model)
                }
            });
        },
           
        // override this in subclasses if needed
        isFullyLoaded: function() { 
            return true;
        },
        
        // callback for actions to take when fully loaded
        onReady: $.noop,
        
        // support for common pattern
        ready: function(loadCallback, immediateCallback) {
            var model = this,
                immediateCallback = immediateCallback || loadCallback;
            if (!model.isFullyLoaded()) {
                model.fetch({ 
                    success: function() {
                        model.onReady();
                        loadCallback();
                    },
                    error: function() {
                        console.log('Error fetching model with id ' + model.id)
                    }
                });
            } else {
                immediateCallback();
            }
        }
        
    });
    
}(myApp));