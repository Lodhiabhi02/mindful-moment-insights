
import React from 'react';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">MindSense</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Track and understand your emotional wellbeing with AI-powered sentiment analysis.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/journal" className="text-muted-foreground hover:text-foreground transition">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/insights" className="text-muted-foreground hover:text-foreground transition">
                  Insights
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Important Information</h3>
            <p className="text-sm text-muted-foreground">
              MindSense is not a replacement for professional mental health care. 
              If you're experiencing severe distress, please seek professional help.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MindSense. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
