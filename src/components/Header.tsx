
import React from 'react';
import { Brain, BarChart } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onViewChange: (view: 'journal' | 'insights') => void;
  currentView: 'journal' | 'insights';
}

const Header: React.FC<HeaderProps> = ({ onViewChange, currentView }) => {
  return (
    <header className="w-full py-4 px-6 bg-mind-light shadow-sm animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center mb-4 sm:mb-0">
          <Brain className="h-8 w-8 text-mind-primary mr-2" />
          <h1 className="text-2xl font-semibold text-foreground">MindSense</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={currentView === 'journal' ? 'default' : 'outline'}
            onClick={() => onViewChange('journal')}
            className="transition-all"
          >
            <Brain className="h-4 w-4 mr-2" />
            Journal
          </Button>
          
          <Button 
            variant={currentView === 'insights' ? 'default' : 'outline'}
            onClick={() => onViewChange('insights')}
            className="transition-all"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Insights
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
