
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, BarChart, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero section */}
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Brain className="h-20 w-20 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Understand Your <span className="text-primary">Emotions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Track your mental wellbeing with AI-powered sentiment analysis. 
              Journal your thoughts and get personalized insights to improve your emotional health.
            </p>
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/journal">
                  <Button size="lg" className="w-full sm:w-auto">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Write in journal
                  </Button>
                </Link>
                <Link to="/insights">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <BarChart className="mr-2 h-5 w-5" />
                    View insights
                  </Button>
                </Link>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="lg">Get Started</Button>
              </Link>
            )}
          </div>
        </section>

        {/* Features section */}
        <section className="py-16 px-6 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How MindSense Helps You</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Express Yourself</h3>
                <p className="text-muted-foreground">
                  Journal your thoughts in a private, secure space. Our AI analyzes the sentiment of your entries.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Emotions</h3>
                <p className="text-muted-foreground">
                  Visualize emotional patterns over time with interactive charts and emotion tracking.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Insights</h3>
                <p className="text-muted-foreground">
                  Receive personalized recommendations based on your emotional patterns to improve wellbeing.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
