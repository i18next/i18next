# running test coverage

1) assert browserify-istanbul and karma-coverage in node_modules have istanbul removed from dependencies
2) assert we use gotwarlost/istanbul#source-map for now until https://github.com/karma-runner/karma-coverage/issues/157 gets solved
3) run gulp test (gulp tdd will not run coverage report)



using https://www.npmjs.com/package/npm-bump for versioning
