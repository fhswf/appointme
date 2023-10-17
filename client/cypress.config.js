import { defineConfig } from 'cypress'

const PORT = process.env.PORT || 3000;

export default defineConfig({
    e2e: {
        baseUrl: `http://localhost:${PORT}/meeting`,
        video: true,
        projectId: "pjkkoc"
    },
})