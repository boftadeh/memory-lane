import { Memory } from '@/schemas/memory';
import Image from 'next/image';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

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
          <div className="flex flex-col flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="card-title">{memory.name}</h2>
                <p className="text-sm opacity-70">{formattedDate}</p>
              </div>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                  <EllipsisVerticalIcon className="h-6 w-6" />
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
                  <li>
                    <button onClick={() => onEdit(memory)}>Edit</button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onDelete(memory)}
                      className="text-error"
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <p className="mt-2">{memory.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 