
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const logoPath = path.join(projectRoot, 'public', 'logo.svg');
const logoNoTextPath = path.join(projectRoot, 'public', 'logo_no_text.svg');
const tempBakedLogoPath = path.join(projectRoot, 'public', 'logo_baked.svg');
const tempBakedLogoNoTextPath = path.join(projectRoot, 'public', 'logo_no_text_baked.svg');

function bakeSvgMap(svgContent) {
    const rootMatch = svgContent.match(/:root\s*{([^}]*)}/);
    if (!rootMatch) return {};
    const varBlock = rootMatch[1];
    const vars = {};
    varBlock.split(';').forEach(line => {
        const parts = line.split(':');
        if (parts.length === 2) {
            vars[parts[0].trim()] = parts[1].trim();
        }
    });
    return vars;
}

function processSvg(inputPath, outputPath, isNoText = false) {
    let svgContent = fs.readFileSync(inputPath, 'utf8');
    const vars = bakeSvgMap(svgContent);

    // Replace variables
    for (const [key, value] of Object.entries(vars)) {
        const regex = new RegExp(`var\\(${key}\\)`, 'g');
        svgContent = svgContent.replace(regex, value);
    }

    // Handle the circle fill for transparency
    // The user wants the circle to be white, but the CORNERS to be transparent.
    // In the original file: <circle cx="256" cy="256" r="256" fill="var(--color-white)"/>
    // --color-white is hsl(0, 0%, 100%) which is white.
    // So preserving this fill is actually CORRECT for the circle itself.
    // The issue "black icons" usually comes because the variables aren't resolved at all, defaulting to black.
    // If we bake them, the fill will be "#ffffff" (or hsl), which sharp understands.
    // Transparency outside the viewBox/circle is natural for PNG unless a background is forced.

    fs.writeFileSync(outputPath, svgContent);
    console.log(`Created baked SVG: ${outputPath}`);
}

try {
    console.log('Baking SVGs...');
    processSvg(logoPath, tempBakedLogoPath);
    processSvg(logoNoTextPath, tempBakedLogoNoTextPath, true);

    console.log('Generating PNGs...');
    // logo192
    execSync(`npx -y sharp-cli -i "${tempBakedLogoPath}" -o "${path.join(projectRoot, 'public', 'logo192.png')}" resize 192`);

    // logo512
    execSync(`npx -y sharp-cli -i "${tempBakedLogoPath}" -o "${path.join(projectRoot, 'public', 'logo512.png')}" resize 512`);

    // favicon intermediate
    const faviconPngPath = path.join(projectRoot, 'public', 'favicon.png');
    execSync(`npx -y sharp-cli -i "${tempBakedLogoNoTextPath}" -o "${faviconPngPath}" resize 256`);

    // favicon.ico
    console.log('Generating favicon.ico...');
    execSync(`convert -background none "${faviconPngPath}" -define icon:auto-resize=64,32,16 "${path.join(projectRoot, 'public', 'favicon.ico')}"`);

    // Cleanup
    console.log('Cleaning up...');
    fs.unlinkSync(tempBakedLogoPath);
    fs.unlinkSync(tempBakedLogoNoTextPath);
    fs.unlinkSync(faviconPngPath);

    console.log('Icons generated successfully.');
} catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
}
