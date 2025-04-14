import { getMemories } from './actions';
import Header from '@/components/Header';
import MemoryList from '@/components/MemoryList';

export default async function Home(): Promise<JSX.Element> {
  const memories = await getMemories();

  return (
    <main>
      <Header />
      <MemoryList initialMemories={memories} />
    </main>
  );
} 