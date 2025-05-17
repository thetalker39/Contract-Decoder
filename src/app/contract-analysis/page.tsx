
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FavorabilityGauge from "@/components/favorability-gauge";
import { analyzeContractFavorability } from "@/ai/flows/analyze-contract-favorability";
import type { AnalyzeContractFavorabilityOutput } from "@/ai/flows/analyze-contract-favorability";
import { rewriteContractTerms } from "@/ai/flows/rewrite-contract-terms";
import type { RewriteContractTermsOutput } from "@/ai/flows/rewrite-contract-terms";
import { Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContractAnalysisPage() {
  const [contractText, setContractText] = useState<string>("");
  const [aggressiveRewrite, setAggressiveRewrite] = useState<boolean>(false);
  
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
    setCompareError(null);
    // Optionally clear refine result when re-comparing
    // setRefineResult(null); 
    // setRefineError(null);
    try {
      const output = await analyzeContractFavorability({ contractText });
      setCompareResult(output);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setCompareError(errorMessage);
      toast({ title: "Error Comparing Contract", description: errorMessage, variant: "destructive" });
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
    try {
      // industryStandardInfo is optional, pass undefined if not available
      const output = await rewriteContractTerms({ contractText, aggressiveRewrite, industryStandardInfo: undefined });
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
            rows={15}
            className="border-border focus:ring-ring"
            disabled={isLoading}
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="aggressiveRewrite"
                checked={aggressiveRewrite}
                onCheckedChange={setAggressiveRewrite}
                disabled={isLoading}
              />
              <Label htmlFor="aggressiveRewrite" className="text-foreground">Aggressive Rewrite</Label>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleCompare} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isCompareLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Compare
              </Button>
              <Button onClick={handleRefine} variant="outline" className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-accent-foreground" disabled={isLoading}>
                {isRefineLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Refine
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {compareError && (
        <Card className="border-destructive shadow-lg">
          <CardHeader><CardTitle className="text-destructive">Compare Error</CardTitle></CardHeader>
          <CardContent><p className="text-destructive-foreground">{compareError}</p></CardContent>
        </Card>
      )}

      {compareResult && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <FavorabilityGauge score={compareResult.favorabilityScore} />
          </div>
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle>Contract Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">General Advice:</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{compareResult.generalAdvice}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Recommendations:</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{compareResult.recommendations}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {refineError && (
        <Card className="border-destructive shadow-lg">
          <CardHeader><CardTitle className="text-destructive">Refine Error</CardTitle></CardHeader>
          <CardContent><p className="text-destructive-foreground">{refineError}</p></CardContent>
        </Card>
      )}

      {refineResult && (
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Rewritten Contract</CardTitle>
              <CardDescription>More favorable terms for a producer or artist.</CardDescription>
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
    </div>
  );
}
