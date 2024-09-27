export default {
  transform: {},  // No transformations needed
  testEnvironment: 'node',  // Use Node.js environment for testing
  globals: {
    'ts-jest': {
      useESM: true  // Ensure Jest uses ES module support
    }
  }
}
