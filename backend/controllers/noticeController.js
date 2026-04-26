const Notice = require('../models/Notice');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();

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

  // Create a new notice (admin only)
  async createNotice(req, res) {
    try {
      const { title, content, type, googleFormUrl, hall } = req.body;
      const publishedBy = req.user.id; // From auth middleware
      let pdfUrl = null;

      if (req.file) {
        try {
          const uploadResult = await NoticeController.uploadPdfToCloudinary(req.file, publishedBy);
          pdfUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return res.status(500).json({ error: 'Failed to upload notice PDF' });
        }
      }

      const normalizedGoogleFormUrl = googleFormUrl?.trim() || null;
      const normalizedHall = hall?.trim();

      if (!normalizedHall) {
        return res.status(400).json({ error: 'Hall is required' });
      }

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
        filter.hall = hall;
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
        updateData.googleFormUrl = googleFormUrl.trim() || null;
      }

      if (hall !== undefined) {
        const normalizedHall = hall.trim();
        if (!normalizedHall) {
          return res.status(400).json({ error: 'Hall is required' });
        }
        updateData.hall = normalizedHall;
      }

      if (req.file) {
        try {
          const uploadResult = await NoticeController.uploadPdfToCloudinary(req.file, req.user.id);
          updateData.pdfUrl = uploadResult.secure_url;
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