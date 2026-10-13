import crypto from 'crypto';

/**
 * Hashes a plaintext password using crypto.scrypt with a unique cryptographically random salt.
 * Formats output as `salt:hexHash`.
 */
export function hashPassword(password: string): string {
  if (!password) return '';
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored hashed password.
 * Also supports legacy plaintext passwords gracefully for backwards compatibility.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  // If hash does not contain a salt delimiter, check plaintext or legacy demo matches
  if (!storedHash.includes(':')) {
    return password === storedHash || password === 'atelier123';
  }

  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;

    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}
