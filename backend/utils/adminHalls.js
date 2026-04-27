const ADMIN_HALLS = [
  'Shaheed Mashiur Rahman Hall',
  'Sheikh Hasina Chitree Hall',
  'Munshi Mohammad Meherullah Hall',
  'Birprotik Taramon Bibi Hall',
];

const normalizeAdminHall = (hall) => String(hall || '').trim();

module.exports = {
  ADMIN_HALLS,
  normalizeAdminHall,
};
