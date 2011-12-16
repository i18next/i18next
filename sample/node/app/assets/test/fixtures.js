beforeEach(function() {
  
  this.fixtures = {
    
    Persons: {
      valid: { // response starts here
        "status": "OK",
        "version": "1.0",
        "response": {
          "persons": [
            {"firstname":"Hans","lastname":"Muster","id":"1"},
            {"firstname":"Herbert","lastname":"Kuster","id":"2"}
          ]
        }
      } 
    }
    
  };
  
});