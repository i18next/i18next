describe('determining language directionality', function(){
        
  i18n.init();

  it('returns ltr for en-US', function(){
    i18n.setLng('en-US');
    expect(i18n.dir()).to.equal('ltr');
  });

  it('returns ltr for unknown language', function(){
    i18n.setLng('unknown');
    expect(i18n.dir()).to.equal('ltr');
  });

  it('returns rtl for ar, ar-IR', function(){
    i18n.setLng('ar');
    expect(i18n.dir()).to.equal('rtl');
    i18n.setLng('ar-IR');
    expect(i18n.dir()).to.equal('rtl');
  })

});