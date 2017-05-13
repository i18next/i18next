import EventEmitter from '../src/EventEmitter';

describe('i18next', () => {
  let emitter;

  before(() => {
    emitter = new EventEmitter();
  });

  describe('published', () => {
    it('it should emit', (done) => {
      // test on
      emitter.on('ok', (payload) => {
        expect(payload).to.equal('data ok');
        done();
      });

      // test off
      const nok = (payload) => {
        expect(payload).to.equal('not called as off');
        done();
      }
      emitter.on('nok', nok);
      emitter.off('nok', nok);

      emitter.emit('nok', 'there should be no listener');
      emitter.emit('ok', 'data ok');
    });

    it('it should emit wildcard', (done) => {
      // test on
      emitter.on('*', (name, payload) => {
        expect(name).to.equal('ok');
        expect(payload).to.equal('data ok');
        done();
      });

      emitter.emit('ok', 'data ok');
    });
  });

});
