const normalizeDepartmentName = (name) => {
  return String(name || '')
    .replace(/^Department\s+of\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const HALL_ALIASES = {
  'sheikh hasina chitree hall': 'Tapashi Rabeya Hall',
};

const normalizeHallName = (name) => {
  const trimmed = String(name || '').replace(/\s+/g, ' ').trim();
  if (!trimmed) return '';

  return HALL_ALIASES[trimmed.toLowerCase()] || trimmed;
};

module.exports = {
  normalizeDepartmentName,
  normalizeHallName,
};
