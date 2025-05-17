
"use client";

import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface FavorabilityGaugeProps {
  score: number; // Score from 1 to 100
}

const FavorabilityGauge: React.FC<FavorabilityGaugeProps> = ({ score }) => {
  const normalizedScore = Math.max(1, Math.min(100, score)); // Ensure score is within 1-100
  const data = [{ name: 'Favorability', value: normalizedScore }];

  // Determine color based on score
  let color;
  if (normalizedScore < 33) {
    color = 'hsl(var(--destructive))'; // Red
  } else if (normalizedScore < 66) {
    color = 'hsl(var(--chart-4))'; // Orange/Yellow from theme
  } else {
    color = 'hsl(var(--accent))'; // Green
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-primary">Contract Favorability Score</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <RadialBarChart
              cx="50%"
              cy="70%" // Adjust to make space for text below
              innerRadius="70%"
              outerRadius="100%"
              barSize={20}
              data={data}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                angleAxisId={0}
                cornerRadius={10}
              >
                <Cell fill={color} />
              </RadialBar>
              {/* Text in the middle */}
              <text
                x="50%"
                y="70%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-4xl font-bold fill-foreground"
              >
                {normalizedScore}
              </text>
              <text
                x="50%"
                y="85%" // Position " / 100" below the score
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm fill-muted-foreground"
              >
                / 100
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center justify-center space-x-1">
          <p className="text-sm text-muted-foreground text-center">
            {normalizedScore < 33 ? "Potentially Unfavorable" : normalizedScore < 66 ? "Moderately Favorable" : "Highly Favorable"}
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>This score (0-100) indicates how favorable the AI deems the contract terms for the Producer.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default FavorabilityGauge;
