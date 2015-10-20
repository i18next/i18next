describe('default i18next way', function() {

  var resStore = {
    dev: { translation: {  } },
    en: { translation: {  } },            
    'en-US': { 
      translation: {                      
        interpolationTest1: 'added __toAdd__',
        interpolationTest2: 'added __toAdd__ __toAdd__ twice',
        interpolationTest3: 'added __child.one__ __child.two__',
        interpolationTest4: 'added __child.grandChild.three__'
      } 
    }
  };
  
  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
      function(t) { done(); });
  });

  it('it should replace passed in key/values', function() {
    expect(i18n.t('interpolationTest1', {toAdd: 'something'})).to.be('added something');
    expect(i18n.t('interpolationTest2', {toAdd: 'something'})).to.be('added something something twice');
    expect(i18n.t('interpolationTest3', { child: { one: '1', two: '2'}})).to.be('added 1 2');
    expect(i18n.t('interpolationTest4', { child: { grandChild: { three: '3'}}})).to.be('added 3');
  });

  it('it should replace passed in key/values in replace member', function() {
    expect(i18n.t('interpolationTest1', { replace: {toAdd: 'something'} })).to.be('added something');
    expect(i18n.t('interpolationTest2', { replace: {toAdd: 'something'} })).to.be('added something something twice');
    expect(i18n.t('interpolationTest3', { replace: { child: { one: '1', two: '2'}} })).to.be('added 1 2');
    expect(i18n.t('interpolationTest4', { replace: { child: { grandChild: { three: '3'}}} })).to.be('added 3');
  });

  it("it should not escape HTML", function() {
    expect(i18n.t('interpolationTest1', {toAdd: '<html>'})).to.be('added <html>');
  });

  it('it should replace passed in key/values on defaultValue', function() {
    expect(i18n.t('interpolationTest5', {defaultValue: 'added __toAdd__', toAdd: 'something'})).to.be('added something');
  });

  it("it should escape dollar signs in replacement values", function() {
    expect(i18n.t('interpolationTest1', {toAdd: '$&'})).to.be('added $&');
  });

});

describe('default i18next way - different prefix/suffix', function() {

  var resStore = {
    dev: { translation: {  } },
    en: { translation: {  } },            
    'en-US': { 
      translation: {                      
        interpolationTest1: 'added *toAdd*',
        interpolationTest2: 'added *toAdd* *toAdd* twice',
        interpolationTest3: 'added *child.one* *child.two*',
        interpolationTest4: 'added *child.grandChild.three*'
      } 
    }
  };
  
  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { 
      resStore: resStore,
      interpolationPrefix: '*',
      interpolationSuffix: '*'
    }), function(t) { done(); });
  });

  it('it should replace passed in key/values', function() {
    expect(i18n.t('interpolationTest1', {toAdd: 'something'})).to.be('added something');
    expect(i18n.t('interpolationTest2', {toAdd: 'something'})).to.be('added something something twice');
    expect(i18n.t('interpolationTest3', { child: { one: '1', two: '2'}})).to.be('added 1 2');
    expect(i18n.t('interpolationTest4', { child: { grandChild: { three: '3'}}})).to.be('added 3');
  });

  it('it should replace passed in key/values on defaultValue', function() {
    expect(i18n.t('interpolationTest5', {defaultValue: 'added *toAdd*', toAdd: 'something'})).to.be('added something');
  });

});

