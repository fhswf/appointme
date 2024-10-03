import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  reporters: [
    'default',
    ['jest-ctrf-json-reporter', { outputFile: 'common-ctrf.json', outputDir: '../crtf' }],
  ],
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};

export default config;
