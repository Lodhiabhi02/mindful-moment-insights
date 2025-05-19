
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SentimentEntry } from '@/services/dataService';
import { format } from 'date-fns';
import { SentimentLevel } from '@/services/sentimentService';
import { Separator } from '@/components/ui/separator';
import { HeartPulse, Heart, AlertTriangle, AlertOctagon, Sparkles } from 'lucide-react';

interface SentimentResultProps {
  entry: SentimentEntry;
}

const getSentimentIcon = (level: SentimentLevel) => {
  switch(level) {
    case 'mild':
      return <Heart className="w-5 h-5 text-green-600" />;
    case 'moderate':
      return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    case 'severe':
      return <AlertOctagon className="w-5 h-5 text-rose-600" />;
    default:
      return <HeartPulse className="w-5 h-5 text-foreground" />;
  }
};

const getSentimentTitle = (level: SentimentLevel) => {
  switch(level) {
    case 'mild':
      return "Minimal Stress Detected";
    case 'moderate':
      return "Moderate Stress Detected";
    case 'severe':
      return "High Stress Detected";
    default:
      return "Analysis Results";
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

const SentimentResult: React.FC<SentimentResultProps> = ({ entry }) => {
  const { text, timestamp, analysis, recommendations } = entry;
  const formattedDate = format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  
  // Calculate emotion percentages for the bar display
  const emotionValues = Object.entries(analysis.emotions)
    .sort((a, b) => b[1] - a[1]) // Sort by highest value
    .map(([emotion, value]) => ({
      emotion,
      percentage: Math.round(value * 100), // Convert to percentage
    }));
  
  return (
    <Card className="w-full max-w-3xl mx-auto my-6 shadow-md overflow-hidden animate-fade-in">
      <div className={`w-full h-2 ${getSentimentClass(analysis.level)}`} />
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getSentimentIcon(analysis.level)}
            <CardTitle className="ml-2 text-xl font-medium">
              {getSentimentTitle(analysis.level)}
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            {formattedDate}
          </Badge>
        </div>
        <CardDescription className="mt-2">
          "{text}"
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Emotion Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Emotion Breakdown</h4>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Gemini AI</span>
            </Badge>
          </div>
          <div className="space-y-2">
            {emotionValues.map(({ emotion, percentage }) => (
              <div key={emotion} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="capitalize">{emotion}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-mind-primary rounded-full h-2" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Important Words */}
        {analysis.importantWords.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Key Emotional Words</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.importantWords.map((word) => (
                <Badge key={word} variant="secondary" className="bg-mind-light text-mind-primary">
                  {word}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Separator />
        
        {/* Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Wellness Suggestions</h4>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>AI Generated</span>
            </Badge>
          </div>
          <ul className="space-y-2 text-sm">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-4 h-4 bg-mind-primary rounded-full mr-2 mt-1 flex-shrink-0" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        Remember: This is an AI-powered analysis and not a clinical assessment. If you're experiencing persistent distress, consider speaking with a mental health professional.
      </CardFooter>
    </Card>
  );
};

export default SentimentResult;
