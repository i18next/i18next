describe('with default variables', function() {

  var defaultVariables = {
    name: 'John'
  };

  beforeEach(function(done) {
    i18n.init(
      i18n.functions.extend(opts, { defaultVariables: defaultVariables }),
      function(t) { done(); }
    );
  });

  it('it should use default variable', function() {
    expect(i18n.t('Hello __name__')).to.be('Hello John');
  });

  it('it should replace default variable', function() {
    expect(i18n.t('Hello __name__', {name: 'Ben'})).to.be('Hello Ben');
  });

});
