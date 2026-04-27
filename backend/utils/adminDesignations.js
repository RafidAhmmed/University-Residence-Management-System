const ADMIN_DESIGNATIONS = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
  'Adjunct Faculty',
  'Department Chair',
  'Dean',
  'Proctor',
  'Provost',
  'Registrar',
];

const normalizeDesignation = (designation) => String(designation || '').trim();

module.exports = {
  ADMIN_DESIGNATIONS,
  normalizeDesignation,
};
