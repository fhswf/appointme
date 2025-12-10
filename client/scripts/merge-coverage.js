import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import istanbulLibCoverage from 'istanbul-lib-coverage';

const { createCoverageMap } = istanbulLibCoverage;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Merge coverage from Vitest (coverage/coverage-final.json) 
 * and Playwright (.nyc_output/*.json) into .nyc_output
 */

const nycOutputDir = path.join(__dirname, '..', '.nyc_output');
const vitestCoverageFile = path.join(__dirname, '..', 'coverage', 'coverage-final.json');

// Ensure .nyc_output directory exists
if (!fs.existsSync(nycOutputDir)) {
    fs.mkdirSync(nycOutputDir, { recursive: true });
}

// Read Vitest coverage if it exists
let vitestCoverage = {};
if (fs.existsSync(vitestCoverageFile)) {
    console.log('Reading Vitest coverage from:', vitestCoverageFile);
    vitestCoverage = JSON.parse(fs.readFileSync(vitestCoverageFile, 'utf8'));
    console.log(`Found ${Object.keys(vitestCoverage).length} files in Vitest coverage`);
} else {
    console.log('No Vitest coverage found at:', vitestCoverageFile);
}

// Read existing Playwright coverage from .nyc_output
const playwrightCoverageFiles = fs.readdirSync(nycOutputDir)
    .filter(f => f.startsWith('coverage-') && f.endsWith('.json'));

console.log(`Found ${playwrightCoverageFiles.length} Playwright coverage files`);

// Create a coverage map
const coverageMap = createCoverageMap({});

// Add Vitest coverage
if (Object.keys(vitestCoverage).length > 0) {
    coverageMap.merge(vitestCoverage);
}

// Add Playwright coverage
playwrightCoverageFiles.forEach(file => {
    const filePath = path.join(nycOutputDir, file);
    const coverage = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    coverageMap.merge(coverage);
});

// Write merged coverage back to .nyc_output
const mergedCoverageFile = path.join(nycOutputDir, 'coverage-merged.json');
fs.writeFileSync(mergedCoverageFile, JSON.stringify(coverageMap.toJSON(), null, 2));

console.log(`Merged coverage written to: ${mergedCoverageFile}`);
console.log(`Total files in merged coverage: ${Object.keys(coverageMap.toJSON()).length}`);
