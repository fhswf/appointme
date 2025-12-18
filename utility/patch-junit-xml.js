import fs from 'node:fs';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

const filePath = process.argv[2];

if (!filePath) {
    console.error('Usage: node patch-junit-xml.js <path-to-xml-file>');
    process.exit(1);
}

try {
    const xmlData = fs.readFileSync(filePath, 'utf8');
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const jsonObj = parser.parse(xmlData);

    if (jsonObj.testsuites && jsonObj.testsuites.testsuite) {
        let firstSuite = jsonObj.testsuites.testsuite;
        if (Array.isArray(firstSuite)) {
            firstSuite = firstSuite[0];
        }

        const timestamp = firstSuite['@_timestamp'];
        if (timestamp) {
            // Check if timestamp is ISO string and convert to epoch if needed
            // junit-to-ctrf might prefer epoch or ISO, but let's try epoch if ISO fails?
            // Actually, XML standard is ISO. junit-to-ctrf might need help.
            // Let's keep ISO but also try to ensure it is valid.
            // Wait, if start:0, maybe it needs epoch.
            const date = new Date(timestamp);
            if (!isNaN(date.getTime())) {
                jsonObj.testsuites['@_timestamp'] = date.getTime(); // Convert to Epoch for junit-to-ctrf
            } else {
                jsonObj.testsuites['@_timestamp'] = timestamp;
            }

            const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: "@_", format: true });
            const updatedXml = builder.build(jsonObj);
            fs.writeFileSync(filePath, updatedXml);
            console.log(`Successfully patched timestamp in ${filePath}`);
        } else {
            console.log(`No timestamp found in the first testsuite of ${filePath}`);
        }
    } else {
        console.log(`Structure of ${filePath} not as expected (missing testsuites or testsuite)`);
    }

} catch (err) {
    console.error(`Error processing ${filePath}:`, err);
    process.exit(1);
}
