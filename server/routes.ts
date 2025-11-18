import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Allowed MIME types
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
const ALLOWED_TRANSCRIPT_TYPES = [
  "application/json",
  "text/plain",
  "text/vtt",
  "application/x-subrip",
];

// Configure multer for file uploads - store OUTSIDE web root
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = "/tmp/uploads";
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    // Validate file type based on endpoint
    const isVideo = req.path.includes("/video");
    const allowedTypes = isVideo ? ALLOWED_VIDEO_TYPES : ALLOWED_TRANSCRIPT_TYPES;
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  const fs = await import("fs/promises");
  const uploadsDir = "/tmp/uploads";

  // Ensure uploads directory exists outside web root
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch {}


  // Secure file serving endpoint with validation
  app.get("/api/files/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      
      // Prevent directory traversal
      if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
        return res.status(400).json({ error: "Invalid filename" });
      }

      const filePath = path.join(uploadsDir, filename);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        return res.status(404).json({ error: "File not found" });
      }

      // Validate file extension
      const ext = path.extname(filename).toLowerCase();
      const allowedExts = [".mp4", ".webm", ".ogg", ".json", ".txt", ".vtt", ".srt"];
      
      if (!allowedExts.includes(ext)) {
        return res.status(403).json({ error: "File type not allowed" });
      }

      // Set appropriate content type and security headers
      const contentTypes: Record<string, string> = {
        ".mp4": "video/mp4",
        ".webm": "video/webm",
        ".ogg": "video/ogg",
        ".json": "application/json",
        ".txt": "text/plain",
        ".vtt": "text/vtt",
        ".srt": "application/x-subrip",
      };

      res.setHeader("Content-Type", contentTypes[ext] || "application/octet-stream");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Content-Security-Policy", "default-src 'none'");
      
      // Stream the file
      const fileStream = (await import("fs")).createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: "Error serving file" });
    }
  });

  // Upload video endpoint
  app.post("/api/upload/video", (req, res) => {
    upload.single("video")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Additional extension validation
      const ext = path.extname(req.file.filename).toLowerCase();
      if (![".mp4", ".webm", ".ogg"].includes(ext)) {
        // Delete invalid file
        try {
          await fs.unlink(req.file.path);
        } catch {}
        return res.status(400).json({ error: "Invalid file extension" });
      }

      const fileUrl = `/api/files/${req.file.filename}`;
      res.json({
        url: fileUrl,
        filename: req.file.originalname,
        size: req.file.size,
      });
    });
  });

  // Upload transcript endpoint
  app.post("/api/upload/transcript", (req, res) => {
    upload.single("transcript")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Additional extension validation
      const ext = path.extname(req.file.filename).toLowerCase();
      if (![".json", ".txt", ".vtt", ".srt"].includes(ext)) {
        // Delete invalid file
        try {
          await fs.unlink(req.file.path);
        } catch {}
        return res.status(400).json({ error: "Invalid file extension" });
      }

      const content = await fs.readFile(req.file.path, "utf-8");

      // Validate JSON if it's a .json file
      if (ext === ".json") {
        try {
          JSON.parse(content);
        } catch (error) {
          // Delete invalid file
          try {
            await fs.unlink(req.file.path);
          } catch {}
          return res.status(400).json({ error: "Invalid JSON format" });
        }
      }

      res.json({
        content,
        filename: req.file.originalname,
        size: req.file.size,
      });
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
