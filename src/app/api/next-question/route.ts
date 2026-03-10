import { NextRequest, NextResponse } from 'next/server';
import { getQuestionsByCategoryAndDifficulty } from '@/lib/questions';
import { getNextDifficulty } from '@/lib/adaptive-algorithm';
import { generateAIQuestion } from '@/lib/gemini';
import type { Difficulty } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category,
      currentDifficulty,
      wasCorrect,
      streak,
      answeredIds = [],
      fixedDifficulty,
    } = body as {
      category: string;
      currentDifficulty: Difficulty;
      wasCorrect: boolean;
      streak: number;
      answeredIds?: string[];
      fixedDifficulty?: Difficulty;
    };

    if (!category || !currentDifficulty) {
      return NextResponse.json(
        { error: 'Category and currentDifficulty are required' },
        { status: 400 }
      );
    }

    const nextDifficulty =
      fixedDifficulty ?? getNextDifficulty(currentDifficulty, wasCorrect, streak ?? 0);

    const questions = getQuestionsByCategoryAndDifficulty(category, nextDifficulty, answeredIds);

    if (questions.length === 0) {
      const fallbackQuestions = getQuestionsByCategoryAndDifficulty(
        category,
        currentDifficulty,
        answeredIds
      );
      
      if (fallbackQuestions.length === 0) {
        // AI Fallback
        try {
          const aiQuestion = await generateAIQuestion(category, nextDifficulty);
          return NextResponse.json({
            question: aiQuestion,
            nextDifficulty,
          });
        } catch (err) {
          console.error('AI Fallback Error:', err);
          return NextResponse.json({ error: 'No more questions available and AI failed' }, { status: 404 });
        }
      }
      
      const question = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
      return NextResponse.json({
        question,
        nextDifficulty: currentDifficulty,
      });
    }

    const question = questions[Math.floor(Math.random() * questions.length)];
    return NextResponse.json({
      question,
      nextDifficulty,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
