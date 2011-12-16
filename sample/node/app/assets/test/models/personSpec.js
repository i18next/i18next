describe('Person Model', function() {

    var models = window.myApp.models;
        
    beforeEach(function() {
        this.person = new models.Person({
            firstname: 'Hans',
            lastname: 'Muster'
        });
    });

    describe('when instantiated', function() {
    
        it('should exhibit attributes', function() {            
            expect(this.person.get('firstname')).toEqual('Hans');
        });
            
    });
    
    describe('validation', function() {
        
        beforeEach(function() {
            this.eventSpy = sinon.spy();
            this.person.bind("error", this.eventSpy);
        });
        
        it('should not set reason to empty string', function() {             
            this.person.set({ firstname: '' });
            
            expect(this.eventSpy).toHaveBeenCalledOnce();
            expect(this.eventSpy).toHaveBeenCalledWith(this.person, 'cannot have an empty firstname');
        });
        
    });
    
    describe('url', function() {
        
        beforeEach(function() {
            var collection = {
                url: '/data/persons'
            };
            this.person.collection = collection;
        });
        
        describe('when no id is set', function() {
            it('should return the collection URL', function() {
                expect(this.person.url()).toEqual('/data/addPerson');
            });
        });
        
        describe('when id is set', function() {
            it('should return the collection URL and id', function() {
                this.person.id = 1;
                expect(this.person.url()).toEqual('/data/persons/1');
            });
        });
        
    });
  
});