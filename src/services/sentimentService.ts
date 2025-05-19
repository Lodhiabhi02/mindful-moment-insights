
// Import transformers in a way that won't break if the module isn't available
let pipeline: any;
try {
  // Dynamic import to avoid build errors when the module isn't available
  ({ pipeline } = require("@huggingface/transformers"));
} catch (error) {
  console.warn("@huggingface/transformers not available, using mock implementation");
  // Mock pipeline function for development/testing
  pipeline = async () => {
    console.log("Using mock pipeline function");
    return (text: string) => Promise.resolve({ text });
  };
}

import { GeminiService } from './geminiService';

// Types for sentiment analysis
export type EmotionScores = {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  love: number;
  surprise: number;
};

export type SentimentLevel = "mild" | "moderate" | "severe";

export type SentimentResult = {
  level: SentimentLevel;
  emotions: EmotionScores;
  score: number;
  importantWords: string[];
};

// Recommendations based on sentiment levels
const recommendations = {
  mild: [
    "Take a moment to appreciate something positive in your day.",
    "Try a short 2-minute mindful breathing exercise.",
    "Consider going for a brief walk outside if possible.",
    "Write down three things you're grateful for right now.",
    "Listen to a favorite uplifting song.",
  ],
  moderate: [
    "Try the 5-4-3-2-1 grounding technique: notice 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, and 1 thing you taste.",
    "Practice box breathing: inhale for 4 counts, hold for 4, exhale for 4, hold for 4, and repeat.",
    "Take a short break from screens and current tasks.",
    "Try gentle stretching or simple yoga poses for 5 minutes.",
    "Write down what's on your mind to externalize your thoughts.",
  ],
  severe: [
    "If possible, move to a quiet space where you can take some time for yourself.",
    "Try a guided meditation focused on anxiety relief (even just 5 minutes).",
    "Practice progressive muscle relaxation by tensing and releasing each muscle group.",
    "Consider reaching out to a supportive friend, family member, or counselor.",
    "Focus on slow, deep breathing - in through the nose for 5 counts, out through the mouth for 7.",
  ],
};

// Sentiment analysis service - now with Gemini integration
export class SentimentAnalysisService {
  private classifier: any;
  private isLoading: boolean = false;
  private isModelReady: boolean = false;
  private useGemini: boolean = true;

  constructor() {
    this.initializeModel();
  }

  async initializeModel(): Promise<void> {
    try {
      this.isLoading = true;
      // In a production app, we would use a real sentiment analysis pipeline
      // like this (commented out to avoid loading real models in this demo):
      // this.classifier = await pipeline('sentiment-analysis', 'distilbert-base-uncased-finetuned-sst-2-english');
      this.isModelReady = true;
      console.log("Sentiment model initialized (simulated)");
    } catch (error) {
      console.error("Error initializing model:", error);
    } finally {
      this.isLoading = false;
    }
  }

  // Updated to use Gemini when available
  async analyzeText(text: string): Promise<SentimentResult> {
    // Ensure the model is ready (or fake model in this case)
    if (!this.isModelReady) {
      await this.initializeModel();
    }

    try {
      if (this.useGemini) {
        return await this.analyzeWithGemini(text);
      } else {
        // Fall back to the simulated analysis if Gemini is unavailable
        return await this.simulateAnalysis(text);
      }
    } catch (error) {
      console.error("Error in sentiment analysis:", error);
      // If Gemini fails, fall back to simulated analysis
      return this.simulateAnalysis(text);
    }
  }
  
  // New method to analyze text with Gemini
  private async analyzeWithGemini(text: string): Promise<SentimentResult> {
    // Prompt for Gemini to analyze emotions and sentiment
    const prompt = `
      Analyze the following text for emotional content and sentiment.
      Text: "${text}"
      
      Respond with a JSON object that has the following structure:
      {
        "score": number, // overall sentiment score between -1 (very negative) to 1 (very positive)
        "level": string, // "mild", "moderate", or "severe" based on the negativity
        "emotions": {
          "joy": number, // between 0 and 1
          "sadness": number, // between 0 and 1
          "anger": number, // between 0 and 1
          "fear": number, // between 0 and 1
          "love": number, // between 0 and 1
          "surprise": number // between 0 and 1
        }
      }
      
      The sum of all emotion values should be 1.0. Format the response as valid JSON only.
    `;
    
    try {
      // Call Gemini API for sentiment analysis
      const { content } = await GeminiService.generateContent<{
        score: number;
        level: SentimentLevel;
        emotions: EmotionScores;
      }>(prompt, 'json');
      
      // Extract important words separately with another call
      const importantWords = await GeminiService.getImportantEmotionalWords(text);
      
      return {
        score: content.score,
        level: content.level as SentimentLevel,
        emotions: content.emotions,
        importantWords
      };
    } catch (error) {
      console.error("Error analyzing with Gemini:", error);
      throw error;
    }
  }

