
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import JournalView from '@/components/JournalView';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Brain } from 'lucide-react';
import { SentimentEntry } from '@/services/dataService';

const JournalPage = () => {
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
      
      // Convert to SentimentEntry format
      const formattedEntries: SentimentEntry[] = data.map(entry => ({
        id: entry.id,
        text: entry.text,
        timestamp: new Date(entry.created_at),
        analysis: {
          score: entry.sentiment_score || 0,
          emotions: entry.emotions || {
            joy: 0,
            sadness: 0,
            fear: 0,
            anger: 0,
            love: 0,
            surprise: 0
          }
        },
        recommendations: entry.recommendations || []
      }));
      
      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewEntry = async (entry: SentimentEntry) => {
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          id: entry.id,
          user_id: user?.id,
          text: entry.text,
          sentiment_score: entry.analysis.score,
          emotions: entry.analysis.emotions,
          recommendations: entry.recommendations,
          created_at: entry.timestamp.toISOString()
        });
        
      if (error) throw error;
      
      // Update local state
      setEntries(prevEntries => [entry, ...prevEntries]);
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container max-w-7xl py-12">
      <h1 className="text-3xl font-bold mb-8">Your Journal</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center">
            <Brain className="h-12 w-12 text-primary animate-pulse-gentle" />
            <p className="mt-4 text-foreground">Loading your journal entries...</p>
          </div>
        </div>
      ) : (
        <JournalView 
          entries={entries} 
          onNewEntry={handleNewEntry} 
        />
      )}
    </div>
  );
};

export default JournalPage;
