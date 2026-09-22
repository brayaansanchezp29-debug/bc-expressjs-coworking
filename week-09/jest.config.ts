import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.spec.ts'],
  testTimeout: 30000,
  clearMocks: true,
  // NOTA: todo el código fuente usa imports relativos con extensión '.js'
  // (estilo ESM: import ... from '../foo.js'), pero el proyecto compila a
  // CommonJS. El resolvedor de módulos de Jest (a diferencia de tsc) no
  // mapea automáticamente '.js' -> '.ts', y sin esto CADA test suite falla
  // con "Cannot find module './archivo.js'". Este mapper quita el '.js'
  // final de los imports relativos antes de resolverlos.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts', '!src/types/**', '!src/**/*.d.ts'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};

export default config;
