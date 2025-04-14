'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

import { refreshMemories, deleteMemory, getMemories } from '@/app/actions';
import { useToast } from '@/context/useToast';
import { Memory } from '@/schemas/memory';
import { Tag } from '@/types/tags';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import MemoryCard from './MemoryCard';
import MemoryModal from './MemoryModal';
import MemorySkeleton from './MemorySkeleton';
import TagSelector from './TagSelector';

type MemoryListProps = {
  initialMemories: Memory[];
};

type MemoriesModalMode = 'create' | 'edit';

type SortOrder = 'newest' | 'oldest';

export default function MemoryList({ initialMemories }: MemoryListProps) {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>(initialMemories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | undefined>(undefined);
  const [modalMode, setModalMode] = useState<MemoriesModalMode>('create');
  const [sortOrder, setSortOrder] = useState<SortOrder>('oldest');
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memoryToDelete, setMemoryToDelete] = useState<Memory | undefined>(undefined);
  const { showToast } = useToast();

  useEffect(() => {
    const sortAndFilterMemories = (): void => {
      const sortedMemories = [...memories].sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });

      const filtered = selectedTag
        ? sortedMemories.filter(memory => memory.tags?.includes(selectedTag))
        : sortedMemories;
      
      setFilteredMemories(filtered);
      setIsLoading(false);
    };

    sortAndFilterMemories();
    setIsInitialLoad(false);
  }, [sortOrder, memories, isInitialLoad, selectedTag]);

  const handleDeleteClick = (memory: Memory): void => {
    setMemoryToDelete(memory);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (memory: Memory): void => {
    setSelectedMemory(memory);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (): Promise<void> => {
    if (!memoryToDelete?.id) return;
    
    try {
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
      setIsLoading(false);
    }
  };

  const handleMemoryUpdated = async (): Promise<void> => {
    try {
      setIsModalOpen(false);
      setIsLoading(true);
      await refreshMemories();
      const updatedMemories = await getMemories();
      setMemories(updatedMemories);
      setSelectedTag(null);
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

  const handleCreateClick = (): void => {
    setSelectedMemory(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSortOrder(event.target.value as SortOrder);
  };

  const handleTagChange = (tag: Tag | null): void => {
    setSelectedTag(tag);
  };

  const renderHeader = (): JSX.Element => (
    <div className="flex flex-col-reverse justify-start md:justify-between md:flex-row gap-4">
      <select
        className="select select-bordered w-full md:w-[200px]"
        value={sortOrder}
        onChange={handleSortChange}
      >
        <option value="oldest">Oldest to Newest</option>
        <option value="newest">Newest to Oldest</option>
      </select>
      <TagSelector
        selectedTag={selectedTag}
        onChange={handleTagChange}
        className="order-first md:order-none flex-shrink-0 mr-auto"
      />
      <button 
        className="flex items-center btn btn-outline btn-primary"
        onClick={handleCreateClick}
      >
        <PlusIcon className="w-5 h-5" />
        New memory
      </button>
    </div>
  );

  const renderSkeletons = (): JSX.Element => (
    <>
      {[1, 2, 3].map((index) => (
        <div key={index} className="flex flex-col items-center">
          <MemorySkeleton />
          {index < 3 && (
            <div className="flex flex-col items-center gap-2 mt-6 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-base-content opacity-40" />
              <div className="w-2 h-2 rounded-full bg-base-content opacity-40" />
              <div className="w-2 h-2 rounded-full bg-base-content opacity-40" />
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

  if (!Array.isArray(filteredMemories) || filteredMemories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {renderHeader()}
          <div className="alert">
            <span>
              {selectedTag
                ? `No memories found with the tag "${selectedTag}".`
                : 'No memories found. Create your first memory!'}
            </span>
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
        {filteredMemories.map((memory, index) => (
          <div key={memory.id} className="flex flex-col items-center mt-4">
            <MemoryCard 
              memory={memory} 
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
            {index < filteredMemories.length - 1 && (
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
          isDeleting={isLoading}
          memoryName={memoryToDelete?.name || ''}
        />
      </div>
    </div>
  );
} 