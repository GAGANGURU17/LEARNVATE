import { GoogleGenerativeAI } from '@google/generative-ai';
import { McqQuestion } from './types';

// Temporarily using the key directly to bypass environment loading issues in the current session
const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyAZ6UjiIfuLxOV1bZivmWx-35wMmK7yp1A';
const genAI = new GoogleGenerativeAI(apiKey);
// gemini-1.5-flash is usually the correct identifier for v1 and v1beta
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function generateAIQuestion(category: string, difficulty: string): Promise<McqQuestion> {
  const modelsToTry = [
    'gemini-1.5-flash', 
    'gemini-1.5-flash-8b', 
    'gemini-1.5-pro',
    'gemini-pro'
  ];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting AI generation with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const prompt = `
        Generate a single high-quality multiple choice question for a learning platform called LEARNVATE, which specializes in Indian Competitive Exams.
        Category: ${category} (e.g., UPSC, GATE, SSC, Govt Job)
        Level: ${difficulty} (e.g., Preliminary, Mains, Advanced)
        
        The question must follow the actual syllabus and pattern of Indian exams.
        For UPSC: Focus on conceptual depth, analytical thinking, and current affairs.
        For GATE: Focus on technical accuracy, problem-solving, and core engineering concepts.
        For SSC/Govt: Focus on factual accuracy, speed-based logic, and general awareness.
        
        Format the response as a JSON object with the following structure:
        {
          "question": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIndex": 0,
          "difficulty": "${difficulty}",
          "category": "${category}",
          "explanation": "A detailed explanation including the logic or facts behind the correct answer"
        }

        Ensure the question is factually accurate, highly educational, and fits the ${difficulty} level of the ${category} exam.
        Return ONLY the JSON object.
      `;

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
      console.warn(`Model ${modelName} failed:`, error instanceof Error ? error.message : error);
      lastError = error;
      // If it's a 404 "not found" error, try next model
      continue;
    }
  }

  // If all models fail (v2)
  console.error('All Gemini models failed. Last error:', lastError);
  const errorMessage = lastError instanceof Error ? lastError.message : 'Unknown Gemini error';
  throw new Error(`AI generation failed [v2] after trying models [${modelsToTry.join(', ')}]. Last error: ${errorMessage}`);
}
