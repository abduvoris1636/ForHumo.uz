import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Team from '@/models/Team';
import Log from '@/models/Log';
import { uploadImage } from '@/lib/cloudinary';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request) {
  try {
    await dbConnect();

    const formData = await request.formData();
    
    const teamName = formData.get('teamName');
    const captainName = formData.get('captainName');
    const mlbbId = formData.get('mlbbId');
    const telegramUsername = formData.get('telegramUsername');
    const logoFile = formData.get('teamLogo');

    // Validation
    if (!teamName || !captainName || !mlbbId || !telegramUsername || !logoFile) {
      return NextResponse.json(
        { success: false, error: 'Barcha maydonlarni to\'ldiring' },
        { status: 400 }
      );
    }

    // Check team name uniqueness
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return NextResponse.json(
        { success: false, error: 'Bu jamoa nomi allaqachon mavjud' },
        { status: 400 }
      );
    }

    // Upload logo to Cloudinary
    const logoBuffer = await logoFile.arrayBuffer();
    const uploadResult = await uploadImage(Buffer.from(logoBuffer));

    // Create team
    const team = await Team.create({
      teamName,
      captainName,
      mlbbId,
      telegramUsername,
      teamLogo: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      status: 'pending'
    });

    // Send Telegram notification
    await sendTelegramNotification(team);

    // Log the action
    await Log.create({
      action: 'team_registered',
      details: { teamId: team._id, teamName }
    });

    return NextResponse.json({
      success: true,
      data: team,
      message: 'Jamoa muvaffaqiyatli ro\'yxatdan o\'tdi!'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    await Log.create({
      action: 'error',
      details: { error: error.message, stack: error.stack }
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Server xatosi yuz berdi. Iltimos, keyinroq urinib ko\'ring.' 
      },
      { status: 500 }
    );
  }
}
