import MemoryList from '@/components/MemoryList';
import Header from '@/components/Header';
import { getMemories } from './actions';

export const revalidate = 0;

export default async function Home() {
  const memories = await getMemories();

  return (
    <main>
      <Header />
      <MemoryList initialMemories={memories} />
    </main>
  );
} 