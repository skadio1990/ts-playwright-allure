// This code is an Express.js reporting server that exposes endpoints for
// retrieving sorted allure report files, real-time updates using Server-Sent
// Events (SSE), and custom Prometheus metrics.
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { register, collectDefaultMetrics, Gauge } from "prom-client";

// Create an Express application
const app = express();

// Define Cross-Origin Resource Sharing
app.use(cors());

// Register default Prometheus metrics
collectDefaultMetrics();

// Define paths for storing reports and Prometheus data file
const folderPath = "./public/reports/";
const filePath =
    "/Users/skadio/playground/allure-history/export/prometheusData.txt";

// Function to sort files by date (using birthtime)
const sortFilesByDate = (files) => {
    return files
        .map((file) => ({
            file,
            birthtime: fs.statSync(path.join(folderPath, file)).birthtime,
        }))
        .sort((a, b) => b.birthtime - a.birthtime)
        .map((item) => item.file);
};

// Function to create Prometheus Gauge metrics based on data in a file
const createMetrics = () => {
    // Check if the file exists before attempting to read it
    if (fs.existsSync(filePath)) {
        try {
            // Read content from the Prometheus data file
            const data = fs.readFileSync(filePath, "utf8");
            const lines = data.trim().split("\n");

            // Clear existing metrics
            register.clear();

            // Create Gauge metric for each line in the file
            lines.forEach((line) => {
                const [metric, value] = line.split(" ");
                const gauge = new Gauge({
                    name: metric,
                    help: `Description for ${metric}`,
                });
                gauge.set(parseFloat(value));
                register.registerMetric(gauge);
            });
        } catch (error) {
            console.error("Error reading file:", error.message);
        }
    } else {
        console.warn("File does not exist:", filePath);
    }
};

// Initialize metrics on server start
createMetrics();

// Endpoint to get a list of files sorted by date
app.get("/api/files", (req, res) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).send(err);
        }

        const sortedFiles = sortFilesByDate(files);

        res.json({ files: sortedFiles });
    });
});

// Endpoint for real-time updates using Server-Sent Events (SSE)
app.get("/api/realtime", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");

    // Watch for changes in the reports folder
    fs.watch(folderPath, (eventType, filename) => {
        const updatedFiles = fs.readdirSync(folderPath);
        const sortedFiles = sortFilesByDate(updatedFiles);

        res.write(`data: ${JSON.stringify({ files: sortedFiles })}\n\n`);

        // Check if prometheusData.txt has changed and update metrics
        if (filename === "prometheusData.txt" && eventType === "change") {
            console.log("prometheusData.txt has changed. Updating metrics.");
            createMetrics();
        }
    });
});

// Endpoint to expose custom Prometheus metrics
app.get("/metrics", async (req, res) => {
    // Update metrics on each /metrics request
    await createMetrics();
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

// Log file change events to the console
fs.watch(folderPath, (eventType, filename) => {
    console.log("File change event:", eventType, filename);
});

// Set up the server to listen on a specified port
const port = 3002;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
