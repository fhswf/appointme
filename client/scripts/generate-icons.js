
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

import opentype from 'opentype.js';

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

async function processSvg(inputPath, outputPath, isNoText = false) {
    let svgContent = fs.readFileSync(inputPath, 'utf8');
    const vars = bakeSvgMap(svgContent);

    // Replace variables
    for (const [key, value] of Object.entries(vars)) {
        const regex = new RegExp(`var\\(${key}\\)`, 'g');
        svgContent = svgContent.replace(regex, value);
    }

    if (!isNoText) {
        // Embed GillSans Bold font as path
        const fontPath = path.join(projectRoot, 'public', 'GILB____.TTF');
        if (fs.existsSync(fontPath)) {
            try {
                const font = await opentype.load(fontPath);

                // Text config
                const fontSize = 70;
                // Match SVG y=380 and font-size=70
                const x = 256;
                const y = 380;

                // We need to calculate paths for "App", "oint", "Me"
                // And center them.
                const text1 = "App";
                const text2 = "oint";
                const text3 = "Me";

                const w1 = font.getAdvanceWidth(text1, fontSize);
                const w2 = font.getAdvanceWidth(text2, fontSize);
                const w3 = font.getAdvanceWidth(text3, fontSize);
                const totalWidth = w1 + w2 + w3;

                const startX = x - (totalWidth / 2);

                const scale = fontSize / font.unitsPerEm;
                const capHeight = (font.tables.os2 && font.tables.os2.sCapHeight) || (font.ascender * 0.7); // fallback
                const baseline = y + (capHeight * scale) / 2;

                const p1 = font.getPath(text1, startX, baseline, fontSize);
                const p2 = font.getPath(text2, startX + w1, baseline, fontSize);
                const p3 = font.getPath(text3, startX + w1 + w2, baseline, fontSize);

                // Convert to SVG paths with fill
                const d1 = p1.toPathData(2);
                const d2 = p2.toPathData(2);
                const d3 = p3.toPathData(2);

                const pathSvg = `<g>
                    <path d="${d1}" fill="${vars['--color-dark-blue'] || '#000'}" />
                    <path d="${d2}" fill="${vars['--color-text-blue-medium'] || '#444'}" />
                    <path d="${d3}" fill="${vars['--color-medium-blue'] || '#888'}" />
                </g>`;

                // Remove existing text tag and replace
                const textRegex = /<text[\s\S]*?<\/text>/;
                // Remove @font-face style as well to be clean
                const styleRegex = /<style>\s*@font-face[\s\S]*?<\/style>/;

                svgContent = svgContent.replace(textRegex, pathSvg);
                svgContent = svgContent.replace(styleRegex, '');

            } catch (e) {
                console.error("Error converting font to path:", e);
            }
        } else {
            console.warn('GillSans.ttf not found, skipping font embedding.');
        }
    }

    // Handle transparent circle (same as before)
    // ...

    fs.writeFileSync(outputPath, svgContent);
    console.log(`Created baked SVG: ${outputPath}`);
}

(async () => {
    try {
        console.log('Baking SVGs...');
        await processSvg(logoPath, tempBakedLogoPath);
        await processSvg(logoNoTextPath, tempBakedLogoNoTextPath, true);

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
        // fs.unlinkSync(tempBakedLogoPath);
        // fs.unlinkSync(tempBakedLogoNoTextPath);
        fs.unlinkSync(faviconPngPath);

        console.log('Icons generated successfully.');
    } catch (error) {
        console.error('Error generating icons:', error);
        process.exit(1);
    }
})();
