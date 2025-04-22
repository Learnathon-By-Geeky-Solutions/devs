import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import { ENV_VARS } from '@/constants/keys';

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: ENV_VARS.CLOUDINARY_CLOUD_NAME,
  api_key: ENV_VARS.CLOUDINARY_API_KEY,
  api_secret: ENV_VARS.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Get form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a temporary file path for uploading
    const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload options
    const uploadOptions: UploadApiOptions = {
      resource_type: 'auto', // Auto-detect whether it's an image, video, or raw file
      folder: 'roamance',
      filename_override: file.name,
    };

    // Only add upload_preset if it's defined and not empty
    if (ENV_VARS.CLOUDINARY_UPLOAD_PRESET && ENV_VARS.CLOUDINARY_UPLOAD_PRESET !== 'roamance') {
      uploadOptions.upload_preset = ENV_VARS.CLOUDINARY_UPLOAD_PRESET;
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUrl, uploadOptions);

    return NextResponse.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      resource_type: uploadResult.resource_type,
      format: uploadResult.format,
      original_filename: file.name,
    });
  } catch (error: unknown) {
    console.error('Cloudinary upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
