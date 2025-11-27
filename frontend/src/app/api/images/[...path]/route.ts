import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants/api.constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    const imagePath = pathArray.join('/');
    const imageUrl = `${API_BASE_URL}/uploads/photos/${imagePath}`;

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: 'Image not found' },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch image',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
