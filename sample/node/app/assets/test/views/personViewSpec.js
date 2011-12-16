describe("Person View", function() {
        
    beforeEach(function() {

        setFixtures('<ul class="persons"></ul>');
        
        this.model = new Backbone.Model({
            id: 1,
            firstname: "Hans",
            lastname: "Muster"
        });
        
        this.view = new window.myApp.views.PersonView({ model: this.model });
        
    });

    describe("Rendering", function() {
        
        it("returns the view object", function() {
            expect(this.view.render()).toEqual(this.view);
        });
        
        describe("Template", function() {
            
            beforeEach(function() {
                $('.persons').append(this.view.render().el);
            });
                            
            it("has the correct title text", function() {
                expect($(this.view.el).find('.name')).toHaveText('Hans Muster');
                // or
                expect($('.persons').find('.name')).toHaveText('Hans Muster');
            });
        });
        
    });

});