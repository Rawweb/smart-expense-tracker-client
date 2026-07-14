// The building block. Every skeleton below is made of these.
const Skeleton = ({ className = '' }) => {
  return <div className={`animate-pulse rounded-md bg-line ${className}`} />;
};

export default Skeleton;
