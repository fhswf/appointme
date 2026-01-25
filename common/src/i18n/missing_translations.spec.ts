import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { de } from './locales/de';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { it as itLocale } from './locales/it';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { zh } from './locales/zh';

const locales: Record<string, Record<string, string>> = {
    de,
    en,
    es,
    fr,
    it: itLocale,
    ja,
    ko,
    zh,
};

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'build' && file !== 'coverage') {
                getAllFiles(dirPath + '/' + file, arrayOfFiles);
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                arrayOfFiles.push(path.join(dirPath, '/', file));
            }
        }
    });

    return arrayOfFiles;
}

describe('Missing translations', () => {
    it('should have all keys used in t("...") in all locale files', () => {
        const commonDir = path.resolve(__dirname, '../../');
        // Repo root is 3 levels up: common/src/i18n -> common/src -> common -> root
        const repoRoot = path.resolve(__dirname, '../../../');



        const scanDirs = [
            path.join(repoRoot, 'client/src'),
            path.join(repoRoot, 'backend/src'),
            path.join(repoRoot, 'common/src'),
        ];

        const usedKeys = new Set<string>();
        const usageLocations: Record<string, string[]> = {};


        scanDirs.forEach(dir => {
            if (fs.existsSync(dir)) {

                const files = getAllFiles(dir);
                files.forEach(file => {
                    // specific exclusion for this test file to avoid self-matching
                    if (file === __filename) return;
                    if (file.includes('common/src/i18n/locales')) return; // exclude locale definitions

                    const content = fs.readFileSync(file, 'utf-8');
                    // Regex to match t("key") or t('key')
                    // We handle both single and double quotes
                    const regex = /\bt\(['"]([^'"]+)['"]\)/g;
                    let match;
                    while ((match = regex.exec(content)) !== null) {
                        const key = match[1];
                        // exclude dynamic keys if checks are too noisy, but for now scan all
                        // We assume simple keys. If it contains variable syntax ${}, it might be dynamic, skip those
                        if (!key.includes('${') && !key.includes(' + ')) {
                            usedKeys.add(key);
                            if (!usageLocations[key]) {
                                usageLocations[key] = [];
                            }
                            usageLocations[key].push(file);
                        }
                    }
                });
            } else {
                console.warn('Directory not found:', dir);
            }
        });

        const missingKeys: Record<string, string[]> = {};

        Object.keys(locales).forEach(lang => {
            const localeKeys = Object.keys(locales[lang]);
            usedKeys.forEach(key => {
                if (!localeKeys.includes(key)) {
                    if (!missingKeys[lang]) {
                        missingKeys[lang] = [];
                    }
                    missingKeys[lang].push(key);
                }
            });
        });

        // Report missing keys
        if (Object.keys(missingKeys).length > 0) {
            console.error('Missing translations found:', JSON.stringify(missingKeys, null, 2));
            // Also log locations for the first few missing keys to help debugging
            Object.entries(missingKeys).forEach(([lang, keys]) => {
                keys.slice(0, 5).forEach(k => {
                    console.error(`Key "${k}" missing in ${lang}, used in:`, usageLocations[k]?.slice(0, 2));
                });
            });
        }

        expect(Object.keys(missingKeys).length).toBe(0);
    });
});
