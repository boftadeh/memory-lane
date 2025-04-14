import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

import { Memory } from '@/schemas/memory';
import { Tag } from '@/types/tags';
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

  const tags = memory.tags as Tag[] || [];

  return (
    <div className="card bg-base-200 shadow-xl w-full min-h-[150px] max-w-2xl relative">
      {tags.length > 0 && (
        <div className="absolute -top-3 -right-2 flex gap-2 flex-wrap justify-end">
          {tags.map((tag) => (
            <div
              key={tag}
              className="badge badge-soft badge-primary"
            >
              <span className="capitalize">{tag}</span>
            </div>
          ))}
        </div>
      )}
      <div className="card-body">
        <div className="flex items-start gap-4">
          <div className="avatar flex-shrink-0">
            <div className="w-24 h-24 rounded-full relative">
              <Image
                src={memory.image}
                alt={memory.name}
                fill
                className="object-cover rounded-full"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <h2 className="card-title truncate">{memory.name}</h2>
                <p className="text-sm opacity-70">{formattedDate}</p>
              </div>

            </div>
            <p className="mt-2 line-clamp-6 break-words">{memory.description}</p>
          </div>
          <Dropdown
            actionIcon={<EllipsisVerticalIcon className="h-6 w-6" />}
            options={dropdownOptions}
          />
        </div>
      </div>
    </div>
  );
} 