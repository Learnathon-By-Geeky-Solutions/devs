import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { ENV_VARS } from '@/constants/keys';

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: ENV_VARS.CLOUDINARY_CLOUD_NAME,
  api_key: ENV_VARS.CLOUDINARY_API_KEY,
  api_secret: ENV_VARS.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body to get the public_id of the file to delete
    const data = await request.json();
    const { publicId } = data;

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    // Delete the file from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true // Invalidate CDN caches
    });

    if (result.result !== 'ok') {
      throw new Error(`Failed to delete file: ${result.result}`);
    }

    return NextResponse.json({ success: true, message: 'File deleted successfully' });
  } catch (error: unknown) {
    console.error('Cloudinary delete error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Delete failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
