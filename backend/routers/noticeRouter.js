const express = require('express');
const noticeController = require('../controllers/noticeController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Public routes (no auth required for viewing notices)
router.get('/', noticeController.getAllNotices);
router.get('/:id', noticeController.getNoticeById);

// All other routes require authentication
router.use(auth);

// Admin routes
router.post('/', admin, noticeController.createNotice);
router.put('/:id', admin, noticeController.updateNotice);
router.delete('/:id', admin, noticeController.deleteNotice);
router.get('/admin/my', admin, noticeController.getNoticesByAdmin);

module.exports = router;