describe('default i18next way - different prefix/suffix via options', function() {

  var resStore = {
    dev: { translation: {  } },
    en: { translation: {  } },            
    'en-US': { 
      translation: {                      
        interpolationTest1: 'added *toAdd*',
        interpolationTest2: 'added *toAdd* *toAdd* twice',
        interpolationTest3: 'added *child.one* *child.two*',
        interpolationTest4: 'added *child.grandChild.three*',
        interpolationTest5: 'added *count*',
        interpolationTest5_plural: 'added *count*'
      } 
    }
  };
  
  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { 
      resStore: resStore
    }), function(t) { done(); });
  });

  it('it should replace passed in key/values', function() {
    expect(i18n.t('interpolationTest1', {toAdd: 'something', interpolationPrefix: '*', interpolationSuffix: '*'})).to.be('added something');
    expect(i18n.t('interpolationTest2', {toAdd: 'something', interpolationPrefix: '*', interpolationSuffix: '*'})).to.be('added something something twice');
    expect(i18n.t('interpolationTest3', { child: { one: '1', two: '2'}, interpolationPrefix: '*', interpolationSuffix: '*'})).to.be('added 1 2');
    expect(i18n.t('interpolationTest4', { child: { grandChild: { three: '3'}}, interpolationPrefix: '*', interpolationSuffix: '*'})).to.be('added 3');
    expect(i18n.t('interpolationTest5', { count: 3, interpolationPrefix: '*', interpolationSuffix: '*'})).to.be('added 3');
  });

  it('it should replace passed in key/values on defaultValue', function() {
    expect(i18n.t('interpolationTest6', {defaultValue: 'added *toAdd*', toAdd: 'something', interpolationPrefix: '*', interpolationSuffix: '*'})).to.be('added something');
  });

});

describe('default i18next way - with escaping interpolated arguments per default', function () {
  var resStore = {
    dev: { translation: {  } },
    en: { translation: {  } },            
    'en-US': { 
      translation: {                      
        interpolationTest1: 'added __toAdd__',
        interpolationTest5: 'added __toAddHTML__',
        interpolationTest6: 'added __child.oneHTML__',
        interpolationTest7: 'added __toAddHTML__ __toAdd__',
        interpolationTest8: 'added __toAdd1__ __toAdd2__',
      } 
    }
  };

  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { 
      resStore: resStore,
      escapeInterpolation: true
    }), function(t) { done(); });
  });

  it("it should escape HTML", function() {
    expect(i18n.t('interpolationTest1', {toAdd: '<html>'})).to.be('added &lt;html&gt;');
  });

  it("it should not escape when HTML is suffixed", function() {
    expect(i18n.t('interpolationTest5', {toAdd: '<html>'})).to.be('added <html>');
    expect(i18n.t('interpolationTest6', { child: { one: '<1>'}})).to.be('added <1>');
  });

  it("should not accept interpolations from inside interpolations", function() {
      expect(i18n.t('interpolationTest8', { toAdd1: '__toAdd2HTML__', toAdd2: '<html>'})).to.be('added __toAdd2HTML__ &lt;html&gt;');
  });

  it("it should support both escaping and not escaping HTML", function() {
    expect(i18n.t('interpolationTest7', {toAdd: '<html>', escapeInterpolation: true})).to.be('added <html> &lt;html&gt;');
  });

  it("it should escape dollar signs in replacement values", function() {
    expect(i18n.t('interpolationTest1', {toAdd: '$&'})).to.be('added $&amp;');
  });

});

describe('default i18next way - with escaping interpolated arguments per default via options', function () {
  var resStore = {
    dev: { translation: {  } },
    en: { translation: {  } },            
    'en-US': { 
      translation: {                      
        interpolationTest1: 'added __toAdd__',
        interpolationTest5: 'added __toAddHTML__',
        interpolationTest6: 'added __child.oneHTML__',
        interpolationTest7: 'added __toAddHTML__ __toAdd__'
      } 
    }
  };

  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, { 
      resStore: resStore
    }), function(t) { done(); });
  });

  it("it should escape HTML", function() {
    expect(i18n.t('interpolationTest1', {toAdd: '<html>', escapeInterpolation: true})).to.be('added &lt;html&gt;');
  });

  it("it should not escape when HTML is suffixed", function() {
    expect(i18n.t('interpolationTest5', {toAdd: '<html>', escapeInterpolation: true})).to.be('added <html>');
    expect(i18n.t('interpolationTest6', { child: { one: '<1>', escapeInterpolation: true}})).to.be('added <1>');
  });

  it("it should support both escaping and not escaping HTML", function() {
    expect(i18n.t('interpolationTest7', {toAdd: '<html>', escapeInterpolation: true})).to.be('added <html> &lt;html&gt;');
  });

  it("it should escape dollar signs in replacement values", function() {
    expect(i18n.t('interpolationTest1', {toAdd: '$&'})).to.be('added $&amp;');
  });

});