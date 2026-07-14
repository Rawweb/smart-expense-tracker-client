const Select = ({ label, error, options = [], className = '', ...props }) => {
  return (
    <div className='mb-4'>
      {label && <label className='mb-1.5 block text-xs font-semibold text-muted'>{label}</label>}

      <select
        className={`w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm outline-none transition
          ${error ? 'border-over' : 'border-line focus:border-brand'}
          ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && <p className='mt-1 text-xs text-over'>{error}</p>}
    </div>
  );
};

export default Select;
