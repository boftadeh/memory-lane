import { Memory } from '@/schemas/memory';

type MemoryCardProps = {
  memory: Memory;
  onEdit: (memory: Memory) => void;
  onDelete: (id: number) => void;
};

export default function MemoryCard({ memory, onEdit, onDelete }: MemoryCardProps) {
  const formattedDate = new Date(memory.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{memory.name}</h2>
        <p className="text-sm opacity-70">{formattedDate}</p>
        <p>{memory.description}</p>
        <div className="card-actions justify-end mt-4">
          <button 
            className="btn btn-sm" 
            onClick={() => onEdit(memory)}
          >
            Edit
          </button>
          <button 
            className="btn btn-sm btn-error" 
            onClick={() => memory.id && onDelete(memory.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 