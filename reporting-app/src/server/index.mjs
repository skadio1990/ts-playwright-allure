import express from 'express';
import fs from 'fs';
import cors from 'cors'; // Add this line to import cors

const app = express();
// Enable CORS for all routes
app.use(cors());

const folderPath = './public/reports/'; // Replace with your server folder path

app.get('/api/files', (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ files });
  });
});

// SSE endpoint for real-time updates
app.get('/api/realtime', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  
  // Watch for changes in the folder and broadcast to connected clients
  fs.watch(folderPath, (eventType, filename) => {
    const updatedFiles = fs.readdirSync(folderPath);
    res.write(`data: ${JSON.stringify({ files: updatedFiles })}\n\n`);
  });
});

// Watch for changes in the folder and update the list
fs.watch(folderPath, (eventType, filename) => {
  console.log('File change event:', eventType, filename);
  // Optionally, broadcast the changes to connected clients
});

const port = 3002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});