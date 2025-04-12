'use client';

import { useState, useEffect } from 'react';
import { Memory } from '@/schemas/memory';
import MemoryCard from './MemoryCard';
import MemoryModal from './MemoryModal';
import { refreshMemories } from '@/app/actions';
import { useToast } from '@/context/ToastContext';

type MemoryListProps = {
  initialMemories: Memory[];
};

export default function MemoryList({ initialMemories }: MemoryListProps) {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const { showToast } = useToast();

  useEffect(() => {
    setMemories(initialMemories);
  }, [initialMemories]);

  const handleEdit = (memory: Memory) => {
    setSelectedMemory(memory);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this memory?')) {
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memories/${id}`, {
        method: 'DELETE',
      });

      await refreshMemories();
      showToast('Memory deleted successfully');
    } catch (err) {
      showToast('Failed to delete memory. Please try again.', 'error');
    }
  };

  const handleMemoryUpdated = async () => {
    try {
      setIsModalOpen(false);
      await refreshMemories();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memories`);
      
      const data = await response.json();
      setMemories(data.memories);
      showToast(
        modalMode === 'create' 
          ? 'Memory created successfully' 
          : 'Memory updated successfully'
      );
    } catch (error) {
      showToast('Failed to update memories. Please try again.', 'error');
    }
  };

  if (!Array.isArray(memories) || memories.length === 0) {
    return (
      <div className="alert">
        <span>No memories found. Create your first memory!</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {memories.map((memory) => (
        <MemoryCard 
          key={memory.id} 
          memory={memory} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      <MemoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleMemoryUpdated}
        memory={selectedMemory}
        mode={modalMode}
      />
    </div>
  );
} 