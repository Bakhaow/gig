import path from "path";
import express from "express";
import multer from "multer";
import validator from "validator";

const router = express.Router();

// Function to sanitize file names
const sanitizeFileName = (filename) => {
  // Allow only alphanumeric characters, dots, and hyphens
  return filename.replace(/[^a-zA-Z0-9.-]/g, "_");
};

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads/");
  },
  filename(req, file, callback) {
    const extname = path.extname(file.originalname);
    const sanitizedName = sanitizeFileName(
      path.basename(file.originalname, extname)
    );
    callback(null, `${sanitizedName}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, callback) => {
  const filetypes = /jpe?g|webp|png/;
  const mimetypes = /image\/jpe?g|image\/webp|image\/png/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    return callback(null, true);
  }
  callback(
    "Error: File upload only supports the following filetypes - " + filetypes
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (req.file) {
      return res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        data: req.file.path,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
  });
});

export default router;
