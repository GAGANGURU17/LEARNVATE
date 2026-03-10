import { NextRequest, NextResponse } from 'next/server';
import { generateAIQuestion } from '@/lib/gemini';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');

  if (!category || !difficulty) {
    return NextResponse.json(
      { error: 'Category and difficulty are required' },
      { status: 400 }
    );
  }

  try {
    const question = await generateAIQuestion(category, difficulty);
    return NextResponse.json(question);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}
