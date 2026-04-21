const Fee = require('../models/Fee');
const User = require('../models/User');

const paymentMethods = ['bkash', 'nagad', 'sslcommerz'];

const isOverdue = (fee) => {
  if (!fee || fee.status === 'paid') {
    return false;
  }

  return new Date(fee.dueDate).getTime() < Date.now();
};

const formatFee = (fee) => {
  const feeObj = fee.toObject ? fee.toObject() : fee;
  const overdue = isOverdue(feeObj);
  const amountDue = feeObj.status === 'paid'
    ? 0
    : Number(feeObj.amount || 0) + (overdue ? Number(feeObj.lateFee || 0) : 0);

  return {
    ...feeObj,
    isOverdue: overdue,
    amountDue,
  };
};

const buildUserFilter = (filters = {}) => {
  const query = {};

  if (filters.role) query.role = filters.role;
  if (filters.session) query.session = filters.session;
  if (filters.department) query.department = filters.department;
  if (filters.allocatedHall) query.allocatedHall = filters.allocatedHall;
  if (filters.allocatedRoom) query.allocatedRoom = filters.allocatedRoom;
  if (filters.studentId) query.studentId = filters.studentId;
  if (filters.name) query.name = { $regex: filters.name, $options: 'i' };

  return query;
};

class FeeController {
  async assignFees(req, res) {
    try {
      const { fees, filters = {}, targetUserIds = [], batchName = '' } = req.body;

      if (!Array.isArray(fees) || fees.length === 0) {
        return res.status(400).json({ error: 'At least one fee item is required' });
      }

      const normalizedFees = fees.map((fee) => ({
        title: String(fee.title || '').trim(),
        feeType: String(fee.feeType || '').trim(),
        amount: Number(fee.amount),
        lateFee: fee.lateFee === '' || fee.lateFee === null || fee.lateFee === undefined ? 0 : Number(fee.lateFee),
        dueDate: fee.dueDate,
        notes: String(fee.notes || '').trim(),
      }));

      for (const fee of normalizedFees) {
        if (!fee.title || !fee.feeType || Number.isNaN(fee.amount) || fee.amount < 0 || !fee.dueDate) {
          return res.status(400).json({ error: 'Each fee item needs a title, fee type, amount, and due date' });
        }
      }

      let users = [];
      if (Array.isArray(targetUserIds) && targetUserIds.length > 0) {
        users = await User.find({ _id: { $in: targetUserIds } });
      } else {
        const userFilter = buildUserFilter(filters);
        users = await User.find(userFilter);
      }

      if (!users.length) {
        return res.status(404).json({ error: 'No matching users found for the selected filters' });
      }

      const batchStamp = batchName?.trim() || `Batch-${Date.now()}`;
      const records = [];

      for (const user of users) {
        for (const fee of normalizedFees) {
          records.push({
            user: user._id,
            batchName: batchStamp,
            title: fee.title,
            feeType: fee.feeType,
            amount: fee.amount,
            lateFee: fee.lateFee,
            dueDate: fee.dueDate,
            createdBy: req.user.id,
            notes: fee.notes,
          });
        }
      }

      const createdFees = await Fee.insertMany(records);
      const populatedFees = await Fee.find({ _id: { $in: createdFees.map((fee) => fee._id) } }).populate('user', 'name studentId email session department allocatedHall allocatedRoom');

      res.status(201).json({
        message: 'Fees assigned successfully',
        count: populatedFees.length,
        fees: populatedFees.map(formatFee),
        matchedUsers: users.length,
      });
    } catch (error) {
      console.error('Assign fees error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getMyFees(req, res) {
    try {
      const fees = await Fee.find({ user: req.user.id })
        .populate('user', 'name studentId email session department allocatedHall allocatedRoom')
        .sort({ dueDate: 1, createdAt: -1 });

      res.json({
        fees: fees.map(formatFee),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllFees(req, res) {
    try {
      const fees = await Fee.find()
        .populate('user', 'name studentId email session department allocatedHall allocatedRoom')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 });

      res.json({
        fees: fees.map(formatFee),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async payFee(req, res) {
    try {
      const { id } = req.params;
      const { paymentMethod, transactionId = '' } = req.body;

      if (!paymentMethods.includes(paymentMethod)) {
        return res.status(400).json({ error: 'Please choose a valid payment method' });
      }

      const fee = await Fee.findById(id).populate('user', 'name studentId email');
      if (!fee) {
        return res.status(404).json({ error: 'Fee not found' });
      }

      if (String(fee.user._id) !== String(req.user.id) && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to pay this fee' });
      }

      if (fee.status === 'paid') {
        return res.status(400).json({ error: 'This fee has already been paid' });
      }

      const overdue = isOverdue(fee.toObject());
      const paidAmount = Number(fee.amount || 0) + (overdue ? Number(fee.lateFee || 0) : 0);

      fee.status = 'paid';
      fee.paymentMethod = paymentMethod;
      fee.transactionId = transactionId || `${paymentMethod.toUpperCase()}-${Date.now()}`;
      fee.paidAt = new Date();
      fee.paidAmount = paidAmount;
      fee.lateFeeApplied = overdue ? Number(fee.lateFee || 0) : 0;

      await fee.save();

      res.json({
        message: 'Payment completed successfully',
        fee: formatFee(fee),
      });
    } catch (error) {
      console.error('Fee payment error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getAssignedUsersPreview(req, res) {
    try {
      const { filters = {}, targetUserIds = [] } = req.query;

      let users = [];
      if (Array.isArray(targetUserIds) && targetUserIds.length > 0) {
        users = await User.find({ _id: { $in: targetUserIds } })
          .select('name studentId email session department allocatedHall allocatedRoom role');
      } else {
        const parsedFilters = typeof filters === 'string' ? JSON.parse(filters || '{}') : filters;
        users = await User.find(buildUserFilter(parsedFilters))
          .select('name studentId email session department allocatedHall allocatedRoom role');
      }

      res.json({ users });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new FeeController();