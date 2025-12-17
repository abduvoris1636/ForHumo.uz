import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import Log from '@/models/Log';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await dbConnect();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username va password kiritishingiz kerak' },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      await Log.create({
        action: 'admin_login',
        details: { username, success: false, reason: 'User not found' }
      });
      
      return NextResponse.json(
        { success: false, error: 'Noto\'g\'ri login yoki parol' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, admin.passwordHash);
    
    if (!isValidPassword) {
      await Log.create({
        action: 'admin_login',
        details: { username, success: false, reason: 'Invalid password' }
      });
      
      return NextResponse.json(
        { success: false, error: 'Noto\'g\'ri login yoki parol' },
        { status: 401 }
      );
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = generateToken(admin._id);

    // Log successful login
    await Log.create({
      action: 'admin_login',
      details: { username, success: true }
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: { username: admin.username }
    });

    // Set cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    
    await Log.create({
      action: 'error',
      details: { error: error.message, stack: error.stack }
    });

    return NextResponse.json(
      { success: false, error: 'Server xatosi' },
      { status: 500 }
    );
  }
}
