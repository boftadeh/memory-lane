'use client';

import { useState, useEffect } from 'react';
import { Memory } from '@/schemas/memory';
import MemoryCard from './MemoryCard';
import MemoryModal from './MemoryModal';
import { refreshMemories } from '@/app/actions';
import { useToast } from '@/context/ToastContext';
import { FunnelIcon } from '@heroicons/react/24/outline';

type MemoryListProps = {
  initialMemories: Memory[];
};

export default function MemoryList({ initialMemories }: MemoryListProps) {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('oldest');
  const { showToast } = useToast();

  useEffect(() => {
    setMemories(initialMemories);
  }, [initialMemories]);

  useEffect(() => {
    const sortedMemories = [...memories].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setMemories(sortedMemories);
  }, [sortOrder, initialMemories]);

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

  const handleCreateClick = () => {
    setSelectedMemory(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleSortChange = (order: 'newest' | 'oldest') => {
    setSortOrder(order);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  if (!Array.isArray(memories) || memories.length === 0) {
    return (
      <div className="flex flex-col gap-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <FunnelIcon className="h-6 w-6" />
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
              <li>
                <button 
                  onClick={() => handleSortChange('newest')}
                  className={sortOrder === 'newest' ? 'active' : ''}
                >
                  Newest First
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleSortChange('oldest')}
                  className={sortOrder === 'oldest' ? 'active' : ''}
                >
                  Oldest First
                </button>
              </li>
            </ul>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleCreateClick}
          >
            Create Memory
          </button>
        </div>
        <div className="alert">
          <span>No memories found. Create your first memory!</span>
        </div>
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

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <FunnelIcon className="h-6 w-6" />
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
            <li>
              <button 
                onClick={() => handleSortChange('newest')}
                className={sortOrder === 'newest' ? 'active' : ''}
              >
                Newest First
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleSortChange('oldest')}
                className={sortOrder === 'oldest' ? 'active' : ''}
              >
                Oldest First
              </button>
            </li>
          </ul>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleCreateClick}
        >
          Create Memory
        </button>
      </div>

      {memories.map((memory, index) => (
        <div key={memory.id} className="flex flex-col items-center">
          <MemoryCard 
            memory={memory} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {index < memories.length - 1 && (
            <div className="flex flex-col items-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-base-content"></div>
              <div className="w-2 h-2 rounded-full bg-base-content"></div>
              <div className="w-2 h-2 rounded-full bg-base-content"></div>
            </div>
          )}
        </div>
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