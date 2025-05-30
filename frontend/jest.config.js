module.exports = {
  preset: 'react-scripts',
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
  },
  transformIgnorePatterns: [
    'node_modules/(?!(axios)/)'
  ],
  testEnvironment: 'jsdom'
};