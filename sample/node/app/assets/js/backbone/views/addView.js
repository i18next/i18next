(function(myApp) {
    var ns = myApp.views || extend(myApp, 'myApp.views')
      , models = myApp.models
      , state = myApp.state
      , formHelpers = myApp.views.shared.helpers.formHelpers;
            
    // View: Add Person
    ns.AddView = myApp.View.extend({
    
        el: '#add-person-view',
        
        initialize: function() {
            var person = this.model = new models.Person();
            this.render();
        },
        
        // route ui events to functions
        events: {
            'click .createPerson' : 'createPerson',
            'click .cancel' : 'cancelAdd'
        },
        
        // is called from ui event to create a new visit
        createPerson: function(e) {
            // prevent default behavior -> form submit
            e.preventDefault();
            
            this.model.save({
                firstname: this.$('#firstname').val(),
                lastname: this.$('#lastname').val()
            }, { 
                success: function(person) {
                    myApp.app.persons.add(person);
                }
            });
                                            
            // go back
            state.set({ 'topview': ns.IndexView });
        },
        
        cancelAdd: function(e) {
            e.preventDefault();
            state.set({ 'topview': ns.IndexView });
        },
        
        // is called to render the view
        render: function() {
            $(this.el).html(ich.addPerson(this.model.toJSON()));
            return this;
        },
                      
        open: function(fromRight) {
            $(this.el).show('slide', {direction: (fromRight ? 'right' : 'left') }, 500);
        },
        
        close: function(fromRight) {
            $(this.el).hide('slide', {direction: (fromRight ? 'left' : 'right') }, 500);
        }
    });
    
}(myApp));