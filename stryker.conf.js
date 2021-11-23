/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = function (config) {
  config.set({
    mutate: [
      "/home/jcgouleau/IdeaProjects/kataFunctionnal/kataaddition.spec.ts",
    ],
    mutator: "typescript",
    testRunner: "jest",
    reporters: ["progress", "clear-text", "html"],
    coverageAnalysis: "off",
    jest: {
      projectType: "custom",
      config: require("./jest.config.js"),
    },
    timeoutMS: 60000,
    maxConcurrentTestRunners: 4,
  });
};
