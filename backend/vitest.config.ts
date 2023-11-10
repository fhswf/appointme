import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        reporters: ['junit'],
        outputFile: './TEST-backend.xml'
    },
})
