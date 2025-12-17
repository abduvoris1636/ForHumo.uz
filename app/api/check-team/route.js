import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Team from '@/models/Team';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamName = searchParams.get('name');

    if (!teamName) {
      return NextResponse.json(
        { success: false, error: 'Jamoa nomi kiritilmadi' },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingTeam = await Team.findOne({ 
      teamName: { $regex: new RegExp(`^${teamName}$`, 'i') } 
    });

    return NextResponse.json({
      success: true,
      available: !existingTeam,
      message: existingTeam 
        ? 'Bu jamoa nomi allaqachon band' 
        : 'Jamoa nomi mavjud'
    });

  } catch (error) {
    console.error('Check team error:', error);
    return NextResponse.json(
      { success: false, error: 'Server xatosi' },
      { status: 500 }
    );
  }
}
