import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  reporters: [
    'default',
    ['jest-ctrf-json-reporter', { outputFile: 'common-ctrf.json', outputDir: '../ctrf' }],
  ],
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
