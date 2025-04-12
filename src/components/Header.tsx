 'use client';

import { useState } from 'react';
import { CubeIcon } from '@heroicons/react/24/outline';
import MemoryModal from './MemoryModal';
import { refreshMemories } from '@/app/actions';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMemorySaved = async () => {
    await refreshMemories();
    setIsModalOpen(false);
  };

  return (
    <div className='card bg-base-200 shadow-xl mb-8'>
      <div className='card-body'>
        <div className='flex items-center'>
          <CubeIcon className='h-16 w-16 text-primary' />
          <h1 className='text-4xl font-bold text-base-content mb-4 ml-4 mt-4'>
            Memory Lane
          </h1>
        </div>
        <div className="card-actions justify-end mt-4">
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Create Memory
          </button>
        </div>
      </div>

      <MemoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleMemorySaved}
        mode="create"
      />
    </div>
  );
} 