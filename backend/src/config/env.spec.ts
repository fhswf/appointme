
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { loadDir } from './env';

// Mock fs and logger
vi.mock('node:fs');
vi.mock('../logging.js', () => ({
    logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
}));

describe('loadDir', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv };
        vi.clearAllMocks();
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('should load env vars from files in the directory into process.env', () => {
        const dirPath = '/etc/config';
        const vars = {
            'API_URL': 'http://localhost:3000',
            'FEATURE_FLAG': 'true',
        };

        // Mock fs.existsSync to return true for the directory
        vi.mocked(fs.existsSync).mockReturnValue(true);

        // Mock fs.readdirSync to return the list of files
        vi.mocked(fs.readdirSync).mockReturnValue(Object.keys(vars) as any);

        // Mock fs.statSync to return isFile() = true
        vi.mocked(fs.statSync).mockReturnValue({ isFile: () => true } as any);

        // Mock fs.readFileSync to return the content of the files
        vi.mocked(fs.readFileSync).mockImplementation((path: any) => {
            const fileName = String(path).split('/').pop();
            return vars[fileName as keyof typeof vars] || '';
        });

        loadDir(dirPath);

        expect(process.env.API_URL).toBe('http://localhost:3000');
        expect(process.env.FEATURE_FLAG).toBe('true');
    });

    it('should skip if directory does not exist', () => {
        const dirPath = '/non/existent/path';
        vi.mocked(fs.existsSync).mockReturnValue(false);

        loadDir(dirPath);

        // Should not throw and not try to read dir
        expect(fs.readdirSync).not.toHaveBeenCalled();
    });

    it('should ignore subdirectories', () => {
        const dirPath = '/etc/config';

        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.readdirSync).mockReturnValue(['SUBDIR', 'CONFIG_FILE'] as any);

        vi.mocked(fs.statSync).mockImplementation((path: any) => {
            if (String(path).endsWith('SUBDIR')) {
                return { isFile: () => false } as any;
            }
            return { isFile: () => true } as any;
        });

        vi.mocked(fs.readFileSync).mockReturnValue('config_value');

        loadDir(dirPath);

        expect(process.env.CONFIG_FILE).toBe('config_value');
        expect(process.env.SUBDIR).toBeUndefined();
    });

    it('should handle errors gracefully', () => {
        const dirPath = '/etc/config';
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.readdirSync).mockImplementation(() => {
            throw new Error('Permission denied');
        });

        expect(() => loadDir(dirPath)).not.toThrow();
    });
});
