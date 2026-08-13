import { NextRequest, NextResponse } from 'next/server';
import { deviceApi } from '@core/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '20';
    const status = searchParams.get('status');

    const response = await deviceApi.list(parseInt(page), parseInt(perPage));

    let data = response.data.data || [];

    // Filter by status if provided
    if (status) {
      data = data.filter((device: any) => device.status === status);
    }

    return NextResponse.json({
      data,
      pagination: response.data.pagination,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}
