const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { errorResponse } = require('../utils/apiResponse');

// Ensure upload directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const clinicId = req.user?.clinicId || req.body.clinicId;
      const userId = req.user?.id || req.body.userId;
      
      // Enforce presence of clinicId and userId
      if (!clinicId) {
        return cb(new Error('clinicId is required for file upload'), null);
      }
      
      if (!userId) {
        return cb(new Error('userId is required for file upload'), null);
      }
      
      const uploadPath = path.join(
        process.env.UPLOAD_PATH || './uploads',
        clinicId.toString(),
        userId.toString()
      );
      
      ensureDirectoryExists(uploadPath);
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    try {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const filename = `${name}-${uniqueSuffix}${ext}`;
      cb(null, filename);
    } catch (error) {
      cb(error);
    }
  }
});

// File filter for allowed mime types
const fileFilter = (req, file, cb) => {
  // Allowed mime types
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Base upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 5 // Maximum 5 files per request
  }
});

// Single file upload middleware
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        let message = 'File upload error';
        
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            message = 'File size too large';
            break;
          case 'LIMIT_FILE_COUNT':
            message = 'Too many files';
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            message = `Unexpected file field: ${err.field}`;
            break;
          default:
            message = err.message;
        }
        
        return errorResponse(res, 400, message);
      } else if (err) {
        return errorResponse(res, 400, err.message);
      }
      
      next();
    });
  };
};

// Multiple files upload middleware
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        let message = 'File upload error';
        
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            message = 'File size too large';
            break;
          case 'LIMIT_FILE_COUNT':
            message = `Too many files. Maximum allowed: ${maxCount}`;
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            message = `Unexpected file field: ${err.field}`;
            break;
          default:
            message = err.message;
        }
        
        return errorResponse(res, 400, message);
      } else if (err) {
        return errorResponse(res, 400, err.message);
      }
      
      next();
    });
  };
};

// Image upload middleware (images only)
const uploadImage = uploadSingle('image');

// Document upload middleware (documents only)
const uploadDocument = uploadSingle('document');

// Multiple images upload middleware
const uploadImages = (maxCount = 5) => uploadMultiple('images', maxCount);

// File cleanup utility
const cleanupFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error cleaning up file:', error);
  }
};

// Get file info utility
const getFileInfo = (file) => {
  if (!file) return null;
  
  return {
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
    uploadDate: new Date()
  };
};

// Get multiple files info utility
const getFilesInfo = (files) => {
  if (!files || !Array.isArray(files)) return [];
  
  return files.map(file => getFileInfo(file));
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadImage,
  uploadDocument,
  uploadImages,
  cleanupFile,
  getFileInfo,
  getFilesInfo,
  ensureDirectoryExists
};
