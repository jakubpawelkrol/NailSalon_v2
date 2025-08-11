// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type'],
  maxAge: 86400
}));

const GALLERY_DIR = path.join(__dirname, 'gallery');     // put originals here
const THUMBS_DIR  = path.join(__dirname, 'thumbnails');  // thumbs generated here
const THUMB_WIDTH = 150;                                  // tweak as you like

// Ensure folders exist
if (!fs.existsSync(GALLERY_DIR)) fs.mkdirSync(GALLERY_DIR, { recursive: true });
if (!fs.existsSync(THUMBS_DIR))  fs.mkdirSync(THUMBS_DIR, { recursive: true });

// Serve static files
app.use('/gallery',   express.static(GALLERY_DIR, { maxAge: '7d' }));
app.use('/thumbnails', express.static(THUMBS_DIR, { maxAge: '7d' }));

// Utility: is file an image?
const isImage = (f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f);

// Generate (or refresh) a single thumbnail
async function generateThumbIfNeeded(filename) {
  if (!isImage(filename)) return;

  const srcPath  = path.join(GALLERY_DIR, filename);
  const dstPath  = path.join(THUMBS_DIR, filename);

  if (!fs.existsSync(srcPath)) return;

  const [srcStat, dstExists, dstStat] = [
    fs.statSync(srcPath),
    fs.existsSync(dstPath),
    fs.existsSync(dstPath) ? fs.statSync(dstPath) : null,
  ];

  if (!dstExists || (dstStat && dstStat.mtimeMs < srcStat.mtimeMs)) {
    const ext = path.extname(filename).toLowerCase();

    // Make a perfect square thumbnail
    const img = sharp(srcPath)
      .resize({
        width: THUMB_WIDTH,
        height: THUMB_WIDTH,
        fit: 'cover',
        position: 'center'
      });

    if (ext === '.png') {
      await img.png({ compressionLevel: 9 }).toFile(dstPath);
    } else if (ext === '.webp') {
      await img.webp({ quality: 75 }).toFile(dstPath);
    } else {
      await img.jpeg({ quality: 75 }).toFile(dstPath);
    }

    console.log('Generated square thumb:', filename);
  }
}


// Generate thumbnails for all images on startup
async function warmThumbnails() {
  const files = fs.readdirSync(GALLERY_DIR).filter(isImage);
  await Promise.all(files.map(generateThumbIfNeeded));
  console.log(`Thumbnails ready for ${files.length} images`);
}

// API: return PhotoModel[]
app.get('/api/gallery', async (req, res) => {
  try {
    const files = (await fs.promises.readdir(GALLERY_DIR)).filter(isImage);

    // ensure thumbs exist (lazy safety)
    await Promise.all(files.map(generateThumbIfNeeded));

    const items = files.map((name) => {
      const baseUrl = `http://localhost:${PORT}`;
      const url = `${baseUrl}/gallery/${name}`;
      const thumbUrl = `${baseUrl}/thumbnails/${name}`;
      const baseName = path.parse(name).name;

      return {
        itemImageSrc: url,
        thumbnailImageSrc: thumbUrl,
        alt: baseName,
        title: baseName,
      };
    });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to read gallery' });
  }
});

// Optional: endpoint to force re-scan (e.g., after uploading new images)
app.post('/api/gallery/regenerate-thumbs', async (req, res) => {
  try {
    await warmThumbnails();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to regenerate' });
  }
});

app.listen(PORT, async () => {
  await warmThumbnails();
  console.log(`Server on http://localhost:${PORT}`);
});
