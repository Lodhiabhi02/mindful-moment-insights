
import { SentimentResult } from "./sentimentService";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

export interface SentimentEntry {
  id: string;
  text: string;
  timestamp: Date;
  analysis: SentimentResult;
  recommendations: string[];
}

class DataService {
  private storageKey = "mind_sentiment_entries";
  
  // Get all entries (now from localStorage as fallback if not logged in)
  getEntries(): SentimentEntry[] {
    const storedEntries = localStorage.getItem(this.storageKey);
    if (!storedEntries) return [];
    
    try {
      const entries = JSON.parse(storedEntries);
      // Convert stored date strings back to Date objects
      return entries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
    } catch (error) {
      console.error("Error parsing entries:", error);
      return [];
    }
  }
  
  // Add a new entry
  addEntry(entry: SentimentEntry): void {
    const entries = this.getEntries();
    
    // Create a new entry with a unique ID if not provided
    const newEntry = {
      ...entry,
      id: entry.id || uuidv4()
    };
    
    entries.push(newEntry);
    localStorage.setItem(this.storageKey, JSON.stringify(entries));
    return;
  }
  
  // Delete an entry
  deleteEntry(id: string): void {
    const entries = this.getEntries();
    const updatedEntries = entries.filter(entry => entry.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(updatedEntries));
  }
  
  // Get entries for a specific date range
  getEntriesInRange(startDate: Date, endDate: Date): SentimentEntry[] {
    const entries = this.getEntries();
    return entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }
  
  // Get average sentiment score for a date range
  getAverageSentiment(startDate: Date, endDate: Date): number {
    const entries = this.getEntriesInRange(startDate, endDate);
    if (entries.length === 0) return 0;
    
    const total = entries.reduce((sum, entry) => sum + entry.analysis.score, 0);
    return total / entries.length;
  }
  
  // Get emotion trends over time
  getEmotionTrends(days: number = 7): any[] {
    const entries = this.getEntries();
    if (entries.length === 0) return [];
    
    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    // Group entries by day
    const groupedByDay: Record<string, SentimentEntry[]> = {};
    
    sortedEntries.forEach(entry => {
      const dateStr = entry.timestamp.toISOString().split('T')[0];
      if (!groupedByDay[dateStr]) {
        groupedByDay[dateStr] = [];
      }
      groupedByDay[dateStr].push(entry);
    });
    
    // Calculate average emotions per day
    const trends = Object.entries(groupedByDay).map(([date, dayEntries]) => {
      const emotionsSum = {
        joy: 0,
        sadness: 0,
        anger: 0,
        fear: 0,
        love: 0,
        surprise: 0,
      };
      
      dayEntries.forEach(entry => {
        Object.entries(entry.analysis.emotions).forEach(([emotion, value]) => {
          emotionsSum[emotion as keyof typeof emotionsSum] += value;
        });
      });
      
      const emotionsAvg = Object.entries(emotionsSum).reduce((avg: any, [emotion, sum]) => {
        avg[emotion] = sum / dayEntries.length;
        return avg;
      }, {});
      
      return {
        date,
        ...emotionsAvg,
        entries: dayEntries.length,
      };
    });
    
    // Return only the most recent X days
    return trends.slice(-days);
  }
}

export const dataService = new DataService();
