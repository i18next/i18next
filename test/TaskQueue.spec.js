import TaskQueue from '../src/TaskQueue';

describe('TaskQueue', () => {
  /** @type {TaskQueue} */
  let queue;

  beforeEach(() => {
    queue = new TaskQueue();
  });

  describe('#getNewTaskId', () => {
    it('it should return new generated id every call', () => {
      expect(queue.getNewTaskId()).to.not.equal(queue.getNewTaskId());
    });
  });

  it('it should resolve task in order', () => {
    const result = [];

    const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

    const task1 = queue.push(() => result.push(1));
    const task2 = queue.push(() => result.push(2));
    const task3 = queue.push(() => result.push(3));

    return Promise.all([
      sleep(200).then(() => queue.done(task1)),
      sleep(500).then(() => queue.done(task2)),
      sleep(100).then(() => queue.done(task3)),
    ]).then(() => {
      expect(result).to.deep.equals([1, 2, 3]);
    });
  });
});
