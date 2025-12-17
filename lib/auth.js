import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function initializeAdmin() {
  try {
    const adminExists = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    
    if (!adminExists) {
      const passwordHash = await hashPassword(process.env.ADMIN_PASSWORD);
      await Admin.create({
        username: process.env.ADMIN_USERNAME,
        passwordHash
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
}
