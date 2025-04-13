import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Memory, MemorySchema } from '@/schemas/memory';
import Modal from './Modal';

type MemoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  memory?: Memory;
  mode: 'create' | 'edit';
};

export default function MemoryModal({ isOpen, onClose, onSave, memory, mode }: MemoryModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting },
    setError,
    setValue
  } = useForm<Memory>({
    resolver: zodResolver(MemorySchema),
    defaultValues: {
      name: '',
      description: '',
      timestamp: new Date().toISOString().split('T')[0],
      image: '',
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
      });
      setImagePreview(memory.image || null);
    } else {
      reset({
        name: '',
        description: '',
        timestamp: new Date().toISOString().split('T')[0],
        image: '',
      });
      setImagePreview(null);
    }
  }, [memory, isOpen, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setValue('image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: Memory) => {
    try {
      const date = new Date(data.timestamp);
      const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      
      const memoryData = {
        ...data,
        timestamp: adjustedDate.toISOString(),
      };

      const url = mode === 'create' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/memories`
        : `${process.env.NEXT_PUBLIC_API_URL}/memories/${memory?.id}`;
      
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
            <label className="fieldset-label flex flex-col items-start w-full gap-2">
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

            <label className="fieldset-label flex flex-col items-start w-full gap-2">
              Description
              <textarea
                className="textarea h-24 resize-none w-full text-base-content"
                placeholder="Enter memory description"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-error text-sm">{errors.description.message}</p>
              )}
            </label>

            <label className="fieldset-label flex flex-col items-start w-full gap-2">
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

            <label className="fieldset-label flex flex-col items-start w-full gap-2">
              Image
              <input
                type="file"
                className="file-input w-full text-base-content"
                accept="image/*"
                onChange={handleImageChange}
              />
              {errors.image && (
                <p className="text-error text-sm">{errors.image.message}</p>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs rounded-lg shadow-lg"
                  />
                </div>
              )}
            </label>
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