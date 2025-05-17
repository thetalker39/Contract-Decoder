
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is deprecated and was replaced by /ask-a-question.
// Redirecting to dashboard to prevent any build issues from old content.
export default function DeprecatedAnimatedListDemoPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null; // Or a loading spinner, but null is fine for a quick redirect
}
