/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = function (config) {
  config.set({
    mutate: [
      "/home/jcgouleau/IdeaProjects/kataFunctionnal/kataFunctional.spec.ts",
    ],
    mutator: "typescript",
    testRunner: "jest",
    reporters: ["progress", "clear-text", "json"],
    coverageAnalysis: "off",
    jest: {
      projectType: "custom",
      config: require("./jest.config.js"),
    },
    timeoutMS: 60000,
    maxConcurrentTestRunners: 4,
  });
};
