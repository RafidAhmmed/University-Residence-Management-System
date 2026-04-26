const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const Complaint = require('../models/Complaint');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const run = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hall_management';

  try {
    await mongoose.connect(mongoUri);

    const result = await Complaint.updateMany(
      { priority: { $exists: true } },
      { $unset: { priority: '' } }
    );

    console.log(`Complaint priority cleanup complete. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
  } catch (error) {
    console.error('Failed to remove complaint priority field:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
