'use client';

import { CubeIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <div className='card bg-base-200 shadow-xl mb-8'>
      <div className='card-body'>
        <div className='flex items-center'>
          <CubeIcon className='h-16 w-16 text-primary' />
          <h1 className='text-4xl font-bold text-base-content mb-4 ml-4 mt-4'>
            Memory Lane
          </h1>
        </div>
      </div>
    </div>
  );
} 