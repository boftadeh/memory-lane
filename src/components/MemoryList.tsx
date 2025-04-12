import { useState, useEffect } from 'react';
import { Memory } from '@/schemas/memory';
import MemoryModal from './MemoryModal';
import MemoryCard from './MemoryCard';

type MemoryListProps = {
  onMemoryUpdated: () => void;
};

export default function MemoryList({ onMemoryUpdated }: MemoryListProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const fetchMemories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memories`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch memories');
      }
      
      const data = await response.json();
      setMemories(data.memories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this memory?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete memory');
      }

      fetchMemories();
      onMemoryUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleEdit = (memory: Memory) => {
    setSelectedMemory(memory);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMemory(undefined);
  };

  const handleModalSave = () => {
    fetchMemories();
    onMemoryUpdated();
  };

  if (isLoading) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={fetchMemories}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Your Memories</h2>
          <p>No memories found. Create your first memory!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Your Memories</h2>
          <div className="space-y-4">
            {memories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>

      <MemoryModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        memory={selectedMemory}
        mode={modalMode}
      />
    </>
  );
} 