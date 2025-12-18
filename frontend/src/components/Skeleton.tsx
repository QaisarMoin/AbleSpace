const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-300 rounded ${className}`} />
);

export default Skeleton;
