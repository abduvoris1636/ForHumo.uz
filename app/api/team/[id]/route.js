import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Team from '@/models/Team';
import Log from '@/models/Log';
import { verifyToken } from '@/lib/auth';
import { deleteImage } from '@/lib/cloudinary';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const team = await Team.findById(params.id);
    
    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Jamoa topilmadi' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: team
    });

  } catch (error) {
    console.error('Get team error:', error);
    return NextResponse.json(
      { success: false, error: 'Server xatosi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    // Verify admin
    const token = request.cookies.get('admin_token')?.value;
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Ruxsat yo\'q' },
        { status: 401 }
      );
    }

    const team = await Team.findById(params.id);
    
    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Jamoa topilmadi' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary
    if (team.cloudinaryPublicId) {
      await deleteImage(team.cloudinaryPublicId);
    }

    await Team.findByIdAndDelete(params.id);

    // Log the action
    await Log.create({
      action: 'team_deleted',
      details: { 
        teamId: params.id, 
        teamName: team.teamName,
        deletedBy: decoded.userId 
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Jamoa muvaffaqiyatli o\'chirildi'
    });

  } catch (error) {
    console.error('Delete team error:', error);
    
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
