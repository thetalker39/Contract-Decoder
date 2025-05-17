
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { summarizeContract } from "@/ai/flows/summarize-contract";
import type { SummarizeContractOutput } from "@/ai/flows/summarize-contract";
import { Loader2, ScanLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ListItems, ListItem, ListHeader, ListGroup } from "@/components/ui/list"; 

// Default contract text is now empty
const defaultContractText = ``;

interface ParsedSummary {
  keyTerms: string[];
  clauseSummaries: string[];
  unusualProvisions: string[];
}

// Helper to parse the AI's structured summary string
const parseAiSummary = (summaryText: string): ParsedSummary => {
  const sections: ParsedSummary = {
    keyTerms: [],
    clauseSummaries: [],
    unusualProvisions: [],
  };
  
  let currentSection: keyof ParsedSummary | null = null;

  summaryText.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0) return;

    if (trimmedLine.toLowerCase().startsWith('key terms and definitions:')) {
      currentSection = 'keyTerms';
      return;
    } else if (trimmedLine.toLowerCase().startsWith('summaries of each clause or section:')) {
      currentSection = 'clauseSummaries';
      return;
    } else if (trimmedLine.toLowerCase().startsWith('identification of any unusual or non-standard provisions:')) {
      currentSection = 'unusualProvisions';
      return;
    }

    if (currentSection && (trimmedLine.startsWith('- ') || /^(Clause \d+|Section \d+|[A-Z]\.)/i.test(trimmedLine))) {
      sections[currentSection].push(trimmedLine.replace(/^- /,'').trim());
    } else if (currentSection) {
      // Append to last item if it's a continuation
      const lastItemIndex = sections[currentSection].length - 1;
      if (lastItemIndex >= 0) {
        sections[currentSection][lastItemIndex] += `\n${trimmedLine}`;
      } else {
         sections[currentSection].push(trimmedLine);
      }
    }
  });
  return sections;
};


export default function SmartScanPage() {
  const [contractText, setContractText] = useState<string>(defaultContractText);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SummarizeContractOutput | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedSummary | null>(null);
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
    setParsedResult(null);
    setError(null);
    try {
      const output = await summarizeContract({ contractText });
      setResult(output);
      if (output.summary) {
        setParsedResult(parseAiSummary(output.summary));
      }
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

  const renderListSection = (title: string, items: string[], sectionId: string) => {
    if (!items || items.length === 0) return null;
    return (
      <ListGroup id={sectionId} className="mb-6">
        <ListHeader name={title} color="hsl(var(--primary))" />
        <ListItems className="p-4">
          {items.map((item, index) => (
            <ListItem key={`${sectionId}-${index}`} id={`${sectionId}-item-${index}`} className="bg-card">
              <p className="m-0 text-sm text-foreground whitespace-pre-wrap">{item}</p>
            </ListItem>
          ))}
        </ListItems>
      </ListGroup>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <ScanLine className="h-8 w-8" />
          Smart Contract Scan
        </h1>
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

      {parsedResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
            <CardDescription>Detailed analysis of your contract.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderListSection("Key Terms and Definitions", parsedResult.keyTerms, "key-terms")}
            {renderListSection("Clause Summaries", parsedResult.clauseSummaries, "clause-summaries")}
            {renderListSection("Unusual or Non-Standard Provisions", parsedResult.unusualProvisions, "unusual-provisions")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
