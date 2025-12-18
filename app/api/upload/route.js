import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Fayl yuklanmadi' },
        { status: 400 }
      );
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Fayl hajmi 5MB dan oshmasligi kerak' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Faqat rasm fayllari (JPG, PNG, WebP, GIF) qabul qilinadi' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const fileBuffer = await file.arrayBuffer();
    const uploadResult = await uploadImage(Buffer.from(fileBuffer), 'humoesport/logos');

    return NextResponse.json({
      success: true,
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Server xatosi: ' + error.message },
      { status: 500 }
    );
  }
}
