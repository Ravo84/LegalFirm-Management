import multer from "multer";

// ✅ Vercel-safe: store files in memory, not disk
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});
