
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { loadDir } from '../config/env.js';

vi.mock('node:fs');
vi.mock('../logging.js', () => ({
    logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    }
}));

describe('config/env', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.TEST_VAR = undefined;
    });

    it('should skip if directory does not exist', () => {
        (fs.existsSync as any).mockReturnValue(false);
        loadDir('/non/existent');
        expect(fs.readdirSync).not.toHaveBeenCalled();
    });

    it('should load files from directory', () => {
        (fs.existsSync as any).mockReturnValue(true);
        (fs.readdirSync as any).mockReturnValue(['file1']);
        (fs.statSync as any).mockReturnValue({ isFile: () => true });
        (fs.readFileSync as any).mockReturnValue('value1');

        loadDir('/test/dir');

        expect(process.env.file1).toBe('value1');
    });

    it('should ignore subdirectories', () => {
        (fs.existsSync as any).mockReturnValue(true);
        (fs.readdirSync as any).mockReturnValue(['subdir']);
        (fs.statSync as any).mockReturnValue({ isFile: () => false });

        loadDir('/test/dir');

        expect(fs.readFileSync).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', () => {
        (fs.existsSync as any).mockReturnValue(true);
        (fs.readdirSync as any).mockImplementation(() => { throw new Error('Permission denied'); });

        expect(() => loadDir('/test/dir')).not.toThrow();
    });
});
