import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const analysisId = searchParams.get('analysisId') || undefined;
    const types = searchParams.get('types')?.split(',') || [];
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (analysisId) {
      where.analysisId = analysisId;
    }

    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { extractedText: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (types.length > 0) {
      where.fileType = {
        in: types,
      };
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    // Fetch documents
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: limit,
        include: {
          analysis: {
            select: {
              id: true,
              processNumber: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.document.count({ where }),
    ]);

    return NextResponse.json(
      {
        documents,
        total,
        page,
        limit,
        hasMore: skip + documents.length < total,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
