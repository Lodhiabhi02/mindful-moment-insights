
import React, { useState } from 'react';
import JournalInput from './JournalInput';
import SentimentResult from './SentimentResult';
import EntriesHistory from './EntriesHistory';
import { SentimentEntry } from '@/services/dataService';

interface JournalViewProps {
  entries: SentimentEntry[];
  onNewEntry: (entry: SentimentEntry) => void;
}

const JournalView: React.FC<JournalViewProps> = ({ entries, onNewEntry }) => {
  const [selectedEntry, setSelectedEntry] = useState<SentimentEntry | null>(null);
  
  // Handle new entry creation
  const handleAnalysisComplete = (entry: SentimentEntry) => {
    onNewEntry(entry);
    setSelectedEntry(entry);
  };
  
  // Handle entry selection from history
  const handleSelectEntry = (entry: SentimentEntry) => {
    setSelectedEntry(entry);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div className="md:col-span-2 space-y-6">
        <JournalInput onAnalysisComplete={handleAnalysisComplete} />
        
        {selectedEntry && (
          <SentimentResult entry={selectedEntry} />
        )}
      </div>
      
      <div className="md:col-span-1">
        <EntriesHistory 
          entries={entries} 
          onSelectEntry={handleSelectEntry} 
          selectedEntryId={selectedEntry?.id}
        />
      </div>
    </div>
  );
};

export default JournalView;