  // Original simulation method (kept as fallback)
  private async simulateAnalysis(text: string): Promise<SentimentResult> {
    // Sleep to simulate model processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple keyword-based simulation of sentiment analysis
    const lowerText = text.toLowerCase();
    
    // Define emotional keyword dictionaries for our simple demo
    const emotionalKeywords = {
      joy: ["happy", "glad", "joy", "excited", "wonderful", "love", "great", "good", "positive", "awesome"],
      sadness: ["sad", "upset", "down", "blue", "depressed", "unhappy", "disappointed", "hurt", "pain", "miserable"],
      anger: ["angry", "mad", "furious", "irritated", "annoyed", "frustrated", "hate", "rage", "hostile", "resent"],
      fear: ["afraid", "scared", "fear", "anxious", "worry", "nervous", "panic", "dread", "terror", "uneasy"],
      love: ["love", "adore", "affection", "care", "fond", "trust", "compassion", "tender", "kind", "warm"],
      surprise: ["surprised", "shocked", "amazed", "astonished", "wow", "unexpected", "startled", "sudden", "incredible", "unpredictable"],
    };

    // Analyze text tokens for emotions
    const tokens = lowerText.split(/\s+/);
    
    // Calculate emotion scores
    const emotions: EmotionScores = {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      love: 0,
      surprise: 0,
    };

    // Track important words that contributed to emotions
    const importantWordsMap: Map<string, number> = new Map();

    // Calculate emotion scores based on keyword matches
    for (const token of tokens) {
      for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
        if (keywords.some(keyword => token.includes(keyword))) {
          emotions[emotion as keyof EmotionScores] += 1;
          importantWordsMap.set(token, (importantWordsMap.get(token) || 0) + 1);
        }
      }
    }

    // Normalize scores
    const totalEmotionScore = Object.values(emotions).reduce((sum, val) => sum + val, 0);
    
    for (const emotion in emotions) {
      emotions[emotion as keyof EmotionScores] = totalEmotionScore > 0 
        ? emotions[emotion as keyof EmotionScores] / totalEmotionScore 
        : 0;
    }

    // Determine stress/anxiety level
    const negativeScore = emotions.sadness + emotions.fear + emotions.anger;
    const positiveScore = emotions.joy + emotions.love + emotions.surprise;
    
    // Calculate overall sentiment score (-1 to 1)
    const sentimentScore = positiveScore - negativeScore;
    
    // Determine stress level based on negative emotions
    let level: SentimentLevel = "mild";
    if (negativeScore > 0.7) {
      level = "severe";
    } else if (negativeScore > 0.4) {
      level = "moderate";
    }

    // Get the top important words
    const importantWords = Array.from(importantWordsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    return {
      level,
      emotions,
      score: sentimentScore,
      importantWords,
    };
  }

  // Update to use Gemini for personalized recommendations when available
  async getRecommendations(level: SentimentLevel, text?: string): Promise<string[]> {
    if (this.useGemini && text) {
      try {
        // Get personalized recommendations from Gemini
        const recommendations = await GeminiService.getPersonalizedRecommendations(
          text,
          level === "severe" ? -0.8 : level === "moderate" ? -0.4 : 0
        );
        
        if (recommendations.length >= 3) {
          return recommendations;
        }
      } catch (error) {
        console.error("Error getting recommendations from Gemini:", error);
      }
    }
    
    // Fall back to default recommendations
    return recommendations[level];
  }
}

// Create a singleton instance
export const sentimentService = new SentimentAnalysisService();
