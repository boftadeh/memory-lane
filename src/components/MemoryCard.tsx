import { Memory } from '@/schemas/memory';

type MemoryCardProps = {
  memory: Memory;
  onEdit: (memory: Memory) => void;
  onDelete: (id: number) => void;
};

export default function MemoryCard({ memory, onEdit, onDelete }: MemoryCardProps) {
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h3 className="card-title">{memory.name}</h3>
        <p>{memory.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-70">
            {new Date(memory.timestamp).toLocaleDateString()}
          </span>
          <div className="card-actions">
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => onEdit(memory)}
            >
              Edit
            </button>
            <button 
              className="btn btn-error btn-sm"
              onClick={() => onDelete(memory.id!)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 