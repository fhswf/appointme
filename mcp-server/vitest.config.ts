import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['src/**/*.spec.ts'],
        exclude: ['build/**', 'node_modules/**'],
        reporters: ['default', 'junit'],
        outputFile: './junit.xml',
        coverage: {
            provider: 'v8',
            reporter: 'lcov',
        }
    },
})
