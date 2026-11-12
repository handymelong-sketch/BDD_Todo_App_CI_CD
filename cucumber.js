module.exports = {
  default: {
    requireModule: ['tsx/cjs'],
    require: ['features/support/**/*.ts', 'features/steps/**/*.ts'],
    format: ['progress-bar', 'html:reports/cucumber.html'],
  },
};
