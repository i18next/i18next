import EventEmitter from '../src/EventEmitter';

describe('i18next', () => {
  describe('published', () => {
    let emitter;
    beforeEach(() => {
      emitter = new EventEmitter();
    });

    it('it should emit', done => {
      // test on
      emitter.on('ok', payload => {
        expect(payload).to.equal('data ok');
        done();
      });

      // test off
      const nok = payload => {
        expect(payload).to.equal('not called as off');
        done();
      };
      emitter.on('nok', nok);
      emitter.off('nok', nok);

      emitter.emit('nok', 'there should be no listener');
      emitter.emit('ok', 'data ok');
    });

    it('it should emit wildcard', done => {
      // test on
      emitter.on('*', (name, payload) => {
        expect(name).to.equal('ok');
        expect(payload).to.equal('data ok');
        done();
      });

      emitter.emit('ok', 'data ok');
    });

    it('it should emit with array params', done => {
      // test on
      emitter.on('array-event', (array, data) => {
        expect(array).to.eql(['array ok 1', 'array ok 2']);
        expect(data).to.equal('data ok');
        done();
      });

      emitter.emit('array-event', ['array ok 1', 'array ok 2'], 'data ok');
    });

    it('it should emit wildcard with array params', done => {
      // test on
      emitter.on('*', (ev, array, data) => {
        expect(ev).to.equal('array-event');
        expect(array).to.eql(['array ok 1', 'array ok 2']);
        expect(data).to.equal('data ok');
        done();
      });

      emitter.emit('array-event', ['array ok 1', 'array ok 2'], 'data ok');
    });

    it('it should return itself', () => {
      // test on
      const returned = emitter.on('*');

      expect(returned).to.equal(emitter);
    });
  });
});
