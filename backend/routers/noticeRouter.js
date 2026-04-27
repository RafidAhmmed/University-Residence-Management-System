const express = require('express');
const noticeController = require('../controllers/noticeController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');

const router = express.Router();

const handleNoticeUpload = (req, res, next) => {
	noticeController.uploadNoticePdf(req, res, (error) => {
		if (!error) {
			next();
			return;
		}

		if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
			res.status(400).json({ error: 'PDF size must be 10MB or smaller' });
			return;
		}

		res.status(400).json({ error: error.message || 'Invalid PDF upload' });
	});
};

// Public routes (no auth required for viewing notices)
router.get('/', noticeController.getAllNotices);
router.get('/admin/my', auth, admin, noticeController.getNoticesByAdmin);
router.get('/:id', noticeController.getNoticeById);

// All other routes require authentication
router.use(auth);

// Admin routes
router.post('/', admin, handleNoticeUpload, noticeController.createNotice);
router.put('/:id', admin, handleNoticeUpload, noticeController.updateNotice);
router.delete('/:id', admin, noticeController.deleteNotice);

module.exports = router;