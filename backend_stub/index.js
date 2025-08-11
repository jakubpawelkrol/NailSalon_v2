const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from 'gallery' folder
app.use('/gallery', express.static(path.join(__dirname, 'gallery')));
app.use(cors());

// Endpoint to list all image files in 'gallery'
app.get('/api/gallery', (req, res) => {
  const galleryDir = path.join(__dirname, 'gallery');
  fs.readdir(galleryDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read directory' });
    }

    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    const imageObjects = imageFiles.map(name => {
      const url = `http://localhost:${PORT}/gallery/${name}`;
      return {
        itemImageSrc: url,
        thumbnailImageSrc: url, // can be a separate thumbnail path if you generate them
        alt: name,
        title: name
      };
    });
    res.json(imageObjects);
  });
});

app.listen(PORT, () => {
  console.log(`Gallery API running at http://localhost:${PORT}`);
});