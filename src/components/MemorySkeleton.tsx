export default function MemorySkeleton() {
  return (
    <div className="card bg-base-200 shadow-xl w-full max-w-2xl animate-pulse">
      <div className="card-body">
        <div className="flex items-start gap-4">
          <div className="avatar">
            <div className="w-24 h-24 rounded-full bg-base-300" />
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-8 w-48 bg-base-300 rounded" />
                <div className="h-4 w-32 bg-base-300 rounded" />
              </div>
              <div className="w-8 h-8 bg-base-300 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-base-300 rounded w-full" />
              <div className="h-4 bg-base-300 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 