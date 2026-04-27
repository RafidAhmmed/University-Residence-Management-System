const Notice = require('../models/Notice');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

const storage = multer.memoryStorage();
const ALL_HALLS = 'ALL_HALLS';

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

class NoticeController {
  static uploadNoticePdf = upload.single('pdfFile');

  static normalizeHall(hall) {
    const normalizedHall = String(hall || '').trim();
    if (!normalizedHall) {
      throw new Error('Hall is required');
    }

    return normalizedHall === '__ALL_HALLS__' ? ALL_HALLS : normalizedHall;
  }

  static normalizeGoogleFormUrl(googleFormUrl) {
    if (googleFormUrl === undefined) {
      return undefined;
    }

    const raw = String(googleFormUrl || '').trim();
    if (!raw) {
      return null;
    }

    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    let parsed;
    try {
      parsed = new URL(withProtocol);
    } catch {
      throw new Error('Invalid Google Form URL');
    }

    const host = parsed.hostname.toLowerCase();
    const isGoogleFormHost = host === 'forms.gle' || host.endsWith('docs.google.com');
    const isGoogleFormPath = parsed.pathname.toLowerCase().includes('/forms');

    if (!isGoogleFormHost || (host.endsWith('docs.google.com') && !isGoogleFormPath)) {
      throw new Error('Invalid Google Form URL');
    }

    return parsed.toString();
  }

  static async uploadPdfToCloudinary(file, ownerId) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'notice-pdfs',
          public_id: `notice_${ownerId}_${Date.now()}`,
          resource_type: 'raw',
          format: 'pdf',
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

      stream.end(file.buffer);
    });
  }

  static async uploadPdfLocally(file, ownerId, req) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'notices');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeOwnerId = String(ownerId || 'admin').replace(/[^a-zA-Z0-9_-]/g, '');
    const fileName = `notice_${safeOwnerId}_${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, fileName);

    await fs.promises.writeFile(filePath, file.buffer);
    return `${req.protocol}://${req.get('host')}/uploads/notices/${fileName}`;
  }

  static async uploadPdf(file, ownerId, req) {
    const hasCloudinaryConfig =
      !!process.env.CLOUDINARY_CLOUD_NAME &&
      !!process.env.CLOUDINARY_API_KEY &&
      !!process.env.CLOUDINARY_API_SECRET;

    if (hasCloudinaryConfig) {
      const uploadResult = await NoticeController.uploadPdfToCloudinary(file, ownerId);
      return uploadResult.secure_url;
    }

    return NoticeController.uploadPdfLocally(file, ownerId, req);
  }

  // Create a new notice (admin only)
  async createNotice(req, res) {
    try {
      const { title, content, type, googleFormUrl, hall } = req.body;
      const publishedBy = req.user.id; // From auth middleware
      let pdfUrl = null;

      if (req.file) {
        try {
          pdfUrl = await NoticeController.uploadPdf(req.file, publishedBy, req);
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return res.status(500).json({ error: 'Failed to upload notice PDF' });
        }
      }

      const normalizedGoogleFormUrl = NoticeController.normalizeGoogleFormUrl(googleFormUrl);
      const normalizedHall = NoticeController.normalizeHall(hall);

      const notice = new Notice({
        title,
        content,
        type,
        publishedBy,
        hall: normalizedHall,
        googleFormUrl: normalizedGoogleFormUrl,
        pdfUrl,
      });

      await notice.save();
      await notice.populate('publishedBy', 'name');

      res.status(201).json({
        message: 'Notice published successfully',
        notice,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all notices
  async getAllNotices(req, res) {
    try {
      const { type, hall, page = 1, limit = 10 } = req.query;

      let filter = { isPublished: true };
      if (type) filter.type = type;
      if (hall) {
        filter.$or = [{ hall }, { hall: ALL_HALLS }];
      }

      const notices = await Notice.find(filter)
        .populate('publishedBy', 'name')
        .sort({ publishedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Notice.countDocuments(filter);

      res.json({
        notices,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get notice by ID
  async getNoticeById(req, res) {
    try {
      const { id } = req.params;
      const notice = await Notice.findById(id)
        .populate('publishedBy', 'name');

      if (!notice) {
        return res.status(404).json({ error: 'Notice not found' });
      }

      res.json(notice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update notice (admin only)
  async updateNotice(req, res) {
    try {
      const { id } = req.params;
      const { title, content, type, isPublished, googleFormUrl, hall } = req.body;

      const updateData = {};

      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (type !== undefined) updateData.type = type;
      if (isPublished !== undefined) updateData.isPublished = isPublished;

      if (googleFormUrl !== undefined) {
        updateData.googleFormUrl = NoticeController.normalizeGoogleFormUrl(googleFormUrl);
      }

      if (hall !== undefined) {
        updateData.hall = NoticeController.normalizeHall(hall);
      }

      if (req.file) {
        try {
          updateData.pdfUrl = await NoticeController.uploadPdf(req.file, req.user.id, req);
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return res.status(500).json({ error: 'Failed to upload notice PDF' });
        }
      }

      const notice = await Notice.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('publishedBy', 'name');

      if (!notice) {
        return res.status(404).json({ error: 'Notice not found' });
      }

      res.json({
        message: 'Notice updated successfully',
        notice,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete notice (admin only)
  async deleteNotice(req, res) {
    try {
      const { id } = req.params;
      const notice = await Notice.findByIdAndDelete(id);

      if (!notice) {
        return res.status(404).json({ error: 'Notice not found' });
      }

      res.json({ message: 'Notice deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get notices by admin (for admin dashboard)
  async getNoticesByAdmin(req, res) {
    try {
      const publishedBy = req.user.id;
      const notices = await Notice.find({ publishedBy })
        .populate('publishedBy', 'name')
        .sort({ createdAt: -1 });

      res.json(notices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new NoticeController();
module.exports.uploadNoticePdf = NoticeController.uploadNoticePdf;