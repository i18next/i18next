/** @typedef {{}} TaskId */
/** @typedef {(...arg: any) => any} AnyFunction */

class TaskQueue {
  constructor() {
    /** @type {Array<{ id: TaskId, fn: AnyFunction , context: any }>} */
    this.tasks = [];
    /** @type {Array<{ id: TaskId, args: any[] }>} */
    this.finished = [];
  }

  /**
   * @returns {TaskId}
   */
  getNewTaskId() {
    return {};
  }

  /**
   * Add a task to the queue
   *
   * @param {AnyFunction} fn
   * @param {{ context?: any }} options
   * @returns {TaskId}
   */
  push(fn, options = {}) {
    const task = {
      id: this.getNewTaskId(),
      fn,
      context: options.context,
    };

    this.tasks.push(task);

    return task.id;
  }

  /**
   * Finish a task in queue
   *
   * @param {TaskId} taskId
   * @param {any[]} args
   */
  done(taskId, args = []) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);

    if (taskIndex > -1) {
      if (taskIndex === 0) {
        const task = this.tasks.shift();
        task.fn.apply(task.context, args);

        const taskInFinishedIndex = this.finished.findIndex(f => f.id === task.id);
        // remove the task from the finished queue
        if (taskInFinishedIndex > -1) {
          this.finished.splice(taskInFinishedIndex, 1);
        }

        // call next task if already finished
        const nextTask = this.tasks[0];
        const finished = nextTask ? this.finished.find(f => f.id === nextTask.id) : null;
        if (finished) {
          this.done(finished.id, finished.args);
        }
      } else {
        this.finished.push({
          id: taskId,
          args,
        });
      }
    }
  }
}

export default TaskQueue;
