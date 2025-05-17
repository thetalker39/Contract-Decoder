import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-contract-favorability.ts';
import '@/ai/flows/explain-legal-jargon.ts';
import '@/ai/flows/summarize-contract.ts';
import '@/ai/flows/rewrite-contract-terms.ts';