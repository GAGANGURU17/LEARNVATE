import { GoogleGenerativeAI } from '@google/generative-ai';
import { McqQuestion } from './types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function generateAIQuestion(category: string, difficulty: string): Promise<McqQuestion> {
  const prompt = `
    Generate a single high-quality multiple choice question for a learning platform called LEARNVATE.
    Category: ${category}
    Difficulty: ${difficulty}
    
    Format the response as a JSON object with the following structure:
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "difficulty": "${difficulty}",
      "category": "${category}",
      "explanation": "A brief explanation of why the answer is correct"
    }

    Ensure the question is factually accurate, educational, and fits the ${difficulty} difficulty level.
    Return ONLY the JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Clean potential markdown blocks
    const jsonStr = text.startsWith('```json') 
      ? text.replace(/^```json\n/, '').replace(/\n```$/, '')
      : text;
    
    const parsed = JSON.parse(jsonStr);
    
    return {
      ...parsed,
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    } as McqQuestion;
  } catch (error) {
    console.error('Gemini production error:', error);
    throw new Error('Failed to generate AI question');
  }
}
