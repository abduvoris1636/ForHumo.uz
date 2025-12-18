const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function setupAdmin() {
  try {
    // MongoDB ga ulanish
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB ga ulandi...');

    // Admin modelini import qilish
    const Admin = mongoose.model('Admin', {
      username: String,
      passwordHash: String,
      role: String,
      lastLogin: Date,
      isActive: Boolean,
      createdAt: Date,
      updatedAt: Date
    });

    // Admin foydalanuvchini tekshirish
    const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    
    if (existingAdmin) {
      console.log('Admin foydalanuvchi allaqachon mavjud');
      await mongoose.disconnect();
      return;
    }

    // Yangi admin yaratish
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    
    const admin = new Admin({
      username: process.env.ADMIN_USERNAME,
      passwordHash: passwordHash,
      role: 'super_admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await admin.save();
    
    console.log('Admin foydalanuvchi muvaffaqiyatli yaratildi:');
    console.log('Username:', process.env.ADMIN_USERNAME);
    console.log('Password:', process.env.ADMIN_PASSWORD);
    
    await mongoose.disconnect();
    console.log('MongoDB ulanishi uzildi');
    
  } catch (error) {
    console.error('Xatolik:', error.message);
    process.exit(1);
  }
}

setupAdmin();
