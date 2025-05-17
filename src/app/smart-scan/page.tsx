
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { summarizeContract } from "@/ai/flows/summarize-contract";
import type { SummarizeContractOutput } from "@/ai/flows/summarize-contract";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SmartScanPage() {
  const [contractText, setContractText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SummarizeContractOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contractText.trim()) {
      toast({
        title: "Input Required",
        description: "Please paste your contract text.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const output = await summarizeContract({ contractText });
      setResult(output);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast({
        title: "Error Scanning Contract",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Smart Contract Scan</h1>
        <p className="text-muted-foreground">
          Upload or paste your contract to extract key terms, summarize clauses, and identify unusual provisions.
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Enter Contract Text</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              placeholder="Paste your contract text here..."
              value={contractText}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContractText(e.target.value)}
              rows={15}
              className="border-border focus:ring-ring"
              disabled={isLoading}
            />
            <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Scan Contract
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

      {result && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
            <CardDescription>Key terms, clause summaries, and unusual provisions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Summary:</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/50 rounded-md text-foreground whitespace-pre-wrap">
              {result.summary}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
