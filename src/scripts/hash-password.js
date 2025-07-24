import bcrypt from 'bcryptjs';

/**
 * @param {string} password
 */
async function hashPassword(password) {
  try {
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password hash:', hash);
    console.log('Add this to your .env.local file:');
    console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

const password = process.argv[2];
if (!password) {
  console.error('Usage: node hash-password.js <password>');
  process.exit(1);
}

hashPassword(password);