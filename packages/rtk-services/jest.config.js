module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  transformIgnorePatterns: [],
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/../../node_modules'],
  moduleNameMapper: {
    '^msw$':
      '<rootDir>/../../node_modules/.pnpm/msw@2.12.2_@types+node@24.10.1_typescript@5.9.2/node_modules/msw',
    '^msw/(.*)$':
      '<rootDir>/../../node_modules/.pnpm/msw@2.12.2_@types+node@24.10.1_typescript@5.9.2/node_modules/msw/$1',
    '^@mswjs/(.*)$':
      '<rootDir>/../../node_modules/.pnpm/@mswjs+interceptors@0.40.0/node_modules/@mswjs/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts', '!src/__tests__/**'],
};
