const express = require('express');
const feeController = require('../controllers/feeController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.use(auth);

router.get('/me', feeController.getMyFees);
router.post('/:id/pay', feeController.payFee);

router.get('/admin/users-preview', admin, feeController.getAssignedUsersPreview);
router.get('/admin', admin, feeController.getAllFees);
router.post('/admin/assign', admin, feeController.assignFees);

module.exports = router;