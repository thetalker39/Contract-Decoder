
"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, BookOpen } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
  imageHint: string;
}

const blogPostsData: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Key Clauses in Your First Music Contract",
    excerpt: "Navigating your first music contract can be overwhelming. We break down essential clauses like term, territory, and advances so you can sign with confidence.",
    content: `
      Your first music contract is a significant milestone! However, the legal language can be dense. Here are some key clauses to pay close attention to:
      <br /><br />
      <strong>Term:</strong> This defines how long the agreement lasts. It might be a fixed period (e.g., 2 years) or tied to album releases (e.g., 1 album + options for more). Understand if there are options for extension and who controls them.
      <br /><br />
      <strong>Territory:</strong> This specifies the geographical areas where the agreement is valid. Is it worldwide, or limited to certain countries? This impacts where your music can be distributed and promoted under the contract.
      <br /><br />
      <strong>Advances:</strong> An advance is an upfront payment made to you, which is typically recoupable from your future royalties. Clarify the amount, how it's paid, and exactly what income sources can be used to recoup it.
      <br /><br />
      <strong>Royalties:</strong> This is your share of the income generated from your music. Understand the royalty rate, how it's calculated (e.g., percentage of net receipts, PPD), and for which income streams (sales, streaming, sync licenses).
      <br /><br />
      Understanding these core components will empower you to ask the right questions and negotiate better terms.
    `,
    imageUrl: "https://i.imgur.com/aX5POF4.jpeg",
    imageAlt: "Document with pen, signifying a contract",
    imageHint: "contract document"
  },
  {
    id: "2",
    title: "Producer Agreements: What You Need to Know",
    excerpt: "Are you a music producer? Understand the critical elements of a producer agreement, from fees and points to rights and delivery schedules.",
    content: `
      A well-drafted producer agreement is crucial for a smooth and fair collaboration. Key elements include:
      <br /><br />
      <strong>Producer Fee:</strong> This is the payment for your production services. It can be a flat fee, an advance recoupable from royalties, or a combination. Ensure it reflects your experience and the project's scope. Industry standard fees can range from $2,500 to $5,000 or more per track for established producers, but can vary widely.
      <br /><br />
      <strong>Royalty Points:</strong> Producers often receive "points," which are a percentage of the artist's royalties or the record's net profits. Typically, this ranges from 2 to 5 points. Clarify how these points are calculated and paid.
      <br /><br />
      <strong>Rights & Ownership:</strong> Who owns the master recordings? Often, the label or artist commissioning the work owns the masters, but the producer might retain a share of the copyright in the sound recording. This should be clearly defined.
      <br /><br />
      <strong>Delivery Requirements:</strong> The agreement should specify what you need to deliver (e.g., final mixed masters, stems, instrumental versions) and the timeline for delivery.
      <br /><br />
      <strong>Credit:</strong> Ensure the agreement specifies how you will be credited on the release (e.g., "Produced by [Your Name]").
    `,
    imageUrl: "https://i.imgur.com/ML40b1E.jpeg",
    imageAlt: "Music production equipment in a studio",
    imageHint: "music studio"
  },
  {
    id: "3",
    title: "Recoupable vs. Non-Recoupable: Understanding Advances",
    excerpt: "Not all advances are created equal. Learn the crucial difference between recoupable and non-recoupable payments and how it impacts your earnings.",
    content: `
      The terms "recoupable" and "non-recoupable" are vital when discussing payments in music contracts, especially advances.
      <br /><br />
      <strong>Recoupable Advance:</strong> This is the most common type of advance. It's essentially a loan against your future earnings (royalties). The company (e.g., label, publisher) pays you a sum upfront, and then they "recoup" this amount from the royalties your music generates before you start receiving further royalty payments. For example, if you receive a $10,000 advance, you won't see any royalty checks until your share of royalties exceeds $10,000. Importantly, if you don't earn enough to cover the advance, you typically don't have to pay it back out of pocket (unless specified otherwise for certain costs). The company simply remains "unrecouped."
      <br /><br />
      <strong>Non-Recoupable Fee/Payment:</strong> This is a payment that is not an advance against future royalties. It's a straight fee for services rendered (e.g., a session musician fee, a one-time production fee that isn't an advance). You get to keep this money regardless of how much your music earns in royalties.
      <br /><br />
      It's critical to understand which payments are recoupable and from which income streams. Sometimes, an "advance" might be recoupable from multiple income sources (cross-collateralization), which can delay your ability to earn through.
    `,
    imageUrl: "https://i.imgur.com/Zu0d5i6.jpeg",
    imageAlt: "Stack of money, illustrating financial concepts",
    imageHint: "money finance"
  },
  {
    id: "4",
    title: "Decoding Music Publishing: Royalties and Rights",
    excerpt: "Music publishing can seem complex, but it's vital for songwriters. Get a clear overview of how royalties work and what rights you hold.",
    content: `
      Music publishing deals with the rights to musical compositions (lyrics and melody), as opposed to sound recordings (the "master"). If you write songs, understanding publishing is key.
      <br /><br />
      <strong>Copyright Ownership:</strong> A publishing agreement usually involves transferring some or all of your copyright ownership in your songs to a music publisher in exchange for their services.
      <br /><br />
      <strong>Publisher's Role:</strong> A publisher's job is to administer your songs, which includes registering them with performance rights organizations (PROs like ASCAP, BMI, SESAC), licensing them for use in films, TV, commercials (sync licenses), and collecting royalties.
      <br /><br />
      <strong>Types of Royalties:</strong>
      <ul>
        <li><strong>Performance Royalties:</strong> Earned when your song is performed publicly (radio, TV, live venues, streaming services). Collected by PROs.</li>
        <li><strong>Mechanical Royalties:</strong> Earned from the sale of physical copies (CDs, vinyl) or digital downloads/streams that reproduce the composition.</li>
        <li><strong>Sync Royalties:</strong> Earned when your song is synchronized with visual media (films, TV shows, ads, video games).</li>
      </ul>
      <br />
      <strong>Songwriter Split:</strong> Typically, income from publishing is split 50/50 between the songwriter(s) and the publisher. However, this can vary.
      <br /><br />
      Ensure your publishing agreement clearly outlines the term, territory, royalty splits, and the publisher's obligations.
    `,
    imageUrl: "https://i.imgur.com/tJal2Af.jpeg",
    imageAlt: "Sheet music and a pen, representing songwriting and publishing",
    imageHint: "sheet music"
  },
  {
    id: "5",
    title: "Negotiating Your Music Contract: Tips for Artists",
    excerpt: "Don't just sign on the dotted line! Learn valuable tips for negotiating fairer terms in your music contract, from advances to creative control.",
    content: `
      Negotiating your music contract is a critical step in your career. Here are some tips to help you secure fairer terms:
      <br /><br />
      <strong>1. Understand Your Leverage:</strong> What do you bring to the table? A growing fanbase, unique sound, successful independent releases? Knowing your value helps in negotiations.
      <br /><br />
      <strong>2. Get Legal Advice:</strong> Always have an experienced music attorney review any contract before you sign. They can identify unfavorable clauses and help you negotiate. This is an investment, not an expense.
      <br /><br />
      <strong>3. Negotiate Key Terms:</strong> Don't be afraid to discuss and negotiate:
      <ul>
        <li><strong>Advance:</strong> Is it fair for your current standing and needs? Is it fully recoupable, and from what?</li>
        <li><strong>Royalty Rate:</strong> Is it competitive? Are there escalations based on success?</li>
        <li><strong>Term & Options:</strong> How long are you committed? How many options does the other party have to extend the deal?</li>
        <li><strong>Creative Control:</strong> How much say do you have in your music, artwork, and marketing?</li>
        <li><strong>Reversion of Rights:</strong> Under what conditions, if any, can rights to your music revert to you?</li>
      </ul>
      <br />
      <strong>4. Ask Questions:</strong> If you don't understand something, ask for clarification. It's your career on the line.
      <br /><br />
      <strong>5. Be Prepared to Walk Away:</strong> Sometimes, the best deal is no deal. If the terms are fundamentally unfair and the other party isn't willing to negotiate reasonably, be prepared to seek other opportunities.
    `,
    imageUrl: "https://i.imgur.com/9sPix58.jpeg",
    imageAlt: "Artist performing with a microphone",
    imageHint: "artist microphone"
  },
];

