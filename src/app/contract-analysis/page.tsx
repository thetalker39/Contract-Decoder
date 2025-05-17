
"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FavorabilityGauge from "@/components/favorability-gauge";
import { analyzeContractFavorability } from "@/ai/flows/analyze-contract-favorability";
import type { AnalyzeContractFavorabilityOutput } from "@/ai/flows/analyze-contract-favorability";
import { rewriteContractTerms } from "@/ai/flows/rewrite-contract-terms";
import type { RewriteContractTermsInput, RewriteContractTermsOutput } from "@/ai/flows/rewrite-contract-terms";
import { Loader2, Copy, FileText } from "lucide-react"; // Added FileText for summary icon
import { useToast } from "@/hooks/use-toast";
import { ListItems, ListItem } from "@/components/ui/list";

export default function ContractAnalysisPage() {
  const [contractText, setContractText] = useState<string>("");
  const [aggressiveRewrite, setAggressiveRewrite] = useState<boolean>(false);
  const [desiredAmount, setDesiredAmount] = useState<string>("");
  const [isRecoupable, setIsRecoupable] = useState<boolean>(true); // Default to recoupable advance
  
  const [isCompareLoading, setIsCompareLoading] = useState<boolean>(false);
  const [isRefineLoading, setIsRefineLoading] = useState<boolean>(false);
  
  const [compareResult, setCompareResult] = useState<AnalyzeContractFavorabilityOutput | null>(null);
  const [refineResult, setRefineResult] = useState<RewriteContractTermsOutput | null>(null);
  
  const [compareError, setCompareError] = useState<string | null>(null);
  const [refineError, setRefineError] = useState<string | null>(null);

  const { toast } = useToast();

  const handleCompare = async () => {
    if (!contractText.trim()) {
      toast({ title: "Input Required", description: "Please paste your contract text.", variant: "destructive" });
      return;
    }
    setIsCompareLoading(true);
    setCompareResult(null);
    setRefineResult(null); // Clear previous refine results if comparing again
    setCompareError(null);
    try {
      const output = await analyzeContractFavorability({ contractText });
      setCompareResult(output);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setCompareError(errorMessage);
      toast({ title: "Error Analyzing Contract", description: errorMessage, variant: "destructive" });
    } finally {
      setIsCompareLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!contractText.trim()) {
      toast({ title: "Input Required", description: "Please paste your contract text.", variant: "destructive" });
      return;
    }
    setIsRefineLoading(true);
    setRefineResult(null);
    setRefineError(null);

    let amount: number | undefined = parseFloat(desiredAmount);
    if (isNaN(amount) || desiredAmount.trim() === "") {
      amount = undefined;
    }
    
    const input: RewriteContractTermsInput = { 
      contractText, 
      aggressiveRewrite, 
      industryStandardInfo: undefined, 
    };

    if (amount !== undefined) {
      input.desiredAmount = amount;
      input.isRecoupable = isRecoupable;
    }
    
    try {
      const output = await rewriteContractTerms(input);
      setRefineResult(output);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setRefineError(errorMessage);
      toast({ title: "Error Refining Contract", description: errorMessage, variant: "destructive" });
    } finally {
      setIsRefineLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({ title: "Copied to Clipboard", description: "Rewritten contract copied." });
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        toast({ title: "Copy Failed", description: "Could not copy text to clipboard.", variant: "destructive" });
      });
  };

  const isLoading = isCompareLoading || isRefineLoading;

  const renderAnalysisList = (text: string | undefined, sectionId: string) => {
    if (!text) return null;
    const points = text.split('\n').filter(point => point.trim() !== '');
    if (points.length === 0) return <p className="text-muted-foreground">No specific points provided for this section.</p>;

    return (
      <ListItems>
        {points.map((point, index) => (
          <ListItem key={`${sectionId}-${index}`} id={`${sectionId}-item-${index}`} className="bg-card">
            <p className="m-0 text-sm text-foreground whitespace-pre-wrap">{point}</p>
          </ListItem>
        ))}
      </ListItems>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Contract Comparison &amp; Refinement</h1>
        <p className="text-muted-foreground">
          Analyze contract favorability, get advice, and rewrite terms for a better deal.
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Enter Contract Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            placeholder="Paste your contract text here..."
            value={contractText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContractText(e.target.value)}
            rows={10}
            className="border-border focus:ring-ring"
            disabled={isLoading}
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Refine Options</CardTitle>
          <CardDescription>Optionally provide a desired amount and its type for the refined contract. You can also choose to perform an aggressive rewrite.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="desiredAmount" className="text-foreground">Desired Amount (e.g., 5000)</Label>
            <Input
              id="desiredAmount"
              type="number"
              placeholder="Enter amount"
              value={desiredAmount}
              onChange={(e) => setDesiredAmount(e.target.value)}
              className="border-border focus:ring-ring"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isRecoupable"
              checked={isRecoupable}
              onCheckedChange={setIsRecoupable}
              disabled={isLoading || desiredAmount.trim() === ""}
            />
            <Label htmlFor="isRecoupable" className="text-foreground">
              {isRecoupable ? "Treat as Recoupable Advance" : "Treat as Non-Recoupable Fee"}
            </Label>
          </div>
           <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="aggressiveRewrite"
                checked={aggressiveRewrite}
                onCheckedChange={setAggressiveRewrite}
                disabled={isLoading}
              />
              <Label htmlFor="aggressiveRewrite" className="text-foreground">Aggressive Rewrite (Removes unfavorable clauses)</Label>
            </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2 pt-2">
          <Button onClick={handleCompare} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isCompareLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analyze Contract
          </Button>
          <Button onClick={handleRefine} variant="outline" className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-accent-foreground" disabled={isLoading}>
            {isRefineLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refine Contract
          </Button>
      </div>

      {compareError && (
        <Card className="border-destructive shadow-lg mt-6">
          <CardHeader><CardTitle className="text-destructive">Analysis Error</CardTitle></CardHeader>
          <CardContent><p className="text-destructive-foreground">{compareError}</p></CardContent>
        </Card>
      )}
      
      {refineError && (
        <Card className="border-destructive shadow-lg mt-6">
          <CardHeader><CardTitle className="text-destructive">Refine Error</CardTitle></CardHeader>
          <CardContent><p className="text-destructive-foreground">{refineError}</p></CardContent>
        </Card>
      )}

      {refineResult && (
        <Card className="shadow-lg mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Rewritten Contract</CardTitle>
              <CardDescription>More favorable terms, incorporating your preferences.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(refineResult.rewrittenContract)} className="text-accent hover:text-accent/80">
              <Copy className="h-5 w-5" />
              <span className="sr-only">Copy to clipboard</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/50 rounded-md text-foreground whitespace-pre-wrap">
              {refineResult.rewrittenContract}
            </div>
          </CardContent>
        </Card>
      )}

      {compareResult && (
        <>
          <div className="my-6"> 
              <FavorabilityGauge score={compareResult.favorabilityScore} />
          </div>

          {compareResult.overallSummary && (
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-start gap-3"> 
                <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <CardTitle className="text-primary">Overall Contract Summary &amp; Unfavorable Points</CardTitle>
                  <CardDescription>A high-level overview of the agreement's key issues.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground whitespace-pre-wrap">{compareResult.overallSummary}</p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Flagged Clauses</CardTitle>
              </CardHeader>
              <CardContent>
                {renderAnalysisList(compareResult.generalAdvice, "flagged-clauses")}
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Recommendations &amp; Suggested Improvements</CardTitle>
              </CardHeader>
              <CardContent>
                 {renderAnalysisList(compareResult.recommendations, "recommendations")}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
