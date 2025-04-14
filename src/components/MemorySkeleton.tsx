export default function MemorySkeleton() {
  return (
    <div 
      className="card bg-base-200 shadow-xl w-full min-h-[150px] max-w-2xl animate-pulse"
      role="status"
      aria-label="Loading memory card"
    >
      <div className="card-body">
        <div className="flex items-start gap-4">
          <div className="avatar flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-base-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0 space-y-2">
                <div className="h-8 w-48 bg-base-300 rounded" />
                <div className="h-4 w-32 bg-base-300 rounded" />
              </div>
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-base-300 rounded-full" />
              </div>
            </div>
            <div className="space-y-2 mt-2">
              <div className="h-4 bg-base-300 rounded w-full" />
              <div className="h-4 bg-base-300 rounded w-3/4" />
              <div className="h-4 bg-base-300 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">Loading memory card...</span>
    </div>
  );
} 