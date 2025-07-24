// components/SkeletonGrid.jsx
const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-muted rounded-lg aspect-[3/4]"
        />
      ))}
    </div>
  );
};

export default SkeletonGrid;
