'use client';

import { useState, useEffect } from 'react';
import { Memory } from '@/schemas/memory';
import MemoryCard from './MemoryCard';
import MemoryModal from './MemoryModal';
import MemorySkeleton from './MemorySkeleton';
import { refreshMemories, deleteMemory, getMemories } from '@/app/actions';
import { useToast } from '@/context/ToastContext';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { PlusIcon } from '@heroicons/react/24/solid';

type MemoryListProps = {
  initialMemories: Memory[];
};

export default function MemoryList({ initialMemories }: MemoryListProps) {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('oldest');
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memoryToDelete, setMemoryToDelete] = useState<Memory | undefined>(undefined);
  const [isDeletingMemory, setIsDeletingMemory] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const sortMemories = () => {
      const sortedMemories = [...initialMemories].sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
      setMemories(sortedMemories);
      setIsLoading(false);
    };

    if (isInitialLoad) {
      setTimeout(() => {
        sortMemories();
        setIsInitialLoad(false);
      }, 1000);
    } else {
      sortMemories();
    }

    return () => {
      if (isInitialLoad) {
        setIsLoading(true);
      }
    };
  }, [sortOrder, initialMemories, isInitialLoad]);

  const handleDeleteClick = (memory: Memory) => {
    setMemoryToDelete(memory);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (memory: Memory) => {
    setSelectedMemory(memory);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!memoryToDelete?.id) return;
    
    try {
      setIsDeletingMemory(true);
      setIsLoading(true);
      
      await deleteMemory(memoryToDelete.id);
      await refreshMemories();
      
      const updatedMemories = memories.filter(m => m.id !== memoryToDelete.id);
      setMemories(updatedMemories);
      
      showToast('Memory deleted successfully');
      setIsDeleteModalOpen(false);
      setMemoryToDelete(undefined);
    } catch (err) {
      showToast('Failed to delete memory. Please try again.', 'error');
    } finally {
      setIsDeletingMemory(false);
      setIsLoading(false);
    }
  };

  const handleMemoryUpdated = async () => {
    try {
      setIsModalOpen(false);
      setIsLoading(true);
      await refreshMemories();
      const updatedMemories = await getMemories();
      setMemories(updatedMemories);
      showToast(
        modalMode === 'create' 
          ? 'Memory created successfully' 
          : 'Memory updated successfully'
      );
    } catch (error) {
      showToast('Failed to update memories. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = () => {
    setSelectedMemory(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as 'newest' | 'oldest');
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center">
      <select
        className="select select-bordered w-[200px]"
        value={sortOrder}
        onChange={handleSortChange}
      >
        <option value="oldest">Oldest to Newest</option>
        <option value="newest">Newest to Oldest</option>
      </select>
      <button 
        className="btn btn-outline  btn-primary"
        onClick={handleCreateClick}
      >
        <PlusIcon className="w-5 h-5" />
        New memory
      </button>
    </div>
  );

  const renderSkeletons = () => (
    <>
      {[1, 2, 3].map((index) => (
        <div key={index} className="flex flex-col items-center">
          <MemorySkeleton />
          {index < 3 && (
            <div className="flex flex-col items-center gap-2 mt-6 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-base-content opacity-40"></div>
              <div className="w-2 h-2 rounded-full bg-base-content opacity-40"></div>
              <div className="w-2 h-2 rounded-full bg-base-content opacity-40"></div>
            </div>
          )}
        </div>
      ))}
    </>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {renderHeader()}
          {renderSkeletons()}
          <MemoryModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleMemoryUpdated}
            memory={selectedMemory}
            mode={modalMode}
          />
        </div>
      </div>
    );
  }

  if (!Array.isArray(memories) || memories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {renderHeader()}
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 max-w-4xl mx-auto">
        {renderHeader()}
        {memories.map((memory, index) => (
          <div key={memory.id} className="flex flex-col items-center">
            <MemoryCard 
              memory={memory} 
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
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
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setMemoryToDelete(undefined);
          }}
          onConfirm={handleDelete}
          isDeleting={isDeletingMemory}
          memoryName={memoryToDelete?.name || ''}
        />
      </div>
    </div>
  );
} 