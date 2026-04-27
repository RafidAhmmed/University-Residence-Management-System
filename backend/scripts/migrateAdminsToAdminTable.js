const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Admin = require('../models/Admin');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@12345';

const DEFAULT_ADMINS = [
  {
    name: 'SMR Hall Admin',
    email: 'admin.smrhall@just.edu.bd',
    phone: '01710000001',
    gender: 'male',
    designation: 'Provost',
    hall: 'Shaheed Mashiur Rahman Hall',
  },
  {
    name: 'SHC Hall Admin',
    email: 'admin.shchall@just.edu.bd',
    phone: '01710000002',
    gender: 'female',
    designation: 'Provost',
    hall: 'Sheikh Hasina Chitree Hall',
  },
  {
    name: 'MMM Hall Admin',
    email: 'admin.mmmhall@just.edu.bd',
    phone: '01710000003',
    gender: 'male',
    designation: 'Provost',
    hall: 'Munshi Mohammad Meherullah Hall',
  },
  {
    name: 'BTB Hall Admin',
    email: 'admin.btbhall@just.edu.bd',
    phone: '01710000004',
    gender: 'female',
    designation: 'Provost',
    hall: 'Birprotik Taramon Bibi Hall',
  },
];

const run = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hall_management';
  await mongoose.connect(mongoUri);

  const deletedFromUsers = await User.deleteMany({ role: 'admin' });
  await Admin.deleteMany({});

  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
  const adminDocs = DEFAULT_ADMINS.map((admin) => ({
    ...admin,
    password: hashedPassword,
    role: 'admin',
    department: admin.department || '',
    tokens: [],
  }));

  await Admin.insertMany(adminDocs, { ordered: true });

  console.log(`Deleted ${deletedFromUsers.deletedCount} admin records from User table.`);
  console.log(`Inserted ${adminDocs.length} admin records into Admin table.`);
  console.log('Created admin accounts:');
  adminDocs.forEach((admin) => {
    console.log(`- ${admin.email} | ${admin.hall} | password: ${DEFAULT_ADMIN_PASSWORD}`);
  });

  await mongoose.disconnect();
};

run()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error('Admin migration failed:', error.message);
    try {
      await mongoose.disconnect();
    } catch {
      // no-op
    }
    process.exit(1);
  });
