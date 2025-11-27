import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/constants/api.constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    const url = `${API_BASE_URL}${API_ENDPOINTS.PHOTOS.BY_USER(userId)}?page=${page}&limit=${limit}`;
    const response = await fetch(url);

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch user photos',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
