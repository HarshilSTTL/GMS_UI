import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const grievanceId = formData.get('grievanceId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!grievanceId) {
      return NextResponse.json({ error: 'Grievance ID required' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        { error: 'Cloudinary configuration missing. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local' },
        { status: 500 }
      );
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', uploadPreset);
    uploadFormData.append('tags', `grievance-${grievanceId},document-submission`);
    uploadFormData.append('context', `grievance_id=${grievanceId}`);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      return NextResponse.json(
        { error: `Cloudinary upload failed: ${error.error?.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    const uploadData = await uploadResponse.json();

    return NextResponse.json({
      success: true,
      data: {
        url: uploadData.secure_url,
        publicId: uploadData.public_id,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
