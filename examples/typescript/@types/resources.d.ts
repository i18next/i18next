interface Resources {
  ns1: {
    title: 'Welcome!';
    description: {
      part1: 'This is just a basic example of how to use i18next with typescript';
      part2: '😉';
    };
    inter: 'interpolated {{val}}';
  };
  ns2: {
    description: {
      part1: 'In order to infer the appropriate type for t function, you should use type augmentation to override the Resources type.';
      part2: 'Check out the @types/i18next to see an example.';
    };
  };
}

export default Resources;
