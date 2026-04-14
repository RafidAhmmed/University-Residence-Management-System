const express = require('express');
const complaintController = require('../controllers/complaintController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// All complaint routes require authentication
router.use(auth);

// User routes
router.post('/', complaintController.createComplaint);
router.get('/my', complaintController.getUserComplaints);

// Admin routes (require admin role check)
router.get('/', admin, complaintController.getAllComplaints);
router.get('/:id', admin, complaintController.getComplaintById);
router.put('/:id/status', admin, complaintController.updateComplaintStatus);

module.exports = router;