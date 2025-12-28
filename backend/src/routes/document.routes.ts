import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import {
  uploadDocumentHandler,
  listDocumentsHandler,
  getDocumentHandler,
  downloadDocumentHandler,
  deleteDocumentHandler,
} from "../controllers/document.controller.js";

const router = Router();

router.use(authenticate);

router.post("/upload", upload.single("file"), uploadDocumentHandler);
router.get("/", listDocumentsHandler);
router.get("/:documentId", getDocumentHandler);
router.get("/:documentId/download", downloadDocumentHandler);
router.delete("/:documentId", deleteDocumentHandler);

export default router;

