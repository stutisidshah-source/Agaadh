

export const Skeleton = () => {
  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Title Skeleton */}
      <div className="w-64 h-12 bg-cyan-950/30 rounded-lg animate-pulse mb-2 border border-cyan-400/10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
        {/* Left Panel Skeleton */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="w-full bg-cyan-950/20 rounded-2xl animate-pulse border border-cyan-400/10 min-h-[520px]" />
        </div>
        
        {/* Right Panel Skeleton */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="w-full bg-cyan-950/20 rounded-2xl animate-pulse border border-cyan-400/10 min-h-[520px]" />
        </div>
      </div>
    </div>
  );
};
