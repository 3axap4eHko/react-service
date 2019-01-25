module.exports = {
  verbose: true,
  'moduleFileExtensions': ['js', 'jsx', 'jss', 'json', 'jsxm', 'node'],
  'unmockedModulePathPatterns': [
    'node_modules/react/',
    'node_modules/enzyme/',
  ],
  'modulePathIgnorePatterns': [
    '<rootDir>/build',
  ],
  'testMatch': [
    '<rootDir>/src/__tests__/*.js',
  ],
  'setupFiles': [
    '<rootDir>/jest.setup.js'
  ],
};
