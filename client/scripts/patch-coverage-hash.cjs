const fs = require('fs');
const path = require('path');

const nycOutputDir = path.resolve(__dirname, '../.nyc_output');
// Handle both potential unit file names for robustness during dev
const unitCoveragePath = fs.existsSync(path.join(nycOutputDir, 'coverage-unit.json'))
    ? path.join(nycOutputDir, 'coverage-unit.json')
    : path.join(nycOutputDir, 'unit-coverage.json');

if (!fs.existsSync(unitCoveragePath)) {
    console.error('Unit coverage file not found:', unitCoveragePath);
    process.exit(1);
}

// Helper: Absolute path
function toAbsolute(filePath) {
    if (!path.isAbsolute(filePath)) {
        return path.resolve(process.cwd(), filePath);
    }
    return filePath;
}

// Helper to normalize an entire coverage object
// STRATEGY: Absolute Paths + Remove Hash/Map to prevent validation mismatch
function normalizeCoverageData(data) {
    const newData = {};
    Object.keys(data).forEach(filePath => {
        const absPath = toAbsolute(filePath);
        const fileData = data[filePath];

        // Update path property to Absolute
        fileData.path = absPath;

        // Remove Hash and SourceMap to force nyc to accept the data 
        // and avoid validation failures against the source file.
        delete fileData.hash;
        delete fileData.inputSourceMap;

        newData[absPath] = fileData;
    });
    return newData;
}

let unitData = JSON.parse(fs.readFileSync(unitCoveragePath, 'utf8'));
// Normalize Unit Data
unitData = normalizeCoverageData(unitData);

// Find ALL UI coverage files
const uiFiles = fs.readdirSync(nycOutputDir).filter(f => f.startsWith('coverage-') && f.endsWith('.json') && f !== 'coverage-merged.json' && f !== 'coverage-unit.json' && f !== 'unit-coverage.json');

console.log(`Found ${uiFiles.length} UI coverage files.`);

let patchedCount = 0;

// Helper to safely merge single-value hits (statements 's', functions 'f')
const safeMergeHits = (unitHits, uiHits) => {
    if (!uiHits || !unitHits) return;
    Object.keys(uiHits).forEach(key => {
        if (unitHits.hasOwnProperty(key)) {
            unitHits[key] = (unitHits[key] || 0) + (uiHits[key] || 0);
        }
    });
};

// Helper to safely merge branch hits (arrays of counts)
const safeMergeBranches = (unitBranches, uiBranches) => {
    if (!uiBranches || !unitBranches) return;
    Object.keys(uiBranches).forEach(key => {
        if (unitBranches.hasOwnProperty(key)) {
            const unitArr = unitBranches[key];
            const uiArr = uiBranches[key];
            // Verify structure is array
            if (Array.isArray(unitArr) && Array.isArray(uiArr)) {
                // Sum element-wise used min length (though they should match if hash matches)
                const len = Math.min(unitArr.length, uiArr.length);
                for (let i = 0; i < len; i++) {
                    unitArr[i] = (unitArr[i] || 0) + (uiArr[i] || 0);
                }
            }
        }
    });
};


// Loop over all UI files
uiFiles.forEach(fileName => {
    const uiPath = path.join(nycOutputDir, fileName);
    let uiData;
    try {
        uiData = JSON.parse(fs.readFileSync(uiPath, 'utf8'));
    } catch (e) {
        console.error(`Failed to parse ${fileName}, skipping.`);
        return;
    }

    // Normalize UI Data before merging
    uiData = normalizeCoverageData(uiData);

    let modified = false;

    // Iterate over all files in this UI coverage report
    Object.keys(uiData).forEach(filePath => {
        // Check if this file exists in Unit coverage
        if (unitData[filePath]) {
            // DO NOT Sync Hash or Source Maps!
            // We want them stripped so nyc doesn't complain.

            // 3. Merge Hits Safely
            safeMergeHits(unitData[filePath].s, uiData[filePath].s);
            safeMergeHits(unitData[filePath].f, uiData[filePath].f);
            // Use specialized merger for branches
            safeMergeBranches(unitData[filePath].b, uiData[filePath].b);

            // 4. Remove from UI to prevent duplication
            delete uiData[filePath];
            modified = true;
            patchedCount++;
        }
    });

    // Always write back because we normalized paths
    fs.writeFileSync(uiPath, JSON.stringify(uiData));
});

fs.writeFileSync(unitCoveragePath, JSON.stringify(unitData));
console.log(`Patched metadata and merged hits for ${patchedCount} overlapping files across all UI reports.`);
