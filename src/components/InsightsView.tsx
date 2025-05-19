
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SentimentEntry, dataService } from '@/services/dataService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { addDays, format, subDays, startOfDay } from 'date-fns';

interface InsightsViewProps {
  entries: SentimentEntry[];
}

const InsightsView: React.FC<InsightsViewProps> = ({ entries }) => {
  // Calculate stats
  const totalEntries = entries.length;
  
  // Get counts by sentiment level
  const levelCounts = entries.reduce((acc: Record<string, number>, entry) => {
    const level = entry.analysis.level;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, { mild: 0, moderate: 0, severe: 0 });
  
  const percentages = {
    mild: totalEntries ? Math.round((levelCounts.mild / totalEntries) * 100) : 0,
    moderate: totalEntries ? Math.round((levelCounts.moderate / totalEntries) * 100) : 0,
    severe: totalEntries ? Math.round((levelCounts.severe / totalEntries) * 100) : 0,
  };
  
  // Calculate emotion averages for radar chart
  const emotionAverages = entries.reduce((acc: Record<string, number>, entry) => {
    Object.entries(entry.analysis.emotions).forEach(([emotion, value]) => {
      acc[emotion] = (acc[emotion] || 0) + value;
    });
    return acc;
  }, {});
  
  Object.keys(emotionAverages).forEach(key => {
    emotionAverages[key] = totalEntries ? emotionAverages[key] / totalEntries : 0;
  });
  
  const radarData = [
    {
      ...emotionAverages,
      subject: 'Emotions',
    }
  ];
  
  // Get trend data for the bar chart
  const emotionTrends = dataService.getEmotionTrends(7);
  
  // If no data, create placeholder data for the last 7 days
  const getChartData = () => {
    if (emotionTrends.length > 0) return emotionTrends;
    
    // Create placeholder data
    const placeholder = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      placeholder.push({
        date,
        joy: 0,
        sadness: 0,
        anger: 0,
        fear: 0,
        love: 0,
        surprise: 0,
        entries: 0
      });
    }
    
    return placeholder;
  };
  
  const chartData = getChartData();
  
  return (
    <div className="space-y-6 animate-fade-in">
      {entries.length === 0 ? (
        <Card className="w-full shadow-md">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No entries yet</h3>
              <p className="text-muted-foreground">
                Start journaling to see your emotional insights and trends.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="text-2xl font-semibold">{totalEntries}</div>
                <div className="text-muted-foreground text-sm">Total Entries</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="text-2xl font-semibold">
                  {Math.max(percentages.mild, percentages.moderate, percentages.severe)}%
                </div>
                <div className="text-muted-foreground text-sm">
                  Most Common: {Object.entries(percentages).sort((a, b) => b[1] - a[1])[0][0]} stress
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="text-2xl font-semibold">
                  {Object.entries(emotionAverages).sort((a, b) => b[1] - a[1])[0][0]}
                </div>
                <div className="text-muted-foreground text-sm">
                  Primary Emotion
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sentiment Distribution */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Stress Level Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <div className="flex items-center h-full">
                <div className="w-full flex items-end justify-around h-[240px]">
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-24 bg-sentiment-mild rounded-t-lg transition-all duration-500"
                      style={{ height: `${percentages.mild * 2}px` }}
                    />
                    <div className="mt-2 text-center">
                      <div className="font-medium">{percentages.mild}%</div>
                      <div className="text-sm text-muted-foreground">Mild</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-24 bg-sentiment-moderate rounded-t-lg transition-all duration-500"
                      style={{ height: `${percentages.moderate * 2}px` }}
                    />
                    <div className="mt-2 text-center">
                      <div className="font-medium">{percentages.moderate}%</div>
                      <div className="text-sm text-muted-foreground">Moderate</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-24 bg-sentiment-severe rounded-t-lg transition-all duration-500"
                      style={{ height: `${percentages.severe * 2}px` }}
                    />
                    <div className="mt-2 text-center">
                      <div className="font-medium">{percentages.severe}%</div>
                      <div className="text-sm text-muted-foreground">Severe</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Emotion Radar Chart */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Emotion Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 1]} />
                  <Radar name="Joy" dataKey="joy" stroke="#FEF7CD" fill="#FEF7CD" fillOpacity={0.6} />
                  <Radar name="Sadness" dataKey="sadness" stroke="#D3E4FD" fill="#D3E4FD" fillOpacity={0.6} />
                  <Radar name="Anger" dataKey="anger" stroke="#FFDEE2" fill="#FFDEE2" fillOpacity={0.6} />
                  <Radar name="Fear" dataKey="fear" stroke="#F1F0FB" fill="#F1F0FB" fillOpacity={0.6} />
                  <Radar name="Love" dataKey="love" stroke="#F2FCE2" fill="#F2FCE2" fillOpacity={0.6} />
                  <Radar name="Surprise" dataKey="surprise" stroke="#FDE1D3" fill="#FDE1D3" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Emotion Trends Chart */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Emotion Trends (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => {
                      return format(new Date(date), 'M/d');
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${(Number(value) * 100).toFixed(0)}%`, 
                      name.charAt(0).toUpperCase() + name.slice(1)
                    ]}
                    labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                  />
                  <Legend />
                  <Bar dataKey="joy" fill="#FEF7CD" name="Joy" />
                  <Bar dataKey="sadness" fill="#D3E4FD" name="Sadness" />
                  <Bar dataKey="fear" fill="#F1F0FB" name="Fear" />
                  <Bar dataKey="anger" fill="#FFDEE2" name="Anger" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default InsightsView;
