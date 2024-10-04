import { defineConfig } from 'cypress'
import { GenerateCtrfReport } from 'cypress-ctrf-json-reporter'

const PORT = process.env.PORT || 5173;

export default defineConfig({
  e2e: {
    env: {
      REACT_APP_API_URL: '/api/v1'
    },
    baseUrl: `http://localhost:${PORT}`,
    video: true,
    projectId: "pjkkoc",
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      new GenerateCtrfReport({
        on,
        outputFile: 'client-report.json',
        outputDir: '../ctrf',
      })
    },
  },
})
