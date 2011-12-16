describe('App View', function() {
    
    var calix = window.calix 
      , views = calix.views
      , state = calix.state
      , app = calix.app;

    // subject
    app.view = new views.AppView();

    describe('view loading', function() {
        beforeEach(function() {            
            this.stubView = calix.View.extend({});
            this.indexViewStub = sinon.stub(views, 'IndexView').returns(new this.stubView());
            
            state.set({ topview: this.indexViewStub });
        });  
        
        afterEach(function() {
            this.indexViewStub.restore();
        });
           
        it('should create the view on first call', function() {
            expect(this.indexViewStub).toHaveBeenCalledOnce();
        });
        
        describe('caching', function() {
            beforeEach(function() {
                state.set({ topview: this.indexViewStub });
            });
            
            it('should take the view from cache on following calls', function() {
                expect(this.indexViewStub).toHaveBeenCalledOnce();
            });
        });
    });
    
    describe('page interaction', function() {
    
        beforeEach(function() {
            this.stubViews = {
                stubView1: calix.View.extend({ open: function(){}, close: function(){} }),
                stubView2: calix.View.extend({ open: function(){}, close: function(){} })
            };
            
            this.stubViewInstance1 = new this.stubViews.stubView1();
            this.stubViewInstance1.debugName = 'stubViewInstance1';
            this.closeSpy = sinon.spy(this.stubViewInstance1, 'close');
            this.closeStub = sinon.stub(this.stubViews, 'stubView1').returns(this.stubViewInstance1);
             
            this.stubViewInstance2 = new this.stubViews.stubView2();
            this.stubViewInstance2.debugName = 'stubViewInstance2';
            this.openSpy = sinon.spy(this.stubViewInstance2, 'open');
            this.openStub = sinon.stub(this.stubViews, 'stubView2').returns(this.stubViewInstance2);

            state.set({ topview: this.closeStub });
            state.set({ topview: this.openStub });
        });
        
        afterEach(function() {
            this.closeStub.restore();
            this.openStub.restore();
        });  
        
        it('should close the old view', function() {
            expect(this.closeSpy).toHaveBeenCalledOnce();
        });
                
        it('should open the new view', function() {
            expect(this.openSpy).toHaveBeenCalledOnce();
        });

    });

});