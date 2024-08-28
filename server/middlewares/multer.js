const multer = require("multer");
const path = require("path");

// Put the photos in the folder first before uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";
    if (file.fieldname === "profile_picture") {
      folder = "uploads/profile_pictures";
    } else if (file.fieldname === "receipt") {
      folder = "uploads/receipts";
    } else if (file.fieldname === "blog_photo") {
      folder = "uploads/blog_photos";
    } else if (file.fieldname === "qrCode") {
      folder = "uploads/qr_codes"; // Define folder for QR codes
    } else if (file.fieldname === "refundReceipt") {
      folder = "uploads/refund_receipts"; // Define folder for QR codes
    } else {
      return cb(new Error("Invalid file field name"));
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Method for uploading profile in CLoudinary
const uploadProfilePicture = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Images Only!"));
    }
  },
});
// Method for uploading receipt in CLoudinary

const uploadReceipt = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|jpg|jpeg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: PDFs, JPGs, JPEGs, and PNGs Only!"));
    }
  },
});
// method to upload photos for blog
const uploadBlogPhoto = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Images Only!"));
    }
  },
});

const uploadRefundReceipt = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: PDFs, JPGs, JPEGs, and PNGs Only!"));
    }
  },
});
// Method for uploading QR codes
const uploadQRCode = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /png|jpg|jpeg/; // Add QR code file types if different
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: PNG, JPG, and JPEG QR Codes Only!"));
    }
  },
});

module.exports = {
  uploadProfilePicture,
  uploadReceipt,
  uploadBlogPhoto,
  uploadRefundReceipt,
  uploadQRCode,
};
