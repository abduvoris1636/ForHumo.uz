import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Team from '@/models/Team';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await dbConnect();

    // Check for admin authentication
    const token = request.cookies.get('admin_token')?.value;
    const decoded = verifyToken(token);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { teamName: { $regex: search, $options: 'i' } },
        { captainName: { $regex: search, $options: 'i' } },
        { telegramUsername: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [teams, total] = await Promise.all([
      Team.find(query)
        .sort({ registeredAt: -1 })
        .skip(skip)
        .limit(limit),
      Team.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: teams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get teams error:', error);
    return NextResponse.json(
      { success: false, error: 'Server xatosi' },
      { status: 500 }
    );
  }
}
