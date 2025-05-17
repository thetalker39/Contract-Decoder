
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { explainLegalJargon } from "@/ai/flows/explain-legal-jargon";
import type { ExplainLegalJargonOutput, ExplainLegalJargonInput } from "@/ai/flows/explain-legal-jargon";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ListItems, ListItem } from "@/components/ui/list";

type ExplanationLevel = ExplainLegalJargonInput['explanationLevel'];

export default function JargonExplanationPage() {
  const [contractText, setContractText] = useState<string>("");
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>("beginner");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ExplainLegalJargonOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contractText.trim()) {
      toast({
        title: "Input Required",
        description: "Please paste your contract text or specific jargon.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const output = await explainLegalJargon({ contractText, explanationLevel });
      setResult(output);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast({
        title: "Error Explaining Jargon",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const explanationPoints = result?.explanation.split('\n').filter(point => point.trim() !== '');

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Clarity Tool</h1>
        <p className="text-muted-foreground">
          Explain legal jargon in contracts with adjustable explanation levels.
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Enter Contract Text or Jargon &amp; Select Level</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              placeholder="Paste contract text with jargon or specific legal terms here..."
              value={contractText}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContractText(e.target.value)}
              rows={10} // Reduced rows as it can be specific terms
              className="border-border focus:ring-ring"
              disabled={isLoading}
            />
            <div className="space-y-2">
              <label htmlFor="explanationLevel" className="block text-sm font-medium text-foreground">Explanation Level</label>
              <Select
                value={explanationLevel}
                onValueChange={(value: ExplanationLevel) => setExplanationLevel(value)}
                disabled={isLoading}
              >
                <SelectTrigger id="explanationLevel" className="w-full sm:w-[200px] border-border focus:ring-ring">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Explain Jargon
            </Button>
          </form>
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

      {explanationPoints && explanationPoints.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Explanation</CardTitle>
            <CardDescription>Legal jargon explained at the <span className="font-semibold">{explanationLevel}</span> level.</CardDescription>
          </CardHeader>
          <CardContent>
            <ListItems>
              {explanationPoints.map((point, index) => (
                <ListItem key={`explanation-${index}`} id={`explanation-item-${index}`} className="bg-card">
                  <p className="m-0 text-sm text-foreground whitespace-pre-wrap">{point}</p>
                </ListItem>
              ))}
            </ListItems>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
