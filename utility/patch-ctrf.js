const fs = require('fs');

const filePath = process.argv[2];

if (!filePath) {
    console.error('Usage: node patch-ctrf.js <path-to-json-file>');
    process.exit(1);
}

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);

    if (json.results && json.results.summary) {
        const summary = json.results.summary;
        // Check if start is missing or 0
        if (!summary.start || summary.start === 0) {
            // Parse timestamp from report header (ISO string)
            let startTime = 0;
            if (json.timestamp) {
                const date = new Date(json.timestamp);
                if (!isNaN(date.getTime())) {
                    startTime = date.getTime();
                }
            }

            // Fallback to current time if timestamp is missing/invalid
            if (startTime === 0) {
                startTime = Date.now();
                console.log('Warning: No valid timestamp found in CTRF report, using current time.');
                // Also update the header timestamp
                json.timestamp = new Date(startTime).toISOString();
            }

            summary.start = startTime;

            // Calculate duration from tests
            let totalDuration = 0;
            if (json.results.tests && Array.isArray(json.results.tests)) {
                totalDuration = json.results.tests.reduce((acc, test) => acc + (test.duration || 0), 0);
            }

            summary.stop = startTime + totalDuration;

            console.log(`Patched start/stop in ${filePath}: start=${summary.start}, stop=${summary.stop}, duration=${totalDuration}`);

            fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
        } else {
            console.log(`Start time already set in ${filePath}: ${summary.start}`);
        }
    } else {
        console.error('Invalid CTRF JSON format: missing results.summary');
    }

} catch (err) {
    console.error(`Error processing ${filePath}:`, err);
    process.exit(1);
}
