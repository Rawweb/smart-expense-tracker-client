const Card = ({ children, title, action, className = '' }) => {
  return (
    <div className={`rounded-xl border border-line bg-card p-5 ${className}`}>
      {title && (
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-[15px] font-bold'>{title}</h2>
          {/* Optional. A "See all" link or a small button. */}
          {action}
        </div>
      )}

      {children}
    </div>
  );
};

export default Card;
