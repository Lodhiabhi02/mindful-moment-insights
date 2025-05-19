
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SentimentEntry } from '@/services/dataService';
import { format } from 'date-fns';
import { SentimentLevel } from '@/services/sentimentService';
import { Heart, AlertTriangle, AlertOctagon } from 'lucide-react';

interface EntriesHistoryProps {
  entries: SentimentEntry[];
  onSelectEntry: (entry: SentimentEntry) => void;
  selectedEntryId?: string;
}

const getSentimentIcon = (level: SentimentLevel) => {
  switch(level) {
    case 'mild':
      return <Heart className="w-4 h-4 text-green-600" />;
    case 'moderate':
      return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    case 'severe':
      return <AlertOctagon className="w-4 h-4 text-rose-600" />;
    default:
      return null;
  }
};

const getSentimentClass = (level: SentimentLevel) => {
  switch(level) {
    case 'mild':
      return "emotion-bg-mild";
    case 'moderate':
      return "emotion-bg-moderate";
    case 'severe':
      return "emotion-bg-severe";
    default:
      return "";
  }
};

const EntriesHistory: React.FC<EntriesHistoryProps> = ({ entries, onSelectEntry, selectedEntryId }) => {
  // Sort entries by date, newest first
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return (
    <Card className="w-full shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Your Journal History</CardTitle>
      </CardHeader>
      
      <CardContent>
        {sortedEntries.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No entries yet. Start journaling to see your history.
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {sortedEntries.map((entry) => (
              <div 
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedEntryId === entry.id 
                    ? 'bg-mind-primary bg-opacity-20 border border-mind-primary' 
                    : 'hover:bg-secondary'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${getSentimentClass(entry.analysis.level)}`} />
                    <span className="text-sm font-medium">{format(new Date(entry.timestamp), 'MMM d, yyyy')}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{format(new Date(entry.timestamp), 'h:mm a')}</span>
                </div>
                
                <p className="text-sm line-clamp-2 text-foreground">
                  {entry.text}
                </p>
                
                <div className="flex items-center mt-2">
                  {getSentimentIcon(entry.analysis.level)}
                  <span className="text-xs ml-1 capitalize">
                    {entry.analysis.level} stress level
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EntriesHistory;
