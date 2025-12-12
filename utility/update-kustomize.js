const fs = require('node:fs');
const path = require('node:path');
// Check if js-yaml is available, otherwise fail gracefully or fallback?
// Assuming it is available as patch-k8s.js used it.
const yaml = require('js-yaml');

const component = process.argv[2]; // 'backend' or 'client'
const imageName = process.argv[3]; // 'backend' or 'frontend'

if (!component || !imageName) {
    console.error("Usage: node update-kustomize.js <component> <imageName>");
    process.exit(1);
}

const branch = process.env.GITHUB_REF_NAME || process.env.CI_COMMIT_REF_NAME;
const version = process.argv[4]; // Passed as argument

if (!version) {
    console.error("Version argument not found");
    process.exit(1);
}

let overlay = '';
if (branch === 'prod') {
    overlay = 'prod';
} else if (branch === 'main') {
    overlay = 'dev';
} else {
    console.log(`Skipping k8s update for branch ${branch}`);
    process.exit(0);
}

const overlayPath = path.join(process.cwd(), 'k8s', 'overlays', overlay);
const kustomizationFile = path.join(overlayPath, 'kustomization.yaml');

if (!fs.existsSync(kustomizationFile)) {
    console.error(`kustomization.yaml not found at: ${kustomizationFile}`);
    process.exit(1);
}

console.log(`Updating ${overlay} kustomization for ${component} to version ${version}`);

try {
    const content = fs.readFileSync(kustomizationFile, 'utf8');
    const doc = yaml.load(content) || {};

    if (!doc.images) {
        doc.images = [];
    }

    const imageRef = `ghcr.io/fhswf/appointme/${imageName}`;
    const newTag = version;

    const existingImage = doc.images.find(img => img.name === imageRef);
    if (existingImage) {
        existingImage.newTag = newTag;
    } else {
        doc.images.push({
            name: imageRef,
            newTag: newTag
        });
    }

    fs.writeFileSync(kustomizationFile, yaml.dump(doc));
    console.log("Successfully updated kustomization.yaml");
} catch (error) {
    console.error("Failed to update kustomization.yaml", error);
    process.exit(1);
}
