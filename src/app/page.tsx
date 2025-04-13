import MemoryList from '@/components/MemoryList';
import Header from '@/components/Header';
import { getMemories } from './actions';

export default async function Home() {
  const memories = await getMemories();

  return (
    <main>
      <Header />
      <MemoryList initialMemories={memories} />
    </main>
  );
} 