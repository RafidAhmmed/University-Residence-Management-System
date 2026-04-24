const Complaint = require('../models/Complaint');
const User = require('../models/User');

class ComplaintController {
  // Create a new complaint
  async createComplaint(req, res) {
    try {
      const { title, description, category, priority } = req.body;
      const userId = req.user.id; // From auth middleware
      const user = await User.findById(userId).select('allocatedHall allocatedRoom');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const complaint = new Complaint({
        title,
        description,
        category,
        priority,
        user: userId,
        sourceHall: user.allocatedHall || null,
        sourceRoom: user.allocatedRoom || null,
      });

      await complaint.save();
      await complaint.populate('user', 'name studentId allocatedHall allocatedRoom');

      res.status(201).json({
        message: 'Complaint submitted successfully',
        complaint,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all complaints (for admin)
  async getAllComplaints(req, res) {
    try {
      const { status, category, page = 1, limit = 10 } = req.query;

      let filter = {};
      if (status) filter.status = status;
      if (category) filter.category = category;

      const complaints = await Complaint.find(filter)
        .populate('user', 'name studentId allocatedHall allocatedRoom')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Complaint.countDocuments(filter);

      res.json({
        complaints,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get user's own complaints
  async getUserComplaints(req, res) {
    try {
      const userId = req.user.id;
      const complaints = await Complaint.find({ user: userId })
        .sort({ createdAt: -1 });

      res.json(complaints);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update complaint status (admin only)
  async updateComplaintStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, adminResponse } = req.body;

      const updateData = { status };
      if (adminResponse) {
        updateData.adminResponse = adminResponse;
        updateData.responseDate = new Date();
      }

      const complaint = await Complaint.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('user', 'name studentId allocatedHall allocatedRoom');

      if (!complaint) {
        return res.status(404).json({ error: 'Complaint not found' });
      }

      res.json({
        message: 'Complaint updated successfully',
        complaint,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get complaint by ID
  async getComplaintById(req, res) {
    try {
      const { id } = req.params;
      const complaint = await Complaint.findById(id)
        .populate('user', 'name studentId allocatedHall allocatedRoom');

      if (!complaint) {
        return res.status(404).json({ error: 'Complaint not found' });
      }

      res.json(complaint);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ComplaintController();