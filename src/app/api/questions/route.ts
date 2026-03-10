import { NextRequest, NextResponse } from 'next/server';
import { getQuestionsByCategoryAndDifficulty, QUESTION_CATEGORIES } from '@/lib/questions';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const excludeIds = searchParams.get('exclude')?.split(',').filter(Boolean) ?? [];

  if (!category || !difficulty) {
    return NextResponse.json({ error: 'Category and difficulty are required' }, { status: 400 });
  }

  if (!QUESTION_CATEGORIES.includes(category as (typeof QUESTION_CATEGORIES)[number])) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  const validDifficulties = ['easy', 'medium', 'hard'];
  if (!validDifficulties.includes(difficulty)) {
    return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 });
  }

  const questions = getQuestionsByCategoryAndDifficulty(category, difficulty, excludeIds);

  if (questions.length === 0) {
    return NextResponse.json(
      { error: 'No questions available for this category and difficulty' },
      { status: 404 }
    );
  }

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  return NextResponse.json(randomQuestion);
}
