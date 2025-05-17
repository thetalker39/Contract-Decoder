
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/smart-scan');
  return null; // Or a loading state, but redirect is usually fast enough
}
