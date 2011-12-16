describe('Index View', function() {

    var views = window.myApp.views
      , collections = window.myApp.collections;

    beforeEach(function() {  
        setFixtures('<div id="index-view" ><ul id="persons" /><a id="newVisit" /></div>');
        this.view = new views.IndexView();
    });
    
    describe("Instantiation", function() {
          
        it("should use existing element", function() {
            expect(this.view.el.id).toEqual('index-view');
        });
  
    });
      
    describe("Rendering", function() {
        
        beforeEach(function() {
            setFixtures('<div id="index-view" ><ul id="persons" /><a id="newVisit" /></div>');
            
            this.personView = new Backbone.View();
            this.personView.render = function() {
                this.el = document.createElement('li');
                return this;
            };
            this.personRenderSpy = sinon.spy(this.personView, "render");
            this.personViewStub = sinon.stub(views, "PersonView").returns(this.personView);
            this.person1 = new Backbone.Model({ id: 1 });
            this.person2 = new Backbone.Model({ id: 2 });
            this.person3 = new Backbone.Model({ id: 3 });
            
            this.view.collection = new Backbone.Collection([this.person1, this.person2, this.person3]);
            this.view.el = $('#index-view');
            this.view.render();
        });
        
        afterEach(function() {
            this.personViewStub.restore();
        });
        
        it("should create a visit view for each visit item", function() {
            expect(this.personViewStub).toHaveBeenCalledThrice();
            expect(this.personViewStub).toHaveBeenCalledWith({ model: this.person1 });
            expect(this.personViewStub).toHaveBeenCalledWith({ model: this.person2 });
            expect(this.personViewStub).toHaveBeenCalledWith({ model: this.person3 });
        });
        
        it("should render each Visit view", function() {
            expect(this.personRenderSpy).toHaveBeenCalledThrice();
        });
        
        it("appends the visits to the visits list", function() {
            expect($('#persons').children().length).toEqual(3);
        });
        
    });

});