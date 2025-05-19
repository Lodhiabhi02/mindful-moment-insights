
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import InsightsView from '@/components/InsightsView';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Brain } from 'lucide-react';
import { SentimentEntry } from '@/services/dataService';
import { SentimentLevel } from '@/services/sentimentService';

const InsightsPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<SentimentEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Convert to SentimentEntry format with proper analysis structure
      const formattedEntries: SentimentEntry[] = data.map(entry => {
        // Calculate sentiment level based on score
        let level: SentimentLevel = "mild";
        if (entry.sentiment_score !== null) {
          const score = entry.sentiment_score;
          if (score < -0.3) {
            level = "severe";
          } else if (score < 0) {
            level = "moderate";
          }
        }
        
        // Ensure emotions object has the correct structure
        const emotions = entry.emotions ? 
          (typeof entry.emotions === 'object' ? entry.emotions : {
            joy: 0,
            sadness: 0,
            fear: 0,
            anger: 0,
            love: 0,
            surprise: 0
          }) : {
            joy: 0,
            sadness: 0,
            fear: 0,
            anger: 0,
            love: 0,
            surprise: 0
          };
        
        // Extract important words or use empty array
        const importantWords = entry.emotions && typeof entry.emotions === 'object' && 'importantWords' in entry.emotions 
          ? entry.emotions.importantWords || [] 
          : [];
        
        return {
          id: entry.id,
          text: entry.text,
          timestamp: new Date(entry.created_at),
          analysis: {
            score: entry.sentiment_score || 0,
            level,
            emotions,
            importantWords: Array.isArray(importantWords) ? importantWords : []
          },
          recommendations: entry.recommendations || []
        };
      });
      
      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container max-w-7xl py-12">
      <h1 className="text-3xl font-bold mb-8">Your Insights</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center">
            <Brain className="h-12 w-12 text-primary animate-pulse-gentle" />
            <p className="mt-4 text-foreground">Analyzing your emotional data...</p>
          </div>
        </div>
      ) : (
        <InsightsView entries={entries} />
      )}
    </div>
  );
};

export default InsightsPage;
