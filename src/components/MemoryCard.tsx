import { Memory } from '@/schemas/memory';
import Image from 'next/image';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import Dropdown from './Dropdown';

type MemoryCardProps = {
  memory: Memory;
  onEdit: (memory: Memory) => void;
  onDelete: (memory: Memory) => void;
};

export default function MemoryCard({ memory, onEdit, onDelete }: MemoryCardProps) {
  const formattedDate = new Date(memory.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const dropdownOptions = [
    {
      label: 'Edit',
      onClick: () => onEdit(memory)
    },
    {
      label: 'Delete',
      onClick: () => onDelete(memory),
      className: 'text-error'
    }
  ];

  return (
    <div className="card bg-base-200 shadow-xl w-full max-w-2xl">
      <div className="card-body">
        <div className="flex items-start gap-4">
          <div className="avatar">
            <div className="w-24 h-24 rounded-full relative">
              <Image 
                src={memory.image} 
                alt={memory.name} 
                fill
                className="object-cover rounded-full"
              />
            </div>
          </div>
          <div className="flex flex-col flex-1 overflow-hidden line-clamp-5 max-h-60">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="card-title">{memory.name}</h2>
                <p className="text-sm opacity-70">{formattedDate}</p>
              </div>
              <Dropdown
                actionIcon={<EllipsisVerticalIcon className="h-6 w-6" />}
                options={dropdownOptions}
              />
            </div>
            <p className="mt-2">{memory.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 