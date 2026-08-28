import { NextRequest, NextResponse } from 'next/server';
import { saleApi } from '@lipa/core/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await saleApi.create(body);
    return NextResponse.json({
      data: response.data,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create sale' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '20';

    const response = await saleApi.list(parseInt(page), parseInt(perPage));
    return NextResponse.json({
      data: response.data.data,
      pagination: response.data.pagination,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}
