describe('context usage', function() {

  describe('basic usage', function() {
    var resStore = {
        dev: { 'ns.2': { 
            friend_context: 'A friend from ns2',
            friend_context_male: 'A boyfriend from ns2',
            friend_context_female: 'A girlfriend from ns2'
          }
        },
        en: { 'ns.1': { 
            friend_context: 'A friend',
            friend_context_male: 'A boyfriend',
            friend_context_female: 'A girlfriend'
          } 
        },            
        'en-US': { translation: { } }
    };

    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { 
          resStore: resStore, 
          ns: { namespaces: ['ns.1', 'ns.2'], defaultNs: 'ns.1'} 
        }),
        function(t) { done(); });
    });

    it('it should provide correct context form', function() {
      expect(i18n.t('friend_context')).to.be('A friend');
      expect(i18n.t('friend_context', {context: ''})).to.be('A friend');
      expect(i18n.t('friend_context', {context: 'male'})).to.be('A boyfriend');
      expect(i18n.t('friend_context', {context: 'female'})).to.be('A girlfriend');
    });

    it('it should provide correct context form for second namespace', function() {
      expect(i18n.t('ns.2:friend_context')).to.be('A friend from ns2');
      expect(i18n.t('ns.2:friend_context', {context: ''})).to.be('A friend from ns2');
      expect(i18n.t('ns.2:friend_context', {context: 'male'})).to.be('A boyfriend from ns2');
      expect(i18n.t('ns.2:friend_context', {context: 'female'})).to.be('A girlfriend from ns2');
    });
  });

  describe('extended usage - in combination with plurals', function() {
    var resStore = {
        dev: { translation: { } },
        en: { translation: { 
            friend_context: '__count__ friend',
            friend_context_male: '__count__ boyfriend',
            friend_context_female: '__count__ girlfriend',
            friend_context_plural: '__count__ friends',
            friend_context_male_plural: '__count__ boyfriends',
            friend_context_female_plural: '__count__ girlfriends'
          } 
        },            
        'en-US': { translation: { } }
    };
    
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
        function(t) { done(); });
    });

    it('it should provide correct context with plural forms', function() {
      expect(i18n.t('friend_context', { count: 1 })).to.be('1 friend');
      expect(i18n.t('friend_context', {context: '', count: 1 })).to.be('1 friend');
      expect(i18n.t('friend_context', {context: 'male', count: 1 })).to.be('1 boyfriend');
      expect(i18n.t('friend_context', {context: 'female', count: 1 })).to.be('1 girlfriend');
      
      expect(i18n.t('friend_context', { count: 10 })).to.be('10 friends');
      expect(i18n.t('friend_context', {context: '', count: 10 })).to.be('10 friends');
      expect(i18n.t('friend_context', {context: 'male', count: 10 })).to.be('10 boyfriends');
      expect(i18n.t('friend_context', {context: 'female', count: 10 })).to.be('10 girlfriends');
    });

  });

});