const fs = require('node:fs');
const path = require('node:path');

const version = process.argv[2];
if (!version) {
    console.error('Usage: node set-version.js <version>');
    process.exit(1);
}

const packageJsonPath = path.join(process.cwd(), 'package.json');
try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.version = version;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`Updated ${packageJson.name} to version ${version}`);
} catch (error) {
    console.error(`Failed to update package.json: ${error.message}`);
    process.exit(1);
}
