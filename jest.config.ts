export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignore dist folder
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json', // Link to tsconfig
      diagnostics: false,        // Optional: disable type-checking in tests
      useESM: true               // Use ESM mode for ts-jest
    }],
  },
  extensionsToTreatAsEsm: ['.ts'],  // Treat .ts files as ES modules
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',   // Fix module resolution for TypeScript imports
  },
}
