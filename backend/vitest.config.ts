import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        reporters: ['junit'],
        outputFile: './TEST-backend.xml',
        coverage: {
            provider: 'v8',
            reporter: 'lcov',
        }
    },
})
