import { NextRequest, NextResponse } from 'next/server';
import { saleApi } from '@lipa/core/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await saleApi.listByAgent(params.id);
    return NextResponse.json({
      data: response.data,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}
