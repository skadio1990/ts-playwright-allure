import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { register, collectDefaultMetrics, Gauge } from 'prom-client';

const app = express();
app.use(cors());

// Register default metrics
collectDefaultMetrics();

const folderPath = "./public/reports/";
const filePath = "/Users/skadio/playground/allure-history/export/prometheusData.txt";

const sortFilesByDate = (files) => {
    return files
        .map((file) => ({
            file,
            birthtime: fs.statSync(path.join(folderPath, file)).birthtime,
        }))
        .sort((a, b) => b.birthtime - a.birthtime)
        .map((item) => item.file);
};

// Create a Gauge metric for each line in the file
const createMetrics = () => {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.trim().split('\n');

    // Clear existing metrics
    register.clear();

    lines.forEach(line => {
        const [metric, value] = line.split(' ');
        const gauge = new Gauge({ name: metric, help: `Description for ${metric}` });
        gauge.set(parseFloat(value));
        register.registerMetric(gauge);
    });
};

createMetrics(); // Call the function once to initialize the metrics

app.get("/api/files", (req, res) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).send(err);
        }

        const sortedFiles = sortFilesByDate(files);

        res.json({ files: sortedFiles });
    });
});

app.get("/api/realtime", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");

    fs.watch(folderPath, (eventType, filename) => {
        const updatedFiles = fs.readdirSync(folderPath);
        const sortedFiles = sortFilesByDate(updatedFiles);

        res.write(`data: ${JSON.stringify({ files: sortedFiles })}\n\n`);

        // Check if prometheusData.txt has changed
        if (filename === 'prometheusData.txt' && eventType === 'change') {
            console.log("prometheusData.txt has changed. Updating metrics.");
            createMetrics();
        }
    });
});

// Expose custom metrics endpoint
app.get("/metrics", async (req, res) => {
    await createMetrics(); // Update metrics on each /metrics request
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

fs.watch(folderPath, (eventType, filename) => {
    console.log("File change event:", eventType, filename);
});

const port = 3002;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
