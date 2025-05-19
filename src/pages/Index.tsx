
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import JournalView from '@/components/JournalView';
import InsightsView from '@/components/InsightsView';
import { dataService, SentimentEntry } from '@/services/dataService';
import { Brain } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [currentView, setCurrentView] = useState<'journal' | 'insights'>('journal');
  const [entries, setEntries] = useState<SentimentEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load entries from storage on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const storedEntries = dataService.getEntries();
        setEntries(storedEntries);
      } catch (error) {
        console.error('Error loading entries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEntries();
  }, []);
  
  // Handle new entry creation
  const handleNewEntry = (entry: SentimentEntry) => {
    setEntries(prevEntries => [entry, ...prevEntries]);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onViewChange={setCurrentView} currentView={currentView} />
      
      <main className="flex-grow px-4 py-6 max-w-6xl mx-auto w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center">
              <Brain className="h-12 w-12 text-mind-primary animate-pulse-gentle" />
              <p className="mt-4 text-foreground">Loading your mind journal...</p>
            </div>
          </div>
        ) : (
          <>
            {currentView === 'journal' && (
              <JournalView entries={entries} onNewEntry={handleNewEntry} />
            )}
            
            {currentView === 'insights' && (
              <InsightsView entries={entries} />
            )}
          </>
        )}
      </main>
      
      <footer className="py-4 px-6 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          MindSense - Mental Health Sentiment Analysis App
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Note: This is not a clinical tool. If you're experiencing severe distress, please seek professional help.
        </p>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
