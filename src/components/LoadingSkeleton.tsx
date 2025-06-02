import { useEffect, useState } from "react";

const LoadingSkeleton = () => {
  const [counts, setCounts] = useState({
    usernames: 0,
    names: 0,
    locations: 0,
    firstSeen: 0,
    lastSeen: 0,
  });

  const [targetCounts, setTargetCounts] = useState({
    usernames: Math.floor(Math.random() * 3) + 100,
    names: Math.floor(Math.random() * 5) + 100,
    locations: Math.floor(Math.random() * 2) + 456,
    firstSeen: Math.floor(Math.random() * 10) + 200,
    lastSeen: Math.floor(Math.random() * 5) + 585,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) => ({
        usernames: incrementCount(prev.usernames, targetCounts.usernames),
        names: incrementCount(prev.names, targetCounts.names),
        locations: incrementCount(prev.locations, targetCounts.locations),
        firstSeen: incrementCount(prev.firstSeen, targetCounts.firstSeen),
        lastSeen: incrementCount(prev.lastSeen, targetCounts.lastSeen),
      }));
    }, 100); // Adjust the interval for faster/slower counting

    return () => clearInterval(interval);
  }, [targetCounts]);

  const incrementCount = (current, target) => {
    if (current < target) {
      return current + 1;
    }
    return current;
  };

  return (
    <div className="w-full space-y-6 p-4  h-full">
      <div className="w-full h-24 bg-[#131315] rounded-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/30 to-transparent animate-shimmer"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SkeletonCard title="Username" count={counts.usernames} />
        <SkeletonCard title="Names" count={counts.names} />
        <SkeletonCard title="Location" count={counts.locations} />
        <SkeletonCard title="First seen" count={counts.firstSeen} />
        <SkeletonCard title="Last seen" count={counts.lastSeen} />
      </div>

      <div className="w-full h-64 bg-[#131315] rounded-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/30 to-transparent animate-shimmer"></div>
      </div>
    </div>
  );
};

const SkeletonCard = ({ title, count }) => (
  <div className="p-4 bg-[#131315] rounded-md relative overflow-hidden">
    <p className="text-gray-400">
      {title} (<span className="text-white">{count}</span>)
    </p>
    <div className="h-6 bg-gray-700/30 rounded-lg mt-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/30 to-transparent animate-shimmer"></div>
    </div>
  </div>
);

export default LoadingSkeleton;