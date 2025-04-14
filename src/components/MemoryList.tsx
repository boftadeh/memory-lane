'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import { useMemo, useState } from 'react';

import { refreshMemories, deleteMemory, getMemories } from '@/app/actions';
import { useToast } from '@/components/Toast/useToast';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | undefined>(undefined);
  const [modalMode, setModalMode] = useState<MemoriesModalMode>('create');
  const [sortOrder, setSortOrder] = useState<SortOrder>('oldest');
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memoryToDelete, setMemoryToDelete] = useState<Memory | undefined>(undefined);
  const { showToast } = useToast();

  const filteredMemories = useMemo(() => {
    const sortedMemories = [...memories].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return selectedTag
      ? sortedMemories.filter(memory => memory.tags?.includes(selectedTag))
      : sortedMemories;
  }, [memories, sortOrder, selectedTag]);

  function handleDeleteClick(memory: Memory) {
    setMemoryToDelete(memory);
    setIsDeleteModalOpen(true);
  }

  function handleEdit(memory: Memory) {
    setSelectedMemory(memory);
    setModalMode('edit');
    setIsModalOpen(true);
  }

  async function handleDelete() {
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
    } catch {
      showToast('Failed to delete memory. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMemoryUpdated() {
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
    } catch {
      showToast('Failed to update memories. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  function handleCreateClick() {
    setSelectedMemory(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  }

  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSortOrder(event.target.value as SortOrder);
  }

  function handleTagChange(tag: Tag | null) {
    setSelectedTag(tag);
  }

  function renderActionButtons() {
    return (
      <div className="flex flex-col-reverse justify-start md:justify-between md:flex-row gap-4">
        {memories.length > 0 && (
          <>
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
          </>
        )}
        <button
          className="flex items-center btn btn-outline btn-primary md:ml-auto"
          onClick={handleCreateClick}
        >
          <PlusIcon className="w-5 h-5" />
          New memory
        </button>
      </div>
    );
  }

  function renderSkeletons() {
    return (
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
  }

  const renderModals = () => (
    <>
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
    </>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {renderActionButtons()}
          {renderSkeletons()}
          {renderModals()}
        </div>
      </div>
    );
  }

  if (!Array.isArray(filteredMemories) || filteredMemories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {renderActionButtons()}
          <div className="alert">
            <span>
              {selectedTag
                ? `No memories found with the tag "${selectedTag}".`
                : 'No memories found. Create your first memory!'}
            </span>
          </div>
          {renderModals()}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 max-w-4xl mx-auto">
        {renderActionButtons()}
        {filteredMemories.map((memory, index) => (
          <div key={memory.id} className="flex flex-col items-center mt-4">
            <MemoryCard
              memory={memory}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
            {index < filteredMemories.length - 1 && (
              <div className="flex flex-col items-center gap-2 mt-6">
                <div className="w-2 h-2 rounded-full bg-base-content" />
                <div className="w-2 h-2 rounded-full bg-base-content" />
                <div className="w-2 h-2 rounded-full bg-base-content" />
              </div>
            )}
          </div>
        ))}
        {renderModals()}
      </div>
    </div>
  );
}
