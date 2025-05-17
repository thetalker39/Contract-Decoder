
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard'); // Changed to redirect to dashboard
  return null; 
}
