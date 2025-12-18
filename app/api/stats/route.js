import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Team from '@/models/Team';

export async function GET() {
  try {
    await dbConnect();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalTeams,
      pendingTeams,
      approvedTeams,
      todayTeams,
      recentTeams
    ] = await Promise.all([
      Team.countDocuments(),
      Team.countDocuments({ status: 'pending' }),
      Team.countDocuments({ status: 'approved' }),
      Team.countDocuments({ 
        registeredAt: { $gte: today } 
      }),
      Team.find()
        .sort({ registeredAt: -1 })
        .limit(5)
        .select('teamName captainName telegramUsername registeredAt status teamLogo mlbbId')
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalTeams,
        pendingTeams,
        approvedTeams,
        todayTeams,
        recentTeams
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Server xatosi' },
      { status: 500 }
    );
  }
}