export default function LearnCenterPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Learn Center
        </h1>
        <p className="text-muted-foreground">
          Expand your knowledge on music contracts and industry insights.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPostsData.map((post) => (
          <Dialog key={post.id} onOpenChange={(open) => !open && setSelectedPost(null)}>
            <DialogTrigger asChild>
              <Card
                className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col overflow-hidden h-full bg-card"
                onClick={() => setSelectedPost(post)}
              >
                <div className="relative w-full h-48">
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={post.imageHint}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-card-foreground">{post.excerpt}</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            {selectedPost?.id === post.id && (
              <DialogContent className="sm:max-w-[600px] md:max-w-[800px] bg-card text-card-foreground p-0">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="text-2xl text-primary">{selectedPost.title}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] ">
                  <div className="p-6 space-y-4">
                    <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden">
                      <Image
                        src={selectedPost.imageUrl}
                        alt={selectedPost.imageAlt}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={selectedPost.imageHint}
                      />
                    </div>
                    <div 
                      className="text-sm prose prose-sm dark:prose-invert max-w-none text-card-foreground" 
                      dangerouslySetInnerHTML={{ __html: selectedPost.content }} 
                    />
                  </div>
                </ScrollArea>
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
              </DialogContent>
            )}
          </Dialog>
        ))}
      </div>
    </div>
  );
}
