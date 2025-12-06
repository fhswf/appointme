
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
            reporter: ['text', 'json', 'html', 'lcov'],
            include: [
                'src/helpers/services/auth_services.ts',
                'src/pages/Login.tsx',
                'src/helpers/services/csrf_service.ts',
                'src/helpers/services/user_services.ts'
            ],
        },
    },
});
