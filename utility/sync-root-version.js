const semver = require('semver');

const releaseType = process.argv[2]; // 'major', 'minor', 'patch'
if (!releaseType) {
    console.error("Usage: node sync-root-version.js <releaseType>");
    process.exit(1);
}

const rootPkgPath = path.join(__dirname, '..', 'package.json');
const sonarPath = path.join(__dirname, '..', 'sonar-project.properties');

try {
    // 1. Update Root package.json
    if (!fs.existsSync(rootPkgPath)) {
        console.error(`Root package.json not found at: ${rootPkgPath}`);
        process.exit(1);
    }
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
    const oldVersion = rootPkg.version || "0.0.0";

    // Use semver for robust incrementing
    // Coerce first to recover from invalid formats like '1.36.0.1'
    const baseVersion = semver.coerce(oldVersion);
    if (!baseVersion) {
        console.error(`Could not coerce version from: ${oldVersion}`);
        process.exit(1);
    }

    const newVersion = semver.inc(baseVersion.version, releaseType);
    if (!newVersion) {
        console.error(`Invalid release type: ${releaseType}. Expected major, minor, or patch (or other semver types).`);
        process.exit(1);
    }

    rootPkg.version = newVersion;
    fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');
    console.log(`Bumped root version: ${oldVersion} -> ${newVersion} (${releaseType})`);

    // 2. Update Sonar Properties
    if (fs.existsSync(sonarPath)) {
        let sonarContent = fs.readFileSync(sonarPath, 'utf8');
        sonarContent = sonarContent.replace(/^sonar\.projectVersion=.*$/m, `sonar.projectVersion=${newVersion}`);
        fs.writeFileSync(sonarPath, sonarContent);
        console.log(`Updated sonar.projectVersion to ${newVersion} in ${sonarPath}`);
    } else {
        console.warn(`sonar-project.properties not found at: ${sonarPath}. Skipping.`);
    }

    // 3. Commit changes if in CI
    if (process.env.CI || process.env.GITHUB_ACTIONS) {
        const { execSync, execFileSync } = require('node:child_process');
        try {
            console.log("Committing root changes to git...");
            // Ensure git is configured if not already
            try {
                execSync('git config user.name "semantic-release-bot"');
                execSync('git config user.email "semantic-release-bot@martynus.net"');
            } catch (configError) {
                console.log("Git identity already set or could not be set.");
            }
            execFileSync('git', ['add', rootPkgPath, sonarPath]);
            execSync(`git commit -m "chore(release): update root version and sonar config to ${newVersion} [skip ci]" --allow-empty`);
            console.log("Successfully committed root changes.");
        } catch (error) {
            console.warn("Failed to commit root changes. This might be expected if no changes were detected or git is not available.", error.message);
        }
    }

} catch (error) {
    console.error("Failed to sync root version", error);
    process.exit(1);
}
