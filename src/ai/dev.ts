import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-contract-favorability.ts';
import '@/ai/flows/explain-legal-jargon.ts';
import '@/ai/flows/rewrite-contract-terms.ts';
import '@/ai/flows/summarize-contract.ts';
import '@/ai/flows/refine-contract.ts';
import '@/ai/flows/scan-contract.ts';
import '@/ai/flows/compare-contract.ts';