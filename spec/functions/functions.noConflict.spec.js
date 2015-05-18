describe('Global variable conflict', function () {

  it('it should rename global "window.i18n" to "window.i18next"' + 
    ' and restore window.i18n conflicting reference', function () {

    window.i18n.noConflict();

    expect(window.i18n.isFakeConflictingLib).to.be(true);
    expect(window.i18next).to.be.an(Object);
    expect(window.i18next.t).to.be.a(Function);
  });
});