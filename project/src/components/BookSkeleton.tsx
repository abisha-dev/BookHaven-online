export function BookCardSkeleton() {
  return (
    <div className="bg-navy-800 border border-navy-600 rounded-xl overflow-hidden h-full">
      <div className="skeleton h-56 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-3 w-3/5 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="flex justify-between items-center pt-3 border-t border-navy-700">
          <div className="skeleton h-5 w-16 rounded" />
          <div className="skeleton h-7 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

export function BookGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BookDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="skeleton h-96 w-full rounded-xl" />
        <div className="md:col-span-2 space-y-4">
          <div className="skeleton h-8 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
          <div className="skeleton h-24 w-full rounded" />
          <div className="skeleton h-20 w-full rounded" />
          <div className="skeleton h-12 w-48 rounded" />
        </div>
      </div>
    </div>
  );
}
