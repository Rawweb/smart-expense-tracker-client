const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className='mb-4'>
      {label && <label className='mb-1.5 block text-xs font-semibold text-muted'>{label}</label>}

      <input
        className={`w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm outline-none transition
          ${error ? 'border-over' : 'border-line focus:border-brand'}
          ${className}`}
        {...props}
      />

      {/* Errors sit under the field they belong to, not in a list at the top. */}
      {error && <p className='mt-1 text-xs text-over'>{error}</p>}
    </div>
  );
};

export default Input;
