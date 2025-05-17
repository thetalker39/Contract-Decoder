
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ScanLine, Sparkles, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Welcome to Contract Decoder</h1>
        <p className="text-xl text-muted-foreground">
          Your AI-powered assistant for understanding complex music contracts.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl text-primary">Smart Scan</CardTitle>
              <CardDescription>Automatically extract key terms, clauses, and flag unusual items in your contracts.</CardDescription>
            </div>
            <ScanLine className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/smart-scan" passHref>
              <Button variant="secondary" className="w-full bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary">
                Start Scanning <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl text-primary">Clarity Tool</CardTitle>
              <CardDescription>Break down complex legal jargon into plain English, tailored to your understanding.</CardDescription>
            </div>
            <Sparkles className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/jargon-explanation" passHref>
              <Button variant="secondary" className="w-full bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary">
                Get Explanations <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl text-primary">Compare AI</CardTitle>
              <CardDescription>Compare your contract terms against industry standards and uncover key terms.</CardDescription>
            </div>
            <BarChart3 className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/contract-analysis" passHref>
              <Button variant="secondary" className="w-full bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary">
                Compare Terms <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="bg-card p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-primary mb-4">Why Contract Decoder?</h2>
        <p className="text-muted-foreground mb-3">
          Navigating music contracts can be daunting. Contract Decoder empowers artists, managers, and labels by providing AI-driven insights to demystify legal documents.
        </p>
        <p className="text-muted-foreground mb-6">
          Our tools help you understand your rights, identify potential risks, and negotiate fairer deals. Make informed decisions with confidence.
        </p>
        <p className="text-sm text-muted-foreground/80 italic">
          Contract Decoder does not provide legal advice. All content, including refinements, is for educational purposes only. Always consult a licensed attorney before signing or modifying any legal agreement.
        </p>
      </section>
    </div>
  );
}
