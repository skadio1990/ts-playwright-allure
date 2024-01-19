import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());

const folderPath = "./public/reports/";

const sortFilesByDate = (files) => {
    return files
        .map((file) => ({
            file,
            birthtime: fs.statSync(path.join(folderPath, file)).birthtime,
        }))
        .sort((a, b) => b.birthtime - a.birthtime)
        .map((item) => item.file);
};

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
    });
});

fs.watch(folderPath, (eventType, filename) => {
    console.log("File change event:", eventType, filename);
});

const port = 3002;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
