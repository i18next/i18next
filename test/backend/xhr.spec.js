import XHR from 'i18next-xhr-backend';
import Interpolator from '../../src/Interpolator';

describe('XHR backend', () => {
  let backend;

  before(() => {
    backend = new XHR({
      interpolator: new Interpolator()
    }, {
      loadPath: 'http://localhost:9876/locales/{{lng}}/{{ns}}.json'
    });
  });

  describe('#read', () => {

    it('should load data', (done) => {
      backend.read('en', 'test', function(err, data) {
        expect(err).to.be.not.ok;
        expect(data).to.eql({key: 'passing'});
        done();
      });
    });

    it('should through error on not existing file', (done) => {
      backend.read('en', 'notexisting', function(err, data) {
        expect(err).to.equal('failed loading http://localhost:9876/locales/en/notexisting.json');
        done();
      });
    });

    it('should through error on non json file', (done) => {
      backend.read('en', 'nonjson', function(err, data) {
        expect(err).to.equal('failed parsing http://localhost:9876/locales/en/nonjson.json to json');
        done();
      });
    });

  });

});
