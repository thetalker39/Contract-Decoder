
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { answerUserQuestion } from "@/ai/flows/answer-question-flow"; // New flow
import type { AnswerUserQuestionOutput } from "@/ai/flows/answer-question-flow"; // New flow types
import { Loader2, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ListItems, ListItem } from "@/components/ui/list";

export default function AskAQuestionPage() {
  const [questionText, setQuestionText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnswerUserQuestionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!questionText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter your question.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const output = await answerUserQuestion({ question: questionText });
      setResult(output);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast({
        title: "Error Getting Answer",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const answerPoints = result?.answer.split('\n').filter(point => point.trim() !== '');

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-black flex items-center gap-2">
          <HelpCircle className="h-8 w-8" />
          Ask A Question
        </h1>
        <p className="text-muted-foreground">
          Get suggestions and answers to your contract-related questions.
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-card-foreground">Enter Question Text</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              placeholder="Type your question here..."
              value={questionText}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setQuestionText(e.target.value)}
              rows={8}
              className="border-border focus:ring-ring"
              disabled={isLoading}
            />
            <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Ask"}
            </Button>          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive shadow-lg">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {answerPoints && answerPoints.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary">Suggestions & Answer</CardTitle>
            <CardDescription>Here's what the AI suggests based on your question:</CardDescription>
          </CardHeader>
          <CardContent>
            <ListItems>
              {answerPoints.map((point, index) => (
                <ListItem key={`answer-${index}`} id={`answer-item-${index}`} className="bg-card">
                  <p className="m-0 text-sm text-card-foreground whitespace-pre-wrap">{point}</p>
                </ListItem>
              ))}
            </ListItems>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
