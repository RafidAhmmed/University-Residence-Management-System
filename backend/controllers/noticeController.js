const Notice = require('../models/Notice');

class NoticeController {
  // Create a new notice (admin only)
  async createNotice(req, res) {
    try {
      const { title, content, type, priority } = req.body;
      const publishedBy = req.user.id; // From auth middleware

      const notice = new Notice({
        title,
        content,
        type,
        priority,
        publishedBy,
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
      const { type, page = 1, limit = 10 } = req.query;

      let filter = { isPublished: true };
      if (type) filter.type = type;

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
      const { title, content, type, priority, isPublished } = req.body;

      const notice = await Notice.findByIdAndUpdate(
        id,
        { title, content, type, priority, isPublished },
        { new: true }
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
        .sort({ createdAt: -1 });

      res.json(notices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new NoticeController();