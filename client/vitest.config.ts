import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
    plugins: [react()],
    define: {
        'import.meta.env.REACT_APP_API_URL': JSON.stringify('http://localhost:5000/api/v1'),
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },

    },
    server: {
        fs: {
            allow: ['..'],
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/tests/setup.ts',
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default', 'junit'],
        outputFile: './test-results/junit-report.xml',
        coverage: {
            provider: 'istanbul',
            include: [
                'src/**/*.{ts,tsx}'
            ],
            reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
            reportsDirectory: 'coverage',
            exclude: [
                'src/**/*.spec.tsx',
                'src/**/*.test.tsx',
                'src/test/**',
                'src/tests/**',
                'src/vite-env.d.ts'
            ],
        },
    },
});
