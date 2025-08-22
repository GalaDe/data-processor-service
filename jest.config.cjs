/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  globals: {
    'ts-jest': {
      tsconfig: {
        noEmit: true,
        sourceMap: true,
        inlineSourceMap: true,
        inlineSources: true,
        types: ['jest', 'node']
      }
    }
  }
};
