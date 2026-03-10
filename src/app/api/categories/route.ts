import { NextResponse } from 'next/server';
import { QUESTION_CATEGORIES } from '@/lib/questions';

export async function GET() {
  return NextResponse.json({
    categories: QUESTION_CATEGORIES,
  });
}
