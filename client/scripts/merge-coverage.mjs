import MCR from 'monocart-coverage-reports';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const coverageOptions = {
    name: 'AppointMe Coverage Report',
    outputDir: './coverage-merged',
    reports: [
        'v8',
        'console-summary',
        'lcovonly'
    ],
    // Clean cache implies we start fresh
    clean: true,
};

try {
    const mcr = MCR(coverageOptions);

    // 1. Add Unit Test Coverage (Istanbul/JSON)
    const unitCoveragePath = path.resolve(projectRoot, 'coverage/coverage-final.json');
    if (fs.existsSync(unitCoveragePath)) {
        console.log(`Adding unit coverage: ${unitCoveragePath}`);
        const unitData = JSON.parse(fs.readFileSync(unitCoveragePath, 'utf-8'));
        await mcr.add(unitData);
    } else {
        console.warn('Unit coverage not found at:', unitCoveragePath);
    }

    // 2. Add E2E Test Coverage (Istanbul/JSON from Playwright fixture)
    const e2eCoverageDir = path.resolve(projectRoot, '.coverage-e2e');
    if (fs.existsSync(e2eCoverageDir)) {
        const files = fs.readdirSync(e2eCoverageDir).filter(f => f.endsWith('.json'));
        console.log(`Found ${files.length} E2E coverage files in ${e2eCoverageDir}`);

        for (const file of files) {
            const filePath = path.join(e2eCoverageDir, file);
            try {
                const e2eData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                await mcr.add(e2eData);
            } catch (e) {
                console.error(`Failed to parse ${file}:`, e.message);
            }
        }
    } else {
        console.warn('E2E coverage directory not found at:', e2eCoverageDir);
    }

    // 3. Generate Merged Report
    await mcr.generate();
    console.log('Coverage merged successfully to ./coverage-merged');
} catch (err) {
    console.error('Merge failed:', err);
    process.exit(1);
}
