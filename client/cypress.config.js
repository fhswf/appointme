import { defineConfig } from 'cypress'

const PORT = process.env.PORT || 5173;

export default defineConfig({
  e2e: {
    baseUrl: `http://localhost:${PORT}/meeting`,
    video: true,
    projectId: "pjkkoc"
  },
})
