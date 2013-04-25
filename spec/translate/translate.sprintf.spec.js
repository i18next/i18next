describe('using sprintf', function() {

  var resStore = {
    dev: { translation: {  } },
    en: { translation: {  } },            
    'en-US': { 
      translation: {                      
        interpolationTest1: 'The first 4 letters of the english alphabet are: %s, %s, %s and %s',
        interpolationTest2: 'Hello %(users[0].name)s, %(users[1].name)s and %(users[2].name)s',
        interpolationTest3: 'The last letter of the english alphabet is %s'
      } 
    }
  };
  
  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
      function(t) { done(); });
  });

  it('it should replace passed in key/values', function() {
    expect(i18n.t('interpolationTest1', {postProcess: 'sprintf', sprintf: ['a', 'b', 'c', 'd']})).to.be('The first 4 letters of the english alphabet are: a, b, c and d');
    expect(i18n.t('interpolationTest2', {postProcess: 'sprintf', sprintf: { users: [{name: 'Dolly'}, {name: 'Molly'}, {name: 'Polly'}] } })).to.be('Hello Dolly, Molly and Polly');
  });

  it('it should recognize the sprintf syntax and automatically add the sprintf processor', function() {
    expect(i18n.t('interpolationTest1', 'a', 'b', 'c', 'd')).to.be('The first 4 letters of the english alphabet are: a, b, c and d');
    expect(i18n.t('interpolationTest3', 'z')).to.be('The last letter of the english alphabet is z');
  });
  
});