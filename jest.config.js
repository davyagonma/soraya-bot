/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/tests/**',
    '!src/docs/**',
    '!src/cron/**',
    '!src/providers/WhatsAppProvider.ts',
    '!src/controllers/TelegramController.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 35,
      lines: 55,
      statements: 55,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};
