export default {
  processors: {},

  addPostProcessor(module) {
    this.processors[module.name] = module;
  },

  handle(processors, value, key, opt, translator) {
    processors.forEach(processor => {
      if (this.processors[processor])
        value = this.processors[processor].process(value, key, opt, translator);
    });

    return value;
  },
};
