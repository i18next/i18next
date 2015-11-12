export default {

  processors: {},

  addPostProcessor(module) {
    this.processors[module.name] = module;
  },

  handle(processors, value, key, options) {
    processors.forEach((processor) => {
      if (this.processors[processor]) value = this.processors[processor].process(value, key, options);
    });

    return value;
  }

};
