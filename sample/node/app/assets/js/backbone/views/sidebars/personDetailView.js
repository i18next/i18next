(function(myApp) {
    var ns = myApp.views || extend(myApp, 'myApp.views')
      , models = myApp.models
      , collections = myApp.collections
      , formHelpers = myApp.views.shared.helpers.formHelpers
      , state = myApp.state
      , PersonItemView;
    
    
    PersonItemView = myApp.View.extend({
        tagName: 'li',
        
        className: 'personItem',
        
        initialize: function() {
            // bind changes in the underlying model to the matching function.
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.remove, this);
            
            this.model.parent.bind('change:selectedPerson', this.toggleSelectedState, this);
        },
        
        // route ui events to functions
        events: {
            'click .itemcontent' : 'uiSelectPerson',
            'click .removePerson' : 'uiRemovePerson'
        },
        
        uiSelectPerson: function() {
            if (this.model.parent.get('selectedPerson') !== this.model) {
                this.model.parent.set({selectedPerson: this.model});
            } else {
                this.model.parent.unset('selectedPerson');
            }
        },
        
        uiRemovePerson: function(e) {
            e.preventDefault();
            
            this.model.destroy();
        },
        
        toggleSelectedState: function() {
            if (this.model.parent.get('selectedPerson') === this.model) {
                if (this.model.selected === true) return;
            
                this.model.selected = true;
                this.render();
            } else {
                if (this.model.selected === false) return;
                
                this.model.selected = false;
                this.render();
            }
        },
        
        // is called to render the view
        render: function() {
            var model = this.model.toJSON();
            model.selected = this.model.selected;

            // set html of this element using [icanhaz](http://icanhazjs.com/)
            $(this.el).html(ich.personItem(model));
            
            if (this.model.selected === true) {
                // select this item            
                $(this.el).addClass('selected');
            } else {
                $(this.el).removeClass('selected');
            }
            
            return this;
        }
    });
          
    // View: Sidebar
    ns.PersonDetailView = myApp.View.extend({
        el: '#sidebar',
        
        initialize: function() {
            _.bindAll(this, 'render');
        
            this.bindState('change:selectedPerson', this.setModel, this);
        },
        
        events: {
        },
        
        setModel: function() {
            $(this.el).hide();
            this.model = state.get('selectedPerson');
            if (this.model && this.model.bind) {
                this.model.bind('change:persons', this.render, this);
            }
            this.render();
            this.open();
        },
                                       
        // is called to render all visit models in this collection
        render: function() {
            $(this.el).html(ich.personSidebar(this.model.toJSON()));
            
            var persons = this.model.get('persons');
            var ele = this.$('#persons');
            if (persons) {
                for (i = 0, len = persons.models.length; i < len; i++) {
                    var model = persons.models[i];
                    model.parent = this.model;
                    var view = new PersonItemView({model: model});
                    ele.append(view.render().el);
                }
            }            
            
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