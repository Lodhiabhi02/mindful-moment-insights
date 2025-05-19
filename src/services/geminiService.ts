
import { supabase } from '@/integrations/supabase/client';

export interface GeminiResponse<T = any> {
  content: T;
  rawContent: string;
}

export class GeminiService {
  /**
   * Generate content using Gemini API
   * @param prompt The prompt to send to Gemini
   * @param responseFormat Optional format specification ('json' or 'text')
   * @returns The generated content
   */
  static async generateContent<T = any>(
    prompt: string, 
    responseFormat: 'json' | 'text' = 'text'
  ): Promise<GeminiResponse<T>> {
    try {
      const { data, error } = await supabase.functions.invoke('gemini-generate', {
        body: { prompt, responseFormat }
      });
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('No data received from Gemini API');
      
      return data as GeminiResponse<T>;
    } catch (error) {
      console.error('Error generating content with Gemini:', error);
      throw error;
    }
  }

  /**
   * Generate recommendations based on emotional analysis
   * @param emotionalState The user's emotional state description
   * @returns An array of personalized recommendations
   */
  static async getPersonalizedRecommendations(
    emotionalState: string, 
    sentimentScore: number
  ): Promise<string[]> {
    const prompt = `
      Based on the following emotional state and sentiment score, generate 5 helpful wellness recommendations.
      Emotional state: ${emotionalState}
      Sentiment score: ${sentimentScore} (ranges from -1 to 1, where -1 is very negative, 0 is neutral, and 1 is very positive)
      
      Please respond with a JSON array of 5 strings, each containing a concise recommendation.
      Format the response as valid JSON only, like this: ["recommendation 1", "recommendation 2", ...]
    `;
    
    try {
      const { content } = await this.generateContent<string[]>(prompt, 'json');
      return Array.isArray(content) ? content : [];
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [
        'Take a moment to appreciate something positive in your day.',
        'Try a short 2-minute mindful breathing exercise.',
        'Consider going for a brief walk outside if possible.',
        'Write down three things you're grateful for right now.',
        'Listen to a favorite uplifting song.'
      ];
    }
  }

  /**
   * Analyze important emotional words in text
   * @param text The journal entry text to analyze
   * @returns An array of important emotional words
   */
  static async getImportantEmotionalWords(text: string): Promise<string[]> {
    const prompt = `
      Analyze the following journal entry and identify the 5 most emotionally significant words or short phrases.
      Text: "${text}"
      
      Please respond with a JSON array of strings, each containing a significant word or short phrase.
      Format the response as valid JSON only, like this: ["word1", "word2", ...]
    `;
    
    try {
      const { content } = await this.generateContent<string[]>(prompt, 'json');
      return Array.isArray(content) ? content : [];
    } catch (error) {
      console.error('Error extracting important words:', error);
      return [];
    }
  }
}
