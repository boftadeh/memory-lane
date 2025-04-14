import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Memory, MemorySchema } from '@/schemas/memory';
import { AVAILABLE_TAGS, Tag } from '@/types/tags';
import Modal from './Modal';
import TagSelector from './TagSelector';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type MemoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  memory?: Memory;
  mode: 'create' | 'edit';
};

export default function MemoryModal({ isOpen, onClose, onSave, memory, mode }: MemoryModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showFileInput, setShowFileInput] = useState(true);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting },
    setError,
    setValue,
    clearErrors
  } = useForm<Memory>({
    resolver: zodResolver(MemorySchema),
    defaultValues: {
      name: '',
      description: '',
      timestamp: new Date().toISOString().split('T')[0],
      image: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (memory) {
      const date = new Date(memory.timestamp);
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      reset({
        name: memory.name,
        description: memory.description,
        timestamp: localDate.toISOString().split('T')[0],
        image: memory.image || '',
        tags: memory.tags || [],
      });
      setSelectedTags(memory.tags as Tag[] || []);
      setImagePreview(memory.image || null);
      setShowFileInput(false);
    } else {
      reset({
        name: '',
        description: '',
        timestamp: new Date().toISOString().split('T')[0],
        image: '',
        tags: [],
      });
      setSelectedTags([]);
      setImagePreview(null);
      setShowFileInput(true);
    }
  }, [memory, isOpen, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setValue('image', result);
        clearErrors('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const tag = e.target.value as Tag;
    if (!tag) return;
    
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      if (newTags.length <= 3) {
        setSelectedTags(newTags);
        setValue('tags', newTags);
      }
    }
    e.target.value = '';
  };

  const removeTag = (tagToRemove: Tag): void => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newTags);
    setValue('tags', newTags);
  };

  const onSubmit = async (data: Memory): Promise<void> => {
    try {
      const date = new Date(data.timestamp);
      const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      
      const memoryData = {
        ...data,
        timestamp: adjustedDate.toISOString(),
        tags: selectedTags,
      };

      const url = mode === 'create' 
        ? `${API_URL}/memories`
        : `${API_URL}/memories/${memory?.id}`;
      
      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memoryData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${mode} memory`);
      }

      onSave();
      onClose();
    } catch (err) {
      setError('root', {
        type: 'manual',
        message: err instanceof Error ? err.message : 'An unknown error occurred'
      });
    }
  };

  const modalTitle = mode === 'create' ? 'Create New Memory' : 'Edit Memory';
  const subTitle = mode === 'create' 
    ? 'Add a new memory to your collection' 
    : 'Update your existing memory';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={modalTitle}
      subTitle={subTitle}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <fieldset className="fieldset w-full">          
          <div className="space-y-4 w-full">
            <label className="fieldset-label flex flex-col items-start w-full gap-1">
              Name
              <input
                type="text"
                className="input w-full text-base-content"
                placeholder="Enter memory name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-error text-sm">{errors.name.message}</p>
              )}
            </label>

            <label className="fieldset-label flex flex-col items-start w-full gap-1">
              Description
              <textarea
                className="textarea h-24 resize-none w-full text-base-content"
                placeholder="Enter memory description"
                maxLength={700}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-error text-sm">{errors.description.message}</p>
              )}
            </label>

            <label className="fieldset-label flex flex-col items-start w-full gap-1">
              Date
              <input
                type="date"
                className="input w-full text-base-content"
                {...register('timestamp')}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.timestamp && (
                <p className="text-error text-sm">{errors.timestamp.message}</p>
              )}
            </label>

            <label className="fieldset-label flex flex-col items-start w-full gap-1">
              Image
              {!imagePreview && showFileInput && (
                <div className="w-full">
                  <input
                    type="file"
                    className="file-input w-full text-base-content"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {errors.image && (
                    <p className="text-error text-sm mt-1">{errors.image.message}</p>
                  )}
                </div>
              )}
              {imagePreview && (
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setImagePreview(null);
                      setValue('image', '');
                      setShowFileInput(true);
                    }}
                    className="btn btn-circle btn-ghost btn-sm absolute -top-2 -right-2 z-10 bg-base-200"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                  <div className="avatar">
                    <div className="w-24 h-24 rounded-full relative">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </label>

            <div className="fieldset-label flex flex-col items-start w-full gap-1">
              <div className="flex items-center gap-2">
                <span>Tags</span>
                <span className="text-sm opacity-70">(up to 3)</span>
              </div>
              <div className="space-y-2 w-full">
                <select
                  className="select select-bordered w-full"
                  defaultValue=""
                  onChange={handleTagChange}
                  disabled={selectedTags.length >= 3}
                >
                  <option disabled value="">Select a tag</option>
                  {AVAILABLE_TAGS
                    .filter(tag => !selectedTags.includes(tag))
                    .map((tag) => (
                      <option key={tag} value={tag}>
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </option>
                    ))}
                </select>
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTags.map((tag) => (
                      <div 
                        key={tag}
                        className="badge badge-soft badge-primary gap-1 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        <span className="capitalize">{tag}</span>
                        <XMarkIcon className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                )}
                {errors.tags && (
                  <p className="text-error text-sm">{errors.tags.message}</p>
                )}
              </div>
            </div>
          </div>
        </fieldset>

        {errors.root && (
          <div className="alert alert-error">
            <span>{errors.root.message}</span>
          </div>
        )}
        
        <div className="modal-action">
          <button 
            type="button" 
            className="btn" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              mode === 'create' ? 'Create' : 'Save'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
} 