const path = require('path');
const fs = require('fs');

const VIDEOS_DIR = path.resolve(__dirname, '..', 'uploads', 'videos');

/**
 * Streams video with full HTTP Range request support (RFC 7233)
 * Supports 200 OK, 206 Partial Content, 404 Not Found, 416 Range Not Satisfiable,
 * and robust path-traversal prevention.
 */
exports.streamVideo = (req, res) => {
  try {
    const rawFilename = req.params.filename;
    if (!rawFilename) {
      return res.status(400).json({ success: false, message: 'Video filename is required' });
    }

    // Security: sanitize filename and enforce path boundary
    const sanitizedFilename = path.basename(rawFilename);
    const filePath = path.resolve(VIDEOS_DIR, sanitizedFilename);

    // Prevent directory traversal attacks
    if (!filePath.startsWith(VIDEOS_DIR)) {
      return res.status(403).json({ success: false, message: 'Access denied: Invalid file path' });
    }

    // Check file existence
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: `Video file '${sanitizedFilename}' not found` });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // CORS & Media Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', 'video/mp4');

    if (range) {
      // Range header format: "bytes=start-end"
      const match = range.match(/bytes=(\d*)-(\d*)/);
      if (!match) {
        res.setHeader('Content-Range', `bytes */${fileSize}`);
        return res.status(416).end();
      }

      let start = match[1] ? parseInt(match[1], 10) : 0;
      let end = match[2] ? parseInt(match[2], 10) : fileSize - 1;

      // Handle suffix byte range (e.g., bytes=-500)
      if (!match[1] && match[2]) {
        start = Math.max(0, fileSize - parseInt(match[2], 10));
        end = fileSize - 1;
      }

      // Check boundary validity
      if (isNaN(start) || isNaN(end) || start >= fileSize || end >= fileSize || start > end) {
        res.setHeader('Content-Range', `bytes */${fileSize}`);
        return res.status(416).end();
      }

      const chunkSize = (end - start) + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': chunkSize
      });

      const videoStream = fs.createReadStream(filePath, { start, end });
      videoStream.on('error', (err) => {
        if (!res.headersSent) {
          res.status(500).end();
        }
      });
      videoStream.pipe(res);
    } else {
      // Full content delivery
      res.writeHead(200, {
        'Content-Length': fileSize
      });

      const videoStream = fs.createReadStream(filePath);
      videoStream.on('error', (err) => {
        if (!res.headersSent) {
          res.status(500).end();
        }
      });
      videoStream.pipe(res);
    }
  } catch (error) {
    console.error('[Video Stream Error]:', error.message);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Internal server error streaming video' });
    }
  }
};
