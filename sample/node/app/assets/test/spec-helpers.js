beforeEach(function() {

  this.validResponse = function(responseText) {
    return [
      200,
      {"Content-Type": "application/json"},
      JSON.stringify(responseText)
    ];
  };

});