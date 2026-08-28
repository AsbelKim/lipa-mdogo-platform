import { NextRequest, NextResponse } from 'next/server';
import { leadApi } from '@lipa/core/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await leadApi.listByAgent(params.id);
    return NextResponse.json({
      data: response,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
