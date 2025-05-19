
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { sentimentService, SentimentResult } from '@/services/sentimentService';
import { v4 as uuidv4 } from 'uuid';
import { dataService, SentimentEntry } from '@/services/dataService';

interface JournalInputProps {
  onAnalysisComplete?: (entry: SentimentEntry) => void;
}

const JournalInput: React.FC<JournalInputProps> = ({ onAnalysisComplete }) => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  
  const analyzeText = async () => {
    if (!text.trim()) {
      toast({
        title: "Entry is empty",
        description: "Please share your thoughts before analyzing.",
        variant: "destructive",
      });
      return;
    }
    
    if (text.length < 10) {
      toast({
        title: "Entry is too short",
        description: "Please write a bit more for better analysis.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      
      // Call the sentiment analysis service
      const result = await sentimentService.analyzeText(text);
      
      // Get recommendations based on sentiment level
      const recommendations = sentimentService.getRecommendations(result.level);
      
      // Create a new entry
      const newEntry: SentimentEntry = {
        id: uuidv4(),
        text,
        timestamp: new Date(),
        analysis: result,
        recommendations,
      };
      
      // Save entry
      dataService.addEntry(newEntry);
      
      // Notify parent component
      if (onAnalysisComplete) {
        onAnalysisComplete(newEntry);
      }
      
      // Show success toast
      toast({
        title: "Analysis complete",
        description: "Your entry has been analyzed successfully.",
      });
      
      // Clear the input
      setText("");
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-foreground">How are you feeling today?</CardTitle>
        <CardDescription>
          Express your thoughts and feelings, and I'll analyze your emotional state.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Textarea
          placeholder="Share what's on your mind... (e.g., 'I'm feeling overwhelmed with work deadlines, but excited about the weekend plans.')"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[120px] resize-none focus:ring-mind-primary"
        />
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button 
          onClick={analyzeText} 
          disabled={isAnalyzing || !text.trim()}
          className="bg-mind-primary hover:bg-mind-secondary text-white"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Sentiment"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JournalInput;
