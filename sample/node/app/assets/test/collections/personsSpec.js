describe('Person Collection', function() {

    var models = window.myApp.models
      , collections = window.myApp.collections;
      
    beforeEach(function() { 
        this.persons = new collections.Persons();
    });

    describe("when instantiated with model literal", function() {
        
        beforeEach(function() {
            this.personStub = sinon.stub(models, "Person");
            this.model = new Backbone.Model({ id: 5, firstname: "Foo", lastname: "Bar" });
            this.personStub.returns(this.model);
            
            this.persons = new collections.Persons();
            this.persons.model = models.Person; // reset model relationship to use stub

            this.persons.add({ id: 5, firstname: "Bar", lastname: "Foo" });
        });
        
        afterEach(function() {
            this.personStub.restore();
        });
        
        it("should add a model", function() {
            expect(this.persons.length).toEqual(1);
            expect(this.personStub).toHaveBeenCalled();
        });
        
        it("should find a model by id", function() {
            expect(this.persons.get(5).get("id")).toEqual(5);
            expect(this.persons.get(5).get("firstname")).toEqual("Foo"); // won't return 'Bar' because you use Stub
        });
        
        
        it("should find a model by index", function() {
            expect(this.persons.at(0).get("id")).toEqual(this.model.get("id"));
        });
        
        it("should have called the Person constructor", function() {
            expect(this.personStub).toHaveBeenCalledOnce();
            expect(this.personStub).toHaveBeenCalledWith({
                id: 5,
                firstname: "Bar",
                lastname: "Foo"
            });
        });
        
    });
    
    describe('server interacion', function() {
    
        beforeEach(function() {
            this.fixture = this.fixtures.Persons.valid;
            this.server = sinon.fakeServer.create();
            this.server.respondWith("GET", "/data/persons", this.validResponse(this.fixture));
        });
        
        afterEach(function() {
            this.server.restore();
        });
               
        it("should parse visits from the response", function() {
            this.persons.fetch();
            this.server.respond();
            expect(this.persons.length).toEqual(this.fixture.response.persons.length);
            expect(this.persons.get(1).get('firstname')).toEqual(this.fixture.response.persons[0].firstname);
        });
    
    });
    
});