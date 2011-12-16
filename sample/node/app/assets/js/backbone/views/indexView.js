(function(myApp) {
    var ns = myApp.views || extend(myApp, 'myApp.views')
      , state = myApp.state
      , formHelpers = myApp.views.shared.helpers.formHelpers;
    
    ns.PersonView  = myApp.View.extend({
        tagName: 'li',
        
        className: 'personItem',
        
        initialize: function() {
            // bind functions to this 
            _.bindAll(this, 'editPerson', 'changePerson', 'render', 'remove');
        
            // bind changes in the underlying model to the matching function.
            this.model.bind('change', this.render);
            this.model.bind('destroy', this.remove);
            
            
            this.bindState('change:selectedPerson', this.toggleSelectedState, this);
        },
        
        // route ui events to functions
        events: {
            'click .itemcontent' : 'selectPerson',
            'click .editPerson' : 'editPerson',
            'click .cancelEdit' : 'cancelEdit',
            'click .changePerson' : 'changePerson',            
            'click .deletePerson' : 'deletePerson'
        },
        
        selectPerson: function() {
            if (state.get('selectedPerson') !== this.model) {
                state.set({selectedPerson: this.model});
            } else {
                state.unset('selectedPerson');
            }
        },
        
        toggleSelectedState: function() {
            if (state.get('selectedPerson') === this.model) {
                if (this.model.selected === true) return;
            
                this.model.selected = true;
                this.render();
            } else {
                if (this.model.selected === false) return;
                
                this.model.selected = false;
                this.render();
            }
        },
        
        // sets model to editMode and renders the view
        editPerson: function(e) {
            e.preventDefault();
            this.model.editMode = true;
            this.render();
        },
        
        // sets model back to non editMode and rerenders the view
        cancelEdit: function(e) {
            e.preventDefault();
            this.model.editMode = false;
            this.render();
        },
        
        // is called from the ui event to change the person.
        changePerson: function(e) {
            // prevent default behavior -> form submit
            e.preventDefault();
            
            this.model.save({
                firstname: this.$('#firstname').val(),
                lastname: this.$('#lastname').val()
            });
            
            this.model.editMode = false;
            this.render();
        },
        
        // is called from the ui event to delete the person.
        deletePerson: function() {
            this.model.destroy();
            state.set({ 'selectedPerson': null });
        },
        
        // is called to render the view
        render: function() {
            var model = this.model.toJSON();
            model.selected = this.model.selected;
            model.editMode = this.model.editMode;

            // set html of this element using [icanhaz](http://icanhazjs.com/)
            $(this.el).html(ich.person(model));
           
            // select this item     
            if (this.model.selected === true) {
                $(this.el).addClass('selected');
            } else {
                $(this.el).removeClass('selected');
            }
                       
            return this;
        },
        
        // is called to remove the element from dom with a slideUp animation
        remove: function() {
            $(this.el).slideUp(500, _.bind(function() {
                $(this.el).remove();
            }, this));
        }
        
    });
        
    // View: IndexView (index page)
    ns.IndexView = myApp.View.extend({
        el: '#index-view',
        
        initialize: function() {
            if (myApp.app.persons && !this.collection) {
                this.collection = myApp.app.persons;
            }
            if (this.collection) {
                this.collection.bind('reset', this.render, this);
                this.collection.bind('add', this.addPerson, this);
                this.collection.fetchNew();
            }
        },
        
        events: {
            'click #newPerson' : 'uiAddPerson'
        },
        
        uiAddPerson: function() {
            state.set({ 'topview': ns.AddView });
        },
                      
        // is called to render all visit models in this collection
        render: function() {
            this.collection.each(this.addPerson);
        },
        
        // creates a personView with the given person model and
        // appends it to the list element
        addPerson: function(person) {
            var view = new ns.PersonView({model: person});
            this.$('#persons').append(view.render().el);
        },
               
        open: function(fromRight) {
            $(this.el).show('slide', {direction: (fromRight ? 'right' : 'left') }, 500);
        },
        
        close: function(fromRight) {
            $(this.el).hide('slide', {direction: (fromRight ? 'left' : 'right') }, 500);
        }
    });
    
}(myApp));