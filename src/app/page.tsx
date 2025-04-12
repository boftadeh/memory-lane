import { Suspense } from 'react';
import Header from '@/components/Header';
import MemoryList from '@/components/MemoryList';
import { getMemories } from '@/app/actions';

export const revalidate = 0;

export default async function Home() {
  const memories = await getMemories();

  return (
    <main className="container mx-auto p-4">
      <Header />
      <Suspense fallback={<div>Loading memories...</div>}>
        <MemoryList initialMemories={memories} />
      </Suspense>
    </main>
  );
} 