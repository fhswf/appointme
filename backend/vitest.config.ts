import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: ['build/**', 'node_modules/**'],
        reporters: ['default', 'junit'],
        outputFile: './TEST-backend.xml',
        coverage: {
            provider: 'v8',
            reporter: 'lcov',
        }
    },
})
