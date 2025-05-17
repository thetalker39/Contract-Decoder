
"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/ui/animated-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let notifications: Item[] = [
  {
    name: "Payment received",
    description: "Harmonic Agreement",
    time: "15m ago",
    icon: "💸",
    color: "hsl(var(--accent))", // Using theme accent color
  },
  {
    name: "User signed up",
    description: "New Artist",
    time: "10m ago",
    icon: "👤",
    color: "hsl(var(--primary))", // Using theme primary color
  },
  {
    name: "New message",
    description: "Contract Query",
    time: "5m ago",
    icon: "💬",
    color: "hsl(var(--secondary))", // Using theme secondary color
  },
  {
    name: "Clause Alert",
    description: "Unusual Provision Found",
    time: "2m ago",
    icon: "⚠️", // Using a warning emoji
    color: "hsl(var(--destructive))", // Using theme destructive color
  },
];

// To make the list scrollable for demonstration
notifications = Array.from({ length: 3 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // Using card styles from theme for consistency
        "bg-card text-card-foreground border border-border shadow-lg",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium text-foreground">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-muted-foreground">{time}</span>
          </figcaption>
          <p className="text-sm font-normal text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

function AnimatedListDemoInternal({ // Renamed to avoid conflict with page
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col p-6 overflow-hidden rounded-lg border bg-background md:shadow-xl",
        className,
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}


export default function AnimatedListDemoPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Animated List Demo</h1>
        <p className="text-muted-foreground">
          Showcasing the animated list component with hover effects.
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Notification List</CardTitle>
          <CardDescription>
            This is a demonstration of the animated list. Items appear sequentially and have a hover effect.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatedListDemoInternal />
        </CardContent>
      </Card>
    </div>
  );
}
